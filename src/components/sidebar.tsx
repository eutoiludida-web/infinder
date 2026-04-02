'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  Search,
  Users,
  Settings,
  ShieldCheck,
  LogOut,
  Zap,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createSupabaseBrowser } from '@/lib/supabase';

interface SidebarProps {
  onNavigate?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [planName, setPlanName] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowser();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        supabase
          .from('subscriptions')
          .select('plan')
          .eq('user_id', data.user.id)
          .single()
          .then(({ data: sub }) => {
            setPlanName(sub?.plan ?? 'Starter');
          });
      }
    });
  }, []);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Search, label: 'Ads Intelligence', path: '/ads' },
    { icon: Users, label: 'Concorrentes', path: '/competitors' },
    { icon: ShieldCheck, label: 'Sua Marca', path: '/brand' },
    { icon: Sparkles, label: 'Gerador IA', path: '/generate' },
  ];

  const handleLogout = async () => {
    const supabase = createSupabaseBrowser();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <aside className="w-full lg:w-80 bg-bg-secondary border-r border-border flex flex-col h-full lg:h-screen lg:sticky lg:top-0 overflow-y-auto custom-scrollbar">
      <div className="p-8">
        <Link href="/dashboard" onClick={onNavigate} className="flex items-center gap-3 mb-12 group/logo">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-glow group-hover/logo:scale-110 transition-all duration-500">
            <Zap size={24} className="text-white fill-white" />
          </div>
          <span className="text-2xl font-display font-black tracking-tighter text-text-primary">
            INFInder
          </span>
        </Link>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 relative overflow-hidden group",
                  isActive
                    ? "bg-accent/10 text-accent border border-accent/20 shadow-[0_0_20px_rgba(124,108,240,0.1)]"
                    : "text-text-muted hover:bg-surface hover:text-text-primary"
                )}
              >
                <item.icon size={20} className={cn("transition-transform duration-300 group-hover:scale-110", isActive ? "text-accent" : "text-text-muted")} />
                <span className="relative z-10 uppercase tracking-widest text-[11px]">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent rounded-r-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-8 space-y-6">
        <div className="glass p-6 rounded-[2rem] border border-border-subtle relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl -z-10 group-hover:bg-accent/10 transition-all duration-500" />
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Plano {planName ?? '...'}</span>
            <Link href="/pricing" className="text-[10px] font-bold text-text-muted hover:text-accent underline uppercase tracking-widest transition-colors">Upgrade</Link>
          </div>
          <div className="h-2 bg-surface rounded-full overflow-hidden mb-3 shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '75%' }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-accent to-accent-hover shadow-[0_0_10px_rgba(124,108,240,0.5)]"
            />
          </div>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Uso do plano</p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-5 py-4 w-full text-xs font-black uppercase tracking-[0.2em] text-text-muted hover:text-danger hover:bg-danger/5 rounded-2xl transition-all group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          Sair
        </button>
      </div>
    </aside>
  );
};
