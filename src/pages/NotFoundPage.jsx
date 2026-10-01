import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { Compass } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#08090c] text-slate-100 font-mulish flex flex-col justify-between selection:bg-white selection:text-black">
      <SEO
        title="Page Not Found (404)"
        description="The page you are looking for does not exist, has been moved, or is no longer available at Auto Pavilion Mumbai."
        noindex={true}
      />
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center py-32 max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
          <Compass className="w-8 h-8 text-zinc-500" />
        </div>
        <h1 className="text-4xl sm:text-6xl font-heading font-black uppercase tracking-tight text-white mb-3">
          404 <span className="text-zinc-500 font-extralight block text-2xl sm:text-3xl mt-1">Page Not Found</span>
        </h1>
        <p className="text-zinc-400 text-sm mb-8 leading-relaxed font-mulish">
          The requested URL does not match any showroom page, journal article, or inventory listing in our system.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            to="/inventory"
            className="px-8 py-3.5 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-xl hover:scale-105"
          >
            Explore Inventory
          </Link>
          <Link
            to="/"
            className="px-8 py-3.5 rounded-full border border-white/15 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
