import React, { useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Clock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import TradeInCalculator from '../components/TradeInCalculator';

export default function SellPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Navigation */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-xs text-zinc-400 hover:text-white uppercase font-bold tracking-widest transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Sell Page Header */}
        <div className="mb-12 border-b border-white/10 pb-8 text-center sm:text-left">
          <h1 className="text-4xl sm:text-6xl font-black font-heading uppercase tracking-tight mb-4">
            Sell or Trade-In <span className="text-zinc-500 font-extralight block sm:inline">Your Premium Vehicle</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 font-mulish max-w-2xl mx-auto sm:mx-0">
            Auto Pavilion offers an instant, transparent, and discreet selling experience for luxury vehicles. Get a guaranteed market appraisal and same-day payment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center text-center">
            <Clock className="w-8 h-8 text-white mb-4" />
            <h3 className="text-lg font-bold font-heading uppercase text-white mb-2">30-Minute Valuation</h3>
            <p className="text-xs text-zinc-400 font-mulish">We respect your time. Our experts provide a precise, no-obligation offer within 30 minutes of inspection.</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center text-center">
            <ShieldCheck className="w-8 h-8 text-white mb-4" />
            <h3 className="text-lg font-bold font-heading uppercase text-white mb-2">Discreet & Secure</h3>
            <p className="text-xs text-zinc-400 font-mulish">Every transaction is handled with absolute confidentiality and immediate RTGS settlement to ensure your security.</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center text-center">
            <Zap className="w-8 h-8 text-white mb-4" />
            <h3 className="text-lg font-bold font-heading uppercase text-white mb-2">Nationwide Pickup</h3>
            <p className="text-xs text-zinc-400 font-mulish">We offer complimentary flatbed collection from your residence anywhere in India once the deal is finalized.</p>
          </div>
        </div>

      </div>
      
      {/* Reusing TradeInCalculator component */}
      <TradeInCalculator />
    </div>
  );
}
