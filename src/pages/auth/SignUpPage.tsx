import { SignUp } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Building2 } from 'lucide-react'

export function SignUpPage() {
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
            Get Started Free
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
          <button
            onClick={() => navigate('/admin')}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-semibold py-3 px-4 rounded-xl hover:from-slate-800 hover:to-slate-700 transition-all shadow-lg shadow-slate-900/20"
          >
            Continue to Admin Demo
            <ArrowRight className="w-4 h-4" />
          </button>
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
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 rounded-full text-xs font-semibold tracking-wide uppercase mb-4"
        >
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          14-day free trial
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-slate-900 tracking-tight mb-2"
        >
          Create your account
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-slate-600"
        >
          Already have an account?{' '}
          <Link 
            to="/sign-in" 
            className="text-purple-600 hover:text-purple-700 font-semibold transition-colors"
          >
            Sign in
          </Link>
        </motion.p>
      </div>

      {/* Clerk SignUp Component */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <SignUp
          appearance={{
            layout: {
              socialButtonsPlacement: 'top',
              socialButtonsVariant: 'blockButton',
              termsPageUrl: '/terms',
              privacyPageUrl: '/privacy',
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
          path="/sign-up"
          signInUrl="/sign-in"
          afterSignUpUrl="/admin"
        />
      </motion.div>

      {/* Benefits */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 pt-6 border-t border-slate-200"
      >
        <div className="flex flex-wrap gap-4 justify-center">
          {[
            'No credit card required',
            'Cancel anytime',
            'Free onboarding',
          ].map((benefit, index) => (
            <motion.div
              key={benefit}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-center gap-2 text-sm text-slate-600"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{benefit}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Enterprise CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-6 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900">Enterprise plan available</p>
            <p className="text-xs text-slate-600">SSO, custom integrations, dedicated support</p>
          </div>
          <Link 
            to="/contact" 
            className="text-sm font-semibold text-purple-600 hover:text-purple-700 whitespace-nowrap"
          >
            Contact us →
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
