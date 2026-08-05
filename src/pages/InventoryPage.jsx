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

export default function InventoryPage() {
  usePageTracker('/inventory');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
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

  const [showMobileFilters, setShowMobileFilters] = useState(false);

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
      if (maxPrice && car.priceRaw > parseInt(maxPrice)) return false;

      // 4. Kilometers (Assuming mileageKms is a string like "9,400 km", parse it to int)
      const parseKms = (kmStr) => parseInt((kmStr || '0').replace(/\D/g, ''));
      const carKms = parseKms(car.mileageKms);
      if (minKms && carKms < parseInt(minKms)) return false;
      if (maxKms && carKms > parseInt(maxKms)) return false;

      // 5. Year
      if (minYear && car.year < parseInt(minYear)) return false;
      if (maxYear && car.year > parseInt(maxYear)) return false;

      return true;
    });
  }, [cars, searchTerm, activeBrand, minPrice, maxPrice, minKms, maxKms, minYear, maxYear]);

  // Handlers
  const handleToggleCompare = (car) => {
    if (compareList.some((c) => c.id === car.id)) {
      setCompareList(compareList.filter((c) => c.id !== car.id));
    } else {
      const maxCars = window.innerWidth < 768 ? 2 : 3;
      if (compareList.length >= maxCars) {
        alert(`You can compare a maximum of ${maxCars} supercars at a time on your current screen.`);
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
          lg:relative lg:translate-x-0 lg:z-0 lg:w-72 lg:shrink-0 lg:bg-transparent lg:border-none lg:p-0 lg:overflow-visible
          ${showMobileFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="lg:bg-[#0c0d11] lg:border lg:border-white/10 lg:rounded-3xl lg:p-6 lg:sticky lg:top-32 space-y-8">
            
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-black text-lg uppercase tracking-widest text-white">Filters</h2>
              <div className="flex items-center space-x-4">
                <button onClick={clearFilters} className="text-[10px] text-zinc-400 hover:text-white uppercase font-bold tracking-widest">
                  Clear All
                </button>
                <button 
                  onClick={() => setShowMobileFilters(false)} 
                  className="lg:hidden p-2 text-zinc-400 hover:text-white bg-white/5 rounded-full"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Brands */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Brands</h3>
              <div className="flex flex-wrap gap-2">
                {BRAND_LOGOS.map(brand => (
                  <button
                    key={brand.name}
                    onClick={() => {
                      const newBrand = activeBrand === brand.name ? null : brand.name;
                      setActiveBrand(newBrand);
                      if (newBrand) {
                        setSearchParams({ brand: newBrand });
                      } else {
                        setSearchParams({});
                      }
                    }}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-xl border transition-all ${
                      activeBrand === brand.name 
                        ? 'bg-white border-white text-black' 
                        : 'bg-black border-white/10 text-zinc-400 hover:border-white/30'
                    }`}
                  >
                    <img 
                      src={brand.icon} 
                      alt={brand.name} 
                      className="h-4 sm:h-5 w-auto object-contain"
                      style={
                        brand.isLocal
                          ? { filter: 'url(#remove-white)' }
                          : (activeBrand !== brand.name ? { filter: 'invert(1)' } : undefined)
                      }
                    />
                    <span className="text-[10px] font-extrabold uppercase tracking-widest">{brand.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-white/10" />

            {/* Price Range */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Price Range (₹)</h3>
              <div className="flex items-center space-x-3">
                <input 
                  type="number" 
                  placeholder="Min" 
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-white/30"
                />
                <span className="text-zinc-600">-</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-white/30"
                />
              </div>
            </div>

            <div className="h-px bg-white/10" />

            {/* Kilometers Range */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Mileage (Kms)</h3>
              <div className="flex items-center space-x-3">
                <input 
                  type="number" 
                  placeholder="Min" 
                  value={minKms}
                  onChange={(e) => setMinKms(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-white/30"
                />
                <span className="text-zinc-600">-</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  value={maxKms}
                  onChange={(e) => setMaxKms(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-white/30"
                />
              </div>
            </div>

            <div className="h-px bg-white/10" />

            {/* Year Range */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Model Year</h3>
              <div className="flex items-center space-x-3">
                <input 
                  type="number" 
                  placeholder="Min" 
                  value={minYear}
                  onChange={(e) => setMinYear(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-white/30"
                />
                <span className="text-zinc-600">-</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  value={maxYear}
                  onChange={(e) => setMaxYear(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-white/30"
                />
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
                Showing {filteredCars.length} Verified Supercars
              </p>
            </div>
          </div>

          {filteredCars.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-zinc-500 space-y-4">
              <Search size={48} className="opacity-20" />
              <p className="font-bold uppercase tracking-widest text-xs">No supercars match your filters.</p>
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
