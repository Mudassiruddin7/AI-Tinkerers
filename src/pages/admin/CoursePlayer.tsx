import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  BookOpen,
  Clock,
  List,
} from 'lucide-react'
import { Card, CardContent, Button, Badge } from '@/components/ui'
import { supabase } from '@/lib/supabase'

interface Episode {
  id: string
  title: string
  description: string
  episode_order: number
  duration: number
  video_url: string | null
  status: string
}

interface QuizQuestion {
  id: string
  question_text: string
  options: string[]
  correct_answer: number
  explanation: string
  trigger_time: number
}

interface Course {
  id: string
  title: string
  description: string
  thumbnail_url: string
}

export function CoursePlayer() {
  const { courseId } = useParams<{ courseId: string }>()
  const audioRef = useRef<HTMLAudioElement>(null)
  
  const [course, setCourse] = useState<Course | null>(null)
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [quizzes, setQuizzes] = useState<Record<string, QuizQuestion[]>>({})
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showQuiz, setShowQuiz] = useState(false)
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [quizResult, setQuizResult] = useState<'correct' | 'incorrect' | null>(null)
  const [completedEpisodes, setCompletedEpisodes] = useState<Set<string>>(new Set())
  const [showEpisodeList, setShowEpisodeList] = useState(false)
  const [loading, setLoading] = useState(true)

  const currentEpisode = episodes[currentEpisodeIndex]

  // Fetch course data
  useEffect(() => {
    async function fetchCourse() {
      if (!courseId) return
      
      setLoading(true)
      try {
        // Fetch course
        const { data: courseData } = await supabase
          .from('courses')
          .select('*')
          .eq('id', courseId)
          .single()
        
        if (courseData) {
          setCourse(courseData)
        }

        // Fetch episodes
        const { data: episodesData } = await supabase
          .from('episodes')
          .select('*')
          .eq('course_id', courseId)
          .order('episode_order', { ascending: true })
        
        if (episodesData) {
          setEpisodes(episodesData)
          
          // Fetch quizzes for all episodes
          const quizzesByEpisode: Record<string, QuizQuestion[]> = {}
          for (const ep of episodesData) {
            const { data: quizData } = await supabase
              .from('quiz_questions')
              .select('*')
              .eq('episode_id', ep.id)
            
            if (quizData) {
              quizzesByEpisode[ep.id] = quizData
            }
          }
          setQuizzes(quizzesByEpisode)
        }
      } catch (error) {
        console.error('Error fetching course:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [courseId])

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
      
      // Check for quiz triggers
      if (currentEpisode && quizzes[currentEpisode.id]) {
        const progress = (audio.currentTime / audio.duration) * 100
        const episodeQuizzes = quizzes[currentEpisode.id]
        
        for (const quiz of episodeQuizzes) {
          if (progress >= quiz.trigger_time - 1 && progress <= quiz.trigger_time + 1) {
            if (!showQuiz && currentQuiz?.id !== quiz.id) {
              setCurrentQuiz(quiz)
              setShowQuiz(true)
              audio.pause()
              setIsPlaying(false)
            }
            break
          }
        }
      }
    }

    const handleDurationChange = () => {
      setDuration(audio.duration)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      if (currentEpisode) {
        setCompletedEpisodes(prev => new Set([...prev, currentEpisode.id]))
      }
      // Auto-advance to next episode
      if (currentEpisodeIndex < episodes.length - 1) {
        setTimeout(() => {
          setCurrentEpisodeIndex(prev => prev + 1)
        }, 2000)
      }
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('durationchange', handleDurationChange)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('durationchange', handleDurationChange)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [currentEpisode, quizzes, showQuiz, currentQuiz, currentEpisodeIndex, episodes.length])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    seekTo(percent * duration)
  }

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null || !currentQuiz) return
    
    const isCorrect = selectedAnswer === currentQuiz.correct_answer
    setQuizResult(isCorrect ? 'correct' : 'incorrect')
    
    setTimeout(() => {
      setShowQuiz(false)
      setSelectedAnswer(null)
      setQuizResult(null)
      setCurrentQuiz(null)
      // Resume playback
      if (audioRef.current) {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }, 3000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const goToEpisode = (index: number) => {
    setCurrentEpisodeIndex(index)
    setShowEpisodeList(false)
    setCurrentTime(0)
    if (audioRef.current) {
      audioRef.current.currentTime = 0
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!course || episodes.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Course Not Found</h2>
            <p className="text-gray-600 mb-4">This course doesn't exist or has no episodes.</p>
            <Link to="/admin">
              <Button>Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-white/10 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/admin" className="text-white/70 hover:text-white flex items-center gap-2">
            <ChevronLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <h1 className="text-white font-medium truncate max-w-md">{course.title}</h1>
          <button
            onClick={() => setShowEpisodeList(!showEpisodeList)}
            className="text-white/70 hover:text-white flex items-center gap-2"
          >
            <List className="w-5 h-5" />
            Episodes
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 grid lg:grid-cols-3 gap-6">
        {/* Main Player */}
        <div className="lg:col-span-2 space-y-4">
          {/* Video/Audio Display */}
          <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{ backgroundImage: `url(${course.thumbnail_url})` }}
            />
            
            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
              <motion.div
                key={currentEpisode?.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl"
              >
                <Badge variant="info" className="mb-4">
                  Episode {currentEpisodeIndex + 1} of {episodes.length}
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  {currentEpisode?.title}
                </h2>
                <p className="text-white/70 text-sm md:text-base">
                  {currentEpisode?.description}
                </p>
              </motion.div>

              {/* Audio Visualizer */}
              {isPlaying && (
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-end gap-1 h-12">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-primary-500 rounded-full"
                      animate={{
                        height: [10, Math.random() * 40 + 10, 10],
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.05,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Play Button Overlay */}
            {!isPlaying && !showQuiz && (
              <button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center group"
              >
                <div className="w-20 h-20 bg-primary-500/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-10 h-10 text-white ml-1" />
                </div>
              </button>
            )}

            {/* Audio Element */}
            {currentEpisode?.video_url && (
              <audio
                ref={audioRef}
                src={currentEpisode.video_url}
                preload="metadata"
              />
            )}
          </div>

          {/* Player Controls */}
          <Card className="bg-gray-800/50 backdrop-blur border-white/10">
            <CardContent className="p-4">
              {/* Progress Bar */}
              <div 
                className="h-2 bg-gray-700 rounded-full cursor-pointer mb-4 group"
                onClick={handleProgressClick}
              >
                <div 
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full relative"
                  style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => currentEpisodeIndex > 0 && goToEpisode(currentEpisodeIndex - 1)}
                    disabled={currentEpisodeIndex === 0}
                    className="text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <SkipBack className="w-6 h-6" />
                  </button>
                  
                  <button
                    onClick={togglePlay}
                    className="w-14 h-14 bg-primary-500 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-7 h-7 text-white" />
                    ) : (
                      <Play className="w-7 h-7 text-white ml-1" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => currentEpisodeIndex < episodes.length - 1 && goToEpisode(currentEpisodeIndex + 1)}
                    disabled={currentEpisodeIndex === episodes.length - 1}
                    className="text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <SkipForward className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-white/70 text-sm font-mono">
                    {formatTime(currentTime)} / {formatTime(duration || currentEpisode?.duration || 0)}
                  </span>
                  
                  <button
                    onClick={toggleMute}
                    className="text-white/70 hover:text-white"
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* No Audio Warning */}
          {!currentEpisode?.video_url && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-yellow-200 text-sm">
              ⚠️ Audio narration not available for this episode. Configure ElevenLabs API to generate voice.
            </div>
          )}
        </div>

        {/* Episode List Sidebar */}
        <div className={`lg:block ${showEpisodeList ? 'block' : 'hidden'}`}>
          <Card className="bg-gray-800/50 backdrop-blur border-white/10 sticky top-4">
            <CardContent className="p-4">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Course Episodes
              </h3>
              
              <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                {episodes.map((episode, index) => (
                  <button
                    key={episode.id}
                    onClick={() => goToEpisode(index)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      index === currentEpisodeIndex
                        ? 'bg-primary-500/20 border border-primary-500/50'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        completedEpisodes.has(episode.id)
                          ? 'bg-green-500/20 text-green-400'
                          : index === currentEpisodeIndex
                          ? 'bg-primary-500 text-white'
                          : 'bg-white/10 text-white/50'
                      }`}>
                        {completedEpisodes.has(episode.id) ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <span className="text-sm">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          index === currentEpisodeIndex ? 'text-white' : 'text-white/70'
                        }`}>
                          {episode.title}
                        </p>
                        <p className="text-xs text-white/50 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {Math.round(episode.duration / 60)} min
                          {quizzes[episode.id]?.length > 0 && (
                            <span className="ml-2">• {quizzes[episode.id].length} quiz</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Progress Summary */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex justify-between text-sm text-white/70 mb-2">
                  <span>Progress</span>
                  <span>{completedEpisodes.size} / {episodes.length} completed</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all"
                    style={{ width: `${(completedEpisodes.size / episodes.length) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quiz Modal */}
      <AnimatePresence>
        {showQuiz && currentQuiz && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-2xl max-w-lg w-full overflow-hidden"
            >
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4">
                <h3 className="text-white font-semibold text-lg">📝 Quick Quiz</h3>
                <p className="text-white/80 text-sm">Test your understanding</p>
              </div>
              
              <div className="p-6">
                <p className="text-white text-lg mb-6">{currentQuiz.question_text}</p>
                
                <div className="space-y-3">
                  {currentQuiz.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => !quizResult && setSelectedAnswer(index)}
                      disabled={quizResult !== null}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        quizResult !== null
                          ? index === currentQuiz.correct_answer
                            ? 'border-green-500 bg-green-500/20'
                            : index === selectedAnswer
                            ? 'border-red-500 bg-red-500/20'
                            : 'border-white/10 bg-white/5'
                          : selectedAnswer === index
                          ? 'border-primary-500 bg-primary-500/20'
                          : 'border-white/10 bg-white/5 hover:border-white/30'
                      }`}
                    >
                      <span className={`${
                        quizResult !== null && index === currentQuiz.correct_answer
                          ? 'text-green-400'
                          : quizResult !== null && index === selectedAnswer
                          ? 'text-red-400'
                          : 'text-white'
                      }`}>
                        {String.fromCharCode(65 + index)}. {option}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Result Display */}
                {quizResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 p-4 rounded-lg flex items-start gap-3 ${
                      quizResult === 'correct'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {quizResult === 'correct' ? (
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium">
                        {quizResult === 'correct' ? 'Correct!' : 'Not quite right'}
                      </p>
                      <p className="text-sm opacity-80">{currentQuiz.explanation}</p>
                    </div>
                  </motion.div>
                )}

                {/* Submit Button */}
                {!quizResult && (
                  <Button
                    onClick={handleAnswerSubmit}
                    disabled={selectedAnswer === null}
                    className="w-full mt-6"
                  >
                    Submit Answer
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
