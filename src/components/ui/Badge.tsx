import { cn, getStatusColor } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
<<<<<<< HEAD
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'secondary' | 'danger' | 'spotify'
=======
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'secondary' | 'danger'
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
  size?: 'sm' | 'md'
  className?: string
}

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  const variants = {
<<<<<<< HEAD
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
=======
    default: 'bg-slate-100 text-slate-700 border border-slate-200',
    success: 'bg-green-50 text-green-700 border border-green-200',
    warning: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    error: 'bg-red-50 text-red-700 border border-red-200',
    info: 'bg-blue-50 text-blue-700 border border-blue-200',
    secondary: 'bg-slate-100 text-slate-600 border border-slate-200',
    danger: 'bg-red-50 text-red-700 border border-red-200',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
  }

  return (
    <span
      className={cn(
<<<<<<< HEAD
        'inline-flex items-center font-bold rounded-full',
=======
        'inline-flex items-center font-medium rounded-full',
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
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
<<<<<<< HEAD
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
=======
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full capitalize',
        getStatusColor(status)
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
      )}
    >
      {status.replace(/-/g, ' ')}
    </span>
  )
}
