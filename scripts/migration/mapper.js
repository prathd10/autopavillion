import { MAPPINGS } from './config.js';
import { parseGalleryIds, deserialize } from './parser.js';

const BRAND_LOGOS = {
  'bmw': 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg',
  'mercedes-benz': 'https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg',
  'mercedes benz': 'https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg',
  'audi': 'https://upload.wikimedia.org/wikipedia/commons/1/15/Audi_logo.svg',
  'porsche': 'https://upload.wikimedia.org/wikipedia/en/8/8c/Porsche_logo.svg',
  'toyota': 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Toyota_car_logo.svg',
  'honda': 'https://upload.wikimedia.org/wikipedia/commons/7/76/Honda_logo.svg',
  'volvo': 'https://upload.wikimedia.org/wikipedia/commons/2/29/Volvo-Iron-Mark.svg',
  'volkswagen': 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Volkswagen_logo_2019.svg',
  'skoda': 'https://upload.wikimedia.org/wikipedia/commons/5/52/Skoda_Auto_logo_%282023%29.svg',
  'land rover': 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Land_Rover_logo.svg',
  'landrover': 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Land_Rover_logo.svg',
  'ford': 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Ford_Motor_Company_Logo.svg',
  'jaguar': 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Jaguar_2012.svg',
  'mini': 'https://upload.wikimedia.org/wikipedia/commons/e/e4/MINI_logo.svg',
};

/**
 * Returns a brand logo URL if available.
 */
export function getBrandLogo(brandName) {
  if (!brandName) return null;
  const key = brandName.toLowerCase().trim();
  return BRAND_LOGOS[key] || null;
}

// Helper to convert formatted price to raw integer (handles Crores and Lakhs)
export function parsePriceRaw(priceStr) {
  if (!priceStr) return 0;
  const cleanStr = String(priceStr).replace(/,/g, '').toLowerCase().trim();
  
  // Extract floating point number
  const match = cleanStr.match(/[\d.]+/);
  if (!match) return 0;
  const val = parseFloat(match[0]);

  if (/cr|crore/.test(cleanStr)) {
    return Math.round(val * 10000000);
  }
  if (/lakh|lakhs|\bl\b|l$/.test(cleanStr)) {
    return Math.round(val * 100000);
  }
  
  return Math.round(val);
}

// Helper to parse boolean values
export function parseBooleanValue(val) {
  if (val === undefined || val === null) return false;
  const s = String(val).toLowerCase().trim();
  return s === '1' || s === 'true' || s === 'yes' || s === 'y' || s === 'active';
}

// Helper to extract a term by taxonomy name
function getTermsByTaxonomy(terms, taxonomyName) {
  if (!terms) return [];
  return terms
    .filter(t => t.taxonomy === taxonomyName)
    .map(t => t.name);
}

/**
 * Map a single WordPress listing post + meta + terms to the Supabase cars schema.
 */
