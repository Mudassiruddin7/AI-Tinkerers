/**
 * LearnFlow AI Course Generation Service
 * Handles PDF processing, AI script generation, and audio/video synthesis
 * Uses Claude AI + ElevenLabs + Replicate for professional training content
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
  videoUrl?: string
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
        const audioRange = 15 // 60-75%
        const currentProgress = baseProgress + (segmentProgress * audioRange / 100)
        onProgress?.({ 
          step: 'audio', 
          progress: Math.round(currentProgress), 
          message: `Generating narration... ${Math.round(segmentProgress)}%` 
        })
      }
    )
    
    // Step 5: Generate videos with lip-sync using fal.ai
    onProgress?.({ step: 'video', progress: 75, message: 'Generating AI videos with lip-sync...' })
    
    const episodesWithVideo = await generateEpisodeVideos(
      episodes,
      photoUrls,
      courseId,
      (videoProgress) => {
        const baseProgress = 75
        const videoRange = 15 // 75-90%
        const currentProgress = baseProgress + (videoProgress * videoRange / 100)
        onProgress?.({ 
          step: 'video', 
          progress: Math.round(currentProgress), 
          message: `Generating videos... ${Math.round(videoProgress)}%` 
        })
      }
    )
    
    onProgress?.({ step: 'save', progress: 92, message: 'Saving course to database...' })
    
    // Step 6: Calculate total duration
    const totalDuration = episodesWithVideo.reduce((sum, ep) => sum + ep.duration, 0)
    
    // Step 7: Save to database
    const savedCourse = await saveCourseToDatabase({
      id: courseId,
      title: input.title,
      description: input.description || aiContent.summary,
      thumbnailUrl: photoUrls[0] || getDefaultThumbnail(input.title),
      episodes: episodesWithVideo,
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
      console.log(`🎙️ LearnFlow: Generating audio for episode ${i + 1}/${segments.length}...`)
      console.log(`📝 Script length: ${segment.script.length} characters`)
      
      const audioBlob = await generateAudio(segment.script, voiceId)
      
      if (audioBlob && audioBlob.size > 0) {
        console.log(`✅ LearnFlow audio generated, size: ${audioBlob.size} bytes`)
        
        // Try uploading to Supabase storage first
        const audioFileName = `courses/${courseId}/audio/episode-${i + 1}.mp3`
        
        try {
          // First, try to delete any existing file (in case of re-upload)
          await supabase.storage.from('audio').remove([audioFileName])
        } catch {
          // Ignore delete errors
        }
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('audio')
          .upload(audioFileName, audioBlob, {
            contentType: 'audio/mpeg',
            upsert: true
          })
        
        if (uploadError) {
          console.warn(`⚠️ LearnFlow storage upload failed:`, uploadError.message)
          console.log(`📦 Using base64 data URL as fallback...`)
          
          // Fallback: Convert blob to base64 data URL
          audioUrl = await blobToDataUrl(audioBlob)
        } else {
          console.log(`✅ LearnFlow audio uploaded to storage:`, uploadData?.path)
          const { data: urlData } = supabase.storage
            .from('audio')
            .getPublicUrl(audioFileName)
          audioUrl = urlData.publicUrl
          console.log(`🔗 Audio URL:`, audioUrl)
        }
        
        // More accurate duration estimate based on audio size
        // ~16kbps for speech = ~2KB per second
        duration = Math.max(Math.round(audioBlob.size / 2000), 10)
      } else {
        console.warn(`⚠️ LearnFlow: No audio blob returned for episode ${i + 1}`)
      }
    } catch (audioError) {
      console.warn(`❌ LearnFlow audio generation failed for segment ${i + 1}:`, audioError)
      // Continue without audio - video will still be generated
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
    
    console.log(`📝 LearnFlow Episode ${i + 1} created:`, { 
      title: segment.title, 
      hasAudio: !!audioUrl,
      audioSize: audioUrl ? 'Yes' : 'No',
      duration 
    })
    
    currentTime += duration
  }
  
  onProgress?.(100)
  return episodes
}

/**
 * Convert a Blob to a base64 data URL
 */
async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

