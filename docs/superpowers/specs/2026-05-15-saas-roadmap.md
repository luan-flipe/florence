# Florence Dashboard → SaaS Multi-tenant Roadmap

**Versão:** 1.0
**Data:** 15/05/2026
**Status:** Planejamento — implementação após entrega Florence (segunda 18/05)

---

## 1. Visão estratégica

Transformar o dashboard de leads (entregue para Florence como single-tenant) em um produto SaaS multi-tenant whitelabel vendível para outras instituições de ensino e empresas com pipeline de captação de leads.

**Modelo de negócio:** Freemium com 3 tiers.
**Florence:** começa no Free como "design partner", upgrade natural para Pro quando atingir limites.

---

## 2. Estrutura de tiers

| Recurso | **Free** | **Pro** | **Business** |
|---------|:---------:|:-------:|:------------:|
| **Leads capturados/mês** | 50 | 500 | Ilimitado |
| **Usuários no dashboard** | 3 | 15 | Ilimitado |
| **Landing pages conectadas** | 1 | 5 | Ilimitado |
| **Kanban + Lista** | ✅ | ✅ | ✅ |
| **Analytics básico** (total + lista recentes) | ✅ | ✅ | ✅ |
| **Funil de conversão** | ❌ | ✅ | ✅ |
| **Heatmap dia/hora** | ❌ | ✅ | ✅ |
| **Comparativo entre períodos** | ❌ | ✅ | ✅ |
| **Atribuição automática** (round-robin/curso) | ❌ | ✅ | ✅ |
| **Lead scoring** (auto rating 1-5 estrelas) | ❌ | ✅ | ✅ |
| **SLA tracking** (alerta lead não contactado) | ❌ | ✅ | ✅ |
| **Sequências de e-mail** (drip campaign) | ❌ | ✅ | ✅ |
| **Custom fields** no formulário | ❌ | ✅ | ✅ |
| **Tags/etiquetas em leads** | ❌ | ✅ | ✅ |
| **Bulk actions** | ❌ | ✅ | ✅ |
| **Detecção de duplicatas** | ❌ | ✅ | ✅ |
| **Filtros salvos por usuário** | ❌ | ✅ | ✅ |
| **Tarefas/reminders linkados ao lead** | ❌ | ✅ | ✅ |
| **Whitelabel** (logo + cores + fonte) | ❌ | ✅ | ✅ |
| **Domínio customizado** | ❌ (`*.dashboard.luanfelipe.com.br`) | ✅ | ✅ |
| **Notificações push/email no fluxo** | ❌ | ✅ | ✅ |
| **Exportação CSV/Excel** | ❌ | ✅ | ✅ |
| **Webhooks** (lead novo, status muda) | ❌ | ❌ | ✅ |
| **API REST com auth key** | ❌ | ❌ | ✅ |
| **Form builder drag-and-drop** | ❌ | ❌ | ✅ |
| **A/B testing de LP** | ❌ | ❌ | ✅ |
| **Multi-LP com tracking unificado** | ❌ | ❌ | ✅ |
| **Relatórios PDF agendados** | ❌ | ❌ | ✅ |
| **Audit log completo** | ❌ | ❌ | ✅ |
| **Backup automático (90 dias)** | ❌ | ❌ | ✅ |
| **Integração Zapier/Make** | ❌ | ❌ | ✅ |
| **SSO/SAML** | ❌ | ❌ | ✅ |
| **Suporte** | Comunidade | E-mail 24h | WhatsApp dedicado |
| **Preço (BRL/mês)** | R$ 0 | R$ 197 | R$ 497 |

**Estratégia psicológica do Free:**
- Badges "🔒 Pro" em botões/seções desativadas
- Banner sutil quando atingir 70%/90%/100% do limite mensal
- Onboarding mostra o valor antes do paywall
- Lock visual na seção Analytics deixa o "fantasma" do Pro presente

---

## 3. Customização (Whitelabel)

