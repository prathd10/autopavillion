import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const stats = {
  listingsFound: 0,
  listingsMigrated: 0,
  listingsSkipped: 0,
  listingsFailed: 0,
  imagesFound: 0,
  imagesUploaded: 0,
  imagesFailed: 0,
  duplicatesDetected: 0,
  
  // Validation stats
  validVehicles: 0,
  warningVehicles: 0,
  errorVehicles: 0,
  missingImageUrls: 0,
  missingMetadata: {}
};

const mappingRecords = {};
const failures = [];
const skipped = [];
const missingMetaDetails = [];

export function logListingFound() {
  stats.listingsFound++;
}

export function setListingsFound(count) {
  stats.listingsFound = count;
}

export function logListingMigrated(wpId, sbId) {
  stats.listingsMigrated++;
  mappingRecords[wpId] = sbId;
}

export function logListingSkipped(wpId, reason) {
  stats.listingsSkipped++;
  skipped.push({ wpId, reason });
}

export function logListingFailure(wpId, name, error) {
  stats.listingsFailed++;
  failures.push({ type: 'listing', wpId, name, error });
}

export function logImageSuccess(wpId, sourceUrl, targetUrl, isDryRun) {
  stats.imagesFound++;
  if (!isDryRun) {
    stats.imagesUploaded++;
  }
}

export function logImageFailure(wpId, sourceUrl, error) {
  stats.imagesFound++;
  stats.imagesFailed++;
  if (error && error.includes('Path not found')) {
    stats.missingImageUrls++;
  }
  failures.push({ type: 'image', wpId, sourceUrl, error });
}

export function logDuplicateDetected(wpId, name) {
  stats.duplicatesDetected++;
}

export function logListingAlreadyMigrated(wpId, name, mappedCar) {
  stats.validVehicles++;
  stats.duplicatesDetected++;
  if (mappedCar && mappedCar._gallery_attachment_ids) {
    stats.imagesFound += mappedCar._gallery_attachment_ids.length;
    stats.imagesUploaded += mappedCar._gallery_attachment_ids.length;
  }
}

export function logMissingMetadata(wpId, name, fieldName) {
  if (!stats.missingMetadata[fieldName]) {
    stats.missingMetadata[fieldName] = 0;
  }
  stats.missingMetadata[fieldName]++;
  missingMetaDetails.push({ wpId, name, fieldName });
}

const completeness = {
  name: 0,
  brand: 0,
  year: 0,
  price: 0,
  mileage_kms: 0,
  fuel_type: 0,
  transmission: 0,
  owners: 0,
  color: 0,
  location: 0,
  registration_type: 0,
  registration_month: 0,
  video: 0,
  description: 0,
  images: 0
};

export function trackCompleteness(mappedCar) {
  if (mappedCar.name) completeness.name++;
  if (mappedCar.brand) completeness.brand++;
  if (mappedCar.year) completeness.year++;
  if (mappedCar.price_raw > 0) completeness.price++;
  if (mappedCar.mileage_kms) completeness.mileage_kms++;
  if (mappedCar.fuel_type) completeness.fuel_type++;
  if (mappedCar.transmission) completeness.transmission++;
  if (mappedCar.owners) completeness.owners++;
  if (mappedCar.color) completeness.color++;
  if (mappedCar.location) completeness.location++;
  if (mappedCar.registration_type) completeness.registration_type++;
  if (mappedCar.registration_month) completeness.registration_month++;
  if (mappedCar.video) completeness.video++;
  if (mappedCar.description && mappedCar.description.trim() !== '') completeness.description++;
  if (mappedCar._gallery_attachment_ids && mappedCar._gallery_attachment_ids.length > 0) completeness.images++;
}

/**
 * Print individual vehicle card.
 */
