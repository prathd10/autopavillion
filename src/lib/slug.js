/**
 * Shared slug generation utility for Auto Pavilion vehicle routes.
 * Generates SEO-friendly URLs: e.g. "porsche-911-gt3-rs-2023"
 */
export function generateSlug(brand, name, year) {
  return `${brand || ''}-${name || ''}-${year || ''}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
