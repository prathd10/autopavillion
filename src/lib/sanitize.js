/**
 * HTML Sanitization and Text Escaping Utility
 * Defends against stored XSS, HTML injection, and DOM-based XSS attacks.
 */

/**
 * Escapes raw strings for safe insertion into HTML contexts.
 * @param {string} str 
 * @returns {string}
 */
export function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Safely sanitizes HTML content by removing dangerous tags (script, iframe, object, embed, etc.)
 * and stripping event handlers and javascript: URLs while preserving safe formatting tags.
 * @param {string} dirty 
 * @returns {string}
 */
export function sanitizeHtml(dirty) {
  if (!dirty || typeof dirty !== 'string') return '';

  // 1. Remove dangerous executable tags and their inner content
  let clean = dirty.replace(/<(script|style|iframe|object|embed|svg|math|form|base|link|meta)[^>]*>[\s\S]*?<\/\1>/gi, '');
  clean = clean.replace(/<(script|style|iframe|object|embed|svg|math|form|base|link|meta)[^>]*\/?>/gi, '');

  // 2. Strip all inline event handlers (e.g. onload, onerror, onclick, onmouseover)
  clean = clean.replace(/\s+on[a-zA-Z]+\s*=\s*(['"][^'"]*['"]|[^\s>]+)/gi, '');

  // 3. Neutralize javascript:, vbscript:, and data: URLs in attributes
  clean = clean.replace(/(href|src|action)\s*=\s*['"]\s*(javascript|vbscript|data):[^'"]*['"]/gi, '$1="#"');
  clean = clean.replace(/(href|src|action)\s*=\s*(javascript|vbscript|data):[^\s>]+/gi, '$1="#"');

  return clean;
}

/**
 * Safely converts markdown **bold** syntax into <strong> tags after escaping all HTML characters.
 * @param {string} text 
 * @returns {string}
 */
export function safeMarkdownBold(text) {
  if (!text) return '';
  const escaped = escapeHtml(text);
  return escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}
