import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  Plus, Search, Edit2, Trash2, AlertTriangle,
  RefreshCw, ChevronLeft, ChevronRight, X, HelpCircle
} from 'lucide-react';

const STATUS_BADGE = {
  true:   'bg-white text-black border-white',
  false:  'bg-zinc-800 text-zinc-300 border-zinc-700',
};

const PAGE_SIZE = 10;

function DeleteModal({ faq, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-black/60 p-8 shadow-2xl backdrop-blur-2xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
            <AlertTriangle size={24} className="text-red-400" />
          </div>
          <h3 className="text-white font-black tracking-widest uppercase text-sm mb-1">Delete FAQ</h3>
          <p className="text-zinc-500 text-[10px] tracking-widest uppercase">This action cannot be undone</p>
        </div>
        <p className="text-zinc-400 text-sm mb-8 text-center">
          Are you sure you want to permanently delete the FAQ:<br />
          <strong className="text-white font-bold">"{faq.question}"</strong>?
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

export default function AdminFAQs() {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchFAQs = useCallback(async () => {
    setLoading(true);
    try {
      let q = supabase
        .from('chatbot_faqs')
        .select('*', { count: 'exact' })
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false })
        .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

      if (search.trim()) {
        q = q.ilike('question', `%${search.trim()}%`);
      }

      const { data, count, error } = await q;
      if (error) throw error;

      setFaqs(data ?? []);
      setTotal(count ?? 0);
    } catch (err) {
      console.error('[AdminFAQs] Error fetching FAQs:', err.message);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchFAQs();
  }, [fetchFAQs]);

  useEffect(() => {
    setPage(0);
  }, [search]);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const { error } = await supabase
        .from('chatbot_faqs')
        .delete()
        .eq('id', deleteTarget.id);

      if (error) throw error;
      setDeleteTarget(null);
      fetchFAQs();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    } finally {
      setDeleting(false);
    }
  }

  async function toggleActive(faq) {
    try {
      const { error } = await supabase
        .from('chatbot_faqs')
        .update({ is_active: !faq.is_active })
        .eq('id', faq.id);

      if (error) throw error;
      setFaqs(faqs.map(f => f.id === faq.id ? { ...f, is_active: !f.is_active } : f));
    } catch (err) {
      alert('Failed to toggle status: ' + err.message);
    }
  }

  const pageCount = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-widest font-heading">
            Chatbot FAQs
          </h1>
          <p className="text-sm text-zinc-400 mt-1">Manage FAQs served by the virtual concierge.</p>
        </div>

        <Link
          to="/admin/faqs/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-zinc-200 text-black
            rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-xl hover:scale-105"
        >
          <Plus size={14} />
          <span>Add FAQ</span>
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-zinc-950/60 p-4 border border-white/10 rounded-2xl">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search FAQs by question..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-10 py-3 bg-black/40 border border-white/10 rounded-xl text-xs font-semibold
              text-white focus:outline-none focus:border-white/30 placeholder-zinc-600 transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
              <X size={14} />
            </button>
          )}
        </div>

        <button
          onClick={fetchFAQs}
          className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white border border-white/10 transition-all flex-shrink-0"
          title="Refresh"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Grid or Empty */}
      {loading && faqs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Loading FAQs...</p>
        </div>
      ) : faqs.length === 0 ? (
        <div className="text-center py-20 border border-white/10 bg-zinc-950/20 rounded-2xl">
          <HelpCircle size={40} className="text-zinc-600 mx-auto mb-4" />
          <p className="text-white font-bold uppercase text-xs tracking-wider">No FAQs Found</p>
          <p className="text-zinc-500 text-xs mt-1">Try refining your search or add a new FAQ above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {faqs.map(faq => (
              <div
                key={faq.id}
                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-6
                  bg-zinc-900/40 border border-white/10 rounded-2xl gap-4 hover:border-white/20 transition-all"
              >
                <div className="space-y-2 flex-1 min-w-0 pr-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-white/10 text-zinc-300 uppercase tracking-widest">
                      {faq.category || 'General'}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-bold tracking-widest font-mono">
                      PRIORITY: {faq.priority}
                    </span>
                  </div>
                  <h3 className="font-heading font-black text-white text-sm uppercase tracking-wide">
                    {faq.question}
                  </h3>
                  <p className="text-zinc-400 text-xs font-mulish line-clamp-2">
                    {faq.answer}
                  </p>
                  {faq.keywords && faq.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {faq.keywords.map((kw, i) => (
                        <span key={i} className="text-[9px] font-semibold text-zinc-500 bg-black/40 px-2 py-0.5 rounded-md border border-white/5">
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-white/5">
                  {/* Status Toggle */}
                  <button
                    onClick={() => toggleActive(faq)}
                    className={`px-3 py-1.5 border rounded-full text-[9px] font-black uppercase tracking-wider transition-all ${
                      STATUS_BADGE[faq.is_active]
                    }`}
                  >
                    {faq.is_active ? 'Active' : 'Draft'}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => navigate(`/admin/faqs/${faq.id}/edit`)}
                      className="p-2 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all border border-white/5"
                      title="Edit"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(faq)}
                      className="p-2 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-full transition-all border border-red-500/10"
                      title="Delete"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pageCount > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                Showing {page * PAGE_SIZE + 1} - {Math.min((page + 1) * PAGE_SIZE, total)} of {total} FAQs
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 0}
                  onClick={() => setPage(p => p - 1)}
                  className="p-2 text-zinc-400 hover:text-white border border-white/10 rounded-xl disabled:opacity-30 transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-white text-xs font-bold font-mono px-3">
                  {page + 1} / {pageCount}
                </span>
                <button
                  disabled={page >= pageCount - 1}
                  onClick={() => setPage(p => p + 1)}
                  className="p-2 text-zinc-400 hover:text-white border border-white/10 rounded-xl disabled:opacity-30 transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteModal
          faq={deleteTarget}
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
