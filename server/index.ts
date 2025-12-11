/**
 * Corporate Training Video Platform - Backend Server
 * Handles API endpoints for video processing, Stripe webhooks, and integrations
 */

import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'
import multer from 'multer'
import pdfParse from 'pdf-parse'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

// Environment variables
const PORT = process.env.PORT || 3001
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || ''
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || ''
const SUPABASE_URL = process.env.SUPABASE_URL || ''
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || ''
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || ''
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || ''

// Initialize clients
const app = express()
const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null
const supabase = SUPABASE_URL && SUPABASE_SERVICE_KEY 
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY) 
  : null
const anthropic = ANTHROPIC_API_KEY ? new Anthropic({ apiKey: ANTHROPIC_API_KEY }) : null

// Multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
})

// Middleware
app.use(cors())

// Raw body for Stripe webhooks
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }))

// JSON for other routes
app.use(express.json())

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ 
    status: 'ok',
    services: {
      stripe: !!stripe,
      supabase: !!supabase,
      anthropic: !!anthropic,
      elevenlabs: !!ELEVENLABS_API_KEY
    }
  })
})

/**
 * ============================================
 * PDF Processing & Content Generation APIs
 * ============================================
 */

// Extract text from PDF
app.post('/api/process/extract-text', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file provided' })
    }

    const pdfData = await pdfParse(req.file.buffer)
    
    res.json({
      text: pdfData.text,
      pages: pdfData.numpages,
      info: pdfData.info
    })
  } catch (error) {
    console.error('PDF extraction error:', error)
    res.status(500).json({ error: 'Failed to extract text from PDF' })
  }
})

// Generate script segments and quiz questions using Claude
app.post('/api/process/generate-content', async (req, res) => {
  try {
    const { text, courseTitle } = req.body
    
    console.log('Generate content request:', { courseTitle, textLength: text?.length })

    if (!anthropic) {
      console.log('Anthropic not configured, returning mock data')
      // Return mock data for development
      return res.json(generateMockContent(text))
    }

    console.log('Calling Claude API...')
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: `You are creating engaging training content for a corporate training video. Based on the following training material, please:

1. Break the content into 5-8 script segments (200-300 words each) that can be narrated naturally
2. Rewrite each segment as conversational, engaging narration - NOT verbatim from the source
3. Generate 3 quiz questions that test comprehension of key concepts

Title: ${courseTitle}

Source Material:
${text.substring(0, 8000)}

Respond in this exact JSON format:
{
  "segments": [
    {
      "title": "Segment title",
      "script": "The narration script text...",
      "keyPoints": ["point 1", "point 2"]
    }
  ],
  "quizQuestions": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Why this answer is correct",
      "triggerPercentage": 30
    }
  ],
  "summary": "Brief course summary"
}

Make questions practical and scenario-based when possible, not just recall of facts.`
        }
      ]
    })

    // Extract JSON from response
    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
    console.log('Claude response received, length:', responseText.length)
    
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    
    if (!jsonMatch) {
      console.error('Failed to parse Claude response:', responseText.substring(0, 500))
      throw new Error('Failed to parse Claude response')
    }

    const content = JSON.parse(jsonMatch[0])
    console.log('Content parsed successfully:', { segmentCount: content.segments?.length, quizCount: content.quizQuestions?.length })
    res.json(content)
  } catch (error) {
    console.error('Content generation error:', error)
    // Return mock data on error
    console.log('Returning mock content due to error')
    res.json(generateMockContent(req.body.text || 'Training content'))
  }
})

// Generate audio using ElevenLabs
app.post('/api/process/generate-audio', async (req, res) => {
  try {
    const { text, voiceId = '21m00Tcm4TlvDq8ikWAM' } = req.body
    
    console.log('Audio generation request:', { textLength: text?.length, voiceId })

    if (!ELEVENLABS_API_KEY) {
      console.error('ElevenLabs API key not configured')
      return res.status(400).json({ error: 'ElevenLabs API key not configured' })
    }
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required for audio generation' })
    }

    console.log('Calling ElevenLabs API...')
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text: text.substring(0, 5000), // Limit text length
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      },
      {
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg'
        },
        responseType: 'arraybuffer',
        timeout: 30000
      }
    )

    console.log('Audio generated successfully, size:', response.data.byteLength)
    res.set('Content-Type', 'audio/mpeg')
    res.send(Buffer.from(response.data))
  } catch (error: any) {
    console.error('Audio generation error:', error.response?.status, error.response?.data ? Buffer.from(error.response.data).toString() : error.message)
    
    // Return a simple "audio unavailable" placeholder instead of error
    // This allows the course creation to continue even without audio
    const errorMsg = error.response?.status === 401 
      ? 'ElevenLabs API key invalid or quota exceeded' 
      : 'Audio generation failed'
    
    res.status(500).json({ 
      error: errorMsg, 
      details: error.message,
      skipAudio: true // Signal to frontend that audio can be skipped
    })
  }
})

