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
    }
  ];

  return (
    <section className="py-20 bg-black text-white relative border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase font-bold tracking-[0.3em] text-zinc-400">
            Client Testimonials
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white font-heading uppercase">
            TRUSTED BY <span className="text-zinc-400 font-extralight">PURISTS</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, idx) => (
            <div key={idx} className="mono-panel p-8 rounded-3xl border border-white/12 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <Quote className="w-6 h-6 text-white/40" />
                <p className="text-xs text-zinc-300 italic leading-relaxed font-mulish">
                  "{r.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-white/10">
                <h4 className="text-sm font-bold text-white font-heading">{r.name}</h4>
                <span className="text-[11px] text-zinc-400 block font-semibold">{r.role}</span>
                <span className="text-[10px] text-zinc-500 font-mono block mt-0.5">Purchased: {r.car}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
