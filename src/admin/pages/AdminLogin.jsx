import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

export default function AdminLogin() {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const videoSrc = "/the_car_is_being_overshadowed.mp4";
  const posterImg = "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=2400&auto=format&fit=crop";

  // Already logged in — redirect straight away
  if (user) {
    navigate('/admin/dashboard', { replace: true });
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      setError('Missing Supabase keys in .env.local');
      setLoading(false);
      return;
    }

    try {
      const { error: authError } = await signIn(email, password);
      if (authError) throw authError;
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.message ?? 'Authentication failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-black text-white flex items-center justify-center overflow-hidden font-mulish">
      {/* CINEMATIC VIDEO BACKGROUND */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={posterImg}
          className="w-full h-full object-cover object-center filter brightness-50 contrast-125 scale-105"
        >
          <source src={videoSrc} type="video/mp4" />
          <img src={posterImg} alt="Background" className="w-full h-full object-cover object-center" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80 pointer-events-none" />
      </div>

      {/* LOGIN CARD */}
      <div className="relative z-10 w-full max-w-[420px] px-6">
        <div className="p-8 sm:p-10 rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/10 shadow-2xl animate-fadeInUp">
          
          {/* Header */}
          <div className="flex flex-col items-center justify-center text-center mb-8">
            <img
              src="https://autopavilion.in/wp-content/uploads/2023/10/cropped-autopavilion_logo.png"
              alt="Auto Pavilion"
              className="h-10 w-auto object-contain brightness-0 invert mb-6"
            />
            <h1 className="text-sm font-bold tracking-[0.25em] text-white uppercase">
              Admin Console
            </h1>
            <p className="text-[10px] tracking-widest text-zinc-400 mt-2 uppercase">
              Restricted Access
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 tracking-widest uppercase mb-2 ml-1">
                Email Address
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@autopavilion.com"
                className="w-full px-5 py-3.5 rounded-2xl bg-white/5 border border-white/10
                  text-white placeholder-zinc-600 text-sm
                  focus:outline-none focus:border-white/40 focus:bg-white/10
                  transition-all duration-300"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 tracking-widest uppercase mb-2 ml-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  className="w-full px-5 py-3.5 pr-12 rounded-2xl bg-white/5 border border-white/10
                    text-white placeholder-zinc-600 text-sm
                    focus:outline-none focus:border-white/40 focus:bg-white/10
                    transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 animate-fadeIn">
                <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-xs leading-relaxed">{error}</p>
              </div>
            )}

            {/* Submit CTA */}
            <div className="pt-4">
              <button
                id="admin-login-btn"
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-full bg-white text-black font-extrabold text-[11px] uppercase tracking-widest flex items-center justify-center space-x-3 hover:bg-zinc-200 transition-all duration-300 shadow-2xl hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 group"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In To Console'}</span>
                {!loading && (
                  <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                    <ArrowRight className="w-3 h-3" />
                  </span>
                )}
                {loading && <Loader2 size={14} className="animate-spin" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
