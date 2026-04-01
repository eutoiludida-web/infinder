'use client'

import React from 'react';
import { StatCard } from '@/components/ui/StatCard';
import { AdCard } from '@/components/ui/AdCard';
import { UsageMeter } from '@/components/ui/UsageMeter';
import { mockAds, mockUserPlan } from '@/lib/mockData';
import {
  Eye,
  Users,
  BrainCircuit,
  Target,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Dashboard() {
  const winners = mockAds.filter(ad => ad.isWinner);
  const recentAds = mockAds.slice(0, 3);

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black text-text-primary tracking-tight">Bom dia, Annie</h1>
          <p className="text-text-secondary mt-2 font-medium">Aqui esta o que mudou no radar dos seus concorrentes hoje.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-accent/10 border border-accent/20 text-accent text-xs font-bold flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Radar Ativo
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Ads Monitorados"
          value="298"
          icon={Eye}
          trend={{ value: 12, isUp: true }}
        />
        <StatCard
          title="Concorrentes"
          value="3"
          icon={Users}
        />
        <StatCard
          title="Analises IA"
          value="34"
          icon={BrainCircuit}
          trend={{ value: 5, isUp: true }}
        />
        <StatCard
          title="Score Medio"
          value="7.4"
          icon={Target}
          trend={{ value: 2, isUp: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content: Winners */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-display font-bold flex items-center gap-3">
              Winners Detectados
              <span className="text-[10px] font-black text-warning bg-warning/10 px-3 py-1 rounded-full border border-warning/20 uppercase tracking-widest">
                Ativos 30+ dias
              </span>
            </h2>
            <button className="text-sm font-bold text-accent hover:text-accent-hover flex items-center gap-2 group transition-colors">
              Ver todos <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {winners.map(ad => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
        </div>

        {/* Sidebar: Usage & Recent */}
        <div className="space-y-10">
          <section className="glass p-8 rounded-[2rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl -z-10 group-hover:bg-accent/10 transition-all" />
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-secondary mb-8">Uso do Plano</h3>
            <div className="space-y-8">
              <UsageMeter label="Ads Monitorados" used={mockUserPlan.adsUsed} limit={mockUserPlan.adsLimit} />
              <UsageMeter label="Analises IA" used={mockUserPlan.analysisUsed} limit={mockUserPlan.analysisLimit} />
              <UsageMeter label="Concorrentes" used={mockUserPlan.competitorUsed} limit={mockUserPlan.competitorLimit} />
            </div>
            <button className="w-full mt-10 py-4 bg-accent hover:bg-accent-hover text-white text-sm font-black rounded-2xl shadow-glow transition-all hover:scale-[1.02] active:scale-[0.98]">
              Fazer Upgrade
            </button>
          </section>

          <section className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-secondary">Atividade Recente</h3>
            <div className="space-y-4">
              {recentAds.map((ad, i) => (
                <div key={ad.id} className="flex gap-5 p-4 rounded-2xl hover:bg-surface border border-transparent hover:border-border-subtle transition-all cursor-pointer group">
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-border-subtle shadow-lg">
                    <img src={ad.thumbnailUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" />
                  </div>
                  <div className="min-w-0 flex flex-col justify-center">
                    <p className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors truncate">
                      Novo ad: {ad.competitorName}
                    </p>
                    <p className="text-[10px] font-bold text-text-muted mt-1.5 uppercase tracking-widest">Detectado ha {i + 2} horas - {ad.platform}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
