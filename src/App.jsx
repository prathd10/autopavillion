import React, { useState } from 'react';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Inventory from './components/Inventory';
import SoldVault from './components/SoldVault';
import BespokeConcierge from './components/BespokeConcierge';
import AboutUs from './components/AboutUs';
import CarModal from './components/CarModal';
import CarCompare from './components/CarCompare';
import TradeInCalculator from './components/TradeInCalculator';
import TrustStats from './components/TrustStats';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import { CARS_DATA } from './data/cars';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState(null);
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
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
    const el = document.getElementById('bespoke-sourcing');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#08090c] text-slate-100 font-mulish selection:bg-white selection:text-black">
      
      {/* 1. Preloader Animation */}
      {loading ? (
        <Preloader onComplete={() => setLoading(false)} />
      ) : (
        <>
          {/* 2. Floating Navbar */}
          <Navbar
            compareCount={compareList.length}
            onOpenCompare={() => setShowCompareModal(true)}
            onOpenVipModal={handleOpenVipModal}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          {/* 3. Hero Section */}
          <Hero
            onOpenVipModal={handleOpenVipModal}
            activeBrandFilter={activeBrandFilter}
            setActiveBrandFilter={setActiveBrandFilter}
          />

          {/* 4. Filterable Supercar Showroom Inventory */}
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

          {/* 5. The Vault (Sold Hypercars Gallery) */}
          <SoldVault />

          {/* 6. Bespoke Global Supercar Sourcing */}
          <BespokeConcierge />

          {/* 8. About Us & Heritage */}
          <AboutUs />

          {/* 9. Business Trust Blueprint */}
          <TrustStats />

          {/* 10. Instant Sell / Trade-In Valuation Calculator */}
          <TradeInCalculator />

          {/* 11. Client Testimonials */}
          <Testimonials />

          {/* 14. Footer */}
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
