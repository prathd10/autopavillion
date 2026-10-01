import { BLOG_ARTICLES } from '../data/blogData.js';
import { CARS_DATA } from '../data/cars.js';
import { generateSlug } from './slug.js';

export const BASE_URL = 'https://www.autopavilion.in';

/**
 * Static showroom and service pages.
 */
export const STATIC_PAGES = [
  { loc: `${BASE_URL}/`, priority: '1.0', changefreq: 'daily' },
  { loc: `${BASE_URL}/inventory`, priority: '0.9', changefreq: 'daily' },
  { loc: `${BASE_URL}/insights`, priority: '0.9', changefreq: 'daily' },
  { loc: `${BASE_URL}/about`, priority: '0.7', changefreq: 'monthly' },
  { loc: `${BASE_URL}/sourcing`, priority: '0.8', changefreq: 'weekly' },
  { loc: `${BASE_URL}/sell`, priority: '0.8', changefreq: 'weekly' },
  { loc: `${BASE_URL}/finance`, priority: '0.8', changefreq: 'weekly' },
  { loc: `${BASE_URL}/compare`, priority: '0.7', changefreq: 'weekly' },
  { loc: `${BASE_URL}/faq`, priority: '0.7', changefreq: 'monthly' },
  { loc: `${BASE_URL}/privacy`, priority: '0.3', changefreq: 'monthly' },
  { loc: `${BASE_URL}/terms`, priority: '0.3', changefreq: 'monthly' },
  { loc: `${BASE_URL}/review`, priority: '0.5', changefreq: 'monthly' },
];

/**
 * Format timestamp safely into YYYY-MM-DD.
 * Returns null if invalid so lastmod is omitted rather than falsified.
 */
function formatLastmod(timestamp) {
  if (!timestamp) return null;
  try {
    const d = new Date(timestamp);
    if (isNaN(d.getTime())) return null;
    return d.toISOString().split('T')[0];
  } catch {
    return null;
  }
}

/**
 * XML escape utility for loc and titles.
 */
function escapeXml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Fetches all published vehicles with automatic Supabase pagination.
 * Excludes drafts, archived, and unpublished vehicles.
 * Falls back to CARS_DATA if Supabase is unreachable.
 *
 * @param {object} supabaseClient Supabase JS client instance
 * @returns {Promise<Array>}
 */
export async function getEligibleVehicles(supabaseClient) {
  if (!supabaseClient) {
    return CARS_DATA.map(c => ({
      slug: generateSlug(c.brand, c.name, c.year),
      name: c.name,
      images: c.images || [],
      lastmod: null,
      status: c.status || 'active'
    }));
  }

  const allVehicles = [];
  const pageSize = 1000;
  let from = 0;
  let hasMore = true;

  try {
    while (hasMore) {
      const { data, error } = await supabaseClient
        .from('cars')
        .select('name, brand, year, status, images, updated_at, created_at')
        .range(from, from + pageSize - 1)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        hasMore = false;
      } else {
        for (const row of data) {
          const status = (row.status || 'active').toLowerCase();
          // Exclude drafts and archived listings
          if (status === 'draft' || status === 'archived') continue;

          const slug = generateSlug(row.brand, row.name, row.year);
          if (!slug) continue;

          const lastmod = formatLastmod(row.updated_at || row.created_at);
          allVehicles.push({
            slug,
            name: row.name,
            images: Array.isArray(row.images) ? row.images.filter(Boolean) : [],
            lastmod,
            status
          });
        }

        if (data.length < pageSize) {
          hasMore = false;
        } else {
          from += pageSize;
        }
      }
    }
  } catch (err) {
    console.warn('[sitemapBuilder] Supabase query failed, falling back to static cars:', err.message);
    return CARS_DATA.map(c => ({
      slug: generateSlug(c.brand, c.name, c.year),
      name: c.name,
      images: c.images || [],
      lastmod: null,
      status: c.status || 'active'
    }));
  }

  return allVehicles;
}

/**
 * Builds the complete sitemap XML string.
 *
 * @param {Array} vehicles Array of vehicle objects with slug, name, images, lastmod
 * @returns {string} Complete valid XML
 */
export function buildSitemapXml(vehicles = []) {
  const urlNodes = [];

  // 1. Static Pages
  for (const page of STATIC_PAGES) {
    urlNodes.push(`  <url>
    <loc>${escapeXml(page.loc)}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`);
  }

  // 2. Editorial Blog Articles
  for (const article of BLOG_ARTICLES) {
    const loc = `${BASE_URL}/insights/${article.slug || article.id}`;
    const lastmod = formatLastmod(article.updatedAt || article.publishedAt);
    const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : '';
    const imageTag = article.coverImage ? `\n    <image:image>
      <image:loc>${escapeXml(article.coverImage)}</image:loc>
      <image:title>${escapeXml(article.title)}</image:title>
    </image:image>` : '';

    urlNodes.push(`  <url>
    <loc>${escapeXml(loc)}</loc>${lastmodTag}
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>${imageTag}
  </url>`);
  }

const getIkEndpoint = () => {
  if (typeof process !== 'undefined' && process.env?.VITE_IMAGEKIT_URL_ENDPOINT) {
    return process.env.VITE_IMAGEKIT_URL_ENDPOINT.replace(/\/$/, '');
  }
  return 'https://ik.imagekit.io/autopavilion';
};

function resolveImageUrl(src) {
  if (!src) return '';
  if (src.startsWith('http')) return src;
  const cleanPath = src.startsWith('/') ? src : `/${src}`;
  return `${getIkEndpoint()}${cleanPath}`;
}

  // 3. Dynamic Vehicle Detail Pages
  for (const car of vehicles) {
    const loc = `${BASE_URL}/inventory/${car.slug}`;
    const lastmodTag = car.lastmod ? `\n    <lastmod>${car.lastmod}</lastmod>` : '';
    const imgUrl = car.images && car.images[0] ? resolveImageUrl(car.images[0]) : '';
    const imageTag = imgUrl ? `\n    <image:image>
      <image:loc>${escapeXml(imgUrl)}</image:loc>
      <image:title>${escapeXml(car.name)}</image:title>
    </image:image>` : '';

    urlNodes.push(`  <url>
    <loc>${escapeXml(loc)}</loc>${lastmodTag}
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>${imageTag}
  </url>`);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlNodes.join('\n')}
</urlset>
`;
}
