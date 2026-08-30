import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';
import ImageUploader from '../components/ImageUploader';
import { usePageTracker } from '../hooks/usePageTracker';
import { Star, MessageSquare, Check, Loader2, User, Briefcase, Car, FileText } from 'lucide-react';

export default function SubmitReviewPage() {
  usePageTracker('/review');

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    car: '',
    comment: '',
    photo: ''
  });
  const [rating, setRating] = useState(5); // Visual only, luxury aesthetics
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      name: formData.name.trim(),
      role: formData.role.trim(),
      car: formData.car.trim() || 'General Experience',
      comment: formData.comment.trim(),
      status: 'active', // Reflects immediately on backend & frontend
      photo: formData.photo || null
    };

    try {
      const { error: dbError } = await supabase
        .from('testimonials')
        .insert(payload);

      if (dbError) throw dbError;
      setSuccess(true);
      setFormData({ name: '', role: '', car: '', comment: '', photo: '' });
    } catch (err) {
      console.error('[SubmitReviewPage]', err.message);
      setError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#08090c] text-slate-100 font-mulish selection:bg-white selection:text-black flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-amber-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <Navbar />

      <main className="flex-1 pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto w-full relative z-10">
        {success ? (
          <div className="mono-panel p-8 sm:p-12 rounded-3xl border border-green-500/20 bg-black/60 text-center space-y-6 animate-fadeInUp shadow-2xl backdrop-blur-xl">
            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-green-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white font-heading uppercase tracking-wider">Review Submitted!</h2>
              <p className="text-zinc-400 text-xs tracking-widest uppercase">Thank you for sharing your experience</p>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed">
              Your testimonial has been saved and published. It will now reflect on our public homepage and admin dashboard.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="px-8 py-3.5 rounded-full border border-white/10 text-white font-extrabold text-[11px] uppercase tracking-widest hover:bg-white/5 transition-all w-full"
            >
              Write Another Review
            </button>
          </div>
        ) : (
          <div className="space-y-8 animate-fadeInUp">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-zinc-300">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Share Your Experience</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading uppercase tracking-tight text-white leading-none">
                Submit A <br />
                <span className="text-zinc-500">Testimonial</span>
              </h1>
              <p className="text-zinc-400 text-xs sm:text-sm max-w-md mx-auto pt-2 leading-relaxed">
                Your feedback is highly valued. Tell us about your journey and experience with Auto Pavilion.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mono-panel p-6 sm:p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl space-y-6">
              
              {/* Rating selection (Aesthetic only) */}
              <div className="flex flex-col items-center space-y-2 pb-4 border-b border-white/5">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-500">Your Rating</span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="transition-transform active:scale-95"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          star <= rating ? 'fill-white text-white' : 'text-zinc-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 flex items-center space-x-1.5">
                  <User className="w-3 h-3 text-zinc-500" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  placeholder="e.g. Vikramaditya S."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-zinc-700 text-sm font-medium focus:outline-none focus:border-white/30 focus:bg-white/5 transition-all"
                />
              </div>

              {/* Role / Designation */}
              <div className="space-y-2">
                <label htmlFor="role" className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 flex items-center space-x-1.5">
                  <Briefcase className="w-3 h-3 text-zinc-500" />
                  <span>Designation / Professional Title</span>
                </label>
                <input
                  type="text"
                  id="role"
                  required
                  placeholder="e.g. Industrialist & Collector / Entrepreneur"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-zinc-700 text-sm font-medium focus:outline-none focus:border-white/30 focus:bg-white/5 transition-all"
                />
              </div>

              {/* Car Purchased (Optional) */}
              <div className="space-y-2">
                <label htmlFor="car" className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 flex items-center space-x-1.5">
                  <Car className="w-3 h-3 text-zinc-500" />
                  <span>Vehicle Purchased (Optional)</span>
                </label>
                <input
                  type="text"
                  id="car"
                  placeholder="e.g. Porsche 911 GT3 RS"
                  value={formData.car}
                  onChange={(e) => setFormData({ ...formData, car: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-zinc-700 text-sm font-medium focus:outline-none focus:border-white/30 focus:bg-white/5 transition-all"
                />
              </div>

              {/* Review Comment */}
              <div className="space-y-2">
                <label htmlFor="comment" className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 flex items-center space-x-1.5">
                  <FileText className="w-3 h-3 text-zinc-500" />
                  <span>Your Testimonial</span>
                </label>
                <textarea
                  id="comment"
                  required
                  rows={5}
                  placeholder="Write a brief description of your experience..."
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-zinc-700 text-sm font-medium focus:outline-none focus:border-white/30 focus:bg-white/5 transition-all resize-none"
                />
              </div>

              {/* Photo Upload (Optional) */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 flex items-center space-x-1.5">
                  <User className="w-3 h-3 text-zinc-500" />
                  <span>Your Photo (Optional)</span>
                </label>
                <p className="text-[10px] tracking-widest uppercase text-zinc-500 mb-2">
                  Optional: Showcase yourself with your vehicle or share a profile photo.
                </p>
                <ImageUploader
                  label="Client Photo"
                  value={formData.photo ? [formData.photo] : []}
                  onChange={(urls) => setFormData({ ...formData, photo: urls[0] || '' })}
                  previewOpts={{ width: 150, height: 150, quality: 75 }}
                  maxFiles={1}
                />
              </div>

              {error && (
                <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-bold uppercase tracking-wider text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-full bg-white hover:bg-zinc-200 text-black font-extrabold text-[11px] uppercase tracking-widest flex items-center justify-center space-x-2 transition-all disabled:opacity-50 active:scale-[0.98] shadow-lg"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Submit Review</span>
                    <Check className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
