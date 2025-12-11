import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || props.name

    return (
<<<<<<< HEAD
      <div className="space-y-2">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-spotify-text-gray">
=======
      <div className="space-y-1">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
<<<<<<< HEAD
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-spotify-text-gray">
=======
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
<<<<<<< HEAD
              'w-full px-4 py-3 border-0 rounded-lg transition-all duration-200 bg-spotify-medium-gray text-spotify-text-white placeholder-spotify-text-gray',
              'focus:outline-none focus:ring-2 focus:ring-spotify-green',
              error && 'ring-2 ring-red-500',
              leftIcon && 'pl-12',
              rightIcon && 'pr-12',
=======
              'w-full px-4 py-2 border rounded-lg transition-all duration-200 bg-white',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
              error
                ? 'border-red-300 focus:ring-red-500/20'
                : 'border-gray-200 hover:border-gray-300',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
              className
            )}
            {...props}
          />
          {rightIcon && (
<<<<<<< HEAD
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-spotify-text-gray">
=======
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
              {rightIcon}
            </span>
          )}
        </div>
        {error && (
<<<<<<< HEAD
          <p className="text-sm text-red-400">{error}</p>
        )}
        {hint && !error && (
          <p className="text-sm text-spotify-text-gray">{hint}</p>
=======
          <p className="text-sm text-red-600">{error}</p>
        )}
        {hint && !error && (
          <p className="text-sm text-gray-500">{hint}</p>
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const textareaId = id || props.name

    return (
<<<<<<< HEAD
      <div className="space-y-2">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-spotify-text-gray">
=======
      <div className="space-y-1">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700">
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
<<<<<<< HEAD
            'w-full px-4 py-3 border-0 rounded-lg transition-all duration-200 resize-none bg-spotify-medium-gray text-spotify-text-white placeholder-spotify-text-gray',
            'focus:outline-none focus:ring-2 focus:ring-spotify-green',
            error && 'ring-2 ring-red-500',
=======
            'w-full px-4 py-2 border rounded-lg transition-all duration-200 resize-none',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            error
              ? 'border-red-300 focus:ring-red-500'
              : 'border-gray-300',
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
            className
          )}
          {...props}
        />
        {error && (
<<<<<<< HEAD
          <p className="text-sm text-red-400">{error}</p>
        )}
        {hint && !error && (
          <p className="text-sm text-spotify-text-gray">{hint}</p>
=======
          <p className="text-sm text-red-600">{error}</p>
        )}
        {hint && !error && (
          <p className="text-sm text-gray-500">{hint}</p>
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
