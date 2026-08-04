import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import ImageKit from 'imagekit';
import { CARS_DATA } from '../src/data/cars.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local manually since dotenv doesn't auto-load .local by default
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// 1. Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.VITE_IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.VITE_IMAGEKIT_URL_ENDPOINT
});

// 2. Initialize Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
// Use service role key if available, otherwise fallback to anon key
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Utility to upload a remote URL to ImageKit
async function uploadToImageKit(remoteUrl, fileName, folder = '/autopavillion/cars') {
  try {
    // Fetch the image as a buffer first to avoid ImageKit being blocked by Unsplash
    const response = await fetch(remoteUrl);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const res = await imagekit.upload({
      file: buffer,
      fileName: fileName,
      folder: folder,
    });
    // Return just the relative path since our ikUrl utility appends it to the base endpoint
    return res.filePath;
  } catch (error) {
    console.error(`❌ Failed to upload ${remoteUrl} to ImageKit:`, error.message);
    throw error;
  }
}

// Convert camelCase frontend schema to snake_case DB schema
function mapCarToDb(car) {
  return {
    id: car.id,
    name: car.name,
    subtitle: car.subtitle || null,
    brand: car.brand,
    brand_logo: car.brandLogo || null,
    year: car.year || new Date().getFullYear(),
    price: car.price,
    price_raw: car.priceRaw || 0,
    body_type: car.bodyType || 'Coupe',
    fuel_type: car.fuelType || 'Petrol',
    engine: car.engine || null,
    horsepower: car.horsepower || null,
    hp_raw: car.hpRaw || 0,
    torque: car.torque || null,
    zero_to_hundred: car.zeroToHundred || null,
    zero_to_hundred_raw: car.zeroToHundredRaw || 0,
    top_speed: car.topSpeed || null,
    transmission: car.transmission || null,
    mileage_kms: car.mileageKms || null,
    color: car.color || null,
    interior_color: car.interiorColor || null,
    owners: car.owners || 1,
    location: car.location || null,
    verified: car.verified ?? true,
    inspection_certificate: car.inspectionCertificate || null,
    inspection_score: car.inspectionScore || null,
    sound_type: car.soundType || null,
    sound_freq: car.soundFreq || null,
    sound_name: car.soundName || null,
    featured: car.featured ?? false,
    images: car.images || [],
    three_sixty_frames: car.threeSixtyFrames || [],
    features: car.features || [],
    status: car.status || 'active',
  };
}

async function seed() {
  console.log('🌱 Starting Auto Pavilion Seeding Script...');
  
  if (!process.env.IMAGEKIT_PRIVATE_KEY) {
    console.error('❌ Missing IMAGEKIT_PRIVATE_KEY in .env.local');
    process.exit(1);
  }

  if (supabaseKey === process.env.VITE_SUPABASE_ANON_KEY) {
    console.warn('⚠️ WARNING: You are using the Supabase ANON KEY.');
    console.warn('⚠️ If RLS is enabled on the `cars` table, insertion will fail.');
    console.warn('⚠️ Please temporarily disable RLS on `cars` or provide a SERVICE_ROLE_KEY.');
    console.warn('');
  }  
  for (const car of CARS_DATA) {
    console.log(`\n🚗 Processing: ${car.name}...`);
    
    try {
      const newImages = [];
      const newFrames = [];

      // Upload Gallery Images
      console.log(`   📸 Uploading ${car.images.length} gallery images...`);
      for (let i = 0; i < car.images.length; i++) {
        const url = car.images[i];
        const ext = url.includes('unsplash') ? 'jpg' : url.split('.').pop().split('?')[0] || 'jpg';
        const fileName = `${car.id}-gallery-${i + 1}.${ext}`;
        const ikPath = await uploadToImageKit(url, fileName);
        newImages.push(ikPath);
      }

      // Upload 360 Frames
      if (car.threeSixtyFrames && car.threeSixtyFrames.length > 0) {
        console.log(`   🔄 Uploading ${car.threeSixtyFrames.length} 360° frames...`);
        for (let i = 0; i < car.threeSixtyFrames.length; i++) {
          const url = car.threeSixtyFrames[i];
          const ext = url.includes('unsplash') ? 'jpg' : url.split('.').pop().split('?')[0] || 'jpg';
          const fileName = `${car.id}-360-${i + 1}.${ext}`;
          const ikPath = await uploadToImageKit(url, fileName);
          newFrames.push(ikPath);
        }
      }

      // Prepare DB Row
      const dbRow = mapCarToDb({
        ...car,
        images: newImages,
        threeSixtyFrames: newFrames
      });

      // Insert to Supabase
      console.log(`   💾 Inserting into Supabase...`);
      const { error } = await supabase.from('cars').upsert(dbRow, { onConflict: 'id' });
      
      if (error) {
        throw error;
      }

      console.log(`   ✅ Success!`);

    } catch (err) {
      console.error(`   ❌ Failed to process ${car.name}:`, err);
    }
  }
  
  console.log('\n🎉 Seeding complete!');
}

seed();
