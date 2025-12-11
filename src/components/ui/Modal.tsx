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
<<<<<<< HEAD
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
=======
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
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
<<<<<<< HEAD
                'w-full bg-spotify-dark-gray rounded-xl shadow-spotify-lg overflow-hidden border border-white/10',
=======
                'w-full bg-white rounded-2xl shadow-2xl overflow-hidden',
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
                sizes[size],
                className
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              {title && (
<<<<<<< HEAD
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                  <h2 className="text-lg font-bold text-spotify-text-white">{title}</h2>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-spotify-medium-gray transition-colors"
                  >
                    <X className="w-5 h-5 text-spotify-text-gray" />
=======
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
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
<<<<<<< HEAD
    danger: 'bg-red-600 hover:bg-red-500 focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-500 focus:ring-yellow-500',
    info: 'bg-spotify-green hover:bg-spotify-green-light focus:ring-spotify-green text-black',
=======
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
    info: 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500',
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
<<<<<<< HEAD
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
=======
      <p className="text-gray-600 mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={cn(
            'px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50',
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
            buttonVariants[variant]
          )}
        >
          {loading ? 'Processing...' : confirmText}
<<<<<<< HEAD
        </motion.button>
=======
        </button>
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
      </div>
    </Modal>
  )
}
