# INFInder — Documento de Handoff Completo

## O que é
INFInder é um SaaS de inteligência competitiva de ads. Monitora anúncios de concorrentes no Meta (Facebook/Instagram) e Google Ads, analisa com IA (Gemini) e gera criativos adaptados para a marca do cliente.

**URL de produção:** https://infinder.vercel.app
**Repositório:** https://github.com/eutoiludida-web/infinder

---

## Stack Técnica

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16.2.1 + TypeScript |
| Styling | Tailwind CSS v4 (dark/light theme) |
| Animações | Framer Motion (motion/react) |
| Auth | Supabase Auth (email + Google OAuth) |
| Database | Supabase PostgreSQL + RLS |
| Scraping | Apify (Meta Ad Library + Google Transparency) |
| IA Análise | Google Gemini 2.0 Flash |
| Pagamentos | Mercado Pago (PreApproval subscriptions) |
| Deploy | Vercel |
| Fonts | Outfit (display), Inter (body), JetBrains Mono (code) |
| Icons | lucide-react |

---

## Estrutura do Projeto

```
src/
├── app/
│   ├── page.tsx                    # Landing page (pública)
│   ├── layout.tsx                  # Root layout
│   ├── auth/
│   │   ├── page.tsx                # Login/Signup (Supabase Auth)
│   │   └── callback/route.ts      # OAuth callback
│   ├── pricing/page.tsx            # Planos (pública)
│   ├── terms/page.tsx              # Termos de uso
│   ├── privacy/page.tsx            # Política de privacidade
│   ├── (app)/                      # Rotas protegidas (requer login)
│   │   ├── layout.tsx              # Layout com sidebar + header + auth check
│   │   ├── dashboard/page.tsx      # Dashboard com stats reais
│   │   ├── ads/page.tsx            # Busca por keyword + grid de ads + modal análise
│   │   ├── competitors/page.tsx    # CRUD concorrentes + rodar pipeline
│   │   ├── brand/page.tsx          # Config marca + identity score
│   │   ├── generate/page.tsx       # Gerador de criativos com Gemini
│   │   ├── settings/page.tsx       # Dados do user + cancelar assinatura
│   │   └── videos/page.tsx         # Feed viral (mock data ainda)
│   └── api/
│       ├── ads/route.ts            # GET ads com filtros e paginação
│       ├── analyze/route.ts        # POST analisa ad com Gemini
│       ├── brands/route.ts         # GET/POST marcas
│       ├── brands/[id]/route.ts    # PUT/DELETE marca
│       ├── competitors/route.ts    # GET/POST concorrentes
│       ├── competitors/[id]/route.ts # PUT/DELETE concorrente
│       ├── generate/route.ts       # POST gera criativos com Gemini
│       ├── search/route.ts         # POST inicia busca / GET poll resultados
│       ├── pipeline/run/route.ts   # POST roda scraping + análise completo
│       ├── scrape/meta/route.ts    # POST scrape Meta Ads via Apify
│       ├── scrape/google/route.ts  # POST scrape Google Ads via Apify
│       ├── payments/subscribe/route.ts  # POST cria assinatura MercadoPago
│       ├── payments/webhook/route.ts    # POST webhook MercadoPago
│       └── payments/cancel/route.ts     # POST cancela assinatura
├── lib/
│   ├── supabase.ts                 # Cliente browser + admin (lazy init)
│   ├── supabase-server.ts          # Cliente server com cookies async
│   ├── auth.ts                     # getSession() e getUser()
│   ├── apify-meta.ts              # Scraping Meta Ad Library via Apify
│   ├── apify-google.ts            # Scraping Google Ads via Apify
│   ├── meta-api.ts                # Meta Graph API (complemento, não usado atualmente)
│   ├── gemini.ts                  # Análise de ads com Gemini Flash
│   ├── pipeline.ts               # Orquestração: scrape → dedup → análise
│   ├── mercadopago.ts            # MercadoPago PreApproval
│   ├── usage.ts                  # Controle de limites por plano
│   ├── mockData.ts               # Dados mock (não usado em produção)
│   └── utils.ts                  # cn(), formatDate(), formatCurrency()
├── components/
│   ├── sidebar.tsx                # Sidebar com nav + plano + logout
│   └── ui/
│       ├── AdCard.tsx             # Card de ad com thumbnail, score, badges
│       ├── StatCard.tsx           # Card de métrica com ícone e trend
│       ├── ScoreRing.tsx          # Anel circular SVG de score
│       └── UsageMeter.tsx         # Barra de uso do plano
├── context/
│   └── ThemeContext.tsx           # Dark/light mode com localStorage
├── types/
│   ├── index.ts                   # Types backend (snake_case, match Supabase)
│   ├── frontend.ts                # Types frontend (camelCase, match UI)
│   └── plans.ts                   # PLAN_LIMITS e PLAN_FEATURES
└── supabase/
    └── migrations/
        ├── 001_initial_schema.sql  # Tabelas, RLS, triggers, functions
        ├── 002_fix_increment_usage.sql  # Fix SQL injection
        └── 003_allow_null_competitor.sql # competitor_id nullable
```

