import React from 'react';
import { MapPin, Phone, Mail, Clock, ArrowUpRight, ShieldCheck, Share2, Globe } from 'lucide-react';

export default function Footer({ onOpenVipModal }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-black text-white border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          
          {/* Brand Block (Original Logo ONLY) */}
          <div className="lg:col-span-4 space-y-6">
            <a href="#" className="inline-block">
              <img
                src="https://autopavilion.in/wp-content/uploads/2023/10/cropped-autopavilion_logo.png"
                alt="Auto Pavilion"
                className="h-12 w-auto object-contain"
              />
            </a>

            <p className="text-xs text-zinc-400 font-mulish leading-relaxed max-w-sm">
              Auto Pavilion is Mumbai’s premier pre-owned luxury supercar dealership. Dedicated to procuring 100% non-accident, fully certified exotics for high-net-worth individuals across India.
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
                href="https://maps.google.com/?q=Auto+Pavilion+Santacruz+West+Mumbai"
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
                <button onClick={() => scrollTo('inventory')} className="hover:text-white transition-colors">
                  Exotic Store
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('sound-studio')} className="hover:text-white transition-colors">
                  Sound Studio
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('certification')} className="hover:text-white transition-colors">
                  251-Point Inspection
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('valuation')} className="hover:text-white transition-colors">
                  30-Min Trade-In
                </button>
              </li>
              <li>
                <button onClick={onOpenVipModal} className="hover:text-white transition-colors">
                  VIP Appointment
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
                <span>
                  Office No. 25, Tirupati Shopping Center (Tirupati Plaza), S.V. Road, Santacruz (West), Mumbai - 400054, Maharashtra, India.
                </span>
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

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500 font-mulish">
          <div>
            © 2026 Auto Pavilion India Private Limited. All rights reserved.
          </div>

          <div className="flex items-center space-x-2 text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-white" />
            <span>251-Point Certified Dealer</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
