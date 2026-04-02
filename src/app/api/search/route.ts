import { z } from 'zod/v4'
import { getSession } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase'
import { checkUsageLimits, incrementUsage } from '@/lib/usage'
import { scrapeMetaAds } from '@/lib/apify-meta'

const RequestSchema = z.object({
  keyword: z.string().min(1).max(200),
  limit: z.number().min(1).max(50).optional(),
})

export async function POST(req: Request) {
  const user = await getSession()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = RequestSchema.safeParse(await req.json())
  if (!body.success) return Response.json({ error: body.error }, { status: 400 })

  const canScrape = await checkUsageLimits(user.id, 'ads_scraped')
  if (!canScrape) {
    return Response.json({ error: 'Limite de ads atingido no seu plano' }, { status: 429 })
  }

  try {
    const ads = await scrapeMetaAds(body.data.keyword, body.data.limit || 20)

    // Save ads to DB — use user_id + external_id unique constraint
    const supabaseAdmin = getSupabaseAdmin()
    let savedCount = 0

    for (const ad of ads) {
      if (!ad.external_id) continue

      const { error } = await supabaseAdmin
        .from('ads')
        .upsert(
          {
            user_id: user.id,
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
          { onConflict: 'user_id,external_id', ignoreDuplicates: true }
        )

      if (!error) {
        savedCount++
        await incrementUsage(user.id, 'ads_scraped')
      }
    }

    // Return results directly (don't need to re-fetch from DB)
    return Response.json({
      ads: ads.map((ad, i) => ({
        id: `search-${i}`,
        external_id: ad.external_id,
        platform: ad.platform,
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
        page_name: ad.raw_data.page_name || body.data.keyword,
      })),
      total: ads.length,
      saved: savedCount,
    })
  } catch (error) {
    console.error('Search error:', error)
    return Response.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
