import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const STATIC_TESTIMONIALS = [
  {
    id: 'static-1',
    name: "Vikramaditya S.",
    role: "Industrialist & Porsche Collector, Mumbai",
    comment: "Acquired a 911 GT3 RS through Auto Pavilion. Their 251-point report gave me complete peace of mind. The car was delivered to my estate in immaculate condition with zero paint touches.",
    car: "Porsche 911 GT3 RS",
    status: 'active'
  },
  {
    id: 'static-2',
    name: "Karan Johar B.",
    role: "Corporate Executive, Delhi NCR",
    comment: "Traded my AMG G63 for a Lamborghini Huracán in under 30 minutes! The valuation offer was fair, and their covered flatbed transport picked up the car directly from my farmhouse.",
    car: "Lamborghini Huracán EVO",
    status: 'active'
  },
  {
    id: 'static-3',
    name: "Ananya M.",
    role: "Business Owner, Bangalore",
    comment: "Auto Pavilion stands head and shoulders above other dealers. Authentic mileage certification, completely non-accident transparent documentation, and world-class customer service.",
    car: "Rolls-Royce Ghost",
    status: 'active'
  },
  {
    id: 'static-4',
    name: "Rohan V.",
    role: "Supercar Enthusiast, Hyderabad",
    comment: "The team sourced an unlisted Ferrari 488 Pista allocation for me. Seamless legal transfer and spotless diagnostic audit. Unmatched luxury service.",
    car: "Ferrari 488 Pista",
    status: 'active'
  }
];

/**
 * Fetches active testimonials from Supabase.
 *
 * Falls back to STATIC_TESTIMONIALS if:
 *  - Supabase is unreachable / env vars not set
 *  - The testimonials table is empty
 *
 * @returns {{ testimonials: object[], loading: boolean, error: string|null, source: 'supabase'|'static' }}
 */
export function useTestimonials() {
  const [testimonials, setTestimonials] = useState(STATIC_TESTIMONIALS); // immediate static render
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState('static');

  useEffect(() => {
    let cancelled = false;

    async function fetchTestimonials() {
      try {
        const { data, error: dbError } = await supabase
          .from('testimonials')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (cancelled) return;
        if (dbError) throw dbError;

        if (data && data.length > 0) {
          setTestimonials(data);
          setSource('supabase');
        }
        // Empty table → keep static data
      } catch (err) {
        if (!cancelled) {
          console.warn('[useTestimonials] Supabase unavailable — using static fallback:', err.message);
          setError(err.message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchTestimonials();
    return () => { cancelled = true; };
  }, []);

  return { testimonials, loading, error, source };
}
