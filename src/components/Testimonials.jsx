import React from 'react';
import { Star, Quote, Loader2 } from 'lucide-react';
import { useTestimonials } from '../hooks/useTestimonials';

export default function Testimonials() {
  const { testimonials, loading } = useTestimonials();
  
  // If we don't have enough testimonials to fill a marquee smoothly, we can repeat them
  const displayReviews = testimonials.length > 0 
    ? [...testimonials, ...testimonials, ...testimonials, ...testimonials]
    : [];

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
      <div className="relative w-full overflow-hidden min-h-[200px]">
        {/* Side Fade Gradients */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

        {loading ? (
          <div className="flex items-center justify-center h-full pt-10">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
          </div>
        ) : (
          <div className="animate-marquee flex items-center space-x-6 shrink-0 py-2">
            {displayReviews.map((r, idx) => (
              <div 
                key={`${r.id || idx}-${idx}`}
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
        )}
      </div>

    </section>
  );
}
