export interface User {
  id: string
  email: string
  name: string | null
  plan: 'free' | 'starter' | 'pro' | 'agency'
  subscription_id: string | null
  subscription_status: string
  created_at: string
  updated_at: string
}

export interface Brand {
  id: string
  user_id: string
  name: string
  niche: string | null
  tone_of_voice: string | null
  target_audience: string | null
  created_at: string
}

export interface Competitor {
  id: string
  user_id: string
  name: string
  meta_page_id: string | null
  google_domain: string | null
  created_at: string
}

export interface Ad {
  id: string
  competitor_id: string
  user_id: string
  platform: 'meta' | 'google'
  external_id: string | null
  ad_text: string | null
  headline: string | null
  cta_text: string | null
  image_urls: string[]
  video_url: string | null
  landing_page_url: string | null
  format: 'image' | 'video' | 'carousel' | 'text' | null
  status: string
  started_at: string | null
  ended_at: string | null
  raw_data: Record<string, unknown> | null
  created_at: string
}

export interface AdWithAnalysis extends Ad {
  ad_analyses: AdAnalysis[]
  competitors: Pick<Competitor, 'name'>
}

export interface AdAnalysis {
  id: string
  ad_id: string
  user_id: string
  hook: string | null
  offer: string | null
  cta_analysis: string | null
  tone: string | null
  target_audience: string | null
  strengths: string[] | null
  weaknesses: string[] | null
  improvements: string[] | null
  score: number
  raw_response: Record<string, unknown> | null
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  mp_subscription_id: string | null
  plan: string
  status: string
  current_period_start: string | null
  current_period_end: string | null
  created_at: string
}

export interface Usage {
  id: string
  user_id: string
  month: string
  ads_scraped: number
  ai_analyses: number
  created_at: string
}
