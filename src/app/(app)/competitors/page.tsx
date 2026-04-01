'use client'

import { useState, useEffect } from 'react'
import { Users, Plus, AtSign, Play, Trash2, ExternalLink, Search, TrendingUp, X, Terminal, Globe, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'

interface Competitor {
  id: string
  name: string
  meta_page_id: string | null
  google_domain: string | null
  created_at: string
}

export default function Competitors() {
  const [isAdding, setIsAdding] = useState(false)
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [runningPipeline, setRunningPipeline] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [metaPageId, setMetaPageId] = useState('')
  const [googleDomain, setGoogleDomain] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCompetitors()
  }, [])

  async function fetchCompetitors() {
    try {
      const res = await fetch('/api/competitors')
      if (res.ok) setCompetitors(await res.json())
    } finally {
      setLoading(false)
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!metaPageId && !googleDomain) {
      setError('Informe pelo menos um: Meta Page ID ou Google Domain')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/competitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, meta_page_id: metaPageId || undefined, google_domain: googleDomain || undefined }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erro ao adicionar')
      }
      setName(''); setMetaPageId(''); setGoogleDomain('')
      setIsAdding(false)
      fetchCompetitors()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir este concorrente?')) return
    await fetch(`/api/competitors/${id}`, { method: 'DELETE' })
    setCompetitors(competitors.filter(c => c.id !== id))
  }

  async function handleRunPipeline(id: string) {
    setRunningPipeline(id)
    try {
      const res = await fetch('/api/pipeline/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competitorId: id }),
      })
      const data = await res.json()
      if (res.ok) {
        alert(`Pipeline concluído! ${data.newAdsCount} ads encontrados, ${data.analyzedCount} analisados.`)
      } else {
        alert(data.error || 'Erro no pipeline')
      }
    } catch {
      alert('Erro ao rodar pipeline')
    } finally {
      setRunningPipeline(null)
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-black/10 pb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-black/40">
            <Terminal className="w-3 h-3" />
            Competitive Intelligence / Watchlist.v1
          </div>
          <h1 className="text-5xl font-serif italic tracking-tight text-black">Concorrentes</h1>
          <p className="text-black/60 max-w-xl font-sans leading-relaxed">
            Monitore perfis de alto crescimento em seu nicho de mercado para extrair padrões estratégicos e benchmarks de desempenho.
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="px-8 py-4 bg-black text-white font-mono uppercase tracking-[0.2em] text-xs transition-all flex items-center gap-3 border border-black hover:bg-transparent hover:text-black group"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> Adicionar Perfil
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted" />
        </div>
      ) : competitors.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-black/10">
          <Users className="w-12 h-12 text-black/20 mx-auto mb-4" />
          <p className="text-black/40 font-bold text-sm uppercase tracking-widest">Nenhum concorrente adicionado</p>
          <p className="text-black/30 text-xs mt-2">Clique em &quot;Adicionar Perfil&quot; para começar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-black/10 border border-black/10">
          {competitors.map((c) => (
            <motion.div
              key={c.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-8 group relative"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="w-16 h-16 border border-black/10 flex items-center justify-center bg-black/5">
                  <span className="text-2xl font-bold text-black/30">{c.name.charAt(0).toUpperCase()}</span>
                </div>
                <button onClick={() => handleDelete(c.id)} className="p-2 text-black/20 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1 mb-6">
                <h3 className="font-serif italic text-xl text-black">{c.name}</h3>
                {c.meta_page_id && (
                  <div className="flex items-center gap-2">
                    <AtSign className="w-3 h-3 text-black/40" />
                    <span className="text-[10px] font-mono font-bold text-orange-600 uppercase tracking-widest">{c.meta_page_id}</span>
                  </div>
                )}
                {c.google_domain && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-3 h-3 text-black/40" />
                    <span className="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-widest">{c.google_domain}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-black/5">
                <button
                  onClick={() => handleRunPipeline(c.id)}
                  disabled={runningPipeline === c.id}
                  className="w-full py-3 bg-black text-white font-mono uppercase tracking-[0.2em] text-[10px] hover:bg-accent transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {runningPipeline === c.id ? (
                    <><Loader2 className="w-3 h-3 animate-spin" /> Scrapeando...</>
                  ) : (
                    <><TrendingUp className="w-3 h-3" /> Rodar Pipeline</>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAdding(false)} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-white border border-black p-10 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-serif italic text-black">Novo Concorrente</h2>
                <button onClick={() => setIsAdding(false)} className="p-2 text-black/20 hover:text-black transition-colors"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleAdd} className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-black/40">Nome do Concorrente</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Ex: Concorrente X" className="w-full bg-transparent border-b border-black/20 py-3 font-sans text-lg focus:outline-none focus:border-black transition-colors placeholder:text-black/20" />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-black/40">Meta Page ID (Facebook)</label>
                  <input type="text" value={metaPageId} onChange={e => setMetaPageId(e.target.value)} placeholder="ID ou nome da página" className="w-full bg-transparent border-b border-black/20 py-3 font-sans text-lg focus:outline-none focus:border-black transition-colors placeholder:text-black/20" />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-black/40">Google Domain</label>
                  <input type="text" value={googleDomain} onChange={e => setGoogleDomain(e.target.value)} placeholder="Ex: exemplo.com.br" className="w-full bg-transparent border-b border-black/20 py-3 font-sans text-lg focus:outline-none focus:border-black transition-colors placeholder:text-black/20" />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button type="submit" disabled={saving} className="w-full py-5 bg-black text-white font-mono uppercase tracking-[0.2em] text-xs hover:bg-transparent hover:text-black border border-black transition-all disabled:opacity-50">
                  {saving ? 'Salvando...' : 'Adicionar Concorrente'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
