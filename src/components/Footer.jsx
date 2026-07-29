import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, ShieldCheck, Share2, Globe, Camera } from 'lucide-react';

export default function Footer({ onOpenVipModal }) {
  return (
    <footer className="bg-black text-zinc-400 border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-12 border-b border-white/10">
          
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="https://autopavilion.in/wp-content/uploads/2023/10/cropped-autopavilion_logo.png"
                alt="Auto Pavilion"
                className="h-9 w-auto object-contain filter invert contrast-200"
              />
              <div className="flex flex-col">
                <span className="font-mulish font-black text-lg tracking-[0.2em] text-white">
                  AUTO PAVILION
                </span>
                <span className="text-[9px] tracking-[0.25em] text-zinc-400 font-bold uppercase">
                  A Notch Above
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed font-mulish">
              Auto Pavilion is Mumbai’s premier pre-owned luxury supercar dealership. Dedicated to procuring 100% non-accident, fully certified exotics for high-net-worth individuals across India.
            </p>

            <div className="pt-2 flex items-center space-x-3">
              <a
                href="https://wa.me/918291919393"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white hover:text-black transition-colors"
                title="WhatsApp Concierge"
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              <a
                href="tel:+918291919393"
                className="p-2.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white hover:text-black transition-colors"
                title="Call Hotline"
              >
                <Phone className="w-4 h-4" />
              </a>

              <a
                href="https://maps.google.com/?q=Santacruz+West+Mumbai+Tirupati+Shopping+Center"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white hover:text-black transition-colors"
                title="Google Maps Location"
              >
                <MapPin className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-3 text-xs">
            <h4 className="text-xs font-bold uppercase text-white tracking-widest mb-4 font-heading">
              Showroom
            </h4>
            <ul className="space-y-2.5">
              <li><a href="#inventory" className="hover:text-white transition-colors">Exotic Store</a></li>
              <li><a href="#sound-studio" className="hover:text-white transition-colors">Sound Studio</a></li>
              <li><a href="#certification" className="hover:text-white transition-colors">251-Point Inspection</a></li>
              <li><a href="#valuation" className="hover:text-white transition-colors">30-Min Trade-In</a></li>
              <li><button onClick={onOpenVipModal} className="hover:text-white transition-colors">VIP Appointment</button></li>
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-3 text-xs">
            <h4 className="text-xs font-bold uppercase text-white tracking-widest mb-4 font-heading">
              Marques
            </h4>
            <ul className="space-y-2.5">
              <li><span className="text-zinc-300">Porsche 911 GT3 RS</span></li>
              <li><span className="text-zinc-300">Lamborghini Huracán EVO</span></li>
              <li><span className="text-zinc-300">Ferrari 488 Pista</span></li>
              <li><span className="text-zinc-300">Mercedes-AMG G63</span></li>
              <li><span className="text-zinc-300">Rolls-Royce & Bentley</span></li>
            </ul>
          </div>

          <div className="lg:col-span-4 space-y-4 text-xs">
            <h4 className="text-xs font-bold uppercase text-white tracking-widest mb-4 font-heading">
              Mumbai Showroom Address
            </h4>

            <div className="flex items-start space-x-3 text-zinc-300">
              <MapPin className="w-4 h-4 text-white shrink-0 mt-0.5" />
              <span>
                Office No. 25, Tirupati Shopping Center (Tirupati Plaza), S.V. Road, Santacruz (West), Mumbai - 400054, Maharashtra, India.
              </span>
            </div>

            <div className="flex items-center space-x-3 text-zinc-300">
              <Phone className="w-4 h-4 text-white shrink-0" />
              <a href="tel:+918291919393" className="hover:text-white font-mono font-bold text-sm text-white">
                +91 82 9191 9393
              </a>
            </div>

            <div className="flex items-center space-x-3 text-zinc-300">
              <Mail className="w-4 h-4 text-white shrink-0" />
              <a href="mailto:info@autopavilion.in" className="hover:text-white">
                info@autopavilion.in
              </a>
            </div>

            <div className="flex items-center space-x-3 text-zinc-500">
              <Clock className="w-4 h-4 text-zinc-500 shrink-0" />
              <span>Mon - Sat: 10:00 AM - 8:00 PM (IST)</span>
            </div>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} Auto Pavilion India Private Limited. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1 text-white">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>251-Point Certified Dealer</span>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
