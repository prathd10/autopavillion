-- ============================================================
--  AUTO PAVILION — Testimonials Public Insert Policy Setup
--  File: add_public_testimonial_policy.sql
--
--  Run this in:
--  Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================

-- Ensure the public can insert testimonials without authentication
create policy "Anyone can insert testimonials"
  on public.testimonials
  for insert
  with check (true);
