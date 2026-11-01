/**
 * Builds the internal notification email for a new website enquiry.
 * Files under api/_lib are helpers, not Vercel functions.
 */
import { AP_LOGO_CID } from './ap-logo.js';

const GOLD = '#D9A94A';
const INK = '#111114';
const MUTED = '#6B6B76';
const LINE = '#E7E5E0';

// What each enquiry type is called in the email
const TYPE_INFO = {
  car_inquiry:      { label: 'Car Enquiry',             blurb: 'A visitor is interested in a car from your inventory.' },
  viewing:          { label: 'Showroom Viewing Request', blurb: 'A visitor wants to book a private viewing or test drive.' },
  trade_in:         { label: 'Sell / Trade-In Request',  blurb: 'A visitor wants to sell or trade in their car.' },
  sourcing:         { label: 'Car Sourcing Request',     blurb: 'A visitor wants you to find a specific car for them.' },
  bespoke_sourcing: { label: 'Car Sourcing Request',     blurb: 'A visitor asked for a car that is not in stock (from the Compare page).' },
  chatbot:          { label: 'Chatbot Lead',             blurb: 'A visitor left their details with the website chat assistant.' },
};

// Friendly names for the fields saved in `details`
const FIELD_LABELS = {
  carName: 'Car',
  carPrice: 'Listed Price',
  carId: 'Car ID',
  city: 'City',
  date: 'Preferred Date',
  time: 'Preferred Time',
  carOfInterest: 'Car of Interest',
  brand: 'Brand',
  customBrand: 'Brand',
  model: 'Model',
  year: 'Year',
  mileage: 'Kilometres Driven',
  makeModel: 'Car Wanted',
  budget: 'Budget',
  notes: 'Notes',
  make: 'Make',
  source: 'Source',
  intent: 'Interested In',
  whatsapp: 'Prefers WhatsApp',
  vehicleName: 'Car',
  vehicleId: 'Car ID',
  message: 'Message',
};

const VALUE_LABELS = {
  comparison_page_unavailable: 'Compare page (car not in stock)',
  chatbot: 'Website chat assistant',
};

export function typeLabel(type) {
  return TYPE_INFO[type]?.label || 'Website Enquiry';
}

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function humanize(key) {
  return FIELD_LABELS[key] || key.replace(/[_-]+/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^\w/, c => c.toUpperCase());
}

function formatValue(key, value) {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  const text = String(value).trim();
  if (key === 'mileage' && /^\d+$/.test(text)) return `${Number(text).toLocaleString('en-IN')} km`;
  if (key === 'date' && /^\d{4}-\d{2}-\d{2}$/.test(text)) {
    const d = new Date(`${text}T00:00:00+05:30`);
    if (!isNaN(d)) return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' });
  }
  return VALUE_LABELS[text] || text;
}

/** Turns the details object into [label, value] rows, skipping empty values. */
export function detailRows(details = {}) {
  const rows = [];
  for (const [key, raw] of Object.entries(details)) {
    if (raw === null || raw === undefined || raw === '') continue;
    // "Other" brand: show the typed brand instead
    if (key === 'brand' && raw === 'Other' && details.customBrand) continue;
    rows.push([humanize(key), formatValue(key, raw)]);
  }
  return rows;
}

/** Digits for tel: / WhatsApp links. Assumes India (+91) for 10-digit numbers. */
export function phoneDigits(phone) {
  let digits = String(phone || '').replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  if (digits.length === 10) digits = `91${digits}`;
  return digits;
}

/** One-line summary used in the subject, e.g. "BMW X5" or "Mercedes-Benz GLE". */
export function subjectContext(details = {}) {
  const pick =
    details.carName ||
    details.carOfInterest ||
    details.vehicleName ||
    details.makeModel ||
    [(details.brand === 'Other' ? details.customBrand : details.brand) || details.make, details.model].filter(Boolean).join(' ');
  return String(pick || '').trim().slice(0, 60);
}

function button(href, text, primary) {
  const bg = primary ? GOLD : '#FFFFFF';
  const color = primary ? INK : INK;
  const border = primary ? GOLD : '#D4D4D8';
  return `<td style="padding:4px 6px 4px 0;">
    <a href="${escapeHtml(href)}" target="_blank" style="display:inline-block;padding:12px 20px;border-radius:999px;background:${bg};border:1px solid ${border};color:${color};font-family:Helvetica,Arial,sans-serif;font-size:13px;font-weight:700;letter-spacing:0.4px;text-decoration:none;">${escapeHtml(text)}</a>
  </td>`;
}

/**
 * @param {object} p
 * @param {string} p.type
 * @param {string} p.name
 * @param {string} p.phone
 * @param {object} p.details
 * @param {string} [p.pageUrl]   Page the form was submitted from (already validated)
 * @param {string} p.siteUrl     e.g. https://www.autopavilion.in
 * @param {Date}   p.receivedAt
 * @returns {{ subject: string, html: string, text: string }}
 */
