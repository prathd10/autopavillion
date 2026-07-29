import React from 'react';
import { X, Scale, Trash2, ArrowRight } from 'lucide-react';

export default function CarCompare({ compareList, onRemoveFromCompare, onCloseCompare, onSelectCar }) {
  if (!compareList || compareList.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fadeIn text-white">
      <div className="relative w-full max-w-6xl bg-black border border-white/20 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#0a0a0a]">
          <div className="flex items-center space-x-3">
            <Scale className="w-5 h-5 text-white" />
            <div>
              <h2 className="text-lg font-bold text-white font-heading uppercase">Supercar Side-by-Side Comparison</h2>
              <p className="text-xs text-zinc-400">Comparing specs & pricing</p>
            </div>
          </div>

          <button
            onClick={onCloseCompare}
            className="p-2 rounded-full bg-white/10 hover:bg-white hover:text-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-x-auto overflow-y-auto space-y-6 bg-[#070707]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {compareList.map((car) => (
              <div key={car.id} className="mono-panel p-5 rounded-2xl border border-white/15 space-y-4 relative">
                
                <button
                  onClick={() => onRemoveFromCompare(car.id)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-white/10 hover:bg-white hover:text-black text-white transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <div className="h-40 rounded-xl overflow-hidden bg-black mb-3">
                  <img src={car.images[0]} alt={car.name} className="w-full h-full object-cover" />
                </div>

                <div>
                  <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider">
                    {car.brand} • {car.year}
                  </span>
                  <h3 className="text-lg font-bold text-white font-heading">{car.name}</h3>
                  <span className="text-xl font-black font-mono text-white block mt-1">{car.price}</span>
                </div>

                <div className="space-y-2 text-xs border-t border-white/10 pt-3">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-zinc-400">Horsepower</span>
                    <span className="font-bold text-white">{car.horsepower}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-zinc-400">0 - 100 km/h</span>
                    <span className="font-bold text-white">{car.zeroToHundred}</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-zinc-400">Top Speed</span>
                    <span className="font-bold text-white">{car.topSpeed}</span>
                  </div>

                  <div className="flex justify-between py-1">
                    <span className="text-zinc-400">Odometer</span>
                    <span className="font-bold text-white">{car.mileageKms}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onCloseCompare();
                    onSelectCar(car);
                  }}
                  className="w-full py-2.5 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center justify-center space-x-1"
                >
                  <span>Open 360° Inspector</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
