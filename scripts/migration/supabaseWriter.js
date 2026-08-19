import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY } from './config.js';
import { logDuplicateDetected } from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let supabase = null;

function getSupabaseClient() {
  if (!supabase) {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      throw new Error('Supabase client credentials are not configured.');
    }
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  }
  return supabase;
}

/**
 * Backs up all existing records from the target Supabase cars table.
 * Saves the JSON dump to scripts/migration/backups/supabase_cars_backup_<timestamp>.json.
 */
export async function backupSupabaseCarsTable() {
  try {
    const sb = getSupabaseClient();
    console.log('📦 Supabase: Fetching existing public.cars data for backup...');
    
    const { data, error } = await sb
      .from('cars')
      .select('*');
      
    if (error) throw error;
    
    if (!data || data.length === 0) {
      console.log('ℹ️ Supabase: target public.cars table is currently empty. No backup needed.');
      return;
    }
    
    const backupDir = path.resolve(__dirname, './backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `supabase_cars_backup_${timestamp}.json`);
    fs.writeFileSync(backupPath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`✅ Backup successfully created at: ${backupPath}`);
  } catch (err) {
    console.error('⚠️ [Backup] Failed to back up existing public.cars table:', err.message);
  }
}


/**
 * Checks if a vehicle with the given ID already exists in Supabase.
 */
export async function checkExistingCar(carId) {
  try {
    const sb = getSupabaseClient();
    const { data, error } = await sb
      .from('cars')
      .select('id, name')
      .eq('id', carId)
      .maybeSingle();
      
    if (error) throw error;
    return data;
  } catch (err) {
    console.error(`⚠️ [Supabase] Error checking for existing car ${carId}:`, err.message);
    return null;
  }
}

/**
 * Fetches a map of all currently migrated cars in Supabase.
 */
export async function fetchExistingCarsMap() {
  try {
    const sb = getSupabaseClient();
    const { data, error } = await sb
      .from('cars')
      .select('id, name, images');
      
    if (error) throw error;
    
    const map = {};
    if (data) {
      data.forEach(car => {
        map[car.id] = car;
      });
    }
    return map;
  } catch (err) {
    console.error('⚠️ [Supabase] Failed to fetch existing cars map:', err.message);
    return {};
  }
}

/**
 * Tries to match the brand and model of a car with a record in public.vehicles.
 * If a match is found, returns the full vehicle catalogue record.
 */
export async function matchVehicleCatalogue(brand, name) {
  if (!brand || !name) return null;
  
  try {
    const sb = getSupabaseClient();
    
    // Fetch all vehicles for the given brand (make) with all spec fields
    const { data: vehicles, error } = await sb
      .from('vehicles')
      .select('id, make, model, body_type, engine, horsepower, torque, transmission, acceleration, top_speed')
      .ilike('make', brand.trim());
      
    if (error) throw error;
    if (!vehicles || vehicles.length === 0) return null;
    
    const lowerName = name.toLowerCase();
    
    // Sort vehicles by model length descending to match more specific models first
    const sortedVehicles = [...vehicles].sort((a, b) => b.model.length - a.model.length);
    
    for (const vehicle of sortedVehicles) {
      const lowerModel = vehicle.model.toLowerCase();
      // Ensure safe matching (model name exists in the full title)
      if (lowerName.includes(lowerModel)) {
        return vehicle;
      }
    }
    
    // Fallback brand level match
    const genericMatch = vehicles.find(v => v.model.toLowerCase() === 'generic' || v.model.toLowerCase() === brand.toLowerCase());
    return genericMatch || null;
  } catch (err) {
    console.error(`⚠️ [Supabase] Error matching vehicle catalog:`, err.message);
    return null;
  }
}

/**
 * Upserts a car record to Supabase.
 */
export async function upsertCarToSupabase(carRow, isDryRun = true) {
  // Check for duplicates/updates
  const existing = await checkExistingCar(carRow.id);
  if (existing) {
    logDuplicateDetected(carRow.id, existing.name);
  }

  // Attempt to link vehicle catalog reference and copy detailed specifications
  const matchedVehicle = await matchVehicleCatalogue(carRow.brand, carRow.name);
  if (matchedVehicle) {
    carRow.vehicle_id = matchedVehicle.id;
    
    // Populate technical specifications from catalogue only if currently empty/null
    if (matchedVehicle.body_type && (!carRow.body_type || carRow.body_type.startsWith('vehica_') || carRow.body_type.includes('Series') || carRow.body_type.includes('Class'))) {
      carRow.body_type = matchedVehicle.body_type;
    }
    if (matchedVehicle.engine && !carRow.engine) {
      carRow.engine = matchedVehicle.engine;
    }
    if (matchedVehicle.horsepower && !carRow.horsepower) {
      carRow.horsepower = matchedVehicle.horsepower;
      carRow.hp_raw = parseInt(matchedVehicle.horsepower.replace(/[^0-9]/g, ''), 10) || 0;
    }
    if (matchedVehicle.torque && !carRow.torque) {
      carRow.torque = matchedVehicle.torque;
    }
    if (matchedVehicle.transmission && !carRow.transmission) {
      carRow.transmission = matchedVehicle.transmission;
    }
    if (matchedVehicle.acceleration && !carRow.zero_to_hundred) {
      carRow.zero_to_hundred = matchedVehicle.acceleration;
      carRow.zero_to_hundred_raw = parseFloat(matchedVehicle.acceleration.replace(/[^0-9.]/g, '')) || 0;
    }
    if (matchedVehicle.top_speed && !carRow.top_speed) {
      carRow.top_speed = matchedVehicle.top_speed;
    }
  } else {
    // If not matched, clean the body_type if it is still a custom model term from WordPress
    if (carRow.body_type && (carRow.body_type.startsWith('vehica_') || carRow.body_type.includes('Series') || carRow.body_type.includes('Class') || carRow.body_type.includes('Hycross') || carRow.body_type.includes('Crysta') || carRow.body_type.includes('Taigun') || carRow.body_type.includes('Cooper') || carRow.body_type.includes('Discovery') || carRow.body_type.includes('XC40') || carRow.body_type.includes('EcoSport') || carRow.body_type.includes('Accord') || carRow.body_type.includes('CRV') || carRow.body_type.includes('S60') || carRow.body_type.includes('T-Roc') || carRow.body_type.includes('Octavia') || carRow.body_type.includes('Camry'))) {
      // Set to generic body type like Sedan / SUV depending on name or leave null
      const lowerName = carRow.name.toLowerCase();
      if (lowerName.includes('sport') || lowerName.includes('crysta') || lowerName.includes('discovery') || lowerName.includes('hycross') || lowerName.includes('xc40') || lowerName.includes('crv') || lowerName.includes('t-roc') || lowerName.includes('defender') || lowerName.includes('huracan')) {
        carRow.body_type = lowerName.includes('huracan') ? 'Coupe' : 'SUV';
      } else {
        carRow.body_type = 'Sedan';
      }
    }
  }

  if (isDryRun) {
    return { success: true, isUpdate: !!existing, vehicle_id: carRow.vehicle_id };
  }

  try {
    const sb = getSupabaseClient();
    
    // Clean up internal properties before database write
    const cleanRow = { ...carRow };
    delete cleanRow._source_gallery_urls;
    delete cleanRow._source_three_sixty_urls;
    delete cleanRow._wordpress_meta;
    delete cleanRow._wordpress_terms;
    delete cleanRow._gallery_attachment_ids;
    delete cleanRow._three_sixty_attachment_ids;

    const { error } = await sb
      .from('cars')
      .upsert(cleanRow, { onConflict: 'id' });

    if (error) throw error;
    
    return { success: true, isUpdate: !!existing, vehicle_id: carRow.vehicle_id };
  } catch (err) {
    console.error(`❌ [Supabase] Failed to upsert car ${carRow.id}:`, err.message);
    throw err;
  }
}
