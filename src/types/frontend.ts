export type Platform = 'meta' | 'google';

export interface Ad {
  id: string;
  externalId: string;
  platform: Platform;
  competitorId: string;
  competitorName: string;
  thumbnailUrl: string;
  headline: string;
  text: string;
  ctaText: string;
  landingPageUrl: string;
  status: 'active' | 'inactive';
  startDate: string;
  daysActive: number;
  score?: number;
  isWinner: boolean;
  isNew: boolean;
  analysis?: AdAnalysis;
}

export interface AdAnalysis {
  hook: string;
  offer: string;
  cta: string;
  tone: string;
  targetAudience: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export interface Competitor {
  id: string;
  name: string;
  metaPageId?: string;
  googleDomain?: string;
  adCount: number;
  newAdsLast7Days: number;
  averageScore: number;
  lastScan: string;
}

export interface BrandConfig {
  name: string;
  niche: string;
  toneOfVoice: string;
  targetAudience: string;
}

export interface UserPlan {
  name: 'free' | 'starter' | 'pro' | 'agency';
  adsLimit: number;
  adsUsed: number;
  analysisLimit: number;
  analysisUsed: number;
  competitorLimit: number;
  competitorUsed: number;
}