Painel super-admin (`admin.luanfelipe.com.br` ou similar) onde o operador da SaaS gerencia tenants:

```typescript
interface Tenant {
  id: uuid;
  name: string;                  // "Centro Universitário Florence"
  slug: string;                  // "florence" (subdomínio default)
  custom_domain: string | null;  // "dashboard.florence.edu.br" (Pro+)
  logo_url: string | null;       // upload em Supabase Storage
  primary_color: string;         // "#0096d2"
  secondary_color: string;       // "#00508c"
  accent_color: string;          // "#F5C842"
  display_font: "Inter" | "Plus Jakarta" | "Outfit" | "DM Sans";
  tier: "free" | "pro" | "business";
  features_enabled: jsonb;       // overrides do tier padrão
  max_leads_per_month: number;   // herda do tier mas customizável
  max_users: number;
  trial_ends_at: timestamptz | null;
  billing_email: string;
  stripe_customer_id: string | null;
  created_at: timestamptz;
  updated_at: timestamptz;
  active: boolean;
}
```

**Fluxo de injeção visual:**
1. Request chega em `<tenant>.dashboard.luan.com.br` ou domínio custom
2. Middleware identifica o tenant pelo hostname
3. Server Component injeta `data-tenant` no `<html>` + CSS variables (`--primary`, `--logo-url`, etc.)
4. CSS usa as variables → identidade instantânea por tenant sem deploy
5. Logo é carregada via `next/image` da Supabase Storage

---

## 4. Arquitetura multi-tenant

**Opção escolhida: A — Shared DB + tenant_id**

- 1 Supabase database, 1 Vercel project
- Coluna `tenant_id uuid` em **todas** as tabelas de negócio (`leads`, `lead_status`, `comments`, `lead_status_history`)
- Tabela `tenants` (definição acima)
- Tabela `user_profiles` ganha `tenant_id` também
- RLS reescrita: toda policy filtra primeiro por `tenant_id = user.tenant_id`
- `super_admin` (eu) é o único role cross-tenant

**Por que não opção B (DB por cliente):**
- Custo (Supabase free 1 projeto / cliente paga ~$25/mês cada)
- Manutenção de migrations N vezes
- Vendido como add-on Enterprise ("DB dedicado para LGPD") no futuro se houver demanda

**Risco e mitigação:**
- Risco principal: bug de RLS = vazamento entre tenants
- Mitigação: testes de RLS pesados, fuzz testing de queries, dual-check (RLS + filter no app)

---

## 5. Migration multi-tenant

Roteiro de alterações (futura migration `003_multi_tenant.sql`):

```sql
-- Criar tenants
create table tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  custom_domain text unique,
  logo_url text,
  primary_color text default '#0096d2',
  secondary_color text default '#00508c',
  accent_color text default '#F5C842',
  display_font text default 'Inter',
  tier text not null default 'free' check (tier in ('free','pro','business')),
  features_enabled jsonb default '{}',
  max_leads_per_month int default 50,
  max_users int default 3,
  trial_ends_at timestamptz,
  billing_email text,
  stripe_customer_id text,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Adicionar tenant_id em todas as tabelas (backfill com tenant 'florence')
alter table leads add column tenant_id uuid references tenants(id);
alter table user_profiles add column tenant_id uuid references tenants(id);
-- ... idem para lead_status, comments, lead_status_history

-- Backfill: criar tenant florence e atribuir tudo a ele
insert into tenants (slug, name, ...) values ('florence', 'Centro Universitário Florence', ...);
update leads set tenant_id = (select id from tenants where slug = 'florence');
-- ... idem

-- Tornar NOT NULL depois do backfill
alter table leads alter column tenant_id set not null;
-- ... idem

-- Reescrever RLS para incluir tenant_id check
-- ... policies refeitas
```

---

## 6. Painel super-admin

Nova app `apps/admin/` ou rota `/super-admin` no dashboard:

