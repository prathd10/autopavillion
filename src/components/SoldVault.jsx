import React from 'react';
import { Lock, MapPin } from 'lucide-react';
import { VAULT_CARS } from '../data/vaultData';

export default function SoldVault() {
  return (
    <section id="the-vault" className="py-16 sm:py-24 bg-[#050608] relative overflow-hidden border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Header - Minimal & Punchy */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-16 border-b border-white/10 pb-6 sm:pb-8">
          <div>
            <div className="flex items-center space-x-2 text-zinc-400 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.3em] mb-1 sm:mb-2">
              <Lock className="w-3.5 h-3.5" />
              <span>Private Collection</span>
            </div>
            <h2 
              className="text-3xl sm:text-6xl font-black text-white tracking-tight"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              THE VAULT
            </h2>
          </div>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-sm mt-2 md:mt-0 font-mulish leading-relaxed">
            Retrospective of rare hypercars delivered to private Indian collectors.
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
