import { buildInquiryEmail } from './_lib/inquiry-email.js';
import { AP_LOGO_BASE64, AP_LOGO_CID } from './_lib/ap-logo.js';

/**
 * POST /api/notify-inquiry
 * Emails the Auto Pavilion team (via Resend) when a website enquiry is submitted.
 * Called by the browser right after the enquiry is saved to Supabase.
 *
 * Env:
 *   RESEND_API_KEY          (required) Resend API key
 *   RESEND_FROM_EMAIL       (optional) Sender, must be on a domain verified in Resend
 *   INQUIRY_NOTIFY_EMAILS   (optional) Comma-separated recipients
 *   PUBLIC_SITE_URL         (optional) Used for the logo and admin links
 */

const DEFAULT_FROM = 'Auto Pavilion Website <enquiries@autopavilion.in>';
const DEFAULT_TO = 'info@autopavilion.in,work.autopavillion@gmail.com';
const DEFAULT_SITE = 'https://www.autopavilion.in';

const ALLOWED_TYPES = new Set(['car_inquiry', 'viewing', 'trade_in', 'sourcing', 'bespoke_sourcing', 'chatbot']);

// Simple per-IP limit (per warm instance) to stop the inboxes being flooded
const rateLimits = new Map();
function isRateLimited(ip, max = 6, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const record = rateLimits.get(ip);
  if (!record || now > record.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }
  record.count += 1;
  return record.count > max;
}

function setCorsHeaders(req, res) {
  const origin = req.headers.origin || '';
  const isLocal = origin.includes('localhost') || origin.includes('127.0.0.1');
  const isAllowed = origin.endsWith('.autopavilion.in') || origin === 'https://autopavilion.in' || origin.endsWith('.vercel.app');
  res.setHeader('Access-Control-Allow-Origin', isLocal || isAllowed ? origin : 'https://autopavilion.in');
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function cleanString(value, max) {
  if (typeof value !== 'string' && typeof value !== 'number') return '';
  // Strip invisible control characters (intentional)
  // oxlint-disable-next-line no-control-regex
  return String(value).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max);
}

// Keep only simple values from `details`, with sane limits
function cleanDetails(details) {
  if (!details || typeof details !== 'object' || Array.isArray(details)) return {};
  const out = {};
  for (const [key, value] of Object.entries(details).slice(0, 20)) {
    if (!/^[A-Za-z][A-Za-z0-9_]{0,40}$/.test(key)) continue;
    if (typeof value === 'boolean') out[key] = value;
    else if (typeof value === 'string' || typeof value === 'number') {
      const v = cleanString(value, 1000);
      if (v) out[key] = v;
    }
  }
  return out;
}

// Only link back to our own site, never to an arbitrary URL
function cleanPageUrl(value) {
  try {
    const url = new URL(String(value));
    const host = url.hostname;
    const ok = host === 'autopavilion.in' || host.endsWith('.autopavilion.in') || host.endsWith('.vercel.app') || host === 'localhost' || host === '127.0.0.1';
    return ok && /^https?:$/.test(url.protocol) ? url.toString().slice(0, 300) : '';
  } catch {
    return '';
  }
}

export default async function handler(req, res) {
  setCorsHeaders(req, res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  if (isRateLimited(ip)) return res.status(429).json({ error: 'Too many requests.' });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[notify-inquiry] RESEND_API_KEY is not set; email not sent.');
    return res.status(503).json({ error: 'Email notifications are not configured.' });
  }

  const body = typeof req.body === 'string' ? safeJson(req.body) : (req.body || {});
  const type = cleanString(body.type, 40);
  const name = cleanString(body.name, 120);
  const phone = cleanString(body.phone, 30);

  if (!ALLOWED_TYPES.has(type)) return res.status(400).json({ error: 'Invalid enquiry type.' });
  if (!name || !phone || !/\d{6,}/.test(phone.replace(/\D/g, ''))) {
    return res.status(400).json({ error: 'Name and a valid phone number are required.' });
  }

  const siteUrl = (process.env.PUBLIC_SITE_URL || DEFAULT_SITE).replace(/\/$/, '');
  const recipients = (process.env.INQUIRY_NOTIFY_EMAILS || DEFAULT_TO)
    .split(',').map(s => s.trim()).filter(Boolean);

  const { subject, html, text } = buildInquiryEmail({
    type,
    name,
    phone,
    details: cleanDetails(body.details),
    pageUrl: cleanPageUrl(body.pageUrl),
    siteUrl,
    receivedAt: new Date(),
  });

  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
  // Lets Resend drop accidental duplicate sends of the same submission
  const submissionId = cleanString(body.submissionId, 64);
  if (/^[A-Za-z0-9-]{8,64}$/.test(submissionId)) headers['Idempotency-Key'] = `inquiry-${submissionId}`;

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || DEFAULT_FROM,
        to: recipients,
        subject,
        html,
        text,
        // Inline logo, referenced in the HTML as cid:ap-logo
        attachments: [{ filename: 'ap-logo.jpg', content: AP_LOGO_BASE64, content_type: 'image/jpeg', content_id: AP_LOGO_CID }],
        tags: [{ name: 'inquiry_type', value: type }],
      }),
    });

    if (!resendRes.ok) {
      const detail = await resendRes.text().catch(() => '');
      console.error(`[notify-inquiry] Resend error ${resendRes.status}: ${detail}`);
      return res.status(502).json({ error: 'Failed to send notification email.' });
    }

    const data = await resendRes.json().catch(() => ({}));
    return res.status(200).json({ sent: true, id: data.id || null });
  } catch (err) {
    console.error('[notify-inquiry] Request to Resend failed:', err);
    return res.status(502).json({ error: 'Failed to send notification email.' });
  }
}

function safeJson(str) {
  try { return JSON.parse(str); } catch { return {}; }
}
