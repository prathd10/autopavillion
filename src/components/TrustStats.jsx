import React from 'react';
import { CheckCircle, Truck, MapPin } from 'lucide-react';
import { BUSINESS_FACTS } from '../data/cars';

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
      {/* Seamless Continuous Parallax Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black/60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-black/80 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-2 sm:space-y-3">
          <span className="text-[10px] sm:text-xs uppercase font-bold tracking-[0.3em] text-zinc-300">
            The Auto Pavilion Blueprint
          </span>
          <h2 className="text-2xl sm:text-5xl font-black text-white tracking-tight font-heading uppercase drop-shadow-md">
            UNCOMPROMISING <span className="text-zinc-400 font-extralight">EXCELLENCE</span>
          </h2>
          <p className="text-zinc-300 text-xs sm:text-sm font-mulish">
            Why discerning luxury vehicle buyers across India choose Auto Pavilion.
          </p>
        </div>

        {/* 2-Column Grid on Mobile, 4-Column Grid on Desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {BUSINESS_FACTS.map((fact, idx) => (
            <div
              key={idx}
              className="bg-black/75 backdrop-blur-xl p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/20 hover:border-white/50 transition-all flex flex-col justify-between shadow-2xl"
            >
              <div>
                <div className="text-2xl sm:text-4xl lg:text-3xl xl:text-4xl font-black font-heading text-white mb-1 sm:mb-2 break-words">
                  {fact.stat}
                </div>
                <h3 className="text-xs sm:text-lg font-bold text-white mb-1 sm:mb-2 font-heading leading-tight">{fact.title}</h3>
                <p className="text-[10px] sm:text-xs text-zinc-300 leading-relaxed font-mulish line-clamp-3 sm:line-clamp-none">{fact.description}</p>
              </div>

              <div className="mt-3 pt-2 sm:mt-6 sm:pt-4 border-t border-white/15 flex items-center justify-between text-[9px] sm:text-[11px] text-white font-semibold uppercase tracking-wider">
                <span>Verified Standard</span>
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white shrink-0 ml-1" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 sm:mt-12 bg-black/75 backdrop-blur-xl p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/20 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 shadow-2xl">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/10 border border-white/20 text-white shrink-0">
              <Truck className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div>
              <h4 className="text-sm sm:text-lg font-bold text-white font-heading leading-tight">Nationwide Covered Flatbed Delivery</h4>
              <p className="text-[10px] sm:text-xs text-zinc-300 mt-0.5 sm:mt-1">
                Secure, enclosed transport delivered directly to your door anywhere in India.
              </p>
            </div>
          </div>

          <a href="https://maps.google.com/?q=Auto+Pavilion,+Office+No:25,+Tirupati+Shopping+center,+S+V+Rd,+Santacruz+(W),+Mumbai-400054" target="_blank" rel="noopener noreferrer" className="shrink-0 flex items-center space-x-2 px-4 py-2 sm:px-5 sm:py-3 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-colors text-white text-[10px] sm:text-xs font-bold font-mono">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            <span>Santacruz West, Mumbai HQ</span>
          </a>
        </div>

      </div>
    </section>
  );
}
