import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
<<<<<<< HEAD
  variant?: 'default' | 'spotify' | 'glass'
}

export function Card({ children, className, hover = false, onClick, variant = 'default' }: CardProps) {
=======
}

export function Card({ children, className, hover = false, onClick }: CardProps) {
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
  const Component = hover ? motion.div : 'div'
  const hoverProps = hover
    ? {
        whileHover: { scale: 1.02, y: -4 },
        transition: { duration: 0.2 },
      }
    : {}

<<<<<<< HEAD
  const variants = {
    default: 'bg-spotify-dark-gray rounded-lg shadow-spotify border border-white/5',
    spotify: 'bg-spotify-card-bg rounded-lg p-4 hover:bg-spotify-hover-bg transition-all duration-300 ease-spotify',
    glass: 'bg-spotify-black/70 backdrop-blur-xl border border-white/10 shadow-spotify-lg rounded-lg',
  }

  return (
    <Component
      className={cn(
        variants[variant],
        'overflow-hidden',
        hover && 'cursor-pointer hover:shadow-spotify-lg hover:border-white/10 transition-all duration-300',
=======
  return (
    <Component
      className={cn(
        'bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden',
        hover && 'cursor-pointer hover:shadow-lg hover:border-primary-100 transition-all duration-300',
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
        className
      )}
      onClick={onClick}
      {...hoverProps}
    >
      {children}
    </Component>
  )
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
<<<<<<< HEAD
    <div className={cn('px-6 py-4 border-b border-white/5', className)}>
=======
    <div className={cn('px-6 py-4 border-b border-gray-100', className)}>
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
      {children}
    </div>
  )
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-4', className)}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
<<<<<<< HEAD
    <div className={cn('px-6 py-4 bg-spotify-medium-gray/50 border-t border-white/5', className)}>
=======
    <div className={cn('px-6 py-4 bg-gray-50 border-t border-gray-100', className)}>
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
      {children}
    </div>
  )
}
