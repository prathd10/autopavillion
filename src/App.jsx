import React, { useState } from 'react';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ExhaustStudio from './components/ExhaustStudio';
import Inventory from './components/Inventory';
import CarModal from './components/CarModal';
import CarCompare from './components/CarCompare';
import TradeInCalculator from './components/TradeInCalculator';
import TrustStats from './components/TrustStats';
import DetailingServices from './components/DetailingServices';
import VipBooking from './components/VipBooking';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import { CARS_DATA } from './data/cars';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState(null);
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showVipModal, setShowVipModal] = useState(false);
  const [activeBrandFilter, setActiveBrandFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleToggleCompare = (car) => {
    if (compareList.some((c) => c.id === car.id)) {
      setCompareList(compareList.filter((c) => c.id !== car.id));
    } else {
      if (compareList.length >= 3) {
        alert('You can compare a maximum of 3 supercars at a time.');
        return;
      }
      setCompareList([...compareList, car]);
      setShowCompareModal(true);
    }
  };

  const handleRemoveFromCompare = (id) => {
    const updated = compareList.filter((c) => c.id !== id);
    setCompareList(updated);
    if (updated.length === 0) setShowCompareModal(false);
  };

  const handleOpenVipModal = () => {
    const el = document.getElementById('vip-booking');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else setShowVipModal(true);
  };

  return (
    <div className="min-h-screen bg-[#08090c] text-slate-100 font-mulish selection:bg-white selection:text-black">
      
      {/* 1. Preloader Animation */}
      {loading ? (
        <Preloader onComplete={() => setLoading(false)} />
      ) : (
        <>
          {/* 2. Floating Navbar (Golden Icon Logo ONLY + Real-Time Search Bar + Nav Links) */}
          <Navbar
            compareCount={compareList.length}
            onOpenCompare={() => setShowCompareModal(true)}
            onOpenVipModal={handleOpenVipModal}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          {/* 3. Edge-to-Edge Full Bleed Hero Section with 3D Supercar Scrollable Model */}
          <Hero
            onOpenVipModal={handleOpenVipModal}
            activeBrandFilter={activeBrandFilter}
            setActiveBrandFilter={setActiveBrandFilter}
          />

          {/* 4. Business Trust Blueprint */}
          <TrustStats />

          {/* 5. Dedicated Exhaust Acoustic Sound Studio Feature */}
          <ExhaustStudio />

          {/* 6. Filterable Supercar Showroom Inventory */}
          <Inventory
            cars={CARS_DATA}
            onSelectCar={(car) => setSelectedCar(car)}
            compareList={compareList}
            onToggleCompare={handleToggleCompare}
            activeBrandFilter={activeBrandFilter}
            setActiveBrandFilter={setActiveBrandFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          {/* 7. Instant Sell / Trade-In Valuation Calculator */}
          <TradeInCalculator />

          {/* 8. Bespoke Detailing & PPF Armor Studio */}
          <DetailingServices onOpenVipModal={handleOpenVipModal} />

          {/* 9. VIP Showroom Appointment Booking */}
          <VipBooking />

          {/* 10. Client Testimonials */}
          <Testimonials />

          {/* 11. Footer */}
          <Footer onOpenVipModal={handleOpenVipModal} />

          {/* 12. Modal Drawers */}
          {selectedCar && (
            <CarModal
              car={selectedCar}
              onClose={() => setSelectedCar(null)}
              onOpenVipModal={handleOpenVipModal}
            />
          )}

          {showCompareModal && compareList.length > 0 && (
            <CarCompare
              compareList={compareList}
              onRemoveFromCompare={handleRemoveFromCompare}
              onCloseCompare={() => setShowCompareModal(false)}
              onSelectCar={(car) => {
                setShowCompareModal(false);
                setSelectedCar(car);
              }}
            />
          )}
        </>
      )}

    </div>
  );
}
