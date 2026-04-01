'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Sparkles, ArrowRight, Mail, Lock, ChevronRight, Terminal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createSupabaseBrowser } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const supabase = createSupabaseBrowser()
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { data: { full_name: name } },
        })
        if (error) throw error
      }
      router.push('/dashboard')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao autenticar')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    const supabase = createSupabaseBrowser()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <div className="min-h-screen flex bg-white">
      <div className="hidden lg:flex lg:w-1/2 bg-black relative overflow-hidden flex-col justify-between p-20">
        <div className="absolute top-0 right-0 w-full h-full opacity-10">
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-orange-600 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-orange-600 blur-[120px] rounded-full" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-20">
            <div className="w-10 h-10 bg-orange-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-serif italic text-white tracking-tight">INFInder</span>
          </div>
          <h1 className="text-[6vw] font-serif italic text-white leading-[0.85] tracking-tighter mb-10">
            Inteligência<br /><span className="text-orange-600">Viral</span><br />Aplicada
          </h1>
          <p className="text-white/40 text-lg font-sans font-light max-w-md leading-relaxed">
            Quantifique a viralidade. Faça engenharia reversa do sucesso. Escale sua influência com análise neural de conteúdo.
          </p>
        </div>
        <div className="relative z-10">
          <div className="grid grid-cols-2 gap-12 border-t border-white/10 pt-12">
            <div>
              <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-2">Alcance da Rede</p>
              <p className="text-4xl font-bold text-white">1.2B+</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-2">Scripts Gerados</p>
              <p className="text-4xl font-bold text-white">450K</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-20">
        <div className="w-full max-w-md space-y-12">
          <div className="lg:hidden flex items-center gap-3 mb-12">
            <div className="w-8 h-8 bg-orange-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-serif italic text-black tracking-tight">INFInder</span>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-600">Portal de Acesso / v1.0</span>
            </div>
            <h2 className="text-5xl font-display font-bold uppercase text-black tracking-tight">
              {isLogin ? 'Bem-vindo' : 'Criar Conta'}
            </h2>
            <p className="mt-6 text-black/40 font-sans leading-relaxed">
              {isLogin ? 'Insira suas credenciais para acessar o painel de inteligência.' : 'Junte-se à rede de elite de criadores e estrategistas de conteúdo.'}
            </p>
          </div>
          <div className="space-y-4">
            <button onClick={handleGoogleLogin} className="w-full py-5 border border-black/10 flex items-center justify-center gap-4 hover:bg-black hover:text-white transition-all group">
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="currentColor"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor"/></svg>
              <span className="text-[10px] font-bold uppercase tracking-widest">Continuar com Google</span>
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-black/5"></div></div>
            <div className="relative flex justify-center text-[8px] font-bold uppercase tracking-widest">
              <span className="bg-white px-4 text-black/20">Ou use seu email</span>
            </div>
          </div>
          <form className="space-y-8" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-1">Nome Completo</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome" className="w-full bg-transparent border-b border-black/10 py-3 font-sans focus:outline-none focus:border-black transition-colors placeholder:text-black/10" />
              </div>
            )}
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-1">Endereço de Email</label>
              <div className="relative">
                <Mail className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-black/10" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nome@empresa.com" required className="w-full bg-transparent border-b border-black/10 py-3 font-sans focus:outline-none focus:border-black transition-colors placeholder:text-black/10" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-1">Senha</label>
              <div className="relative">
                <Lock className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-black/10" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} className="w-full bg-transparent border-b border-black/10 py-3 font-sans focus:outline-none focus:border-black transition-colors placeholder:text-black/10" />
              </div>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button type="submit" disabled={loading} className="w-full py-6 bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-orange-600 transition-all flex items-center justify-center gap-4 group disabled:opacity-50">
              {loading ? 'Autenticando...' : isLogin ? 'Autenticar' : 'Criar Conta'}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
          <p className="text-center text-xs text-black/40 font-sans">
            {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
            <button onClick={() => { setIsLogin(!isLogin); setError('') }} className="text-orange-600 font-bold uppercase text-[10px] tracking-widest hover:underline underline-offset-8">
              {isLogin ? 'Cadastre-se' : 'Entrar'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
