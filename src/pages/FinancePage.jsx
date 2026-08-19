import React, { useState, useEffect } from 'react';
import { ArrowLeft, Landmark, Percent, Calculator, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function FinancePage() {
  const [loanAmount, setLoanAmount] = useState(10000000);
  const [interestRate, setInterestRate] = useState(9.5);
  const [tenureYears, setTenureYears] = useState(5);
  const [emi, setEmi] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
    const p = Number(loanAmount);
    const r = Number(interestRate) / 12 / 100;
    const n = Number(tenureYears) * 12;

    if (p > 0 && r > 0 && n > 0) {
      const emiValue = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      setEmi(Math.round(emiValue));
    } else {
      setEmi(0);
    }
  }, [loanAmount, interestRate, tenureYears]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Navigation */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-xs text-zinc-400 hover:text-white uppercase font-bold tracking-widest transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-12 border-b border-white/10 pb-8 text-center sm:text-left">
          <h1 className="text-4xl sm:text-6xl font-black font-heading uppercase tracking-tight mb-4">
            Finance <span className="text-zinc-500 font-extralight block sm:inline">Your Dream</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 font-mulish max-w-2xl mx-auto sm:mx-0">
            We partner with India's leading private banks to offer tailored financing solutions with highly competitive interest rates and flexible tenures.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          
          {/* EMI Calculator Form */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
            <div className="flex items-center space-x-3 mb-6">
              <Calculator className="w-6 h-6 text-white" />
              <h2 className="text-2xl font-bold font-heading uppercase">EMI Studio</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold uppercase text-zinc-300 block mb-2 flex justify-between">
                  <span>Loan Amount</span>
                  <span className="text-white">{formatCurrency(loanAmount)}</span>
                </label>
                <input
                  type="range"
                  min="1000000"
                  max="50000000"
                  step="500000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  className="w-full accent-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-zinc-300 block mb-2 flex justify-between">
                  <span>Interest Rate (% p.a.)</span>
                  <span className="text-white">{interestRate}%</span>
                </label>
                <input
                  type="range"
                  min="7.5"
                  max="15.0"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="w-full accent-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-zinc-300 block mb-2 flex justify-between">
                  <span>Tenure (Years)</span>
                  <span className="text-white">{tenureYears} Years</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="7"
                  step="1"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(e.target.value)}
                  className="w-full accent-white"
                />
              </div>
            </div>

            <div className="mt-10 p-6 bg-black border border-white/20 rounded-2xl text-center">
              <div className="text-xs text-zinc-400 uppercase tracking-widest font-bold mb-2">Estimated Monthly EMI</div>
              <div className="text-4xl font-black font-mono text-white">{formatCurrency(emi)}</div>
              <div className="text-[10px] text-zinc-500 mt-2">*Indicative figure. Subject to bank approval.</div>
            </div>
          </div>

          {/* Info Side */}
          <div className="space-y-8 flex flex-col justify-center">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-white/10 rounded-xl shrink-0">
                <Landmark className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-heading uppercase mb-2">Premier Banking Partners</h3>
                <p className="text-sm text-zinc-400 font-mulish">
                  We have direct alliances with India's leading private banks and financial institutions to ensure smooth, fast-track approvals for our clients.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 bg-white/10 rounded-xl shrink-0">
                <Percent className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-heading uppercase mb-2">Competitive Rates</h3>
                <p className="text-sm text-zinc-400 font-mulish">
                  Benefit from customized financing structures tailored to your credit profile, offering some of the lowest interest rates in the luxury segment.
                </p>
              </div>
            </div>

            <div className="pt-6">
               <a
                  href="tel:+918291919393"
                  className="px-8 py-4 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-widest inline-flex items-center space-x-3 hover:bg-zinc-200 transition-all shadow-xl"
                >
                  <Phone className="w-4 h-4" />
                  <span>Speak with our Finance Advisor</span>
                </a>
            </div>
          </div>

        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
}
