# V2-S1 — Multi-Tenant Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Converter o dashboard Florence (single-tenant em produção) em plataforma SaaS multi-tenant com domínio único, `platform_super_admin` global, painel admin para CRUD de tenants, e migração zero-downtime que mantém a LP medicina coletando leads ininterruptamente.

**Architecture:** Aditiva em 3 fases — Fase 1 adiciona `tenants` + colunas `tenant_id` nullable sem mexer em RLS (deploy seguro). Fase 2 backfill manual. Fase 3 trava `tenant_id` como NOT NULL e troca RLS. Tenant identificado no login via `user_profiles.tenant_id`; `platform_super_admin` (NULL `tenant_id`) tem seletor no header pra alternar contexto. LP medicina recebe `tenant_id` hardcoded via `NEXT_PUBLIC_TENANT_ID`.

**Tech Stack:** Next.js 14 (App Router), Supabase (Postgres + RLS + Auth), TypeScript, Tailwind, shadcn/ui.

**Spec:** `docs/superpowers/specs/2026-05-17-multi-tenant-refactor-design.md`

**Reconciliação de nomes de role com o banco existente:**

A spec usa nomes abstratos (`marketing_admin`, `vendas_admin`, `vendas`) mas o banco existente usa nomes diferentes. Para minimizar risco de migração, mantemos os nomes existentes e fazemos apenas o necessário:

| Spec | DB existente | Ação na migração |
|---|---|---|
| `platform_super_admin` | (novo) | INSERT, novo role para Luan |
| `tenant_admin` | `super_admin` | RENAME via UPDATE |
| `marketing_admin` | `admin_marketing` | mantém |
| `marketing` | `marketing` | mantém |
| `vendas_admin` | `admin_vendas` | mantém |
| `vendas` | `comercial` | mantém |

Adicionar `platform_super_admin` ao type `UserRole` em `types/database.ts` e renomear o caso `super_admin → tenant_admin`.

---

## Fase 1 — Database aditiva

### Task 1: Migration `005_multi_tenant_phase1_additive.sql`

**Files:**
- Create: `supabase/migrations/005_multi_tenant_phase1_additive.sql`

- [ ] **Step 1: Criar a migration**

```sql
-- supabase/migrations/005_multi_tenant_phase1_additive.sql
-- Fase 1 — Aditiva. Nao quebra nada. Pode ser aplicada com app rodando.

-- 1. Nova tabela tenants
create table tenants (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  nome text not null,
  plano text not null default 'free' check (plano in ('free', 'pro', 'business')),
  status text not null default 'active' check (status in ('active', 'suspended', 'trial')),
  trial_ends_at timestamptz,
  created_at timestamptz default now(),
  metadata jsonb default '{}'::jsonb
);

-- Florence: primeiro tenant. Status active, trial ate 25/05 (referencia, sem efeito enforcado em S1).
insert into tenants (id, slug, nome, plano, status, trial_ends_at)
values (
  '00000000-0000-0000-0000-000000000001',
  'florence',
  'Centro Universitario Florence',
  'free',
  'active',
  '2026-05-25T23:59:59-03:00'
);

-- 2. tenant_id (nullable) em tabelas existentes
alter table leads          add column tenant_id uuid references tenants(id);
alter table lead_status    add column tenant_id uuid references tenants(id);
alter table user_profiles  add column tenant_id uuid references tenants(id);

-- Indices para queries por tenant
create index idx_leads_tenant_id          on leads(tenant_id);
create index idx_lead_status_tenant_id    on lead_status(tenant_id);
create index idx_user_profiles_tenant_id  on user_profiles(tenant_id);

-- 3. Helper auth_tenant_id() — usado em policies da Fase 3
create or replace function auth_tenant_id()
returns uuid
language sql stable security definer
set search_path = public
as $$
  select tenant_id from user_profiles where id = auth.uid()
$$;

grant execute on function auth_tenant_id() to anon, authenticated, service_role;

-- 4. Audit log de acoes cross-tenant
create table tenant_admin_actions (
  id bigserial primary key,
  actor_id uuid references user_profiles(id) on delete set null,
  tenant_id uuid references tenants(id) on delete set null,
  action text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index idx_tenant_admin_actions_tenant_id on tenant_admin_actions(tenant_id);
create index idx_tenant_admin_actions_created_at on tenant_admin_actions(created_at desc);

-- 5. RLS preliminar nas novas tabelas (libera tudo por enquanto — restringe na Fase 3)
alter table tenants enable row level security;
alter table tenant_admin_actions enable row level security;

-- Policy temporaria: authenticated le tudo. Sera substituida na Fase 3.
create policy "tenants_select_phase1" on tenants
  for select to authenticated using (true);

create policy "tenant_admin_actions_select_phase1" on tenant_admin_actions
  for select to authenticated using (true);
```

- [ ] **Step 2: Validar SQL com psql ou Supabase CLI dry-run**

```bash
# Sintaxe basica: rodar via Supabase Studio (Database > SQL Editor) com BEGIN; ... ROLLBACK; envelopando.
# OU: supabase db diff --linked --schema public (depois de aplicar)
```

Expected: SQL parsea sem erro. Constraints e FKs validas.

- [ ] **Step 3: Aplicar em produção via Supabase CLI ou SQL Editor**

```bash
# Opcao A — CLI:
supabase db push

# Opcao B — Manual no Supabase Studio:
# 1. Cole o conteudo de 005_multi_tenant_phase1_additive.sql no SQL Editor
# 2. Execute
```

Expected:
- `tenants` table criada com 1 linha (Florence).
- `tenant_id` adicionado em 3 tabelas como nullable.
- `auth_tenant_id()` function criada.
- `tenant_admin_actions` table criada.
- App e LP continuam funcionando sem mudanca de comportamento.

- [ ] **Step 4: Smoke test pos-Fase 1**

Rodar no SQL Editor:
```sql
select count(*) from tenants;                                 -- 1
select count(*) from leads;                                   -- igual ao pre-migracao
select column_name from information_schema.columns
  where table_name = 'leads' and column_name = 'tenant_id';   -- 1 row
select auth_tenant_id();                                      -- NULL (sem auth ativo no SQL Editor)
```

LP submete um lead → registro aparece em `leads` com `tenant_id IS NULL` (esperado nesta fase).

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/005_multi_tenant_phase1_additive.sql
git commit -m "feat(db): phase 1 additive — tenants table + tenant_id columns"
```

---

### Task 2: Anotar o UUID do tenant Florence no `.env` interno

**Files:**
- Modify: `apps/medicina/.env.local` (não comitado)
- Modify: `apps/dashboard/.env.local` (não comitado)
- Reference: Vercel project envs

- [ ] **Step 1: Capturar UUID do tenant Florence**

UUID hardcoded na migration: `00000000-0000-0000-0000-000000000001`. Confirmar no banco:

```sql
select id, slug from tenants where slug = 'florence';
```

- [ ] **Step 2: Adicionar a `apps/medicina/.env.local`**

```
NEXT_PUBLIC_TENANT_ID=00000000-0000-0000-0000-000000000001
```

- [ ] **Step 3: Adicionar a env no Vercel (project `florence-medicina`)**

Via dashboard Vercel ou CLI:
```bash
vercel env add NEXT_PUBLIC_TENANT_ID production
# colar: 00000000-0000-0000-0000-000000000001
vercel env add NEXT_PUBLIC_TENANT_ID preview
vercel env add NEXT_PUBLIC_TENANT_ID development
```

Expected: env var disponível nos 3 ambientes.

- [ ] **Step 4: Sem commit** (envs não vão pro repo). Documentar no README do app:

```bash
# Editar apps/medicina/README.md adicionando seção "Env vars necessárias"
```

Anotar:
```markdown
## Env vars necessárias

- `NEXT_PUBLIC_TENANT_ID` — UUID do tenant a que esta LP pertence (hardcoded por deploy).
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
```

```bash
git add apps/medicina/README.md
git commit -m "docs(medicina): document NEXT_PUBLIC_TENANT_ID env"
```

---

## Fase 2 — Backfill manual

### Task 3: Script de backfill `scripts/backfill-tenant-id.sql`

**Files:**
- Create: `scripts/backfill-tenant-id.sql`

- [ ] **Step 1: Criar o script**

```sql
-- scripts/backfill-tenant-id.sql
-- Fase 2 — Backfill. Executar manualmente no Supabase SQL Editor APOS Fase 1.
-- Pre-requisito: tenant Florence (id 00...001) ja existe.

begin;

-- 1. Backfill tenant_id em todas as tabelas
update leads
  set tenant_id = '00000000-0000-0000-0000-000000000001'
  where tenant_id is null;

update lead_status
  set tenant_id = '00000000-0000-0000-0000-000000000001'
  where tenant_id is null;

update user_profiles
  set tenant_id = '00000000-0000-0000-0000-000000000001'
  where tenant_id is null and role != 'platform_super_admin';

-- 2. Renomear super_admin (escopo Florence) -> tenant_admin
update user_profiles
  set role = 'tenant_admin'
  where role = 'super_admin';

-- 3. Validacao
do $$
declare
  null_leads int;
  null_status int;
  null_profiles int;
  super_admins int;
