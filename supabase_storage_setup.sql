-- ============================================================
--  AUTO PAVILLION — Supabase Storage Setup
--  File: supabase_storage_setup.sql
--
--  Run this in:
--  Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================

-- 1. Create a public bucket for car images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('cars', 'cars', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Configure RLS Policies for the 'cars' bucket
-- Allow public read access to the images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'cars');

-- Allow authenticated admins to upload images
CREATE POLICY "Auth Upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'cars' AND auth.role() = 'authenticated');

-- Allow authenticated admins to update/delete images
CREATE POLICY "Auth Update/Delete"
ON storage.objects FOR ALL
USING (bucket_id = 'cars' AND auth.role() = 'authenticated');
