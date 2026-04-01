# PRD — INFInder

## Inteligência Competitiva de Ads com IA

---

## 1. Visão do Produto

**INFInder** é a plataforma que transforma dados públicos de anúncios em vantagem competitiva real. Enquanto seus concorrentes gastam milhares testando criativos, você descobre o que já funciona — e faz melhor.

**Tagline:** _"Descubra. Analise. Domine."_

**Posicionamento:** Não somos uma ferramenta de espionagem. Somos um radar de inteligência que revela padrões invisíveis no mercado de ads — e traduz em ações concretas com IA.

---

## 2. Público-alvo

### Persona 1 — "O Gestor de Tráfego"
- 25-40 anos, trabalha com múltiplos clientes
- Precisa de referências rápidas para criar novos criativos
- Dor: gasta horas scrollando a Ad Library manualmente
- Gatilho de compra: economia de tempo + resultados melhores

### Persona 2 — "O Dono de E-commerce"
- 30-50 anos, investe R$5k-50k/mês em ads
- Quer saber o que seus concorrentes diretos estão rodando
- Dor: sente que está sempre um passo atrás
- Gatilho de compra: ver os ads dos concorrentes organizados + análise IA

### Persona 3 — "A Agência"
- Equipe de 3-15 pessoas, gerencia 10+ clientes
- Precisa de relatórios e insights para múltiplas marcas
- Dor: não tem processo escalável de pesquisa competitiva
- Gatilho de compra: centralizar inteligência + impressionar clientes

---

## 3. Design System

### 3.1 Identidade Visual

**Conceito:** "Dark Intelligence" — interface escura premium que transmite sofisticação e poder. O usuário deve sentir que tem acesso a informações exclusivas, como um painel de controle de uma agência de inteligência.

**Paleta de cores:**

| Token | Light | Dark (principal) | Uso |
|-------|-------|-------------------|-----|
| `--bg-primary` | `#FAFAFA` | `#0A0A0F` | Background principal |
| `--bg-secondary` | `#F5F5F5` | `#12121A` | Cards, sidebars |
| `--bg-elevated` | `#FFFFFF` | `#1A1A26` | Modais, popovers, cards elevados |
| `--accent` | `#6C5CE7` | `#7C6CF0` | Ações principais, CTAs, links |
| `--accent-glow` | — | `#7C6CF0/20%` | Glow sutil nos hovers |
| `--success` | `#00B894` | `#00D9A3` | Scores altos, status ativo, métricas positivas |
| `--warning` | `#FDCB6E` | `#FFEAA7` | Scores médios, alertas |
| `--danger` | `#E17055` | `#FF7675` | Scores baixos, erros, limites atingidos |
| `--text-primary` | `#1A1A2E` | `#E8E8ED` | Texto principal |
| `--text-secondary` | `#636E72` | `#8B8B9E` | Texto secundário, labels |
| `--text-muted` | `#B2BEC3` | `#4A4A5E` | Placeholders, hints |
| `--border` | `#DFE6E9` | `#1E1E2E` | Bordas de cards |
| `--border-subtle` | `#F0F0F0` | `#16161F` | Separadores sutis |
| `--gradient-hero` | — | `linear-gradient(135deg, #6C5CE7 0%, #A29BFE 50%, #74B9FF 100%)` | Hero, badges premium |
| `--gradient-score` | — | `linear-gradient(135deg, #00B894, #55EFC4)` | Score ring fill |

**Tipografia:**

| Elemento | Font | Weight | Size |
|----------|------|--------|------|
| Display (hero) | Inter | 800 | 56-72px |
| H1 | Inter | 700 | 32-40px |
| H2 | Inter | 600 | 24-28px |
| H3 | Inter | 600 | 18-20px |
| Body | Inter | 400 | 14-16px |
| Label | Inter | 500 | 12-13px, uppercase, tracking wide |
| Code/Data | JetBrains Mono | 400 | 13-14px |

**Espaçamento:** Sistema de 4px. Paddings de cards: 20px. Gaps entre cards: 16px. Border-radius: 12px (cards), 8px (inputs), 24px (tags/badges).

**Sombras (dark mode):**
```
--shadow-card: 0 1px 3px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.03);
--shadow-elevated: 0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05);
--shadow-glow: 0 0 20px rgba(124,108,240,0.15);
```

### 3.2 Micro-interações e Animações

Cada interação deve ser intencional e satisfatória. O app deve sentir-se "vivo" sem ser pesado.

