'use client'

import React from 'react';
import { mockCompetitors } from '@/lib/mockData';
import { Plus, MoreVertical, Play, ExternalLink, Calendar, BarChart2 } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';

export default function Competitors() {
  return (
    <div className="space-y-10">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black text-text-primary tracking-tight">Concorrentes</h1>
          <p className="text-text-secondary mt-2 font-medium">Gerencie as marcas que voce esta monitorando (3/10 do seu plano)</p>
        </div>
        <button className="w-full sm:w-auto bg-accent hover:bg-accent-hover text-white px-8 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-glow transition-all hover:scale-[1.02] active:scale-[0.98]">
          <Plus size={20} />
          Adicionar Concorrente
        </button>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {mockCompetitors.map((comp) => (
          <div key={comp.id} className="glass p-6 md:p-8 rounded-[2rem] group hover:border-accent/30 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[80px] -z-10 group-hover:bg-accent/10 transition-all duration-700" />
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Avatar & Info */}
              <div className="flex gap-6 flex-1 w-full">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-accent/10 border border-accent/20 flex items-center justify-center text-2xl md:text-3xl font-display font-black text-accent shrink-0 shadow-xl group-hover:scale-110 transition-transform duration-500">
                  {comp.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-center justify-between sm:justify-start gap-4">
                    <h3 className="text-xl md:text-2xl font-display font-bold text-text-primary truncate">{comp.name}</h3>
                    <button className="p-2 text-text-muted hover:text-text-primary hover:bg-surface rounded-xl transition-all">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3">
                    {comp.metaPageId && (
                      <span className="text-xs font-bold text-text-secondary flex items-center gap-2 uppercase tracking-widest">
                        <span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(124,108,240,0.5)]" />
                        Meta: @{comp.metaPageId}
                      </span>
                    )}
                    {comp.googleDomain && (
                      <span className="text-xs font-bold text-text-secondary flex items-center gap-2 uppercase tracking-widest">
                        <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                        Google: {comp.googleDomain}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-6 sm:gap-12 w-full lg:w-auto px-0 lg:px-12 border-y lg:border-y-0 lg:border-x border-border py-6 lg:py-0 justify-between lg:justify-start">
                <div className="text-center flex-1 lg:flex-none">
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">Total Ads</p>
                  <p className="text-xl md:text-2xl font-display font-black text-text-primary">{comp.adCount}</p>
                </div>
                <div className="text-center flex-1 lg:flex-none">
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">Novos (7d)</p>
                  <p className="text-xl md:text-2xl font-display font-black text-success">+{comp.newAdsLast7Days}</p>
                </div>
                <div className="text-center flex-1 lg:flex-none">
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">Score Medio</p>
                  <p className="text-xl md:text-2xl font-display font-black text-accent">{comp.averageScore}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-row lg:flex-col gap-3 w-full lg:min-w-[180px]">
                <button className="flex-1 lg:w-full py-3.5 bg-accent text-white text-xs font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 hover:bg-accent-hover shadow-glow transition-all hover:scale-[1.02] active:scale-[0.98]">
                  <Play size={16} fill="currentColor" />
                  Rodar Pipeline
                </button>
                <button className="flex-1 lg:w-full py-3.5 bg-surface border border-border text-text-primary text-xs font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 hover:bg-surface-hover transition-all">
                  <ExternalLink size={16} />
                  Ver Ads
                </button>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 text-[10px] font-bold text-text-muted uppercase tracking-widest">
              <div className="flex flex-wrap gap-6">
                <span className="flex items-center gap-2"><Calendar size={14} className="text-accent" /> Ultimo scan: {formatDate(comp.lastScan)}</span>
                <span className="flex items-center gap-2"><BarChart2 size={14} className="text-accent" /> Monitorando desde Jan/2026</span>
              </div>
              <span className="text-success flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(0,217,163,0.5)]" />
                Radar Ativo
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
