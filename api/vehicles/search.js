import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl || '', supabaseKey || '');

let vehiclesCatalog = null;

async function getVehiclesCatalog() {
  if (vehiclesCatalog) return vehiclesCatalog;
  try {
    const res = await fetch('https://cdn.jsdelivr.net/gh/vehiclesdb/vehiclesdb@latest/dist/vehicles.json');
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    vehiclesCatalog = data;
    return vehiclesCatalog;
  } catch (error) {
    console.error('Failed to load VehiclesDB catalog:', error);
    return null;
  }
}

export default async function handler(req, res) {
  // CORS setup for Vercel Serverless Functions
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

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
}