export function buildInquiryEmail({ type, name, phone, details, pageUrl, siteUrl, receivedAt }) {
  const info = TYPE_INFO[type] || { label: 'Website Enquiry', blurb: 'A new enquiry was submitted on the website.' };
  const rows = detailRows(details);
  const context = subjectContext(details);
  const digits = phoneDigits(phone);
  const when = receivedAt.toLocaleString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata',
  }) + ' IST';

  const subject = `New ${info.label}: ${name}${context ? ` · ${context}` : ''}`;
  const preheader = `${name} (${phone})${context ? ` · ${context}` : ''} · ${when}`;
  // Logo is attached to the email itself (see notify-inquiry.js), so it shows even before deploy
  const logoUrl = `cid:${AP_LOGO_CID}`;
  const adminUrl = `${siteUrl}/admin/inquiries`;

  const detailHtml = rows.map(([label, value], i) => `
    <tr>
      <td style="padding:12px 0;${i ? `border-top:1px solid ${LINE};` : ''}width:40%;vertical-align:top;font-family:Helvetica,Arial,sans-serif;font-size:13px;color:${MUTED};">${escapeHtml(label)}</td>
      <td style="padding:12px 0;${i ? `border-top:1px solid ${LINE};` : ''}vertical-align:top;font-family:Helvetica,Arial,sans-serif;font-size:14px;color:${INK};font-weight:600;white-space:pre-line;">${escapeHtml(value)}</td>
    </tr>`).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light only">
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#F2F1EE;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F2F1EE;">
  <tr><td align="center" style="padding:28px 12px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

      <!-- Header -->
      <tr><td style="background:#000000;border-radius:16px 16px 0 0;padding:28px 32px;" align="center">
        <img src="${escapeHtml(logoUrl)}" width="64" height="64" alt="Auto Pavilion" style="display:block;border:0;width:64px;height:64px;margin:0 auto 12px;">
        <div style="font-family:Georgia,'Times New Roman',serif;font-size:20px;letter-spacing:6px;color:${GOLD};text-transform:uppercase;">Auto Pavilion</div>
        <div style="font-family:Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:3px;color:#8A8A93;text-transform:uppercase;margin-top:6px;">Santacruz West · Mumbai</div>
      </td></tr>
      <tr><td style="background:${GOLD};height:3px;line-height:3px;font-size:0;">&nbsp;</td></tr>

      <!-- Body -->
      <tr><td style="background:#FFFFFF;padding:32px;">
        <div style="display:inline-block;padding:6px 12px;border-radius:999px;background:#FBF4E4;border:1px solid #EFDDB3;font-family:Helvetica,Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#8A6416;">New ${escapeHtml(info.label)}</div>
        <h1 style="margin:16px 0 6px;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.25;font-weight:normal;color:${INK};">${escapeHtml(name)}</h1>
        <p style="margin:0 0 4px;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.5;color:${MUTED};">${escapeHtml(info.blurb)}</p>
        <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:12px;color:#9A9AA3;">Received ${escapeHtml(when)}</p>

        <!-- Contact -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 8px;background:#FAFAF9;border:1px solid ${LINE};border-radius:12px;">
          <tr><td style="padding:18px 20px;">
            <div style="font-family:Helvetica,Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${MUTED};margin-bottom:6px;">Phone</div>
            <a href="tel:+${escapeHtml(digits)}" style="font-family:Helvetica,Arial,sans-serif;font-size:20px;font-weight:700;color:${INK};text-decoration:none;">${escapeHtml(phone)}</a>
          </td></tr>
        </table>

        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 28px;"><tr>
          ${button(`tel:+${digits}`, 'Call Now', true)}
          ${button(`https://wa.me/${digits}`, 'WhatsApp', false)}
        </tr></table>

        ${rows.length ? `
        <div style="font-family:Helvetica,Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${MUTED};margin-bottom:4px;">Enquiry Details</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${detailHtml}
        </table>` : ''}

        ${pageUrl ? `
        <p style="margin:24px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;color:#9A9AA3;">Submitted from <a href="${escapeHtml(pageUrl)}" style="color:#8A6416;">${escapeHtml(pageUrl.replace(/^https?:\/\//, ''))}</a></p>` : ''}

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;border-top:1px solid ${LINE};">
          <tr><td style="padding-top:20px;" align="center">
            <a href="${escapeHtml(adminUrl)}" target="_blank" style="font-family:Helvetica,Arial,sans-serif;font-size:13px;font-weight:700;color:${INK};text-decoration:none;">Open in Admin Panel →</a>
          </td></tr>
        </table>
      </td></tr>

      <!-- Footer -->
      <tr><td style="background:#0B0B0D;border-radius:0 0 16px 16px;padding:22px 32px;" align="center">
        <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:11px;line-height:1.6;color:#8A8A93;">
          Office No. 25, Tirupati Shopping Center, S.V. Road, Santacruz (West), Mumbai 400054<br>
          <a href="${escapeHtml(siteUrl)}" style="color:${GOLD};text-decoration:none;">autopavilion.in</a>
        </p>
        <p style="margin:10px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:10px;color:#5E5E66;">Automatic notification from the Auto Pavilion website.</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;

  const text = [
    `New ${info.label}`,
    info.blurb,
    '',
    `Name: ${name}`,
    `Phone: ${phone}`,
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    `Received: ${when}`,
    pageUrl ? `Submitted from: ${pageUrl}` : '',
    `Call: tel:+${digits}`,
    `WhatsApp: https://wa.me/${digits}`,
    `Admin panel: ${adminUrl}`,
  ].filter(line => line !== null).join('\n');

  return { subject, html, text };
}
