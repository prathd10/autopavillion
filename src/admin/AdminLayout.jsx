import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard, Car, LogOut, ExternalLink,
  ChevronLeft, ChevronRight, Menu, X, Plus, MessageSquare, Inbox
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/admin/dashboard',       label: 'Dashboard',    Icon: LayoutDashboard },
  { to: '/admin/inquiries',       label: 'Inquiries',    Icon: Inbox },
  { to: '/admin/inventory',       label: 'Inventory',    Icon: Car },
  { to: '/admin/inventory/new',   label: 'Add Car',      Icon: Plus },
  { to: '/admin/testimonials',    label: 'Testimonials', Icon: MessageSquare },
];

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    navigate('/admin/login');
  }

  const Sidebar = ({ isMobile = false }) => (
    <aside
      className={`
        flex flex-col h-full bg-black/90 backdrop-blur-xl border-r border-white/10
        transition-all duration-300 font-mulish
        ${isMobile ? 'w-64' : collapsed ? 'w-[68px]' : 'w-60'}
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center flex-shrink-0">
          <span className="font-black text-xs tracking-tighter">AP</span>
        </div>
        {(!collapsed || isMobile) && (
          <div className="min-w-0">
            <p className="text-white text-sm font-extrabold tracking-wide uppercase truncate">Auto Pavilion</p>
            <p className="text-zinc-500 text-[10px] tracking-[0.2em] uppercase">Console</p>
          </div>
        )}
        {!isMobile && (
          <button
            onClick={() => setCollapsed(c => !c)}
            className="ml-auto text-zinc-500 hover:text-white transition-colors flex-shrink-0"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {(!collapsed || isMobile) && (
          <p className="px-2 pb-2 text-[10px] tracking-[0.2em] text-zinc-600 uppercase font-bold">
            Navigation
          </p>
        )}
        {NAV_ITEMS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => isMobile && setMobileOpen(false)}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest
              transition-all duration-300 group
              ${isActive
                ? 'bg-white text-black shadow-xl scale-[1.02]'
                : 'text-zinc-400 hover:text-white hover:bg-white/10 border border-transparent'
              }
            `}
          >
            <Icon size={16} className="flex-shrink-0" />
            {(!collapsed || isMobile) && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer — view site + user + sign out */}
      <div className="px-2 py-3 border-t border-white/10 flex flex-col gap-2">
        {/* View site link */}
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest
            text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-300 group"
        >
          <ExternalLink size={16} className="flex-shrink-0 group-hover:text-white" />
          {(!collapsed || isMobile) && <span className="group-hover:text-white">View Site</span>}
        </Link>

        {(!collapsed || isMobile) && (
          <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/5">
            <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Signed in as</p>
            <p className="text-xs text-zinc-300 truncate mt-0.5">{user?.email}</p>
          </div>
        )}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest
            text-zinc-400 hover:text-white hover:bg-red-500/20 hover:text-red-400 transition-all duration-300 group"
        >
          <LogOut size={16} className="flex-shrink-0 group-hover:text-red-400" />
          {(!collapsed || isMobile) && <span className="group-hover:text-red-400">Sign Out</span>}
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-black text-white font-mulish overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full relative z-20">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 h-full">
            <Sidebar isMobile />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Subtle Background gradient matching storefront */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-black via-zinc-900/20 to-black" />
        
        {/* Mobile Header */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-black/90 backdrop-blur-xl relative z-20">
          <button onClick={() => setMobileOpen(true)} className="text-zinc-400 hover:text-white">
            <Menu size={20} />
          </button>
          <span className="text-white font-extrabold text-sm tracking-widest uppercase">AUTO PAVILION</span>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

