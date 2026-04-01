'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Competitor } from '@/types'

interface CompetitorFormProps {
  competitor?: Competitor
  onClose?: () => void
}

export function CompetitorForm({ competitor, onClose }: CompetitorFormProps) {
  const [name, setName] = useState(competitor?.name || '')
  const [metaPageId, setMetaPageId] = useState(competitor?.meta_page_id || '')
  const [googleDomain, setGoogleDomain] = useState(competitor?.google_domain || '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const isEditing = !!competitor

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!metaPageId && !googleDomain) {
      setError('Informe pelo menos um: Meta Page ID ou Google Domain')
      return
    }

    setLoading(true)
    try {
      const url = isEditing
        ? `/api/competitors/${competitor.id}`
        : '/api/competitors'
      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          meta_page_id: metaPageId || undefined,
          google_domain: googleDomain || undefined,
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
        <label htmlFor="comp-name" className="block text-sm font-medium mb-1">
          Nome do concorrente
        </label>
        <input
          id="comp-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Ex: Concorrente X"
        />
      </div>

      <div>
        <label htmlFor="meta-page" className="block text-sm font-medium mb-1">
          Meta Page ID
        </label>
        <input
          id="meta-page"
          type="text"
          value={metaPageId}
          onChange={(e) => setMetaPageId(e.target.value)}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="ID ou nome da página no Facebook"
        />
        <p className="text-xs text-muted-foreground mt-1">
          ID numérico ou nome da página (ex: cocacola)
        </p>
      </div>

      <div>
        <label htmlFor="google-domain" className="block text-sm font-medium mb-1">
          Google Domain
        </label>
        <input
          id="google-domain"
          type="text"
          value={googleDomain}
          onChange={(e) => setGoogleDomain(e.target.value)}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Ex: exemplo.com.br"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Domínio do anunciante no Google Ads
        </p>
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
          {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Adicionar'}
        </button>
      </div>
    </form>
  )
}
