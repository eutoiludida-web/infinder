const APIFY_TOKEN = process.env.APIFY_API_TOKEN!
const ACTOR_ID = 'lexis-solutions~google-ads-scraper'

interface ApifyRunResponse {
  data: {
    id: string
    status: string
    defaultDatasetId: string
  }
}

interface GoogleAdRaw {
  id?: string
  advertiser_name?: string
  ad_type?: string
  headline?: string
  description?: string
  text?: string
  image_url?: string
  video_url?: string
  destination_url?: string
  first_shown?: string
  last_shown?: string
  format?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export interface NormalizedGoogleAd {
  external_id: string
  platform: 'google'
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
  raw_data: GoogleAdRaw
}

async function waitForRun(runId: string, timeoutMs = 300000): Promise<string> {
  const startTime = Date.now()

  while (Date.now() - startTime < timeoutMs) {
    const res = await fetch(
      `https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`
    )
    const data: ApifyRunResponse = await res.json()

    if (data.data.status === 'SUCCEEDED') {
      return data.data.defaultDatasetId
    }
    if (data.data.status === 'FAILED' || data.data.status === 'ABORTED') {
      throw new Error(`Apify run ${data.data.status}`)
    }

    await new Promise((resolve) => setTimeout(resolve, 5000))
  }

  throw new Error('Apify run timed out')
}

export async function scrapeGoogleAds(
  domain: string,
  limit = 50
): Promise<NormalizedGoogleAd[]> {
  const runRes = await fetch(
    `https://api.apify.com/v2/acts/${ACTOR_ID}/runs?token=${APIFY_TOKEN}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        domain,
        maxResults: limit,
      }),
    }
  )

  if (!runRes.ok) {
    throw new Error(`Apify start failed: ${runRes.status}`)
  }

  const runData: ApifyRunResponse = await runRes.json()
  const datasetId = await waitForRun(runData.data.id)

  const itemsRes = await fetch(
    `https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_TOKEN}`
  )
  const items: GoogleAdRaw[] = await itemsRes.json()

  return items.map(normalizeGoogleAd).filter((ad) => ad.external_id)
}

function normalizeGoogleAd(raw: GoogleAdRaw): NormalizedGoogleAd {
  const imageUrls = raw.image_url ? [raw.image_url] : []
  const hasVideo = !!raw.video_url

  return {
    external_id: raw.id || '',
    platform: 'google',
    ad_text: raw.description || raw.text || null,
    headline: raw.headline || null,
    cta_text: null,
    image_urls: imageUrls,
    video_url: raw.video_url || null,
    landing_page_url: raw.destination_url || null,
    format: hasVideo ? 'video' : imageUrls.length > 0 ? 'image' : 'text',
    status: raw.last_shown ? 'inactive' : 'active',
    started_at: raw.first_shown || null,
    ended_at: raw.last_shown || null,
    raw_data: raw,
  }
}
