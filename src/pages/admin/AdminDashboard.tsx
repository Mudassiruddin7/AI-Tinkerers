import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Plus,
  BookOpen,
  Users,
  TrendingUp,
  Clock,
  MoreVertical,
  Play,
  Edit,
  Trash2,
  RefreshCw,
} from 'lucide-react'
import { Card, CardContent, Button, StatusBadge, ProgressBar, ConfirmModal } from '@/components/ui'
import { formatDate, formatDuration } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import type { Course } from '@/types'

// Mock data for demo
const mockCourses: Course[] = [
  {
    id: '1',
    organizationId: 'org-1',
    title: 'Q4 Compliance Training',
    description: 'Annual compliance training covering new regulations and company policies.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop',
    status: 'published',
    createdBy: 'user-1',
    createdAt: '2024-11-15T10:00:00Z',
    updatedAt: '2024-11-20T14:30:00Z',
    episodes: [
      { id: 'ep-1', courseId: '1', title: 'Introduction', description: '', order: 1, duration: 180, status: 'ready', scenes: [], quizQuestions: [], createdAt: '', updatedAt: '' },
      { id: 'ep-2', courseId: '1', title: 'Data Privacy', description: '', order: 2, duration: 240, status: 'ready', scenes: [], quizQuestions: [], createdAt: '', updatedAt: '' },
      { id: 'ep-3', courseId: '1', title: 'Security Protocols', description: '', order: 3, duration: 200, status: 'ready', scenes: [], quizQuestions: [], createdAt: '', updatedAt: '' },
    ],
  },
  {
    id: '2',
    organizationId: 'org-1',
    title: 'New Employee Onboarding',
    description: 'Essential information for new team members joining our organization.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=300&fit=crop',
    status: 'processing',
    createdBy: 'user-1',
    createdAt: '2024-12-01T09:00:00Z',
    updatedAt: '2024-12-05T11:00:00Z',
    episodes: [
      { id: 'ep-4', courseId: '2', title: 'Welcome to the Team', description: '', order: 1, duration: 150, status: 'processing', processingProgress: 65, scenes: [], quizQuestions: [], createdAt: '', updatedAt: '' },
    ],
  },
  {
    id: '3',
    organizationId: 'org-1',
    title: 'Product Knowledge: 2025 Launch',
    description: 'Deep dive into our new product features for the sales team.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=400&h=300&fit=crop',
    status: 'draft',
    createdBy: 'user-1',
    createdAt: '2024-12-08T14:00:00Z',
    updatedAt: '2024-12-08T14:00:00Z',
    episodes: [],
  },
]