/**
 * Generate videos for episodes using Replicate/fal.ai
 * Creates lip-sync videos synced with ElevenLabs audio using LearnFlow AI
 */
async function generateEpisodeVideos(
  episodes: GeneratedEpisode[],
  photoUrls: string[],
  courseId: string,
  onProgress?: (percent: number) => void
): Promise<GeneratedEpisode[]> {
  const episodesWithVideo: GeneratedEpisode[] = []
  
  for (let i = 0; i < episodes.length; i++) {
    const episode = episodes[i]
    
    // Update progress
    onProgress?.(Math.round((i / episodes.length) * 100))
    
    let videoUrl: string | undefined
    
    try {
      console.log(`🎬 LearnFlow: Generating video for episode ${i + 1}/${episodes.length}...`)
      
      // Select a photo for this episode (cycle through available photos)
      const imageUrl = photoUrls[i % photoUrls.length]
      
      // Check if we have audio to sync with (for lip-sync)
      const hasValidAudio = episode.audioUrl && !episode.audioUrl.startsWith('data:')
      
      if (hasValidAudio && imageUrl) {
        // Use SadTalker/D-ID for lip-sync video generation
        console.log(`👄 LearnFlow: Using lip-sync for episode ${i + 1}`)
        
        const response = await fetch(`${API_BASE_URL}/api/process/generate-lipsync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageUrl,
            audioUrl: episode.audioUrl,
            duration: episode.duration
          })
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.videoUrl && data.videoUrl !== 'placeholder') {
            videoUrl = data.videoUrl
            console.log(`✅ LearnFlow lip-sync video generated for episode ${i + 1}:`, videoUrl)
          }
        } else {
          const errorData = await response.json().catch(() => ({}))
          console.warn(`⚠️ LearnFlow lip-sync failed for episode ${i + 1}:`, errorData.error || 'Unknown error')
        }
      }
      
      // Fallback: Use Replicate text-to-video if lip-sync failed or no audio
      if (!videoUrl && imageUrl) {
        console.log(`📹 LearnFlow: Using Replicate video generation for episode ${i + 1}`)
        
        const response = await fetch(`${API_BASE_URL}/api/process/generate-video`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            script: episode.script,
            imageUrl,
            duration: Math.min(episode.duration, 10),
            episodeTitle: episode.title
          })
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.videoUrl && data.videoUrl !== 'placeholder') {
            videoUrl = data.videoUrl
            console.log(`✅ LearnFlow video generated for episode ${i + 1}:`, videoUrl)
          }
        } else {
          const errorData = await response.json().catch(() => ({}))
          console.warn(`⚠️ LearnFlow video generation failed for episode ${i + 1}:`, errorData.error || 'Unknown error')
        }
      }
      
      // If video was generated, optionally upload to Supabase storage for persistence
      if (videoUrl && !videoUrl.includes('supabase')) {
        try {
          // Download video from Replicate/fal.ai URL
          const videoResponse = await fetch(videoUrl)
          if (videoResponse.ok) {
            const videoBlob = await videoResponse.blob()
            
            // Upload to Supabase for better reliability/CDN
            const videoFileName = `courses/${courseId}/videos/episode-${i + 1}.mp4`
            
            const { error: uploadError } = await supabase.storage
              .from('videos')
              .upload(videoFileName, videoBlob, {
                contentType: 'video/mp4',
                upsert: true
              })
            
            if (!uploadError) {
              const { data: urlData } = supabase.storage
                .from('videos')
                .getPublicUrl(videoFileName)
              videoUrl = urlData.publicUrl
              console.log(`📦 LearnFlow video uploaded to Supabase:`, videoUrl)
            } else {
              console.warn(`⚠️ Video upload failed, using direct URL`)
            }
          }
        } catch (uploadErr) {
          console.warn(`⚠️ Could not upload video to Supabase:`, uploadErr)
          // Keep using the Replicate URL directly - it's still valid
        }
      }
      
    } catch (videoError) {
      console.warn(`❌ LearnFlow video generation failed for episode ${i + 1}:`, videoError)
    }
    
    episodesWithVideo.push({
      ...episode,
      videoUrl: videoUrl || episode.audioUrl // Fallback to audio-only if video fails
    })
    
    console.log(`📝 LearnFlow Episode ${i + 1} video status:`, { 
      title: episode.title, 
      hasVideo: !!videoUrl 
    })
  }
  
  onProgress?.(100)
  return episodesWithVideo
}

/**
 * Generate audio using ElevenLabs via backend
 */
async function generateAudio(text: string, voiceId: string): Promise<Blob | null> {
  try {
    // Clean and prepare text for better audio generation
    const cleanedText = text
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 5000) // ElevenLabs limit
    
    if (cleanedText.length < 10) {
      console.warn('⚠️ LearnFlow: Text too short for audio generation')
      return null
    }
    
    console.log(`📤 LearnFlow: Sending audio request, text length: ${cleanedText.length}`)
    
    const response = await fetch(`${API_BASE_URL}/api/process/generate-audio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: cleanedText,
        voiceId
      })
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('❌ LearnFlow audio API error:', response.status, errorData)
      if (errorData.skipAudio) {
        console.log('⚠️ LearnFlow: Audio generation skipped, continuing without audio')
        return null // Audio generation skipped, continue without audio
      }
      throw new Error(errorData.error || 'Audio generation failed')
    }
    
    const blob = await response.blob()
    console.log(`✅ LearnFlow: Audio blob received, size: ${blob.size} bytes, type: ${blob.type}`)
    
    if (blob.size === 0) {
      console.warn('⚠️ LearnFlow: Received empty audio blob')
      return null
    }
    
    return blob
  } catch (error) {
    console.warn('❌ LearnFlow audio generation error:', error)
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
    console.log('Saving course to database:', {
      id: course.id,
      title: course.title,
      episodeCount: course.episodes.length
    })
    
    // Insert course
    const { data: courseData, error: courseError } = await supabase
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
      .select()
    
    if (courseError) {
      console.error('Failed to save course to database:', courseError)
      throw new Error(`Database error: ${courseError.message}. Please check if Supabase is configured correctly.`)
    }
    
    console.log('Course saved successfully:', courseData)
    
    // Insert episodes
    for (let i = 0; i < course.episodes.length; i++) {
      const episode = course.episodes[i]
      
      // Prefer video URL over audio URL
      const mediaUrl = episode.videoUrl || episode.audioUrl || null
      
      console.log(`Saving episode ${i + 1}/${course.episodes.length}:`, {
        title: episode.title,
        hasVideoUrl: !!episode.videoUrl,
        hasAudioUrl: !!episode.audioUrl,
        mediaUrlPreview: mediaUrl ? mediaUrl.substring(0, 100) + '...' : 'NO MEDIA'
      })
      
      const { data: episodeData, error: episodeError } = await supabase
        .from('episodes')
        .insert({
          id: episode.id,
          course_id: course.id,
          title: episode.title,
          description: episode.description,
          episode_order: i + 1,
          duration: episode.duration,
          video_url: mediaUrl,
          status: mediaUrl ? 'ready' : 'processing',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
      
      if (episodeError) {
        console.error(`Failed to save episode ${i + 1}:`, episodeError)
        throw new Error(`Failed to save episode: ${episodeError.message}`)
      }
      
      console.log(`✅ Episode ${i + 1} saved with media:`, episodeData?.[0]?.video_url ? 'YES' : 'NO')
      
      // Insert quiz questions for this episode
      const episodeQuizzes = course.quizQuestions.filter((_, qi) => 
        Math.floor(qi / Math.ceil(course.quizQuestions.length / course.episodes.length)) === i
      )
      
      for (const quiz of episodeQuizzes) {
        const { error: quizError } = await supabase
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
        
        if (quizError) {
          console.warn('Quiz question save warning:', quizError)
        }
      }
    }
    
    console.log('✅ Course and all episodes saved successfully to database!')
    
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
    console.error('❌ Database save error:', error)
    throw error // Re-throw instead of returning partial data
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
    // No content, create intro segment with LearnFlow branding
    segments.push({
      title: 'Introduction',
      script: `Welcome to ${title}, brought to you by LearnFlow AI. This training will cover important concepts and best practices for your professional development. Let's get started with the key topics that will help you succeed.`,
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
