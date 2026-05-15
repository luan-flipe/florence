# Dashboard de Leads Florence — Design Spec

**Versão:** 1.0
**Data:** 15/05/2026
**Status:** Aprovado, pronto para writing-plans
**Deadline:** segunda-feira, 18/05/2026
**Domínio:** dashboard.florence.edu.br

---

## 1. Visão geral

Dashboard interno para a equipe da Florence gerenciar leads capturados pela LP de Medicina (e futuras LPs). Atende dois públicos com necessidades distintas:

- **Marketing:** visão analítica — KPIs, funil, conversão, fontes
- **Vendas:** visão operacional — kanban com drag & drop, comentários, atribuição

Sistema deployado como segundo projeto Vercel no mesmo monorepo do `apps/medicina`.

---

## 2. Stack

| Camada | Escolha | Motivo |
|--------|---------|--------|
| Framework | Next.js 14 (App Router) | Consistência com LP |
| DB / Auth / Realtime | Supabase | Já configurado, RLS pronto |
| Drag & drop | `@dnd-kit` + `@dnd-kit/sortable` | Acessível, performático, mantido |
| Charts | `recharts` | React-first, leve, suficiente |
| UI primitives | shadcn/ui | Consistência, custo zero |
| Styling | Tailwind | Consistência com LP |
| Forms | `react-hook-form` + `zod` | Mesmo padrão da LP |
| Datas | `date-fns` | Leve, modular |
| E-mail | Resend | Mesma conta da LP (convites, reset) |

---

## 3. Arquitetura

```
florence/
├── apps/
│   ├── medicina/                  (LP em produção)
│   └── dashboard/                 ← NOVO
│       ├── app/
│       │   ├── (auth)/
│       │   │   ├── login/page.tsx
│       │   │   └── recuperar-senha/page.tsx
│       │   ├── (app)/             ← rotas autenticadas
│       │   │   ├── layout.tsx     (sidebar + topbar + role guard)
│       │   │   ├── analytics/page.tsx
│       │   │   ├── leads/
│       │   │   │   ├── page.tsx   (kanban + lista)
│       │   │   │   └── [id]/page.tsx
│       │   │   └── team/page.tsx
│       │   ├── api/
│       │   │   └── users/route.ts  (admin cria usuários)
│       │   ├── layout.tsx
│       │   └── middleware.ts       (auth + role redirects)
│       ├── components/
│       │   ├── auth/
│       │   ├── analytics/
│       │   │   ├── kpi-card.tsx
│       │   │   ├── funnel-chart.tsx
│       │   │   ├── leads-timeline.tsx
│       │   │   ├── source-bars.tsx
│       │   │   ├── heatmap.tsx
│       │   │   └── recent-leads-table.tsx
│       │   ├── kanban/
│       │   │   ├── board.tsx
│       │   │   ├── column.tsx
│       │   │   └── lead-card.tsx
│       │   ├── leads/
│       │   │   ├── list-view.tsx
│       │   │   ├── filters.tsx
│       │   │   └── lead-detail.tsx
│       │   ├── team/
│       │   │   └── create-user-modal.tsx
│       │   └── layout/
│       │       ├── sidebar.tsx
│       │       └── topbar.tsx
│       ├── lib/
│       │   ├── supabase-server.ts
│       │   ├── supabase-client.ts
│       │   ├── supabase-middleware.ts
│       │   ├── auth.ts              (helpers de role)
│       │   └── queries/             (queries reutilizáveis)
│       ├── hooks/
│       │   ├── useRealtimeLeads.ts
│       │   └── useRealtimeStatus.ts
│       └── types/
│           └── database.ts
└── supabase/migrations/
    └── 002_dashboard.sql           ← novo
```

---

## 4. Schema (migration 002_dashboard.sql)

### 4.1. Alterações em tabelas existentes

