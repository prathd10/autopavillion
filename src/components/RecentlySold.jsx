import React from 'react';
import { History, MapPin } from 'lucide-react';
import { VAULT_CARS } from '../data/vaultData';

export default function RecentlySold() {
  return (
    <section id="recently-sold" className="py-16 sm:py-24 bg-[#050608] relative overflow-hidden border-t border-white/10">
      
      {/* Background abstract elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/[0.02] to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-white/[0.03] to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header section */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-20 space-y-4">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading uppercase tracking-tight text-white leading-none">
            RECENTLY <span className="text-zinc-500">DELIVERED</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed pt-2">
            A retrospective of luxury vehicles successfully sourced and delivered to our valued clients.
          </p>
        </div>

        {/* Vault Photo-Centric Cards Grid (2 columns on Mobile & Desktop) */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-8">
          {VAULT_CARS.map((car) => (
            <div 
              key={car.id}
              className="group relative bg-[#0a0b0e] border border-white/10 overflow-hidden hover:border-white/40 transition-all duration-500 shadow-2xl flex flex-col justify-between"
            >
              {/* Dominant Image Container */}
              <div className="relative h-36 sm:h-96 w-full overflow-hidden">
                <img 
                  src={car.image} 
                  alt={car.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0e] via-[#0a0b0e]/20 to-transparent" />

                {/* Sharp Rectangular Sold Tag */}
                <div className="absolute top-2 left-2 sm:top-4 sm:left-4 px-2 py-0.5 sm:px-3 sm:py-1 bg-black/90 border-l-2 border-white text-[8px] sm:text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-md">
                  DELIVERED {car.soldYear}
                </div>

                {/* Sharp Rectangular Location Tag */}
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 px-2 py-0.5 sm:px-3 sm:py-1 bg-black/80 border border-white/10 text-[8px] sm:text-[11px] text-zinc-300 backdrop-blur-md flex items-center space-x-1">
                  <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-zinc-400" />
                  <span className="truncate max-w-[60px] sm:max-w-none">{car.deliveredLocation}</span>
                </div>
              </div>

              {/* Minimal Content */}
              <div className="p-3 sm:p-6 relative z-10 flex-1 flex flex-col justify-between space-y-2 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                  <div>
                    <h3 
                      className="text-xs sm:text-2xl font-bold text-white tracking-wide leading-tight"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      {car.name}
                    </h3>
                    <p className="text-[9px] sm:text-xs text-zinc-400 font-mulish mt-0.5 line-clamp-1">
                      {car.subtitle}
                    </p>
                  </div>
                  <span className="text-[10px] sm:text-sm font-bold text-white tracking-wide font-mono mt-0.5 sm:mt-0">
                    {car.priceEstimate}
                  </span>
                </div>

                {/* Clean Specs Grid */}
                <div className="grid grid-cols-3 gap-1 sm:gap-2 pt-2 sm:pt-4 border-t border-white/10 text-[8px] sm:text-xs">
                  <div>
                    <span className="text-[7px] sm:text-[9px] uppercase tracking-widest text-zinc-500 block">Output</span>
                    <span className="font-semibold text-zinc-200">{car.specs.power}</span>
                  </div>
                  <div>
                    <span className="text-[7px] sm:text-[9px] uppercase tracking-widest text-zinc-500 block">Top Speed</span>
                    <span className="font-semibold text-zinc-200">{car.specs.topSpeed}</span>
                  </div>
                  <div>
                    <span className="text-[7px] sm:text-[9px] uppercase tracking-widest text-zinc-500 block">Engine</span>
                    <span className="font-semibold text-zinc-200 truncate block">{car.specs.engine}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
