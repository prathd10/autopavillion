import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  Save, ArrowLeft, Loader2,
  AlertCircle, CheckCircle2
} from 'lucide-react';

const EMPTY_FAQ = {
  question: '',
  answer: '',
  category: 'General',
  keywordsRaw: '',
  priority: 0,
  is_active: true
};

const CATEGORIES = [
  'General',
  'About Auto Pavilion',
  'Buying',
  'Selling',
  'Financing',
  'Documentation',
  'Vehicle Inspection',
  'Ownership',
  'Registration',
  'Warranty',
  'Delivery',
  'Exchange',
  'Test Drive',
  'Viewing',
  'Pricing'
];

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

export default function FAQForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [faq, setFaq] = useState(EMPTY_FAQ);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Load existing FAQ for editing
  useEffect(() => {
    if (!isEdit) return;
    async function load() {
      setLoading(true);
      const { data, error } = await supabase.from('chatbot_faqs').select('*').eq('id', id).single();
      if (error) {
        setToast({ type: 'error', msg: 'FAQ not found: ' + error.message });
      } else {
        setFaq({
          ...data,
          keywordsRaw: (data.keywords || []).join(', ')
        });
      }
      setLoading(false);
    }
    load();
  }, [id, isEdit]);

  function set(field) {
    return value => setFaq(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setToast(null);
    try {
      // Split and clean keyword input
      const keywords = faq.keywordsRaw
        .split(',')
        .map(kw => kw.trim().toLowerCase())
        .filter(Boolean);

      const row = {
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        keywords: keywords,
        priority: Number(faq.priority) || 0,
        is_active: Boolean(faq.is_active)
      };

      if (isEdit) {
        row.id = id;
      }

      const { error } = await supabase.from('chatbot_faqs').upsert(row, { onConflict: 'id' });
      if (error) throw error;

      setToast({ type: 'success', msg: isEdit ? 'FAQ updated successfully!' : 'FAQ added successfully!' });
      setTimeout(() => navigate('/admin/faqs'), 1500);
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
          to="/admin/faqs"
          className="w-12 h-12 flex items-center justify-center rounded-full border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-white tracking-widest uppercase">
            {isEdit ? 'Edit FAQ' : 'Add FAQ'}
          </h1>
          <p className="text-zinc-500 text-[10px] tracking-widest uppercase mt-2">
            {isEdit ? 'Update details for this question' : 'Provide details for a new bot FAQ entry'}
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
            : <AlertCircle size={20} className="flex-shrink-0" />
          }
          <p className="text-[11px] font-bold tracking-widest uppercase">{toast.msg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Section title="FAQ Configuration">
          <Field label="Question Text" id="question" required>
            <TextInput
              id="question"
              value={faq.question}
              onChange={set('question')}
              placeholder="e.g. Do you deliver cars to other cities?"
              required
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Field label="Category" id="category" required>
              <SelectInput
                id="category"
                value={faq.category}
                onChange={set('category')}
                options={CATEGORIES}
              />
            </Field>
            <Field label="Priority / Weight" id="priority" required>
              <TextInput
                id="priority"
                type="number"
                value={faq.priority}
                onChange={set('priority')}
                placeholder="e.g. 5"
                required
              />
            </Field>
            <Field label="Concierge Active Status" id="is_active">
              <select
                id="is_active"
                value={faq.is_active ? 'active' : 'draft'}
                onChange={e => set('is_active')(e.target.value === 'active')}
                className={inputCls}
              >
                <option value="active" className="bg-[#0d0e12]">Active ( concierge searches it )</option>
                <option value="draft" className="bg-[#0d0e12]">Draft ( hidden from search )</option>
              </select>
            </Field>
          </div>

          <Field label="Keywords (Comma Separated)" id="keywordsRaw">
            <TextInput
              id="keywordsRaw"
              value={faq.keywordsRaw}
              onChange={set('keywordsRaw')}
              placeholder="e.g. delivery, transport, flatbed, shipping"
            />
            <span className="block text-[9px] text-zinc-500 mt-2 tracking-wider">
              Keywords are parsed to compute intent confidence scores. Keep them single-word or short phrases.
            </span>
          </Field>

          <Field label="Answer Text" id="answer" required>
            <TextInput
              id="answer"
              value={faq.answer}
              onChange={set('answer')}
              placeholder="Provide a concicse, elegant response..."
              required
              as="textarea"
            />
          </Field>
        </Section>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 pb-12">
          <Link
            to="/admin/faqs"
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
            {saving ? 'Saving…' : isEdit ? 'Update FAQ' : 'Add FAQ'}
          </button>
        </div>
      </form>
    </div>
  );
}
