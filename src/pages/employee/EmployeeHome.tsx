import { useState } from 'react'
import { motion } from 'framer-motion'
import { useUser } from '@clerk/clerk-react'
import { Play, Clock, Award, ChevronRight, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent, Badge, Input, Progress } from '@/components/ui'
import type { Course } from '@/types'

// Check if Clerk is available
const isClerkEnabled = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

export function EmployeeHome() {
  const clerkUser = isClerkEnabled ? useUser() : { user: null }
  const user = clerkUser.user
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Mock data for demo
  const courses: (Course & { progress: number; thumbnail: string })[] = [
    {
      id: '1',
      organizationId: 'org1',
      title: 'Q4 Compliance Training 2024',
      description: 'Essential compliance updates for the fourth quarter',
      episodeCount: 5,
      totalDuration: 3600,
      status: 'published',
      thumbnailUrl: '/api/placeholder/400/225',
      category: 'Compliance',
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      episodes: [],
      progress: 60,
      thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=225&fit=crop',
    },
    {
      id: '2',
      organizationId: 'org1',
      title: 'Security Awareness',
      description: 'Protect yourself and the company from cyber threats',
      episodeCount: 4,
      totalDuration: 2400,
      status: 'published',
      thumbnailUrl: '/api/placeholder/400/225',
      category: 'Security',
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      episodes: [],
      progress: 100,
      thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=225&fit=crop',
    },
    {
      id: '3',
      organizationId: 'org1',
      title: 'Leadership Essentials',
      description: 'Core leadership skills for team leads and managers',
      episodeCount: 6,
      totalDuration: 4200,
      status: 'published',
      thumbnailUrl: '/api/placeholder/400/225',
      category: 'Leadership',
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      episodes: [],
      progress: 25,
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop',
    },
    {
      id: '4',
      organizationId: 'org1',
      title: 'Product Knowledge 2024',
      description: 'New features and capabilities of our product line',
      episodeCount: 8,
      totalDuration: 5400,
      status: 'published',
      thumbnailUrl: '/api/placeholder/400/225',
      category: 'Product',
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      episodes: [],
      progress: 0,
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop',
    },
    {
      id: '5',
      organizationId: 'org1',
      title: 'Customer Service Excellence',
      description: 'Delivering exceptional customer experiences',
      episodeCount: 5,
      totalDuration: 3000,
      status: 'published',
      thumbnailUrl: '/api/placeholder/400/225',
      category: 'Skills',
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      episodes: [],
      progress: 80,
      thumbnail: 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=400&h=225&fit=crop',
    },
    {
      id: '6',
      organizationId: 'org1',
      title: 'Workplace Safety',
      description: 'Health and safety protocols for the workplace',
      episodeCount: 3,
      totalDuration: 1800,
      status: 'published',
      thumbnailUrl: '/api/placeholder/400/225',
      category: 'Safety',
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      episodes: [],
      progress: 0,
      thumbnail: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=225&fit=crop',
    },
  ]

  const categories = ['all', ...new Set(courses.map((c) => c.category || 'Uncategorized'))]

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const inProgress = courses.filter((c) => c.progress > 0 && c.progress < 100)
  const completed = courses.filter((c) => c.progress === 100)

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white">
        <h1 className="text-2xl font-bold">Welcome back, {user?.firstName || 'Learner'}!</h1>
        <p className="text-primary-100 mt-2">
          You have {inProgress.length} courses in progress and {completed.length} completed.
        </p>
        {inProgress.length > 0 && (
          <Link
            to={`/employee/watch/${inProgress[0].id}/episode/1`}
            className="mt-4 inline-flex items-center gap-2 bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors"
          >
            <Play className="w-4 h-4" />
            Continue Learning
          </Link>
        )}
      </div>

      {/* Continue Watching */}
      {inProgress.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Continue Watching</h2>
            <Link to="/employee/progress" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inProgress.slice(0, 3).map((course) => (
              <Link key={course.id} to={`/employee/watch/${course.id}/episode/1`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="group relative bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-all"
                >
                  <div className="relative aspect-video">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center">
                        <Play className="w-6 h-6 text-primary-600 ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                      <div
                        className="h-full bg-primary-500"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{course.title}</h3>
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                      <span>{course.progress}% complete</span>
                      <span>•</span>
                      <span>{course.episodeCount} episodes</span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Browse All */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900">Browse Training</h2>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category === 'all' ? 'All Courses' : category}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredCourses.map((course) => (
            <motion.div key={course.id} variants={item}>
              <Link to={`/employee/watch/${course.id}/episode/1`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-3 right-3">
                      {course.progress === 100 ? (
                        <Badge variant="success">
                          <Award className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                      ) : course.progress > 0 ? (
                        <Badge variant="default">{course.progress}%</Badge>
                      ) : (
                        <Badge variant="secondary">New</Badge>
                      )}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="inline-flex items-center gap-1 text-white text-sm">
                        <Clock className="w-4 h-4" />
                        {formatDuration(course.totalDuration || 0)}
                      </span>
                    </div>
                  </div>
                  <CardContent>
                    <Badge variant="secondary" className="mb-2">{course.category}</Badge>
                    <h3 className="font-semibold text-gray-900 line-clamp-2">{course.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{course.description}</p>
                    <div className="flex items-center gap-2 mt-3 text-sm text-gray-400">
                      <span>{course.episodeCount} episodes</span>
                    </div>
                    {course.progress > 0 && course.progress < 100 && (
                      <Progress value={course.progress} size="sm" className="mt-3" />
                    )}
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No courses found matching your search.</p>
          </div>
        )}
      </section>
    </div>
  )
}
