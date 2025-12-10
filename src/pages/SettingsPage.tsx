import { useState } from 'react'
import { useUser, useClerk } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import {
  User,
  Bell,
  Shield,
  Palette,
  Moon,
  Sun,
  Globe,
  Mail,
  Key,
  Smartphone,
  LogOut,
  Save,
} from 'lucide-react'
import { Card, CardContent, CardHeader, Button, Input, Badge } from '@/components/ui'
import toast from 'react-hot-toast'

export function SettingsPage() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'appearance' | 'security'>('profile')
  const [isSaving, setIsSaving] = useState(false)

  // Profile settings
  const [profile, setProfile] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.emailAddresses?.[0]?.emailAddress || '',
    timezone: 'America/New_York',
    language: 'en',
  })

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNewCourse: true,
    emailQuizReminder: true,
    emailProgressReport: false,
    pushNewCourse: true,
    pushQuizReminder: true,
    pushAchievement: true,
  })

  // Appearance settings
  const [appearance, setAppearance] = useState({
    theme: 'light' as 'light' | 'dark' | 'system',
    compactMode: false,
    animations: true,
  })

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      // In production, update via Clerk API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveNotifications = async () => {
    setIsSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      toast.success('Notification preferences saved')
    } catch (error) {
      toast.error('Failed to save preferences')
    } finally {
      setIsSaving(false)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
  ] as const

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-48 flex-shrink-0">
          <nav className="flex lg:flex-col gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <h2 className="font-semibold text-gray-900">Profile Information</h2>
                  <p className="text-sm text-gray-500">Update your personal details</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <img
                      src={user?.imageUrl || `https://ui-avatars.com/api/?name=${profile.firstName}+${profile.lastName}`}
                      alt="Profile"
                      className="w-16 h-16 rounded-full"
                    />
                    <div>
                      <Button variant="secondary" size="sm">Change Photo</Button>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF. Max 2MB</p>
                    </div>
                  </div>

                  {/* Name Fields */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    />
                    <Input
                      label="Last Name"
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    />
                  </div>

                  {/* Email */}
                  <Input
                    label="Email Address"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    leftIcon={<Mail className="w-4 h-4" />}
                    disabled
                    hint="Contact your administrator to change email"
                  />

                  {/* Timezone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                    <select
                      value={profile.timezone}
                      onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="Europe/London">London (GMT)</option>
                      <option value="Asia/Kolkata">India (IST)</option>
                    </select>
                  </div>

                  {/* Language */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                    <select
                      value={profile.language}
                      onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>

                  <div className="pt-4 border-t">
                    <Button
                      onClick={handleSaveProfile}
                      isLoading={isSaving}
                      leftIcon={<Save className="w-4 h-4" />}
                    >
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <h2 className="font-semibold text-gray-900">Notification Preferences</h2>
                  <p className="text-sm text-gray-500">Choose how you want to be notified</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Email Notifications */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Notifications
                    </h3>
                    <div className="space-y-4">
                      {[
                        { key: 'emailNewCourse', label: 'New course available', desc: 'Get notified when new training is assigned' },
                        { key: 'emailQuizReminder', label: 'Quiz reminders', desc: 'Reminders for incomplete quizzes' },
                        { key: 'emailProgressReport', label: 'Weekly progress report', desc: 'Summary of your learning progress' },
                      ].map((item) => (
                        <label key={item.key} className="flex items-start justify-between cursor-pointer">
                          <div>
                            <p className="font-medium text-gray-700">{item.label}</p>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notifications[item.key as keyof typeof notifications]}
                            onChange={(e) =>
                              setNotifications({ ...notifications, [item.key]: e.target.checked })
                            }
                            className="mt-1 w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Push Notifications */}
                  <div className="pt-6 border-t">
                    <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      Push Notifications
                    </h3>
                    <div className="space-y-4">
                      {[
                        { key: 'pushNewCourse', label: 'New course alerts', desc: 'Instant notifications for new content' },
                        { key: 'pushQuizReminder', label: 'Quiz reminders', desc: 'Push alerts for pending quizzes' },
                        { key: 'pushAchievement', label: 'Achievement unlocked', desc: 'Celebrate your milestones' },
                      ].map((item) => (
                        <label key={item.key} className="flex items-start justify-between cursor-pointer">
                          <div>
                            <p className="font-medium text-gray-700">{item.label}</p>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={notifications[item.key as keyof typeof notifications]}
                            onChange={(e) =>
                              setNotifications({ ...notifications, [item.key]: e.target.checked })
                            }
                            className="mt-1 w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button
                      onClick={handleSaveNotifications}
                      isLoading={isSaving}
                      leftIcon={<Save className="w-4 h-4" />}
                    >
                      Save Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <h2 className="font-semibold text-gray-900">Appearance</h2>
                  <p className="text-sm text-gray-500">Customize how the app looks</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Theme Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'light', label: 'Light', icon: Sun },
                        { value: 'dark', label: 'Dark', icon: Moon },
                        { value: 'system', label: 'System', icon: Globe },
                      ].map((theme) => (
                        <button
                          key={theme.value}
                          onClick={() => setAppearance({ ...appearance, theme: theme.value as typeof appearance.theme })}
                          className={`p-4 rounded-lg border-2 transition-colors ${
                            appearance.theme === theme.value
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <theme.icon className={`w-6 h-6 mx-auto mb-2 ${
                            appearance.theme === theme.value ? 'text-primary-600' : 'text-gray-400'
                          }`} />
                          <span className={`text-sm font-medium ${
                            appearance.theme === theme.value ? 'text-primary-700' : 'text-gray-600'
                          }`}>
                            {theme.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Other Options */}
                  <div className="space-y-4 pt-4 border-t">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="font-medium text-gray-700">Compact Mode</p>
                        <p className="text-sm text-gray-500">Reduce spacing and padding</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={appearance.compactMode}
                        onChange={(e) => setAppearance({ ...appearance, compactMode: e.target.checked })}
                        className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="font-medium text-gray-700">Animations</p>
                        <p className="text-sm text-gray-500">Enable motion effects</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={appearance.animations}
                        onChange={(e) => setAppearance({ ...appearance, animations: e.target.checked })}
                        className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                      />
                    </label>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <h2 className="font-semibold text-gray-900">Security Settings</h2>
                  <p className="text-sm text-gray-500">Manage your account security</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Password */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <Key className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Password</p>
                        <p className="text-sm text-gray-500">Last changed 30 days ago</p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm">Change</Button>
                  </div>

                  {/* Two-Factor Auth */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-500">Add extra security to your account</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Not enabled</Badge>
                  </div>

                  {/* Active Sessions */}
                  <div className="pt-4 border-t">
                    <h3 className="font-medium text-gray-900 mb-4">Active Sessions</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Current Session</p>
                            <p className="text-xs text-gray-500">Windows • Chrome • New York, US</p>
                          </div>
                        </div>
                        <Badge variant="success">Active</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="border-red-200">
                <CardHeader>
                  <h2 className="font-semibold text-red-600">Danger Zone</h2>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Sign Out</p>
                      <p className="text-sm text-gray-500">Sign out of your account on this device</p>
                    </div>
                    <Button
                      variant="danger"
                      size="sm"
                      leftIcon={<LogOut className="w-4 h-4" />}
                      onClick={() => signOut()}
                    >
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
