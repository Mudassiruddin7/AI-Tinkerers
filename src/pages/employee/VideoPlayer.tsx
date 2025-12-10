import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  List,
  X,
} from 'lucide-react'
import { Button, Badge, Card, CardContent } from '@/components/ui'
import { useQuizStore } from '@/store'
import { VideoCompletionScreen } from './VideoCompletionScreen'
import type { Episode, QuizQuestion } from '@/types'

interface QuizOverlayProps {
  question: QuizQuestion
  onAnswer: (optionIndex: number) => void
  timeRemaining: number
  showResult: boolean
  selectedAnswer: number | null
  isCorrect: boolean | null
}

function QuizOverlay({ question, onAnswer, timeRemaining, showResult, selectedAnswer, isCorrect }: QuizOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-20 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl"
      >
        {!showResult ? (
          <>
            {/* Timer */}
            <div className="flex items-center justify-between mb-6">
              <Badge variant="secondary">Quiz Question</Badge>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                <span className={`font-mono text-xl font-bold ${timeRemaining <= 5 ? 'text-red-500' : 'text-gray-700'}`}>
                  {timeRemaining}s
                </span>
              </div>
            </div>

            {/* Question */}
            <h2 className="text-xl font-bold text-gray-900 mb-6">{question.question}</h2>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => onAnswer(index)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    selectedAnswer === index
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="inline-flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-medium text-gray-600">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-gray-800">{option}</span>
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Progress bar for timer */}
            <div className="mt-6">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-orange-500"
                  initial={{ width: '100%' }}
                  animate={{ width: `${(timeRemaining / 15) * 100}%` }}
                  transition={{ duration: 1, ease: 'linear' }}
                />
              </div>
            </div>
          </>
        ) : (
          // Result View
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {isCorrect ? (
              <>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Correct!</h3>
                <p className="text-gray-600">Great job! Keep up the good work.</p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Not Quite</h3>
                <p className="text-gray-600 mb-4">
                  The correct answer was: <span className="font-medium">{question.options[question.correctOption ?? 0]}</span>
                </p>
              </>
            )}
            {question.explanation && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg text-left">
                <p className="text-sm text-gray-600"><strong>Explanation:</strong> {question.explanation}</p>
              </div>
            )}
            <p className="text-sm text-gray-400 mt-4">Resuming video in a moment...</p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}

