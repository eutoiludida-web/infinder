'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Brand } from '@/types'

interface BrandFormProps {
  brand?: Brand
  onClose?: () => void
}

export function BrandForm({ brand, onClose }: BrandFormProps) {
  const [name, setName] = useState(brand?.name || '')
  const [niche, setNiche] = useState(brand?.niche || '')
  const [toneOfVoice, setToneOfVoice] = useState(brand?.tone_of_voice || '')
  const [targetAudience, setTargetAudience] = useState(brand?.target_audience || '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const isEditing = !!brand

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const url = isEditing ? `/api/brands/${brand.id}` : '/api/brands'
      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          niche: niche || undefined,
          tone_of_voice: toneOfVoice || undefined,
          target_audience: targetAudience || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erro ao salvar')
      }

      router.refresh()
      onClose?.()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="brand-name" className="block text-sm font-medium mb-1">
          Nome da marca
        </label>
        <input
          id="brand-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Nome da sua marca"
        />
      </div>

      <div>
        <label htmlFor="brand-niche" className="block text-sm font-medium mb-1">
          Nicho
        </label>
        <input
          id="brand-niche"
          type="text"
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Ex: E-commerce de moda, SaaS B2B, Educação"
        />
      </div>

      <div>
        <label htmlFor="brand-tone" className="block text-sm font-medium mb-1">
          Tom de voz
        </label>
        <textarea
          id="brand-tone"
          value={toneOfVoice}
          onChange={(e) => setToneOfVoice(e.target.value)}
          rows={2}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          placeholder="Ex: Informal, divertido, usa gírias. Fala direto com o público jovem."
        />
      </div>

      <div>
        <label htmlFor="brand-audience" className="block text-sm font-medium mb-1">
          Público-alvo
        </label>
        <textarea
          id="brand-audience"
          value={targetAudience}
          onChange={(e) => setTargetAudience(e.target.value)}
          rows={2}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          placeholder="Ex: Mulheres 25-40, interessadas em skincare, classe B/C"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-2 justify-end">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border px-4 py-2 text-sm hover:bg-accent"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Salvar'}
        </button>
      </div>
    </form>
  )
}
