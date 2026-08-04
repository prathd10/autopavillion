/**
 * ImageKit URL utility
 *
 * Auto Pavillion stores ImageKit delivery URLs in Supabase.
 * This module appends ImageKit transformation parameters to those URLs
 * for on-the-fly optimisation (resize, WebP conversion, quality control).
 *
 * If a URL is NOT an ImageKit URL (e.g. Unsplash fallback during dev),
 * it is returned unchanged so the app works even before the seeding script runs.
 */

const IK_ENDPOINT = (import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT ?? '').replace(/\/$/, '');

/**
 * Returns an optimised ImageKit delivery URL.
 *
 * @param {string} src                        Source URL (ImageKit or external)
 * @param {object} [opts]
 * @param {number} [opts.width]               Width in px
 * @param {number} [opts.height]              Height in px
 * @param {number} [opts.quality=80]          Quality 1–100
 * @param {string} [opts.format='webp']       Output format: webp | avif | jpg | png | auto
 * @param {string} [opts.crop]                Crop mode: maintain_ratio | force | at_max | at_least
 * @returns {string}
 */
export function ikUrl(src, { width, height, quality = 80, format = 'webp', crop } = {}) {
  if (!src) return '';

  let finalUrl = src;

  // If it's a relative path (starts with / or doesn't start with http), it's from our ImageKit storage
  if (src.startsWith('/') || !src.startsWith('http')) {
    const cleanPath = src.startsWith('/') ? src : `/${src}`;
    finalUrl = `${IK_ENDPOINT}${cleanPath}`;
  } else if (!src.includes('ik.imagekit.io')) {
    // If it's an external URL (like Unsplash), return it as-is without transforms
    return src;
  }

  const transforms = [];
  if (width)   transforms.push(`w-${width}`);
  if (height)  transforms.push(`h-${height}`);
  if (quality) transforms.push(`q-${quality}`);
  if (format)  transforms.push(`f-${format}`);
  if (crop)    transforms.push(`c-${crop}`);

  if (transforms.length === 0) return finalUrl;

  try {
    const url = new URL(finalUrl);
    url.searchParams.set('tr', transforms.join(','));
    return url.toString();
  } catch {
    return finalUrl;
  }
}

/**
 * Builds an ImageKit URL from a path relative to your ImageKit URL endpoint.
 *
 * @param {string} path   e.g. '/cars/porsche-911/hero.jpg'
 * @param {object} [opts] Same options as ikUrl
 * @returns {string}
 */
export function ikPath(path, opts = {}) {
  return ikUrl(`${IK_ENDPOINT}${path}`, opts);
}

export { IK_ENDPOINT };
