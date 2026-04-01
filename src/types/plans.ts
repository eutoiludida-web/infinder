export const PLAN_LIMITS = {
  free:    { competitors: 1,  ads_scraped: 20,   ai_analyses: 5 },
  starter: { competitors: 3,  ads_scraped: 200,  ai_analyses: 50 },
  pro:     { competitors: 10, ads_scraped: 800,  ai_analyses: 200 },
  agency:  { competitors: 30, ads_scraped: 3000, ai_analyses: 600 },
} as const

export type PlanName = keyof typeof PLAN_LIMITS
export type UsageType = 'ads_scraped' | 'ai_analyses'

export const PLAN_PRICES = {
  starter: 97,
  pro: 197,
  agency: 497,
} as const

export const PLAN_FEATURES = {
  starter: {
    name: 'Starter',
    price: 97,
    competitors: 3,
    adsPerMonth: 200,
    analysesPerMonth: 50,
    platforms: 'Meta Ads',
  },
  pro: {
    name: 'Pro',
    price: 197,
    competitors: 10,
    adsPerMonth: 800,
    analysesPerMonth: 200,
    platforms: 'Meta + Google Ads',
  },
  agency: {
    name: 'Agency',
    price: 497,
    competitors: 30,
    adsPerMonth: 3000,
    analysesPerMonth: 600,
    platforms: 'Todas as plataformas',
  },
} as const