| Elemento | Animação | Duração | Easing |
|----------|----------|---------|--------|
| Cards ao aparecer | Fade up + scale (0.96 → 1.0) | 300ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Hover em cards | Translate Y -2px + border glow accent | 200ms | ease-out |
| Score ring | Stroke-dashoffset animado (0 → valor) | 800ms | `cubic-bezier(0.4, 0, 0.2, 1)` |
| Números/contadores | Count-up animado | 600ms | ease-out |
| Sidebar nav | Background slide suave no item ativo | 200ms | ease-in-out |
| Modal abrir | Backdrop fade + modal scale (0.95 → 1) + slide up | 250ms | spring |
| Toast/notificação | Slide in da direita + auto-dismiss | 300ms in, 200ms out | ease |
| Skeleton loading | Shimmer gradient animado | 1.5s loop | linear |
| Botão CTA hover | Sutil scale (1 → 1.02) + shadow glow expand | 200ms | ease-out |
| Pipeline rodando | Pulse dot + progress steps animados | contínuo | — |
| Badge "Novo" | Pulse sutil (opacity 0.7 → 1) | 2s loop | ease-in-out |

### 3.3 Componentes-chave do Design System

**ScoreRing** — Componente circular SVG que mostra o score do ad (1-10):
- Anel circular com gradiente (success → warning → danger conforme score)
- Número grande centralizado com fonte mono
- Animação de preenchimento ao entrar na viewport
- Tamanhos: `sm` (40px), `md` (64px), `lg` (96px)

**AdCard** — Card de ad no grid:
- Thumbnail do ad com overlay gradiente na parte inferior
- Badge de plataforma (Meta = ícone roxo, Google = ícone azul) no canto superior esquerdo
- Nome do concorrente + data como metadata
- Score ring pequeno no canto inferior direito (se analisado)
- Badge "NOVO" com pulse se adicionado nos últimos 3 dias
- Badge "WINNER" com ícone de troféu se ativo há mais de 30 dias
- Hover: eleva card + mostra preview do headline

**StatCard** — Card de métrica do dashboard:
- Ícone com background circular gradiente
- Número grande com count-up animado
- Label descritivo
- Sparkline mini (últimos 7 dias) no fundo do card em opacidade baixa
- Indicador de tendência (↑ verde / ↓ vermelho) com percentual

**UsageMeter** — Medidor de uso do plano:
- Barra horizontal com gradiente (accent → danger conforme se aproxima do limite)
- Texto "X de Y" à direita
- Quando > 80%: borda muda para warning
- Quando 100%: shake animation + tooltip de upgrade

**PlatformBadge** — Badge de plataforma:
- Meta: fundo roxo/azul com ícone, texto "Meta Ads"
- Google: fundo azul/verde com ícone, texto "Google Ads"
- Design pill-shaped com ícone à esquerda

**CompetitorAvatar** — Avatar do concorrente:
- Círculo com as iniciais do nome
- Cor de fundo gerada deterministicamente a partir do nome (hash → HSL)
- Ring de borda sutil

**AnalysisPanel** — Painel de análise IA:
- Seções colapsáveis: Hook, Oferta, CTA, Tom, Público
- Tags coloridas para strengths (verde) e weaknesses (vermelho)
- Suggestions com ícone de lâmpada e fundo azul sutil
- "Powered by AI" badge com sparkle icon

---

## 4. Páginas — Especificação Detalhada

### 4.1 Landing Page (`/`)

**Objetivo:** Converter visitante em cadastro gratuito. Taxa alvo: 8-12%.

**Estrutura:**

#### Seção 1 — Hero (viewport inteira)
- **Background:** Gradient mesh animado sutil (roxo → azul → preto) com partículas flutuantes em opacidade baixa
- **Headline:** "Seus concorrentes gastam milhares testando ads. Você só precisa **olhar**."
  - "olhar" com underline animado em gradiente accent
- **Sub-headline:** "INFInder monitora Meta e Google Ads dos seus concorrentes, analisa com IA e entrega insights que economizam seu orçamento."
- **CTA principal:** Botão grande "Começar grátis" (gradiente accent, glow no hover, seta animada →)
- **CTA secundário:** "Ver como funciona" (scroll suave para seção 2)
- **Social proof:** Logo strip dos tipos de empresa que usam (não logos reais, mas categorias: "E-commerces", "Agências", "SaaS", "Infoprodutores") com ícones
- **Mockup:** Screenshot do dashboard (dark mode) com glassmorphism sutil, floating e rotacionado 3-5° com parallax no scroll

#### Seção 2 — Demo Interativa
- **Título:** "Veja em ação — sem cadastro"
- **Componente:** Mini-demo interativa (não funcional, mas com dados mockados)
  - Usuário digita um nome de marca fictício
  - Aparece uma grid de 6 ads mockados com animação de entrada staggered
  - Clicar em um ad abre mini-modal com análise IA mockada
  - Score ring anima preenchendo
