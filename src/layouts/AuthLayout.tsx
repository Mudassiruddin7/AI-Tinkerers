import { Outlet, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Play, 
  Sparkles, 
  Shield, 
  Users, 
  TrendingUp,
  Award,
  Zap
} from 'lucide-react'

export function AuthLayout() {
  const floatingElements = [
    { icon: Play, delay: 0, x: '10%', y: '20%' },
    { icon: Sparkles, delay: 0.5, x: '85%', y: '15%' },
    { icon: Shield, delay: 1, x: '75%', y: '70%' },
    { icon: Award, delay: 1.5, x: '15%', y: '75%' },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding & Info */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Gradient orbs */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 -left-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-pink-500 rounded-full blur-3xl"
        />

        {/* Floating icons */}
        {floatingElements.map(({ icon: Icon, delay, x, y }, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: [0.4, 0.8, 0.4],
              y: [0, -15, 0]
            }}
            transition={{ 
              delay,
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute"
            style={{ left: x, top: y }}
          >
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <Icon className="w-6 h-6 text-white/80" />
            </div>
          </motion.div>
        ))}

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.05 }}
              className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30"
            >
              <Zap className="w-7 h-7 text-white" />
            </motion.div>
            <div>
              <span className="text-2xl font-bold text-white tracking-tight">LearnFlow</span>
              <span className="block text-xs text-purple-300 font-medium tracking-wider uppercase">Training Platform</span>
            </div>
          </Link>

          {/* Main content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl font-bold text-white leading-tight mb-6">
                Transform Training
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                  Into Engagement
                </span>
              </h1>
              <p className="text-lg text-slate-300 max-w-md leading-relaxed">
                Convert your boring PDFs into captivating video content with AI-powered narration and interactive quizzes.
              </p>
            </motion.div>

            {/* Feature highlights */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="space-y-4"
            >
              {[
                { icon: Sparkles, text: 'AI-Powered Video Generation', color: 'text-purple-400' },
                { icon: Users, text: 'Personalized Employee Experience', color: 'text-pink-400' },
                { icon: TrendingUp, text: 'Real-time Analytics & Insights', color: 'text-orange-400' },
              ].map(({ icon: Icon, text, color }, index) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className={`w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <span className="text-slate-200 font-medium">{text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-3 gap-6"
          >
            {[
              { value: '10K+', label: 'Active Learners' },
              { value: '95%', label: 'Completion Rate' },
              { value: '4.9★', label: 'User Rating' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-bold text-white mb-1">{value}</div>
                <div className="text-sm text-slate-400">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
        {/* Mobile header */}
        <div className="lg:hidden p-6 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">LearnFlow</span>
          </Link>
        </div>

        {/* Form container */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[440px]"
          >
            <Outlet />
          </motion.div>
        </div>

        {/* Footer */}
        <div className="p-6 text-center border-t border-slate-200">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} LearnFlow. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
