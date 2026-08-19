/**
 * Deterministic intent classification and entity extraction for queries.
 */

const BRANDS = [
  "bmw", "mercedes", "mercedes-benz", "mercedes-amg", "amg", "audi", "porsche", 
  "ferrari", "lamborghini", "rolls-royce", "rolls royce", "bentley", "aston martin", 
  "land rover", "range rover", "jaguar", "mclaren", "lexus", "maserati", "volvo"
];

const BODY_TYPES = ["suv", "sedan", "coupe", "convertible", "hatchback", "sports"];
const FUEL_TYPES = ["petrol", "diesel", "hybrid", "electric"];
const TRANSMISSIONS = ["automatic", "manual", "dct"];

export const intentService = {
  /**
   * Classifies query intent and extracts search entities
   * @param {string} query 
   * @returns {object} { intent, filters }
   */
  classify(query) {
    const clean = query.trim().toLowerCase();
    
    // Default structure
    const result = {
      intent: 'UNKNOWN',
      filters: {}
    };

    // 1. Determine Intent by keywords
    if (/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)\b/.test(clean)) {
      result.intent = 'GREETING';
    } else if (/\b(sell|selling|trade-in|tradein|trade in|exchange my car|value my car)\b/.test(clean)) {
      result.intent = 'SELLING_CAR';
    } else if (/\b(source|sourcing|bespoke|custom order|import|order a car|find a specific)\b/.test(clean)) {
      result.intent = 'CAR_SOURCING';
    } else if (/\b(test drive|drive it|drive this|road test)\b/.test(clean)) {
      result.intent = 'TEST_DRIVE';
    } else if (/\b(viewing|see the car|visit showroom|showroom visit|visit you|book appointment)\b/.test(clean)) {
      result.intent = 'VIEWING';
    } else if (/\b(finance|loan|emi|interest rate|monthly payment)\b/.test(clean)) {
      result.intent = 'FINANCING';
    } else if (/\b(booking amount|deposit|reserve|token money|how to buy|buying process)\b/.test(clean)) {
      result.intent = 'BUYING_PROCESS';
    } else if (/\b(where are you|location|address|directions|showroom address|mumbai office|map)\b/.test(clean)) {
      result.intent = 'LOCATION';
    } else if (/\b(contact|phone|call|whatsapp number|email|reach you|info@)\b/.test(clean)) {
      result.intent = 'CONTACT';
    } else if (/\b(who are you|about auto pavilion|about you|tell me about your company)\b/.test(clean)) {
      result.intent = 'ABOUT_COMPANY';
    } else if (/\b(i want to buy|i want this|interested in|negotiate|final price|inspect it|someone call me|please call)\b/.test(clean)) {
      result.intent = 'LEAD_INTENT';
    } else if (/\b(is this car available|is it still available|still there|is the .* available|sold or available)\b/.test(clean)) {
      result.intent = 'VEHICLE_AVAILABILITY';
    } else if (/\b(details|specs|specification|mileage|kms|engine|horsepower|torque|owners|color)\b/.test(clean)) {
      result.intent = 'VEHICLE_DETAILS';
    } else if (/\b(how much|price|cost|what is the price|pricing|lakh|cr|crore)\b/.test(clean)) {
      // If it contains vehicle attributes, it's price query or search
      if (BRANDS.some(b => clean.includes(b)) || BODY_TYPES.some(bt => clean.includes(bt))) {
        result.intent = 'VEHICLE_SEARCH';
      } else {
        result.intent = 'PRICE_QUERY';
      }
    } else if (
      BRANDS.some(b => clean.includes(b)) || 
      BODY_TYPES.some(bt => clean.includes(bt)) ||
      /\b(car|cars|inventory|vehicles|stock|showroom)\b/.test(clean)
    ) {
      result.intent = 'VEHICLE_SEARCH';
    }

    // 2. Extract Entities/Filters for Vehicle Queries
    
    // Extract Brand
    let brandMatch = BRANDS.find(b => clean.includes(b));
    if (brandMatch) {
      if (brandMatch === 'mercedes' || brandMatch === 'amg') {
        brandMatch = 'mercedes-benz';
      }
      if (brandMatch === 'range rover') {
        brandMatch = 'land rover';
      }
      result.filters.brand = brandMatch;
    }

    // Extract Body Type
    const bodyMatch = BODY_TYPES.find(bt => clean.includes(bt));
    if (bodyMatch) {
      result.filters.bodyType = bodyMatch;
    }

    // Extract Fuel Type
    const fuelMatch = FUEL_TYPES.find(ft => clean.includes(ft));
    if (fuelMatch) {
      // Capitalize to match DB case
      result.filters.fuelType = fuelMatch.charAt(0).toUpperCase() + fuelMatch.slice(1);
    }

    // Extract Transmission
    const transMatch = TRANSMISSIONS.find(t => clean.includes(t));
    if (transMatch) {
      result.filters.transmission = transMatch.charAt(0).toUpperCase() + transMatch.slice(1);
    }

    // Extract Year
    const yearMatch = clean.match(/\b(20\d{2})\b/);
    if (yearMatch) {
      result.filters.year = parseInt(yearMatch[1], 10);
    }

    // Extract Ownership Status
    if (/\b(first owner|1st owner|single owner|one owner)\b/.test(clean)) {
      result.filters.owners = 1;
    } else if (/\b(second owner|2nd owner|two owners)\b/.test(clean)) {
      result.filters.owners = 2;
    }

    // Extract Budget (Max Price)
    // Matches patterns like "under 30 lakh", "below 2 cr", "under ₹40 lakhs", "budget 25 lakh"
    if (clean.includes('under') || clean.includes('below') || clean.includes('less than') || clean.includes('budget') || clean.includes('within')) {
      const budgetReg = /(\d+(?:\.\d+)?)\s*(lakh|lakhs|cr|crore|crores|l|c)\b/;
      const match = clean.match(budgetReg);
      if (match) {
        const val = parseFloat(match[1]);
        const unit = match[2];
        if (unit.startsWith('c')) {
          result.filters.maxPrice = val * 10000000; // Crore
        } else if (unit.startsWith('l')) {
          result.filters.maxPrice = val * 100000; // Lakh
        }
      }
    }

    return result;
  }
};
