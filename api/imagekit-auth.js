import ImageKit from 'imagekit';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// In-memory sliding window rate limiter for public review uploads
const reviewUploadLimits = new Map();

function isRateLimited(ip, maxRequests = 5, windowMs = 5 * 60 * 1000) {
  const now = Date.now();
  const record = reviewUploadLimits.get(ip) || { count: 0, resetAt: now + windowMs };
  if (now > record.resetAt) {
    record.count = 1;
    record.resetAt = now + windowMs;
    reviewUploadLimits.set(ip, record);
    return false;
  }
  record.count += 1;
  reviewUploadLimits.set(ip, record);
  return record.count > maxRequests;
}

function setCorsHeaders(req, res) {
  const origin = req.headers.origin || '';
  const isLocal = origin.includes('localhost') || origin.includes('127.0.0.1');
  const isAllowedDomain = origin.endsWith('.autopavilion.in') || origin === 'https://autopavilion.in' || origin.endsWith('.vercel.app');

  if (isLocal || isAllowedDomain) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else if (!origin) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'https://autopavilion.in');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-CSRF-Token, X-Requested-With, Accept');
}

export default async function handler(req, res) {
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  if (!process.env.VITE_IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.VITE_IMAGEKIT_URL_ENDPOINT) {
    res.status(500).json({ error: 'ImageKit environment configuration missing.' });
    return;
  }

  const clientIp = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
  const purpose = req.query.purpose || 'inventory';

  let isAuthenticated = false;

  if (token) {
    try {
      const { data, error } = await supabase.auth.getUser(token);
      if (!error && data?.user) {
        isAuthenticated = true;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  // Authorization policy:
  // 1. Authenticated users (admin/staff) can generate upload tokens for any purpose.
  // 2. Unauthenticated visitors can ONLY generate upload tokens for customer review photos, subject to strict IP rate limiting.
  if (!isAuthenticated) {
    if (purpose !== 'review') {
      res.status(401).json({ error: 'Authentication required to generate upload signatures for inventory assets.' });
      return;
    }

    if (isRateLimited(clientIp, 5, 5 * 60 * 1000)) {
      res.status(429).json({ error: 'Too many upload requests. Please wait a few minutes before trying again.' });
      return;
    }
  }

  try {
    const imagekit = new ImageKit({
      publicKey: process.env.VITE_IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.VITE_IMAGEKIT_URL_ENDPOINT,
    });

    const authParams = imagekit.getAuthenticationParameters();
    res.status(200).json(authParams);
  } catch (error) {
    console.error('[ImageKit Auth Error]:', error);
    res.status(500).json({ error: 'Failed to generate authentication parameters.' });
  }
}
