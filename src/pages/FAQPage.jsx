import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { usePageTracker } from '../hooks/usePageTracker';
import { FAQS } from '../data/faqs';
import { ChevronDown, MessageSquare } from 'lucide-react';

export default function FAQPage() {
  usePageTracker('/faq');
  const [openIndex, setOpenIndex] = useState(0); // Open the first FAQ by default

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
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Support & Inquiries</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-heading uppercase tracking-tight text-white">
            Frequently Asked <br />
            <span className="text-zinc-500">Questions</span>
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto pt-4 leading-relaxed">
            Everything you need to know about purchasing, sourcing, and trading exotic supercars with Auto Pavilion India.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4 animate-fadeInUp [animation-delay:200ms]">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            
            return (
              <div 
                key={faq.id} 
                className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                  isOpen ? 'bg-white/5 border-white/20 shadow-2xl' : 'bg-transparent border-white/5 hover:border-white/10'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className={`font-bold text-sm md:text-base tracking-wide transition-colors ${isOpen ? 'text-white' : 'text-zinc-300'}`}>
                    {faq.question}
                  </span>
                  <div className={`shrink-0 ml-4 p-2 rounded-full transition-all duration-300 ${isOpen ? 'bg-white text-black rotate-180' : 'bg-white/5 text-zinc-400'}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                
                <div 
                  className={`px-6 transition-all duration-500 ease-in-out ${
                    isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="h-px w-full bg-white/10 mb-4" />
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Contact CTA */}
        <div className="mt-20 p-8 rounded-3xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 text-center animate-fadeInUp [animation-delay:400ms]">
          <h3 className="text-2xl font-bold font-heading uppercase text-white mb-3">Still have questions?</h3>
          <p className="text-zinc-400 text-sm mb-6 max-w-md mx-auto">
            Our luxury concierge team is available to assist you with any specific inquiries.
          </p>
          <a 
            href="tel:+918291919393"
            className="inline-flex items-center space-x-2 px-8 py-3 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-colors"
          >
            <span>Call Us Now</span>
          </a>
        </div>

      </main>
      
      <Footer />
    </div>
  );
}
