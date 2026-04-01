import { GoogleGenerativeAI } from '@google/generative-ai'
import { z } from 'zod/v4'

function getModel() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
}

const ANALYSIS_PROMPT = `Você é um analista sênior de performance de anúncios digitais.

Analise o anúncio fornecido e retorne APENAS um JSON válido (sem markdown, sem backticks):

{
  "hook": "o que chama atenção no anúncio nos primeiros segundos/impressão",
  "offer": "qual a oferta/proposta de valor apresentada",
  "cta_analysis": "análise do call-to-action usado e sua eficácia",
  "tone": "tom de voz do anúncio (urgente, casual, profissional, etc)",
  "target_audience": "público-alvo provável baseado na linguagem e oferta",
  "strengths": ["ponto forte 1", "ponto forte 2"],
  "weaknesses": ["ponto fraco 1", "ponto fraco 2"],
  "improvements": ["sugestão 1", "sugestão 2"],
  "score": 7
}

O score deve ser de 1 a 10 baseado na eficácia geral do anúncio.
Seja específico e acionável nas suas análises.`

export const AdAnalysisSchema = z.object({
  hook: z.string(),
  offer: z.string(),
  cta_analysis: z.string(),
  tone: z.string(),
  target_audience: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  improvements: z.array(z.string()),
  score: z.number().min(1).max(10),
})

export type AdAnalysisResult = z.infer<typeof AdAnalysisSchema>

export async function analyzeAd(adData: {
  ad_text: string | null
  headline: string | null
  cta_text: string | null
  image_urls: string[]
  platform: string
}): Promise<AdAnalysisResult> {
  const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = []

  // Build text context
  const textContext = [
    `Plataforma: ${adData.platform === 'meta' ? 'Meta (Facebook/Instagram)' : 'Google Ads'}`,
    adData.headline ? `Título: ${adData.headline}` : null,
    adData.ad_text ? `Texto do anúncio: ${adData.ad_text}` : null,
    adData.cta_text ? `CTA: ${adData.cta_text}` : null,
  ].filter(Boolean).join('\n')

  parts.push({ text: `${ANALYSIS_PROMPT}\n\n${textContext}` })

  // Add first image if available
  if (adData.image_urls.length > 0) {
    try {
      const imgRes = await fetch(adData.image_urls[0])
      if (imgRes.ok) {
        const buffer = await imgRes.arrayBuffer()
        const contentType = imgRes.headers.get('content-type') || 'image/jpeg'
        parts.push({
          inlineData: {
            mimeType: contentType,
            data: Buffer.from(buffer).toString('base64'),
          },
        })
      }
    } catch {
      // Continue without image
    }
  }

  const result = await getModel().generateContent(parts)
  const text = result.response.text()

  // Clean markdown fences if present
  const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()

  const parsed = AdAnalysisSchema.safeParse(JSON.parse(cleaned))
  if (!parsed.success) {
    throw new Error(`Invalid analysis response: ${parsed.error.message}`)
  }

  return parsed.data
}
