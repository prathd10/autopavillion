import React from 'react';
import { Truck, MapPin, Check, Eye, FileText, HeartHandshake } from 'lucide-react';

const TRUST_CARDS = [
  {
    id: "01",
    title: "INSPECTED",
    subheading: "Multi-Point Vehicle Assessment",
    description: "Vehicles are assessed across key mechanical, electrical, cosmetic and safety parameters before being presented to prospective buyers.",
    bottomLabel: "INSPECTION STANDARD",
    Icon: Check,
  },
  {
    id: "02",
    title: "TRANSPARENT",
    subheading: "Vehicle History & Available Records",
    description: "We share available ownership, registration, service and vehicle-history information to help buyers make an informed decision.",
    bottomLabel: "TRANSPARENCY FIRST",
    Icon: Eye,
  },
  {
    id: "03",
    title: "DOCUMENTED",
    subheading: "Registration & Ownership Details",
    description: "Available vehicle and registration documentation is reviewed as part of the purchase process.",
    bottomLabel: "DOCUMENTATION REVIEWED",
    Icon: FileText,
  },
  {
    id: "04",
    title: "ASSISTED",
    subheading: "From Selection to Delivery",
    description: "Our team assists you through vehicle selection, inspection, documentation and the ownership process.",
    bottomLabel: "CONCIERGE EXPERIENCE",
    Icon: HeartHandshake,
  }
];

export default function TrustStats() {
  // Dark Supercar Parallax Background
  const darkParallaxBg = "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=2400&auto=format&fit=crop";

  return (
    <section 
      id="certification" 
      className="py-16 sm:py-24 text-white relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${darkParallaxBg})`,
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Dark overlay to keep cards and typography dominant */}
      <div className="absolute inset-0 bg-black/85 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-2 sm:space-y-3">
          <span className="text-[10px] sm:text-xs uppercase font-bold tracking-[0.3em] text-zinc-400">
            THE AUTO PAVILION STANDARD
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-heading uppercase drop-shadow-md">
            A MORE CONFIDENT <span className="text-zinc-400 font-extralight">WAY TO BUY PRE-OWNED LUXURY</span>
          </h2>
          <p className="text-zinc-300 text-xs sm:text-sm font-mulish max-w-xl mx-auto leading-relaxed">
            Every vehicle deserves more than a test drive. Our buying process is designed to give you the information, assistance and attention to detail you need to make the right decision.
          </p>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_CARDS.map((fact, idx) => (
            <div
              key={idx}
              className="bg-black/65 backdrop-blur-xl p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/5 hover:border-amber-500/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between shadow-2xl min-h-[180px] sm:min-h-[350px] group"
            >
              {/* Top part: Number */}
              <div className="text-zinc-650 text-xs sm:text-sm font-mono tracking-widest group-hover:text-amber-500/70 transition-colors duration-300">
                {fact.id}
              </div>

              {/* Middle part: Heading, Subheading, Description */}
              <div className="mt-2 sm:mt-4 flex-1 flex flex-col justify-center space-y-1 sm:space-y-2">
                <h3 className="text-lg sm:text-2xl font-black text-white tracking-widest font-heading uppercase group-hover:text-zinc-100 transition-colors duration-300">
                  {fact.title}
                </h3>
                <h4 className="text-[9px] sm:text-xs font-bold text-amber-500/90 uppercase tracking-wider font-heading">
                  {fact.subheading}
                </h4>
                <p className="text-[10px] sm:text-xs text-zinc-400 leading-relaxed font-mulish pt-0.5 sm:pt-1">
                  {fact.description}
                </p>
              </div>

              {/* Bottom part: Divider & Label + Icon */}
              <div className="mt-4 sm:mt-6">
                <div className="w-full h-[1px] bg-white/5 mb-2 sm:mb-4 group-hover:bg-amber-500/10 transition-colors duration-300" />
                <div className="flex items-center justify-between text-[8px] sm:text-[10px] text-zinc-500 group-hover:text-zinc-300 transition-colors duration-300 font-bold uppercase tracking-wider font-mono">
                  <span>{fact.bottomLabel}</span>
                  <fact.Icon className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-zinc-500 group-hover:text-amber-500 group-hover:scale-110 transition-all duration-300 shrink-0 ml-2" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Optional Trust Microcopy */}
        <div className="mt-8 text-center">
          <p className="text-[10px] sm:text-xs text-zinc-500 font-mulish tracking-wider">
            Details and records are shared based on availability for each vehicle.
          </p>
        </div>

        {/* Delivery / Location Banner */}
        <div className="mt-8 sm:mt-12 bg-black/75 backdrop-blur-xl p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 shadow-2xl">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/10 border border-white/10 text-white shrink-0">
              <Truck className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div>
              <h4 className="text-sm sm:text-lg font-bold text-white font-heading leading-tight">Nationwide Covered Flatbed Delivery</h4>
              <p className="text-[10px] sm:text-xs text-zinc-300 mt-0.5 sm:mt-1">
                Secure, enclosed transport delivered directly to your door anywhere in India.
              </p>
            </div>
          </div>

          <a 
            href="https://maps.google.com/?q=Auto+Pavilion,+Office+No:25,+Tirupati+Shopping+center,+S+V+Rd,+Santacruz+(W),+Mumbai-400054" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="shrink-0 flex items-center space-x-2 px-4 py-2 sm:px-5 sm:py-3 rounded-full bg-white/10 border border-white/10 hover:bg-white/20 transition-colors text-white text-[10px] sm:text-xs font-bold font-mono"
          >
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            <span>Santacruz West, Mumbai HQ</span>
          </a>
        </div>

      </div>
    </section>
  );
}
