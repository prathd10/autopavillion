import { useEffect } from 'react';

/**
 * Universal SEO & Structured Data (JSON-LD) Component.
 * Ensures the exact title formatting and injects search engine metadata without altering website visual design.
 */
export default function SEO({
  title,
  description = "Auto Pavilion is Mumbai's premier pre-owned luxury supercar dealership. Curated Porsche, Ferrari, Lamborghini, AMG, Rolls-Royce, and Bentley supercars with a 251-point diagnostic audit & verified history.",
  keywords = "luxury cars mumbai, pre-owned supercars, buy porsche mumbai, lamborghini mumbai, used ferrari india, certified exotic cars",
  image = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop",
  url,
  type = "website",
  schema = null,
  noindex = false
}) {
  const defaultSiteTitle = "Auto Pavilion | Exotic & Luxury Supercar Showroom Mumbai";
  const fullTitle = title ? `${title} | Auto Pavilion` : defaultSiteTitle;
  const canonicalUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://autopavilion.in');

  useEffect(() => {
    // 1. Update Document Title
    document.title = fullTitle;

    // Helper to update or create meta tag
    const setMeta = (name, content, isProperty = false) => {
      if (!content) return;
      const attr = isProperty ? 'property' : 'name';
      let tag = document.querySelector(`meta[${attr}="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    // 2. Standard Meta Tags
    setMeta('description', description);
    setMeta('keywords', keywords);
    setMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // 3. Open Graph Tags
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', description, true);
    setMeta('og:image', image, true);
    setMeta('og:url', canonicalUrl, true);
    setMeta('og:type', type, true);
    setMeta('og:site_name', 'Auto Pavilion', true);

    // 4. Twitter Card Tags
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);
    setMeta('twitter:image', image);

    // 5. Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // 6. JSON-LD Structured Data
    if (schema) {
      let scriptTag = document.querySelector('#dynamic-json-ld');
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'dynamic-json-ld';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.text = JSON.stringify(schema);
    }
  }, [fullTitle, description, keywords, image, canonicalUrl, type, schema, noindex]);

  return null;
}
