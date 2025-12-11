/**
 * Claude AI Integration for Content Processing
 * Handles PDF content chunking, script generation, and quiz creation
 */

import Anthropic from '@anthropic-ai/sdk'

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY

let anthropic: Anthropic | null = null

if (ANTHROPIC_API_KEY) {
  // Note: Using browser-based Claude SDK - ensure proper security in production
  anthropic = new Anthropic({
    apiKey: ANTHROPIC_API_KEY
  })
}

export interface ScriptSegment {
  title: string
  script: string
  keyPoints: string[]
  duration?: number
}

export interface GeneratedQuiz {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  triggerPercentage: number
}

export interface GeneratedContent {
  segments: ScriptSegment[]
  quizQuestions: GeneratedQuiz[]
  summary: string
}

/**
 * Generate engaging training content from source text
 */
export async function generateTrainingContent(
  sourceText: string,
  courseTitle: string,
  options?: {
    numberOfSegments?: number
    numberOfQuizzes?: number
    tone?: 'professional' | 'casual' | 'friendly'
  }
): Promise<GeneratedContent> {
  const { 
    numberOfSegments = 5, 
    numberOfQuizzes = 3,
    tone = 'professional'
  } = options || {}

  if (!anthropic) {
    console.warn('Claude API not configured, returning mock content')
    return generateMockContent(sourceText, numberOfSegments, numberOfQuizzes)
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: buildPrompt(sourceText, courseTitle, numberOfSegments, numberOfQuizzes, tone)
        }
      ]
    })

    const responseText = response.content[0].type === 'text' ? response.content[0].text : ''
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    
    if (!jsonMatch) {
      console.error('Failed to parse Claude response')
      return generateMockContent(sourceText, numberOfSegments, numberOfQuizzes)
    }

    return JSON.parse(jsonMatch[0]) as GeneratedContent
  } catch (error) {
    console.error('Claude API error:', error)
    return generateMockContent(sourceText, numberOfSegments, numberOfQuizzes)
  }
}

/**
 * Generate quiz questions for specific content
 */
export async function generateQuizQuestions(
  content: string,
  numberOfQuestions: number = 3
): Promise<GeneratedQuiz[]> {
  if (!anthropic) {
    return generateMockQuizzes(numberOfQuestions)
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: `You are creating quiz questions for corporate training. Based on the following content, generate ${numberOfQuestions} multiple-choice questions that test comprehension.

Content:
${content.substring(0, 4000)}

Respond with a JSON array of questions:
[
  {
    "question": "Question text",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": 0,
    "explanation": "Why this is correct",
    "triggerPercentage": 30
  }
]

Requirements:
- Make questions practical and scenario-based when possible
- Avoid simple fact recall - test understanding
- Ensure only one correct answer per question
- Spread triggerPercentage values (30%, 60%, 90%)`
        }
      ]
    })

    const responseText = response.content[0].type === 'text' ? response.content[0].text : ''
    const jsonMatch = responseText.match(/\[[\s\S]*\]/)
    
    if (!jsonMatch) {
      return generateMockQuizzes(numberOfQuestions)
    }

    return JSON.parse(jsonMatch[0]) as GeneratedQuiz[]
  } catch (error) {
    console.error('Quiz generation error:', error)
    return generateMockQuizzes(numberOfQuestions)
  }
}

/**
 * Rewrite content segment as conversational narration
 */
export async function rewriteAsNarration(
  segment: string,
  tone: 'professional' | 'casual' | 'friendly' = 'professional'
): Promise<string> {
  if (!anthropic) {
    return segment
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Rewrite the following corporate training content as natural, engaging narration that would sound good when read aloud. Use a ${tone} tone.

Original:
${segment}

Requirements:
- Write in second person (you/your) when appropriate
- Use clear, simple language
- Add transitional phrases
- Keep roughly the same length (200-300 words)
- Make it engaging and conversational
- Don't include any formatting, just the plain text narration`
        }
      ]
    })

    return response.content[0].type === 'text' ? response.content[0].text : segment
  } catch (error) {
    console.error('Narration rewrite error:', error)
    return segment
  }
}

/**
 * Summarize content for video description
 */
