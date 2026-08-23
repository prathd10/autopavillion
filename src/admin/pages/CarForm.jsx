import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { mapCarFromDb, mapCarToDb } from '../../lib/mappers';
import { ikUrl } from '../../lib/imagekit';
import { BRAND_LOGOS } from '../../data/cars';
import {
  Save, ArrowLeft, Plus, X, Loader2,
  AlertCircle, CheckCircle2, ImageIcon
} from 'lucide-react';

/* ─── Defaults ───────────────────────────────────────────────── */
const EMPTY_CAR = {
  id: '',
  name: '',
  subtitle: '',
  brand: '',
  brandLogo: '',
  year: new Date().getFullYear(),
  price: '',
  priceRaw: '',
  bodyType: 'Coupe',
  transmission: '',
  mileageKms: '',
  fuelType: 'Petrol',
  color: '',
  interiorColor: '',
  owners: 1,
  location: 'Santacruz West, Mumbai Showroom',
  verified: true,
  inspectionCertificate: '',
  inspectionScore: '',
  registrationType: 'Individual',
  registrationState: '',
  description: '',
  featured: false,
  images: [],
  threeSixtyFrames: [],
  features: [],
  status: 'active',
};

const BODY_TYPES   = ['Coupe', 'Sedan', 'SUV', 'Convertible', 'Hatchback', 'Wagon', 'Pickup', 'Supercar', 'Hypercar'];
const FUEL_TYPES   = ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'PHEV'];
const STATUS_OPTS  = [
  { value: 'active', label: 'Active' },
  { value: 'sold', label: 'Sold' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' }
];

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

function TextInput({ id, value, onChange, placeholder = '', required = false, type = 'text', step }) {
  return (
    <input
      id={id}
      type={type}
      step={step}
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
      {options.map(o => {
        const val = typeof o === 'object' ? o.value : o;
        const lbl = typeof o === 'object' ? o.label : o.charAt(0).toUpperCase() + o.slice(1);
        return (
          <option key={val} value={val} className="bg-[#0d0e12]">{lbl}</option>
        );
      })}
    </select>
  );
}

function Toggle({ id, checked, onChange, label }) {
  return (
    <label htmlFor={id} className="flex items-center gap-4 cursor-pointer select-none group">
      <div className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${checked ? 'bg-white' : 'bg-white/10 border border-white/10'}`}>
        <div className={`absolute top-1 w-5 h-5 rounded-full ${checked ? 'bg-black left-6' : 'bg-zinc-400 left-1'} shadow-sm transition-all duration-300`} />
        <input id={id} type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="sr-only" />
      </div>
      <span className="text-[11px] font-bold tracking-widest uppercase text-zinc-300 group-hover:text-white transition-colors">{label}</span>
    </label>
  );
}

import ImageUploader from '../../components/ImageUploader';

/* ─── Tag list editor (features) ─────────────────────────────── */
function TagListEditor({ value, onChange }) {
  const [draft, setDraft] = useState('');

  function add() {
    const tag = draft.trim();
    if (!tag || value.includes(tag)) return;
    onChange([...value, tag]);
    setDraft('');
  }

  function remove(i) {
    onChange(value.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder="Type a feature and press Enter"
          className={`${inputCls} flex-1`}
        />
        <button type="button" onClick={add} className="px-4 py-3 rounded-2xl border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-300">
          <Plus size={16} />
        </button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {value.map((tag, i) => (
            <span key={i} className="flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase bg-white/5 border border-white/10 text-white group hover:bg-white/10 transition-colors">
              {tag}
              <button type="button" onClick={() => remove(i)} className="text-zinc-500 group-hover:text-red-400 transition-colors"><X size={12} /></button>
            </span>
          ))}
        </div>
      )}
    </div>
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
export default function CarForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [car,     setCar]     = useState(EMPTY_CAR);
  const [loading, setLoading] = useState(isEdit);
  const [saving,  setSaving]  = useState(false);
  const [toast,   setToast]   = useState(null); // { type: 'success'|'error', msg }
  const [isCustomBrand, setIsCustomBrand] = useState(false);

  // Load existing car for edit
  useEffect(() => {
    if (!isEdit) return;
    async function load() {
      setLoading(true);
      const { data, error } = await supabase.from('cars').select('*').eq('id', id).single();
      if (error) {
        setToast({ type: 'error', msg: 'Car not found: ' + error.message });
      } else {
        const mapped = mapCarFromDb(data);
        
        // Auto-populate logo if missing for backward compatibility
        if (mapped.brand && !mapped.brandLogo) {
          const matchingBrand = BRAND_LOGOS.find(b => b.name.toLowerCase() === mapped.brand.toLowerCase());
          if (matchingBrand) {
            mapped.brandLogo = matchingBrand.icon;
          } else {
            mapped.brandLogo = `https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/${mapped.brand.toLowerCase().replace(/[^a-z0-9]/g, '')}.svg`;
          }
        }

        setCar(mapped);
        if (mapped.brand && !BRAND_LOGOS.some(b => b.name.toLowerCase() === mapped.brand.toLowerCase())) {
          setIsCustomBrand(true);
        } else {
          setIsCustomBrand(false);
        }
      }
      setLoading(false);
    }
    load();
  }, [id, isEdit]);

  function set(field) {
    return value => setCar(prev => ({ ...prev, [field]: value }));
  }

  const handleBrandDropdownChange = (val) => {
    if (val === 'Other') {
      setIsCustomBrand(true);
      setCar(prev => ({
        ...prev,
        brand: '',
        brandLogo: ''
      }));
    } else {
      setIsCustomBrand(false);
      const matchingBrand = BRAND_LOGOS.find(b => b.name === val);
      setCar(prev => ({
        ...prev,
        brand: val,
        brandLogo: matchingBrand ? matchingBrand.icon : ''
      }));
    }
  };

  const handleCustomBrandChange = (val) => {
    const logoUrl = val.trim()
      ? `https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/${val.toLowerCase().replace(/[^a-z0-9]/g, '')}.svg`
      : '';
    setCar(prev => ({
      ...prev,
      brand: val,
      brandLogo: logoUrl
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setToast(null);
    try {
      // Auto-generate ID from name if creating new car
      let finalLogo = car.brandLogo;
      if (car.brand && !finalLogo) {
        const matchingBrand = BRAND_LOGOS.find(b => b.name.toLowerCase() === car.brand.toLowerCase());
        if (matchingBrand) {
          finalLogo = matchingBrand.icon;
        } else {
          finalLogo = `https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/${car.brand.toLowerCase().replace(/[^a-z0-9]/g, '')}.svg`;
        }
      }

      const carWithId = {
        ...car,
        brandLogo: finalLogo,
        id: isEdit ? car.id : (car.id || car.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now()),
      };

      const dbRow = mapCarToDb(carWithId);
      const { error } = await supabase.from('cars').upsert(dbRow, { onConflict: 'id' });
      if (error) throw error;

      setToast({ type: 'success', msg: isEdit ? 'Car updated successfully!' : 'Car added to inventory!' });
      setTimeout(() => navigate('/admin/inventory'), 1500);
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
          to="/admin/inventory"
          className="w-12 h-12 flex items-center justify-center rounded-full border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-white tracking-widest uppercase">
            {isEdit ? 'Edit Car' : 'Add New Car'}
          </h1>
          <p className="text-zinc-500 text-[10px] tracking-widest uppercase mt-2">
            {isEdit ? `Editing: ${car.name}` : 'Fill in the details to list a new car'}
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
        <Section title="Basic Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Field label="Car Name" id="name" required>
              <TextInput id="name" value={car.name} onChange={set('name')} placeholder="e.g. Porsche 911 GT3 RS" required />
            </Field>
            <Field label="Subtitle" id="subtitle">
              <TextInput id="subtitle" value={car.subtitle} onChange={set('subtitle')} placeholder="e.g. Weissach Package | Flat-6" />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Field label="Brand" id="brand" required>
              <SelectInput
                id="brandSelect"
                value={isCustomBrand ? 'Other' : car.brand}
                onChange={handleBrandDropdownChange}
                options={[
                  { value: '', label: 'Select a Brand' },
                  ...BRAND_LOGOS.map(b => ({ value: b.name, label: b.name })),
                  { value: 'Other', label: 'Other (Add brand)' }
                ]}
              />
            </Field>
            <div className="flex items-end">
              {car.brandLogo && (
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 w-fit">
                  <img
                    src={car.brandLogo}
                    alt={`${car.brand || 'Brand'} logo`}
                    className={`w-8 h-8 object-contain ${car.brandLogo.includes('simple-icons') ? 'filter invert brightness-0' : ''}`}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div>
                    <p className="text-[9px] font-bold text-zinc-500 tracking-widest uppercase">Auto Logo</p>
                    <p className="text-[10px] font-semibold text-zinc-300 truncate max-w-[200px]">{car.brandLogo.split('/').pop()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {isCustomBrand && (
            <div className="mt-4">
              <Field label="Custom Brand Name" id="customBrand" required>
                <TextInput
                  id="customBrand"
                  value={car.brand}
                  onChange={handleCustomBrandChange}
                  placeholder="e.g. Maserati"
                  required
                />
              </Field>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <Field label="Year" id="year" required>
              <TextInput id="year" type="number" value={car.year} onChange={set('year')} required />
            </Field>
            <Field label="Body Type" id="bodyType">
              <SelectInput id="bodyType" value={car.bodyType} onChange={set('bodyType')} options={BODY_TYPES} />
            </Field>
            <Field label="Status" id="status">
              <SelectInput id="status" value={car.status} onChange={set('status')} options={STATUS_OPTS} />
            </Field>
            <Field label="Fuel Type" id="fuelType">
              <SelectInput id="fuelType" value={car.fuelType} onChange={set('fuelType')} options={FUEL_TYPES} />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            <Field label="Transmission" id="transmission">
              <TextInput id="transmission" value={car.transmission} onChange={set('transmission')} placeholder="e.g. 7-Speed PDK Dual-Clutch / Automatic / Manual" />
            </Field>
          </div>
          <div className="flex flex-wrap gap-8 pt-4">
            <Toggle id="featured" checked={car.featured} onChange={set('featured')} label="Featured (show in spotlight)" />
            <Toggle id="verified" checked={car.verified} onChange={set('verified')} label="Verified / Certified" />
          </div>
        </Section>

        {/* Pricing & Ownership */}
        <Section title="Pricing & Ownership">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Field label="Display Price" id="price" required>
              <TextInput id="price" value={car.price} onChange={set('price')} placeholder="₹ 4.85 Cr" required />
            </Field>
            <Field label="Price (raw ₹)" id="priceRaw" required>
              <TextInput id="priceRaw" type="number" value={car.priceRaw} onChange={set('priceRaw')} placeholder="48500000" required />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Field label="Mileage / KMs" id="mileageKms">
              <TextInput id="mileageKms" value={car.mileageKms} onChange={set('mileageKms')} placeholder="2,400 km" />
            </Field>
            <Field label="Previous Owners" id="owners">
              <TextInput id="owners" type="number" value={car.owners} onChange={set('owners')} />
            </Field>
            <Field label="Location" id="location">
              <TextInput id="location" value={car.location} onChange={set('location')} placeholder="Mumbai Showroom" />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Field label="Inspection Certificate" id="inspCert">
              <TextInput id="inspCert" value={car.inspectionCertificate} onChange={set('inspectionCertificate')} placeholder="AP-251-SUPERCAR-001" />
            </Field>
            <Field label="Inspection Score" id="inspScore">
              <TextInput id="inspScore" value={car.inspectionScore} onChange={set('inspectionScore')} placeholder="251 / 251 Points Certified" />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Field label="Registration Type" id="registrationType">
              <SelectInput id="registrationType" value={car.registrationType} onChange={set('registrationType')} options={['Individual', 'Corporate']} />
            </Field>
            <Field label="Registration State" id="registrationState">
              <TextInput id="registrationState" value={car.registrationState} onChange={set('registrationState')} placeholder="e.g. Maharashtra (MH) or Delhi (DL)" />
            </Field>
          </div>
        </Section>

        {/* Aesthetics */}
        <Section title="Colours & Aesthetics">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Field label="Exterior Colour" id="color">
              <TextInput id="color" value={car.color} onChange={set('color')} placeholder="Guards Red / Carbon Exposed" />
            </Field>
            <Field label="Interior Colour" id="interiorColor">
              <TextInput id="interiorColor" value={car.interiorColor} onChange={set('interiorColor')} placeholder="Black Leather & Alcantara" />
            </Field>
          </div>
        </Section>

        {/* Description */}
        <Section title="Concierge Notes & Description">
          <Field label="Vehicle Description" id="description">
            <textarea
              id="description"
              value={car.description}
              onChange={e => set('description')(e.target.value)}
              placeholder="Provide a detailed description of the car's condition, optional equipment, and history..."
              rows={6}
              className="w-full px-5 py-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10
                text-white placeholder-zinc-600 text-sm font-medium
                focus:outline-none focus:border-white/40 focus:bg-white/10
                transition-all duration-300 resize-y min-h-[120px]"
            />
          </Field>
        </Section>

        {/* Media */}
        <Section title="Media — Direct Uploads">
          <Field label="Gallery Images" id="images">
            <p className="text-[10px] tracking-widest uppercase text-zinc-500 mb-4">
              Drag and drop high-resolution images. These will be securely uploaded directly to ImageKit.
            </p>
            <ImageUploader
              label="Gallery Images"
              value={car.images}
              onChange={set('images')}
              previewOpts={{ width: 320, height: 200, quality: 75 }}
              maxFiles={20}
            />
          </Field>
        </Section>

        {/* Features */}
        <Section title="Key Features & Highlights">
          <TagListEditor value={car.features} onChange={set('features')} />
        </Section>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 pb-12">
          <Link
            to="/admin/inventory"
            className="px-6 py-3.5 rounded-full text-[11px] font-bold tracking-widest uppercase border border-white/10
              text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-300"
          >
            Cancel
          </Link>
          <button
            type="submit"
            id="save-car-btn"
            disabled={saving}
            className="flex items-center gap-3 px-8 py-3.5 rounded-full text-[11px] font-extrabold tracking-widest uppercase
              bg-white hover:bg-zinc-200 disabled:opacity-50
              text-black transition-all duration-300 shadow-2xl hover:scale-105"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Saving…' : isEdit ? 'Update Car' : 'Add to Inventory'}
          </button>
        </div>

      </form>
    </div>
  );
}
