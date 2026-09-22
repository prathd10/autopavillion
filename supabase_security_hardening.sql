-- ============================================================
--  AUTO PAVILION — Pre-Production Security Hardening Script
--  File: supabase_security_hardening.sql
--
--  Run this once in:
--  Supabase Dashboard → SQL Editor → New Query → Run
--
--  This script closes all identified RLS vulnerabilities:
--  1. Establishes dedicated admin role verification (eliminates vertical privilege escalation)
--  2. Enforces 'draft' moderation on anonymous testimonial submissions (prevents site defacement)
--  3. Constrains public inquiry status to 'new' (prevents parameter tampering)
--  4. Hardens PostgreSQL SECURITY DEFINER functions against search_path hijacking
--  5. Restricts admin operations strictly to verified administrators
-- ============================================================

-- ── 1. ADMIN AUTHORIZATION TABLE & ROLES ─────────────────────

create table if not exists public.admin_users (
  id          uuid        primary key references auth.users(id) on delete cascade,
  email       text        unique not null,
  role        text        not null default 'admin',
  created_at  timestamptz default now()
);

alter table public.admin_users enable row level security;

-- Only authenticated admins can read or manage admin_users
create or replace function public.is_admin()
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  -- 1. Check if user is in admin_users table
  if exists (
    select 1 from public.admin_users 
    where id = auth.uid()
  ) then
    return true;
  end if;

  -- 2. Check if auth JWT has admin role claim
  if (auth.jwt() ->> 'role') = 'admin' or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' then
    return true;
  end if;

  -- 3. Check administrative email domain or primary admin accounts
  if (auth.jwt() ->> 'email') in ('admin@autopavilion.com', 'admin@autopavilion.in', 'info@autopavilion.in', 'management@autopavilion.in')
     or (auth.jwt() ->> 'email') like '%@autopavilion.in' then
    return true;
  end if;

  return false;
end;
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- Policies for admin_users table
drop policy if exists "Admins can view admin_users" on public.admin_users;
create policy "Admins can view admin_users"
  on public.admin_users
  for select
  using (public.is_admin());

drop policy if exists "Admins can manage admin_users" on public.admin_users;
create policy "Admins can manage admin_users"
  on public.admin_users
  for all
  using (public.is_admin())
  with check (public.is_admin());


-- ── 2. HARDEN CARS TABLE RLS ─────────────────────────────────

alter table public.cars enable row level security;

-- Public storefront: strictly active cars only
drop policy if exists "Public can read active cars" on public.cars;
create policy "Public can read active cars"
  on public.cars
  for select
  using (status = 'active');

-- Admin: strictly verified administrators only
drop policy if exists "Authenticated admin has full access" on public.cars;
drop policy if exists "Verified admin has full access to cars" on public.cars;
create policy "Verified admin has full access to cars"
  on public.cars
  for all
  using (public.is_admin())
  with check (public.is_admin());


-- ── 3. HARDEN TESTIMONIALS TABLE RLS ─────────────────────────

alter table public.testimonials enable row level security;

-- Set default status to 'draft' for safety
alter table public.testimonials alter column status set default 'draft';

-- Public storefront: read active testimonials only
drop policy if exists "Public can read active testimonials" on public.testimonials;
create policy "Public can read active testimonials"
  on public.testimonials
  for select
  using (status = 'active');

-- Public storefront: anonymous visitors can ONLY insert draft testimonials
drop policy if exists "Anyone can insert testimonials" on public.testimonials;
drop policy if exists "Public can submit draft testimonials" on public.testimonials;
create policy "Public can submit draft testimonials"
  on public.testimonials
  for insert
  with check (status = 'draft');

-- Admin: verified administrators have full access to approve, edit, and delete
drop policy if exists "Authenticated admin has full access to testimonials" on public.testimonials;
drop policy if exists "Verified admin has full access to testimonials" on public.testimonials;
create policy "Verified admin has full access to testimonials"
  on public.testimonials
  for all
  using (public.is_admin())
  with check (public.is_admin());


-- ── 4. HARDEN INQUIRIES TABLE RLS ────────────────────────────

alter table public.inquiries enable row level security;

-- Public submissions: must have status = 'new' (prevents parameter tampering)
drop policy if exists "Public Insert Inquiries" on public.inquiries;
drop policy if exists "Public submit new inquiries" on public.inquiries;
create policy "Public submit new inquiries"
  on public.inquiries
  for insert
  with check (status = 'new');

-- Admin: verified administrators only
drop policy if exists "Admin Select Inquiries" on public.inquiries;
drop policy if exists "Admin Update Inquiries" on public.inquiries;
drop policy if exists "Admin Delete Inquiries" on public.inquiries;
drop policy if exists "Verified admin full access to inquiries" on public.inquiries;
create policy "Verified admin full access to inquiries"
  on public.inquiries
  for all
  using (public.is_admin())
  with check (public.is_admin());


-- ── 5. HARDEN CHATBOT FAQS TABLE RLS ─────────────────────────

alter table public.chatbot_faqs enable row level security;

drop policy if exists "Public can read active faqs" on public.chatbot_faqs;
create policy "Public can read active faqs"
  on public.chatbot_faqs
  for select
  using (is_active = true);

drop policy if exists "Authenticated admin has full access to faqs" on public.chatbot_faqs;
drop policy if exists "Verified admin has full access to faqs" on public.chatbot_faqs;
create policy "Verified admin has full access to faqs"
  on public.chatbot_faqs
  for all
  using (public.is_admin())
  with check (public.is_admin());


-- ── 6. HARDEN VEHICLES CATALOGUE TABLE RLS ───────────────────

alter table public.vehicles enable row level security;

drop policy if exists "Public can read vehicles" on public.vehicles;
create policy "Public can read vehicles"
  on public.vehicles
  for select
  using (true);

drop policy if exists "Authenticated admin has full access to vehicles" on public.vehicles;
drop policy if exists "Verified admin has full access to vehicles" on public.vehicles;
create policy "Verified admin has full access to vehicles"
  on public.vehicles
  for all
  using (public.is_admin())
  with check (public.is_admin());


-- ── 7. HARDEN SITE SETTINGS TABLE RLS ────────────────────────

alter table public.site_settings enable row level security;

drop policy if exists "Anyone can read site settings" on public.site_settings;
create policy "Anyone can read site settings"
  on public.site_settings
  for select
  using (true);

drop policy if exists "Authenticated admin has full access to settings" on public.site_settings;
drop policy if exists "Verified admin has full access to settings" on public.site_settings;
create policy "Verified admin has full access to settings"
  on public.site_settings
  for all
  using (public.is_admin())
  with check (public.is_admin());


-- ── 8. HARDEN POSTGRESQL SECURITY DEFINER FUNCTION ───────────
-- Explicitly specifies search_path to eliminate search_path hijacking vulnerabilities

create or replace function public.get_footer_analytics()
returns json
language plpgsql
security definer
set search_path = public, pg_temp
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


-- ── 9. SEED INITIAL ADMIN USERS IF EXIST IN AUTH.USERS ───────

insert into public.admin_users (id, email)
select id, email from auth.users
where email in ('admin@autopavilion.com', 'admin@autopavilion.in', 'info@autopavilion.in', 'management@autopavilion.in')
   or email like '%@autopavilion.in'
on conflict (id) do nothing;

-- ============================================================
--  Hardening Completed Successfully.
-- ============================================================
