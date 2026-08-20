import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ArrowUpRight, ShieldCheck, Share2, Globe } from 'lucide-react';

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
          <div className="lg:col-span-3 space-y-4">
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

          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-4">
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



        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500 font-mulish">
          <div className="text-center sm:text-left flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <span>© 2026 Auto Pavilion India Private Limited. All rights reserved.</span>
            <div className="mt-1 sm:mt-0 flex items-center space-x-3">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <span className="text-zinc-700">|</span>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
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
