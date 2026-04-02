export const maxDuration = 60

import { z } from 'zod/v4'
import { getSession } from '@/lib/auth'
import { checkUsageLimits } from '@/lib/usage'

const APIFY_TOKEN = process.env.APIFY_API_TOKEN!
const ACTOR_ID = 'curious_coder~facebook-ads-library-scraper'

const RequestSchema = z.object({
  keyword: z.string().min(1).max(200),
})

// POST /api/search — Start a search job (returns runId immediately)
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
    const adLibraryUrl = `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&q=${encodeURIComponent(body.data.keyword)}`

    const runRes = await fetch(
      `https://api.apify.com/v2/acts/${ACTOR_ID}/runs?token=${APIFY_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          urls: [{ url: adLibraryUrl }],
          maxAds: 10,
        }),
      }
    )

    if (!runRes.ok) {
      return Response.json({ error: 'Erro ao conectar com o serviço de busca.' }, { status: 502 })
    }

    const runData = await runRes.json()
    const runId = runData.data?.id

    if (!runId) {
      return Response.json({ error: 'Erro ao iniciar busca.' }, { status: 500 })
    }

    // Return immediately with runId — frontend will poll
    return Response.json({ runId, status: 'RUNNING' })
  } catch (error) {
    console.error('Search start error:', error)
    return Response.json({ error: 'Erro ao iniciar busca.' }, { status: 500 })
  }
}

// GET /api/search?runId=xxx — Check status and get results
export async function GET(req: Request) {
  const user = await getSession()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const runId = searchParams.get('runId')

  if (!runId) {
    return Response.json({ error: 'runId required' }, { status: 400 })
  }

  try {
    // Check run status
    const statusRes = await fetch(
      `https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`
    )
    if (!statusRes.ok) {
      return Response.json({ error: 'Erro ao verificar status.' }, { status: 500 })
    }

    const statusData = await statusRes.json()
    const status = statusData.data?.status
    const datasetId = statusData.data?.defaultDatasetId

    if (status === 'RUNNING' || status === 'READY') {
      return Response.json({ status: 'RUNNING', runId })
    }

    if (status === 'FAILED' || status === 'ABORTED') {
      return Response.json({ status: 'FAILED', error: 'A busca falhou. Tente outra keyword.' })
    }

    if (status === 'SUCCEEDED' && datasetId) {
      // Fetch results
      const itemsRes = await fetch(
        `https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_TOKEN}&limit=20`
      )
      const items = await itemsRes.json()

      const ads = (Array.isArray(items) ? items : []).map((raw: any, i: number) => {
        const snap = raw.snapshot || {}
        const cards = snap.cards || []
        // Extract images from cards
        const imageUrls = cards
          .map((c: any) => c.resized_image_url || c.original_image_url)
          .filter(Boolean)
        // Extract text
        const bodyText = typeof snap.body === 'object' ? snap.body?.text : snap.body
        const cardTitle = cards[0]?.title || null
        // Start time can be unix timestamp
        const startTime = snap.ad_delivery_start_time || raw.start_date
        const startedAt = startTime
          ? (typeof startTime === 'number' ? new Date(startTime * 1000).toISOString() : startTime)
          : null

        return {
          id: `search-${i}`,
          external_id: String(raw.ad_archive_id || raw.id || `ext-${i}`),
          platform: 'meta',
          ad_text: bodyText || null,
          headline: cardTitle || (bodyText ? bodyText.slice(0, 80) : null),
          cta_text: snap.cta_text || snap.cta_type || null,
          image_urls: imageUrls,
          video_url: null,
          landing_page_url: snap.link_url || null,
          format: cards.length > 1 ? 'carousel' : (imageUrls.length > 0 ? 'image' : 'text'),
          status: raw.is_active ? 'active' : 'inactive',
          started_at: startedAt,
          ended_at: null,
          page_name: raw.page_name || snap.page_name || 'Desconhecido',
        }
      })

      return Response.json({ status: 'SUCCEEDED', ads, total: ads.length })
    }

    return Response.json({ status, runId })
  } catch (error) {
    console.error('Search poll error:', error)
    return Response.json({ error: 'Erro ao verificar busca.' }, { status: 500 })
  }
}
