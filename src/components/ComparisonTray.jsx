import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Scale, X, ArrowRight, Trash2 } from 'lucide-react';
import { useComparison } from '../hooks/useComparison';
import { ikUrl } from '../lib/imagekit';

export default function ComparisonTray() {
  const navigate = useNavigate();
  const location = useLocation();
  const { compareIds, removeCompare, clearCompare } = useComparison();
  const [loadedCars, setLoadedCars] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sync details of selected IDs
  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const promises = compareIds.map(async (id) => {
          const cached = loadedCars.find(c => c.id === id);
          if (cached) return cached;
          
          const baseUrl = window.location.origin;
          const res = await fetch(`${baseUrl}/api/vehicles/details?id=${encodeURIComponent(id)}`);
          if (!res.ok) {
            console.error(`HTTP error fetching details for ${id}! status: ${res.status}`);
            return null;
          }
          const contentType = res.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            console.error(`Non-JSON response fetching details for ${id}`);
            return null;
          }
          return await res.json();
        });
        const results = await Promise.all(promises);
        setLoadedCars(results.filter(Boolean));
      } catch (err) {
        console.error('Error fetching compare details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (compareIds.length > 0) {
      fetchCars();
    } else {
      setLoadedCars([]);
    }
  }, [compareIds]);

  // Don't show tray on home page, comparison page itself, or if no items are compared
  if (location.pathname === '/' || location.pathname === '/compare' || compareIds.length === 0) {
    return null;
  }

  const handleCompareClick = () => {
    navigate(`/compare?cars=${compareIds.join(',')}`);
    window.scrollTo(0, 0);
  };

  const slots = [0, 1]; // Max 2 vehicles for V1

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-4xl animate-slideUp">
      <div className="bg-[#090a0d]/90 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Title / Action Info */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="p-2 bg-white/5 rounded-xl border border-white/10 hidden sm:block">
            <Scale className="w-5 h-5 text-zinc-400" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">Compare Vehicles</h4>
            <p className="text-[10px] text-zinc-400">
              {compareIds.length} / 2 selected for showdown
            </p>
          </div>
        </div>

        {/* Selected Vehicles Slots Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full md:w-auto flex-1 max-w-lg">
          {slots.map((idx) => {
            const carId = compareIds[idx];
            const car = loadedCars.find(c => c.id === carId);

            if (car) {
              const imageSrc = car.images?.[0];
              const displayImage = imageSrc && !imageSrc.startsWith('http') 
                ? ikUrl(imageSrc, { width: 100, height: 75, quality: 70 })
                : imageSrc;

              return (
                <div 
                  key={carId} 
                  className="bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-2 sm:p-2.5 flex items-center space-x-2.5 relative group animate-fadeIn"
                >
                  <button
                    onClick={() => removeCompare(carId)}
                    className="absolute -top-1.5 -right-1.5 p-1 bg-black border border-white/20 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors z-10"
                    title="Remove"
                  >
                    <X className="w-3 h-3" />
                  </button>

                  <div className="w-10 h-8 sm:w-14 sm:h-10 bg-black rounded-lg overflow-hidden shrink-0 border border-white/5">
                    {displayImage ? (
                      <img src={displayImage} alt={car.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                        <Scale className="w-4 h-4 text-zinc-600" />
                      </div>
                    )}
                  </div>

                  <div className="overflow-hidden min-w-0 pr-2">
                    <span className="text-[8px] uppercase tracking-wider text-zinc-500 font-bold block truncate">
                      {car.brand}
                    </span>
                    <span className="text-[10px] sm:text-xs font-bold text-white block truncate">
                      {car.name}
                    </span>
                  </div>
                </div>
              );
            }

            return (
              <div 
                key={`empty-${idx}`} 
                className="border border-dashed border-white/10 rounded-xl sm:rounded-2xl p-2 sm:p-2.5 flex items-center justify-center space-x-2 text-zinc-600 bg-transparent min-h-[44px] sm:min-h-[52px]"
              >
                <Scale className="w-3.5 h-3.5" />
                <span className="text-[10px] sm:text-xs font-medium">Slot Available</span>
              </div>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2.5 w-full md:w-auto shrink-0 justify-end md:justify-start">
          <button
            onClick={clearCompare}
            className="p-2 sm:p-3 text-[10px] sm:text-xs uppercase font-extrabold tracking-wider text-zinc-400 hover:text-white transition-colors"
          >
            Clear
          </button>
          
          <button
            onClick={handleCompareClick}
            disabled={compareIds.length < 1}
            className="px-4 py-2.5 sm:px-5 sm:py-3 rounded-full bg-white text-black font-extrabold text-[10px] sm:text-xs uppercase tracking-widest flex items-center space-x-2 hover:bg-zinc-200 transition-all shadow-lg hover:scale-105 disabled:opacity-50 disabled:pointer-events-none"
          >
            <span>Compare Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
