import axios from 'axios'

const N8N_WEBHOOK_PROCESS_PDF = import.meta.env.VITE_N8N_WEBHOOK_PROCESS_PDF
const N8N_WEBHOOK_GENERATE_VIDEO = import.meta.env.VITE_N8N_WEBHOOK_GENERATE_VIDEO

export interface ProcessPDFPayload {
  courseId: string
  episodeId: string
  pdfUrl: string
  employeePhotos: string[]
  voiceId: string
  organizationId: string
}

export interface ProcessingStatus {
  status: 'queued' | 'processing' | 'completed' | 'failed'
  progress: number
  currentStep: string
  error?: string
}

export const n8nWorkflow = {
  // Trigger PDF processing workflow
  async triggerPDFProcessing(payload: ProcessPDFPayload): Promise<{ jobId: string }> {
    if (!N8N_WEBHOOK_PROCESS_PDF) {
      console.warn('n8n webhook URL not configured, simulating processing')
      return { jobId: `sim-${Date.now()}` }
    }

    try {
      const response = await axios.post(N8N_WEBHOOK_PROCESS_PDF, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      return response.data
    } catch (error) {
      console.error('Error triggering n8n workflow:', error)
      throw error
    }
  },

  // Trigger video generation workflow
  async triggerVideoGeneration(episodeId: string, scenes: Array<{
    scriptText: string
    voiceId: string
    imageUrl: string
  }>): Promise<{ jobId: string }> {
    if (!N8N_WEBHOOK_GENERATE_VIDEO) {
      console.warn('n8n webhook URL not configured, simulating video generation')
      return { jobId: `sim-${Date.now()}` }
    }

    try {
      const response = await axios.post(N8N_WEBHOOK_GENERATE_VIDEO, {
        episodeId,
        scenes,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      return response.data
    } catch (error) {
      console.error('Error triggering video generation:', error)
      throw error
    }
  },

  // Poll for processing status
  async getProcessingStatus(jobId: string): Promise<ProcessingStatus> {
    // For simulation when n8n is not configured
    if (jobId.startsWith('sim-')) {
      const elapsed = Date.now() - parseInt(jobId.split('-')[1])
      const totalTime = 30000 // 30 seconds simulation

      if (elapsed >= totalTime) {
        return {
          status: 'completed',
          progress: 100,
          currentStep: 'Done',
        }
      }

      const progress = Math.min(Math.floor((elapsed / totalTime) * 100), 99)
      const steps = [
        'Extracting text from PDF',
        'Analyzing content structure',
        'Generating script segments',
        'Creating audio narration',
        'Assembling video',
        'Generating quiz questions',
      ]
      const stepIndex = Math.floor((progress / 100) * steps.length)

      return {
        status: 'processing',
        progress,
        currentStep: steps[stepIndex] || steps[0],
      }
    }

    // Real n8n status check would go here
    // This would typically call another n8n webhook or check a database
    return {
      status: 'processing',
      progress: 50,
      currentStep: 'Processing...',
    }
  },
}

// Simulated content processing for when n8n is not available
export async function simulateContentProcessing(
  pdfText: string,
  employeePhotos: string[]
): Promise<{
  scenes: Array<{
    id: string
    scriptText: string
    imageUrl: string
    duration: number
  }>
  quizQuestions: Array<{
    question: string
    options: string[]
    correctAnswer: number
  }>
}> {
  // Split content into chunks (simplified)
  const paragraphs = pdfText.split(/\n\n+/).filter(p => p.trim().length > 50)
  const chunkSize = Math.ceil(paragraphs.length / 5) // Aim for ~5 scenes

  const scenes = []
  let photoIndex = 0

  for (let i = 0; i < paragraphs.length; i += chunkSize) {
    const chunk = paragraphs.slice(i, i + chunkSize).join('\n\n')
    if (chunk.trim()) {
      scenes.push({
        id: `scene-${i}`,
        scriptText: chunk.trim(),
        imageUrl: employeePhotos[photoIndex % employeePhotos.length],
        duration: Math.ceil(chunk.length / 15), // Rough estimate: 15 chars per second
      })
      photoIndex++
    }
  }

  // Generate simple quiz questions based on content
  const quizQuestions = [
    {
      question: 'What is the main topic covered in this training?',
      options: [
        'Financial planning',
        'Company policies',
        'Safety procedures',
        'Customer service',
      ],
      correctAnswer: 1,
    },
    {
      question: 'According to the training, what should employees do first?',
      options: [
        'Contact HR',
        'Review documentation',
        'Attend meeting',
        'Complete form',
      ],
      correctAnswer: 1,
    },
    {
      question: 'What is emphasized as most important in this training?',
      options: [
        'Speed of completion',
        'Following procedures',
        'Cost reduction',
        'Team collaboration',
      ],
      correctAnswer: 1,
    },
  ]

  return { scenes, quizQuestions }
}
