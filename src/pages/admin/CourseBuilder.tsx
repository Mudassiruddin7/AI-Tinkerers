import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import {
  Save,
  Play,
  Plus,
  Trash2,
  GripVertical,
  Edit2,
  Clock,
  HelpCircle,
  ArrowLeft,
} from 'lucide-react'
import { Card, CardContent, CardHeader, Button, Input, Textarea, Modal } from '@/components/ui'
import type { Episode, Scene, QuizQuestion } from '@/types'

// Mock episode data
const mockEpisode: Episode = {
  id: 'ep-1',
  courseId: '1',
  title: 'Introduction to Compliance',
  description: 'Overview of Q4 compliance requirements and key changes.',
  order: 1,
  videoUrl: 'https://example.com/video.mp4',
  thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop',
  duration: 180,
  status: 'ready',
  scenes: [
    {
      id: 'scene-1',
      episodeId: 'ep-1',
      order: 1,
      scriptText: 'Welcome to our Q4 Compliance Training. In this session, we\'ll cover the essential policies and procedures you need to know.',
      voiceId: 'voice-1',
      audioUrl: '',
      imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop',
      duration: 15,
      startTime: 0,
    },
    {
      id: 'scene-2',
      episodeId: 'ep-1',
      order: 2,
      scriptText: 'Data privacy is more important than ever. Let\'s review the key principles of handling sensitive information.',
      voiceId: 'voice-1',
      audioUrl: '',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
      duration: 20,
      startTime: 15,
    },
  ],
  quizQuestions: [
    {
      id: 'quiz-1',
      episodeId: 'ep-1',
      question: 'What is the primary purpose of data privacy policies?',
      options: [
        'To make work harder',
        'To protect sensitive information',
        'To create more paperwork',
        'To slow down processes',
      ],
      correctAnswer: 1,
      timeLimit: 15,
      triggerTime: 50,
      explanation: 'Data privacy policies exist to protect sensitive information from unauthorized access.',
    },
  ],
  createdAt: '2024-11-15T10:00:00Z',
  updatedAt: '2024-11-20T14:30:00Z',
}

