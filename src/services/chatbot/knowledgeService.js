/**
 * Structured website and business information for Auto Pavilion.
 * Serves as the source of truth for general business questions.
 */
export const BUSINESS_INFO = {
  name: "Auto Pavilion",
  legalName: "Auto Pavilion India",
  tagline: "Premier Pre-Owned Luxury Vehicle Dealership",
  showroomAddress: "Office No. 25, Tirupati Shopping Center (Tirupati Plaza), S.V. Road, Santacruz (West), Mumbai - 400054, Maharashtra, India",
  locationShort: "Santacruz West, Mumbai",
  phone: "+91 82 9191 9393",
  email: "info@autopavilion.in",
  businessHours: {
    weekdays: "Monday to Saturday: 10:00 AM to 8:00 PM",
    sunday: "Sunday: Closed (Available by special appointment only)",
  },
  corePromises: [
    "100% Non-Accident History: Zero-tolerance policy for structural damage, backed by legal certification.",
    "251-Point Diagnostic Audit: Every vehicle undergoes mechanical, electrical, and performance tests.",
    "Bespoke Sourcing: Finding premium luxury and supercars not currently in our public stock through our private network.",
    "Tailored Financing: Collaborative tie-ups with leading Indian private banks and NBFCs for premium EMI options.",
    "Pan-India Delivery: Secure, fully-insured flatbed transport delivery to any location in India.",
  ],
  services: {
    buying: "Explore certified luxury pre-owned cars. Book VIP viewings or order pan-India delivery.",
    sourcing: "Request custom vehicles through our Bespoke Sourcing program.",
    selling: "Sell or trade-in your premium vehicle with free physical inspection and transparent valuations.",
    inspections: "Welcome third-party inspections at authorized OEM workshops (e.g., Porsche Centre, Ferrari Mumbai) for peace of mind.",
    testDrives: "VIP viewings and test drives can be scheduled in advance for qualified buyers.",
  }
};

export const knowledgeService = {
  getBusinessInfo() {
    return BUSINESS_INFO;
  },

  getContextString() {
    return `
Dealership Name: ${BUSINESS_INFO.name} (${BUSINESS_INFO.legalName})
Showroom Location: ${BUSINESS_INFO.showroomAddress}
Contact Phone: ${BUSINESS_INFO.phone}
Contact Email: ${BUSINESS_INFO.email}
Hours of Operation:
- Weekdays: ${BUSINESS_INFO.businessHours.weekdays}
- Sunday: ${BUSINESS_INFO.businessHours.sunday}

Value Propositions & Services:
${BUSINESS_INFO.corePromises.map(p => `- ${p}`).join('\n')}

Additional Services:
- Buying process: ${BUSINESS_INFO.services.buying}
- Bespoke Sourcing: ${BUSINESS_INFO.services.sourcing}
- Selling/Trade-in: ${BUSINESS_INFO.services.selling}
- Inspections: ${BUSINESS_INFO.services.inspections}
- Test Drives/Viewings: ${BUSINESS_INFO.services.testDrives}
    `.trim();
  }
};
