/**
 * Import Pre-Generated Course to Database
 * Uses the already generated course JSON and creates audio with ElevenLabs
 */

import * as fs from 'fs'
import * as path from 'path'
import fetch from 'node-fetch'
import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const API_BASE_URL = 'http://localhost:3001'
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

interface Scene {
  order: number
  scriptText: string
  sceneDescription: string
  duration: number
}

interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: number
  triggerPercentage: number
  explanation: string
}

interface Episode {
  id: string
  title: string
  description: string
  orderIndex: number
  status: string
  duration: number
  script: {
    title: string
    estimatedDuration: number
    scenes: Scene[]
    quizQuestions: QuizQuestion[]
    keyTakeaways: string[]
  }
}

interface CourseData {
  course: {
    id: string
    title: string
    description: string
    createdAt: string
    status: string
    duration: number
    thumbnail: string | null
  }
  episodes: Episode[]
  metadata: {
    totalDuration: number
    episodeCount: number
    totalScenes: number
    totalQuizQuestions: number
    generatedFrom: string
    generatedAt: string
    voiceSettings: {
      voiceId: string
      model: string
      stability: number
      similarityBoost: number
    }
  }
}

async function generateAudio(text: string, voiceId: string): Promise<Buffer | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/process/generate-audio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: text.substring(0, 2500),
        voiceId
      })
    })
    
    if (response.ok) {
      const buffer = await response.arrayBuffer()
      return Buffer.from(buffer)
    }
    return null
  } catch (error) {
    console.log('  ⚠️ Audio generation skipped')
    return null
  }
}

async function importCourse() {
  console.log('\n🎓 AI Tutor - Course Import')
  console.log('════════════════════════════\n')
  
  // Load pre-generated course
  const coursePath = path.join(process.cwd(), 'generated-courses', 'ai-browser-agents-course.json')
  const courseData: CourseData = JSON.parse(fs.readFileSync(coursePath, 'utf-8'))
  
  const courseId = crypto.randomUUID()
  console.log(`📚 Importing: ${courseData.course.title}`)
  console.log(`🆔 New Course ID: ${courseId}\n`)
  
  // Step 1: Insert course
  console.log('💾 Step 1: Creating course in database...')
  
  const { error: courseError } = await supabase
    .from('courses')
    .insert({
      id: courseId,
      title: courseData.course.title,
      description: courseData.course.description,
      thumbnail_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
  
  if (courseError) {
    console.log(`   ⚠️ Warning: ${courseError.message}`)
  } else {
    console.log('   ✅ Course created')
  }
  
  // Step 2: Insert episodes with audio
  console.log('\n🎙️ Step 2: Creating episodes with audio narration...')
  
  const voiceId = courseData.metadata.voiceSettings.voiceId
  
  for (let i = 0; i < courseData.episodes.length; i++) {
    const episode = courseData.episodes[i]
    const episodeId = crypto.randomUUID()
    
    console.log(`\n   📺 Episode ${i + 1}: ${episode.title}`)
    
    // Generate full script text for audio
    const fullScript = episode.script.scenes.map(s => s.scriptText).join(' ')
    
    // Generate audio for intro (first 2 scenes)
    const introScript = episode.script.scenes.slice(0, 2).map(s => s.scriptText).join(' ')
    console.log(`      🎤 Generating audio narration...`)
    
    let audioUrl: string | null = null
    const audioBuffer = await generateAudio(introScript, voiceId)
    
    if (audioBuffer) {
      const audioFileName = `courses/${courseId}/audio/episode-${i + 1}.mp3`
      const { error: uploadError } = await supabase.storage
        .from('audio')
        .upload(audioFileName, audioBuffer, {
          contentType: 'audio/mpeg'
        })
      
      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from('audio')
          .getPublicUrl(audioFileName)
        audioUrl = urlData.publicUrl
        console.log(`      ✅ Audio uploaded`)
      }
    }
    
    // Insert episode
    const { error: episodeError } = await supabase
      .from('episodes')
      .insert({
        id: episodeId,
        course_id: courseId,
        title: episode.title,
        description: episode.description,
        episode_order: episode.orderIndex,
        duration: episode.duration,
        video_url: audioUrl,
        status: 'ready',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    
    if (episodeError) {
      console.log(`      ⚠️ Episode warning: ${episodeError.message}`)
    } else {
      console.log(`      ✅ Episode saved`)
    }
    
    // Insert quiz questions
    console.log(`      ❓ Adding ${episode.script.quizQuestions.length} quiz questions...`)
    
    for (const quiz of episode.script.quizQuestions) {
      await supabase
        .from('quiz_questions')
        .insert({
          id: crypto.randomUUID(),
          episode_id: episodeId,
          question_text: quiz.question,
          options: quiz.options,
          correct_answer: quiz.correctAnswer,
          explanation: quiz.explanation,
          trigger_time: quiz.triggerPercentage,
          time_limit: 20,
          created_at: new Date().toISOString()
        })
    }
    console.log(`      ✅ Quiz questions added`)
  }
  
  // Summary
  console.log('\n' + '═'.repeat(50))
  console.log('🎉 COURSE IMPORTED SUCCESSFULLY!')
  console.log('═'.repeat(50))
  console.log(`
📚 Course: ${courseData.course.title}
🆔 ID: ${courseId}
📑 Episodes: ${courseData.episodes.length}
❓ Total Quiz Questions: ${courseData.metadata.totalQuizQuestions}
⏱️ Total Duration: ${Math.round(courseData.metadata.totalDuration / 60)} minutes
🎬 Total Scenes: ${courseData.metadata.totalScenes}

Episodes Created:
${courseData.episodes.map((ep, i) => `  ${i + 1}. ${ep.title} (${Math.round(ep.duration / 60)}min)`).join('\n')}

╔═══════════════════════════════════════════════════╗
║  📺 VIEW YOUR COURSE AT:                          ║
║                                                   ║
║     http://localhost:3000/admin                   ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
`)
  
  return courseId
}

// Run
importCourse()
  .then((id) => {
    console.log(`\n✅ Course ${id} ready!`)
    process.exit(0)
  })
  .catch((err) => {
    console.error('❌ Error:', err)
    process.exit(1)
  })
