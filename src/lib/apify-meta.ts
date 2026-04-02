const APIFY_TOKEN = process.env.APIFY_API_TOKEN!
const ACTOR_ID = 'curious_coder~facebook-ads-library-scraper'

interface ApifyRunResponse {
  data: {
    id: string
    status: string
    defaultDatasetId: string
  }
}

interface MetaAdRaw {
  id?: string
  ad_id?: string
  page_name?: string
  ad_creative_bodies?: string[]
  ad_creative_link_titles?: string[]
  ad_creative_link_captions?: string[]
  ad_creative_link_descriptions?: string[]
  ad_delivery_start_time?: string
  ad_delivery_stop_time?: string
  publisher_platforms?: string[]
  ad_snapshot_url?: string
  images?: Array<{ url: string }>
  videos?: Array<{ url: string }>
  cta_text?: string
  cta_type?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export interface NormalizedMetaAd {
  external_id: string
  platform: 'meta'
  ad_text: string | null
  headline: string | null
  cta_text: string | null
  image_urls: string[]
  video_url: string | null
  landing_page_url: string | null
  format: 'image' | 'video' | 'carousel' | 'text'
  status: string
  started_at: string | null
  ended_at: string | null
  raw_data: MetaAdRaw
}

async function waitForRun(runId: string, timeoutMs = 50000): Promise<string> {
  const startTime = Date.now()

  while (Date.now() - startTime < timeoutMs) {
    const res = await fetch(
      `https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`
    )
    if (!res.ok) throw new Error(`Apify polling failed: ${res.status}`)
    const data: ApifyRunResponse = await res.json()

    if (data.data.status === 'SUCCEEDED') {
      return data.data.defaultDatasetId
    }
    if (data.data.status === 'FAILED' || data.data.status === 'ABORTED') {
      throw new Error(`Scraping falhou: ${data.data.status}`)
    }

    await new Promise((resolve) => setTimeout(resolve, 3000))
  }

  throw new Error('Busca demorou demais. Tente novamente com uma keyword mais específica.')
}

export async function scrapeMetaAds(
  keyword: string,
  limit = 10
): Promise<NormalizedMetaAd[]> {
  // Build Meta Ad Library URL with keyword search
  const adLibraryUrl = `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&q=${encodeURIComponent(keyword)}`

  const runRes = await fetch(
    `https://api.apify.com/v2/acts/${ACTOR_ID}/runs?token=${APIFY_TOKEN}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        urls: [{ url: adLibraryUrl }],
        maxAds: Math.min(limit, 10),
      }),
    }
  )

  if (!runRes.ok) {
    const errBody = await runRes.text()
    console.error('Apify start error:', errBody)
    throw new Error(`Apify start failed: ${runRes.status}`)
  }

  const runData: ApifyRunResponse = await runRes.json()

  // Check for immediate errors
  if (!runData.data?.id) {
    throw new Error('Apify did not return a run ID')
  }

  const datasetId = await waitForRun(runData.data.id)

  // Fetch results
  const itemsRes = await fetch(
    `https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_TOKEN}`
  )
  const items: MetaAdRaw[] = await itemsRes.json()

  return items.map(normalizeMetaAd).filter((ad) => ad.external_id)
}

function normalizeMetaAd(raw: MetaAdRaw): NormalizedMetaAd {
  const images: string[] = []
  if (raw.images) {
    images.push(...raw.images.map((img) => img.url).filter(Boolean))
  }

  const videoUrl = raw.videos?.[0]?.url || null
  const hasVideo = !!videoUrl
  const hasMultipleImages = images.length > 1

  const adText = raw.ad_creative_bodies?.join('\n') || null
  const headline = raw.ad_creative_link_titles?.join(' | ') || null

  return {
    external_id: raw.id || raw.ad_id || '',
    platform: 'meta',
    ad_text: adText,
    headline,
    cta_text: raw.cta_text || raw.cta_type || null,
    image_urls: images,
    video_url: videoUrl,
    landing_page_url: raw.ad_snapshot_url || null,
    format: hasVideo ? 'video' : hasMultipleImages ? 'carousel' : images.length > 0 ? 'image' : 'text',
    status: raw.ad_delivery_stop_time ? 'inactive' : 'active',
    started_at: raw.ad_delivery_start_time || null,
    ended_at: raw.ad_delivery_stop_time || null,
    raw_data: raw,
  }
}