export async function summarizeContent(content: string, maxLength: number = 200): Promise<string> {
  if (!anthropic) {
    return content.substring(0, maxLength) + '...'
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: `Summarize the following training content in ${maxLength} characters or less. Make it engaging and highlight the key learning outcomes:

${content.substring(0, 2000)}`
        }
      ]
    })

    return response.content[0].type === 'text' ? response.content[0].text : content.substring(0, maxLength)
  } catch (error) {
    console.error('Summary generation error:', error)
    return content.substring(0, maxLength) + '...'
  }
}

// Helper functions

function buildPrompt(
  sourceText: string,
  courseTitle: string,
  numberOfSegments: number,
  numberOfQuizzes: number,
  tone: string
): string {
  return `You are creating engaging training content for a corporate training video platform.

Course Title: ${courseTitle}
Desired Tone: ${tone}

Source Material:
${sourceText.substring(0, 8000)}

Your task:
1. Break this content into ${numberOfSegments} script segments (200-300 words each)
2. Rewrite each segment as natural, conversational narration - NOT verbatim from the source
3. Generate ${numberOfQuizzes} quiz questions that test comprehension

Respond in this exact JSON format:
{
  "summary": "A brief 1-2 sentence summary of the training",
  "segments": [
    {
      "title": "Segment title (4-6 words)",
      "script": "The full narration script for this segment. Write in second person when appropriate. Make it engaging and conversational.",
      "keyPoints": ["Key point 1", "Key point 2", "Key point 3"]
    }
  ],
  "quizQuestions": [
    {
      "question": "Clear, specific question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Brief explanation of why this is correct",
      "triggerPercentage": 30
    }
  ]
}

Requirements:
- Scripts should sound natural when read aloud
- Use ${tone} language throughout
- Quiz questions should test understanding, not just fact recall
- Make quizzes scenario-based when possible
- Spread quiz triggerPercentage values across the video (30%, 60%, 90%)`
}

function generateMockContent(
  sourceText: string,
  numberOfSegments: number,
  numberOfQuizzes: number
): GeneratedContent {
  const paragraphs = sourceText.split(/\n\n+/).filter(p => p.trim().length > 30)
  const segments: ScriptSegment[] = []
  
  const chunkSize = Math.ceil(paragraphs.length / numberOfSegments)
  
  for (let i = 0; i < numberOfSegments; i++) {
    const chunk = paragraphs.slice(i * chunkSize, (i + 1) * chunkSize).join(' ')
    if (chunk.trim()) {
      segments.push({
        title: `Section ${i + 1}: Key Concepts`,
        script: chunk.substring(0, 500) || `This is segment ${i + 1} of the training. Please ensure your PDF content is properly formatted for best results.`,
        keyPoints: [
          'Understanding core principles',
          'Applying best practices',
          'Following guidelines'
        ]
      })
    }
  }

  // Ensure we have at least one segment
  if (segments.length === 0) {
    segments.push({
      title: 'Introduction',
      script: 'Welcome to this training session. Today we will cover important concepts that will help you in your role.',
      keyPoints: ['Overview', 'Key concepts', 'Best practices']
    })
  }

  return {
    summary: 'This training covers essential concepts and best practices for your professional development.',
    segments,
    quizQuestions: generateMockQuizzes(numberOfQuizzes)
  }
}

function generateMockQuizzes(count: number): GeneratedQuiz[] {
  const quizzes: GeneratedQuiz[] = []
  const triggerPercentages = [30, 60, 90]

  for (let i = 0; i < count; i++) {
    quizzes.push({
      question: `Quiz Question ${i + 1}: What is the most important aspect covered in this section?`,
      options: [
        'Following established procedures',
        'Completing tasks quickly',
        'Working independently',
        'Minimizing communication'
      ],
      correctAnswer: 0,
      explanation: 'Following established procedures ensures consistency and compliance with company standards.',
      triggerPercentage: triggerPercentages[i % triggerPercentages.length]
    })
  }

  return quizzes
}

export const claudeAPI = {
  generateTrainingContent,
  generateQuizQuestions,
  rewriteAsNarration,
  summarizeContent,
  isConfigured: () => !!anthropic
}