const stats = [
  { label: 'Total Courses', value: '12', icon: BookOpen, color: 'text-primary-600', bg: 'bg-primary-100' },
  { label: 'Active Learners', value: '156', icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
  { label: 'Completion Rate', value: '68%', icon: TrendingUp, color: 'text-accent-600', bg: 'bg-accent-100' },
  { label: 'Avg. Watch Time', value: '4:32', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100' },
]

interface DBCourse {
  id: string
  title: string
  description: string
  thumbnail_url: string
  status: string
  created_at: string
  updated_at: string
}

interface DBEpisode {
  id: string
  course_id: string
  title: string
  description: string
  episode_order: number
  duration: number
  video_url: string
  status: string
}

export function AdminDashboard() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; courseId: string | null }>({
    open: false,
    courseId: null,
  })
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  // Fetch courses from database
  const fetchCourses = async () => {
    setLoading(true)
    try {
      // Fetch courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false })

      if (coursesError) throw coursesError

      // Fetch episodes for each course
      const coursesWithEpisodes: Course[] = await Promise.all(
        (coursesData as DBCourse[]).map(async (course) => {
          const { data: episodes } = await supabase
            .from('episodes')
            .select('*')
            .eq('course_id', course.id)
            .order('episode_order', { ascending: true })

          return {
            id: course.id,
            organizationId: 'org-1',
            title: course.title,
            description: course.description || '',
            thumbnailUrl: course.thumbnail_url,
            status: course.status as 'draft' | 'processing' | 'published',
            createdBy: 'user-1',
            createdAt: course.created_at,
            updatedAt: course.updated_at,
            episodes: (episodes as DBEpisode[] || []).map(ep => ({
              id: ep.id,
              courseId: ep.course_id,
              title: ep.title,
              description: ep.description || '',
              order: ep.episode_order,
              duration: ep.duration || 0,
              status: ep.status as 'processing' | 'ready' | 'failed',
              videoUrl: ep.video_url,
              scenes: [],
              quizQuestions: [],
              createdAt: '',
              updatedAt: '',
            })),
          }
        })
      )

      setCourses(coursesWithEpisodes)
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const handleDeleteCourse = async () => {
    if (deleteModal.courseId) {
      // Delete from database
      await supabase.from('courses').delete().eq('id', deleteModal.courseId)
      setCourses(courses.filter((c) => c.id !== deleteModal.courseId))
      setDeleteModal({ open: false, courseId: null })
    }
  }

  const getTotalDuration = (episodes: Course['episodes']) => {
    return episodes.reduce((total, ep) => total + ep.duration, 0)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your training content and track progress</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            leftIcon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
            onClick={fetchCourses}
            disabled={loading}
          >
            Refresh
          </Button>
          <Link to="/admin/create">
            <Button leftIcon={<Plus className="w-4 h-4" />}>Create Course</Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Courses Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Your Courses</h2>
          <Link to="/admin/courses" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View all →
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col">
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gray-100">
                  {course.thumbnailUrl ? (
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <StatusBadge status={course.status} />
                  </div>
                  {course.status === 'processing' && course.episodes[0]?.processingProgress && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                      <ProgressBar
                        value={course.episodes[0].processingProgress}
                        size="sm"
                        color="primary"
                      />
                      <p className="text-xs text-white mt-1 text-center">
                        Processing... {course.episodes[0].processingProgress}%
                      </p>
                    </div>
                  )}
                </div>

                {/* Content */}
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">{course.title}</h3>
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenu(openMenu === course.id ? null : course.id)}
                        className="p-1 rounded hover:bg-gray-100"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </button>
                      {openMenu === course.id && (
                        <div className="absolute right-0 top-8 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
                          <Link
                            to={`/admin/play/${course.id}`}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Play className="w-4 h-4" /> Preview
                          </Link>
                          <Link
                            to={`/admin/course/${course.id}`}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Edit className="w-4 h-4" /> Edit
                          </Link>
                          <button
                            onClick={() => {
                              setDeleteModal({ open: true, courseId: course.id })
                              setOpenMenu(null)
                            }}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{course.description}</p>

                  <div className="mt-auto pt-4 flex items-center justify-between text-sm text-gray-500">
                    <span>{course.episodes.length} episodes</span>
                    <span>{formatDuration(getTotalDuration(course.episodes))}</span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      Updated {formatDate(course.updatedAt)}
                    </span>
                    {course.status === 'published' && (
                      <Link to={`/admin/play/${course.id}`}>
                        <Button size="sm" variant="ghost" leftIcon={<Play className="w-3 h-3" />}>
                          Preview
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Create New Course Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: courses.length * 0.1 }}
          >
            <Link to="/admin/create">
              <Card
                hover
                className="h-full min-h-[300px] flex items-center justify-center border-2 border-dashed border-gray-200 hover:border-primary-300 hover:bg-primary-50/50"
              >
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Create New Course</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Upload content and generate training videos
                  </p>
                </div>
              </Card>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="divide-y divide-gray-100">
            {[
              { user: 'Sarah Johnson', action: 'completed', course: 'Q4 Compliance Training', time: '2 hours ago' },
              { user: 'Mike Chen', action: 'started', course: 'New Employee Onboarding', time: '3 hours ago' },
              { user: 'Emily Davis', action: 'scored 95%', course: 'Data Privacy Quiz', time: '5 hours ago' },
              { user: 'Alex Thompson', action: 'completed', course: 'Security Protocols', time: '1 day ago' },
            ].map((activity, index) => (
              <div key={index} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user}</span>{' '}
                      <span className="text-gray-500">{activity.action}</span>{' '}
                      <span className="font-medium">{activity.course}</span>
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, courseId: null })}
        onConfirm={handleDeleteCourse}
        title="Delete Course"
        message="Are you sure you want to delete this course? This action cannot be undone and will remove all associated episodes and data."
        confirmText="Delete Course"
        variant="danger"
      />
    </div>
  )
}