---

## Banco de Dados (Supabase)

**Projeto:** https://wcqoowzemfaohkrjlbrq.supabase.co

### Tabelas

| Tabela | Descrição |
|--------|-----------|
| `users` | Extends auth.users. Campos: plan, subscription_id, subscription_status |
| `brands` | Marca do user: name, niche, tone_of_voice, target_audience |
| `competitors` | Concorrentes: name, meta_page_id, google_domain |
| `ads` | Ads scrapeados: platform, external_id, ad_text, headline, image_urls, format, status |
| `ad_analyses` | Análises Gemini: hook, offer, cta_analysis, tone, strengths, weaknesses, score |
| `subscriptions` | Assinaturas MercadoPago: mp_subscription_id, plan, status |
| `usage` | Uso mensal: ads_scraped, ai_analyses (unique per user+month) |

### RLS
- Todas as tabelas têm RLS ativado
- Policy: `auth.uid() = user_id` em todas
- Trigger `on_auth_user_created` cria row em `users` automaticamente no signup

### Functions
- `increment_usage(p_user_id, p_month, p_type)` — incrementa contador de uso com validação de input
- `handle_new_user()` — trigger que cria user row no signup
- `update_updated_at()` — trigger de updated_at na tabela users

---

## Variáveis de Ambiente

### Essenciais (sem estas nada funciona)
```
NEXT_PUBLIC_SUPABASE_URL=https://wcqoowzemfaohkrjlbrq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...
GEMINI_API_KEY=AIza...
APIFY_API_TOKEN=apify_api_...
NEXT_PUBLIC_APP_URL=https://infinder.vercel.app
```

### Opcionais
```
META_ACCESS_TOKEN=          # Meta Graph API (não usado atualmente)
MERCADOPAGO_ACCESS_TOKEN=   # Pagamentos (precisa configurar pra cobrar)
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=
MP_PLAN_STARTER_ID=         # IDs dos planos criados no MercadoPago
MP_PLAN_PRO_ID=
MP_PLAN_AGENCY_ID=
```

**IMPORTANTE:** Env vars vão no painel da Vercel (Settings → Environment Variables), não no código.

---

## Fluxos Implementados

### 1. Auth
- Email + senha via Supabase Auth
- Google OAuth via Supabase
- Callback em `/auth/callback`
- Proteção de rotas via client-side check no `(app)/layout.tsx` (sem middleware — incompatível com Vercel Edge Runtime)
- Redirect automático: sem login → `/auth`, com login → `/dashboard`

### 2. Busca por Keyword (async com polling)
```
Frontend: POST /api/search { keyword } → recebe runId
Frontend: GET /api/search?runId=xxx  → poll a cada 5s
Backend: Apify scrapeia Meta Ad Library (3-7 min)
Backend: Quando SUCCEEDED, retorna ads normalizados
Frontend: Mostra no grid
```

**PROBLEMA ATUAL:** A conta Apify ficou sem créditos ($0 de $5 free tier). O actor `curious_coder~facebook-ads-library-scraper` agora é pay-per-result. Precisa recarregar créditos no Apify ou usar a Meta Ad Library API oficial (precisa de META_ACCESS_TOKEN).

### 3. Pipeline (scrape + análise)
- Cadastra concorrente com meta_page_id e/ou google_domain
- Clica "Rodar Pipeline" → `POST /api/pipeline/run`
- Scrapeia Meta e/ou Google ads via Apify
- Salva no banco com dedup (unique: user_id + external_id)
- Analisa top 5 ads com Gemini (sequential, 4s delay entre calls)

### 4. Análise com IA
- `POST /api/analyze { adId }` → Gemini analisa o ad
- Retorna: hook, offer, cta_analysis, tone, target_audience, strengths, weaknesses, improvements, score (1-10)
- Verifica limites de uso antes de chamar a IA

### 5. Gerador de Criativos (diferencial)
- `POST /api/generate { adId, brandId }`
- Gemini recebe: análise do ad do concorrente + config da marca
- Gera 3 conceitos: title, hook, headline, text, cta, captionIg, captionTt, hashtags
- Verifica limites de uso

### 6. Pagamentos
- `POST /api/payments/subscribe { plan }` → cria PreApproval no MercadoPago, retorna checkout_url
- `POST /api/payments/webhook` → MercadoPago notifica, atualiza user.plan
- `POST /api/payments/cancel` → cancela assinatura

