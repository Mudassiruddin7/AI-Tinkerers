-- FIX: Row Level Security Policies for Course Creation
-- Run this in Supabase SQL Editor to allow course creation

-- For DEVELOPMENT: Disable RLS temporarily to allow all operations
-- (Use this if you want to get started quickly)

-- Option 1: DISABLE RLS (Quick Fix for Development)
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE episodes DISABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE scenes DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE consent_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE uploaded_files DISABLE ROW LEVEL SECURITY;
ALTER TABLE employee_photos DISABLE ROW LEVEL SECURITY;
ALTER TABLE processing_jobs DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;

-- OR Option 2: ENABLE RLS with Permissive Policies (Better for Development)
-- Run this instead if you want to keep RLS but allow operations

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can view org courses" ON courses;
DROP POLICY IF EXISTS "Users can view ready episodes" ON episodes;
DROP POLICY IF EXISTS "Users can manage own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;

-- Create permissive policies for development
-- Courses: Allow all operations
CREATE POLICY "Allow all course operations" ON courses
FOR ALL
USING (true)
WITH CHECK (true);

-- Episodes: Allow all operations
CREATE POLICY "Allow all episode operations" ON episodes
FOR ALL
USING (true)
WITH CHECK (true);

-- Quiz Questions: Allow all operations
CREATE POLICY "Allow all quiz operations" ON quiz_questions
FOR ALL
USING (true)
WITH CHECK (true);

-- Scenes: Allow all operations
CREATE POLICY "Allow all scene operations" ON scenes
FOR ALL
USING (true)
WITH CHECK (true);

-- User Progress: Allow all operations
CREATE POLICY "Allow all progress operations" ON user_progress
FOR ALL
USING (true)
WITH CHECK (true);

-- Users: Allow all operations
CREATE POLICY "Allow all user operations" ON users
FOR ALL
USING (true)
WITH CHECK (true);

-- Consent Records: Allow all operations
CREATE POLICY "Allow all consent operations" ON consent_records
FOR ALL
USING (true)
WITH CHECK (true);

-- Uploaded Files: Allow all operations
CREATE POLICY "Allow all file operations" ON uploaded_files
FOR ALL
USING (true)
WITH CHECK (true);

-- Employee Photos: Allow all operations
CREATE POLICY "Allow all photo operations" ON employee_photos
FOR ALL
USING (true)
WITH CHECK (true);

-- Processing Jobs: Allow all operations
CREATE POLICY "Allow all job operations" ON processing_jobs
FOR ALL
USING (true)
WITH CHECK (true);

-- Notifications: Allow all operations
CREATE POLICY "Allow all notification operations" ON notifications
FOR ALL
USING (true)
WITH CHECK (true);

-- Organizations: Allow all operations
CREATE POLICY "Allow all organization operations" ON organizations
FOR ALL
USING (true)
WITH CHECK (true);

-- Verify policies are working
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;
