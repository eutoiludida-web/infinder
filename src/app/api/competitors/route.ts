import { z } from 'zod/v4'
import { getSession } from '@/lib/auth'
import { createSupabaseServer } from '@/lib/supabase-server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { PLAN_LIMITS } from '@/types/plans'
import type { User } from '@/types'

const CreateCompetitorSchema = z.object({
  name: z.string().min(1),
  meta_page_id: z.string().optional(),
  google_domain: z.string().optional(),
})

export async function GET() {
  const user = await getSession()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = await createSupabaseServer()
  const { data, error } = await supabase
    .from('competitors')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function POST(req: Request) {
  const user = await getSession()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = CreateCompetitorSchema.safeParse(await req.json())
  if (!body.success) return Response.json({ error: body.error }, { status: 400 })

  if (!body.data.meta_page_id && !body.data.google_domain) {
    return Response.json(
      { error: 'Informe pelo menos um: Meta Page ID ou Google Domain' },
      { status: 400 }
    )
  }

  const supabaseAdmin = getSupabaseAdmin()

  // Check competitor limit
  const { data: userData } = await supabaseAdmin
    .from('users')
    .select('plan')
    .eq('id', user.id)
    .single()

  const plan = (userData as User | null)?.plan || 'free'
  const limit = PLAN_LIMITS[plan].competitors

  const { count } = await supabaseAdmin
    .from('competitors')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  if ((count || 0) >= limit) {
    return Response.json(
      { error: `Limite de ${limit} concorrentes atingido no plano ${plan}` },
      { status: 429 }
    )
  }

  const supabase = await createSupabaseServer()
  const { data, error } = await supabase
    .from('competitors')
    .insert({
      user_id: user.id,
      name: body.data.name,
      meta_page_id: body.data.meta_page_id || null,
      google_domain: body.data.google_domain || null,
    })
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data, { status: 201 })
}
