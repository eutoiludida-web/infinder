'use client'

import Link from 'next/link'
import { Zap, ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-display font-bold mb-4">Política de Privacidade</h1>
          <p className="text-text-muted text-sm">Última atualização: 01 de abril de 2026</p>
        </div>

        <div className="space-y-8 text-text-secondary leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-xl font-display font-bold text-text-primary">1. Dados que Coletamos</h2>
            <p>Coletamos as seguintes informações:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-text-primary">Dados de cadastro:</strong> nome, email e senha (criptografada)</li>
              <li><strong className="text-text-primary">Dados de uso:</strong> páginas visitadas, funcionalidades utilizadas, frequência de acesso</li>
              <li><strong className="text-text-primary">Dados de pagamento:</strong> processados pelo Mercado Pago. Não armazenamos dados de cartão.</li>
              <li><strong className="text-text-primary">Dados de marca:</strong> informações que você insere sobre sua marca (nome, nicho, público-alvo)</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-display font-bold text-text-primary">2. Como Usamos seus Dados</h2>
            <p>Utilizamos seus dados para:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fornecer e manter nosso serviço</li>
              <li>Personalizar análises de IA baseadas no perfil da sua marca</li>
              <li>Processar pagamentos e gerenciar assinaturas</li>
              <li>Enviar comunicações importantes sobre o serviço</li>
              <li>Melhorar nossos algoritmos e funcionalidades</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-display font-bold text-text-primary">3. Compartilhamento de Dados</h2>
            <p>Não vendemos seus dados pessoais. Compartilhamos dados apenas com:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-text-primary">Supabase:</strong> armazenamento seguro de dados e autenticação</li>
              <li><strong className="text-text-primary">Google (Gemini):</strong> processamento de análises de IA (dados anonimizados)</li>
              <li><strong className="text-text-primary">Mercado Pago:</strong> processamento de pagamentos</li>
              <li><strong className="text-text-primary">Vercel:</strong> hospedagem da aplicação</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-display font-bold text-text-primary">4. Segurança</h2>
            <p>Implementamos medidas de segurança para proteger seus dados:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Criptografia em trânsito (HTTPS/TLS)</li>
              <li>Row Level Security (RLS) no banco de dados</li>
              <li>Tokens de autenticação seguros</li>
              <li>Senhas armazenadas com hash bcrypt</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-display font-bold text-text-primary">5. Seus Direitos (LGPD)</h2>
            <p>De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados incompletos ou desatualizados</li>
              <li>Solicitar a exclusão dos seus dados</li>
              <li>Revogar o consentimento de uso</li>
              <li>Solicitar a portabilidade dos dados</li>
            </ul>
            <p>Para exercer qualquer um desses direitos, entre em contato: suporte@infinder.com.br</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-display font-bold text-text-primary">6. Cookies</h2>
            <p>Utilizamos cookies essenciais para manter sua sessão ativa e preferências (como tema claro/escuro). Não utilizamos cookies de rastreamento de terceiros.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-display font-bold text-text-primary">7. Contato</h2>
            <p>Para questões relacionadas à privacidade: suporte@infinder.com.br</p>
          </section>
        </div>
      </main>
    </div>
  )
}
