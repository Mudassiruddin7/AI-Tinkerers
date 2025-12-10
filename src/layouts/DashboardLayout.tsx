import { Outlet, Link, useLocation } from 'react-router-dom'
import { useUser, UserButton } from '@clerk/clerk-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  BookOpen,
  Users,
  BarChart3,
  Settings,
  CreditCard,
  Menu,
  X,
  Plus,
  GraduationCap,
  Trophy,
  FileCheck,
  ChevronRight,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store'

// Check if Clerk is available
const isClerkEnabled = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

interface DashboardLayoutProps {
  userRole: 'admin' | 'employee'
}

const adminNavItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/create', icon: Plus, label: 'Create Course' },
  { path: '/admin/employees', icon: Users, label: 'Employees' },
  { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/admin/billing', icon: CreditCard, label: 'Billing' },
  { path: '/admin/settings', icon: Settings, label: 'Settings' },
]

const employeeNavItems = [
  { path: '/employee', icon: GraduationCap, label: 'My Learning' },
  { path: '/employee/progress', icon: Trophy, label: 'My Progress' },
  { path: '/employee/consent', icon: FileCheck, label: 'Consent Settings' },
  { path: '/employee/settings', icon: Settings, label: 'Settings' },
]

// Dev mode user button placeholder
const DevUserButton = () => (
  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
    <User className="w-4 h-4 text-gray-600" />
  </div>
)

export function DashboardLayout({ userRole }: DashboardLayoutProps) {
  const location = useLocation()
  const { sidebarOpen, toggleSidebar } = useAppStore()
  
  // Only use Clerk hooks when enabled
  const clerkUser = isClerkEnabled ? useUser() : { user: null }
  const user = clerkUser.user

  const navItems = userRole === 'admin' ? adminNavItems : employeeNavItems

  // Dev mode user info
  const devUserName = userRole === 'admin' ? 'Admin User' : 'Test Employee'
  const devUserEmail = userRole === 'admin' ? 'admin@company.com' : 'employee@company.com'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-gray-900">LearnFlow</span>
        </div>
        {isClerkEnabled ? <UserButton afterSignOutUrl="/" /> : <DevUserButton />}
      </div>

      {/* Sidebar Overlay (Mobile) */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || window.innerWidth >= 1024) && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              'fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50',
              'lg:translate-x-0 lg:static lg:z-0'
            )}
          >
            {/* Logo */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
              <Link to={userRole === 'admin' ? '/admin' : '/employee'} className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-gray-900">LearnFlow</span>
              </Link>
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                      isActive
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    )}
                  >
                    <item.icon className={cn('w-5 h-5', isActive && 'text-primary-600')} />
                    <span>{item.label}</span>
                    {isActive && (
                      <ChevronRight className="w-4 h-4 ml-auto text-primary-600" />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* User Section */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                {isClerkEnabled ? <UserButton afterSignOutUrl="/" /> : <DevUserButton />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {isClerkEnabled ? `${user?.firstName || ''} ${user?.lastName || ''}` : devUserName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {isClerkEnabled ? user?.emailAddresses[0]?.emailAddress : devUserEmail}
                  </p>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={cn(
          'min-h-screen transition-all duration-300',
          'pt-16 lg:pt-0 lg:ml-64'
        )}
      >
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
