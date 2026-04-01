'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CompetitorForm } from '@/components/competitor-form'
import { Plus, Trash2, Edit2, Globe } from 'lucide-react'
import type { Competitor } from '@/types'

export function CompetitorsClient({ competitors }: { competitors: Competitor[] }) {
  const [showForm, setShowForm] = useState(false)
  const [editingCompetitor, setEditingCompetitor] = useState<Competitor | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const router = useRouter()

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir este concorrente?')) return
    setDeleting(id)
    try {
      await fetch(`/api/competitors/${id}`, { method: 'DELETE' })
      router.refresh()
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div>
      {(showForm || editingCompetitor) && (
        <div className="mb-6 rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingCompetitor ? 'Editar concorrente' : 'Novo concorrente'}
          </h2>
          <CompetitorForm
            competitor={editingCompetitor || undefined}
            onClose={() => {
              setShowForm(false)
              setEditingCompetitor(null)
            }}
          />
        </div>
      )}

      {!showForm && !editingCompetitor && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Adicionar concorrente
        </button>
      )}

      {competitors.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">Nenhum concorrente</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Adicione concorrentes para começar a monitorar seus anúncios
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {competitors.map((comp) => (
            <div
              key={comp.id}
              className="rounded-lg border bg-card p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-semibold">{comp.name}</h3>
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditingCompetitor(comp)}
                    className="rounded p-1 hover:bg-accent"
                    title="Editar"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(comp.id)}
                    disabled={deleting === comp.id}
                    className="rounded p-1 hover:bg-destructive/10 text-destructive"
                    title="Excluir"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-1 text-sm text-muted-foreground">
                {comp.meta_page_id && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-600">M</span>
                    <span>{comp.meta_page_id}</span>
                  </div>
                )}
                {comp.google_domain && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5" />
                    <span>{comp.google_domain}</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                Adicionado em {new Date(comp.created_at).toLocaleDateString('pt-BR')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Users(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
