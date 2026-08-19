import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Preloader from '../components/Preloader';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Inventory from '../components/Inventory';
import FinancePreview from '../components/FinancePreview';
import VehicleSourcing from '../components/VehicleSourcing';
import InsightsPreview from '../components/InsightsPreview';
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
  const navigate = useNavigate();

  const [loading, setLoading] = useState(() => {
    return !sessionStorage.getItem('hasSeenPreloader');
  });
  const [compareList,       setCompareList]       = useState([]);
  const [showCompareModal,  setShowCompareModal]  = useState(false);
  const [activeBrandFilter, setActiveBrandFilter] = useState(null);
  const [searchTerm,        setSearchTerm]        = useState('');

  const handleToggleCompare = (car) => {
    if (compareList.some((c) => c.id === car.id)) {
      setCompareList(compareList.filter((c) => c.id !== car.id));
    } else {
      const maxCars = window.innerWidth < 768 ? 2 : 3;
      if (compareList.length >= maxCars) {
        alert(`You can compare a maximum of ${maxCars} cars at a time on your current screen.`);
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
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          <Hero
            activeBrandFilter={activeBrandFilter}
            setActiveBrandFilter={setActiveBrandFilter}
          />

          {/* Featured Showcase (only available cars marked as featured) */}
          <Inventory
            title="FEATURED VEHICLES"
            hideMarquee={true}
            cars={cars.filter(c => c.featured && (c.status === 'active' || !c.status))}
            compareList={compareList}
            onToggleCompare={handleToggleCompare}
            activeBrandFilter={activeBrandFilter}
            setActiveBrandFilter={setActiveBrandFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isHomePage={true}
          />

          <TrustStats />

          {/* Curated Showroom (all available active cars) */}
          <Inventory
            title="CURATED SHOWROOM"
            cars={cars.filter(c => c.status === 'active' || !c.status).slice(0, 12)}
            compareList={compareList}
            onToggleCompare={handleToggleCompare}
            activeBrandFilter={activeBrandFilter}
            setActiveBrandFilter={setActiveBrandFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isHomePage={true}
          />

          <Testimonials />
          <VehicleSourcing />
          <TradeInCalculator />
          <FinancePreview />
          <InsightsPreview />
          <Footer />

          {showCompareModal && compareList.length > 0 && (
            <CarCompare
              compareList={compareList}
              onRemoveFromCompare={handleRemoveFromCompare}
              onCloseCompare={() => setShowCompareModal(false)}
              onSelectCar={(car) => {
                setShowCompareModal(false);
                navigate(`/inventory/${car.slug}`);
              }}
              onToggleCompare={handleToggleCompare}
            />
          )}
        </>
      )}
    </div>
  );
}
