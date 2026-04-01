import { z } from 'zod/v4'
import { getSession } from '@/lib/auth'
import { createSupabaseServer } from '@/lib/supabase-server'

const UpdateBrandSchema = z.object({
  name: z.string().min(1).optional(),
  niche: z.string().optional(),
  tone_of_voice: z.string().optional(),
  target_audience: z.string().optional(),
})

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = UpdateBrandSchema.safeParse(await req.json())
  if (!body.success) return Response.json({ error: body.error }, { status: 400 })

  const supabase = await createSupabaseServer()
  const { data, error } = await supabase
    .from('brands')
    .update(body.data)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const supabase = await createSupabaseServer()
  const { error } = await supabase
    .from('brands')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ deleted: true })
}
