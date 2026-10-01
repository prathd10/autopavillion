import { createClient } from '@supabase/supabase-js';
import { getEligibleVehicles, buildSitemapXml } from '../src/lib/sitemapBuilder.js';

export default async function handler(req, res) {
  // Only permit GET or HEAD
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

    let supabase = null;
    if (supabaseUrl && supabaseAnonKey) {
      supabase = createClient(supabaseUrl, supabaseAnonKey);
    }

    const vehicles = await getEligibleVehicles(supabase);
    const xml = buildSitemapXml(vehicles);

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    if (req.method === 'HEAD') {
      return res.status(200).end();
    }

    return res.status(200).send(xml);
  } catch (error) {
    console.error('[api/sitemap] Error generating sitemap:', error);
    // Even if error occurs, generate fallback sitemap from static data
    const fallbackXml = buildSitemapXml();
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=300');
    return res.status(200).send(fallbackXml);
  }
}
