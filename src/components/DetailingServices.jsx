import React, { useState } from 'react';
import { CheckCircle2, ChevronRight } from 'lucide-react';

export default function DetailingServices() {
  const handleOpenVipModal = () => {
    window.dispatchEvent(new CustomEvent('open-vip-modal'));
  };

  const [activeService, setActiveService] = useState(0);

  const services = [
    {
      title: "STEK & XPEL Paint Protection Film (PPF)",
      category: "Surface Armor",
      desc: "Self-healing TPU film providing invisible 10-mil armor against rock chips, swirl marks, and road debris.",
      image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1600&auto=format&fit=crop",
      highlights: [
        "10-Year Manufacturer Warranty Against Yellowing",
        "Self-Healing Scratch Properties under Heat",
        "Custom Computer-Cut Edge Wrapping"
      ]
    },
    {
      title: "9H Graphene Ceramic Coating",
      category: "Paint Restoration",
      desc: "Multi-layer molecular ceramic paint protection matrix that delivers intense depth, mirror reflection, and stain defense.",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop",
      highlights: [
        "High Chemical & Acid Rain Defense",
        "Super-Hydrophobic Water Beading",
        "Full Paint Correction & Swirl Elimination"
      ]
    },
    {
      title: "Bespoke Tuning & Performance Exhausts",
      category: "Engineering",
      desc: "Akrapovič, Capristo, and Frequency Intelligent (Fi) titanium exhaust upgrades with custom ECU stage remapping.",
      image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1600&auto=format&fit=crop",
      highlights: [
        "Valvetronic Remote Sound Control",
        "Dyno-Tested Horsepower Gains",
        "Lightweight Aircraft-Grade Titanium"
      ]
    }
  ];

  return (
    <section className="py-20 bg-black text-white relative border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-white/10">
          <div>
            <span className="text-xs uppercase font-bold tracking-[0.25em] text-zinc-400 block mb-2">
              Supercar Studio
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-heading uppercase">
              BESPOKE DETAILING & <span className="text-zinc-400 font-extralight">PPF ARMOR</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mt-4 md:mt-0 font-mulish">
            Preserve your investment with factory-trained detailing artisans using cleanrooms in Santacruz West, Mumbai.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            {services.map((s, idx) => (
              <div
                key={idx}
                onClick={() => setActiveService(idx)}
                className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                  activeService === idx
                    ? 'bg-white text-black border-white shadow-xl'
                    : 'bg-[#0a0a0a] hover:bg-zinc-900 border-white/10 text-white'
                }`}
              >
                <span className={`text-[9px] uppercase font-bold tracking-widest ${activeService === idx ? 'text-zinc-700' : 'text-zinc-400'}`}>
                  {s.category}
                </span>
                <h3 className="text-lg font-bold mt-1 font-heading">{s.title}</h3>
                <p className={`text-xs mt-2 line-clamp-2 ${activeService === idx ? 'text-zinc-800' : 'text-zinc-400'}`}>{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="lg:col-span-7">
            <div className="mono-panel p-8 rounded-3xl border border-white/12 relative">
              <div className="h-64 sm:h-72 rounded-2xl overflow-hidden mb-6 relative">
                <img
                  src={services[activeService].image}
                  alt={services[activeService].title}
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="text-2xl font-bold text-white font-heading mb-3">
                {services[activeService].title}
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed mb-6 font-mulish">
                {services[activeService].desc}
              </p>

              <div className="space-y-2 mb-6">
                {services[activeService].highlights.map((h, i) => (
                  <div key={i} className="flex items-center space-x-2 text-xs text-zinc-200">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleOpenVipModal}
                className="px-6 py-3 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center space-x-2"
              >
                <span>Book Detailing Appointment</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
