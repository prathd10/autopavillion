-- ============================================================
--  AUTO PAVILION — Testimonials Setup
--  File: supabase_testimonials.sql
--
--  Run this once in:
--  Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================

-- ── 1. TESTIMONIALS TABLE ───────────────────────────────────

create table if not exists public.testimonials (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  role        text        not null,
  comment     text        not null,
  car         text        not null,
  status      text        default 'active', -- active | draft
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ── 2. ROW LEVEL SECURITY ───────────────────────────────────

alter table public.testimonials enable row level security;

-- Public storefront: anyone can read active testimonials (no auth required)
create policy "Public can read active testimonials"
  on public.testimonials
  for select
  using (status = 'active');

-- Admin: authenticated users have full access (select, insert, update, delete)
create policy "Authenticated admin has full access to testimonials"
  on public.testimonials
  for all
  using      (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ── 3. AUTO-UPDATE updated_at TRIGGER ───────────────────────
-- Assumes public.set_updated_at() already exists from cars table setup

create trigger testimonials_set_updated_at
  before update on public.testimonials
  for each row execute procedure public.set_updated_at();
