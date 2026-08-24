-- ============================================================
--  AUTO PAVILION — Viewers Counter Setup (with Database Baselines)
--  File: viewers_counter_setup.sql
--
--  Run this in:
--  Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================

-- 1. Create site_settings table if it doesn't exist
create table if not exists public.site_settings (
  key         text        primary key,
  value       jsonb       not null,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Enable RLS on site_settings
alter table public.site_settings enable row level security;

-- Admin can manage settings, public can read
create policy "Anyone can read site settings"
  on public.site_settings
  for select
  using (true);

create policy "Authenticated admin has full access to settings"
  on public.site_settings
  for all
  using      (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- 2. Seed baseline counter configuration
insert into public.site_settings (key, value)
values (
  'visitor_counter_baseline',
  '{"total": 190783, "today": 38, "yesterday": 29}'::jsonb
)
on conflict (key) do nothing;

-- 3. Create security definer function to return session analytics
create or replace function public.get_footer_analytics()
returns json
language plpgsql
security definer -- runs with owner privileges to bypass read RLS restrictions
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
  -- Fetch baseline configuration from site_settings table
  select value into baseline
  from public.site_settings
  where key = 'visitor_counter_baseline';

  if baseline is not null then
    base_total := coalesce((baseline->>'total')::int, 190783);
    base_today := coalesce((baseline->>'today')::int, 38);
    base_yesterday := coalesce((baseline->>'yesterday')::int, 29);
  end if;

  -- Count total unique sessions
  select count(distinct session_id) into total_count
  from public.page_views;

  -- Count unique sessions today (UTC date)
  select count(distinct session_id) into today_count
  from public.page_views
  where created_at >= timezone('utc', now())::date;

  -- Count unique sessions yesterday
  select count(distinct session_id) into yesterday_count
  from public.page_views
  where created_at >= timezone('utc', now())::date - interval '1 day'
    and created_at < timezone('utc', now())::date;

  -- Return dynamic values (baseline + current analytics)
  result := json_build_object(
    'total', (base_total + coalesce(total_count, 0)),
    'today', (base_today + coalesce(today_count, 0)),
    'yesterday', (base_yesterday + coalesce(yesterday_count, 0))
  );

  return result;
end;
$$;

-- Allow anonymous and authenticated users to call this function
grant execute on function public.get_footer_analytics() to anon, authenticated;
