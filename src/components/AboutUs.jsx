import React from 'react';
import { MapPin, Award, ShieldCheck, Sparkles } from 'lucide-react';

export default function AboutUs() {
  // Darker, cinematic stealth hypercar background image
  const darkCinematicCarImg = "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=2400&auto=format&fit=crop";

  return (
    <section 
      id="about-us" 
      className="py-24 sm:py-36 relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${darkCinematicCarImg})`,
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Dark Vignette Overlay for Crisp Typography Contrast & Seamless Canvas */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black/85 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/30 to-black/80 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        
        {/* Header (Animated) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-white/15 pb-8 animate-fadeInUp">
          <div>
            <div className="text-zinc-400 text-[11px] font-extrabold uppercase tracking-[0.3em] mb-2 flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Automotive Distinction</span>
            </div>
            <h2 
              className="text-4xl sm:text-7xl font-black text-white tracking-tight"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              ABOUT US
            </h2>
          </div>

          <div className="flex items-center space-x-2 text-xs text-zinc-300 mt-4 md:mt-0 font-mulish font-bold uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-white" />
            <span>Santacruz West, Mumbai Showroom HQ</span>
          </div>
        </div>

        {/* Clean Frameless Floating Content (NO CARDS - Pure Typography & Animated Entrance) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Brand Story */}
          <div className="lg:col-span-6 space-y-6 animate-fadeInUp [animation-delay:200ms]">
            <div className="inline-block px-3 py-1 bg-black/80 border-l-2 border-white text-[10px] font-bold text-white uppercase tracking-widest backdrop-blur-md">
              A NOTCH ABOVE
            </div>

            <h3 
              className="text-3xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              CRAFTING INDIA'S <br />
              <span className="text-zinc-400 font-light italic">SUPERCAR HERITAGE</span>
            </h3>

            <p className="text-xs sm:text-base text-zinc-300 font-mulish leading-relaxed max-w-lg">
              Auto Pavilion was founded with a singular mission: to provide High-Net-Worth Individuals, industrialists, and avid collectors across India direct access to fully verified, non-accident exotic supercars with 100% legal transparency.
            </p>

            <p className="text-xs sm:text-sm text-zinc-400 font-mulish leading-relaxed max-w-lg">
              Every vehicle in our collection undergoes an uncompromised 251-Point Diagnostic Audit covering chassis geometry, ECU telemetry, and complete provenance verification.
            </p>
          </div>

          {/* Right Column: Frameless Floating Statistics & Key Pillars */}
          <div className="lg:col-span-6 space-y-10 animate-fadeInUp [animation-delay:400ms]">
            
            {/* Frameless 3-Pillar Highlight Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 border-t border-b border-white/15 py-8">
              
              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">251-Pt</div>
                <div className="text-[10px] uppercase font-bold text-zinc-300 tracking-wider">Diagnostic Audit</div>
                <p className="text-xs text-zinc-400 font-mulish leading-snug">
                  Full OBD-II telemetry & mechanical certification.
                </p>
              </div>

              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">100%</div>
                <div className="text-[10px] uppercase font-bold text-zinc-300 tracking-wider">Non-Accident</div>
                <p className="text-xs text-zinc-400 font-mulish leading-snug">
                  Legal certificate guaranteeing chassis integrity.
                </p>
              </div>

              <div className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">₹500Cr+</div>
                <div className="text-[10px] uppercase font-bold text-zinc-300 tracking-wider">Exotics Delivered</div>
                <p className="text-xs text-zinc-400 font-mulish leading-snug">
                  Over 450+ hypercars curated nationwide.
                </p>
              </div>

            </div>

            {/* Bottom Statement */}
            <div className="pt-2">
              <blockquote className="text-sm sm:text-lg font-light italic text-zinc-200 border-l-2 border-white pl-4 leading-relaxed">
                "We don't just sell exotics; we curate unforgettable automotive legacies for India's discerning collectors."
              </blockquote>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
