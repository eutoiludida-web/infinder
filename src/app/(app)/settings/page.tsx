'use client'

import { User, Bell, Shield, CreditCard, HelpCircle, Globe, Smartphone, Settings as SettingsIcon, ChevronRight } from 'lucide-react'
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
              className={cn(
                "w-full flex items-center justify-between p-5 rounded-2xl transition-all text-left group",
                s.id === 'profile' ? "glass text-text-primary" : "text-text-muted hover:bg-surface hover:text-text-primary"
              )}
            >
              <div className="flex items-center gap-4">
                <s.icon className={cn("w-5 h-5", s.id === 'profile' ? "text-accent" : "text-text-muted group-hover:text-accent")} />
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
          <div className="glass p-8 md:p-10 rounded-[2rem] space-y-10">
            <div className="flex items-center gap-8">
              <div className="relative">
                <div className="w-24 h-24 bg-surface border border-border rounded-2xl flex items-center justify-center">
                  <User className="w-10 h-10 text-text-muted" />
                </div>
                <button className="absolute -bottom-2 -right-2 p-2 bg-accent text-white rounded-xl shadow-glow hover:scale-110 transition-transform">
                  <Smartphone className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-display font-bold text-text-primary">Annie 100F</h3>
                <p className="text-text-muted font-bold text-xs">annie@100fronteiras.com</p>
                <div className="pt-2">
                  <span className="px-3 py-1 bg-success/10 text-success text-[8px] font-black uppercase tracking-widest rounded-full border border-success/20">Conta Verificada</span>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Nome Completo</label>
                <input
                  type="text"
                  defaultValue="Annie 100F"
                  className="w-full bg-surface border border-border rounded-2xl py-3 px-5 text-sm focus:outline-none focus:border-accent/50 transition-all"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Endereco de Email</label>
                <input
                  type="email"
                  defaultValue="annie@100fronteiras.com"
                  className="w-full bg-surface border border-border rounded-2xl py-3 px-5 text-sm focus:outline-none focus:border-accent/50 transition-all"
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
          </div>

          <div className="bg-danger/5 border border-danger/20 rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <h4 className="text-danger font-display font-bold text-xl">Zona de Perigo</h4>
              <p className="text-danger/60 text-xs">Excluir sua conta removera permanentemente todos os seus dados e ativos.</p>
            </div>
            <button className="px-8 py-3 bg-surface border border-danger/20 text-danger font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-danger hover:text-white transition-all">
              Excluir Conta
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
