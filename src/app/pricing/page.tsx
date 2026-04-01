'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Sparkles, CreditCard, ArrowRight, Loader2 } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

export default function Pricing() {
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
      desc: 'Projetado para profissionais que escalam sua producao diaria e consistencia.',
      popular: true
    },
    {
      name: 'Agencia',
      slug: 'agency' as const,
      price: '497',
      analyses: '600',
      scripts: '150',
      brands: '9',
      desc: 'A solucao completa para agencias que gerenciam portfolios de clientes de alto volume.'
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
    <div className="max-w-6xl mx-auto py-12 px-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-black/10 pb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">
            <CreditCard className="w-3 h-3 text-accent" />
            Planos de Assinatura
          </div>
          <h1 className="text-5xl font-display font-bold uppercase tracking-tight text-black">Precos</h1>
          <p className="text-black/60 max-w-xl font-sans leading-relaxed">
            Escolha o plano perfeito para acelerar sua performance com insights baseados em IA e dados de mercado em tempo real.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-black/10 border border-black/10 mb-20">
        {plans.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "p-10 bg-white transition-all relative flex flex-col group",
              p.popular && "z-10 ring-1 ring-black"
            )}
          >
            {p.popular && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-black" />
            )}

            <div className="mb-10">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-3xl font-display font-bold uppercase tracking-tight text-black">{p.name}</h3>
                {p.popular && (
                  <span className="px-2 py-1 bg-black text-white text-[8px] font-bold uppercase tracking-widest">Mais Popular</span>
                )}
              </div>
              <p className="text-black/40 text-xs font-sans leading-relaxed">{p.desc}</p>
            </div>

            <div className="flex items-baseline gap-2 mb-10">
              <span className="text-5xl font-bold text-black tracking-tighter">R${p.price}</span>
              <span className="text-black/40 font-bold text-[10px] uppercase tracking-widest">/ mes</span>
            </div>

            <ul className="space-y-4 mb-12 flex-1">
              {[
                `${p.analyses} analises de video / mes`,
                `${p.scripts} roteiros gerados / mes`,
                `${p.brands} configuracao de marca`,
                'Monitoramento de concorrentes',
                'Inteligencia de Ads basica',
                'Suporte prioritario via chat'
              ].map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3 text-black/60 text-[11px] font-bold uppercase tracking-wider">
                  <Check className="w-3 h-3 text-emerald-500" />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(p.slug)}
              disabled={subscribingPlan !== null}
              className={cn(
                "w-full py-5 font-bold uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 group border",
                p.popular
                  ? "bg-black text-white border-black hover:bg-white hover:text-black"
                  : "bg-white text-black border-black/10 hover:border-black",
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

      <div className="bg-black p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-black">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-3xl font-display font-bold uppercase text-white">Precisa de uma solucao customizada?</h3>
          <p className="text-white/40 text-sm font-sans max-w-xl">Oferecemos planos Enterprise para operacoes de larga escala com limites personalizados e suporte dedicado.</p>
        </div>
        <button className="px-10 py-5 bg-white text-black font-bold uppercase tracking-[0.2em] text-xs hover:bg-black hover:text-white border border-white transition-all whitespace-nowrap">
          Falar com Vendas
        </button>
      </div>
    </div>
  )
}
