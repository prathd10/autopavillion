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
      
      <main className="flex-1 pt-20">
        <VehicleSourcing />
      </main>
      
      <Footer />
    </div>
  );
}
