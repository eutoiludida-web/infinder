'use client'

import { Sidebar, TopBar } from '@/components/sidebar'
import { motion, AnimatePresence } from 'motion/react'
import { usePathname } from 'next/navigation'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex h-screen bg-paper text-ink overflow-hidden font-sans selection:bg-accent selection:text-white">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <TopBar />
        <div className="flex-1 overflow-y-auto p-10 bg-paper">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
