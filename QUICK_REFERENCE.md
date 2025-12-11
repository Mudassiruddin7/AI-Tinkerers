# Quick Reference - Course Creation

## ✅ System Status

**Both servers running:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

**Course Creation:** WORKING ✅
**Database Saves:** WORKING ✅
**Audio Generation:** WORKING ✅

## 🎯 To Create a Course

1. Navigate to http://localhost:3000/admin
2. Click **"Create Course"** button
3. Follow the 5 steps:
   - **Details:** Enter title & description
   - **Content:** Upload PDF (required)
   - **Photos:** Upload 1-5 employee photos (required)
   - **Voice:** Select AI narration voice
   - **Review:** Check details and click "Create Course"

4. Wait for processing (1-3 minutes)
5. Page auto-refreshes and shows your new course

## 📊 To View Courses

1. Go to http://localhost:3000/admin (Dashboard)
2. Your courses appear in the grid
3. Click **"Refresh"** button to manually reload
4. Click **"Preview"** to watch a course
5. Click **"..."** menu for Edit/Delete options

## 🔍 To Verify Course Saved

### In Browser Console (F12):
```
✅ Course saved successfully
✅ Loaded X courses with episodes
```

### In Supabase Dashboard:
1. Go to https://supabase.com/dashboard
2. Open project: obdtffxugpzlxkkuurbw
3. Table Editor → courses
4. See your courses listed

## 🐛 Troubleshooting

### Course not appearing?
1. Click **Refresh** button in dashboard
2. Check browser console (F12) for errors
3. Verify in Supabase Table Editor

### "Database error" message?
1. Check if Supabase tables exist
2. Run `supabase/schema.sql` in SQL Editor
3. Verify `.env` has correct credentials

### Audio generation failed?
- Courses still work without audio
- Check ELEVENLABS_API_KEY in `.env`
- Audio is optional

### AI content issues?
- System uses fallback content (works fine)
- Add Anthropic API credits for custom content
- Not required for basic functionality

## 📝 Console Log Guide

### Normal Flow:
```
📥 Fetching courses from database...
✅ Found X courses
✅ Loaded X courses with episodes
```

### During Creation:
```
Extracted text length: XXXX
Uploaded photos: X
AI generated segments: X
✅ Course saved successfully
```

### Errors to Watch For:
```
❌ Error fetching courses: [message]
❌ Failed to save course: [message]
❌ Database error: [message]
```

## 🎓 What Happens Behind the Scenes

```mermaid
PDF Upload → Text Extraction → AI Script Generation → Audio Creation → Database Save → Dashboard Display
```

1. **Extract:** PDF text extracted via backend API
2. **Process:** Photos uploaded to Supabase storage
3. **Generate:** AI creates course scripts (or uses templates)
4. **Synthesize:** ElevenLabs creates voice narration
5. **Save:** Course, episodes, and quizzes saved to database
6. **Display:** Dashboard fetches and shows all courses

## 🔑 Key Files

- **Course Creation:** `src/pages/admin/CreateCourse.tsx`
- **Dashboard:** `src/pages/admin/AdminDashboard.tsx`
- **Generation Logic:** `src/lib/courseGenerator.ts`
- **Database:** `supabase/schema.sql`
- **Environment:** `.env`

## 📞 Need Help?

1. Read [COURSE_CREATION_SETUP.md](COURSE_CREATION_SETUP.md) for details
2. Check [FIXES_APPLIED.md](FIXES_APPLIED.md) for what was fixed
3. Look at console logs in browser (F12)
4. Verify Supabase dashboard

---

**Last Updated:** December 11, 2025
**Status:** All systems operational ✅
