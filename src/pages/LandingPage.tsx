import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import { useState } from 'react'
import {
  Play,
  BookOpen,
  Users,
  BarChart3,
  ArrowRight,
  Sparkles,
  Shield,
  Clock,
  Mic,
  CheckCircle2,
  Brain,
  Upload,
  FileText,
  Zap,
  Star,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Target,
  Award,
  TrendingUp,
  Video,
  GraduationCap,
  Building2,
  Mail,
  Linkedin,
  Twitter
} from 'lucide-react'
import { Button } from '@/components/ui'

// Check if Clerk is available
const isClerkEnabled = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// AI Mascot Component (similar to Maxi)
const AIMascot = ({ expression = 'wave', className = '' }: { expression?: 'wave' | 'happy' | 'think' | 'celebrate' | 'point', className?: string }) => {
  const expressions = {
    wave: '👋',
    happy: '😊',
    think: '🤔',
    celebrate: '🎉',
    point: '👉'
  }
  
  return (
    <motion.div 
      className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl shadow-lg ${className}`}
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <span className="text-3xl">{expressions[expression]}</span>
    </motion.div>
  )
}

// Floating Subject Icons
const FloatingSubjects = ({ side }: { side: 'left' | 'right' }) => {
  const leftSubjects = [
    { icon: '📊', label: 'Analytics', delay: 0 },
    { icon: '📋', label: 'Compliance', delay: 0.5 },
    { icon: '🛡️', label: 'Security', delay: 1 },
  ]
  
  const rightSubjects = [
    { icon: '💼', label: 'HR', delay: 0.2 },
    { icon: '📈', label: 'Sales', delay: 0.7 },
    { icon: '🎯', label: 'Leadership', delay: 1.2 },
  ]
  
  const subjects = side === 'left' ? leftSubjects : rightSubjects
  
  return (
    <div className={`hidden lg:flex flex-col gap-4 ${side === 'left' ? 'items-end' : 'items-start'}`}>
      {subjects.map((subject, i) => (
        <motion.div
          key={subject.label}
          initial={{ opacity: 0, x: side === 'left' ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: subject.delay, duration: 0.5 }}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md border border-gray-100"
        >
          <span className="text-xl">{subject.icon}</span>
          <span className="text-sm font-medium text-slate-700">{subject.label}</span>
        </motion.div>
      ))}
    </div>
  )
}

// Feature Card Component
const FeatureShowcaseCard = ({ 
  title, 
  description, 
  icon: Icon, 
  color 
}: { 
  title: string
  description: string
  icon: any
  color: string 
}) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    className="min-w-[300px] sm:min-w-[350px] p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
  >
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4`}>
      <Icon className="w-6 h-6" />
    </div>
    <h4 className="text-lg font-bold text-slate-900 mb-2">{title}</h4>
    <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
  </motion.div>
)

// Testimonial Card
const TestimonialCard = ({ quote, author, role, image }: { quote: string, author: string, role: string, image: string }) => (
  <div className="min-w-[320px] sm:min-w-[380px] p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
    <p className="text-slate-600 mb-4 text-sm leading-relaxed">"{quote}"</p>
    <div className="flex items-center gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
    <div className="flex items-center gap-3">
      <img src={image} alt={author} className="w-10 h-10 rounded-full object-cover" />
      <div>
        <div className="font-semibold text-slate-900 text-sm">{author}</div>
        <div className="text-xs text-slate-500">{role}</div>
      </div>
    </div>
  </div>
)

// FAQ Item
const FAQItem = ({ question, answer, isOpen, onClick }: { question: string, answer: string, isOpen: boolean, onClick: () => void }) => (
  <div className="border-b border-gray-100 last:border-0">
    <button
      onClick={onClick}
      className="w-full py-5 flex items-center justify-between text-left hover:text-emerald-600 transition-colors"
    >
      <span className="font-semibold text-slate-900 pr-4">{question}</span>
      {isOpen ? (
        <ChevronUp className="w-5 h-5 text-emerald-500 flex-shrink-0" />
      ) : (
        <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
      )}
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <p className="pb-5 text-slate-600 leading-relaxed">{answer}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
)

