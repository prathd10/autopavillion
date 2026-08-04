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
export function useCars() {
  const [cars,    setCars]    = useState(CARS_DATA); // immediate static render
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
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (cancelled) return;
        if (dbError) throw dbError;

        if (data && data.length > 0) {
          setCars(data.map(mapCarFromDb));
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
