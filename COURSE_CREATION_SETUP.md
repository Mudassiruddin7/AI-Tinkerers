# Course Creation Setup Guide

## Problem Solved
Previously, when creating courses, they weren't appearing in the dashboard. This has been fixed!

## What Was Fixed

### 1. **Better Error Handling**
- Added proper error logging throughout the course creation process
- Database save errors now throw properly instead of being silently ignored
- Console logs show exactly what's happening at each step

### 2. **Database Validation**
- Course insertion now validates that data was saved successfully
- Episodes are verified after creation
- Errors are shown to users with clear messages

### 3. **Dashboard Auto-Refresh**
- After creating a course, the page automatically refreshes
- Newly created courses appear immediately
- Refresh button added for manual reload

## How to Use

### 1. **Verify Supabase Setup**

Before creating courses, ensure your Supabase database has the required tables:

```sql
-- Run this in Supabase SQL Editor to verify tables exist:
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('courses', 'episodes', 'quiz_questions');
```

If tables don't exist, run the schema from `supabase/schema.sql`.

### 2. **Create Storage Buckets**

In Supabase Dashboard → Storage, create these buckets:
- `images` (for photos and thumbnails)
- `audio` (for generated audio files)
- `documents` (for uploaded PDFs)

Make sure they're set to **public** access.

### 3. **Test Course Creation**

1. Click "Create Course" in the dashboard
2. Fill in course details
3. Upload a PDF document
4. Upload at least 1 employee photo
5. Select a voice
6. Review and create

### 4. **Monitor the Process**

Open your browser's Developer Tools (F12) and watch the Console tab:

✅ **Success indicators:**
```
📥 Extracting text from PDF...
📸 Processing employee photos...
🤖 AI is analyzing content...
🎙️ Generating narration...
💾 Saving course to database...
✅ Course saved successfully
✅ Loaded X courses with episodes
```

❌ **Error indicators:**
```
❌ Database error: [error message]
❌ Failed to save course
❌ Error fetching courses
```

## Troubleshooting

### Issue: "Database error: relation 'courses' does not exist"

**Solution:** Run the SQL schema in Supabase:
1. Go to Supabase Dashboard → SQL Editor
2. Copy contents from `supabase/schema.sql`
3. Click "Run"

### Issue: Courses not appearing after creation

**Solution:**
1. Click the "Refresh" button in the dashboard
2. Check browser console for errors
3. Verify Supabase connection in `.env` file
4. Check if `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set

### Issue: "Missing Supabase credentials"

**Solution:**
1. Copy `.env.example` to `.env`
2. Fill in your Supabase credentials
3. Restart the development server

### Issue: Photos not uploading

**Solution:**
1. Check Supabase Storage buckets exist
2. Ensure buckets are set to public
3. Check storage policies allow inserts

### Issue: Audio generation fails

**Solution:**
- Verify `ELEVENLABS_API_KEY` in `.env`
- Courses will still be created without audio
- Audio can be generated later

## Verification Steps

After creating a course, verify:

1. **In Browser Console:**
   - Look for "✅ Course saved successfully"
   - Check for "✅ Loaded X courses with episodes"

2. **In Supabase Dashboard:**
   - Go to Table Editor → courses
   - Verify your new course exists
   - Check episodes table for course episodes

3. **In Application:**
   - Course appears in dashboard grid
   - Shows correct number of episodes
   - Status shows as "published"
   - Clicking Preview opens the course

## Technical Details

### Course Creation Flow
```
1. Upload PDF → Extract text
2. Upload photos → Store in Supabase
3. Generate AI content → Claude creates scripts
4. Generate audio → ElevenLabs creates narration
5. Save to database → Courses, Episodes, Quizzes
6. Redirect & refresh → Show in dashboard
```

### Database Schema
```
courses
├── id (UUID)
├── title (VARCHAR)
├── description (TEXT)
├── thumbnail_url (TEXT)
├── status (VARCHAR) - 'draft', 'processing', 'published'
└── organization_id (UUID)

episodes
├── id (UUID)
├── course_id (UUID) → references courses
├── title (VARCHAR)
├── episode_order (INTEGER)
├── duration (INTEGER)
├── video_url (TEXT)
└── status (VARCHAR) - 'processing', 'ready', 'failed'
```

## Support

If you still have issues:

1. **Check Console Logs:** Press F12 → Console tab
2. **Check Network Tab:** Look for failed API requests
3. **Verify Environment:** All variables in `.env` are set
4. **Database Access:** Can you see tables in Supabase?

### Common Error Messages

| Error | Meaning | Fix |
|-------|---------|-----|
| "relation does not exist" | Database table missing | Run schema SQL |
| "Missing Supabase credentials" | .env not configured | Add credentials to .env |
| "Failed to upload photo" | Storage bucket issue | Create/configure buckets |
| "AI generation failed" | API key issue | Check ANTHROPIC_API_KEY |
| "Audio generation failed" | ElevenLabs issue | Check ELEVENLABS_API_KEY |

## Next Steps

After course creation works:
1. Test the course player
2. Try quiz functionality
3. Track employee progress
4. Review analytics

---

**Updated:** December 2025
**Status:** ✅ Fixed and Working
