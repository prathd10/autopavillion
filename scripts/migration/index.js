import { validateConfig, WP_BASE_URL } from './config.js';
import {
  setupDatabase,
  fetchWordPressListings,
  fetchMetadataForPosts,
  fetchTaxonomiesForPosts,
  fetchAttachmentPaths,
  closeConnection
} from './dbReader.js';
import { mapWordPressToSupabase } from './mapper.js';
import { processListingImages } from './imageManager.js';
import { upsertCarToSupabase, backupSupabaseCarsTable, fetchExistingCarsMap } from './supabaseWriter.js';
import {
  logListingFound,
  logListingMigrated,
  logListingFailure,
  logMissingMetadata,
  printVehicleCard,
  printSummary,
  saveReports,
  trackCompleteness,
  logListingAlreadyMigrated,
  setListingsFound
} from './logger.js';

async function run() {
  const isDryRun = process.argv.includes('--dry-run');
  console.log(`🚀 Starting Auto Pavilion Inventory Migration [Mode: ${isDryRun ? 'DRY RUN' : 'REAL MIGRATION'}]`);
  console.log(`🌍 WordPress Media Source: ${WP_BASE_URL}\n`);

  // 1. Validate environment configuration
  const configCheck = validateConfig();
  if (!configCheck.isValid) {
    console.error('❌ Configuration validation failed. Missing environment variables:');
    configCheck.missingFields.forEach(f => console.error(`   - ${f}`));
    console.error('\nPlease check your .env or .env.local file and supply the missing values.');
    process.exit(1);
  }

  try {
    // 2. Orchestrate local Docker container and SQL dump import
    await setupDatabase();

    // 3. Fetch WordPress listings from local database
    console.log('📥 Querying listings from local WordPress database copy...');
    const posts = await fetchWordPressListings();
    
    if (!posts || posts.length === 0) {
      console.log('ℹ️ No WordPress listings found to migrate.');
      process.exit(0);
    }
    
    console.log(`✅ Found ${posts.length} WordPress post listings.`);
    
    // Extract IDs for batch querying
    const postIds = posts.map(p => p.ID);

    // 4. Batch fetch metadata and taxonomies
    console.log('📥 Batch fetching post metadata and taxonomy terms...');
    const metaGroup = await fetchMetadataForPosts(postIds);
    const termGroup = await fetchTaxonomiesForPosts(postIds);

    // 5. Pre-scan and batch fetch attachment file paths
    console.log('📥 Pre-scanning and resolving media attachment file paths...');
    const attachmentIds = new Set();
    
    for (const pid of postIds) {
      const meta = metaGroup[pid] || {};
      // Fetch gallery and attachment IDs (meta keys from config mapping)
      const gallery = meta.vehica_6673 || meta.gallery || '';
      const attachments = meta.vehica_18820 || meta.attachments || '';
      
      const parseIds = (val) => {
        if (!val) return [];
        if (typeof val === 'string' && val.startsWith('a:')) {
          // Extract numbers using regex for PHP serialized arrays
          const matches = val.match(/i:\d+|s:\d+:"\d+"/g) || [];
          return matches.map(m => {
            const parts = m.split(':');
            const clean = parts[parts.length - 1].replace(/"/g, '');
            return Number(clean);
          }).filter(n => !isNaN(n));
        }
        return String(val).split(',').map(s => s.trim()).filter(Boolean).map(Number);
      };
      
      parseIds(gallery).forEach(id => attachmentIds.add(id));
      parseIds(attachments).forEach(id => attachmentIds.add(id));
    }

    const attachmentIdsArray = Array.from(attachmentIds).filter(Boolean);
    const resolvedAttachmentPaths = await fetchAttachmentPaths(attachmentIdsArray);
    console.log(`✅ Resolved ${Object.keys(resolvedAttachmentPaths).length} media attachment paths from database.\n`);

    // 6. Backup existing Supabase tables (if real migration)
    if (!isDryRun) {
      await backupSupabaseCarsTable();
    }

    // 7. Fetch existing cars map from Supabase to optimize resume functionality
    console.log('📦 Supabase: Loading existing migrated records map...');
    const existingCarsMap = await fetchExistingCarsMap();
    console.log(`✅ Loaded existing records map (${Object.keys(existingCarsMap).length} vehicles already in DB).\n`);

    // 8. Iterate through and process listings
    console.log('🔄 Validating and migrating listings...');
    const totalListings = posts.length;
    setListingsFound(totalListings);
    
    for (let index = 0; index < totalListings; index++) {
      const post = posts[index];
      const wpId = post.ID;
      const carId = `wp-${wpId}`;
      
      try {
        const meta = metaGroup[wpId] || {};
        const terms = termGroup[wpId] || [];
        
        // Map WordPress listing to Supabase schema
        const mappedCar = mapWordPressToSupabase(post, meta, terms, resolvedAttachmentPaths);
        
        // Check if this vehicle is already fully migrated in Supabase (has non-empty images)
        const existingCar = existingCarsMap[carId];
        if (existingCar && existingCar.images && existingCar.images.length > 0) {
          trackCompleteness(mappedCar);
          console.log(`[${index + 1}/${totalListings}] ${post.post_title}`);
          console.log(`  WordPress ID: ${wpId}`);
          console.log(`   ⏭️ Already fully migrated in Supabase. Skipping entire vehicle.`);
          logListingAlreadyMigrated(mappedCar.id, post.post_title, mappedCar);
          continue;
        }

        // Track target field completeness
        trackCompleteness(mappedCar);

        // Run validation checks
        const validation = { errors: [], warnings: [], infos: [] };
        
        // REQUIRED: name, brand, year, fuel_type, transmission, mileage_kms, images
        if (!mappedCar.name) {
          validation.errors.push('Missing Name');
          logMissingMetadata(wpId, post.post_title, 'name');
        }
        if (!mappedCar.brand) {
          validation.errors.push('Missing Brand');
          logMissingMetadata(wpId, post.post_title, 'brand');
        }
        if (!mappedCar.year) {
          validation.errors.push('Missing Year');
          logMissingMetadata(wpId, post.post_title, 'year');
        }
        if (!mappedCar.fuel_type) {
          validation.errors.push('Missing Fuel Type');
          logMissingMetadata(wpId, post.post_title, 'fuel_type');
        }
        if (!mappedCar.transmission) {
          validation.errors.push('Missing Transmission');
          logMissingMetadata(wpId, post.post_title, 'transmission');
        }
        if (!mappedCar.mileage_kms) {
          validation.errors.push('Missing Mileage');
          logMissingMetadata(wpId, post.post_title, 'mileage');
        }
        if (mappedCar._gallery_attachment_ids.length === 0) {
          validation.errors.push('No Images');
          logMissingMetadata(wpId, post.post_title, 'gallery');
        }

        // INFORMATIONAL: price, video, description (Legitimate source-data conditions)
        if (!mappedCar.price_raw) {
          validation.infos.push('Price: Contact for Price');
        }
        if (!mappedCar.video) {
          validation.infos.push('Video: None');
        }
        if (!mappedCar.description) {
          validation.infos.push('Description: None');
        }

        // OPTIONAL: owners, color, location, registration_type, registration_month
        if (!mappedCar.owners) {
          validation.warnings.push('Missing Owners');
          logMissingMetadata(wpId, post.post_title, 'owners');
        }
        if (!mappedCar.color) {
          validation.warnings.push('Missing Color');
          logMissingMetadata(wpId, post.post_title, 'color');
        }
        if (!mappedCar.location) {
          validation.warnings.push('Missing Location');
          logMissingMetadata(wpId, post.post_title, 'location');
        }
        if (!mappedCar.registration_type) {
          validation.warnings.push('Missing Registration Type');
          logMissingMetadata(wpId, post.post_title, 'registration_type');
        }
        if (!mappedCar.registration_month) {
          validation.warnings.push('Missing Registration Month');
          logMissingMetadata(wpId, post.post_title, 'registration_month');
        }

        // Count unresolved attachment paths
        const unresolvedCount = mappedCar._gallery_attachment_ids.length - mappedCar._source_gallery_urls.length;
        if (unresolvedCount > 0) {
          validation.warnings.push(`${unresolvedCount} Missing Image Path(s)`);
          logMissingMetadata(wpId, post.post_title, 'missing_image_paths');
        }

        // Print individual listing card
        printVehicleCard(index + 1, totalListings, post.post_title, mappedCar, validation);

        // Process images (Gallery + Additional Attachments)
        const { images } = await processListingImages(
          mappedCar.id,
          mappedCar._gallery_attachment_ids,
          resolvedAttachmentPaths,
          isDryRun
        );

        // Save ImageKit URLs
        mappedCar.images = images;
        mappedCar.three_sixty_frames = [];

        // Upsert to Supabase (if real run)
        const writeResult = await upsertCarToSupabase(mappedCar, isDryRun);

        if (writeResult.vehicle_id) {
          console.log(`    🔗 Linked to Catalogue Vehicle: ${writeResult.vehicle_id}`);
        }
        
        logListingMigrated(wpId, mappedCar.id);
        console.log('---------------------------------------------');
        
      } catch (listingError) {
        console.error(`  ❌ Failed to process listing: ${post.post_title}`);
        console.error(`     Error: ${listingError.message}`);
        logListingFailure(wpId, post.post_title, listingError.message);
        console.log('---------------------------------------------');
      }
    }

    // 7. Complete and save reports
    printSummary();
    saveReports(isDryRun);

  } catch (error) {
    console.error('\n❌ Migration failed with an unhandled exception:', error.message);
  } finally {
    // 8. Cleanup DB connections
    await closeConnection();
    console.log('🔌 WordPress DB connections closed.');
    console.log('🏁 Migration process finished.');
  }
}

run();
