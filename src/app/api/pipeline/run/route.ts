export const maxDuration = 60

import { z } from 'zod/v4'
import { getSession } from '@/lib/auth'
import { runPipeline } from '@/lib/pipeline'

const RequestSchema = z.object({
  competitorId: z.string().uuid(),
})

export async function POST(req: Request) {
  const user = await getSession()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = RequestSchema.safeParse(await req.json())
  if (!body.success) return Response.json({ error: body.error }, { status: 400 })

  try {
    const result = await runPipeline(user.id, body.data.competitorId)
    return Response.json(result)
  } catch (error) {
    console.error('Pipeline error:', error)
    return Response.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
