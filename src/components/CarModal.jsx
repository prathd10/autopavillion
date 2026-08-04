import React, { useState, useEffect } from 'react';
import { X, Calendar, Droplet, Cog, CarFront, FileText, CheckCircle2, Rotate3D, ShieldCheck, CreditCard, PenTool } from 'lucide-react';
import { ikUrl } from '../lib/imagekit';
import confetti from 'canvas-confetti';

export default function CarModal({ car, onClose, onOpenVipModal }) {
  if (!car) return null;

  const [activeTab, setActiveTab] = useState('360');
  const [frameIndex, setFrameIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', city: 'Mumbai' });

  const handleDrag = (e) => {
    if (!isRotating) return;
    const deltaX = e.movementX || 0;
    if (Math.abs(deltaX) > 2) {
      setFrameIndex((prev) => (prev + (deltaX > 0 ? 1 : -1) + car.images.length) % car.images.length);
    }
  };

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl overflow-y-auto animate-fadeIn">
      
      <div className="relative w-full max-w-5xl bg-black border border-white/20 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col text-white">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#0a0a0a]">
          <div className="flex items-center space-x-3">
            <img src={car.brandLogo} alt={car.brand} className="h-6 w-auto object-contain filter invert contrast-200" />
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
                {car.brand} • {car.year}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-heading">{car.name}</h2>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline-block font-mono font-black text-xl text-white">
              {car.price}
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center space-x-2 px-6 py-3 border-b border-white/10 bg-black overflow-x-auto">
          <button
            onClick={() => setActiveTab('360')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === '360' ? 'bg-white text-black' : 'bg-white/10 text-zinc-300 hover:bg-white/20'
            }`}
          >
            <Rotate3D className="w-3.5 h-3.5" />
            <span>360° Inspector</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition-all whitespace-nowrap ${
              activeTab === 'gallery' ? 'bg-white text-black' : 'bg-white/10 text-zinc-300 hover:bg-white/20'
            }`}
          >
            <span>Photo Gallery ({car.images.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('specs')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'specs' ? 'bg-white text-black' : 'bg-white/10 text-zinc-300 hover:bg-white/20'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Technical Specs</span>
          </button>

          <button
            onClick={() => setActiveTab('inspection')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'inspection' ? 'bg-white text-black' : 'bg-white/10 text-zinc-300 hover:bg-white/20'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>251-Point Cert</span>
          </button>
        </div>

        {/* Scroll Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#070707]">
          
          {activeTab === '360' && (
            <div className="space-y-4">
              <div
                onMouseDown={() => setIsRotating(true)}
                onMouseUp={() => setIsRotating(false)}
                onMouseLeave={() => setIsRotating(false)}
                onMouseMove={handleDrag}
                className="relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-black cursor-grab active:cursor-grabbing border border-white/15 select-none"
              >
                <img
                  src={ikUrl(car.images[frameIndex % car.images.length], { width: 800, quality: 75 })}
                  alt="360 View"
                  className="w-full h-full object-cover"
                />

                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-xs font-semibold text-white flex items-center space-x-2">
                  <Rotate3D className="w-4 h-4 text-white animate-spin" />
                  <span>Hold & Drag to Rotate 360°</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Frame {frameIndex + 1} of {car.images.length}</span>
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-4">
              <div className="h-80 sm:h-96 rounded-2xl overflow-hidden border border-white/15 bg-black">
                <img
                  src={ikUrl(car.images[activeImageIndex], { width: 1024, quality: 80 })}
                  alt={car.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-4 gap-3">
                {car.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-20 rounded-xl overflow-hidden border transition-all ${
                      idx === activeImageIndex ? 'border-white scale-95' : 'border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={ikUrl(img, { width: 240, height: 160, quality: 60 })} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="mono-panel p-5 rounded-2xl border border-white/15 space-y-3">
                <h3 className="text-xs font-bold uppercase text-white tracking-wider mb-2">Powertrain</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-white/10">
                    <span className="text-zinc-400">Engine</span>
                    <span className="font-bold text-white">{car.engine}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/10">
                    <span className="text-zinc-400">Horsepower</span>
                    <span className="font-bold text-white">{car.horsepower}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/10">
                    <span className="text-zinc-400">0 - 100 km/h</span>
                    <span className="font-bold text-white">{car.zeroToHundred}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-zinc-400">Transmission</span>
                    <span className="font-bold text-white">{car.transmission}</span>
                  </div>
                </div>
              </div>

              <div className="mono-panel p-5 rounded-2xl border border-white/15 space-y-3">
                <h3 className="text-xs font-bold uppercase text-white tracking-wider mb-2">Details</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-white/10">
                    <span className="text-zinc-400">Year</span>
                    <span className="font-bold text-white">{car.year}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/10">
                    <span className="text-zinc-400">Mileage</span>
                    <span className="font-bold text-white">{car.mileageKms}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/10">
                    <span className="text-zinc-400">Exterior</span>
                    <span className="font-bold text-white">{car.color}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-zinc-400">Cert Code</span>
                    <span className="font-mono text-white font-bold">{car.inspectionCertificate}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inspection' && (
            <div className="mono-panel p-8 rounded-3xl border border-white/20 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center space-x-3">
                  <ShieldCheck className="w-8 h-8 text-white" />
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
                      Auto Pavilion Official Certification
                    </span>
                    <h3 className="text-xl font-bold text-white">251-Point Diagnostic Report</h3>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-white text-black font-extrabold text-xs">
                  SCORE: 251 / 251
                </span>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                This vehicle carrying binding non-accident guarantee and verified genuine mileage certification has completed multi-point diagnostic evaluation at our Santacruz West, Mumbai facility.
              </p>
            </div>
          )}

          {/* Reserve Box */}
          <div className="p-6 rounded-2xl bg-black border border-white/20">
            {formSubmitted ? (
              <div className="text-center py-4 space-y-2">
                <Check className="w-8 h-8 text-white mx-auto" />
                <h4 className="text-lg font-bold text-white">VIP Inquiry Received!</h4>
                <p className="text-xs text-zinc-400">
                  Our concierge team will contact you directly within 15 minutes.
                </p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Request Callback</h4>
                  <span className="text-lg font-black text-white font-mono">{car.price}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="px-4 py-3 rounded-xl bg-black border border-white/20 text-white text-xs focus:outline-none focus:border-white"
                  />

                  <input
                    type="tel"
                    required
                    placeholder="Phone Number (+91)"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="px-4 py-3 rounded-xl bg-black border border-white/20 text-white text-xs focus:outline-none focus:border-white"
                  />

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Submit</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
