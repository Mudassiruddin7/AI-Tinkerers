import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
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
  Quote
} from 'lucide-react'
import { Button } from '@/components/ui'

// Check if Clerk is available
const isClerkEnabled = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

export function LandingPage() {
  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Video Generation',
      description: 'Upload PDFs and employee photos to automatically create engaging training videos with natural narration.',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: Mic,
      title: 'Voice Cloning',
      description: 'Use employee voices (with consent) to make training feel personal and familiar.',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      icon: Users,
      title: 'Interactive Learning',
      description: 'Timed quizzes keep learners engaged and measure comprehension in real-time.',
      color: 'bg-green-50 text-green-600',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Track completion rates, quiz scores, and identify knowledge gaps across your team.',
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
      description: 'Create professional training content in minutes, not weeks.',
      color: 'bg-indigo-50 text-indigo-600',
    },
  ]

  const stats = [
    { value: '60%', label: 'Higher completion rates' },
    { value: '20 min', label: 'Time to create an episode' },
    { value: '80%', label: 'Average quiz scores' },
    { value: '3x', label: 'Better retention' },
  ]

  const testimonials = [
    {
      quote: "LearnFlow has completely transformed how we do compliance training. It's no longer a chore.",
      author: "Sarah Chen",
      role: "HR Director, TechCorp",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=faces"
    },
    {
      quote: "The AI voice cloning is incredibly natural. Our employees love hearing familiar voices.",
      author: "Michael Ross",
      role: "L&D Manager, Innovate Inc",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces"
    },
    {
      quote: "We've seen a 3x increase in engagement since switching to LearnFlow's video format.",
      author: "Jessica Wu",
      role: "Training Lead, FutureSoft",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces"
    }
  ]

  return (
    <div className="min-h-screen bg-white selection:bg-primary-100 font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-600/20">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">LearnFlow</span>
            </div>
            <div className="flex items-center gap-4">
              {isClerkEnabled ? (
                <>
                  <SignedOut>
                    <Link
                      to="/sign-in"
                      className="text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link to="/sign-up">
                      <Button className="shadow-lg shadow-primary-600/20">Get Started</Button>
                    </Link>
                  </SignedOut>
                  <SignedIn>
                    <Link to="/admin">
                      <Button className="shadow-lg shadow-primary-600/20">Go to Dashboard</Button>
                    </Link>
                  </SignedIn>
                </>
              ) : (
                <>
                  <Link to="/admin">
                    <Button variant="secondary" className="hidden sm:flex">Admin Demo</Button>
                  </Link>
                  <Link to="/employee">
                    <Button className="shadow-lg shadow-primary-600/20">Employee Demo</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary-100/30 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium mb-8 shadow-sm hover:shadow-md transition-shadow cursor-default">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-slate-600">AI-Powered Corporate Training</span>
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-bold text-slate-900 leading-[1.1] mb-8 tracking-tight">
              Turn Boring PDFs into{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500">
                Engaging Videos
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Transform your compliance documents and training materials into short, interactive video episodes that employees actually want to watch.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/sign-up">
                <Button size="lg" className="h-12 px-8 text-lg shadow-xl shadow-primary-600/20 hover:shadow-2xl hover:shadow-primary-600/30 transition-all">
                  Start Free Trial <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button variant="secondary" size="lg" className="h-12 px-8 text-lg bg-white/80 backdrop-blur-sm">
                <Play className="w-5 h-5 mr-2 text-primary-600" /> Watch Demo
              </Button>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>14-day free trial</span>
              </div>
            </div>
          </motion.div>

          {/* Hero Image/Video Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 relative max-w-5xl mx-auto"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-slate-900 aspect-video group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
              
              {/* UI Mockup Elements */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform duration-300 border border-white/20">
                  <Play className="w-10 h-10 text-white ml-1 fill-white" />
                </div>
              </div>
              
              {/* Floating Elements */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 left-10 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 hidden sm:block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">AI Processing</div>
                    <div className="text-white/60 text-xs">Generating script...</div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-10 right-10 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 hidden sm:block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">Video Ready</div>
                    <div className="text-white/60 text-xs">2 mins 30 secs</div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent-200 rounded-full blur-3xl opacity-30 -z-10" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary-200 rounded-full blur-3xl opacity-30 -z-10" />
          </motion.div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-10 border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-slate-500 mb-8">TRUSTED BY INNOVATIVE TEAMS AT</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholder Logos - using text for now but styled like logos */}
            <div className="text-xl font-bold text-slate-800 flex items-center gap-2"><div className="w-6 h-6 bg-slate-800 rounded-full"></div>Acme Corp</div>
            <div className="text-xl font-bold text-slate-800 flex items-center gap-2"><div className="w-6 h-6 bg-slate-800 rounded-sm"></div>GlobalTech</div>
            <div className="text-xl font-bold text-slate-800 flex items-center gap-2"><div className="w-6 h-6 bg-slate-800 rotate-45"></div>Nebula</div>
            <div className="text-xl font-bold text-slate-800 flex items-center gap-2"><div className="w-6 h-6 bg-slate-800 rounded-tr-xl"></div>FoxRun</div>
            <div className="text-xl font-bold text-slate-800 flex items-center gap-2"><div className="w-6 h-6 bg-slate-800 rounded-full border-2 border-white ring-2 ring-slate-800"></div>Circle</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              Everything You Need for <br/>Modern Training
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              From content creation to analytics, LearnFlow handles the entire training lifecycle with powerful AI tools.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group p-8 bg-white rounded-3xl border border-gray-100 hover:border-primary-100 hover:shadow-xl hover:shadow-primary-900/5 transition-all duration-300"
              >
                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Your AI Tutor Section */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/20 border border-primary-500/30 rounded-full text-primary-300 text-sm font-medium mb-8">
                <Sparkles className="w-4 h-4" />
                <span>Meet Your AI Tutor</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
                Personalized Learning <br/>
                <span className="text-primary-400">At Scale</span>
              </h2>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                Our AI doesn't just generate videos. It adapts to each employee's learning pace, provides instant feedback on quizzes, and ensures concepts are truly mastered.
              </p>
              
              <div className="space-y-6">
                {[
                  { title: 'Instant Feedback', desc: 'Get real-time corrections and explanations.' },
                  { title: 'Adaptive Pacing', desc: 'Content adjusts to the learner\'s speed.' },
                  { title: '24/7 Availability', desc: 'Training happens whenever employees are ready.' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center mt-1">
                      <CheckCircle2 className="w-5 h-5 text-primary-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{item.title}</h4>
                      <p className="text-slate-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full blur-[100px] opacity-20" />
              <div className="relative bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                {/* Chat Interface Mockup */}
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div className="bg-slate-700/50 rounded-2xl rounded-tl-none p-4 text-sm text-slate-200">
                      Hi! I noticed you paused on the compliance section. Would you like a quick summary of the key points?
                    </div>
                  </div>
                  <div className="flex gap-4 flex-row-reverse">
                    <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="bg-primary-600 rounded-2xl rounded-tr-none p-4 text-sm text-white">
                      Yes, please. Specifically about the data privacy regulations.
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div className="bg-slate-700/50 rounded-2xl rounded-tl-none p-4 text-sm text-slate-200">
                      <p className="mb-2">Sure! Here are the 3 main pillars of GDPR you need to know:</p>
                      <ul className="list-disc list-inside space-y-1 text-slate-300">
                        <li>Right to access data</li>
                        <li>Right to be forgotten</li>
                        <li>Data portability</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center px-4"
              >
                <div className="text-4xl sm:text-5xl font-bold text-slate-900 mb-2 tracking-tight">{stat.value}</div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Loved by L&D Teams
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative"
              >
                <Quote className="w-10 h-10 text-primary-100 absolute top-6 left-6 -z-10" />
                <p className="text-slate-600 mb-6 relative z-10">"{t.quote}"</p>
                <div className="flex items-center gap-4">
                  <img src={t.image} alt={t.author} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <div className="font-bold text-slate-900">{t.author}</div>
                    <div className="text-sm text-slate-500">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-slate-900 rounded-[2.5rem] p-12 sm:p-20 text-center text-white relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-500 rounded-full blur-[100px] opacity-50"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent-500 rounded-full blur-[100px] opacity-50"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl sm:text-6xl font-bold mb-6 tracking-tight">
                Ready to Transform <br/>Your Training?
              </h2>
              <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                Join hundreds of companies creating engaging training content with LearnFlow. Start your free trial today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/sign-up">
                  <Button
                    size="lg"
                    className="bg-white text-slate-900 hover:bg-gray-100 h-14 px-8 text-lg font-semibold"
                  >
                    Get Started for Free
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button
                    variant="secondary"
                    className="bg-transparent border-white/20 text-white hover:bg-white/10 h-14 px-8 text-lg"
                  >
                    Contact Sales
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-slate-400 mt-8">No credit card required • Cancel anytime</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-slate-900">LearnFlow</span>
              </div>
              <p className="text-slate-500 max-w-xs">
                The AI-powered training platform that turns documents into engaging video courses in minutes.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Product</h4>
              <ul className="space-y-2 text-slate-600">
                <li><a href="#" className="hover:text-primary-600 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary-600 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary-600 transition-colors">Enterprise</a></li>
                <li><a href="#" className="hover:text-primary-600 transition-colors">Case Studies</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Company</h4>
              <ul className="space-y-2 text-slate-600">
                <li><a href="#" className="hover:text-primary-600 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary-600 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary-600 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary-600 transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-600">
                <li><a href="#" className="hover:text-primary-600 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-primary-600 transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-primary-600 transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm">© 2024 LearnFlow. All rights reserved.</p>
            <div className="flex gap-6">
              {/* Social icons would go here */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

