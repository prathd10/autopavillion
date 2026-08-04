import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  Plus, Search, Edit2, Trash2, AlertTriangle,
  RefreshCw, ChevronLeft, ChevronRight, X, MessageSquare, ArrowRight
} from 'lucide-react';

const STATUS_BADGE = {
  active:   'bg-white text-black border-white',
  draft:    'bg-zinc-800 text-zinc-300 border-zinc-700',
};

const PAGE_SIZE = 10;

/* ─── Delete Confirm Modal ────────────────────────────────────── */
function DeleteModal({ testimonial, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-black/60 p-8 shadow-2xl backdrop-blur-2xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
            <AlertTriangle size={24} className="text-red-400" />
          </div>
          <h3 className="text-white font-black tracking-widest uppercase text-sm mb-1">Delete Testimonial</h3>
          <p className="text-zinc-500 text-[10px] tracking-widest uppercase">This action cannot be undone</p>
        </div>
        <p className="text-zinc-400 text-sm mb-8 text-center">
          Are you sure you want to permanently delete the testimonial from <br />
          <strong className="text-white font-bold">{testimonial.name}</strong>?
        </p>
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 rounded-full text-[11px] font-bold tracking-widest uppercase border border-white/10
              text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-full text-[11px] font-bold tracking-widest uppercase
              bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white
              transition-all duration-300 shadow-xl"
          >
            {loading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Testimonials Page ─────────────────────────────────────── */
export default function AdminTestimonials() {
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [page,         setPage]         = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting,     setDeleting]     = useState(false);
  const [total,        setTotal]        = useState(0);

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    try {
      let q = supabase
        .from('testimonials')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

      if (search.trim()) {
        q = q.ilike('name', `%${search.trim()}%`);
      }

      const { data, count, error } = await q;
      if (error) throw error;

      setTestimonials(data ?? []);
      setTotal(count ?? 0);
    } catch (err) {
      console.error('[AdminTestimonials]', err.message);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchTestimonials(); }, [fetchTestimonials]);

  // Reset to page 0 when search changes
  useEffect(() => { setPage(0); }, [search]);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', deleteTarget.id);
      if (error) throw error;
      setDeleteTarget(null);
      fetchTestimonials();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    } finally {
      setDeleting(false);
    }
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-white tracking-widest uppercase">Testimonials</h1>
          <p className="text-zinc-500 text-[10px] tracking-widest uppercase mt-2">
            {total} review{total !== 1 ? 's' : ''} in your database
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchTestimonials}
            className="w-11 h-11 flex items-center justify-center rounded-full border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <Link
            to="/admin/testimonials/new"
            className="px-6 py-3 rounded-full bg-white text-black font-extrabold text-[11px] uppercase tracking-widest flex items-center space-x-3 hover:bg-zinc-200 transition-all duration-300 shadow-2xl hover:scale-105 group"
          >
            <span>Add Testimonial</span>
            <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
              <Plus className="w-3 h-3" />
            </span>
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search client names…"
          className="w-full pl-12 pr-10 py-3.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10
            text-white placeholder-zinc-600 text-sm font-medium
            focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all duration-300 shadow-xl"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-2xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-10 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : testimonials.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <MessageSquare size={32} className="text-zinc-600" />
            </div>
            <p className="text-zinc-500 text-[11px] tracking-widest uppercase font-bold">No testimonials found</p>
            <Link to="/admin/testimonials/new" className="text-white text-xs font-bold uppercase tracking-widest hover:underline mt-2 flex items-center gap-2 group">
              Add a testimonial
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    {['Client', 'Review', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-6 py-4 text-left text-[9px] text-zinc-400 tracking-[0.2em] uppercase font-bold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {testimonials.map((t, i) => (
                    <tr
                      key={t.id}
                      className={`border-b border-white/5 hover:bg-white/10 transition-colors ${i % 2 === 1 ? 'bg-white/[0.02]' : ''}`}
                    >
                      {/* Client */}
                      <td className="px-6 py-4 w-1/4">
                        <div className="min-w-0">
                          <p className="text-sm text-white font-extrabold tracking-wide truncate max-w-[200px] uppercase">{t.name}</p>
                          <p className="text-[10px] tracking-widest text-zinc-500 truncate max-w-[200px] uppercase mt-1">{t.role}</p>
                          <p className="text-[9px] text-zinc-400 font-mono mt-0.5 max-w-[200px] truncate">{t.car}</p>
                        </div>
                      </td>
                      
                      {/* Review */}
                      <td className="px-6 py-4 w-1/2">
                         <p className="text-xs text-zinc-300 italic line-clamp-2">{t.comment}</p>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase border ${STATUS_BADGE[t.status] ?? STATUS_BADGE.draft}`}>
                          {t.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => navigate(`/admin/testimonials/${t.id}/edit`)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 border border-transparent hover:border-white/20 hover:text-white hover:bg-white/10 transition-all"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(t)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 border border-transparent hover:border-red-500/20 hover:text-red-400 hover:bg-red-500/10 transition-all"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="lg:hidden divide-y divide-white/10">
              {testimonials.map(t => (
                <div key={t.id} className="p-5 flex flex-col gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-extrabold uppercase tracking-wide truncate">{t.name}</p>
                    <p className="text-[10px] tracking-widest text-zinc-500 uppercase mt-1">{t.role}</p>
                    <p className="text-[10px] text-zinc-400 font-mono mt-0.5">{t.car}</p>
                    <p className="text-xs text-zinc-300 italic mt-3 line-clamp-3">{t.comment}</p>
                  </div>
                  <div className="flex gap-3 justify-end mt-2">
                    <button onClick={() => navigate(`/admin/testimonials/${t.id}/edit`)} className="px-4 py-2 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all">Edit</button>
                    <button onClick={() => setDeleteTarget(t)} className="px-4 py-2 rounded-full border border-red-500/20 text-xs font-bold uppercase tracking-widest text-red-400 hover:bg-red-500/10 transition-all">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-5 border-t border-white/10 flex items-center justify-between bg-white/5">
            <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-400">
              Page {page + 1} of {totalPages}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setPage(p => p - 1)}
                disabled={page === 0}
                className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= totalPages - 1}
                className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteModal
          testimonial={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}
