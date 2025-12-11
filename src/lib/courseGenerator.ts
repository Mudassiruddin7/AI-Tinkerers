/**
 * Direct Course Generation Service
 * Handles PDF processing, AI script generation, and audio synthesis
 * WITHOUT requiring n8n - uses Claude AI + ElevenLabs directly
 */

import { supabase } from './supabase'

// Use backend API for heavy processing
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

export interface CourseGenerationInput {
  title: string
  description: string
  pdfFile: File
  employeePhotos: File[]
  voiceId: string
  organizationId?: string
}

export interface GeneratedEpisode {
  id: string
  title: string
  description: string
  script: string
  audioUrl?: string
  duration: number
  scenes: GeneratedScene[]
}

export interface GeneratedScene {
  id: string
  title: string
  script: string
  imageUrl?: string
  audioUrl?: string
  duration: number
  startTime: number
}

export interface GeneratedQuiz {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  triggerPercentage: number
}

export interface GeneratedCourse {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  episodes: GeneratedEpisode[]
  quizQuestions: GeneratedQuiz[]
  totalDuration: number
  status: 'processing' | 'ready' | 'failed'
}

export interface GenerationProgress {
  step: string
  progress: number
  message: string
}

type ProgressCallback = (progress: GenerationProgress) => void

/**
 * Main course generation function
 * Orchestrates the entire pipeline: PDF → Text → AI Script → Audio → Course
 */
export async function generateCourse(
  input: CourseGenerationInput,
  onProgress?: ProgressCallback
): Promise<GeneratedCourse> {
  const courseId = crypto.randomUUID()
  
  try {
    // Step 1: Extract text from PDF
    onProgress?.({ step: 'extract', progress: 5, message: 'Extracting text from PDF...' })
    
    const extractedText = await extractTextFromPDF(input.pdfFile)
    console.log('Extracted text length:', extractedText.length)
    
    onProgress?.({ step: 'extract', progress: 15, message: `Extracted ${Math.round(extractedText.length / 1000)}k characters` })
    
    // Step 2: Upload employee photos
    onProgress?.({ step: 'photos', progress: 20, message: 'Processing employee photos...' })
    
    const photoUrls = await uploadPhotos(input.employeePhotos, courseId)
    console.log('Uploaded photos:', photoUrls.length)
    
    onProgress?.({ step: 'photos', progress: 30, message: `Processed ${photoUrls.length} photos` })
    
    // Step 3: Generate content with AI
    onProgress?.({ step: 'ai', progress: 35, message: 'AI is analyzing content and generating scripts...' })
    
    const aiContent = await generateAIContent(extractedText, input.title, input.description)
    console.log('AI generated segments:', aiContent.segments.length)
    
    onProgress?.({ step: 'ai', progress: 55, message: `Generated ${aiContent.segments.length} segments and ${aiContent.quizQuestions.length} quiz questions` })
    
    // Step 4: Generate audio for each segment
    onProgress?.({ step: 'audio', progress: 60, message: 'Generating AI voice narration...' })
    
    const episodes = await generateEpisodeAudio(
      aiContent.segments,
      photoUrls,
      input.voiceId,
      courseId,
      (segmentProgress) => {
        const baseProgress = 60
        const audioRange = 30 // 60-90%
        const currentProgress = baseProgress + (segmentProgress * audioRange / 100)
        onProgress?.({ 
          step: 'audio', 
          progress: Math.round(currentProgress), 
          message: `Generating narration... ${Math.round(segmentProgress)}%` 
        })
      }
    )
    
    onProgress?.({ step: 'save', progress: 92, message: 'Saving course to database...' })
    
    // Step 5: Calculate total duration
    const totalDuration = episodes.reduce((sum, ep) => sum + ep.duration, 0)
    
    // Step 6: Save to database
    const savedCourse = await saveCourseToDatabase({
      id: courseId,
      title: input.title,
      description: input.description || aiContent.summary,
      thumbnailUrl: photoUrls[0] || getDefaultThumbnail(input.title),
      episodes,
      quizQuestions: aiContent.quizQuestions,
      totalDuration,
      organizationId: input.organizationId
    })
    
    onProgress?.({ step: 'complete', progress: 100, message: 'Course created successfully!' })
    
    return savedCourse
  } catch (error) {
    console.error('Course generation error:', error)
    throw error
  }
}

