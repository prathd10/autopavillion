import React, { useState } from 'react';
import Preloader from '../components/Preloader';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Inventory from '../components/Inventory';
import RecentlySold from '../components/RecentlySold';
import FinancePreview from '../components/FinancePreview';
import SourcingPreview from '../components/SourcingPreview';
import InsightsPreview from '../components/InsightsPreview';
import CarModal from '../components/CarModal';
import CarCompare from '../components/CarCompare';
import TradeInCalculator from '../components/TradeInCalculator';
import TrustStats from '../components/TrustStats';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';
import { useCars } from '../hooks/useCars';
import { usePageTracker } from '../hooks/usePageTracker';

/**
 * The public-facing homepage.
 *
 * Data now comes from Supabase via useCars().
 * Images stored in Supabase are ImageKit URLs — they are passed as-is to
 * components, which can optionally call ikUrl() for resizing.
 * Falls back to static CARS_DATA during development / before seeding.
 */
export default function HomePage() {
  // Track this visit in Supabase page_views
  usePageTracker('/');

  // Fetch live car data from Supabase (falls back to static CARS_DATA)
  const { cars } = useCars();

  const [loading, setLoading] = useState(() => {
    return !sessionStorage.getItem('hasSeenPreloader');
  });
  const [selectedCar,       setSelectedCar]       = useState(null);
  const [compareList,       setCompareList]       = useState([]);
  const [showCompareModal,  setShowCompareModal]  = useState(false);
  const [activeBrandFilter, setActiveBrandFilter] = useState(null);
  const [searchTerm,        setSearchTerm]        = useState('');

  const handleToggleCompare = (car) => {
    if (compareList.some((c) => c.id === car.id)) {
      setCompareList(compareList.filter((c) => c.id !== car.id));
    } else {
      if (compareList.length >= 3) {
        alert('You can compare a maximum of 3 cars at a time.');
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
    const el = document.getElementById('vehicle-sourcing');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#08090c] text-slate-100 font-mulish selection:bg-white selection:text-black">

      {loading ? (
        <Preloader onComplete={() => {
          setLoading(false);
          sessionStorage.setItem('hasSeenPreloader', 'true');
        }} />
      ) : (
        <>
          <Navbar
            compareCount={compareList.length}
            onOpenCompare={() => setShowCompareModal(true)}
            onOpenVipModal={handleOpenVipModal}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          <Hero
            onOpenVipModal={handleOpenVipModal}
            activeBrandFilter={activeBrandFilter}
            setActiveBrandFilter={setActiveBrandFilter}
          />

          {/* Inventory now receives Supabase-backed (or static-fallback) cars */}
          <Inventory
            cars={cars.slice(0, 6)}
            onSelectCar={(car) => setSelectedCar(car)}
            compareList={compareList}
            onToggleCompare={handleToggleCompare}
            activeBrandFilter={activeBrandFilter}
            setActiveBrandFilter={setActiveBrandFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isHomePage={true}
          />

          <RecentlySold />
          <FinancePreview />
          <SourcingPreview />
          <InsightsPreview />
          <Testimonials />
          <TrustStats />
          <TradeInCalculator />
          <Footer onOpenVipModal={handleOpenVipModal} />

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
