import { loadStripe, Stripe } from '@stripe/stripe-js'

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

let stripePromise: Promise<Stripe | null>

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublishableKey || '')
  }
  return stripePromise
}

export interface SubscriptionTier {
  name: string
  monthlyPrice: number
  yearlyPrice: number
  features: string[]
  maxSeats: number
  maxCourses: number
  maxStorageGB: number
  recommended?: boolean
}

export const SUBSCRIPTION_TIERS: Record<string, SubscriptionTier> = {
  starter: {
    name: 'Starter',
    monthlyPrice: 49,
    yearlyPrice: 470,
    features: [
      'Up to 25 employees',
      '5 training courses',
      '10 GB storage',
      'Basic analytics',
      'Email support',
    ],
    maxSeats: 25,
    maxCourses: 5,
    maxStorageGB: 10,
  },
  professional: {
    name: 'Professional',
    monthlyPrice: 299,
    yearlyPrice: 2870,
    features: [
      'Up to 100 employees',
      'Unlimited courses',
      '50 GB storage',
      'Advanced analytics',
      'Voice cloning (with consent)',
      'Priority support',
      'Custom branding',
    ],
    maxSeats: 100,
    maxCourses: -1,
    maxStorageGB: 50,
    recommended: true,
  },
  enterprise: {
    name: 'Enterprise',
    monthlyPrice: 799,
    yearlyPrice: 7670,
    features: [
      'Unlimited employees',
      'Unlimited courses',
      'Unlimited storage',
      'Advanced analytics & reporting',
      'Voice cloning (with consent)',
      'SSO / SAML integration',
      'Dedicated account manager',
      'SLA guarantee',
      'API access',
    ],
    maxSeats: -1,
    maxCourses: -1,
    maxStorageGB: -1,
  },
}

export const SUBSCRIPTION_PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small teams getting started',
    priceMonthly: 49,
    priceYearly: 470,
    stripePriceIdMonthly: 'price_starter_monthly',
    stripePriceIdYearly: 'price_starter_yearly',
    features: [
      'Up to 25 employees',
      '5 training courses',
      '10 GB storage',
      'Basic analytics',
      'Email support',
    ],
    maxSeats: 25,
    maxCourses: 5,
    maxStorageGB: 10,
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'For growing organizations',
    priceMonthly: 149,
    priceYearly: 1430,
    stripePriceIdMonthly: 'price_professional_monthly',
    stripePriceIdYearly: 'price_professional_yearly',
    features: [
      'Up to 100 employees',
      'Unlimited courses',
      '50 GB storage',
      'Advanced analytics',
      'Voice cloning (with consent)',
      'Priority support',
      'Custom branding',
    ],
    maxSeats: 100,
    maxCourses: -1, // Unlimited
    maxStorageGB: 50,
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations with advanced needs',
    priceMonthly: 399,
    priceYearly: 3830,
    stripePriceIdMonthly: 'price_enterprise_monthly',
    stripePriceIdYearly: 'price_enterprise_yearly',
    features: [
      'Unlimited employees',
      'Unlimited courses',
      'Unlimited storage',
      'Advanced analytics & reporting',
      'Voice cloning (with consent)',
      'SSO / SAML integration',
      'Dedicated account manager',
      'SLA guarantee',
      'API access',
    ],
    maxSeats: -1, // Unlimited
    maxCourses: -1,
    maxStorageGB: -1,
  },
]

export async function createCheckoutSession(
  priceId: string,
  organizationId: string,
  customerEmail: string
): Promise<string> {
  const response = await fetch('/api/stripe/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      priceId,
      organizationId,
      customerEmail,
      successUrl: `${window.location.origin}/admin/billing?success=true`,
      cancelUrl: `${window.location.origin}/admin/billing?canceled=true`,
    }),
  })

  const { sessionId } = await response.json()
  return sessionId
}

export async function createPortalSession(customerId: string): Promise<string> {
  const response = await fetch('/api/stripe/create-portal-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customerId,
      returnUrl: `${window.location.origin}/admin/billing`,
    }),
  })

  const { url } = await response.json()
  return url
}