- **CTA ao final:** "Quer ver com dados reais? É grátis para começar."

#### Seção 3 — Como Funciona (3 steps)
- **Layout:** 3 colunas com ícones animados (Lottie ou CSS)
- **Step 1:** "Cadastre concorrentes" — Ícone de radar pulsando. "Adicione o Facebook Page ID ou domínio do Google. Pronto."
- **Step 2:** "IA monitora 24/7" — Ícone de robô com olhos que piscam. "Scraping automático da Meta Ad Library e Google Transparency Center."
- **Step 3:** "Insights acionáveis" — Ícone de gráfico crescendo. "Análise de hook, oferta, CTA, público. Score de 1-10. Sugestões de melhoria."
- Cada step tem uma mini-ilustração ou screenshot abaixo
- Steps conectados por linhas animadas (path SVG com stroke-dashoffset)

#### Seção 4 — Features Grid
- **Layout:** Grid 2x3 com cards
- **Features:**
  1. **Radar de Ads** — Monitore Meta + Google Ads em um só lugar. Dedup automático.
  2. **Análise IA** — Score 1-10, hooks, ofertas, CTAs, público-alvo. Tudo automatizado.
  3. **Winner Detection** — Ads ativos há 30+ dias = provavelmente funcionam. Nós destacamos.
  4. **Filtros Inteligentes** — Por plataforma, formato, status, concorrente. Encontre o que precisa em segundos.
  5. **Alertas de Novos Ads** — Saiba quando um concorrente lançar um novo criativo.
  6. **API & Exportação** — (Em breve) Integre com suas ferramentas. Exporte relatórios PDF.

#### Seção 5 — Prova Social / Resultados
- **Layout:** Carousel ou grid de depoimentos (fictícios no MVP, reais depois)
- **Formato:** Card com foto, nome, cargo, quote, métrica de resultado
  - "Reduzi meu CPA em 34% no primeiro mês usando insights do INFInder" — Gestor de Tráfego
  - "Economizo 8h/semana que gastava pesquisando ads manualmente" — Dono de Agência
- **Counter animado:** "Já analisamos X.XXX ads" (número real do banco, atualizado)

#### Seção 6 — Pricing
- **Âncora:** "Quanto custa não saber o que seus concorrentes estão fazendo?"
- **3 cards:** Starter, Pro (destacado com ring + badge "POPULAR"), Agency
- **Design:** Cards elevados com hover glow. Feature list com check icons.
- **Toggle:** Mensal / Anual (desconto de 20% no anual — mostrar economia)
- **Free tier mention:** "Comece grátis com 1 concorrente e 20 ads/mês"
- **Garantia:** "7 dias de garantia. Cancele a qualquer momento."
- **CTA:** "Começar com [Plano]" → redireciona para /auth se não logado

#### Seção 7 — FAQ
- Accordion com 6-8 perguntas comuns
- Estilo: fundo escuro, borda sutil, ícone + animado ao abrir

#### Seção 8 — CTA Final
- **Background:** Gradient mesh similar ao hero
- **Headline:** "Pronto para ver o que está perdendo?"
- **CTA:** Grande, centralizado, com glow pulsante

#### Footer
- Logo INFInder + tagline
- Links: Produto, Preços, Login, Termos, Privacidade
- "Feito no Brasil 🇧🇷"

---

### 4.2 Auth Page (`/auth`)

**Objetivo:** Login/cadastro sem fricção. Minimizar abandono.

**Design:**
- **Layout split:** Lado esquerdo com visual branding (gradient mesh + tagline + mini-features em bullets). Lado direito com formulário.
- **Mobile:** Apenas o formulário, com branding no topo reduzido
- **Tabs:** "Entrar" | "Criar conta" — transição suave com slide horizontal
- **Campos:** Email, Senha (com toggle ver/ocultar), Nome (só no cadastro)
- **CTA:** Botão full-width com gradiente accent
- **Separador:** "ou continue com" + divider
- **Google OAuth:** Botão estilo Google com ícone. One-click.
- **Social proof micro:** "Junte-se a X profissionais de marketing" (abaixo do form)
- **Animação:** Form fields aparecem com stagger fade-in ao trocar de tab

---

### 4.3 Dashboard (`/dashboard`)

**Objetivo:** Overview instantâneo do estado da inteligência. First thing the user sees every day.

**Layout:**

