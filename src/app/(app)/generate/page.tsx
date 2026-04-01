'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Sparkles,
  Video,
  Briefcase,
  ArrowRight,
  Copy,
  Check,
  Download,
  AtSign,
  ChevronDown,
  MessageSquare,
  Hash,
  Loader2,
  AlertCircle,
  Link as LinkIcon,
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'

interface Brand {
  id: string
  name: string
  niche: string | null
  tone_of_voice: string | null
  target_audience: string | null
}

interface RawAd {
  id: string
  headline: string | null
  ad_text: string | null
  platform: string
  image_urls: string[] | null
  competitors: { name: string } | null
  ad_analyses: Array<{
    id: string
    score: number | null
  }>
}

interface Concept {
  title: string
  hook: string
  headline: string
  text: string
  cta: string
  captionIg: string
  captionTt: string
  hashtags: string[]
}

export default function Generate() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [analyzedAds, setAnalyzedAds] = useState<RawAd[]>([])
  const [selectedAdId, setSelectedAdId] = useState('')
  const [selectedBrandId, setSelectedBrandId] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [concepts, setConcepts] = useState<Concept[] | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [generateError, setGenerateError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoadingData(true)
    setError(null)
    try {
      const [brandsRes, adsRes] = await Promise.all([
        fetch('/api/brands'),
        fetch('/api/ads?limit=100'),
      ])

      if (!brandsRes.ok || !adsRes.ok) throw new Error('Erro ao carregar dados')

      const brandsData = await brandsRes.json()
      const adsData = await adsRes.json()

      setBrands(brandsData)

      // Filter only ads that have analyses
      const withAnalysis = (adsData.ads as RawAd[]).filter(
        (ad) => ad.ad_analyses && ad.ad_analyses.length > 0
      )
      setAnalyzedAds(withAnalysis)

      // Pre-select first items
      if (brandsData.length > 0) setSelectedBrandId(brandsData[0].id)
      if (withAnalysis.length > 0) setSelectedAdId(withAnalysis[0].id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoadingData(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const selectedAd = analyzedAds.find((a) => a.id === selectedAdId)
  const selectedBrand = brands.find((b) => b.id === selectedBrandId)

  const handleGenerate = async () => {
    if (!selectedAdId || !selectedBrandId) return
    setIsGenerating(true)
    setConcepts(null)
    setGenerateError(null)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId: selectedAdId, brandId: selectedBrandId }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erro ao gerar conceitos')
      }

      const data = await res.json()
      setConcepts(data.concepts)
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Loading state
  if (loadingData) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-black/10 pb-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-black/40">
              <Sparkles className="w-3 h-3 text-accent" />
              Motor de Sintese Viral
            </div>
            <h1 className="text-5xl font-display font-bold uppercase tracking-tight text-black">
              Motor de Criativos
            </h1>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-px bg-black/10 border border-black/10 mb-16">
          <div className="bg-white p-10 animate-pulse space-y-8">
            <div className="h-10 w-48 bg-black/5 rounded" />
            <div className="h-8 w-full bg-black/5 rounded" />
            <div className="h-20 w-full bg-black/5 rounded" />
          </div>
          <div className="bg-white p-10 animate-pulse space-y-8">
            <div className="h-10 w-48 bg-black/5 rounded" />
            <div className="h-8 w-full bg-black/5 rounded" />
            <div className="h-20 w-full bg-black/5 rounded" />
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-6">
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <AlertCircle size={40} className="text-red-400" />
          <p className="text-black/60 font-medium">{error}</p>
          <button
            onClick={fetchData}
            className="px-6 py-2.5 bg-black text-white font-bold text-sm uppercase tracking-widest hover:bg-black/80 transition-all"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-black/10 pb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-black/40">
            <Sparkles className="w-3 h-3 text-accent" />
            Motor de Sintese Viral
          </div>
          <h1 className="text-5xl font-display font-bold uppercase tracking-tight text-black">
            Motor de Criativos
          </h1>
          <p className="text-black/60 max-w-xl font-sans leading-relaxed">
            Sintetize referencias virais em roteiros de alta performance adaptados ao DNA
            da sua marca com precisao cirurgica.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <div className="text-[10px] font-mono uppercase tracking-wider text-black/40">
              Status do Motor
            </div>
            <div className="text-xs font-mono font-bold text-emerald-600 uppercase">
              Otimizado
            </div>
          </div>
          <div className="w-12 h-12 border border-black flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Empty States */}
      {brands.length === 0 && (
        <div className="border border-black/10 bg-white p-12 mb-16 flex flex-col items-center gap-4 text-center">
          <Briefcase size={40} className="text-black/20" />
          <h3 className="text-lg font-bold uppercase tracking-wider">
            Configure sua marca primeiro
          </h3>
          <p className="text-black/50 max-w-md">
            Para gerar conceitos adaptados, voce precisa configurar pelo menos uma marca.
          </p>
          <a
            href="/brand"
            className="px-8 py-3 bg-black text-white font-bold uppercase tracking-widest text-xs hover:bg-black/80 transition-all flex items-center gap-2"
          >
            <LinkIcon className="w-4 h-4" />
            Configurar Marca
          </a>
        </div>
      )}

      {analyzedAds.length === 0 && brands.length > 0 && (
        <div className="border border-black/10 bg-white p-12 mb-16 flex flex-col items-center gap-4 text-center">
          <Video size={40} className="text-black/20" />
          <h3 className="text-lg font-bold uppercase tracking-wider">
            Analise um ad primeiro
          </h3>
          <p className="text-black/50 max-w-md">
            Para gerar conceitos, voce precisa ter pelo menos um ad analisado com IA.
          </p>
          <a
            href="/ads"
            className="px-8 py-3 bg-black text-white font-bold uppercase tracking-widest text-xs hover:bg-black/80 transition-all flex items-center gap-2"
          >
            <LinkIcon className="w-4 h-4" />
            Ir para Ads
          </a>
        </div>
      )}

      {/* Configuration Grid - only show if both data available */}
      {brands.length > 0 && analyzedAds.length > 0 && (
        <>
          <div className="grid md:grid-cols-2 gap-px bg-black/10 border border-black/10 mb-16">
            {/* Reference Asset */}
            <div className="bg-white p-10 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 border border-black flex items-center justify-center">
                  <Video className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em]">
                  Ativo de Referencia
                </h3>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 block">
                  Selecionar Ad Analisado
                </label>
                <div className="relative">
                  <select
                    value={selectedAdId}
                    onChange={(e) => setSelectedAdId(e.target.value)}
                    className="w-full bg-transparent border-b border-black/20 py-3 font-sans text-base focus:outline-none focus:border-black transition-colors appearance-none"
                  >
                    {analyzedAds.map((ad) => (
                      <option key={ad.id} value={ad.id}>
                        {ad.headline || 'Sem titulo'} ({ad.competitors?.name || 'Desconhecido'})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40 pointer-events-none" />
                </div>
              </div>

              {selectedAd && (
                <div className="p-4 bg-black/5 flex items-center gap-4">
                  <div className="w-12 h-16 bg-black/10 overflow-hidden shrink-0">
                    <img
                      src={
                        selectedAd.image_urls?.[0] ||
                        'https://picsum.photos/seed/ref/100/150'
                      }
                      className="w-full h-full object-cover grayscale"
                      alt="Ref"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-orange-600">
                      Referencia Ativa
                    </p>
                    <p className="text-xs font-bold text-black truncate">
                      {selectedAd.headline || 'Sem titulo'}
                    </p>
                    <p className="text-[9px] font-bold text-black/40">
                      Score:{' '}
                      {selectedAd.ad_analyses?.[0]?.score != null
                        ? `${selectedAd.ad_analyses[0].score}/10`
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Brand Profile */}
            <div className="bg-white p-10 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 border border-black flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em]">
                  Perfil da Marca
                </h3>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 block">
                  Selecionar Marca
                </label>
                <div className="relative">
                  <select
                    value={selectedBrandId}
                    onChange={(e) => setSelectedBrandId(e.target.value)}
                    className="w-full bg-transparent border-b border-black/20 py-3 font-sans text-base focus:outline-none focus:border-black transition-colors appearance-none"
                  >
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                        {brand.niche ? ` (Nicho: ${brand.niche})` : ''}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40 pointer-events-none" />
                </div>
              </div>

              {selectedBrand && (
                <div className="grid grid-cols-2 gap-px bg-black/10 border border-black/10">
                  <div className="bg-white p-4">
                    <p className="text-[8px] font-bold uppercase tracking-widest text-black/40 mb-1">
                      Parametros de Tom
                    </p>
                    <p className="text-[10px] font-bold uppercase">
                      {selectedBrand.tone_of_voice || 'Nao definido'}
                    </p>
                  </div>
                  <div className="bg-white p-4">
                    <p className="text-[8px] font-bold uppercase tracking-widest text-black/40 mb-1">
                      Publico-Alvo
                    </p>
                    <p className="text-[10px] font-bold uppercase">
                      {selectedBrand.target_audience || 'Nao definido'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-col items-center gap-4 mb-24">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !selectedAdId || !selectedBrandId}
              className={cn(
                'px-16 py-5 font-bold uppercase tracking-[0.3em] text-xs transition-all flex items-center gap-4 group border border-black',
                isGenerating || !selectedAdId || !selectedBrandId
                  ? 'bg-black/5 text-black/30 border-black/10 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-transparent hover:text-black'
              )}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sintetizando...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Gerar 3 Conceitos
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            {generateError && (
              <p className="text-sm text-red-500 font-medium">{generateError}</p>
            )}
          </div>
        </>
      )}

      {/* Results */}
      <AnimatePresence>
        {concepts && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          >
            {concepts.map((concept, idx) => (
              <div
                key={idx}
                className="border border-black/10 bg-white flex flex-col group hover:border-black transition-colors"
              >
                <div className="p-10 border-b border-black/10 flex items-center justify-between bg-black/5">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-orange-600 block mb-2">
                      Conceito #{idx + 1}
                    </span>
                    <h3 className="text-2xl font-display font-bold uppercase tracking-tight text-black">
                      {concept.title}
                    </h3>
                  </div>
                  <button className="w-10 h-10 border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all">
                    <Download className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-10 space-y-12 flex-1">
                  {/* Hook */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-black/40 flex items-center gap-3">
                      <Sparkles className="w-3 h-3 text-orange-500" /> Arquitetura do
                      Gancho
                    </h4>
                    <p className="text-black/80 font-sans text-lg leading-relaxed italic border-l-2 border-black pl-6 py-2">
                      &quot;{concept.hook}&quot;
                    </p>
                  </div>

                  {/* Headline */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-black/40 flex items-center gap-3">
                      <MessageSquare className="w-3 h-3" /> Headline
                    </h4>
                    <p className="text-black/80 font-sans text-base font-bold">
                      {concept.headline}
                    </p>
                  </div>

                  {/* Text */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-black/40 flex items-center gap-3">
                      <MessageSquare className="w-3 h-3" /> Texto do Anuncio
                    </h4>
                    <p className="text-black/70 font-sans text-sm leading-relaxed whitespace-pre-wrap">
                      {concept.text}
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-black/40 flex items-center gap-3">
                      <ArrowRight className="w-3 h-3" /> CTA
                    </h4>
                    <p className="text-black font-sans text-base font-bold">
                      {concept.cta}
                    </p>
                  </div>

                  {/* Captions */}
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-black/40 flex items-center gap-3">
                      <MessageSquare className="w-3 h-3" /> Legendas & Metadados
                    </h4>

                    <div className="space-y-6">
                      {/* Instagram Caption */}
                      <div className="p-6 bg-black/5 relative group/caption">
                        <div className="flex items-center gap-2 mb-4">
                          <AtSign className="w-3 h-3" />
                          <span className="text-[9px] font-bold uppercase tracking-widest text-black/40">
                            Instagram
                          </span>
                        </div>
                        <p className="text-xs text-black/70 whitespace-pre-wrap leading-relaxed pr-8 font-sans">
                          {concept.captionIg}
                        </p>
                        <button
                          onClick={() =>
                            copyToClipboard(concept.captionIg, `ig-${idx}`)
                          }
                          className="absolute top-6 right-6 p-2 bg-white border border-black/10 text-black/40 hover:text-black transition-all opacity-0 group-hover/caption:opacity-100"
                        >
                          {copiedId === `ig-${idx}` ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>

                      {/* TikTok Caption */}
                      <div className="p-6 bg-black/5 relative group/caption">
                        <div className="flex items-center gap-2 mb-4">
                          <AtSign className="w-3 h-3" />
                          <span className="text-[9px] font-bold uppercase tracking-widest text-black/40">
                            TikTok
                          </span>
                        </div>
                        <p className="text-xs text-black/70 whitespace-pre-wrap leading-relaxed pr-8 font-sans">
                          {concept.captionTt}
                        </p>
                        <button
                          onClick={() =>
                            copyToClipboard(concept.captionTt, `tt-${idx}`)
                          }
                          className="absolute top-6 right-6 p-2 bg-white border border-black/10 text-black/40 hover:text-black transition-all opacity-0 group-hover/caption:opacity-100"
                        >
                          {copiedId === `tt-${idx}` ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>

                      {/* Hashtags */}
                      <div className="flex flex-wrap gap-2">
                        {concept.hashtags.map((tag: string, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1 border border-black/5 text-[9px] font-bold uppercase tracking-widest text-black/40 hover:border-black/20 hover:text-black transition-colors flex items-center gap-1"
                          >
                            <Hash className="w-2 h-2" /> {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 border-t border-black/10">
                  <button className="w-full py-4 bg-black text-white font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-transparent hover:text-black border border-black transition-all">
                    Salvar na Biblioteca de Inteligencia
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
