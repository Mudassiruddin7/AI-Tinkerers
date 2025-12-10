# AI Tutor - Corporate Training Platform

Converts PDFs → AI-generated training videos with voice + quizzes

## How It Works

```
PDF Upload → Claude extracts content → ElevenLabs generates voice 
→ n8n assembles video → Employee watches + takes quiz → Track progress
```

## Quick Setup

1. **Install**
```bash
npm install
```

2. **Configure `.env`** (copy from `.env.example`)
```env
# Required Services
VITE_SUPABASE_URL=               # Database
VITE_SUPABASE_ANON_KEY=
VITE_CLERK_PUBLISHABLE_KEY=      # Auth
VITE_ANTHROPIC_API_KEY=          # Claude AI
VITE_ELEVENLABS_API_KEY=         # Voice generation
VITE_STRIPE_PUBLISHABLE_KEY=     # Payments
VITE_N8N_WEBHOOK_URL=            # Video assembly
```

3. **Setup Database**
- Go to Supabase SQL Editor
- Run `supabase/schema.sql`

4. **Import n8n Workflow**
- Import `n8n-workflow.json` to your n8n instance
- Configure webhook URL in `.env`

## Check If It's Working

### ✅ Checklist

1. **Start servers**
```bash
npm run dev:all
```
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

2. **Health check**
```bash
curl http://localhost:3001/api/health
```
Should return `{"status":"ok"}`

3. **Sign up** at http://localhost:5173
- Create admin account
- Should redirect to dashboard

4. **Upload a PDF**
- Go to "Create Course"
- Upload any PDF
- Should process without errors

5. **Check database**
- Open Supabase → Table Editor
- Verify `courses` table has new entry

6. **Video generation**
- Check n8n workflow runs
- Verify video appears in course

## Architecture

### System Flow
```
┌─────────────┐
│   Admin     │ Upload PDF
└──────┬──────┘
       │
       v
┌─────────────────────────────────────────────┐
│          Express Backend (:3001)            │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  │
│  │ Extract  │→ │ Claude   │→ │ ElevenLabs│  │
│  │ PDF Text │  │ Script   │  │ Voice     │  │
│  └──────────┘  └──────────┘  └───────┬───┘  │
└──────────────────────────────────────┼──────┘
                                       │
                                       v
                              ┌──────────────────┐
                              │  n8n Workflow    │
                              │  FFmpeg Assembly │
                              └────────┬─────────┘
                                       │
                                       v
                              ┌──────────────────┐
                              │  Supabase Store  │
                              │  Video + Quizzes │
                              └────────┬─────────┘
                                       │
                                       v
                              ┌──────────────────┐
                              │   Employee       │
                              │   Watches +      │
                              │   Takes Quiz     │
                              └──────────────────┘
```

### Tech Stack
```
Frontend          Backend           Services
├─ React          ├─ Express        ├─ Supabase (DB)
├─ Vite           ├─ pdf-parse      ├─ Clerk (Auth)
├─ TailwindCSS    ├─ multer         ├─ Claude (AI)
├─ React Router   └─ axios          ├─ ElevenLabs (TTS)
└─ Zustand                          ├─ Stripe (Billing)
                                    └─ n8n (Automation)
```

### Data Flow
```
1. PDF Upload
   └─> /api/process/extract-text
       └─> Claude analyzes content
           └─> /api/process/generate-content
               └─> Returns: { script, quizzes, timestamps }

2. Audio Generation
   └─> /api/process/generate-audio
       └─> ElevenLabs converts script → MP3

3. Video Assembly (n8n)
   └─> /api/process/trigger-video-generation
       └─> n8n webhook receives: { audioUrl, imageUrl, script }
           └─> FFmpeg combines → MP4
               └─> Uploads to Supabase Storage

4. Employee View
   └─> Fetch video from Supabase
       └─> ReactPlayer renders video
           └─> Quiz pops at timestamps
               └─> Progress saved to DB
```

## Troubleshooting

