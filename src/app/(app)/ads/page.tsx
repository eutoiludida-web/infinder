'use client'

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AdCard } from '@/components/ui/AdCard';
import { mockAds } from '@/lib/mockData';
import { Filter, Search as SearchIcon, ChevronDown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdsIntelligence() {
  const [activeTab, setActiveTab] = useState('todos');

  const tabs = [
    { id: 'todos', label: 'Todos', count: 234 },
    { id: 'meta', label: 'Meta Ads', count: 189 },
    { id: 'google', label: 'Google Ads', count: 45 },
    { id: 'winners', label: 'Winners', count: 12 },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black text-text-primary tracking-tight">Ads Intelligence</h1>
          <p className="text-text-secondary mt-2 font-medium">234 ads monitorados - 34 analisados com IA</p>
        </div>
        <button className="w-full sm:w-auto bg-accent hover:bg-accent-hover text-white px-8 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-glow transition-all hover:scale-[1.02] active:scale-[0.98]">
          <Sparkles size={20} />
          Analise em Massa
        </button>
      </header>

      {/* Filters Bar */}
      <div className="glass p-5 rounded-2xl flex flex-col lg:flex-row gap-5 items-stretch lg:items-center">
        <div className="relative flex-1 group">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" size={18} />
          <input
            type="text"
            placeholder="Buscar no texto do ad..."
            className="w-full bg-surface border border-border rounded-xl py-3 pl-12 pr-5 text-sm font-medium focus:outline-none focus:border-accent/30 focus:bg-surface-hover transition-all placeholder:text-text-muted"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          {['Concorrente', 'Status', 'Periodo'].map((filter) => (
            <button key={filter} className="flex-1 sm:flex-none px-5 py-3 bg-surface border border-border rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-between sm:justify-start gap-3 hover:bg-surface-hover hover:border-accent/30 transition-all">
              {filter} <ChevronDown size={16} className="text-text-muted" />
            </button>
          ))}
          <button className="p-3 bg-surface border border-border rounded-xl text-text-secondary hover:text-accent hover:bg-surface-hover transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-6 md:gap-10 overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "pb-5 text-sm font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap",
              activeTab === tab.id ? "text-accent" : "text-text-secondary hover:text-text-primary"
            )}
          >
            {tab.label}
            <span className={cn(
              "ml-3 text-[10px] px-2 py-0.5 rounded-full border transition-all",
              activeTab === tab.id ? "bg-accent/10 border-accent/20 text-accent" : "bg-surface border-border text-text-muted"
            )}>
              {tab.count}
            </span>
            {activeTab === tab.id && (
              <motion.span
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-accent rounded-full shadow-[0_0_10px_rgba(124,108,240,0.5)]"
              />
            )}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockAds.map(ad => (
          <AdCard key={ad.id} ad={ad} />
        ))}
        {/* Repeat mock ads to fill grid */}
        {mockAds.map(ad => (
          <AdCard key={`${ad.id}-copy`} ad={{...ad, id: `${ad.id}-copy`}} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap justify-center items-center gap-3 mt-16 pb-12">
        <button className="px-6 py-3 rounded-xl bg-surface border border-border text-sm font-bold text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-all disabled:opacity-30" disabled>Anterior</button>
        <div className="flex gap-3">
          <button className="w-12 h-12 rounded-xl bg-accent text-white font-black text-sm shadow-glow">1</button>
          <button className="w-12 h-12 rounded-xl bg-surface border border-border text-sm font-bold text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-all">2</button>
          <button className="w-12 h-12 rounded-xl bg-surface border border-border text-sm font-bold text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-all hidden sm:block">3</button>
          <span className="text-text-muted self-center font-bold">...</span>
          <button className="w-12 h-12 rounded-xl bg-surface border border-border text-sm font-bold text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-all">12</button>
        </div>
        <button className="px-6 py-3 rounded-xl bg-surface border border-border text-sm font-bold text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-all">Proximo</button>
      </div>
    </div>
  );
}