```sql
-- Leads: novos campos para UTM, atribuição, audit
alter table leads add column updated_at  timestamptz default now();
alter table leads add column assigned_to uuid references auth.users(id);
alter table leads add column utm_source  text;
alter table leads add column utm_medium  text;
alter table leads add column utm_campaign text;
alter table leads add column utm_content text;
alter table leads add column utm_term    text;
create index idx_leads_assigned  on leads(assigned_to);
create index idx_leads_course    on leads(course);
create index idx_leads_created   on leads(created_at desc);

-- Funil expandido (6 stages)
alter table lead_status drop constraint lead_status_status_check;
alter table lead_status add constraint lead_status_status_check
  check (status in (
    'novo', 'contactado', 'em_conversa',
    'matricula_iniciada', 'matriculado', 'perdido'
  ));

-- Garante 1 row por lead (current status); histórico fica em lead_status_history
alter table lead_status add constraint lead_status_lead_unique unique (lead_id);

-- Roles expandidas
alter table user_profiles drop constraint user_profiles_role_check;
alter table user_profiles add constraint user_profiles_role_check
  check (role in (
    'super_admin', 'admin_marketing', 'admin_vendas',
    'marketing', 'comercial'
  ));
alter table user_profiles add column name   text;
alter table user_profiles add column active boolean default true;
```

### 4.2. Histórico de status (nova tabela)

```sql
create table lead_status_history (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid not null references leads(id) on delete cascade,
  from_status text,
  to_status   text not null,
  changed_by  uuid references auth.users(id),
  changed_at  timestamptz not null default now()
);
create index idx_history_lead on lead_status_history(lead_id, changed_at desc);

-- Trigger automático
create or replace function log_status_change()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    insert into lead_status_history (lead_id, from_status, to_status)
    values (new.lead_id, null, new.status);
  elsif (old.status <> new.status) then
    insert into lead_status_history (lead_id, from_status, to_status, changed_by)
    values (new.lead_id, old.status, new.status, auth.uid());
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_lead_status_change
  after insert or update on lead_status
  for each row execute procedure log_status_change();
```

### 4.3. Atualização do updated_at de leads

```sql
create or replace function touch_lead_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_lead_update
  before update on leads
  for each row execute procedure touch_lead_updated_at();
```

### 4.4. RLS atualizada

Reescreve políticas para suportar as 5 roles:

```sql
-- helper para identificar role do usuário corrente
create or replace function current_role()
returns text language sql security definer stable as $$
  select role from user_profiles where id = auth.uid()
$$;

-- LEADS
drop policy if exists "leads_select" on leads;
create policy "leads_select" on leads for select using (
  current_role() in ('super_admin', 'admin_marketing', 'admin_vendas', 'marketing')
  or (
    current_role() = 'comercial'
    and course = any(
      (select courses from user_profiles where id = auth.uid())
    )
  )
);

create policy "leads_update" on leads for update using (
  current_role() in ('super_admin', 'admin_vendas')
  or (
    current_role() = 'comercial'
    and course = any(
      (select courses from user_profiles where id = auth.uid())
    )
  )
);

-- LEAD_STATUS — só roles de vendas podem mudar status
drop policy if exists "lead_status_select" on lead_status;
drop policy if exists "lead_status_update" on lead_status;
create policy "lead_status_select" on lead_status for select using (
  current_role() in ('super_admin', 'admin_marketing', 'admin_vendas', 'marketing')
  or exists (
    select 1 from leads l
    where l.id = lead_status.lead_id
      and current_role() = 'comercial'
      and l.course = any(
        (select courses from user_profiles where id = auth.uid())
      )
  )
);
create policy "lead_status_update" on lead_status for update using (
  current_role() in ('super_admin', 'admin_vendas')
  or exists (
    select 1 from leads l
    where l.id = lead_status.lead_id
      and current_role() = 'comercial'
      and l.course = any(
        (select courses from user_profiles where id = auth.uid())
      )
  )
);

-- LEAD_STATUS_HISTORY — read-only para qualquer usuário com acesso ao lead
create policy "history_select" on lead_status_history for select using (
  exists (
    select 1 from leads l
    where l.id = lead_status_history.lead_id
      and (
        current_role() in ('super_admin', 'admin_marketing', 'admin_vendas', 'marketing')
        or (current_role() = 'comercial'
          and l.course = any((select courses from user_profiles where id = auth.uid())))
      )
  )
);

-- COMMENTS — leitura e inserção para quem pode ver o lead
-- (políticas existentes já cobrem essa lógica; ajustar para usar current_role())

-- USER_PROFILES — admins podem listar usuários da sua área
create policy "user_profiles_select_admin" on user_profiles for select using (
  current_role() = 'super_admin'
  or (current_role() = 'admin_vendas' and role in ('comercial', 'admin_vendas'))
  or (current_role() = 'admin_marketing' and role in ('marketing', 'admin_marketing'))
  or auth.uid() = id
);
```

