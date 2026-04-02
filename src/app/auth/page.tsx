'use client'

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight, Globe } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { createSupabaseBrowser } from '@/lib/supabase';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const supabase = createSupabaseBrowser();
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (error) throw error;
      }
      router.push('/dashboard');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao autenticar');
    } finally {
      setLoading(false);
    }
  };

  async function handleGoogleLogin() {
    const supabase = createSupabaseBrowser();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Left Side: Visual Branding */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-bg-secondary p-12 flex-col justify-between">
        <div className="absolute top-0 left-0 w-full h-full bg-accent/5 blur-[100px] -z-10" />

        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-glow">
            <Zap size={24} className="text-white fill-white" />
          </div>
          <span className="text-2xl font-bold tracking-tighter">INFInder</span>
        </div>

        <div className="space-y-6">
          <h2 className="text-5xl font-bold leading-tight">
            Descubra o que funciona. <br />
            <span className="text-accent">Domine o mercado.</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-md">
            Junte-se a mais de 2.500 profissionais de marketing que usam o INFInder para espionar e analisar ads com IA.
          </p>

          <div className="space-y-4 pt-8">
            {[
              "Monitoramento 24/7 de Meta e Google Ads",
              "Analise de criativos com inteligencia artificial",
              "Deteccao automatica de anuncios vencedores",
              "Alertas instantaneos de novos criativos"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-text-primary">
                <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center text-success">
                  <Zap size={12} fill="currentColor" />
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-text-muted">2026 INFInder Intelligence Platform</p>
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold">{isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}</h1>
            <p className="text-text-secondary mt-2">
              {isLogin ? 'Entre com suas credenciais para acessar seu radar.' : 'Comece a monitorar seus concorrentes hoje mesmo.'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex p-1 bg-bg-secondary rounded-xl border border-border">
            <button
              onClick={() => { setIsLogin(true); setError(''); }}
              className={cn(
                "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
                isLogin ? "bg-bg-elevated text-text-primary shadow-card" : "text-text-muted hover:text-text-primary"
              )}
            >
              Entrar
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); }}
              className={cn(
                "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
                !isLogin ? "bg-bg-elevated text-text-primary shadow-card" : "text-text-muted hover:text-text-primary"
              )}
            >
              Criar Conta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-text-secondary">Nome Completo</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-bg-secondary border border-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-accent/50 transition-all"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-text-secondary">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-bg-secondary border border-border rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-accent/50 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-widest text-text-secondary">Senha</label>
                {isLogin && <button type="button" className="text-[10px] text-accent hover:underline">Esqueceu a senha?</button>}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="--------"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-bg-secondary border border-border rounded-xl py-3 pl-12 pr-12 text-sm focus:outline-none focus:border-accent/50 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-danger">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-accent hover:bg-accent-hover text-white font-bold rounded-xl shadow-glow transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? 'Autenticando...' : isLogin ? 'Entrar no Painel' : 'Criar Minha Conta'}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-bg-primary px-4 text-text-muted">ou continue com</span></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full py-3 bg-bg-secondary border border-border hover:bg-bg-elevated text-text-primary font-bold rounded-xl transition-all flex items-center justify-center gap-3"
          >
            <Globe size={18} />
            Google
          </button>

          <p className="text-center text-xs text-text-muted">
            Ao continuar, voce concorda com nossos <br />
            <Link href="/terms" className="text-accent hover:underline">Termos de Servico</Link> e <Link href="/privacy" className="text-accent hover:underline">Politica de Privacidade</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