// Trigger n8n workflow for video processing
app.post('/api/process/trigger-video-generation', async (req, res) => {
  try {
    const { 
      episodeId, 
      courseId, 
      pdfUrl, 
      employeePhotos, 
      voiceId,
      organizationId 
    } = req.body

    // Create processing job record
    const jobId = uuidv4()
    
    if (supabase) {
      await supabase.from('processing_jobs').insert({
        id: jobId,
        episode_id: episodeId,
        status: 'queued',
        progress: 0,
        started_at: new Date().toISOString()
      })

      // Update episode status
      await supabase.from('episodes').update({
        status: 'processing',
        processing_progress: 0
      }).eq('id', episodeId)
    }

    // Process directly without external workflow
    // The processing will happen via the callback endpoint
    
    res.json({ jobId, status: 'queued', message: 'Video generation job created. Processing will begin shortly.' })
  } catch (error) {
    console.error('Video generation trigger error:', error)
    res.status(500).json({ error: 'Failed to trigger video generation' })
  }
})

// Callback endpoint for n8n workflow completion
app.post('/api/process/callback', async (req, res) => {
  try {
    const { 
      jobId, 
      episodeId, 
      status, 
      videoUrl, 
      thumbnailUrl,
      duration,
      quizQuestions,
      error: errorMessage 
    } = req.body

    if (!supabase) {
      return res.json({ received: true })
    }

    if (status === 'completed') {
      // Update episode with video data
      await supabase.from('episodes').update({
        status: 'ready',
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl,
        duration,
        processing_progress: 100
      }).eq('id', episodeId)

      // Insert quiz questions
      if (quizQuestions && quizQuestions.length > 0) {
        await supabase.from('quiz_questions').insert(
          quizQuestions.map((q: any, index: number) => ({
            episode_id: episodeId,
            question_text: q.question,
            options: q.options,
            correct_answer: q.correctAnswer,
            explanation: q.explanation,
            trigger_time: q.triggerPercentage || (index + 1) * 30, // Default: 30%, 60%, 90%
            time_limit: 15
          }))
        )
      }

      // Update job status
      await supabase.from('processing_jobs').update({
        status: 'completed',
        progress: 100,
        completed_at: new Date().toISOString()
      }).eq('id', jobId)
    } else if (status === 'failed') {
      await supabase.from('episodes').update({
        status: 'failed'
      }).eq('id', episodeId)

      await supabase.from('processing_jobs').update({
        status: 'failed',
        error_message: errorMessage,
        completed_at: new Date().toISOString()
      }).eq('id', jobId)
    }

    res.json({ received: true })
  } catch (error) {
    console.error('Callback processing error:', error)
    res.status(500).json({ error: 'Failed to process callback' })
  }
})

// Get processing status
app.get('/api/process/status/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params

    if (!supabase) {
      // Simulate processing for development
      return res.json({
        status: 'processing',
        progress: Math.min(Math.floor(Math.random() * 100), 99),
        currentStep: 'Generating content...'
      })
    }

    const { data, error } = await supabase
      .from('processing_jobs')
      .select('*')
      .eq('id', jobId)
      .single()

    if (error) throw error

    res.json(data)
  } catch (error) {
    console.error('Status check error:', error)
    res.status(500).json({ error: 'Failed to get processing status' })
  }
})

/**
 * ============================================
 * Stripe Integration APIs
 * ============================================
 */

// Create Stripe checkout session
app.post('/api/stripe/create-checkout-session', async (req, res) => {
  try {
    const { priceId, organizationId, customerEmail, successUrl, cancelUrl } = req.body

    if (!stripe) {
      return res.status(400).json({ error: 'Stripe not configured' })
    }

    // Create or retrieve customer
    let customerId: string | undefined

    if (supabase) {
      const { data: org } = await supabase
        .from('organizations')
        .select('stripe_customer_id')
        .eq('id', organizationId)
        .single()

      if (org?.stripe_customer_id) {
        customerId = org.stripe_customer_id
      }
    }

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: customerEmail,
        metadata: { organizationId }
      })
      customerId = customer.id

      // Store customer ID
      if (supabase) {
        await supabase.from('organizations').update({
          stripe_customer_id: customerId
        }).eq('id', organizationId)
      }
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { organizationId }
    })

    res.json({ sessionId: session.id })
  } catch (error) {
    console.error('Checkout session error:', error)
    res.status(500).json({ error: 'Failed to create checkout session' })
  }
})

