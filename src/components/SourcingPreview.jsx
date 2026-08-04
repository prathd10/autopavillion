import React from 'react';
import { ArrowRight, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SourcingPreview() {
  return (
    <section className="py-24 bg-black border-t border-white/5 relative overflow-hidden">
      
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-[#0a0a0c] border border-white/10 rounded-[2.5rem] p-8 sm:p-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-24 relative overflow-hidden">
          
          <div className="flex-1 space-y-6 relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 rounded-full border border-white/10">
              <Globe className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">Global Network</span>
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-black font-heading uppercase tracking-tight text-white">
              Can't Find Your <span className="text-zinc-500 font-extralight block">Dream Car?</span>
            </h2>
            
            <p className="text-zinc-400 font-mulish text-sm sm:text-base max-w-lg leading-relaxed">
              Leverage our extensive dealership network across India to locate, inspect, and procure specific luxury vehicles that match your exact specifications.
            </p>
            
            <div className="pt-4">
              <Link
                to="/sourcing"
                className="inline-flex items-center space-x-2 px-8 py-3.5 bg-transparent border border-white text-white hover:bg-white hover:text-black font-extrabold text-xs uppercase tracking-widest rounded-full transition-colors"
              >
                <span>Discover Sourcing</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="flex-1 relative z-10 w-full h-64 lg:h-[400px]">
            <img 
              src="https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=1000&auto=format&fit=crop" 
              alt="Bespoke Sourcing"
              className="w-full h-full object-cover rounded-2xl filter contrast-125"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
