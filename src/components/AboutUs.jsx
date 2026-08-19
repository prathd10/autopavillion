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

          <a href="https://maps.google.com/?q=Auto+Pavilion,+Office+No:25,+Tirupati+Shopping+center,+S+V+Rd,+Santacruz+(W),+Mumbai-400054" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-xs text-zinc-300 hover:text-white transition-colors mt-4 md:mt-0 font-mulish font-bold uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-white" />
            <span>Santacruz West, Mumbai Showroom HQ</span>
          </a>
        </div>

        {/* Clean Frameless Floating Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start mt-10">
          
          {/* Left Column: Brand Story & CEO */}
          <div className="lg:col-span-7 space-y-12 animate-fadeInUp [animation-delay:200ms]">
            
            {/* Story */}
            <div className="space-y-6">
              <div className="inline-block px-4 py-1.5 bg-white/5 border border-white/10 text-[10px] font-bold text-white uppercase tracking-[0.2em] rounded-full backdrop-blur-md">
                A Notch Above
              </div>

              <h3 
                className="text-4xl sm:text-6xl font-extrabold text-white leading-[1.1] tracking-tight"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                CRAFTING INDIA'S <br />
                <span className="text-zinc-500 font-light italic">SUPERCAR HERITAGE</span>
              </h3>

              <div className="space-y-6 pt-4 border-l border-white/20 pl-6">
                <p className="text-sm sm:text-lg text-white font-mulish leading-relaxed max-w-xl">
                  Welcome to Auto Pavilion, where sophistication meets automotive excellence.
                </p>
                <p className="text-xs sm:text-sm text-zinc-400 font-mulish leading-relaxed max-w-xl">
                  At Auto Pavilion, we understand the discerning tastes and high standards of our clientele. As a leading dealer of top-tier cars, we pride ourselves on delivering an unparalleled experience that matches the luxury of our collection.
                </p>
                <p className="text-xs sm:text-sm text-zinc-400 font-mulish leading-relaxed max-w-xl">
                  Established with a singular vision - to redefine the automotive experience, our journey began with a passion for excellence. From a modest beginning to a premier destination, we've consistently exceeded expectations, setting new standards in the luxury car market.
                </p>
              </div>
            </div>

            {/* CEO Section (Glass Panel) */}
            <div className="glass-panel p-8 sm:p-10 rounded-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
              <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start relative z-10">
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-white/20 rounded-2xl blur-md" />
                  <img 
                    src="/mohammed atique.jpeg" 
                    alt="Founder & CEO" 
                    className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover shadow-2xl border border-white/20 transition-all duration-700 hover:scale-105" 
                  />
                </div>
                <div className="text-center sm:text-left flex flex-col justify-center">
                  <div className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px] sm:text-xs mb-4">Founder's Vision</div>
                  <blockquote className="text-lg sm:text-2xl font-light italic text-white leading-relaxed">
                    "Quality is never an accident; it is always the result of high intention."
                  </blockquote>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Statistics & Map */}
          <div className="lg:col-span-5 space-y-12 animate-fadeInUp [animation-delay:400ms]">
            
            {/* Minimalist Stats Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-12">
              <div className="space-y-2 group">
                <div className="text-5xl sm:text-7xl font-black text-white font-mono tracking-tighter group-hover:scale-105 transition-transform origin-left">19</div>
                <div className="text-xs sm:text-sm uppercase font-bold text-zinc-400 tracking-[0.2em]">Years in Business</div>
              </div>
              <div className="space-y-2 group">
                <div className="text-5xl sm:text-7xl font-black text-white font-mono tracking-tighter group-hover:scale-105 transition-transform origin-left">50<span className="text-zinc-500">+</span></div>
                <div className="text-xs sm:text-sm uppercase font-bold text-zinc-400 tracking-[0.2em]">Specialists</div>
              </div>
              <div className="space-y-2 group">
                <div className="text-5xl sm:text-7xl font-black text-white font-mono tracking-tighter group-hover:scale-105 transition-transform origin-left">10<span className="text-zinc-500">k</span></div>
                <div className="text-xs sm:text-sm uppercase font-bold text-zinc-400 tracking-[0.2em]">Cars Sold</div>
              </div>
              <div className="space-y-2 group">
                <div className="text-5xl sm:text-7xl font-black text-white font-mono tracking-tighter group-hover:scale-105 transition-transform origin-left">16<span className="text-zinc-500">+</span></div>
                <div className="text-xs sm:text-sm uppercase font-bold text-zinc-400 tracking-[0.2em]">States Served</div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10">
              <blockquote className="text-sm sm:text-lg font-light italic text-zinc-300 border-l-2 border-white/30 pl-5 leading-relaxed">
                "Auto Pavilion invites you to indulge in a world of automotive opulence. Our showroom is an embodiment of luxury and sophistication, reflecting the caliber of our clientele."
              </blockquote>
            </div>

            {/* Premium Embedded Map */}
            <div className="mt-8 relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl h-72 group">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none" />
              <iframe 
                src="https://maps.google.com/maps?q=Auto%20Pavilion,%20Office%20No:25,%20Tirupati%20Shopping%20center,%20S%20V%20Rd,%20Santacruz%20(W),%20Mumbai-400054&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="opacity-90 group-hover:opacity-100 transition-opacity duration-500"
              ></iframe>
              <a href="https://maps.google.com/?q=Auto+Pavilion,+Office+No:25,+Tirupati+Shopping+center,+S+V+Rd,+Santacruz+(W),+Mumbai-400054" target="_blank" rel="noopener noreferrer" className="absolute bottom-6 left-6 px-5 py-3 bg-white text-black hover:bg-zinc-200 text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.2em] rounded-full shadow-2xl flex items-center space-x-3 transition-transform hover:scale-105 z-20">
                <MapPin className="w-4 h-4" />
                <span>Get Directions</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
