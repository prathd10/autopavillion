import { supabase } from '../../lib/supabase';
import { mapCarFromDb } from '.././../lib/mappers';
import { CARS_DATA } from '../../data/cars';

const generateSlug = (brand, name, year) => {
  return `${brand}-${name}-${year}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

// Simple in-memory fallback list mapped to frontend model
const fallbackCars = CARS_DATA.map(c => ({
  ...c,
  priceRaw: c.priceNumeric || parseInt(c.price.replace(/[^0-9]/g, '')) * 100000 || 0,
  slug: generateSlug(c.brand, c.name, c.year),
  status: c.status || 'active'
}));

export const vehicleSearchService = {
  /**
   * Search active inventory based on criteria
   * @param {object} filters { brand, bodyType, maxPrice, transmission, fuelType, year, owners }
   * @returns {Promise<object[]>} Array of matching vehicle objects
   */
  async search(filters) {
    try {
      let query = supabase.from('cars').select('*').order('created_at', { ascending: false });

      // Apply brand filter
      if (filters.brand) {
        query = query.ilike('brand', filters.brand);
      }
      // Apply body type
      if (filters.bodyType) {
        query = query.ilike('body_type', filters.bodyType);
      }
      // Apply transmission
      if (filters.transmission) {
        query = query.ilike('transmission', filters.transmission);
      }
      // Apply fuel type
      if (filters.fuelType) {
        query = query.ilike('fuel_type', filters.fuelType);
      }
      // Apply year
      if (filters.year) {
        query = query.eq('year', filters.year);
      }
      // Apply owners
      if (filters.owners) {
        query = query.lte('owners', filters.owners);
      }
      // Apply max budget (compare against price_raw)
      if (filters.maxPrice) {
        query = query.lte('price_raw', filters.maxPrice);
      }

      // Default status filter is 'active'
      query = query.eq('status', filters.status || 'active');

      const { data, error } = await query.limit(5);

      if (!error && data) {
        return data.map(mapCarFromDb).map(c => ({
          ...c,
          slug: generateSlug(c.brand, c.name, c.year)
        }));
      }
      throw error || new Error('No data returned');
    } catch (err) {
      console.warn('[vehicleSearchService] Supabase query failed. Falling back to local static inventory search:', err.message);
      
      // Local in-memory search fallback
      return fallbackCars.filter(c => {
        if (c.status !== (filters.status || 'active')) return false;
        if (filters.brand && c.brand.toLowerCase() !== filters.brand.toLowerCase()) return false;
        if (filters.bodyType && c.bodyType?.toLowerCase() !== filters.bodyType.toLowerCase()) return false;
        if (filters.transmission && c.transmission?.toLowerCase() !== filters.transmission.toLowerCase()) return false;
        if (filters.fuelType && c.fuelType?.toLowerCase() !== filters.fuelType.toLowerCase()) return false;
        if (filters.year && c.year !== filters.year) return false;
        if (filters.owners && c.owners > filters.owners) return false;
        if (filters.maxPrice && c.priceRaw > filters.maxPrice) return false;
        return true;
      }).slice(0, 5);
    }
  },

  /**
   * Search by name/keywords to check vehicle availability
   * @param {string} searchName 
   * @returns {Promise<object|null>} { car, status }
   */
  async checkAvailability(searchName) {
    const term = searchName.toLowerCase().trim();
    if (!term) return null;

    try {
      // Find matches in active or sold inventory
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .or(`name.ilike.%${term}%,brand.ilike.%${term}%,subtitle.ilike.%${term}%`)
        .order('status', { ascending: true }) // active first
        .limit(1);

      if (!error && data && data.length > 0) {
        const car = mapCarFromDb(data[0]);
        car.slug = generateSlug(car.brand, car.name, car.year);
        return car;
      }
    } catch (err) {
      console.warn('[vehicleSearchService] Check availability query failed:', err.message);
    }

    // Static fallback matching
    const match = fallbackCars.find(c => 
      c.name.toLowerCase().includes(term) || 
      c.brand.toLowerCase().includes(term)
    );
    return match || null;
  },

  /**
   * Find similar active vehicles
   * @param {object} car The reference car
   * @returns {Promise<object[]>} Similar cars
   */
  async findSimilar(car) {
    if (!car) return [];
    try {
      // Query same brand, active cars (excluding current car)
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('status', 'active')
        .eq('brand', car.brand)
        .neq('id', car.id)
        .limit(3);

      if (!error && data && data.length > 0) {
        return data.map(mapCarFromDb).map(c => ({
          ...c,
          slug: generateSlug(c.brand, c.name, c.year)
        }));
      }

      // If no brand matches, try matching by body type
      if (car.bodyType) {
        const { data: bodyData, error: bodyErr } = await supabase
          .from('cars')
          .select('*')
          .eq('status', 'active')
          .eq('body_type', car.bodyType)
          .neq('id', car.id)
          .limit(3);

        if (!bodyErr && bodyData && bodyData.length > 0) {
          return bodyData.map(mapCarFromDb).map(c => ({
            ...c,
            slug: generateSlug(c.brand, c.name, c.year)
          }));
        }
      }
    } catch (err) {
      console.warn('[vehicleSearchService] Find similar query failed:', err.message);
    }

    // Static fallback matching
    return fallbackCars
      .filter(c => c.status === 'active' && c.id !== car.id && (c.brand === car.brand || c.bodyType === car.bodyType))
      .slice(0, 3);
  }
};
