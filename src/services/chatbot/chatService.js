import { intentService } from './intentService';
import { faqService } from './faqService';
import { vehicleSearchService } from './vehicleSearchService';
import { knowledgeService } from './knowledgeService';
import { leadService } from './leadService';
import { geminiFallbackService } from './geminiFallbackService';

const RESET_STATE = { 
  flow: 'NORMAL', // 'NORMAL', 'REQUIREMENT_GATHERING', 'SELL_MY_CAR', 'LEAD_CAPTURE'
  step: 0, 
  data: {}, 
  requirements: {}, 
  selectedVehicle: null,
  lastQuestion: null,
  recommendedVehicles: []
};

export const chatService = {
  /**
   * Process user input and return bot response with next state
   * @param {string} query User message
   * @param {object} prevState Current conversation state
   * @returns {Promise<object>} { reply: string|object, state: nextState, quickActions: string[] }
   */
  async processMessage(query, prevState = RESET_STATE) {
    const state = { ...RESET_STATE, ...prevState };
    const cleanQuery = query.trim();
    const cleanQueryLower = cleanQuery.toLowerCase();

    // Cancel flow command support
    if (cleanQueryLower === 'cancel') {
      return {
        reply: "No problem. Let me know if you would like me to help you browse inventory or start a search.",
        quickActions: ["Find My Car", "Browse Inventory", "Sell My Car"],
        state: RESET_STATE
      };
    }

    // 1. LEAD CAPTURE FLOW (Active State Machine override)
    if (state.flow === 'LEAD_CAPTURE') {
      return this.handleLeadCaptureFlow(cleanQuery, state);
    }

    // 2. EXPLICIT LEAD INTENTS (e.g. "Arrange Viewing" or "Call me")
    if (this.isExplicitLeadIntent(cleanQuery, state)) {
      state.flow = 'LEAD_CAPTURE';
      state.step = 1;
      state.data = { 
        intent: cleanQueryLower.includes('viewing') ? 'viewing' : 'callback',
        message: cleanQueryLower.includes('viewing') 
          ? `Requested showroom viewing${state.selectedVehicle ? ` for ${state.selectedVehicle.brand} ${state.selectedVehicle.name}` : ''}.` 
          : 'Requested callback.'
      };
      
      return {
        reply: "Certainly! You can call us directly at +91 82 9191 9393, or I can note your details here to arrange it.\n\nWhat is your full name?",
        quickActions: ["Call +91 82 9191 9393", "Cancel"],
        state
      };
    }

    // 3. SIDE INQUIRY / FAQ CHECK (Answers side questions, then resumes flow)
    const sideInquiryResult = await this.checkSideInquiry(cleanQuery, state);
    if (sideInquiryResult) {
      return sideInquiryResult;
    }

    // 4. VEHICLE DETAIL REQUEST (Answer specifications from DB)
    const detailsResult = await this.checkVehicleDetailsQuery(cleanQuery, state);
    if (detailsResult) {
      return detailsResult;
    }

    // 5. SELL MY CAR FLOW (Collect details first, ask contact info at the end)
    if (state.flow === 'SELL_MY_CAR') {
      return this.handleSellMyCarFlow(cleanQuery, state);
    }

    // ────────────────────────────────────────────────────────
    // 5. REQUIREMENT GATHERING FLOW
    // ────────────────────────────────────────────────────────
    if (state.flow === 'REQUIREMENT_GATHERING') {
      return this.handleRequirementGatheringFlow(cleanQuery, state);
    }

    // ────────────────────────────────────────────────────────
    // 6. NORMAL ROUTING (First-turn intents)
    // ────────────────────────────────────────────────────────
    const { intent, filters } = intentService.classify(cleanQuery);
    let currentIntent = intent;
    if (intent === 'LEAD_INTENT' && !this.isExplicitLeadIntent(cleanQuery, state)) {
      currentIntent = 'VEHICLE_SEARCH';
    }

    // E.g. "Hi"
    if (currentIntent === 'GREETING') {
      return {
        reply: "Welcome to Auto Pavilion. Looking for a particular car, or would you like me to help you find something?",
        quickActions: ["Find My Car", "Browse Inventory", "Luxury Cars", "Sell My Car"],
        state
      };
    }

    // E.g. "Sell my car"
    if (currentIntent === 'SELLING_CAR') {
      return {
        reply: "Certainly. I can assist you with selling or trading in your car. What is the make and model of the vehicle you are looking to sell?",
        state: { ...state, flow: 'SELL_MY_CAR', step: 1, data: {} }
      };
    }


    // E.g. "BMW under 40 lakh" or "SUV" (Extract filters, start requirements flow)
    if (currentIntent === 'VEHICLE_SEARCH' || cleanQueryLower.includes('luxury cars') || cleanQueryLower.includes('find my car') || cleanQueryLower.includes('premium luxury car') || cleanQueryLower.includes('luxury premium car')) {
      state.flow = 'REQUIREMENT_GATHERING';
      state.requirements = { ...state.requirements, ...filters };
      
      const nextQ = this.getNextRequirementQuestion(state);
      if (nextQ) {
        return {
          reply: nextQ.reply,
          quickActions: nextQ.quickActions,
          state: { ...state, lastQuestion: nextQ.lastQuestion }
        };
      } else {
        // We already have all requirements matched in first query! Perform search.
        return this.executeInventorySearch(state);
      }
    }

    // E.g. Check Availability (e.g. "Is the BMW 320d available?")
    if (currentIntent === 'VEHICLE_AVAILABILITY') {
      const terms = cleanQuery.replace(/\b(is|the|car|available|for|sale|still|here|how|much|does|cost|porsche|ferrari|bmw|audi|mercedes|amg)\b/gi, '').trim();
      const car = await vehicleSearchService.checkAvailability(terms || cleanQuery);

      if (car) {
        state.selectedVehicle = car;
        if (car.status === 'sold') {
          const similar = await vehicleSearchService.findSimilar(car);
          state.recommendedVehicles = similar;
          return {
            reply: {
              text: `The ${car.brand} ${car.name} has already been sold. However, I can check our current inventory for similar options. Here are the closest active matches:`,
              cars: similar
            },
            quickActions: ["Browse Inventory", "Find My Car"],
            state
          };
        } else {
          return {
            reply: {
              text: `Yes, the ${car.brand} ${car.name} is currently available in our showroom. Would you like me to tell you more about its specifications, or would you like to arrange a viewing?`,
              cars: [car]
            },
            quickActions: ["Arrange Viewing", "Specifications", "Request Callback"],
            state
          };
        }
      }
    }

    // ────────────────────────────────────────────────────────
    // 7. GEMINI FALLBACK (Cost control check)
    // ────────────────────────────────────────────────────────
    if (cleanQuery.length > 5 && !/^(hi|hello|hey|bye|thanks|ok|yes|no)$/i.test(cleanQuery)) {
      const bizContext = knowledgeService.getContextString();
      const promptContext = `
        ${bizContext}
        
        Important Guidelines:
        - NEVER invent any vehicle prices, availability, or technical specifications.
        - If asked about an unsupported service or question outside the showroom context, politely say you don't have that information.
        - Keep your reply concise (1-2 sentences maximum) and highly professional.
      `;
      const aiReply = await geminiFallbackService.getReply(cleanQuery, promptContext);

      if (aiReply) {
        return {
          reply: aiReply,
          state
        };
      }
    }

    // Default Fallback
    return {
      reply: "I don't have that information available right now. However, I can help you browse our showroom inventory or start a search.",
      quickActions: ["Browse Inventory", "Find My Car"],
      state
    };
  },

  // ────────────────────────────────────────────────────────
  // SIDE INQUIRIES & DETAILS HANDLERS
  // ────────────────────────────────────────────────────────

  async checkSideInquiry(query, state) {
    const clean = query.toLowerCase();
    let answer = null;
    let actions = null;

    const faqMatch = await faqService.findMatchingFAQ(clean);
    if (faqMatch) {
      answer = faqMatch.answer;
    } else {
      const info = knowledgeService.getBusinessInfo();
      if (clean.includes('address') || clean.includes('showroom') || clean.includes('located') || clean.includes('where is')) {
        answer = `Our flagship showroom is located at ${info.showroomAddress}. We are open Monday to Saturday, 10:00 AM to 8:00 PM.`;
        actions = ["Get Directions"];
      } else if (clean.includes('phone') || clean.includes('call') || clean.includes('whatsapp') || clean.includes('contact')) {
        answer = `You can reach our concierge team at ${info.phone}, or via email at ${info.email}.`;
      } else if (clean.includes('hours') || clean.includes('open') || clean.includes('timing')) {
        answer = `Auto Pavilion is open during the following hours:\n- ${info.businessHours.weekdays}\n- ${info.businessHours.sunday}`;
      }
    }

    if (answer) {
      // Loop back to flow if active
      if (state.flow === 'REQUIREMENT_GATHERING') {
        let reply = answer + "\n\nComing back to your vehicle search, ";
        const nextQ = this.getNextRequirementQuestion(state);
        if (nextQ) {
          return {
            reply: reply + nextQ.reply,
            quickActions: nextQ.quickActions,
            state
          };
        }
      }
      if (state.flow === 'SELL_MY_CAR') {
        let reply = answer + "\n\nComing back to the car you want to sell, ";
        if (state.step === 1) {
          reply += "what is the make and model of the vehicle?";
        } else if (state.step === 2) {
          reply += `what is the registration year of the ${state.data.makeModel}?`;
        } else if (state.step === 3) {
          reply += "what is the approximate mileage (kms) on the odometer?";
        } else if (state.step === 4) {
          reply += "which city is the vehicle registered in?";
        }
        return {
          reply,
          state
        };
      }

      return {
        reply: answer,
        quickActions: actions || ["Find My Car", "Browse Inventory"],
        state
      };
    }

    return null;
  },

  async checkVehicleDetailsQuery(query, state) {
    const clean = query.toLowerCase();
    
    // Check if user is asking about recommended or selected vehicle details
    if (clean.includes('tell me about') || clean.includes('details on') || clean.includes('specs') || clean.includes('specification') || clean.includes('mileage') || clean.includes('price')) {
      let matchedCar = state.selectedVehicle;

      // Try matching brand names from recommendations
      if (state.recommendedVehicles && state.recommendedVehicles.length > 0) {
        const found = state.recommendedVehicles.find(c => 
          clean.includes(c.brand.toLowerCase()) || clean.includes(c.name.toLowerCase())
        );
        if (found) matchedCar = found;
      }

      if (matchedCar) {
        state.selectedVehicle = matchedCar;
        const priceLabel = matchedCar.status === 'sold' ? 'SOLD' : `₹${matchedCar.price}`;
        const specsText = `The ${matchedCar.brand} ${matchedCar.name} is a ${matchedCar.year} model with ${matchedCar.mileageKms} kms, fuel type ${matchedCar.fuelType}, and automatic transmission.

Price: ${priceLabel}.

Would you like to arrange a showroom viewing for this vehicle?`;

        return {
          reply: specsText,
          quickActions: ["Arrange Viewing", "Request Callback", "Show Other Options"],
          state
        };
      }
    }

    return null;
  },

  // ────────────────────────────────────────────────────────
  // REQUIREMENT GATHERING FLOW
  // ────────────────────────────────────────────────────────

  async handleRequirementGatheringFlow(query, state) {
    const clean = query.trim().toLowerCase();
    
    // Parse current requirement input
    if (state.lastQuestion === 'maxPrice' && !clean.includes('flexible')) {
      let maxPrice = null;
      if (clean.includes('crore') || clean.includes('cr')) {
        const match = clean.match(/(\d+(?:\.\d+)?)/);
        if (match) maxPrice = parseFloat(match[1]) * 10000000;
      } else if (clean.includes('lakh')) {
        const match = clean.match(/(\d+(?:\.\d+)?)/);
        if (match) maxPrice = parseFloat(match[1]) * 100000;
      } else {
        const match = clean.match(/(\d+)/);
        if (match) {
          const val = parseInt(match[1], 10);
          if (val < 100) maxPrice = val * 100000; // assume Lakh if user entered "30" or "40"
        }
      }
      if (maxPrice) state.requirements.maxPrice = maxPrice;
    } else if (state.lastQuestion === 'bodyType' && !clean.includes('flexible')) {
      const bTypes = ['suv', 'sedan', 'coupe', 'convertible', 'hatchback'];
      const bt = bTypes.find(b => clean.includes(b));
      if (bt) state.requirements.bodyType = bt;
    } else if (state.lastQuestion === 'brand' && !clean.includes('any')) {
      const brands = ['bmw', 'mercedes', 'mercedes-benz', 'mercedes-amg', 'amg', 'audi', 'porsche', 'ferrari', 'lamborghini', 'rolls-royce', 'bentley', 'land rover'];
      let b = brands.find(brandName => clean.includes(brandName));
      if (b) {
        if (b === 'mercedes' || b === 'amg') b = 'mercedes-benz';
        state.requirements.brand = b;
      }
    } else if (state.lastQuestion === 'fuelType' && !clean.includes('any')) {
      const fuels = ['petrol', 'diesel', 'hybrid', 'electric'];
      const f = fuels.find(fName => clean.includes(fName));
      if (f) state.requirements.fuelType = f.charAt(0).toUpperCase() + f.slice(1);
    }

    // Extract any other filters mentioned (e.g. if budget question was answered with brand)
    const extraFilters = intentService.classify(query).filters;
    state.requirements = { ...state.requirements, ...extraFilters };

    const nextQ = this.getNextRequirementQuestion(state);
    if (nextQ) {
      return {
        reply: nextQ.reply,
        quickActions: nextQ.quickActions,
        state: { ...state, lastQuestion: nextQ.lastQuestion }
      };
    }

    // Search
    return this.executeInventorySearch(state);
  },

  getNextRequirementQuestion(state) {
    if (!state.requirements.maxPrice) {
      return {
        reply: "Absolutely. I can help you find something based on your budget, preferred brand and body style.\n\nWhat's your approximate budget?",
        quickActions: ["Under 25 Lakh", "Under 50 Lakh", "Under 1 Crore", "Flexible"],
        lastQuestion: 'maxPrice'
      };
    }
    if (!state.requirements.bodyType) {
      return {
        reply: "Are you looking for a sedan, SUV, coupe, or are you open to options?",
        quickActions: ["SUV", "Sedan", "Coupe", "Flexible"],
        lastQuestion: 'bodyType'
      };
    }
    if (!state.requirements.brand) {
      return {
        reply: "Do you have a preferred brand, or should I show you the strongest options currently available?",
        quickActions: ["BMW", "Mercedes-Benz", "Audi", "Any Brand"],
        lastQuestion: 'brand'
      };
    }
    if (!state.requirements.fuelType) {
      return {
        reply: "Preferred fuel type for the vehicle?",
        quickActions: ["Petrol", "Diesel", "Any"],
        lastQuestion: 'fuelType'
      };
    }
    return null;
  },

  async executeInventorySearch(state) {
    const matches = await vehicleSearchService.search(state.requirements);
    state.recommendedVehicles = matches;
    
    if (matches.length > 0) {
      state.selectedVehicle = matches[0]; // Set default selection to top match
      const carsList = matches.map(c => c.brand.toUpperCase() + ' ' + c.name).join(', ');
      
      // Dynamic details suggestions
      const detailActions = matches.map(c => `Tell me about the ${c.brand}`);

      return {
        reply: {
          text: `Based on your preferences, these are the closest matches currently available in our showroom:`,
          cars: matches
        },
        quickActions: [...detailActions.slice(0, 2), "Arrange Viewing", "Request Callback"],
        state: { ...state, flow: 'NORMAL', lastQuestion: null }
      };
    } else {
      return {
        reply: "We do not currently have a matching vehicle in our public showroom inventory. However, we can source this model for you via our private network. Would you like to request a callback?",
        quickActions: ["Request Callback", "Browse Inventory"],
        state: RESET_STATE
      };
    }
  },

  // ────────────────────────────────────────────────────────
  // SELL MY CAR FLOW
  // ────────────────────────────────────────────────────────

  async handleSellMyCarFlow(query, state) {
    if (state.step === 1) {
      return {
        reply: `Got it. What is the registration year of your ${query}?`,
        state: { ...state, step: 2, data: { makeModel: query } }
      };
    }
    if (state.step === 2) {
      return {
        reply: "What is the approximate mileage (kms) currently on the odometer?",
        state: { ...state, step: 3, data: { ...state.data, year: query } }
      };
    }
    if (state.step === 3) {
      return {
        reply: "Which city is the vehicle registered in?",
        state: { ...state, step: 4, data: { ...state.data, mileage: query } }
      };
    }
    if (state.step === 4) {
      // Vehicle details completed, trigger lead capture naturally
      return {
        reply: "Perfect. I have noted these vehicle details. What is your full name so our team can contact you for a valuation?",
        state: { 
          flow: 'LEAD_CAPTURE', 
          step: 1, 
          data: { 
            intent: 'trade_in',
            message: `Sell/Trade-in: Brand/Model: ${state.data.makeModel}, Year: ${state.data.year}, Mileage: ${state.data.mileage} km, City: ${query}`
          } 
        }
      };
    }
  },

  // ────────────────────────────────────────────────────────
  // LEAD CAPTURE FLOW (Universal 3-step capture)
  // ────────────────────────────────────────────────────────

  async handleLeadCaptureFlow(query, state) {
    if (state.step === 1) {
      // Step 1: Capture Name
      return {
        reply: `Thanks, ${query}. What's the best number for our team to reach you on?`,
        state: { ...state, step: 2, data: { ...state.data, name: query } }
      };
    }
    if (state.step === 2) {
      // Step 3: Ask Call/WhatsApp preference
      const isViewing = state.data.intent === 'viewing';
      const refCar = state.selectedVehicle ? ` regarding the ${state.selectedVehicle.brand} ${state.selectedVehicle.name}` : '';
      return {
        reply: `Perfect. I've noted your request${refCar}.\n\nWould you prefer a direct Call or WhatsApp?`,
        quickActions: ["Call", "WhatsApp"],
        state: { ...state, step: 3, data: { ...state.data, phone: query } }
      };
    }
    if (state.step === 3) {
      const pref = query.toLowerCase().includes('whatsapp') ? 'WhatsApp' : 'Call';
      
      const success = await leadService.createLead({
        name: state.data.name,
        phone: state.data.phone,
        whatsapp: pref === 'WhatsApp',
        intent: state.data.intent,
        vehicleId: state.selectedVehicle?.id || null,
        vehicleName: state.selectedVehicle ? `${state.selectedVehicle.brand} ${state.selectedVehicle.name}` : null,
        message: `${state.data.message || 'Requested concierge assistance.'} Preference: ${pref}.`
      });

      if (success) {
        return {
          reply: `Thanks, ${state.data.name}. Your request has been received. Our concierge team will reach out shortly.`,
          quickActions: ["Browse Inventory", "Find My Car"],
          state: RESET_STATE
        };
      } else {
        return {
          reply: "I had trouble submitting your request. Please contact us directly at +91 82 9191 9393.",
          quickActions: ["Browse Inventory"],
          state: RESET_STATE
        };
      }
    }
  },

  isExplicitLeadIntent(query, state) {
    const clean = query.toLowerCase();
    
    // Explicit contact request
    if (/\b(call me|contact me|whatsapp me|please call|someone call)\b/.test(clean)) {
      return true;
    }
    
    // Explicit showroom / physical action
    if (/\b(arrange a viewing|schedule a viewing|book a viewing|test drive|inspect it|book viewing|visit showroom|visit you|showroom visit|arrange viewing|schedule viewing)\b/.test(clean)) {
      return true;
    }
    
    // Buying a specific vehicle that is currently selected
    if (state.selectedVehicle && /\b(i want this|i want this car|i want to buy it|i want to buy this|how do i purchase|how to buy|how do i proceed|buy it|buy this)\b/.test(clean)) {
      return true;
    }
    
    return false;
  }
};
