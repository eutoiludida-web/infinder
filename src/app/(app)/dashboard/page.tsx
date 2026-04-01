'use client'

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { StatCard } from '@/components/ui/StatCard';
import { AdCard } from '@/components/ui/AdCard';
import { UsageMeter } from '@/components/ui/UsageMeter';
import { PLAN_LIMITS, type PlanName } from '@/types/plans';
import type { Ad } from '@/types/frontend';
import {
  Eye,
  Users,
  BrainCircuit,
  Target,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function daysBetween(dateStr: string): number {
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function mapApiAdToFrontend(raw: any): Ad {
  const daysActive = raw.started_at ? daysBetween(raw.started_at) : 0;
  const score = raw.ad_analyses?.[0]?.score ?? undefined;
  const isNew = daysBetween(raw.created_at) <= 3;
  const isWinner = raw.status === 'active' && daysActive > 30;

  return {
    id: raw.id,
    externalId: raw.external_id ?? '',
    platform: raw.platform ?? 'meta',
    competitorId: raw.competitor_id ?? '',
    competitorName: raw.competitors?.name ?? 'Desconhecido',
    thumbnailUrl: raw.image_urls?.[0] ?? '/placeholder-ad.svg',
    headline: raw.headline ?? '',
    text: raw.ad_text ?? '',
    ctaText: raw.cta_text ?? '',
    landingPageUrl: raw.landing_page_url ?? '',
    status: raw.status ?? 'inactive',
    startDate: raw.started_at ?? raw.created_at,
    daysActive,
    score,
    isWinner,
    isNew,
  };
}

// ---------------------------------------------------------------------------
// Skeleton components
// ---------------------------------------------------------------------------

function StatSkeleton() {
  return (
    <div className="glass p-6 rounded-2xl animate-pulse">
      <div className="space-y-4">
        <div className="w-12 h-12 bg-surface rounded-xl" />
        <div className="space-y-2">
          <div className="w-24 h-3 bg-surface rounded" />
          <div className="w-16 h-8 bg-surface rounded" />
        </div>
      </div>
    </div>
  );
}

function AdCardSkeleton() {
  return (
    <div className="glass-dark rounded-2xl overflow-hidden border border-border-subtle animate-pulse">
      <div className="aspect-[4/5] bg-surface" />
      <div className="p-5 space-y-3">
        <div className="flex justify-between">
          <div className="w-20 h-3 bg-surface rounded" />
          <div className="w-16 h-3 bg-surface rounded" />
        </div>
        <div className="w-full h-4 bg-surface rounded" />
        <div className="w-3/4 h-3 bg-surface rounded" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function Dashboard() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [totalAds, setTotalAds] = useState(0);
  const [competitorCount, setCompetitorCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hardcoded plan for usage section (will be connected later)
  const currentPlan: PlanName = 'free';
  const limits = PLAN_LIMITS[currentPlan];

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [adsRes, compRes] = await Promise.all([
          fetch('/api/ads?limit=50'),
          fetch('/api/competitors'),
        ]);

        if (!adsRes.ok || !compRes.ok) {
          throw new Error('Falha ao carregar dados. Tente novamente.');
        }

        const adsJson = await adsRes.json();
        const compJson = await compRes.json();

        if (cancelled) return;

        const mapped = (adsJson.ads || []).map(mapApiAdToFrontend);
        setAds(mapped);
        setTotalAds(adsJson.total ?? 0);
        setCompetitorCount(Array.isArray(compJson) ? compJson.length : 0);
      } catch (err: any) {
        if (!cancelled) setError(err.message ?? 'Erro desconhecido');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  // Derived data
  const analysisCount = useMemo(
    () => ads.filter(a => a.score !== undefined).length,
    [ads],
  );

  const avgScore = useMemo(() => {
    const scored = ads.filter(a => a.score !== undefined);
    if (scored.length === 0) return 0;
    const sum = scored.reduce((acc, a) => acc + (a.score ?? 0), 0);
    return Math.round((sum / scored.length) * 10) / 10;
  }, [ads]);

  const winners = useMemo(() => ads.filter(a => a.isWinner), [ads]);
  const recentAds = useMemo(() => ads.slice(0, 3), [ads]);

  // Onboarding state
  const isEmpty = !loading && competitorCount === 0 && totalAds === 0;

  // ------ Error state ------
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6">
        <div className="glass p-10 rounded-[2rem] text-center max-w-md space-y-4">
          <div className="text-danger text-5xl">!</div>
          <h2 className="text-xl font-display font-bold text-text-primary">Erro ao carregar</h2>
          <p className="text-text-secondary text-sm">{error}</p>
          <button
            onClick={() => { setError(null); setLoading(true); window.location.reload(); }}
            className="mt-4 px-6 py-3 bg-accent hover:bg-accent-hover text-white text-sm font-black rounded-2xl shadow-glow transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black text-text-primary tracking-tight">Bom dia</h1>
          <p className="text-text-secondary mt-2 font-medium">Aqui esta o que mudou no radar dos seus concorrentes hoje.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-accent/10 border border-accent/20 text-accent text-xs font-bold flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Radar Ativo
          </div>
        </div>
      </header>

      {/* Onboarding */}
      {isEmpty && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-10 rounded-[2rem] text-center space-y-5"
        >
          <Sparkles className="w-12 h-12 text-accent mx-auto" />
          <h2 className="text-2xl font-display font-bold text-text-primary">Bem-vindo ao INFInder!</h2>
          <p className="text-text-secondary max-w-md mx-auto">
            Comece adicionando seu primeiro concorrente para monitorar os ads dele automaticamente.
          </p>
          <Link
            href="/competitors"
            className="inline-flex items-center gap-2 mt-2 px-8 py-4 bg-accent hover:bg-accent-hover text-white font-black text-sm rounded-2xl shadow-glow transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Adicionar Concorrente <ArrowRight size={16} />
          </Link>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {loading ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title="Ads Monitorados"
              value={totalAds}
              icon={Eye}
            />
            <StatCard
              title="Concorrentes"
              value={competitorCount}
              icon={Users}
            />
            <StatCard
              title="Analises IA"
              value={analysisCount}
              icon={BrainCircuit}
            />
            <StatCard
              title="Score Medio"
              value={avgScore || '--'}
              icon={Target}
            />
          </>
        )}
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
            <Link href="/ads" className="text-sm font-bold text-accent hover:text-accent-hover flex items-center gap-2 group transition-colors">
              Ver todos <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <AdCardSkeleton />
              <AdCardSkeleton />
            </div>
          ) : winners.length === 0 ? (
            <div className="glass p-10 rounded-[2rem] text-center">
              <p className="text-text-secondary font-medium">Nenhum winner detectado ainda</p>
              <p className="text-text-muted text-xs mt-2">
                Winners sao ads ativos ha mais de 30 dias consecutivos.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {winners.map(ad => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar: Usage & Recent */}
        <div className="space-y-10">
          <section className="glass p-8 rounded-[2rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl -z-10 group-hover:bg-accent/10 transition-all" />
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-secondary mb-8">Uso do Plano</h3>
            <div className="space-y-8">
              <UsageMeter label="Ads Monitorados" used={0} limit={limits.ads_scraped} />
              <UsageMeter label="Analises IA" used={0} limit={limits.ai_analyses} />
              <UsageMeter label="Concorrentes" used={competitorCount} limit={limits.competitors} />
            </div>
            <Link
              href="/pricing"
              className="block w-full mt-10 py-4 bg-accent hover:bg-accent-hover text-white text-sm font-black rounded-2xl shadow-glow transition-all hover:scale-[1.02] active:scale-[0.98] text-center"
            >
              Fazer Upgrade
            </Link>
          </section>

          <section className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-secondary">Atividade Recente</h3>
            {loading ? (
              <div className="space-y-4">
                {[0, 1, 2].map(i => (
                  <div key={i} className="flex gap-5 p-4 rounded-2xl animate-pulse">
                    <div className="w-14 h-14 rounded-xl bg-surface flex-shrink-0" />
                    <div className="space-y-2 flex-1 py-2">
                      <div className="w-3/4 h-3 bg-surface rounded" />
                      <div className="w-1/2 h-2 bg-surface rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentAds.length === 0 ? (
              <p className="text-text-muted text-sm">Nenhuma atividade recente.</p>
            ) : (
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
                      <p className="text-[10px] font-bold text-text-muted mt-1.5 uppercase tracking-widest">
                        {ad.daysActive === 0 ? 'Hoje' : `${ad.daysActive}d atras`} - {ad.platform}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
