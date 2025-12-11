import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import {
  Plus,
  Sparkles,
  Clock,
  Users,
  Target,
  Trash2,
  Edit,
  MoreVertical,
  GraduationCap,
  Loader2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'
import { 
  Card, 
  CardContent, 
  Button, 
  Badge, 
  Modal, 
  Input, 
  Textarea, 
  Select,
  Progress,
  EmptyState,
} from '@/components/ui'
import { supabase } from '@/lib/supabase'
import type { Course } from '@/types'

interface LearningPath {
  id: string
  name: string
  description: string
  courseIds: string[]
  courses: Course[]
  completionPercentage: number
  aiGenerated: boolean
  estimatedDuration: number
  enrolledCount: number
  createdAt: string
  milestones: Milestone[]
}

interface Milestone {
  afterCourse: number
  name: string
  skillsAcquired: string[]
}

interface CreatePathModalProps {
  isOpen: boolean
  onClose: () => void
  onCreated: (path: LearningPath) => void
  availableCourses: Course[]
}

function CreatePathModal({ isOpen, onClose, onCreated, availableCourses }: CreatePathModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationType, setGenerationType] = useState<'manual' | 'ai'>('manual')
  const [aiGoal, setAiGoal] = useState('')
  const [skillLevel, setSkillLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner')

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error('Please enter a path name')
      return
    }

    if (selectedCourses.length === 0) {
      toast.error('Please select at least one course')
      return
    }

    setIsGenerating(true)
    try {
      // In production, save to database
      const newPath: LearningPath = {
        id: crypto.randomUUID(),
        name,
        description,
        courseIds: selectedCourses,
        courses: availableCourses.filter(c => selectedCourses.includes(c.id)),
        completionPercentage: 0,
        aiGenerated: generationType === 'ai',
        estimatedDuration: selectedCourses.length * 45,
        enrolledCount: 0,
        createdAt: new Date().toISOString(),
        milestones: [
          {
            afterCourse: Math.ceil(selectedCourses.length / 2),
            name: 'Halfway Complete',
            skillsAcquired: ['Foundation knowledge', 'Core concepts'],
          },
          {
            afterCourse: selectedCourses.length,
            name: 'Path Complete',
            skillsAcquired: ['Full competency', 'Practical application'],
          },
        ],
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      onCreated(newPath)
      toast.success(`Learning path "${name}" created successfully!`)
      handleClose()
    } catch (error) {
      toast.error('Failed to create learning path')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAIGenerate = async () => {
    if (!aiGoal.trim()) {
      toast.error('Please describe your learning goals')
      return
    }

    setIsGenerating(true)
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2000))

      // AI would analyze courses and select appropriate ones
      const recommended = availableCourses
        .slice(0, Math.min(5, availableCourses.length))
        .map(c => c.id)

      setSelectedCourses(recommended)
      setName(`${skillLevel.charAt(0).toUpperCase() + skillLevel.slice(1)} Path: ${aiGoal.slice(0, 30)}`)
      setDescription(`AI-generated learning path focused on ${aiGoal}`)
      setGenerationType('manual') // Switch to manual to review

      toast.success('AI recommendations generated! Review and customize your path.')
    } catch (error) {
      toast.error('Failed to generate recommendations')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleClose = () => {
    setName('')
    setDescription('')
    setSelectedCourses([])
    setAiGoal('')
    setGenerationType('manual')
    onClose()
  }

  const toggleCourse = (courseId: string) => {
    setSelectedCourses(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Learning Path"
      size="lg"
    >
      <div className="space-y-6">
        {/* Generation Type Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setGenerationType('manual')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              generationType === 'manual'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Manual Selection
          </button>
          <button
            onClick={() => setGenerationType('ai')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${
              generationType === 'ai'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            AI Recommended
          </button>
        </div>

        {generationType === 'ai' ? (
          <div className="space-y-4">
            <Textarea
              label="What do you want to learn?"
              placeholder="e.g., Become proficient in compliance and security practices for my role as a team lead..."
              value={aiGoal}
              onChange={(e) => setAiGoal(e.target.value)}
              rows={3}
            />
            <Select
              label="Current Skill Level"
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value as typeof skillLevel)}
              options={[
                { value: 'beginner', label: 'Beginner - New to this area' },
                { value: 'intermediate', label: 'Intermediate - Some experience' },
                { value: 'advanced', label: 'Advanced - Looking to deepen expertise' },
              ]}
            />
            <Button
              onClick={handleAIGenerate}
              loading={isGenerating}
              className="w-full"
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Generate Recommendations
            </Button>
          </div>
        ) : (
          <>
            <Input
              label="Path Name"
              placeholder="e.g., New Hire Essential Training"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Textarea
              label="Description"
              placeholder="Describe what learners will achieve after completing this path..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Courses ({selectedCourses.length} selected)
              </label>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {availableCourses.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No courses available. Create some courses first.
                  </p>
                ) : (
                  availableCourses.map((course, index) => (
                    <div
                      key={course.id}
                      onClick={() => toggleCourse(course.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedCourses.includes(course.id)
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        selectedCourses.includes(course.id)
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {selectedCourses.includes(course.id) 
                          ? selectedCourses.indexOf(course.id) + 1
                          : index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {course.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {course.episodes?.length || 0} episodes
                        </p>
                      </div>
                      {selectedCourses.includes(course.id) && (
                        <CheckCircle2 className="w-5 h-5 text-primary-500" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        <div className="flex gap-3 pt-4">
          <Button variant="secondary" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          {generationType === 'manual' && (
            <Button
              onClick={handleCreate}
              loading={isGenerating}
              disabled={!name.trim() || selectedCourses.length === 0}
              className="flex-1"
            >
              Create Path
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}

export function LearningPathsPage() {
  const [paths, setPaths] = useState<LearningPath[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch courses
      const { data: coursesData } = await supabase
        .from('courses')
        .select('*, episodes(*)')
        .order('created_at', { ascending: false })

      const formattedCourses: Course[] = (coursesData || []).map((course: any) => ({
        id: course.id,
        organizationId: course.organization_id,
        title: course.title,
        description: course.description || '',
        thumbnailUrl: course.thumbnail_url,
        status: course.status,
        createdBy: course.created_by,
        createdAt: course.created_at,
        updatedAt: course.updated_at,
        episodes: course.episodes || [],
      }))

      setCourses(formattedCourses)

      // Mock learning paths for demo
      setPaths([
        {
          id: '1',
          name: 'New Employee Onboarding Path',
          description: 'Essential training for all new team members covering company policies, security, and compliance.',
          courseIds: formattedCourses.slice(0, 3).map(c => c.id),
          courses: formattedCourses.slice(0, 3),
          completionPercentage: 45,
          aiGenerated: false,
          estimatedDuration: 180,
          enrolledCount: 48,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          milestones: [
            { afterCourse: 1, name: 'Company Basics', skillsAcquired: ['Company culture', 'HR policies'] },
            { afterCourse: 3, name: 'Fully Onboarded', skillsAcquired: ['Security awareness', 'Compliance'] },
          ],
        },
        {
          id: '2',
          name: 'Security & Compliance Track',
          description: 'Comprehensive security and compliance training for all employees.',
          courseIds: formattedCourses.slice(0, 2).map(c => c.id),
          courses: formattedCourses.slice(0, 2),
          completionPercentage: 72,
          aiGenerated: true,
          estimatedDuration: 120,
          enrolledCount: 156,
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          milestones: [
            { afterCourse: 2, name: 'Security Certified', skillsAcquired: ['Data protection', 'Risk assessment'] },
          ],
        },
      ])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePathCreated = (newPath: LearningPath) => {
    setPaths(prev => [newPath, ...prev])
  }

  const handleDeletePath = async (pathId: string) => {
    setPaths(prev => prev.filter(p => p.id !== pathId))
    toast.success('Learning path deleted')
    setOpenMenu(null)
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours === 0) return `${mins}m`
    if (mins === 0) return `${hours}h`
    return `${hours}h ${mins}m`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Learning Paths</h1>
          <p className="text-gray-600 mt-1">Create guided learning journeys for your team</p>
        </div>
        <Button 
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create Path
        </Button>
      </div>

      {/* Learning Paths */}
      {paths.length === 0 ? (
        <EmptyState
          icon={
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <Target className="w-8 h-8 text-purple-600" />
            </div>
          }
          title="No learning paths yet"
          description="Create learning paths to guide your team through structured training programs with clear milestones and goals."
          action={{ label: 'Create Learning Path', onClick: () => setIsCreateModalOpen(true) }}
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {paths.map((path, index) => (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{path.name}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          {path.aiGenerated && (
                            <Badge variant="secondary" className="text-xs">
                              <Sparkles className="w-3 h-3 mr-1" />
                              AI Generated
                            </Badge>
                          )}
                          <span className="text-xs text-gray-500">
                            {path.courses.length} courses
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenu(openMenu === path.id ? null : path.id)}
                        className="p-1 rounded hover:bg-gray-100"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </button>
                      {openMenu === path.id && (
                        <div className="absolute right-0 top-8 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
                          <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full">
                            <Edit className="w-4 h-4" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeletePath(path.id)}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{path.description}</p>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-500">Overall Progress</span>
                      <span className="font-medium text-gray-900">{path.completionPercentage}%</span>
                    </div>
                    <Progress value={path.completionPercentage} size="md" color="primary" />
                  </div>

                  {/* Course List Preview */}
                  <div className="space-y-2 mb-4">
                    {path.courses.slice(0, 3).map((course, idx) => (
                      <div key={course.id} className="flex items-center gap-2 text-sm">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                          idx < Math.ceil(path.completionPercentage / 100 * path.courses.length)
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {idx < Math.ceil(path.completionPercentage / 100 * path.courses.length) ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            idx + 1
                          )}
                        </div>
                        <span className="text-gray-700 truncate">{course.title}</span>
                      </div>
                    ))}
                    {path.courses.length > 3 && (
                      <p className="text-xs text-gray-500 ml-7">
                        +{path.courses.length - 3} more courses
                      </p>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDuration(path.estimatedDuration)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {path.enrolledCount} enrolled
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      View Details
                    </Button>
                  </div>

                  {/* Milestones */}
                  {path.milestones.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs font-medium text-gray-500 mb-2">Milestones</p>
                      <div className="flex gap-2">
                        {path.milestones.map((milestone, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            <GraduationCap className="w-3 h-3 mr-1" />
                            {milestone.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Create New Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: paths.length * 0.1 }}
          >
            <Card
              hover
              className="h-full min-h-[300px] flex items-center justify-center border-2 border-dashed border-gray-200 hover:border-primary-300 hover:bg-primary-50/50 cursor-pointer"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Create New Path</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Design custom learning journeys
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Create Modal */}
      <CreatePathModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={handlePathCreated}
        availableCourses={courses}
      />
    </div>
  )
}
