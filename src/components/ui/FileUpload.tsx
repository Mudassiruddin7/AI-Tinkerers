import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, File, Image, X, CheckCircle, AlertCircle } from 'lucide-react'
import { cn, bytesToMB, validateFileSize } from '@/lib/utils'

interface FileUploadProps {
  accept?: Record<string, string[]>
  maxSize?: number // in MB
  maxFiles?: number
  onFilesSelected: (files: File[]) => void
  onFileRemove?: (file: File) => void
  label?: string
  hint?: string
  fileType?: 'document' | 'image' | 'any'
  className?: string
}

export function FileUpload({
  accept,
  maxSize = 10,
  maxFiles = 1,
  onFilesSelected,
  onFileRemove,
  label,
  hint,
  fileType = 'any',
  className,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [errors, setErrors] = useState<string[]>([])

  const defaultAccept = {
    document: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
    },
    image: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    any: {},
  }

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      const newErrors: string[] = []

      // Check for rejected files
      rejectedFiles.forEach((rejection) => {
        const { file, errors } = rejection
        errors.forEach((error: any) => {
          if (error.code === 'file-too-large') {
            newErrors.push(`${file.name} is too large. Max size is ${maxSize}MB`)
          } else if (error.code === 'file-invalid-type') {
            newErrors.push(`${file.name} has an invalid file type`)
          }
        })
      })

      // Validate file sizes manually as well
      const validFiles = acceptedFiles.filter((file) => {
        if (!validateFileSize(file, maxSize)) {
          newErrors.push(`${file.name} exceeds maximum size of ${maxSize}MB`)
          return false
        }
        return true
      })

      setErrors(newErrors)

      if (validFiles.length > 0) {
        const newFiles = maxFiles === 1 ? validFiles : [...files, ...validFiles].slice(0, maxFiles)
        setFiles(newFiles)
        onFilesSelected(newFiles)
      }
    },
    [files, maxFiles, maxSize, onFilesSelected]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept || defaultAccept[fileType],
    maxSize: maxSize * 1024 * 1024,
    maxFiles,
    multiple: maxFiles > 1,
  })

  const removeFile = (fileToRemove: File) => {
    const newFiles = files.filter((f) => f !== fileToRemove)
    setFiles(newFiles)
    onFileRemove?.(fileToRemove)
    onFilesSelected(newFiles)
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-5 h-5 text-primary-500" />
    }
    return <File className="w-5 h-5 text-primary-500" />
  }

  return (
    <div className={cn('space-y-3', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}

      <div
        {...getRootProps()}
        className={cn(
          'relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200',
          isDragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <div
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center transition-colors',
              isDragActive ? 'bg-primary-100' : 'bg-gray-100'
            )}
          >
            <Upload
              className={cn(
                'w-6 h-6 transition-colors',
                isDragActive ? 'text-primary-600' : 'text-gray-400'
              )}
            />
          </div>
          <div>
            <p className="text-sm text-gray-600">
              {isDragActive ? (
                <span className="text-primary-600 font-medium">Drop files here...</span>
              ) : (
                <>
                  <span className="text-primary-600 font-medium">Click to upload</span> or drag and
                  drop
                </>
              )}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {hint ||
                `${fileType === 'document' ? 'PDF, DOCX, PPTX' : fileType === 'image' ? 'JPG, PNG, WebP' : 'Any file'} up to ${maxSize}MB`}
            </p>
          </div>
        </div>
      </div>

      {/* Error Messages */}
      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2"
          >
            {errors.map((error, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            {files.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {getFileIcon(file)}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{bytesToMB(file.size)} MB</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <button
                    type="button"
                    onClick={() => removeFile(file)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
