export type ButtonType = {
  text: string
  enabled: boolean
}
export type PlanType = {
  name: string
  price: number
  period: string
  ribbon?: string
  features: string[]
  button: ButtonType
}

export const PricingPlans: PlanType[] = [
  {
    name: 'Free Pack',
    price: 0,
    period: 'Month',
    features: [
      '5 GB Storage',
      '100 GB Bandwidth',
      '1 Domain',
      'No Support',
      '24x7 Support',
      '1 User',
    ],
    button: {
      text: 'Get Started',
      enabled: true,
    },
  },
  {
    name: 'Professional Pack',
    price: 19,
    period: 'Month',
    ribbon: 'Popular',
    features: [
      '50 GB Storage',
      '900 GB Bandwidth',
      '2 Domains',
      'Email Support',
      '24x7 Support',
      '5 Users',
    ],
    button: {
      text: 'Current Plan',
      enabled: false,
    },
  },
  {
    name: 'Business Pack',
    price: 29,
    period: 'Month',
    features: [
      '500 GB Storage',
      '2.5 TB Bandwidth',
      '5 Domains',
      'Email Support',
      '24x7 Support',
      '10 Users',
    ],
    button: {
      text: 'Get Started',
      enabled: true,
    },
  },
  {
    name: 'Enterprise Pack',
    price: 49,
    period: 'Month',
    features: [
      '2 TB Storage',
      'Unlimited Bandwidth',
      '50 Domains',
      'Email Support',
      '24x7 Support',
      'Unlimited Users',
    ],
    button: {
      text: 'Get Started',
      enabled: true,
    },
  },
]
