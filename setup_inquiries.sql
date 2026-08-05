-- ============================================================
--  AUTO PAVILION — Supabase Database Setup
--  File: setup_inquiries.sql
--
--  Run this in:
--  Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================

-- 1. Create the inquiries table
CREATE TABLE IF NOT EXISTS public.inquiries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  type text NOT NULL, -- 'viewing', 'trade_in', 'car_inquiry', 'sourcing'
  name text NOT NULL,
  phone text NOT NULL,
  status text DEFAULT 'new' NOT NULL, -- 'new', 'contacted', 'resolved'
  details jsonb DEFAULT '{}'::jsonb NOT NULL
);

-- 2. Set up Row Level Security (RLS)
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public form submissions)
CREATE POLICY "Public Insert Inquiries"
  ON public.inquiries
  FOR INSERT
  WITH CHECK (true);

-- Allow only authenticated users (admins) to select, update, and delete
CREATE POLICY "Admin Select Inquiries"
  ON public.inquiries
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin Update Inquiries"
  ON public.inquiries
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin Delete Inquiries"
  ON public.inquiries
  FOR DELETE
  USING (auth.role() = 'authenticated');
