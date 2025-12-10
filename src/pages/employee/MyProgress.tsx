import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Trophy,
  Target,
  Clock,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Play,
  BarChart3,
  Calendar,
} from 'lucide-react'
import { Card, CardContent, CardHeader, Badge, Progress, Button } from '@/components/ui'

export function MyProgress() {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'quizzes'>('overview')

  // Mock progress data
  const overallStats = {
    coursesCompleted: 3,
    totalCourses: 6,
    quizzesPassed: 12,
    totalQuizzes: 15,
    averageScore: 87,
    totalWatchTime: 8.5, // hours
    currentStreak: 5, // days
  }

  const courses = [
    {
      id: '1',
      title: 'Q4 Compliance Training 2024',
      progress: 100,
      score: 92,
      completedAt: '2024-01-15',
      episodes: 5,
      episodesCompleted: 5,
    },
    {
      id: '2',
      title: 'Security Awareness',
      progress: 100,
      score: 88,
      completedAt: '2024-01-10',
      episodes: 4,
      episodesCompleted: 4,
    },
    {
      id: '3',
      title: 'Leadership Essentials',
      progress: 60,
      score: 85,
      completedAt: null,
      episodes: 6,
      episodesCompleted: 4,
    },
    {
      id: '4',
      title: 'Product Knowledge 2024',
      progress: 25,
      score: 90,
      completedAt: null,
      episodes: 8,
      episodesCompleted: 2,
    },
    {
      id: '5',
      title: 'Customer Service Excellence',
      progress: 100,
      score: 82,
      completedAt: '2024-01-08',
      episodes: 5,
      episodesCompleted: 5,
    },
  ]

  const recentQuizzes = [
    { course: 'Leadership Essentials', episode: 'Communication Skills', score: 90, passed: true, date: '2024-01-18' },
    { course: 'Product Knowledge', episode: 'New Features', score: 85, passed: true, date: '2024-01-17' },
    { course: 'Leadership Essentials', episode: 'Team Building', score: 75, passed: true, date: '2024-01-16' },
    { course: 'Q4 Compliance', episode: 'Final Assessment', score: 92, passed: true, date: '2024-01-15' },
    { course: 'Security Awareness', episode: 'Phishing Prevention', score: 60, passed: false, date: '2024-01-14' },
  ]

  const achievements = [
    { icon: Trophy, label: 'First Course Completed', unlocked: true },
    { icon: Target, label: 'Perfect Quiz Score', unlocked: true },
    { icon: TrendingUp, label: '5-Day Streak', unlocked: true },
    { icon: CheckCircle2, label: 'All Compliance Done', unlocked: false },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Progress</h1>
        <p className="text-gray-600 mt-1">Track your learning journey and achievements</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Courses Done</p>
                  <p className="text-xl font-bold text-gray-900">
                    {overallStats.coursesCompleted}/{overallStats.totalCourses}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg. Score</p>
                  <p className="text-xl font-bold text-gray-900">{overallStats.averageScore}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Watch Time</p>
                  <p className="text-xl font-bold text-gray-900">{overallStats.totalWatchTime}h</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Streak</p>
                  <p className="text-xl font-bold text-gray-900">{overallStats.currentStreak} days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-6">
          {(['overview', 'courses', 'quizzes'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Progress Chart Placeholder */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <h2 className="font-semibold text-gray-900">Learning Activity</h2>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>Weekly activity chart</p>
                  <p className="text-sm">Integration with charting library needed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-gray-900">Achievements</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    achievement.unlocked ? 'bg-primary-50' : 'bg-gray-50'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      achievement.unlocked
                        ? 'bg-primary-100 text-primary-600'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    <achievement.icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      achievement.unlocked ? 'text-gray-900' : 'text-gray-400'
                    }`}
                  >
                    {achievement.label}
                  </span>
                  {achievement.unlocked && (
                    <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'courses' && (
        <div className="space-y-4">
          {courses.map((course) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900">{course.title}</h3>
                        {course.progress === 100 ? (
                          <Badge variant="success">Completed</Badge>
                        ) : (
                          <Badge variant="default">In Progress</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>{course.episodesCompleted}/{course.episodes} episodes</span>
                        {course.completedAt && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Completed {course.completedAt}
                            </span>
                          </>
                        )}
                        <span>•</span>
                        <span>Score: {course.score}%</span>
                      </div>
                      <div className="mt-3">
                        <Progress value={course.progress} size="sm" showLabel />
                      </div>
                    </div>
                    <Link to={`/employee/watch/${course.id}/episode/1`}>
                      <Button
                        variant={course.progress === 100 ? 'secondary' : 'primary'}
                        size="sm"
                        leftIcon={<Play className="w-4 h-4" />}
                      >
                        {course.progress === 100 ? 'Review' : 'Continue'}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'quizzes' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Recent Quiz Results</h2>
              <Badge variant="secondary">
                {overallStats.quizzesPassed}/{overallStats.totalQuizzes} passed
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-gray-100">
              {recentQuizzes.map((quiz, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between py-4"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        quiz.passed
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {quiz.passed ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <XCircle className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{quiz.episode}</p>
                      <p className="text-sm text-gray-500">{quiz.course}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${quiz.passed ? 'text-green-600' : 'text-red-600'}`}>
                      {quiz.score}%
                    </p>
                    <p className="text-xs text-gray-400">{quiz.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
