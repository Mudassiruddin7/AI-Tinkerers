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
<<<<<<< HEAD
  Home,
  Search,
  Library,
  Heart,
  Clock,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store'
import { useState } from 'react'
=======
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store'
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe

// Check if Clerk is available
const isClerkEnabled = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

interface DashboardLayoutProps {
  userRole: 'admin' | 'employee'
}

const adminNavItems = [
<<<<<<< HEAD
  { path: '/admin', icon: Home, label: 'Home' },
=======
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
  { path: '/admin/create', icon: Plus, label: 'Create Course' },
  { path: '/admin/employees', icon: Users, label: 'Employees' },
  { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/admin/billing', icon: CreditCard, label: 'Billing' },
<<<<<<< HEAD
]

const employeeNavItems = [
  { path: '/employee', icon: Home, label: 'Home' },
  { path: '/employee/progress', icon: Trophy, label: 'My Progress' },
  { path: '/employee/consent', icon: FileCheck, label: 'Consent Settings' },
=======
  { path: '/admin/settings', icon: Settings, label: 'Settings' },
]

const employeeNavItems = [
  { path: '/employee', icon: GraduationCap, label: 'My Learning' },
  { path: '/employee/progress', icon: Trophy, label: 'My Progress' },
  { path: '/employee/consent', icon: FileCheck, label: 'Consent Settings' },
  { path: '/employee/settings', icon: Settings, label: 'Settings' },
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
]

// Dev mode user button placeholder
const DevUserButton = () => (
<<<<<<< HEAD
  <div className="w-8 h-8 bg-spotify-medium-gray rounded-full flex items-center justify-center hover:bg-spotify-light-gray transition-colors">
    <User className="w-4 h-4 text-spotify-text-gray" />
=======
  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
    <User className="w-4 h-4 text-gray-600" />
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
  </div>
)

export function DashboardLayout({ userRole }: DashboardLayoutProps) {
  const location = useLocation()
  const { sidebarOpen, toggleSidebar } = useAppStore()
<<<<<<< HEAD
  const [searchQuery, setSearchQuery] = useState('')
=======
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
  
  // Only use Clerk hooks when enabled
  const clerkUser = isClerkEnabled ? useUser() : { user: null }
  const user = clerkUser.user

  const navItems = userRole === 'admin' ? adminNavItems : employeeNavItems

  // Dev mode user info
  const devUserName = userRole === 'admin' ? 'Admin User' : 'Test Employee'
  const devUserEmail = userRole === 'admin' ? 'admin@company.com' : 'employee@company.com'

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-spotify-black">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-spotify-dark-gray/95 backdrop-blur-lg border-b border-white/5 z-50 flex items-center justify-between px-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-spotify-medium-gray transition-colors"
        >
          <Menu className="w-6 h-6 text-spotify-text-white" />
        </button>
        <div className="flex items-center gap-2">
          <motion.div 
            className="w-8 h-8 bg-spotify-green rounded-full flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-5 h-5 text-black" />
          </motion.div>
          <span className="font-bold text-spotify-text-white">LearnFlow</span>
=======
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
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
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
<<<<<<< HEAD
            className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
=======
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
          />
        )}
      </AnimatePresence>

<<<<<<< HEAD
      {/* Sidebar - Spotify Style */}
=======
      {/* Sidebar */}
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
      <AnimatePresence>
        {(sidebarOpen || window.innerWidth >= 1024) && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
<<<<<<< HEAD
              'fixed top-0 left-0 h-full w-[280px] bg-spotify-black z-50 flex flex-col',
              'lg:translate-x-0 lg:static lg:z-0'
            )}
          >
            {/* Logo Section */}
            <div className="p-6">
              <Link 
                to={userRole === 'admin' ? '/admin' : '/employee'} 
                className="flex items-center gap-3 group"
              >
                <motion.div 
                  className="w-10 h-10 bg-spotify-green rounded-lg flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Sparkles className="w-6 h-6 text-black" />
                </motion.div>
                <span className="font-bold text-xl text-spotify-text-white group-hover:text-spotify-green transition-colors">
                  LearnFlow
                </span>
              </Link>
              
              <button
                onClick={toggleSidebar}
                className="lg:hidden absolute top-4 right-4 p-2 rounded-full hover:bg-spotify-medium-gray transition-colors"
              >
                <X className="w-5 h-5 text-spotify-text-gray" />
              </button>
            </div>

            {/* Main Navigation */}
            <nav className="px-3 space-y-1">
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.path
                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                      className={cn(
                        'flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 group',
                        isActive
                          ? 'bg-spotify-medium-gray text-spotify-text-white'
                          : 'text-spotify-text-gray hover:text-spotify-text-white'
                      )}
                    >
                      <item.icon 
                        className={cn(
                          'w-6 h-6 transition-all duration-200',
                          isActive ? 'text-spotify-text-white' : 'text-spotify-text-gray group-hover:text-spotify-text-white'
                        )} 
                      />
                      <span className="font-medium">{item.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="ml-auto w-1 h-6 bg-spotify-green rounded-full"
                        />
                      )}
                    </Link>
                  </motion.div>
