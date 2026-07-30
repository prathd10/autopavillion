import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpRight, Volume2, VolumeX } from 'lucide-react';

export default function Hero({ onOpenVipModal }) {
  const [isMuted, setIsMuted] = useState(true);
  const [animStep, setAnimStep] = useState(0);
  const videoRef = useRef(null);

  // User's looping video file
  const videoSrc = "/the_car_is_being_overshadowed.mp4";
  const posterImg = "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=2400&auto=format&fit=crop";

  useEffect(() => {
    // Staggered line-by-line entrance animation after preloader finishes
    const t1 = setTimeout(() => setAnimStep(1), 350);  // Line 1: LIVE BETTER,
    const t2 = setTimeout(() => setAnimStep(2), 750);  // Line 2: LIVE LUXURY
    const t3 = setTimeout(() => setAnimStep(3), 1150); // Paragraph
    const t4 = setTimeout(() => setAnimStep(4), 1550); // CTA Button

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const toggleAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('inventory');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative w-full min-h-screen bg-black text-white flex flex-col justify-between overflow-hidden">
      
      {/* FULL BLEED CINEMATIC USER VIDEO BACKGROUND */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          poster={posterImg}
          className="w-full h-full object-cover object-center filter brightness-95 contrast-105 scale-105"
        >
          <source src={videoSrc} type="video/mp4" />
          <img
            src={posterImg}
            alt="Auto Pavilion Supercar"
            className="w-full h-full object-cover object-center"
          />
        </video>

        {/* Lighter Gradient Vignette Overlays to reveal the video supercar clearly */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50 pointer-events-none" />
      </div>

      {/* DISCREET SYMBOL-ONLY AUDIO BUTTON (BOTTOM RIGHT) */}
      <div 
        className={`absolute bottom-8 sm:bottom-12 right-4 sm:right-12 z-20 transition-all duration-1000 ${
          animStep >= 1 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <button
          onClick={toggleAudio}
          title={isMuted ? "Unmute Video Sound" : "Mute Video Sound"}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-white text-white hover:text-black border border-white/20 flex items-center justify-center backdrop-blur-md transition-all shadow-xl group"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-zinc-400 group-hover:text-black" />
          ) : (
            <Volume2 className="w-4 h-4 text-white group-hover:text-black animate-pulse" />
          )}
        </button>
      </div>

      {/* COMPACT HERO CONTENT (STAGGERED LINE BY LINE ANIMATION) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full pt-28 sm:pt-48 pb-12 my-auto">
        <div className="max-w-xs sm:max-w-xl space-y-3 sm:space-y-5">
          
          <h1 className="text-2xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white font-heading leading-[1.08] uppercase overflow-hidden">
            {/* Line 1: LIVE BETTER, */}
            <span 
              className={`block transition-all duration-1000 ease-out transform ${
                animStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              LIVE BETTER,
            </span>

            {/* Line 2: LIVE LUXURY */}
            <span 
              className={`block text-zinc-300 font-light italic tracking-normal transition-all duration-1000 ease-out transform ${
                animStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              LIVE LUXURY
            </span>
          </h1>

          {/* Line 3: Narrow paragraph */}
          <p 
            className={`text-[11px] sm:text-sm text-zinc-300 font-mulish font-normal leading-relaxed max-w-[210px] sm:max-w-xs transition-all duration-1000 ease-out transform ${
              animStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Curated pre-owned exotics with 251-Point Inspection & 100% Non-Accident legal guarantee.
          </p>

          {/* Line 4: Ultra-Compact Minimalist Capsule CTA Button */}
          <div 
            className={`pt-1 transition-all duration-1000 ease-out transform ${
              animStep >= 4 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
            }`}
          >
            <button
              onClick={scrollToCatalog}
              className="px-4 py-2 sm:px-6 sm:py-2.5 rounded-full bg-white text-black font-extrabold text-[9px] sm:text-[11px] uppercase tracking-widest flex items-center space-x-2 hover:bg-zinc-200 transition-all duration-300 shadow-2xl hover:scale-105 group"
            >
              <span>Explore Supercar Inventory</span>
              <span className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center group-hover:scale-110 group-hover:rotate-45 transition-transform duration-300">
                <ArrowUpRight className="w-2.5 h-2.5" />
              </span>
            </button>
          </div>

        </div>
      </div>

    </section>
  );
}
