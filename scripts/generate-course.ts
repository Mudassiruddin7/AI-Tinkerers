/**
 * Quick Course Generator Script
 * Generates a course from PDF using the direct pipeline (no n8n)
 */

import * as fs from 'fs'
import * as path from 'path'
import FormData from 'form-data'
import fetch from 'node-fetch'
import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const API_BASE_URL = 'http://localhost:3001'
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

interface GeneratedQuiz {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  triggerPercentage: number
}

async function generateCourseFromPDF(pdfPath: string, title: string, description: string) {
  console.log('\n🎓 AI Tutor - Course Generator')
  console.log('================================\n')
  
  const courseId = crypto.randomUUID()
  
  try {
    // Step 1: Extract text from PDF
    console.log('📄 Step 1: Extracting text from PDF...')
    const pdfBuffer = fs.readFileSync(pdfPath)
    
    const formData = new FormData()
    formData.append('pdf', pdfBuffer, {
      filename: path.basename(pdfPath),
      contentType: 'application/pdf'
    })
    
    const extractResponse = await fetch(`${API_BASE_URL}/api/process/extract-text`, {
      method: 'POST',
      body: formData as any
    })
    
    if (!extractResponse.ok) {
      throw new Error(`PDF extraction failed: ${extractResponse.statusText}`)
    }
    
    const extractedData = await extractResponse.json() as { text: string; pages: number }
    console.log(`   ✅ Extracted ${extractedData.pages} pages (${extractedData.text.length} characters)`)
    
    // Step 2: Generate content with Claude AI
    console.log('\n🤖 Step 2: Generating content with Claude AI...')
    
    const contentResponse = await fetch(`${API_BASE_URL}/api/process/generate-content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: extractedData.text.substring(0, 15000),
        courseTitle: title
      })
    })
    
    const content = await contentResponse.json() as {
      segments: Array<{ title: string; script: string; keyPoints: string[] }>
      quizQuestions: GeneratedQuiz[]
      summary: string
    }
    
    console.log(`   ✅ Generated ${content.segments?.length || 0} segments`)
    console.log(`   ✅ Generated ${content.quizQuestions?.length || 0} quiz questions`)
    
    // Step 3: Generate audio for first segment (demo)
    console.log('\n🎙️ Step 3: Generating voice narration...')
    
    let audioUrl = ''
    const firstScript = content.segments?.[0]?.script || 'Welcome to this training course.'
    
    try {
      const audioResponse = await fetch(`${API_BASE_URL}/api/process/generate-audio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: firstScript.substring(0, 2000),
          voiceId: '21m00Tcm4TlvDq8ikWAM' // Rachel voice
        })
      })
      
      if (audioResponse.ok) {
        const audioBuffer = await audioResponse.arrayBuffer()
        
        // Upload to Supabase
        const audioFileName = `courses/${courseId}/audio/intro.mp3`
        const { error: uploadError } = await supabase.storage
          .from('audio')
          .upload(audioFileName, Buffer.from(audioBuffer), {
            contentType: 'audio/mpeg'
          })
        
        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('audio')
            .getPublicUrl(audioFileName)
          audioUrl = urlData.publicUrl
          console.log(`   ✅ Audio generated and uploaded`)
        }
      }
    } catch (audioError) {
      console.log(`   ⚠️ Audio generation skipped (check ElevenLabs API key)`)
    }
    
    // Step 4: Save to database
    console.log('\n💾 Step 4: Saving course to database...')
    
    // Calculate duration (estimate ~150 words per minute)
    const totalWords = content.segments?.reduce((sum, s) => sum + s.script.split(' ').length, 0) || 500
    const totalDuration = Math.round((totalWords / 150) * 60)
    
    // Insert course
    const { error: courseError } = await supabase
      .from('courses')
      .insert({
        id: courseId,
        title,
        description: description || content.summary || '',
        thumbnail_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
        status: 'published',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    
    if (courseError) {
      console.log(`   ⚠️ Course insert warning:`, courseError.message)
    } else {
      console.log(`   ✅ Course created: ${courseId}`)
    }
    
    // Insert episodes
    const episodes: Array<{ id: string; title: string; duration: number }> = []
    
    for (let i = 0; i < (content.segments?.length || 1); i++) {
      const segment = content.segments?.[i]
      const episodeId = crypto.randomUUID()
      const episodeDuration = Math.round((segment?.script.split(' ').length || 100) / 150 * 60)
      
      const { error: episodeError } = await supabase
        .from('episodes')
        .insert({
          id: episodeId,
          course_id: courseId,
          title: segment?.title || `Episode ${i + 1}`,
          description: segment?.keyPoints?.join('. ') || segment?.script?.substring(0, 200) || '',
          episode_order: i + 1,
          duration: episodeDuration,
          video_url: i === 0 ? audioUrl : null,
          status: 'ready',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      
      if (!episodeError) {
        episodes.push({ id: episodeId, title: segment?.title || `Episode ${i + 1}`, duration: episodeDuration })
      }
      
      // Insert quiz questions for this episode
      const quizzesPerEpisode = Math.ceil((content.quizQuestions?.length || 3) / (content.segments?.length || 1))
      const startIdx = i * quizzesPerEpisode
      const episodeQuizzes = content.quizQuestions?.slice(startIdx, startIdx + quizzesPerEpisode) || []
      
      for (const quiz of episodeQuizzes) {
        await supabase
          .from('quiz_questions')
          .insert({
            id: crypto.randomUUID(),
            episode_id: episodeId,
            question_text: quiz.question,
            options: quiz.options,
            correct_answer: quiz.correctAnswer,
            explanation: quiz.explanation || 'Review the training material for more details.',
            trigger_time: quiz.triggerPercentage || 50,
            time_limit: 15,
            created_at: new Date().toISOString()
          })
      }
    }
    
    console.log(`   ✅ Created ${episodes.length} episodes`)
    console.log(`   ✅ Created ${content.quizQuestions?.length || 0} quiz questions`)
    
    // Summary
    console.log('\n' + '═'.repeat(50))
    console.log('🎉 COURSE CREATED SUCCESSFULLY!')
    console.log('═'.repeat(50))
    console.log(`
📚 Course: ${title}
🆔 ID: ${courseId}
📑 Episodes: ${episodes.length}
❓ Quizzes: ${content.quizQuestions?.length || 0}
⏱️ Duration: ~${Math.round(totalDuration / 60)} minutes
🔊 Audio: ${audioUrl ? 'Generated' : 'Pending'}

Episodes:
${episodes.map((ep, i) => `  ${i + 1}. ${ep.title} (${Math.round(ep.duration / 60)}min)`).join('\n')}

📺 View your course at:
   http://localhost:3000/admin

`)
    
    return { courseId, episodes, quizzes: content.quizQuestions }
    
  } catch (error) {
    console.error('\n❌ Error:', error)
    throw error
  }
}

// Run the generator
const pdfPath = path.join(process.cwd(), 'AI in the Browser_ Building LLM-Powered Browser Agents.pdf')
const title = 'Building LLM-Powered Browser Agents'
const description = 'Learn how to build intelligent browser automation agents using Large Language Models. Master the architecture, LLM integration, and production deployment of AI browser agents.'

generateCourseFromPDF(pdfPath, title, description)
  .then(() => {
    console.log('✅ Done! Open http://localhost:3000/admin to view your course.')
    process.exit(0)
  })
  .catch((err) => {
    console.error('Failed:', err)
    process.exit(1)
  })
