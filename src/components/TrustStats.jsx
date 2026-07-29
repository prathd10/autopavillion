import React from 'react';
import { CheckCircle, Truck, MapPin } from 'lucide-react';
import { BUSINESS_FACTS } from '../data/cars';

export default function TrustStats() {
  return (
    <section id="certification" className="py-20 bg-black text-white relative border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase font-bold tracking-[0.3em] text-zinc-400">
            The Auto Pavilion Blueprint
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-heading uppercase">
            UNCOMPROMISING <span className="text-zinc-400 font-extralight">EXCELLENCE</span>
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm font-mulish">
            Why India's high-net-worth individuals and supercar collectors choose Auto Pavilion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BUSINESS_FACTS.map((fact, idx) => (
            <div
              key={idx}
              className="mono-panel p-8 rounded-3xl border border-white/10 hover:border-white transition-all flex flex-col justify-between"
            >
              <div>
                <div className="text-4xl sm:text-5xl font-black font-heading text-white mb-2">
                  {fact.stat}
                </div>
                <h3 className="text-lg font-bold text-white mb-2 font-heading">{fact.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-mulish">{fact.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-white font-semibold uppercase tracking-wider">
                <span>Verified Standard</span>
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 mono-panel p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-2xl bg-white/10 border border-white/20 text-white">
              <Truck className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white font-heading">Nationwide Covered Flatbed Concierge Delivery</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Enclosed temperature-controlled transport delivered directly to your private estate anywhere in India.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center space-x-2 px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold font-mono">
            <MapPin className="w-4 h-4 text-white" />
            <span>Santacruz West, Mumbai HQ</span>
          </div>
        </div>

      </div>
    </section>
  );
}
