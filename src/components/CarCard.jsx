import React from 'react';
import { ShieldCheck, Zap, Gauge, Rotate3D, Scale, Eye } from 'lucide-react';

export default function CarCard({ car, onSelectCar, isComparing, onToggleCompare }) {
  return (
    <div className="studio-card rounded-3xl overflow-hidden flex flex-col justify-between group">
      
      {/* Top Image Container */}
      <div className="relative h-60 sm:h-64 overflow-hidden bg-black">
        <img
          src={car.images[0]}
          alt={car.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f15] via-transparent to-black/30 pointer-events-none" />

        {/* Brand Logo Badge */}
        <div className="absolute top-4 right-4 p-2 rounded-xl bg-black/70 backdrop-blur-md border border-white/10">
          <img src={car.brandLogo} alt={car.brand} className="h-4 w-auto object-contain filter invert contrast-200" />
        </div>

        {/* 360° Inspector Trigger Button */}
        <div className="absolute bottom-4 right-4 z-10">
          <button
            onClick={() => onSelectCar(car)}
            className="px-3.5 py-1.5 rounded-full bg-black/80 hover:bg-white hover:text-black border border-white/20 text-white text-xs font-semibold backdrop-blur-md transition-all flex items-center space-x-1.5"
          >
            <Rotate3D className="w-3.5 h-3.5" />
            <span>360° Inspector</span>
          </button>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        
        <div>
          <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold mb-1">
            <span>{car.year} • {car.fuelType}</span>
            <span>{car.mileageKms}</span>
          </div>

          <h3 className="text-xl font-bold text-white font-heading group-hover:text-zinc-300 transition-colors">
            {car.name}
          </h3>
          <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5 font-mulish">{car.subtitle}</p>
        </div>

        {/* Clean Spec Indicators */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/10 text-center">
          <div className="p-2 rounded-xl bg-white/5">
            <span className="text-[9px] uppercase text-zinc-400 block font-bold">Power</span>
            <span className="text-xs font-bold text-white">{car.horsepower}</span>
          </div>

          <div className="p-2 rounded-xl bg-white/5">
            <span className="text-[9px] uppercase text-zinc-400 block font-bold">0-100 km/h</span>
            <span className="text-xs font-bold text-white">{car.zeroToHundred}</span>
          </div>

          <div className="p-2 rounded-xl bg-white/5">
            <span className="text-[9px] uppercase text-zinc-400 block font-bold">Owner</span>
            <span className="text-xs font-bold text-white">{car.owners}st Owner</span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="text-[9px] uppercase text-zinc-400 block tracking-wider font-semibold">Offer Price</span>
            <span className="text-xl font-black font-mono text-white">{car.price}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleCompare(car)}
              title={isComparing ? "Remove from compare" : "Add to compare"}
              className={`p-2.5 rounded-full border transition-all ${
                isComparing
                  ? 'bg-white text-black border-white'
                  : 'bg-black border-white/20 text-white hover:bg-white/10'
              }`}
            >
              <Scale className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSelectCar(car)}
              className="px-4 py-2.5 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center space-x-1.5 shadow-md"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Specs</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
