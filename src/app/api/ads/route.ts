import { getSession } from '@/lib/auth'
import { createSupabaseServer } from '@/lib/supabase-server'

export async function GET(req: Request) {
  const user = await getSession()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const platform = searchParams.get('platform')
  const competitorId = searchParams.get('competitor_id')
  const format = searchParams.get('format')
  const status = searchParams.get('status')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const safePage = Math.max(1, page)
  const safeLimit = Math.min(Math.max(1, limit), 100)
  const offset = (safePage - 1) * safeLimit

  const supabase = await createSupabaseServer()

  let query = supabase
    .from('ads')
    .select('*, ad_analyses(*), competitors(name)', { count: 'exact' })
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + safeLimit - 1)

  if (platform) query = query.eq('platform', platform)
  if (competitorId) query = query.eq('competitor_id', competitorId)
  if (format) query = query.eq('format', format)
  if (status) query = query.eq('status', status)

  const { data, error, count } = await query

  if (error) return Response.json({ error: error.message }, { status: 500 })

  return Response.json({
    ads: data,
    total: count || 0,
    page: safePage,
    totalPages: Math.ceil((count || 0) / safeLimit),
  })
}
