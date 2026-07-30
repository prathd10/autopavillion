import React, { useState } from 'react';
import { Compass, CheckCircle2, Send, ShieldCheck, Globe } from 'lucide-react';

export default function BespokeConcierge() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    makeModel: '',
    budget: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="bespoke-sourcing" className="py-24 bg-[#08090c] relative overflow-hidden border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Visual Banner Card with Photo Background */}
          <div className="lg:col-span-5 relative bg-[#0a0b0e] border border-white/10 min-h-[400px] flex flex-col justify-between p-8 overflow-hidden group">
            <img 
              src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1600&auto=format&fit=crop" 
              alt="Supercar Sourcing" 
              className="absolute inset-0 w-full h-full object-cover filter brightness-[0.35] group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center space-x-2 text-zinc-300 text-[10px] font-bold uppercase tracking-[0.3em]">
                <Compass className="w-3.5 h-3.5" />
                <span>Global Acquisition Desk</span>
              </div>

              <h2 
                className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                BESPOKE <br />
                <span className="text-zinc-400 font-light">SOURCING</span>
              </h2>
            </div>

            <div className="relative z-10 space-y-3 pt-6 border-t border-white/20 text-xs text-zinc-300">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-white shrink-0" />
                <span>Europe • Dubai • USA Allocation Access</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-white shrink-0" />
                <span>251-Point Inspection & Full Legal Import</span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Form Container */}
          <div className="lg:col-span-7 bg-[#0a0b0e] border border-white/10 p-8 sm:p-10 flex flex-col justify-center">
            
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-white mx-auto" />
                <h3 
                  className="text-xl font-bold text-white tracking-wide"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Brief Received
                </h3>
                <p className="text-xs text-zinc-400 max-w-xs mx-auto font-mulish">
                  Our specialist will contact you shortly regarding allocation options.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 bg-white/10 text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-2">
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                    Request Unlisted Spec
                  </h3>
                  <span className="text-[10px] text-zinc-400 border border-white/20 px-3 py-0.5">
                    CONFIDENTIAL
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">Name *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Vikramaditya S."
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-black/80 border border-white/15 px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">WhatsApp Phone *</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="+91 98200 00000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-black/80 border border-white/15 px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">Target Model *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Porsche 911 S/T"
                      value={formData.makeModel}
                      onChange={(e) => setFormData({ ...formData, makeModel: e.target.value })}
                      className="w-full bg-black/80 border border-white/15 px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">Budget Range</label>
                    <input 
                      type="text" 
                      placeholder="e.g. ₹ 3.5 Cr – ₹ 5.0 Cr"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full bg-black/80 border border-white/15 px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">Spec Notes / Color Preference</label>
                  <input 
                    type="text"
                    placeholder="e.g. PTS Oak Green, Carbon Package..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-black/80 border border-white/15 px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-white text-black font-extrabold text-xs uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-zinc-200 transition-all"
                >
                  <span>Submit Sourcing Brief</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