| Issue | Check |
|-------|-------|
| Login fails | Clerk keys in `.env` |
| PDF upload errors | Backend running on :3001 |
| No video generated | n8n workflow active + webhook URL correct |
| No voice | ElevenLabs API key valid + credits available |
| Database errors | Schema applied + RLS policies set |
| Payment fails | Stripe keys + webhook endpoint configured |

## Key Files

- [server/index.ts](server/index.ts) - API endpoints
- [src/pages/admin/CreateCourse.tsx](src/pages/admin/CreateCourse.tsx) - Upload UI
- [src/pages/employee/VideoPlayer.tsx](src/pages/employee/VideoPlayer.tsx) - Video + quiz
- [supabase/schema.sql](supabase/schema.sql) - Database structure
- [n8n-workflow.json](n8n-workflow.json) - Video assembly automation

---

## 🧪 Testing Guide - Step by Step

### 1. Check All Services Status

Run the health check to see which services are configured:

```bash
curl http://localhost:3001/api/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "services": {
    "stripe": true,
    "supabase": true,
    "anthropic": true,
    "elevenlabs": true,
    "n8n": true
  }
}
```

✅ All should be `true`. If any is `false`, that service's API key is missing in `.env`

### 2. Test Supabase Database Connection

**Check via Supabase Dashboard:**
- Go to: https://supabase.com/dashboard/project/YOUR_PROJECT_ID
- Navigate to: Table Editor
- Verify these tables exist:
  - `organizations`
  - `courses`
  - `employees`
  - `progress`
  - `quiz_attempts`

**Test with code:**
```bash
# Open browser console at http://localhost:3000 and run:
```
```javascript
const { data, error } = await supabase.from('organizations').select('*').limit(1);
console.log(data ? '✅ Database connected' : '❌ Database error:', error);
```

### 3. Test Clerk Authentication

1. **Open frontend:** http://localhost:3000
2. **Click "Sign Up"**
3. **Expected behavior:**
   - Clerk signup form appears
   - Can create account with email
   - After signup, redirects to dashboard
   - User session persists on refresh

❌ **If sign-in fails:**
- Check `VITE_CLERK_PUBLISHABLE_KEY` in `.env`
- Verify domain is allowed in Clerk Dashboard → Settings

### 4. Test Claude AI Content Generation

**Method 1: Through UI**
1. Login as admin
2. Go to "Create Course"
3. Upload any PDF (even a simple one)
4. Watch console for API call to `/api/process/generate-content`

**Method 2: Direct API Test**
```powershell
# Test with sample text
$body = @{
  text = "Machine learning is a subset of artificial intelligence."
  courseTitle = "AI Basics"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/api/process/generate-content" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

**Expected Response:**
```json
{
  "segments": [
    {
      "text": "Welcome to AI Basics...",
      "duration": 15,
      "imagePrompt": "Modern AI concept"
    }
  ],
  "quizzes": [
    {
      "question": "What is machine learning?",
      "options": ["...", "...", "...", "..."],
      "correctAnswer": 0,
      "timestamp": 30
    }
  ]
}
```

### 5. Test ElevenLabs Voice Generation

**Check API Key:**
```powershell
# Test ElevenLabs connectivity
$headers = @{
  "xi-api-key" = "YOUR_KEY_FROM_.ENV"
}

Invoke-RestMethod -Uri "https://api.elevenlabs.io/v1/voices" `
  -Method Get `
  -Headers $headers
```

**Expected:** Returns list of available voices

**Through the app:**
1. After uploading PDF and generating content
2. Backend calls `/api/process/generate-audio`
3. Check browser Network tab for audio file download

### 6. Test Stripe Payment Integration

**Test Mode Verification:**
1. Go to admin dashboard
2. Click "Billing" or "Upgrade Plan"
3. Should see Stripe checkout form
4. Use test card: `4242 4242 4242 4242`
5. Exp: Any future date, CVC: Any 3 digits

**Webhook Test:**
```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe listen --forward-to http://localhost:3001/api/stripe/webhook
```

✅ **Success:** Should show "Ready! You are using Stripe API Version..."

### 7. Test n8n Video Assembly Workflow

**Check n8n Connection:**
```powershell
# Ping your n8n webhook
Invoke-RestMethod -Uri "https://mudassiruddin.app.n8n.cloud/webhook/process-pdf" `
  -Method Get
```