export function VideoPlayer() {
  const { courseId, episodeId } = useParams()
  const navigate = useNavigate()
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { answeredQuestions, setQuestionAnswered, getQuestionResult, resetQuiz } = useQuizStore()

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [showEpisodeList, setShowEpisodeList] = useState(false)
  const [activeQuiz, setActiveQuiz] = useState<QuizQuestion | null>(null)
  const [quizTimeRemaining, setQuizTimeRemaining] = useState(15)
  const [showQuizResult, setShowQuizResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [triggeredQuizzes, setTriggeredQuizzes] = useState<Set<string>>(new Set())
  const [showCompletionScreen, setShowCompletionScreen] = useState(false)
  const [watchStartTime] = useState(Date.now())

  // Mock episode data
  const episode: Episode = {
    id: episodeId || '1',
    courseId: courseId || '1',
    title: 'Introduction to Compliance',
    description: 'Understanding the basics of corporate compliance and why it matters.',
    orderIndex: 0,
    videoUrl: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
    duration: 60,
    thumbnailUrl: '',
    transcript: '',
    status: 'ready',
    scenes: [],
    quizQuestions: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // Mock quiz questions with trigger percentages
  const quizQuestions: QuizQuestion[] = [
    {
      id: 'q1',
      episodeId: episodeId || '1',
      question: 'What is the primary purpose of corporate compliance training?',
      options: [
        'To waste employee time',
        'To ensure employees understand and follow legal and ethical guidelines',
        'To reduce employee productivity',
        'To increase paperwork',
      ],
      correctOption: 1,
      triggerTime: 25, // 25% of video
      timeLimit: 15,
      explanation: 'Compliance training helps ensure all employees understand and adhere to legal, regulatory, and ethical standards that govern the organization.',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'q2',
      episodeId: episodeId || '1',
      question: 'Who is responsible for maintaining compliance in an organization?',
      options: [
        'Only the legal department',
        'Only senior management',
        'Everyone in the organization',
        'Only HR',
      ],
      correctOption: 2,
      triggerTime: 60, // 60% of video
      timeLimit: 15,
      explanation: 'Compliance is a shared responsibility. While specific departments may oversee compliance programs, every employee plays a role in maintaining ethical standards.',
      createdAt: new Date().toISOString(),
    },
  ]

  // Mock episodes list
  const episodes = [
    { id: '1', title: 'Introduction to Compliance', duration: 120, completed: true },
    { id: '2', title: 'Understanding Regulations', duration: 180, completed: false },
    { id: '3', title: 'Best Practices', duration: 150, completed: false },
    { id: '4', title: 'Case Studies', duration: 200, completed: false },
    { id: '5', title: 'Final Assessment', duration: 90, completed: false },
  ]

  // Control visibility timer
  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (showControls && isPlaying && !activeQuiz) {
      timeout = setTimeout(() => setShowControls(false), 3000)
    }
    return () => clearTimeout(timeout)
  }, [showControls, isPlaying, activeQuiz])

  // Quiz timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (activeQuiz && !showQuizResult && quizTimeRemaining > 0) {
      interval = setInterval(() => {
        setQuizTimeRemaining((prev) => {
          if (prev <= 1) {
            // Time's up - treat as wrong answer
            handleQuizAnswer(-1)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [activeQuiz, showQuizResult, quizTimeRemaining])

  // Check for quiz triggers based on video progress percentage
  useEffect(() => {
    if (duration === 0 || activeQuiz) return

    const progressPercent = (currentTime / duration) * 100

    for (const quiz of quizQuestions) {
      const quizKey = `${episodeId}-${quiz.id}`
      const previousResult = getQuestionResult(quiz.id)
      
      // Trigger quiz if we've reached the trigger point and haven't already triggered it
      if (
        progressPercent >= quiz.triggerTime &&
        !triggeredQuizzes.has(quizKey) &&
        !previousResult
      ) {
        // Pause video and show quiz
        videoRef.current?.pause()
        setIsPlaying(false)
        setActiveQuiz(quiz)
        setQuizTimeRemaining(quiz.timeLimit || 15)
        setShowQuizResult(false)
        setSelectedAnswer(null)
        setIsCorrect(null)
        setTriggeredQuizzes((prev) => new Set([...prev, quizKey]))
      }
    }
  }, [currentTime, duration, activeQuiz, episodeId, triggeredQuizzes, getQuestionResult])

  const handleQuizAnswer = (optionIndex: number) => {
    if (!activeQuiz || showQuizResult) return

    const correct = optionIndex === activeQuiz.correctOption
    setSelectedAnswer(optionIndex)
    setIsCorrect(correct)
    setShowQuizResult(true)

    // Save result
    setQuestionAnswered(activeQuiz.id, correct)

    // Auto-dismiss after 3 seconds and resume video
    setTimeout(() => {
      setActiveQuiz(null)
      setShowQuizResult(false)
      videoRef.current?.play()
      setIsPlaying(true)
    }, 3000)
  }

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      containerRef.current.requestFullscreen()
    }
  }

  const handleTimeUpdate = () => {
    if (!videoRef.current) return
    setCurrentTime(videoRef.current.currentTime)
  }

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return
    setDuration(videoRef.current.duration)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return
    const time = parseFloat(e.target.value)
    videoRef.current.currentTime = time
    setCurrentTime(time)
  }

  const skipTime = (seconds: number) => {
    if (!videoRef.current) return
    videoRef.current.currentTime = Math.max(0, Math.min(duration, currentTime + seconds))
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const currentEpisodeIndex = episodes.findIndex((ep) => ep.id === episodeId)
  const prevEpisode = episodes[currentEpisodeIndex - 1]
  const nextEpisode = episodes[currentEpisodeIndex + 1]

  // Calculate quiz results for completion screen
  const calculateQuizResults = () => {
    let correctCount = 0
    quizQuestions.forEach(q => {
      const result = getQuestionResult(q.id)
      if (result === true) correctCount++
    })
    return {
      total: quizQuestions.length,
      correct: correctCount,
      score: quizQuestions.length > 0 ? Math.round((correctCount / quizQuestions.length) * 100) : 100
    }
  }

  // Handle video ended
  const handleVideoEnded = () => {
    setIsPlaying(false)
    // Show completion screen if all quizzes are answered
    const allQuizzesAnswered = quizQuestions.every(q => getQuestionResult(q.id) !== undefined)
    if (allQuizzesAnswered || quizQuestions.length === 0) {
      setShowCompletionScreen(true)
    }
  }

  // Handle rewatch
  const handleRewatch = () => {
    setShowCompletionScreen(false)
    setTriggeredQuizzes(new Set())
    resetQuiz()
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  // Handle next episode
  const handleNextEpisode = () => {
    if (nextEpisode) {
      resetQuiz()
      navigate(`/employee/watch/${courseId}/episode/${nextEpisode.id}`)
    } else {
      navigate('/employee')
    }
  }

  // Completion screen data
  const completionData = showCompletionScreen ? {
    courseId: courseId || '',
    courseTitle: 'Corporate Compliance Training',
    episodeTitle: episode.title,
    quizScore: calculateQuizResults().score,
    totalQuestions: quizQuestions.length,
    correctAnswers: calculateQuizResults().correct,
    timeSpent: Math.round((Date.now() - watchStartTime) / 1000),
    completedAt: new Date(),
    achievements: calculateQuizResults().score === 100 ? [
      {
        id: 'perfect',
        title: 'Perfect Score',
        description: 'Answered all questions correctly',
        icon: 'trophy' as const,
        isNew: true
      }
    ] : calculateQuizResults().score >= 80 ? [
      {
        id: 'passed',
        title: 'Quiz Passed',
        description: 'Scored 80% or higher',
        icon: 'star' as const,
        isNew: true
      }
    ] : [],
    nextEpisode: nextEpisode ? {
      id: nextEpisode.id,
      title: nextEpisode.title
    } : undefined
  } : null

  // Show completion screen
  if (showCompletionScreen && completionData) {
    return (
      <VideoCompletionScreen
        data={completionData}
        onRewatch={handleRewatch}
        onNextEpisode={handleNextEpisode}
        onBackToDashboard={() => navigate('/employee')}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Video Container */}
      <div
        ref={containerRef}
        className="relative w-full aspect-video max-h-[calc(100vh-200px)] bg-black"
        onMouseMove={() => setShowControls(true)}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          className="w-full h-full"
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={handleVideoEnded}
          onClick={togglePlay}
        />

        {/* Quiz Overlay */}
        <AnimatePresence>
          {activeQuiz && (
            <QuizOverlay
              question={activeQuiz}
              onAnswer={handleQuizAnswer}
              timeRemaining={quizTimeRemaining}
              showResult={showQuizResult}
              selectedAnswer={selectedAnswer}
              isCorrect={isCorrect}
            />
          )}
        </AnimatePresence>

        {/* Video Controls */}
        <AnimatePresence>
          {showControls && !activeQuiz && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"
            >
              {/* Top Bar */}
              <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
                <Link
                  to="/employee"
                  className="text-white/80 hover:text-white flex items-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back to Courses
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEpisodeList(!showEpisodeList)}
                  className="text-white/80 hover:text-white"
                >
                  <List className="w-5 h-5 mr-2" />
                  Episodes
                </Button>
              </div>

              {/* Center Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={togglePlay}
                  className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-10 h-10 text-white" />
                  ) : (
                    <Play className="w-10 h-10 text-white ml-1" />
                  )}
                </motion.button>
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
                {/* Progress Bar */}
                <div className="relative group">
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-500 group-hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                    style={{
                      background: `linear-gradient(to right, rgb(var(--color-primary-500)) ${(currentTime / duration) * 100}%, rgba(255,255,255,0.3) ${(currentTime / duration) * 100}%)`,
                    }}
                  />
                  {/* Quiz markers */}
                  {quizQuestions.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-yellow-500 rounded-full"
                      style={{ left: `${quiz.triggerTime}%` }}
                      title="Quiz question"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Skip Back */}
                    <button
                      onClick={() => skipTime(-10)}
                      className="text-white/80 hover:text-white"
                    >
                      <SkipBack className="w-5 h-5" />
                    </button>

                    {/* Play/Pause */}
                    <button onClick={togglePlay} className="text-white">
                      {isPlaying ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6" />
                      )}
                    </button>

                    {/* Skip Forward */}
                    <button
                      onClick={() => skipTime(10)}
                      className="text-white/80 hover:text-white"
                    >
                      <SkipForward className="w-5 h-5" />
                    </button>

                    {/* Volume */}
                    <button onClick={toggleMute} className="text-white/80 hover:text-white">
                      {isMuted ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>

                    {/* Time */}
                    <span className="text-white/80 text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Fullscreen */}
                    <button
                      onClick={toggleFullscreen}
                      className="text-white/80 hover:text-white"
                    >
                      <Maximize className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Episode List Sidebar */}
        <AnimatePresence>
          {showEpisodeList && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute top-0 right-0 bottom-0 w-80 bg-gray-900/95 backdrop-blur-sm overflow-y-auto"
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-white font-semibold">Episodes</h3>
                <button
                  onClick={() => setShowEpisodeList(false)}
                  className="text-white/60 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-2">
                {episodes.map((ep, index) => (
                  <Link
                    key={ep.id}
                    to={`/employee/watch/${courseId}/episode/${ep.id}`}
                    onClick={() => setShowEpisodeList(false)}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      ep.id === episodeId
                        ? 'bg-primary-600/20 text-white'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="w-8 h-8 flex items-center justify-center rounded bg-white/10 text-sm font-medium">
                      {ep.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      ) : (
                        index + 1
                      )}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{ep.title}</p>
                      <p className="text-xs text-white/50">{formatTime(ep.duration)}</p>
                    </div>
                    {ep.id === episodeId && (
                      <Play className="w-4 h-4 text-primary-400" />
                    )}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Episode Info */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{episode.title}</h1>
            <p className="text-gray-400 mt-2">{episode.description}</p>
          </div>
          <div className="flex items-center gap-3">
            {prevEpisode && (
              <Link to={`/employee/watch/${courseId}/episode/${prevEpisode.id}`}>
                <Button variant="secondary" leftIcon={<ChevronLeft className="w-4 h-4" />}>
                  Previous
                </Button>
              </Link>
            )}
            {nextEpisode && (
              <Link to={`/employee/watch/${courseId}/episode/${nextEpisode.id}`}>
                <Button rightIcon={<ChevronRight className="w-4 h-4" />}>
                  Next Episode
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Quiz Progress */}
        <Card className="mt-6 bg-gray-800 border-gray-700">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Quiz Progress</h3>
                <p className="text-gray-400 text-sm mt-1">
                  {Object.keys(answeredQuestions).length} of {quizQuestions.length} questions answered
                </p>
              </div>
              <div className="flex items-center gap-2">
                {quizQuestions.map((quiz) => {
                  const result = getQuestionResult(quiz.id)
                  return (
                    <div
                      key={quiz.id}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        result === undefined
                          ? 'bg-gray-700'
                          : result
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {result === undefined ? (
                        <span className="text-xs text-gray-500">?</span>
                      ) : result ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
