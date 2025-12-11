/**
 * LearnFlow AI Corporate Training Platform - Backend Server
 * Handles API endpoints for video processing, Stripe webhooks, and AI integrations
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
import { fal } from '@fal-ai/client'

// Environment variables
const PORT = process.env.PORT || 3002
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || ''
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || ''
const SUPABASE_URL = process.env.SUPABASE_URL || ''
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || ''
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || ''
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || ''
const FAL_KEY = process.env.FAL_KEY || ''
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_AI || ''
const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN || ''

// Initialize clients
const app = express()
const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null
const supabase = SUPABASE_URL && SUPABASE_SERVICE_KEY 
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY) 
  : null
const anthropic = ANTHROPIC_API_KEY ? new Anthropic({ apiKey: ANTHROPIC_API_KEY }) : null

// Configure fal.ai client
if (FAL_KEY) {
  fal.config({ credentials: FAL_KEY })
}

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
    platform: 'LearnFlow AI Training Platform',
    services: {
      stripe: !!stripe,
      supabase: !!supabase,
      anthropic: !!anthropic,
      elevenlabs: !!ELEVENLABS_API_KEY,
      fal: !!FAL_KEY,
      gemini: !!GEMINI_API_KEY,
      replicate: !!REPLICATE_API_TOKEN
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

// Generate script segments and quiz questions using Claude or Gemini for LearnFlow AI
app.post('/api/process/generate-content', async (req, res) => {
  try {
    const { text, courseTitle } = req.body
    
    console.log('🧠 LearnFlow AI: Generate content request:', { courseTitle, textLength: text?.length })

    const contentPrompt = `You are LearnFlow AI, creating engaging training content for a corporate training video. Based on the following training material, please:

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

    // Try Gemini first (free tier available)
    if (GEMINI_API_KEY) {
      try {
        console.log('🧠 LearnFlow: Trying Gemini Flash for content generation...')
        const geminiResponse = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            contents: [{ parts: [{ text: contentPrompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 4096,
              responseMimeType: 'application/json'
            }
          },
          {
            headers: { 'Content-Type': 'application/json' },
            timeout: 60000
          }
        )

        const geminiText = geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text
        if (geminiText) {
          console.log('Gemini response received, length:', geminiText.length)
          const jsonMatch = geminiText.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            const content = JSON.parse(jsonMatch[0])
            console.log('Content parsed successfully:', { segmentCount: content.segments?.length, quizCount: content.quizQuestions?.length })
            return res.json(content)
          }
        }
      } catch (geminiError: any) {
        console.log('Gemini content generation failed:', geminiError.response?.data?.error?.message || geminiError.message)
      }
    }

    // Try Claude as fallback
    if (anthropic) {
      try {
        console.log('Trying Claude API for content generation...')
        const message = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 4096,
          messages: [{ role: 'user', content: contentPrompt }]
        })

        const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
        console.log('Claude response received, length:', responseText.length)
        
        const jsonMatch = responseText.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const content = JSON.parse(jsonMatch[0])
          console.log('Content parsed successfully:', { segmentCount: content.segments?.length, quizCount: content.quizQuestions?.length })
          return res.json(content)
        }
      } catch (claudeError: any) {
        console.log('Claude content generation failed:', claudeError.message)
      }
    }

    // Return mock data if all APIs fail
    console.log('All AI APIs failed, returning mock content')
    res.json(generateMockContent(text))
  } catch (error) {
    console.error('Content generation error:', error)
    res.json(generateMockContent(req.body.text || 'Training content'))
  }
})

// Generate audio using ElevenLabs for LearnFlow AI Tutor
app.post('/api/process/generate-audio', async (req, res) => {
  try {
    const { text, voiceId = '21m00Tcm4TlvDq8ikWAM' } = req.body
    
    console.log('🎙️ LearnFlow Audio Generation Request:', { textLength: text?.length, voiceId })

    if (!ELEVENLABS_API_KEY) {
      console.error('❌ ElevenLabs API key not configured')
      return res.status(400).json({ error: 'ElevenLabs API key not configured. Please add ELEVENLABS_API_KEY to your .env file.' })
    }
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is required for audio generation' })
    }

    // Clean the text for better audio generation
    const cleanedText = text
      .replace(/\s+/g, ' ')  // Normalize whitespace
      .trim()
      .substring(0, 5000)  // ElevenLabs limit

    console.log('📝 Calling ElevenLabs API with text length:', cleanedText.length)
    
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text: cleanedText,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        }
      },
      {
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg'
        },
        responseType: 'arraybuffer',
        timeout: 60000  // Increased timeout to 60 seconds for longer texts
      }
    )

    if (!response.data || response.data.byteLength === 0) {
      console.error('❌ ElevenLabs returned empty audio')
      return res.status(500).json({ 
        error: 'ElevenLabs returned empty audio response',
        skipAudio: true 
      })
    }

    console.log('✅ LearnFlow audio generated successfully, size:', response.data.byteLength, 'bytes')
    res.set('Content-Type', 'audio/mpeg')
    res.set('Content-Length', response.data.byteLength.toString())
    res.send(Buffer.from(response.data))
  } catch (error: any) {
    const errorDetails = error.response?.data 
      ? Buffer.from(error.response.data).toString() 
      : error.message
    
    console.error('❌ LearnFlow Audio generation error:', {
      status: error.response?.status,
      details: errorDetails
    })
    
    // Provide helpful error messages
    let errorMsg = 'Audio generation failed'
    if (error.response?.status === 401) {
      errorMsg = 'ElevenLabs API key invalid. Please check your ELEVENLABS_API_KEY in .env'
    } else if (error.response?.status === 429) {
      errorMsg = 'ElevenLabs quota exceeded. Please check your account limits.'
    } else if (error.code === 'ECONNABORTED') {
      errorMsg = 'Audio generation timed out. Try with shorter text.'
    }
    
    res.status(500).json({ 
      error: errorMsg, 
      details: errorDetails,
      skipAudio: true // Signal to frontend that audio can be skipped
    })
  }
})

// Generate video using Google Gemini Veo API
app.post('/api/process/generate-video', async (req, res) => {
  try {
    const { 
      script, 
      imageUrl, 
      duration = 10,
      episodeTitle 
    } = req.body
    
    console.log('🎬 Video generation request:', { 
      scriptLength: script?.length, 
      hasImage: !!imageUrl,
      duration,
      episodeTitle
    })

    // Build prompt for video generation - LearnFlow AI Tutor style
    const videoPrompt = `Professional LearnFlow AI corporate training video. Topic: ${episodeTitle || 'Training Content'}. Style: Clean, modern office environment, professional AI tutor named LearnFlow presenting educational content, friendly and engaging presenter speaking directly to camera, high quality corporate training video with smooth natural movements. ${script?.substring(0, 200) || ''}`

    // Try Replicate for video generation - LearnFlow AI Tutor
    if (REPLICATE_API_TOKEN) {
      try {
        console.log('📹 LearnFlow: Using Replicate for video generation...')
        console.log('🔑 Replicate API Token configured:', REPLICATE_API_TOKEN.substring(0, 10) + '...')
        
        let videoUrl: string | null = null
        
        // Option 1: Try Stability AI Stable Video Diffusion with image (most reliable)
        if (imageUrl) {
          try {
            console.log('🎬 LearnFlow: Trying Stable Video Diffusion with image...')
            const svdResponse = await axios.post(
              'https://api.replicate.com/v1/models/stability-ai/stable-video-diffusion/predictions',
              {
                input: {
                  input_image: imageUrl,
                  sizing_strategy: 'maintain_aspect_ratio',
                  frames_per_second: 6,
                  motion_bucket_id: 127,
                  cond_aug: 0.02,
                  decoding_t: 14,
                  seed: Math.floor(Math.random() * 1000000)
                }
              },
              {
                headers: {
                  'Authorization': `Bearer ${REPLICATE_API_TOKEN}`,
                  'Content-Type': 'application/json'
                },
                timeout: 30000
              }
            )

            const predictionId = svdResponse.data.id
            videoUrl = await pollReplicatePrediction(predictionId, REPLICATE_API_TOKEN)
            
            if (videoUrl) {
              console.log('✅ LearnFlow SVD video generated:', videoUrl)
              return res.json({
                videoUrl,
                duration,
                format: 'mp4',
                provider: 'replicate-svd'
              })
            }
          } catch (svdError: any) {
            console.log('⚠️ SVD model failed:', svdError.response?.data || svdError.message)
          }
        }

        // Option 2: Try Wan 2.1 text-to-video (popular open model)
        try {
          console.log('🎬 LearnFlow: Trying Wan 2.1 text-to-video model...')
          const wanResponse = await axios.post(
            'https://api.replicate.com/v1/models/wan-video/wan2.1-t2v-480p/predictions',
            {
              input: {
                prompt: videoPrompt,
                negative_prompt: 'blurry, low quality, distorted, ugly',
                num_frames: 81,
                guidance_scale: 5.0,
                num_inference_steps: 30,
                seed: Math.floor(Math.random() * 1000000)
              }
            },
            {
              headers: {
                'Authorization': `Bearer ${REPLICATE_API_TOKEN}`,
                'Content-Type': 'application/json'
              },
              timeout: 30000
            }
          )
          
          const predictionId = wanResponse.data.id
          videoUrl = await pollReplicatePrediction(predictionId, REPLICATE_API_TOKEN)
          
          if (videoUrl) {
            console.log('✅ LearnFlow Wan video generated:', videoUrl)
            return res.json({
              videoUrl,
              duration,
              format: 'mp4',
              provider: 'replicate-wan'
            })
          }
        } catch (wanError: any) {
          console.log('⚠️ Wan model failed:', wanError.response?.data || wanError.message)
        }

        // Option 3: Try AnimateDiff for image animation if we have an image
        if (imageUrl) {
          try {
            console.log('🎬 LearnFlow: Trying AnimateDiff with image...')
            const animateResponse = await axios.post(
              'https://api.replicate.com/v1/models/lucataco/animate-diff/predictions',
              {
                input: {
                  path: imageUrl,
                  prompt: videoPrompt,
                  n_prompt: 'bad quality, worse quality, low resolution',
                  steps: 25,
                  guidance_scale: 7.5,
                  seed: Math.floor(Math.random() * 1000000)
                }
              },
              {
                headers: {
                  'Authorization': `Bearer ${REPLICATE_API_TOKEN}`,
                  'Content-Type': 'application/json'
                },
                timeout: 30000
              }
            )

            const predictionId = animateResponse.data.id
            videoUrl = await pollReplicatePrediction(predictionId, REPLICATE_API_TOKEN)
            
            if (videoUrl) {
              console.log('✅ LearnFlow AnimateDiff video generated:', videoUrl)
              return res.json({
                videoUrl,
                duration,
                format: 'mp4',
                provider: 'replicate-animatediff'
              })
            }
          } catch (animateError: any) {
            console.log('⚠️ AnimateDiff failed:', animateError.response?.data || animateError.message)
          }
        }
        
      } catch (replicateError: any) {
        console.log('⚠️ Replicate error:', replicateError.response?.data || replicateError.message)
      }
    } else {
      console.log('⚠️ REPLICATE_API_TOKEN not found in environment')
    }

    // Try D-ID API (has free tier for talking avatars)
    const DID_API_KEY = process.env.DID_API_KEY
    if (DID_API_KEY && imageUrl) {
      try {
        console.log('📹 Trying D-ID for talking avatar video...')
        
        const didResponse = await axios.post(
          'https://api.d-id.com/talks',
          {
            source_url: imageUrl,
            script: {
              type: 'text',
              input: script?.substring(0, 500) || 'Welcome to this training module.',
              provider: {
                type: 'microsoft',
                voice_id: 'en-US-JennyNeural'
              }
            }
          },
          {
            headers: {
              'Authorization': `Basic ${DID_API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        )

        // Poll for completion
        const talkId = didResponse.data.id
        let talkResult = didResponse.data
        
        while (talkResult.status !== 'done' && talkResult.status !== 'error') {
          await new Promise(resolve => setTimeout(resolve, 2000))
          const pollResponse = await axios.get(
            `https://api.d-id.com/talks/${talkId}`,
            { headers: { 'Authorization': `Basic ${DID_API_KEY}` } }
          )
          talkResult = pollResponse.data
          console.log('🔄 D-ID status:', talkResult.status)
        }

        if (talkResult.status === 'done' && talkResult.result_url) {
          console.log('✅ D-ID video generated')
          return res.json({
            videoUrl: talkResult.result_url,
            duration,
            format: 'mp4',
            provider: 'd-id'
          })
        }
      } catch (didError: any) {
        console.log('⚠️ D-ID failed:', didError.response?.data || didError.message)
      }
    }

    // Fallback: Generate a placeholder video URL (for development/demo)
    // In production, you would use FFmpeg to create a video from image + audio
    console.log('⚠️ No video API available, returning placeholder...')
    
    // Return a demo video or placeholder for now
    return res.json({
      videoUrl: 'placeholder',  // Frontend should handle this
      duration,
      format: 'mp4',
      provider: 'placeholder',
      message: 'Video generation APIs not configured. Please add REPLICATE_API_TOKEN or DID_API_KEY to .env',
      skipVideo: true
    })

  } catch (error: any) {
    console.error('❌ Video generation error:', error.response?.data || error.message || error)
    
    res.status(500).json({ 
      error: 'Video generation failed',
      details: error.message,
      skipVideo: true 
    })
  }
})

// Generate lip-sync video using Replicate SadTalker or D-ID (sync face with audio)
app.post('/api/process/generate-lipsync', async (req, res) => {
  try {
    const { 
      imageUrl, 
      audioUrl,
      script,
      duration = 10 
    } = req.body
    
    console.log('👄 LearnFlow lip-sync generation request:', { 
      hasImage: !!imageUrl,
      hasAudio: !!audioUrl,
      duration
    })

    if (!imageUrl) {
      return res.status(400).json({ 
        error: 'Image URL is required for lip-sync',
        skipVideo: true 
      })
    }

    // Try D-ID API first (better quality, has free tier)
    const DID_API_KEY = process.env.DID_API_KEY
    if (DID_API_KEY) {
      try {
        console.log('👄 LearnFlow: Trying D-ID for lip-sync video...')
        
        const didPayload: any = {
          source_url: imageUrl
        }

        if (audioUrl) {
          didPayload.script = {
            type: 'audio',
            audio_url: audioUrl
          }
        } else if (script) {
          didPayload.script = {
            type: 'text',
            input: script.substring(0, 500),
            provider: {
              type: 'microsoft',
              voice_id: 'en-US-JennyNeural'
            }
          }
        }
        
        const didResponse = await axios.post(
          'https://api.d-id.com/talks',
          didPayload,
          {
            headers: {
              'Authorization': `Basic ${DID_API_KEY}`,
              'Content-Type': 'application/json'
            },
            timeout: 30000
          }
        )

        // Poll for completion
        const talkId = didResponse.data.id
        let attempts = 0
        
        while (attempts < 60) {
          const pollResponse = await axios.get(
            `https://api.d-id.com/talks/${talkId}`,
            { headers: { 'Authorization': `Basic ${DID_API_KEY}` } }
          )
          
          if (pollResponse.data.status === 'done') {
            console.log('✅ LearnFlow D-ID lip-sync video generated')
            return res.json({
              videoUrl: pollResponse.data.result_url,
              duration,
              format: 'mp4',
              type: 'lipsync',
              provider: 'd-id'
            })
          }
          
          if (pollResponse.data.status === 'error') {
            throw new Error('D-ID processing error')
          }
          
          await new Promise(resolve => setTimeout(resolve, 2000))
          attempts++
        }
      } catch (didError: any) {
        console.log('⚠️ D-ID lip-sync failed:', didError.response?.data || didError.message)
      }
    }

    // Try Replicate SadTalker as fallback
    if (REPLICATE_API_TOKEN && audioUrl) {
      try {
        console.log('👄 LearnFlow: Trying Replicate SadTalker for lip-sync...')

        const sadtalkerResponse = await axios.post(
          'https://api.replicate.com/v1/models/cjwbw/sadtalker/predictions',
          {
            input: {
              source_image: imageUrl,
              driven_audio: audioUrl,
              still: false,
              preprocess: 'crop',
              enhancer: 'gfpgan'
            }
          },
          {
            headers: {
              'Authorization': `Bearer ${REPLICATE_API_TOKEN}`,
              'Content-Type': 'application/json'
            },
            timeout: 30000
          }
        )

        const predictionId = sadtalkerResponse.data.id
        const videoUrl = await pollReplicatePrediction(predictionId, REPLICATE_API_TOKEN)
        
        if (videoUrl) {
          console.log('✅ LearnFlow SadTalker lip-sync video generated:', videoUrl)
          return res.json({ 
            videoUrl,
            duration,
            format: 'mp4',
            type: 'lipsync',
            provider: 'replicate-sadtalker'
          })
        }
      } catch (sadtalkerError: any) {
        console.log('⚠️ Replicate SadTalker failed:', sadtalkerError.response?.data || sadtalkerError.message)
      }
    }

    // Try fal.ai SadTalker as last resort
    if (FAL_KEY && audioUrl) {
      try {
        console.log('👄 LearnFlow: Trying fal.ai SadTalker for lip-sync...')

        const result = await fal.subscribe('fal-ai/sadtalker', {
          input: {
            source_image_url: imageUrl,
            driven_audio_url: audioUrl,
            still_mode: false,
            use_enhancer: true,
            preprocess: 'crop',
            pose_style: 0,
            expression_scale: 1.0
          },
          logs: true
        })

        const videoUrl = result?.video?.url || result?.output?.video?.url || null
        
        if (videoUrl) {
          console.log('✅ LearnFlow fal.ai lip-sync video generated:', videoUrl)
          return res.json({ 
            videoUrl,
            duration,
            format: 'mp4',
            type: 'lipsync',
            provider: 'fal-ai-sadtalker'
          })
        }
      } catch (falError: any) {
        console.log('⚠️ fal.ai SadTalker failed:', falError.message)
      }
    }

    // No lip-sync API available - return placeholder
    console.log('⚠️ LearnFlow: No lip-sync API available, returning placeholder')
    return res.json({ 
      videoUrl: 'placeholder',
      duration,
      format: 'mp4',
      type: 'lipsync',
      provider: 'placeholder',
      message: 'Lip-sync APIs not configured. Add DID_API_KEY or ensure Replicate has credits.',
      skipVideo: true 
    })

  } catch (error: any) {
    console.error('❌ LearnFlow lip-sync error:', error.message || error)
    res.status(500).json({ 
      error: 'Lip-sync generation failed',
      details: error.message,
      skipVideo: true 
    })
  }
})

// Generate video using Google Gemini Imagen (text-to-image for thumbnails/avatars)
app.post('/api/process/generate-image', async (req, res) => {
  try {
    const { prompt, aspectRatio = '16:9' } = req.body
    
    console.log('🖼️ Gemini image generation request:', { promptLength: prompt?.length, aspectRatio })

    if (!GEMINI_API_KEY) {
      return res.status(400).json({ error: 'Gemini API key not configured' })
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict`,
      {
        instances: [{ prompt }],
        parameters: {
          sampleCount: 1,
          aspectRatio,
          personGeneration: 'allow_adult',
          safetyFilterLevel: 'block_few'
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY
        }
      }
    )

    const imageData = response.data?.predictions?.[0]?.bytesBase64Encoded
    
    if (imageData) {
      const imageUrl = `data:image/png;base64,${imageData}`
      console.log('✅ Image generated successfully')
      return res.json({ imageUrl, provider: 'gemini-imagen' })
    }

    res.status(500).json({ error: 'Image generation failed' })
  } catch (error: any) {
    console.error('❌ Image generation error:', error.response?.data || error.message)
    res.status(500).json({ error: 'Image generation failed', details: error.message })
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

/**
 * Poll Replicate prediction until completion
 */
async function pollReplicatePrediction(predictionId: string, apiToken: string): Promise<string | null> {
  let attempts = 0
  const maxAttempts = 120 // 4 minutes with 2-second intervals
  
  while (attempts < maxAttempts) {
    try {
      const pollResponse = await axios.get(
        `https://api.replicate.com/v1/predictions/${predictionId}`,
        { headers: { 'Authorization': `Bearer ${apiToken}` } }
      )
      
      const prediction = pollResponse.data
      
      if (attempts % 5 === 0) {
        console.log(`🔄 LearnFlow Replicate status: ${prediction.status} (attempt ${attempts}/${maxAttempts})`)
      }
      
      if (prediction.status === 'succeeded' && prediction.output) {
        const videoUrl = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output
        return videoUrl
      } else if (prediction.status === 'failed') {
        console.log('❌ Replicate prediction failed:', prediction.error)
        return null
      } else if (prediction.status === 'canceled') {
        console.log('❌ Replicate prediction canceled')
        return null
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      attempts++
    } catch (err: any) {
      console.log('⚠️ Poll error:', err.message)
      attempts++
    }
  }
  
  console.log('⚠️ Replicate prediction timed out')
  return null
}

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