export function mapWordPressToSupabase(post, meta = {}, terms = [], resolvedImages = {}) {
  const mk = MAPPINGS.meta_keys;
  const tax = MAPPINGS.taxonomies;
  
  const getMeta = (key) => {
    if (meta[key] !== undefined && meta[key] !== null) {
      return String(meta[key]).trim();
    }
    return null;
  };

  // 1. Resolve Brand/Make from Taxonomy 'vehica_6659'
  const brandTerms = getTermsByTaxonomy(terms, tax.brand);
  const brand = brandTerms[0] || getMeta(mk.brand) || '';

  // 2. Resolve Year from Taxonomy 'vehica_23463'
  const yearTerm = getTermsByTaxonomy(terms, tax.year)[0] || getMeta(mk.year);
  const yearVal = parseInt(yearTerm, 10) || null;

  // 3. Resolve Transmission from Taxonomy 'vehica_6662'
  const transmission = getTermsByTaxonomy(terms, tax.transmission)[0] || getMeta(mk.transmission) || null;

  // 4. Resolve Fuel Type from Taxonomy 'vehica_6663'
  const fuelType = getTermsByTaxonomy(terms, tax.fuel_type)[0] || getMeta(mk.fuel_type) || 'Petrol';

  // 5. Resolve Owners from Taxonomy 'vehica_12974'
  const ownerTerm = getTermsByTaxonomy(terms, tax.owners)[0] || getMeta(mk.owners) || '';
  const ownersVal = parseInt(ownerTerm.split('-')[0], 10) || 1;

  // 6. Resolve Registration Type from Taxonomy 'vehica_6657'
  const registrationType = getTermsByTaxonomy(terms, tax.registration_type)[0] || getMeta(mk.registration_type) || null;

  // 7. Resolve Registration Month from Taxonomy 'vehica_23462'
  const monthTerm = getTermsByTaxonomy(terms, tax.registration_month)[0] || getMeta(mk.registration_month) || '';
  const monthVal = monthTerm.includes('-') ? monthTerm.split('-')[1] : monthTerm;

  // 8. Resolve Color from Taxonomy 'vehica_6666' or postmeta 'vehica_23461'
  const color = getTermsByTaxonomy(terms, 'vehica_6666')[0] || getMeta(mk.color) || null;

  // 9. Resolve Variant from Taxonomy 'vehica_6660'
  const variant = getTermsByTaxonomy(terms, tax.variant)[0] || getMeta(mk.variant) || null;

  // 10. Resolve Model Name from Taxonomy 'vehica_6655' (will also link body_type dynamically on lookup match)
  const carModel = getTermsByTaxonomy(terms, tax.body_type)[0] || getMeta(mk.body_type) || null;

  // 11. Parse Video URL from serialized metadata
  const rawVideoMeta = getMeta(mk.video);
  let videoUrl = null;
  if (rawVideoMeta) {
    if (rawVideoMeta.startsWith('a:')) {
      const parsedVideo = deserialize(rawVideoMeta);
      videoUrl = parsedVideo && parsedVideo.url ? parsedVideo.url : null;
    } else {
      videoUrl = rawVideoMeta;
    }
  }

  // 12. Parse Price & Raw Price from metadata 'vehica_currency_6656_2316'
  const rawPriceVal = parseInt(getMeta(mk.price_raw) || '0', 10);
  let priceStr = 'Contact for Price';
  
  if (rawPriceVal > 0) {
    if (rawPriceVal >= 10000000) {
      priceStr = `₹ ${(rawPriceVal / 10000000).toFixed(2)} Cr`;
    } else if (rawPriceVal >= 100000) {
      priceStr = `₹ ${(rawPriceVal / 100000).toFixed(2)} Lakh`;
    } else {
      priceStr = `₹ ${rawPriceVal.toLocaleString('en-IN')}`;
    }
  }

  // 13. Parse Mileage
  let mileageStr = getMeta(mk.mileage_kms);
  if (mileageStr) {
    const numericMiles = parseInt(mileageStr.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(numericMiles) && numericMiles > 0) {
      mileageStr = `${numericMiles.toLocaleString('en-IN')} km`;
    }
  }

  // 14. Resolve status
  const offerType = getTermsByTaxonomy(terms, tax.offer_type)[0] || getMeta(mk.offer_type) || '';
  let status = 'draft';
  if (post.post_status === 'publish') {
    status = offerType.toLowerCase() === 'sold' ? 'sold' : 'active';
  } else if (post.post_status === 'trash') {
    status = 'archived';
  }

  // 15. Resolve gallery attachments
  const galleryAttachmentIds = parseGalleryIds(getMeta(mk.gallery));
  const additionalAttachments = parseGalleryIds(getMeta(mk.attachments));
  const allGalleryIds = Array.from(new Set([...galleryAttachmentIds, ...additionalAttachments])).filter(Boolean);

  const galleryUrls = allGalleryIds
    .map(id => resolvedImages[id])
    .filter(Boolean);

  // Fallback specs
  const powerSteering = getMeta(mk.power_steering);
  const featuresList = [];
  if (parseBooleanValue(powerSteering)) {
    featuresList.push('Power Steering');
  }

  return {
    id: `wp-${post.ID}`,
    name: post.post_title,
    subtitle: variant,
    brand: brand,
    brand_logo: getBrandLogo(brand),
    year: yearVal,
    
    price: priceStr,
    price_raw: rawPriceVal,
    
    body_type: carModel, // Used as fallback value, will be overridden by public.vehicles lookup if matched
    fuel_type: fuelType,
    status: status,
    
    engine: null, // Not standard in Vehica list, fallback
    horsepower: null,
    hp_raw: 0,
    torque: null,
    zero_to_hundred: null,
    zero_to_hundred_raw: 0,
    top_speed: null,
    transmission: transmission,
    
    mileage_kms: mileageStr,
    owners: ownersVal,
    location: getMeta(mk.location) || 'Mumbai',
    verified: true,
    inspection_certificate: null,
    inspection_score: null,
    
    color: color,
    interior_color: null,
    
    featured: parseBooleanValue(getMeta(mk.featured) || getMeta('vehica_featured')),
    features: featuresList,
    
    // Additional target columns
    registration_type: registrationType,
    registration_month: monthVal,
    safety_features: [],
    video: videoUrl,
    description: post.post_content || '',
    
    // Internal metadata for image processing
    _source_gallery_urls: galleryUrls,
    _source_three_sixty_urls: [],
    
    // Diagnostic info
    _wordpress_meta: meta,
    _wordpress_terms: terms,
    _gallery_attachment_ids: allGalleryIds,
    _three_sixty_attachment_ids: []
  };
}