**Full Video Generation Test:**
1. Login → Create Course → Upload PDF
2. Wait for processing (check browser console)
3. Go to n8n dashboard: https://mudassiruddin.app.n8n.cloud
4. Check "Executions" tab for recent runs
5. Verify workflow completed without errors

### 8. Test Complete PDF → Video Pipeline

**End-to-End Flow:**

1. **Prepare test PDF:**
   - Create a simple PDF with 1-2 paragraphs
   - Or use any existing PDF document

2. **Upload:**
   - Dashboard → Create Course
   - Title: "Test Course"
   - Upload PDF
   - Click "Process"

3. **Monitor Progress:**
   ```javascript
   // Open browser DevTools → Console
   // Watch for these API calls in Network tab:
   ```
   - ✅ POST `/api/process/extract-text` (should return text)
   - ✅ POST `/api/process/generate-content` (should return script + quizzes)
   - ✅ POST `/api/process/generate-audio` (should return audio URL)
   - ✅ POST `/api/process/trigger-video-generation` (triggers n8n)

4. **Verify in Database:**
   - Supabase → Table Editor → `courses`
   - Find your "Test Course"
   - Check `video_url` field (should be populated after n8n completes)

5. **Play Video:**
   - Go to Employee portal
   - Find the test course
   - Click to watch
   - Video should play with audio
   - Quiz should pop up at specified timestamp

### 9. Test Employee Progress Tracking

**Steps:**
1. Login as employee (or create employee account)
2. Start watching a course video
3. Answer quiz questions
4. Check progress page

**Verify in Database:**
```sql
-- Run in Supabase SQL Editor
SELECT * FROM progress WHERE user_id = 'YOUR_USER_ID';
SELECT * FROM quiz_attempts WHERE user_id = 'YOUR_USER_ID';
```

### 10. Common Issues & Fixes

| Symptom | Cause | Fix |
|---------|-------|-----|
| `"services": { ... all false }` | Missing `.env` file | Copy `.env.example` to `.env` |
| 401 Unauthorized errors | Invalid API keys | Regenerate keys in respective dashboards |
| CORS errors | Backend not running | Run `npm run dev:all` |
| Clerk redirect fails | Domain not whitelisted | Add `localhost:3000` in Clerk Dashboard |
| PDF upload timeout | Large file / slow Claude API | Use smaller PDF for testing |
| No audio generated | ElevenLabs quota exceeded | Check usage at elevenlabs.io |
| Video not assembling | n8n workflow inactive | Activate workflow in n8n dashboard |
| Database errors | Schema not applied | Run `supabase/schema.sql` in SQL Editor |

### Quick Diagnostic Commands

```powershell
# Check if servers are running
Get-NetTCPConnection -LocalPort 3000,3001 -State Listen

# Test all endpoints at once
@('health', 'analytics/test-org') | ForEach-Object {
  Write-Host "Testing /api/$_"
  Invoke-RestMethod "http://localhost:3001/api/$_" -ErrorAction SilentlyContinue
}

# Check environment variables are loaded
node -e "console.log(process.env.VITE_SUPABASE_URL ? '✅ Env loaded' : '❌ Env missing')"
```

### Service-Specific Dashboards

Monitor your services here:
- **Supabase:** https://supabase.com/dashboard
- **Clerk:** https://dashboard.clerk.com
- **Stripe:** https://dashboard.stripe.com/test/dashboard
- **ElevenLabs:** https://elevenlabs.io/app/usage
- **n8n:** https://mudassiruddin.app.n8n.cloud
- **Claude:** https://console.anthropic.com/settings/usage
