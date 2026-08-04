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
    <section id="vehicle-sourcing" className="py-20 sm:py-32 bg-zinc-950 relative overflow-hidden">
      
      {/* Abstract Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-b from-white/10 to-transparent blur-3xl rotate-12" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-t from-white/5 to-transparent blur-3xl -rotate-12" />
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Content */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8 animate-fadeInUp">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                <Search className="w-3.5 h-3.5" />
                <span>Premium Sourcing</span>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black uppercase tracking-tight text-white leading-none font-heading">
                FIND YOUR <br />
                <span className="text-zinc-500">DREAM CAR</span>
              </h2>

              <p className="text-zinc-400 text-sm sm:text-base max-w-xl leading-relaxed">
                Looking for a specific make, model, or color that isn't currently in our inventory? Our sourcing team specializes in acquiring premium pre-owned vehicles through our trusted nationwide network. We handle the negotiations, inspections, and logistics to deliver your perfect car.
              </p>
            </div>

            <div className="space-y-3 pt-6 border-t border-white/10 text-xs text-zinc-400">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-white shrink-0" />
                <span>Pan-India Dealership Network</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-white shrink-0" />
                <span>Rigorous Inspection & Full Legal Transfer</span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Form Container */}
          <div className="lg:col-span-7 bg-[#0a0b0e] border border-white/10 p-8 sm:p-10 flex flex-col justify-center">
            
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-white mx-auto" />
                <h3 className="text-xl font-bold text-white tracking-wide font-heading uppercase">
                  Request Received
                </h3>
                <p className="text-xs text-zinc-400 max-w-xs mx-auto font-mulish">
                  Our sourcing team will contact you shortly regarding available options.
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
                    Request a Vehicle
                  </h3>
                  <span className="text-[10px] text-zinc-400 border border-white/20 px-3 py-0.5">
                    SOURCING
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">Name *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Vikram Sharma"
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
                      placeholder="e.g. Mercedes-Benz GLE"
                      value={formData.makeModel}
                      onChange={(e) => setFormData({ ...formData, makeModel: e.target.value })}
                      className="w-full bg-black/80 border border-white/15 px-4 py-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-zinc-400 mb-1">Budget Range</label>
                    <input 
                      type="text" 
                      placeholder="e.g. ₹ 80 L – ₹ 1.2 Cr"
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
