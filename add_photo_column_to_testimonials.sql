-- ============================================================
--  AUTO PAVILION — Add Photo Column to Testimonials Table
--  Run this in:
--  Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================

-- Add optional 'photo' and 'company' text columns to testimonials table
alter table public.testimonials
add column if not exists photo text,
add column if not exists company text;
