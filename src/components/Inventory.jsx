import React, { useState, useMemo } from 'react';
import { Car, ChevronLeft, ChevronRight, Sparkles, ArrowUpRight } from 'lucide-react';
import CarCard from './CarCard';
import { BRAND_LOGOS } from '../data/cars';

export default function Inventory({
  cars,
  onSelectCar,
  compareList,
  onToggleCompare,
  activeBrandFilter,
  setActiveBrandFilter,
  onOpenFullCatalog
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Touch Swipe tracking
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Home page showcase uses all available cars
  const filteredCars = cars;
  const total = filteredCars.length;

  // Circular loop navigation
  const handleNext = () => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  // Touch gesture handlers for mobile swiping
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) handleNext();
    if (isRightSwipe) handlePrev();
  };

  // Compute circular slice of cars to display (3 on desktop, 1 on mobile)
  const visibleCars = useMemo(() => {
    if (total === 0) return [];
    if (total === 1) return [{ car: filteredCars[0], originalIndex: 0 }];
    if (total === 2) {
      return [
        { car: filteredCars[currentIndex % total], originalIndex: currentIndex % total },
        { car: filteredCars[(currentIndex + 1) % total], originalIndex: (currentIndex + 1) % total }
      ];
    }
    return [
      { car: filteredCars[currentIndex % total], originalIndex: currentIndex % total },
      { car: filteredCars[(currentIndex + 1) % total], originalIndex: (currentIndex + 1) % total },
      { car: filteredCars[(currentIndex + 2) % total], originalIndex: (currentIndex + 2) % total }
    ];
  }, [filteredCars, currentIndex, total]);

  return (
    <section id="inventory" className="py-20 bg-black text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Center-Aligned Section Header */}
        <div className="flex flex-col items-center justify-center text-center mb-10 pb-6 border-b border-white/10 space-y-2">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-heading uppercase">
            EXOTIC & LUXURY <span className="text-zinc-400 font-extralight">SHOWROOM</span>
          </h2>

          <div className="text-zinc-400 text-xs sm:text-sm font-mulish pt-1">
            Showing <strong className="text-white font-mono text-base">{total > 0 ? (currentIndex % total) + 1 : 0}</strong> of{' '}
            <strong className="text-white font-mono text-base">{total}</strong> Verified Supercars
          </div>

          <div className="text-zinc-400 font-bold uppercase tracking-[0.25em] text-[10px] sm:text-xs pt-1">
            Swipe to Browse
          </div>
        </div>

        {/* CLEAN CIRCULAR SWIPE LOOP CAROUSEL */}
        {total > 0 && (
          <div className="relative space-y-6 mb-12">

            {/* Swipeable Active Carousel Area */}
            <div
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              className="relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-500 ease-out">
                {visibleCars.map((item, idx) => (
                  <div 
                    key={`${item.car.id}-${idx}`}
                    className={`${idx > 0 ? 'hidden md:block' : 'block'} ${idx === 2 ? 'hidden lg:block' : ''}`}
                  >
                    <CarCard
                      car={item.car}
                      onSelectCar={onSelectCar}
                      isComparing={compareList.some((c) => c.id === item.car.id)}
                      onToggleCompare={onToggleCompare}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Infinite Loop Pagination Indicator Bar */}
            <div className="flex items-center justify-center space-x-2 pt-4">
              {filteredCars.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`transition-all duration-300 ${
                    idx === currentIndex % total
                      ? 'w-8 h-2 bg-white rounded-full'
                      : 'w-2 h-2 bg-white/20 hover:bg-white/50 rounded-full'
                  }`}
                  title={`Go to supercar ${idx + 1}`}
                />
              ))}
            </div>

            {/* PROMINENT END CTA BUTTON TO VIEW ENTIRE INVENTORY */}
            <div className="pt-8 flex justify-center">
              <button
                onClick={() => {
                  if (onOpenFullCatalog) {
                    onOpenFullCatalog();
                  } else {
                    const el = document.getElementById('bespoke-sourcing');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-8 py-3.5 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-widest flex items-center space-x-3 hover:bg-zinc-200 transition-all duration-300 shadow-2xl hover:scale-105 group"
              >
                <span>View Entire Supercar Inventory</span>
                <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center group-hover:scale-110 group-hover:rotate-45 transition-transform duration-300">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </button>
            </div>

          </div>
        )}

        {/* RELOCATED BRAND LOGOS SLOW MARQUEE (RIGHT TO LEFT) */}
        <div className="pt-10 pb-4 border-t border-white/10 overflow-hidden relative w-full">
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee flex items-center space-x-12 shrink-0">
            {[...BRAND_LOGOS, ...BRAND_LOGOS, ...BRAND_LOGOS, ...BRAND_LOGOS].map((b, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (setActiveBrandFilter) setActiveBrandFilter(activeBrandFilter === b.name ? null : b.name);
                  setCurrentIndex(0);
                }}
                className="flex items-center space-x-2.5 shrink-0 opacity-60 hover:opacity-100 transition-opacity duration-300"
              >
                <img
                  src={b.icon}
                  alt={b.name}
                  className="h-4 sm:h-5 w-auto object-contain filter invert contrast-200"
                />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-300">
                  {b.name}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
