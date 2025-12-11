import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Trophy, 
  CheckCircle, 
  Star, 
  Award,
  Clock,
  Target,
  ChevronRight,
  Share2,
  Download,
  Repeat
} from 'lucide-react'
import { Button, Card, Badge, Progress } from '../../components/ui'
import { useNavigate } from 'react-router-dom'

interface CompletionData {
  courseId: string
  courseTitle: string
  episodeTitle: string
  quizScore: number
  totalQuestions: number
  correctAnswers: number
  timeSpent: number // in seconds
  completedAt: Date
  achievements: Achievement[]
  nextEpisode?: {
    id: string
    title: string
    thumbnail?: string
  }
  certificate?: {
    id: string
    downloadUrl: string
  }
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: 'trophy' | 'star' | 'award' | 'target'
  isNew: boolean
}

interface VideoCompletionScreenProps {
  data: CompletionData
  onRewatch?: () => void
  onNextEpisode?: () => void
  onBackToDashboard?: () => void
}

export function VideoCompletionScreen({
  data,
  onRewatch,
  onNextEpisode,
  onBackToDashboard
}: VideoCompletionScreenProps) {
  const navigate = useNavigate()
  const [showAchievements, setShowAchievements] = useState(false)

  const scorePercentage = Math.round((data.correctAnswers / data.totalQuestions) * 100)
  const isPassing = scorePercentage >= 80
  const isExcellent = scorePercentage >= 90
  const isPerfect = scorePercentage === 100

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getScoreColor = () => {
    if (isPerfect) return 'text-yellow-400'
    if (isExcellent) return 'text-green-400'
    if (isPassing) return 'text-blue-400'
    return 'text-orange-400'
  }

  const getScoreMessage = () => {
    if (isPerfect) return 'Perfect Score! Outstanding!'
    if (isExcellent) return 'Excellent Work!'
    if (isPassing) return 'Great Job!'
    return 'Keep Learning!'
  }

  const getAchievementIcon = (icon: Achievement['icon']) => {
    switch (icon) {
      case 'trophy': return Trophy
      case 'star': return Star
      case 'award': return Award
      case 'target': return Target
      default: return Star
    }
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `Completed: ${data.courseTitle}`,
        text: `I just completed "${data.episodeTitle}" with a score of ${scorePercentage}%!`,
        url: window.location.href
      })
    } catch {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(
        `I just completed "${data.episodeTitle}" from ${data.courseTitle} with a score of ${scorePercentage}%!`
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        {/* Main Completion Card */}
        <Card className="bg-slate-800/90 backdrop-blur border-slate-700 overflow-hidden">
          {/* Header with confetti animation */}
          <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-center overflow-hidden">
            {/* Animated confetti particles */}
            {isPassing && (
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: ['#fbbf24', '#34d399', '#60a5fa', '#f472b6', '#a78bfa'][i % 5],
                      left: `${Math.random() * 100}%`,
                      top: '-10px'
                    }}
                    animate={{
                      y: [0, 400],
                      x: [0, (Math.random() - 0.5) * 100],
                      rotate: [0, 360],
                      opacity: [1, 0]
                    }}
                    transition={{
                      duration: 3,
                      delay: i * 0.1,
                      repeat: Infinity,
                      repeatDelay: 2
                    }}
                  />
                ))}
              </div>
            )}

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
                {isPassing ? (
                  <Trophy className="w-10 h-10 text-yellow-300" />
                ) : (
                  <CheckCircle className="w-10 h-10 text-white" />
                )}
              </div>
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-white mb-2"
            >
              Training Complete!
            </motion.h1>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/80"
            >
              {data.episodeTitle}
            </motion.p>
          </div>

          {/* Score Section */}
          <div className="p-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mb-8"
            >
              <div className={`text-6xl font-bold mb-2 ${getScoreColor()}`}>
                {scorePercentage}%
              </div>
              <p className="text-lg text-slate-300 mb-4">{getScoreMessage()}</p>
              
              <div className="flex justify-center gap-4 text-sm text-slate-400">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  {data.correctAnswers}/{data.totalQuestions} correct
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-blue-400" />
                  {formatTime(data.timeSpent)} spent
                </div>
              </div>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              <div className="flex justify-between text-sm text-slate-400 mb-2">
                <span>Quiz Progress</span>
                <span>{scorePercentage}%</span>
              </div>
              <Progress 
                value={scorePercentage} 
                max={100}
                className={isPassing ? 'bg-green-500' : 'bg-orange-500'}
              />
              {!isPassing && (
                <p className="text-sm text-orange-400 mt-2">
                  Score 80% or higher to pass. Consider rewatching and trying again!
                </p>
              )}
            </motion.div>

            {/* Achievements */}
            {data.achievements.length > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mb-8"
              >
                <button
                  onClick={() => setShowAchievements(!showAchievements)}
                  className="w-full flex items-center justify-between text-left p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-yellow-400" />
                    <span className="font-medium text-white">
                      {data.achievements.filter(a => a.isNew).length} New Achievement
                      {data.achievements.filter(a => a.isNew).length !== 1 ? 's' : ''} Earned!
                    </span>
                  </div>
                  <ChevronRight 
                    className={`w-5 h-5 text-slate-400 transition-transform ${showAchievements ? 'rotate-90' : ''}`}
                  />
                </button>

                {showAchievements && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-2 space-y-2"
                  >
                    {data.achievements.map((achievement, index) => {
                      const Icon = getAchievementIcon(achievement.icon)
                      return (
                        <motion.div
                          key={achievement.id}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg"
                        >
                          <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                            <Icon className="w-5 h-5 text-yellow-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-white">{achievement.title}</span>
                              {achievement.isNew && (
                                <Badge variant="success" size="sm">NEW</Badge>
                              )}
                            </div>
                            <p className="text-sm text-slate-400">{achievement.description}</p>
                          </div>
                        </motion.div>
                      )
                    })}
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Certificate Download */}
            {isPassing && data.certificate && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mb-8 p-4 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Award className="w-8 h-8 text-yellow-400" />
                    <div>
                      <p className="font-medium text-white">Certificate Earned!</p>
                      <p className="text-sm text-slate-400">Download your completion certificate</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(data.certificate?.downloadUrl, '_blank')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Next Episode */}
            {data.nextEpisode && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="mb-8"
              >
                <p className="text-sm text-slate-400 mb-2">Up Next</p>
                <div 
                  className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors"
                  onClick={onNextEpisode}
                >
                  <div className="w-20 h-12 bg-slate-600 rounded flex items-center justify-center">
                    {data.nextEpisode.thumbnail ? (
                      <img 
                        src={data.nextEpisode.thumbnail} 
                        alt={data.nextEpisode.title}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="text-slate-400 text-xs">Episode</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">{data.nextEpisode.title}</p>
                    <p className="text-sm text-slate-400">Continue learning</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              {data.nextEpisode ? (
                <Button
                  className="flex-1"
                  onClick={onNextEpisode || (() => navigate(`/employee/video/${data.nextEpisode?.id}`))}
                >
                  Continue to Next Episode
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  className="flex-1"
                  onClick={onBackToDashboard || (() => navigate('/employee'))}
                >
                  Back to Dashboard
                </Button>
              )}
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={onRewatch}
                >
                  <Repeat className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          </div>
        </Card>

        {/* Footer Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-4 text-center text-sm text-slate-500"
        >
          Completed on {data.completedAt.toLocaleDateString()} at {data.completedAt.toLocaleTimeString()}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default VideoCompletionScreen
