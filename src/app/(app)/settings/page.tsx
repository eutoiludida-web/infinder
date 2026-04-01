'use client'

import { User, Bell, Shield, CreditCard, HelpCircle, Globe, Smartphone, Settings as SettingsIcon, ChevronRight } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

export default function Settings() {
  const sections = [
    { id: 'profile', icon: User, label: 'Perfil', desc: 'Gerencie suas informacoes pessoais e foto.' },
    { id: 'notifications', icon: Bell, label: 'Notificacoes', desc: 'Escolha como e quando deseja ser notificado.' },
    { id: 'security', icon: Shield, label: 'Seguranca', desc: 'Senha, autenticacao de dois fatores e sessoes.' },
    { id: 'billing', icon: CreditCard, label: 'Faturamento', desc: 'Planos, historico de pagamentos e cartoes.' },
    { id: 'integrations', icon: Globe, label: 'Integracoes', desc: 'Conecte suas contas do Instagram e TikTok.' },
    { id: 'support', icon: HelpCircle, label: 'Suporte', desc: 'Central de ajuda e contato com a equipe.' },
  ]

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-black/10 pb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">
            <SettingsIcon className="w-3 h-3 text-accent" />
            Preferencias do Sistema
          </div>
          <h1 className="text-5xl font-display font-bold uppercase tracking-tight text-black">Configuracoes</h1>
          <p className="text-black/60 max-w-xl font-sans leading-relaxed">
            Gerencie sua conta, protocolos de seguranca e preferencias da plataforma.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sidebar Nav */}
        <div className="lg:col-span-4 space-y-px bg-black/10 border border-black/10">
          {sections.map((s) => (
            <button
              key={s.id}
              className={cn(
                "w-full flex items-center justify-between p-6 transition-all text-left group",
                s.id === 'profile' ? "bg-black text-white" : "bg-white text-black/40 hover:text-black"
              )}
            >
              <div className="flex items-center gap-4">
                <s.icon className="w-4 h-4" />
                <div>
                  <p className="font-mono uppercase tracking-widest text-[10px] font-bold">{s.label}</p>
                  <p className={cn(
                    "text-[10px] font-sans mt-1 line-clamp-1",
                    s.id === 'profile' ? "text-white/60" : "text-black/40"
                  )}>{s.desc}</p>
                </div>
              </div>
              <ChevronRight className={cn(
                "w-4 h-4 transition-transform group-hover:translate-x-1",
                s.id === 'profile' ? "text-white/40" : "text-black/10"
              )} />
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-8 space-y-12">
          <div className="bg-white border border-black/10 p-10 space-y-12">
            <div className="flex items-center gap-8">
              <div className="relative">
                <div className="w-24 h-24 bg-black/5 border border-black/10 flex items-center justify-center grayscale">
                  <User className="w-10 h-10 text-black/20" />
                </div>
                <button className="absolute -bottom-2 -right-2 p-2 bg-black text-white border border-black hover:bg-white hover:text-black transition-all">
                  <Smartphone className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-display font-bold uppercase text-black">Annie 100F</h3>
                <p className="text-black/40 font-bold text-xs">annie@100fronteiras.com</p>
                <div className="pt-2">
                  <span className="px-2 py-1 bg-emerald-500 text-white text-[8px] font-bold uppercase tracking-widest">Conta Verificada</span>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/40">Nome Completo</label>
                <input
                  type="text"
                  defaultValue="Annie 100F"
                  className="w-full bg-transparent border-b border-black/10 py-2 font-sans focus:outline-none focus:border-black transition-colors"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/40">Endereco de Email</label>
                <input
                  type="email"
                  defaultValue="annie@100fronteiras.com"
                  className="w-full bg-transparent border-b border-black/10 py-2 font-sans focus:outline-none focus:border-black transition-colors"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/40">Idioma</label>
                <select className="w-full bg-transparent border-b border-black/10 py-2 font-sans focus:outline-none focus:border-black transition-colors appearance-none cursor-pointer">
                  <option>Portugues (Brasil)</option>
                  <option>English (US)</option>
                  <option>Espanol</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/40">Fuso Horario</label>
                <select className="w-full bg-transparent border-b border-black/10 py-2 font-sans focus:outline-none focus:border-black transition-colors appearance-none cursor-pointer">
                  <option>(GMT-03:00) Sao Paulo</option>
                  <option>(GMT-05:00) New York</option>
                </select>
              </div>
            </div>

            <div className="pt-10 border-t border-black/5 flex justify-end">
              <button className="px-10 py-4 bg-black text-white font-bold uppercase tracking-[0.2em] text-xs hover:bg-transparent hover:text-black border border-black transition-all">
                Salvar Alteracoes
              </button>
            </div>
          </div>

          <div className="bg-red-50/50 border border-red-100 p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <h4 className="text-red-900 font-display font-bold uppercase text-xl">Zona de Perigo</h4>
              <p className="text-red-600/60 text-xs font-sans">Excluir sua conta removera permanentemente todos os seus dados e ativos.</p>
            </div>
            <button className="px-8 py-3 bg-white border border-red-200 text-red-600 font-bold uppercase tracking-widest text-[10px] hover:bg-red-600 hover:text-white transition-all">
              Excluir Conta
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
