import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import {
  Upload,
  FileText,
  Users,
  Mic,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Video,
} from 'lucide-react'
import { Card, CardContent, Button, Input, Textarea, FileUpload } from '@/components/ui'
import { DEFAULT_VOICES } from '@/lib/elevenlabs'
import { generateCourse, type GenerationProgress } from '@/lib/courseGenerator'

type Step = 'details' | 'content' | 'photos' | 'voice' | 'review'

interface CourseFormData {
  title: string
  description: string
  documents: File[]
  employeePhotos: File[]
  selectedVoice: string
}

const PROCESSING_STEPS = [
  { key: 'extract', label: 'Extracting PDF content', icon: FileText },
  { key: 'photos', label: 'Processing photos', icon: Users },
  { key: 'ai', label: 'AI generating scripts & quizzes', icon: Sparkles },
  { key: 'audio', label: 'Creating voice narration', icon: Mic },
  { key: 'video', label: 'Generating AI videos', icon: Video },
  { key: 'save', label: 'Saving to database', icon: Upload },
  { key: 'complete', label: 'Course ready!', icon: CheckCircle2 },
]

export function CreateCourse() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState<Step>('details')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStatus, setProcessingStatus] = useState<GenerationProgress | null>(null)
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    documents: [],
    employeePhotos: [],
    selectedVoice: DEFAULT_VOICES[0].id,
  })

  const steps: { id: Step; label: string; icon: React.ElementType }[] = [
    { id: 'details', label: 'Course Details', icon: FileText },
    { id: 'content', label: 'Upload Content', icon: Upload },
    { id: 'photos', label: 'Employee Photos', icon: Users },
    { id: 'voice', label: 'Select Voice', icon: Mic },
    { id: 'review', label: 'Review & Create', icon: Sparkles },
  ]

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep)

  const canProceed = () => {
    switch (currentStep) {
      case 'details':
        return formData.title.trim().length > 0
      case 'content':
        return formData.documents.length > 0
      case 'photos':
        return formData.employeePhotos.length >= 1
      case 'voice':
        return formData.selectedVoice.length > 0
      case 'review':
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id)
    }
  }

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id)
    }
  }

  const handleCreateCourse = async () => {
    setIsProcessing(true)
    setProcessingStatus({ step: 'extract', progress: 0, message: 'Starting...' })
    
    try {
      const course = await generateCourse(
        {
          title: formData.title,
          description: formData.description,
          pdfFile: formData.documents[0],
          employeePhotos: formData.employeePhotos,
          voiceId: formData.selectedVoice,
        },
        (progress) => {
          setProcessingStatus(progress)
          
          // Show toast for major milestones
          if (progress.step === 'ai' && progress.progress === 35) {
            toast.success('AI is analyzing your content...')
          } else if (progress.step === 'audio' && progress.progress === 60) {
            toast.success('Generating voice narration...')
          }
        }
      )
      
      console.log('✅ Course created successfully:', course)
      
      // Show success message with instructions
      toast.success(
        `🎉 Course "${course.title}" created with ${course.episodes.length} episodes!`,
        { duration: 5000 }
      )
      
      // Brief delay to show success state
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Navigate to dashboard with a flag to refresh
      navigate('/admin', { replace: true })
      
      // Force a page reload to ensure courses are refreshed
      window.location.reload()
    } catch (error) {
      console.error('❌ Error creating course:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to create course'
      toast.error(`Error: ${errorMessage}`, { duration: 6000 })
    } finally {
      setIsProcessing(false)
      setProcessingStatus(null)
    }
  }

  const getCurrentProcessingStep = () => {
    if (!processingStatus) return -1
    return PROCESSING_STEPS.findIndex(s => s.key === processingStatus.step)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 'details':
        return (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Course Details</h2>
              <p className="text-gray-600">Give your training course a name and description.</p>
            </div>
            
            <Input
              label="Course Title"
              placeholder="e.g., Q4 Compliance Training"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            
            <Textarea
              label="Description"
              placeholder="Brief description of what this training covers..."
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </motion.div>
        )

      case 'content':
        return (
          <motion.div
            key="content"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Upload Training Content</h2>
              <p className="text-gray-600">
                Upload your PDF, DOCX, or PPTX files. Our AI will extract the content and create engaging video scripts.
              </p>
            </div>
            
            <FileUpload
              fileType="document"
              maxSize={10}
              maxFiles={5}
              onFilesSelected={(files) => setFormData({ ...formData, documents: files })}
              hint="PDF, DOCX, or PPTX up to 10MB each"
            />
            
            <div className="bg-blue-50 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Tips for best results:</p>
                <ul className="mt-1 list-disc list-inside text-blue-700 space-y-1">
                  <li>Use text-based PDFs (not scanned images)</li>
                  <li>Keep content focused and well-structured</li>
                  <li>Include clear headings for topic separation</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )

      case 'photos':
        return (
          <motion.div
            key="photos"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Employee Photos</h2>
              <p className="text-gray-600">
                Upload photos of employees who will appear in the training video. These photos will be used to create a personalized learning experience.
              </p>
            </div>
            
            <FileUpload
              fileType="image"
              maxSize={5}
              maxFiles={5}
              onFilesSelected={(files) => setFormData({ ...formData, employeePhotos: files })}
              hint="JPG or PNG, up to 5MB each. Upload 3-5 photos."
            />
            
            {/* Preview uploaded photos */}
            {formData.employeePhotos.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                {formData.employeePhotos.map((file, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Employee ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
            
            <div className="bg-yellow-50 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Consent Required</p>
                <p className="mt-1 text-yellow-700">
                  Ensure you have obtained proper consent from employees before using their photos in training content.
                </p>
              </div>
            </div>
          </motion.div>
        )

      case 'voice':
        return (
          <motion.div
            key="voice"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Select Narration Voice</h2>
              <p className="text-gray-600">
                Choose a voice for the AI narration. You can preview each voice before selecting.
              </p>
            </div>
            
            <div className="grid gap-3">
              {DEFAULT_VOICES.map((voice) => (
                <button
                  key={voice.id}
                  onClick={() => setFormData({ ...formData, selectedVoice: voice.id })}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    formData.selectedVoice === voice.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <Mic className={`w-6 h-6 ${formData.selectedVoice === voice.id ? 'text-primary-600' : 'text-gray-400'}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900">{voice.name}</p>
                    <p className="text-sm text-gray-500">{voice.description}</p>
                  </div>
                  {formData.selectedVoice === voice.id && (
                    <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )

      case 'review':
        return (
          <motion.div
            key="review"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Review & Create</h2>
              <p className="text-gray-600">
                Review your course details before we start generating your training video.
              </p>
            </div>
            
            {/* Processing Status - Enhanced Visual */}
            {isProcessing && processingStatus && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center gap-3 mb-4">
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                  <span className="font-medium text-blue-900">{processingStatus.message}</span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden mb-4">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${processingStatus.progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                
                {/* Step indicators */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-4">
                  {PROCESSING_STEPS.map((step, index) => {
                    const currentIdx = getCurrentProcessingStep()
                    const isCompleted = index < currentIdx
                    const isCurrent = index === currentIdx
                    const StepIcon = step.icon
                    
                    return (
                      <div 
                        key={step.key}
                        className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                          isCompleted ? 'bg-green-100' : isCurrent ? 'bg-blue-100' : 'bg-gray-50'
                        }`}
                      >
                        <StepIcon className={`w-5 h-5 ${
                          isCompleted ? 'text-green-600' : isCurrent ? 'text-blue-600 animate-pulse' : 'text-gray-400'
                        }`} />
                        <span className={`text-xs mt-1 text-center ${
                          isCompleted ? 'text-green-700' : isCurrent ? 'text-blue-700' : 'text-gray-500'
                        }`}>
                          {step.label.split(' ')[0]}
                        </span>
                      </div>
                    )
                  })}
                </div>
                
                <p className="text-sm text-blue-700 mt-3 text-center">{processingStatus.progress}% complete</p>
              </div>
            )}
            
            <div className="space-y-4">
              <Card>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Course Title</p>
                    <p className="font-medium text-gray-900">{formData.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="text-gray-700">{formData.description || 'No description provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Documents</p>
                    <p className="text-gray-700">{formData.documents.length} file(s) uploaded</p>
                    {formData.documents.map((file, i) => (
                      <p key={i} className="text-xs text-gray-500">• {file.name} ({(file.size / 1024).toFixed(1)} KB)</p>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Employee Photos</p>
                    <p className="text-gray-700">{formData.employeePhotos.length} photo(s) uploaded</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Narration Voice</p>
                    <p className="text-gray-700">
                      {DEFAULT_VOICES.find(v => v.id === formData.selectedVoice)?.name}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <div className="bg-green-50 rounded-lg p-4 flex gap-3">
                <Sparkles className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-green-800">
                <p className="font-medium">What LearnFlow AI does next:</p>
                <ol className="mt-1 list-decimal list-inside text-green-700 space-y-1">
                  <li>Extract text from your documents</li>
                  <li>LearnFlow AI generates conversational scripts</li>
                  <li>ElevenLabs creates natural voice narration</li>
                  <li>Replicate generates professional training videos</li>
                  <li>Course and quizzes saved to your dashboard</li>
                </ol>
                <p className="mt-2 font-medium">Estimated time: 2-5 minutes</p>
                </div>
              </div>
            </div>
          </motion.div>
        )
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => index < currentStepIndex && setCurrentStep(step.id)}
                disabled={index > currentStepIndex}
                className={`flex items-center gap-2 ${
                  index <= currentStepIndex
                    ? 'text-primary-600'
                    : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index < currentStepIndex
                      ? 'bg-primary-600 text-white'
                      : index === currentStepIndex
                      ? 'bg-primary-100 text-primary-600 border-2 border-primary-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {index < currentStepIndex ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className="hidden sm:block text-sm font-medium">{step.label}</span>
              </button>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 sm:w-24 h-1 mx-2 rounded ${
                    index < currentStepIndex ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6 sm:p-8">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-6">
        <Button
          variant="secondary"
          onClick={handleBack}
          disabled={currentStepIndex === 0 || isProcessing}
          leftIcon={<ChevronLeft className="w-4 h-4" />}
        >
          Back
        </Button>
        
        {currentStep === 'review' ? (
          <Button
            onClick={handleCreateCourse}
            loading={isProcessing}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            {isProcessing ? 'Creating Course...' : 'Create Course'}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            rightIcon={<ChevronRight className="w-4 h-4" />}
          >
            Continue
          </Button>
        )}
      </div>
    </div>
  )
}
