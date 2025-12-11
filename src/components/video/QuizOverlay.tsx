/**
 * Quiz Overlay Component
 * Interactive quiz display during video playback
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Clock, Trophy, ChevronRight, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
  points?: number
}

interface QuizOverlayProps {
  questions: QuizQuestion[]
  onComplete: (score: number, total: number, answers: Record<string, number>) => void
  onSkip?: () => void
  allowSkip?: boolean
  timeLimit?: number // seconds per question
  showExplanation?: boolean
  className?: string
}

export function QuizOverlay({
  questions,
  onComplete,
  onSkip,
  allowSkip = false,
  timeLimit = 30,
  showExplanation = true,
  className,
}: QuizOverlayProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [timeRemaining, setTimeRemaining] = useState(timeLimit)
  const [showResults, setShowResults] = useState(false)

  const currentQuestion = questions[currentIndex]
  const isLastQuestion = currentIndex === questions.length - 1

  // Timer
  useEffect(() => {
    if (isAnswered || timeRemaining <= 0) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleTimeout()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isAnswered, timeRemaining])

  // Reset timer on question change
  useEffect(() => {
    setTimeRemaining(timeLimit)
    setSelectedAnswer(null)
    setIsAnswered(false)
  }, [currentIndex, timeLimit])

  const handleTimeout = () => {
    setIsAnswered(true)
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: -1 }))
  }

  const handleSelectAnswer = (index: number) => {
    if (isAnswered) return
    setSelectedAnswer(index)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return

    setIsAnswered(true)
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: selectedAnswer }))

    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore((prev) => prev + (currentQuestion.points || 1))
    }
  }

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setShowResults(true)
    } else {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const handleComplete = () => {
    onComplete(score, questions.length, answers)
  }

  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100)
    const isPassing = percentage >= 70

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          'bg-gray-900/95 backdrop-blur-sm p-8 rounded-2xl max-w-md w-full text-center',
          className
        )}
      >
        <div
          className={cn(
            'w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4',
            isPassing ? 'bg-green-500/20' : 'bg-yellow-500/20'
          )}
        >
          {isPassing ? (
            <Trophy className="w-10 h-10 text-green-500" />
          ) : (
            <AlertCircle className="w-10 h-10 text-yellow-500" />
          )}
        </div>

        <h3 className="text-2xl font-bold text-white mb-2">
          {isPassing ? 'Great Job!' : 'Keep Learning!'}
        </h3>

        <p className="text-gray-400 mb-6">
          You scored {score} out of {questions.length} ({percentage}%)
        </p>

        <div className="flex gap-4 justify-center">
          <Button onClick={handleComplete} className="px-8">
            Continue
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        'bg-gray-900/95 backdrop-blur-sm p-6 rounded-2xl max-w-lg w-full',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-gray-400">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <div
          className={cn(
            'flex items-center gap-2 px-3 py-1 rounded-full text-sm',
            timeRemaining <= 10 ? 'bg-red-500/20 text-red-400' : 'bg-gray-800 text-gray-300'
          )}
        >
          <Clock className="w-4 h-4" />
          {timeRemaining}s
        </div>
      </div>

      {/* Progress */}
      <div className="h-1 bg-gray-800 rounded-full mb-6 overflow-hidden">
        <motion.div
          className="h-full bg-primary-500"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Question */}
      <h4 className="text-xl font-semibold text-white mb-6">
        {currentQuestion.question}
      </h4>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedAnswer === index
          const isCorrectAnswer = index === currentQuestion.correctAnswer
          const showCorrect = isAnswered && isCorrectAnswer
          const showIncorrect = isAnswered && isSelected && !isCorrectAnswer

          return (
            <motion.button
              key={index}
              onClick={() => handleSelectAnswer(index)}
              disabled={isAnswered}
              whileHover={!isAnswered ? { scale: 1.02 } : undefined}
              whileTap={!isAnswered ? { scale: 0.98 } : undefined}
              className={cn(
                'w-full p-4 rounded-xl text-left transition-all flex items-center gap-3',
                !isAnswered && !isSelected && 'bg-gray-800 hover:bg-gray-700 text-white',
                !isAnswered && isSelected && 'bg-primary-500 text-white',
                showCorrect && 'bg-green-500/20 border-2 border-green-500 text-white',
                showIncorrect && 'bg-red-500/20 border-2 border-red-500 text-white',
                isAnswered && !showCorrect && !showIncorrect && 'bg-gray-800/50 text-gray-400'
              )}
            >
              <span
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0',
                  !isAnswered && 'bg-gray-700',
                  showCorrect && 'bg-green-500 text-white',
                  showIncorrect && 'bg-red-500 text-white'
                )}
              >
                {showCorrect ? (
                  <Check className="w-5 h-5" />
                ) : showIncorrect ? (
                  <X className="w-5 h-5" />
                ) : (
                  String.fromCharCode(65 + index)
                )}
              </span>
              <span>{option}</span>
            </motion.button>
          )
        })}
      </div>

      {/* Explanation */}
      <AnimatePresence>
        {isAnswered && showExplanation && currentQuestion.explanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg"
          >
            <p className="text-sm text-blue-300">
              <strong>Explanation:</strong> {currentQuestion.explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="flex items-center justify-between">
        {allowSkip && onSkip && !isAnswered && (
          <Button variant="ghost" onClick={onSkip} className="text-gray-400">
            Skip Quiz
          </Button>
        )}
        <div className="flex-1" />
        {!isAnswered ? (
          <Button
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null}
            className="px-6"
          >
            Submit Answer
          </Button>
        ) : (
          <Button onClick={handleNextQuestion} className="px-6">
            {isLastQuestion ? 'See Results' : 'Next Question'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </motion.div>
  )
}

export default QuizOverlay
