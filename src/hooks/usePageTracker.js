import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

/** Returns (or creates) a stable session ID for this browser session. */
function getSessionId() {
  const KEY = 'ap_session_id';
  let id = sessionStorage.getItem(KEY);
  if (!id) {
    id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(KEY, id);
  }
  return id;
}

/**
 * Fires a single page_view insert into Supabase on mount.
 * Skips silently if Supabase is unavailable — analytics are non-critical.
 *
 * @param {string} [page='/'] The logical page path to track
 */
export function usePageTracker(page = '/') {
  useEffect(() => {
    const sessionId = getSessionId();
    supabase
      .from('page_views')
      .insert({
        session_id: sessionId,
        page,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
      })
      .then(({ error }) => {
        if (error) console.warn('[PageTracker] Insert failed:', error.message);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // fire once per mount — page prop is intentionally not a dep
}
