/**
 * Enrollments Management Page
 * Track and manage course enrollments, progress, and completions
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  Search,
  UserPlus,
  Download,
  Check,
  Clock,
  GraduationCap,
  TrendingUp,
  Mail,
  XCircle,
  Play,
  Award,
} from 'lucide-react'
import { Card, CardContent, Button, Badge, Input, Progress, Modal, EmptyState, Avatar, Skeleton } from '@/components/ui'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Enrollment {
  id: string
  user: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  course: {
    id: string
    title: string
    thumbnail?: string
  }
  status: 'not_started' | 'in_progress' | 'completed'
  progress: number
  enrolledAt: string
  lastAccessedAt?: string
  completedAt?: string
  quizScores?: number[]
  certificateId?: string
}

interface Course {
  id: string
  title: string
  episodeCount: number
  enrolledCount: number
}

interface Employee {
  id: string
  name: string
  email: string
  department?: string
}

// Mock data
const mockEnrollments: Enrollment[] = [
  {
    id: 'enr-1',
    user: { id: 'u1', name: 'Alice Johnson', email: 'alice@company.com', avatar: undefined },
    course: { id: 'c1', title: 'Workplace Safety Fundamentals' },
    status: 'completed',
    progress: 100,
    enrolledAt: '2024-01-05',
    lastAccessedAt: '2024-01-20',
    completedAt: '2024-01-20',
    quizScores: [90, 85, 95],
    certificateId: 'cert-001',
  },
  {
    id: 'enr-2',
    user: { id: 'u2', name: 'Bob Smith', email: 'bob@company.com' },
    course: { id: 'c1', title: 'Workplace Safety Fundamentals' },
    status: 'in_progress',
    progress: 65,
    enrolledAt: '2024-01-10',
    lastAccessedAt: '2024-01-22',
    quizScores: [80, 75],
  },
  {
    id: 'enr-3',
    user: { id: 'u3', name: 'Carol Davis', email: 'carol@company.com' },
    course: { id: 'c2', title: 'Customer Service Excellence' },
    status: 'in_progress',
    progress: 30,
    enrolledAt: '2024-01-15',
    lastAccessedAt: '2024-01-21',
    quizScores: [85],
  },
  {
    id: 'enr-4',
    user: { id: 'u4', name: 'David Lee', email: 'david@company.com' },
    course: { id: 'c1', title: 'Workplace Safety Fundamentals' },
    status: 'not_started',
    progress: 0,
    enrolledAt: '2024-01-20',
  },
  {
    id: 'enr-5',
    user: { id: 'u5', name: 'Eva Martinez', email: 'eva@company.com' },
    course: { id: 'c3', title: 'Leadership Skills' },
    status: 'completed',
    progress: 100,
    enrolledAt: '2024-01-01',
    completedAt: '2024-01-18',
    quizScores: [100, 95, 90, 100],
    certificateId: 'cert-002',
  },
]

const mockCourses: Course[] = [
  { id: 'c1', title: 'Workplace Safety Fundamentals', episodeCount: 5, enrolledCount: 45 },
  { id: 'c2', title: 'Customer Service Excellence', episodeCount: 4, enrolledCount: 32 },
  { id: 'c3', title: 'Leadership Skills', episodeCount: 6, enrolledCount: 18 },
]

const mockEmployees: Employee[] = [
  { id: 'u6', name: 'Frank Wilson', email: 'frank@company.com', department: 'Sales' },
  { id: 'u7', name: 'Grace Chen', email: 'grace@company.com', department: 'Marketing' },
  { id: 'u8', name: 'Henry Brown', email: 'henry@company.com', department: 'Engineering' },
]

export function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [courseFilter, setCourseFilter] = useState<string>('all')
  const [showEnrollModal, setShowEnrollModal] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<string>('')
  const [selectedCourse, setSelectedCourse] = useState<string>('')
  const [isEnrolling, setIsEnrolling] = useState(false)

  // Load data
  useEffect(() => {
    const loadData = async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setEnrollments(mockEnrollments)
      setCourses(mockCourses)
      setIsLoading(false)
    }
    loadData()
  }, [])

  // Filter enrollments
  const filteredEnrollments = enrollments.filter((enrollment) => {
    const matchesSearch =
      enrollment.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enrollment.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enrollment.course.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || enrollment.status === statusFilter
    const matchesCourse = courseFilter === 'all' || enrollment.course.id === courseFilter
    return matchesSearch && matchesStatus && matchesCourse
  })

  // Stats
  const stats = {
    total: enrollments.length,
    completed: enrollments.filter((e) => e.status === 'completed').length,
    inProgress: enrollments.filter((e) => e.status === 'in_progress').length,
    notStarted: enrollments.filter((e) => e.status === 'not_started').length,
    avgProgress: Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length) || 0,
  }

  const handleEnroll = async () => {
    if (!selectedEmployee || !selectedCourse) {
      toast.error('Please select both an employee and a course')
      return
    }

    setIsEnrolling(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const employee = mockEmployees.find((e) => e.id === selectedEmployee)
      const course = courses.find((c) => c.id === selectedCourse)

      if (employee && course) {
        const newEnrollment: Enrollment = {
          id: `enr-${Date.now()}`,
          user: { id: employee.id, name: employee.name, email: employee.email },
          course: { id: course.id, title: course.title },
          status: 'not_started',
          progress: 0,
          enrolledAt: new Date().toISOString().split('T')[0],
        }
        setEnrollments((prev) => [newEnrollment, ...prev])
        toast.success(`${employee.name} enrolled in ${course.title}`)
        setShowEnrollModal(false)
        setSelectedEmployee('')
        setSelectedCourse('')
      }
    } catch (error) {
      toast.error('Failed to enroll user')
    } finally {
      setIsEnrolling(false)
    }
  }

  const handleUnenroll = async (enrollmentId: string) => {
    if (!confirm('Are you sure you want to remove this enrollment?')) return

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      setEnrollments((prev) => prev.filter((e) => e.id !== enrollmentId))
      toast.success('Enrollment removed')
    } catch (error) {
      toast.error('Failed to remove enrollment')
    }
  }

  const handleSendReminder = async (enrollment: Enrollment) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      toast.success(`Reminder sent to ${enrollment.user.name}`)
    } catch (error) {
      toast.error('Failed to send reminder')
    }
  }

  const getStatusBadge = (status: Enrollment['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success" className="flex items-center gap-1"><Check className="w-3 h-3" />Completed</Badge>
      case 'in_progress':
        return <Badge variant="warning" className="flex items-center gap-1"><Play className="w-3 h-3" />In Progress</Badge>
      case 'not_started':
        return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="w-3 h-3" />Not Started</Badge>
    }
  }

  const getAverageQuizScore = (scores?: number[]) => {
    if (!scores || scores.length === 0) return null
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enrollments</h1>
          <p className="text-gray-600 mt-1">Manage course enrollments and track progress</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />}>
            Export
          </Button>
          <Button leftIcon={<UserPlus className="w-4 h-4" />} onClick={() => setShowEnrollModal(true)}>
            Enroll User
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Enrollments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Play className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg Progress</p>
              <p className="text-2xl font-bold text-purple-600">{stats.avgProgress}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by name, email, or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="in_progress">In Progress</option>
              <option value="not_started">Not Started</option>
            </select>
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Courses</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Enrollments Table */}
      <Card>
        <CardContent className="p-0">
          {filteredEnrollments.length === 0 ? (
            <EmptyState
              icon={<Users className="w-12 h-12" />}
              title="No enrollments found"
              description={searchQuery || statusFilter !== 'all' || courseFilter !== 'all'
                ? "Try adjusting your filters to see more results"
                : "Enroll employees in courses to get started"}
              action={
                <Button onClick={() => setShowEnrollModal(true)}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Enroll User
                </Button>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Employee</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Course</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Progress</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Quiz Score</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Enrolled</th>
                    <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredEnrollments.map((enrollment) => (
                    <motion.tr
                      key={enrollment.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <Avatar name={enrollment.user.name} src={enrollment.user.avatar} size="sm" />
                          <div>
                            <p className="font-medium text-gray-900">{enrollment.user.name}</p>
                            <p className="text-sm text-gray-500">{enrollment.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-medium text-gray-900">{enrollment.course.title}</p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <Progress value={enrollment.progress} className="w-24" />
                          <span className="text-sm text-gray-600">{enrollment.progress}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">{getStatusBadge(enrollment.status)}</td>
                      <td className="py-4 px-6">
                        {getAverageQuizScore(enrollment.quizScores) !== null ? (
                          <span className={cn(
                            'font-medium',
                            getAverageQuizScore(enrollment.quizScores)! >= 80 ? 'text-green-600' : 'text-yellow-600'
                          )}>
                            {getAverageQuizScore(enrollment.quizScores)}%
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {new Date(enrollment.enrolledAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          {enrollment.status !== 'completed' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSendReminder(enrollment)}
                              title="Send reminder"
                            >
                              <Mail className="w-4 h-4" />
                            </Button>
                          )}
                          {enrollment.certificateId && (
                            <Button
                              variant="ghost"
                              size="sm"
                              title="View certificate"
                            >
                              <Award className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUnenroll(enrollment.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Remove enrollment"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enroll Modal */}
      <Modal
        isOpen={showEnrollModal}
        onClose={() => setShowEnrollModal(false)}
        title="Enroll User in Course"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Employee
            </label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Choose an employee...</option>
              {mockEmployees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Course
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Choose a course...</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title} ({course.enrolledCount} enrolled)
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowEnrollModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleEnroll} isLoading={isEnrolling}>
              Enroll User
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default EnrollmentsPage
