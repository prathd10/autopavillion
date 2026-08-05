import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ArrowUpRight, ShieldCheck, Share2, Globe } from 'lucide-react';
import { BRAND_LOGOS } from '../data/cars';

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleOpenVipModal = () => {
    window.dispatchEvent(new CustomEvent('open-vip-modal'));
  };

  const handleNavClick = (path, id) => {
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
    <footer className="bg-black text-white border-t border-white/10 pt-16 pb-28 sm:pb-12 relative">
      {/* Hidden SVG Filter to remove white backgrounds */}
      <svg width="0" height="0" className="absolute">
        <filter id="remove-white">
          <feColorMatrix type="matrix" values="
            1 0 0 0 0
            0 1 0 0 0
            0 0 1 0 0
            -1 -1 -1 0 3
          " />
        </filter>
      </svg>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          
          {/* Brand Block (Original Logo ONLY) */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="inline-block">
              <img
                src="https://autopavilion.in/wp-content/uploads/2023/10/cropped-autopavilion_logo.png"
                alt="Auto Pavilion"
                className="h-12 w-auto object-contain"
              />
            </Link>

            <p className="text-xs text-zinc-400 font-mulish leading-relaxed max-w-sm">
              Auto Pavilion is Mumbai’s premier pre-owned luxury vehicle dealership. Dedicated to procuring fully certified premium vehicles for discerning buyers across India.
            </p>

            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://autopavilion.in"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full bg-white/5 hover:bg-white hover:text-black border border-white/10 transition-all"
                title="Official Website"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="tel:+918291919393"
                className="p-2.5 rounded-full bg-white/5 hover:bg-white hover:text-black border border-white/10 transition-all"
                title="Call Desk"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href="https://maps.google.com/?q=Auto+Pavilion,+Office+No:25,+Tirupati+Shopping+center,+S+V+Rd,+Santacruz+(W),+Mumbai-400054"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full bg-white/5 hover:bg-white hover:text-black border border-white/10 transition-all"
                title="Showroom Location"
              >
                <MapPin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Showroom</h4>
            <ul className="space-y-2.5 text-xs text-zinc-400 font-mulish">
              <li>
                <button onClick={() => handleNavClick('/inventory')} className="hover:text-white transition-colors">
                  Premium Inventory
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick(null, 'recently-sold')} className="hover:text-white transition-colors">
                  Recently Sold
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('/sourcing')} className="hover:text-white transition-colors">
                  Vehicle Sourcing
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('/sell')} className="hover:text-white transition-colors">
                  Sell / Trade-In
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('/finance')} className="hover:text-white transition-colors">
                  Finance Options
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('/compare')} className="hover:text-white transition-colors">
                  Compare Vehicles
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('/insights')} className="hover:text-white transition-colors">
                  Journal & Insights
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('/about')} className="hover:text-white transition-colors">
                  About Us & Heritage
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('/faq')} className="hover:text-white transition-colors">
                  FAQs & Support
                </button>
              </li>
              <li>
                <button onClick={handleOpenVipModal} className="hover:text-white transition-colors">
                  Schedule a Viewing
                </button>
              </li>
            </ul>
          </div>

          {/* Featured Marques */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Marques</h4>
            <ul className="space-y-2.5 text-xs text-zinc-400 font-mulish">
              <li>Porsche 911 GT3 RS</li>
              <li>Lamborghini Huracán EVO</li>
              <li>Ferrari 488 Pista</li>
              <li>Mercedes-AMG G63</li>
              <li>Rolls-Royce & Bentley</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">Mumbai Showroom Address</h4>
            <div className="space-y-3 text-xs text-zinc-400 font-mulish">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <a href="https://maps.google.com/?q=Auto+Pavilion,+Office+No:25,+Tirupati+Shopping+center,+S+V+Rd,+Santacruz+(W),+Mumbai-400054" target="_blank" rel="noreferrer" className="hover:text-white transition-colors text-left flex flex-col items-start">
                  <span>Auto Pavilion,</span>
                  <span>Office No:25, Tirupati Shopping center, S V Rd,</span>
                  <span>Santacruz (W), Mumbai-400054</span>
                </a>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-white shrink-0" />
                <a href="tel:+918291919393" className="font-mono font-bold text-white hover:underline">
                  +91 82 9191 9393
                </a>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-white shrink-0" />
                <a href="mailto:info@autopavilion.in" className="hover:text-white transition-colors">
                  info@autopavilion.in
                </a>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-white shrink-0" />
                <span>Mon - Sat: 10:00 AM - 8:00 PM (IST)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Brand Logos Marquee in Footer */}
        <div className="py-8 border-b border-white/10 overflow-hidden relative w-full">
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee flex items-center space-x-12 shrink-0">
            {[...BRAND_LOGOS, ...BRAND_LOGOS].map((b, idx) => (
              <button
                key={idx}
                onClick={() => {
                  navigate(`/inventory?brand=${encodeURIComponent(b.name)}`);
                  window.scrollTo(0,0);
                }}
                className="flex items-center space-x-2.5 shrink-0 opacity-50 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
              >
                <img
                  src={b.icon}
                  alt={b.name}
                  className="h-7 sm:h-9 w-auto object-contain"
                  style={
                    b.isLocal
                      ? { filter: 'url(#remove-white)' }
                      : { filter: 'invert(1)' }
                  }
                />
                <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-zinc-400">
                  {b.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500 font-mulish">
          <div className="text-center sm:text-left flex flex-col sm:flex-row sm:items-center sm:space-x-2">
            <span>© 2026 Auto Pavilion India Private Limited. All rights reserved.</span>
            <span className="mt-1 sm:mt-0">Developed by <a href="#" className="font-bold text-white hover:text-zinc-300 transition-colors">SynexAI</a></span>
          </div>

          <div className="flex items-center space-x-2 text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-white" />
            <span>Quality Certified Dealer</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
