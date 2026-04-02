import { z } from 'zod/v4'
import { getSession } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase'
import { scrapeMetaAds } from '@/lib/apify-meta'
import { checkUsageLimits, incrementUsage } from '@/lib/usage'
import type { Competitor } from '@/types'

const RequestSchema = z.object({
  competitorId: z.string().uuid(),
})

export async function POST(req: Request) {
  const user = await getSession()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = RequestSchema.safeParse(await req.json())
  if (!body.success) return Response.json({ error: body.error }, { status: 400 })

  const canScrape = await checkUsageLimits(user.id, 'ads_scraped')
  if (!canScrape) {
    return Response.json({ error: 'Limite de ads atingido' }, { status: 429 })
  }

  const supabaseAdmin = getSupabaseAdmin()

  try {
    const { data: competitor } = await supabaseAdmin
      .from('competitors')
      .select('*')
      .eq('id', body.data.competitorId)
      .eq('user_id', user.id)
      .single()

    if (!competitor) {
      return Response.json({ error: 'Concorrente não encontrado' }, { status: 404 })
    }

    const comp = competitor as Competitor
    if (!comp.meta_page_id) {
      return Response.json({ error: 'Concorrente sem Meta Page ID' }, { status: 400 })
    }

    const ads = await scrapeMetaAds(comp.meta_page_id)

    let savedCount = 0
    for (const ad of ads) {
      const { error } = await supabaseAdmin
        .from('ads')
        .upsert(
          {
            competitor_id: body.data.competitorId,
            user_id: user.id,
            ...ad,
          },
          { onConflict: 'user_id,external_id', ignoreDuplicates: true }
        )

      if (!error) {
        savedCount++
        await incrementUsage(user.id, 'ads_scraped')
      }
    }

    return Response.json({ scraped: ads.length, saved: savedCount })
  } catch (error) {
    console.error('Meta scrape error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Erro interno' },
      { status: 500 }
    )
  }
}
