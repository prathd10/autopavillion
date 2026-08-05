import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { Eye, Users, Car, Star, RefreshCw, TrendingUp, Clock } from 'lucide-react';

/* ─── Sparkline ─────────────────────────────────────────────── */
function Sparkline({ data = [], color = '#ffffff', height = 48 }) {
  if (data.length < 2) return null;
  const w = 260;
  const h = height;
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - (v / max) * h * 0.9;
    return [x, y];
  });
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]},${p[1]}`).join(' ');
  const area = `${line} L ${pts[pts.length - 1][0]},${h} L ${pts[0][0]},${h} Z`;
  const gradId = `spk-${color.replace('#', '')}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0"    />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Stat Card ─────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, sub, sparkData }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-2xl p-6 flex flex-col gap-4 relative overflow-hidden group hover:bg-white/[0.02] transition-colors duration-300">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] text-zinc-400 tracking-[0.2em] uppercase font-bold mb-2">{label}</p>
          <p className="text-4xl font-black text-white tabular-nums tracking-tight">{value ?? '—'}</p>
          {sub && <p className="text-xs text-zinc-500 mt-1">{sub}</p>}
        </div>
        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
          <Icon size={20} className="text-white" />
        </div>
      </div>
      {sparkData && (
        <div className="opacity-50 group-hover:opacity-100 transition-opacity duration-300">
          <Sparkline data={sparkData} color="#ffffff" height={40} />
        </div>
      )}
    </div>
  );
}

/* ─── Main Dashboard ─────────────────────────────────────────── */
export default function AdminDashboard() {
  const [stats,    setStats]    = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [lastFetch,setLastFetch]= useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const now = new Date();
      const d7  = new Date(now - 7  * 864e5).toISOString();
      const d14 = new Date(now - 14 * 864e5).toISOString();

      // --- Page views ---
      const [
        { count: totalViews },
        { data: recentRaw },
        { data: dailyRaw },
        { data: activityRaw },
        { count: totalCars },
        { count: featuredCars },
      ] = await Promise.all([
        supabase.from('page_views').select('*', { count: 'exact', head: true }),
        supabase.from('page_views').select('session_id').gte('created_at', d7),
        supabase.from('page_views').select('created_at').gte('created_at', d14).order('created_at', { ascending: true }),
        supabase.from('page_views').select('session_id, page, created_at').order('created_at', { ascending: false }).limit(10),
        supabase.from('cars').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('cars').select('*', { count: 'exact', head: true }).eq('featured', true),
      ]);

      // Unique sessions last 7 days
      const uniqueSessions7d = new Set((recentRaw ?? []).map(r => r.session_id)).size;

      // Build 14-day sparkline (index 0 = 14 days ago, 13 = today)
      const buckets = Array.from({ length: 14 }, (_, i) => {
        const d = new Date(now);
        d.setDate(d.getDate() - (13 - i));
        return d.toISOString().slice(0, 10);
      });
      const countByDay = {};
      (dailyRaw ?? []).forEach(r => {
        const day = r.created_at.slice(0, 10);
        countByDay[day] = (countByDay[day] ?? 0) + 1;
      });
      const sparkData = buckets.map(d => countByDay[d] ?? 0);

      setStats({
        totalViews:      totalViews   ?? 0,
        uniqueSessions7d,
        totalCars:       totalCars    ?? 0,
        featuredCars:    featuredCars ?? 0,
        sparkData,
      });
      setActivity(activityRaw ?? []);
    } catch (err) {
      console.error('[Dashboard] Fetch error:', err.message);
    } finally {
      setLoading(false);
      setLastFetch(new Date());
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  function timeAgo(iso) {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1)  return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-widest uppercase">Dashboard</h1>
          <p className="text-zinc-400 text-[10px] tracking-widest uppercase mt-2">Analytics overview</p>
        </div>
        <button
          onClick={fetchAll}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest
            text-black bg-white hover:bg-zinc-200 transition-all duration-300 disabled:opacity-50 shadow-xl"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-40 rounded-3xl bg-white/5 border border-white/10 animate-pulse backdrop-blur-sm" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Eye}
            label="Total Page Views"
            value={stats?.totalViews?.toLocaleString()}
            sub="All-time visits"
            sparkData={stats?.sparkData}
          />
          <StatCard
            icon={Users}
            label="Unique Sessions"
            value={stats?.uniqueSessions7d?.toLocaleString()}
            sub="Last 7 days"
          />
          <StatCard
            icon={Car}
            label="Active Inventory"
            value={stats?.totalCars?.toLocaleString()}
            sub="Cars listed"
          />
          <StatCard
            icon={Star}
            label="Featured Cars"
            value={stats?.featuredCars?.toLocaleString()}
            sub="On hero / spotlight"
          />
        </div>
      )}

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Sparkline chart card */}
        <div className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[11px] font-bold tracking-widest uppercase text-white">Page Views — 14 Days</h2>
              <p className="text-[10px] tracking-widest uppercase text-zinc-500 mt-1">Daily visit frequency</p>
            </div>
            <TrendingUp size={20} className="text-white" />
          </div>
          {loading ? (
            <div className="h-16 rounded-2xl bg-white/5 animate-pulse" />
          ) : (
            <div className="mt-2">
              <Sparkline data={stats?.sparkData ?? []} color="#ffffff" height={80} />
              <div className="flex justify-between mt-4 text-[10px] tracking-widest uppercase text-zinc-500">
                <span>14 days ago</span>
                <span>Today</span>
              </div>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[11px] font-bold tracking-widest uppercase text-white">Recent Activity</h2>
              <p className="text-[10px] tracking-widest uppercase text-zinc-500 mt-1">Last 10 page visits</p>
            </div>
            <Clock size={20} className="text-zinc-500" />
          </div>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 rounded-xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : activity.length === 0 ? (
            <p className="text-zinc-500 text-[11px] uppercase tracking-widest text-center py-10">No visits recorded yet</p>
          ) : (
            <div className="space-y-2">
              {activity.map((a, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 px-4 rounded-xl hover:bg-white/5 transition-colors group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-2 h-2 rounded-full bg-white/40 group-hover:bg-white flex-shrink-0 transition-colors" />
                    <span className="text-xs text-zinc-300 truncate font-mono">{a.session_id?.slice(0, 12)}…</span>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">{a.page}</span>
                  </div>
                  <span className="text-[10px] tracking-widest uppercase text-zinc-500 flex-shrink-0 ml-2">{timeAgo(a.created_at)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {lastFetch && (
        <p className="text-center text-[9px] uppercase tracking-widest text-zinc-600">
          Last updated {lastFetch.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
