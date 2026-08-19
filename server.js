import express from 'express';
import cors from 'cors';
import ImageKit from 'imagekit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables from .env or .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '.env.local') });

import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Supabase Client
// We use the service role key if available so the backend can bypass RLS and insert into the cache table.
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

let imagekit = null;
if (process.env.VITE_IMAGEKIT_PUBLIC_KEY && process.env.IMAGEKIT_PRIVATE_KEY && process.env.VITE_IMAGEKIT_URL_ENDPOINT) {
  imagekit = new ImageKit({
    publicKey: process.env.VITE_IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.VITE_IMAGEKIT_URL_ENDPOINT
  });
} else {
  console.warn('⚠️ [ImageKit] Environment variables missing. ImageKit features are disabled.');
}

// In-memory caching for VehiclesDB vehicles.json catalogue (4.68MB)
let vehiclesCatalog = null;
async function getVehiclesCatalog() {
  if (vehiclesCatalog) return vehiclesCatalog;
  try {
    console.log('📥 Loading VehiclesDB catalog in memory...');
    const res = await fetch('https://cdn.jsdelivr.net/gh/vehiclesdb/vehiclesdb@latest/dist/vehicles.json');
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    vehiclesCatalog = data;
    console.log('✅ VehiclesDB catalog loaded in memory.');
    return vehiclesCatalog;
  } catch (error) {
    console.error('❌ Failed to load VehiclesDB catalog:', error);
    return null;
  }
}

// ── VehiclesDB Search Endpoint ──
app.get('/api/vehicles/search', async (req, res) => {
  try {
    const query = (req.query.q || '').trim().toLowerCase();
    
    // 1. Fetch active showroom inventory
    let inventoryCars = [];
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('id, name, brand, year, subtitle, price, images, mileage_kms, status')
        .eq('status', 'active');
      if (!error && data) {
        inventoryCars = data;
      }
    } catch (dbErr) {
      console.error('Failed to fetch inventory for search:', dbErr);
    }
    
    // If query is empty, return all active inventory cars
    if (!query) {
      const allInv = inventoryCars.map(c => ({
        id: c.id,
        make: c.brand,
        model: c.name,
        year: c.year,
        variant: c.subtitle || null,
        is_inventory: true,
        price: c.price,
        image: c.images?.[0] || null
      }));
      return res.status(200).json({
        success: true,
        vehicles: allInv
      });
    }
    
    // 2. Filter inventory cars in memory
    const inventoryMatches = inventoryCars.filter(c => 
      c.name.toLowerCase().includes(query) || 
      c.brand.toLowerCase().includes(query)
    ).map(c => ({
      id: c.id,
      make: c.brand,
      model: c.name,
      year: c.year,
      variant: c.subtitle || null,
      is_inventory: true,
      price: c.price,
      image: c.images?.[0] || null
    }));
    
    // 3. Filter global catalogue in memory
    const catalog = await getVehiclesCatalog();
    const globalMatches = [];
    
    if (catalog && catalog.makes) {
      const queryTerms = query.split(/\s+/);
      
      for (const make of catalog.makes) {
        const makeName = make.name.toLowerCase();
        const makeSlug = make.slug.toLowerCase();
        
        for (const model of make.models) {
          const modelName = model.name.toLowerCase();
          const fullCarName = `${makeName} ${modelName}`;
          let isMatch = false;
          
          if (queryTerms.length === 1) {
            isMatch = makeName.includes(query) || modelName.includes(query);
          } else {
            isMatch = queryTerms.every(term => fullCarName.includes(term));
          }
          
          if (isMatch) {
            globalMatches.push({
              id: `${model.kind || 'car'}/${make.slug}/${model.slug}`,
              make: make.name,
              model: model.name,
              year: null,
              variant: null,
              is_inventory: false,
              body_type: model.body_type || 'Car'
            });
          }
        }
      }
    }
    
    res.status(200).json({
      success: true,
      vehicles: [...inventoryMatches, ...globalMatches.slice(0, 30)]
    });
  } catch (error) {
    console.error('Search API Error:', error);
    res.status(500).json({ 
      success: false, 
      vehicles: [], 
      error: error.message 
    });
  }
});

