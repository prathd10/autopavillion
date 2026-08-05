import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  Save, ArrowLeft, Loader2,
  AlertCircle, CheckCircle2
} from 'lucide-react';

/* ─── Defaults ───────────────────────────────────────────────── */
const EMPTY_TESTIMONIAL = {
  id: '',
  name: '',
  role: '',
  comment: '',
  car: '',
  status: 'active',
};

const STATUS_OPTS  = ['active', 'draft'];

/* ─── Field helpers ──────────────────────────────────────────── */
function Field({ label, id, required, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[10px] font-bold text-zinc-400 tracking-widest uppercase mb-2">
        {label}{required && <span className="text-white ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = `w-full px-5 py-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10
  text-white placeholder-zinc-600 text-sm font-medium
  focus:outline-none focus:border-white/40 focus:bg-white/10
  transition-all duration-300`;

function TextInput({ id, value, onChange, placeholder = '', required = false, type = 'text', as = 'input' }) {
  if (as === 'textarea') {
    return (
      <textarea
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={5}
        className={`${inputCls} resize-none`}
      />
    );
  }
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className={inputCls}
    />
  );
}

function SelectInput({ id, value, onChange, options }) {
  return (
    <select id={id} value={value} onChange={e => onChange(e.target.value)} className={inputCls}>
      {options.map(o => (
        <option key={o} value={o} className="bg-[#0d0e12]">{o}</option>
      ))}
    </select>
  );
}

/* ─── Section wrapper ────────────────────────────────────────── */
function Section({ title, children }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-2xl overflow-hidden shadow-2xl">
      <div className="px-8 py-5 border-b border-white/10 bg-white/5">
        <h2 className="text-[11px] font-black uppercase tracking-widest text-white">{title}</h2>
      </div>
      <div className="p-8 space-y-6">
        {children}
      </div>
    </div>
  );
}

/* ─── Main Form ──────────────────────────────────────────────── */
export default function TestimonialForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [testimonial, setTestimonial] = useState(EMPTY_TESTIMONIAL);
  const [loading,     setLoading]     = useState(isEdit);
  const [saving,      setSaving]      = useState(false);
  const [toast,       setToast]       = useState(null); // { type: 'success'|'error', msg }

  // Load existing testimonial for edit
  useEffect(() => {
    if (!isEdit) return;
    async function load() {
      setLoading(true);
      const { data, error } = await supabase.from('testimonials').select('*').eq('id', id).single();
      if (error) {
        setToast({ type: 'error', msg: 'Testimonial not found: ' + error.message });
      } else {
        setTestimonial(data);
      }
      setLoading(false);
    }
    load();
  }, [id, isEdit]);

  function set(field) {
    return value => setTestimonial(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setToast(null);
    try {
      const row = { ...testimonial };
      if (!isEdit) {
        delete row.id; // Let DB generate UUID
      }

      const { error } = await supabase.from('testimonials').upsert(row, { onConflict: 'id' });
      if (error) throw error;

      setToast({ type: 'success', msg: isEdit ? 'Testimonial updated!' : 'Testimonial added!' });
      setTimeout(() => navigate('/admin/testimonials'), 1500);
    } catch (err) {
      setToast({ type: 'error', msg: err.message });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <Link
          to="/admin/testimonials"
          className="w-12 h-12 flex items-center justify-center rounded-full border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-white tracking-widest uppercase">
            {isEdit ? 'Edit Testimonial' : 'Add Testimonial'}
          </h1>
          <p className="text-zinc-500 text-[10px] tracking-widest uppercase mt-2">
            {isEdit ? `Editing: ${testimonial.name}` : 'Fill in the details for a new client review'}
          </p>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`flex items-center gap-4 p-5 rounded-2xl border backdrop-blur-md shadow-xl ${
          toast.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {toast.type === 'success'
            ? <CheckCircle2 size={20} className="flex-shrink-0" />
            : <AlertCircle   size={20} className="flex-shrink-0" />
          }
          <p className="text-[11px] font-bold tracking-widest uppercase">{toast.msg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Basic Information */}
        <Section title="Testimonial Details">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Field label="Client Name" id="name" required>
              <TextInput id="name" value={testimonial.name} onChange={set('name')} placeholder="e.g. Vikramaditya S." required />
            </Field>
            <Field label="Client Role / Location" id="role" required>
              <TextInput id="role" value={testimonial.role} onChange={set('role')} placeholder="e.g. Industrialist & Porsche Collector, Mumbai" required />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Field label="Car Purchased" id="car" required>
              <TextInput id="car" value={testimonial.car} onChange={set('car')} placeholder="e.g. Porsche 911 GT3 RS" required />
            </Field>
            <Field label="Status" id="status">
              <SelectInput id="status" value={testimonial.status} onChange={set('status')} options={STATUS_OPTS} />
            </Field>
          </div>
          
          <Field label="Review / Comment" id="comment" required>
            <TextInput 
              id="comment" 
              value={testimonial.comment} 
              onChange={set('comment')} 
              placeholder="Enter the client's testimonial..." 
              required 
              as="textarea"
            />
          </Field>
        </Section>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 pb-12">
          <Link
            to="/admin/testimonials"
            className="px-6 py-3.5 rounded-full text-[11px] font-bold tracking-widest uppercase border border-white/10
              text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-300"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-3 px-8 py-3.5 rounded-full text-[11px] font-extrabold tracking-widest uppercase
              bg-white hover:bg-zinc-200 disabled:opacity-50
              text-black transition-all duration-300 shadow-2xl hover:scale-105"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Saving…' : isEdit ? 'Update Testimonial' : 'Add Testimonial'}
          </button>
        </div>

      </form>
    </div>
  );
}