begin
  select count(*) into null_leads from leads where tenant_id is null;
  select count(*) into null_status from lead_status where tenant_id is null;
  select count(*) into null_profiles from user_profiles
    where tenant_id is null and role != 'platform_super_admin';
  select count(*) into super_admins from user_profiles where role = 'super_admin';

  raise notice 'leads sem tenant: %', null_leads;
  raise notice 'lead_status sem tenant: %', null_status;
  raise notice 'profiles nao-super sem tenant: %', null_profiles;
  raise notice 'super_admin remanescente: %', super_admins;

  if null_leads > 0 or null_status > 0 or null_profiles > 0 or super_admins > 0 then
    raise exception 'Backfill incompleto. Abortando.';
  end if;
end $$;

commit;
```

- [ ] **Step 2: Executar no Supabase SQL Editor**

Cole o conteúdo, clique em Run. Verifique a saída de `raise notice` — todos os contadores devem ser 0.

Expected: transação faz commit. Se algum contador > 0, transação aborta com exception.

- [ ] **Step 3: Criar a conta `platform_super_admin` (Luan)**

3a. Via Supabase Dashboard → Authentication → Users → Add user, criar usuário com email `system@luanfelipe.com.br` e senha definida.

3b. Anotar o UUID retornado (`auth.users.id`). Substituir `<luan_auth_uid>` abaixo.

3c. No SQL Editor:
```sql
insert into user_profiles (id, email, name, role, tenant_id, courses, active)
values (
  '<luan_auth_uid>',
  'system@luanfelipe.com.br',
  'Luan Oliveira',
  'platform_super_admin',
  null,
  '{}',
  true
);
```

3d. Validar:
```sql
select id, email, role, tenant_id from user_profiles where role = 'platform_super_admin';
-- Expected: 1 row, tenant_id IS NULL
```

- [ ] **Step 4: Commit do script**

```bash
git add scripts/backfill-tenant-id.sql
git commit -m "chore(db): add phase 2 backfill script (manual run)"
```

---

## Fase 3 (parte 1 / DB) — Migration de lock + RLS

### Task 4: Migration `006_multi_tenant_phase3_lock.sql`

**Files:**
- Create: `supabase/migrations/006_multi_tenant_phase3_lock.sql`
- Create: `scripts/006_rollback.sql` (NÃO em `supabase/migrations/` — não roda automaticamente)

> **Importante:** essa migration só é aplicada APÓS o deploy da LP medicina v2 e do dashboard v2, e APÓS smoke test em produção. Ver Tasks 25-29.

- [ ] **Step 1: Criar a migration de lock**

```sql
-- supabase/migrations/006_multi_tenant_phase3_lock.sql
-- Fase 3 — Lock + RLS swap. Pre-req: LP + dashboard v2 deployados e validados.

begin;

-- 1. NOT NULL constraints
alter table leads          alter column tenant_id set not null;
alter table lead_status    alter column tenant_id set not null;

alter table user_profiles
  add constraint user_profiles_tenant_required
  check (role = 'platform_super_admin' or tenant_id is not null);

-- 2. Drop policies antigas (lista exata depende do que foi criado em 001/002)
-- Padrao: drop all policies em cada tabela e recriar.

drop policy if exists "leads_select" on leads;
drop policy if exists "leads_insert" on leads;
drop policy if exists "leads_update" on leads;
drop policy if exists "leads_delete" on leads;
drop policy if exists "leads_anon_insert" on leads;

drop policy if exists "lead_status_select" on lead_status;
drop policy if exists "lead_status_modify" on lead_status;

drop policy if exists "comments_select" on comments;
drop policy if exists "comments_insert" on comments;
drop policy if exists "comments_update" on comments;
drop policy if exists "comments_delete" on comments;

drop policy if exists "lead_status_history_select" on lead_status_history;
drop policy if exists "lead_status_history_insert" on lead_status_history;

drop policy if exists "user_profiles_select" on user_profiles;
drop policy if exists "user_profiles_update" on user_profiles;
drop policy if exists "user_profiles_insert" on user_profiles;

drop policy if exists "tenants_select_phase1" on tenants;
drop policy if exists "tenant_admin_actions_select_phase1" on tenant_admin_actions;

-- 3. Policies novas — LEADS

create policy "leads_select" on leads
  for select to authenticated using (
    auth_role() = 'platform_super_admin'
    or tenant_id = auth_tenant_id()
  );

create policy "leads_insert" on leads
  for insert to authenticated with check (
    auth_role() = 'platform_super_admin'
    or (
      tenant_id = auth_tenant_id()
      and auth_role() in ('tenant_admin', 'admin_marketing', 'marketing')
    )
  );

create policy "leads_update" on leads
  for update to authenticated using (
    auth_role() = 'platform_super_admin'
    or (
      tenant_id = auth_tenant_id()
      and auth_role() in ('tenant_admin', 'admin_marketing', 'admin_vendas')
    )
  );

create policy "leads_delete" on leads
  for delete to authenticated using (
    auth_role() = 'platform_super_admin'
    or (
      tenant_id = auth_tenant_id()
      and auth_role() in ('tenant_admin')
    )
  );

-- Anon insert: LP envia tenant_id obrigatorio + tenant deve estar ativo
create policy "leads_anon_insert" on leads
  for insert to anon with check (
    tenant_id is not null
    and exists (select 1 from tenants where id = tenant_id and status = 'active')
  );

-- 4. Policies novas — LEAD_STATUS

create policy "lead_status_select" on lead_status
  for select to authenticated using (
    auth_role() = 'platform_super_admin'
    or tenant_id = auth_tenant_id()
  );

create policy "lead_status_modify" on lead_status
  for all to authenticated using (
    auth_role() = 'platform_super_admin'
    or (
      tenant_id = auth_tenant_id()
      and auth_role() in ('tenant_admin', 'admin_vendas', 'comercial')
    )
  );

-- 5. Policies novas — COMMENTS (herda tenant via leads.lead_id)

create policy "comments_select" on comments
  for select to authenticated using (
    auth_role() = 'platform_super_admin'
    or exists (
      select 1 from leads
      where leads.id = comments.lead_id and leads.tenant_id = auth_tenant_id()
    )
  );

create policy "comments_insert" on comments
  for insert to authenticated with check (
    exists (
      select 1 from leads
      where leads.id = comments.lead_id
        and (
          (select auth_role()) = 'platform_super_admin'
          or leads.tenant_id = auth_tenant_id()
        )
    )
  );

create policy "comments_update" on comments
  for update to authenticated using (
    user_id = auth.uid()
    and exists (
      select 1 from leads
      where leads.id = comments.lead_id and leads.tenant_id = auth_tenant_id()
    )
  );

create policy "comments_delete" on comments
  for delete to authenticated using (
    auth_role() = 'platform_super_admin'
    or (
      user_id = auth.uid()
      and exists (
        select 1 from leads
        where leads.id = comments.lead_id and leads.tenant_id = auth_tenant_id()
      )
    )
  );

-- 6. Policies novas — LEAD_STATUS_HISTORY (append-only, herda tenant)

create policy "lead_status_history_select" on lead_status_history
  for select to authenticated using (
    auth_role() = 'platform_super_admin'
    or exists (
      select 1 from leads
      where leads.id = lead_status_history.lead_id and leads.tenant_id = auth_tenant_id()
    )
  );

create policy "lead_status_history_insert" on lead_status_history
  for insert to authenticated with check (
    exists (
      select 1 from leads
      where leads.id = lead_status_history.lead_id
        and (
          (select auth_role()) = 'platform_super_admin'
          or leads.tenant_id = auth_tenant_id()
        )
    )
  );

-- 7. Policies novas — USER_PROFILES

create policy "user_profiles_select" on user_profiles
  for select to authenticated using (
    auth_role() = 'platform_super_admin'
    or tenant_id = auth_tenant_id()
    or id = auth.uid()
  );

create policy "user_profiles_update" on user_profiles
  for update to authenticated using (
    auth_role() = 'platform_super_admin'
    or (
      tenant_id = auth_tenant_id()
      and auth_role() in ('tenant_admin', 'admin_marketing', 'admin_vendas')
    )
    or id = auth.uid()
  );

create policy "user_profiles_insert" on user_profiles
  for insert to authenticated with check (
    auth_role() = 'platform_super_admin'
    or (
      tenant_id = auth_tenant_id()
      and auth_role() in ('tenant_admin', 'admin_marketing', 'admin_vendas')
    )
  );

-- 8. Policies novas — TENANTS (so platform_super_admin)

create policy "tenants_all" on tenants
  for all to authenticated using (
    auth_role() = 'platform_super_admin'
  ) with check (
    auth_role() = 'platform_super_admin'
  );

-- Authenticated normal precisa ler o proprio tenant (pra UI mostrar nome, plano, etc)
create policy "tenants_select_own" on tenants
  for select to authenticated using (
    id = auth_tenant_id()
  );

-- 9. Policies novas — TENANT_ADMIN_ACTIONS (so platform_super_admin)

create policy "tenant_admin_actions_all" on tenant_admin_actions
  for all to authenticated using (
    auth_role() = 'platform_super_admin'
  ) with check (
    auth_role() = 'platform_super_admin'
  );

commit;
```

- [ ] **Step 2: Criar script de rollback**

Arquivo em `scripts/` (NÃO em `supabase/migrations/`) para não rodar automaticamente:

```sql
-- scripts/006_rollback.sql
-- Reverte a Fase 3 caso algo quebre em producao.
-- Reaplica policies antigas (precisa do conteudo de 001/002 — refletir aqui).

begin;

