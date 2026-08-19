import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { mapCarFromDb } from '../../lib/mappers';
import { ikUrl } from '../../lib/imagekit';
import {
  Plus, Search, Edit2, Trash2, AlertTriangle,
  RefreshCw, ChevronLeft, ChevronRight, X, Car, ArrowRight
} from 'lucide-react';

const STATUS_BADGE = {
  active:   'bg-white text-black border-white',
  sold:     'bg-zinc-800 text-zinc-300 border-zinc-700',
  draft:    'bg-zinc-800 text-zinc-300 border-zinc-700',
  archived: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const PAGE_SIZE = 10;

/* ─── Delete Confirm Modal ────────────────────────────────────── */
function DeleteModal({ car, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-black/60 p-8 shadow-2xl backdrop-blur-2xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
            <AlertTriangle size={24} className="text-red-400" />
          </div>
          <h3 className="text-white font-black tracking-widest uppercase text-sm mb-1">Delete Car</h3>
          <p className="text-zinc-500 text-[10px] tracking-widest uppercase">This action cannot be undone</p>
        </div>
        <p className="text-zinc-400 text-sm mb-8 text-center">
          Are you sure you want to permanently delete <br />
          <strong className="text-white font-bold">{car.name}</strong>?
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

/* ─── Main Inventory Page ─────────────────────────────────────── */
export default function AdminInventory() {
  const navigate = useNavigate();
  const [cars,        setCars]        = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState('');
  const [page,        setPage]        = useState(0);
  const [deleteTarget,setDeleteTarget]= useState(null);
  const [deleting,    setDeleting]    = useState(false);
  const [total,       setTotal]       = useState(0);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    try {
      let q = supabase
        .from('cars')
        .select('*', { count: 'exact' })
        .order('status', { ascending: true })
        .order('created_at', { ascending: false })
        .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

      if (search.trim()) {
        q = q.ilike('name', `%${search.trim()}%`);
      }

      const { data, count, error } = await q;
      if (error) throw error;

      setCars((data ?? []).map(mapCarFromDb));
      setTotal(count ?? 0);
    } catch (err) {
      console.error('[AdminInventory]', err.message);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchCars(); }, [fetchCars]);

  // Reset to page 0 when search changes
  useEffect(() => { setPage(0); }, [search]);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const { error } = await supabase.from('cars').delete().eq('id', deleteTarget.id);
      if (error) throw error;
      setDeleteTarget(null);
      fetchCars();
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
          <h1 className="text-2xl font-black text-white tracking-widest uppercase">Inventory</h1>
          <p className="text-zinc-500 text-[10px] tracking-widest uppercase mt-2">
            {total} car{total !== 1 ? 's' : ''} in your database
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchCars}
            className="w-11 h-11 flex items-center justify-center rounded-full border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <Link
            to="/admin/inventory/new"
            className="px-6 py-3 rounded-full bg-white text-black font-extrabold text-[11px] uppercase tracking-widest flex items-center space-x-3 hover:bg-zinc-200 transition-all duration-300 shadow-2xl hover:scale-105 group"
          >
            <span>Add New Car</span>
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
          placeholder="Search inventory…"
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
        ) : cars.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <Car size={32} className="text-zinc-600" />
            </div>
            <p className="text-zinc-500 text-[11px] tracking-widest uppercase font-bold">No cars found</p>
            <Link to="/admin/inventory/new" className="text-white text-xs font-bold uppercase tracking-widest hover:underline mt-2 flex items-center gap-2 group">
              Add your first car
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
                    {['Car', 'Brand', 'Year', 'Price', 'Status', 'Featured', 'Actions'].map(h => (
                      <th key={h} className="px-6 py-4 text-left text-[9px] text-zinc-400 tracking-[0.2em] uppercase font-bold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cars.map((car, i) => (
                    <tr
                      key={car.id}
                      className={`border-b border-white/5 hover:bg-white/10 transition-colors ${i % 2 === 1 ? 'bg-white/[0.02]' : ''}`}
                    >
                      {/* Car col */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-12 rounded-xl overflow-hidden bg-black/60 border border-white/10 flex-shrink-0">
                            {car.images?.[0] ? (
                              <img
                                src={ikUrl(car.images[0], { width: 160, height: 96, quality: 75 })}
                                alt={car.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Car size={16} className="text-zinc-700" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm text-white font-extrabold tracking-wide truncate max-w-[200px] uppercase">{car.name}</p>
                            <p className="text-[10px] tracking-widest text-zinc-500 truncate max-w-[200px] uppercase mt-1">{car.subtitle}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold tracking-widest text-zinc-300 uppercase">{car.brand}</td>
                      <td className="px-6 py-4 text-sm font-black text-zinc-300 tabular-nums">{car.year}</td>
                      <td className="px-6 py-4 text-sm text-white font-black">{car.price}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase border ${STATUS_BADGE[car.status] ?? STATUS_BADGE.draft}`}>
                          {car.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {car.featured
                          ? <span className="text-white text-[10px] font-black tracking-widest uppercase bg-white/20 px-2 py-1 rounded-full">★ Featured</span>
                          : <span className="text-zinc-600 text-xs">—</span>
                        }
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => navigate(`/admin/inventory/${car.id}/edit`)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 border border-transparent hover:border-white/20 hover:text-white hover:bg-white/10 transition-all"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(car)}
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
              {cars.map(car => (
                <div key={car.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-20 h-14 rounded-xl overflow-hidden bg-black/60 border border-white/10 flex-shrink-0">
                      {car.images?.[0] ? (
                        <img src={ikUrl(car.images[0], { width: 160, height: 112, quality: 70 })} alt={car.name} className="w-full h-full object-cover" />
                      ) : <div className="w-full h-full flex items-center justify-center"><Car size={16} className="text-zinc-700" /></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-extrabold uppercase tracking-wide truncate">{car.name}</p>
                      <p className="text-[10px] tracking-widest text-zinc-500 uppercase mt-1">
                        {car.brand} · <span className="font-bold tabular-nums text-zinc-400">{car.year}</span> · <span className="text-white font-bold">{car.price}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end mt-2 sm:mt-0">
                    <button onClick={() => navigate(`/admin/inventory/${car.id}/edit`)} className="px-4 py-2 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all">Edit</button>
                    <button onClick={() => setDeleteTarget(car)} className="px-4 py-2 rounded-full border border-red-500/20 text-xs font-bold uppercase tracking-widest text-red-400 hover:bg-red-500/10 transition-all">Delete</button>
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
          car={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}
