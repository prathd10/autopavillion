import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env or .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
// Use service role key for write permissions (bypassing RLS or using admin privileges)
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY must be set in your environment or .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function removeFreeDelivery() {
  console.log('🤖 Starting database cleanup for "free delivery" mentions...');

  try {
    // 1. Fetch all cars
    const { data: cars, error: fetchError } = await supabase
      .from('cars')
      .select('id, name, features');

    if (fetchError) throw fetchError;

    if (!cars || cars.length === 0) {
      console.log('ℹ️ No cars found in the database.');
      return;
    }

    console.log(`🔍 Found ${cars.length} cars in database. Checking features...`);

    let updatedCount = 0;

    for (const car of cars) {
      if (!car.features || !Array.isArray(car.features)) continue;

      let hasChanges = false;
      const updatedFeatures = car.features.map(feature => {
        // Look for variations of "free pan india delivery" or "nationwide free delivery"
        // E.g., "Free PAN India Delivery", "Free Nationwide Delivery", "Nationwide Free Delivery"
        const lowerFeature = feature.toLowerCase();
        
        if (lowerFeature.includes('free') && lowerFeature.includes('delivery')) {
          hasChanges = true;
          // Replace "free" with empty string and clean up spacing
          let newFeature = feature
            .replace(/free/gi, '')
            .replace(/\s+/g, ' ')
            .trim();
          
          // Capitalize if it starts with lowercase (e.g., "pan india delivery")
          if (newFeature.match(/^(pan india|nationwide)/i)) {
            newFeature = newFeature.charAt(0).toUpperCase() + newFeature.slice(1);
          }
          
          console.log(`   ✨ Car [${car.name}]: "${feature}" ➡️ "${newFeature}"`);
          return newFeature;
        }
        return feature;
      });

      if (hasChanges) {
        // Update the car features in Supabase
        const { error: updateError } = await supabase
          .from('cars')
          .update({ features: updatedFeatures })
          .eq('id', car.id);

        if (updateError) {
          console.error(`   ❌ Failed to update features for car ${car.name}:`, updateError.message);
        } else {
          console.log(`   ✅ Successfully updated features for car ${car.name}`);
          updatedCount++;
        }
      }
    }

    console.log(`\n🎉 Database cleanup complete. Updated ${updatedCount} cars.`);

  } catch (error) {
    console.error('❌ Database operation failed:', error.message);
  }
}

removeFreeDelivery();
