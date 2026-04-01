'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { Shield, Sparkles, Save, Info, Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Brand } from '@/types';

export default function BrandConfig() {
  const tones = ['Formal', 'Casual', 'Tecnico', 'Divertido', 'Inspiracional', 'Urgente'];

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [brandId, setBrandId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [niche, setNiche] = useState('');
  const [toneOfVoice, setToneOfVoice] = useState('');
  const [targetAudience, setTargetAudience] = useState('');

  const identityScore = [name, niche, toneOfVoice, targetAudience].filter(v => v.trim().length > 0).length * 25;

  const fetchBrand = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch('/api/brands');
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Erro ao carregar marca');
      }
      const data: Brand[] = await res.json();
      if (data.length > 0) {
        const brand = data[0];
        setBrandId(brand.id);
        setName(brand.name || '');
        setNiche(brand.niche || '');
        setToneOfVoice(brand.tone_of_voice || '');
        setTargetAudience(brand.target_audience || '');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrand();
  }, [fetchBrand]);

  const handleToneChip = (tone: string) => {
    const current = toneOfVoice.trim();
    if (current.length > 0 && !current.endsWith(',') && !current.endsWith(', ')) {
      setToneOfVoice(current + ', ' + tone);
    } else {
      setToneOfVoice(current + tone);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setSaveError('O nome da marca e obrigatorio.');
      return;
    }
    setSaving(true);
    setSaveError(null);
    setSaved(false);

    const payload = {
      name: name.trim(),
      niche: niche.trim() || undefined,
      tone_of_voice: toneOfVoice.trim() || undefined,
      target_audience: targetAudience.trim() || undefined,
    };

    try {
      let res: Response;
      if (brandId) {
        res = await fetch(`/api/brands/${brandId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/brands', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Erro ao salvar marca');
      }

      const saved = await res.json();
      setBrandId(saved.id);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-10">
        <header>
          <h1 className="text-3xl md:text-4xl font-display font-black text-text-primary tracking-tight">Sua Marca</h1>
          <p className="text-text-secondary mt-2 font-medium">Carregando configuracoes...</p>
        </header>
        <div className="flex items-center justify-center py-20">
          <Loader2 size={36} className="animate-spin text-accent" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto space-y-10">
        <header>
          <h1 className="text-3xl md:text-4xl font-display font-black text-text-primary tracking-tight">Sua Marca</h1>
        </header>
        <div className="glass p-8 md:p-12 rounded-[2.5rem] text-center space-y-4">
          <p className="text-red-400 font-medium">{error}</p>
          <button
            onClick={() => { setLoading(true); fetchBrand(); }}
            className="bg-accent hover:bg-accent-hover text-white px-8 py-3 rounded-2xl font-black text-sm transition-all"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <header>
        <h1 className="text-3xl md:text-4xl font-display font-black text-text-primary tracking-tight">Sua Marca</h1>
        <p className="text-text-secondary mt-2 font-medium">Configure sua identidade para que a IA gere analises e sugestoes contextualizadas.</p>
      </header>

      {/* Identity Score */}
      <div className="glass rounded-[2rem] p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="relative w-16 h-16 shrink-0">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-border" />
            <circle
              cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4"
              strokeDasharray={`${(identityScore / 100) * 175.93} 175.93`}
              strokeLinecap="round"
              className="text-accent transition-all duration-700"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-display font-black text-accent">{identityScore}%</span>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-1">Identidade da Marca</p>
          <p className="text-sm text-text-secondary font-medium">
            {identityScore === 100 ? 'Perfil completo! A IA tera maximo contexto.' : 'Preencha todos os campos para maximizar a qualidade das analises.'}
          </p>
        </div>
      </div>

      <div className="glass rounded-[2.5rem] overflow-hidden group">
        <div className="p-8 md:p-12 space-y-10">
          {/* Brand Identity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Nome da Marca</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Nome da sua marca"
                className="w-full bg-surface border border-border rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-accent/50 focus:bg-surface-hover transition-all shadow-inner"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Nicho / Segmento</label>
              <input
                type="text"
                value={niche}
                onChange={e => setNiche(e.target.value)}
                placeholder="Ex: E-commerce de moda feminina"
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
                  <button
                    key={tone}
                    type="button"
                    onClick={() => handleToneChip(tone)}
                    className="text-[10px] font-bold px-4 py-1.5 bg-surface border border-border rounded-full hover:border-accent/50 hover:bg-accent/10 hover:text-accent transition-all uppercase tracking-widest"
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              rows={4}
              value={toneOfVoice}
              onChange={e => setToneOfVoice(e.target.value)}
              placeholder="Descreva o tom de voz da sua marca..."
              className="w-full bg-surface border border-border rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-accent/50 focus:bg-surface-hover transition-all resize-none shadow-inner leading-relaxed"
            />
          </div>

          {/* Target Audience */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Publico-alvo Detalhado</label>
            <textarea
              rows={4}
              value={targetAudience}
              onChange={e => setTargetAudience(e.target.value)}
              placeholder="Descreva seu publico-alvo em detalhes..."
              className="w-full bg-surface border border-border rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-accent/50 focus:bg-surface-hover transition-all resize-none shadow-inner leading-relaxed"
            />
          </div>

          {saveError && (
            <p className="text-red-400 text-sm font-medium">{saveError}</p>
          )}

          <div className="pt-6 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving || !name.trim()}
              className="w-full sm:w-auto bg-accent hover:bg-accent-hover text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-glow transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
            >
              {saving ? (
                <Loader2 size={20} className="animate-spin" />
              ) : saved ? (
                <Check size={20} />
              ) : (
                <Save size={20} />
              )}
              {saving ? 'Salvando...' : saved ? 'Salvo!' : 'Salvar Configuracoes'}
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
