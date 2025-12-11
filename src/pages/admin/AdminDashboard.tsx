<<<<<<< HEAD
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
=======
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
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
<<<<<<< HEAD
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  Award,
  Target,
  Flame,
  Music,
  Pause,
=======
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
} from 'lucide-react'
import { Card, CardContent, Button, StatusBadge, ProgressBar, ConfirmModal } from '@/components/ui'
import { formatDate, formatDuration } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import type { Course } from '@/types'

<<<<<<< HEAD
// Category pills data
const categories = [
  { id: 'all', label: 'All', icon: Sparkles },
  { id: 'compliance', label: 'Compliance', icon: Target },
  { id: 'onboarding', label: 'Onboarding', icon: Users },
  { id: 'sales', label: 'Sales Training', icon: TrendingUp },
  { id: 'technical', label: 'Technical', icon: Zap },
  { id: 'leadership', label: 'Leadership', icon: Award },
  { id: 'safety', label: 'Safety', icon: Flame },
=======
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
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
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

<<<<<<< HEAD
// Animated equalizer component
const Equalizer = () => (
  <div className="equalizer">
    {[0, 1, 2, 3].map((i) => (
      <div key={i} className="equalizer-bar" style={{ animationDelay: `${i * 0.1}s` }} />
    ))}
  </div>
)

// Course card component with Spotify-style design
const CourseCard = ({ 
  course, 
  index, 
  onMenuClick, 
  openMenu, 
  onDelete,
  isPlaying,
  onPlay 
}: { 
  course: Course
  index: number
  onMenuClick: (id: string) => void
  openMenu: string | null
  onDelete: (id: string) => void
  isPlaying: boolean
  onPlay: (id: string) => void
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
      className="group"
    >
      <div className="card-spotify relative">
        {/* Thumbnail with play overlay */}
        <div className="relative aspect-square mb-4 rounded-md overflow-hidden shadow-spotify">
          {course.thumbnailUrl ? (
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="w-full h-full object-cover card-image-zoom"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-spotify-green/30 to-spotify-dark-gray flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-spotify-text-gray" />
            </div>
          )}
          
          {/* Play button overlay */}
          <div className="play-button-overlay">
            <motion.button
              onClick={() => onPlay(course.id)}
              className="play-button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-black ml-0.5" />
              ) : (
                <Play className="w-5 h-5 text-black ml-0.5" fill="black" />
              )}
            </motion.button>
          </div>

          {/* Status badge */}
          <div className="absolute top-2 left-2">
            <span className={`
              px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider
              ${course.status === 'published' ? 'bg-spotify-green/90 text-black' : ''}
              ${course.status === 'processing' ? 'bg-yellow-500/90 text-black' : ''}
              ${course.status === 'draft' ? 'bg-spotify-medium-gray text-spotify-text-gray' : ''}
            `}>
              {course.status}
            </span>
          </div>

          {/* Processing indicator */}
          {course.status === 'processing' && course.episodes[0]?.processingProgress && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-2">
              <div className="h-1 bg-spotify-medium-gray rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-spotify-green"
                  initial={{ width: 0 }}
                  animate={{ width: `${course.episodes[0].processingProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-[10px] text-spotify-text-gray mt-1 text-center">
                Processing {course.episodes[0].processingProgress}%
              </p>
            </div>
          )}

          {/* Currently playing indicator */}
          {isPlaying && (
            <div className="absolute bottom-2 right-2">
              <Equalizer />
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-spotify-text-white line-clamp-1 group-hover:text-spotify-green transition-colors">
              {course.title}
            </h3>
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onMenuClick(openMenu === course.id ? '' : course.id)
                }}
                className="p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-spotify-light-gray transition-all"
              >
                <MoreVertical className="w-4 h-4 text-spotify-text-gray" />
              </button>
              
              <AnimatePresence>
                {openMenu === course.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 top-8 w-44 bg-spotify-medium-gray rounded-md shadow-spotify-lg py-1 z-20 border border-white/10"
                  >
                    <Link
                      to={`/admin/play/${course.id}`}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-spotify-text-white hover:bg-spotify-light-gray transition-colors"
                    >
                      <Play className="w-4 h-4" /> Preview
                    </Link>
                    <Link
                      to={`/admin/course/${course.id}`}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-spotify-text-white hover:bg-spotify-light-gray transition-colors"
                    >
                      <Edit className="w-4 h-4" /> Edit
                    </Link>
                    <div className="h-px bg-white/10 my-1" />
                    <button
                      onClick={() => onDelete(course.id)}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/20 w-full transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <p className="text-sm text-spotify-text-gray mt-1 line-clamp-2">
            {course.description || `${course.episodes.length} episodes`}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

// Horizontal scroll section component
const ScrollSection = ({ 
  title, 
  linkText,
  linkTo,
  children 
}: { 
  title: string
  linkText?: string
  linkTo?: string
  children: React.ReactNode 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-spotify-text-white hover:underline cursor-pointer">
          {title}
        </h2>
        <div className="flex items-center gap-4">
          {linkText && linkTo && (
            <Link to={linkTo} className="section-link">
              {linkText}
            </Link>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`p-2 rounded-full transition-all ${
                canScrollLeft 
                  ? 'bg-spotify-medium-gray hover:bg-spotify-light-gray text-spotify-text-white' 
                  : 'bg-spotify-dark-gray text-spotify-text-gray cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`p-2 rounded-full transition-all ${
                canScrollRight 
                  ? 'bg-spotify-medium-gray hover:bg-spotify-light-gray text-spotify-text-white' 
                  : 'bg-spotify-dark-gray text-spotify-text-gray cursor-not-allowed'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>
    </section>
  )
}

// Stats card with animation
const StatCard = ({ stat, index }: { stat: typeof stats[0], index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="bg-gradient-to-br from-spotify-medium-gray to-spotify-dark-gray rounded-xl p-5 min-w-[180px] cursor-pointer group"
    >
      <div className={`w-12 h-12 rounded-full ${stat.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
        <stat.icon className={`w-6 h-6 ${stat.color}`} />
      </div>
      <p className="text-3xl font-bold text-spotify-text-white">{stat.value}</p>
      <p className="text-sm text-spotify-text-gray mt-1">{stat.label}</p>
    </motion.div>
  )
}

const stats = [
  { label: 'Total Courses', value: '12', icon: BookOpen, color: 'text-spotify-green', bg: 'bg-spotify-green/20' },
  { label: 'Active Learners', value: '156', icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/20' },
  { label: 'Completion Rate', value: '68%', icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-400/20' },
  { label: 'Avg. Watch Time', value: '4:32', icon: Clock, color: 'text-orange-400', bg: 'bg-orange-400/20' },
]

// Quick pick row item (like YouTube Music)
const QuickPickItem = ({ course, index, isPlaying, onPlay }: { 
  course: Course
  index: number
  isPlaying: boolean
  onPlay: (id: string) => void
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
    className="flex items-center gap-4 p-2 rounded-lg hover:bg-spotify-hover-bg group cursor-pointer transition-all"
    onClick={() => onPlay(course.id)}
  >
    <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
      {course.thumbnailUrl ? (
        <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-spotify-medium-gray flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-spotify-text-gray" />
        </div>
      )}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
        <Play className="w-5 h-5 text-white" fill="white" />
      </div>
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-medium text-spotify-text-white truncate group-hover:text-spotify-green transition-colors">
        {course.title}
      </p>
      <p className="text-xs text-spotify-text-gray truncate">
        {course.episodes.length} episodes • {formatDuration(course.episodes.reduce((t, e) => t + e.duration, 0))}
      </p>
    </div>
    {isPlaying && <Equalizer />}
  </motion.div>
)

=======
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
export function AdminDashboard() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; courseId: string | null }>({
    open: false,
    courseId: null,
  })
  const [openMenu, setOpenMenu] = useState<string | null>(null)
<<<<<<< HEAD
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [playingCourse, setPlayingCourse] = useState<string | null>(null)
  const { scrollY } = useScroll()
  const headerOpacity = useTransform(scrollY, [0, 100], [0, 1])
=======
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe

  // Fetch courses from database
  const fetchCourses = async () => {
    setLoading(true)
    try {
<<<<<<< HEAD
      console.log('📥 Fetching courses from database...')
      
=======
      // Fetch courses
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false })

<<<<<<< HEAD
      if (coursesError) {
        console.error('❌ Error fetching courses:', coursesError)
        throw coursesError
      }

      console.log(`✅ Found ${coursesData?.length || 0} courses`)

=======
      if (coursesError) throw coursesError

      // Fetch episodes for each course
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
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
<<<<<<< HEAD
      console.log(`✅ Loaded ${coursesWithEpisodes.length} courses with episodes`)
    } catch (error) {
      console.error('❌ Error fetching courses:', error)
=======
    } catch (error) {
      console.error('Error fetching courses:', error)
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const handleDeleteCourse = async () => {
    if (deleteModal.courseId) {
<<<<<<< HEAD
=======
      // Delete from database
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
      await supabase.from('courses').delete().eq('id', deleteModal.courseId)
      setCourses(courses.filter((c) => c.id !== deleteModal.courseId))
      setDeleteModal({ open: false, courseId: null })
    }
  }

<<<<<<< HEAD
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Hero Section with Gradient */}
      <div className="relative -mx-6 lg:-mx-8 -mt-6 lg:-mt-8 px-6 lg:px-8 pt-6 lg:pt-8 pb-8">
        <div className="absolute inset-0 bg-gradient-to-b from-spotify-green/30 via-spotify-green/10 to-transparent" />
        <div className="relative">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-spotify-text-white mb-2"
          >
            {getGreeting()}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-spotify-text-gray"
          >
            Manage your training content and track team progress
          </motion.p>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
        {categories.map((category, index) => (
          <motion.button
            key={category.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setSelectedCategory(category.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200
              ${selectedCategory === category.id 
                ? 'bg-spotify-text-white text-spotify-black' 
                : 'bg-spotify-medium-gray text-spotify-text-white hover:bg-spotify-light-gray'
              }
            `}
          >
            <category.icon className="w-4 h-4" />
            {category.label}
          </motion.button>
        ))}
      </div>

      {/* Stats Row */}
      <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        {stats.map((stat, index) => (
          <StatCard key={stat.label} stat={stat} index={index} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/admin/create">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-br from-spotify-green to-emerald-600 rounded-xl p-5 cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-black/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-black">Create Course</p>
                <p className="text-sm text-black/70">Upload & generate</p>
              </div>
            </div>
          </motion.div>
        </Link>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={fetchCourses}
          className="bg-spotify-medium-gray rounded-xl p-5 cursor-pointer group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-spotify-light-gray rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <RefreshCw className={`w-6 h-6 text-spotify-text-white ${loading ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <p className="font-bold text-spotify-text-white">Refresh</p>
              <p className="text-sm text-spotify-text-gray">Update content</p>
            </div>
          </div>
        </motion.div>

        <Link to="/admin/employees">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-spotify-medium-gray rounded-xl p-5 cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="font-bold text-spotify-text-white">Employees</p>
                <p className="text-sm text-spotify-text-gray">156 active</p>
              </div>
            </div>
          </motion.div>
        </Link>

        <Link to="/admin/analytics">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-spotify-medium-gray rounded-xl p-5 cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="font-bold text-spotify-text-white">Analytics</p>
                <p className="text-sm text-spotify-text-gray">View insights</p>
              </div>
            </div>
          </motion.div>
        </Link>
      </div>

      {/* Your Courses Section */}
      <ScrollSection title="Your Courses" linkText="Show all" linkTo="/admin/courses">
        {courses.map((course, index) => (
          <div key={course.id} className="flex-shrink-0 w-[200px]">
            <CourseCard
              course={course}
              index={index}
              onMenuClick={setOpenMenu}
              openMenu={openMenu}
              onDelete={(id) => setDeleteModal({ open: true, courseId: id })}
              isPlaying={playingCourse === course.id}
              onPlay={setPlayingCourse}
            />
          </div>
        ))}
        
        {/* Create New Card */}
        <div className="flex-shrink-0 w-[200px]">
          <Link to="/admin/create">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="card-spotify h-full min-h-[280px] flex flex-col items-center justify-center border-2 border-dashed border-spotify-light-gray hover:border-spotify-green transition-colors"
            >
              <div className="w-16 h-16 bg-spotify-medium-gray rounded-full flex items-center justify-center mb-4 group-hover:bg-spotify-green transition-colors">
                <Plus className="w-8 h-8 text-spotify-text-gray group-hover:text-black" />
              </div>
              <p className="font-bold text-spotify-text-white">Create Course</p>
              <p className="text-sm text-spotify-text-gray mt-1 text-center">
                Upload & generate
              </p>
            </motion.div>
          </Link>
        </div>
      </ScrollSection>

      {/* Quick Picks Section (like YouTube Music) */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-spotify-text-white mb-4">Quick picks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.slice(0, 6).map((course, index) => (
            <QuickPickItem 
              key={course.id} 
              course={course} 
              index={index}
              isPlaying={playingCourse === course.id}
              onPlay={setPlayingCourse}
            />
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="text-2xl font-bold text-spotify-text-white mb-4">Recent Activity</h2>
        <div className="bg-spotify-dark-gray rounded-xl overflow-hidden">
          {[
            { user: 'Sarah Johnson', action: 'completed', course: 'Q4 Compliance Training', time: '2 hours ago', avatar: 'S' },
            { user: 'Mike Chen', action: 'started', course: 'New Employee Onboarding', time: '3 hours ago', avatar: 'M' },
            { user: 'Emily Davis', action: 'scored 95%', course: 'Data Privacy Quiz', time: '5 hours ago', avatar: 'E' },
            { user: 'Alex Thompson', action: 'completed', course: 'Security Protocols', time: '1 day ago', avatar: 'A' },
          ].map((activity, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 px-4 py-3 hover:bg-spotify-medium-gray transition-colors border-b border-white/5 last:border-b-0"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-spotify-green to-emerald-600 flex items-center justify-center flex-shrink-0">
                <span className="text-black font-bold text-sm">{activity.avatar}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-spotify-text-white">
                  <span className="font-semibold">{activity.user}</span>{' '}
                  <span className="text-spotify-text-gray">{activity.action}</span>{' '}
                  <span className="font-semibold text-spotify-green">{activity.course}</span>
                </p>
              </div>
              <span className="text-xs text-spotify-text-gray whitespace-nowrap">{activity.time}</span>
            </motion.div>
          ))}
        </div>
      </section>
=======
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
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe

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
