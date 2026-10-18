import React, { useMemo } from 'react';
import { Scale, Eye } from 'lucide-react';
import { ikUrl } from '../lib/imagekit';
import { Link } from 'react-router-dom';
import { useComparison } from '../hooks/useComparison';

// Deterministic tape configuration for sold cars:
// Generates natural, asymmetric angles and offsets so strips cross organically without looking like a rigid 'X'
function getTapeConfig(car) {
  const seed = String(car?.id || car?.slug || 'car')
    .split('')
    .reduce((acc, char, idx) => acc + char.charCodeAt(0) * (idx + 1), 0);

  // Strip 1: angled down from left to right (-10deg to -16deg)
  const angle1 = -10 - (seed % 7);
  // Strip 2: gentle upward angle (+7deg to +14deg), different magnitude to avoid symmetric X
  const angle2 = 7 + ((seed >> 2) % 8);

  // Vertical positions across lower-mid / specs area
  const top1 = 56 + (seed % 6);
  const top2 = 68 + ((seed >> 3) % 6);

  return { angle1, angle2, top1, top2 };
}

export default function CarCard({ car, isComparing, onToggleCompare }) {
  const { toggleCompare, isComparing: isComparingHook } = useComparison();
  
  const activeComparing = isComparing !== undefined ? isComparing : isComparingHook(car.id);
  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleCompare) {
      onToggleCompare(car);
    } else {
      toggleCompare(car.id);
    }
  };

  const detailUrl = `/inventory/${car.slug}`;
  const tape = useMemo(() => (car.status === 'sold' ? getTapeConfig(car) : null), [car]);

  return (
    <div className={`studio-card relative h-full rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between group shadow-2xl transition-all duration-300 ${
      car.status === 'sold'
        ? 'bg-[#06070a] border border-red-950/50 hover:border-red-700/40 shadow-[0_4px_24px_rgba(0,0,0,0.9)]'
        : 'bg-[#090a0d] border border-white/10'
    }`}>
      
      {/* Top Image Container (Dominant Photo Display) - Semantic Crawlable Link */}
      <Link 
        to={detailUrl}
        className="relative aspect-[1264/846] w-full overflow-hidden bg-[#050608] block cursor-pointer"
        aria-label={`View full specifications for ${car.name}`}
      >
        <img
          src={ikUrl(car.images?.[0], { width: 640, height: 480, quality: 75 })}
          alt={car.name}
          className={`w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-700 ease-out ${
            car.status === 'sold' ? 'opacity-80 grayscale-[30%] contrast-[0.92]' : ''
          }`}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#090a0d] via-transparent to-black/20 pointer-events-none" />

        {/* Darkening shade overlay for sold car */}
        {car.status === 'sold' && (
          <div className="absolute inset-0 bg-black/25 pointer-events-none" />
        )}

        {/* SOLD Badge Overlay at Top of Photo */}
        {car.status === 'sold' && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 px-2.5 py-0.5 bg-red-950/85 backdrop-blur-md text-red-200 text-[8px] sm:text-[9px] font-black uppercase tracking-widest rounded border border-red-700/40 shadow-[0_4px_12px_rgba(0,0,0,0.6)] z-10 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>SOLD</span>
          </div>
        )}
      </Link>

      {/* Content Body */}
      <div className={`p-4 sm:p-6 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4 ${
        car.status === 'sold' ? 'opacity-90' : ''
      }`}>
        
        <div>
          <div className="flex items-center justify-between text-[9px] sm:text-xs text-zinc-400 font-semibold mb-0.5">
            <span>{car.year} • {car.fuelType}</span>
            <span>{car.mileageKms}</span>
          </div>

          <h3 className="text-base sm:text-xl font-bold text-white font-heading group-hover:text-zinc-300 transition-colors leading-tight">
            <Link to={detailUrl} className="hover:text-zinc-300 transition-colors">
              {car.name}
            </Link>
          </h3>
          <p className="text-[10px] sm:text-xs text-zinc-400 line-clamp-1 mt-0.5 font-mulish">{car.subtitle}</p>
        </div>

        {/* Clean Spec Indicators */}
        <div className="grid grid-cols-3 gap-1 sm:gap-2 py-1.5 sm:py-2 border-y border-white/10 text-center">
          <div className="p-1 sm:p-2 rounded-md sm:rounded-xl bg-white/5 truncate">
            <span className="text-[8px] sm:text-[9px] uppercase text-zinc-400 block font-bold">Gearbox</span>
            <span className="text-[10px] sm:text-xs font-bold text-white truncate block">{car.transmission || 'Automatic'}</span>
          </div>

          <div className="p-1 sm:p-2 rounded-md sm:rounded-xl bg-white/5 truncate">
            <span className="text-[8px] sm:text-[9px] uppercase text-zinc-400 block font-bold">Type</span>
            <span className="text-[10px] sm:text-xs font-bold text-white truncate block">{car.bodyType || 'Luxury'}</span>
          </div>

          <div className="p-1 sm:p-2 rounded-md sm:rounded-xl bg-white/5 truncate">
            <span className="text-[8px] sm:text-[9px] uppercase text-zinc-400 block font-bold">Owner</span>
            <span className="text-[10px] sm:text-xs font-bold text-white truncate block">
              {car.owners ? `${car.owners}${car.owners === 1 ? 'st' : car.owners === 2 ? 'nd' : 'rd'} Owner` : '1st Owner'}
            </span>
          </div>
        </div>

        {/* Price & Action Row (Price hidden for sold cars) */}
        <div className="flex items-center justify-between pt-0.5">
          {car.status !== 'sold' ? (
            <div>
              <span className="text-[8px] sm:text-[9px] uppercase text-zinc-400 block tracking-wider font-semibold">Offer Price</span>
              <span className="text-base sm:text-xl font-black font-mono text-white">{car.price}</span>
            </div>
          ) : (
            <div />
          )}

          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            <button
              type="button"
              onClick={handleToggle}
              title={activeComparing ? "Remove from compare" : "Add to compare"}
              className={`p-1.5 sm:p-2.5 rounded-full border transition-all cursor-pointer ${
                activeComparing
                  ? 'bg-white text-black border-white'
                  : 'bg-black border-white/20 text-white hover:bg-white/10'
              }`}
            >
              <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <Link
              to={detailUrl}
              className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white text-black font-extrabold text-[10px] sm:text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center space-x-1 sm:space-x-1.5 shadow-md cursor-pointer"
            >
              <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Specs</span>
            </Link>
          </div>
        </div>

      </div>

      {/* Clean Asymmetric Random Two-Strip "SOLD" Tape Overlay */}
      {car.status === 'sold' && tape && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {/* Tape Strip 1 (Base Layer - Muted Matte Finish) */}
          <div
            className="absolute -left-[25%] w-[150%] h-8 sm:h-9 bg-gradient-to-b from-[#d5d5d8] via-[#c2c2c6] to-[#aaaab0] border-y border-neutral-400/70 shadow-[0_6px_16px_rgba(0,0,0,0.65),0_2px_4px_rgba(0,0,0,0.35)] flex items-center justify-around select-none"
            style={{
              top: `${tape.top1}%`,
              transform: `rotate(${tape.angle1}deg)`,
              zIndex: 21,
            }}
          >
            <div className="flex items-center space-x-6 sm:space-x-8 whitespace-nowrap w-full justify-center">
              {Array.from({ length: 6 }).map((_, i) => (
                <span
                  key={i}
                  className="text-[#B91C1C] font-black text-xs sm:text-sm tracking-[0.24em] uppercase font-heading drop-shadow-[0_1px_1px_rgba(0,0,0,0.12)]"
                >
                  SOLD
                </span>
              ))}
            </div>
          </div>

          {/* Tape Strip 2 (Top Layer, Crossing Asymmetrically - Muted Matte Finish) */}
          <div
            className="absolute -left-[25%] w-[150%] h-8 sm:h-9 bg-gradient-to-b from-[#d8d8db] via-[#c6c6ca] to-[#adadb3] border-y border-neutral-400/70 shadow-[0_10px_22px_rgba(0,0,0,0.75),0_3px_6px_rgba(0,0,0,0.4)] flex items-center justify-around select-none"
            style={{
              top: `${tape.top2}%`,
              transform: `rotate(${tape.angle2}deg)`,
              zIndex: 22,
            }}
          >
            <div className="flex items-center space-x-6 sm:space-x-8 whitespace-nowrap w-full justify-center">
              {Array.from({ length: 6 }).map((_, i) => (
                <span
                  key={i}
                  className="text-[#B91C1C] font-black text-xs sm:text-sm tracking-[0.24em] uppercase font-heading drop-shadow-[0_1px_1px_rgba(0,0,0,0.12)]"
                >
                  SOLD
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
