'use client'

import Link from 'next/link'
import { Zap, ArrowLeft } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <nav className="border-b border-border bg-bg-primary/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center shadow-glow">
              <Zap size={20} className="text-white fill-white" />
            </div>
            <span className="text-xl font-display font-bold tracking-tighter">INFInder</span>
          </Link>
          <Link href="/" className="text-sm text-text-secondary hover:text-accent flex items-center gap-2">
            <ArrowLeft size={16} /> Voltar
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        <div>
          <h1 className="text-4xl font-display font-bold mb-4">Termos de Uso</h1>
          <p className="text-text-muted text-sm">Última atualização: 01 de abril de 2026</p>
        </div>

        <div className="space-y-8 text-text-secondary leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-xl font-display font-bold text-text-primary">1. Aceitação dos Termos</h2>
            <p>Ao acessar e utilizar a plataforma INFInder, você concorda com estes Termos de Uso. Se não concordar com qualquer parte destes termos, não utilize nossos serviços.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-display font-bold text-text-primary">2. Descrição do Serviço</h2>
            <p>O INFInder é uma plataforma de inteligência competitiva de anúncios que permite monitorar, analisar e obter insights sobre anúncios de concorrentes nas plataformas Meta (Facebook/Instagram) e Google Ads.</p>
            <p>Nosso serviço utiliza dados publicamente disponíveis nas bibliotecas de anúncios oficiais dessas plataformas.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-display font-bold text-text-primary">3. Cadastro e Conta</h2>
            <p>Para utilizar o INFInder, você deve criar uma conta fornecendo informações verdadeiras e atualizadas. Você é responsável por manter a confidencialidade de suas credenciais de acesso.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-display font-bold text-text-primary">4. Planos e Pagamentos</h2>
            <p>O INFInder oferece planos de assinatura mensal. Os valores e recursos de cada plano estão descritos na página de preços. As cobranças são realizadas mensalmente através do Mercado Pago.</p>
            <p>Você pode cancelar sua assinatura a qualquer momento. O acesso aos recursos premium permanecerá ativo até o final do período já pago.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-display font-bold text-text-primary">5. Uso Aceitável</h2>
            <p>Você concorda em utilizar o INFInder apenas para fins legítimos de pesquisa de mercado e inteligência competitiva. É proibido:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Utilizar o serviço para atividades ilegais ou fraudulentas</li>
              <li>Tentar acessar dados de outros usuários sem autorização</li>
              <li>Revender ou redistribuir dados obtidos através da plataforma</li>
              <li>Sobrecarregar intencionalmente nossos servidores</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-display font-bold text-text-primary">6. Propriedade Intelectual</h2>
            <p>Todo o conteúdo, design, código e funcionalidades do INFInder são de propriedade exclusiva da empresa. Os dados de anúncios analisados são de propriedade de seus respectivos anunciantes.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-display font-bold text-text-primary">7. Limitação de Responsabilidade</h2>
            <p>O INFInder fornece informações para fins de pesquisa e análise. Não garantimos a precisão absoluta dos dados ou resultados de análise de IA. O uso das informações para decisões de negócio é de responsabilidade exclusiva do usuário.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-display font-bold text-text-primary">8. Contato</h2>
            <p>Para dúvidas sobre estes termos, entre em contato através do email: suporte@infinder.com.br</p>
          </section>
        </div>
      </main>
    </div>
  )
}
