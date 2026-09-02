import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ArrowUpRight, ShieldCheck, Share2, Globe, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { BRAND_LOGOS } from '../data/cars';

function Odometer({ value }) {
  const digits = String(value).padStart(6, '0').split('');
  return (
    <div className="flex space-x-1 justify-start items-center">
      {digits.map((digit, idx) => (
        <div
          key={idx}
          className="relative w-6 h-9 bg-gradient-to-b from-[#1a1b20] via-[#090a0c] to-[#1a1b20] border border-white/10 rounded-md flex items-center justify-center overflow-hidden"
          style={{
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8), inset 0 -2px 4px rgba(0,0,0,0.8)',
          }}
        >
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-black/50 -translate-y-1/2 pointer-events-none z-10" />
          <span className="text-white text-xs font-black font-mono tracking-normal relative z-0 select-none">
            {digit}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = React.useState({
    total: 190783,
    today: 38,
    yesterday: 29
  });

  React.useEffect(() => {
    async function fetchAnalytics() {
      try {
        const { data, error } = await supabase.rpc('get_footer_analytics');
        if (error) throw error;
        if (data) {
          setAnalytics({
            total: data.total ?? 190783,
            today: data.today ?? 38,
            yesterday: data.yesterday ?? 29
          });
        }
      } catch (err) {
        console.warn('[FooterAnalytics] Failed to fetch:', err.message);
      }
    }
    fetchAnalytics();
  }, []);

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
                href="https://www.instagram.com/autopavilion_india/"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full bg-white/5 hover:bg-white hover:text-black border border-white/10 transition-all"
                title="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
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

            {/* Viewers Counter */}
            <div className="pt-6 border-t border-white/10 space-y-3.5">
              <span className="text-[9px] uppercase font-bold tracking-[0.25em] text-zinc-500 block">Website Visitors</span>
              <Odometer value={analytics.total} />
              <div className="space-y-2 pt-1 text-[11px] text-zinc-400">
                <div className="flex items-center space-x-2.5">
                  <Users className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="font-semibold uppercase tracking-wider text-[10px]">Users Today : <strong className="text-white font-mono">{analytics.today}</strong></span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Users className="w-3.5 h-3.5 text-zinc-600" />
                  <span className="font-semibold uppercase tracking-wider text-[10px]">Users Yesterday : <strong className="text-zinc-300 font-mono">{analytics.yesterday}</strong></span>
                </div>
              </div>
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

        {/* Brand Logos Marquee in Footer */}
        <div className="py-8 border-b border-white/10 overflow-hidden relative w-full">
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee flex items-center space-x-12 shrink-0">
            {(() => {
              const filteredLogos = BRAND_LOGOS.filter(
                b => !['lamborghini', 'ferrari'].includes(b.name.toLowerCase())
              );
              return [...filteredLogos, ...filteredLogos].map((b, idx) => (
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
              ));
            })()}
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
