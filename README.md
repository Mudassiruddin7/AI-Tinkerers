# AI Tutor - Corporate Training Platform

AI-powered video training platform that transforms PDFs into engaging video courses with AI narration and interactive quizzes.

## 🚀 Features

- **PDF to Course**: Upload PDFs and automatically generate training courses
- **AI Script Generation**: Claude AI creates engaging, conversational narration scripts
- **Voice Synthesis**: ElevenLabs generates natural voice narration
- **Interactive Quizzes**: Auto-generated quiz questions test comprehension
- **Progress Tracking**: Monitor employee training completion and scores
- **Multi-tenant**: Support for multiple organizations

## 📋 Architecture

```
PDF Upload → Text Extraction → Claude AI Scripts → ElevenLabs Audio → Course Ready
```

### Tech Stack

- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **Backend**: Node.js + Express
- **AI**: Anthropic Claude (scripts) + ElevenLabs (voice)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Clerk
- **Payments**: Stripe

## 🛠️ Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file:

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# AI Services
ANTHROPIC_API_KEY=your_anthropic_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key

# Auth (optional)
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key

# Payments (optional)
STRIPE_SECRET_KEY=your_stripe_secret
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable

# API
VITE_API_BASE_URL=http://localhost:3001
```

### 3. Set Up Supabase

Run the SQL in `supabase/schema.sql` to create the required tables:
- `courses`
- `episodes`
- `quiz_questions`
- `user_progress`
- Storage buckets: `documents`, `audio`, `images`, `videos`

### 4. Start Development Servers

```bash
# Terminal 1: Frontend (Vite)
npm run dev

# Terminal 2: Backend (Express)
npm run server

# Or run both:
npm run dev:all
```

## 📖 How It Works

### Course Generation Flow

1. **Upload PDF**: Admin uploads training material (PDF)
2. **Extract Text**: Backend extracts text content from PDF
3. **AI Processing**: Claude AI generates:
   - Conversational script segments
   - Key learning points
   - Quiz questions with explanations
4. **Voice Generation**: ElevenLabs creates natural narration audio
5. **Save Course**: Course, episodes, and quizzes saved to database

### Key Components

- `src/lib/courseGenerator.ts` - Main course generation orchestrator
- `src/pages/admin/CreateCourse.tsx` - Course creation UI
- `server/index.ts` - Backend API endpoints

## 🎯 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Service health check |
| `/api/process/extract-text` | POST | Extract text from PDF |
| `/api/process/generate-content` | POST | Generate AI course content |
| `/api/process/generate-audio` | POST | Generate voice narration |
| `/api/progress/update` | POST | Update user progress |
| `/api/analytics/:orgId` | GET | Get organization analytics |

## 🔧 Configuration

### ElevenLabs Voices

Available voices are defined in `src/lib/elevenlabs.ts`:
- Rachel (professional female)
- Drew (professional male)
- And more...

### Claude AI Settings

Content generation uses Claude Sonnet with customizable:
- Number of segments (default: 5)
- Number of quiz questions (default: 3)
- Tone (professional/casual/friendly)

## 📁 Project Structure

```
├── server/           # Express backend
│   └── index.ts      # API routes
├── src/
│   ├── components/   # Reusable UI components
│   ├── lib/          # Services & utilities
│   │   ├── courseGenerator.ts  # Course generation
│   │   ├── claude.ts           # Claude AI
│   │   ├── elevenlabs.ts       # Voice synthesis
│   │   └── supabase.ts         # Database
│   ├── pages/        # Page components
│   │   ├── admin/    # Admin dashboard
│   │   └── employee/ # Employee views
│   └── layouts/      # Layout components
├── supabase/         # Database schema
└── generated-courses/ # Export outputs
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Render)
```bash
npm run server
# Set environment variables in hosting platform
```

## 📝 License

MIT License
