import { useState, useEffect } from 'react'
import { Card, Badge, Button } from '../components/ui'

interface Scene {
  order: number
  scriptText: string
  sceneDescription: string
  duration: number
}

interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: number
  triggerPercentage: number
  explanation: string
}

interface Script {
  title: string
  estimatedDuration: number
  scenes: Scene[]
  quizQuestions: QuizQuestion[]
  keyTakeaways: string[]
}

interface Episode {
  id: string
  title: string
  description: string
  orderIndex: number
  status: string
  duration: number
  script: Script
}

interface CourseData {
  course: {
    id: string
    title: string
    description: string
    createdAt: string
    status: string
    duration: number
  }
  episodes: Episode[]
  metadata: {
    totalDuration: number
    episodeCount: number
    totalScenes: number
    totalQuizQuestions: number
    generatedFrom: string
    generatedAt: string
  }
}

// Import the course data
import courseData from '../../generated-courses/ai-browser-agents-course.json'

export default function CourseViewer() {
  const [data] = useState<CourseData>(courseData as CourseData)
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)

  useEffect(() => {
    if (data.episodes.length > 0) {
      setSelectedEpisode(data.episodes[0])
    }
  }, [data])

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${data.course.id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    setQuizAnswers(prev => ({ ...prev, [questionIndex]: answerIndex }))
  }

  const submitQuiz = () => {
    setQuizSubmitted(true)
  }

  const getQuizScore = () => {
    if (!selectedEpisode) return 0
    const questions = selectedEpisode.script.quizQuestions
    let correct = 0
    questions.forEach((q, i) => {
      if (quizAnswers[i] === q.correctAnswer) correct++
    })
    return Math.round((correct / questions.length) * 100)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{data.course.title}</h1>
              <p className="text-gray-600 mt-2">{data.course.description}</p>
            </div>
            <div className="flex gap-2">
              <Badge variant={data.course.status === 'ready' ? 'success' : 'default'}>
                {data.course.status}
              </Badge>
              <Button onClick={handleDownload}>
                📥 Download Course
              </Button>
            </div>
          </div>
          
          {/* Course Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{data.metadata.episodeCount}</div>
              <div className="text-sm text-gray-600">Episodes</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{data.metadata.totalScenes}</div>
              <div className="text-sm text-gray-600">Scenes</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{data.metadata.totalQuizQuestions}</div>
              <div className="text-sm text-gray-600">Quiz Questions</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{formatDuration(data.metadata.totalDuration)}</div>
              <div className="text-sm text-gray-600">Total Duration</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Episode List */}
          <div className="col-span-4">
            <Card className="p-4">
              <h2 className="text-xl font-semibold mb-4">Episodes</h2>
              <div className="space-y-2">
                {data.episodes.map((episode) => (
                  <button
                    key={episode.id}
                    onClick={() => {
                      setSelectedEpisode(episode)
                      setShowQuiz(false)
                      setQuizAnswers({})
                      setQuizSubmitted(false)
                    }}
                    className={`w-full text-left p-4 rounded-lg transition-colors ${
                      selectedEpisode?.id === episode.id
                        ? 'bg-blue-100 border-2 border-blue-500'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Ep {episode.orderIndex}</span>
                      <span className="text-sm text-gray-500">{formatDuration(episode.duration)}</span>
                    </div>
                    <div className="text-sm mt-1 text-gray-700">{episode.title.replace(/Episode \d+: /, '')}</div>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="default" className="text-xs">
                        {episode.script.scenes.length} scenes
                      </Badge>
                      <Badge variant="default" className="text-xs">
                        {episode.script.quizQuestions.length} questions
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Episode Content */}
          <div className="col-span-8">
            {selectedEpisode && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">{selectedEpisode.title}</h2>
                  <div className="flex gap-2">
                    <Button
                      variant={!showQuiz ? 'primary' : 'secondary'}
                      onClick={() => setShowQuiz(false)}
                    >
                      📜 Script
                    </Button>
                    <Button
                      variant={showQuiz ? 'primary' : 'secondary'}
                      onClick={() => setShowQuiz(true)}
                    >
                      ❓ Quiz
                    </Button>
                  </div>
                </div>

                {!showQuiz ? (
                  <>
                    {/* Script Content */}
                    <div className="space-y-6">
                      {selectedEpisode.script.scenes.map((scene) => (
                        <div key={scene.order} className="border-l-4 border-blue-500 pl-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="default">Scene {scene.order}</Badge>
                            <span className="text-sm text-gray-500">{scene.duration}s</span>
                          </div>
                          <p className="text-gray-800 mb-2">{scene.scriptText}</p>
                          <div className="text-sm text-gray-500 italic">
                            🎬 {scene.sceneDescription}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Key Takeaways */}
                    <div className="mt-8 bg-green-50 rounded-lg p-4">
                      <h3 className="font-semibold text-green-800 mb-2">📌 Key Takeaways</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedEpisode.script.keyTakeaways.map((takeaway, index) => (
                          <li key={index} className="text-green-700">{takeaway}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Quiz Content */}
                    <div className="space-y-6">
                      {selectedEpisode.script.quizQuestions.map((question, qIndex) => (
                        <div key={qIndex} className="border rounded-lg p-4">
                          <h4 className="font-medium mb-3">Q{qIndex + 1}: {question.question}</h4>
                          <div className="space-y-2">
                            {question.options.map((option, oIndex) => (
                              <button
                                key={oIndex}
                                onClick={() => !quizSubmitted && handleQuizAnswer(qIndex, oIndex)}
                                disabled={quizSubmitted}
                                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                                  quizSubmitted
                                    ? oIndex === question.correctAnswer
                                      ? 'bg-green-100 border-green-500'
                                      : quizAnswers[qIndex] === oIndex
                                        ? 'bg-red-100 border-red-500'
                                        : 'bg-gray-50'
                                    : quizAnswers[qIndex] === oIndex
                                      ? 'bg-blue-100 border-blue-500'
                                      : 'bg-gray-50 hover:bg-gray-100'
                                }`}
                              >
                                <span className="font-medium">{String.fromCharCode(65 + oIndex)}.</span> {option}
                              </button>
                            ))}
                          </div>
                          {quizSubmitted && (
                            <div className={`mt-3 p-3 rounded-lg ${
                              quizAnswers[qIndex] === question.correctAnswer
                                ? 'bg-green-50 text-green-800'
                                : 'bg-red-50 text-red-800'
                            }`}>
                              <strong>{quizAnswers[qIndex] === question.correctAnswer ? '✅ Correct!' : '❌ Incorrect'}</strong>
                              <p className="mt-1 text-sm">{question.explanation}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {!quizSubmitted ? (
                      <Button
                        className="mt-6 w-full"
                        onClick={submitQuiz}
                        disabled={Object.keys(quizAnswers).length !== selectedEpisode.script.quizQuestions.length}
                      >
                        Submit Quiz
                      </Button>
                    ) : (
                      <div className="mt-6 bg-blue-50 rounded-lg p-4 text-center">
                        <h3 className="text-2xl font-bold text-blue-600">{getQuizScore()}%</h3>
                        <p className="text-gray-600">Quiz Score</p>
                        <Button
                          className="mt-4"
                          onClick={() => {
                            setQuizAnswers({})
                            setQuizSubmitted(false)
                          }}
                        >
                          Retry Quiz
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </Card>
            )}
          </div>
        </div>

        {/* Source Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Generated from: {data.metadata.generatedFrom} | {new Date(data.metadata.generatedAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  )
}
