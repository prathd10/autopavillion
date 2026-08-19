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
    <div className={`studio-card h-full rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between group bg-[#090a0d] shadow-2xl transition-all duration-300 ${
      car.status === 'sold'
        ? 'border border-red-800/40 hover:border-red-500/40 shadow-[0_4px_24px_rgba(239,68,68,0.03)]'
        : 'border border-white/10'
    }`}>
      
      {/* Top Image Container (Dominant Photo Display) */}
      <div 
        className="relative aspect-[1264/846] w-full overflow-hidden bg-[#050608] cursor-pointer"
        onClick={() => {
          navigate(`/inventory/${car.slug}`);
        }}
      >
        <img
          src={ikUrl(car.images?.[0], { width: 640, height: 480, quality: 75 })}
          alt={car.name}
          className={`w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-700 ease-out ${
            car.status === 'sold' ? 'opacity-85 grayscale-[35%] contrast-[0.95]' : ''
          }`}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#090a0d] via-transparent to-black/20 pointer-events-none" />
        
        {car.status === 'sold' && (
          <div className="absolute inset-0 bg-black/15 pointer-events-none" />
        )}

        {/* SOLD Badge Overlay */}
        {car.status === 'sold' && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 px-2.5 py-0.5 bg-red-950/80 backdrop-blur-md text-red-200 text-[8px] font-black uppercase tracking-widest rounded border border-red-700/30 shadow-[0_4px_12px_rgba(0,0,0,0.5)] z-10">
            SOLD
          </div>
        )}

      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
        
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

        {/* Price & Action Row */}
        <div className="flex items-center justify-between pt-0.5">
          {car.status === 'sold' ? (
            <div className="flex-1 mr-4">
              <div className="w-full py-2.5 bg-[#170e10] border border-red-900/40 rounded-xl text-center shadow-inner">
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-red-500/90 font-mono">
                  SOLD
                </span>
              </div>
            </div>
          ) : (
            <div>
              <span className="text-[8px] sm:text-[9px] uppercase text-zinc-400 block tracking-wider font-semibold">Offer Price</span>
              <span className="text-base sm:text-xl font-black font-mono text-white">{car.price}</span>
            </div>
          )}

          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
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
