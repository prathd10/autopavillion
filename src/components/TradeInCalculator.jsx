import React, { useState } from 'react';
import { Sparkles, Calculator, Phone, Clock } from 'lucide-react';

export default function TradeInCalculator() {
  const [selectedBrand, setSelectedBrand] = useState('Porsche');
  const [year, setYear] = useState('2022');
  const [mileage, setMileage] = useState('5000');
  const [calculatedValue, setCalculatedValue] = useState(null);

  const calculateValuation = (e) => {
    e.preventDefault();
    let baseVal = 25000000;
    if (selectedBrand === 'Ferrari' || selectedBrand === 'Rolls-Royce') baseVal = 45000000;
    if (selectedBrand === 'Lamborghini' || selectedBrand === 'Bentley') baseVal = 35000000;
    if (selectedBrand === 'Porsche' || selectedBrand === 'Mercedes-AMG') baseVal = 28000000;

    const yearFactor = (Number(year) - 2018) * 2000000;
    const mileageDep = (Number(mileage) / 1000) * 400000;
    const finalEstimate = Math.max(12000000, baseVal + yearFactor - mileageDep);

    const minRange = (finalEstimate * 0.95 / 10000000).toFixed(2);
    const maxRange = (finalEstimate * 1.05 / 10000000).toFixed(2);

    setCalculatedValue({ min: minRange, max: maxRange });
  };

  return (
    <section id="valuation" className="py-20 bg-black text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Trade-In Concierge</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-heading uppercase">
            SELL YOUR LUXURY CAR <span className="text-zinc-400 font-extralight">IN 30 MINUTES</span>
          </h2>

          <p className="text-zinc-400 text-xs sm:text-sm font-mulish">
            Receive guaranteed buyback quotes and transparent market appraisals for your premium vehicle.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mono-panel p-8 sm:p-10 rounded-3xl border border-white/12">
          <form onSubmit={calculateValuation} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-zinc-300 block mb-2">Select Brand</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-black border border-white/20 text-white text-xs font-semibold focus:outline-none focus:border-white"
                >
                  <option value="Porsche">Porsche</option>
                  <option value="Lamborghini">Lamborghini</option>
                  <option value="Ferrari">Ferrari</option>
                  <option value="Mercedes-AMG">Mercedes-AMG</option>
                  <option value="Bentley">Bentley</option>
                  <option value="Rolls-Royce">Rolls-Royce</option>
                  <option value="Land Rover">Land Rover</option>
                  <option value="BMW M">BMW M</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-zinc-300 block mb-2">Registration Year</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-black border border-white/20 text-white text-xs font-semibold focus:outline-none focus:border-white"
                >
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-zinc-300 block mb-2">Odometer (Kms)</label>
                <input
                  type="number"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full px-4 py-3.5 rounded-xl bg-black border border-white/20 text-white text-xs font-semibold focus:outline-none focus:border-white"
                />
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                type="submit"
                className="px-8 py-4 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-xl inline-flex items-center space-x-2"
              >
                <Calculator className="w-4 h-4" />
                <span>Calculate Valuation</span>
              </button>
            </div>
          </form>

          {calculatedValue && (
            <div className="mt-8 p-6 rounded-2xl bg-black border border-white/20 text-center animate-fadeIn space-y-4">
              <div className="flex items-center justify-center space-x-2 text-xs uppercase font-bold text-zinc-400">
                <Clock className="w-4 h-4 text-white" />
                <span>Instant Market Appraisal Estimate</span>
              </div>

              <div className="text-3xl sm:text-4xl font-mono font-black text-white">
                ₹ {calculatedValue.min} Cr - ₹ {calculatedValue.max} Cr
              </div>

              <div className="pt-2 flex justify-center">
                <a
                  href={`https://wa.me/918291919393?text=Hi%20Auto%20Pavilion,%20I%20want%20to%20sell%20my%20${selectedBrand}%20${year}%20model.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center space-x-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Request WhatsApp Offer (+91 829191 9393)</span>
                </a>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
