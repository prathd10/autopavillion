-- ============================================================
--  AUTO PAVILLION — Supabase Database Setup
--  File: supabase_setup.sql
--
--  Run this once in:
--  Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================


-- ── 1. CARS TABLE ───────────────────────────────────────────

create table if not exists public.cars (
  -- Identity
  id                    text        primary key,
  name                  text        not null,
  subtitle              text,
  brand                 text,
  brand_logo            text,
  year                  int,

  -- Pricing
  price                 text,
  price_raw             bigint      default 0,

  -- Classification
  body_type             text,
  fuel_type             text        default 'Petrol',
  status                text        default 'active',   -- active | sold | draft | archived

  -- Performance
  engine                text,
  horsepower            text,
  hp_raw                int         default 0,
  torque                text,
  zero_to_hundred       text,
  zero_to_hundred_raw   numeric     default 0,
  top_speed             text,
  transmission          text,

  -- Condition & Ownership
  mileage_kms           text,
  owners                int         default 1,
  location              text,
  verified              boolean     default true,
  inspection_certificate text,
  inspection_score      text,

  -- Aesthetics
  color                 text,
  interior_color        text,

  -- Sound signature (used by the engine-sound player on the storefront)
  sound_type            text,
  sound_freq            int,
  sound_name            text,

  -- Flags
  featured              boolean     default false,

  -- Media — ImageKit delivery URLs stored as arrays
  images                text[]      default '{}',       -- gallery images
  three_sixty_frames    text[]      default '{}',       -- 360° spin frames
  features              text[]      default '{}',       -- key feature bullet points

  -- Timestamps
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);


-- ── 2. ROW LEVEL SECURITY — CARS ────────────────────────────

alter table public.cars enable row level security;

-- Public storefront: anyone can read active cars (no auth required)
create policy "Public can read active cars"
  on public.cars
  for select
  using (status = 'active');

-- Admin: authenticated users have full access (select, insert, update, delete)
create policy "Authenticated admin has full access"
  on public.cars
  for all
  using      (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');


-- ── 3. AUTO-UPDATE updated_at TRIGGER ───────────────────────

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger cars_set_updated_at
  before update on public.cars
  for each row execute procedure public.set_updated_at();


-- ── 4. PAGE VIEWS TABLE (analytics) ─────────────────────────

create table if not exists public.page_views (
  id          uuid        primary key default gen_random_uuid(),
  session_id  text,                    -- stable per-browser-session ID (from sessionStorage)
  page        text        default '/',
  referrer    text,
  user_agent  text,
  created_at  timestamptz default now()
);


-- ── 5. ROW LEVEL SECURITY — PAGE VIEWS ──────────────────────

alter table public.page_views enable row level security;

-- Anyone (including anonymous visitors) can INSERT a view event
create policy "Anyone can insert page views"
  on public.page_views
  for insert
  with check (true);

-- Only authenticated admins can READ analytics
create policy "Authenticated admin can read page views"
  on public.page_views
  for select
  using (auth.role() = 'authenticated');


-- ── 6. USEFUL INDEXES ───────────────────────────────────────

-- Fast lookup by status on the storefront
create index if not exists cars_status_idx
  on public.cars (status);

-- Fast lookup by brand for filtering
create index if not exists cars_brand_idx
  on public.cars (brand);

-- Fast time-range queries for analytics sparkline
create index if not exists page_views_created_at_idx
  on public.page_views (created_at desc);

-- Fast session lookup for unique visitor counting
create index if not exists page_views_session_idx
  on public.page_views (session_id);


-- ── DONE ─────────────────────────────────────────────────────
-- Next step: run the seeding script (phase 2) to import
-- existing cars and upload their images to ImageKit.
