import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShieldAlert, LogOut } from 'lucide-react';

/**
 * Wraps admin routes. 
 * Requires BOTH an active authenticated session AND verified administrator privileges.
 */
export default function ProtectedRoute({ children }) {
  const { user, isAdmin, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08090c] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-zinc-500 text-xs tracking-widest uppercase">Verifying Credentials</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#08090c] text-white flex flex-col items-center justify-center p-6 text-center font-mulish">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
          <ShieldAlert className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="text-2xl font-black uppercase tracking-wider mb-2 font-heading">
          Restricted Access
        </h1>
        <p className="text-zinc-400 text-sm max-w-md mb-6 leading-relaxed">
          Your account (<span className="text-white font-mono">{user.email}</span>) does not have administrative clearance to access the Auto Pavilion Console.
        </p>
        <button
          onClick={() => signOut()}
          className="px-8 py-3.5 rounded-full bg-white text-black font-extrabold text-[11px] uppercase tracking-widest flex items-center space-x-2 hover:bg-zinc-200 transition-all shadow-xl"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    );
  }

  return children;
}
