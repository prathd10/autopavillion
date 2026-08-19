import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { usePageTracker } from '../hooks/usePageTracker';
import { Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
  usePageTracker('/privacy');

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
            <Shield className="w-3.5 h-3.5" />
            <span>Privacy & Security</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-heading uppercase tracking-tight text-white">
            Privacy <br />
            <span className="text-zinc-500">Policy</span>
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto pt-4 leading-relaxed">
            How Auto Pavilion collects, protects, and handles your personal information during your luxury vehicle purchase journey.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-10 text-zinc-300 text-sm leading-relaxed font-mulish animate-fadeInUp [animation-delay:200ms] border border-white/5 bg-white/[0.02] backdrop-blur-md p-8 sm:p-12 rounded-3xl">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white font-heading uppercase tracking-wider">1. Information We Collect</h2>
            <p>
              We collect information that you voluntarily provide to us when you inquire about a vehicle, schedule a VIP viewing, request a trade-in evaluation, or submit any contact forms on our platform. This may include your name, contact details (phone number, email address), location, and details of your current vehicle or target acquisition.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white font-heading uppercase tracking-wider">2. How We Use Your Information</h2>
            <p>
              Your personal information is used exclusively to facilitate your interactions with Auto Pavilion, including:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
              <li>Processing your inquiries and concierge sourcing requests.</li>
              <li>Arranging viewings, test drives, or concierge delivery options.</li>
              <li>Providing customized financing and trade-in structures.</li>
              <li>Sharing private updates on new inventory matches that align with your interests.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white font-heading uppercase tracking-wider">3. Information Sharing & Third-Party Disclosure</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties (such as designated banking partners, financial institutions, or registration authorities) who assist us in operating our platform and conducting our business, so long as those parties agree to keep this information strictly confidential.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white font-heading uppercase tracking-wider">4. Data Security & Storage</h2>
            <p>
              We implement a variety of security measures to maintain the safety of your personal information. All customer data and inquiry logs are hosted on secure servers with restricted access controls. While we strive to protect your personal information, no method of transmission over the Internet or electronic storage is completely secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white font-heading uppercase tracking-wider">5. Cookies and Page Tracking</h2>
            <p>
              Our website uses cookies and custom analytical hooks to improve your browsing experience, remember your comparison list, and track traffic behavior. You can choose to disable cookies in your browser settings, though some features of our site may not function optimally as a result.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white font-heading uppercase tracking-wider">6. Contact Information</h2>
            <p>
              If you have any questions regarding this Privacy Policy, you may contact our privacy compliance desk at:
            </p>
            <div className="pt-2 font-mono text-zinc-400 text-xs space-y-1">
              <p>Email: info@autopavilion.in</p>
              <p>Address: Office No:25, Tirupati Shopping center, S V Rd, Santacruz West, Mumbai - 400054</p>
            </div>
          </section>
        </div>

      </main>
      
      <Footer />
    </div>
  );
}
