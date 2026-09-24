import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const STATIC_TESTIMONIALS = [
  {
    id: 'google-1',
    name: "Shailesh Tyagi",
    role: "Google Review • a month ago",
    comment: "Best place to buy a car; I found them to be highly knowledgeable about various makes and models, trustworthy in their dealings, and highly professional in their approach.",
    car: "",
    company: "Google",
    status: 'active'
  },
  {
    id: 'google-2',
    name: "Prasuryya Priyadarshan",
    role: "Google Review • 6 months ago",
    comment: "Amazing deals and all-round assistance with premium car purchases. Had a very nice experience.",
    car: "",
    company: "Google",
    status: 'active'
  },
  {
    id: 'google-3',
    name: "Irshad Khan",
    role: "Google Review • 6 months ago",
    comment: "Best service, very helpful, very professional in dealing with, and best after sales service, really feel good dealing with them",
    car: "",
    company: "Google",
    status: 'active'
  },
  {
    id: 'google-4',
    name: "PRATIK SHAH",
    role: "Google Review • 10 months ago",
    comment: "Has a good experience of selling the car via Cars 24",
    car: "",
    company: "Google",
    status: 'active'
  },
  {
    id: 'google-5',
    name: "Rahul Choudhary",
    role: "Google Review • 6 months ago",
    comment: "Shashank 👌🏼",
    car: "",
    company: "Google",
    status: 'active'
  },
  {
    id: 'google-6',
    name: "Parag Sule",
    role: "Google Review • a month ago",
    comment: "Great collection of luxury cars. Abbas bhai is very nice to explain abt the car U looking at. They understand a genuine buyer and seller. Atiq bhai is owner and nice to spk with. Overall a nice experience till date.",
    car: "",
    company: "Google",
    status: 'active'
  },
  {
    id: 'google-7',
    name: "Anil vishwakarma",
    role: "Google Review • 3 months ago",
    comment: "Verified 5-Star Rating on Google Reviews",
    car: "",
    company: "Google",
    status: 'active'
  },
  {
    id: 'google-8',
    name: "Teerthraj Kale",
    role: "Google Review • 5 months ago",
    comment: "Verified 5-Star Rating on Google Reviews",
    car: "",
    company: "Google",
    status: 'active'
  },
  {
    id: 'google-9',
    name: "Ganga Choudhary",
    role: "Google Review • 8 months ago",
    comment: "Verified 5-Star Rating on Google Reviews",
    car: "",
    company: "Google",
    status: 'active'
  },
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
