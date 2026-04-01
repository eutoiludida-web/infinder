'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Check, Sparkles, CreditCard, ArrowRight, Loader2, Zap } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/context/ThemeContext'

function PricingInner() {
  const router = useRouter()
  const [subscribingPlan, setSubscribingPlan] = useState<string | null>(null)

  const plans = [
    {
      name: 'Starter',
      slug: 'starter' as const,
      price: '97',
      analyses: '50',
      scripts: '10',
      brands: '1',
      desc: 'Perfeito para criadores emergentes que buscam validar seu nicho.'
    },
    {
      name: 'Pro',
      slug: 'pro' as const,
      price: '197',
      analyses: '200',
      scripts: '50',
      brands: '3',
      desc: 'Projetado para profissionais que escalam sua producao diaria.',
      popular: true
    },
    {
      name: 'Agency',
      slug: 'agency' as const,
      price: '497',
      analyses: '600',
      scripts: '150',
      brands: '9',
      desc: 'A solucao completa para agencias que gerenciam portfolios de alto volume.'
    }
  ]

  async function handleSubscribe(plan: 'starter' | 'pro' | 'agency') {
    setSubscribingPlan(plan)
    try {
      const res = await fetch('/api/payments/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })

      if (res.status === 401) {
        router.push('/auth')
        return
      }

      if (res.ok) {
        const data = await res.json()
        if (data.checkout_url) {
          window.location.href = data.checkout_url
        }
      } else {
        const err = await res.json()
        alert(err.error || 'Erro ao processar assinatura')
      }
    } catch (err) {
      console.error('Erro ao assinar:', err)
      alert('Erro ao processar assinatura. Tente novamente.')
    } finally {
      setSubscribingPlan(null)
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 atmosphere pointer-events-none -z-10" />

      {/* Navbar */}
      <nav className="bg-bg-primary/40 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group/logo">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-glow group-hover/logo:scale-110 transition-all duration-500">
              <Zap size={24} className="text-white fill-white" />
            </div>
            <span className="text-2xl font-display font-bold tracking-tighter">INFInder</span>
          </Link>
          <Link href="/auth" className="bg-accent hover:bg-accent-hover text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-glow transition-all hover:scale-105 active:scale-95">
            Comecar
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-24 px-6">
        <div className="text-center space-y-4 mb-20">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-gradient">Selecione seu Plano</h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">Precos transparentes para criadores e agencias. Sem taxas ocultas.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-20">
          {plans.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "glass p-10 rounded-[2.5rem] flex flex-col relative overflow-hidden group",
                p.popular && "border-accent/30 shadow-[0_0_40px_rgba(124,108,240,0.15)]"
              )}
            >
              {p.popular && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-accent-hover" />
              )}

              <div className="mb-10">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-display font-bold text-text-primary">{p.name}</h3>
                  {p.popular && (
                    <span className="px-3 py-1 bg-accent/10 text-accent text-[9px] font-black uppercase tracking-widest rounded-full border border-accent/20">Mais Popular</span>
                  )}
                </div>
                <p className="text-text-muted text-xs">{p.desc}</p>
              </div>

              <div className="flex items-baseline gap-2 mb-10">
                <span className="text-5xl font-display font-black text-text-primary tracking-tighter">R${p.price}</span>
                <span className="text-text-muted font-bold text-[10px] uppercase tracking-widest">/ mes</span>
              </div>

              <ul className="space-y-4 mb-12 flex-1">
                {[
                  `${p.analyses} analises de video / mes`,
                  `${p.scripts} roteiros gerados / mes`,
                  `${p.brands} configuracao de marca`,
                  'Monitoramento de concorrentes',
                  'Inteligencia de Ads',
                  'Suporte prioritario'
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-text-secondary text-xs font-bold uppercase tracking-wider">
                    <Check className="w-4 h-4 text-success shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(p.slug)}
                disabled={subscribingPlan !== null}
                className={cn(
                  "w-full py-5 font-black uppercase tracking-widest text-xs rounded-2xl transition-all flex items-center justify-center gap-3 group",
                  p.popular
                    ? "bg-accent hover:bg-accent-hover text-white shadow-glow"
                    : "bg-surface border border-border text-text-primary hover:border-accent/30 hover:bg-accent/5",
                  subscribingPlan === p.slug && "opacity-50 cursor-not-allowed"
                )}
              >
                {subscribingPlan === p.slug ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    {p.popular ? <Sparkles className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                    Assinar Agora
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </motion.div>
          ))}
        </div>

        <div className="glass p-12 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-accent/5 to-transparent -z-10" />
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-3xl font-display font-bold text-text-primary">Precisa de uma solucao customizada?</h3>
            <p className="text-text-secondary text-sm max-w-xl">Oferecemos planos Enterprise para operacoes de larga escala com limites personalizados e suporte dedicado.</p>
          </div>
          <button className="px-10 py-5 bg-accent hover:bg-accent-hover text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-glow transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap">
            Falar com Vendas
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Pricing() {
  return (
    <ThemeProvider>
      <PricingInner />
    </ThemeProvider>
  )
}
