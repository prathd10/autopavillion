import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Scale } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar({ compareCount, onOpenCompare, searchTerm, setSearchTerm }) {
  const handleOpenVipModal = () => {
    window.dispatchEvent(new CustomEvent('open-vip-modal'));
  };
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (path, id) => {
    setMobileMenuOpen(false);
    if (path) {
      navigate(path);
    } else if (id) {
      if (location.pathname === '/') {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
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
          
          {/* Left: Logo Image (Original Gold at top, White when scrolled down) */}
          <Link to="/" className="flex items-center group shrink-0">
            <img
              src="https://autopavilion.in/wp-content/uploads/2023/10/cropped-autopavilion_logo.png"
              alt="Auto Pavilion"
              className={`h-7 sm:h-9 w-auto object-contain transition-all duration-300 group-hover:scale-105 ${
                scrolled ? 'brightness-0 invert' : ''
              }`}
            />
          </Link>

          {/* Center: Spaced Nav Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-xs font-semibold tracking-widest text-zinc-300 uppercase">
            <button onClick={() => handleNavClick('/')} className="hover:text-white transition-colors">
              Home
            </button>
            <button onClick={() => handleNavClick('/inventory')} className="hover:text-white transition-colors">
              Inventory
            </button>
            <button onClick={() => handleNavClick('/compare')} className="hover:text-white transition-colors">
              Compare
            </button>
            <button onClick={() => handleNavClick('/sourcing')} className="hover:text-white transition-colors">
              Sourcing
            </button>
            <button onClick={() => handleNavClick('/sell')} className="hover:text-white transition-colors">
              Sell
            </button>
            <button onClick={() => handleNavClick('/about')} className="hover:text-white transition-colors">
              About Us
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
              onClick={handleOpenVipModal}
              className="px-6 py-2.5 rounded-full bg-white text-black font-bold text-xs tracking-wider flex items-center space-x-2.5 hover:bg-zinc-200 transition-all shadow-xl group"
            >
              <span>Schedule a Viewing</span>
              <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white hover:text-zinc-300 focus:outline-none transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-black/95 border-b border-white/10 px-6 py-6 transition-all space-y-4">
          <div className="flex flex-col space-y-3 text-xs font-semibold uppercase tracking-widest text-zinc-300">
            <button onClick={() => handleNavClick('/')} className="text-left py-2 border-b border-white/10">
              Home
            </button>
            <button onClick={() => handleNavClick('/inventory')} className="text-left py-2 border-b border-white/10">
              Inventory
            </button>
            <button onClick={() => handleNavClick('/compare')} className="text-left py-2 border-b border-white/10">
              Compare
            </button>
            <button onClick={() => handleNavClick('/sourcing')} className="text-left py-2 border-b border-white/10">
              Vehicle Sourcing
            </button>
            <button onClick={() => handleNavClick('/sell')} className="text-left py-2 border-b border-white/10">
              Sell / Trade-In
            </button>
            <button onClick={() => handleNavClick('/about')} className="text-left py-2 border-b border-white/10">
              About Us
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleOpenVipModal();
              }}
              className="w-full py-3 rounded-full bg-white text-black font-bold text-xs uppercase tracking-widest text-center flex items-center justify-center space-x-2 mt-2"
            >
              <span>Schedule a Viewing</span>
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
