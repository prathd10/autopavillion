import ImageKit from 'imagekit';
import {
  IMAGEKIT_PUBLIC_KEY,
  IMAGEKIT_PRIVATE_KEY,
  IMAGEKIT_URL_ENDPOINT,
  WP_UPLOADS_BASE_URL
} from './config.js';
import { logImageSuccess, logImageFailure } from './logger.js';

let imagekit = null;

function getImageKitClient() {
  if (!imagekit) {
    if (!IMAGEKIT_PRIVATE_KEY || !IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_URL_ENDPOINT) {
      throw new Error('ImageKit credentials are not configured.');
    }
    imagekit = new ImageKit({
      publicKey: IMAGEKIT_PUBLIC_KEY,
      privateKey: IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: IMAGEKIT_URL_ENDPOINT
    });
  }
  return imagekit;
}

/**
 * Helper to wrap a promise in a timeout limit.
 */
function withTimeout(promise, timeoutMs, errorMsg = 'Network request timed out') {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(errorMsg)), timeoutMs);
  });
  return Promise.race([
    promise,
    timeoutPromise
  ]).finally(() => clearTimeout(timeoutId));
}

/**
 * Normalizes a WordPress relative attachment path to a full remote URL.
 */
export function getWordPressImageUrl(filePath) {
  if (!filePath) return null;
  const pathStr = String(filePath).trim();
  if (pathStr.startsWith('http://') || pathStr.startsWith('https://')) {
    return pathStr;
  }
  // Remove leading slash if present
  const cleanPath = pathStr.startsWith('/') ? pathStr.slice(1) : pathStr;
  return `${WP_UPLOADS_BASE_URL}${cleanPath}`;
}

/**
 * Checks if a file already exists in ImageKit at the given path with retries and timeout.
 */
async function checkFileExists(folder, fileName, retries = 2) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const ik = getImageKitClient();
      
      const listPromise = ik.listFiles({
        path: folder,
        name: fileName
      });
      
      // 15-second timeout for existing file check
      const files = await withTimeout(listPromise, 15000, `ImageKit listFiles timed out for ${fileName}`);
      
      if (files && files.length > 0) {
        return files[0].filePath; // e.g., /autopavillion/cars/28644/gallery/23518.jpg
      }
      return null;
    } catch (err) {
      console.warn(`   ⚠️ Warning: File search attempt ${attempt}/${retries} failed for ${fileName}: ${err.message}`);
      if (attempt === retries) {
        return null; // Fallback to null (assume file doesn't exist)
      }
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }
  return null;
}

/**
 * Fetch remote URL image as buffer with timeout.
 */
async function fetchImageBuffer(remoteUrl) {
  // 30-second timeout for downloading the image from WordPress
  const fetchPromise = fetch(remoteUrl);
  const response = await withTimeout(fetchPromise, 30000, `Downloading image timed out for ${remoteUrl}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch remote image: ${response.statusText} (${response.status})`);
  }
  
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Raw upload to ImageKit with timeout.
 */
async function uploadRawToImageKit(buffer, fileName, folder) {
  const ik = getImageKitClient();
  
  const uploadPromise = ik.upload({
    file: buffer,
    fileName: fileName,
    folder: folder,
  });
  
  // 45-second timeout for uploading to ImageKit
  const res = await withTimeout(uploadPromise, 45000, `Uploading to ImageKit timed out for ${fileName}`);
  return res.filePath;
}

/**
 * Upload wrapper with automatic retry loop.
 */
async function uploadWithRetry(remoteUrl, fileName, folder, retries = 3) {
  let lastError = null;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // 1. Download image
      const buffer = await fetchImageBuffer(remoteUrl);
      
      // 2. Upload to ImageKit
      return await uploadRawToImageKit(buffer, fileName, folder);
    } catch (error) {
      lastError = error;
      console.warn(`   ⚠️ Upload attempt ${attempt}/${retries} failed for ${fileName}: ${error.message}`);
      
      if (attempt < retries) {
        // Backoff delay before retry
        const delay = attempt * 2000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error(`Failed to upload ${fileName} after ${retries} attempts`);
}

/**
 * Process and migrate all images (gallery & 360) for a mapped car listing.
 * Maintains strict ordering based on gallery attachment lists.
 */
export async function processListingImages(carId, attachmentIds, resolvedImages, isDryRun = true) {
  const migratedImages = [];
  const wpPostId = carId.replace('wp-', '');
  
  if (attachmentIds && attachmentIds.length > 0) {
    for (let i = 0; i < attachmentIds.length; i++) {
      const attachmentId = attachmentIds[i];
      const rawPath = resolvedImages[attachmentId];
      
      if (!rawPath) {
        logImageFailure(carId, `attachment-id-${attachmentId}`, 'Path not found in database metadata');
        continue;
      }
      
      const remoteUrl = getWordPressImageUrl(rawPath);
      if (!remoteUrl) continue;
      
      const ext = remoteUrl.split('.').pop().split('?')[0] || 'jpg';
      const fileName = `${attachmentId}.${ext}`;
      const folder = `autopavilion/cars/${wpPostId}/gallery`;
      const targetIkPath = `/${folder}/${fileName}`;
      
      if (isDryRun) {
        migratedImages.push(targetIkPath);
        logImageSuccess(carId, remoteUrl, targetIkPath, true);
      } else {
        try {
          // Check for existing asset to avoid duplicate uploads
          let ikPath = await checkFileExists(folder, fileName);
          if (ikPath) {
            console.log(`   ⏭️ Image ${fileName} already exists. Reusing ImageKit asset.`);
          } else {
            console.log(`   📥 Image ${fileName} uploading to ImageKit...`);
            ikPath = await uploadWithRetry(remoteUrl, fileName, folder, 3);
          }
          migratedImages.push(ikPath);
          logImageSuccess(carId, remoteUrl, ikPath, false);
        } catch (err) {
          console.error(`   ⚠️ Image ${fileName} failed after 3 attempts — skipping and continuing.`);
          logImageFailure(carId, remoteUrl, `Failed after 3 attempts: ${err.message}`);
        }
      }
    }
  }

  return {
    images: migratedImages,
    three_sixty_frames: []
  };
}
