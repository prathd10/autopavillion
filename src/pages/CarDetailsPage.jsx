import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, ChevronLeft, ChevronRight, ArrowLeft, Check, Send, Loader2, Scale } from 'lucide-react';
import { ikUrl } from '../lib/imagekit';
import { useComparison } from '../hooks/useComparison';
import confetti from 'canvas-confetti';
import { supabase } from '../lib/supabase';
import { useCars } from '../hooks/useCars';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CarCard from '../components/CarCard';

export default function CarDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { cars, loading: carsLoading } = useCars();
  const { toggleCompare, isComparing, clearCompare } = useComparison();
  
  const [car, setCar] = useState(null);
  const [suggestedCars, setSuggestedCars] = useState([]);

  useEffect(() => {
    if (cars.length > 0) {
      const foundCar = cars.find(c => c.slug === slug);
      setCar(foundCar || null);
      
      const suggestions = cars.filter(c => c.slug !== slug).slice(0, 3);
      setSuggestedCars(suggestions);
      
      window.scrollTo(0, 0);
    }
  }, [slug, cars]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', city: 'Mumbai' });

  if (carsLoading || !car) {
    return (
      <div className="min-h-screen bg-[#08090c] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % car.images.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length);
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('inquiries').insert([{
        type: 'car_inquiry',
        name: formData.name,
        phone: formData.phone,
        details: {
          carId: car.id,
          carName: car.name,
          carPrice: car.price,
          city: formData.city
        }
      }]);

      if (error) throw error;
      setFormSubmitted(true);
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
    } catch (err) {
      console.error('Error submitting car inquiry:', err);
      alert('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090c] text-slate-100 font-mulish selection:bg-white selection:text-black">
      <Navbar compareCount={0} onOpenCompare={() => {}} searchTerm="" setSearchTerm={() => {}} />

      <main className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-zinc-400 hover:text-white transition-colors mb-6 text-xs uppercase font-bold tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Inventory</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Image Gallery Slider */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            {/* Main Image */}
            <div className="relative h-[400px] sm:h-[550px] rounded-2xl overflow-hidden bg-[#050608] border border-white/10 shadow-2xl group">
              <img
                src={ikUrl(car.images[activeImageIndex], { width: 1200, quality: 85 })}
                alt={car.name}
                className="w-full h-full object-contain transition-opacity duration-300"
              />
              
              {/* Slider Controls */}
              <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                  onClick={handlePrevImage}
                  className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-white hover:text-black transition-colors border border-white/20"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={handleNextImage}
                  className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-white hover:text-black transition-colors border border-white/20"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Counter */}
              <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-xs font-bold text-white tracking-widest">
                {activeImageIndex + 1} / {car.images.length}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {car.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`h-20 sm:h-24 w-28 sm:w-36 rounded-xl overflow-hidden border transition-all shrink-0 ${
                    idx === activeImageIndex ? 'border-white scale-95 opacity-100' : 'border-white/10 opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={ikUrl(img, { width: 300, height: 200, quality: 60 })} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Description / Concierge Notes */}
            {car.description && (
              <div className="p-6 rounded-2xl border border-white/10 bg-[#0c0d11] space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 block mb-1">Concierge Notes & Description</span>
                <div 
                  className="text-xs sm:text-sm text-zinc-300 leading-relaxed space-y-3 description-content"
                  dangerouslySetInnerHTML={{ __html: car.description }}
                />
              </div>
            )}
            
            {/* Certification Block placed below images on desktop */}
            <div className="hidden lg:flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 rounded-2xl border border-white/10 bg-[#0c0d11] mt-auto">
              <div className="flex items-center space-x-4">
                <ShieldCheck className="w-10 h-10 text-white" />
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
                    Auto Pavilion Official Certification
                  </span>
                  <h3 className="text-lg font-bold text-white">251-Point Diagnostic Report</h3>
                  <p className="text-xs text-zinc-400 mt-1">Verified genuine mileage & non-accident guarantee.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Details & CTAs */}
          <div className="lg:col-span-5 flex flex-col h-full">
            
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-3">
                <img src={car.brandLogo} alt={car.brand} className="h-6 sm:h-8 w-auto object-contain" />
                <span className="text-[10px] sm:text-xs uppercase font-bold tracking-widest text-zinc-400">
                  {car.brand} • {car.year}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white font-heading uppercase tracking-tight leading-none mb-2">{car.name}</h1>
              <p className="text-sm text-zinc-400 font-medium">{car.subtitle}</p>
            </div>

            {/* Technical Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-2xl bg-[#0c0d11] border border-white/10 space-y-1">
                <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-500">Fuel Type</span>
                <p className="text-sm font-bold text-white">{car.fuelType || 'Petrol'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#0c0d11] border border-white/10 space-y-1">
                <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-500">Exterior Color</span>
                <p className="text-sm font-bold text-white">{car.color || 'Contact Concierge'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#0c0d11] border border-white/10 space-y-1">
                <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-500">Body Type</span>
                <p className="text-sm font-bold text-white">{car.bodyType || 'Luxury Car'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#0c0d11] border border-white/10 space-y-1">
                <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-500">Mileage</span>
                <p className="text-sm font-bold text-white">{car.mileageKms}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#0c0d11] border border-white/10 space-y-1">
                <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-500">Transmission</span>
                <p className="text-sm font-bold text-white">{car.transmission}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#0c0d11] border border-white/10 space-y-1">
                <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-500">Ownership</span>
                <p className="text-sm font-bold text-white">
                  {car.owners ? `${car.owners}${car.owners === 1 ? 'st' : car.owners === 2 ? 'nd' : 'rd'} Owner` : '1st Owner'}
                </p>
              </div>
            </div>



            {/* Price Box */}
            <div className="py-4 border-y border-white/10 mb-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">
                {car.status === 'sold' ? 'Status' : 'Offer Price'}
              </span>
              <div className="flex items-center space-x-3 mt-1">
                {car.status === 'sold' ? (
                  <span className="px-4 py-1.5 bg-gradient-to-r from-red-950 to-red-900 border border-red-800/40 text-red-200 text-xs sm:text-sm font-black uppercase tracking-widest rounded-full shadow-lg">
                    SOLD
                  </span>
                ) : (
                  <>
                    <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white">{car.price}</span>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Ex-Showroom</span>
                  </>
                )}
              </div>
            </div>


            {/* Inquiry Form / CTAs */}
            <div className="pt-2">
              {formSubmitted ? (
                <div className="p-6 rounded-2xl border border-green-500/30 bg-green-500/10 text-center space-y-3">
                  <Check className="w-10 h-10 text-green-400 mx-auto" />
                  <h4 className="text-lg font-black text-white font-heading uppercase">Inquiry Received</h4>
                  <p className="text-xs text-zinc-300 font-bold uppercase tracking-widest leading-relaxed">
                    Our VIP concierge will contact you within 15 minutes.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <h4 className="text-sm font-black text-white uppercase tracking-widest mb-4">Express Interest</h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl bg-[#0c0d11] border border-white/10 text-white text-xs font-bold tracking-wide focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        required
                        placeholder="Phone (+91)"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl bg-[#0c0d11] border border-white/10 text-white text-xs font-bold tracking-wide focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-4 rounded-xl bg-white text-black font-extrabold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <span>Request Callback</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => window.dispatchEvent(new CustomEvent('open-vip-modal'))}
                      className="flex-1 py-4 rounded-xl bg-transparent border border-white/20 text-white font-extrabold text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                    >
                      Schedule Viewing
                    </button>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => toggleCompare(car.id)}
                    className={`w-full py-4 rounded-xl border font-extrabold text-xs uppercase tracking-widest transition-all flex items-center justify-center space-x-2 mt-3 ${
                      isComparing(car.id)
                        ? 'bg-white text-black border-white'
                        : 'bg-transparent border-white/20 text-white hover:bg-white/10'
                    }`}
                  >
                    <Scale className="w-4 h-4" />
                    <span>{isComparing(car.id) ? 'Added to Compare' : 'Compare this Vehicle'}</span>
                  </button>
                </form>
              )}
            </div>

            {/* EMI Calculator */}
            {car.status !== 'sold' && car.priceRaw > 0 && (
              <EmiCalculator carPriceRaw={car.priceRaw} />
            )}

          </div>
        </div>

        {/* Suggested Cars Section */}
        {suggestedCars.length > 0 && (
          <div className="mt-24 pt-16 border-t border-white/10">
            <div className="flex flex-col items-center justify-center text-center mb-10 pb-6 border-b border-white/10 space-y-2">
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-heading uppercase">
                Similar <span className="text-zinc-400 font-extralight">Vehicles</span>
              </h2>
              <div className="text-zinc-400 font-bold uppercase tracking-[0.25em] text-[10px] sm:text-xs pt-1">
                You might also like
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {suggestedCars.map(c => (
                <div key={c.id} className="relative group h-full flex flex-col">
                  <CarCard car={c} />
                  <button
                    onClick={() => {
                      clearCompare();
                      toggleCompare(car.id);
                      toggleCompare(c.id);
                      navigate(`/compare?cars=${car.id},${c.id}`);
                      window.scrollTo(0, 0);
                    }}
                    className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/15 text-[9px] uppercase tracking-wider font-extrabold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center space-x-1 hover:bg-white hover:text-black"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>Compare side-by-side</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

function EmiCalculator({ carPriceRaw }) {
  const [downPaymentPct, setDownPaymentPct] = React.useState(20); // 20%
  const [tenureYears, setTenureYears] = React.useState(5); // 5 Years
  const [interestRate, setInterestRate] = React.useState(9.5); // 9.5%

  const price = carPriceRaw || 4000000;
  const downPayment = Math.round((price * downPaymentPct) / 100);
  const loanAmount = price - downPayment;

  const calculateEmi = () => {
    const r = interestRate / 12 / 100;
    const n = tenureYears * 12;
    if (r === 0) return loanAmount / n;
    const emi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return Math.round(emi);
  };

  const emi = calculateEmi();
  const totalPayment = emi * tenureYears * 12;
  const totalInterest = totalPayment - loanAmount;

  const formatRupees = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="mt-6 p-6 rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0c0d11]/85 backdrop-blur-md space-y-4">
      <h4 className="text-xs font-black text-white uppercase tracking-widest border-b border-white/5 pb-2">
        EMI Calculator
      </h4>

      <div className="space-y-3">
        {/* Down Payment Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] sm:text-xs font-semibold">
            <span className="text-zinc-400">Down Payment ({downPaymentPct}%)</span>
            <span className="text-white font-mono">{formatRupees(downPayment)}</span>
          </div>
          <input
            type="range"
            min="10"
            max="80"
            step="5"
            value={downPaymentPct}
            onChange={(e) => setDownPaymentPct(Number(e.target.value))}
            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>

        {/* Tenure Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] sm:text-xs font-semibold">
            <span className="text-zinc-400">Tenure</span>
            <span className="text-white font-mono">{tenureYears} Years</span>
          </div>
          <input
            type="range"
            min="1"
            max="7"
            step="1"
            value={tenureYears}
            onChange={(e) => setTenureYears(Number(e.target.value))}
            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>

        {/* Interest Rate Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] sm:text-xs font-semibold">
            <span className="text-zinc-400">Interest Rate (p.a.)</span>
            <span className="text-white font-mono">{interestRate}%</span>
          </div>
          <input
            type="range"
            min="7"
            max="15"
            step="0.25"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>
      </div>

      {/* Result Display */}
      <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-center space-y-0.5">
        <span className="text-[8px] uppercase tracking-widest text-zinc-400 font-bold">Estimated Monthly EMI</span>
        <div className="text-xl sm:text-2xl font-black text-amber-500 font-mono">
          {formatRupees(emi)}<span className="text-[10px] text-zinc-400 font-mulish font-normal"> / mo</span>
        </div>
      </div>

      {/* Breakdowns */}
      <div className="grid grid-cols-2 gap-2 text-[9px] sm:text-[10px]">
        <div className="p-2.5 rounded-lg bg-[#090a0d] border border-white/5 space-y-0.5">
          <span className="text-zinc-500 uppercase font-bold tracking-wider">Loan Principal</span>
          <p className="text-white font-mono font-bold">{formatRupees(loanAmount)}</p>
        </div>
        <div className="p-2.5 rounded-lg bg-[#090a0d] border border-white/5 space-y-0.5">
          <span className="text-zinc-500 uppercase font-bold tracking-wider">Interest Payable</span>
          <p className="text-white font-mono font-bold">{formatRupees(totalInterest)}</p>
        </div>
      </div>

      <p className="text-[8px] text-zinc-500 font-mulish text-center leading-normal">
        *Calculations are indicative. Rates and loan terms vary based on financial profile and lending institutions.
      </p>
    </div>
  );
}
