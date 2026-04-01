'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Video,
  Sparkles,
  Megaphone,
  Settings,
  Users,
  CreditCard,
  LogOut,
  Menu,
  User,
  Briefcase,
  Terminal,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'motion/react'
import { createSupabaseBrowser } from '@/lib/supabase'

const menuItems = [
  { icon: LayoutDashboard, label: 'Visão Geral', path: '/dashboard' },
  { icon: Video, label: 'Feed Viral', path: '/videos' },
  { icon: Sparkles, label: 'Motor de Scripts', path: '/generate' },
  { icon: Megaphone, label: 'Inteligência de Ads', path: '/ads' },
  { icon: Users, label: 'Concorrentes', path: '/competitors' },
  { icon: Briefcase, label: 'Identidade de Marca', path: '/brand' },
]

const bottomItems = [
  { icon: CreditCard, label: 'Assinatura', path: '/pricing' },
  { icon: Settings, label: 'Configurações', path: '/settings' },
]

export function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createSupabaseBrowser()
    await supabase.auth.signOut()
    router.push('/auth')
    router.refresh()
  }

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-7 left-4 z-[60] p-3 hover:bg-slate-50 border border-line lg:hidden bg-white"
      >
        <Menu className="w-5 h-5" />
      </button>

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-line transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0',
          !isSidebarOpen && '-translate-x-full lg:hidden'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-10 flex items-center gap-4">
            <div className="w-10 h-10 bg-ink flex items-center justify-center">
              <Terminal className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-3xl tracking-tighter text-ink uppercase">
              INFInder
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 space-y-2 overflow-y-auto py-4">
            <div className="px-4 mb-6">
              <span className="text-[10px] font-bold text-muted uppercase tracking-[0.3em]">
                Protocolo de Inteligência
              </span>
            </div>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  'flex items-center gap-4 px-5 py-4 transition-all duration-200 group relative',
                  pathname === item.path
                    ? 'text-ink font-bold'
                    : 'text-muted hover:text-ink'
                )}
              >
                {pathname === item.path && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 bg-slate-50 border-r-2 border-accent"
                  />
                )}
                <item.icon
                  className={cn(
                    'w-4 h-4 relative z-10 transition-colors',
                    pathname === item.path
                      ? 'text-accent'
                      : 'text-muted group-hover:text-ink'
                  )}
                />
                <span className="text-[11px] font-bold uppercase tracking-widest relative z-10">
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Bottom Nav */}
          <div className="p-6 border-t border-line space-y-2">
            {bottomItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  'flex items-center gap-4 px-5 py-4 transition-all duration-200 text-muted hover:text-ink group',
                  pathname === item.path && 'text-ink font-bold'
                )}
              >
                <item.icon className="w-4 h-4 group-hover:text-accent transition-colors" />
                <span className="text-[11px] font-bold uppercase tracking-widest">
                  {item.label}
                </span>
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-5 py-4 text-rose-600 hover:bg-rose-50 transition-all duration-200 group"
            >
              <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold uppercase tracking-widest">
                Encerrar Sessão
              </span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export function TopBar() {
  const pathname = usePathname()

  const allItems = [...menuItems, ...bottomItems]
  const currentLabel =
    allItems.find((i) => i.path === pathname)?.label || 'Visão Geral'

  return (
    <header className="h-24 bg-white border-b border-line flex items-center justify-between px-10 shrink-0">
      <div className="flex items-center gap-6">
        <div className="w-10 lg:hidden" /> {/* Spacer for mobile menu button */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-bold text-muted uppercase tracking-widest">
              Sistema Ativo
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold text-ink uppercase tracking-tight">
            {currentLabel}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-[11px] font-bold text-ink uppercase tracking-tight">
            INFInder
          </span>
          <span className="text-[9px] font-bold text-accent uppercase tracking-[0.2em]">
            Protocolo Enterprise
          </span>
        </div>
        <div className="w-12 h-12 bg-slate-50 flex items-center justify-center border border-line group cursor-pointer hover:border-accent transition-colors">
          <User className="w-6 h-6 text-muted group-hover:text-accent transition-colors" />
        </div>
      </div>
    </header>
  )
}
