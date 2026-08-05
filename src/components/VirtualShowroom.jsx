import React, { useState } from 'react';
import { Eye, Maximize2, Sparkles, Navigation, MapPin } from 'lucide-react';

export default function VirtualShowroom() {
  const handleOpenVipModal = () => {
    window.dispatchEvent(new CustomEvent('open-vip-modal'));
  };
  const [activeZone, setActiveZone] = useState('floor');

  const ZONES = {
    floor: {
      name: "Main Showroom Floor",
      subtitle: "Santacruz West, Mumbai",
      image: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=2000&auto=format&fit=crop",
      hotspots: [
        { label: "Porsche 911 GT3 RS", x: "35%", y: "45%" },
        { label: "Lamborghini Huracán EVO", x: "65%", y: "50%" }
      ]
    },
    lounge: {
      name: "Private Executive Lounge",
      subtitle: "Confidential Closing Suite",
      image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=2000&auto=format&fit=crop",
      hotspots: [
        { label: "Bespoke Material Samples", x: "40%", y: "60%" },
        { label: "Private Bar", x: "75%", y: "40%" }
      ]
    },
    handover: {
      name: "Handover Bay",
      subtitle: "Ceremonial Delivery Suite",
      image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=2000&auto=format&fit=crop",
      hotspots: [
        { label: "Veil Riser Stage", x: "50%", y: "55%" }
      ]
    },
    acoustic: {
      name: "Sound Studio",
      subtitle: "Exhaust Acoustic Chamber",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2000&auto=format&fit=crop",
      hotspots: [
        { label: "Decibel Meters", x: "30%", y: "50%" }
      ]
    }
  };

  const currentZone = ZONES[activeZone];

  return (
    <section id="virtual-tour" className="py-24 bg-[#08090c] relative overflow-hidden border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-zinc-400 text-[11px] font-semibold uppercase tracking-[0.3em] mb-2">
              <Eye className="w-3.5 h-3.5 text-zinc-400" />
              <span>Interactive Space</span>
            </div>
            <h2 
              className="text-4xl sm:text-6xl font-black text-white tracking-tight"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              VIRTUAL TOUR
            </h2>
          </div>
          <div className="flex items-center space-x-2 text-xs text-zinc-400 mt-4 md:mt-0">
            <MapPin className="w-3.5 h-3.5 text-white" />
            <span>Santacruz West, Mumbai Showroom</span>
          </div>
        </div>

        {/* Viewport Box */}
        <div className="relative border border-white/15 bg-black shadow-2xl group min-h-[450px] sm:min-h-[550px] flex flex-col justify-between overflow-hidden">
          {/* Background Interactive View */}
          <img 
            src={currentZone.image} 
            alt={currentZone.name}
            className="absolute inset-0 w-full h-full object-cover filter brightness-90 contrast-105 transition-all duration-1000 scale-100 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 pointer-events-none" />

          {/* Top Bar inside Viewport */}
          <div className="relative z-10 p-6 flex items-center justify-between">
            <div className="px-4 py-1.5 bg-black/80 border border-white/20 text-xs font-bold text-white uppercase tracking-wider backdrop-blur-md flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>{currentZone.name}</span>
            </div>

            <div className="px-3 py-1 bg-black/70 border border-white/15 text-[10px] text-zinc-300 backdrop-blur-md hidden sm:flex items-center space-x-2 uppercase tracking-widest">
              <Navigation className="w-3 h-3 text-white animate-spin" />
              <span>Tap Target Reticles</span>
            </div>
          </div>

          {/* Reticle Target Hotspots Overlay */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            {currentZone.hotspots.map((spot, idx) => (
              <div 
                key={idx}
                style={{ left: spot.x, top: spot.y }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto group/spot cursor-pointer"
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-7 h-7 bg-white/20 animate-ping" />
                  <span className="w-4 h-4 bg-white border-2 border-black shadow-lg" />
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 opacity-0 group-hover/spot:opacity-100 transition-opacity px-3 py-1 bg-black border border-white/30 text-[10px] font-bold text-white uppercase tracking-wider whitespace-nowrap">
                    {spot.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Bar: Zone Selector Tabs */}
          <div className="relative z-10 p-4 sm:p-6 bg-gradient-to-t from-black via-black/90 to-transparent flex flex-wrap items-center justify-between gap-4 border-t border-white/10">
            <div className="flex flex-wrap items-center gap-2">
              {Object.keys(ZONES).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveZone(key)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border ${
                    activeZone === key
                      ? 'bg-white text-black border-white'
                      : 'bg-black/70 text-zinc-300 border-white/20 hover:border-white'
                  }`}
                >
                  {ZONES[key].name}
                </button>
              ))}
            </div>

            <button
              onClick={handleOpenVipModal}
              className="px-6 py-2.5 bg-white text-black font-extrabold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center space-x-2"
            >
              <span>Book Showroom Visit</span>
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
