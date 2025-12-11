# 🚨 QUICK FIX: Row Level Security Error

## The Problem

You're seeing this error:
```
Error: Database error: new row violates row-level security policy for table "courses"
```

This means Supabase's Row Level Security (RLS) is blocking your course creation.

## ✅ SOLUTION (Takes 2 minutes)

### Step 1: Open Supabase SQL Editor

1. Go to https://supabase.com/dashboard
2. Select your project: **obdtffxugpzlxkkuurbw**
3. Click **SQL Editor** in the left sidebar
4. Click **"New query"**

### Step 2: Run This SQL

**Copy and paste this into the SQL editor:**

```sql
-- Quick Fix: Disable RLS for development
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE episodes DISABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE scenes DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress DISABLE ROW LEVEL SECURITY;
```

Click **RUN** (or press Ctrl+Enter)

### Step 3: Test Course Creation

1. Go back to http://localhost:3000/admin
2. Click "Create Course"
3. Fill in the details and create
4. Course should now save successfully! ✅

---

## Alternative: Keep RLS Enabled with Permissive Policies

If you want to keep RLS enabled but allow all operations for development:

```sql
-- Drop old restrictive policies
DROP POLICY IF EXISTS "Users can view org courses" ON courses;
DROP POLICY IF EXISTS "Users can view ready episodes" ON episodes;

-- Create permissive policies
CREATE POLICY "Allow all course operations" ON courses
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all episode operations" ON episodes
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all quiz operations" ON quiz_questions
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all scene operations" ON scenes
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all progress operations" ON user_progress
FOR ALL USING (true) WITH CHECK (true);
```

---

## Complete Fix File

All SQL commands are in: [`supabase/fix-rls-policies.sql`](supabase/fix-rls-policies.sql)

---

## Why This Happened

Supabase enables Row Level Security by default. The original schema had basic policies that were too restrictive for unauthenticated operations. For development, it's easiest to either:
- Disable RLS completely, OR
- Use permissive policies that allow all operations

For production, you'd create proper policies based on user authentication.

---

## Verify It's Fixed

After running the SQL, try creating a course again. You should see:
```
✅ Course saved successfully
✅ Loaded X courses with episodes
```

---

**Status:** Ready to fix in 2 minutes
**Action Required:** Run SQL in Supabase Dashboard