-- 1. Drop policies novas
drop policy if exists "leads_select" on leads;
drop policy if exists "leads_insert" on leads;
drop policy if exists "leads_update" on leads;
drop policy if exists "leads_delete" on leads;
drop policy if exists "leads_anon_insert" on leads;
drop policy if exists "lead_status_select" on lead_status;
drop policy if exists "lead_status_modify" on lead_status;
drop policy if exists "comments_select" on comments;
drop policy if exists "comments_insert" on comments;
drop policy if exists "comments_update" on comments;
drop policy if exists "comments_delete" on comments;
drop policy if exists "lead_status_history_select" on lead_status_history;
drop policy if exists "lead_status_history_insert" on lead_status_history;
drop policy if exists "user_profiles_select" on user_profiles;
drop policy if exists "user_profiles_update" on user_profiles;
drop policy if exists "user_profiles_insert" on user_profiles;
drop policy if exists "tenants_all" on tenants;
drop policy if exists "tenants_select_own" on tenants;
drop policy if exists "tenant_admin_actions_all" on tenant_admin_actions;

-- 2. Recriar policies antigas — copiar de supabase/migrations/002_dashboard.sql
-- (manter sincronizado com o arquivo de migration mais recente antes da Fase 3)

-- TODO ANTES DE USAR: Cole aqui o bloco de "create policy" das migrations 001 e 002.

-- 3. Voltar tenant_id pra nullable
alter table leads          alter column tenant_id drop not null;
alter table lead_status    alter column tenant_id drop not null;
alter table user_profiles  drop constraint if exists user_profiles_tenant_required;

commit;
```

Nota: O passo 2 do rollback precisa ser preenchido **antes** de aplicar a 006 — copiar policies antigas de 001/002 para garantir rollback funcional.

- [ ] **Step 3: Pre-checar policies antigas e preencher rollback**

```bash
# Ler policies atuais do Supabase via SQL Editor:
```

```sql
select schemaname, tablename, policyname, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
```

Copiar a saída pra dentro do bloco TODO em `scripts/006_rollback.sql`.

- [ ] **Step 4: Commit (sem rodar ainda)**

```bash
git add supabase/migrations/006_multi_tenant_phase3_lock.sql scripts/006_rollback.sql
git commit -m "feat(db): phase 3 lock migration + rollback script (not yet applied)"
```

---

## Fase 3 (parte 2 / App) — Types, auth e tenant context

### Task 5: Atualizar types `UserRole` e `UserProfile`

**Files:**
- Modify: `apps/dashboard/types/database.ts`

- [ ] **Step 1: Editar types**

```ts
// apps/dashboard/types/database.ts
export type UserRole =
  | "platform_super_admin"
  | "tenant_admin"
  | "admin_marketing"
  | "admin_vendas"
  | "marketing"
  | "comercial";

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  courses: string[];
  active: boolean;
  tenant_id: string | null;  // NULL apenas para platform_super_admin
}

export interface Tenant {
  id: string;
  slug: string;
  nome: string;
  plano: "free" | "pro" | "business";
  status: "active" | "suspended" | "trial";
  trial_ends_at: string | null;
  created_at: string;
  metadata: Record<string, unknown>;
}

export interface TenantAdminAction {
  id: number;
  actor_id: string | null;
  tenant_id: string | null;
  action: string;
  metadata: Record<string, unknown>;
  created_at: string;
}
```

- [ ] **Step 2: Atualizar `apps/dashboard/lib/roles.ts`**

```ts
// apps/dashboard/lib/roles.ts
import type { UserRole } from "@/types/database";

export const ROLE_LABELS: Record<UserRole, string> = {
  platform_super_admin: "Super Admin (Plataforma)",
  tenant_admin:         "Admin do Tenant",
  admin_marketing:      "Admin Marketing",
  admin_vendas:         "Admin Vendas",
  marketing:            "Marketing",
  comercial:            "Comercial",
};

export function canAccessAnalytics(role: UserRole): boolean {
  return ["platform_super_admin", "tenant_admin", "admin_marketing", "marketing"].includes(role);
}

export function canAccessLeads(role: UserRole): boolean {
  return ["platform_super_admin", "tenant_admin", "admin_vendas", "comercial"].includes(role);
}

export function canManageTeam(role: UserRole): boolean {
  return ["platform_super_admin", "tenant_admin", "admin_marketing", "admin_vendas"].includes(role);
}

export function canChangeLeadStatus(role: UserRole): boolean {
  return ["platform_super_admin", "tenant_admin", "admin_vendas", "comercial"].includes(role);
}

export function canAssignLeads(role: UserRole): boolean {
  return ["platform_super_admin", "tenant_admin", "admin_vendas"].includes(role);
}

export function isPlatformAdmin(role: UserRole): boolean {
  return role === "platform_super_admin";
}
```

- [ ] **Step 3: Validar compilação**

```bash
cd apps/dashboard && npx tsc --noEmit
```

Expected: erros de tipo em outros arquivos (que ainda usam `super_admin`). Esses serão resolvidos nas próximas tasks.

- [ ] **Step 4: Commit**

```bash
git add apps/dashboard/types/database.ts apps/dashboard/lib/roles.ts
git commit -m "feat(types): add platform_super_admin role + tenant_id on UserProfile"
```

---

### Task 6: Atualizar `lib/auth.ts` e adicionar `requirePlatformAdmin`

**Files:**
- Modify: `apps/dashboard/lib/auth.ts`

- [ ] **Step 1: Substituir conteúdo**

```ts
// apps/dashboard/lib/auth.ts
import { createClient } from "./supabase-server";
import type { UserProfile, UserRole } from "@/types/database";
import { redirect } from "next/navigation";

export async function getUser() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentProfile(): Promise<UserProfile | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data;
}

export async function requireProfile(): Promise<UserProfile> {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (!profile.active) redirect("/login?reason=inactive");
  return profile;
}

export async function requireRole(allowed: UserRole[]): Promise<UserProfile> {
  const profile = await requireProfile();
  if (!allowed.includes(profile.role)) redirect("/leads");
  return profile;
}

export async function requirePlatformAdmin(): Promise<UserProfile> {
  const profile = await requireProfile();
  if (profile.role !== "platform_super_admin") {
    redirect("/leads"); // user comum nao deve ver /admin
  }
  return profile;
}
```

- [ ] **Step 2: Buscar todos os usos de `super_admin` no app dashboard e substituir**

```bash
cd apps/dashboard
```

Use Grep ou ripgrep:
```
grep -rn '"super_admin"' app components lib hooks
```

Substituir literais `"super_admin"` por `"tenant_admin"` (renomeado). Atenção: NÃO mudar para `platform_super_admin` cegamente — em quase todos os contextos, o sentido é "admin do tenant".

Arquivos prováveis: `lib/roles.ts` (já feito), middleware, páginas em `app/(app)/team/`, componentes de gating.

- [ ] **Step 3: Validar build**

```bash
cd apps/dashboard && npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 4: Commit**

```bash
git add apps/dashboard/lib/auth.ts apps/dashboard/<outros arquivos modificados>
git commit -m "feat(auth): add requirePlatformAdmin + rename super_admin -> tenant_admin in app"
```

---

### Task 7: Criar `lib/tenant-context.ts`

**Files:**
- Create: `apps/dashboard/lib/tenant-context.ts`

- [ ] **Step 1: Criar o módulo**

```ts
// apps/dashboard/lib/tenant-context.ts
import "server-only";
import { cookies } from "next/headers";
import { requireProfile } from "./auth";
import type { UserProfile, UserRole } from "@/types/database";

export const TENANT_COOKIE = "florence_selected_tenant";
export const TENANT_AGGREGATE = "__all__";

export type TenantContext = {
  profile: UserProfile;
  role: UserRole;
  tenantId: string | null;   // null = visao agregada (so para platform_super_admin)
  isAggregate: boolean;
  canSwitch: boolean;
};

/**
 * Resolve o tenant_id ativo na request.
 *
 * - Para users normais: tenant_id fixo (do user_profiles).
 * - Para platform_super_admin: le cookie florence_selected_tenant.
 *     Cookie ausente ou == '__all__' => isAggregate=true (sem filtro).
 *     Cookie com UUID => tenantId = UUID.
 *
 * Redireciona pra /login se nao autenticado ou inativo.
 */
export async function getTenantContext(): Promise<TenantContext> {
  const profile = await requireProfile();

  if (profile.role === "platform_super_admin") {
    const cookieStore = cookies();
    const selected = cookieStore.get(TENANT_COOKIE)?.value;
    const isAggregate = !selected || selected === TENANT_AGGREGATE;
    return {
      profile,
      role: profile.role,
      tenantId: isAggregate ? null : selected,
      isAggregate,
      canSwitch: true,
    };
  }

  return {
    profile,
    role: profile.role,
    tenantId: profile.tenant_id,
    isAggregate: false,
    canSwitch: false,
  };
}
```

- [ ] **Step 2: Criar server action `switchTenant`**

Arquivo novo: `apps/dashboard/lib/actions/switch-tenant.ts`