```
┌──────────────────────────────────────────────────────────────┐
│  Header: "Bom dia, [Nome]" + período selecionado (7d/30d)   │
├──────────────────────────────────────────────────────────────┤
│  [StatCard]  [StatCard]  [StatCard]  [StatCard]              │
│  Ads         Concorrentes Análises   Score Médio             │
│  monitorados               IA        dos ads                 │
├──────────────┬───────────────────────────────────────────────┤
│              │                                               │
│  Novos Ads   │   Winners Detectados                          │
│  (últimos    │   (ads ativos 30+ dias)                       │
│   7 dias)    │                                               │
│              │   Grid com os top 6 winners,                  │
│  Feed        │   ordenados por tempo ativo                   │
│  vertical    │                                               │
│  com cards   │   Cada card com:                              │
│  compactos   │   - Thumbnail                                 │
│              │   - Dias ativo (badge verde)                   │
│              │   - Score ring                                 │
│              │   - Nome do concorrente                        │
├──────────────┴───────────────────────────────────────────────┤
│  Uso do Plano                                                │
│  [UsageMeter: Ads] ████████████░░░░ 156/200                  │
│  [UsageMeter: IA]  ██████░░░░░░░░░░  34/50                   │
│                                                              │
│  Plano Starter · Upgrade para Pro →                          │
├──────────────────────────────────────────────────────────────┤
│  Atividade Recente (timeline)                                │
│  • 14:32 — Novo ad detectado: [Concorrente X] (Meta)         │
│  • 12:15 — Análise concluída: Score 8/10 (Google)            │
│  • Ontem — Pipeline rodou para [Concorrente Y]               │
└──────────────────────────────────────────────────────────────┘
```

**Interações:**
- StatCards clicáveis → levam para a seção correspondente
- "Winners Detectados" → clicar no card abre o modal de análise
- "Upgrade para Pro" → link com cor accent, tooltip mostrando o que ganha no upgrade
- Greeting dinâmico: "Bom dia" / "Boa tarde" / "Boa noite" baseado no horário

**Empty state (novo usuário):**
- Illustration centralizada (astronauta/explorador com telescópio)
- "Comece adicionando seu primeiro concorrente"
- Wizard de 3 steps inline: 1. Adicionar concorrente → 2. Rodar pipeline → 3. Ver resultados
- Cada step com preview visual do que vai acontecer

---

### 4.4 Ads Intelligence (`/ads`)

**Objetivo:** Hub central de todos os ads monitorados. Browse, filtre, analise.

**Layout:**

```
┌──────────────────────────────────────────────────────────────┐
│  Header: "Ads Intelligence"                                  │
│  Sub: "X ads monitorados · Y analisados"                     │
├──────────────────────────────────────────────────────────────┤
│  [Filtros]                                                   │
│  Plataforma ▾   Concorrente ▾   Formato ▾   Status ▾        │
│  Período ▾      Ordenar ▾       🔍 Buscar no texto           │
├──────────────────────────────────────────────────────────────┤
│  Tabs: Todos (234) · Meta (189) · Google (45) · Winners (12) │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │ AdCard  │  │ AdCard  │  │ AdCard  │  │ AdCard  │        │
│  │         │  │         │  │         │  │  🏆     │        │
│  │ [thumb] │  │ [thumb] │  │ [thumb] │  │ [thumb] │        │
│  │ Meta    │  │ Google  │  │ Meta    │  │ Meta    │        │
│  │ Score:7 │  │ Novo!   │  │ Score:9 │  │ Winner  │        │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘        │
│                                                              │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │  ...    │  │  ...    │  │  ...    │  │  ...    │        │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘        │
│                                                              │
│  [Pagination: ← 1 2 3 ... 12 →]                             │
└──────────────────────────────────────────────────────────────┘
```

**Tab "Winners":**
- Filtra automaticamente ads ativos há 30+ dias
- Ordenado por tempo ativo (mais antigo = mais provável winner)
- Badge especial com troféu dourado
- Tooltip: "Este ad está ativo há X dias. Provavelmente performa bem."

**Busca:**
- Search bar com debounce 300ms
- Busca no `ad_text`, `headline` e `cta_text`
- Highlight do termo nos resultados

**Filtros:**
- Dropdowns estilizados com animação
- Filtros ativos mostram badges abaixo da barra com botão X para remover
- Botão "Limpar filtros" aparece quando há filtros ativos

**AdCard detalhes:**
- Aspect ratio 4:5 para thumbnails (padrão Stories/Reels)
- Overlay com gradiente escuro na parte inferior para legibilidade
- Corner badges: plataforma (top-left), score ring (bottom-right)
- Status badge: "Ativo" (verde pulse) / "Inativo" (cinza)
- "NOVO" badge: pulse animation, aparece se criado nos últimos 3 dias
- "WINNER 🏆" badge: fundo dourado, aparece se ativo há 30+ dias
- Se não analisado: ícone de sparkle com tooltip "Clique para analisar"

---

### 4.5 Ad Detail Modal

**Trigger:** Clicar em qualquer AdCard

**Layout:**