### 4.5. Realtime

```sql
alter publication supabase_realtime add table leads;
alter publication supabase_realtime add table lead_status;
alter publication supabase_realtime add table comments;
alter publication supabase_realtime add table lead_status_history;
```

---

## 5. Autenticação

### 5.1. Fluxo

1. Usuário acessa rota protegida → middleware verifica cookie de sessão
2. Sem sessão → redirect `/login`
3. Login com e-mail/senha via `supabase.auth.signInWithPassword()`
4. Server Component lê role do `user_profiles`
5. Sidebar renderiza só os itens permitidos para o role
6. Cada página tem guard server-side adicional (defesa em profundidade)

### 5.2. Roles e permissões

| Role | Analytics | Kanban | Time | Quem cria |
|------|:-:|:-:|:-:|---|
| super_admin | ✅ | ✅ | ✅ (todos) | SQL manual |
| admin_marketing | ✅ | ❌ | ✅ (só marketing) | super_admin |
| admin_vendas | ❌ | ✅ | ✅ (só comercial) | super_admin |
| marketing | ✅ | ❌ | ❌ | admin_marketing |
| comercial | ❌ | ✅ (cursos atribuídos) | ❌ | admin_vendas |

**Página "Time":**
- Lista usuários da equipe (escopo do role)
- Botão "Adicionar usuário" → modal com e-mail, nome, role, cursos atribuídos
- API route `/api/users` (POST) usa `supabase.auth.admin.createUser()` com senha temporária aleatória
- E-mail automático via Resend com a senha temporária + URL de login

### 5.3. Recuperação de senha

- Link "Esqueci minha senha" no `/login`
- Supabase Auth com SMTP customizado apontando para Resend (configurar no painel Supabase)
- Reset envia e-mail com link de redefinição

---

## 6. Visão Marketing — `/analytics`

### 6.1. Filtros globais (topbar)

- Período: `hoje | 7d | 30d | 90d | personalizado` (padrão 30d)
- Curso: dropdown (padrão "todos")

### 6.2. KPI cards (4)

1. **Total de leads** no período + delta % vs período anterior
2. **Taxa de conversão** = matriculados / total no período + delta %
3. **Tempo médio até primeiro contato** (em horas; calculado da diferença entre `created_at` do lead e o `changed_at` do primeiro registro `to_status = 'contactado'`)
4. **Matriculados no período** + delta %

### 6.3. Funil de conversão

Barras horizontais com largura proporcional ao volume:
- Mostra cada um dos 6 stages
- Quantidade absoluta + % do total
- Taxa de avanço (% que passou da etapa anterior)

### 6.4. Gráficos

| Gráfico | Tipo | Lib |
|---------|------|-----|
| Leads por dia | line | recharts |
| Por curso | donut | recharts |
| Por fonte UTM | bar horizontal | recharts |
| Heatmap dia/hora | grid 7×24 | CSS custom |

### 6.5. Tabela final

Últimos 10 leads cadastrados: Nome, Curso, Fonte, Quando (relative), Status atual.

### 6.6. Performance

- 1 server component faz queries em paralelo (Promise.all)
- `revalidate: 60` (cache de 1 min)
- Sem real-time aqui — analytics não precisa ser instantâneo

---

## 7. Visão Vendas — `/leads`

### 7.1. Toggle de visualização

`[Kanban]` (default) ou `[Lista]` — preferência salva em localStorage.

### 7.2. Filtros (topbar)

- Curso (dropdown)
- Status (multi-select; padrão: todos exceto `perdido`)
- Período (`hoje | 7d | 30d | tudo`)
- Atribuído a (dropdown de vendedores; só para `admin_vendas` e `super_admin`)
- Busca por nome/email (debounced 300ms)

### 7.3. Kanban

- 6 colunas (uma por stage do funil)
- Header de coluna: nome do stage + contagem
- Card mostra: nome, curso, tempo desde criação, telefone, fonte UTM resumida, contador de comentários, avatar do dono (assigned_to)
- Drag & drop entre colunas → UPDATE em `lead_status` (trigger registra histórico)
- Scroll horizontal no mobile (snap)
- Cor da borda do card baseada no stage

### 7.4. Lista

