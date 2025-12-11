import { cn, getStatusColor } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'secondary' | 'danger' | 'spotify'
  size?: 'sm' | 'md'
  className?: string
}

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  const variants = {
    default: 'bg-spotify-medium-gray text-spotify-text-white',
    success: 'bg-spotify-green/20 text-spotify-green',
    warning: 'bg-yellow-500/20 text-yellow-400',
    error: 'bg-red-500/20 text-red-400',
    info: 'bg-blue-500/20 text-blue-400',
    secondary: 'bg-spotify-light-gray text-spotify-text-gray',
    danger: 'bg-red-500/20 text-red-400',
    spotify: 'bg-spotify-green text-black font-bold',
  }

  const sizes = {
    sm: 'px-2.5 py-0.5 text-[10px] uppercase tracking-wider',
    md: 'px-3 py-1 text-xs uppercase tracking-wider',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-bold rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const statusVariants: Record<string, string> = {
    published: 'bg-spotify-green/90 text-black',
    processing: 'bg-yellow-500/90 text-black',
    draft: 'bg-spotify-medium-gray text-spotify-text-gray',
    ready: 'bg-spotify-green/90 text-black',
    failed: 'bg-red-500/90 text-white',
    pending: 'bg-blue-500/90 text-white',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider',
        statusVariants[status] || 'bg-spotify-medium-gray text-spotify-text-gray'
      )}
    >
      {status.replace(/-/g, ' ')}
    </span>
  )
}
