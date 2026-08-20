import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Scale, X, Search, Sparkles, Check, Loader2, ArrowRight, Plus, Phone, CheckCircle, ChevronRight } from 'lucide-react';
import { useComparison } from '../hooks/useComparison';
import { useCars } from '../hooks/useCars';
import { supabase } from '../lib/supabase';
import { ikUrl } from '../lib/imagekit';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { cars: allInventory, loading: inventoryLoading } = useCars();
  const { compareIds, toggleCompare, removeCompare, clearCompare } = useComparison();
  
  const [vehicles, setVehicles] = useState([null, null]);
  const [loading, setLoading] = useState(false);
  const [activeSelectSlot, setActiveSelectSlot] = useState(null); // 0 or 1
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ inventory: [], global: [] });
  const [searching, setSearching] = useState(false);
  const searchContainerRef = useRef(null);

  // Lead capture forms states (one per slot)
  const [leadSubmitted, setLeadSubmitted] = useState([false, false]);
  const [leadLoading, setLeadLoading] = useState([false, false]);
  const [leadName, setLeadName] = useState(['', '']);
  const [leadPhone, setLeadPhone] = useState(['', '']);

  // Sync URL parameters with compare state
  useEffect(() => {
    const carsParam = searchParams.get('cars');
    if (carsParam) {
      const ids = carsParam.split(',').filter(Boolean).slice(0, 2);
      // Only set if different to prevent infinite loops
      if (JSON.stringify(ids) !== JSON.stringify(compareIds)) {
        localStorage.setItem('autopavilion_compare_ids', JSON.stringify(ids));
        window.dispatchEvent(new Event('autopavilion-compare-change'));
      }
    }
  }, [searchParams]);

  // Sync URL when compareIds changes
  useEffect(() => {
    if (compareIds.length > 0) {
      setSearchParams({ cars: compareIds.join(',') });
    } else {
      setSearchParams({});
    }
  }, [compareIds]);

  // Load details of selected vehicles
  useEffect(() => {
    const loadDetails = async () => {
      if (compareIds.length === 0) {
        setVehicles([null, null]);
        return;
      }
      setLoading(true);
      try {
        const promises = [0, 1].map(async (idx) => {
          const id = compareIds[idx];
          if (!id) return null;
          
          const baseUrl = window.location.origin;
          const res = await fetch(`${baseUrl}/api/vehicles/details?id=${encodeURIComponent(id)}`);
          if (!res.ok) {
            console.error(`HTTP error fetching details for ${id}! status: ${res.status}`);
            return null;
          }
          const contentType = res.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            console.error(`Non-JSON response fetching details for ${id}`);
            return null;
          }
          return await res.json();
        });
        const results = await Promise.all(promises);
        setVehicles(results);
      } catch (err) {
        console.error('Failed to load comparison vehicles:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDetails();
  }, [compareIds]);

  // Live search handler
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults({ inventory: [], global: [] });
        return;
      }
      setSearching(true);
      try {
        const baseUrl = window.location.origin;
        const res = await fetch(`${baseUrl}/api/vehicles/search?q=${encodeURIComponent(searchQuery)}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new TypeError("Search response was not valid JSON");
        }
        const data = await res.json();
        if (data.success && Array.isArray(data.vehicles)) {
          const inventory = data.vehicles.filter(v => v.is_inventory);
          const global = data.vehicles.filter(v => !v.is_inventory);
          setSearchResults({ inventory, global });
        } else {
          setSearchResults({ inventory: [], global: [] });
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Close search results overlay on click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setActiveSelectSlot(null);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSelectVehicle = (slotIndex, vehicleId) => {
    let newIds = [...compareIds];
    newIds[slotIndex] = vehicleId;
    
    // Clean up empty items and ensure list has correct elements
    const filtered = newIds.filter(Boolean);
    
    localStorage.setItem('autopavilion_compare_ids', JSON.stringify(filtered));
    window.dispatchEvent(new Event('autopavilion-compare-change'));
    
    setActiveSelectSlot(null);
    setSearchQuery('');
  };

  const handleRemoveSlot = (slotIndex) => {
    let newIds = [...compareIds];
    newIds.splice(slotIndex, 1);
    
    const filtered = newIds.filter(Boolean);
    localStorage.setItem('autopavilion_compare_ids', JSON.stringify(filtered));
    window.dispatchEvent(new Event('autopavilion-compare-change'));

    // Reset lead capture states for that slot
    const newSubmitted = [...leadSubmitted];
    newSubmitted[slotIndex] = false;
    setLeadSubmitted(newSubmitted);
  };

  const handleLeadSubmit = async (e, slotIndex, vehicle) => {
    e.preventDefault();
    const newLoad = [...leadLoading];
    newLoad[slotIndex] = true;
    setLeadLoading(newLoad);

    try {
      const { error } = await supabase.from('inquiries').insert([{
        type: 'bespoke_sourcing',
        name: leadName[slotIndex],
        phone: leadPhone[slotIndex],
        details: {
          make: vehicle.brand,
          model: vehicle.name,
          source: 'comparison_page_unavailable'
        }
      }]);

      if (error) throw error;
      
      const newSub = [...leadSubmitted];
      newSub[slotIndex] = true;
      setLeadSubmitted(newSub);
    } catch (err) {
      console.error('Lead capture error:', err);
      alert('Failed to submit request. Please try again.');
    } finally {
      const newLoad = [...leadLoading];
      newLoad[slotIndex] = false;
      setLeadLoading(newLoad);
    }
  };

  // Get similar inventory recommendations
  const recommendedCar = (() => {
    const activeVehicles = vehicles.filter(Boolean);
    if (activeVehicles.length === 0 || allInventory.length === 0) return null;
    
    const comparedIds = activeVehicles.map(v => v.id);
    const candidates = allInventory.filter(c => !comparedIds.includes(c.id));
    if (candidates.length === 0) return null;
    
    // Match by brand first
    const brandMatch = candidates.find(c => c.brand.toLowerCase() === activeVehicles[0].brand.toLowerCase());
    if (brandMatch) return brandMatch;

    // Match by body type
    const bodyMatch = candidates.find(c => c.body_type?.toLowerCase() === activeVehicles[0].body_type?.toLowerCase());
    if (bodyMatch) return bodyMatch;

    return candidates[0];
  })();

  // Deterministic Better-For-You Breakdown
  const verdict = (() => {
    const carA = vehicles[0];
    const carB = vehicles[1];
    if (!carA || !carB) return null;

    const parseHp = (hpStr) => parseInt((hpStr || '').replace(/\D/g, '')) || 0;
    const parseAccel = (accelStr) => parseFloat((accelStr || '').replace(/[^\d.]/g, '')) || 99;
    const parseSpeed = (speedStr) => parseInt((speedStr || '').replace(/\D/g, '')) || 0;

    const hpA = parseHp(carA.horsepower);
    const hpB = parseHp(carB.horsepower);
    const accelA = parseAccel(carA.zero_to_hundred);
    const accelB = parseAccel(carB.zero_to_hundred);
    const speedA = parseSpeed(carA.top_speed);
    const speedB = parseSpeed(carB.top_speed);

    const pointsA = [];
    const pointsB = [];

    if (hpA > 0 && hpB > 0) {
      if (hpA > hpB) pointsA.push(`Dominates with **${carA.horsepower}** of output compared to ${carB.horsepower} (+${hpA - hpB} HP).`);
      if (hpB > hpA) pointsB.push(`Dominates with **${carB.horsepower}** of output compared to ${carA.horsepower} (+${hpB - hpA} HP).`);
    }
    if (accelA < 99 && accelB < 99) {
      if (accelA < accelB) pointsA.push(`Accelerates faster, launching from 0-100 km/h in a blistering **${carA.zero_to_hundred}** (vs ${carB.zero_to_hundred}).`);
      if (accelB < accelA) pointsB.push(`Accelerates faster, launching from 0-100 km/h in a blistering **${carB.zero_to_hundred}** (vs ${carA.zero_to_hundred}).`);
    }
    if (speedA > 0 && speedB > 0) {
      if (speedA > speedB) pointsA.push(`Boasts a higher top speed of **${carA.top_speed}** (vs ${carB.top_speed}).`);
      if (speedB > speedA) pointsB.push(`Boasts a higher top speed of **${carB.top_speed}** (vs ${carA.top_speed}).`);
    }

    if (carA.is_inventory && !carB.is_inventory) {
      pointsA.push(`**Available immediately** in our Mumbai showroom for private viewing.`);
      pointsB.push(`Bespoke sourcing required. Our specialist team can acquire this model for you.`);
    } else if (carB.is_inventory && !carA.is_inventory) {
      pointsB.push(`**Available immediately** in our Mumbai showroom for private viewing.`);
      pointsA.push(`Bespoke sourcing required. Our specialist team can acquire this model for you.`);
    }

    return { pointsA, pointsB };
  })();

  // Render spec comparison rows
  const renderSpecRow = (label, key, isNumerical = false, higherIsBetter = true) => {
    const carA = vehicles[0];
    const carB = vehicles[1];
    
    const valA = carA ? carA[key] : 'Not available';
    const valB = carB ? carB[key] : 'Not available';

    if ((!carA || valA === 'Not available') && (!carB || valB === 'Not available')) {
      return null; // Don't render empty rows
    }

    const parseNum = (str) => {
      const parsed = parseFloat((str || '').replace(/[^\d.]/g, ''));
      return isNaN(parsed) ? null : parsed;
    };

    let bestCar = null;
    if (isNumerical && carA && carB) {
      const numA = parseNum(valA);
      const numB = parseNum(valB);
      if (numA !== null && numB !== null && numA !== numB) {
        if (higherIsBetter) {
          bestCar = numA > numB ? 0 : 1;
        } else {
          bestCar = numA < numB ? 0 : 1;
        }
      }
    }

    return (
      <div key={key} className="grid grid-cols-1 md:grid-cols-12 border-b border-white/5 py-4 text-xs font-mulish items-center gap-2 md:gap-0">
        <div className="md:col-span-4 text-zinc-400 font-bold uppercase tracking-wider">{label}</div>
        <div className="md:col-span-4 flex items-center justify-between md:justify-start pr-4">
          <span className={`${bestCar === 0 ? 'text-[#e2b857] font-black' : 'text-white font-medium'}`}>{valA}</span>
          {bestCar === 0 && <span className="text-[#e2b857] text-[10px] uppercase font-bold tracking-widest pl-2">★ Best</span>}
        </div>
        <div className="md:col-span-4 flex items-center justify-between md:justify-start pl-0 md:pl-4">
          <span className={`${bestCar === 1 ? 'text-[#e2b857] font-black' : 'text-white font-medium'}`}>{valB}</span>
          {bestCar === 1 && <span className="text-[#e2b857] text-[10px] uppercase font-bold tracking-widest pl-2">★ Best</span>}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#08090c] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          
          {/* Header */}
          <div className="mb-12 border-b border-white/10 pb-8 text-center md:text-left">
            <div className="flex items-center space-x-3 justify-center md:justify-start mb-4">
              <Scale className="w-8 h-8 text-[#e2b857]" />
              <h1 className="text-4xl sm:text-6xl font-black font-heading uppercase tracking-tight">
                Supercar <span className="text-zinc-500 font-extralight">Showdown</span>
              </h1>
            </div>
            <p className="text-sm sm:text-base text-zinc-400 font-mulish max-w-2xl">
              Compare premium specifications, visual studio renderings, and showroom availability. Compare global models with our active handpicked inventory.
            </p>
          </div>

          {/* Core Selection Slots Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {[0, 1].map((slotIdx) => {
              const vehicle = vehicles[slotIdx];
              const isSlotActive = activeSelectSlot === slotIdx;

              return (
                <div 
                  key={slotIdx} 
                  className="bg-[#0b0c10]/70 border border-white/10 rounded-3xl p-6 relative flex flex-col min-h-[480px] shadow-xl overflow-visible"
                >
                  {vehicle ? (
                    // Vehicle Info Display
                    <div className="flex-1 flex flex-col justify-between space-y-6 animate-fadeIn">
                      
                      {/* Close Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-[#e2b857] tracking-widest block mb-1">
                            {vehicle.is_inventory ? 'Available in Showroom' : 'Bespoke Search'}
                          </span>
                          <span className="text-xs text-zinc-400 block font-bold font-mono">
                            {vehicle.brand} • {vehicle.year !== 'Not available' ? vehicle.year : 'Catalog'}
                          </span>
                          <h3 className="text-2xl font-black text-white font-heading mt-0.5 tracking-tight uppercase">
                            {vehicle.name}
                          </h3>
                        </div>
                        <button
                          onClick={() => handleRemoveSlot(slotIdx)}
                          className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white hover:text-black text-zinc-400 transition-all shadow-md"
                          title="Remove Vehicle"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Image Viewer */}
                      <div className="relative h-56 bg-black/60 rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center">
                        {vehicle.images && vehicle.images[0] ? (
                          <img 
                            src={vehicle.images[0].startsWith('http') ? vehicle.images[0] : ikUrl(vehicle.images[0], { width: 500, height: 350 })} 
                            alt={vehicle.name} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="text-center opacity-30">
                            <Scale className="w-12 h-12 mx-auto mb-2 text-zinc-600" />
                            <p className="text-[10px] uppercase tracking-widest font-bold">No Render Available</p>
                          </div>
                        )}
                        
                        {/* Status Overlay */}
                        <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg px-3 py-1.5 text-[9px] uppercase tracking-wider font-extrabold text-white">
                          {vehicle.is_inventory ? '★ In Showroom' : 'Bespoke Sourcing'}
                        </div>
                      </div>

                      {/* Summary Metrics */}
                      <div className="grid grid-cols-3 gap-2 border-y border-white/5 py-4">
                        <div className="text-center">
                          <span className="text-[8px] uppercase tracking-wider text-zinc-500 font-bold block">Power</span>
                          <span className="text-sm font-bold text-white font-heading">{vehicle.horsepower}</span>
                        </div>
                        <div className="text-center">
                          <span className="text-[8px] uppercase tracking-wider text-zinc-500 font-bold block">0-100</span>
                          <span className="text-sm font-bold text-white font-heading">{vehicle.zero_to_hundred}</span>
                        </div>
                        <div className="text-center">
                          <span className="text-[8px] uppercase tracking-wider text-zinc-500 font-bold block">Top Speed</span>
                          <span className="text-sm font-bold text-white font-heading">{vehicle.top_speed}</span>
                        </div>
                      </div>

                      {/* Action block */}
                      <div className="pt-2">
                        {vehicle.is_inventory ? (
                          <Link
                            to={`/inventory`}
                            className="w-full py-4 rounded-xl bg-white text-black font-extrabold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center justify-center space-x-2"
                          >
                            <span>Showroom Details</span>
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        ) : (
                          // Lead Capture Form for global/unavailable vehicle
                          <div className="border border-white/10 rounded-2xl p-4 bg-white/5">
                            {leadSubmitted[slotIdx] ? (
                              <div className="flex items-center space-x-2.5 text-[#e2b857] animate-fadeIn py-2">
                                <CheckCircle className="w-5 h-5 shrink-0" />
                                <span className="text-[11px] uppercase tracking-wider font-bold">Request received. Concierge will callback.</span>
                              </div>
                            ) : (
                              <form onSubmit={(e) => handleLeadSubmit(e, slotIdx, vehicle)} className="space-y-3">
                                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block mb-1">
                                  ✉ Source this model: Let our VIP team find it
                                </span>
                                <div className="grid grid-cols-2 gap-2.5">
                                  <input
                                    type="text"
                                    required
                                    placeholder="Your Name"
                                    value={leadName[slotIdx]}
                                    onChange={(e) => {
                                      const updated = [...leadName];
                                      updated[slotIdx] = e.target.value;
                                      setLeadName(updated);
                                    }}
                                    className="px-3 py-2.5 bg-black border border-white/10 rounded-lg text-white text-[11px] focus:outline-none focus:border-[#e2b857] font-medium"
                                  />
                                  <input
                                    type="tel"
                                    required
                                    placeholder="Phone (+91)"
                                    value={leadPhone[slotIdx]}
                                    onChange={(e) => {
                                      const updated = [...leadPhone];
                                      updated[slotIdx] = e.target.value;
                                      setLeadPhone(updated);
                                    }}
                                    className="px-3 py-2.5 bg-black border border-white/10 rounded-lg text-white text-[11px] focus:outline-none focus:border-[#e2b857] font-medium"
                                  />
                                </div>
                                <button
                                  type="submit"
                                  disabled={leadLoading[slotIdx]}
                                  className="w-full py-2.5 rounded-lg bg-[#e2b857] hover:bg-[#d4a843] text-black font-extrabold text-[10px] uppercase tracking-widest flex items-center justify-center space-x-1.5 transition-all disabled:opacity-50"
                                >
                                  {leadLoading[slotIdx] ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <>
                                      <span>Request Callback</span>
                                      <Phone className="w-3.5 h-3.5" />
                                    </>
                                  )}
                                </button>
                              </form>
                            )}
                          </div>
                        )}
                      </div>

                    </div>
                  ) : (
                    // Empty Slot Selector trigger
                    <div className="flex-1 flex flex-col justify-center items-center text-center py-10 relative overflow-visible">
                      {isSlotActive ? (
                        // Search Container
                        <div ref={searchContainerRef} className="w-full max-w-sm absolute top-4 z-40 bg-[#0c0d11] border border-white/15 rounded-2xl p-4 shadow-2xl space-y-3">
                          <div className="flex items-center justify-between border-b border-white/10 pb-2">
                            <span className="text-[10px] uppercase tracking-widest font-black text-zinc-400">Search Catalogue</span>
                            <button onClick={() => { setActiveSelectSlot(null); setSearchQuery(''); }}>
                              <X className="w-4 h-4 text-zinc-400 hover:text-white" />
                            </button>
                          </div>
                          
                          <div className="relative">
                            <input
                              type="text"
                              autoFocus
                              placeholder="e.g. BMW M3, Porsche 911, Audi..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#e2b857] pr-8"
                            />
                            {searching ? (
                              <Loader2 className="w-4 h-4 text-zinc-400 animate-spin absolute right-3 top-3.5" />
                            ) : (
                              <Search className="w-4 h-4 text-zinc-500 absolute right-3 top-3.5" />
                            )}
                          </div>

                          {/* Autocomplete Search Overlay Results */}
                          {searchQuery.trim().length >= 2 && (
                            <div className="max-h-60 overflow-y-auto divide-y divide-white/5 bg-[#090a0d] border border-white/10 rounded-xl text-left">
                              
                              {/* 1. Showroom Inventory Results */}
                              {searchResults.inventory.length > 0 && (
                                <div className="p-2">
                                  <span className="text-[8px] uppercase tracking-wider text-[#e2b857] font-extrabold px-2 py-1 block">In Showroom</span>
                                  {searchResults.inventory.map(c => (
                                    <button
                                      key={c.id}
                                      onClick={() => handleSelectVehicle(slotIdx, c.id)}
                                      className="w-full px-2.5 py-2 hover:bg-white/5 rounded-lg flex items-center justify-between text-left text-xs font-bold text-white transition-colors"
                                    >
                                      <span>{c.make || c.brand} {c.model || c.name}</span>
                                      <span className="text-[9px] text-zinc-400 font-normal">{c.year}</span>
                                    </button>
                                  ))}
                                </div>
                              )}

                              {/* 2. Global Catalog Results */}
                              {searchResults.global.length > 0 && (
                                <div className="p-2">
                                  <span className="text-[8px] uppercase tracking-wider text-zinc-500 font-extrabold px-2 py-1 block">Global Database</span>
                                  {searchResults.global.map(m => (
                                    <button
                                      key={m.id}
                                      onClick={() => handleSelectVehicle(slotIdx, m.id)}
                                      className="w-full px-2.5 py-2 hover:bg-white/5 rounded-lg flex items-center justify-between text-left text-xs font-bold text-white transition-colors"
                                    >
                                      <span>{m.make || m.brand} {m.model || m.name}</span>
                                      <span className="text-[8px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-zinc-400 font-normal uppercase">{m.body_type}</span>
                                    </button>
                                  ))}
                                </div>
                              )}

                              {searchResults.inventory.length === 0 && searchResults.global.length === 0 && !searching && (
                                <div className="p-4 text-center text-xs text-zinc-500">No vehicles found.</div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:border-[#e2b857] transition-all cursor-pointer shadow-lg" onClick={() => setActiveSelectSlot(slotIdx)}>
                            <Plus className="w-8 h-8 text-zinc-400" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Select Vehicle</h4>
                            <p className="text-xs text-zinc-500 max-w-[200px] mx-auto mt-1">Choose a vehicle from our showroom or query the VehiclesDB database.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* AI-Style Verdict breakdown section */}
          {verdict && (
            <div className="bg-[#0b0c10]/80 border border-white/10 rounded-3xl p-6 sm:p-8 mb-12 shadow-xl animate-fadeIn">
              <div className="flex items-center space-x-2.5 mb-6 border-b border-white/5 pb-4">
                <Sparkles className="w-6 h-6 text-[#e2b857]" />
                <h3 className="text-lg sm:text-xl font-black uppercase tracking-wider text-white font-heading mt-0.5 tracking-tight">
                  Showdown Verdict <span className="text-zinc-500 font-extralight">& Breakdown</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm font-mulish leading-relaxed">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wide text-white mb-3">
                    Choose the <span className="text-[#e2b857]">{vehicles[0].name}</span> if you want:
                  </h4>
                  <ul className="space-y-2.5 text-zinc-300">
                    {verdict.pointsA.map((pt, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-[#e2b857] font-bold shrink-0">✔</span>
                        <span dangerouslySetInnerHTML={{ __html: pt.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                      </li>
                    ))}
                    {verdict.pointsA.length === 0 && (
                      <li className="text-zinc-500 italic">No significant specifications discrepancies found.</li>
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wide text-white mb-3">
                    Choose the <span className="text-[#e2b857]">{vehicles[1].name}</span> if you want:
                  </h4>
                  <ul className="space-y-2.5 text-zinc-300">
                    {verdict.pointsB.map((pt, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-[#e2b857] font-bold shrink-0">✔</span>
                        <span dangerouslySetInnerHTML={{ __html: pt.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                      </li>
                    ))}
                    {verdict.pointsB.length === 0 && (
                      <li className="text-zinc-500 italic">No significant specifications discrepancies found.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Technical Specifications Table */}
          {(vehicles[0] || vehicles[1]) && (
            <div className="bg-[#0b0c10]/40 border border-white/10 rounded-3xl p-6 sm:p-8 mb-12 shadow-xl animate-fadeIn">
              <h3 className="text-lg sm:text-xl font-black uppercase tracking-wider text-white font-heading mb-6 border-b border-white/5 pb-4">
                Technical Specifications Comparison
              </h3>

              <div className="space-y-10">
                {/* 1. PERFORMANCE */}
                <div>
                  <h4 className="text-xs uppercase font-extrabold tracking-widest text-[#e2b857] mb-3">Performance specs</h4>
                  {renderSpecRow('Horsepower', 'horsepower', true, true)}
                  {renderSpecRow('Torque', 'torque')}
                  {renderSpecRow('0 – 100 km/h', 'zero_to_hundred', true, false)}
                  {renderSpecRow('Top speed', 'top_speed', true, true)}
                </div>

                {/* 2. ENGINE */}
                <div>
                  <h4 className="text-xs uppercase font-extrabold tracking-widest text-[#e2b857] mb-3">Engine & classification</h4>
                  {renderSpecRow('Engine', 'engine')}
                  {renderSpecRow('Body type', 'body_type')}
                  {renderSpecRow('Fuel type', 'fuel_type')}
                </div>

                {/* 3. TRANSMISSION */}
                <div>
                  <h4 className="text-xs uppercase font-extrabold tracking-widest text-[#e2b857] mb-3">Transmission & drivetrain</h4>
                  {renderSpecRow('Transmission', 'transmission')}
                </div>

                {/* 4. PRACTICALITY */}
                <div>
                  <h4 className="text-xs uppercase font-extrabold tracking-widest text-[#e2b857] mb-3">Aesthetics & practicalities</h4>
                  {renderSpecRow('Color / Finish', 'color')}
                  {renderSpecRow('Interior style', 'interior_color')}
                  {renderSpecRow('Odometer / Mileage', 'mileage_kms')}
                </div>
              </div>
            </div>
          )}

          {/* Compare with Similar Showroom Inventory Recommendation Section */}
          {recommendedCar && (
            <div className="mt-16 pt-12 border-t border-white/10">
              <div className="flex flex-col items-center justify-center text-center mb-8 space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-heading uppercase">
                  Showroom <span className="text-zinc-500 font-extralight">Alternative</span>
                </h3>
                <div className="text-zinc-400 font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs">
                  Available in Showroom for Immediate Settle
                </div>
              </div>

              <div className="max-w-md mx-auto bg-[#0b0c10] border border-white/10 rounded-3xl p-5 shadow-2xl flex items-center space-x-4">
                <div className="w-28 h-20 bg-black rounded-xl overflow-hidden shrink-0 border border-white/5">
                  <img src={ikUrl(recommendedCar.images?.[0], { width: 200, height: 150 })} alt={recommendedCar.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <span className="text-[8px] uppercase tracking-wider text-[#e2b857] font-bold block mb-0.5">Showroom Stock</span>
                  <h4 className="text-sm font-bold text-white truncate uppercase tracking-tight">{recommendedCar.brand} {recommendedCar.name}</h4>
                  <p className="text-xs text-zinc-400 font-semibold font-mono mt-0.5">{recommendedCar.price}</p>
                  
                  <button
                    onClick={() => {
                      // Add to slot 2 and route / refresh
                      handleSelectVehicle(1, recommendedCar.id);
                    }}
                    className="mt-2.5 px-3.5 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black text-[9px] uppercase tracking-widest font-extrabold flex items-center space-x-1 transition-all"
                  >
                    <span>Add to Compare</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
