import React from 'react';
import { ArrowRight, Landmark, Percent } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FinancePreview() {
  return (
    <section className="py-24 bg-[#0a0a0c] border-t border-white/5 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl sm:text-5xl font-black font-heading uppercase tracking-tight text-white mb-4">
                Bespoke <span className="text-zinc-500 font-extralight block">Financing</span>
              </h2>
              <p className="text-zinc-400 font-mulish text-sm sm:text-base max-w-md leading-relaxed">
                We partner with India's leading private banks to offer tailored financing solutions, competitive interest rates, and flexible tenures designed exclusively for luxury vehicle acquisitions.
              </p>
            </div>
            
            <div className="flex flex-col space-y-4">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 shrink-0">
                  <Landmark className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-1">Premier Alliances</h4>
                  <p className="text-xs text-zinc-500">Direct partnerships with leading private financial institutions for fast approvals.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 shrink-0">
                  <Percent className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-1">Custom EMI Structures</h4>
                  <p className="text-xs text-zinc-500">Tailored payment plans that fit your credit profile.</p>
                </div>
              </div>
            </div>

            <Link
              to="/finance"
              className="inline-flex items-center space-x-2 px-8 py-3.5 bg-white text-black font-extrabold text-xs uppercase tracking-widest rounded-full hover:bg-zinc-200 transition-colors shadow-xl"
            >
              <span>Explore EMI Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent z-10" />
            <img 
              src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop" 
              alt="Luxury Car Steering"
              className="w-full h-auto rounded-3xl object-cover filter grayscale contrast-125 border border-white/10"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