=======
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
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
                )
              })}
            </nav>

<<<<<<< HEAD
            {/* Library Section */}
            <div className="mt-6 px-3">
              <div className="bg-spotify-dark-gray rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <Library className="w-6 h-6 text-spotify-text-gray" />
                  <span className="font-bold text-spotify-text-white">Your Library</span>
                </div>
                
                <div className="space-y-1">
                  <Link
                    to={userRole === 'admin' ? '/admin' : '/employee'}
                    className="flex items-center gap-3 px-2 py-2 rounded-md text-spotify-text-gray hover:text-spotify-text-white hover:bg-spotify-medium-gray transition-all"
                  >
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">Liked Courses</span>
                  </Link>
                  <Link
                    to={userRole === 'admin' ? '/admin' : '/employee/progress'}
                    className="flex items-center gap-3 px-2 py-2 rounded-md text-spotify-text-gray hover:text-spotify-text-white hover:bg-spotify-medium-gray transition-all"
                  >
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Recent Activity</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Settings at bottom */}
            <div className="mt-auto px-3 pb-4">
              <Link
                to={`/${userRole}/settings`}
                className="flex items-center gap-4 px-4 py-3 rounded-lg text-spotify-text-gray hover:text-spotify-text-white hover:bg-spotify-medium-gray transition-all"
              >
                <Settings className="w-5 h-5" />
                <span className="text-sm font-medium">Settings</span>
              </Link>
            </div>

            {/* User Section */}
            <div className="p-4 border-t border-white/5">
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-spotify-medium-gray transition-colors cursor-pointer group">
                {isClerkEnabled ? (
                  <UserButton afterSignOutUrl="/" />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-spotify-green to-emerald-600 rounded-full flex items-center justify-center">
                    <span className="text-black font-bold text-sm">
                      {devUserName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-spotify-text-white truncate group-hover:text-spotify-green transition-colors">
                    {isClerkEnabled ? `${user?.firstName || ''} ${user?.lastName || ''}` : devUserName}
                  </p>
                  <p className="text-xs text-spotify-text-gray truncate">
                    {userRole === 'admin' ? 'Administrator' : 'Employee'}
=======
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
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
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
<<<<<<< HEAD
          'pt-16 lg:pt-0 lg:ml-[280px]'
        )}
      >
        {/* Header with gradient */}
        <div className="sticky top-0 z-30 bg-gradient-to-b from-spotify-dark-gray/95 to-transparent backdrop-blur-lg">
          <div className="px-6 py-4 flex items-center justify-between">
            {/* Search Bar */}
            <div className="relative max-w-md w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-spotify-text-gray" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-spotify-medium-gray rounded-full text-spotify-text-white placeholder-spotify-text-gray border-0 focus:outline-none focus:ring-2 focus:ring-spotify-green transition-all"
              />
            </div>

            {/* User Menu (Desktop) */}
            <div className="hidden lg:flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-spotify-text-white text-spotify-black font-bold rounded-full hover:scale-105 transition-transform"
              >
                Upgrade
              </motion.button>
              {isClerkEnabled ? (
                <UserButton afterSignOutUrl="/" />
              ) : (
                <DevUserButton />
              )}
            </div>
          </div>
        </div>

        <div className="p-6 lg:p-8">
=======
          'pt-16 lg:pt-0 lg:ml-64'
        )}
      >
        <div className="p-4 lg:p-8">
>>>>>>> bb7468aebcc82a565ccbf7c4df7d8f3fb2cc7ffe
          <Outlet />
        </div>
      </main>
    </div>
  )
}
