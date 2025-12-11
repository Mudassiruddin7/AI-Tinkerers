<<<<<<< HEAD
import { motion } from 'framer-motion'
=======
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
<<<<<<< HEAD
  color?: 'primary' | 'success' | 'warning' | 'error' | 'spotify'
  showLabel?: boolean
  className?: string
  animated?: boolean
=======
  color?: 'primary' | 'success' | 'warning' | 'error'
  showLabel?: boolean
  className?: string
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
}

export function ProgressBar({
  value,
  max = 100,
  size = 'md',
<<<<<<< HEAD
  color = 'spotify',
  showLabel = false,
  className,
  animated = true,
=======
  color = 'primary',
  showLabel = false,
  className,
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const sizes = {
    sm: 'h-1',
<<<<<<< HEAD
    md: 'h-1.5',
    lg: 'h-2',
  }

  const colors = {
    primary: 'bg-spotify-green',
    success: 'bg-spotify-green',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    spotify: 'bg-spotify-green',
=======
    md: 'h-2',
    lg: 'h-3',
  }

  const colors = {
    primary: 'bg-primary-600',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
  }

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
<<<<<<< HEAD
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-spotify-text-white">Progress</span>
          <span className="text-sm text-spotify-text-gray">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn('w-full bg-spotify-light-gray rounded-full overflow-hidden', sizes[size])}>
        <motion.div
          className={cn('h-full rounded-full', colors[color])}
          initial={animated ? { width: 0 } : false}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
=======
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-500">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', sizes[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', colors[color])}
          style={{ width: `${percentage}%` }}
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
        />
      </div>
    </div>
  )
}

interface CircularProgressProps {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  color?: string
  showValue?: boolean
  className?: string
}

export function CircularProgress({
  value,
  max = 100,
  size = 64,
  strokeWidth = 4,
<<<<<<< HEAD
  color = '#1DB954',
=======
  color = '#3b82f6',
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
  showValue = true,
  className,
}: CircularProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
<<<<<<< HEAD
          stroke="#404040"
=======
          stroke="#e5e7eb"
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
<<<<<<< HEAD
        <motion.circle
=======
        <circle
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
<<<<<<< HEAD
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </svg>
      {showValue && (
        <span className="absolute text-sm font-bold text-spotify-text-white">
=======
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {showValue && (
        <span className="absolute text-sm font-semibold text-gray-700">
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  )
}