/**
 * Extract text from PDF using backend service
 */
async function extractTextFromPDF(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('pdf', file)
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/process/extract-text`, {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) {
      throw new Error('PDF extraction failed')
    }
    
    const data = await response.json()
    return data.text || ''
  } catch (error) {
    console.error('PDF extraction error:', error)
    // Fallback: try client-side extraction hint
    return `Training content from ${file.name}. Please configure backend server for full PDF extraction.`
  }
}

/**
 * Upload photos to Supabase storage
 */
async function uploadPhotos(photos: File[], courseId: string): Promise<string[]> {
  const urls: string[] = []
  
  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i]
    const fileName = `courses/${courseId}/photos/${Date.now()}-${i}-${photo.name}`
    
    try {
      const { error } = await supabase.storage
        .from('images')
        .upload(fileName, photo)
      
      if (error) {
        console.warn('Photo upload error:', error)
        // Use generated avatar as fallback
        urls.push(`https://ui-avatars.com/api/?name=Employee+${i + 1}&background=random&size=400`)
        continue
      }
      
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(fileName)
      
      urls.push(urlData.publicUrl)
    } catch (err) {
      console.warn('Photo upload failed:', err)
      urls.push(`https://ui-avatars.com/api/?name=Employee+${i + 1}&background=random&size=400`)
    }
  }
  
  // Ensure at least one photo
  if (urls.length === 0) {
    urls.push(`https://ui-avatars.com/api/?name=${encodeURIComponent(courseId)}&background=667eea&color=fff&size=400`)
  }
  
  return urls
}

/**
 * Generate AI content using Claude via backend
 */
async function generateAIContent(
  text: string,
  title: string,
  description: string
): Promise<{
  segments: Array<{
    title: string
    script: string
    keyPoints: string[]
  }>
  quizQuestions: GeneratedQuiz[]
  summary: string
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/process/generate-content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: text.substring(0, 15000), // Limit context size
        courseTitle: title
      })
    })
    
    if (!response.ok) {
      throw new Error('AI content generation failed')
    }
    
    const data = await response.json()
    
    return {
      segments: data.segments || generateFallbackSegments(text, title),
      quizQuestions: data.quizQuestions || generateFallbackQuizzes(title),
      summary: data.summary || description || `Training course: ${title}`
    }
  } catch (error) {
    console.error('AI generation error:', error)
    // Return fallback content
    return {
      segments: generateFallbackSegments(text, title),
      quizQuestions: generateFallbackQuizzes(title),
      summary: description || `Training course: ${title}`
    }
  }
}

/**
 * Generate audio for episodes using ElevenLabs via backend
 */
async function generateEpisodeAudio(
  segments: Array<{ title: string; script: string; keyPoints: string[] }>,
  photoUrls: string[],
  voiceId: string,
  courseId: string,
  onProgress?: (percent: number) => void
): Promise<GeneratedEpisode[]> {
  const episodes: GeneratedEpisode[] = []
  let currentTime = 0
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    const episodeId = crypto.randomUUID()
    
    // Update progress
    onProgress?.(Math.round((i / segments.length) * 100))
    
    // Generate audio for this segment
    let audioUrl: string | undefined
    let duration = estimateDuration(segment.script)
    
    try {
      const audioBlob = await generateAudio(segment.script, voiceId)
      
      if (audioBlob && audioBlob.size > 0) {
        // Upload audio to Supabase
        const audioFileName = `courses/${courseId}/audio/episode-${i + 1}.mp3`
        
        const { error: uploadError } = await supabase.storage
          .from('audio')
          .upload(audioFileName, audioBlob, {
            contentType: 'audio/mpeg'
          })
        
        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('audio')
            .getPublicUrl(audioFileName)
          audioUrl = urlData.publicUrl
          
          // More accurate duration estimate based on audio size
          // ~16kbps for speech = ~2KB per second
          duration = Math.round(audioBlob.size / 2000)
        }
      }
    } catch (audioError) {
      console.warn(`Audio generation failed for segment ${i + 1}:`, audioError)
    }
    
    // Create scenes from the segment
    const scenes = createScenesFromSegment(segment, photoUrls, episodeId, currentTime)
    
    episodes.push({
      id: episodeId,
      title: segment.title || `Episode ${i + 1}`,
      description: segment.keyPoints?.join('. ') || segment.script.substring(0, 150),
      script: segment.script,
      audioUrl,
      duration,
      scenes
    })
    
    currentTime += duration
  }
  
  onProgress?.(100)
  return episodes
}

