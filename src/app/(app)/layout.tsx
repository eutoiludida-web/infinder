'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { Bell, Search, User, Menu, X, Sun, Moon, Zap, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { createSupabaseBrowser } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

function AppLayoutInner({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseBrowser();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        const fullName = data.user.user_metadata?.full_name;
        const email = data.user.email ?? '';
        setUserName(fullName || email.split('@')[0]);
        setUserEmail(email);
      } else {
        router.push('/auth');
      }
      setAuthChecked(true);
    }).catch(() => {
      router.push('/auth');
      setAuthChecked(true);
    });
  }, [router]);

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg-primary">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-bg-primary selection:bg-accent/30 selection:text-white">
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block sticky top-0 h-screen">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-80 bg-bg-secondary z-[70] lg:hidden border-r border-border shadow-2xl overflow-y-auto"
            >
              <div className="absolute top-6 right-6">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-3 text-text-muted hover:text-text-primary hover:bg-surface rounded-2xl transition-all"
                >
                  <X size={24} />
                </button>
              </div>
              <Sidebar onNavigate={() => setIsMobileMenuOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b border-border bg-bg-primary/60 backdrop-blur-xl sticky top-0 z-50 px-6 md:px-10 flex items-center justify-between gap-6 pt-[env(safe-area-inset-top)]">
          <div className="flex items-center gap-6 flex-1">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-3 text-text-muted hover:text-text-primary hover:bg-surface rounded-2xl transition-all"
            >
              <Menu size={24} />
            </button>

            <Link href="/dashboard" className="flex items-center gap-3 lg:hidden group/logo">
              <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-glow group-hover/logo:scale-110 transition-all duration-500">
                <Zap size={22} className="text-white fill-white" />
              </div>
              <span className="text-xl font-display font-black tracking-tighter text-text-primary">INFInder</span>
            </Link>

            <div className="relative flex-1 max-w-lg hidden sm:block group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" size={18} />
              <input
                type="text"
                placeholder="Buscar ads, concorrentes..."
                className="w-full bg-surface border border-border rounded-2xl py-3 pl-12 pr-6 text-sm font-medium focus:outline-none focus:border-accent/50 focus:bg-surface-hover transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <button
              onClick={toggleTheme}
              className="p-3 text-text-muted hover:text-text-primary hover:bg-surface rounded-2xl transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
            </button>
            <button className="p-3 text-text-muted hover:text-text-primary hover:bg-surface rounded-2xl transition-all relative group">
              <Bell size={22} />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-accent rounded-full border-[3px] border-bg-primary shadow-[0_0_8px_rgba(124,108,240,0.5)]" />
            </button>
            <div className="h-10 w-px bg-border mx-1 md:mx-2" />
            <div className="flex items-center gap-4 cursor-pointer group p-1.5 hover:bg-surface rounded-2xl transition-all">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-display font-bold text-text-primary group-hover:text-accent transition-colors">{userName ?? '...'}</p>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{userEmail ?? '...'}</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shadow-lg group-hover:scale-110 transition-transform duration-500">
                <User size={22} />
              </div>
            </div>
          </div>
        </header>
        <main className="p-6 md:p-10 max-w-[1800px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AppLayoutInner>{children}</AppLayoutInner>
    </ThemeProvider>
  );
}
