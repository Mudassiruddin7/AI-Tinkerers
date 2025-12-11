import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Button } from './Button'
import { 
  FileText, 
  Users, 
  BookOpen, 
  Search, 
  FolderOpen,
  Bell
} from 'lucide-react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  } | ReactNode
  className?: string
  variant?: 'default' | 'compact'
}

const isActionObject = (action: EmptyStateProps['action']): action is { label: string; onClick: () => void } => {
  return action !== null && typeof action === 'object' && 'label' in action && 'onClick' in action
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  variant = 'default',
}: EmptyStateProps) {
  const defaultIcon = (
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
      <FolderOpen className="w-8 h-8 text-gray-400" />
    </div>
  )

  const renderAction = () => {
    if (!action) return null
    if (isActionObject(action)) {
      return (
        <Button
          variant={variant === 'compact' ? 'ghost' : 'primary'}
          size={variant === 'compact' ? 'sm' : 'md'}
          className={variant === 'compact' ? 'mt-2' : 'mt-6'}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )
    }
    return <div className={variant === 'compact' ? 'mt-2' : 'mt-6'}>{action}</div>
  }

  if (variant === 'compact') {
    return (
      <div className={cn('text-center py-8', className)}>
        <div className="flex justify-center mb-3">
          {icon || (
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-gray-400" />
            </div>
          )}
        </div>
        <p className="text-sm text-gray-500">{title}</p>
        {renderAction()}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      {icon || defaultIcon}
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-gray-500 max-w-sm">{description}</p>
      )}
      {renderAction()}
    </div>
  )
}

// Pre-built empty states for common use cases
export function NoCoursesEmpty({ onCreate }: { onCreate: () => void }) {
  return (
    <EmptyState
      icon={
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
          <BookOpen className="w-8 h-8 text-primary-600" />
        </div>
      }
      title="No courses yet"
      description="Create your first course by uploading a PDF and let AI generate engaging video content."
      action={{ label: 'Create Course', onClick: onCreate }}
    />
  )
}

export function NoLearnersEmpty({ onInvite }: { onInvite: () => void }) {
  return (
    <EmptyState
      icon={
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <Users className="w-8 h-8 text-green-600" />
        </div>
      }
      title="No learners enrolled"
      description="Invite team members to start learning from your training courses."
      action={{ label: 'Invite Learners', onClick: onInvite }}
    />
  )
}

export function NoResultsEmpty({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <EmptyState
      icon={
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
      }
      title={`No results for "${query}"`}
      description="Try adjusting your search terms or clearing filters."
      action={{ label: 'Clear Search', onClick: onClear }}
    />
  )
}

export function NoNotificationsEmpty() {
  return (
    <EmptyState
      icon={
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          <Bell className="w-8 h-8 text-gray-400" />
        </div>
      }
      title="No notifications"
      description="You're all caught up! New notifications will appear here."
      variant="compact"
    />
  )
}

export function NoDocumentsEmpty({ onUpload }: { onUpload: () => void }) {
  return (
    <EmptyState
      icon={
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <FileText className="w-8 h-8 text-blue-600" />
        </div>
      }
      title="No documents uploaded"
      description="Upload PDF, DOCX, or PPTX files to generate training content."
      action={{ label: 'Upload Documents', onClick: onUpload }}
    />
  )
}