---

## Design System

### Tema
- **Dark mode** por padrão com toggle claro/escuro
- Cores: accent `#7C6CF0` (roxo), success `#00D9A3`, warning `#FFEAA7`, danger `#FF7675`
- Glass morphism: `backdrop-blur-xl`, bordas `rgba(255,255,255,0.1)`
- Atmosphere: gradients radiais sutis no background

### Componentes Custom
- `AdCard` — card com thumbnail 4:5, badges (NEW, WINNER, platform), score
- `StatCard` — glass card com ícone, valor, trend
- `ScoreRing` — SVG circular com score 1-10 color-coded
- `UsageMeter` — barra de progresso com cores (green/yellow/red)
- `Sidebar` — nav com Zap logo, items, plano, logout

---

## Planos

| Recurso | Free | Starter R$97 | Pro R$197 | Agency R$497 |
|---------|------|-------------|-----------|--------------|
| Concorrentes | 1 | 3 | 10 | 30 |
| Ads/mês | 20 | 200 | 800 | 3.000 |
| Análises IA/mês | 5 | 50 | 200 | 600 |

---

## Segurança (auditado)

### Implementado
- RLS em todas as tabelas (user só acessa seus dados)
- Validação Zod em todas as API routes
- Auth check (`getSession()`) em todas as routes (exceto webhook)
- Error messages genéricas pro cliente (sem leak de detalhes internos)
- Input validation (page/limit clamped, UUIDs validados)
- SQL injection fix no `increment_usage` (validação de p_type)
- IDOR fix no `/api/generate` (filtro user_id no ad_analyses)
- Env vars secretas sem NEXT_PUBLIC_ prefix

### Pendente
- Webhook do MercadoPago sem verificação de assinatura (C1)
- Rate limiting nas API routes (W4)
- Rotação das API keys (foram expostas nesta conversa)

---

## O que Funciona Hoje

| Feature | Status |
|---------|--------|
| Landing page | Funcionando |
| Auth (email + Google) | Funcionando |
| Dashboard (dados reais + greeting dinâmico) | Funcionando |
| Competitors (CRUD + pipeline) | Funcionando |
| Brand (save/update + identity score) | Funcionando |
| Ads (busca keyword + grid + modal) | Funcionando (precisa crédito Apify) |
| Análise IA (Gemini) | Funcionando |
| Gerador de criativos | Funcionando |
| Settings (dados user + cancelar) | Funcionando |
| Pricing (checkout MercadoPago) | Precisa configurar MercadoPago |
| Termos + Privacidade | Funcionando |
| Dark/Light mode | Funcionando |

---

## O que Precisa Fazer

### Urgente (pra funcionar)
1. **Recarregar créditos no Apify** — conta sem saldo, busca não funciona
2. **OU implementar Meta Ad Library API oficial** — grátis, precisa de META_ACCESS_TOKEN do Facebook Developers

### Antes de lançar
3. **Configurar MercadoPago** — criar app, planos, pegar credenciais de produção
4. **Verificação de assinatura no webhook** do MercadoPago
5. **Rate limiting** nas API routes
6. **Rotacionar todas as API keys** (Supabase, Apify, Gemini) — foram expostas durante o desenvolvimento
7. **Configurar Google OAuth** no Supabase (redirect URLs)
8. **Configurar domínio customizado** na Vercel (opcional)

### Melhorias futuras
9. Página de Videos conectada com API real
10. Exportar análise como PDF
11. Alertas por email de novos ads
12. Onboarding wizard mais elaborado
13. Multi-user por workspace (agências)
14. Google Ads search por domínio na UI

---

## Como Rodar Localmente

```bash
cd infinder
npm install
# Preencher .env.local com as keys
npm run dev
# http://localhost:3000
```

## Como Fazer Deploy

1. Push pro GitHub: `git push origin main`
2. Vercel faz deploy automático
3. Env vars devem estar configuradas no painel da Vercel

---

## Configurações Externas

### Supabase
- **Projeto:** wcqoowzemfaohkrjlbrq
- **Site URL:** https://infinder.vercel.app (configurado em Auth → URL Configuration)
- **Redirect URLs:** https://infinder.vercel.app/**

### Vercel
- **Projeto:** infinder
- **Framework:** Next.js (auto-detectado)
- **Root Directory:** (raiz do repo)

### Apify
- **Conta:** blossoming_minstrel (free tier)
- **Actor usado:** curious_coder~facebook-ads-library-scraper
- **Input format:** `{ urls: [{ url: "https://facebook.com/ads/library/?q=keyword&country=BR" }], maxAds: 10 }`
- **Response format:** snapshot.body.text, snapshot.cards[].resized_image_url, snapshot.cta_text, item.page_name, item.ad_archive_id
