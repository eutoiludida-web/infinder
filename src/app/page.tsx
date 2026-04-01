'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap,
  ArrowRight,
  Eye,
  BrainCircuit,
  Trophy,
  CheckCircle2,
  ChevronRight,
  Play,
  Sun,
  Moon,
  Menu,
  X,
  Sparkles,
  BarChart3,
  ShieldCheck,
  Target
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';

const DashboardMockup = () => {
  return (
    <div className="w-full aspect-video bg-bg-primary rounded-2xl border border-white/5 overflow-hidden flex shadow-premium relative group/mockup">
      {/* Sidebar Mockup */}
      <div className="w-16 md:w-56 border-r border-white/5 bg-bg-secondary/80 backdrop-blur-md p-5 hidden md:flex flex-col gap-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center shadow-glow">
            <Zap size={18} className="text-white fill-white" />
          </div>
          <div className="h-2.5 w-24 bg-text-primary/20 rounded-full" />
        </div>
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4 opacity-40">
              <div className="w-5 h-5 bg-white/10 rounded-lg" />
              <div className="h-2 w-full bg-white/10 rounded-full" />
            </div>
          ))}
        </div>
        <div className="mt-auto pt-6 border-t border-white/5">
          <div className="h-10 w-full bg-white/5 rounded-xl" />
        </div>
      </div>

      {/* Main Content Mockup */}
      <div className="flex-1 flex flex-col bg-bg-primary/50">
        {/* Header Mockup */}
        <div className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-bg-secondary/30 backdrop-blur-xl">
          <div className="flex items-center gap-6">
            <div className="h-2.5 w-32 bg-text-primary/20 rounded-full" />
            <div className="h-5 w-px bg-white/10" />
            <div className="h-2.5 w-20 bg-text-primary/10 rounded-full" />
          </div>
          <div className="flex gap-4">
            <div className="w-9 h-9 rounded-full bg-white/5 border border-white/5" />
            <div className="w-9 h-9 rounded-full bg-accent/20 border border-accent/30" />
          </div>
        </div>

        {/* Content Area Mockup */}
        <div className="p-8 space-y-10 overflow-hidden">
          {/* Stats Bento */}
          <div className="grid grid-cols-4 gap-5">
            {[
              { label: 'Ads', val: '298', color: 'bg-accent' },
              { label: 'Winners', val: '12', color: 'bg-success' },
              { label: 'Score', val: '8.4', color: 'bg-warning' },
              { label: 'ROI', val: '+24%', color: 'bg-accent' }
            ].map((stat, i) => (
              <div key={i} className="glass-dark p-5 rounded-2xl space-y-4 relative overflow-hidden group/stat">
                <div className="flex justify-between items-start">
                  <div className="h-2 w-10 bg-text-primary/20 rounded-full" />
                  <div className={cn("w-2 h-2 rounded-full", stat.color)} />
                </div>
                <div className="h-6 w-16 bg-text-primary/40 rounded-lg" />
                <div className="h-12 w-full bg-white/5 rounded-xl flex items-end px-2 pb-2 gap-1.5">
                  {[30, 60, 40, 80, 50, 90, 70].map((h, j) => (
                    <motion.div
                      key={j}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: 0.5 + (j * 0.1), duration: 0.5 }}
                      className={cn("flex-1 rounded-t-[3px] opacity-40", stat.color)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Ad Grid Mockup */}
          <div className="space-y-6">
            <div className="h-3 w-40 bg-text-primary/20 rounded-full" />
            <div className="grid grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-dark rounded-2xl overflow-hidden group/card">
                  <div className="aspect-[4/5] bg-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                    <div className="absolute top-4 left-4 w-8 h-8 rounded-xl bg-accent/30 border border-accent/50" />
                    {i === 1 && (
                      <div className="absolute top-4 right-4 px-3 py-1 bg-warning text-[8px] font-black text-black/80 rounded-full tracking-widest">
                        WINNER
                      </div>
                    )}
                    <div className="absolute bottom-4 right-4 w-11 h-11 rounded-full border-2 border-success/50 bg-success/10 backdrop-blur-md flex items-center justify-center text-xs font-mono font-bold text-success">
                      8.5
                    </div>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="h-2 w-24 bg-text-primary/20 rounded-full" />
                    <div className="space-y-2">
                      <div className="h-2 w-full bg-text-primary/10 rounded-full" />
                      <div className="h-2 w-2/3 bg-text-primary/10 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Glossy Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-40" />
    </div>
  );
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as const
    }
  }
};