// Create Stripe customer portal session
app.post('/api/stripe/create-portal-session', async (req, res) => {
  try {
    const { customerId, returnUrl } = req.body

    if (!stripe) {
      return res.status(400).json({ error: 'Stripe not configured' })
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl
    })

    res.json({ url: session.url })
  } catch (error) {
    console.error('Portal session error:', error)
    res.status(500).json({ error: 'Failed to create portal session' })
  }
})

// Stripe webhook handler
app.post('/api/stripe/webhook', async (req, res) => {
  if (!stripe) {
    return res.status(400).json({ error: 'Stripe not configured' })
  }

  const sig = req.headers['stripe-signature'] as string
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return res.status(400).send(`Webhook Error: ${err}`)
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const organizationId = session.metadata?.organizationId
        
        if (organizationId && supabase) {
          await supabase.from('organizations').update({
            subscription_status: 'active',
            stripe_customer_id: session.customer as string
          }).eq('id', organizationId)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        
        if (supabase) {
          const status = subscription.status === 'active' ? 'active' : 
                        subscription.status === 'past_due' ? 'past_due' : 
                        'cancelled'
          
          await supabase.from('organizations').update({
            subscription_status: status
          }).eq('stripe_customer_id', subscription.customer as string)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        
        if (supabase) {
          await supabase.from('organizations').update({
            subscription_status: 'cancelled'
          }).eq('stripe_customer_id', subscription.customer as string)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        
        if (supabase) {
          await supabase.from('organizations').update({
            subscription_status: 'past_due'
          }).eq('stripe_customer_id', invoice.customer as string)
        }
        break
      }
    }

    res.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    res.status(500).json({ error: 'Webhook handler failed' })
  }
})

/**
 * ============================================
 * User & Organization APIs
 * ============================================
 */

// Sync user from Clerk
app.post('/api/users/sync', async (req, res) => {
  try {
    const { clerkId, email, firstName, lastName, role, organizationId } = req.body

    if (!supabase) {
      return res.json({ synced: true })
    }

    const { data, error } = await supabase
      .from('users')
      .upsert({
        clerk_id: clerkId,
        email,
        first_name: firstName,
        last_name: lastName,
        role: role || 'employee',
        organization_id: organizationId
      }, { onConflict: 'clerk_id' })
      .select()
      .single()

    if (error) throw error

    res.json(data)
  } catch (error) {
    console.error('User sync error:', error)
    res.status(500).json({ error: 'Failed to sync user' })
  }
})

// Get organization analytics
app.get('/api/analytics/:organizationId', async (req, res) => {
  try {
    const { organizationId } = req.params

    if (!supabase) {
      return res.json(getMockAnalytics())
    }

    // Get courses count
    const { count: coursesCount } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)

    // Get users count
    const { count: usersCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)

    // Get progress data
    const { data: progressData } = await supabase
      .from('user_progress')
      .select('completed, score')
      .eq('course_id', organizationId)

    const completed = progressData?.filter(p => p.completed).length || 0
    const total = progressData?.length || 1
    const avgScore = progressData?.reduce((sum, p) => sum + (p.score || 0), 0) / total || 0

    res.json({
      totalCourses: coursesCount || 0,
      totalLearners: usersCount || 0,
      completionRate: Math.round((completed / total) * 100),
      averageScore: Math.round(avgScore)
    })
  } catch (error) {
    console.error('Analytics error:', error)
    res.status(500).json({ error: 'Failed to get analytics' })
  }
})

// Export analytics to CSV
app.get('/api/analytics/:organizationId/export', async (req, res) => {
  try {
    const { organizationId } = req.params

    if (!supabase) {
      return res.status(400).json({ error: 'Database not configured' })
    }

    const { data } = await supabase
      .from('user_progress')
      .select(`
        users (first_name, last_name, email),
        episodes (title),
        courses (title),
        completed,
        score,
        completed_at,
        watched_duration
      `)
      .eq('organization_id', organizationId)

    // Convert to CSV
    const headers = ['Employee', 'Email', 'Course', 'Episode', 'Completed', 'Score', 'Watch Time', 'Completed Date']
    const rows = data?.map((row: any) => [
      `${row.users?.first_name} ${row.users?.last_name}`,
      row.users?.email,
      row.courses?.title,
      row.episodes?.title,
      row.completed ? 'Yes' : 'No',
      `${row.score}%`,
      `${Math.round(row.watched_duration / 60)} min`,
      row.completed_at || 'N/A'
    ]) || []

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename=training-analytics.csv')
    res.send(csv)
  } catch (error) {
    console.error('Export error:', error)
    res.status(500).json({ error: 'Failed to export analytics' })
  }
})

