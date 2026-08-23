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

  -- Condition & Ownership
  mileage_kms           text,
  owners                int         default 1,
  location              text,
  verified              boolean     default true,
  inspection_certificate text,
  inspection_score      text,
  transmission          text,
  registration_type     text        default 'Individual',
  registration_state    text,

  -- Aesthetics
  color                 text,
  interior_color        text,

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


-- ── 7. VIEWERS COUNTER & SETTINGS ──────────────────────────
create table if not exists public.site_settings (
  key         text        primary key,
  value       jsonb       not null,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

alter table public.site_settings enable row level security;

create policy "Anyone can read site settings"
  on public.site_settings
  for select
  using (true);

create policy "Authenticated admin has full access to settings"
  on public.site_settings
  for all
  using      (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

insert into public.site_settings (key, value)
values (
  'visitor_counter_baseline',
  '{"total": 190783, "today": 38, "yesterday": 29}'::jsonb
)
on conflict (key) do nothing;

create or replace function public.get_footer_analytics()
returns json
language plpgsql
security definer
as $$
declare
  total_count int;
  today_count int;
  yesterday_count int;
  baseline jsonb;
  base_total int := 190783;
  base_today int := 38;
  base_yesterday int := 29;
  result json;
begin
  select value into baseline
  from public.site_settings
  where key = 'visitor_counter_baseline';

  if baseline is not null then
    base_total := coalesce((baseline->>'total')::int, 190783);
    base_today := coalesce((baseline->>'today')::int, 38);
    base_yesterday := coalesce((baseline->>'yesterday')::int, 29);
  end if;

  select count(distinct session_id) into total_count
  from public.page_views;

  select count(distinct session_id) into today_count
  from public.page_views
  where created_at >= timezone('utc', now())::date;

  select count(distinct session_id) into yesterday_count
  from public.page_views
  where created_at >= timezone('utc', now())::date - interval '1 day'
    and created_at < timezone('utc', now())::date;

  result := json_build_object(
    'total', (base_total + coalesce(total_count, 0)),
    'today', (base_today + coalesce(today_count, 0)),
    'yesterday', (base_yesterday + coalesce(yesterday_count, 0))
  );

  return result;
end;
$$;

grant execute on function public.get_footer_analytics() to anon, authenticated;


-- ── DONE ─────────────────────────────────────────────────────
-- Next step: run the seeding script (phase 2) to import
-- existing cars and upload their images to ImageKit.
