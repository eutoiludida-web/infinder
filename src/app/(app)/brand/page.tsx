'use client'

import React, { useState, useEffect } from 'react'
import { Briefcase, Save, Globe, Users, Sparkles, Check, ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface Brand {
  id: string
  name: string
  niche: string | null
  tone_of_voice: string | null
  target_audience: string | null
  created_at: string
  updated_at?: string
}

export default function Brand() {
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [brand, setBrand] = useState<Brand | null>(null)

  const [name, setName] = useState('')
  const [niche, setNiche] = useState('')
  const [toneOfVoice, setToneOfVoice] = useState<string[]>([])
  const [targetAudience, setTargetAudience] = useState('')
  const [uvp, setUvp] = useState('')

  useEffect(() => {
    fetchBrand()
  }, [])

  async function fetchBrand() {
    try {
      const res = await fetch('/api/brands')
      if (res.ok) {
        const data: Brand[] = await res.json()
        if (data.length > 0) {
          const b = data[0]
          setBrand(b)
          setName(b.name || '')
          setNiche(b.niche || '')
          setTargetAudience(b.target_audience || '')
          // tone_of_voice may be stored as comma-separated string
          if (b.tone_of_voice) {
            setToneOfVoice(b.tone_of_voice.split(',').map((t) => t.trim()))
          }
        }
      }
    } catch (err) {
      console.error('Erro ao carregar marca:', err)
    } finally {
      setLoading(false)
    }
  }

  function toggleTone(tone: string) {
    setToneOfVoice((prev) =>
      prev.includes(tone) ? prev.filter((t) => t !== tone) : [...prev, tone]
    )
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const payload = {
      name,
      niche,
      tone_of_voice: toneOfVoice.join(', '),
      target_audience: targetAudience,
    }

    try {
      let res: Response
      if (brand) {
        res = await fetch(`/api/brands/${brand.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        res = await fetch('/api/brands', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }

      if (res.ok) {
        const updated = await res.json()
        setBrand(updated)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        const err = await res.json()
        console.error('Erro ao salvar:', err)
      }
    } catch (err) {
      console.error('Erro ao salvar marca:', err)
    } finally {
      setIsSaving(false)
    }
  }

  // Compute identity score based on how many fields are filled
  const filledFields = [name, niche, toneOfVoice.length > 0 ? 'x' : '', targetAudience].filter(Boolean).length
  const identityScore = Math.round((filledFields / 4) * 100)

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-6">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-black/5 w-1/3" />
          <div className="h-48 bg-black/5" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-black/10 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">
            <Briefcase className="w-3 h-3 text-accent" />
            Configuracao de Identidade de Marca
          </div>
          <h1 className="text-5xl font-display font-bold uppercase tracking-tight text-black">Identidade de Marca</h1>
          <p className="text-black/60 max-w-md font-sans leading-relaxed">
            Defina o DNA central da sua marca para calibrar o motor de IA para geracao de conteudo de alta precisao.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <div className="text-[10px] font-bold uppercase tracking-wider text-black/40">Ultima Sincronizacao</div>
            <div className="text-xs font-bold">
              {brand?.updated_at || brand?.created_at
                ? new Date(brand.updated_at || brand.created_at).toLocaleString('pt-BR', { timeZone: 'UTC' })
                : '--'}
            </div>
          </div>
          <div className="w-12 h-12 border border-black flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Configuration Area */}
        <div className="lg:col-span-8 space-y-12">
          {/* Basic Info Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[11px] font-bold uppercase tracking-widest text-black/50 flex items-center gap-2">
                <span className="w-1 h-1 bg-black rounded-full" />
                Nome da Marca
              </label>
              <input
                type="text"
                placeholder="ex: INFInder Labs"
                className="w-full bg-transparent border-b border-black/20 py-3 font-sans text-lg focus:outline-none focus:border-black transition-colors placeholder:text-black/20"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-bold uppercase tracking-widest text-black/50 flex items-center gap-2">
                <span className="w-1 h-1 bg-black rounded-full" />
                Nicho de Mercado
              </label>
              <div className="relative">
                <Globe className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                <input
                  type="text"
                  placeholder="ex: SaaS, Fintech, E-commerce"
                  className="w-full bg-transparent border-b border-black/20 py-3 pr-8 font-sans text-lg focus:outline-none focus:border-black transition-colors placeholder:text-black/20"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Tone of Voice Selection */}
          <div className="space-y-6">
            <label className="text-[11px] font-bold uppercase tracking-widest text-black/50 flex items-center gap-2">
              <span className="w-1 h-1 bg-black rounded-full" />
              Tom de Voz
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-black/10 border border-black/10">
              {['Profissional', 'Inspirador', 'Divertido', 'Educativo'].map((tone) => (
                <label key={tone} className="relative group cursor-pointer bg-white">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={toneOfVoice.includes(tone)}
                    onChange={() => toggleTone(tone)}
                  />
                  <div className="p-6 text-center transition-all peer-checked:bg-black peer-checked:text-white group-hover:bg-black/5 peer-checked:group-hover:bg-black">
                    <span className="text-xs font-bold uppercase tracking-wider">{tone}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Text Areas */}
          <div className="space-y-12">
            <div className="space-y-4">
              <label className="text-[11px] font-bold uppercase tracking-widest text-black/50 flex items-center gap-2">
                <span className="w-1 h-1 bg-black rounded-full" />
                Persona do Publico-Alvo
              </label>
              <div className="relative group">
                <Users className="absolute left-0 top-0 w-4 h-4 text-black/20 group-focus-within:text-black transition-colors" />
                <textarea
                  placeholder="Descreva o perfil do seu cliente ideal em detalhes..."
                  className="w-full pl-8 bg-transparent border-b border-black/10 py-2 font-sans text-base focus:outline-none focus:border-black transition-all min-h-[100px] resize-none leading-relaxed"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[11px] font-bold uppercase tracking-widest text-black/50 flex items-center gap-2">
                <span className="w-1 h-1 bg-black rounded-full" />
                Proposta Unica de Valor (UVP)
              </label>
              <div className="relative group">
                <Sparkles className="absolute left-0 top-0 w-4 h-4 text-black/20 group-focus-within:text-black transition-colors" />
                <textarea
                  placeholder="O que torna a inteligencia da sua marca unica?"
                  className="w-full pl-8 bg-transparent border-b border-black/10 py-2 font-sans text-base focus:outline-none focus:border-black transition-all min-h-[100px] resize-none leading-relaxed"
                  value={uvp}
                  onChange={(e) => setUvp(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar / Actions */}
        <div className="lg:col-span-4 lg:border-l lg:border-black/5 lg:pl-12 space-y-8">
          <div className="p-6 bg-black text-white space-y-4">
            <h3 className="font-display font-bold uppercase text-xl">Score de Identidade</h3>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold">{identityScore}</span>
              <span className="text-xs font-bold opacity-60 mb-1">/100</span>
            </div>
            <div className="w-full h-1 bg-white/20">
              <div className="h-full bg-orange-500 transition-all" style={{ width: `${identityScore}%` }} />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-60 leading-relaxed">
              {identityScore >= 75
                ? 'Perfil de alta precisao detectado. A geracao de IA sera altamente alinhada com o DNA da marca.'
                : 'Preencha mais campos para aumentar a precisao da geracao de conteudo por IA.'}
            </p>
          </div>

          <div className="space-y-4 pt-8">
            <button
              type="submit"
              disabled={isSaving}
              className={cn(
                "w-full py-4 font-bold uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 border border-black",
                saved ? "bg-emerald-500 border-emerald-500 text-white" : "bg-black text-white hover:bg-transparent hover:text-black",
                isSaving && "opacity-50 cursor-not-allowed"
              )}
            >
              {isSaving ? (
                <>
                  <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                  Processando...
                </>
              ) : saved ? (
                <>
                  <Check className="w-4 h-4" />
                  Salvo com Sucesso
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Salvar Configuracao
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                if (brand) {
                  setName(brand.name || '')
                  setNiche(brand.niche || '')
                  setTargetAudience(brand.target_audience || '')
                  if (brand.tone_of_voice) {
                    setToneOfVoice(brand.tone_of_voice.split(',').map((t) => t.trim()))
                  } else {
                    setToneOfVoice([])
                  }
                } else {
                  setName('')
                  setNiche('')
                  setToneOfVoice([])
                  setTargetAudience('')
                  setUvp('')
                }
              }}
              className="w-full py-4 font-bold uppercase tracking-[0.2em] text-[10px] text-black/40 hover:text-black transition-all"
            >
              Descartar Alteracoes
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
