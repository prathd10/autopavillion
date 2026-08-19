import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { usePageTracker } from '../hooks/usePageTracker';
import { Sparkles, ArrowRight, Quote, Compass, Eye, Shield, Users, Landmark, MapPin } from 'lucide-react';

export default function AboutPage() {
  usePageTracker('/about');
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleOpenVipModal = () => {
    window.dispatchEvent(new CustomEvent('open-vip-modal'));
  };

  // Luxury supercar parallax hero background
  const heroBg = "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=2400&auto=format&fit=crop";
  

  // Luxury Executive Portrait for Founder
  const founderImg = "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop";

  return (
    <div className="min-h-screen bg-[#08090c] text-slate-100 font-mulish selection:bg-white selection:text-black flex flex-col">
      <Navbar />

      <main className="flex-1">
        
        {/* ==================================================
            SECTION 1 — HERO
            ================================================== */}
        <section 
          className="relative h-[80vh] min-h-[600px] flex items-center bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          {/* Dark cinematic overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#08090c] via-black/45 to-black/75 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#08090c]/90 via-black/30 to-transparent pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 space-y-4 sm:space-y-6">

            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight uppercase leading-[1.1] font-heading max-w-4xl">
              BUILT ON TRUST.<br />
              <span className="text-zinc-500 font-extralight">DRIVEN BY PASSION.</span>
            </h1>
            
            <p className="text-zinc-300 text-xs sm:text-base font-mulish max-w-xl leading-relaxed">
              An automotive house built around a simple belief — every vehicle should be chosen with the same care as the person who drives it.
            </p>
          </div>
        </section>


        {/* ==================================================
            SECTION 2 — OUR STORY
            ================================================== */}
        <section className="py-20 sm:py-28 bg-[#08090c] border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
              
              {/* Left Column: Heading */}
              <div className="lg:col-span-5">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-zinc-500 block mb-2">
                  OUR ESSENCE
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-white font-heading uppercase tracking-tight leading-tight">
                  MORE THAN <span className="text-zinc-500 font-extralight">A DEALERSHIP.</span>
                </h2>
              </div>

              {/* Right Column: Rewritten Story Copy */}
              <div className="lg:col-span-7 space-y-6 text-zinc-400 text-xs sm:text-sm font-mulish leading-relaxed border-l border-white/10 pl-6 lg:pl-10">
                <p className="text-zinc-200 text-sm sm:text-base font-medium">
                  Welcome to Auto Pavilion, where sophistication meets automotive excellence.
                </p>
                <p>
                  Auto Pavilion was established with a clear vision — to cater to individuals who expect more from their automotive experience. Over the years, we have built our reputation around premium pre-owned automobiles, personal service, and a commitment to making the process of buying and selling a luxury vehicle more transparent and comfortable.
                </p>
                <p>
                  Our clientele includes discerning individuals, entrepreneurs, professionals, corporates, and HNIs who value quality, trust, and attention to detail.
                </p>
                <p>
                  For us, a vehicle is more than a transaction. It represents a decision, an aspiration, and often a significant investment. That is why we approach every vehicle and every client with the same level of care.
                </p>
              </div>

            </div>
          </div>
        </section>


        {/* ==================================================
            SECTION 3 — THE AUTO PAVILION PHILOSOPHY
            ================================================== */}
        <section className="py-20 sm:py-28 bg-black/40 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            
            {/* Header */}
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-amber-500/90">
                THE PRINCIPLES
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white font-heading uppercase tracking-tight">
                WHAT WE <span className="text-zinc-500 font-extralight">BELIEVE</span>
              </h2>
            </div>

            {/* Editorial Layout grid of 4 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              
              {/* Principle 01 */}
              <div className="group space-y-6">
                <div className="text-zinc-650 text-xs sm:text-sm font-mono tracking-widest group-hover:text-amber-500 transition-colors duration-300">
                  01
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider font-heading border-b border-white/5 pb-3">
                  QUALITY OVER QUANTITY
                </h3>
                <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed font-mulish">
                  We believe the right vehicle deserves attention. Every automobile we present is selected with consideration for its condition, history and overall value.
                </p>
              </div>

              {/* Principle 02 */}
              <div className="group space-y-6">
                <div className="text-zinc-650 text-xs sm:text-sm font-mono tracking-widest group-hover:text-amber-500 transition-colors duration-300">
                  02
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider font-heading border-b border-white/5 pb-3">
                  TRANSPARENCY FIRST
                </h3>
                <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed font-mulish">
                  Buying a pre-owned luxury vehicle should feel informed, not uncertain. We believe clear information and straightforward communication are fundamental.
                </p>
              </div>

              {/* Principle 03 */}
              <div className="group space-y-6">
                <div className="text-zinc-650 text-xs sm:text-sm font-mono tracking-widest group-hover:text-amber-500 transition-colors duration-300">
                  03
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider font-heading border-b border-white/5 pb-3">
                  THE EXPERIENCE
                </h3>
                <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed font-mulish">
                  From the first conversation to the moment the keys change hands, every interaction should reflect the quality of the automobile.
                </p>
              </div>

              {/* Principle 04 */}
              <div className="group space-y-6">
                <div className="text-zinc-650 text-xs sm:text-sm font-mono tracking-widest group-hover:text-amber-500 transition-colors duration-300">
                  04
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider font-heading border-b border-white/5 pb-3">
                  RELATIONSHIPS
                </h3>
                <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed font-mulish">
                  Many of our clients return to us when it is time for their next automobile. That relationship is something we value more than any transaction.
                </p>
              </div>

            </div>
          </div>
        </section>


        {/* ==================================================
            SECTION 4 — FOUNDER / OWNER'S NOTE
            ================================================== */}
        <section className="py-20 sm:py-28 bg-black/60 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Portrait */}
              <div className="lg:col-span-5 relative group">
                <div className="absolute inset-0 border border-amber-500/20 rounded-3xl translate-x-3 translate-y-3 pointer-events-none transition-transform duration-500 group-hover:translate-x-1.5 group-hover:translate-y-1.5" />
                <img 
                  src={founderImg} 
                  alt="Founder / Owner - Auto Pavilion" 
                  className="w-full aspect-[4/5] object-cover rounded-3xl relative z-10 border border-white/10" 
                />
              </div>

              {/* Right Column: Note Content */}
              <div className="lg:col-span-7 space-y-6 relative">
                <div className="absolute top-0 right-0 text-white/5 -mt-10 -mr-6 pointer-events-none">
                  <Quote className="w-24 h-24 sm:w-32 sm:h-32" />
                </div>
                
                <div className="space-y-1 relative z-10">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-amber-500/90 block">
                    FOUNDER'S VISION
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white font-heading uppercase">
                    A NOTE FROM THE FOUNDER
                  </h2>
                </div>

                <div className="space-y-4 text-zinc-300 text-xs sm:text-sm font-mulish leading-relaxed max-w-2xl pt-2">
                  <p>
                    "At Auto Pavilion, my vision has always been simple — to create an automotive experience built on trust, personal attention and a genuine appreciation for exceptional automobiles.
                  </p>
                  <p>
                    Over the years, I have had the privilege of meeting clients from different walks of life, and one thing has remained constant: people remember how they were treated long after they remember the vehicle they purchased. That belief continues to shape the way we work.
                  </p>
                  <p>
                    Every automobile that comes through Auto Pavilion represents someone's trust in us. We don't take that responsibility lightly.
                  </p>
                  <p>
                    Our goal is not simply to sell a car. It is to make sure that when a client drives away from Auto Pavilion, they do so with confidence in the automobile they have chosen and the people they chose to deal with.
                  </p>
                  <p>
                    Thank you for being a part of our journey."
                  </p>
                </div>

                <div className="pt-4 font-heading">
                  <h4 className="text-white text-base font-extrabold uppercase tracking-wider">[OWNER'S NAME]</h4>
                  <p className="text-zinc-500 text-xs mt-0.5 uppercase tracking-widest font-bold">Founder / Owner, Auto Pavilion</p>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* ==================================================
            SECTION 5 — EXPERIENCE / JOURNEY (TIMELINE)
            ================================================== */}
        <section className="py-20 sm:py-28 bg-[#08090c] border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            
            {/* Header */}
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">
                THE HISTORY
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white font-heading uppercase tracking-tight">
                THE JOURNEY <span className="text-zinc-400 font-extralight">SO FAR</span>
              </h2>
            </div>

            {/* Qualitative milestones */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] space-y-3 flex flex-col justify-between min-h-[160px]">
                <div>
                  <h3 className="text-lg font-bold text-white font-heading uppercase">YEARS OF EXPERIENCE</h3>
                  <p className="text-xs text-zinc-400 font-mulish leading-relaxed mt-2">
                    Building long-term client relationships and expertise throughout the luxury automotive industry.
                  </p>
                </div>
                <div className="text-[10px] font-mono tracking-widest uppercase text-amber-500/70">ESTABLISHED DESK</div>
              </div>

              <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] space-y-3 flex flex-col justify-between min-h-[160px]">
                <div>
                  <h3 className="text-lg font-bold text-white font-heading uppercase">CLIENT CARE</h3>
                  <p className="text-xs text-zinc-400 font-mulish leading-relaxed mt-2">
                    Serving discerning individuals, corporations, professionals, and businesses across the country.
                  </p>
                </div>
                <div className="text-[10px] font-mono tracking-widest uppercase text-amber-500/70">INDIVIDUAL FOCUS</div>
              </div>

              <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] space-y-3 flex flex-col justify-between min-h-[160px]">
                <div>
                  <h3 className="text-lg font-bold text-white font-heading uppercase">CURATED SELECTION</h3>
                  <p className="text-xs text-zinc-400 font-mulish leading-relaxed mt-2">
                    Handpicking a carefully inspected fleet of luxury vehicles and exotic assets for our catalog.
                  </p>
                </div>
                <div className="text-[10px] font-mono tracking-widest uppercase text-amber-500/70">RIGOROUS ASSESSMENTS</div>
              </div>

              <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] space-y-3 flex flex-col justify-between min-h-[160px]">
                <div>
                  <h3 className="text-lg font-bold text-white font-heading uppercase">NATIONWIDE REACH</h3>
                  <p className="text-xs text-zinc-400 font-mulish leading-relaxed mt-2">
                    Assisting clients and coordinating deliveries across multiple cities and states in India.
                  </p>
                </div>
                <div className="text-[10px] font-mono tracking-widest uppercase text-amber-500/70">SECURE CONCIERGE</div>
              </div>

            </div>
          </div>
        </section>


        {/* ==================================================
            SECTION 6 — WHAT CLIENTS CAN EXPECT
            ================================================== */}
        <section className="py-20 sm:py-28 bg-black/40 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            
            {/* Header */}
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-amber-500/90">
                OUR ASSURANCE
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white font-heading uppercase tracking-tight">
                THE AUTO PAVILION <span className="text-zinc-500 font-extralight">STANDARD</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <div className="p-6 space-y-2 border border-white/5 rounded-2xl">
                <Compass className="w-5 h-5 text-amber-500/90" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading pt-2">CURATED INVENTORY</h4>
                <p className="text-[11px] sm:text-xs text-zinc-450 leading-relaxed font-mulish pt-1">
                  We showcase vehicles chosen selectively based on state, model history, and overall engineering integrity.
                </p>
              </div>

              <div className="p-6 space-y-2 border border-white/5 rounded-2xl">
                <Eye className="w-5 h-5 text-amber-500/90" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading pt-2">DETAILED INFORMATION</h4>
                <p className="text-[11px] sm:text-xs text-zinc-450 leading-relaxed font-mulish pt-1">
                  Available inspection findings, documentation records, and vehicle specifications are shared completely.
                </p>
              </div>

              <div className="p-6 space-y-2 border border-white/5 rounded-2xl">
                <Users className="w-5 h-5 text-amber-500/90" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading pt-2">STRAIGHTFORWARD APPROACH</h4>
                <p className="text-[11px] sm:text-xs text-zinc-450 leading-relaxed font-mulish pt-1">
                  Our communication is simple, direct, and factual. We do not use aggressive sales pressure or unverified claims.
                </p>
              </div>

              <div className="p-6 space-y-2 border border-white/5 rounded-2xl">
                <Landmark className="w-5 h-5 text-amber-500/90" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading pt-2">PERSONALIZED ASSISTANCE</h4>
                <p className="text-[11px] sm:text-xs text-zinc-455 leading-relaxed font-mulish pt-1">
                  A designated team member coordinates your entire transaction journey, from inquiry to title registration.
                </p>
              </div>

              <div className="p-6 space-y-2 border border-white/5 rounded-2xl">
                <Shield className="w-5 h-5 text-amber-500/90" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading pt-2">PROFESSIONAL EXPERIENCE</h4>
                <p className="text-[11px] sm:text-xs text-zinc-455 leading-relaxed font-mulish pt-1">
                  Our showroom operations and purchase documentation processes are structured to deliver maximum client convenience.
                </p>
              </div>

              <div className="p-6 space-y-2 border border-white/5 rounded-2xl">
                <MapPin className="w-5 h-5 text-amber-500/90" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading pt-2">AFTER-SALE RELATIONSHIP</h4>
                <p className="text-[11px] sm:text-xs text-zinc-455 leading-relaxed font-mulish pt-1">
                  Our support desk remains at your service for transport, trade-ins, upgrades, or subsequent acquisitions.
                </p>
              </div>

            </div>
          </div>
        </section>





        {/* ==================================================
            SECTION 9 — FINAL CTA
            ================================================== */}
        <section className="py-24 sm:py-32 bg-gradient-to-br from-[#0c0d11] to-black border-t border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl -mr-28 -mt-28 pointer-events-none" />
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-heading uppercase tracking-tight leading-none">
              FIND YOUR <br />
              <span className="text-zinc-500">NEXT AUTOMOBILE.</span>
            </h2>
            
            <p className="text-zinc-400 text-xs sm:text-sm font-mulish max-w-md mx-auto leading-relaxed">
              Explore our current collection or speak with our team about your next vehicle.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => navigate('/inventory')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-colors shadow-2xl flex items-center justify-center space-x-2"
              >
                <span>Explore Inventory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleOpenVipModal}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-transparent border border-white/20 text-white font-extrabold text-xs uppercase tracking-widest hover:bg-white/10 transition-colors"
              >
                Schedule a Viewing
              </button>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
