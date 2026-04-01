'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  X, ChevronLeft, ChevronRight, Sparkles, Loader2,
  Globe, Image, Video, Type, Layout,
} from 'lucide-react'
import type { AdWithAnalysis, Competitor, AdAnalysis } from '@/types'

interface AdsClientProps {
  ads: AdWithAnalysis[]
  competitors: Pick<Competitor, 'id' | 'name'>[]
  totalPages: number
  currentPage: number
  filters: {
    platform: string
    competitor_id: string
    format: string
    status: string
  }
}

export function AdsClient({
  ads,
  competitors,
  totalPages,
  currentPage,
  filters,
}: AdsClientProps) {
  const [selectedAd, setSelectedAd] = useState<AdWithAnalysis | null>(null)
  const [analyzing, setAnalyzing] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.set('page', '1')
    router.push(`/ads?${params.toString()}`)
  }

  function changePage(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    router.push(`/ads?${params.toString()}`)
  }

  async function handleAnalyze(adId: string) {
    setAnalyzing(adId)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId }),
      })

      if (res.ok) {
        router.refresh()
      } else {
        const data = await res.json()
        alert(data.error || 'Erro ao analisar')
      }
    } finally {
      setAnalyzing(null)
    }
  }

  const formatIcons: Record<string, typeof Image> = {
    image: Image,
    video: Video,
    text: Type,
    carousel: Layout,
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={filters.platform}
          onChange={(e) => updateFilter('platform', e.target.value)}
          className="rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="">Todas plataformas</option>
          <option value="meta">Meta Ads</option>
          <option value="google">Google Ads</option>
        </select>

        <select
          value={filters.competitor_id}
          onChange={(e) => updateFilter('competitor_id', e.target.value)}
          className="rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="">Todos concorrentes</option>
          {competitors.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          value={filters.format}
          onChange={(e) => updateFilter('format', e.target.value)}
          className="rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="">Todos formatos</option>
          <option value="image">Imagem</option>
          <option value="video">Vídeo</option>
          <option value="carousel">Carrossel</option>
          <option value="text">Texto</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => updateFilter('status', e.target.value)}
          className="rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="">Todos status</option>
          <option value="active">Ativo</option>
          <option value="inactive">Inativo</option>
        </select>
      </div>

      {/* Ads Grid */}
      {ads.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">Nenhum ad encontrado</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {ads.map((ad) => {
            const FormatIcon = formatIcons[ad.format || 'text'] || Type
            const analysis = ad.ad_analyses?.[0]

            return (
              <div
                key={ad.id}
                onClick={() => setSelectedAd(ad)}
                className="cursor-pointer rounded-lg border bg-card hover:border-primary/50 transition-colors overflow-hidden"
              >
                {/* Thumbnail */}
                {ad.image_urls?.[0] ? (
                  <img
                    src={ad.image_urls[0]}
                    alt=""
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <div className="w-full h-40 bg-muted flex items-center justify-center">
                    <FormatIcon className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                )}

                <div className="p-3 space-y-2">
                  {/* Platform + Competitor */}
                  <div className="flex items-center gap-2">
                    {ad.platform === 'meta' ? (
                      <span className="text-xs font-bold text-blue-600">M</span>
                    ) : (
                      <Globe className="h-3.5 w-3.5 text-green-600" />
                    )}
                    <span className="text-xs text-muted-foreground truncate">
                      {ad.competitors?.name}
                    </span>
                    {analysis && (
                      <span className="ml-auto text-xs font-bold text-primary">
                        {analysis.score}/10
                      </span>
                    )}
                  </div>

                  {/* Headline */}
                  <p className="text-sm font-medium line-clamp-2">
                    {ad.headline || ad.ad_text || 'Sem texto'}
                  </p>

                  {/* Status + Format */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded ${
                        ad.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {ad.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                    {ad.format && (
                      <span className="text-xs text-muted-foreground capitalize">
                        {ad.format}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="rounded-md border p-2 hover:bg-accent disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm">
            {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="rounded-md border p-2 hover:bg-accent disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Ad Detail Modal */}
      {selectedAd && (
        <AdDetailModal
          ad={selectedAd}
          analyzing={analyzing === selectedAd.id}
          onAnalyze={() => handleAnalyze(selectedAd.id)}
          onClose={() => setSelectedAd(null)}
        />
      )}
    </div>
  )
}

function AdDetailModal({
  ad,
  analyzing,
  onAnalyze,
  onClose,
}: {
  ad: AdWithAnalysis
  analyzing: boolean
  onAnalyze: () => void
  onClose: () => void
}) {
  const analysis = ad.ad_analyses?.[0] as AdAnalysis | undefined

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-background border shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded p-1 hover:bg-accent z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Ad Image */}
        {ad.image_urls?.[0] && (
          <img
            src={ad.image_urls[0]}
            alt=""
            className="w-full max-h-80 object-cover"
          />
        )}

        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium rounded bg-muted px-2 py-1">
                {ad.platform === 'meta' ? 'Meta Ads' : 'Google Ads'}
              </span>
              <span className="text-xs text-muted-foreground">
                {ad.competitors?.name}
              </span>
              <span
                className={`text-xs px-1.5 py-0.5 rounded ${
                  ad.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {ad.status === 'active' ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            {ad.headline && (
              <h2 className="text-xl font-bold">{ad.headline}</h2>
            )}
            {ad.ad_text && (
              <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
                {ad.ad_text}
              </p>
            )}
            {ad.cta_text && (
              <p className="mt-2 text-sm">
                <span className="font-medium">CTA:</span> {ad.cta_text}
              </p>
            )}
            {ad.started_at && (
              <p className="mt-1 text-xs text-muted-foreground">
                Ativo desde {new Date(ad.started_at).toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>

          {/* Analysis */}
          {analysis ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Análise IA</h3>
                <span className="ml-auto text-2xl font-bold text-primary">
                  {analysis.score}/10
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {analysis.hook && (
                  <div className="rounded-md bg-muted/50 p-3">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Hook</p>
                    <p className="text-sm">{analysis.hook}</p>
                  </div>
                )}
                {analysis.offer && (
                  <div className="rounded-md bg-muted/50 p-3">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Oferta</p>
                    <p className="text-sm">{analysis.offer}</p>
                  </div>
                )}
                {analysis.tone && (
                  <div className="rounded-md bg-muted/50 p-3">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Tom</p>
                    <p className="text-sm">{analysis.tone}</p>
                  </div>
                )}
                {analysis.target_audience && (
                  <div className="rounded-md bg-muted/50 p-3">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Público-alvo</p>
                    <p className="text-sm">{analysis.target_audience}</p>
                  </div>
                )}
              </div>

              {analysis.cta_analysis && (
                <div className="rounded-md bg-muted/50 p-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Análise do CTA</p>
                  <p className="text-sm">{analysis.cta_analysis}</p>
                </div>
              )}

              {analysis.strengths && analysis.strengths.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-green-700 mb-1">Pontos fortes</p>
                  <ul className="space-y-1">
                    {analysis.strengths.map((s, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">+</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.weaknesses && analysis.weaknesses.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-red-700 mb-1">Pontos fracos</p>
                  <ul className="space-y-1">
                    {analysis.weaknesses.map((w, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-red-600 mt-0.5">-</span> {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.improvements && analysis.improvements.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-blue-700 mb-1">Sugestões</p>
                  <ul className="space-y-1">
                    {analysis.improvements.map((imp, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">*</span> {imp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <Sparkles className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground mb-3">
                Este ad ainda não foi analisado pela IA
              </p>
              <button
                onClick={onAnalyze}
                disabled={analyzing}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Analisar com IA
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
