'use client'

import { useState, useEffect } from 'react'
import {
  TrendingUp,
  Users,
  Eye,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  Terminal,
  Activity,
  Play,
  ChevronRight
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

const chartData = [
  { name: 'Seg', views: 4000, engagement: 2400 },
  { name: 'Ter', views: 3000, engagement: 1398 },
  { name: 'Qua', views: 2000, engagement: 9800 },
  { name: 'Qui', views: 2780, engagement: 3908 },
  { name: 'Sex', views: 1890, engagement: 4800 },
  { name: 'Sab', views: 2390, engagement: 3800 },
  { name: 'Dom', views: 3490, engagement: 4300 },
]

const channelData = [
  { name: 'Instagram', value: 45, color: '#F27D26' },
  { name: 'TikTok', value: 30, color: '#141414' },
  { name: 'YouTube', value: 25, color: '#64748b' },
]

export default function Dashboard() {
  const [totalAds, setTotalAds] = useState<number | null>(null)
  const [totalCompetitors, setTotalCompetitors] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const [adsRes, competitorsRes] = await Promise.all([
          fetch('/api/ads?limit=1'),
          fetch('/api/competitors'),
        ])

        if (adsRes.ok) {
          const adsData = await adsRes.json()
          setTotalAds(adsData.total ?? 0)
        }

        if (competitorsRes.ok) {
          const competitorsData = await competitorsRes.json()
          setTotalCompetitors(Array.isArray(competitorsData) ? competitorsData.length : 0)
        }
      } catch (err) {
        console.error('Erro ao carregar estatísticas:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const stats = [
    { label: 'Visualizações Totais', value: totalAds !== null ? String(totalAds) : '--', trend: '+12.5%', icon: Eye, color: 'text-blue-600' },
    { label: 'Engajamento Médio', value: '8.4%', trend: '+2.1%', icon: Zap, color: 'text-accent' },
    { label: 'Novos Seguidores', value: totalCompetitors !== null ? String(totalCompetitors) : '--', trend: '+18.7%', icon: Users, color: 'text-emerald-600' },
    { label: 'Velocidade Viral', value: '94.2', trend: '-3.4%', icon: TrendingUp, color: 'text-amber-600', negative: true },
  ]

  return (
    <div className="space-y-12">
      {/* Header - Editorial Recipe */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-line pb-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-accent" />
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent">Visão Geral de Inteligência</span>
          </div>
          <h1 className="text-6xl font-display font-bold text-ink uppercase tracking-tight">
            Métricas do <span className="text-accent">Sistema</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-3 px-6 py-3 border border-line bg-white text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all">
            <Calendar className="w-4 h-4" /> Últimos 30 Dias
          </button>
          <button className="flex items-center gap-3 px-6 py-3 bg-ink text-white text-[10px] font-bold uppercase tracking-widest hover:bg-accent transition-all group">
            <Download className="w-4 h-4 group-hover:translate-y-1 transition-transform" /> Exportar Protocolo
          </button>
        </div>
      </header>

      {/* Stats Grid - Technical Dashboard Recipe */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line shadow-sm">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-10 group hover:bg-slate-50 transition-colors">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 border border-line flex items-center justify-center bg-slate-50 group-hover:bg-white transition-colors">
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <div className={cn(
                "flex items-center gap-1 font-mono text-[11px] font-bold",
                stat.negative ? "text-rose-600" : "text-emerald-600"
              )}>
                {stat.negative ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-2">{stat.label}</p>
            <p className="text-4xl font-display font-bold text-ink tracking-tighter">
              {loading && (stat.label === 'Visualizações Totais' || stat.label === 'Novos Seguidores') ? (
                <span className="inline-block w-16 h-10 bg-black/5 animate-pulse" />
              ) : (
                stat.value
              )}
            </p>
          </div>
        ))}
      </div>

      {/* Main Charts - Split Layout Recipe */}
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 bg-white border border-line p-10 shadow-sm">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-ink mb-2">Trajetória de Crescimento</h3>
              <p className="text-sm text-muted font-light">Análise neural do alcance do conteúdo ao longo do tempo</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-accent" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Visualizações</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-slate-200" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Engajamento</span>
              </div>
            </div>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F27D26" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#F27D26" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b', letterSpacing: '0.1em' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#141414',
                    border: 'none',
                    borderRadius: '0',
                    color: '#fff',
                    fontSize: '11px',
                    fontFamily: 'JetBrains Mono'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#F27D26"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorViews)"
                />
                <Area
                  type="monotone"
                  dataKey="engagement"
                  stroke="#e2e8f0"
                  strokeWidth={2}
                  fill="transparent"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-line p-10 shadow-sm">
          <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-ink mb-12">Distribuição de Canais</h3>
          <div className="h-[300px] w-full mb-12">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#141414' }}
                  width={100}
                />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{
                    backgroundColor: '#141414',
                    border: 'none',
                    borderRadius: '0',
                    color: '#fff',
                    fontSize: '11px',
                    fontFamily: 'JetBrains Mono'
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-6">
            {channelData.map((item, i) => (
              <div key={i} className="flex items-center justify-between border-b border-line pb-4 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2" style={{ backgroundColor: item.color }} />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-muted">{item.name}</span>
                </div>
                <span className="font-mono text-[11px] font-bold text-ink">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity - Data Grid Recipe */}
      <div className="bg-white border border-line shadow-sm overflow-hidden">
        <div className="p-10 border-b border-line flex items-center justify-between">
          <div>
            <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-ink mb-2">Log de Eventos Neurais</h3>
            <p className="text-sm text-muted font-light">Atividade do sistema em tempo real e gatilhos de conteúdo</p>
          </div>
          <button className="text-[10px] font-bold uppercase tracking-widest text-accent hover:underline">Ver Protocolo Completo</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-line">
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">ID do Protocolo</th>
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Tipo de Evento</th>
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Status</th>
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Timestamp</th>
                <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted text-right">Impacto</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 'PRT-9421', type: 'Síntese Viral', status: 'Concluído', time: '2 min atrás', impact: '+4.2%' },
                { id: 'PRT-9420', type: 'Scraping de Concorrentes', status: 'Ativo', time: '12 min atrás', impact: 'N/A' },
                { id: 'PRT-9419', type: 'Pontuação Neural', status: 'Concluído', time: '45 min atrás', impact: '+12.8%' },
                { id: 'PRT-9418', type: 'Alinhamento de Marca', status: 'Falhou', time: '1 hora atrás', impact: '-0.5%' },
                { id: 'PRT-9417', type: 'Sincronização Global', status: 'Concluído', time: '3 horas atrás', impact: '+1.2%' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-line last:border-0 hover:bg-slate-50 transition-colors cursor-pointer group">
                  <td className="px-10 py-8 font-mono text-[11px] font-bold text-ink">{row.id}</td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-3">
                      <Activity className="w-4 h-4 text-muted group-hover:text-accent transition-colors" />
                      <span className="text-[11px] font-bold uppercase tracking-widest text-ink">{row.type}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className={cn(
                      "px-3 py-1 text-[9px] font-bold uppercase tracking-widest",
                      row.status === 'Concluído' ? "bg-emerald-50 text-emerald-600" :
                      row.status === 'Ativo' ? "bg-blue-50 text-blue-600" :
                      "bg-rose-50 text-rose-600"
                    )}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-[11px] text-muted font-light">{row.time}</td>
                  <td className="px-10 py-8 text-right font-mono text-[11px] font-bold text-ink">{row.impact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
