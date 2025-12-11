-- STORAGE BUCKET SETUP for Audio/Video Files
-- Run this in Supabase SQL Editor AFTER setting up tables

-- Step 1: Create storage buckets (if they don't exist)
-- Note: Buckets need to be created in Supabase Dashboard -> Storage
-- This SQL creates the policies for the buckets

-- First, go to Supabase Dashboard -> Storage and create these buckets:
-- 1. "audio" - for audio files
-- 2. "images" - for photos and thumbnails
-- 3. "documents" - for PDFs

-- Step 2: Make buckets PUBLIC (run in SQL Editor)

-- For 'audio' bucket - allow public read access
INSERT INTO storage.buckets (id, name, public)
VALUES ('audio', 'audio', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- For 'images' bucket - allow public read access
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- For 'documents' bucket - allow public read access
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- For 'videos' bucket - allow public read access
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Step 3: Create storage policies

-- Audio bucket policies
DROP POLICY IF EXISTS "Allow public read for audio" ON storage.objects;
CREATE POLICY "Allow public read for audio" ON storage.objects
FOR SELECT USING (bucket_id = 'audio');

DROP POLICY IF EXISTS "Allow authenticated uploads to audio" ON storage.objects;
CREATE POLICY "Allow authenticated uploads to audio" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'audio');

DROP POLICY IF EXISTS "Allow all uploads to audio" ON storage.objects;
CREATE POLICY "Allow all uploads to audio" ON storage.objects
FOR ALL USING (bucket_id = 'audio') WITH CHECK (bucket_id = 'audio');

-- Images bucket policies
DROP POLICY IF EXISTS "Allow public read for images" ON storage.objects;
CREATE POLICY "Allow public read for images" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

DROP POLICY IF EXISTS "Allow all uploads to images" ON storage.objects;
CREATE POLICY "Allow all uploads to images" ON storage.objects
FOR ALL USING (bucket_id = 'images') WITH CHECK (bucket_id = 'images');

-- Documents bucket policies
DROP POLICY IF EXISTS "Allow public read for documents" ON storage.objects;
CREATE POLICY "Allow public read for documents" ON storage.objects
FOR SELECT USING (bucket_id = 'documents');

DROP POLICY IF EXISTS "Allow all uploads to documents" ON storage.objects;
CREATE POLICY "Allow all uploads to documents" ON storage.objects
FOR ALL USING (bucket_id = 'documents') WITH CHECK (bucket_id = 'documents');

-- Videos bucket policies
DROP POLICY IF EXISTS "Allow public read for videos" ON storage.objects;
CREATE POLICY "Allow public read for videos" ON storage.objects
FOR SELECT USING (bucket_id = 'videos');

DROP POLICY IF EXISTS "Allow all uploads to videos" ON storage.objects;
CREATE POLICY "Allow all uploads to videos" ON storage.objects
FOR ALL USING (bucket_id = 'videos') WITH CHECK (bucket_id = 'videos');

-- Verify buckets exist
SELECT * FROM storage.buckets;

-- Verify policies (use pg_policies instead)
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE schemaname = 'storage';
