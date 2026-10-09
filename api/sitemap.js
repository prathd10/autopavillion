import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { getEligibleVehicles, buildSitemapXml } from '../src/lib/sitemapBuilder.js';

export default async function handler(req, res) {
  // Only permit GET or HEAD
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).end('Method Not Allowed');
  }

  // Helper to read pre-built sitemap from disk
  const readStaticSitemap = () => {
    try {
      const candidates = [
        path.join(process.cwd(), 'dist', 'sitemap.xml'),
        path.join(process.cwd(), 'public', 'sitemap.xml'),
      ];
      for (const p of candidates) {
        if (fs.existsSync(p)) {
          return fs.readFileSync(p, 'utf8');
        }
      }
    } catch {
      // ignore
    }
    return null;
  };

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
    const supabaseAnonKey =
      process.env.VITE_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      '';

    let vehicles = [];
    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      vehicles = await getEligibleVehicles(supabase);
    }

    let xml = '';
    if (vehicles && vehicles.length > 0) {
      xml = buildSitemapXml(vehicles);
    } else {
      xml = readStaticSitemap() || buildSitemapXml();
    }

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    if (req.method === 'HEAD') {
      return res.status(200).end();
    }

    return res.status(200).send(xml);
  } catch (error) {
    console.error('[api/sitemap] Error generating sitemap:', error);
    const fallbackXml = readStaticSitemap() || buildSitemapXml();
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=300');
    return res.status(200).send(fallbackXml);
  }
}

