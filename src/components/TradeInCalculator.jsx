import React, { useState } from 'react';
import { Calculator, Phone, Clock, CheckCircle2, Send, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function TradeInCalculator() {
  const parallaxBg = "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=2400&auto=format&fit=crop";

  const [submitted, setSubmitted] = useState(false);
  const [calculatedValue, setCalculatedValue] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    brand: 'Porsche',
    customBrand: '',
    model: '',
    year: '2022',
    mileage: '5000'
  });
  const [loading, setLoading] = useState(false);

  const displayBrand = formData.brand === 'Other' ? formData.customBrand : formData.brand;

  const calculateValuation = async (e) => {
    e.preventDefault();
    setLoading(true);

    let baseVal = 1500000; // Default base value for normal brands

    // Super luxury / Hypercars
    if (['Ferrari', 'Rolls-Royce', 'McLaren', 'Aston Martin'].includes(formData.brand)) {
      baseVal = 45000000;
    }
    // High Luxury
    else if (['Lamborghini', 'Bentley'].includes(formData.brand)) {
      baseVal = 35000000;
    }
    // Luxury Sports
    else if (['Porsche', 'Maserati', 'Mercedes-AMG'].includes(formData.brand)) {
      baseVal = 28000000;
    }
    // Premium Luxury
    else if (['Mercedes-Benz', 'BMW', 'Audi', 'Land Rover', 'Jaguar', 'Lexus', 'Volvo'].includes(formData.brand)) {
      baseVal = 6000000;
    }
    // Semi-Premium
    else if (['Toyota', 'Jeep', 'Mini', 'Volkswagen', 'Skoda'].includes(formData.brand)) {
      baseVal = 3000000;
    }
    // Normal Mass-market
    else if (['Honda', 'Hyundai', 'Kia', 'Mahindra', 'Tata', 'Maruti Suzuki', 'MG', 'Ford'].includes(formData.brand)) {
      baseVal = 1200000;
    }

    const yearFactor = (Number(formData.year) - 2022) * (baseVal * 0.08);
    const mileageDep = (Number(formData.mileage) / 10000) * (baseVal * 0.05);
    const finalEstimate = Math.max(baseVal * 0.35, baseVal + yearFactor - mileageDep);

    try {
      const { error } = await supabase.from('inquiries').insert([{
        type: 'trade_in',
        name: formData.name,
        phone: formData.phone,
        details: {
          brand: formData.brand,
          customBrand: formData.customBrand,
          model: formData.model,
          year: formData.year,
          mileage: formData.mileage
        }
      }]);

      if (error) throw error;

      setCalculatedValue({
        min: finalEstimate * 0.95,
        max: finalEstimate * 1.05
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting trade-in request:', err);
      alert('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section 
      id="valuation" 
      className="py-20 text-white relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${parallaxBg})`,
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Seamless Continuous Parallax Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-heading uppercase">
            SELL YOUR CAR <span className="text-zinc-400 font-extralight">IN 30 MINUTES</span>
          </h2>

          <p className="text-zinc-400 text-xs sm:text-sm font-mulish">
            Receive guaranteed buyback quotes and transparent market appraisals for your premium vehicle.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-black/75 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-white/20 shadow-2xl">
          
          {submitted && calculatedValue ? (
            <div className="py-8 text-center space-y-6 animate-fadeIn">
              <CheckCircle2 className="w-16 h-16 text-white mx-auto mb-4" />
              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider font-heading">
                Request Received, {formData.name.split(' ')[0]}
              </h3>
              <p className="text-sm text-zinc-400 max-w-md mx-auto font-mulish">
                Our acquisition team has received the details for your {formData.year} {displayBrand} {formData.model}.
              </p>

              <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/20 max-w-md mx-auto">
                <div className="flex items-center justify-center space-x-2 text-[10px] uppercase font-bold text-zinc-400 mb-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Instant Market Appraisal Estimate</span>
                </div>
                <div className="text-3xl font-mono font-black text-white">
                  {calculatedValue.min >= 10000000 
                    ? `₹ ${(calculatedValue.min / 10000000).toFixed(2)} Cr - ₹ ${(calculatedValue.max / 10000000).toFixed(2)} Cr`
                    : `₹ ${(calculatedValue.min / 100000).toFixed(1)} Lakh - ₹ ${(calculatedValue.max / 100000).toFixed(1)} Lakh`
                  }
                </div>
              </div>

              <div className="pt-6 flex justify-center space-x-4">
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-3 rounded-full bg-white/10 text-white font-bold text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-all"
                >
                  Submit Another Vehicle
                </button>
                <a
                  href={`https://wa.me/918291919393?text=Hi%20Auto%20Pavilion,%20I%20just%20submitted%20my%20${formData.year}%20${displayBrand}%20${formData.model}%20for%20valuation.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center space-x-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>WhatsApp Us</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={calculateValuation} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3.5 rounded-xl bg-black border border-white/20 text-white text-xs font-semibold focus:outline-none focus:border-white placeholder-zinc-600"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98200 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3.5 rounded-xl bg-black border border-white/20 text-white text-xs font-semibold focus:outline-none focus:border-white placeholder-zinc-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Select Brand *</label>
                  <select
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    className="w-full px-4 py-3.5 rounded-xl bg-black border border-white/20 text-white text-xs font-semibold focus:outline-none focus:border-white"
                  >
                    {/* Luxury & Supercar */}
                    <option value="Aston Martin">Aston Martin</option>
                    <option value="Bentley">Bentley</option>
                    <option value="Ferrari">Ferrari</option>
                    <option value="Lamborghini">Lamborghini</option>
                    <option value="Maserati">Maserati</option>
                    <option value="McLaren">McLaren</option>
                    <option value="Porsche">Porsche</option>
                    <option value="Rolls-Royce">Rolls-Royce</option>
                    
                    {/* Premium / Luxury */}
                    <option value="Audi">Audi</option>
                    <option value="BMW">BMW</option>
                    <option value="Jaguar">Jaguar</option>
                    <option value="Land Rover">Land Rover</option>
                    <option value="Lexus">Lexus</option>
                    <option value="Mercedes-Benz">Mercedes-Benz</option>
                    <option value="Mercedes-AMG">Mercedes-AMG</option>
                    <option value="Mini">Mini</option>
                    <option value="Volvo">Volvo</option>
                    
                    {/* Normal / Other Brands */}
                    <option value="Ford">Ford</option>
                    <option value="Honda">Honda</option>
                    <option value="Hyundai">Hyundai</option>
                    <option value="Jeep">Jeep</option>
                    <option value="Kia">Kia</option>
                    <option value="Mahindra">Mahindra</option>
                    <option value="Maruti Suzuki">Maruti Suzuki</option>
                    <option value="MG">MG</option>
                    <option value="Skoda">Skoda</option>
                    <option value="Tata">Tata</option>
                    <option value="Toyota">Toyota</option>
                    <option value="Volkswagen">Volkswagen</option>
                    
                    <option value="Other">Other (Specify)</option>
                  </select>
                </div>
                
                {formData.brand === 'Other' && (
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Specify Brand *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aston Martin"
                      value={formData.customBrand}
                      onChange={(e) => setFormData({...formData, customBrand: e.target.value})}
                      className="w-full px-4 py-3.5 rounded-xl bg-black border border-white/20 text-white text-xs font-semibold focus:outline-none focus:border-white placeholder-zinc-600"
                    />
                  </div>
                )}

                <div className={formData.brand === 'Other' ? "sm:col-span-1" : "sm:col-span-2"}>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Specific Model *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 911 Carrera S"
                    value={formData.model}
                    onChange={(e) => setFormData({...formData, model: e.target.value})}
                    className="w-full px-4 py-3.5 rounded-xl bg-black border border-white/20 text-white text-xs font-semibold focus:outline-none focus:border-white placeholder-zinc-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Registration Year *</label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                    className="w-full px-4 py-3.5 rounded-xl bg-black border border-white/20 text-white text-xs font-semibold focus:outline-none focus:border-white"
                  >
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                    <option value="2019">2019</option>
                    <option value="2018">2018</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Odometer (Kms) *</label>
                  <input
                    type="number"
                    required
                    value={formData.mileage}
                    onChange={(e) => setFormData({...formData, mileage: e.target.value})}
                    placeholder="e.g. 5000"
                    className="w-full px-4 py-3.5 rounded-xl bg-black border border-white/20 text-white text-xs font-semibold focus:outline-none focus:border-white placeholder-zinc-600"
                  />
                </div>
              </div>

              <div className="text-center pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-xl shadow-white/10 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Get Instant Valuation</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </section>
  );
}
