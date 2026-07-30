import React from 'react';
import { Star, Quote } from 'lucide-react';

export default function Testimonials() {
  const reviews = [
    {
      name: "Vikramaditya S.",
      role: "Industrialist & Porsche Collector, Mumbai",
      comment: "Acquired a 911 GT3 RS through Auto Pavilion. Their 251-point report gave me complete peace of mind. The car was delivered to my estate in immaculate condition with zero paint touches.",
      car: "Porsche 911 GT3 RS"
    },
    {
      name: "Karan Johar B.",
      role: "Corporate Executive, Delhi NCR",
      comment: "Traded my AMG G63 for a Lamborghini Huracán in under 30 minutes! The valuation offer was fair, and their covered flatbed transport picked up the car directly from my farmhouse.",
      car: "Lamborghini Huracán EVO"
    },
    {
      name: "Ananya M.",
      role: "Business Owner, Bangalore",
      comment: "Auto Pavilion stands head and shoulders above other dealers. Authentic mileage certification, completely non-accident transparent documentation, and world-class customer service.",
      car: "Rolls-Royce Ghost"
    },
    {
      name: "Rohan V.",
      role: "Supercar Enthusiast, Hyderabad",
      comment: "The team sourced an unlisted Ferrari 488 Pista allocation for me. Seamless legal transfer and spotless diagnostic audit. Unmatched luxury service.",
      car: "Ferrari 488 Pista"
    }
  ];

  return (
    <section className="py-20 bg-black text-white relative border-b border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-[10px] sm:text-xs uppercase font-bold tracking-[0.3em] text-zinc-400">
            Client Testimonials
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white font-heading uppercase">
            TRUSTED BY <span className="text-zinc-400 font-extralight">PURISTS</span>
          </h2>
        </div>
      </div>

      {/* CONTINUOUS RIGHT-TO-LEFT REVIEWS MARQUEE */}
      <div className="relative w-full overflow-hidden">
        {/* Side Fade Gradients */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee flex items-center space-x-6 shrink-0 py-2">
          {[...reviews, ...reviews, ...reviews, ...reviews].map((r, idx) => (
            <div 
              key={idx} 
              className="w-80 sm:w-96 shrink-0 mono-panel p-6 sm:p-8 rounded-3xl border border-white/12 space-y-4 flex flex-col justify-between shadow-2xl hover:border-white/40 transition-all duration-300"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Quote className="w-5 h-5 text-zinc-500" />
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-white text-white" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-zinc-300 italic leading-relaxed font-mulish">
                  "{r.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-white/10">
                <h4 className="text-xs sm:text-sm font-bold text-white font-heading">{r.name}</h4>
                <span className="text-[10px] sm:text-[11px] text-zinc-400 block font-semibold">{r.role}</span>
                <span className="text-[9px] sm:text-[10px] text-zinc-400 font-mono block mt-0.5">Purchased: {r.car}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
