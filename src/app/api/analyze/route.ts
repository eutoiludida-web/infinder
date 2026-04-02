export const maxDuration = 60

import { z } from 'zod/v4'
import { getSession } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase'
import { analyzeAd } from '@/lib/gemini'
import { checkUsageLimits, incrementUsage } from '@/lib/usage'
import type { Ad } from '@/types'

const RequestSchema = z.object({
  adId: z.string().uuid(),
})

export async function POST(req: Request) {
  const user = await getSession()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = RequestSchema.safeParse(await req.json())
  if (!body.success) return Response.json({ error: body.error }, { status: 400 })

  const canAnalyze = await checkUsageLimits(user.id, 'ai_analyses')
  if (!canAnalyze) {
    return Response.json({ error: 'Limite de análises atingido' }, { status: 429 })
  }

  try {
    const supabaseAdmin = getSupabaseAdmin()

    const { data: adData } = await supabaseAdmin
      .from('ads')
      .select('*')
      .eq('id', body.data.adId)
      .eq('user_id', user.id)
      .single()

    const ad = adData as Ad | null
    if (!ad) {
      return Response.json({ error: 'Ad não encontrado' }, { status: 404 })
    }

    // Check if already analyzed
    const { data: existing } = await supabaseAdmin
      .from('ad_analyses')
      .select('id')
      .eq('ad_id', ad.id)
      .single()

    if (existing) {
      return Response.json({ error: 'Ad já foi analisado' }, { status: 409 })
    }

    const analysis = await analyzeAd({
      ad_text: ad.ad_text,
      headline: ad.headline,
      cta_text: ad.cta_text,
      image_urls: ad.image_urls || [],
      platform: ad.platform,
    })

    const { data: saved, error: saveError } = await supabaseAdmin
      .from('ad_analyses')
      .insert({
        ad_id: ad.id,
        user_id: user.id,
        ...analysis,
        raw_response: analysis,
      })
      .select()
      .single()

    if (saveError) throw saveError

    await incrementUsage(user.id, 'ai_analyses')

    return Response.json(saved)
  } catch (error) {
    console.error('Analysis error:', error)
    return Response.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
