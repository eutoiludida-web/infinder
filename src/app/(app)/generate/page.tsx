'use client'

import { useState } from 'react'
import {
  Sparkles,
  Video,
  Briefcase,
  ArrowRight,
  Copy,
  Check,
  Download,
  AtSign,
  Play,
  ChevronDown,
  Clock,
  MessageSquare,
  Hash,
  Terminal
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'

export default function Generate() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [concepts, setConcepts] = useState<any[] | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleGenerate = () => {
    setIsGenerating(true)
    setConcepts(null)

    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false)
      setConcepts([
        {
          id: '1',
          title: 'O Paradoxo da Produtividade',
          hook: 'Já sentiu que o dia não tem horas suficientes? Eu descobri o segredo...',
          script: [
            { time: '0-3s', text: 'Gancho visual com zoom no rosto + legendas de alto contraste.' },
            { time: '3-10s', text: 'Escalar o problema: mesa bagunçada, estresse visível.' },
            { time: '10-25s', text: 'Apresentar a solução: Técnica Pomodoro Adaptada.' },
            { time: '25-40s', text: 'Resultado: Agenda limpa e foco total.' },
            { time: '40-45s', text: 'CTA: Comente "FOCO" para receber meu guia.' }
          ],
          captionIg: 'Cansado de procrastinar? 😴\n\nEu testei todas as técnicas e esta foi a única que realmente funcionou para mim. O segredo não é trabalhar mais, é trabalhar melhor.\n\nAssista até o fim e me diga o que achou! 👇\n\n#produtividade #foco #gestaodotempo',
          captionTt: 'Como dobrei minha produtividade em 1 semana 🚀 #produtividade #dicas #foco',
          hashtags: ['produtividade', 'foco', 'sucesso', 'rotina', 'disciplina', 'marketing', 'negocios', 'mindset', 'hacks', 'dicas'],
          cta: 'Comente "FOCO" para o guia'
        },
        {
          id: '2',
          title: 'Expectativa vs Realidade',
          hook: 'O que as pessoas pensam que é ser um criador vs o que realmente é...',
          script: [
            { time: '0-5s', text: 'Cena estética: café, luz perfeita, laptop.' },
            { time: '5-15s', text: 'Corte seco: luz caindo, erro de exportação, exaustão.' },
            { time: '15-30s', text: 'A mensagem: Consistência vence a perfeição.' },
            { time: '30-40s', text: 'CTA: Siga para os bastidores reais.' }
          ],
          captionIg: 'Nem tudo são flores no mundo digital... 🥀\n\nPostamos o resultado, mas o processo é onde a mágica acontece. Não desista no primeiro erro de exportação!\n\nQuem mais se identifica? 😂\n\n#bastidores #criador #realidade #marketingdigital',
          captionTt: 'A vida real de um criador de conteúdo 🤡 #bastidores #realidade #vlog',
          hashtags: ['bastidores', 'criador', 'realidade', 'vlog', 'marketing', 'humor', 'trabalho', 'digital', 'conteudo', 'dicas'],
          cta: 'Siga para mais bastidores'
        }
      ])
    }, 2000)
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-black/10 pb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-black/40">
            <Sparkles className="w-3 h-3 text-accent" />
            Motor de Síntese Viral
          </div>
          <h1 className="text-5xl font-display font-bold uppercase tracking-tight text-black">Motor de Criativos</h1>
          <p className="text-black/60 max-w-xl font-sans leading-relaxed">
            Sintetize referências virais em roteiros de alta performance adaptados ao DNA da sua marca com precisão cirúrgica.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <div className="text-[10px] font-mono uppercase tracking-wider text-black/40">Status do Motor</div>
            <div className="text-xs font-mono font-bold text-emerald-600 uppercase">Otimizado</div>
          </div>
          <div className="w-12 h-12 border border-black flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Configuration Grid */}
      <div className="grid md:grid-cols-2 gap-px bg-black/10 border border-black/10 mb-16">
        {/* Reference Asset */}
        <div className="bg-white p-10 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 border border-black flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Ativo de Referência</h3>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 block">Selecionar Inteligência Recente</label>
            <div className="relative">
              <select className="w-full bg-transparent border-b border-black/20 py-3 font-sans text-base focus:outline-none focus:border-black transition-colors appearance-none">
                <option>Como crescer no Reels em 2026</option>
                <option>Minha rotina matinal produtiva</option>
                <option>3 hacks de edição no CapCut</option>
              </select>
              <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40 pointer-events-none" />
            </div>
          </div>

          <div className="p-4 bg-black/5 flex items-center gap-4">
            <div className="w-12 h-16 bg-black/10 overflow-hidden shrink-0">
              <img src="https://picsum.photos/seed/ref/100/150" className="w-full h-full object-cover grayscale" alt="Ref" referrerPolicy="no-referrer" />
            </div>
            <div>
              <p className="text-[8px] font-bold uppercase tracking-widest text-orange-600">Referência Ativa</p>
              <p className="text-xs font-bold text-black truncate">Estratégia de Conteúdo Viral</p>
              <p className="text-[9px] font-bold text-black/40">Score de Viralidade: 9.2</p>
            </div>
          </div>
        </div>

        {/* Brand Profile */}
        <div className="bg-white p-10 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 border border-black flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Perfil da Marca</h3>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 block">Selecionar Identidade de Marca</label>
            <div className="relative">
              <select className="w-full bg-transparent border-b border-black/20 py-3 font-sans text-base focus:outline-none focus:border-black transition-colors appearance-none">
                <option>Annie 100F (Nicho: Marketing)</option>
                <option>Loja de Roupas X (Nicho: Moda)</option>
              </select>
              <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-px bg-black/10 border border-black/10">
            <div className="bg-white p-4">
              <p className="text-[8px] font-bold uppercase tracking-widest text-black/40 mb-1">Parâmetros de Tom</p>
              <p className="text-[10px] font-bold uppercase">Educativo & Inspirador</p>
            </div>
            <div className="bg-white p-4">
              <p className="text-[8px] font-bold uppercase tracking-widest text-black/40 mb-1">Público-Alvo</p>
              <p className="text-[10px] font-bold uppercase">Empreendedores</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center mb-24">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className={cn(
            "px-16 py-5 font-bold uppercase tracking-[0.3em] text-xs transition-all flex items-center gap-4 group border border-black",
            isGenerating ? "bg-black/5 text-black/30 border-black/10 cursor-not-allowed" : "bg-black text-white hover:bg-transparent hover:text-black"
          )}
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border border-black/30 border-t-black rounded-full animate-spin" />
              Sintetizando...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Gerar 3 Conceitos
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>

      {/* Results */}
      <AnimatePresence>
        {concepts && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          >
            {concepts.map((concept) => (
              <div key={concept.id} className="border border-black/10 bg-white flex flex-col group hover:border-black transition-colors">
                <div className="p-10 border-b border-black/10 flex items-center justify-between bg-black/5">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-orange-600 block mb-2">Conceito #{concept.id}</span>
                    <h3 className="text-2xl font-display font-bold uppercase tracking-tight text-black">{concept.title}</h3>
                  </div>
                  <button className="w-10 h-10 border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all">
                    <Download className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-10 space-y-12 flex-1">
                  {/* Hook */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-black/40 flex items-center gap-3">
                      <Sparkles className="w-3 h-3 text-orange-500" /> Arquitetura do Gancho
                    </h4>
                    <p className="text-black/80 font-sans text-lg leading-relaxed italic border-l-2 border-black pl-6 py-2">
                      &quot;{concept.hook}&quot;
                    </p>
                  </div>

                  {/* Script */}
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-black/40 flex items-center gap-3">
                      <Clock className="w-3 h-3" /> Linha do Tempo Narrativa
                    </h4>
                    <div className="space-y-4">
                      {concept.script.map((s: any, i: number) => (
                        <div key={i} className="flex gap-6 group/item">
                          <span className="w-12 text-[10px] font-mono font-bold text-orange-600 pt-1">[{s.time}]</span>
                          <div className="flex-1 text-xs font-sans text-black/60 leading-relaxed group-hover/item:text-black transition-colors">
                            {s.text}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Captions */}
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-black/40 flex items-center gap-3">
                      <MessageSquare className="w-3 h-3" /> Legendas & Metadados
                    </h4>

                    <div className="space-y-6">
                      <div className="p-6 bg-black/5 relative group/caption">
                        <div className="flex items-center gap-2 mb-4">
                          <AtSign className="w-3 h-3" />
                          <span className="text-[9px] font-bold uppercase tracking-widest text-black/40">Instagram</span>
                        </div>
                        <p className="text-xs text-black/70 whitespace-pre-wrap leading-relaxed pr-8 font-sans">
                          {concept.captionIg}
                        </p>
                        <button
                          onClick={() => copyToClipboard(concept.captionIg, `ig-${concept.id}`)}
                          className="absolute top-6 right-6 p-2 bg-white border border-black/10 text-black/40 hover:text-black transition-all opacity-0 group-hover/caption:opacity-100"
                        >
                          {copiedId === `ig-${concept.id}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {concept.hashtags.map((tag: string, i: number) => (
                          <span key={i} className="px-3 py-1 border border-black/5 text-[9px] font-bold uppercase tracking-widest text-black/40 hover:border-black/20 hover:text-black transition-colors flex items-center gap-1">
                            <Hash className="w-2 h-2" /> {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 border-t border-black/10">
                  <button className="w-full py-4 bg-black text-white font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-transparent hover:text-black border border-black transition-all">
                    Salvar na Biblioteca de Inteligência
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
