import { z } from 'zod/v4'
import { getSession } from '@/lib/auth'
import { createSupabaseServer } from '@/lib/supabase-server'

const CreateBrandSchema = z.object({
  name: z.string().min(1),
  niche: z.string().optional(),
  tone_of_voice: z.string().optional(),
  target_audience: z.string().optional(),
})

export async function GET() {
  const user = await getSession()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = await createSupabaseServer()
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function POST(req: Request) {
  const user = await getSession()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = CreateBrandSchema.safeParse(await req.json())
  if (!body.success) return Response.json({ error: body.error }, { status: 400 })

  const supabase = await createSupabaseServer()
  const { data, error } = await supabase
    .from('brands')
    .insert({
      user_id: user.id,
      ...body.data,
    })
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data, { status: 201 })
}
