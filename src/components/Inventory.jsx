import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Car, RefreshCw } from 'lucide-react';
import CarCard from './CarCard';

export default function Inventory({
  cars,
  onSelectCar,
  compareList,
  onToggleCompare,
  activeBrandFilter,
  setActiveBrandFilter,
  searchTerm,
  setSearchTerm
}) {
  const [selectedBodyType, setSelectedBodyType] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [maxPriceFilter, setMaxPriceFilter] = useState(80000000);

  const bodyTypes = ['All', 'Coupe', 'SUV', 'Sedan'];

  const filteredCars = useMemo(() => {
    return cars
      .filter((car) => {
        const query = (searchTerm || '').toLowerCase();
        const matchesSearch =
          car.name.toLowerCase().includes(query) ||
          car.brand.toLowerCase().includes(query) ||
          car.engine.toLowerCase().includes(query);

        const matchesBrand = activeBrandFilter ? car.brand.toLowerCase() === activeBrandFilter.toLowerCase() : true;
        const matchesBody = selectedBodyType === 'All' ? true : car.bodyType === selectedBodyType;
        const matchesPrice = car.priceRaw <= maxPriceFilter;

        return matchesSearch && matchesBrand && matchesBody && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price-high') return b.priceRaw - a.priceRaw;
        if (sortBy === 'price-low') return a.priceRaw - b.priceRaw;
        if (sortBy === 'power-high') return b.hpRaw - a.hpRaw;
        if (sortBy === 'fastest') return a.zeroToHundredRaw - b.zeroToHundredRaw;
        return b.featured ? 1 : -1;
      });
  }, [cars, searchTerm, activeBrandFilter, selectedBodyType, maxPriceFilter, sortBy]);

  return (
    <section id="inventory" className="py-20 bg-black text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center space-x-2 text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-400 mb-2">
              <Car className="w-4 h-4 text-white" />
              <span>Supercar Store Catalog</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-heading uppercase">
              EXOTIC & LUXURY <span className="text-zinc-400 font-extralight">SHOWROOM</span>
            </h2>
          </div>

          <div className="mt-4 md:mt-0 text-zinc-400 text-xs sm:text-sm font-mulish">
            Showing <strong className="text-white font-mono text-base">{filteredCars.length}</strong> of{' '}
            <strong className="text-white font-mono text-base">{cars.length}</strong> Verified Supercars
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="mono-panel p-6 rounded-2xl border border-white/10 mb-10 space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            
            {/* Search */}
            <div className="lg:col-span-6 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={searchTerm || ''}
                onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
                placeholder="Search Porsche, Lamborghini V10, AMG GT..."
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-black border border-white/15 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm && setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Body Type Tabs */}
            <div className="lg:col-span-4 flex items-center space-x-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              {bodyTypes.map((bt) => (
                <button
                  key={bt}
                  onClick={() => setSelectedBodyType(bt)}
                  className={`px-4 py-2.5 rounded-full text-xs font-bold uppercase transition-all whitespace-nowrap ${
                    selectedBodyType === bt
                      ? 'bg-white text-black'
                      : 'bg-black hover:bg-white/10 border border-white/15 text-zinc-300'
                  }`}
                >
                  {bt}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="lg:col-span-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-black border border-white/15 text-white text-xs font-bold uppercase focus:outline-none focus:border-white"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
                <option value="power-high">Power: Max HP</option>
                <option value="fastest">Acceleration: 0-100</option>
              </select>
            </div>

          </div>

          {/* Budget Range Bar */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <SlidersHorizontal className="w-4 h-4 text-white" />
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Max Budget Cap:
              </span>
              <span className="text-xs font-mono font-bold text-white">
                ₹ {(maxPriceFilter / 10000000).toFixed(2)} Cr
              </span>
            </div>

            <input
              type="range"
              min="15000000"
              max="80000000"
              step="2500000"
              value={maxPriceFilter}
              onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
              className="w-full sm:w-80 accent-white cursor-pointer"
            />

            {(activeBrandFilter || selectedBodyType !== 'All' || searchTerm || maxPriceFilter < 80000000) && (
              <button
                onClick={() => {
                  setActiveBrandFilter(null);
                  setSelectedBodyType('All');
                  if (setSearchTerm) setSearchTerm('');
                  setMaxPriceFilter(80000000);
                  setSortBy('featured');
                }}
                className="text-xs text-zinc-400 hover:text-white underline font-semibold flex items-center space-x-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

        </div>

        {/* Supercar Product Grid */}
        {filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                onSelectCar={onSelectCar}
                isComparing={compareList.some((c) => c.id === car.id)}
                onToggleCompare={onToggleCompare}
              />
            ))}
          </div>
        ) : (
          <div className="mono-panel p-12 text-center rounded-3xl border border-white/10 max-w-lg mx-auto">
            <Car className="w-10 h-10 text-white mx-auto mb-4 animate-bounce" />
            <h3 className="text-xl font-bold text-white mb-2">No Supercars Found</h3>
            <p className="text-xs text-zinc-400 mb-6">
              No vehicles matched your filter parameters. Try resetting your search terms.
            </p>
            <button
              onClick={() => {
                setActiveBrandFilter(null);
                setSelectedBodyType('All');
                if (setSearchTerm) setSearchTerm('');
                setMaxPriceFilter(80000000);
              }}
              className="px-6 py-3 rounded-full bg-white text-black font-bold text-xs uppercase tracking-widest"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
