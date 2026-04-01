'use client'

import { useState } from 'react'
import {
  Search,
  Play,
  AtSign,
  TrendingUp,
  Download,
  Sparkles,
  X,
  ChevronRight,
  Clock,
  Eye,
  Heart,
  Share2,
  Terminal
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'

export default function Videos() {
  const [selectedVideo, setSelectedVideo] = useState<any>(null)
  const [filter, setFilter] = useState('all')

  const videos = [
    { id: 1, title: 'Estratégia de Conteúdo Viral', views: '1.2M', likes: '84K', platform: 'Instagram', competitor: '@marketingpro', score: 9.2, thumbnail: 'https://picsum.photos/seed/vid1/400/600' },
    { id: 2, title: 'Bastidores da Produção', views: '850K', likes: '42K', platform: 'TikTok', competitor: '@vloglife', score: 8.5, thumbnail: 'https://picsum.photos/seed/vid2/400/600' },
    { id: 3, title: 'Review Honesto: Gadget X', views: '2.4M', likes: '156K', platform: 'Instagram', competitor: '@techreview', score: 9.8, thumbnail: 'https://picsum.photos/seed/vid3/400/600' },
    { id: 4, title: 'Dica de Viagem: Paris', views: '500K', likes: '28K', platform: 'TikTok', competitor: '@traveler', score: 7.9, thumbnail: 'https://picsum.photos/seed/vid4/400/600' },
    { id: 5, title: 'Receita de 30 Segundos', views: '3.1M', likes: '210K', platform: 'Instagram', competitor: '@chefmaster', score: 9.5, thumbnail: 'https://picsum.photos/seed/vid5/400/600' },
    { id: 6, title: 'Organize seu Dia', views: '1.1M', likes: '65K', platform: 'TikTok', competitor: '@productivity', score: 8.8, thumbnail: 'https://picsum.photos/seed/vid6/400/600' },
  ]

  return (
    <div className="space-y-12">
      {/* Filters & Search - Minimalist Utility */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-1 border border-line p-1 bg-white">
          {['all', 'Instagram', 'TikTok'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-8 py-3 text-[10px] font-bold uppercase tracking-widest transition-all",
                filter === f ? "bg-ink text-white" : "text-muted hover:bg-slate-50"
              )}
            >
              {f === 'all' ? 'Todas as Fontes' : f}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="BUSCAR INTELIGÊNCIA..."
            className="w-full pl-14 pr-6 py-4 bg-white border border-line focus:outline-none focus:border-accent transition-colors text-[11px] font-bold uppercase tracking-widest"
          />
        </div>
      </div>

      {/* Videos Grid - Editorial Recipe */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-line border border-line">
        {videos.map((video) => (
          <motion.div
            key={video.id}
            whileHover={{ y: -4 }}
            className="bg-white group cursor-pointer overflow-hidden relative"
            onClick={() => setSelectedVideo(video)}
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-ink/20 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="absolute top-6 left-6 flex flex-col gap-2">
                <div className="bg-white px-3 py-1 flex items-center gap-2 shadow-2xl border border-line">
                  {video.platform === 'Instagram' ? <AtSign className="w-3 h-3 text-pink-600" /> : <Play className="w-3 h-3 text-ink" />}
                  <span className="text-[9px] font-bold text-ink uppercase tracking-widest">{video.platform}</span>
                </div>
                <div className="bg-accent px-3 py-1 flex items-center gap-2 shadow-2xl">
                  <TrendingUp className="w-3 h-3 text-white" />
                  <span className="text-[9px] font-bold text-white uppercase tracking-widest">{video.score}</span>
                </div>
              </div>

              <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <div className="bg-white p-5 border border-line shadow-2xl">
                  <p className="text-ink font-display font-bold text-sm uppercase tracking-tight mb-1 truncate">{video.title}</p>
                  <p className="text-muted text-[10px] font-bold uppercase tracking-widest">{video.competitor}</p>
                </div>
              </div>
            </div>
            <div className="p-8 flex items-center justify-between border-t border-line">
              <div className="flex items-center gap-8">
                <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-muted uppercase tracking-widest mb-1">Alcance</span>
                  <span className="font-mono text-xs font-bold text-ink">{video.views}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-bold text-muted uppercase tracking-widest mb-1">Neural</span>
                  <span className="font-mono text-xs font-bold text-accent">{video.score}</span>
                </div>
              </div>
              <div className="w-10 h-10 border border-line flex items-center justify-center group-hover:bg-ink group-hover:border-ink transition-colors">
                <Terminal className="w-4 h-4 text-muted group-hover:text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analysis Modal - Hardware Tool Recipe */}
      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVideo(null)}
              className="absolute inset-0 bg-ink/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-6xl bg-paper border border-line shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[90vh]"
            >
              {/* Video Preview - Left Side */}
              <div className="w-full md:w-[480px] bg-ink relative shrink-0 border-r border-line">
                <img
                  src={selectedVideo.thumbnail}
                  className="w-full h-full object-cover opacity-40 grayscale"
                  alt="Video Preview"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 border border-white/20 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer group">
                    <Play className="w-10 h-10 text-white fill-current group-hover:scale-110 transition-transform" />
                  </div>
                </div>

                {/* Hardware Overlays */}
                <div className="absolute top-10 left-10 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="font-mono text-[10px] text-white uppercase tracking-widest">REC 00:00:42:12</span>
                  </div>
                  <div className="font-mono text-[10px] text-white/40 uppercase tracking-widest">ISO 800 | 24FPS | 4K</div>
                </div>

                <button
                  onClick={() => setSelectedVideo(null)}
                  className="absolute top-10 right-10 p-2 text-white/40 hover:text-white md:hidden"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Analysis Content - Right Side */}
              <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-white">
                <div className="p-12 border-b border-line flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-px w-8 bg-accent" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">Relatório de Análise Neural</span>
                    </div>
                    <h2 className="text-4xl font-display font-bold text-ink uppercase tracking-tight">{selectedVideo.title}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedVideo(null)}
                    className="p-4 hover:bg-slate-50 border border-line text-muted hidden md:block"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-12 space-y-16">
                  {/* Grid Stats - Hardware Style */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 border border-line bg-line gap-px">
                    {[
                      { icon: Eye, label: 'Alcance', value: selectedVideo.views },
                      { icon: Heart, label: 'Engajamento', value: selectedVideo.likes },
                      { icon: Share2, label: 'Velocidade', value: '12.4K' },
                      { icon: Clock, label: 'Duração', value: '0:42' }
                    ].map((s, i) => (
                      <div key={i} className="bg-white p-8">
                        <s.icon className="w-4 h-4 text-accent mb-6" />
                        <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-2">{s.label}</p>
                        <p className="font-mono text-xl font-bold text-ink">{s.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Analysis Sections */}
                  <div className="grid md:grid-cols-2 gap-16">
                    <div className="space-y-12">
                      <div>
                        <h4 className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-ink mb-8">
                          <Sparkles className="w-4 h-4 text-accent" /> Arquitetura do Gancho
                        </h4>
                        <div className="p-8 bg-slate-50 border-l-2 border-accent font-serif text-lg leading-relaxed text-muted italic">
                          "O vídeo inicia com uma interrupção visual de alto contraste combinada com um gatilho psicológico direto, alcançando uma interrupção imediata de padrão."
                        </div>
                      </div>
                      <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink mb-8">Mecânicas de Retenção</h4>
                        <div className="flex flex-wrap gap-3">
                          {['Legendas Dinâmicas', 'Cortes Rápidos', 'Modulação de Zoom', 'Camadas de SFX', 'Loop Contínuo'].map((t, i) => (
                            <span key={i} className="px-5 py-3 border border-line text-[10px] font-bold uppercase tracking-widest text-muted hover:border-accent hover:text-accent transition-colors">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink mb-8">Linha do Tempo Narrativa</h4>
                      <div className="space-y-4">
                        {[
                          { step: '00-03s', desc: 'Interrupção de Padrão + Gancho' },
                          { step: '03-15s', desc: 'Escalação do Problema' },
                          { step: '15-35s', desc: 'A Revelação do "Segredo"' },
                          { step: '35-42s', desc: 'CTA de Alta Fricção' }
                        ].map((s, i) => (
                          <div key={i} className="flex items-center gap-8 group">
                            <span className="font-mono text-[11px] text-accent font-bold w-20">{s.step}</span>
                            <div className="flex-1 p-5 border border-line group-hover:border-accent transition-colors text-[11px] font-bold uppercase tracking-widest text-muted">
                              {s.desc}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Strategic Summary */}
                  <div className="bg-ink p-12 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-accent/10 blur-[100px] rounded-full" />
                    <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                      <TrendingUp className="w-4 h-4 text-accent" /> Inteligência Estratégica
                    </h4>
                    <p className="text-white/60 leading-relaxed font-light text-base max-w-3xl">
                      Este ativo aproveita o gatilho psicológico do "Paradoxo da Produtividade". A edição de ritmo acelerado evita o desvio cognitivo, enquanto o CTA final usa uma pergunta de loop aberto para forçar o engajamento na seção de comentários. Recomendado para escala em nichos de alta competição.
                    </p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-12 bg-slate-50 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-10 mt-auto">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-ink flex items-center justify-center">
                      <Terminal className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-1">Ação Recomendada</p>
                      <p className="text-[13px] font-bold text-ink uppercase tracking-widest">Sintetizar Roteiro da Referência</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none px-10 py-5 border border-line text-[11px] font-bold uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-3">
                      <Download className="w-4 h-4" /> Exportar PDF
                    </button>
                    <button className="flex-1 sm:flex-none px-12 py-5 bg-ink text-white text-[11px] font-bold uppercase tracking-widest hover:bg-accent transition-all flex items-center justify-center gap-3 group">
                      Gerar Roteiro <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
