import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Scale } from 'lucide-react';

export default function Navbar({ compareCount, onOpenCompare, onOpenVipModal }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/90 backdrop-blur-xl py-3 border-b border-white/10 shadow-2xl'
          : 'bg-gradient-to-b from-black/90 via-black/40 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between">
          
          {/* Left: ONLY the Logo Image (No extra text next to it) */}
          <a href="#" className="flex items-center group shrink-0">
            <img
              src="https://autopavilion.in/wp-content/uploads/2023/10/cropped-autopavilion_logo.png"
              alt="Auto Pavilion Logo"
              className="h-10 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </a>

          {/* Center: Spaced Nav Links (Search bar removed completely) */}
          <nav className="hidden lg:flex items-center space-x-10 text-xs font-semibold tracking-widest text-zinc-300 uppercase">
            <button onClick={() => scrollTo('inventory')} className="hover:text-white transition-colors">
              Catalog
            </button>
            <button onClick={() => scrollTo('sound-studio')} className="hover:text-white transition-colors">
              Acoustics
            </button>
            <button onClick={() => scrollTo('certification')} className="hover:text-white transition-colors">
              251-Cert
            </button>
            <button onClick={() => scrollTo('valuation')} className="hover:text-white transition-colors">
              Valuation
            </button>
          </nav>

          {/* Right Action Button */}
          <div className="hidden sm:flex items-center space-x-4 shrink-0">
            {compareCount > 0 && (
              <button
                onClick={onOpenCompare}
                className="px-3.5 py-2 rounded-full bg-black/60 hover:bg-white hover:text-black border border-white/20 text-xs font-semibold text-white flex items-center space-x-1.5 backdrop-blur-md transition-all"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Compare ({compareCount})</span>
              </button>
            )}

            <button
              onClick={onOpenVipModal}
              className="px-6 py-2.5 rounded-full bg-white text-black font-bold text-xs tracking-wider flex items-center space-x-2.5 hover:bg-zinc-200 transition-all shadow-xl group"
            >
              <span>Request VIP Viewing</span>
              <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-full bg-black/70 text-white border border-white/20 backdrop-blur-md"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-black/95 border-b border-white/10 px-6 py-6 transition-all space-y-4">
          <div className="flex flex-col space-y-3 text-xs font-semibold uppercase tracking-widest text-zinc-300">
            <button onClick={() => scrollTo('inventory')} className="text-left py-2 border-b border-white/10">
              Catalog
            </button>
            <button onClick={() => scrollTo('sound-studio')} className="text-left py-2 border-b border-white/10">
              Acoustics
            </button>
            <button onClick={() => scrollTo('certification')} className="text-left py-2 border-b border-white/10">
              251-Point Certification
            </button>
            <button onClick={() => scrollTo('valuation')} className="text-left py-2 border-b border-white/10">
              Instant Sell / Valuation
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenVipModal();
              }}
              className="w-full py-3 rounded-full bg-white text-black font-bold text-xs uppercase tracking-widest text-center flex items-center justify-center space-x-2 mt-2"
            >
              <span>Request VIP Viewing</span>
              <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