```
┌──────────────────────────────────────────────────────────────┐
│  ✕                                                    [close]│
│                                                              │
│  ┌─────────────────────┬────────────────────────────────────┐│
│  │                     │  Meta Ads · [Concorrente]          ││
│  │    [Ad Creative]    │  Ativo desde 14/02/2026 (45 dias)  ││
│  │    Imagem/Vídeo     │                                    ││
│  │    em tamanho       │  "Headline do anúncio aqui"        ││
│  │    generoso         │                                    ││
│  │                     │  Texto completo do ad com           ││
│  │                     │  quebras de linha preservadas...     ││
│  │                     │                                    ││
│  │                     │  CTA: Comprar Agora                ││
│  │                     │  Landing: example.com/oferta       ││
│  └─────────────────────┴────────────────────────────────────┘│
│                                                              │
│  ┌─── Análise IA ──── Score: [ScoreRing 8/10] ─────────────┐│
│  │                                                          ││
│  │  🎯 Hook                                                 ││
│  │  "O anúncio usa uma pergunta provocativa nos..."         ││
│  │                                                          ││
│  │  💰 Oferta                                                ││
│  │  "Desconto de 40% com urgência temporal..."              ││
│  │                                                          ││
│  │  📢 CTA                                                   ││
│  │  "CTA direto 'Comprar Agora' com senso de urgência..."   ││
│  │                                                          ││
│  │  🎭 Tom de Voz                                            ││
│  │  "Informal e urgente, usa linguagem coloquial..."        ││
│  │                                                          ││
│  │  👥 Público-alvo                                          ││
│  │  "Mulheres 25-45, interessadas em beleza..."             ││
│  │                                                          ││
│  │  ✅ Pontos Fortes        ❌ Pontos Fracos                 ││
│  │  + Hook forte            - Texto muito longo              ││
│  │  + Oferta clara          - CTA genérico                   ││
│  │  + Visual impactante                                     ││
│  │                                                          ││
│  │  💡 Sugestões de Melhoria                                 ││
│  │  1. Encurtar o texto para mobile...                      ││
│  │  2. Testar CTA mais específico...                        ││
│  │                                                          ││
│  │  [Exportar PDF]  [Copiar Análise]  [Usar como referência]││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  Se não analisado:                                           │
│  ┌──────────────────────────────────────────────────────────┐│
│  │  ✨ Este ad ainda não foi analisado                       ││
│  │                                                          ││
│  │  [  Analisar com IA  ]   ← botão grande com glow         ││
│  │                                                          ││
│  │  "Usa 1 de suas X análises restantes este mês"           ││
│  └──────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘
```

**Interações:**
- Setas ← → para navegar entre ads sem fechar o modal
- Keyboard: ESC fecha, ← → navega
- Seções da análise colapsáveis (default: todas abertas)
- "Copiar Análise" → copia texto formatado para clipboard com toast de confirmação
- Loading state da análise: skeleton shimmer nas seções + progress indicator

---

### 4.6 Concorrentes (`/competitors`)

**Objetivo:** Gerenciar concorrentes monitorados. Entry point para rodar o pipeline.

**Layout:**

