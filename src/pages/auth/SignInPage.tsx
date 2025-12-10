import { SignIn } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Fingerprint, Lock, Sparkles } from 'lucide-react'

export function SignInPage() {
  const isClerkEnabled = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  const navigate = useNavigate()

  // Dev mode fallback with stylish design
  if (!isClerkEnabled) {
    return (
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-xs font-semibold tracking-wide uppercase mb-4"
          >
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
            Development Mode
          </motion.div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
            Welcome back
          </h1>
          <p className="text-slate-600">
            Clerk is not configured. Continue to demo.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 mb-6"
        >
          <p className="text-sm text-amber-800 mb-4">
            Add <code className="text-xs bg-amber-100 px-2 py-1 rounded font-mono">VITE_CLERK_PUBLISHABLE_KEY</code> to your .env file to enable full authentication.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/employee')}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-semibold py-3 px-4 rounded-xl hover:from-slate-800 hover:to-slate-700 transition-all shadow-lg shadow-slate-900/20"
            >
              Continue as Employee
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/admin')}
              className="w-full flex items-center justify-center gap-2 bg-white text-slate-700 font-semibold py-3 px-4 rounded-xl border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
            >
              Continue as Admin
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-xs font-semibold tracking-wide uppercase mb-4"
        >
          <Sparkles className="w-3 h-3" />
          Welcome back
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-slate-900 tracking-tight mb-2"
        >
          Sign in to LearnFlow
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-slate-600"
        >
          Don't have an account?{' '}
          <Link 
            to="/sign-up" 
            className="text-purple-600 hover:text-purple-700 font-semibold transition-colors"
          >
            Create one free
          </Link>
        </motion.p>
      </div>

      {/* Clerk SignIn Component */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <SignIn
          appearance={{
            layout: {
              socialButtonsPlacement: 'top',
              socialButtonsVariant: 'blockButton',
            },
            elements: {
              rootBox: 'w-full',
              card: 'shadow-none p-0 bg-transparent',
              header: 'hidden',
              headerTitle: 'hidden',
              headerSubtitle: 'hidden',
              main: 'gap-4',
              form: 'gap-4',
              socialButtons: 'gap-3',
              socialButtonsBlockButton: `
                flex items-center justify-center gap-3 
                w-full py-3 px-4 
                bg-white hover:bg-slate-50 
                border-2 border-slate-200 hover:border-slate-300 
                rounded-xl 
                text-slate-700 font-medium 
                transition-all duration-200 
                shadow-sm hover:shadow-md
              `,
              socialButtonsBlockButtonText: 'font-semibold text-slate-700',
              socialButtonsProviderIcon: 'w-5 h-5',
              dividerRow: 'my-6',
              dividerLine: 'bg-slate-200',
              dividerText: 'text-slate-400 text-sm font-medium px-4 bg-slate-50',
              formFieldRow: 'mb-4',
              formFieldLabel: 'text-sm font-semibold text-slate-700 mb-2 block',
              formFieldInput: `
                w-full px-4 py-3 
                bg-white 
                border-2 border-slate-200 
                rounded-xl 
                text-slate-900 
                placeholder:text-slate-400 
                focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 
                transition-all duration-200
              `,
              formFieldInputShowPasswordButton: 'text-slate-400 hover:text-slate-600',
              formFieldErrorText: 'text-red-500 text-sm mt-1',
              formFieldSuccessText: 'text-green-500 text-sm mt-1',
              formFieldAction: 'text-purple-600 hover:text-purple-700 font-semibold text-sm',
              formButtonPrimary: `
                w-full py-3.5 px-4 
                bg-gradient-to-r from-purple-600 to-pink-600 
                hover:from-purple-700 hover:to-pink-700 
                text-white font-semibold 
                rounded-xl 
                shadow-lg shadow-purple-500/30 
                hover:shadow-xl hover:shadow-purple-500/40 
                transition-all duration-200 
                focus:ring-4 focus:ring-purple-500/20
              `,
              footerAction: 'hidden',
              footerActionLink: 'text-purple-600 hover:text-purple-700 font-semibold',
              identityPreview: 'bg-slate-50 border-2 border-slate-200 rounded-xl p-4',
              identityPreviewText: 'text-slate-700 font-medium',
              identityPreviewEditButton: 'text-purple-600 hover:text-purple-700 font-semibold',
              formResendCodeLink: 'text-purple-600 hover:text-purple-700 font-semibold',
              otpCodeFieldInput: `
                w-12 h-14 
                text-center text-xl font-bold 
                bg-white border-2 border-slate-200 
                rounded-xl 
                focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10
              `,
              alert: 'bg-red-50 border border-red-200 text-red-700 rounded-xl p-4',
              alertText: 'text-sm',
              backLink: 'text-slate-600 hover:text-slate-800 font-medium',
              alternativeMethodsBlockButton: `
                w-full py-3 px-4 
                bg-white hover:bg-slate-50 
                border-2 border-slate-200 hover:border-slate-300 
                rounded-xl 
                text-slate-700 font-medium 
                transition-all duration-200
              `,
            },
            variables: {
              colorPrimary: '#9333ea',
              colorTextOnPrimaryBackground: '#ffffff',
              colorBackground: 'transparent',
              colorInputBackground: '#ffffff',
              colorInputText: '#1e293b',
              borderRadius: '0.75rem',
              fontFamily: 'inherit',
            },
          }}
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          afterSignInUrl="/admin"
        />
      </motion.div>

      {/* Security badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 pt-6 border-t border-slate-200"
      >
        <div className="flex flex-wrap gap-4 justify-center">
          {[
            { icon: Lock, text: 'SSL Encrypted' },
            { icon: Fingerprint, text: 'Secure Auth' },
          ].map(({ icon: Icon, text }, index) => (
            <motion.div
              key={text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-center gap-2 text-sm text-slate-500"
            >
              <Icon className="w-4 h-4 text-slate-400" />
              <span>{text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Help link */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 text-center text-sm text-slate-500"
      >
        Having trouble signing in?{' '}
        <Link 
          to="/support" 
          className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
        >
          Get help
        </Link>
      </motion.p>
    </div>
  )
}