function LandingPageInner() {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-bg-primary text-text-primary overflow-x-hidden min-h-screen selection:bg-accent/30 selection:text-white">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 atmosphere pointer-events-none -z-10" />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/40 backdrop-blur-xl border-b border-white/5 pt-[env(safe-area-inset-top)]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group/logo">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-glow group-hover/logo:scale-110 transition-all duration-500">
              <Zap size={24} className="text-white fill-white" />
            </div>
            <span className="text-2xl font-display font-bold tracking-tighter">INFInder</span>
          </Link>

          <div className="flex items-center gap-3 md:gap-8">
            <div className="hidden md:flex items-center gap-8">
              {['Features', 'Como Funciona', 'Precos'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-full bg-white/5 border border-white/10 text-text-primary hover:bg-white/10 transition-all"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <Link
                href="/auth"
                className="text-sm font-bold text-text-primary hover:text-accent transition-colors px-4 py-2"
              >
                Login
              </Link>

              <Link
                href="/auth"
                className="hidden sm:flex items-center gap-2 bg-accent hover:bg-accent-hover text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-glow transition-all hover:scale-105 active:scale-95"
              >
                Comecar
                <ArrowRight size={16} />
              </Link>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-text-primary hover:text-accent transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden bg-bg-secondary/95 backdrop-blur-2xl border-b border-white/5 overflow-hidden"
            >
              <div className="flex flex-col p-8 gap-6">
                {['Features', 'Como Funciona', 'Precos'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(' ', '-')}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-xl font-display font-medium text-text-secondary hover:text-text-primary transition-colors"
                  >
                    {item}
                  </a>
                ))}
                <Link href="/auth" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white font-bold py-4 rounded-2xl shadow-glow transition-all">
                  Comecar Agora
                  <ArrowRight size={20} />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto text-center space-y-12"
        >
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold tracking-widest uppercase mb-4 animate-float">
              <Sparkles size={14} className="fill-accent" />
              Inteligencia Artificial para Ads
            </div>
            <h1 className="text-6xl md:text-8xl font-display font-extrabold leading-[0.9] tracking-tight text-gradient">
              Domine o Mercado <br />
              <span className="text-accent">com Dados Reais.</span>
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed font-light">
              A plataforma definitiva para espionar, analisar e replicar os anuncios vencedores dos seus concorrentes em segundos.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link
              href="/auth"
              className="w-full sm:w-auto px-10 py-5 bg-accent hover:bg-accent-hover text-white font-bold rounded-2xl shadow-glow transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 text-lg"
            >
              Comecar Agora Gratis
              <ArrowRight size={20} />
            </Link>
            <button className="w-full sm:w-auto px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-text-primary font-bold rounded-2xl transition-all flex items-center justify-center gap-3 text-lg">
              <Play size={20} className="fill-current" />
              Ver Demo
            </button>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            variants={itemVariants}
            className="pt-12 flex flex-col items-center gap-6"
          >
            <p className="text-xs font-bold text-text-muted uppercase tracking-[0.3em]">Confiado por mais de 2.500 profissionais</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
              {['Meta', 'Google', 'TikTok', 'Shopify', 'Hotmart'].map((brand) => (
                <span key={brand} className="text-2xl font-display font-black tracking-tighter">{brand}</span>
              ))}
            </div>
          </motion.div>

          {/* Main Mockup */}
          <motion.div
            variants={itemVariants}
            className="relative mt-24 max-w-5xl mx-auto"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-accent via-accent/50 to-success rounded-[2rem] blur-2xl opacity-20" />
            <div className="relative glass p-2 rounded-[2rem] overflow-hidden">
              <DashboardMockup />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-display font-bold text-gradient">Tudo o que voce precisa.</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">Funcionalidades exclusivas desenhadas para quem busca escala e ROI real.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Feature 1: Large */}
            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-8 glass p-10 rounded-[2.5rem] flex flex-col justify-between group overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-[80px] -z-10 group-hover:bg-accent/20 transition-all duration-700" />
              <div className="space-y-6">
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                  <BrainCircuit size={32} />
                </div>
                <h3 className="text-3xl font-display font-bold">Analise de Criativos com IA</h3>
                <p className="text-text-secondary text-lg max-w-md">Nossa IA analisa cada elemento do anuncio: copy, imagem, cores e CTA para dizer exatamente por que ele esta vendendo.</p>
              </div>
              <div className="mt-12 p-6 bg-surface rounded-2xl border border-border-subtle">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-xs font-bold text-success uppercase tracking-widest">IA Analisando Agora</span>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-border rounded-full w-full" />
                  <div className="h-2 bg-border rounded-full w-3/4" />
                  <div className="h-2 bg-border rounded-full w-1/2" />
                </div>
              </div>
            </motion.div>

            {/* Feature 2: Small */}
            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-4 glass p-10 rounded-[2.5rem] flex flex-col gap-8 group"
            >
              <div className="w-14 h-14 bg-success/10 rounded-2xl flex items-center justify-center text-success group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                <Eye size={32} />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-display font-bold">Radar 24/7</h3>
                <p className="text-text-secondary">Nunca perca um novo anuncio. Monitoramos Meta e Google Ads em tempo real para voce.</p>
              </div>
              <div className="mt-auto flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-bg-primary bg-bg-elevated overflow-hidden">
                    <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" referrerPolicy="no-referrer" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-bg-primary bg-accent flex items-center justify-center text-[10px] font-bold">+2k</div>
              </div>
            </motion.div>

            {/* Feature 3: Small */}
            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-4 glass p-10 rounded-[2.5rem] flex flex-col gap-8 group"
            >
              <div className="w-14 h-14 bg-warning/10 rounded-2xl flex items-center justify-center text-warning group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <Trophy size={32} />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-display font-bold">Winning Ads</h3>
                <p className="text-text-secondary">Identificamos automaticamente anuncios que estao ativos ha mais tempo e escalando.</p>
              </div>
            </motion.div>

            {/* Feature 4: Large */}
            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-8 glass p-10 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-10 group"
            >
              <div className="flex-1 space-y-6">
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                  <Zap size={32} />
                </div>
                <h3 className="text-3xl font-display font-bold">Alertas Instantaneos</h3>
                <p className="text-text-secondary text-lg">Receba notificacoes no Telegram sempre que um concorrente lancar um novo criativo ou mudar sua estrategia.</p>
              </div>
              <div className="w-full md:w-64 aspect-square bg-bg-elevated rounded-3xl border border-white/5 p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent"><Zap size={16} /></div>
                  <span className="text-xs font-bold">Novo Ad Detectado!</span>
                </div>
                <div className="flex-1 bg-bg-primary rounded-xl border border-white/5 overflow-hidden">
                  <img src="https://picsum.photos/seed/ads/400/400" className="w-full h-full object-cover opacity-50" alt="Ad" referrerPolicy="no-referrer" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="como-funciona" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-6xl font-display font-bold text-gradient">Como transformamos dados em lucro.</h2>
                <p className="text-text-secondary text-lg">O processo de tres etapas que garante sua vantagem competitiva.</p>
              </div>

              <div className="space-y-10">
                {[
                  { icon: Target, title: 'Radar Ativo', desc: 'Nossa IA monitora Meta e Google Ads 24/7 em busca de novos criativos dos seus concorrentes.' },
                  { icon: BrainCircuit, title: 'Analise Profunda', desc: 'Decodificamos o hook, a oferta e o CTA de cada anuncio usando modelos avancados de IA.' },
                  { icon: BarChart3, title: 'Escala Validada', desc: 'Identificamos os "Winners" -- anuncios que estao ativos ha tempo suficiente para serem lucrativos.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500">
                      <item.icon size={28} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-text-primary">{item.title}</h3>
                      <p className="text-text-secondary leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-accent/20 blur-[120px] -z-10" />
              <div className="glass p-8 rounded-[3rem] space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent"><Sparkles size={20} /></div>
                    <span className="font-bold">Analise em Tempo Real</span>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-success/10 text-success text-[10px] font-bold uppercase tracking-widest">Ativo</div>
                </div>
                <div className="space-y-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-bg-elevated overflow-hidden">
                        <img src={`https://picsum.photos/seed/ad${i}/100/100`} alt="Ad" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="h-2 bg-white/20 rounded-full w-1/3" />
                        <div className="h-1.5 bg-white/10 rounded-full w-full" />
                      </div>
                      <div className="text-accent font-mono text-xs">9.{i}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto relative">
          <div className="absolute inset-0 bg-accent blur-[120px] opacity-20 -z-10" />
          <div className="glass p-12 md:p-24 rounded-[3rem] text-center space-y-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-accent/10 via-transparent to-transparent" />
            <h2 className="text-4xl md:text-7xl font-display font-bold text-gradient leading-tight">Pronto para dominar <br /> seu mercado?</h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">Junte-se aos melhores players do mercado e pare de queimar dinheiro com testes inuteis.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
              <Link
                href="/auth"
                className="w-full sm:w-auto px-12 py-6 bg-accent hover:bg-accent-hover text-white font-bold rounded-2xl shadow-glow transition-all hover:scale-105 active:scale-95 text-xl"
              >
                Comecar Agora Gratis
              </Link>
              <button className="w-full sm:w-auto px-12 py-6 bg-white/5 hover:bg-white/10 border border-white/10 text-text-primary font-bold rounded-2xl transition-all text-xl">
                Falar com Consultor
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center shadow-glow">
                <Zap size={22} className="text-white fill-white" />
              </div>
              <span className="text-2xl font-display font-bold tracking-tighter">INFInder</span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">A plataforma de inteligencia competitiva mais avancada do mercado brasileiro.</p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-text-primary">Produto</h4>
            <ul className="space-y-4 text-sm text-text-secondary">
              <li><a href="#features" className="hover:text-accent transition-colors">Features</a></li>
              <li><a href="#como-funciona" className="hover:text-accent transition-colors">Como Funciona</a></li>
              <li><a href="#pricing" className="hover:text-accent transition-colors">Precos</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-text-primary">Empresa</h4>
            <ul className="space-y-4 text-sm text-text-secondary">
              <li><a href="#" className="hover:text-accent transition-colors">Sobre Nos</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Carreiras</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-text-primary">Suporte</h4>
            <ul className="space-y-4 text-sm text-text-secondary">
              <li><a href="#" className="hover:text-accent transition-colors">Central de Ajuda</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Status</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Contato</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-text-muted">2026 INFInder Intelligence. Todos os direitos reservados.</p>
          <div className="flex gap-8 text-xs text-text-muted">
            <Link href="/privacy" className="hover:text-accent">Privacidade</Link>
            <Link href="/terms" className="hover:text-accent">Termos</Link>
            <a href="#" className="hover:text-accent">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function LandingPage() {
  return (
    <ThemeProvider>
      <LandingPageInner />
    </ThemeProvider>
  );
}
