'use client'

import React from 'react';
import { Shield, Sparkles, Save, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BrandConfig() {
  const tones = ['Formal', 'Casual', 'Tecnico', 'Divertido', 'Inspiracional', 'Urgente'];

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <header>
        <h1 className="text-3xl md:text-4xl font-display font-black text-text-primary tracking-tight">Sua Marca</h1>
        <p className="text-text-secondary mt-2 font-medium">Configure sua identidade para que a IA gere analises e sugestoes contextualizadas.</p>
      </header>

      <div className="glass rounded-[2.5rem] overflow-hidden group">
        <div className="p-8 md:p-12 space-y-10">
          {/* Brand Identity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Nome da Marca</label>
              <input
                type="text"
                defaultValue="Minha Marca"
                className="w-full bg-surface border border-border rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-accent/50 focus:bg-surface-hover transition-all shadow-inner"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Nicho / Segmento</label>
              <input
                type="text"
                defaultValue="E-commerce de moda feminina"
                className="w-full bg-surface border border-border rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-accent/50 focus:bg-surface-hover transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Tone of Voice */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Tom de Voz</label>
              <div className="flex flex-wrap gap-2">
                {tones.map(tone => (
                  <button key={tone} className="text-[10px] font-bold px-4 py-1.5 bg-surface border border-border rounded-full hover:border-accent/50 hover:bg-accent/10 hover:text-accent transition-all uppercase tracking-widest">
                    {tone}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              rows={4}
              defaultValue="Jovem, descontraido, usa girias. Fala direto com mulheres de 20 a 35 anos que buscam estilo e conforto."
              className="w-full bg-surface border border-border rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-accent/50 focus:bg-surface-hover transition-all resize-none shadow-inner leading-relaxed"
            />
          </div>

          {/* Target Audience */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Publico-alvo Detalhado</label>
            <textarea
              rows={4}
              defaultValue="Mulheres de 25 a 40 anos, residentes em grandes centros urbanos, classe B, interessadas em moda sustentavel, lifestyle e que consomem conteudo no Instagram e TikTok."
              className="w-full bg-surface border border-border rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-accent/50 focus:bg-surface-hover transition-all resize-none shadow-inner leading-relaxed"
            />
          </div>

          <div className="pt-6 flex justify-end">
            <button className="w-full sm:w-auto bg-accent hover:bg-accent-hover text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-glow transition-all hover:scale-[1.02] active:scale-[0.98]">
              <Save size={20} />
              Salvar Configuracoes
            </button>
          </div>
        </div>

        {/* Info Footer */}
        <div className="bg-surface p-8 md:p-10 border-t border-border flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-500">
            <Sparkles size={28} />
          </div>
          <div className="text-center sm:text-left">
            <h4 className="text-lg font-display font-bold text-text-primary">Por que configurar isso?</h4>
            <p className="text-sm text-text-secondary mt-2 leading-relaxed font-medium">
              Nossa IA utiliza esses dados para comparar os anuncios dos seus concorrentes com a sua propria estrategia.
              Isso permite identificar lacunas no mercado e sugerir criativos que ressoam especificamente com o SEU publico.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-accent/5 border border-accent/20 rounded-3xl p-8 flex items-start gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-accent/5 to-transparent -z-10" />
        <Info size={24} className="text-accent mt-0.5 shrink-0" />
        <p className="text-sm text-text-secondary leading-relaxed font-medium">
          <strong className="text-accent font-black uppercase tracking-widest mr-2">Dica:</strong> Quanto mais detalhado for o seu publico-alvo, mais precisas serao as sugestoes de &quot;Melhoria de Criativo&quot; que a IA ira gerar nos detalhes de cada anuncio.
        </p>
      </div>
    </div>
  );
}