export function CourseBuilder() {
  const { courseId: _courseId } = useParams()
  const navigate = useNavigate()
  const [episode, setEpisode] = useState<Episode>(mockEpisode)
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null)
  const [selectedQuiz, setSelectedQuiz] = useState<QuizQuestion | null>(null)
  const [isSceneModalOpen, setIsSceneModalOpen] = useState(false)
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // In a real app, save to database
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Changes saved successfully!')
    } catch (error) {
      toast.error('Failed to save changes')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSceneSave = (sceneData: Partial<Scene>) => {
    if (selectedScene) {
      // Update existing scene
      setEpisode({
        ...episode,
        scenes: episode.scenes.map(s =>
          s.id === selectedScene.id ? { ...s, ...sceneData } : s
        ),
      })
    } else {
      // Add new scene
      const newScene: Scene = {
        id: `scene-${Date.now()}`,
        episodeId: episode.id,
        order: episode.scenes.length + 1,
        scriptText: sceneData.scriptText || '',
        voiceId: sceneData.voiceId || 'voice-1',
        imageUrl: sceneData.imageUrl || '',
        duration: 10,
        startTime: episode.scenes.reduce((total, s) => total + s.duration, 0),
      }
      setEpisode({
        ...episode,
        scenes: [...episode.scenes, newScene],
      })
    }
    setIsSceneModalOpen(false)
    setSelectedScene(null)
  }

  const handleQuizSave = (quizData: Partial<QuizQuestion>) => {
    if (selectedQuiz) {
      // Update existing quiz
      setEpisode({
        ...episode,
        quizQuestions: episode.quizQuestions.map(q =>
          q.id === selectedQuiz.id ? { ...q, ...quizData } : q
        ),
      })
    } else {
      // Add new quiz
      const newQuiz: QuizQuestion = {
        id: `quiz-${Date.now()}`,
        episodeId: episode.id,
        question: quizData.question || '',
        options: quizData.options || ['', '', '', ''],
        correctAnswer: quizData.correctAnswer || 0,
        timeLimit: quizData.timeLimit || 15,
        triggerTime: quizData.triggerTime || 50,
      }
      setEpisode({
        ...episode,
        quizQuestions: [...episode.quizQuestions, newQuiz],
      })
    }
    setIsQuizModalOpen(false)
    setSelectedQuiz(null)
  }

  const deleteScene = (sceneId: string) => {
    setEpisode({
      ...episode,
      scenes: episode.scenes.filter(s => s.id !== sceneId),
    })
  }

  const deleteQuiz = (quizId: string) => {
    setEpisode({
      ...episode,
      quizQuestions: episode.quizQuestions.filter(q => q.id !== quizId),
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin')}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{episode.title}</h1>
            <p className="text-gray-500 text-sm">Edit episode content and quiz questions</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" leftIcon={<Play className="w-4 h-4" />}>
            Preview
          </Button>
          <Button onClick={handleSave} loading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Scenes Section */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Scenes</h2>
              <Button
                size="sm"
                onClick={() => {
                  setSelectedScene(null)
                  setIsSceneModalOpen(true)
                }}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add Scene
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {episode.scenes.map((scene, index) => (
                <motion.div
                  key={scene.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <button className="p-1 cursor-grab hover:bg-gray-200 rounded">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                  </button>
                  {scene.imageUrl && (
                    <img
                      src={scene.imageUrl}
                      alt=""
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-500">Scene {index + 1}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {scene.duration}s
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">{scene.scriptText}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setSelectedScene(scene)
                        setIsSceneModalOpen(true)
                      }}
                      className="p-2 hover:bg-gray-200 rounded"
                    >
                      <Edit2 className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => deleteScene(scene.id)}
                      className="p-2 hover:bg-red-100 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </motion.div>
              ))}

              {episode.scenes.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No scenes yet. Add your first scene to get started.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quiz Questions Section */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Quiz Questions</h2>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setSelectedQuiz(null)
                  setIsQuizModalOpen(true)
                }}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {episode.quizQuestions.map((quiz, index) => (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-primary-500 flex-shrink-0" />
                      <span className="text-xs font-medium text-gray-500">
                        Q{index + 1} @ {quiz.triggerTime}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setSelectedQuiz(quiz)
                          setIsQuizModalOpen(true)
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Edit2 className="w-3 h-3 text-gray-500" />
                      </button>
                      <button
                        onClick={() => deleteQuiz(quiz.id)}
                        className="p-1 hover:bg-red-100 rounded"
                      >
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mt-2 line-clamp-2">{quiz.question}</p>
                </motion.div>
              ))}

              {episode.quizQuestions.length === 0 && (
                <div className="text-center py-6 text-gray-500 text-sm">
                  <p>No quiz questions yet.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Episode Settings */}
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-gray-900">Episode Settings</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Title"
                value={episode.title}
                onChange={(e) => setEpisode({ ...episode, title: e.target.value })}
              />
              <Textarea
                label="Description"
                value={episode.description}
                onChange={(e) => setEpisode({ ...episode, description: e.target.value })}
                rows={3}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Scene Edit Modal */}
      <Modal
        isOpen={isSceneModalOpen}
        onClose={() => {
          setIsSceneModalOpen(false)
          setSelectedScene(null)
        }}
        title={selectedScene ? 'Edit Scene' : 'Add Scene'}
        size="lg"
      >
        <SceneForm
          scene={selectedScene}
          onSave={handleSceneSave}
          onCancel={() => {
            setIsSceneModalOpen(false)
            setSelectedScene(null)
          }}
        />
      </Modal>

      {/* Quiz Edit Modal */}
      <Modal
        isOpen={isQuizModalOpen}
        onClose={() => {
          setIsQuizModalOpen(false)
          setSelectedQuiz(null)
        }}
        title={selectedQuiz ? 'Edit Quiz Question' : 'Add Quiz Question'}
        size="lg"
      >
        <QuizForm
          quiz={selectedQuiz}
          onSave={handleQuizSave}
          onCancel={() => {
            setIsQuizModalOpen(false)
            setSelectedQuiz(null)
          }}
        />
      </Modal>
    </div>
  )
}

// Scene Form Component
function SceneForm({
  scene,
  onSave,
  onCancel,
}: {
  scene: Scene | null
  onSave: (data: Partial<Scene>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    scriptText: scene?.scriptText || '',
    imageUrl: scene?.imageUrl || '',
  })

  return (
    <div className="space-y-4">
      <Textarea
        label="Script Text"
        value={formData.scriptText}
        onChange={(e) => setFormData({ ...formData, scriptText: e.target.value })}
        rows={5}
        placeholder="Enter the narration script for this scene..."
      />
      <Input
        label="Image URL (optional)"
        value={formData.imageUrl}
        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
        placeholder="https://example.com/image.jpg"
      />
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => onSave(formData)}>
          {scene ? 'Save Changes' : 'Add Scene'}
        </Button>
      </div>
    </div>
  )
}

// Quiz Form Component
function QuizForm({
  quiz,
  onSave,
  onCancel,
}: {
  quiz: QuizQuestion | null
  onSave: (data: Partial<QuizQuestion>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    question: quiz?.question || '',
    options: quiz?.options || ['', '', '', ''],
    correctAnswer: quiz?.correctAnswer || 0,
    triggerTime: quiz?.triggerTime || 50,
    timeLimit: quiz?.timeLimit || 15,
  })

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData({ ...formData, options: newOptions })
  }

  return (
    <div className="space-y-4">
      <Textarea
        label="Question"
        value={formData.question}
        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
        rows={2}
        placeholder="Enter your quiz question..."
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Answer Options (select correct answer)
        </label>
        <div className="space-y-2">
          {formData.options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="radio"
                name="correctAnswer"
                checked={formData.correctAnswer === index}
                onChange={() => setFormData({ ...formData, correctAnswer: index })}
                className="text-primary-600 focus:ring-primary-500"
              />
              <input
                type="text"
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Trigger Time (%)"
          type="number"
          min={0}
          max={100}
          value={formData.triggerTime}
          onChange={(e) => setFormData({ ...formData, triggerTime: Number(e.target.value) })}
        />
        <Input
          label="Time Limit (seconds)"
          type="number"
          min={5}
          max={60}
          value={formData.timeLimit}
          onChange={(e) => setFormData({ ...formData, timeLimit: Number(e.target.value) })}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => onSave(formData)}>
          {quiz ? 'Save Changes' : 'Add Question'}
        </Button>
      </div>
    </div>
  )
}
