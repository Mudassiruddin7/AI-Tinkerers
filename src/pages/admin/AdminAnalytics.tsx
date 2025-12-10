import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Clock,
  Target,
  Download,
} from 'lucide-react'
import { Card, CardContent, CardHeader, Button, Badge } from '@/components/ui'
// Utility imports can be added as needed

export function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  const stats = [
    {
      label: 'Total Views',
      value: '2,847',
      change: '+12.5%',
      trend: 'up',
      icon: BookOpen,
    },
    {
      label: 'Completion Rate',
      value: '68%',
      change: '+5.2%',
      trend: 'up',
      icon: Target,
    },
    {
      label: 'Avg. Watch Time',
      value: '4:32',
      change: '-2.1%',
      trend: 'down',
      icon: Clock,
    },
    {
      label: 'Active Learners',
      value: '156',
      change: '+8.3%',
      trend: 'up',
      icon: Users,
    },
  ]

  const topCourses = [
    { title: 'Q4 Compliance Training', views: 842, completionRate: 78, avgScore: 85 },
    { title: 'New Employee Onboarding', views: 654, completionRate: 65, avgScore: 82 },
    { title: 'Security Awareness', views: 521, completionRate: 72, avgScore: 88 },
    { title: 'Product Knowledge: 2024', views: 445, completionRate: 58, avgScore: 79 },
    { title: 'Leadership Essentials', views: 385, completionRate: 81, avgScore: 91 },
  ]

  const recentActivity = [
    { user: 'Sarah Johnson', action: 'Completed', course: 'Q4 Compliance', score: 95, time: '2h ago' },
    { user: 'Mike Chen', action: 'Started', course: 'Security Awareness', time: '3h ago' },
    { user: 'Emily Davis', action: 'Completed', course: 'Leadership', score: 88, time: '5h ago' },
    { user: 'Alex Thompson', action: 'Quiz Passed', course: 'Product Knowledge', score: 82, time: '1d ago' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Track learning progress and engagement metrics</p>
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
          <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />}>
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
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <div className={`flex items-center gap-1 mt-2 text-sm ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {stat.change}
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Completion Trends Chart */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-900">Completion Trends</h2>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Chart visualization would go here</p>
                <p className="text-sm">Integration with charting library needed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Courses */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-900">Top Courses</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            {topCourses.map((course, index) => (
              <div key={course.title} className="flex items-center gap-4">
                <span className="text-lg font-bold text-gray-300 w-6">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {course.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {course.views} views • {course.completionRate}% completion
                  </p>
                </div>
                <Badge variant="success">{course.avgScore}% avg</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Recent Activity</h2>
          <Button variant="ghost" size="sm">View All</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user}</span>{' '}
                      <span className="text-gray-500">{activity.action.toLowerCase()}</span>{' '}
                      <span className="font-medium">{activity.course}</span>
                    </p>
                    {activity.score && (
                      <p className="text-xs text-gray-500">Score: {activity.score}%</p>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
