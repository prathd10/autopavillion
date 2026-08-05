import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import VehicleSourcing from '../components/VehicleSourcing';
import Footer from '../components/Footer';
import { usePageTracker } from '../hooks/usePageTracker';

export default function SourcingPage() {
  usePageTracker('/sourcing');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#08090c] text-slate-100 font-mulish selection:bg-white selection:text-black flex flex-col">
      <Navbar />
      
      {/* Global Parallax Background for Sourcing Page */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2069&auto=format&fit=crop')" }}
      />
      <div className="fixed inset-0 bg-black/85 z-0" />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-1 pt-32 pb-16">
          <div className="text-center px-4 animate-fadeInUp mb-12">
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter font-heading mb-4">
              Vehicle Sourcing
            </h1>
            <p className="text-zinc-300 max-w-2xl mx-auto text-sm sm:text-base">
              Let our experts find your dream car from our exclusive nationwide network.
            </p>
          </div>

          <VehicleSourcing className="bg-transparent" />
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
