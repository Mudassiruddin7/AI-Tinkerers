import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Course, Episode, UserProgress, User, Organization } from '@/types'

interface AppState {
  // Current user data
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
  
  // Organization data
  organization: Organization | null
  setOrganization: (org: Organization | null) => void
  
  // Courses
  courses: Course[]
  setCourses: (courses: Course[]) => void
  addCourse: (course: Course) => void
  updateCourse: (courseId: string, updates: Partial<Course>) => void
  removeCourse: (courseId: string) => void
  
  // Current viewing state
  currentCourse: Course | null
  setCurrentCourse: (course: Course | null) => void
  currentEpisode: Episode | null
  setCurrentEpisode: (episode: Episode | null) => void
  
  // User progress
  userProgress: UserProgress[]
  setUserProgress: (progress: UserProgress[]) => void
  updateProgress: (episodeId: string, updates: Partial<UserProgress>) => void
  
  // UI State
  sidebarOpen: boolean
  toggleSidebar: () => void
  
  // Processing state
  processingJobs: Map<string, { status: string; progress: number }>
  setProcessingJob: (jobId: string, status: string, progress: number) => void
  removeProcessingJob: (jobId: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Current user
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),
      
      // Organization
      organization: null,
      setOrganization: (org) => set({ organization: org }),
      
      // Courses
      courses: [],
      setCourses: (courses) => set({ courses }),
      addCourse: (course) => set((state) => ({ courses: [...state.courses, course] })),
      updateCourse: (courseId, updates) =>
        set((state) => ({
          courses: state.courses.map((c) =>
            c.id === courseId ? { ...c, ...updates } : c
          ),
        })),
      removeCourse: (courseId) =>
        set((state) => ({
          courses: state.courses.filter((c) => c.id !== courseId),
        })),
      
      // Current viewing
      currentCourse: null,
      setCurrentCourse: (course) => set({ currentCourse: course }),
      currentEpisode: null,
      setCurrentEpisode: (episode) => set({ currentEpisode: episode }),
      
      // User progress
      userProgress: [],
      setUserProgress: (progress) => set({ userProgress: progress }),
      updateProgress: (episodeId, updates) =>
        set((state) => ({
          userProgress: state.userProgress.map((p) =>
            p.episodeId === episodeId ? { ...p, ...updates } : p
          ),
        })),
      
      // UI State
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      // Processing
      processingJobs: new Map(),
      setProcessingJob: (jobId, status, progress) =>
        set((state) => {
          const newJobs = new Map(state.processingJobs)
          newJobs.set(jobId, { status, progress })
          return { processingJobs: newJobs }
        }),
      removeProcessingJob: (jobId) =>
        set((state) => {
          const newJobs = new Map(state.processingJobs)
          newJobs.delete(jobId)
          return { processingJobs: newJobs }
        }),
    }),
    {
      name: 'learnflow-storage',
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
)

// Quiz state for video player
export interface QuizState {
  isQuizActive: boolean
  currentQuestionIndex: number
  answers: Map<string, number>
  answeredQuestions: Record<string, boolean>
  timeRemaining: number
  score: number
  showResult: boolean
  
  startQuiz: (questionIndex: number) => void
  answerQuestion: (questionId: string, answer: number) => void
  setQuestionAnswered: (questionId: string, isCorrect: boolean) => void
  getQuestionResult: (questionId: string) => boolean | undefined
  setTimeRemaining: (time: number) => void
  endQuiz: () => void
  resetQuiz: () => void
}

export const useQuizStore = create<QuizState>((set, get) => ({
  isQuizActive: false,
  currentQuestionIndex: 0,
  answers: new Map(),
  answeredQuestions: {},
  timeRemaining: 15,
  score: 0,
  showResult: false,
  
  startQuiz: (questionIndex) =>
    set({
      isQuizActive: true,
      currentQuestionIndex: questionIndex,
      timeRemaining: 15,
      showResult: false,
    }),
  
  answerQuestion: (questionId, answer) =>
    set((state) => {
      const newAnswers = new Map(state.answers)
      newAnswers.set(questionId, answer)
      return { answers: newAnswers }
    }),
  
  setQuestionAnswered: (questionId, isCorrect) =>
    set((state) => ({
      answeredQuestions: {
        ...state.answeredQuestions,
        [questionId]: isCorrect,
      },
    })),
  
  getQuestionResult: (questionId) => get().answeredQuestions[questionId],
  
  setTimeRemaining: (time) => set({ timeRemaining: time }),
  
  endQuiz: () => set({ isQuizActive: false, showResult: true }),
  
  resetQuiz: () =>
    set({
      isQuizActive: false,
      currentQuestionIndex: 0,
      answers: new Map(),
      answeredQuestions: {},
      timeRemaining: 15,
      score: 0,
      showResult: false,
    }),
}))