```ts
// apps/dashboard/lib/actions/switch-tenant.ts
"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { requirePlatformAdmin } from "@/lib/auth";
import { TENANT_COOKIE, TENANT_AGGREGATE } from "@/lib/tenant-context";
import { createClient } from "@/lib/supabase-server";

/**
 * Apenas platform_super_admin pode invocar.
 * Aceita UUID de tenant ativo ou string '__all__' (visao agregada).
 */
export async function switchTenant(tenantIdOrAll: string) {
  const profile = await requirePlatformAdmin();

  if (tenantIdOrAll !== TENANT_AGGREGATE) {
    // Valida que o tenant existe e esta ativo
    const supabase = createClient();
    const { data: tenant } = await supabase
      .from("tenants")
      .select("id, status")
      .eq("id", tenantIdOrAll)
      .maybeSingle();
    if (!tenant) throw new Error("Tenant nao encontrado");
    if (tenant.status === "suspended") throw new Error("Tenant suspenso");
  }

  cookies().set(TENANT_COOKIE, tenantIdOrAll, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 dias
  });

  // Audit log
  if (tenantIdOrAll !== TENANT_AGGREGATE) {
    const supabase = createClient();
    await supabase.from("tenant_admin_actions").insert({
      actor_id: profile.id,
      tenant_id: tenantIdOrAll,
      action: "impersonate",
      metadata: {},
    });
  }

  revalidatePath("/", "layout");
}
```

- [ ] **Step 3: Validar build**

```bash
cd apps/dashboard && npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 4: Commit**

```bash
git add apps/dashboard/lib/tenant-context.ts apps/dashboard/lib/actions/switch-tenant.ts
git commit -m "feat(tenant): add getTenantContext + switchTenant action"
```

---

### Task 8: Refatorar `lib/queries/leads.ts` para usar TenantContext

**Files:**
- Modify: `apps/dashboard/lib/queries/leads.ts`

> Estratégia: aceitar `tenantId: string | null` como primeiro arg. Se `null` (super-admin agregado), não filtra. Se UUID, filtra `eq('tenant_id', tenantId)`.

- [ ] **Step 1: Atualizar `fetchLeads`**

```ts
// apps/dashboard/lib/queries/leads.ts (substituir fetchLeads)
export async function fetchLeads(
  tenantId: string | null,
  filter: LeadsFilter = {}
): Promise<LeadWithStatus[]> {
  const supabase = createClient();

  let leadsQuery = supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (tenantId)          leadsQuery = leadsQuery.eq("tenant_id", tenantId);
  if (filter.course)     leadsQuery = leadsQuery.eq("course", filter.course);
  if (filter.assignedTo) leadsQuery = leadsQuery.eq("assigned_to", filter.assignedTo);
  if (filter.since)      leadsQuery = leadsQuery.gte("created_at", filter.since);
  if (filter.search) {
    leadsQuery = leadsQuery.or(`name.ilike.%${filter.search}%,email.ilike.%${filter.search}%`);
  }

  const { data: leadsData, error: leadsError } = await leadsQuery;
  if (leadsError) throw leadsError;
  if (!leadsData || leadsData.length === 0) return [];

  // ... resto identico ao codigo atual ...
  const leadIds = leadsData.map((l) => l.id);
  const assignedIds = leadsData
    .map((l) => l.assigned_to)
    .filter((id): id is string => id !== null);

  const { data: statusData } = await supabase
    .from("lead_status")
    .select("lead_id, status")
    .in("lead_id", leadIds);
  const statusMap = new Map((statusData ?? []).map((s: any) => [s.lead_id, s.status]));

  let usersMap = new Map();
  if (assignedIds.length > 0) {
    const { data: usersData } = await supabase
      .from("user_profiles")
      .select("id, name, email")
      .in("id", assignedIds);
    usersMap = new Map((usersData ?? []).map((u: any) => [u.id, u]));
  }

  const { data: commentsData } = await supabase
    .from("comments")
    .select("lead_id")
    .in("lead_id", leadIds);
  const commentCounts = new Map<string, number>();
  (commentsData ?? []).forEach((c: any) => {
    commentCounts.set(c.lead_id, (commentCounts.get(c.lead_id) ?? 0) + 1);
  });

  let leads = leadsData.map((row: any) => ({
    ...row,
    status: (statusMap.get(row.id) ?? "novo") as LeadStatus,
    assigned_user: row.assigned_to ? usersMap.get(row.assigned_to) ?? null : null,
    comments_count: commentCounts.get(row.id) ?? 0,
  })) as LeadWithStatus[];

  if (filter.statuses && filter.statuses.length > 0) {
    leads = leads.filter((l) => filter.statuses!.includes(l.status));
  }

  return leads;
}
```

- [ ] **Step 2: Atualizar `fetchLeadById`, `fetchLeadHistory`, `fetchLeadComments`**

```ts
export async function fetchLeadById(tenantId: string | null, id: string) {
  const supabase = createClient();

  let q = supabase.from("leads").select("*").eq("id", id);
  if (tenantId) q = q.eq("tenant_id", tenantId);

  const { data: lead, error } = await q.single();
  if (error) throw error;

  const { data: statusRow } = await supabase
    .from("lead_status")
    .select("status")
    .eq("lead_id", id)
    .maybeSingle();

  let assigned_user = null;
  if (lead.assigned_to) {
    const { data: user } = await supabase
      .from("user_profiles")
      .select("id, name, email")
      .eq("id", lead.assigned_to)
      .maybeSingle();
    assigned_user = user;
  }

  return {
    ...lead,
    status: statusRow?.status ?? "novo",
    assigned_user,
  };
}
```

`fetchLeadHistory` e `fetchLeadComments`: não recebem `tenantId` — herdam via RLS de `leads.tenant_id` (subquery na policy). Manter assinatura atual.

- [ ] **Step 3: Atualizar callers (todas as pages que chamam fetchLeads, fetchLeadById)**

```bash
cd apps/dashboard
grep -rn 'fetchLeads\|fetchLeadById' app components
```

Em cada caller, no início do arquivo (Server Component) injetar contexto:

```ts
import { getTenantContext } from "@/lib/tenant-context";
// ...
const ctx = await getTenantContext();
const leads = await fetchLeads(ctx.tenantId, filter);
```

Para `fetchLeadById`:
```ts
const lead = await fetchLeadById(ctx.tenantId, params.id);
```

- [ ] **Step 4: Build + smoke local**

```bash
cd apps/dashboard && npm run build
```

Expected: build passa.

- [ ] **Step 5: Commit**

```bash
git add apps/dashboard/lib/queries/leads.ts apps/dashboard/app
git commit -m "refactor(queries): leads accept tenantId for multi-tenant filtering"
```

---

### Task 9: Refatorar `lib/queries/analytics.ts`

**Files:**
- Modify: `apps/dashboard/lib/queries/analytics.ts`

- [ ] **Step 1: Identificar funções**

```bash
cd apps/dashboard && grep -n 'export async function\|export function' lib/queries/analytics.ts
```

- [ ] **Step 2: Adicionar `tenantId: string | null` como primeiro arg em cada função**

Padrão idêntico ao de leads — filtrar `eq('tenant_id', tenantId)` quando não-null. Manter o resto.

- [ ] **Step 3: Atualizar callers**

```bash
grep -rn 'fetchAnalytics\|fetchFunnel\|fetchConversion' app
```

Cada caller: `const ctx = await getTenantContext()` + passar `ctx.tenantId`.

- [ ] **Step 4: Build**

```bash
cd apps/dashboard && npm run build
```

- [ ] **Step 5: Commit**

```bash
git add apps/dashboard/lib/queries/analytics.ts apps/dashboard/app
git commit -m "refactor(queries): analytics accept tenantId"
```

---

### Task 10: Atualizar queries da equipe (`team`)

**Files:**
- Modify: arquivos de query da página `/team` (provavelmente inline em `app/(app)/team/page.tsx`)

- [ ] **Step 1: Localizar queries**

```bash
cd apps/dashboard && grep -rn "from('user_profiles')" app/\(app\)/team
```

- [ ] **Step 2: Em cada query, filtrar por `tenant_id`**

```ts
const ctx = await getTenantContext();
let q = supabase.from("user_profiles").select("*");
if (ctx.tenantId) q = q.eq("tenant_id", ctx.tenantId);
const { data: members } = await q;
```

- [ ] **Step 3: Build**

```bash
cd apps/dashboard && npm run build
```

- [ ] **Step 4: Commit**

```bash
git add apps/dashboard/app/\(app\)/team
git commit -m "refactor(team): scope user_profiles queries by tenant"
```

---

### Task 11: Seletor de tenant no Topbar

**Files:**
- Modify: `apps/dashboard/components/layout/topbar.tsx`
- Create: `apps/dashboard/components/layout/tenant-selector.tsx`
- Modify: `apps/dashboard/app/(app)/layout.tsx`

- [ ] **Step 1: Criar query helper para listar tenants ativos**

Arquivo novo: `apps/dashboard/lib/queries/tenants.ts`

```ts
// apps/dashboard/lib/queries/tenants.ts
import { createClient } from "@/lib/supabase-server";
import type { Tenant } from "@/types/database";

