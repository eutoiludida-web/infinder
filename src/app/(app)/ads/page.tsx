'use client'

import { useState, useEffect } from 'react'
import {
  Search,
  Filter,
  Megaphone,
  ExternalLink,
  TrendingUp,
  Calendar,
  Globe,
  Layers,
  Sparkles,
  X,
  Play,
  ChevronRight,
  ArrowUpRight,
  Loader2
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'

interface AdAnalysis {
  id: string
  hook_score?: number
  persuasion_score?: number
  copy_analysis?: string
  conversion_logic?: string
  overall_score?: number
  recommendations?: string
}

interface Ad {
  id: string
  headline: string | null
  ad_text: string | null
  platform: string | null
  status: string | null
  image_urls: string[] | null
  format: string | null
  created_at: string
  competitors: { name: string } | null
  ad_analyses: AdAnalysis[]
}

export default function Ads() {
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    fetchAds()
  }, [page])

  async function fetchAds() {
    setLoading(true)
    try {
      const res = await fetch(`/api/ads?page=${page}&limit=20`)
      if (res.ok) {
        const data = await res.json()
        setAds(data.ads || [])
        setTotal(data.total || 0)
        setTotalPages(data.totalPages || 1)
      }
    } catch (err) {
      console.error('Erro ao carregar anuncios:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleAnalyze(adId: string) {
    setAnalyzing(true)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId }),
      })

      if (res.ok) {
        const analysis = await res.json()
        // Update the ad in state with the new analysis
        setAds((prev) =>
          prev.map((ad) =>
            ad.id === adId
              ? { ...ad, ad_analyses: [...ad.ad_analyses, analysis] }
              : ad
          )
        )
        // Update selectedAd too
        setSelectedAd((prev) =>
          prev && prev.id === adId
            ? { ...prev, ad_analyses: [...prev.ad_analyses, analysis] }
            : prev
        )
      } else {
        const err = await res.json()
        alert(err.error || 'Erro ao analisar anuncio')
      }
    } catch (err) {
      console.error('Erro ao analisar:', err)
    } finally {
      setAnalyzing(false)
    }
  }

  const filteredAds = searchQuery
    ? ads.filter(
        (ad) =>
          (ad.headline || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (ad.ad_text || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (ad.competitors?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : ads

  function getAdThumbnail(ad: Ad): string {
    if (ad.image_urls && ad.image_urls.length > 0) return ad.image_urls[0]
    return `https://picsum.photos/seed/${ad.id}/400/400`
  }

  function getDaysRunning(createdAt: string): number {
    const created = new Date(createdAt)
    const now = new Date()
    return Math.max(1, Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)))
  }

  if (loading && ads.length === 0) {
    return (
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-accent" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Inteligencia de Anuncios</span>
            </div>
            <h1 className="text-5xl font-display font-bold text-ink uppercase tracking-tight">Anuncios de Concorrentes</h1>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-line border border-line">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-8 animate-pulse">
              <div className="aspect-[4/5] bg-black/5 mb-4" />
              <div className="h-4 bg-black/5 w-3/4 mb-2" />
              <div className="h-3 bg-black/5 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-accent" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Inteligencia de Anuncios</span>
          </div>
          <h1 className="text-5xl font-display font-bold text-ink uppercase tracking-tight">Anuncios de Concorrentes</h1>
          {total > 0 && (
            <p className="text-xs text-muted mt-2 font-bold uppercase tracking-widest">{total} anuncios encontrados</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Buscar biblioteca de anuncios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-line focus:outline-none focus:border-accent transition-colors text-xs font-bold uppercase tracking-widest"
            />
          </div>
          <button className="p-4 bg-white border border-line text-ink hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Ads Grid */}
      {filteredAds.length === 0 ? (
        <div className="border border-line bg-white p-20 text-center">
          <Megaphone className="w-10 h-10 text-muted mx-auto mb-4" />
          <p className="text-sm text-muted font-bold uppercase tracking-widest">Nenhum anuncio encontrado</p>
          <p className="text-xs text-muted mt-2">Execute o pipeline de scraping para coletar anuncios de concorrentes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border border-line bg-line gap-px">
          {filteredAds.map((ad) => {
            const days = getDaysRunning(ad.created_at)
            const hasAnalysis = ad.ad_analyses && ad.ad_analyses.length > 0
            const score = hasAnalysis ? ad.ad_analyses[0].overall_score ?? '--' : '--'

            return (
              <motion.div
                key={ad.id}
                onClick={() => setSelectedAd(ad)}
                className="bg-white group cursor-pointer relative overflow-hidden"
              >
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img
                    src={getAdThumbnail(ad)}
                    alt={ad.headline || 'Anuncio'}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-6 left-6 flex flex-col gap-2">
                    <div className={cn(
                      "px-3 py-1 text-[9px] font-bold uppercase tracking-widest",
                      ad.status === 'active' ? "bg-emerald-500 text-white" : "bg-slate-500 text-white"
                    )}>
                      {ad.status === 'active' ? 'Ativo' : ad.status || 'N/A'}
                    </div>
                    <div className="bg-white/90 backdrop-blur-md px-3 py-1 flex items-center gap-2 border border-line">
                      <Calendar className="w-3 h-3 text-accent" />
                      <span className="text-[9px] font-bold text-ink uppercase tracking-widest">{days} Dias</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 bg-white flex items-center justify-center">
                      <ArrowUpRight className="w-5 h-5 text-ink" />
                    </div>
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-display font-bold text-ink uppercase tracking-tight text-lg mb-1">
                        {ad.headline || 'Sem titulo'}
                      </h4>
                      <p className="text-[10px] font-bold text-muted uppercase tracking-widest">
                        {ad.competitors?.name || 'Concorrente'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-1">Score</p>
                      <p className="font-mono text-sm font-bold text-accent">{score}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-line">
                    {ad.platform && (
                      <span className="px-2 py-1 bg-slate-50 text-[8px] font-bold text-muted border border-line uppercase tracking-widest">
                        {ad.platform}
                      </span>
                    )}
                    {ad.format && (
                      <span className="px-2 py-1 bg-slate-50 text-[8px] font-bold text-muted border border-line uppercase tracking-widest">
                        {ad.format}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-6 py-3 border border-line text-[10px] font-bold uppercase tracking-widest disabled:opacity-30 hover:bg-slate-50 transition-all"
          >
            Anterior
          </button>
          <span className="text-xs font-bold text-muted uppercase tracking-widest">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-6 py-3 border border-line text-[10px] font-bold uppercase tracking-widest disabled:opacity-30 hover:bg-slate-50 transition-all"
          >
            Proximo
          </button>
        </div>
      )}

      {/* Ad Modal */}
      <AnimatePresence>
        {selectedAd && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAd(null)}
              className="absolute inset-0 bg-ink/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh]"
            >
              {/* Left Side: Visual Preview */}
              <div className="w-full md:w-[450px] bg-ink relative shrink-0 overflow-hidden">
                <img
                  src={getAdThumbnail(selectedAd)}
                  className="w-full h-full object-cover opacity-60 grayscale"
                  alt="Ad Preview"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 border border-white/20 rounded-full flex items-center justify-center group cursor-pointer hover:bg-white/10 transition-colors">
                    <Play className="w-8 h-8 text-white fill-current" />
                  </div>
                </div>
                {/* Hardware Overlay */}
                <div className="absolute top-8 left-8 right-8 flex justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                    <span className="font-mono text-[10px] text-white font-bold tracking-widest uppercase">REC</span>
                  </div>
                  <span className="font-mono text-[10px] text-white font-bold tracking-widest uppercase">
                    {selectedAd.format || 'VIDEO'}
                  </span>
                </div>
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1">Platform</p>
                      <p className="font-mono text-xs text-white font-bold">{selectedAd.platform || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1">Status</p>
                      <p className="font-mono text-xs text-white font-bold">{selectedAd.status || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Analysis */}
              <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-white">
                <div className="p-10 border-b border-line flex items-center justify-between sticky top-0 bg-white z-10">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-px w-6 bg-accent" />
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-accent">Analise Neural</span>
                    </div>
                    <h2 className="text-3xl font-display font-bold text-ink uppercase tracking-tight">
                      {selectedAd.headline || 'Sem titulo'}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedAd(null)}
                    className="w-12 h-12 border border-line flex items-center justify-center hover:bg-slate-50 transition-colors"
                  >
                    <X className="w-5 h-5 text-ink" />
                  </button>
                </div>

                <div className="p-10 space-y-12">
                  <div className="grid grid-cols-2 gap-px bg-line border border-line">
                    <div className="bg-white p-6">
                      <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-2">Plataforma</p>
                      <p className="text-sm font-bold text-ink uppercase tracking-tight">{selectedAd.platform || 'N/A'}</p>
                    </div>
                    <div className="bg-white p-6">
                      <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-2">Duracao Ativa</p>
                      <p className="text-sm font-bold text-ink uppercase tracking-tight">{getDaysRunning(selectedAd.created_at)} Dias Rodando</p>
                    </div>
                  </div>

                  {/* Show analysis if exists, otherwise show analyze button */}
                  {selectedAd.ad_analyses && selectedAd.ad_analyses.length > 0 ? (
                    <>
                      <div className="space-y-6">
                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-ink flex items-center gap-3">
                          <Sparkles className="w-4 h-4 text-accent" /> Inteligencia de Copywriting
                        </h4>
                        <div className="p-8 border border-line bg-slate-50 space-y-6">
                          {selectedAd.ad_text && (
                            <p className="text-sm text-ink font-light italic leading-relaxed">
                              &ldquo;{selectedAd.ad_text}&rdquo;
                            </p>
                          )}
                          {selectedAd.ad_analyses[0].copy_analysis && (
                            <div className="pt-6 border-t border-line">
                              <p className="text-[9px] font-bold text-accent uppercase tracking-widest mb-3">Analise de Copy</p>
                              <p className="text-xs text-muted leading-relaxed">
                                {selectedAd.ad_analyses[0].copy_analysis}
                              </p>
                            </div>
                          )}
                          {selectedAd.ad_analyses[0].conversion_logic && (
                            <div className="pt-6 border-t border-line">
                              <p className="text-[9px] font-bold text-accent uppercase tracking-widest mb-3">Logica de Conversao</p>
                              <p className="text-xs text-muted leading-relaxed">
                                {selectedAd.ad_analyses[0].conversion_logic}
                              </p>
                            </div>
                          )}
                          {selectedAd.ad_analyses[0].recommendations && (
                            <div className="pt-6 border-t border-line">
                              <p className="text-[9px] font-bold text-accent uppercase tracking-widest mb-3">Recomendacoes</p>
                              <p className="text-xs text-muted leading-relaxed">
                                {selectedAd.ad_analyses[0].recommendations}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-ink p-10 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 blur-3xl rounded-full" />
                        <div className="relative z-10">
                          <h4 className="text-[11px] font-bold uppercase tracking-widest text-accent mb-6 flex items-center gap-3">
                            <TrendingUp className="w-4 h-4" /> Pontuacao de Performance
                          </h4>
                          <div className="flex items-center gap-10">
                            <div className="text-7xl font-display font-bold text-white">
                              {selectedAd.ad_analyses[0].overall_score ?? '--'}
                            </div>
                            <div className="space-y-2">
                              {selectedAd.ad_analyses[0].hook_score !== undefined && (
                                <p className="text-xs text-white/60">Hook Score: {selectedAd.ad_analyses[0].hook_score}</p>
                              )}
                              {selectedAd.ad_analyses[0].persuasion_score !== undefined && (
                                <p className="text-xs text-white/60">Persuasion Score: {selectedAd.ad_analyses[0].persuasion_score}</p>
                              )}
                              <div className="flex items-center gap-2 text-emerald-400">
                                <ArrowUpRight className="w-4 h-4" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Alta Probabilidade de Retencao</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-6">
                      <h4 className="text-[11px] font-bold uppercase tracking-widest text-ink flex items-center gap-3">
                        <Sparkles className="w-4 h-4 text-accent" /> Inteligencia de Copywriting
                      </h4>
                      {selectedAd.ad_text && (
                        <div className="p-8 border border-line bg-slate-50">
                          <p className="text-sm text-ink font-light italic leading-relaxed">
                            &ldquo;{selectedAd.ad_text}&rdquo;
                          </p>
                        </div>
                      )}
                      <div className="p-8 border border-dashed border-line text-center space-y-4">
                        <p className="text-xs text-muted uppercase tracking-widest font-bold">
                          Este anuncio ainda nao foi analisado
                        </p>
                        <button
                          onClick={() => handleAnalyze(selectedAd.id)}
                          disabled={analyzing}
                          className={cn(
                            "px-8 py-4 bg-ink text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-accent transition-all inline-flex items-center gap-3",
                            analyzing && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          {analyzing ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Analisando...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" />
                              Analisar com IA
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-10 bg-slate-50 border-t border-line mt-auto">
                  <button className="w-full py-6 bg-ink text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-accent transition-all flex items-center justify-center gap-4 group">
                    Ver na Biblioteca de Anuncios <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:translate-y-[-1px] transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