```
┌──────────────────────────────────────────────────────────────┐
│  Concorrentes (3/10 do seu plano)     [+ Adicionar]          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ [Avatar]  Concorrente X                          [⋮ menu]││
│  │           Meta: @concorrentex · Google: concx.com.br     ││
│  │                                                          ││
│  │  📊 142 ads   📈 28 novos (7d)   ⭐ Score médio: 7.2     ││
│  │                                                          ││
│  │  Último scan: há 2 horas                                 ││
│  │                                                          ││
│  │  [Rodar Pipeline ▶]    [Ver Ads →]                       ││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ [Avatar]  Concorrente Y                          [⋮ menu]││
│  │           Meta: @concorrentey                            ││
│  │                                                          ││
│  │  📊 67 ads    📈 5 novos (7d)    ⭐ Score médio: 6.8      ││
│  │                                                          ││
│  │  Último scan: há 1 dia                                   ││
│  │                                                          ││
│  │  [Rodar Pipeline ▶]    [Ver Ads →]                       ││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Card de concorrente — detalhes:**
- CompetitorAvatar com iniciais coloridas
- Badges de plataformas conectadas (Meta, Google)
- Stats inline: total ads, novos na semana, score médio
- Último scan com timestamp relativo
- "Rodar Pipeline" — botão primário que inicia scraping + análise
  - Durante execução: progress indicator com steps (Scraping Meta... → Scraping Google... → Analisando...)
  - Ao completar: toast com resumo "12 novos ads encontrados, 5 analisados"
- Menu ⋮: Editar, Ver ads deste concorrente, Excluir (com confirmação)

**Form de adicionar:**
- Modal ou inline expandível
- Campos: Nome, Meta Page ID (com helper link para encontrar), Google Domain
- Validação em tempo real: ao digitar o Meta Page ID, tenta buscar o nome da página
- "Dica: Você pode encontrar o Page ID em facebook.com/[pagina]/about"

**Empty state:**
- Ilustração de binóculo/radar
- "Adicione seu primeiro concorrente para começar a monitorar"
- Sugestão: "Não sabe o Page ID? Veja como encontrar →" (link para tooltip/guide)

---

### 4.7 Configuração de Marca (`/brand`)

**Objetivo:** Contextualizar análises para a marca do usuário. Futuro: gerar ads personalizados.

**Layout:**

```
┌──────────────────────────────────────────────────────────────┐
│  Sua Marca                                                   │
│  "Configure sua marca para análises mais relevantes"         │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │  [Brand Logo/Avatar]                                     ││
│  │                                                          ││
│  │  Nome da Marca                                           ││
│  │  ┌────────────────────────────────────────────┐          ││
│  │  │ Minha Marca                                │          ││
│  │  └────────────────────────────────────────────┘          ││
│  │                                                          ││
│  │  Nicho / Segmento                                        ││
│  │  ┌────────────────────────────────────────────┐          ││
│  │  │ E-commerce de moda feminina                │          ││
│  │  └────────────────────────────────────────────┘          ││
│  │                                                          ││
│  │  Tom de Voz                                              ││
│  │  ┌────────────────────────────────────────────┐          ││
│  │  │ Jovem, descontraído, usa gírias.           │          ││
│  │  │ Fala direto com mulheres 20-35 anos.       │          ││
│  │  └────────────────────────────────────────────┘          ││
│  │  Sugestões rápidas: [Formal] [Casual] [Técnico]          ││
│  │                     [Divertido] [Inspiracional]           ││
│  │                                                          ││
│  │  Público-alvo                                            ││
│  │  ┌────────────────────────────────────────────┐          ││
│  │  │ Mulheres 25-40, classe B, interessadas     │          ││
│  │  │ em moda e lifestyle                        │          ││
│  │  └────────────────────────────────────────────┘          ││
│  │                                                          ││
│  │  [Salvar]                                                ││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  💡 Para que serve?                                           │
│  "Suas informações de marca serão usadas pela IA para        │
│   gerar análises contextualizadas e, em breve, criar         │
│   sugestões de ads personalizadas para o SEU negócio."       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Detalhes:**
- "Sugestões rápidas" para tom de voz: chips clicáveis que preenchem o campo
- Preview em tempo real de como a IA usaria essas informações (sidebar ou card abaixo)
- Autosave com indicador de "Salvo ✓" sutil

---

### 4.8 Pricing (`/pricing`)

**Objetivo:** Converter free users em pagantes. Upsell de Starter → Pro → Agency.

**Design:**

**Header:**
- "Invista em inteligência, não em tentativa e erro"
- Sub: "ROI médio: economize X horas/mês em pesquisa manual"

**Toggle:** Mensal | Anual (-20%)
- Toggle animado estilo switch
- Ao selecionar anual: preço faz count-down animado + badge "Economia de R$XX/ano"

**Cards (3 colunas):**

| | Starter | Pro ⭐ | Agency |
|---|---------|--------|--------|
| Preço mensal | R$97 | R$197 | R$497 |
| Preço anual | R$77/mês | R$157/mês | R$397/mês |
| Concorrentes | 3 | 10 | 30 |
| Ads/mês | 200 | 800 | 3.000 |
| Análises IA/mês | 50 | 200 | 600 |
| Plataformas | Meta Ads | Meta + Google | Todas |
| Winner Detection | ✓ | ✓ | ✓ |
| Alertas | ✗ | ✓ | ✓ |
| Relatórios PDF | ✗ | ✗ | ✓ |
| API Access | ✗ | ✗ | ✓ |
| Suporte | Email | Prioritário | Dedicado |

**Card Pro — destacado:**
- Border com gradiente accent
- Badge "MAIS POPULAR" com glow
- Shadow mais forte
- Escala ligeiramente maior (scale 1.02)

**Abaixo dos cards:**
- "Comece grátis" — mention do free tier (1 concorrente, 20 ads)
- "Garantia de 7 dias" com ícone de escudo
- "Cancele a qualquer momento" com ícone de calendar
- FAQ accordion com 5-6 perguntas sobre pagamento

**Upsell triggers (dentro do app):**
- Quando atinge 80% do limite: banner amarelo "Você usou 80% das análises. Upgrade →"
- Quando atinge 100%: modal bloqueante "Limite atingido. Faça upgrade para continuar."
  - Mostra comparação do plano atual vs próximo
  - Botão primário grande "Upgrade agora"
  - Botão secundário "Ver todos os planos"
