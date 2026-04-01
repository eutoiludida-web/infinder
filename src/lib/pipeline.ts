import { getSupabaseAdmin } from './supabase'
import { scrapeMetaAds, type NormalizedMetaAd } from './apify-meta'
import { scrapeGoogleAds, type NormalizedGoogleAd } from './apify-google'
import { analyzeAd } from './gemini'
import { checkUsageLimits, incrementUsage } from './usage'
import type { Competitor } from '@/types'

interface PipelineResult {
  newAdsCount: number
  analyzedCount: number
  errors: string[]
}

export async function runPipeline(
  userId: string,
  competitorId: string
): Promise<PipelineResult> {
  const supabaseAdmin = getSupabaseAdmin()
  const errors: string[] = []

  // 1. Fetch competitor
  const { data: competitor, error: compError } = await supabaseAdmin
    .from('competitors')
    .select('*')
    .eq('id', competitorId)
    .eq('user_id', userId)
    .single()

  if (compError || !competitor) {
    throw new Error('Concorrente não encontrado')
  }

  const comp = competitor as Competitor
  let allAds: (NormalizedMetaAd | NormalizedGoogleAd)[] = []

  // 2. Scrape Meta Ads
  if (comp.meta_page_id) {
    const canScrape = await checkUsageLimits(userId, 'ads_scraped')
    if (!canScrape) {
      errors.push('Limite de scraping de ads atingido')
    } else {
      try {
        const metaAds = await scrapeMetaAds(comp.meta_page_id)
        allAds.push(...metaAds)
      } catch (err) {
        errors.push(`Erro ao scrappear Meta Ads: ${err instanceof Error ? err.message : 'Erro desconhecido'}`)
      }
    }
  }

  // 3. Scrape Google Ads
  if (comp.google_domain) {
    const canScrape = await checkUsageLimits(userId, 'ads_scraped')
    if (!canScrape) {
      errors.push('Limite de scraping de ads atingido')
    } else {
      try {
        const googleAds = await scrapeGoogleAds(comp.google_domain)
        allAds.push(...googleAds)
      } catch (err) {
        errors.push(`Erro ao scrappear Google Ads: ${err instanceof Error ? err.message : 'Erro desconhecido'}`)
      }
    }
  }

  // 4. Dedup and save ads
  let newAdsCount = 0
  for (const ad of allAds) {
    const { error: insertError } = await supabaseAdmin
      .from('ads')
      .upsert(
        {
          competitor_id: competitorId,
          user_id: userId,
          platform: ad.platform,
          external_id: ad.external_id,
          ad_text: ad.ad_text,
          headline: ad.headline,
          cta_text: ad.cta_text,
          image_urls: ad.image_urls,
          video_url: ad.video_url,
          landing_page_url: ad.landing_page_url,
          format: ad.format,
          status: ad.status,
          started_at: ad.started_at,
          ended_at: ad.ended_at,
          raw_data: ad.raw_data,
        },
        { onConflict: 'competitor_id,external_id', ignoreDuplicates: true }
      )

    if (!insertError) {
      newAdsCount++
      await incrementUsage(userId, 'ads_scraped')
    }
  }

  // 5. Analyze top ads with Gemini (newest first, max 5)
  const { data: adsToAnalyze } = await supabaseAdmin
    .from('ads')
    .select('*, ad_analyses(id)')
    .eq('competitor_id', competitorId)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10)

  let analyzedCount = 0
  const unanalyzed = (adsToAnalyze || []).filter(
    (ad: { ad_analyses: { id: string }[] }) => ad.ad_analyses.length === 0
  )

  for (const ad of unanalyzed.slice(0, 5)) {
    const canAnalyze = await checkUsageLimits(userId, 'ai_analyses')
    if (!canAnalyze) {
      errors.push('Limite de análises IA atingido')
      break
    }

    try {
      const analysis = await analyzeAd({
        ad_text: ad.ad_text,
        headline: ad.headline,
        cta_text: ad.cta_text,
        image_urls: ad.image_urls || [],
        platform: ad.platform,
      })

      await supabaseAdmin.from('ad_analyses').insert({
        ad_id: ad.id,
        user_id: userId,
        ...analysis,
        raw_response: analysis,
      })

      await incrementUsage(userId, 'ai_analyses')
      analyzedCount++

      // Rate limit: wait 4s between Gemini calls
      if (analyzedCount < unanalyzed.length) {
        await new Promise((resolve) => setTimeout(resolve, 4000))
      }
    } catch (err) {
      errors.push(`Erro ao analisar ad: ${err instanceof Error ? err.message : 'Erro desconhecido'}`)
    }
  }

  return { newAdsCount, analyzedCount, errors }
}
