'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BrandForm } from '@/components/brand-form'
import { Edit2, Trash2, Plus, Palette } from 'lucide-react'
import type { Brand } from '@/types'

export function BrandClient({ brands }: { brands: Brand[] }) {
  const [showForm, setShowForm] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const router = useRouter()

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir esta marca?')) return
    await fetch(`/api/brands/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  if (showForm || editingBrand) {
    return (
      <div className="max-w-xl rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">
          {editingBrand ? 'Editar marca' : 'Nova marca'}
        </h2>
        <BrandForm
          brand={editingBrand || undefined}
          onClose={() => {
            setShowForm(false)
            setEditingBrand(null)
          }}
        />
      </div>
    )
  }

  if (brands.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center max-w-xl">
        <Palette className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-medium">Nenhuma marca configurada</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Configure sua marca para que a IA possa contextualizar as análises
        </p>
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Configurar marca
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4 max-w-xl">
      {brands.map((brand) => (
        <div key={brand.id} className="rounded-lg border bg-card p-6 space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold">{brand.name}</h3>
            <div className="flex gap-1">
              <button
                onClick={() => setEditingBrand(brand)}
                className="rounded p-1.5 hover:bg-accent"
                title="Editar"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(brand.id)}
                className="rounded p-1.5 hover:bg-destructive/10 text-destructive"
                title="Excluir"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {brand.niche && (
            <div>
              <span className="text-xs font-medium text-muted-foreground">Nicho</span>
              <p className="text-sm">{brand.niche}</p>
            </div>
          )}
          {brand.tone_of_voice && (
            <div>
              <span className="text-xs font-medium text-muted-foreground">Tom de voz</span>
              <p className="text-sm">{brand.tone_of_voice}</p>
            </div>
          )}
          {brand.target_audience && (
            <div>
              <span className="text-xs font-medium text-muted-foreground">Público-alvo</span>
              <p className="text-sm">{brand.target_audience}</p>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={() => setShowForm(true)}
        className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-accent"
      >
        <Plus className="h-4 w-4" />
        Adicionar outra marca
      </button>
    </div>
  )
}
