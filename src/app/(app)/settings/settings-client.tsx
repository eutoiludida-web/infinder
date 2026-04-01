'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { User } from '@/types'

export function SettingsClient({
  user,
  email,
}: {
  user: User | null
  email: string
}) {
  const [cancelling, setCancelling] = useState(false)
  const router = useRouter()

  async function handleCancelSubscription() {
    if (!confirm('Tem certeza que deseja cancelar sua assinatura? Você perderá acesso aos recursos premium.')) {
      return
    }

    setCancelling(true)
    try {
      const res = await fetch('/api/payments/cancel', { method: 'POST' })
      if (res.ok) {
        router.refresh()
      } else {
        const data = await res.json()
        alert(data.error || 'Erro ao cancelar')
      }
    } finally {
      setCancelling(false)
    }
  }

  const plan = user?.plan || 'free'
  const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1)
  const isSubscribed = plan !== 'free' && user?.subscription_status === 'active'

  return (
    <div className="max-w-xl space-y-6">
      {/* Account */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Conta</h2>
        <div className="space-y-3">
          <div>
            <span className="text-sm text-muted-foreground">Email</span>
            <p className="text-sm font-medium">{email}</p>
          </div>
          {user?.name && (
            <div>
              <span className="text-sm text-muted-foreground">Nome</span>
              <p className="text-sm font-medium">{user.name}</p>
            </div>
          )}
        </div>
      </div>

      {/* Plan */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Plano</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{planLabel}</p>
            <p className="text-sm text-muted-foreground">
              {isSubscribed ? 'Assinatura ativa' : 'Sem assinatura ativa'}
            </p>
          </div>
          {isSubscribed ? (
            <button
              onClick={handleCancelSubscription}
              disabled={cancelling}
              className="rounded-md border border-destructive px-4 py-2 text-sm text-destructive hover:bg-destructive/10 disabled:opacity-50"
            >
              {cancelling ? 'Cancelando...' : 'Cancelar assinatura'}
            </button>
          ) : (
            <Link
              href="/pricing"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Ver planos
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
