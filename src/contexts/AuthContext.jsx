import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

/**
 * Checks if a given Supabase user has verified administrative privileges.
 * Multi-layer check: app_metadata, admin_users table, or administrative email domain.
 */
async function checkAdminStatus(currentUser) {
  if (!currentUser) return false;

  // 1. Check custom Supabase auth metadata role
  if (currentUser.app_metadata?.role === 'admin' || currentUser.user_metadata?.role === 'admin') {
    return true;
  }

  // 2. Check admin_users database table
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', currentUser.id)
      .maybeSingle();
    if (!error && data) return true;
  } catch {
    // Silently continue to fallback
  }

  // 3. Fallback verification for designated Auto Pavilion dealership management emails
  const email = (currentUser.email || '').toLowerCase().trim();
  const allowedAdmins = [
    'work.autopavillion@gmail.com',
    'admin@autopavilion.com',
    'admin@autopavilion.in',
    'info@autopavilion.in',
    'management@autopavilion.in'
  ];
  if (
    allowedAdmins.includes(email) || 
    email.endsWith('@autopavilion.in') ||
    email.endsWith('@autopavillion.in') ||
    email.includes('autopavillion') ||
    email.includes('autopavilion')
  ) {
    return true;
  }

  return false;
}

/**
 * Provides Supabase auth state (user, isAdmin, loading) and actions (signIn, signOut)
 * to all children. Wrap the app root with this provider.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hydrate session from storage on mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      const admin = await checkAdminStatus(currentUser);
      setIsAdmin(admin);
      setLoading(false);
    });

    // Keep state in sync with Supabase auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        const admin = await checkAdminStatus(currentUser);
        setIsAdmin(admin);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password });

  const signOut = () => supabase.auth.signOut();

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Consume auth context — must be called inside <AuthProvider> */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
