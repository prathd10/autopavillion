import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { mapCarFromDb } from '../lib/mappers';
import { CARS_DATA } from '../data/cars';

/**
 * Fetches active cars from Supabase.
 *
 * Falls back to the static CARS_DATA if:
 *  - Supabase is unreachable / env vars not set
 *  - The cars table is empty (pre-seeding phase)
 *
 * This means the storefront keeps working during development
 * until the seeding script populates the DB.
 *
 * @returns {{ cars: object[], loading: boolean, error: string|null, source: 'supabase'|'static' }}
 */
const generateSlug = (brand, name, year) => {
  return `${brand}-${name}-${year}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

export function useCars() {
  const [cars,    setCars]    = useState(() => CARS_DATA.map(c => ({ ...c, slug: generateSlug(c.brand, c.name, c.year) })));
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [source,  setSource]  = useState('static');

  useEffect(() => {
    let cancelled = false;

    async function fetchCars() {
      try {
        const { data, error: dbError } = await supabase
          .from('cars')
          .select('*')
          .order('status', { ascending: true })
          .order('created_at', { ascending: false });

        if (cancelled) return;
        if (dbError) throw dbError;

        if (data && data.length > 0) {
          const mapped = data.map(mapCarFromDb).map(c => ({ ...c, slug: generateSlug(c.brand, c.name, c.year) }));
          
          // Explicitly sort active vehicles first, then sold vehicles, then created_at desc
          const sorted = [...mapped].sort((a, b) => {
            const statusOrder = { active: 0, sold: 1, draft: 2, archived: 3 };
            const orderA = statusOrder[a.status] ?? 99;
            const orderB = statusOrder[b.status] ?? 99;
            if (orderA !== orderB) return orderA - orderB;
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
          });
          
          setCars(sorted);
          setSource('supabase');
        }
        // Empty table → keep static data (pre-seeding) and stay 'static'
      } catch (err) {
        if (!cancelled) {
          console.warn('[useCars] Supabase unavailable — using static fallback:', err.message);
          setError(err.message);
          // cars state already holds CARS_DATA from initial useState
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchCars();
    return () => { cancelled = true; };
  }, []);

  return { cars, loading, error, source };
}
