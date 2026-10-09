/**
 * Serverless response handler for deprecated legacy WordPress endpoints.
 * Returns HTTP 410 (Gone) with explicit X-Robots-Tag: noindex, nofollow, noarchive.
 *
 * Why 410 instead of 404/200:
 * Google Webmaster Guidelines prioritize HTTP 410 (Gone) to rapidly drop dead,
 * discontinued legacy URLs from search engine crawl queues.
 */
export default function handler(req, res) {
  res.setHeader('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  return res.status(410).send('410 Gone: Legacy WordPress URL permanently decommissioned for Auto Pavilion.');
}
