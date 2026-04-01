'use client'

import { useEffect, useState, useMemo } from 'react'
import { User as UserIcon, Bell, Shield, CreditCard, HelpCircle, Globe, Smartphone, ChevronRight, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createSupabaseBrowser } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

interface DbUser {
  id: string
  plan: string
  email: string
  name?: string
}

export default function Settings() {
  const supabase = useMemo(() => createSupabaseBrowser(), [])

  const [authUser, setAuthUser] = useState<User | null>(null)
  const [dbUser, setDbUser] = useState<DbUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('profile')
  const [cancellingPlan, setCancellingPlan] = useState(false)
  const [cancelMsg, setCancelMsg] = useState<string | null>(null)

  // Form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadUser() {
      try {
        const { data: authData } = await supabase.auth.getUser()
        if (cancelled || !authData.user) {
          if (!cancelled) setLoading(false)
          return
        }
        setAuthUser(authData.user)
        setEmail(authData.user.email ?? '')
        setName(authData.user.user_metadata?.name ?? authData.user.user_metadata?.full_name ?? '')

        // Fetch plan info from users table
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single()

        if (!cancelled && userData) {
          setDbUser(userData as DbUser)
          if (userData.name) setName(userData.name)
        }
      } catch {
        // silently handle - user will see empty state
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadUser()
    return () => { cancelled = true }
  }, [supabase])

  async function handleCancelSubscription() {
    setCancellingPlan(true)
    setCancelMsg(null)
    try {
      const res = await fetch('/api/payments/cancel', { method: 'POST' })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? 'Falha ao cancelar assinatura')
      }
      setCancelMsg('Assinatura cancelada com sucesso.')
      // Refresh plan info
      if (authUser) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single()
        if (data) setDbUser(data as DbUser)
      }
    } catch (err: any) {
      setCancelMsg(err.message ?? 'Erro ao cancelar')
    } finally {
      setCancellingPlan(false)
    }
  }

  const sections = [
    { id: 'profile', icon: UserIcon, label: 'Perfil', desc: 'Gerencie suas informacoes pessoais e foto.' },
    { id: 'notifications', icon: Bell, label: 'Notificacoes', desc: 'Escolha como e quando deseja ser notificado.' },
    { id: 'security', icon: Shield, label: 'Seguranca', desc: 'Senha, autenticacao de dois fatores e sessoes.' },
    { id: 'billing', icon: CreditCard, label: 'Faturamento', desc: 'Planos, historico de pagamentos e cartoes.' },
    { id: 'integrations', icon: Globe, label: 'Integracoes', desc: 'Conecte suas contas do Instagram e TikTok.' },
    { id: 'support', icon: HelpCircle, label: 'Suporte', desc: 'Central de ajuda e contato com a equipe.' },
  ]

  const planLabel = (dbUser?.plan ?? 'free').charAt(0).toUpperCase() + (dbUser?.plan ?? 'free').slice(1)

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl md:text-4xl font-display font-black text-text-primary tracking-tight">Configuracoes</h1>
        <p className="text-text-secondary mt-2 font-medium">Gerencie sua conta, seguranca e preferencias da plataforma.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Sidebar Nav */}
        <div className="lg:col-span-4 space-y-2">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={cn(
                "w-full flex items-center justify-between p-5 rounded-2xl transition-all text-left group",
                s.id === activeSection ? "glass text-text-primary" : "text-text-muted hover:bg-surface hover:text-text-primary"
              )}
            >
              <div className="flex items-center gap-4">
                <s.icon className={cn("w-5 h-5", s.id === activeSection ? "text-accent" : "text-text-muted group-hover:text-accent")} />
                <div>
                  <p className="text-xs font-black uppercase tracking-widest">{s.label}</p>
                  <p className="text-[10px] text-text-muted mt-1 line-clamp-1">{s.desc}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:translate-x-1 transition-transform" />
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-8 space-y-10">
          {activeSection === 'profile' && (
            <>
              <div className="glass p-8 md:p-10 rounded-[2rem] space-y-10">
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-accent animate-spin" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-8">
                      <div className="relative">
                        <div className="w-24 h-24 bg-surface border border-border rounded-2xl flex items-center justify-center">
                          <UserIcon className="w-10 h-10 text-text-muted" />
                        </div>
                        <button className="absolute -bottom-2 -right-2 p-2 bg-accent text-white rounded-xl shadow-glow hover:scale-110 transition-transform">
                          <Smartphone className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-2xl font-display font-bold text-text-primary">
                          {name || 'Usuario'}
                        </h3>
                        <p className="text-text-muted font-bold text-xs">{email || '--'}</p>
                        <div className="pt-2 flex items-center gap-2">
                          <span className="px-3 py-1 bg-success/10 text-success text-[8px] font-black uppercase tracking-widest rounded-full border border-success/20">
                            Conta Verificada
                          </span>
                          <span className="px-3 py-1 bg-accent/10 text-accent text-[8px] font-black uppercase tracking-widest rounded-full border border-accent/20">
                            Plano {planLabel}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Nome Completo</label>
                        <input
                          type="text"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          className="w-full bg-surface border border-border rounded-2xl py-3 px-5 text-sm focus:outline-none focus:border-accent/50 transition-all"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Endereco de Email</label>
                        <input
                          type="email"
                          value={email}
                          readOnly
                          className="w-full bg-surface border border-border rounded-2xl py-3 px-5 text-sm focus:outline-none focus:border-accent/50 transition-all opacity-60 cursor-not-allowed"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Idioma</label>
                        <select className="w-full bg-surface border border-border rounded-2xl py-3 px-5 text-sm focus:outline-none focus:border-accent/50 transition-all appearance-none cursor-pointer">
                          <option>Portugues (Brasil)</option>
                          <option>English (US)</option>
                          <option>Espanol</option>
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Fuso Horario</label>
                        <select className="w-full bg-surface border border-border rounded-2xl py-3 px-5 text-sm focus:outline-none focus:border-accent/50 transition-all appearance-none cursor-pointer">
                          <option>(GMT-03:00) Sao Paulo</option>
                          <option>(GMT-05:00) New York</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-border flex justify-end">
                      <button className="bg-accent hover:bg-accent-hover text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-glow transition-all hover:scale-[1.02] active:scale-[0.98]">
                        Salvar Alteracoes
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Subscription management */}
              {!loading && dbUser?.plan && dbUser.plan !== 'free' && (
                <div className="glass p-8 rounded-[2rem] space-y-6">
                  <h4 className="text-xl font-display font-bold text-text-primary">Assinatura</h4>
                  <p className="text-text-secondary text-sm">
                    Voce esta no plano <strong className="text-accent">{planLabel}</strong>.
                  </p>
                  {cancelMsg && (
                    <p className={cn(
                      "text-sm font-bold px-4 py-3 rounded-xl",
                      cancelMsg.includes('sucesso') ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                    )}>
                      {cancelMsg}
                    </p>
                  )}
                  <button
                    onClick={handleCancelSubscription}
                    disabled={cancellingPlan}
                    className="px-8 py-3 bg-surface border border-danger/20 text-danger font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-danger hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {cancellingPlan && <Loader2 className="w-3 h-3 animate-spin" />}
                    Cancelar Assinatura
                  </button>
                </div>
              )}

              {/* Danger Zone */}
              <div className="bg-danger/5 border border-danger/20 rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-1">
                  <h4 className="text-danger font-display font-bold text-xl">Zona de Perigo</h4>
                  <p className="text-danger/60 text-xs">Excluir sua conta removera permanentemente todos os seus dados e ativos.</p>
                </div>
                <button className="px-8 py-3 bg-surface border border-danger/20 text-danger font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-danger hover:text-white transition-all">
                  Excluir Conta
                </button>
              </div>
            </>
          )}

          {/* Placeholder sections */}
          {activeSection !== 'profile' && (
            <div className="glass p-10 rounded-[2rem] text-center space-y-4">
              <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center mx-auto">
                {(() => {
                  const s = sections.find(s => s.id === activeSection)
                  if (!s) return null
                  const Icon = s.icon
                  return <Icon className="w-8 h-8 text-text-muted" />
                })()}
              </div>
              <h3 className="text-xl font-display font-bold text-text-primary">
                {sections.find(s => s.id === activeSection)?.label}
              </h3>
              <p className="text-text-secondary text-sm max-w-sm mx-auto">
                Esta secao estara disponivel em breve. Estamos trabalhando para trazer essa funcionalidade.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
