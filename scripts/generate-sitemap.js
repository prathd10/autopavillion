import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { getEligibleVehicles, buildSitemapXml } from '../src/lib/sitemapBuilder.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load env variables
dotenv.config({ path: path.join(rootDir, '.env') });
dotenv.config({ path: path.join(rootDir, '.env.local') });

async function run() {
  console.log('🔄 [generate-sitemap] Generating sitemap.xml...');
  const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

  let supabase = null;
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  const vehicles = await getEligibleVehicles(supabase);
  console.log(`🚗 [generate-sitemap] Found ${vehicles.length} eligible vehicle listings.`);

  const xml = buildSitemapXml(vehicles);
  const targetPath = path.join(rootDir, 'public', 'sitemap.xml');

  fs.writeFileSync(targetPath, xml, 'utf8');
  console.log(`✅ [generate-sitemap] Successfully wrote complete sitemap to: ${targetPath}`);
}

run().catch((err) => {
  console.error('❌ [generate-sitemap] Failed:', err);
  process.exit(1);
});
