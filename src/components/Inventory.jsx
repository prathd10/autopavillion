import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, ChevronLeft, ChevronRight, Sparkles, ArrowUpRight } from 'lucide-react';
import CarCard from './CarCard';
import { BRAND_LOGOS } from '../data/cars';

const FILTERED_BRAND_LOGOS = BRAND_LOGOS.filter(b => 
  !['rolls-royce', 'bentley', 'aston martin', 'porsche', 'lamborghini', 'ferrari', 'mclaren', 'bugatti']
    .includes(b.name.toLowerCase())
);

export default function Inventory({
  cars,
  compareList,
  onToggleCompare,
  activeBrandFilter,
  setActiveBrandFilter,
  onOpenFullCatalog,
  isHomePage,
  title = "CURATED SHOWROOM",
  hideMarquee = false
}) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const titleParts = title.split(' ');
  const firstWord = titleParts[0];
  const remainingWords = titleParts.slice(1).join(' ');

  // Pointer/Swipe tracking
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

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

  // Pointer gesture handlers for mobile and desktop swiping
  const minSwipeDistance = 50;

  const onPointerDown = (e) => {
    setTouchEnd(null);
    setTouchStart(e.clientX);
    setIsDragging(true);
    e.target.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!isDragging) return;
    setTouchEnd(e.clientX);
  };

  const onPointerUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.target.releasePointerCapture(e.pointerId);
    
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) handleNext();
    if (isRightSwipe) handlePrev();
    
    setTouchStart(null);
    setTouchEnd(null);
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
            {firstWord} <span className="text-zinc-400 font-extralight">{remainingWords}</span>
          </h2>

          <div className="text-zinc-400 text-xs sm:text-sm font-mulish pt-1">
            Showing <strong className="text-white font-mono text-base">{total > 0 ? (currentIndex % total) + 1 : 0}</strong> of{' '}
            <strong className="text-white font-mono text-base">{total}</strong> {title.toLowerCase().includes('featured') ? 'Featured' : 'Verified'} Vehicles
          </div>

          <div className="text-zinc-400 font-bold uppercase tracking-[0.25em] text-[10px] sm:text-xs pt-1">
            Swipe to Browse
          </div>
        </div>

        {/* SKELETON LOADING STATE */}
        {total === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div 
                key={idx} 
                className={`h-[480px] rounded-3xl bg-zinc-900/40 border border-white/5 animate-pulse flex flex-col justify-between p-6 ${
                  idx > 0 ? 'hidden md:flex' : 'flex'
                } ${idx === 2 ? 'hidden lg:flex' : ''}`}
              >
                {/* Image placeholder */}
                <div className="aspect-[1264/846] w-full rounded-2xl bg-zinc-800/40" />
                {/* Text placeholders */}
                <div className="space-y-3 mt-4 flex-1">
                  <div className="h-4 w-1/4 bg-zinc-800/40 rounded" />
                  <div className="h-6 w-3/4 bg-zinc-800/40 rounded" />
                  <div className="h-4 w-1/2 bg-zinc-800/40 rounded" />
                </div>
                {/* Specs placeholder */}
                <div className="h-12 w-full bg-zinc-800/40 rounded-xl mt-4" />
                {/* Action row placeholder */}
                <div className="flex justify-between items-center mt-6">
                  <div className="h-8 w-1/3 bg-zinc-800/40 rounded" />
                  <div className="h-10 w-1/3 bg-zinc-800/40 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CLEAN CIRCULAR SWIPE LOOP CAROUSEL */}
        {total > 0 && (
          <div className="relative space-y-6 mb-12">

            {/* Swipeable Active Carousel Area */}
            <div
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              className="relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-500 ease-out">
                {visibleCars.map((item, idx) => (
                  <div 
                    key={`${item.car.id}-${idx}`}
                    className={`h-full flex flex-col ${idx > 0 ? 'hidden md:block' : 'block'} ${idx === 2 ? 'hidden lg:block' : ''}`}
                  >
                    <CarCard
                      car={item.car}
                      isComparing={compareList.some((c) => c.id === item.car.id)}
                      onToggleCompare={onToggleCompare}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Infinite Loop Pagination Indicator Bar with Navigation Arrows */}
            <div className="flex items-center justify-center space-x-6 pt-4 select-none">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white hover:text-black hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer shadow-lg group"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-300" />
              </button>

              <div className="flex items-center space-x-2">
                {filteredCars.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`transition-all duration-300 cursor-pointer ${
                      idx === currentIndex % total
                        ? 'w-8 h-2 bg-white rounded-full'
                        : 'w-2 h-2 bg-white/20 hover:bg-white/50 rounded-full'
                    }`}
                    title={`Go to vehicle ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white hover:text-black hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer shadow-lg group"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-300" />
              </button>
            </div>

            {/* PROMINENT END CTA BUTTON TO VIEW ENTIRE INVENTORY */}
            <div className="pt-8 flex justify-center">
              <button
                onClick={() => {
                  if (isHomePage) {
                    navigate('/inventory');
                  } else if (onOpenFullCatalog) {
                    onOpenFullCatalog();
                  } else {
                    const el = document.getElementById('vehicle-sourcing');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-8 py-3.5 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-widest flex items-center space-x-3 hover:bg-zinc-200 transition-all duration-300 shadow-2xl hover:scale-105 group"
              >
                <span>View Entire Inventory</span>
                <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center group-hover:scale-110 group-hover:rotate-45 transition-transform duration-300">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </button>
            </div>

          </div>
        )}

        {/* RELOCATED BRAND LOGOS SLOW MARQUEE (RIGHT TO LEFT) */}
        {!hideMarquee && (
          <div className="pt-10 pb-4 border-t border-white/10 overflow-hidden relative w-full">
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
            {/* Hidden SVG Filter to remove white backgrounds */}
            <svg width="0" height="0" className="absolute">
              <filter id="remove-white">
                <feColorMatrix type="matrix" values="
                  1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  -1 -1 -1 0 3
                " />
              </filter>
            </svg>

            <div className="animate-marquee flex items-center space-x-12 shrink-0">
              {[...FILTERED_BRAND_LOGOS, ...FILTERED_BRAND_LOGOS, ...FILTERED_BRAND_LOGOS, ...FILTERED_BRAND_LOGOS].map((b, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    navigate(`/inventory?brand=${encodeURIComponent(b.name)}`);
                    window.scrollTo(0,0);
                  }}
                  className="flex items-center space-x-2.5 shrink-0 opacity-60 hover:opacity-100 transition-opacity duration-300"
                >
                  <img
                    src={b.icon}
                    alt={b.name}
                    className="h-7 sm:h-9 w-auto object-contain"
                    style={
                      b.isLocal
                        ? { filter: 'url(#remove-white)' }
                        : { filter: 'invert(1)' }
                    }
                  />
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-zinc-300">
                    {b.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