Tabela virtualizada quando >50 leads (lib `@tanstack/react-virtual`):
- Colunas: Nome, Email, Telefone, Curso, Status, Atribuído, Criado, Última atividade, Ações
- Click na linha → abre lead detail
- Ordenação por coluna
- Mesmas ações que o kanban (mudar status, atribuir)

### 7.5. Lead detail (`/leads/[id]`)

Página dedicada (sem modal — melhor compartilhamento de URL e mobile):

- Header: nome, e-mail, telefone com botões WhatsApp/Ligar
- Bloco de dados: curso, criado, UTM completos, atribuído (dropdown editável)
- Header: status atual com dropdown para mudar
- Histórico de status (timeline)
- Comentários (lista + textarea para adicionar)
- Ações: editar dados (modal), marcar como perdido (com confirmação)

Permissões:
- `comercial`: só vê leads dos cursos atribuídos; pode mudar status e atribuir-se
- `admin_vendas`: vê todos, atribui para qualquer comercial
- `super_admin`: mesmo que admin_vendas

---

## 8. Real-time

### 8.1. Canais

| Página | Subscribe em | O que faz |
|--------|--------------|-----------|
| `/leads` (kanban) | `lead_status` UPDATE, `leads` INSERT | Card "voa" entre colunas; novo lead pulsa em "Novo" |
| `/leads/[id]` | `comments` INSERT, `lead_status_history` INSERT | Comentário/mudança aparecem sem refresh |
| Topbar global | `leads` INSERT | Toast "🆕 Novo lead: João da Silva" |

### 8.2. Implementação

- Hook `useRealtimeLeads(courseFilter)` retorna leads + escuta canais
- Optimistic UI ao arrastar (move card imediatamente, depois confirma com servidor)
- Conflito (alguém moveu antes) → rollback + toast de aviso

---

## 9. Mobile (plus, dentro do prazo)

- Sidebar vira **bottom-nav** com 3 ícones (Analytics / Leads / Time)
- Kanban com **scroll horizontal snap**, cada coluna 85vw, drag por long-press
- Lead detail é sempre página (não modal)
- Filtros viram **bottom-sheet** ao invés de dropdown
- Lista virtualizada

---

## 10. Captura de UTM na LP

Atualização em `apps/medicina`:

- `app/page.tsx` lê `searchParams` (utm_source, medium, campaign, content, term)
- Passa via prop para `Formulario`
- Form inclui esses campos no POST para `/api/leads`
- `app/api/leads/route.ts` aceita os campos e grava (NULL se ausentes)

Sem UTM = lead salva normalmente. Mantém compatibilidade total.

---

## 11. Variáveis de ambiente do dashboard

Mesmas da LP, mais:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
RESEND_API_KEY=...
NEXT_PUBLIC_APP_URL=https://dashboard.florence.edu.br  ← novo, para links em e-mails
```

---

## 12. Estratégia de erro e edge cases

- **Sessão expirada:** middleware redireciona para `/login` preservando rota original (`?redirect=`)
- **Acesso negado por role:** página de erro amigável em vez de 403 cru
- **Lead foi deletado entre carregamento e ação:** toast de aviso, refresh
- **Optimistic update falhou:** rollback visual + toast
- **Real-time desconectou:** indicador visual sutil + retry automático
- **Mobile sem internet:** mensagem em vez de tela em branco

---

## 13. Testes (mínimo viável)

- TypeScript em `noEmit` antes de cada commit
- ESLint sem erros
- Smoke tests manuais antes de cada deploy:
  - Login funciona
  - Cada role vê o que deve
  - Drag & drop muda status no Supabase
  - Comentário aparece em real-time
  - Criação de usuário envia e-mail

Sem testes automatizados nesta entrega (prazo curto).

---

## 14. Cronograma estimado (15→18 maio)

| Dia | Bloco |
|-----|-------|
| Sex 15 | Migration 002 + scaffolding + auth + sidebar/layout |
| Sáb 16 | Visão Vendas (kanban + lista + lead detail + comentários) |
| Dom 17 | Visão Marketing (analytics) + página Time + UTM na LP |
| Seg 18 | Mobile polish + real-time + deploy + criação dos 2 admins |

---

## 15. Out of scope (futuras entregas)

- Notificações push/e-mail quando lead muda de status
- Exportação CSV/Excel
- Importação de leads em lote
- Integração com WhatsApp Business API (link `wa.me` é suficiente)
- Relatórios PDF
- Multi-idioma
- Dark mode