export function printVehicleCard(index, total, name, mappedCar, validation) {
  const wpId = mappedCar.id.replace('wp-', '');
  const hasVideo = mappedCar.video ? 'Yes' : 'No';
  const imageCount = mappedCar._gallery_attachment_ids.length;

  console.log(`[${index}/${total}] ${name}`);
  console.log(`  WordPress ID: ${wpId}`);
  console.log(`  Brand:        ${mappedCar.brand || '(missing)'}`);
  console.log(`  Variant:      ${mappedCar.subtitle || '(none)'}`);
  console.log(`  Year:         ${mappedCar.year || '(missing)'}`);
  console.log(`  Price:        ${mappedCar.price || '(missing)'}`);
  console.log(`  Mileage:      ${mappedCar.mileage_kms || '(missing)'}`);
  console.log(`  Fuel:         ${mappedCar.fuel_type || '(missing)'}`);
  console.log(`  Transmission: ${mappedCar.transmission || '(missing)'}`);
  console.log(`  Owners:       ${mappedCar.owners || 1}`);
  console.log(`  Color:        ${mappedCar.color || '(missing)'}`);
  console.log(`  Images:       ${imageCount}`);
  console.log(`  Video:        ${hasVideo}`);

  // Display validation status
  if (validation.errors.length > 0) {
    stats.errorVehicles++;
    console.log(`  ❌ ERROR: ${validation.errors.join(', ')}`);
  } else {
    stats.validVehicles++;
    if (validation.warnings.length > 0) {
      stats.warningVehicles++;
      console.log(`  ⚠️ WARNING: ${validation.warnings.join(', ')}`);
    } else {
      console.log('  ✓ VALID');
    }
  }

  if (validation.infos && validation.infos.length > 0) {
    console.log(`  ℹ INFO: ${validation.infos.join(', ')}`);
  }
}

/**
 * Saves migration run outputs and logs details to file.
 */
export function saveReports(isDryRun) {
  const reportPath = path.resolve(__dirname, './migration_report.json');
  const mappingPath = path.resolve(__dirname, './migration_mapping.json');

  const report = {
    timestamp: new Date().toISOString(),
    isDryRun,
    stats,
    completeness,
    failures,
    skipped,
    missingMetaDetails
  };

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`\n📝 Detailed migration report written to: ${reportPath}`);

  if (!isDryRun) {
    let existingMapping = {};
    if (fs.existsSync(mappingPath)) {
      try {
        existingMapping = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));
      } catch (e) {
        console.warn('⚠️ [Logger] Could not parse existing mapping file, starting clean.');
      }
    }
    const finalMapping = { ...existingMapping, ...mappingRecords };
    fs.writeFileSync(mappingPath, JSON.stringify(finalMapping, null, 2), 'utf-8');
    console.log(`🗺️  Mapping file updated at: ${mappingPath}`);
  }
}

/**
 * Print console run summary.
 */
export function printSummary() {
  console.log('\n=============================================');
  console.log('       AUTO PAVILION MIGRATION SUMMARY       ');
  console.log('=============================================');
  console.log(`Vehicles found:       ${stats.listingsFound}`);
  console.log(`Valid vehicles:       ${stats.validVehicles}`);
  console.log(`Vehicles with warnings: ${stats.warningVehicles}`);
  console.log(`Vehicles with errors:   ${stats.errorVehicles}`);
  console.log('---------------------------------------------');
  console.log(`Total gallery images: ${stats.imagesFound}`);
  console.log(`Missing image URLs:   ${stats.missingImageUrls}`);
  console.log(`Images uploaded/valid: ${stats.imagesUploaded}`);
  console.log(`Images failed:        ${stats.imagesFailed}`);
  console.log('---------------------------------------------');
  console.log(`Duplicate IDs Detected: ${stats.duplicatesDetected}`);
  console.log('=============================================');

  console.log('\n=============================================');
  console.log('         FIELD COMPLETENESS SUMMARY          ');
  console.log('=============================================');
  const total = stats.listingsFound || 1;
  for (const [field, count] of Object.entries(completeness)) {
    const pct = ((count / total) * 100).toFixed(2);
    console.log(`  - ${field.padEnd(20)}: ${String(count).padStart(3)}/${total} (${pct}%)`);
  }
  console.log('=============================================\n');
}
