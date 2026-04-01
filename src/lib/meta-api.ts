const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN
const GRAPH_API_URL = 'https://graph.facebook.com/v23.0/ads_archive'

interface MetaApiAd {
  id: string
  ad_creative_bodies?: string[]
  ad_creative_link_titles?: string[]
  ad_delivery_start_time?: string
  ad_delivery_stop_time?: string
  page_name?: string
  publisher_platforms?: string[]
  ad_snapshot_url?: string
}

interface MetaApiResponse {
  data: MetaApiAd[]
  paging?: {
    cursors: { after: string }
    next: string
  }
}

export async function searchMetaAdLibrary(
  searchTerms: string,
  options: {
    country?: string
    limit?: number
    pageIds?: string[]
  } = {}
): Promise<MetaApiAd[]> {
  if (!META_ACCESS_TOKEN) {
    return [] // Fallback: use Apify only
  }

  const params = new URLSearchParams({
    access_token: META_ACCESS_TOKEN,
    ad_reached_countries: `["${options.country || 'BR'}"]`,
    ad_type: 'ALL',
    search_terms: searchTerms,
    fields: 'id,ad_creative_bodies,ad_creative_link_titles,ad_delivery_start_time,ad_delivery_stop_time,page_name,publisher_platforms,ad_snapshot_url',
    limit: String(options.limit || 50),
  })

  if (options.pageIds?.length) {
    params.set('search_page_ids', JSON.stringify(options.pageIds))
  }

  const res = await fetch(`${GRAPH_API_URL}?${params}`)
  if (!res.ok) {
    console.error('Meta Ad Library API error:', res.status)
    return []
  }

  const data: MetaApiResponse = await res.json()
  return data.data || []
}