- Lista todos os tenants
- CRUD de tenant (criar/editar/desativar)
- Upload de logo (Supabase Storage bucket público)
- Color picker para cores
- Dropdown de tier
- Botão "Login as tenant" (impersonação para suporte)
- Métricas globais: total de tenants ativos, MRR estimado, leads totais
- Logs de auditoria

---

## 7. Feature flags por tier

```typescript
// lib/features.ts
export const TIER_FEATURES: Record<Tier, Set<Feature>> = {
  free: new Set(['kanban', 'list_view', 'basic_analytics', 'recent_leads']),
  pro: new Set([
    ...FREE_FEATURES,
    'funnel_chart', 'heatmap', 'period_comparison',
    'auto_assignment', 'lead_scoring', 'sla_tracking',
    'email_sequences', 'custom_fields', 'tags',
    'bulk_actions', 'duplicate_detection', 'saved_filters',
    'tasks', 'whitelabel', 'custom_domain',
    'push_notifications', 'csv_export',
  ]),
  business: new Set([
    ...PRO_FEATURES,
    'webhooks', 'rest_api', 'form_builder', 'ab_testing',
    'multi_lp', 'scheduled_reports', 'audit_log',
    'auto_backup', 'integrations', 'sso',
  ]),
};

export function hasFeature(tenant: Tenant, feature: Feature): boolean {
  const base = TIER_FEATURES[tenant.tier].has(feature);
  const override = tenant.features_enabled?.[feature];
  return override ?? base;
}
```

Components usam `<FeatureGate feature="funnel_chart">...</FeatureGate>` que renderiza o conteúdo OU um lock card com CTA "Upgrade para Pro".

---

## 8. Roadmap de implementação

| Semana | Sprint | Entrega |
|--------|--------|---------|
| **15-18/05** | Sprint atual | Florence single-tenant em produção |
| **19-25/05** | Sprint refactor multi-tenant | Migration 003, RLS reescrita, tenant detection no middleware, painel super-admin |
| **26-31/05** | Sprint whitelabel | Customização visual (cores/logo/fonte), CSS variables, upload em Storage |
| **02-08/06** | Sprint feature gates + billing | FeatureGate component, lock screens, Stripe checkout |
| **09-15/06** | Sprint Pro features (parte 1) | Lead scoring, SLA tracking, auto-assignment, custom fields |
| **16-22/06** | Sprint Pro features (parte 2) | Sequências de e-mail, tags, bulk actions, duplicatas, filtros salvos |
| **23-29/06** | Sprint Business features | Webhooks, API REST, audit log |
| **Jul** | Sprint form builder + multi-LP + relatórios PDF | Features avançadas Business |
| **Ago** | Polish, marketing site, launch público | Pricing page, landing comercial, primeiros leads pagantes |

---

## 9. Futuro — IA (terceiro momento)

Reservado para após validação do SaaS:

- **Lead scoring inteligente** — modelo treinado nos dados do tenant (alta confiabilidade)
- **Sugestão de resposta** ao vendedor (GPT/Claude API) baseada no histórico do lead
- **Resumo automático** de conversas/comentários longas
- **Predição de probabilidade de matrícula** com base no comportamento
- **Sugestão de horário ideal de contato** baseado em padrões históricos
- **Sentiment analysis** dos comentários
- **Análise automática de tendências** ("Conversão caiu 15% esta semana porque...")
- **Geração de copy de e-mail/WhatsApp** personalizada por lead
- **Chatbot interno** para perguntas sobre o pipeline ("Quantos leads frios temos?")

---

## 10. Métricas de sucesso

- **MRR (Receita Recorrente Mensal)** — alvo R$ 5k em 3 meses, R$ 20k em 6 meses
- **Conversão Free → Pro** — alvo >15% em 60 dias
- **Churn mensal** — alvo <5%
- **NPS** — alvo >50
- **Time to first lead** — alvo <10 minutos do signup ao primeiro lead capturado