- Ao tentar adicionar concorrente além do limite: tooltip "Seu plano permite X concorrentes. Upgrade →"

---

### 4.9 Settings (`/settings`)

**Objetivo:** Gerenciar conta e assinatura.

**Layout — Tabs verticais:**

**Tab "Conta":**
- Avatar com upload (ou iniciais)
- Nome (editável)
- Email (readonly)
- Botão "Alterar senha" → abre form inline

**Tab "Assinatura":**
- Plano atual com badge
- Data de renovação
- Forma de pagamento (últimos 4 dígitos)
- "Alterar plano" → vai para /pricing
- "Cancelar assinatura" → modal de confirmação com:
  - "Tem certeza? Você perderá acesso a:"
  - Lista do que perde
  - Oferta de retenção: "Que tal o plano Starter por R$67/mês?" (desconto temporário)
  - Botão "Manter minha assinatura" (primário) vs "Cancelar mesmo assim" (texto vermelho)

**Tab "Notificações":** (futuro)
- Toggle: Email quando novo ad detectado
- Toggle: Resumo semanal por email
- Toggle: Alerta de limite de uso

---

## 5. Elementos de Conversão e Retenção

### 5.1 Onboarding (Primeiro acesso)

Wizard de 3 steps após primeiro login:

**Step 1 — "Configure sua marca" (30 segundos)**
- Campos essenciais: Nome e Nicho
- Skip disponível
- Progress bar no topo

**Step 2 — "Adicione seu primeiro concorrente" (30 segundos)**
- Campo de nome + Meta Page ID ou Google Domain
- Helper: "Não sabe? Cole o link da página do Facebook"
- Auto-extract do Page ID a partir de URLs coladas

**Step 3 — "Veja a mágica acontecer" (automático)**
- Roda o pipeline automaticamente
- Tela de loading com steps animados:
  - ✅ Buscando ads... (3-5s simulado)
  - ✅ Encontrados 23 ads
  - ✅ Analisando top 3 com IA...
  - ✅ Pronto! Veja seus resultados →
- Confetti animation ao completar 🎉
- Redirect para dashboard com os dados

### 5.2 Gamificação

**Achievement System (badges no perfil):**
- 🔍 "Primeiro Scan" — Rode seu primeiro pipeline
- 🧠 "Analista" — Analise 10 ads com IA
- 🏆 "Caçador de Winners" — Encontre 5 winners
- 🎯 "Sniper" — Encontre um ad com score 9+
- 📊 "Data Driven" — Monitore 5+ concorrentes
- ⚡ "Power User" — Use 80%+ do seu plano

**Streak Counter:**
- "X dias consecutivos usando INFInder"
- Mini calendar no dashboard mostrando dias ativos
- Sutil, não intrusivo

### 5.3 Triggers de Upgrade

| Trigger | Local | Mensagem | CTA |
|---------|-------|----------|-----|
| Limite 80% | Banner topo | "Você usou 80% das análises IA" | Upgrade → |
| Limite 100% | Modal | "Análises esgotadas este mês" | Upgrade agora |
| Concorrente bloqueado | Inline | "Plano permite X concorrentes" | Desbloquear |
| Feature Pro | Badge lock | "Disponível no Pro" | Ver planos |
| Winner encontrado | Toast | "Winner detectado! No Pro, receba alertas" | Saiba mais |
| 7 dias de uso | Email | "Você analisou X ads! Que tal desbloquear mais?" | Upgrade |
| Pipeline lento | Inline | "No Pro, pipelines rodam com prioridade" | Upgrade |

### 5.4 Emails Automatizados

| Trigger | Quando | Assunto |
|---------|--------|---------|
| Welcome | Cadastro | "Bem-vindo ao INFInder — seu radar está ativo 🛰️" |
| Primeiro pipeline | Após onboarding | "Seus primeiros insights estão prontos" |
| Novo winner | Ad ativo 30+ dias | "[Concorrente] tem um winner — veja a análise" |
| Resumo semanal | Toda segunda | "Semana no INFInder: X novos ads, Y análises" |
| Limite próximo | 80% uso | "Você está quase no limite — hora do upgrade?" |
| Inatividade 3 dias | 3 dias sem login | "Seus concorrentes não pararam — veja o que mudou" |
| Inatividade 7 dias | 7 dias sem login | "X novos ads detectados desde sua última visita" |

---

## 6. Fluxos Técnicos

### 6.1 Pipeline Flow

