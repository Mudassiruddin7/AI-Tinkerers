import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  CreditCard,
  Check,
  Building2,
  Users,
  Zap,
  Download,
  ChevronRight,
  AlertCircle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, Button, Badge } from '@/components/ui'
import { SUBSCRIPTION_TIERS } from '@/lib/stripe'
import toast from 'react-hot-toast'

export function BillingPage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)

  // Mock subscription data
  const currentPlan = {
    tier: 'professional' as const,
    status: 'active',
    currentPeriodEnd: '2024-02-15',
    employeesUsed: 85,
    employeesLimit: 100,
    coursesUsed: 8,
    coursesLimit: -1, // unlimited
    monthlyMinutesUsed: 450,
    monthlyMinutesLimit: 1000,
  }

  const invoices = [
    { id: 'inv_001', date: '2024-01-15', amount: 299, status: 'paid' },
    { id: 'inv_002', date: '2023-12-15', amount: 299, status: 'paid' },
    { id: 'inv_003', date: '2023-11-15', amount: 299, status: 'paid' },
    { id: 'inv_004', date: '2023-10-15', amount: 299, status: 'paid' },
  ]

  const handleUpgrade = async (_tierId: string) => {
    setIsProcessing(true)
    try {
      // In production, redirect to Stripe Checkout
      await new Promise((resolve) => setTimeout(resolve, 1500))
      toast.success('Redirecting to checkout...')
    } catch (error) {
      toast.error('Failed to initiate upgrade')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancelSubscription = async () => {
    setIsProcessing(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success('Subscription canceled')
      setShowCancelModal(false)
    } catch (error) {
      toast.error('Failed to cancel subscription')
    } finally {
      setIsProcessing(false)
    }
  }

  const currentTierInfo = SUBSCRIPTION_TIERS[currentPlan.tier]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing & Subscription</h1>
        <p className="text-gray-600 mt-1">Manage your subscription plan and payment methods</p>
      </div>

      {/* Current Plan */}
      <Card className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <CardContent className="py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold">{currentTierInfo.name} Plan</h2>
                <Badge variant="success" className="bg-white/20 text-white border-white/30">
                  Active
                </Badge>
              </div>
              <p className="text-primary-100 mt-1">
                Your plan renews on {new Date(currentPlan.currentPeriodEnd).toLocaleDateString()}
              </p>
              <p className="text-2xl font-bold mt-4">
                ${currentTierInfo.monthlyPrice}/month
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" className="bg-white text-primary-600 hover:bg-primary-50">
                Manage Payment
              </Button>
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10"
                onClick={() => setShowCancelModal(true)}
              >
                Cancel Plan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Employees</p>
                <p className="font-semibold text-gray-900">
                  {currentPlan.employeesUsed} / {currentPlan.employeesLimit}
                </p>
              </div>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${(currentPlan.employeesUsed / currentPlan.employeesLimit) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Courses</p>
                <p className="font-semibold text-gray-900">
                  {currentPlan.coursesUsed} / {currentPlan.coursesLimit === -1 ? '∞' : currentPlan.coursesLimit}
                </p>
              </div>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Video Minutes</p>
                <p className="font-semibold text-gray-900">
                  {currentPlan.monthlyMinutesUsed} / {currentPlan.monthlyMinutesLimit}
                </p>
              </div>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full"
                style={{ width: `${(currentPlan.monthlyMinutesUsed / currentPlan.monthlyMinutesLimit) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plans Comparison */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Plans</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(SUBSCRIPTION_TIERS).map(([key, tier]) => {
            const isCurrentPlan = key === currentPlan.tier
            return (
              <motion.div
                key={key}
                whileHover={{ scale: 1.02 }}
                className={`relative ${tier.recommended ? 'md:-mt-4 md:mb-4' : ''}`}
              >
                <Card className={`h-full ${
                  isCurrentPlan
                    ? 'border-2 border-primary-500'
                    : tier.recommended
                    ? 'border-2 border-orange-500'
                    : ''
                }`}>
                  {tier.recommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-orange-500 text-white">Recommended</Badge>
                    </div>
                  )}
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-bold text-gray-900">{tier.name}</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      ${tier.monthlyPrice}
                      <span className="text-base font-normal text-gray-500">/month</span>
                    </p>
                    <ul className="mt-6 space-y-3">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6">
                      {isCurrentPlan ? (
                        <Button variant="secondary" fullWidth disabled>
                          Current Plan
                        </Button>
                      ) : (
                        <Button
                          fullWidth
                          variant={tier.recommended ? 'primary' : 'secondary'}
                          onClick={() => handleUpgrade(key)}
                          isLoading={isProcessing}
                        >
                          {SUBSCRIPTION_TIERS[currentPlan.tier].monthlyPrice < tier.monthlyPrice
                            ? 'Upgrade'
                            : 'Downgrade'}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Payment Method */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Payment Method</h2>
          <Button variant="secondary" size="sm">Update</Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
              <p className="text-sm text-gray-500">Expires 12/25</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Billing History</h2>
          <Button variant="ghost" size="sm" leftIcon={<Download className="w-4 h-4" />}>
            Download All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-gray-100">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Invoice #{invoice.id.split('_')[1].toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-500">{new Date(invoice.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${invoice.amount}</p>
                    <Badge variant="success">Paid</Badge>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-md w-full p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Cancel Subscription?</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel your subscription? You'll lose access to:
            </p>
            <ul className="text-sm text-gray-600 space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                All your created courses and content
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                Employee progress data
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-gray-400" />
                AI video generation features
              </li>
            </ul>
            <p className="text-sm text-gray-500 mb-6">
              Your access will continue until {new Date(currentPlan.currentPeriodEnd).toLocaleDateString()}.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
                Keep Plan
              </Button>
              <Button
                variant="danger"
                onClick={handleCancelSubscription}
                isLoading={isProcessing}
              >
                Cancel Subscription
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