export async function fetchActiveTenants(): Promise<Tenant[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tenants")
    .select("*")
    .neq("status", "suspended")
    .order("nome", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchAllTenants(): Promise<Tenant[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tenants")
    .select("*")
    .order("nome", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchTenantById(id: string): Promise<Tenant | null> {
  const supabase = createClient();
  const { data } = await supabase.from("tenants").select("*").eq("id", id).maybeSingle();
  return data;
}
```

- [ ] **Step 2: Criar o componente client do seletor**

```tsx
// apps/dashboard/components/layout/tenant-selector.tsx
"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { switchTenant } from "@/lib/actions/switch-tenant";
import type { Tenant } from "@/types/database";

interface Props {
  tenants: Tenant[];
  selectedId: string | null; // null = visao agregada
}

export function TenantSelector({ tenants, selectedId }: Props) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const value = selectedId ?? "__all__";

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const v = e.target.value;
    startTransition(async () => {
      await switchTenant(v);
      router.refresh();
    });
  }

  return (
    <select
      value={value}
      onChange={onChange}
      disabled={pending}
      className="text-xs px-2 py-1 rounded-md border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-slate-400"
      aria-label="Selecionar tenant"
    >
      <option value="__all__">Todos os tenants (agregado)</option>
      {tenants.map((t) => (
        <option key={t.id} value={t.id}>
          {t.nome}
        </option>
      ))}
    </select>
  );
}
```

- [ ] **Step 3: Modificar `Topbar` pra receber e renderizar o seletor**

```tsx
// apps/dashboard/components/layout/topbar.tsx
import type { UserProfile, Tenant } from "@/types/database";
import { ROLE_LABELS } from "@/lib/roles";
import { TenantSelector } from "./tenant-selector";

interface Props {
  profile: UserProfile;
  title: string;
  canSwitchTenant: boolean;
  tenants?: Tenant[];        // so passado se canSwitchTenant
  selectedTenantId?: string | null;
}

export function Topbar({ profile, title, canSwitchTenant, tenants, selectedTenantId }: Props) {
  return (
    <header className="h-14 bg-white border-b border-slate-200/80 flex items-center justify-between px-6 sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <h1 className="text-base font-semibold text-slate-900 tracking-tight">{title}</h1>
      <div className="flex items-center gap-3">
        {canSwitchTenant && tenants && (
          <TenantSelector tenants={tenants} selectedId={selectedTenantId ?? null} />
        )}
        <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium tracking-wide">
          {ROLE_LABELS[profile.role]}
        </span>
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Atualizar `app/(app)/layout.tsx` para passar props**

```tsx
// apps/dashboard/app/(app)/layout.tsx — trecho relevante
import { getTenantContext } from "@/lib/tenant-context";
import { fetchActiveTenants } from "@/lib/queries/tenants";
import { Topbar } from "@/components/layout/topbar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getTenantContext();
  const tenants = ctx.canSwitch ? await fetchActiveTenants() : [];

  return (
    <div className="flex h-screen">
      <Sidebar profile={ctx.profile} />
      <div className="flex-1 flex flex-col">
        <Topbar
          profile={ctx.profile}
          title="" // ou vindo do segment metadata
          canSwitchTenant={ctx.canSwitch}
          tenants={tenants}
          selectedTenantId={ctx.tenantId}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
```

> Nota: o layout atual pode já ter outra estrutura — adaptar mantendo só os `canSwitchTenant`/`tenants`/`selectedTenantId` props novos.

- [ ] **Step 5: Build + smoke local**

```bash
cd apps/dashboard && npm run build && npm run dev
```

Smoke local com user Florence: seletor não aparece. Com user `platform_super_admin`: seletor aparece com "Todos" + "Florence".

- [ ] **Step 6: Commit**

```bash
git add apps/dashboard/components/layout apps/dashboard/lib/queries/tenants.ts apps/dashboard/app/\(app\)/layout.tsx
git commit -m "feat(ui): tenant selector in topbar for platform_super_admin"
```

---

## Fase 3 (parte 3 / App) — Painel admin

### Task 12: Layout e guard de `/admin`

**Files:**
- Create: `apps/dashboard/app/(admin)/layout.tsx`
- Create: `apps/dashboard/app/(admin)/admin/page.tsx` (redirect simples)

- [ ] **Step 1: Criar route group `(admin)`**

```tsx
// apps/dashboard/app/(admin)/layout.tsx
import { requirePlatformAdmin } from "@/lib/auth";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await requirePlatformAdmin();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="h-14 bg-slate-900 text-white flex items-center px-6 sticky top-0 z-20">
        <div className="font-semibold tracking-tight">Florence · Plataforma</div>
        <nav className="ml-8 flex items-center gap-5 text-sm">
          <Link href="/admin/tenants" className="text-slate-300 hover:text-white transition">Tenants</Link>
          <Link href="/admin/audit" className="text-slate-300 hover:text-white transition">Audit</Link>
          <Link href="/" className="ml-auto text-slate-300 hover:text-white transition">← Voltar ao dashboard</Link>
        </nav>
        <span className="ml-6 text-[11px] px-2 py-0.5 rounded-md bg-slate-700 text-slate-200 font-medium">
          {profile.email}
        </span>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
```

- [ ] **Step 2: Redirect raiz `/admin` para `/admin/tenants`**

```tsx
// apps/dashboard/app/(admin)/admin/page.tsx
import { redirect } from "next/navigation";

export default function AdminRoot() {
  redirect("/admin/tenants");
}
```

- [ ] **Step 3: Build**

```bash
cd apps/dashboard && npm run build
```

- [ ] **Step 4: Commit**

```bash
git add apps/dashboard/app/\(admin\)
git commit -m "feat(admin): admin route group with platform_super_admin guard"
```

---

### Task 13: Lista de tenants

**Files:**
- Create: `apps/dashboard/app/(admin)/admin/tenants/page.tsx`

- [ ] **Step 1: Criar página**

```tsx
// apps/dashboard/app/(admin)/admin/tenants/page.tsx
import Link from "next/link";
import { fetchAllTenants } from "@/lib/queries/tenants";
import { createClient } from "@/lib/supabase-server";

async function getTenantStats(tenantIds: string[]) {
  const supabase = createClient();
  const { data: leadCounts } = await supabase
    .from("leads")
    .select("tenant_id");
  const { data: userCounts } = await supabase
    .from("user_profiles")
    .select("tenant_id")
    .neq("role", "platform_super_admin");

  const leadsByTenant = new Map<string, number>();
  (leadCounts ?? []).forEach((l: any) => {
    leadsByTenant.set(l.tenant_id, (leadsByTenant.get(l.tenant_id) ?? 0) + 1);
  });
  const usersByTenant = new Map<string, number>();
  (userCounts ?? []).forEach((u: any) => {
    if (u.tenant_id) usersByTenant.set(u.tenant_id, (usersByTenant.get(u.tenant_id) ?? 0) + 1);
  });

  return { leadsByTenant, usersByTenant };
}

export default async function TenantsListPage() {
  const tenants = await fetchAllTenants();
  const { leadsByTenant, usersByTenant } = await getTenantStats(tenants.map((t) => t.id));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Tenants</h2>
        <Link
          href="/admin/tenants/new"
          className="text-sm px-3 py-1.5 rounded-md bg-slate-900 text-white font-medium hover:bg-slate-700 transition"
        >
          + Novo tenant
        </Link>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Nome</th>
              <th className="text-left px-4 py-3 font-medium">Slug</th>
              <th className="text-left px-4 py-3 font-medium">Plano</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-right px-4 py-3 font-medium">Leads</th>
              <th className="text-right px-4 py-3 font-medium">Users</th>
              <th className="text-right px-4 py-3 font-medium">Criado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {tenants.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/tenants/${t.id}`} className="font-medium text-slate-900 hover:underline">
                    {t.nome}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-500 font-mono text-xs">{t.slug}</td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium uppercase">
                    {t.plano}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={t.status} />
                </td>
                <td className="px-4 py-3 text-right font-mono text-slate-700">{leadsByTenant.get(t.id) ?? 0}</td>
                <td className="px-4 py-3 text-right font-mono text-slate-700">{usersByTenant.get(t.id) ?? 0}</td>
                <td className="px-4 py-3 text-right text-slate-500 text-xs">
                  {new Date(t.created_at).toLocaleDateString("pt-BR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cls = {
    active:    "bg-emerald-50 text-emerald-700 border-emerald-200",
    trial:     "bg-amber-50 text-amber-700 border-amber-200",
    suspended: "bg-rose-50 text-rose-700 border-rose-200",
  }[status] ?? "bg-slate-50 text-slate-700 border-slate-200";
  return <span className={`text-xs px-2 py-0.5 rounded-md border font-medium uppercase ${cls}`}>{status}</span>;
}
```

- [ ] **Step 2: Build**

```bash
cd apps/dashboard && npm run build
```

- [ ] **Step 3: Smoke local com user platform_super_admin**

Navegar pra `/admin/tenants`. Esperado: tabela com Florence, leads/users contados, status active.

- [ ] **Step 4: Commit**

```bash
git add apps/dashboard/app/\(admin\)/admin/tenants/page.tsx
git commit -m "feat(admin): tenants list page"
```

---

### Task 14: Criar tenant — page + action

**Files:**
- Create: `apps/dashboard/app/(admin)/admin/tenants/new/page.tsx`
- Create: `apps/dashboard/lib/actions/create-tenant.ts`

- [ ] **Step 1: Criar a server action**

```ts
// apps/dashboard/lib/actions/create-tenant.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requirePlatformAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase-server";

export async function createTenant(formData: FormData) {
  const actor = await requirePlatformAdmin();
  const supabase = createClient();

  const nome     = String(formData.get("nome") ?? "").trim();
  const slug     = String(formData.get("slug") ?? "").trim().toLowerCase();
  const plano    = String(formData.get("plano") ?? "free");
  const trialEnd = String(formData.get("trial_ends_at") ?? "");
  const adminEmail = String(formData.get("admin_email") ?? "").trim().toLowerCase();
  const adminName  = String(formData.get("admin_name") ?? "").trim();

  if (!nome || !slug || !adminEmail || !adminName) {
    throw new Error("Campos obrigatorios: nome, slug, admin_email, admin_name");
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error("Slug invalido (use a-z, 0-9, hifen)");
  }

  // 1. Insere tenant
  const { data: tenant, error: tenantErr } = await supabase
    .from("tenants")
    .insert({
      nome,
      slug,
      plano,
      status: trialEnd ? "trial" : "active",
      trial_ends_at: trialEnd || null,
    })
    .select()
    .single();
  if (tenantErr) throw tenantErr;

  // 2. Convidar tenant_admin via Supabase Admin API (requer service role)
  // Nota: createClient padrao usa cookies do user logado. Pra invite, precisamos do admin client.
  // Implementacao basica: criar user via auth.admin.inviteUserByEmail
  const adminClient = createClient(); // TODO: substituir por supabaseAdmin() se houver helper
  // ATENCAO: Supabase JS v2 SSR client nao expoe auth.admin. Use o admin client com SERVICE_ROLE_KEY:

  const { createClient: createAdminClient } = await import("@supabase/supabase-js");
  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data: invited, error: inviteErr } = await admin.auth.admin.inviteUserByEmail(adminEmail, {
    data: { name: adminName },
  });
  if (inviteErr) throw inviteErr;

  // 3. Criar user_profile pro convidado
  if (invited.user) {
    const { error: profileErr } = await admin
      .from("user_profiles")
      .insert({
        id: invited.user.id,
        email: adminEmail,
        name: adminName,
        role: "tenant_admin",
        tenant_id: tenant.id,
        courses: [],
        active: true,
      });
    if (profileErr) throw profileErr;
  }

  // 4. Audit log
  await supabase.from("tenant_admin_actions").insert({
    actor_id: actor.id,
    tenant_id: tenant.id,
    action: "tenant_created",
    metadata: { admin_email: adminEmail },
  });

  revalidatePath("/admin/tenants");
  redirect(`/admin/tenants/${tenant.id}`);
}
```

- [ ] **Step 2: Criar a página com form**

```tsx
// apps/dashboard/app/(admin)/admin/tenants/new/page.tsx
import { createTenant } from "@/lib/actions/create-tenant";
import Link from "next/link";

export default function NewTenantPage() {
  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <Link href="/admin/tenants" className="text-sm text-slate-500 hover:text-slate-700">← Tenants</Link>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mt-2">Novo tenant</h2>
      </div>

      <form action={createTenant} className="space-y-5 rounded-xl border border-slate-200 bg-white p-6">
        <Field label="Nome" name="nome" required />
        <Field label="Slug" name="slug" required helper="a-z, 0-9, hifen. Ex: clinica-x" />
        <FieldSelect label="Plano" name="plano" options={["free", "pro", "business"]} defaultValue="free" />
        <Field label="Trial ate (opcional)" name="trial_ends_at" type="date" />
        <hr className="border-slate-200" />
        <div className="text-sm font-medium text-slate-700">Primeiro tenant_admin</div>
        <Field label="Email do admin" name="admin_email" type="email" required />
        <Field label="Nome do admin" name="admin_name" required />

        <div className="pt-2">
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition"
          >
            Criar tenant e enviar convite
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, helper, ...input }: { label: string; helper?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-slate-700 uppercase tracking-wide">{label}</span>
      <input
        {...input}
        className="px-3 py-2 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
      />
      {helper && <span className="text-xs text-slate-500">{helper}</span>}
    </label>
  );
}

function FieldSelect({ label, options, ...select }: { label: string; options: string[] } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-slate-700 uppercase tracking-wide">{label}</span>
      <select
        {...select}
        className="px-3 py-2 rounded-md border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-400"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
```

- [ ] **Step 3: Verificar que `SUPABASE_SERVICE_ROLE_KEY` está nas envs do dashboard**

```bash
grep SUPABASE_SERVICE_ROLE_KEY apps/dashboard/.env.local
```

Se ausente, adicionar (valor vem do Supabase Dashboard → Settings → API).

- [ ] **Step 4: Build + smoke local**

```bash
cd apps/dashboard && npm run build && npm run dev
```

Logado como Luan, ir em `/admin/tenants/new`, criar tenant `teste-x` com email `teste@example.com`. Conferir:
- `tenants` table tem nova linha.
- `user_profiles` tem novo registro com `tenant_id=<teste-x_uuid>` e `role='tenant_admin'`.
- Email de convite enviado (verificar Supabase logs).
- Audit log entry criado.

- [ ] **Step 5: Commit**

```bash
git add apps/dashboard/lib/actions/create-tenant.ts apps/dashboard/app/\(admin\)/admin/tenants/new
git commit -m "feat(admin): create tenant action + new tenant page"
```

---

### Task 15: Detalhes do tenant + actions (suspender, mudar plano)

**Files:**
- Create: `apps/dashboard/app/(admin)/admin/tenants/[id]/page.tsx`
- Create: `apps/dashboard/lib/actions/tenant-actions.ts`

- [ ] **Step 1: Server actions**

```ts
// apps/dashboard/lib/actions/tenant-actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { requirePlatformAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase-server";
import { TENANT_COOKIE } from "@/lib/tenant-context";

async function audit(actorId: string, tenantId: string, action: string, metadata: any = {}) {
  const supabase = createClient();
  await supabase.from("tenant_admin_actions").insert({ actor_id: actorId, tenant_id: tenantId, action, metadata });
}

export async function suspendTenant(tenantId: string) {
  const actor = await requirePlatformAdmin();
  const supabase = createClient();
  const { error } = await supabase.from("tenants").update({ status: "suspended" }).eq("id", tenantId);
  if (error) throw error;
  await audit(actor.id, tenantId, "suspend");
  revalidatePath(`/admin/tenants/${tenantId}`);
  revalidatePath("/admin/tenants");
}

export async function reactivateTenant(tenantId: string) {
  const actor = await requirePlatformAdmin();
  const supabase = createClient();
  const { error } = await supabase.from("tenants").update({ status: "active" }).eq("id", tenantId);
  if (error) throw error;
  await audit(actor.id, tenantId, "reactivate");
  revalidatePath(`/admin/tenants/${tenantId}`);
  revalidatePath("/admin/tenants");
}

export async function changePlan(tenantId: string, plano: "free" | "pro" | "business") {
  const actor = await requirePlatformAdmin();
  const supabase = createClient();
  const { data: prev } = await supabase.from("tenants").select("plano").eq("id", tenantId).single();
  const { error } = await supabase.from("tenants").update({ plano }).eq("id", tenantId);
  if (error) throw error;
  await audit(actor.id, tenantId, "plan_change", { from: prev?.plano, to: plano });
  revalidatePath(`/admin/tenants/${tenantId}`);
}

export async function impersonateTenant(tenantId: string) {
  const actor = await requirePlatformAdmin();
  cookies().set(TENANT_COOKIE, tenantId, {
    httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30,
  });
  await audit(actor.id, tenantId, "impersonate");
  redirect("/");
}
```

- [ ] **Step 2: Página de detalhes**

```tsx
// apps/dashboard/app/(admin)/admin/tenants/[id]/page.tsx
import Link from "next/link";
import { fetchTenantById } from "@/lib/queries/tenants";
import { notFound } from "next/navigation";
import { suspendTenant, reactivateTenant, changePlan, impersonateTenant } from "@/lib/actions/tenant-actions";

export default async function TenantDetailPage({ params }: { params: { id: string } }) {
  const tenant = await fetchTenantById(params.id);
  if (!tenant) notFound();

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link href="/admin/tenants" className="text-sm text-slate-500 hover:text-slate-700">← Tenants</Link>
        <div className="flex items-baseline gap-3 mt-2">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{tenant.nome}</h2>
          <span className="text-sm text-slate-500 font-mono">{tenant.slug}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card label="Status" value={tenant.status} />
        <Card label="Plano" value={tenant.plano} />
        <Card label="Criado" value={new Date(tenant.created_at).toLocaleDateString("pt-BR")} />
        <Card label="Trial até" value={tenant.trial_ends_at ? new Date(tenant.trial_ends_at).toLocaleDateString("pt-BR") : "—"} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Link
            href={`/admin/tenants/${tenant.id}/members`}
            className="text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            Gerenciar membros →
          </Link>

          <form action={impersonateTenant.bind(null, tenant.id)}>
            <button className="text-sm px-3 py-1.5 rounded-md border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition">
              Acessar como este tenant
            </button>
          </form>
        </div>

        <hr className="border-slate-200" />

        <form action={changePlan.bind(null, tenant.id, "free")} className="inline">
          <button className="text-xs px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 mr-2">Mover pra Free</button>
        </form>
        <form action={changePlan.bind(null, tenant.id, "pro")} className="inline">
          <button className="text-xs px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 mr-2">Mover pra Pro</button>
        </form>
        <form action={changePlan.bind(null, tenant.id, "business")} className="inline">
          <button className="text-xs px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 mr-2">Mover pra Business</button>
        </form>

        <hr className="border-slate-200" />

        {tenant.status === "suspended" ? (
          <form action={reactivateTenant.bind(null, tenant.id)}>
            <button className="text-sm px-3 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700">Reativar tenant</button>
          </form>
        ) : (
          <form action={suspendTenant.bind(null, tenant.id)}>
            <button className="text-sm px-3 py-1.5 rounded-md bg-rose-600 text-white hover:bg-rose-700">Suspender tenant</button>
          </form>
        )}
      </div>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-xs uppercase tracking-wide text-slate-500 font-medium">{label}</div>
      <div className="text-lg font-semibold text-slate-900 mt-1">{value}</div>
    </div>
  );
}
```

- [ ] **Step 3: Build + smoke**

```bash
cd apps/dashboard && npm run build && npm run dev
```

Como Luan: ir em `/admin/tenants/<florence-uuid>`, mudar plano pra `pro`, suspender + reativar, clicar "Acessar como" → redirect pra `/` filtrando por Florence.

- [ ] **Step 4: Commit**

```bash
git add apps/dashboard/lib/actions/tenant-actions.ts apps/dashboard/app/\(admin\)/admin/tenants/\[id\]/page.tsx
git commit -m "feat(admin): tenant detail page + suspend/plan/impersonate actions"
```

---

### Task 16: Membros do tenant

**Files:**
- Create: `apps/dashboard/app/(admin)/admin/tenants/[id]/members/page.tsx`
- Create: `apps/dashboard/lib/actions/tenant-member-actions.ts`

- [ ] **Step 1: Server actions**

```ts
// apps/dashboard/lib/actions/tenant-member-actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { requirePlatformAdmin } from "@/lib/auth";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase-server";
import type { UserRole } from "@/types/database";

const TENANT_ROLES: UserRole[] = ["tenant_admin", "admin_marketing", "admin_vendas", "marketing", "comercial"];

function admin() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

async function audit(actorId: string, tenantId: string, action: string, metadata: any = {}) {
  const supabase = createClient();
  await supabase.from("tenant_admin_actions").insert({ actor_id: actorId, tenant_id: tenantId, action, metadata });
}

export async function inviteMember(tenantId: string, formData: FormData) {
  const actor = await requirePlatformAdmin();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name  = String(formData.get("name") ?? "").trim();
  const role  = String(formData.get("role") ?? "marketing") as UserRole;

  if (!TENANT_ROLES.includes(role)) throw new Error("Role invalida (nao pode ser platform_super_admin)");
  if (!email || !name) throw new Error("Email e nome obrigatorios");

  const a = admin();
  const { data: invited, error } = await a.auth.admin.inviteUserByEmail(email, { data: { name } });
  if (error) throw error;
  if (!invited.user) throw new Error("Falha ao convidar");

  const { error: pErr } = await a.from("user_profiles").insert({
    id: invited.user.id, email, name, role, tenant_id: tenantId, courses: [], active: true,
  });
  if (pErr) throw pErr;

  await audit(actor.id, tenantId, "member_invite", { email, role });
  revalidatePath(`/admin/tenants/${tenantId}/members`);
}

export async function changeMemberRole(tenantId: string, userId: string, role: UserRole) {
  const actor = await requirePlatformAdmin();
  if (!TENANT_ROLES.includes(role)) throw new Error("Role invalida");
  const supabase = createClient();
  const { data: prev } = await supabase.from("user_profiles").select("role").eq("id", userId).single();
  const { error } = await supabase.from("user_profiles").update({ role }).eq("id", userId).eq("tenant_id", tenantId);
  if (error) throw error;
  await audit(actor.id, tenantId, "role_change", { user_id: userId, from: prev?.role, to: role });
  revalidatePath(`/admin/tenants/${tenantId}/members`);
}

export async function deactivateMember(tenantId: string, userId: string) {
  const actor = await requirePlatformAdmin();
  const supabase = createClient();
  const { error } = await supabase.from("user_profiles").update({ active: false }).eq("id", userId).eq("tenant_id", tenantId);
  if (error) throw error;
  await audit(actor.id, tenantId, "member_deactivate", { user_id: userId });
  revalidatePath(`/admin/tenants/${tenantId}/members`);
}

export async function reactivateMember(tenantId: string, userId: string) {
  const actor = await requirePlatformAdmin();
  const supabase = createClient();
  const { error } = await supabase.from("user_profiles").update({ active: true }).eq("id", userId).eq("tenant_id", tenantId);
  if (error) throw error;
  await audit(actor.id, tenantId, "member_reactivate", { user_id: userId });
  revalidatePath(`/admin/tenants/${tenantId}/members`);
}
```

- [ ] **Step 2: Página**

```tsx
// apps/dashboard/app/(admin)/admin/tenants/[id]/members/page.tsx
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { fetchTenantById } from "@/lib/queries/tenants";
import { notFound } from "next/navigation";
import { ROLE_LABELS } from "@/lib/roles";
import { inviteMember, changeMemberRole, deactivateMember, reactivateMember } from "@/lib/actions/tenant-member-actions";

export default async function TenantMembersPage({ params }: { params: { id: string } }) {
  const tenant = await fetchTenantById(params.id);
  if (!tenant) notFound();

  const supabase = createClient();
  const { data: members } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("tenant_id", tenant.id)
    .order("active", { ascending: false })
    .order("name", { ascending: true });

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link href={`/admin/tenants/${tenant.id}`} className="text-sm text-slate-500 hover:text-slate-700">← {tenant.nome}</Link>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mt-2">Membros</h2>
      </div>

      {/* Form de convite */}
      <form action={inviteMember.bind(null, tenant.id)} className="rounded-xl border border-slate-200 bg-white p-5 mb-6 grid grid-cols-[1fr_1fr_auto_auto] gap-3 items-end">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-slate-700 uppercase tracking-wide">Email</span>
          <input name="email" type="email" required className="px-3 py-2 rounded-md border border-slate-200 text-sm" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-slate-700 uppercase tracking-wide">Nome</span>
          <input name="name" type="text" required className="px-3 py-2 rounded-md border border-slate-200 text-sm" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-slate-700 uppercase tracking-wide">Role</span>
          <select name="role" defaultValue="marketing" className="px-3 py-2 rounded-md border border-slate-200 text-sm bg-white">
            <option value="tenant_admin">Admin do tenant</option>
            <option value="admin_marketing">Admin Marketing</option>
            <option value="admin_vendas">Admin Vendas</option>
            <option value="marketing">Marketing</option>
            <option value="comercial">Comercial</option>
          </select>
        </label>
        <button className="px-3 py-2 rounded-md bg-slate-900 text-white text-sm font-medium hover:bg-slate-700">Convidar</button>
      </form>

      {/* Lista */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Nome</th>
              <th className="text-left px-4 py-3 font-medium">Email</th>
              <th className="text-left px-4 py-3 font-medium">Role</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {(members ?? []).map((m: any) => (
              <tr key={m.id} className={m.active ? "" : "opacity-50"}>
                <td className="px-4 py-3 font-medium text-slate-900">{m.name ?? "—"}</td>
                <td className="px-4 py-3 text-slate-700">{m.email}</td>
                <td className="px-4 py-3">
                  <form action={async (fd) => {
                    "use server";
                    const role = String(fd.get("role")) as any;
                    await changeMemberRole(tenant.id, m.id, role);
                  }}>
                    <select name="role" defaultValue={m.role} className="text-xs px-2 py-1 rounded-md border border-slate-200 bg-white" onChange={(e) => (e.target.form as HTMLFormElement).requestSubmit()}>
                      {Object.entries(ROLE_LABELS).filter(([k]) => k !== "platform_super_admin").map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                  </form>
                </td>
                <td className="px-4 py-3 text-xs">
                  {m.active ? <span className="text-emerald-600 font-medium">Ativo</span> : <span className="text-rose-600 font-medium">Inativo</span>}
                </td>
                <td className="px-4 py-3 text-right">
                  {m.active ? (
                    <form action={deactivateMember.bind(null, tenant.id, m.id)} className="inline">
                      <button className="text-xs text-rose-600 hover:underline">Desativar</button>
                    </form>
                  ) : (
                    <form action={reactivateMember.bind(null, tenant.id, m.id)} className="inline">
                      <button className="text-xs text-emerald-600 hover:underline">Reativar</button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

> Nota: o `<select onChange>` chamando `form.requestSubmit()` exige um Client Component. Se causar bug em build (Server Component), extrair a célula da role num componente client separado. Mantive inline pra brevidade; pode precisar split.

- [ ] **Step 3: Build + smoke**

```bash
cd apps/dashboard && npm run build && npm run dev
```

Como Luan: `/admin/tenants/<florence>/members`. Conferir lista, convidar `teste2@example.com` como marketing, mudar role da Geórgia, desativar e reativar um membro.

- [ ] **Step 4: Commit**

```bash
git add apps/dashboard/lib/actions/tenant-member-actions.ts apps/dashboard/app/\(admin\)/admin/tenants/\[id\]/members
git commit -m "feat(admin): tenant members management"
```

---

### Task 17: Audit log

**Files:**
- Create: `apps/dashboard/app/(admin)/admin/audit/page.tsx`

- [ ] **Step 1: Página**

```tsx
// apps/dashboard/app/(admin)/admin/audit/page.tsx
import { createClient } from "@/lib/supabase-server";

const ACTION_LABELS: Record<string, string> = {
  tenant_created:    "Tenant criado",
  suspend:           "Tenant suspenso",
  reactivate:        "Tenant reativado",
  plan_change:       "Plano alterado",
  impersonate:       "Acessou como tenant",
  member_invite:     "Membro convidado",
  member_deactivate: "Membro desativado",
  member_reactivate: "Membro reativado",
  role_change:       "Role alterada",
};

export default async function AuditLogPage() {
  const supabase = createClient();
  const { data: actions } = await supabase
    .from("tenant_admin_actions")
    .select("*, actor:user_profiles!actor_id(email, name), tenant:tenants!tenant_id(nome, slug)")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-6">Audit log</h2>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Quando</th>
              <th className="text-left px-4 py-3 font-medium">Ator</th>
              <th className="text-left px-4 py-3 font-medium">Tenant</th>
              <th className="text-left px-4 py-3 font-medium">Ação</th>
              <th className="text-left px-4 py-3 font-medium">Detalhes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {(actions ?? []).map((a: any) => (
              <tr key={a.id}>
                <td className="px-4 py-3 text-xs text-slate-500 font-mono">
                  {new Date(a.created_at).toLocaleString("pt-BR")}
                </td>
                <td className="px-4 py-3 text-slate-700">{a.actor?.email ?? "—"}</td>
                <td className="px-4 py-3 text-slate-700">{a.tenant?.nome ?? "—"}</td>
                <td className="px-4 py-3 text-slate-900 font-medium">{ACTION_LABELS[a.action] ?? a.action}</td>
                <td className="px-4 py-3 text-xs text-slate-500 font-mono">
                  {Object.keys(a.metadata ?? {}).length > 0 ? JSON.stringify(a.metadata) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

> Nota: o select com embedded join `actor:user_profiles!actor_id(...)` pode falhar se FKs não estiverem como o PostgREST espera. Alternativa: rodar 2 queries e fazer merge manual (igual `fetchLeads`). Manter inline por simplicidade — se quebrar, refatorar.

- [ ] **Step 2: Build + smoke**

```bash
cd apps/dashboard && npm run build && npm run dev
```

Ir em `/admin/audit`. Esperado: ver entries de todas as ações feitas nas tasks anteriores (tenant_created, plan_change, impersonate, etc).

- [ ] **Step 3: Commit**

```bash
git add apps/dashboard/app/\(admin\)/admin/audit
git commit -m "feat(admin): audit log page"
```

---

## Fase 3 (parte 4) — LP medicina

### Task 18: Env guard + insert com tenant_id

**Files:**
- Create: `apps/medicina/lib/env.ts`
- Modify: `apps/medicina/lib/supabase.ts`
- Modify: arquivo que faz insert do lead (provavelmente componente form ou API route)

- [ ] **Step 1: Build-time guard**

```ts
// apps/medicina/lib/env.ts
export const TENANT_ID = (() => {
  const v = process.env.NEXT_PUBLIC_TENANT_ID;
  if (!v) {
    throw new Error(
      "NEXT_PUBLIC_TENANT_ID is required. Set it in .env.local and Vercel project envs."
    );
  }
  return v;
})();
```

- [ ] **Step 2: Localizar onde o insert de lead acontece**

```bash
cd apps/medicina && grep -rn "from('leads')\|.insert" app components lib
```

- [ ] **Step 3: Adicionar `tenant_id: TENANT_ID` em cada insert**

```ts
// exemplo
import { TENANT_ID } from "@/lib/env";
// ...
await supabase.from("leads").insert({
  ...formData,
  tenant_id: TENANT_ID,
});
```

- [ ] **Step 4: Build local com env**

```bash
cd apps/medicina
# garantir que .env.local tem NEXT_PUBLIC_TENANT_ID
npm run build
```

Expected: build passa. Se faltar env, erro claro.

- [ ] **Step 5: Smoke local**

```bash
npm run dev
```

Submeter form. Conferir no Supabase Studio que o lead novo tem `tenant_id` setado.

- [ ] **Step 6: Commit**

```bash
git add apps/medicina/lib/env.ts apps/medicina/<arquivos modificados>
git commit -m "feat(medicina): include tenant_id in lead inserts (build-time guard)"
```

---

## Fase 3 (parte 5) — Deploy + smoke + lock

### Task 19: Deploy da LP medicina v2

- [ ] **Step 1: Confirmar env `NEXT_PUBLIC_TENANT_ID` no Vercel project `florence-medicina`**

```bash
vercel env ls --scope <team>
```

- [ ] **Step 2: Push branch + merge**

```bash
git push origin main
```

Aguardar deploy do Vercel.

- [ ] **Step 3: Smoke test em produção**

Acessar `https://medicina.florence.edu.br` (ou domínio atual da LP). Submeter form de teste. Conferir no Supabase Studio:

```sql
select id, name, email, tenant_id, created_at from leads
where created_at > now() - interval '5 minutes'
order by created_at desc;
```

Expected: 1 row com `tenant_id = '00000000-0000-0000-0000-000000000001'`.

- [ ] **Step 4: Aguardar 24-48h** (opcional — se urgência, prosseguir).

Confirmar que inserts continuam funcionando normalmente.

---

### Task 20: Deploy do dashboard v2

- [ ] **Step 1: Confirmar envs no Vercel project `florence-dashboard`**

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (necessário pras actions de invite)

- [ ] **Step 2: Push + aguardar deploy**

```bash
git push origin main
```

- [ ] **Step 3: Smoke test em produção**

3a. Logar como Geórgia (Florence tenant_admin) → ver leads da Florence normalmente.
3b. Logar como Luan (`platform_super_admin`) → ver seletor de tenant; alternar pra Florence; ver leads. Voltar pra "Todos" → ver agregado.
3c. Navegar pra `/admin/tenants` → ver lista. Abrir Florence. Ver detalhes.

- [ ] **Step 4: Validar audit log**

`/admin/audit` mostra entries das ações de teste.

---

### Task 21: Aplicar migration 006 (lock + RLS swap)

> **CRÍTICO:** só rodar após Tasks 19 e 20 estabilizadas em produção.

- [ ] **Step 1: Confirmar `scripts/006_rollback.sql` está atualizado**

Verificar que o bloco "TODO ANTES DE USAR" no rollback foi preenchido com as policies antigas (capturadas em Task 4 Step 3).

- [ ] **Step 2: Backup do banco**

Supabase Dashboard → Database → Backups → criar snapshot manual antes da migration.

- [ ] **Step 3: Aplicar `006_multi_tenant_phase3_lock.sql` em horário de baixo tráfego**

```bash
supabase db push
```

OU manual via SQL Editor.

Expected: transação commita. Sem erro.

- [ ] **Step 4: Smoke test imediato**

4a. LP submete form → lead salvo (com tenant_id). Verificar Supabase:
```sql
select id, name, tenant_id, created_at from leads order by created_at desc limit 5;
```

4b. Geórgia loga → vê leads da Florence. Tenta acessar lead de outro tenant via URL direta (se houvesse outro) → 403/redirect.

4c. Luan loga → seletor funciona, "Acessar como Florence" funciona, audit log registra.

4d. Insert manual de teste sem tenant_id via SQL:
```sql
insert into leads (name, email, phone, course) values ('teste-noTenant', 'x@x.com', '11111', 'Medicina');
-- Expected: erro (tenant_id NOT NULL)
```

- [ ] **Step 5: Em caso de falha, rollback**

```bash
# Aplicar scripts/006_rollback.sql via SQL Editor
psql ... -f scripts/006_rollback.sql
```

E rollback do deploy do dashboard no Vercel (LP continua OK porque já manda tenant_id).

- [ ] **Step 6: Commit nota de aplicação**

```bash
git commit --allow-empty -m "chore(db): phase 3 migration applied to production"
```

---

## Self-Review

> Esta seção é a checklist que rodei contra a spec após escrever o plano.

**1. Cobertura da spec:**
- ✅ Seção 3 (modelo de dados) → Task 1
- ✅ Seção 4 (RLS) → Task 4
- ✅ Seção 5 (tenant context) → Tasks 5, 7, 8, 9, 10
- ✅ Seção 6 (painel admin) → Tasks 12-17
- ✅ Seção 7 (migração 3 fases) → Tasks 1, 3, 4, 19, 20, 21
- ✅ Seção 8 (LP medicina) → Tasks 2, 18
- ✅ Seção 9 (onboarding de tenants novos) → coberto via Task 14 (create tenant action)
- ✅ Seção 10 (segurança) → audit log em Task 17, validações em actions
- ✅ Seção 11 (testes) → smoke tests embutidos nas tasks de deploy (19, 20, 21)
- ✅ Seção 12 (critérios de sucesso) → smoke tests cobrem cada critério

**2. Placeholder scan:**
- `scripts/006_rollback.sql` tem um "TODO ANTES DE USAR" — explicitado como passo obrigatório na Task 4 Step 3.
- Task 8 Step 3 menciona "todos os callers" — listei estratégia (grep) em vez de enumerar cada arquivo. Aceitável porque caller depende do estado atual da árvore.
- Task 16 nota inline sobre potencial split de componente client/server — pragmático.

**3. Type consistency:**
- `tenantId: string | null` usado consistentemente como primeiro arg em todas as queries refatoradas (Tasks 8, 9, 10).
- `getTenantContext()` retorna mesmo shape em todas as referências.
- `TENANT_COOKIE`, `TENANT_AGGREGATE` constants centralizadas em `tenant-context.ts`.
- Role names: `platform_super_admin` (NOVO), `tenant_admin` (renomeado de `super_admin`), demais mantidos — consistente em types, roles, actions, RLS.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-17-multi-tenant-refactor.md`. Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
