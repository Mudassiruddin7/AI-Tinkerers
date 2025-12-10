import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-react'
import { Toaster } from 'react-hot-toast'
import { AuthLayout } from './layouts/AuthLayout'
import { DashboardLayout } from './layouts/DashboardLayout'
import {
  LandingPage,
  SignInPage,
  SignUpPage,
  AdminDashboard,
  CreateCourse,
  CourseBuilder,
  ManageEmployees,
  AdminAnalytics,
  BillingPage,
  EmployeeHome,
  VideoPlayer,
  MyProgress,
  ConsentPage,
  SettingsPage,
} from './pages'

// Check if Clerk is available
const isClerkEnabled = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: 'admin' | 'employee' }) {
  // In dev mode without Clerk, allow access
  if (!isClerkEnabled) {
    return <>{children}</>
  }

  let user, isLoaded
  try {
    const userHook = useUser()
    user = userHook.user
    isLoaded = userHook.isLoaded
  } catch (error) {
    console.error('Clerk useUser error:', error)
    return <>{children}</>
  }
  
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  // Check role from user metadata (set during signup or by admin)
  // Default to 'admin' for first user / testing purposes
  const userRole = user?.publicMetadata?.role as string || 'admin'
  
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to={userRole === 'admin' ? '/admin' : '/employee'} replace />
  }
  
  return <>{children}</>
}

// Wrapper for SignedIn that works in dev mode
const AuthRequired = ({ children }: { children: React.ReactNode }) => {
  if (!isClerkEnabled) {
    return <>{children}</>
  }
  
  try {
    return <SignedIn>{children}</SignedIn>
  } catch (error) {
    console.error('Clerk SignedIn error:', error)
    return <>{children}</>
  }
}

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
        </Route>
        
        {/* Protected Admin Routes */}
        <Route element={
          <AuthRequired>
            <ProtectedRoute requiredRole="admin">
              <DashboardLayout userRole="admin" />
            </ProtectedRoute>
          </AuthRequired>
        }>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/create" element={<CreateCourse />} />
          <Route path="/admin/course/:courseId" element={<CourseBuilder />} />
          <Route path="/admin/employees" element={<ManageEmployees />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/settings" element={<SettingsPage />} />
          <Route path="/admin/billing" element={<BillingPage />} />
        </Route>
        
        {/* Protected Employee Routes */}
        <Route element={
          <AuthRequired>
            <ProtectedRoute requiredRole="employee">
              <DashboardLayout userRole="employee" />
            </ProtectedRoute>
          </AuthRequired>
        }>
          <Route path="/employee" element={<EmployeeHome />} />
          <Route path="/employee/watch/:courseId/episode/:episodeId" element={<VideoPlayer />} />
          <Route path="/employee/progress" element={<MyProgress />} />
          <Route path="/employee/consent" element={<ConsentPage />} />
          <Route path="/employee/settings" element={<SettingsPage />} />
        </Route>
        
        {/* Fallback routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
