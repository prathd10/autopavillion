import React, { useState, useRef } from 'react';
import { ArrowUpRight, Volume2, VolumeX } from 'lucide-react';
import { BRAND_LOGOS } from '../data/cars';

export default function Hero({ activeBrandFilter, setActiveBrandFilter }) {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  // User's newly added looping video file
  const videoSrc = "/the_car_is_being_overshadowed.mp4";
  const posterImg = "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=2400&auto=format&fit=crop";

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
          className="w-full h-full object-cover object-center filter brightness-90 contrast-105 scale-105"
        >
          <source src={videoSrc} type="video/mp4" />
          <img
            src={posterImg}
            alt="Auto Pavilion Supercar"
            className="w-full h-full object-cover object-center"
          />
        </video>

        {/* Studio Lighting & Gradient Vignette Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 pointer-events-none" />
      </div>

      {/* AUDIO TOGGLE BUTTON (BOTTOM RIGHT OF HERO) */}
      <div className="absolute bottom-24 right-6 sm:right-12 z-20">
        <button
          onClick={toggleAudio}
          className="px-4 py-2.5 rounded-full bg-black/80 hover:bg-white hover:text-black border border-white/20 text-white text-xs font-bold backdrop-blur-md transition-all flex items-center space-x-2 shadow-2xl group"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-zinc-400 group-hover:text-black" />
              <span>Unmute Video Sound</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-emerald-400 group-hover:text-black animate-pulse" />
              <span className="text-emerald-400 group-hover:text-black">Audio Active</span>
            </>
          )}
        </button>
      </div>

      {/* REPOSITIONED HERO CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 w-full pt-36 sm:pt-48 pb-16 my-auto">
        <div className="max-w-xl space-y-6 animate-fadeIn">
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white font-heading leading-[1.04] uppercase animate-fadeInUp">
            LIVE BETTER, <br />
            <span className="text-zinc-300 font-light italic tracking-normal">LIVE LUXURY</span>
          </h1>

          <p className="text-xs sm:text-base text-zinc-300 font-mulish font-normal leading-relaxed max-w-lg animate-fadeInUp [animation-delay:200ms]">
            Curated pre-owned exotics with signature 251-Point Diagnostic Inspection & 100% Non-Accident legal guarantee.
          </p>

          {/* Single Primary CTA Button: Explore Catalog ↗ */}
          <div className="pt-2 animate-fadeInUp [animation-delay:400ms]">
            <button
              onClick={scrollToCatalog}
              className="px-8 py-4 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-widest flex items-center space-x-3 hover:bg-zinc-200 transition-all duration-300 shadow-2xl hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] group"
            >
              <span>Explore Supercar Catalog</span>
              <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center group-hover:scale-110 group-hover:rotate-45 transition-transform duration-300">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </button>
          </div>

        </div>
      </div>

      {/* BOTTOM MARQUE LOGOS BAR */}
      <div className="relative z-10 w-full bg-gradient-to-t from-black via-black/90 to-transparent pt-6 pb-6 px-6 sm:px-12 lg:px-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto opacity-80 hover:opacity-100 transition-opacity duration-300 gap-8 scrollbar-none py-1">
          {BRAND_LOGOS.map((b, idx) => (
            <button
              key={idx}
              onClick={() => setActiveBrandFilter(activeBrandFilter === b.name ? null : b.name)}
              className={`flex items-center space-x-2 shrink-0 transition-all duration-300 ${
                activeBrandFilter === b.name
                  ? 'scale-110 opacity-100 border-b-2 border-white pb-1'
                  : 'opacity-60 hover:opacity-100 hover:scale-105'
              }`}
            >
              <img
                src={b.icon}
                alt={b.name}
                className="h-5 w-auto object-contain filter invert contrast-200"
              />
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">
                {b.name}
              </span>
            </button>
          ))}
        </div>
      </div>

    </section>
  );
}