/**
 * ============================================
 * Progress Tracking APIs
 * ============================================
 */

// Update user progress
app.post('/api/progress/update', async (req, res) => {
  try {
    const { 
      userId, 
      episodeId, 
      courseId,
      watchedDuration, 
      totalDuration,
      completed,
      quizResponses,
      score 
    } = req.body

    if (!supabase) {
      return res.json({ updated: true })
    }

    const { data, error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        episode_id: episodeId,
        course_id: courseId,
        watched_duration: watchedDuration,
        total_duration: totalDuration,
        completed,
        completed_at: completed ? new Date().toISOString() : null,
        quiz_responses: quizResponses,
        score,
        last_watched_at: new Date().toISOString()
      }, { onConflict: 'user_id,episode_id' })
      .select()
      .single()

    if (error) throw error

    res.json(data)
  } catch (error) {
    console.error('Progress update error:', error)
    res.status(500).json({ error: 'Failed to update progress' })
  }
})

// Get user progress for a course
app.get('/api/progress/:userId/:courseId', async (req, res) => {
  try {
    const { userId, courseId } = req.params

    if (!supabase) {
      return res.json({
        episodes: [],
        overallProgress: 0,
        overallScore: 0
      })
    }

    const { data, error } = await supabase
      .from('user_progress')
      .select('*, episodes(title, duration)')
      .eq('user_id', userId)
      .eq('course_id', courseId)

    if (error) throw error

    const totalEpisodes = data?.length || 1
    const completedEpisodes = data?.filter(p => p.completed).length || 0
    const avgScore = data?.reduce((sum, p) => sum + (p.score || 0), 0) / totalEpisodes || 0

    res.json({
      episodes: data,
      overallProgress: Math.round((completedEpisodes / totalEpisodes) * 100),
      overallScore: Math.round(avgScore)
    })
  } catch (error) {
    console.error('Get progress error:', error)
    res.status(500).json({ error: 'Failed to get progress' })
  }
})

/**
 * ============================================
 * Helper Functions
 * ============================================
 */

function generateMockContent(text: string) {
  const segments = []
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 30)
  const chunkSize = Math.ceil(paragraphs.length / 5)

  for (let i = 0; i < Math.min(5, paragraphs.length); i++) {
    const chunk = paragraphs.slice(i * chunkSize, (i + 1) * chunkSize).join(' ')
    segments.push({
      title: `Section ${i + 1}`,
      script: chunk.substring(0, 500),
      keyPoints: ['Key point 1', 'Key point 2']
    })
  }

  return {
    segments,
    quizQuestions: [
      {
        question: 'What is the main topic covered in this training?',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 1,
        explanation: 'This is the explanation for the correct answer.',
        triggerPercentage: 30
      },
      {
        question: 'According to the training, what should you do first?',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 0,
        explanation: 'This is the explanation for the correct answer.',
        triggerPercentage: 60
      },
      {
        question: 'What is emphasized as most important?',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 2,
        explanation: 'This is the explanation for the correct answer.',
        triggerPercentage: 90
      }
    ]
  }
}

function getMockAnalytics() {
  return {
    totalCourses: 12,
    totalLearners: 156,
    completionRate: 68,
    averageScore: 82,
    topCourses: [
      { title: 'Q4 Compliance Training', views: 842, completionRate: 78 },
      { title: 'Security Awareness', views: 521, completionRate: 72 }
    ],
    recentActivity: [
      { user: 'John Doe', action: 'completed', course: 'Compliance Training', time: '2h ago' }
    ]
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`
  🚀 Corporate Training API Server running on port ${PORT}
  
  Endpoints:
  - Health: GET /api/health
  - Extract PDF: POST /api/process/extract-text
  - Generate Content: POST /api/process/generate-content
  - Generate Audio: POST /api/process/generate-audio
  - Trigger Video: POST /api/process/trigger-video-generation
  - Processing Status: GET /api/process/status/:jobId
  - Stripe Checkout: POST /api/stripe/create-checkout-session
  - Stripe Portal: POST /api/stripe/create-portal-session
  - Stripe Webhook: POST /api/stripe/webhook
  - User Sync: POST /api/users/sync
  - Analytics: GET /api/analytics/:organizationId
  - Export: GET /api/analytics/:organizationId/export
  - Update Progress: POST /api/progress/update
  - Get Progress: GET /api/progress/:userId/:courseId
  `)
})

export default app