/**
 * Generate audio using ElevenLabs via backend
 */
async function generateAudio(text: string, voiceId: string): Promise<Blob | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/process/generate-audio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: text.substring(0, 5000), // ElevenLabs limit
        voiceId
      })
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      if (errorData.skipAudio) {
        return null // Audio generation skipped, continue without audio
      }
      throw new Error('Audio generation failed')
    }
    
    return await response.blob()
  } catch (error) {
    console.warn('Audio generation error:', error)
    return null
  }
}

/**
 * Create scenes from a segment
 */
function createScenesFromSegment(
  segment: { title: string; script: string; keyPoints: string[] },
  photoUrls: string[],
  episodeId: string,
  startTime: number
): GeneratedScene[] {
  const scenes: GeneratedScene[] = []
  
  // Split script into sentences for scenes
  const sentences = segment.script.match(/[^.!?]+[.!?]+/g) || [segment.script]
  const scenesPerEpisode = Math.min(Math.ceil(sentences.length / 3), 6) // Max 6 scenes
  const sentencesPerScene = Math.ceil(sentences.length / scenesPerEpisode)
  
  let sceneStartTime = startTime
  
  for (let i = 0; i < scenesPerEpisode; i++) {
    const sceneScript = sentences
      .slice(i * sentencesPerScene, (i + 1) * sentencesPerScene)
      .join(' ')
      .trim()
    
    if (!sceneScript) continue
    
    const sceneDuration = estimateDuration(sceneScript)
    
    scenes.push({
      id: `${episodeId}-scene-${i + 1}`,
      title: `Scene ${i + 1}`,
      script: sceneScript,
      imageUrl: photoUrls[i % photoUrls.length],
      duration: sceneDuration,
      startTime: sceneStartTime
    })
    
    sceneStartTime += sceneDuration
  }
  
  return scenes
}

/**
 * Save course to Supabase database
 */
