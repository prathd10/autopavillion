import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env and .env.local manually
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

// Local Docker MySQL Connection Settings (Default fallback setup)
export const WP_DB_CONFIG = {
  host: process.env.OLD_WORDPRESS_DB_HOST || '127.0.0.1',
  port: parseInt(process.env.OLD_WORDPRESS_DB_PORT || '3306', 10),
  database: process.env.OLD_WORDPRESS_DB_NAME || 'autopavilion_migration',
  user: process.env.OLD_WORDPRESS_DB_USER || 'root',
  password: process.env.OLD_WORDPRESS_DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Supabase Configuration
export const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
export const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// ImageKit Configuration
export const IMAGEKIT_PUBLIC_KEY = process.env.VITE_IMAGEKIT_PUBLIC_KEY || '';
export const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY || '';
export const IMAGEKIT_URL_ENDPOINT = process.env.VITE_IMAGEKIT_URL_ENDPOINT || '';
export const IMAGEKIT_FOLDER = 'autopavilion/cars'; // Target folder path: autopavilion/cars/{wordpress_post_id}/gallery/...

// WordPress live website URL (source of images)
export const WP_BASE_URL = process.env.WORDPRESS_BASE_URL || 'https://autopavilion.in';
export const WP_UPLOADS_BASE_URL = `${WP_BASE_URL.replace(/\/$/, '')}/wp-content/uploads/`;

// Dynamic Field Mappings for Vehica Theme (from actual theme specifications)
export const MAPPINGS = {
  post_type: 'vehica_car',
  
  meta_keys: {
    price: 'vehica_currency_6656_2316',               // Price
    price_raw: 'vehica_currency_6656_2316',           // Price
    brand: 'vehica_6659',               // Car Make
    year: 'vehica_23463',               // Year
    mileage_kms: 'vehica_6665',         // KM Run
    transmission: 'vehica_6662',        // Transmission
    fuel_type: 'vehica_6663',           // Fuel Type
    owners: 'vehica_12974',             // Number of Owners
    location: 'vehica_16721',           // Location
    registration_type: 'vehica_6657',   // Registration Type
    registration_month: 'vehica_23462',  // Month
    color: 'vehica_23461',              // Color
    video: 'vehica_6674',               // Video
    gallery: 'vehica_6673',             // Gallery
    attachments: 'vehica_18820',        // Additional Attachments (if any)
    variant: 'vehica_6660',             // Car Variant
    body_type: 'vehica_6655',           // Body Type / Model Taxonomy
    offer_type: 'vehica_24114',         // Offer Type
    power_steering: 'vehica_23460',     // Power Steering flag
    features: 'vehica_6670',            // Features (custom features field)
  },
  
  // Taxonomies for relationships if saved in term tables
  taxonomies: {
    brand: 'vehica_6659',
    year: 'vehica_23463',
    transmission: 'vehica_6662',
    fuel_type: 'vehica_6663',
    owners: 'vehica_12974',
    registration_type: 'vehica_6657',
    registration_month: 'vehica_23462',
    color: 'vehica_6666',
    variant: 'vehica_6660',
    body_type: 'vehica_6655',
    offer_type: 'vehica_24114',
    power_steering: 'vehica_23460',
    features: 'vehica_6670',
  }
};

// Validation Helper
export function validateConfig() {
  const missing = [];
  
  // Validate Supabase
  if (!SUPABASE_URL) missing.push('VITE_SUPABASE_URL');
  if (!SUPABASE_KEY) missing.push('SUPABASE_SERVICE_ROLE_KEY');
  
  // Validate ImageKit
  if (!IMAGEKIT_PUBLIC_KEY) missing.push('VITE_IMAGEKIT_PUBLIC_KEY');
  if (!IMAGEKIT_PRIVATE_KEY) missing.push('IMAGEKIT_PRIVATE_KEY');
  if (!IMAGEKIT_URL_ENDPOINT) missing.push('VITE_IMAGEKIT_URL_ENDPOINT');
  
  return {
    isValid: missing.length === 0,
    missingFields: missing
  };
}
