/**
 * Bidirectional mappers between Supabase snake_case rows
 * and the app's camelCase car objects.
 *
 * Used by:
 *  - src/hooks/useCars.js  (DB → JS, for the storefront)
 *  - src/admin/pages/CarForm.jsx  (JS → DB, for saves; DB → JS, for edits)
 *  - src/admin/pages/AdminInventory.jsx (DB → JS, for the table)
 */

/**
 * Maps a Supabase row (snake_case) → JS car object (camelCase)
 * @param {object} row
 * @returns {object}
 */
export function mapCarFromDb(row) {
  return {
    id: row.id,
    name: row.name,
    subtitle: row.subtitle ?? '',
    brand: row.brand ?? '',
    brandLogo: row.brand_logo ?? '',
    year: row.year,
    price: row.price ?? '',
    priceRaw: row.price_raw ?? 0,
    bodyType: row.body_type ?? '',
    engine: '', // Fallback after column removal
    horsepower: '', // Fallback after column removal
    hpRaw: 0, // Fallback after column removal
    torque: '', // Fallback after column removal
    zeroToHundred: '', // Fallback after column removal
    zeroToHundredRaw: 0, // Fallback after column removal
    topSpeed: '', // Fallback after column removal
    transmission: row.transmission ?? '',
    mileageKms: row.mileage_kms ?? '',
    fuelType: row.fuel_type ?? 'Petrol',
    color: row.color ?? '',
    interiorColor: row.interior_color ?? '',
    owners: row.owners ?? 1,
    location: row.location ?? '',
    verified: row.verified ?? false,
    inspectionCertificate: row.inspection_certificate ?? '',
    inspectionScore: row.inspection_score ?? '',
    registrationType: row.registration_type ?? 'Individual',
    registrationState: row.registration_state ?? '',
    soundType: '', // Fallback after column removal
    soundFreq: 0, // Fallback after column removal
    soundName: '', // Fallback after column removal
    featured: row.featured ?? false,
    images: row.images ?? [],
    threeSixtyFrames: row.three_sixty_frames ?? [],
    features: row.features ?? [],
    status: row.status ?? 'active',
    description: row.description ?? '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Maps a JS car object (camelCase) → Supabase row (snake_case)
 * @param {object} car
 * @returns {object}
 */
export function mapCarToDb(car) {
  return {
    id: car.id,
    name: car.name,
    subtitle: car.subtitle || null,
    brand: car.brand,
    brand_logo: car.brandLogo || null,
    year: Number(car.year),
    price: car.price,
    price_raw: Number(car.priceRaw) || 0,
    body_type: car.bodyType,
    mileage_kms: car.mileageKms,
    transmission: car.transmission || null,
    fuel_type: car.fuelType,
    color: car.color,
    interior_color: car.interiorColor,
    owners: Number(car.owners) || 1,
    location: car.location,
    verified: Boolean(car.verified),
    inspection_certificate: car.inspectionCertificate || null,
    inspection_score: car.inspectionScore || null,
    registration_type: car.registrationType || 'Individual',
    registration_state: car.registrationState || null,
    featured: Boolean(car.featured),
    images: Array.isArray(car.images) ? car.images.filter(Boolean) : [],
    three_sixty_frames: Array.isArray(car.threeSixtyFrames) ? car.threeSixtyFrames.filter(Boolean) : [],
    features: Array.isArray(car.features) ? car.features.filter(Boolean) : [],
    status: car.status || 'active',
    description: car.description || null,
    updated_at: new Date().toISOString(),
  };
}
