import React, { useState, useEffect } from 'react';
import { ArrowLeft, Scale, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCars } from '../hooks/useCars';
import { ikUrl } from '../lib/imagekit';

export default function ComparePage() {
  const { cars } = useCars();
  const [compareSlots, setCompareSlots] = useState([null, null, null]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSelectCar = (index, carId) => {
    const selectedCar = cars.find(c => c.id === carId) || null;
    const newSlots = [...compareSlots];
    newSlots[index] = selectedCar;
    setCompareSlots(newSlots);
  };

  const handleRemoveCar = (index) => {
    const newSlots = [...compareSlots];
    newSlots[index] = null;
    setCompareSlots(newSlots);
  };

  return (
    <div className="min-h-screen bg-[#08090c] text-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Navigation */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-xs text-zinc-400 hover:text-white uppercase font-bold tracking-widest transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-12 border-b border-white/10 pb-8 text-center sm:text-left">
          <div className="flex items-center space-x-3 justify-center sm:justify-start mb-4">
            <Scale className="w-8 h-8 text-white" />
            <h1 className="text-4xl sm:text-6xl font-black font-heading uppercase tracking-tight">
              Premium <span className="text-zinc-500 font-extralight block sm:inline">Showdown</span>
            </h1>
          </div>
          <p className="text-sm sm:text-base text-zinc-400 font-mulish max-w-2xl mx-auto sm:mx-0">
            Compare up to three premium vehicles side-by-side. Analyze performance, specifications, and pricing to make an informed decision.
          </p>
        </div>

        {/* Compare Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {compareSlots.map((car, index) => (
            <div key={index} className="bg-white/5 border border-white/10 rounded-3xl p-6 relative flex flex-col">
              
              {/* Selector */}
              <div className="mb-6">
                <label className="text-xs font-bold uppercase text-zinc-400 block mb-2">Select Vehicle {index + 1}</label>
                <select
                  value={car ? car.id : ''}
                  onChange={(e) => handleSelectCar(index, e.target.value)}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-white/50"
                >
                  <option value="">-- Choose a Vehicle --</option>
                  {cars.map(c => (
                    <option key={c.id} value={c.id} disabled={compareSlots.some(slot => slot?.id === c.id)}>
                      {c.brand} {c.name} ({c.year})
                    </option>
                  ))}
                </select>
              </div>

              {car ? (
                <div className="flex-1 space-y-4">
                  <button
                    onClick={() => handleRemoveCar(index)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-white hover:text-black text-zinc-400 transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="relative h-48 bg-black rounded-xl overflow-hidden border border-white/10">
                    {car.images && car.images[0] && (
                      <img src={ikUrl(car.images[0], { width: 400, height: 300, quality: 75 })} alt={car.name} className="w-full h-full object-cover" />
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                      {car.brand} • {car.year}
                    </span>
                    <h3 className="text-lg font-bold text-white font-heading">{car.name}</h3>
                    <span className="text-xl font-black font-mono text-white block mt-1">{car.price}</span>
                  </div>

                  <div className="space-y-2 text-xs border-t border-white/10 pt-4 mt-4">
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-zinc-400">Horsepower</span>
                      <span className="font-bold text-white">{car.horsepower}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-zinc-400">0 - 100 km/h</span>
                      <span className="font-bold text-white">{car.zeroToHundred}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-zinc-400">Top Speed</span>
                      <span className="font-bold text-white">{car.topSpeed}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-zinc-400">Engine</span>
                      <span className="font-bold text-white text-right max-w-[150px]">{car.engine}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-zinc-400">Odometer</span>
                      <span className="font-bold text-white">{car.mileageKms}</span>
                    </div>
                  </div>

                  <div className="pt-4 mt-auto">
                    <Link
                      to={`/inventory`}
                      className="w-full py-3 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center justify-center space-x-2"
                    >
                      <span>View in Inventory</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 py-20">
                  <Scale className="w-12 h-12 mb-4" />
                  <p className="text-xs uppercase tracking-widest font-bold">Slot Available</p>
                </div>
              )}
              
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
