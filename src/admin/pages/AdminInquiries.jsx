import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Inbox, Filter, CheckCircle, Clock, Check, X, Search, Phone } from 'lucide-react';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, new, contacted, resolved

  useEffect(() => {
    fetchInquiries();
  }, []);

  async function fetchInquiries() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      alert('Error fetching inquiries');
    } finally {
      setLoading(false);
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      setInquiries(inquiries.map(inc => inc.id === id ? { ...inc, status: newStatus } : inc));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status.');
    }
  };

  const filteredInquiries = inquiries.filter(inc => {
    if (filter === 'all') return true;
    return inc.status === filter;
  });

  const getTypeLabel = (type) => {
    switch(type) {
      case 'viewing': return 'Showroom Viewing';
      case 'trade_in': return 'Sell / Trade-In';
      case 'car_inquiry': return 'Car Inquiry';
      case 'sourcing': return 'Vehicle Sourcing';
      case 'chatbot': return 'Chatbot Lead';
      default: return type;
    }
  };

  const renderDetails = (inc) => {
    const { details } = inc;
    if (!details) return null;

    if (inc.type === 'chatbot') {
      return (
        <div className="text-xs space-y-1">
          <p><span className="text-zinc-500">Bot Intent:</span> <span className="uppercase font-bold text-white text-[10px] tracking-wide">{details.intent || 'Callback'}</span></p>
          {details.vehicleName && <p><span className="text-zinc-500">Car Reference:</span> <span className="text-zinc-300 font-semibold">{details.vehicleName}</span></p>}
          <p><span className="text-zinc-500">Contact Preference:</span> <span className="text-zinc-300 font-semibold">{details.whatsapp ? 'WhatsApp' : 'Direct Call'}</span></p>
          {details.message && <p><span className="text-zinc-500">Bot Notes:</span> <span className="text-zinc-400 font-mulish">{details.message}</span></p>}
        </div>
      );
    }
    if (inc.type === 'viewing') {
      return (
        <div className="text-xs space-y-1">
          <p><span className="text-zinc-500">Date:</span> {details.date} {details.time}</p>
          <p><span className="text-zinc-500">Car of Interest:</span> {details.carOfInterest || 'Any'}</p>
        </div>
      );
    }
    if (inc.type === 'trade_in') {
      const brand = details.brand === 'Other' ? details.customBrand : details.brand;
      return (
        <div className="text-xs space-y-1">
          <p><span className="text-zinc-500">Vehicle:</span> {details.year} {brand} {details.model}</p>
          <p><span className="text-zinc-500">Mileage:</span> {details.mileage} km</p>
        </div>
      );
    }
    if (inc.type === 'car_inquiry') {
      return (
        <div className="text-xs space-y-1">
          <p><span className="text-zinc-500">Car:</span> {details.carName}</p>
          <p><span className="text-zinc-500">Price:</span> {details.carPrice}</p>
          <p><span className="text-zinc-500">City:</span> {details.city}</p>
        </div>
      );
    }
    if (inc.type === 'sourcing') {
      return (
        <div className="text-xs space-y-1">
          <p><span className="text-zinc-500">Target:</span> {details.makeModel}</p>
          <p><span className="text-zinc-500">Budget:</span> {details.budget || 'Not specified'}</p>
          {details.notes && <p><span className="text-zinc-500">Notes:</span> {details.notes}</p>}
        </div>
      );
    }
    return <p className="text-xs text-zinc-500">Custom data attached.</p>;
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-widest font-heading">
            Leads & Inquiries
          </h1>
          <p className="text-sm text-zinc-400 mt-1">Manage all form submissions from the storefront.</p>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2 bg-zinc-900 p-1 rounded-lg">
          {['all', 'new', 'contacted', 'resolved'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                filter === f 
                  ? 'bg-white text-black' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table & Cards */}
      <div className="bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="bg-black/50 text-xs uppercase tracking-wider text-zinc-500 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-bold">Client / Date</th>
                <th className="px-6 py-4 font-bold">Type</th>
                <th className="px-6 py-4 font-bold">Details</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-zinc-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span className="text-xs uppercase tracking-widest font-bold">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-zinc-500 text-xs font-bold uppercase tracking-widest">
                    No inquiries found.
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inc) => (
                  <tr key={inc.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-white">{inc.name}</div>
                      <div className="text-xs text-zinc-500 mt-0.5">
                        {new Date(inc.created_at).toLocaleDateString()} {new Date(inc.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-zinc-400 mt-1">
                        <Phone className="w-3 h-3" />
                        <a href={`tel:${inc.phone}`} className="hover:text-white transition-colors">{inc.phone}</a>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300">
                        {getTypeLabel(inc.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {renderDetails(inc)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        inc.status === 'new' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        inc.status === 'contacted' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-green-500/10 text-green-400 border border-green-500/20'
                      }`}>
                        {inc.status === 'new' && <Inbox className="w-3 h-3 mr-1" />}
                        {inc.status === 'contacted' && <Clock className="w-3 h-3 mr-1" />}
                        {inc.status === 'resolved' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {inc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                      {inc.status === 'new' && (
                        <button
                          onClick={() => handleStatusChange(inc.id, 'contacted')}
                          className="px-3 py-1.5 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 rounded text-[10px] font-bold uppercase tracking-wider transition-colors"
                        >
                          Mark Contacted
                        </button>
                      )}
                      {inc.status !== 'resolved' && (
                        <button
                          onClick={() => handleStatusChange(inc.id, 'resolved')}
                          className="px-3 py-1.5 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded text-[10px] font-bold uppercase tracking-wider transition-colors"
                        >
                          Resolve
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="lg:hidden divide-y divide-white/5">
          {loading ? (
             <div className="p-10 flex justify-center text-zinc-500">
               <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
             </div>
          ) : filteredInquiries.length === 0 ? (
             <div className="p-10 text-center text-zinc-500 text-xs font-bold uppercase tracking-widest">
               No inquiries found.
             </div>
          ) : (
            filteredInquiries.map((inc) => (
              <div key={inc.id} className="p-5 flex flex-col gap-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <div className="font-bold text-white text-sm">{inc.name}</div>
                    <div className="flex items-center space-x-1 text-[11px] text-zinc-400 mt-1 mb-2">
                      <Phone className="w-3 h-3" />
                      <a href={`tel:${inc.phone}`} className="hover:text-white transition-colors">{inc.phone}</a>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300">
                      {getTypeLabel(inc.type)}
                    </span>
                  </div>
                  <span className={`shrink-0 inline-flex items-center px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider ${
                    inc.status === 'new' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                    inc.status === 'contacted' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-green-500/10 text-green-400 border border-green-500/20'
                  }`}>
                    {inc.status}
                  </span>
                </div>
                
                <div className="bg-black/30 p-3 rounded-lg border border-white/5">
                  {renderDetails(inc)}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-1">
                  <div className="text-[10px] text-zinc-500">
                    {new Date(inc.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    {inc.status === 'new' && (
                      <button
                        onClick={() => handleStatusChange(inc.id, 'contacted')}
                        className="px-3 py-1.5 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 rounded-full text-[9px] font-bold uppercase tracking-wider transition-colors"
                      >
                        Contacted
                      </button>
                    )}
                    {inc.status !== 'resolved' && (
                      <button
                        onClick={() => handleStatusChange(inc.id, 'resolved')}
                        className="px-3 py-1.5 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-full text-[9px] font-bold uppercase tracking-wider transition-colors"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
