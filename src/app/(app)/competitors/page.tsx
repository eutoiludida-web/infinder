'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, MoreVertical, Play, ExternalLink, Calendar, BarChart2, X, Trash2, Loader2 } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import type { Competitor } from '@/types';

export default function Competitors() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [pipelineLoadingId, setPipelineLoadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formMeta, setFormMeta] = useState('');
  const [formGoogle, setFormGoogle] = useState('');

  const fetchCompetitors = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch('/api/competitors');
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Erro ao carregar concorrentes');
      }
      const data = await res.json();
      setCompetitors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompetitors();
  }, [fetchCompetitors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMeta.trim() && !formGoogle.trim()) {
      setFormError('Informe pelo menos um: Meta Page ID ou Google Domain');
      return;
    }
    setFormLoading(true);
    setFormError(null);
    try {
      const res = await fetch('/api/competitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName.trim(),
          meta_page_id: formMeta.trim() || undefined,
          google_domain: formGoogle.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Erro ao adicionar concorrente');
      }
      const created = await res.json();
      setCompetitors(prev => [created, ...prev]);
      setShowForm(false);
      setFormName('');
      setFormMeta('');
      setFormGoogle('');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este concorrente?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/competitors/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Erro ao remover concorrente');
      }
      setCompetitors(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao remover concorrente');
    } finally {
      setDeletingId(null);
    }
  };

  const handlePipeline = async (id: string) => {
    setPipelineLoadingId(id);
    try {
      const res = await fetch('/api/pipeline/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competitorId: id }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Erro ao rodar pipeline');
      }
      const result = await res.json();
      const metaCount = result.metaAdsCount ?? result.meta_ads_count ?? 0;
      const googleCount = result.googleAdsCount ?? result.google_ads_count ?? 0;
      alert(`Pipeline concluido! ${metaCount} ads Meta + ${googleCount} ads Google encontrados.`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao rodar pipeline');
    } finally {
      setPipelineLoadingId(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-10">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-black text-text-primary tracking-tight">Concorrentes</h1>
            <p className="text-text-secondary mt-2 font-medium">Carregando seus concorrentes...</p>
          </div>
        </header>
        <div className="flex items-center justify-center py-20">
          <Loader2 size={36} className="animate-spin text-accent" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-10">
        <header>
          <h1 className="text-3xl md:text-4xl font-display font-black text-text-primary tracking-tight">Concorrentes</h1>
        </header>
        <div className="glass p-8 md:p-12 rounded-[2rem] text-center space-y-4">
          <p className="text-red-400 font-medium">{error}</p>
          <button
            onClick={() => { setLoading(true); fetchCompetitors(); }}
            className="bg-accent hover:bg-accent-hover text-white px-8 py-3 rounded-2xl font-black text-sm transition-all"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black text-text-primary tracking-tight">Concorrentes</h1>
          <p className="text-text-secondary mt-2 font-medium">Gerencie as marcas que voce esta monitorando ({competitors.length} cadastrados)</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto bg-accent hover:bg-accent-hover text-white px-8 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-glow transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus size={20} />
          Adicionar Concorrente
        </button>
      </header>

      {/* Add Competitor Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="glass rounded-[2rem] p-8 md:p-10 w-full max-w-lg space-y-6 relative" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display font-bold text-text-primary">Novo Concorrente</h2>
              <button onClick={() => setShowForm(false)} className="p-2 text-text-muted hover:text-text-primary hover:bg-surface rounded-xl transition-all">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Nome *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="Nome do concorrente"
                  className="w-full bg-surface border border-border rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-accent/50 focus:bg-surface-hover transition-all shadow-inner"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Meta Page ID (opcional)</label>
                <input
                  type="text"
                  value={formMeta}
                  onChange={e => setFormMeta(e.target.value)}
                  placeholder="ex: marca_oficial"
                  className="w-full bg-surface border border-border rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-accent/50 focus:bg-surface-hover transition-all shadow-inner"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Google Domain (opcional)</label>
                <input
                  type="text"
                  value={formGoogle}
                  onChange={e => setFormGoogle(e.target.value)}
                  placeholder="ex: marca.com.br"
                  className="w-full bg-surface border border-border rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-accent/50 focus:bg-surface-hover transition-all shadow-inner"
                />
              </div>

              {formError && (
                <p className="text-red-400 text-sm font-medium">{formError}</p>
              )}

              <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">* Preencha pelo menos Meta Page ID ou Google Domain</p>

              <button
                type="submit"
                disabled={formLoading || !formName.trim()}
                className="w-full bg-accent hover:bg-accent-hover text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-glow transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
              >
                {formLoading ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
                {formLoading ? 'Adicionando...' : 'Adicionar'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Empty state */}
      {competitors.length === 0 && (
        <div className="glass p-12 md:p-16 rounded-[2rem] text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto">
            <BarChart2 size={36} className="text-accent" />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-text-primary">Nenhum concorrente monitorado</h3>
            <p className="text-text-secondary mt-2 font-medium">Adicione seu primeiro concorrente para comecar a monitorar os ads dele.</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-accent hover:bg-accent-hover text-white px-10 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-glow transition-all hover:scale-[1.02] active:scale-[0.98] mx-auto"
          >
            <Plus size={24} />
            Adicionar Concorrente
          </button>
        </div>
      )}

      {/* Competitor cards */}
      <div className="grid grid-cols-1 gap-8">
        {competitors.map((comp) => (
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
                    <button
                      onClick={() => handleDelete(comp.id)}
                      disabled={deletingId === comp.id}
                      className="p-2 text-text-muted hover:text-red-400 hover:bg-surface rounded-xl transition-all"
                    >
                      {deletingId === comp.id ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3">
                    {comp.meta_page_id && (
                      <span className="text-xs font-bold text-text-secondary flex items-center gap-2 uppercase tracking-widest">
                        <span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(124,108,240,0.5)]" />
                        Meta: @{comp.meta_page_id}
                      </span>
                    )}
                    {comp.google_domain && (
                      <span className="text-xs font-bold text-text-secondary flex items-center gap-2 uppercase tracking-widest">
                        <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                        Google: {comp.google_domain}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-6 sm:gap-12 w-full lg:w-auto px-0 lg:px-12 border-y lg:border-y-0 lg:border-x border-border py-6 lg:py-0 justify-between lg:justify-start">
                <div className="text-center flex-1 lg:flex-none">
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">Total Ads</p>
                  <p className="text-xl md:text-2xl font-display font-black text-text-primary">&mdash;</p>
                </div>
                <div className="text-center flex-1 lg:flex-none">
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">Novos (7d)</p>
                  <p className="text-xl md:text-2xl font-display font-black text-success">&mdash;</p>
                </div>
                <div className="text-center flex-1 lg:flex-none">
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">Score Medio</p>
                  <p className="text-xl md:text-2xl font-display font-black text-accent">&mdash;</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-row lg:flex-col gap-3 w-full lg:min-w-[180px]">
                <button
                  onClick={() => handlePipeline(comp.id)}
                  disabled={pipelineLoadingId === comp.id}
                  className="flex-1 lg:w-full py-3.5 bg-accent text-white text-xs font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 hover:bg-accent-hover shadow-glow transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                >
                  {pipelineLoadingId === comp.id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Play size={16} fill="currentColor" />
                  )}
                  {pipelineLoadingId === comp.id ? 'Rodando...' : 'Rodar Pipeline'}
                </button>
                <button className="flex-1 lg:w-full py-3.5 bg-surface border border-border text-text-primary text-xs font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 hover:bg-surface-hover transition-all">
                  <ExternalLink size={16} />
                  Ver Ads
                </button>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 text-[10px] font-bold text-text-muted uppercase tracking-widest">
              <div className="flex flex-wrap gap-6">
                <span className="flex items-center gap-2"><Calendar size={14} className="text-accent" /> Cadastrado em: {formatDate(comp.created_at)}</span>
                <span className="flex items-center gap-2"><BarChart2 size={14} className="text-accent" /> {comp.meta_page_id ? 'Meta' : ''}{comp.meta_page_id && comp.google_domain ? ' + ' : ''}{comp.google_domain ? 'Google' : ''}</span>
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
