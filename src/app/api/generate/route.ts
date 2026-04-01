import { z } from 'zod/v4'
import { getSession } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase'

const RequestSchema = z.object({
  adId: z.string().uuid(),
  brandId: z.string().uuid(),
})

export async function POST(req: Request) {
  const user = await getSession()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = RequestSchema.safeParse(await req.json())
  if (!body.success) return Response.json({ error: body.error }, { status: 400 })

  const supabaseAdmin = getSupabaseAdmin()

  // Get the ad analysis
  const { data: analysis } = await supabaseAdmin
    .from('ad_analyses')
    .select('*')
    .eq('ad_id', body.data.adId)
    .single()

  // Get the brand
  const { data: brand } = await supabaseAdmin
    .from('brands')
    .select('*')
    .eq('id', body.data.brandId)
    .eq('user_id', user.id)
    .single()

  if (!analysis || !brand) {
    return Response.json({ error: 'Analise ou marca nao encontrada' }, { status: 404 })
  }

  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai')
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompt = `Voce e um diretor criativo de marketing digital brasileiro.

Contexto da marca:
- Nome: ${brand.name}
- Nicho: ${brand.niche || 'Nao especificado'}
- Tom de voz: ${brand.tone_of_voice || 'Profissional'}
- Publico-alvo: ${brand.target_audience || 'Publico geral'}

Analise de um anuncio de concorrente que funciona bem (score ${analysis.score}/10):
- Hook: ${analysis.hook}
- Oferta: ${analysis.offer}
- CTA: ${analysis.cta_analysis}
- Tom: ${analysis.tone}
- Publico: ${analysis.target_audience}
- Pontos fortes: ${JSON.stringify(analysis.strengths)}

Baseado nessa referencia, gere 3 conceitos de anuncio adaptados para a marca acima.

Retorne APENAS JSON valido (sem markdown):
[
  {
    "title": "Nome do conceito",
    "hook": "Gancho dos primeiros 3 segundos",
    "headline": "Titulo do anuncio",
    "text": "Texto completo do anuncio",
    "cta": "Call to action",
    "captionIg": "Legenda para Instagram com emojis",
    "captionTt": "Legenda para TikTok",
    "hashtags": ["hashtag1", "hashtag2", "..."]
  }
]`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()
    const cleaned = responseText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()

    try {
      const concepts = JSON.parse(cleaned)
      return Response.json({ concepts })
    } catch {
      return Response.json({ error: 'Erro ao gerar conceitos' }, { status: 500 })
    }
  } catch (error) {
    console.error('Generate error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Erro interno' },
      { status: 500 }
    )
  }
}
