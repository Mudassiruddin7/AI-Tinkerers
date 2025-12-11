/**
 * API Service - Frontend HTTP client for backend communication
 */

import axios, { AxiosInstance, AxiosError } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

class APIService {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Request interceptor for auth tokens
    this.client.interceptors.request.use(
      (config) => {
        // Add Clerk token if available
        const token = localStorage.getItem('clerk-session-token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Handle unauthorized - redirect to sign in
          window.location.href = '/sign-in'
        }
        return Promise.reject(error)
      }
    )
  }

  // Health check
  async checkHealth() {
    const response = await this.client.get('/api/health')
    return response.data
  }

  // ==========================================
  // PDF Processing APIs
  // ==========================================

  async extractTextFromPDF(file: File): Promise<{ text: string; pages: number }> {
    const formData = new FormData()
    formData.append('pdf', file)
    
    const response = await this.client.post('/api/process/extract-text', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  }

  async generateContent(params: {
    text: string
    courseTitle: string
    numberOfSegments?: number
    numberOfQuizzes?: number
  }) {
    const response = await this.client.post('/api/process/generate-content', params)
    return response.data
  }

  async generateAudio(params: { text: string; voiceId?: string }) {
    const response = await this.client.post('/api/process/generate-audio', params, {
      responseType: 'blob'
    })
    return response.data
  }

  async getProcessingStatus(jobId: string) {
    const response = await this.client.get(`/api/process/status/${jobId}`)
    return response.data
  }

  // ==========================================
  // Stripe APIs
  // ==========================================

  async createCheckoutSession(params: {
    priceId: string
    organizationId: string
    customerEmail: string
    successUrl: string
    cancelUrl: string
  }) {
    const response = await this.client.post('/api/stripe/create-checkout-session', params)
    return response.data
  }

  async createPortalSession(params: { customerId: string; returnUrl: string }) {
    const response = await this.client.post('/api/stripe/create-portal-session', params)
    return response.data
  }

  // ==========================================
  // User APIs
  // ==========================================

  async syncUser(params: {
    clerkId: string
    email: string
    firstName?: string
    lastName?: string
    role?: 'admin' | 'employee'
    organizationId?: string
  }) {
    const response = await this.client.post('/api/users/sync', params)
    return response.data
  }

  // ==========================================
  // Analytics APIs
  // ==========================================

  async getAnalytics(organizationId: string) {
    const response = await this.client.get(`/api/analytics/${organizationId}`)
    return response.data
  }

  async exportAnalytics(organizationId: string) {
    const response = await this.client.get(`/api/analytics/${organizationId}/export`, {
      responseType: 'blob'
    })
    
    // Trigger file download
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'training-analytics.csv')
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  }

  // ==========================================
  // Progress APIs
  // ==========================================

  async updateProgress(params: {
    userId: string
    episodeId: string
    courseId: string
    watchedDuration: number
    totalDuration: number
    completed?: boolean
    quizResponses?: Array<{
      questionId: string
      selectedAnswer: number
      correct: boolean
      timeTaken: number
    }>
    score?: number
  }) {
    const response = await this.client.post('/api/progress/update', params)
    return response.data
  }

  async getProgress(userId: string, courseId: string) {
    const response = await this.client.get(`/api/progress/${userId}/${courseId}`)
    return response.data
  }

  // ==========================================
  // Notification APIs
  // ==========================================

  async sendNotification(params: {
    type: 'course_assigned' | 'course_completed' | 'quiz_passed' | 'course_ready'
    userId?: string
    organizationId?: string
    courseId?: string
    message: string
  }) {
    const response = await this.client.post('/api/notifications/send', params)
    return response.data
  }
}

// Export singleton instance
export const api = new APIService()

// Export types
export interface ProcessingJob {
  id: string
  status: 'queued' | 'processing' | 'completed' | 'failed'
  progress: number
  currentStep?: string
  error?: string
  startedAt: string
  completedAt?: string
}

export interface AnalyticsData {
  totalCourses: number
  totalLearners: number
  completionRate: number
  averageScore: number
  topCourses?: Array<{
    title: string
    views: number
    completionRate: number
  }>
  recentActivity?: Array<{
    user: string
    action: string
    course: string
    time: string
  }>
}

export interface UserProgress {
  episodeId: string
  watchedDuration: number
  totalDuration: number
  completed: boolean
  score: number
  lastWatchedAt: string
  completedAt?: string
}
