import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { usePageTracker } from '../hooks/usePageTracker';
import { FileText } from 'lucide-react';

export default function TermsOfServicePage() {
  usePageTracker('/terms');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#08090c] text-slate-100 font-mulish selection:bg-white selection:text-black flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4 animate-fadeInUp">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-zinc-300">
            <FileText className="w-3.5 h-3.5" />
            <span>Legal Documentation</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-heading uppercase tracking-tight text-white">
            Terms of <br />
            <span className="text-zinc-500">Service</span>
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto pt-4 leading-relaxed">
            Please read these terms and conditions carefully before using the Auto Pavilion platform or inquiring about our services.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-10 text-zinc-300 text-sm leading-relaxed font-mulish animate-fadeInUp [animation-delay:200ms] border border-white/5 bg-white/[0.02] backdrop-blur-md p-8 sm:p-12 rounded-3xl">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white font-heading uppercase tracking-wider">1. Agreement to Terms</h2>
            <p>
              By accessing and using this website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white font-heading uppercase tracking-wider">2. Use License & Restrictions</h2>
            <p>
              Permission is granted to view the vehicle inventory and media files on the Auto Pavilion website for personal, non-commercial informational purposes only. You may not:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
              <li>Modify, copy, or distribute our site content or images.</li>
              <li>Use any data mining, robots, or similar data gathering methods.</li>
              <li>Attempt to decompile or reverse engineer any software contained on the platform.</li>
              <li>Remove any copyright or other proprietary notations from the materials.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white font-heading uppercase tracking-wider">3. Vehicle Inventory & Specifications</h2>
            <p>
              While we make every effort to display accurate specifications, mileage, pricing, and availability records for our curated pre-owned vehicle inventory, all information is provided on an "as-available" basis. Actual vehicle details must be verified by the buyer directly during physical inspection and document review prior to finalizing any transaction.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white font-heading uppercase tracking-wider">4. Inquiries, Viewings & Sourcing</h2>
            <p>
              Submitting an inquiry, scheduling a VIP viewing, or requesting vehicle sourcing does not constitute a booking or reservation of any vehicle. Vehicles are only reserved upon execution of a formal booking agreement and payment of the designated reservation token amount.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white font-heading uppercase tracking-wider">5. Limitation of Liability</h2>
            <p>
              In no event shall Auto Pavilion India Private Limited, its directors, or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white font-heading uppercase tracking-wider">6. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.
            </p>
          </section>
        </div>

      </main>
      
      <Footer />
    </div>
  );
}