```
Usuário clica "Rodar Pipeline"
        │
        ▼
[POST /api/pipeline/run]
        │
        ├── Check auth
        ├── Check usage limits
        │
        ▼
[Scrape Meta Ads]  ──────┐
  via Apify               │
  (poll até completar)    │
                          │
[Scrape Google Ads] ─────┤
  via Apify              │
  (poll até completar)   │
                          │
                          ▼
              [Dedup + Save to DB]
              (upsert on external_id)
                          │
                          ▼
              [Analyze top 5 with Gemini]
              (sequential, 4s delay)
                          │
                          ▼
              [Save analyses + increment usage]
                          │
                          ▼
              [Return summary to client]
```

### 6.2 Auth Flow

```
                    ┌─────────────┐
                    │  /auth page │
                    └──────┬──────┘
                           │
              ┌────────────┴────────────┐
              │                         │
       Email/Password              Google OAuth
              │                         │
              ▼                         ▼
    supabase.auth.signIn    supabase.auth.signInWithOAuth
              │                         │
              ▼                         ▼
         Set cookies              Redirect to Google
              │                         │
              ▼                         ▼
         /dashboard              /auth/callback
                                       │
                                       ▼
                              exchangeCodeForSession
                                       │
                                       ▼
                                  /dashboard
```

### 6.3 Payment Flow

```
/pricing → Clica "Começar"
      │
      ▼
[POST /api/payments/subscribe]
      │
      ├── Cria PreApproval no MercadoPago
      ├── Salva subscription no DB (status: pending)
      │
      ▼
Redirect → MercadoPago Checkout
      │
      ▼
Usuário paga
      │
      ▼
[POST /api/payments/webhook] ← MercadoPago notifica
      │
      ├── Verifica subscription status
      ├── Atualiza user.plan = 'pro'
      ├── Atualiza subscription.status = 'authorized'
      │
      ▼
Usuário volta → /dashboard (plano atualizado)
```

---

## 7. Métricas de Sucesso

### North Star Metric
**MRR (Monthly Recurring Revenue)** — meta inicial: R$5.000 nos primeiros 3 meses.

### Métricas de Produto

| Métrica | Meta | Como medir |
|---------|------|------------|
| Activation Rate | 60% | % de signups que rodam 1 pipeline no dia 1 |
| D7 Retention | 40% | % de users ativos após 7 dias |
| Free → Paid Conversion | 5-8% | % de free users que viram pagantes em 30 dias |
| Avg Analyses/User/Week | 15 | Engajamento com feature core |
| NPS | 40+ | Pesquisa in-app mensal |
| Time to Value | < 3 min | Tempo do cadastro até primeiro insight |
| Churn Rate | < 5%/mês | Cancelamentos / total pagantes |

---

## 8. Roadmap

### v1.0 — MVP (agora)
- [x] Auth (email + Google)
- [x] CRUD concorrentes e marcas
- [x] Scraping Meta + Google via Apify
- [x] Análise com Gemini Flash
- [x] Dashboard + Ads grid + Análise modal
- [x] Mercado Pago subscriptions
- [x] Landing page + Pricing

### v1.1 — Engajamento (mês 2)
- [ ] Onboarding wizard
- [ ] Winner detection automático (ads ativos 30+ dias)
- [ ] Busca textual nos ads
- [ ] Notificações de novos ads detectados
- [ ] Empty states com CTAs inteligentes

### v1.2 — Retenção (mês 3)
- [ ] Emails automatizados (welcome, weekly digest, alerts)
- [ ] Achievement system / badges
- [ ] Comparação de ads side-by-side
- [ ] Histórico de análises por concorrente (timeline)
- [ ] Exportar análise como PDF

### v2.0 — Expansão (mês 4-6)
- [ ] Gerador de ads com Claude (baseado nas análises)
- [ ] Alertas em tempo real (webhook-based, sem polling manual)
- [ ] API pública para integrações
- [ ] Dashboard de tendências (categorias de ads em alta)
- [ ] Multi-user por workspace (para agências)
- [ ] TikTok Ads scraping
- [ ] Relatórios white-label para agências

---

## 9. Stack Técnica

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 16 + TypeScript + Tailwind CSS v4 |
| Componentes | shadcn/ui + componentes custom |
| Animações | Framer Motion + CSS animations |
| Auth | Supabase Auth (email + Google OAuth) |
| Database | Supabase PostgreSQL + RLS |
| Scraping | Apify (Meta Ad Library + Google Transparency) |
| IA Análise | Google Gemini 2.0 Flash |
| IA Geração | Claude Sonnet (v2.0) |
| Pagamentos | Mercado Pago (PreApproval subscriptions) |
| Deploy | Vercel |
| Emails | Resend (futuro) |
| Monitoramento | Vercel Analytics + Sentry (futuro) |

---

_INFInder — Descubra. Analise. Domine._
