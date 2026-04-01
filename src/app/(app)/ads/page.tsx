'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { AdCard } from '@/components/ui/AdCard'
import type { Ad } from '@/types/frontend'
import {
  Filter,
  Search as SearchIcon,
  ChevronDown,
  Sparkles,
  X,
  Loader2,
  AlertCircle,
  ExternalLink,
  Eye,
  Target,
  Zap,
  ShieldCheck,
  ShieldAlert,
  Lightbulb,
  MessageSquare,
} from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'

interface RawAd {
  id: string
  headline: string | null
  ad_text: string | null
  platform: string
  status: string
  image_urls: string[] | null
  format: string | null
  created_at: string
  started_at: string | null
  ended_at: string | null
  cta_text: string | null
  external_id: string | null
  landing_page_url: string | null
  competitors: { name: string } | null
  ad_analyses: Array<{
    id: string
    score: number | null
    hook: string | null
    offer: string | null
    cta_analysis: string | null
    tone: string | null
    target_audience: string | null
    strengths: string[] | null
    weaknesses: string[] | null
    improvements: string[] | null
  }>
}

function mapRawAdToAd(raw: RawAd): Ad & { rawAnalysis?: RawAd['ad_analyses'][0] } {
  const now = new Date()
  const startDate = raw.started_at || raw.created_at
  const daysActive = Math.floor(
    (now.getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
  )
  const createdDaysAgo = Math.floor(
    (now.getTime() - new Date(raw.created_at).getTime()) / (1000 * 60 * 60 * 24)
  )
  const analysis = raw.ad_analyses?.[0]

  return {
    id: raw.id,
    externalId: raw.external_id || raw.id,
    platform: (raw.platform === 'google' ? 'google' : 'meta') as Ad['platform'],
    competitorId: '',
    competitorName: raw.competitors?.name || 'Desconhecido',
    thumbnailUrl:
      raw.image_urls?.[0] ||
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=400&h=500',
    headline: raw.headline || 'Sem titulo',
    text: raw.ad_text || '',
    ctaText: raw.cta_text || '',
    landingPageUrl: raw.landing_page_url || '',
    status: raw.status === 'active' ? 'active' : 'inactive',
    startDate,
    daysActive,
    score: analysis?.score ?? undefined,
    isWinner: daysActive > 30 && raw.status === 'active',
    isNew: createdDaysAgo <= 3,
    rawAnalysis: analysis,
  }
}

function SkeletonCard() {
  return (
    <div className="glass-dark rounded-2xl overflow-hidden border border-border-subtle animate-pulse">
      <div className="aspect-[4/5] bg-surface" />
      <div className="p-5 space-y-3">
        <div className="flex justify-between">
          <div className="h-3 w-20 bg-surface rounded" />
          <div className="h-3 w-16 bg-surface rounded" />
        </div>
        <div className="h-4 w-3/4 bg-surface rounded" />
        <div className="h-3 w-full bg-surface rounded" />
      </div>
    </div>
  )
}

export default function AdsIntelligence() {
  const [activeTab, setActiveTab] = useState('todos')
  const [search, setSearch] = useState('')
  const [ads, setAds] = useState<(Ad & { rawAnalysis?: RawAd['ad_analyses'][0] })[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Modal state
  const [selectedAd, setSelectedAd] = useState<
    (Ad & { rawAnalysis?: RawAd['ad_analyses'][0] }) | null
  >(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzeError, setAnalyzeError] = useState<string | null>(null)

  const fetchAds = useCallback(async (p: number) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/ads?page=${p}&limit=20`)
      if (!res.ok) throw new Error('Erro ao carregar ads')
      const data = await res.json()
      const mapped = (data.ads as RawAd[]).map(mapRawAdToAd)
      setAds(mapped)
      setTotal(data.total)
      setPage(data.page)
      setTotalPages(data.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAds(1)
  }, [fetchAds])

  const filteredAds = useMemo(() => {
    let result = ads

    // Tab filter
    if (activeTab === 'meta') result = result.filter((a) => a.platform === 'meta')
    else if (activeTab === 'google') result = result.filter((a) => a.platform === 'google')
    else if (activeTab === 'winners') result = result.filter((a) => a.isWinner)

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (a) =>
          a.headline.toLowerCase().includes(q) || a.text.toLowerCase().includes(q)
      )
    }
    return result
  }, [ads, activeTab, search])

  const tabCounts = useMemo(
    () => ({
      todos: ads.length,
      meta: ads.filter((a) => a.platform === 'meta').length,
      google: ads.filter((a) => a.platform === 'google').length,
      winners: ads.filter((a) => a.isWinner).length,
    }),
    [ads]
  )

  const tabs = [
    { id: 'todos', label: 'Todos', count: tabCounts.todos },
    { id: 'meta', label: 'Meta Ads', count: tabCounts.meta },
    { id: 'google', label: 'Google Ads', count: tabCounts.google },
    { id: 'winners', label: 'Winners', count: tabCounts.winners },
  ]

  const handleAnalyze = async (adId: string) => {
    setAnalyzing(true)
    setAnalyzeError(null)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erro ao analisar')
      }
      // Refresh data
      await fetchAds(page)
      setSelectedAd(null)
    } catch (err) {
      setAnalyzeError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setAnalyzing(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return
    fetchAds(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const analyzedCount = ads.filter((a) => a.rawAnalysis).length

  return (
    <div className="space-y-10">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black text-text-primary tracking-tight">
            Ads Intelligence
          </h1>
          <p className="text-text-secondary mt-2 font-medium">
            {total} ads monitorados - {analyzedCount} analisados com IA
          </p>
        </div>
        <button className="w-full sm:w-auto bg-accent hover:bg-accent-hover text-white px-8 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-glow transition-all hover:scale-[1.02] active:scale-[0.98]">
          <Sparkles size={20} />
          Analise em Massa
        </button>
      </header>

      {/* Filters Bar */}
      <div className="glass p-5 rounded-2xl flex flex-col lg:flex-row gap-5 items-stretch lg:items-center">
        <div className="relative flex-1 group">
          <SearchIcon
            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar no texto do ad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface border border-border rounded-xl py-3 pl-12 pr-5 text-sm font-medium focus:outline-none focus:border-accent/30 focus:bg-surface-hover transition-all placeholder:text-text-muted"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          {['Concorrente', 'Status', 'Periodo'].map((filter) => (
            <button
              key={filter}
              className="flex-1 sm:flex-none px-5 py-3 bg-surface border border-border rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-between sm:justify-start gap-3 hover:bg-surface-hover hover:border-accent/30 transition-all"
            >
              {filter} <ChevronDown size={16} className="text-text-muted" />
            </button>
          ))}
          <button className="p-3 bg-surface border border-border rounded-xl text-text-secondary hover:text-accent hover:bg-surface-hover transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-6 md:gap-10 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'pb-5 text-sm font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap',
              activeTab === tab.id
                ? 'text-accent'
                : 'text-text-secondary hover:text-text-primary'
            )}
          >
            {tab.label}
            <span
              className={cn(
                'ml-3 text-[10px] px-2 py-0.5 rounded-full border transition-all',
                activeTab === tab.id
                  ? 'bg-accent/10 border-accent/20 text-accent'
                  : 'bg-surface border-border text-text-muted'
              )}
            >
              {tab.count}
            </span>
            {activeTab === tab.id && (
              <motion.span
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-accent rounded-full shadow-[0_0_10px_rgba(124,108,240,0.5)]"
              />
            )}
          </button>
        ))}
      </div>

      {/* Error State */}
      {error && (
        <div className="glass p-8 rounded-2xl flex flex-col items-center justify-center gap-4 text-center">
          <AlertCircle size={40} className="text-red-400" />
          <p className="text-text-secondary font-medium">{error}</p>
          <button
            onClick={() => fetchAds(page)}
            className="px-6 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-xl text-sm font-bold transition-all"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredAds.length === 0 && (
        <div className="glass p-16 rounded-2xl flex flex-col items-center justify-center gap-4 text-center">
          <Sparkles size={40} className="text-text-muted" />
          <h3 className="text-lg font-display font-bold text-text-primary">
            Nenhum ad encontrado
          </h3>
          <p className="text-text-secondary font-medium max-w-md">
            Rode o pipeline em um concorrente para comecar.
          </p>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && filteredAds.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAds.map((ad) => (
            <AdCard key={ad.id} ad={ad} onClick={() => setSelectedAd(ad)} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-3 mt-16 pb-12">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            className="px-6 py-3 rounded-xl bg-surface border border-border text-sm font-bold text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-all disabled:opacity-30"
          >
            Anterior
          </button>
          <div className="flex gap-3">
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              let pageNum: number
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (page <= 3) {
                pageNum = i + 1
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = page - 2 + i
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={cn(
                    'w-12 h-12 rounded-xl text-sm font-bold transition-all',
                    pageNum === page
                      ? 'bg-accent text-white font-black shadow-glow'
                      : 'bg-surface border border-border text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                  )}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
            className="px-6 py-3 rounded-xl bg-surface border border-border text-sm font-bold text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-all disabled:opacity-30"
          >
            Proximo
          </button>
        </div>
      )}

      {/* Ad Detail Modal */}
      <AnimatePresence>
        {selectedAd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedAd(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="glass-dark border border-border-subtle rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-premium"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative">
                {selectedAd.thumbnailUrl && (
                  <div className="h-56 overflow-hidden rounded-t-2xl">
                    <img
                      src={selectedAd.thumbnailUrl}
                      alt={selectedAd.headline}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/40 to-transparent" />
                  </div>
                )}
                <button
                  onClick={() => setSelectedAd(null)}
                  className="absolute top-4 right-4 p-2 rounded-xl bg-bg-primary/60 backdrop-blur-xl border border-border text-text-secondary hover:text-text-primary transition-all"
                >
                  <X size={18} />
                </button>
                <div className="absolute bottom-4 left-6 right-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={cn(
                        'px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest',
                        selectedAd.platform === 'meta'
                          ? 'bg-accent/20 text-accent'
                          : 'bg-blue-500/20 text-blue-400'
                      )}
                    >
                      {selectedAd.platform === 'meta' ? 'Meta Ads' : 'Google Ads'}
                    </span>
                    <span
                      className={cn(
                        'px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest',
                        selectedAd.status === 'active'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      )}
                    >
                      {selectedAd.status}
                    </span>
                    {selectedAd.score != null && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-yellow-500/20 text-yellow-400">
                        Score: {selectedAd.score}/10
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-display font-black text-text-primary">
                    {selectedAd.headline}
                  </h2>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass p-4 rounded-xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">
                      Concorrente
                    </p>
                    <p className="text-sm font-bold text-text-primary">
                      {selectedAd.competitorName}
                    </p>
                  </div>
                  <div className="glass p-4 rounded-xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">
                      Dias Ativo
                    </p>
                    <p className="text-sm font-bold text-text-primary">
                      {selectedAd.daysActive} dias
                    </p>
                  </div>
                </div>

                {selectedAd.text && (
                  <div className="glass p-4 rounded-xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">
                      Texto do Ad
                    </p>
                    <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                      {selectedAd.text}
                    </p>
                  </div>
                )}

                {selectedAd.ctaText && (
                  <div className="glass p-4 rounded-xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">
                      CTA
                    </p>
                    <p className="text-sm font-bold text-accent">{selectedAd.ctaText}</p>
                  </div>
                )}

                {selectedAd.landingPageUrl && (
                  <a
                    href={selectedAd.landingPageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-accent hover:underline font-medium"
                  >
                    <ExternalLink size={14} /> Ver landing page
                  </a>
                )}

                {/* Analysis Section */}
                {selectedAd.rawAnalysis ? (
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-accent flex items-center gap-2">
                      <Sparkles size={14} /> Analise com IA
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedAd.rawAnalysis.hook && (
                        <div className="glass p-4 rounded-xl">
                          <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1 flex items-center gap-1.5">
                            <Eye size={10} /> Hook
                          </p>
                          <p className="text-sm text-text-secondary">
                            {selectedAd.rawAnalysis.hook}
                          </p>
                        </div>
                      )}
                      {selectedAd.rawAnalysis.offer && (
                        <div className="glass p-4 rounded-xl">
                          <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1 flex items-center gap-1.5">
                            <Zap size={10} /> Oferta
                          </p>
                          <p className="text-sm text-text-secondary">
                            {selectedAd.rawAnalysis.offer}
                          </p>
                        </div>
                      )}
                      {selectedAd.rawAnalysis.cta_analysis && (
                        <div className="glass p-4 rounded-xl">
                          <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1 flex items-center gap-1.5">
                            <Target size={10} /> CTA
                          </p>
                          <p className="text-sm text-text-secondary">
                            {selectedAd.rawAnalysis.cta_analysis}
                          </p>
                        </div>
                      )}
                      {selectedAd.rawAnalysis.tone && (
                        <div className="glass p-4 rounded-xl">
                          <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1 flex items-center gap-1.5">
                            <MessageSquare size={10} /> Tom
                          </p>
                          <p className="text-sm text-text-secondary">
                            {selectedAd.rawAnalysis.tone}
                          </p>
                        </div>
                      )}
                      {selectedAd.rawAnalysis.target_audience && (
                        <div className="glass p-4 rounded-xl sm:col-span-2">
                          <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1 flex items-center gap-1.5">
                            <Target size={10} /> Publico-Alvo
                          </p>
                          <p className="text-sm text-text-secondary">
                            {selectedAd.rawAnalysis.target_audience}
                          </p>
                        </div>
                      )}
                    </div>

                    {selectedAd.rawAnalysis.strengths &&
                      selectedAd.rawAnalysis.strengths.length > 0 && (
                        <div className="glass p-4 rounded-xl">
                          <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 flex items-center gap-1.5">
                            <ShieldCheck size={10} /> Pontos Fortes
                          </p>
                          <ul className="space-y-1">
                            {selectedAd.rawAnalysis.strengths.map((s, i) => (
                              <li
                                key={i}
                                className="text-sm text-green-400 flex items-start gap-2"
                              >
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {selectedAd.rawAnalysis.weaknesses &&
                      selectedAd.rawAnalysis.weaknesses.length > 0 && (
                        <div className="glass p-4 rounded-xl">
                          <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 flex items-center gap-1.5">
                            <ShieldAlert size={10} /> Pontos Fracos
                          </p>
                          <ul className="space-y-1">
                            {selectedAd.rawAnalysis.weaknesses.map((w, i) => (
                              <li
                                key={i}
                                className="text-sm text-red-400 flex items-start gap-2"
                              >
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                                {w}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    {selectedAd.rawAnalysis.improvements &&
                      selectedAd.rawAnalysis.improvements.length > 0 && (
                        <div className="glass p-4 rounded-xl">
                          <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 flex items-center gap-1.5">
                            <Lightbulb size={10} /> Melhorias Sugeridas
                          </p>
                          <ul className="space-y-1">
                            {selectedAd.rawAnalysis.improvements.map((imp, i) => (
                              <li
                                key={i}
                                className="text-sm text-yellow-400 flex items-start gap-2"
                              >
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" />
                                {imp}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                ) : (
                  <div className="glass p-8 rounded-xl flex flex-col items-center gap-4 text-center">
                    <Sparkles size={32} className="text-text-muted" />
                    <p className="text-sm text-text-secondary">
                      Este ad ainda nao foi analisado com IA.
                    </p>
                    {analyzeError && (
                      <p className="text-sm text-red-400">{analyzeError}</p>
                    )}
                    <button
                      onClick={() => handleAnalyze(selectedAd.id)}
                      disabled={analyzing}
                      className={cn(
                        'px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all',
                        analyzing
                          ? 'bg-accent/30 text-white/50 cursor-not-allowed'
                          : 'bg-accent hover:bg-accent-hover text-white shadow-glow hover:scale-[1.02] active:scale-[0.98]'
                      )}
                    >
                      {analyzing ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Analisando...
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} />
                          Analisar com IA
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
