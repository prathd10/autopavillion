import React, { useState } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function VipBooking() {
  const [submitted, setSubmitted] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: '',
    phone: '',
    vehicle: 'Porsche 911 GT3 RS',
    type: 'Private Showroom Visit (Mumbai)'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
    } catch (e) {
      // ignore
    }
  };

  return (
    <section id="vip-booking" className="py-20 bg-black text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-4xl mx-auto mono-panel p-8 sm:p-12 rounded-3xl border border-white/12 relative">
          
          <div className="text-center space-y-3 mb-10">
            <span className="text-xs uppercase font-bold tracking-[0.3em] text-zinc-400">
              Exclusive Appointment
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-heading uppercase">
              SCHEDULE <span className="text-zinc-400 font-extralight">A VIEWING</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto font-mulish">
              Experience private viewing in our Santacruz West, Mumbai showroom or request enclosed flatbed home presentation.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-10 space-y-4 animate-fadeIn">
              <CheckCircle2 className="w-12 h-12 text-white mx-auto" />
              <h3 className="text-2xl font-bold text-white font-heading uppercase">Appointment Confirmed</h3>
              <p className="text-xs text-zinc-300 max-w-md mx-auto">
                Thank you {bookingData.name}! Our director will contact you at {bookingData.phone} shortly.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-full bg-white text-black font-bold text-xs uppercase"
                >
                  Book Another Session
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-zinc-300 block mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={bookingData.name}
                    onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-black border border-white/20 text-white text-xs focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-zinc-300 block mb-2">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={bookingData.phone}
                    onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-black border border-white/20 text-white text-xs focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-zinc-300 block mb-2">Vehicle of Interest</label>
                  <select
                    value={bookingData.vehicle}
                    onChange={(e) => setBookingData({ ...bookingData, vehicle: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-black border border-white/20 text-white text-xs font-semibold focus:outline-none focus:border-white"
                  >
                    <option value="Porsche 911 GT3 RS">Porsche 911 GT3 RS</option>
                    <option value="Lamborghini Huracán EVO">Lamborghini Huracán EVO</option>
                    <option value="Ferrari 488 Pista">Ferrari 488 Pista</option>
                    <option value="Mercedes-AMG G63">Mercedes-AMG G63</option>
                    <option value="Bentley Continental GT">Bentley Continental GT</option>
                    <option value="Rolls-Royce Ghost">Rolls-Royce Ghost</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-zinc-300 block mb-2">Experience Format</label>
                  <select
                    value={bookingData.type}
                    onChange={(e) => setBookingData({ ...bookingData, type: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-black border border-white/20 text-white text-xs font-semibold focus:outline-none focus:border-white"
                  >
                    <option value="Private Showroom Visit (Mumbai)">Private Showroom Visit (Santacruz West, Mumbai)</option>
                    <option value="Home Flatbed Presentation">Doorstep Enclosed Flatbed Presentation</option>
                  </select>
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  type="submit"
                  className="px-10 py-4 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-xl inline-flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Confirm Appointment</span>
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </section>
  );
}
