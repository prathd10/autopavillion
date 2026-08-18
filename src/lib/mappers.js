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
    engine: row.engine ?? '',
    horsepower: row.horsepower ?? '',
    hpRaw: row.hp_raw ?? 0,
    torque: row.torque ?? '',
    zeroToHundred: row.zero_to_hundred ?? '',
    zeroToHundredRaw: row.zero_to_hundred_raw ?? 0,
    topSpeed: row.top_speed ?? '',
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
    soundType: row.sound_type ?? '',
    soundFreq: row.sound_freq ?? 0,
    soundName: row.sound_name ?? '',
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
    engine: car.engine,
    horsepower: car.horsepower,
    hp_raw: Number(car.hpRaw) || 0,
    torque: car.torque,
    zero_to_hundred: car.zeroToHundred,
    zero_to_hundred_raw: Number(car.zeroToHundredRaw) || 0,
    top_speed: car.topSpeed,
    transmission: car.transmission,
    mileage_kms: car.mileageKms,
    fuel_type: car.fuelType,
    color: car.color,
    interior_color: car.interiorColor,
    owners: Number(car.owners) || 1,
    location: car.location,
    verified: Boolean(car.verified),
    inspection_certificate: car.inspectionCertificate || null,
    inspection_score: car.inspectionScore || null,
    sound_type: car.soundType || null,
    sound_freq: car.soundFreq ? Number(car.soundFreq) : null,
    sound_name: car.soundName || null,
    featured: Boolean(car.featured),
    images: Array.isArray(car.images) ? car.images.filter(Boolean) : [],
    three_sixty_frames: Array.isArray(car.threeSixtyFrames) ? car.threeSixtyFrames.filter(Boolean) : [],
    features: Array.isArray(car.features) ? car.features.filter(Boolean) : [],
    status: car.status || 'active',
    description: car.description || null,
    updated_at: new Date().toISOString(),
  };
}
