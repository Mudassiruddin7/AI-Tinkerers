import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
  variant?: 'default' | 'spotify' | 'glass'
}

export function Card({ children, className, hover = false, onClick, variant = 'default' }: CardProps) {
  const Component = hover ? motion.div : 'div'
  const hoverProps = hover
    ? {
        whileHover: { scale: 1.02, y: -4 },
        transition: { duration: 0.2 },
      }
    : {}

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
    <div className={cn('px-6 py-4 border-b border-white/5', className)}>
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
    <div className={cn('px-6 py-4 bg-spotify-medium-gray/50 border-t border-white/5', className)}>
      {children}
    </div>
  )
}
