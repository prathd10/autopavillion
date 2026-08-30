-- ============================================================
--  AUTO PAVILION — Add Photo Column to Testimonials Table
--  Run this in:
--  Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================

-- Add optional 'photo' text column to testimonials table
alter table public.testimonials
add column if not exists photo text;