async function saveCourseToDatabase(course: {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  episodes: GeneratedEpisode[]
  quizQuestions: GeneratedQuiz[]
  totalDuration: number
  organizationId?: string
}): Promise<GeneratedCourse> {
  try {
    // Insert course
    const { error: courseError } = await supabase
      .from('courses')
      .insert({
        id: course.id,
        title: course.title,
        description: course.description,
        thumbnail_url: course.thumbnailUrl,
        organization_id: course.organizationId || null,
        status: 'published',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    
    if (courseError) {
      console.warn('Course insert warning:', courseError)
    }
    
    // Insert episodes
    for (let i = 0; i < course.episodes.length; i++) {
      const episode = course.episodes[i]
      
      const { error: episodeError } = await supabase
        .from('episodes')
        .insert({
          id: episode.id,
          course_id: course.id,
          title: episode.title,
          description: episode.description,
          episode_order: i + 1,
          duration: episode.duration,
          video_url: episode.audioUrl, // Use audio as "video" for now
          status: 'ready',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      
      if (episodeError) {
        console.warn(`Episode ${i + 1} insert warning:`, episodeError)
      }
      
      // Insert quiz questions for this episode
      const episodeQuizzes = course.quizQuestions.filter((_, qi) => 
        Math.floor(qi / Math.ceil(course.quizQuestions.length / course.episodes.length)) === i
      )
      
      for (const quiz of episodeQuizzes) {
        await supabase
          .from('quiz_questions')
          .insert({
            id: crypto.randomUUID(),
            episode_id: episode.id,
            question_text: quiz.question,
            options: quiz.options,
            correct_answer: quiz.correctAnswer,
            explanation: quiz.explanation,
            trigger_time: quiz.triggerPercentage,
            time_limit: 15,
            created_at: new Date().toISOString()
          })
      }
    }
    
    return {
      id: course.id,
      title: course.title,
      description: course.description,
      thumbnailUrl: course.thumbnailUrl,
      episodes: course.episodes,
      quizQuestions: course.quizQuestions,
      totalDuration: course.totalDuration,
      status: 'ready'
    }
  } catch (error) {
    console.error('Database save error:', error)
    // Return the course even if DB save fails
    return {
      id: course.id,
      title: course.title,
      description: course.description,
      thumbnailUrl: course.thumbnailUrl,
      episodes: course.episodes,
      quizQuestions: course.quizQuestions,
      totalDuration: course.totalDuration,
      status: 'ready'
    }
  }
}

// ============================================
// Helper Functions
// ============================================

function estimateDuration(text: string): number {
  // Average speaking rate: ~150 words per minute
  // Average word length: ~5 characters
  const words = text.length / 5
  const minutes = words / 150
  return Math.max(Math.round(minutes * 60), 10) // Minimum 10 seconds
}

function getDefaultThumbnail(title: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&background=667eea&color=fff&size=400&font-size=0.25`
}

function generateFallbackSegments(text: string, title: string): Array<{ title: string; script: string; keyPoints: string[] }> {
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 50)
  const segments: Array<{ title: string; script: string; keyPoints: string[] }> = []
  
  if (paragraphs.length === 0) {
    // No content, create intro segment
    segments.push({
      title: 'Introduction',
      script: `Welcome to ${title}. This training will cover important concepts and best practices for your professional development. Let's get started with the key topics.`,
      keyPoints: ['Overview of key concepts', 'Best practices', 'Practical applications']
    })
    return segments
  }
  
  const chunkSize = Math.ceil(paragraphs.length / 5)
  
  for (let i = 0; i < 5 && i * chunkSize < paragraphs.length; i++) {
    const chunk = paragraphs.slice(i * chunkSize, (i + 1) * chunkSize).join('\n\n')
    segments.push({
      title: `Section ${i + 1}: Key Concepts`,
      script: chunk.substring(0, 800),
      keyPoints: [
        'Understanding core principles',
        'Applying best practices',
        'Following guidelines'
      ]
    })
  }
  
  return segments
}

function generateFallbackQuizzes(title: string): GeneratedQuiz[] {
  return [
    {
      question: `What is the main focus of ${title}?`,
      options: [
        'Following established procedures',
        'Completing tasks quickly',
        'Working independently',
        'Minimizing communication'
      ],
      correctAnswer: 0,
      explanation: 'Following established procedures ensures consistency and compliance.',
      triggerPercentage: 30
    },
    {
      question: 'What should you do when encountering an unfamiliar situation?',
      options: [
        'Ignore it and move on',
        'Consult the appropriate resources or ask for guidance',
        'Make assumptions and proceed',
        'Wait for someone else to handle it'
      ],
      correctAnswer: 1,
      explanation: 'Consulting resources or asking for guidance ensures proper handling of situations.',
      triggerPercentage: 60
    },
    {
      question: 'What is the best practice for continuous improvement?',
      options: [
        'Avoid feedback',
        'Stay with current methods',
        'Regularly review and update knowledge',
        'Focus only on speed'
      ],
      correctAnswer: 2,
      explanation: 'Regular review and updating of knowledge supports continuous improvement.',
      triggerPercentage: 90
    }
  ]
}

// Export default generator
export const courseGenerator = {
  generateCourse,
  extractTextFromPDF,
  generateAIContent,
  generateAudio
}
