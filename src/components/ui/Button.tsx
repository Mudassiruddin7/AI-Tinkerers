import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'spotify'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  isLoading,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  ...props
}: ButtonProps) {
  const isButtonLoading = loading || isLoading
  const baseStyles = 'inline-flex items-center justify-center font-bold transition-all duration-200 ease-spotify focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-spotify-black disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-spotify-green text-black rounded-full hover:bg-spotify-green-light hover:scale-105 focus:ring-spotify-green shadow-lg hover:shadow-glow-green',
    secondary: 'bg-transparent text-spotify-text-white rounded-full border border-spotify-text-gray/50 hover:border-spotify-text-white hover:scale-105 focus:ring-spotify-text-white',
    danger: 'bg-red-600 text-white rounded-full hover:bg-red-500 hover:scale-105 focus:ring-red-500',
    ghost: 'text-spotify-text-gray hover:text-spotify-text-white hover:bg-spotify-hover-bg rounded-lg focus:ring-spotify-text-gray',
    outline: 'bg-transparent text-spotify-text-gray rounded-lg border border-spotify-light-gray hover:bg-spotify-medium-gray hover:text-spotify-text-white focus:ring-spotify-light-gray',
    spotify: 'bg-spotify-green text-black rounded-full hover:bg-spotify-green-light hover:scale-105 focus:ring-spotify-green shadow-lg hover:shadow-glow-green animate-pulse-slow hover:animate-none',
  }
  
  const sizes = {
    sm: 'px-4 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3 text-base',
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={cn(baseStyles, variants[variant], sizes[size], fullWidth && 'w-full', className)}
      disabled={disabled || isButtonLoading}
      {...props}
    >
      {isButtonLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : leftIcon ? (
        <span className="mr-2">{leftIcon}</span>
      ) : null}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </motion.button>
  )
}
