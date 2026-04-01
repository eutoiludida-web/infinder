'use client'

import Link from 'next/link'
import { Sparkles, Video, Megaphone, CheckCircle, ArrowRight, Play, AtSign, MessageSquare } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

export default function Landing() {
  return (
    <div className="min-h-screen bg-paper text-ink font-sans selection:bg-accent selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-xl z-50 border-b border-line">
        <div className="max-w-screen-2xl mx-auto px-8 h-24 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent rounded-sm flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tighter">INFInder</span>
          </div>
          <div className="hidden lg:flex items-center gap-12 text-[11px] font-bold uppercase tracking-widest text-muted">
            <a href="#features" className="hover:text-accent transition-colors">Inteligência</a>
            <a href="#how-it-works" className="hover:text-accent transition-colors">Metodologia</a>
            <a href="#pricing" className="hover:text-accent transition-colors">Acesso</a>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/auth" className="text-[11px] font-bold uppercase tracking-widest text-muted hover:text-ink">Entrar</Link>
            <Link href="/dashboard" className="bg-ink text-white px-8 py-3 rounded-sm text-[11px] font-bold uppercase tracking-widest hover:bg-accent transition-all">
              Obter Acesso
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-48 pb-32 px-8 overflow-hidden">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="mb-8 flex items-center gap-4">
                <div className="h-px w-12 bg-accent" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">Motor de Inteligência Viral</span>
              </div>
              <h1 className="text-[12vw] lg:text-[100px] font-display font-bold leading-[0.85] tracking-tighter mb-10 uppercase">
                Decifre a <br />
                <span className="text-accent">Viralidade.</span> <br />
                Escala Rápida.
              </h1>
              <p className="text-xl text-muted max-w-lg mb-12 leading-relaxed font-light">
                INFInder usa análise neural avançada para dissecar padrões virais em redes sociais, entregando roteiros de alta fidelidade e inteligência competitiva para o criador moderno.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Link href="/dashboard" className="w-full sm:w-auto bg-ink text-white px-12 py-5 rounded-sm text-[11px] font-bold uppercase tracking-widest hover:bg-accent transition-all flex items-center justify-center gap-3 group">
                  Iniciar Análise <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="w-full sm:w-auto border border-line px-12 py-5 rounded-sm text-[11px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
                  <Play className="w-4 h-4 fill-current" /> Ver Demo
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, duration: 1, ease: [0.23, 1, 0.32, 1] }}
              className="relative"
            >
              <div className="absolute -inset-10 bg-accent/5 blur-[120px] rounded-full -z-10" />
              <div className="bg-white rounded-sm shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-line overflow-hidden transform hover:scale-[1.02] transition-transform duration-700">
                <div className="h-12 bg-slate-50 border-b border-line flex items-center px-6 gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-200" />
                  <div className="w-2 h-2 rounded-full bg-slate-200" />
                  <div className="w-2 h-2 rounded-full bg-slate-200" />
                </div>
                <div className="w-full h-[400px] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Sparkles className="w-12 h-12 text-accent mx-auto" />
                    <p className="text-muted text-sm font-display uppercase tracking-widest">INFInder Dashboard</p>
                  </div>
                </div>
              </div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-10 -left-10 bg-white p-6 rounded-sm border border-line shadow-2xl hidden md:block"
              >
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Análise em Tempo Real</span>
                </div>
                <div className="text-3xl font-display font-bold">98.4%</div>
                <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Taxa de Precisão</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-y border-line">
        <div className="max-w-screen-2xl mx-auto grid md:grid-cols-3">
          {[
            { icon: Video, title: 'Decodificação de Padrões', number: '01', desc: 'Análise neural de hooks, curvas de retenção e estruturas narrativas do top 1% de conteúdo.' },
            { icon: Sparkles, title: 'Síntese de Scripts', number: '02', desc: 'Geração de roteiros via IA que adapta mecânicas virais à voz única da sua marca.' },
            { icon: Megaphone, title: 'Inteligência de Ads', number: '03', desc: 'Monitoramento em tempo real de ativos criativos de alta performance no ecossistema Meta.' },
          ].map((f, i) => (
            <div key={i} className={cn('p-16 border-line group hover:bg-ink transition-colors duration-500', i !== 2 && 'md:border-r')}>
              <div className="flex justify-between items-start mb-12">
                <div className="w-12 h-12 bg-slate-50 rounded-sm flex items-center justify-center group-hover:bg-accent transition-colors">
                  <f.icon className="w-5 h-5 text-ink group-hover:text-white" />
                </div>
                <span className="font-display text-4xl font-bold text-slate-100 group-hover:text-white/10 transition-colors">{f.number}</span>
              </div>
              <h3 className="text-2xl font-display font-bold mb-6 group-hover:text-white transition-colors uppercase tracking-tight">{f.title}</h3>
              <p className="text-muted group-hover:text-white/60 transition-colors leading-relaxed font-light">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 px-8 bg-slate-50">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-8">
            <div className="max-w-2xl">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent mb-4 block">Investimento</span>
              <h2 className="text-6xl font-display font-bold tracking-tighter uppercase">Selecione seu <br /> Nível de Acesso</h2>
            </div>
            <p className="text-muted max-w-sm font-light">
              Preços transparentes para criadores e agências. Sem taxas ocultas. Dimensione sua inteligência conforme cresce.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-px bg-line border border-line">
            {[
              { name: 'Starter', price: '97', analyses: '50', scripts: '10', brands: '1' },
              { name: 'Profissional', price: '197', analyses: '200', scripts: '50', brands: '3', popular: true },
              { name: 'Enterprise', price: '497', analyses: '600', scripts: '150', brands: '9' },
            ].map((p, i) => (
              <div key={i} className="bg-white p-16 flex flex-col group hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-center mb-12">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted group-hover:text-accent transition-colors">{p.name}</h3>
                  {p.popular && <span className="text-[9px] font-bold uppercase tracking-widest bg-accent text-white px-3 py-1 rounded-full">Mais Selecionado</span>}
                </div>
                <div className="flex items-baseline gap-2 mb-16">
                  <span className="text-7xl font-display font-bold tracking-tighter">R${p.price}</span>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-muted">/mês</span>
                </div>
                <ul className="space-y-6 mb-16 flex-1">
                  {[`${p.analyses} Análises Neurais`, `${p.scripts} Gerações de Script`, `${p.brands} Perfil de Marca`, 'Suporte Prioritário'].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-muted">
                      <div className="w-1 h-1 bg-accent rounded-full" /> {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/auth" className={cn('w-full py-5 rounded-sm text-[11px] font-bold uppercase tracking-widest transition-all text-center', p.popular ? 'bg-accent text-white hover:bg-ink' : 'bg-ink text-white hover:bg-accent')}>
                  Começar Agora
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink text-white py-32 px-8">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-32 mb-32">
            <div>
              <div className="flex items-center gap-3 mb-12">
                <div className="w-8 h-8 bg-accent rounded-sm flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-display font-bold text-3xl tracking-tighter">INFInder</span>
              </div>
              <h4 className="text-4xl font-display font-bold tracking-tighter uppercase mb-12 max-w-md">
                O futuro do conteúdo é guiado por inteligência.
              </h4>
              <div className="flex gap-8">
                <AtSign className="w-5 h-5 text-white/40 hover:text-accent cursor-pointer transition-colors" />
                <MessageSquare className="w-5 h-5 text-white/40 hover:text-accent cursor-pointer transition-colors" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-20">
              <div>
                <h5 className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-10">Plataforma</h5>
                <ul className="space-y-6 text-[11px] font-bold uppercase tracking-widest">
                  <li><a href="#" className="hover:text-accent transition-colors">Inteligência</a></li>
                  <li><a href="#" className="hover:text-accent transition-colors">Metodologia</a></li>
                  <li><a href="#" className="hover:text-accent transition-colors">Preços</a></li>
                </ul>
              </div>
              <div>
                <h5 className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-10">Legal</h5>
                <ul className="space-y-6 text-[11px] font-bold uppercase tracking-widest">
                  <li><a href="#" className="hover:text-accent transition-colors">Privacidade</a></li>
                  <li><a href="#" className="hover:text-accent transition-colors">Termos</a></li>
                  <li><a href="#" className="hover:text-accent transition-colors">Segurança</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-16 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-bold uppercase tracking-widest text-white/20">
            <span>© 2026 INFInder. Todos os direitos reservados.</span>
            <div className="flex gap-12">
              <span>Feito para o 1%</span>
              <span>v2.4.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
