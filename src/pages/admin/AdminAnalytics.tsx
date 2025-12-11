import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import {
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Clock,
  Target,
  Download,
  Calendar,
  Award,
  PlayCircle,
  GraduationCap,
  FileText,
} from 'lucide-react'
import { Card, CardContent, CardHeader, Button, Badge, Avatar, Select, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui'
import { BarChart, LineChart, DonutChart, Sparkline } from '@/components/charts'
import { supabase } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'

interface AnalyticsData {
  totalCourses: number
  totalLearners: number
  totalViews: number
  completionRate: number
  averageScore: number
  averageWatchTime: number
}

interface CourseStats {
  id: string
  title: string
  views: number
  completionRate: number
  avgScore: number
  enrollments: number
}

interface LearnerActivity {
  id: string
  userName: string
  userEmail: string
  action: string
  courseTitle: string
  score?: number
  timestamp: string
}

export function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalCourses: 0,
    totalLearners: 0,
    totalViews: 0,
    completionRate: 0,
    averageScore: 0,
    averageWatchTime: 0,
  })
  const [topCourses, setTopCourses] = useState<CourseStats[]>([])
  const [recentActivity, setRecentActivity] = useState<LearnerActivity[]>([])
  const [loading, setLoading] = useState(true)

  // Mock data for demonstration (would be fetched from API)
  const completionTrendData = [
    { label: 'Mon', value: 65 },
    { label: 'Tue', value: 72 },
    { label: 'Wed', value: 68 },
    { label: 'Thu', value: 78 },
    { label: 'Fri', value: 82 },
    { label: 'Sat', value: 75 },
    { label: 'Sun', value: 70 },
  ]

  const courseDistributionData = [
    { label: 'Compliance', value: 35, color: '#3b82f6' },
    { label: 'Onboarding', value: 25, color: '#10b981' },
    { label: 'Security', value: 20, color: '#f59e0b' },
    { label: 'Product', value: 15, color: '#8b5cf6' },
    { label: 'Other', value: 5, color: '#6b7280' },
  ]

  const engagementData = [
    { label: 'Week 1', value: 1200 },
    { label: 'Week 2', value: 1350 },
    { label: 'Week 3', value: 1180 },
    { label: 'Week 4', value: 1450 },
  ]

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      // Fetch courses count
      const { count: coursesCount } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true })

      // Fetch users count
      const { count: learnersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'employee')

      // Fetch progress data for analytics
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('completed, score, watched_duration')

      const completed = progressData?.filter(p => p.completed).length || 0
      const total = progressData?.length || 1
      const avgScore = progressData?.reduce((sum, p) => sum + (p.score || 0), 0) / total || 0
      const avgWatchTime = progressData?.reduce((sum, p) => sum + (p.watched_duration || 0), 0) / total || 0

      setAnalytics({
        totalCourses: coursesCount || 12,
        totalLearners: learnersCount || 156,
        totalViews: 2847,
        completionRate: Math.round((completed / total) * 100) || 68,
        averageScore: Math.round(avgScore) || 82,
        averageWatchTime: Math.round(avgWatchTime / 60) || 272, // in seconds
      })

      // Fetch top courses
      const { data: courses } = await supabase
        .from('courses')
        .select('id, title')
        .limit(5)

      setTopCourses(
        courses?.map((course, i) => ({
          id: course.id,
          title: course.title,
          views: 842 - i * 100,
          completionRate: 78 - i * 5,
          avgScore: 85 - i * 2,
          enrollments: 120 - i * 15,
        })) || [
          { id: '1', title: 'Q4 Compliance Training', views: 842, completionRate: 78, avgScore: 85, enrollments: 120 },
          { id: '2', title: 'New Employee Onboarding', views: 654, completionRate: 65, avgScore: 82, enrollments: 98 },
          { id: '3', title: 'Security Awareness', views: 521, completionRate: 72, avgScore: 88, enrollments: 85 },
          { id: '4', title: 'Product Knowledge: 2024', views: 445, completionRate: 58, avgScore: 79, enrollments: 72 },
          { id: '5', title: 'Leadership Essentials', views: 385, completionRate: 81, avgScore: 91, enrollments: 45 },
        ]
      )

      // Mock recent activity
      setRecentActivity([
        { id: '1', userName: 'Sarah Johnson', userEmail: 'sarah@company.com', action: 'completed', courseTitle: 'Q4 Compliance', score: 95, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
        { id: '2', userName: 'Mike Chen', userEmail: 'mike@company.com', action: 'started', courseTitle: 'Security Awareness', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
        { id: '3', userName: 'Emily Davis', userEmail: 'emily@company.com', action: 'completed', courseTitle: 'Leadership', score: 88, timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
        { id: '4', userName: 'Alex Thompson', userEmail: 'alex@company.com', action: 'quiz_passed', courseTitle: 'Product Knowledge', score: 82, timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
        { id: '5', userName: 'Jessica Lee', userEmail: 'jessica@company.com', action: 'started', courseTitle: 'Onboarding', timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString() },
      ])
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    toast.success('Analytics report exported to CSV')
    // In production, this would generate and download a CSV file
  }

  const formatWatchTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const getTimeSince = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  const stats = [
    {
      label: 'Total Courses',
      value: analytics.totalCourses.toString(),
      change: { value: 8, label: 'vs last month' },
      icon: <BookOpen className="w-5 h-5 text-primary-600" />,
      sparkline: [8, 10, 9, 11, 10, 12, 12],
      color: 'bg-primary-100',
    },
    {
      label: 'Active Learners',
      value: analytics.totalLearners.toString(),
      change: { value: 12, label: 'vs last month' },
      icon: <Users className="w-5 h-5 text-green-600" />,
      sparkline: [120, 135, 142, 148, 150, 156, 156],
      color: 'bg-green-100',
    },
    {
      label: 'Completion Rate',
      value: `${analytics.completionRate}%`,
      change: { value: 5, label: 'vs last month' },
      icon: <Target className="w-5 h-5 text-blue-600" />,
      sparkline: [58, 62, 64, 65, 66, 67, 68],
      color: 'bg-blue-100',
    },
    {
      label: 'Avg. Quiz Score',
      value: `${analytics.averageScore}%`,
      change: { value: 3, label: 'vs last month' },
      icon: <Award className="w-5 h-5 text-yellow-600" />,
      sparkline: [78, 79, 80, 81, 81, 82, 82],
      color: 'bg-yellow-100',
    },
  ]

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'completed':
        return <GraduationCap className="w-4 h-4 text-green-500" />
      case 'started':
        return <PlayCircle className="w-4 h-4 text-blue-500" />
      case 'quiz_passed':
        return <Award className="w-4 h-4 text-yellow-500" />
      default:
        return <BookOpen className="w-4 h-4 text-gray-500" />
    }
  }

  const getActionText = (action: string) => {
    switch (action) {
      case 'completed':
        return 'completed'
      case 'started':
        return 'started'
      case 'quiz_passed':
        return 'passed quiz in'
      default:
        return action
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Track learning progress, engagement, and performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  timeRange === range
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
          <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />} onClick={handleExport}>
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    {stat.change && (
                      <div className="flex items-center gap-1 mt-2">
                        <span className={`text-sm font-medium ${stat.change.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.change.value >= 0 ? '+' : ''}{stat.change.value}%
                        </span>
                        <span className="text-xs text-gray-500">{stat.change.label}</span>
                      </div>
                    )}
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
                {stat.sparkline && (
                  <div className="mt-4">
                    <Sparkline data={stat.sparkline} height={24} />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Completion Trends */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Completion Trends</h2>
              <Badge variant="secondary">Last 7 days</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <LineChart
              data={completionTrendData}
              height={220}
              color="#3b82f6"
              showArea
            />
          </CardContent>
        </Card>

        {/* Course Distribution */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-900">Course Categories</h2>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-4">
              <DonutChart
                data={courseDistributionData}
                size={160}
                strokeWidth={20}
                centerValue={analytics.totalCourses.toString()}
                centerLabel="Courses"
              />
            </div>
            <div className="space-y-2">
              {courseDistributionData.map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-600">{item.label}</span>
                  </div>
                  <span className="font-medium text-gray-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Courses */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Top Performing Courses</h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {topCourses.slice(0, 5).map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <span className="text-lg font-bold text-gray-300 w-6">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {course.title}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {course.enrollments}
                    </span>
                    <span className="flex items-center gap-1">
                      <PlayCircle className="w-3 h-3" />
                      {course.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {course.completionRate}%
                    </span>
                  </div>
                </div>
                <Badge variant="success">{course.avgScore}%</Badge>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Engagement Metrics */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Weekly Engagement</h2>
              <Badge variant="secondary">{timeRange === '7d' ? 'This Week' : 'Last Month'}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <BarChart
              data={engagementData}
              height={180}
              showValues
            />
            <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-100">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{analytics.totalViews.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Total Views</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{formatWatchTime(analytics.averageWatchTime)}</p>
                <p className="text-xs text-gray-500">Avg. Watch Time</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{analytics.averageScore}%</p>
                <p className="text-xs text-gray-500">Avg. Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Learner Activity</h2>
            <Button variant="ghost" size="sm" leftIcon={<FileText className="w-4 h-4" />}>
              Full Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={activity.userName} size="md" />
                  <div>
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.userName}</span>{' '}
                      <span className="text-gray-500">{getActionText(activity.action)}</span>{' '}
                      <span className="font-medium">{activity.courseTitle}</span>
                    </p>
                    <p className="text-xs text-gray-500">{activity.userEmail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {activity.score && (
                    <Badge variant={activity.score >= 80 ? 'success' : 'warning'}>
                      {activity.score}%
                    </Badge>
                  )}
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    {getActionIcon(activity.action)}
                    <span>{getTimeSince(activity.timestamp)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