// Company Logo Marquee
const CompanyMarquee = () => {
  const companies = [
    'TechCorp', 'Innovate Inc', 'FutureSoft', 'GlobalTech', 'NextGen', 'CloudBase', 'DataFlow', 'SmartOps'
  ]
  
  return (
    <div className="relative overflow-hidden py-4">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 to-transparent z-10" />
      <motion.div
        className="flex gap-12 items-center"
        animate={{ x: [0, -1000] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {[...companies, ...companies].map((company, i) => (
          <div key={i} className="flex items-center gap-2 text-slate-400 whitespace-nowrap">
            <Building2 className="w-6 h-6" />
            <span className="font-semibold text-lg">{company}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export function LandingPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0)

  const features = [
    {
      icon: Sparkles,
      title: 'AI Video Generation',
      description: 'Upload PDFs and photos to create engaging training videos with natural AI narration automatically.',
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      icon: Mic,
      title: 'Voice Cloning',
      description: 'Use employee voices (with consent) to make training feel personal and familiar to your team.',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      icon: Target,
      title: 'Smart Quizzes',
      description: 'Timed quizzes measure comprehension in real-time and keep learners engaged throughout.',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: BarChart3,
      title: 'Deep Analytics',
      description: 'Track completion rates, quiz scores, and identify knowledge gaps across your entire team.',
      color: 'bg-orange-50 text-orange-600',
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Full consent management, GDPR compliant, with audit trails for all synthetic content.',
      color: 'bg-red-50 text-red-600',
    },
    {
      icon: Clock,
      title: 'Fast Creation',
      description: 'Create professional training content in minutes, not weeks. Save time and resources.',
      color: 'bg-indigo-50 text-indigo-600',
    },
  ]

  const howItWorks = [
    {
      icon: Upload,
      title: 'Upload Your Content',
      description: 'Drop your PDFs, documents, or training materials into LearnFlow.',
      color: 'bg-emerald-500',
    },
    {
      icon: Brain,
      title: 'AI Creates Videos',
      description: 'Our AI transforms content into engaging video episodes with narration.',
      color: 'bg-teal-500',
    },
    {
      icon: TrendingUp,
      title: 'Track & Improve',
      description: 'Monitor progress, quiz results, and optimize your training program.',
      color: 'bg-cyan-500',
    },
  ]

  const testimonials = [
    {
      quote: "LearnFlow has completely transformed how we do compliance training. It's no longer a chore for our employees.",
      author: "Sarah Chen",
      role: "HR Director, TechCorp",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=faces"
    },
    {
      quote: "The AI voice cloning is incredibly natural. Our employees love hearing familiar voices in training.",
      author: "Michael Ross",
      role: "L&D Manager, Innovate Inc",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces"
    },
    {
      quote: "We've seen a 3x increase in engagement since switching to LearnFlow's video format.",
      author: "Jessica Wu",
      role: "Training Lead, FutureSoft",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces"
    },
    {
      quote: "Creating training content used to take weeks. Now we do it in hours with better results.",
      author: "David Kim",
      role: "CEO, NextGen",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces"
    },
    {
      quote: "The analytics dashboard gives us insights we never had before. Game changer for L&D.",
      author: "Emily Brown",
      role: "VP of People, CloudBase",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces"
    },
  ]

  const faqs = [
    {
      question: "What makes LearnFlow different from other training platforms?",
      answer: "LearnFlow uses AI to automatically transform your existing documents into engaging video content with natural voice narration. Unlike traditional platforms that require manual content creation, we automate the entire process while keeping it personalized with voice cloning technology."
    },
    {
      question: "How does the AI video generation work?",
      answer: "Simply upload your PDF, document, or training material. Our AI analyzes the content, creates a script, generates visuals, and produces professional video episodes with natural voice narration. You can review and edit before publishing to your team."
    },
    {
      question: "Is voice cloning ethical and secure?",
      answer: "Absolutely. We require explicit consent from employees before using their voice. All voice data is encrypted, stored securely, and only used for authorized training content. We maintain full audit trails for GDPR compliance."
    },
    {
      question: "Can I use my own training materials?",
      answer: "Yes! LearnFlow is designed to work with your existing content. Upload PDFs, PowerPoints, documents, or even paste text directly. Our AI handles the transformation into engaging video format."
    },
    {
      question: "How long does it take to create a training video?",
      answer: "Most training videos can be created in 10-20 minutes depending on content length. What used to take weeks of production can now be done in a single sitting."
    },
    {
      question: "What kind of analytics do you provide?",
      answer: "We track completion rates, quiz scores, time spent, engagement patterns, and knowledge gaps. You can see individual and team-level insights, identify struggling employees, and optimize your training content based on data."
    },
  ]

  return (
    <div className="min-h-screen bg-white selection:bg-emerald-100 font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 cursor-pointer">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900">LearnFlow</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-600 hover:text-emerald-600 font-medium text-sm transition-colors">Features</a>
              <a href="#how-it-works" className="text-slate-600 hover:text-emerald-600 font-medium text-sm transition-colors">AI</a>
              <a href="#testimonials" className="text-slate-600 hover:text-emerald-600 font-medium text-sm transition-colors">Testimonials</a>
              <a href="#faq" className="text-slate-600 hover:text-emerald-600 font-medium text-sm transition-colors">FAQs</a>
            </nav>

            <div className="flex items-center gap-3">
              {isClerkEnabled ? (
                <>
                  <SignedOut>
                    <Link
                      to="/sign-in"
                      className="text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors hidden sm:block"
                    >
                      Sign In
                    </Link>
                    <Link to="/sign-up">
                      <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/20 border-0">
                        Get Started
                      </Button>
                    </Link>
                  </SignedOut>
                  <SignedIn>
                    <Link to="/admin">
                      <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/20 border-0">
                        Dashboard
                      </Button>
                    </Link>
                  </SignedIn>
                </>
              ) : (
                <>
                  <Link to="/admin">
                    <Button variant="secondary" className="hidden sm:flex">Admin Demo</Button>
                  </Link>
                  <Link to="/employee">
                    <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/20 border-0">
                      Try Demo
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-8 items-center">
            {/* Left floating subjects */}
            <FloatingSubjects side="left" />

            {/* Center content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-2xl mx-auto"
            >
              {/* Mascot with title */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900">
                  Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Flow</span>
                </h1>
                <AIMascot expression="wave" className="w-14 h-14 sm:w-16 sm:h-16" />
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                Your AI Training Creator
              </h2>
              
              <p className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed">
                Transform boring PDFs into engaging video courses. Get instant AI-powered content creation, personalized learning paths, and real-time analytics.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/sign-up">
                  <Button 
                    size="lg" 
                    className="h-14 px-8 text-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-xl shadow-emerald-500/25 border-0 rounded-full"
                  >
                    Start Learning with AI
                    <span className="ml-2 text-emerald-200">— it's free</span>
                  </Button>
                </Link>
              </div>

              {/* Decorative arrow */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4"
              >
                <svg className="w-16 h-8 mx-auto text-emerald-300" viewBox="0 0 64 32" fill="none">
                  <path d="M2 16C2 16 20 2 32 16C44 30 62 16 62 16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 4"/>
                  <path d="M54 12L62 16L54 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            </motion.div>

            {/* Right floating subjects */}
            <FloatingSubjects side="right" />
          </div>

          {/* Hero Image/Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-12 relative max-w-5xl mx-auto"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
              {/* Mock Dashboard UI */}
              <div className="bg-slate-900 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 bg-slate-800 rounded-lg text-slate-400 text-xs">app.learnflow.ai</div>
                </div>
              </div>
              
              <div className="aspect-video bg-gradient-to-br from-slate-50 to-slate-100 p-6 sm:p-8">
                <div className="h-full grid md:grid-cols-3 gap-4">
                  {/* Sidebar */}
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg" />
                      <span className="font-semibold text-slate-900 text-sm">Courses</span>
                    </div>
                    <div className="space-y-2">
                      {['Compliance 101', 'Security Training', 'HR Policies'].map((course, i) => (
                        <div key={i} className={`p-2 rounded-lg text-xs ${i === 0 ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-600 hover:bg-gray-50'}`}>
                          {course}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Main content */}
                  <div className="md:col-span-2 bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col">
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-4 bg-slate-900 rounded-2xl flex items-center justify-center">
                          <Play className="w-10 h-10 text-white ml-1" />
                        </div>
                        <div className="text-slate-900 font-semibold">Compliance Training - Episode 1</div>
                        <div className="text-slate-500 text-xs mt-1">Duration: 4:32</div>
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mt-4">
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full w-2/3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute -top-4 -right-4 sm:top-4 sm:right-4 bg-white rounded-xl p-3 shadow-lg border border-gray-100"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-900">Video Ready!</div>
                  <div className="text-xs text-slate-500">2 mins ago</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-8 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-slate-500 mb-4">
            Teams trained by <span className="font-medium text-slate-700">innovative companies</span>
          </p>
          <CompanyMarquee />
        </div>
      </section>

      {/* AI Features Showcase */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Tailored Training</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              AI That Never Misses a Beat
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Flow analyzes your content and creates personalized training videos that employees actually want to watch.
            </p>
          </div>

          {/* Scrolling Feature Cards */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            
            <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              <div className="flex gap-4 w-max">
                {features.map((feature, index) => (
                  <FeatureShowcaseCard
                    key={feature.title}
                    title={feature.title}
                    description={feature.description}
                    icon={feature.icon}
                    color={feature.color}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Flow Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Illustration */}
            <div className="relative">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 sm:p-12">
                {/* Stack visualization */}
                <div className="space-y-4">
                  <motion.div 
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900">Content Layer</div>
                        <div className="text-xs text-slate-500">PDFs, Docs, Materials</div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 ml-8"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                        <Brain className="w-5 h-5 text-teal-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900">AI Processing</div>
                        <div className="text-xs text-slate-500">LearnFlow AI Engine</div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 ml-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                        <Video className="w-5 h-5 text-cyan-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900">Video Output</div>
                        <div className="text-xs text-slate-500">Engaging Training Episodes</div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Floating annotation */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  viewport={{ once: true }}
                  className="absolute -bottom-4 right-4 bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
                >
                  ✨ Adaptive to your team
                </motion.div>
              </div>

              {/* Mascot */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="absolute -top-6 -right-6"
              >
                <AIMascot expression="celebrate" className="w-14 h-14" />
              </motion.div>
            </div>

            {/* Right: Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-sm font-medium mb-6">
                <span>Better than generic AI</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
                Flow thinks
              </h2>
              <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 mb-6">
                like a trainer
              </h2>
              
              <p className="text-lg text-slate-600 mb-8">
                Stop waiting weeks for content creation. Get professional training videos instantly.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">AI-Powered Scripting</h4>
                    <p className="text-sm text-slate-600">Our models understand training content and create engaging scripts automatically.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Personalized Delivery</h4>
                    <p className="text-sm text-slate-600">Voice cloning makes content feel familiar and increases engagement.</p>
                  </div>
                </div>
              </div>

              <Link to="/sign-up" className="inline-block mt-8">
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/20 border-0">
                  Get started for free <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Steps */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <AIMascot expression="point" className="w-12 h-12" />
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">How it Works</h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative inline-block mb-6">
                  <div className={`w-20 h-20 ${step.color} rounded-2xl flex items-center justify-center mx-auto shadow-lg`}>
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full border-2 border-gray-100 flex items-center justify-center text-sm font-bold text-slate-900 shadow">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-4">
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Testimonials</div>
          </div>
          
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Our customers</h2>
            <div className="flex items-center justify-center gap-3">
              <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
                speak for us
              </h2>
              <AIMascot expression="celebrate" className="w-10 h-10" />
            </div>
          </div>

          {/* Scrolling Testimonials */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />
            
            <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              <div className="flex gap-4 w-max">
                {testimonials.map((testimonial, index) => (
                  <TestimonialCard
                    key={index}
                    quote={testimonial.quote}
                    author={testimonial.author}
                    role={testimonial.role}
                    image={testimonial.image}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Keep calm and LearnFlow
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Join hundreds of teams creating better training content with AI. Upload your first document and experience instant video creation that adapts to your needs.
          </p>
          <Link to="/sign-up">
            <Button 
              size="lg" 
              className="h-14 px-8 text-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-xl shadow-emerald-500/25 border-0 rounded-full"
            >
              Get started for free <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Ask us</h2>
              <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">anything!</h2>
              <Sparkles className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="inline-block px-4 py-1 bg-emerald-100 rounded-full text-emerald-700 text-sm font-medium">
              FAQs
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFAQ === index}
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
              />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/contact">
              <Button variant="secondary" className="rounded-full">
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2 lg:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-slate-900">LearnFlow</span>
              </Link>
              <p className="text-slate-500 text-sm max-w-xs mb-6">
                AI-powered training with instant video creation, personalized learning paths, and real-time analytics.
              </p>
              
              <div className="mb-4">
                <p className="text-sm font-medium text-slate-700 mb-2">Follow us</p>
                <div className="flex gap-3">
                  <a href="#" className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-emerald-100 hover:text-emerald-600 transition-colors">
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-emerald-100 hover:text-emerald-600 transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-emerald-100 hover:text-emerald-600 transition-colors">
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Feedback box */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <AIMascot expression="happy" className="w-8 h-8" />
                  <span className="text-sm text-slate-600">Got ideas? We'd love to hear!</span>
                </div>
                <Link to="/contact" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                  Contact us →
                </Link>
              </div>
            </div>
            
            {/* Core Links */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-4 text-sm">Core</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/" className="text-slate-600 hover:text-emerald-600 transition-colors">Home</Link></li>
                <li><a href="#features" className="text-slate-600 hover:text-emerald-600 transition-colors">Features</a></li>
                <li><Link to="/pricing" className="text-slate-600 hover:text-emerald-600 transition-colors">Pricing</Link></li>
                <li><a href="#testimonials" className="text-slate-600 hover:text-emerald-600 transition-colors">Testimonials</a></li>
              </ul>
            </div>
            
            {/* Help Links */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-4 text-sm">Help</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#faq" className="text-slate-600 hover:text-emerald-600 transition-colors">FAQs</a></li>
                <li><Link to="/contact" className="text-slate-600 hover:text-emerald-600 transition-colors">Contact</Link></li>
                <li><Link to="/terms" className="text-slate-600 hover:text-emerald-600 transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="text-slate-600 hover:text-emerald-600 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            
            {/* Solutions Links */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-4 text-sm">Solutions</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-slate-600 hover:text-emerald-600 transition-colors">Compliance Training</a></li>
                <li><a href="#" className="text-slate-600 hover:text-emerald-600 transition-colors">Employee Onboarding</a></li>
                <li><a href="#" className="text-slate-600 hover:text-emerald-600 transition-colors">Sales Enablement</a></li>
                <li><a href="#" className="text-slate-600 hover:text-emerald-600 transition-colors">Leadership Development</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm">© 2024 LearnFlow AI. All Rights Reserved.</p>
            <div className="flex items-center gap-2 text-slate-400">
              <GraduationCap className="w-5 h-5" />
              <span className="text-sm">Empowering teams to learn smarter</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

