import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function ViewingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: 'Morning (10:00 AM - 1:00 PM)',
    carOfInterest: ''
  });

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-vip-modal', handleOpen);
    return () => window.removeEventListener('open-vip-modal', handleOpen);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setSubmitted(false);
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const onClose = () => setIsOpen(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.from('inquiries').insert([{
        type: 'viewing',
        name: formData.name,
        phone: formData.phone,
        details: {
          date: formData.date,
          time: formData.time,
          carOfInterest: formData.carOfInterest
        }
      }]);

      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting viewing request:', err);
      alert('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg bg-[#0c0d11] border border-white/20 rounded-3xl shadow-2xl overflow-hidden animate-fadeInUp">
        
        {/* Header */}
        <div className="relative h-32 bg-black overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=2400&auto=format&fit=crop" 
              alt="Showroom" 
              className="w-full h-full object-cover opacity-40 grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d11] to-transparent" />
          </div>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-white hover:text-black text-white rounded-full backdrop-blur-md transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h2 className="relative z-10 text-2xl font-black font-heading uppercase tracking-widest text-white mt-4">
            Book an Appointment
          </h2>
        </div>

        <div className="p-6 sm:p-8">
          {submitted ? (
            <div className="text-center space-y-4 py-8 animate-fadeIn">
              <CheckCircle2 className="w-16 h-16 text-white mx-auto mb-4" />
              <h3 className="text-2xl font-black text-white uppercase tracking-wider font-heading">
                Appointment Requested
              </h3>
              <p className="text-sm text-zinc-400 font-mulish">
                Thank you, {formData.name.split(' ')[0]}. Our concierge will contact you shortly at {formData.phone} to confirm your viewing for {formData.date}.
              </p>
              <div className="pt-6">
                <button
                  onClick={onClose}
                  className="px-8 py-3 rounded-full bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start space-x-3 mb-8 text-xs text-zinc-400 font-mulish bg-white/5 p-4 rounded-xl border border-white/10">
                <MapPin className="w-5 h-5 text-white shrink-0" />
                <p>
                  <span className="text-white font-bold block mb-1">Auto Pavilion Showroom HQ</span>
                  Office No:25, Tirupati Shopping center, S V Rd, Santacruz (W), Mumbai-400054
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white text-xs font-semibold focus:outline-none focus:border-white placeholder-zinc-600"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98200 00000"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white text-xs font-semibold focus:outline-none focus:border-white placeholder-zinc-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Preferred Date *</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-black border border-white/20 text-white text-xs font-semibold focus:outline-none focus:border-white min-h-[42px]"
                        style={{ colorScheme: 'dark' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Preferred Time *</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                      <select
                        value={formData.time}
                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-black border border-white/20 text-white text-xs font-semibold focus:outline-none focus:border-white appearance-none min-h-[42px]"
                      >
                        <option value="Morning (10:00 AM - 1:00 PM)">Morning (10am - 1pm)</option>
                        <option value="Afternoon (1:00 PM - 4:00 PM)">Afternoon (1pm - 4pm)</option>
                        <option value="Evening (4:00 PM - 8:00 PM)">Evening (4pm - 8pm)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Car of Interest (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Porsche 911 GT3 RS"
                    value={formData.carOfInterest}
                    onChange={(e) => setFormData({...formData, carOfInterest: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-black border border-white/20 text-white text-xs font-semibold focus:outline-none focus:border-white placeholder-zinc-600"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Request Appointment</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