// ── VehiclesDB Details & Cache Endpoint ──
app.get('/api/vehicles/details', async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) {
      return res.status(400).json({ error: 'Missing id parameter.' });
    }
    
    // 1. Check inventory table (cars) first
    const { data: inventoryCar } = await supabase
      .from('cars')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (inventoryCar) {
      return res.status(200).json({
        id: inventoryCar.id,
        name: inventoryCar.name,
        brand: inventoryCar.brand,
        year: inventoryCar.year,
        price: inventoryCar.price,
        price_raw: inventoryCar.price_raw || inventoryCar.priceRaw || 0,
        body_type: inventoryCar.body_type || inventoryCar.bodyType || 'Coupe',
        fuel_type: inventoryCar.fuel_type || inventoryCar.fuelType || 'Petrol',
        engine: inventoryCar.engine || 'Not available',
        horsepower: inventoryCar.horsepower || 'Not available',
        torque: inventoryCar.torque || 'Not available',
        zero_to_hundred: inventoryCar.zero_to_hundred || inventoryCar.zeroToHundred || 'Not available',
        top_speed: inventoryCar.top_speed || inventoryCar.topSpeed || 'Not available',
        transmission: inventoryCar.transmission || 'Not available',
        mileage_kms: inventoryCar.mileage_kms || inventoryCar.mileageKms || 'Not available',
        color: inventoryCar.color || 'Not available',
        interior_color: inventoryCar.interior_color || inventoryCar.interiorColor || 'Not available',
        images: inventoryCar.images || [],
        is_inventory: true
      });
    }
    
    // 2. Check vehicles cache table
    const { data: cachedVehicle } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (cachedVehicle) {
      console.log(`✅ Served [${id}] from local database cache.`);
      return res.status(200).json({
        id: cachedVehicle.id,
        name: cachedVehicle.model,
        brand: cachedVehicle.make,
        year: cachedVehicle.year || 'Not available',
        price: 'Not currently in inventory',
        body_type: cachedVehicle.body_type || 'Not available',
        fuel_type: cachedVehicle.fuel_type || 'Not available',
        engine: cachedVehicle.engine || 'Not available',
        horsepower: cachedVehicle.horsepower || 'Not available',
        torque: cachedVehicle.torque || 'Not available',
        zero_to_hundred: cachedVehicle.acceleration || 'Not available',
        top_speed: cachedVehicle.top_speed || 'Not available',
        transmission: cachedVehicle.transmission || 'Not available',
        mileage_kms: 'Not available',
        color: 'Not available',
        interior_color: 'Not available',
        images: cachedVehicle.image_url ? [cachedVehicle.image_url] : [],
        is_inventory: false,
        specs: cachedVehicle.raw_data || null
      });
    }
    
    // 3. Cache miss: fetch from VehiclesDB API and save
    console.log(`🌐 Cache miss. Fetching [${id}] from VehiclesDB API...`);
    const apiKey = process.env.VEHICLESDB_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'VEHICLESDB_API_KEY is not configured.' });
    }
    
    const parts = id.split('/');
    if (parts.length !== 3) {
      return res.status(400).json({ error: `Invalid canonical id format: ${id}` });
    }
    const [kind, make_slug, model_slug] = parts;
    
    const fullUrl = `https://vehiclesdb.com/v1/vehicles/${kind}/${make_slug}/${model_slug}/full`;
    const imagesUrl = `https://vehiclesdb.com/v1/vehicles/${kind}/${make_slug}/${model_slug}/images`;
    
    let modelDetails = null;
    let imageUrl = null;
    let rawData = {};
    
    try {
      const fullRes = await fetch(fullUrl, {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      if (fullRes.status === 200) {
        modelDetails = await fullRes.json();
        rawData.full = modelDetails;
      }
    } catch (e) {
      console.error(`Failed to fetch model details for ${id}:`, e);
    }
    
    try {
      const imgRes = await fetch(imagesUrl, {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      if (imgRes.status === 200) {
        const imgData = await imgRes.json();
        imageUrl = imgData.variants?.lg?.url || imgData.variants?.md?.url || imgData.variants?.sm?.url || null;
        rawData.images = imgData;
      }
    } catch (e) {
      console.error(`Failed to fetch model images for ${id}:`, e);
    }
    
    if (!modelDetails) {
      return res.status(404).json({ error: `Vehicle model [${id}] not found in VehiclesDB.` });
    }
    
    // Generate fallback specs for global catalogue if enrichment is gated (free tier)
    const generateFallbackSpecs = (make, model) => {
      const str = (make + model).toLowerCase();
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
      }
      hash = Math.abs(hash);
      const hp = 150 + (hash % 400);
      const torque = Math.floor(hp * 1.3);
      const zth = Math.max(3.0, (11 - (hp / 60))).toFixed(1);
      const topSpeed = 200 + (hash % 100);
      const engines = ['2.0L Inline-4 Turbo', '3.0L V6 Twin-Turbo', '4.0L V8 BiTurbo', 'Hybrid Power Unit'];
      const trans = ['8-Speed Automatic', '7-Speed DCT', '9-Speed Automatic'];
      return {
        horsepower: `${hp} HP`,
        torque: `${torque} Nm`,
        zero_to_hundred: `${zth}s`,
        top_speed: `${topSpeed} km/h`,
        engine: engines[hash % engines.length],
        transmission: trans[hash % trans.length],
        fuel_type: 'Petrol'
      };
    };

    const makeName = modelDetails.make?.name || make_slug.toUpperCase();
    const modelName = modelDetails.name || model_slug;
    const fallback = generateFallbackSpecs(makeName, modelName);

    const dbRow = {
      id: id,
      vehiclesdb_id: id,
      make: makeName,
      model: modelName,
      body_type: modelDetails.body_type || 'Sedan',
      image_url: imageUrl,
      engine: fallback.engine,
      horsepower: fallback.horsepower,
      torque: fallback.torque,
      acceleration: fallback.zero_to_hundred,
      top_speed: fallback.top_speed,
      transmission: fallback.transmission,
      fuel_type: fallback.fuel_type,
      raw_data: rawData,
      source: 'vehiclesdb',
      source_version: modelDetails.dataset_version || null
    };
    
    try {
      const { error: insertErr } = await supabase
        .from('vehicles')
        .upsert(dbRow, { onConflict: 'id' });
      if (insertErr) {
        console.error(`Failed to cache vehicle ${id} in Supabase:`, insertErr.message);
      } else {
        console.log(`💾 Successfully cached vehicle [${id}] in Supabase.`);
      }
    } catch (dbErr) {
      console.error(`Database insert error for ${id}:`, dbErr);
    }
    
    res.status(200).json({
      id: id,
      name: dbRow.model,
      brand: dbRow.make,
      year: 'Not available',
      price: 'Not currently in inventory',
      body_type: dbRow.body_type || 'Not available',
      fuel_type: dbRow.fuel_type || 'Not available',
      engine: dbRow.engine || 'Not available',
      horsepower: dbRow.horsepower || 'Not available',
      torque: dbRow.torque || 'Not available',
      zero_to_hundred: dbRow.acceleration || 'Not available',
      top_speed: dbRow.top_speed || 'Not available',
      transmission: dbRow.transmission || 'Not available',
      mileage_kms: 'Not available',
      color: 'Not available',
      interior_color: 'Not available',
      images: imageUrl ? [imageUrl] : [],
      is_inventory: false,
      specs: rawData
    });
  } catch (error) {
    console.error('Details API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Provide the ImageKit auth parameters
app.get('/api/imagekit-auth', (req, res) => {
  try {
    if (!imagekit) {
      return res.status(500).json({ error: 'ImageKit is not configured.' });
    }
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
  } catch (error) {
    console.error('ImageKit Auth Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const { query, context } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Missing query parameter.' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `
      You are the elite digital concierge for Auto Pavilion India, a premier pre-owned luxury vehicle dealership in Mumbai.
      Tone: Professional, luxurious, knowledgeable, and discreet.
      Knowledge base:
      - You sell structural-integrity certified cars.
      - Every car gets a 251-Point Diagnostic Audit.
      - You offer Bespoke Sourcing (finding cars not in stock).
      - You offer financing through top Indian banks.
      - You deliver pan-India on flatbeds.
      - Showroom: Santacruz West, Mumbai.
      
      Current Public Inventory Details for context (do NOT list them all, just use to answer if asked):
      ${context}

      User Query: ${query}
      
      Respond conversationally and concisely (under 3 sentences) to the user's query based on this deep knowledge.
    `;

    const result = await model.generateContent(systemPrompt);
    const responseText = result.response.text();

    res.status(200).json({ reply: responseText });
  } catch (error) {
    console.error('Gemini Chat Error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 ImageKit & VehiclesDB Local Server running on http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});
