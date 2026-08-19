import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CarCard from '../components/CarCard';
import CarCompare from '../components/CarCompare';
import { useCars } from '../hooks/useCars';
import { usePageTracker } from '../hooks/usePageTracker';
import { BRAND_LOGOS } from '../data/cars';
import { Search, Filter, X } from 'lucide-react';

// Dual Handle Range Slider Component
function DualRangeSlider({ min, max, valueMin, valueMax, onChangeMin, onChangeMax, step, formatLabel }) {
  const percentMin = ((valueMin - min) / (max - min)) * 100;
  const percentMax = ((valueMax - min) / (max - min)) * 100;

  return (
    <div className="space-y-2 pt-1 pb-2">
      <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
        <span>Min: {formatLabel(valueMin)}</span>
        <span>Max: {formatLabel(valueMax)}</span>
      </div>

      <div className="relative w-full h-6 flex items-center">
        {/* Underlay Track */}
        <div className="absolute inset-x-0 h-1 bg-zinc-850 rounded-lg pointer-events-none" />

        {/* Selected Colored Range Track */}
        <div 
          className="absolute h-1 bg-gradient-to-r from-amber-600 to-amber-400 rounded-lg pointer-events-none" 
          style={{
            left: `${percentMin}%`,
            right: `${100 - percentMax}%`
          }}
        />

        {/* Min Input Slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMin}
          onChange={(e) => {
            const val = Math.min(Number(e.target.value), valueMax - step);
            onChangeMin(val);
          }}
          className="absolute w-full appearance-none bg-transparent pointer-events-none cursor-pointer h-1 outline-none select-none z-20
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125
            [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-500 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-black [&::-moz-range-thumb]:shadow-lg"
        />

        {/* Max Input Slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMax}
          onChange={(e) => {
            const val = Math.max(Number(e.target.value), valueMin + step);
            onChangeMax(val);
          }}
          className="absolute w-full appearance-none bg-transparent pointer-events-none cursor-pointer h-1 outline-none select-none z-30
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125
            [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-amber-500 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-black [&::-moz-range-thumb]:shadow-lg"
        />
      </div>
    </div>
  );
}

export default function InventoryPage() {
  usePageTracker('/inventory');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const formatPrice = (val) => {
    if (!val) return '₹ 0';
    const num = Number(val);
    if (num >= 15000000) return '₹ 1.5 Cr+';
    if (num >= 10000000) {
      return `₹ ${(num / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
    }
    return `₹ ${(num / 100000).toFixed(2).replace(/\.00$/, '')} Lakh`;
  };

  const formatKms = (val) => {
    if (!val) return '0 km';
    return `${Number(val).toLocaleString('en-IN')} km`;
  };

  const { cars } = useCars();
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeBrand, setActiveBrand] = useState(searchParams.get('brand') || null);
  
  useEffect(() => {
    const brandParam = searchParams.get('brand');
    if (brandParam) {
      setActiveBrand(brandParam);
    }
  }, [searchParams]);
  
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  
  const [minKms, setMinKms] = useState('');
  const [maxKms, setMaxKms] = useState('');

  const [minYear, setMinYear] = useState('');
  const [maxYear, setMaxYear] = useState('');

  const [activeFuel, setActiveFuel] = useState('');
  const [activeTrans, setActiveTrans] = useState('');
  const [activeOwners, setActiveOwners] = useState('');
  const [activeLocation, setActiveLocation] = useState('');
  const [activeSection, setActiveSection] = useState(null);

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Dynamic filter lists derived from cars data
  const sortedBrands = useMemo(() => {
    const dbBrands = Array.from(new Set(cars.map(c => c.brand).filter(Boolean)));
    const dbBrandsSet = new Set(dbBrands);
    
    const findLogo = (bName) => {
      if (bName === 'Mercedes-Benz') return BRAND_LOGOS.find(l => l.name === 'Mercedes') || null;
      if (bName === 'Mini') return BRAND_LOGOS.find(l => l.name === 'Mini Cooper') || null;
      return BRAND_LOGOS.find(l => l.name === bName) || null;
    };

    const inShowroom = dbBrands.map(bName => {
      const logoInfo = findLogo(bName);
      return {
        name: bName,
        icon: logoInfo ? logoInfo.icon : '',
        isLocal: logoInfo ? logoInfo.isLocal : false,
        inStock: true
      };
    }).sort((a, b) => a.name.localeCompare(b.name));

    const representedLogos = new Set(dbBrands.map(bName => {
      if (bName === 'Mercedes-Benz') return 'Mercedes';
      if (bName === 'Mini') return 'Mini Cooper';
      return bName;
    }));

    const byCommission = BRAND_LOGOS.filter(logo => !representedLogos.has(logo.name)).map(logo => {
      return {
        name: logo.name,
        icon: logo.icon,
        isLocal: logo.isLocal,
        inStock: false
      };
    }).sort((a, b) => a.name.localeCompare(b.name));

    return { inShowroom, byCommission };
  }, [cars]);

  const fuelTypes = useMemo(() => {
    return Array.from(new Set(cars.map(c => c.fuelType).filter(Boolean)));
  }, [cars]);

  const transmissions = useMemo(() => {
    return Array.from(new Set(cars.map(c => c.transmission).filter(Boolean)));
  }, [cars]);

  const ownersList = useMemo(() => {
    return Array.from(new Set(cars.map(c => c.owners).filter(n => n != null))).sort((a, b) => a - b);
  }, [cars]);

  const priceValues = useMemo(() => {
    const validPrices = cars.map(c => c.priceRaw).filter(p => p && p > 0);
    return {
      min: validPrices.length ? Math.min(...validPrices) : 500000,
      max: 15000000
    };
  }, [cars]);

  const mileageValues = useMemo(() => {
    const parseKms = (kmStr) => parseInt((kmStr || '0').replace(/\D/g, ''));
    const validKms = cars.map(c => parseKms(c.mileageKms)).filter(k => k > 0);
    if (validKms.length === 0) return { min: 0, max: 200000 };
    return {
      min: Math.min(...validKms),
      max: Math.max(...validKms)
    };
  }, [cars]);

  const yearValues = useMemo(() => {
    const validYears = cars.map(c => c.year).filter(y => y > 0);
    return {
      min: validYears.length ? Math.min(...validYears) : 2004,
      max: 2026
    };
  }, [cars]);

  // Filter Logic
  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      // 1. Search Term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const match = car.name.toLowerCase().includes(term) || car.brand.toLowerCase().includes(term);
        if (!match) return false;
      }
      
      // 2. Brand
      if (activeBrand && car.brand !== activeBrand) return false;

      // 3. Price
      if (minPrice && car.priceRaw < parseInt(minPrice)) return false;
      if (maxPrice && parseInt(maxPrice) < 15000000 && car.priceRaw > parseInt(maxPrice)) return false;

      // 4. Kilometers (Assuming mileageKms is a string like "9,400 km", parse it to int)
      const parseKms = (kmStr) => parseInt((kmStr || '0').replace(/\D/g, ''));
      const carKms = parseKms(car.mileageKms);
      if (minKms && carKms < parseInt(minKms)) return false;
      if (maxKms && carKms > parseInt(maxKms)) return false;

      // 5. Year
      if (minYear && car.year < parseInt(minYear)) return false;
      if (maxYear && car.year > parseInt(maxYear)) return false;

      // 6. Fuel Type
      if (activeFuel && car.fuelType !== activeFuel) return false;

      // 7. Transmission
      if (activeTrans && car.transmission !== activeTrans) return false;

      // 8. Owners
      if (activeOwners && car.owners !== parseInt(activeOwners)) return false;

      // 9. Location
      if (activeLocation && car.location !== activeLocation) return false;

      return true;
    });
  }, [cars, searchTerm, activeBrand, minPrice, maxPrice, minKms, maxKms, minYear, maxYear, activeFuel, activeTrans, activeOwners, activeLocation]);

  // Handlers
  const handleToggleCompare = (car) => {
    if (compareList.some((c) => c.id === car.id)) {
      setCompareList(compareList.filter((c) => c.id !== car.id));
    } else {
      const maxCars = window.innerWidth < 768 ? 2 : 3;
      if (compareList.length >= maxCars) {
        alert(`You can compare a maximum of ${maxCars} vehicles at a time on your current screen.`);
        return;
      }
      setCompareList([...compareList, car]);
      setShowCompareModal(true);
    }
  };

  const handleRemoveFromCompare = (id) => {
    const updated = compareList.filter((c) => c.id !== id);
    setCompareList(updated);
    if (updated.length === 0) setShowCompareModal(false);
  };

  const clearFilters = () => {
    setActiveBrand(null);
    setMinPrice('');
    setMaxPrice('');
    setMinKms('');
    setMaxKms('');
    setMinYear('');
    setMaxYear('');
    setActiveFuel('');
    setActiveTrans('');
    setActiveOwners('');
    setActiveLocation('');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-[#08090c] text-slate-100 font-mulish selection:bg-white selection:text-black flex flex-col">
      <Navbar 
        compareCount={compareList.length}
        onOpenCompare={() => setShowCompareModal(true)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      
      <main className="flex-1 pt-24 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto w-full flex flex-col lg:flex-row gap-8 pb-20">
        
        {/* Mobile Header & Filter Toggle */}
        <div className="flex lg:hidden items-center justify-between mb-6">
          <h1 className="text-2xl font-black font-heading uppercase tracking-tight text-white">Inventory</h1>
          <button 
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-colors"
          >
            <Filter size={16} />
            <span>Filters</span>
          </button>
        </div>

        {/* OVERLAY FOR MOBILE DRAWER */}
        {showMobileFilters && (
          <div 
            className="fixed inset-0 bg-black/80 z-[60] lg:hidden backdrop-blur-sm"
            onClick={() => setShowMobileFilters(false)}
          />
        )}

        {/* LEFT SIDEBAR FILTERS (Drawer on Mobile, Sticky Sidebar on Desktop) */}
        <aside className={`
          fixed inset-y-0 left-0 z-[70] w-[85vw] max-w-sm bg-[#0c0d11] border-r border-white/10 p-6 overflow-y-auto transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:z-0 lg:w-60 lg:shrink-0 lg:bg-transparent lg:border-none lg:p-0 lg:overflow-visible
          ${showMobileFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="lg:bg-[#0c0d11]/80 lg:border lg:border-white/10 lg:rounded-3xl lg:p-5 lg:sticky lg:top-28 lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:overscroll-contain custom-sidebar-scroll space-y-4">
            
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <h2 className="font-heading font-black text-sm uppercase tracking-widest text-white">Filters</h2>
              <div className="flex items-center space-x-4">
                <button onClick={clearFilters} className="text-[10px] text-zinc-400 hover:text-white uppercase font-bold tracking-widest transition-colors">
                  Clear All
                </button>
                <button 
                  onClick={() => setShowMobileFilters(false)} 
                  className="lg:hidden p-1.5 text-zinc-400 hover:text-white bg-white/5 rounded-full"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Accordions */}
            <div className="space-y-1">
              
              {/* 1. MAKE Accordion */}
              <div className="border-b border-white/5 pb-2">
                <button
                  onClick={() => setActiveSection(activeSection === 'make' ? null : 'make')}
                  className="flex items-center justify-between w-full py-2.5 text-left text-xs font-bold uppercase tracking-widest text-zinc-300 hover:text-white transition-colors"
                >
                  <span>Make</span>
                  <span className="text-[10px] text-zinc-500 font-bold">{activeSection === 'make' ? '−' : '+'}</span>
                </button>
                {activeSection === 'make' && (
                  <div className="pt-2 pb-2 space-y-4 max-h-56 overflow-y-auto custom-sidebar-scroll pr-1">
                    {/* In Showroom brands */}
                    {sortedBrands.inShowroom.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest block mb-1">In Showroom</span>
                        {sortedBrands.inShowroom.map(brand => (
                          <button
                            key={brand.name}
                            onClick={() => {
                              const newBrand = activeBrand === brand.name ? null : brand.name;
                              setActiveBrand(newBrand);
                              setSearchParams(newBrand ? { brand: newBrand } : {});
                            }}
                            className={`flex items-center justify-between w-full py-1 text-left text-xs transition-colors ${
                              activeBrand === brand.name ? 'text-amber-500 font-extrabold' : 'text-zinc-400 hover:text-white'
                            }`}
                          >
                            <span>{brand.name}</span>
                            <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                              activeBrand === brand.name ? 'border-amber-500 bg-amber-500/10' : 'border-zinc-800'
                            }`}>
                              {activeBrand === brand.name && <div className="w-1.5 h-1.5 rounded-sm bg-amber-500" />}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {/* Other brands */}
                    {sortedBrands.byCommission.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-white/5">
                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-1">By Commission</span>
                        {sortedBrands.byCommission.map(brand => (
                          <button
                            key={brand.name}
                            onClick={() => {
                              const newBrand = activeBrand === brand.name ? null : brand.name;
                              setActiveBrand(newBrand);
                              setSearchParams(newBrand ? { brand: newBrand } : {});
                            }}
                            className={`flex items-center justify-between w-full py-1 text-left text-xs transition-colors ${
                              activeBrand === brand.name ? 'text-amber-500 font-extrabold' : 'text-zinc-400 hover:text-white'
                            }`}
                          >
                            <span>{brand.name}</span>
                            <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                              activeBrand === brand.name ? 'border-amber-500 bg-amber-500/10' : 'border-zinc-800'
                            }`}>
                              {activeBrand === brand.name && <div className="w-1.5 h-1.5 rounded-sm bg-amber-500" />}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 2. PRICE RANGE Accordion */}
              <div className="border-b border-white/5 pb-2">
                <button
                  onClick={() => setActiveSection(activeSection === 'price' ? null : 'price')}
                  className="flex items-center justify-between w-full py-2.5 text-left text-xs font-bold uppercase tracking-widest text-zinc-300 hover:text-white transition-colors"
                >
                  <span>Price Range</span>
                  <span className="text-[10px] text-zinc-500 font-bold">{activeSection === 'price' ? '−' : '+'}</span>
                </button>
                {activeSection === 'price' && (
                  <div className="pt-2 pb-3 space-y-3">
                    <DualRangeSlider
                      min={priceValues.min}
                      max={priceValues.max}
                      step={100000}
                      valueMin={minPrice !== '' ? parseInt(minPrice) : priceValues.min}
                      valueMax={maxPrice !== '' ? parseInt(maxPrice) : priceValues.max}
                      onChangeMin={(val) => setMinPrice(String(val))}
                      onChangeMax={(val) => setMaxPrice(String(val))}
                      formatLabel={formatPrice}
                    />
                    <div className="flex space-x-2">
                      <input 
                        type="number"
                        placeholder="Min price"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-[10px] text-zinc-400 font-mono focus:outline-none focus:border-amber-500/40"
                      />
                      <input 
                        type="number"
                        placeholder="Max price"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-[10px] text-zinc-400 font-mono focus:outline-none focus:border-amber-500/40"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 3. YEAR Accordion */}
              <div className="border-b border-white/5 pb-2">
                <button
                  onClick={() => setActiveSection(activeSection === 'year' ? null : 'year')}
                  className="flex items-center justify-between w-full py-2.5 text-left text-xs font-bold uppercase tracking-widest text-zinc-300 hover:text-white transition-colors"
                >
                  <span>Model Year</span>
                  <span className="text-[10px] text-zinc-500 font-bold">{activeSection === 'year' ? '−' : '+'}</span>
                </button>
                {activeSection === 'year' && (
                  <div className="pt-2 pb-3 space-y-3">
                    <DualRangeSlider
                      min={yearValues.min}
                      max={yearValues.max}
                      step={1}
                      valueMin={minYear !== '' ? parseInt(minYear) : yearValues.min}
                      valueMax={maxYear !== '' ? parseInt(maxYear) : yearValues.max}
                      onChangeMin={(val) => setMinYear(String(val))}
                      onChangeMax={(val) => setMaxYear(String(val))}
                      formatLabel={(val) => String(val)}
                    />
                    <div className="flex space-x-2">
                      <input 
                        type="number"
                        placeholder="Min year"
                        value={minYear}
                        onChange={(e) => setMinYear(e.target.value)}
                        className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-[10px] text-zinc-400 font-mono focus:outline-none focus:border-amber-500/40"
                      />
                      <input 
                        type="number"
                        placeholder="Max year"
                        value={maxYear}
                        onChange={(e) => setMaxYear(e.target.value)}
                        className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-[10px] text-zinc-400 font-mono focus:outline-none focus:border-amber-500/40"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 4. FUEL TYPE Accordion */}
              <div className="border-b border-white/5 pb-2">
                <button
                  onClick={() => setActiveSection(activeSection === 'fuel' ? null : 'fuel')}
                  className="flex items-center justify-between w-full py-2.5 text-left text-xs font-bold uppercase tracking-widest text-zinc-300 hover:text-white transition-colors"
                >
                  <span>Fuel Type</span>
                  <span className="text-[10px] text-zinc-500 font-bold">{activeSection === 'fuel' ? '−' : '+'}</span>
                </button>
                {activeSection === 'fuel' && (
                  <div className="pt-1 pb-2 space-y-1 max-h-40 overflow-y-auto custom-sidebar-scroll">
                    {fuelTypes.map(fuel => (
                      <button
                        key={fuel}
                        onClick={() => setActiveFuel(activeFuel === fuel ? '' : fuel)}
                        className={`flex items-center justify-between w-full py-1 text-left text-xs transition-colors ${
                          activeFuel === fuel ? 'text-amber-500 font-extrabold' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        <span>{fuel}</span>
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                          activeFuel === fuel ? 'border-amber-500 bg-amber-500/10' : 'border-zinc-800'
                        }`}>
                          {activeFuel === fuel && <div className="w-1.5 h-1.5 rounded-sm bg-amber-500" />}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 5. TRANSMISSION Accordion */}
              <div className="border-b border-white/5 pb-2">
                <button
                  onClick={() => setActiveSection(activeSection === 'transmission' ? null : 'transmission')}
                  className="flex items-center justify-between w-full py-2.5 text-left text-xs font-bold uppercase tracking-widest text-zinc-300 hover:text-white transition-colors"
                >
                  <span>Transmission</span>
                  <span className="text-[10px] text-zinc-500 font-bold">{activeSection === 'transmission' ? '−' : '+'}</span>
                </button>
                {activeSection === 'transmission' && (
                  <div className="pt-1 pb-2 space-y-1">
                    {transmissions.map(trans => (
                      <button
                        key={trans}
                        onClick={() => setActiveTrans(activeTrans === trans ? '' : trans)}
                        className={`flex items-center justify-between w-full py-1 text-left text-xs transition-colors ${
                          activeTrans === trans ? 'text-amber-500 font-extrabold' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        <span>{trans}</span>
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                          activeTrans === trans ? 'border-amber-500 bg-amber-500/10' : 'border-zinc-800'
                        }`}>
                          {activeTrans === trans && <div className="w-1.5 h-1.5 rounded-sm bg-amber-500" />}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 6. MILEAGE Accordion */}
              <div className="border-b border-white/5 pb-2">
                <button
                  onClick={() => setActiveSection(activeSection === 'mileage' ? null : 'mileage')}
                  className="flex items-center justify-between w-full py-2.5 text-left text-xs font-bold uppercase tracking-widest text-zinc-300 hover:text-white transition-colors"
                >
                  <span>Mileage (Kms)</span>
                  <span className="text-[10px] text-zinc-500 font-bold">{activeSection === 'mileage' ? '−' : '+'}</span>
                </button>
                {activeSection === 'mileage' && (
                  <div className="pt-2 pb-3 space-y-3">
                    <DualRangeSlider
                      min={mileageValues.min}
                      max={mileageValues.max}
                      step={1000}
                      valueMin={minKms !== '' ? parseInt(minKms) : mileageValues.min}
                      valueMax={maxKms !== '' ? parseInt(maxKms) : mileageValues.max}
                      onChangeMin={(val) => setMinKms(String(val))}
                      onChangeMax={(val) => setMaxKms(String(val))}
                      formatLabel={formatKms}
                    />
                    <div className="flex space-x-2">
                      <input 
                        type="number"
                        placeholder="Min kms"
                        value={minKms}
                        onChange={(e) => setMinKms(e.target.value)}
                        className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-[10px] text-zinc-400 font-mono focus:outline-none focus:border-amber-500/40"
                      />
                      <input 
                        type="number"
                        placeholder="Max kms"
                        value={maxKms}
                        onChange={(e) => setMaxKms(e.target.value)}
                        className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-[10px] text-zinc-400 font-mono focus:outline-none focus:border-amber-500/40"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 7. OWNERS Accordion */}
              <div className="border-b border-white/5 pb-2">
                <button
                  onClick={() => setActiveSection(activeSection === 'owners' ? null : 'owners')}
                  className="flex items-center justify-between w-full py-2.5 text-left text-xs font-bold uppercase tracking-widest text-zinc-300 hover:text-white transition-colors"
                >
                  <span>Previous Owners</span>
                  <span className="text-[10px] text-zinc-500 font-bold">{activeSection === 'owners' ? '−' : '+'}</span>
                </button>
                {activeSection === 'owners' && (
                  <div className="pt-1 pb-2 space-y-1">
                    {ownersList.map(owner => (
                      <button
                        key={owner}
                        onClick={() => setActiveOwners(activeOwners === String(owner) ? '' : String(owner))}
                        className={`flex items-center justify-between w-full py-1 text-left text-xs transition-colors ${
                          activeOwners === String(owner) ? 'text-amber-500 font-extrabold' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        <span>{owner} {owner === 1 ? 'Owner' : 'Owners'}</span>
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                          activeOwners === String(owner) ? 'border-amber-500 bg-amber-500/10' : 'border-zinc-800'
                        }`}>
                          {activeOwners === String(owner) && <div className="w-1.5 h-1.5 rounded-sm bg-amber-500" />}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </aside>

        {/* RIGHT CONTENT: INVENTORY GRID */}
        <div className="flex-1 space-y-6">
          <div className="hidden lg:flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h1 className="text-3xl font-black font-heading uppercase tracking-tight text-white">Full Inventory</h1>
              <p className="text-xs text-zinc-400 mt-1 uppercase tracking-widest font-bold">
                Showing {filteredCars.length} Vehicles
              </p>
            </div>
          </div>

          {filteredCars.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-zinc-500 space-y-4">
              <Search size={48} className="opacity-20" />
              <p className="font-bold uppercase tracking-widest text-xs">No vehicles match your filters.</p>
              <button 
                onClick={clearFilters}
                className="px-6 py-2 rounded-full border border-white/10 text-white text-[10px] uppercase font-bold tracking-widest hover:bg-white/5"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  isComparing={compareList.some((c) => c.id === car.id)}
                  onToggleCompare={handleToggleCompare}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />

      {showCompareModal && compareList.length > 0 && (
        <CarCompare
          compareList={compareList}
          onRemoveFromCompare={handleRemoveFromCompare}
          onCloseCompare={() => setShowCompareModal(false)}
          onSelectCar={(car) => {
            setShowCompareModal(false);
            navigate(`/inventory/${car.slug}`);
          }}
          onToggleCompare={handleToggleCompare}
        />
      )}
    </div>
  );
}
