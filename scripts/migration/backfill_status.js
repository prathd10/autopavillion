import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Error: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined in your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function run() {
  console.log('📦 Supabase: Fetching all vehicles for status backfill...');
  
  const { data: cars, error: fetchError } = await supabase
    .from('cars')
    .select('id, name, price_raw, status');
    
  if (fetchError) {
    console.error('❌ Failed to fetch cars from Supabase:', fetchError.message);
    process.exit(1);
  }
  
  if (!cars || cars.length === 0) {
    console.log('ℹ️ No cars found in the database. Nothing to backfill.');
    process.exit(0);
  }

  const totalCars = cars.length;
  const activeCandidates = [];
  const soldCandidates = [];

  cars.forEach(car => {
    // If price_raw > 0, it is ACTIVE
    // Otherwise, if 0/null/empty, it is SOLD
    if (car.price_raw && car.price_raw > 0) {
      activeCandidates.push(car.id);
    } else {
      soldCandidates.push(car.id);
    }
  });

  console.log('\n=============================================');
  console.log('         BACKFILL CANDIDATES METRICS         ');
  console.log('=============================================');
  console.log(`Total cars in DB  : ${totalCars}`);
  console.log(`Active candidates : ${activeCandidates.length} (price_raw > 0)`);
  console.log(`Sold candidates   : ${soldCandidates.length} (price_raw = 0 or null)`);
  console.log('---------------------------------------------');

  // Verify checksum
  if (activeCandidates.length + soldCandidates.length !== totalCars) {
    console.error('❌ Checksum mismatch: Active + Sold counts do not equal total cars.');
    process.exit(1);
  } else {
    console.log('✅ Checksum valid: Active + Sold counts equal total cars.');
  }
  console.log('=============================================\n');

  console.log('🔄 Updating active status for candidates...');
  if (activeCandidates.length > 0) {
    const { error: activeError } = await supabase
      .from('cars')
      .update({ status: 'active' })
      .in('id', activeCandidates);
      
    if (activeError) {
      console.error('❌ Failed to update active cars:', activeError.message);
      process.exit(1);
    }
    console.log(`✅ Successfully marked ${activeCandidates.length} cars as 'active'.`);
  }

  console.log('🔄 Updating sold status for candidates...');
  if (soldCandidates.length > 0) {
    const { error: soldError } = await supabase
      .from('cars')
      .update({ status: 'sold' })
      .in('id', soldCandidates);
      
    if (soldError) {
      console.error('❌ Failed to update sold cars:', soldError.message);
      process.exit(1);
    }
    console.log(`✅ Successfully marked ${soldCandidates.length} cars as 'sold'.`);
  }

  // Verify database post-updates
  console.log('\n🔍 Post-update Verification...');
  const { data: updatedCars, error: verifyError } = await supabase
    .from('cars')
    .select('status');
    
  if (verifyError) {
    console.error('❌ Failed to verify database state:', verifyError.message);
    process.exit(1);
  }

  const counts = { active: 0, sold: 0, draft: 0, archived: 0 };
  updatedCars.forEach(c => {
    counts[c.status] = (counts[c.status] || 0) + 1;
  });

  console.log('Database Status Counts post-backfill:');
  console.log(`- Active: ${counts.active}`);
  console.log(`- Sold:   ${counts.sold}`);
  console.log(`- Total:  ${updatedCars.length}`);
  
  if (counts.active === activeCandidates.length && counts.sold === soldCandidates.length) {
    console.log('\n🎉 Backfill successfully completed and verified!');
  } else {
    console.warn('\n⚠️ Warning: Post-backfill verification counts mismatch expected candidates.');
  }
}

run();
