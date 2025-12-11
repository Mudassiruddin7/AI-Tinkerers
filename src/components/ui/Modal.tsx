import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className,
}: ModalProps) {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className={cn(
                'w-full bg-spotify-dark-gray rounded-xl shadow-spotify-lg overflow-hidden border border-white/10',
                sizes[size],
                className
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              {title && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                  <h2 className="text-lg font-bold text-spotify-text-white">{title}</h2>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-spotify-medium-gray transition-colors"
                  >
                    <X className="w-5 h-5 text-spotify-text-gray" />
                  </button>
                </div>
              )}

              {/* Content */}
              <div className="px-6 py-4">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  loading?: boolean
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}: ConfirmModalProps) {
  const buttonVariants = {
    danger: 'bg-red-600 hover:bg-red-500 focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-500 focus:ring-yellow-500',
    info: 'bg-spotify-green hover:bg-spotify-green-light focus:ring-spotify-green text-black',
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-spotify-text-gray mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          disabled={loading}
          className="px-5 py-2.5 text-sm font-bold text-spotify-text-white bg-transparent border border-spotify-text-gray/50 rounded-full hover:border-spotify-text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-spotify-dark-gray focus:ring-spotify-text-white disabled:opacity-50 transition-all"
        >
          {cancelText}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onConfirm}
          disabled={loading}
          className={cn(
            'px-5 py-2.5 text-sm font-bold text-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-spotify-dark-gray disabled:opacity-50 transition-all',
            buttonVariants[variant]
          )}
        >
          {loading ? 'Processing...' : confirmText}
        </motion.button>
      </div>
    </Modal>
  )
}
