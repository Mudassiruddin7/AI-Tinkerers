// User Types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'employee'
  organizationId: string
  avatarUrl?: string
  consentGiven: boolean
  consentDate?: string
  voiceSampleUrl?: string
  createdAt: string
}

// Organization Types
export interface Organization {
  id: string
  name: string
  logo?: string
  stripeCustomerId?: string
  subscriptionStatus: 'trial' | 'active' | 'past_due' | 'cancelled'
  subscriptionPlan: 'starter' | 'professional' | 'enterprise'
  maxSeats: number
  usedSeats: number
  createdAt: string
}

// Course Types
export interface Course {
  id: string
  organizationId: string
  title: string
  description?: string
  thumbnailUrl?: string
  status: 'draft' | 'processing' | 'published' | 'archived'
  createdBy: string
  createdAt: string
  updatedAt: string
  episodes: Episode[]
  episodeCount?: number
  totalDuration?: number
  category?: string
}

// Episode Types
export interface Episode {
  id: string
  courseId: string
  title: string
  description?: string
  orderIndex?: number
  order?: number
  videoUrl?: string
  thumbnailUrl?: string
  duration: number // in seconds
  transcript?: string
  status: 'draft' | 'processing' | 'ready' | 'failed'
  processingProgress?: number
  scenes: Scene[]
  quizQuestions: QuizQuestion[]
  createdAt: string
  updatedAt: string
}

// Scene Types
export interface Scene {
  id: string
  episodeId: string
  order: number
  scriptText: string
  voiceId: string
  audioUrl?: string
  imageUrl?: string // Employee photo or generated image
  duration: number // in seconds
  startTime: number // start time in the video
}

// Quiz Types
export interface QuizQuestion {
  id: string
  episodeId: string
  question: string
  options: string[]
  correctAnswer?: number // index of correct option
  correctOption?: number // alternative name for correct answer index
  timeLimit?: number // in seconds
  triggerTime: number // when to show quiz (percentage of video)
  explanation?: string
  createdAt?: string
}

// Progress Types
export interface UserProgress {
  id: string
  userId: string
  episodeId: string
  courseId: string
  watchedDuration: number
  totalDuration: number
  completed: boolean
  completedAt?: string
  quizResponses: QuizResponse[]
  score: number
  lastWatchedAt: string
}

export interface QuizResponse {
  questionId: string
  selectedAnswer: number
  correct: boolean
  timeSpent: number
  answeredAt: string
}

// Upload Types
export interface UploadedFile {
  id: string
  fileName: string
  fileType: 'pdf' | 'docx' | 'pptx' | 'image'
  fileUrl: string
  fileSize: number
  status: 'uploading' | 'uploaded' | 'processing' | 'processed' | 'failed'
  extractedText?: string
  uploadedAt: string
}

export interface EmployeePhoto {
  id: string
  employeeId?: string
  employeeName: string
  photoUrl: string
  uploadedAt: string
}

// Consent Types
export interface ConsentRecord {
  id: string
  userId: string
  organizationId: string
  consentType: 'likeness' | 'voice' | 'both'
  granted: boolean
  grantedAt?: string
  revokedAt?: string
  expiresAt?: string
  ipAddress?: string
  userAgent?: string
}

// Analytics Types
export interface AnalyticsData {
  totalCourses: number
  totalEpisodes: number
  totalLearners: number
  averageCompletionRate: number
  averageQuizScore: number
  completionTrend: { date: string; rate: number }[]
  topEpisodes: { episodeId: string; title: string; views: number; completionRate: number }[]
  recentActivity: ActivityItem[]
}

export interface ActivityItem {
  id: string
  userId: string
  userName: string
  action: 'started' | 'completed' | 'quiz_passed' | 'quiz_failed'
  episodeTitle: string
  timestamp: string
}

// Processing Types
export interface ProcessingJob {
  id: string
  episodeId: string
  status: 'queued' | 'extracting_text' | 'generating_script' | 'generating_audio' | 'assembling_video' | 'creating_quizzes' | 'completed' | 'failed'
  progress: number
  error?: string
  startedAt: string
  completedAt?: string
}

// Subscription Types
export interface SubscriptionPlan {
  id: string
  name: string
  priceMonthly: number
  priceYearly: number
  maxSeats: number
  maxCourses: number
  maxStorageGB: number
  features: string[]
}

// Notification Types
export interface Notification {
  id: string
  userId: string
  type: 'course_published' | 'quiz_reminder' | 'consent_request' | 'system'
  title: string
  message: string
  read: boolean
  actionUrl?: string
  createdAt: string
}
