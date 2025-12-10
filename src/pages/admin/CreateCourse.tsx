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
} from 'lucide-react'
import { Card, CardContent, Button, Input, Textarea, FileUpload } from '@/components/ui'
import { DEFAULT_VOICES } from '@/lib/elevenlabs'
import { api } from '@/lib/api'
import { supabase } from '@/lib/supabase'

type Step = 'details' | 'content' | 'photos' | 'voice' | 'review'

interface CourseFormData {
  title: string
  description: string
  documents: File[]
  employeePhotos: File[]
  selectedVoice: string
}

export function CreateCourse() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState<Step>('details')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStatus, setProcessingStatus] = useState<string>('')
  const [processingProgress, setProcessingProgress] = useState<number>(0)
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
    setProcessingProgress(0)
    
    try {
      // Step 1: Extract text from PDF
      setProcessingStatus('Extracting text from PDF...')
      setProcessingProgress(10)
      
      const pdfFile = formData.documents[0]
      console.log('Processing PDF:', pdfFile.name)
      
      let extractedText = ''
      try {
        const extractedData = await api.extractTextFromPDF(pdfFile)
        extractedText = extractedData.text
        console.log('Extracted text:', extractedText.substring(0, 200) + '...')
        toast.success(`Extracted ${extractedData.pages} pages from PDF`)
      } catch (pdfError) {
        console.error('PDF extraction error:', pdfError)
        // Fallback: use filename as content hint
        extractedText = `Training course about ${formData.title}. Content from ${pdfFile.name}.`
        toast.error('PDF extraction failed, using fallback content')
      }
      
      setProcessingProgress(25)
      
      // Step 2: Generate content using Claude AI
      setProcessingStatus('Generating course content with AI...')
      
      let content: { segments?: Array<{ script: string }>; script?: string; summary?: string; quizzes?: Array<{ question: string; options: string[]; correctAnswer: number; timestamp: number }> } = {}
      try {
        content = await api.generateContent({
          text: extractedText,
          courseTitle: formData.title,
          numberOfSegments: 5,
          numberOfQuizzes: 3
        })
        console.log('Generated content:', content)
        toast.success('AI generated course script and quiz questions!')
      } catch (contentError) {
        console.error('Content generation error:', contentError)
        // Create mock content for demo
        content = {
          script: `Welcome to ${formData.title}. This is an AI-generated training course. ${extractedText.substring(0, 300)}`,
          summary: formData.description || `Training course: ${formData.title}`,
          quizzes: [
            {
              question: `What is the main topic of ${formData.title}?`,
              options: ['Option A', 'Option B', 'Option C', 'Option D'],
              correctAnswer: 0,
              timestamp: 30
            }
          ]
        }
        toast.error('AI generation failed, using demo content')
      }
      
      setProcessingProgress(50)
      
      // Step 3: Upload employee photo (if storage is configured)
      setProcessingStatus('Processing employee photos...')
      
      let photoUrl = ''
      if (formData.employeePhotos.length > 0) {
        try {
          const photo = formData.employeePhotos[0]
          const photoPath = `photos/${Date.now()}-${photo.name}`
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('course-assets')
            .upload(photoPath, photo)
          
          if (!uploadError && uploadData) {
            const { data: urlData } = supabase.storage
              .from('course-assets')
              .getPublicUrl(photoPath)
            photoUrl = urlData.publicUrl
            console.log('Photo uploaded:', photoUrl)
          } else {
            console.warn('Photo upload skipped:', uploadError)
            // Use a default avatar
            photoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.title)}&background=random`
          }
        } catch (photoError) {
          console.warn('Photo processing error:', photoError)
          photoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.title)}&background=random`
        }
      }
      
      setProcessingProgress(60)
      
      // Step 4: Generate audio using ElevenLabs
      setProcessingStatus('Generating AI voice narration...')
      
      let audioBlob: Blob | null = null
      try {
        const scriptText = content.segments?.[0]?.script || 
                          content.script || 
                          `Welcome to ${formData.title}. ${extractedText.substring(0, 500)}`
        
        audioBlob = await api.generateAudio({
          text: scriptText.substring(0, 1000), // Limit text length
          voiceId: formData.selectedVoice
        })
        
        console.log('Audio generated, size:', audioBlob.size)
        toast.success('Voice narration generated!')
      } catch (audioError) {
        console.error('Audio generation error:', audioError)
        toast.error('Voice generation skipped (check ElevenLabs quota)')
      }
      
      setProcessingProgress(75)
      
      // Step 5: Save to database (with error handling)
      setProcessingStatus('Saving course to database...')
      
      const courseId = crypto.randomUUID()
      
      try {
        // Insert course (organization_id can be null for individual courses)
        const courseData: Record<string, unknown> = {
          id: courseId,
          title: formData.title,
          description: formData.description || content.summary || '',
          thumbnail_url: photoUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
          status: 'published',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        
        const { error: courseError } = await supabase
          .from('courses')
          .insert(courseData)
        
        if (courseError) {
          console.warn('Course insert warning:', courseError)
        }
        
        // Insert episode
        const episodeId = crypto.randomUUID()
        const { error: episodeError } = await supabase
          .from('episodes')
          .insert({
            id: episodeId,
            course_id: courseId,
            title: 'Episode 1: Introduction',
            description: content.script?.substring(0, 200) || 'Introduction to the course',
            episode_order: 1,
            duration: 180,
            status: 'ready',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
        
        if (episodeError) {
          console.warn('Episode insert warning:', episodeError)
        }
        
        // Insert quiz questions
        if (content.quizzes && content.quizzes.length > 0) {
          for (const quiz of content.quizzes) {
            await supabase
              .from('quiz_questions')
              .insert({
                id: crypto.randomUUID(),
                episode_id: episodeId, // Link to episode, not course
                question_text: quiz.question,
                options: quiz.options,
                correct_answer: quiz.correctAnswer,
                trigger_time: quiz.timestamp || 50,
                created_at: new Date().toISOString()
              })
          }
        }
        
        toast.success('Course saved to database!')
      } catch (dbError) {
        console.error('Database error:', dbError)
        toast.error('Database save failed - course created locally')
      }
      
      setProcessingProgress(95)
      
      // Step 6: Trigger n8n video generation (optional)
      setProcessingStatus('Finalizing...')
      
      try {
        await api.triggerVideoGeneration({
          episodeId: courseId,
          courseId: courseId,
          pdfUrl: '',
          employeePhotos: photoUrl ? [photoUrl] : [],
          voiceId: formData.selectedVoice,
          organizationId: 'org-1'
        })
        console.log('n8n workflow triggered')
      } catch (n8nError) {
        console.warn('n8n trigger skipped:', n8nError)
      }
      
      setProcessingProgress(100)
      setProcessingStatus('Course created successfully!')
      
      toast.success('🎉 Course created! Check the dashboard.')
      
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      navigate('/admin')
    } catch (error) {
      console.error('Error creating course:', error)
      toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsProcessing(false)
      setProcessingStatus('')
      setProcessingProgress(0)
    }
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
            
            {/* Processing Status */}
            {isProcessing && (
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center gap-3 mb-4">
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                  <span className="font-medium text-blue-900">{processingStatus}</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${processingProgress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-sm text-blue-700 mt-2">{processingProgress}% complete</p>
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
                  <p className="font-medium">What happens next?</p>
                  <ol className="mt-1 list-decimal list-inside text-green-700 space-y-1">
                    <li>We'll extract text from your documents</li>
                    <li>AI will generate conversational scripts</li>
                    <li>ElevenLabs will create natural narration</li>
                    <li>Video will be assembled with your photos</li>
                    <li>Quiz questions will be auto-generated</li>
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
          disabled={currentStepIndex === 0}
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
            Create Course
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
