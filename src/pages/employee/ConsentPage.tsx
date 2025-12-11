import { useState } from 'react'
import { motion } from 'framer-motion'
import { useUser } from '@clerk/clerk-react'
import {
  Shield,
  Camera,
  Mic,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  FileText,
  Info,
} from 'lucide-react'
import { Card, CardContent, Button, Badge } from '@/components/ui'
import type { ConsentRecord } from '@/types'

export function ConsentPage() {
  const { user } = useUser()
  const [showRevokeModal, setShowRevokeModal] = useState<string | null>(null)

  // Mock consent records
  const [consents, setConsents] = useState<(ConsentRecord & { status: 'active' | 'pending' | 'revoked' })[]>([
    {
      id: '1',
      userId: user?.id || '',
      organizationId: 'org1',
      consentType: 'likeness',
      granted: true,
      grantedAt: '2024-01-01T10:00:00Z',
      expiresAt: '2025-01-01T10:00:00Z',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0...',
      status: 'active',
    },
    {
      id: '2',
      userId: user?.id || '',
      organizationId: 'org1',
      consentType: 'voice',
      granted: true,
      grantedAt: '2024-01-01T10:00:00Z',
      expiresAt: '2025-01-01T10:00:00Z',
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0...',
      status: 'active',
    },
  ])

  const [pendingRequests, setPendingRequests] = useState([
    {
      id: 'req1',
      type: 'likeness',
      requestedAt: '2024-01-18T14:30:00Z',
      purpose: 'Q1 2024 Product Training Videos',
      expiresAfterGrant: '1 year',
    },
  ])

  const handleGrantConsent = (requestId: string) => {
    const request = pendingRequests.find((r) => r.id === requestId)
    if (!request) return

    const newConsent: ConsentRecord & { status: 'active' | 'pending' | 'revoked' } = {
      id: `consent-${Date.now()}`,
      userId: user?.id || '',
      organizationId: 'org1',
      consentType: request.type as 'likeness' | 'voice',
      granted: true,
      grantedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      ipAddress: '192.168.1.1',
      userAgent: navigator.userAgent,
      status: 'active',
    }

    setConsents([...consents, newConsent])
    setPendingRequests(pendingRequests.filter((r) => r.id !== requestId))
  }

  const handleDenyConsent = (requestId: string) => {
    setPendingRequests(pendingRequests.filter((r) => r.id !== requestId))
  }

  const handleRevokeConsent = (consentId: string) => {
    setConsents(
      consents.map((c) =>
        c.id === consentId ? { ...c, granted: false, status: 'revoked' as const, revokedAt: new Date().toISOString() } : c
      )
    )
    setShowRevokeModal(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getConsentIcon = (type: string) => {
    switch (type) {
      case 'likeness':
        return Camera
      case 'voice':
        return Mic
      default:
        return Shield
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Consent Management</h1>
        <p className="text-gray-600 mt-1">
          Manage your consent for AI-generated content using your likeness and voice
        </p>
      </div>

      {/* Info Banner */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent>
          <div className="flex gap-4">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-900">About Your Consent</h3>
              <p className="text-sm text-blue-700 mt-1">
                Your organization uses AI technology to create personalized training videos. Your explicit
                consent is required before your photo or voice can be used. You can revoke consent at any time,
                and all data will be removed within 30 days of revocation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Pending Consent Requests
          </h2>
          <div className="space-y-4">
            {pendingRequests.map((request) => {
              const Icon = getConsentIcon(request.type)
              return (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="border-orange-200 bg-orange-50">
                    <CardContent>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <Icon className="w-6 h-6 text-orange-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {request.type === 'likeness' ? 'Photo/Likeness' : 'Voice Clone'} Consent Request
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              <strong>Purpose:</strong> {request.purpose}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              <Clock className="w-4 h-4 inline mr-1" />
                              Requested on {formatDate(request.requestedAt)}
                            </p>
                            <p className="text-sm text-gray-500">
                              <FileText className="w-4 h-4 inline mr-1" />
                              Valid for: {request.expiresAfterGrant}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleDenyConsent(request.id)}
                          >
                            Deny
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleGrantConsent(request.id)}
                          >
                            Grant Consent
                          </Button>
                        </div>
                      </div>

                      {/* Consent Details */}
                      <div className="mt-4 p-4 bg-white rounded-lg text-sm">
                        <p className="text-gray-600">
                          By granting consent, you agree that:
                        </p>
                        <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                          <li>Your {request.type === 'likeness' ? 'photo' : 'voice'} may be used in AI-generated training videos</li>
                          <li>The content will only be used for internal company training</li>
                          <li>You can revoke this consent at any time</li>
                          <li>Your data will be deleted within 30 days of revocation</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </section>
      )}

      {/* Active Consents */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Consents</h2>
        <div className="space-y-4">
          {consents.map((consent) => {
            const Icon = getConsentIcon(consent.consentType)
            return (
              <motion.div
                key={consent.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            consent.status === 'active'
                              ? 'bg-green-100'
                              : consent.status === 'revoked'
                              ? 'bg-red-100'
                              : 'bg-gray-100'
                          }`}
                        >
                          <Icon
                            className={`w-6 h-6 ${
                              consent.status === 'active'
                                ? 'text-green-600'
                                : consent.status === 'revoked'
                                ? 'text-red-600'
                                : 'text-gray-600'
                            }`}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">
                              {consent.consentType === 'likeness' ? 'Photo/Likeness' : 'Voice Clone'}
                            </h3>
                            <Badge
                              variant={
                                consent.status === 'active'
                                  ? 'success'
                                  : consent.status === 'revoked'
                                  ? 'danger'
                                  : 'secondary'
                              }
                            >
                              {consent.status === 'active' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                              {consent.status === 'revoked' && <XCircle className="w-3 h-3 mr-1" />}
                              {consent.status.charAt(0).toUpperCase() + consent.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                            <span>Granted: {formatDate(consent.grantedAt!)}</span>
                            {consent.expiresAt && (
                              <span>Expires: {formatDate(consent.expiresAt)}</span>
                            )}
                          </div>
                          {consent.revokedAt && (
                            <p className="text-sm text-red-600 mt-1">
                              Revoked on {formatDate(consent.revokedAt)}
                            </p>
                          )}
                        </div>
                      </div>
                      {consent.status === 'active' && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setShowRevokeModal(consent.id)}
                        >
                          Revoke
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}

          {consents.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No consent records found</p>
                <p className="text-sm text-gray-400 mt-1">
                  You will see consent requests here when your organization requests to use your likeness or voice
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Audit Trail */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Consent History</h2>
        <Card>
          <CardContent>
            <div className="divide-y divide-gray-100">
              {[
                { action: 'Consent Granted', type: 'likeness', date: '2024-01-01T10:00:00Z' },
                { action: 'Consent Granted', type: 'voice', date: '2024-01-01T10:05:00Z' },
                { action: 'Photo Uploaded', type: 'likeness', date: '2024-01-02T14:30:00Z' },
                { action: 'Voice Sample Recorded', type: 'voice', date: '2024-01-02T14:35:00Z' },
              ].map((event, index) => (
                <div key={index} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{event.action}</p>
                      <p className="text-xs text-gray-500">{event.type}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{formatDate(event.date)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Revoke Modal */}
      {showRevokeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-md w-full p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Revoke Consent?</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to revoke this consent? Your data will be scheduled for deletion within 30 days.
              Any existing content using your likeness or voice may be regenerated or removed.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setShowRevokeModal(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => handleRevokeConsent(showRevokeModal)}>
                Revoke Consent
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
