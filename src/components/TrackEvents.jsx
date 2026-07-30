import React, { useState, useMemo } from 'react';
import { Calendar, MapPin, Flag, ChevronRight, ChevronLeft, Check, Sparkles } from 'lucide-react';
import { EVENTS_DATA } from '../data/eventsData';

export default function TrackEvents({ onOpenVipModal }) {
  const [registeredEvents, setRegisteredEvents] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);

  // Touch Swipe tracking
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const total = EVENTS_DATA.length;

  const handleNext = () => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  // Touch gesture handlers
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
    if (distance > minSwipeDistance) handleNext();
    if (distance < -minSwipeDistance) handlePrev();
  };

  const handleRegister = (eventId) => {
    setRegisteredEvents((prev) => ({ ...prev, [eventId]: true }));
  };

  // 2 events displayed at a time (circular loop queue)
  const visibleEvents = useMemo(() => {
    if (total === 0) return [];
    if (total === 1) return [EVENTS_DATA[0]];
    return [
      EVENTS_DATA[currentIndex % total],
      EVENTS_DATA[(currentIndex + 1) % total]
    ];
  }, [currentIndex, total]);

  return (
    <section id="events" className="py-16 sm:py-24 bg-[#050608] relative overflow-hidden border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-16 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-zinc-400 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.3em] mb-1 sm:mb-2">
              <Flag className="w-3.5 h-3.5" />
              <span>Circuit & Lifestyle</span>
            </div>
            <h2 
              className="text-3xl sm:text-6xl font-black text-white tracking-tight"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              OWNERS' EVENTS
            </h2>
          </div>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-xs mt-2 md:mt-0 font-mulish leading-relaxed">
            Exclusive track sessions, rallies, and private galas for Auto Pavilion owners.
          </p>
        </div>

        {/* Circular Queue Swiper Header Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2 text-[10px] sm:text-xs text-zinc-300 uppercase tracking-widest font-bold">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Swipe or use arrows to explore</span>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={handlePrev}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/80 hover:bg-white hover:text-black border border-white/20 text-white flex items-center justify-center transition-all shadow-lg active:scale-95 backdrop-blur-md"
              title="Previous Event"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={handleNext}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/80 hover:bg-white hover:text-black border border-white/20 text-white flex items-center justify-center transition-all shadow-lg active:scale-95 backdrop-blur-md"
              title="Next Event"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* 2-Column Grid Events Carousel (Mobile & Desktop) */}
        <div
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className="grid grid-cols-2 gap-3 sm:gap-8 select-none"
        >
          {visibleEvents.map((evt) => (
            <div 
              key={evt.id}
              className="bg-[#0a0b0e] border border-white/10 overflow-hidden hover:border-white/40 transition-all duration-300 flex flex-col justify-between group shadow-2xl"
            >
              {/* Event Image */}
              <div>
                <div className="relative h-36 sm:h-64 w-full overflow-hidden">
                  <img 
                    src={evt.image} 
                    alt={evt.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0e] via-transparent to-transparent" />
                  
                  {/* Category Tag */}
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 py-0.5 sm:px-3 sm:py-1 bg-black/90 border border-white/20 text-[8px] sm:text-[9px] uppercase font-bold text-zinc-200 tracking-widest backdrop-blur-md">
                    {evt.category}
                  </div>
                </div>

                {/* Info */}
                <div className="p-3 sm:p-6 space-y-1.5 sm:space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[9px] sm:text-xs text-zinc-400 gap-1">
                    <div className="flex items-center space-x-1 text-white font-semibold">
                      <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span>{evt.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-500" />
                      <span className="truncate max-w-[70px] sm:max-w-none">{evt.location}</span>
                    </div>
                  </div>

                  <h3 className="text-xs sm:text-lg font-bold text-white leading-tight group-hover:text-zinc-200 transition-colors line-clamp-1">
                    {evt.title}
                  </h3>

                  <p className="text-[10px] sm:text-xs text-zinc-400 font-mulish line-clamp-2 leading-relaxed">
                    {evt.description}
                  </p>
                </div>
              </div>

              {/* Action Footer */}
              <div className="px-3 pb-3 sm:px-6 sm:pb-6 pt-1">
                {registeredEvents[evt.id] ? (
                  <div className="w-full py-2 sm:py-3 bg-white/10 border border-white/20 text-white text-[9px] sm:text-xs font-bold flex items-center justify-center space-x-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>CONFIRMED</span>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleRegister(evt.id)}
                    className="w-full py-2 sm:py-3 bg-white/10 hover:bg-white hover:text-black text-white text-[9px] sm:text-xs font-bold uppercase tracking-widest flex items-center justify-center space-x-1 sm:space-x-2 transition-all"
                  >
                    <span>Request Pass</span>
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Circular Queue Pagination Indicators */}
        <div className="flex items-center justify-center space-x-2 pt-6 sm:pt-8">
          {EVENTS_DATA.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-300 ${
                idx === currentIndex % total
                  ? 'w-6 sm:w-8 h-1.5 sm:h-2 bg-white rounded-full'
                  : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/20 hover:bg-white/50 rounded-full'
              }`}
              title={`Go to event ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
