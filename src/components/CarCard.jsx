import React from 'react';
import { Scale, Eye } from 'lucide-react';
import { ikUrl } from '../lib/imagekit';
import { useNavigate } from 'react-router-dom';
import { useComparison } from '../hooks/useComparison';

export default function CarCard({ car, isComparing, onToggleCompare }) {
  const navigate = useNavigate();
  const { toggleCompare, isComparing: isComparingHook } = useComparison();
  
  const activeComparing = isComparing !== undefined ? isComparing : isComparingHook(car.id);
  const handleToggle = () => {
    if (onToggleCompare) {
      onToggleCompare(car);
    } else {
      toggleCompare(car.id);
    }
  };
  return (
    <div className="studio-card rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between group border border-white/10 bg-[#090a0d] shadow-2xl">
      
      {/* Top Image Container (Dominant Photo Display) */}
      <div 
        className="relative h-52 sm:h-72 overflow-hidden bg-black cursor-pointer"
        onClick={() => {
          navigate(`/inventory/${car.slug}`);
        }}
      >
        <img
          src={ikUrl(car.images?.[0], { width: 640, height: 480, quality: 75 })}
          alt={car.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#090a0d] via-transparent to-black/20 pointer-events-none" />

        {/* Brand Logo Badge */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-black/70 backdrop-blur-md border border-white/10">
          <img src={car.brandLogo} alt={car.brand} className="h-3.5 sm:h-4 w-auto object-contain" />
        </div>
      </div>

      {/* Content Body */}
      <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between space-y-2.5 sm:space-y-3">
        
        <div>
          <div className="flex items-center justify-between text-[9px] sm:text-xs text-zinc-400 font-semibold mb-0.5">
            <span>{car.year} • {car.fuelType}</span>
            <span>{car.mileageKms}</span>
          </div>

          <h3 className="text-base sm:text-xl font-bold text-white font-heading group-hover:text-zinc-300 transition-colors leading-tight">
            {car.name}
          </h3>
          <p className="text-[10px] sm:text-xs text-zinc-400 line-clamp-1 mt-0.5 font-mulish">{car.subtitle}</p>
        </div>

        {/* Clean Spec Indicators */}
        <div className="grid grid-cols-3 gap-1 sm:gap-2 py-1.5 sm:py-2 border-y border-white/10 text-center">
          <div className="p-1 sm:p-2 rounded-md sm:rounded-xl bg-white/5">
            <span className="text-[8px] sm:text-[9px] uppercase text-zinc-400 block font-bold">Power</span>
            <span className="text-[10px] sm:text-xs font-bold text-white">{car.horsepower}</span>
          </div>

          <div className="p-1 sm:p-2 rounded-md sm:rounded-xl bg-white/5">
            <span className="text-[8px] sm:text-[9px] uppercase text-zinc-400 block font-bold">0-100</span>
            <span className="text-[10px] sm:text-xs font-bold text-white">{car.zeroToHundred}</span>
          </div>

          <div className="p-1 sm:p-2 rounded-md sm:rounded-xl bg-white/5">
            <span className="text-[8px] sm:text-[9px] uppercase text-zinc-400 block font-bold">Owner</span>
            <span className="text-[10px] sm:text-xs font-bold text-white">{car.owners}st Owner</span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="flex items-center justify-between pt-0.5">
          <div>
            <span className="text-[8px] sm:text-[9px] uppercase text-zinc-400 block tracking-wider font-semibold">Offer Price</span>
            <span className="text-base sm:text-xl font-black font-mono text-white">{car.price}</span>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <button
              onClick={handleToggle}
              title={activeComparing ? "Remove from compare" : "Add to compare"}
              className={`p-1.5 sm:p-2.5 rounded-full border transition-all ${
                activeComparing
                  ? 'bg-white text-black border-white'
                  : 'bg-black border-white/20 text-white hover:bg-white/10'
              }`}
            >
              <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <button
              onClick={() => {
                navigate(`/inventory/${car.slug}`);
              }}
              className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white text-black font-extrabold text-[10px] sm:text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center space-x-1 sm:space-x-1.5 shadow-md"
            >
              <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Specs</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
