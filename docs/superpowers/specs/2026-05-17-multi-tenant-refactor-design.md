# V2-S1 — Refactor Multi-Tenant

**Data:** 2026-05-17
**Status:** Design aprovado, aguardando plano de implementação
**Sprint:** V2-S1 (primeiro sprint do roadmap SaaS)
**Pré-requisitos:** V1 dashboard em produção (Florence single-tenant)

---

## 1. Contexto e Objetivo

O dashboard Florence está em produção como single-tenant. O objetivo de V2-S1 é convertê-lo em uma plataforma SaaS multi-tenant onde:

- **Luan** (operador da plataforma) vende o dashboard como serviço para empresas com landing pages (agências, clientes diretos).
- **Florence** é o primeiro tenant pagante. Recebe acesso full grátis até 2026-05-25 (problema urgente da LP Medicina) e depois transita para tier free, com opção de upgrade.
- **Domínio único** (`dashboard.minhaempresa.com.br` — placeholder) com tenant identificado pelo login do usuário, não por subdomínio.
- **Zero downtime obrigatório:** a LP `medicina.florence.edu.br` entra em produção na segunda-feira (2026-05-18) e deve continuar salvando leads durante toda a migração.

### Não-objetivos de S1

- Whitelabel (cores/logo por tenant) → V2-S2
- Gates funcionais por plano → V2-S3
- Stripe billing → V2-S4
- Subdomínio por tenant (decidido contra)
- Convite/aceite com onboarding completo (S1 usa o invite básico do Supabase)

---

## 2. Hierarquia de Roles

V2-S1 introduz `platform_super_admin` como role global e renomeia `super_admin` (escopo de tenant) para `tenant_admin`.

| Role | Escopo | `tenant_id` |
|---|---|---|
| `platform_super_admin` | Plataforma inteira | `NULL` |
| `tenant_admin` | 1 tenant | obrigatório |
| `marketing_admin` | 1 tenant | obrigatório |
| `marketing` | 1 tenant | obrigatório |
| `vendas_admin` | 1 tenant | obrigatório |
| `vendas` | 1 tenant | obrigatório |

Apenas `platform_super_admin` é cross-tenant. Demais usuários são confinados ao próprio `tenant_id`.

---

## 3. Modelo de Dados

### 3.1 Nova tabela `tenants`

```sql
create table tenants (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  nome text not null,
  plano text not null default 'free',          -- 'free' | 'pro' | 'business'
  status text not null default 'active',       -- 'active' | 'suspended' | 'trial'
  trial_ends_at timestamptz,
  created_at timestamptz default now(),
  metadata jsonb default '{}'
);
```

### 3.2 Coluna `tenant_id` em tabelas existentes

| Tabela | Coluna adicionada | Notas |
|---|---|---|
| `leads` | `tenant_id uuid references tenants(id)` | NOT NULL após Fase 3 |
| `lead_status` | `tenant_id uuid references tenants(id)` | NOT NULL após Fase 3; stages por tenant |
| `user_profiles` | `tenant_id uuid references tenants(id)` | NULL apenas para `platform_super_admin` |
| `user_profiles` | `active boolean not null default true` | Para desativar membros sem deletar |
| `comments` | herdado via FK `lead_id → leads.tenant_id` | Sem coluna duplicada |
| `lead_history` | herdado via FK `lead_id → leads.tenant_id` | Sem coluna duplicada |

### 3.3 Nova tabela `tenant_admin_actions` (audit log)

```sql
create table tenant_admin_actions (
  id bigserial primary key,
  actor_id uuid references user_profiles(id),    -- sempre platform_super_admin
  tenant_id uuid references tenants(id),
  action text not null,                          -- 'suspend' | 'reactivate' | 'plan_change' | 'impersonate' | 'role_change' | 'member_invite' | 'member_deactivate'
  metadata jsonb,
  created_at timestamptz default now()
);
```

Append-only. Registra ações destrutivas/sensíveis do `platform_super_admin` para conformidade LGPD.

---

## 4. RLS

### 4.1 Helper novo

```sql
create or replace function auth_tenant_id()
returns uuid
language sql stable security definer
set search_path = public
as $$
  select tenant_id from user_profiles where id = auth.uid()
$$;
```

Retorna `NULL` para `platform_super_admin`.

### 4.2 Padrão de policy

Toda policy em tabela tenant-scoped segue o padrão:

```sql
-- SELECT
create policy "<tabela>_select" on <tabela>
  for select using (
    auth_role() = 'platform_super_admin'
    or tenant_id = auth_tenant_id()
  );

-- INSERT/UPDATE/DELETE: mantém regras de role existentes envelopadas em check de tenant
create policy "<tabela>_modify" on <tabela>
  for all using (
    auth_role() = 'platform_super_admin'
    or (
      tenant_id = auth_tenant_id()
      and <regras_de_role_existentes>
    )
  );
```

### 4.3 Tabelas herdadas (comments, lead_history)

RLS resolve via subquery em `leads`:

```sql
create policy "comments_select" on comments
  for select using (
    auth_role() = 'platform_super_admin'
    or exists (
      select 1 from leads
      where leads.id = comments.lead_id
        and leads.tenant_id = auth_tenant_id()
    )
  );
```

Trade-off: subquery por linha. Aceitável dado o volume e o índice por PK. Se gargalo, denormalizar `tenant_id` em S2+.

### 4.4 Insert da LP (anon)

```sql
create policy "leads_anon_insert" on leads
  for insert to anon
  with check (
    tenant_id is not null
    and exists (select 1 from tenants where id = tenant_id and status = 'active')
  );
```

Bloqueia inserts sem `tenant_id` e inserts para tenants suspensos.

---

## 5. Tenant Context no App

### 5.1 Helper `getTenantContext()` (server-only)

```ts
// apps/dashboard/lib/tenant-context.ts
export type TenantContext = {
  role: Role;
  tenantId: string | null;       // null = visão agregada (super-admin)
  isAggregate: boolean;
  canSwitch: boolean;
};

export async function getTenantContext(): Promise<TenantContext> {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const profile = await getUserProfile(user!.id);

  if (!profile.active) {
    throw new ForbiddenError('Conta desativada');
  }

  if (profile.role === 'platform_super_admin') {
    const selected = cookies().get('florence_selected_tenant')?.value;
    return {
      role: 'platform_super_admin',
      tenantId: selected === '__all__' || !selected ? null : selected,
      isAggregate: selected === '__all__' || !selected,
      canSwitch: true,
    };
  }

  return {
    role: profile.role,
    tenantId: profile.tenant_id,
    isAggregate: false,
    canSwitch: false,
  };
}
```

### 5.2 Wrappers em `lib/queries/*`

Todas as funções de query passam a aceitar `TenantContext` e aplicar o filtro:

```ts
export async function fetchLeads(ctx: TenantContext, filters?: LeadFilters) {
  let q = supabase.from('leads').select('*');
  if (ctx.tenantId) q = q.eq('tenant_id', ctx.tenantId);
  return q;
}
```

RLS é a última linha de defesa; o app declara intenção explicitamente para evitar bugs do tipo "esqueci de filtrar".

### 5.3 Cookie do tenant selecionado

- Nome: `florence_selected_tenant`
- `httpOnly`, `secure`, `sameSite=lax`
- Valor: UUID do tenant ou string `__all__`
- Escrito apenas via server action (`switchTenant(tenantId)`).
- Server action chama `revalidatePath('/')` após escrever.

### 5.4 Seletor de tenant (UI)

Componente no header do dashboard, renderizado **apenas** quando `ctx.canSwitch === true`:

- Combobox com busca por nome.
- Lista tenants ativos.
- Opção fixa "Todos os tenants (visão agregada)".
- On change: chama server action `switchTenant()` e força re-render.

---

## 6. Painel Super-Admin

### 6.1 Estrutura de rotas

```
app/admin/
  layout.tsx               → guard: 403 se role !== 'platform_super_admin'
  tenants/
    page.tsx               → lista de tenants
    new/page.tsx           → criar tenant + primeiro tenant_admin
    [id]/
      page.tsx             → detalhes + edição
      members/page.tsx     → gerenciar usuários do tenant
  audit/
    page.tsx               → log de ações cross-tenant
```

### 6.2 Lista de tenants

Tabela com colunas: `nome`, `slug`, `plano`, `status`, `nº de leads`, `nº de users`, `criado em`, `ações`.

Filtros: busca, status, plano. Botão `+ Novo tenant`.

### 6.3 Criar tenant

Form com:

- Nome (obrigatório)
- Slug (auto-gerado do nome, editável, único)
- Plano inicial (default `free`)
- Trial até (opcional)
- Primeiro `tenant_admin`: email, nome, cargo

Após submit:
1. Insere `tenants`.
2. Dispara Supabase invite para o email do admin.
3. Cria `user_profiles` placeholder com `role='tenant_admin'`, `tenant_id=<novo>`, vinculado ao auth.users criado pelo invite.
4. Redirect para `/admin/tenants/[id]`.
5. Registra ação em `tenant_admin_actions`.

### 6.4 Editar tenant

Mesmas fields + ações:

- **Mudar plano** (free/pro/business) — apenas grava `tenants.plano`; gates aplicados em V2-S3.
- **Suspender** (`status='suspended'`) — bloqueia logins e inserts da LP. Audit log.
- **Reativar** (`status='active'`). Audit log.
- **Sem botão deletar.** Desativação preserva histórico de leads.

### 6.5 Gerenciar membros

Lista `user_profiles` do tenant. Ações:

- Ver: nome, email, role, último login
- Convidar novo usuário (email + role) — chama Supabase invite
- Mudar role (sem permitir promover a `platform_super_admin`)
- Desativar usuário (set `user_profiles.active = false`, não deleta). Login bloqueado por check no `getTenantContext()` (lança 403 se `!profile.active`).

Todas as ações registradas em `tenant_admin_actions`.

### 6.6 "Acessar como este tenant"

Botão no header de `/admin/tenants/[id]`:

1. Seta cookie `florence_selected_tenant=<uuid>`.
2. Registra ação `impersonate` em `tenant_admin_actions`.
3. Redirect para `/` (dashboard normal, agora filtrado para o tenant).

Pra sair: dropdown do header → "Todos os tenants" ou navegar para `/admin/tenants`.

### 6.7 Audit log

Página `/admin/audit` exibe `tenant_admin_actions` em ordem decrescente. Filtros: por tenant, por action, por período.

---

## 7. Migração Zero-Downtime

A migração é dividida em **3 fases**. Cada fase é deployada e validada antes da próxima.

### 7.1 Fase 1 — Aditiva

**Migration:** `005_multi_tenant_phase1_additive.sql`

1. Cria tabela `tenants`.
2. Insere tenant Florence: `slug='florence'`, `nome='Centro Universitário Florence'`, `plano='free'`, `status='active'`, `trial_ends_at='2026-05-25'`.
3. Adiciona `tenant_id` (nullable) em `leads`, `lead_status`, `user_profiles`.
   Adiciona `active boolean not null default true` em `user_profiles`.
4. Cria função `auth_tenant_id()`.
5. Cria tabela `tenant_admin_actions`.
6. **Não mexe em RLS.**

Resultado: banco inalterado para a aplicação. LP e dashboard continuam funcionando.

### 7.2 Fase 2 — Backfill

**Script:** executado manualmente no Supabase SQL Editor.

```sql
-- 1. Backfill tenant_id em registros existentes
update leads          set tenant_id = '<florence_uuid>' where tenant_id is null;
update lead_status    set tenant_id = '<florence_uuid>' where tenant_id is null;
update user_profiles  set tenant_id = '<florence_uuid>'
  where tenant_id is null and role != 'platform_super_admin';

-- 2. Renomeia super_admin → tenant_admin
update user_profiles set role = 'tenant_admin' where role = 'super_admin';

-- 3. Cria conta platform_super_admin (Luan)
--    Pré-requisito: criar auth.users via Supabase Auth UI antes (signup com system@luanfelipe.com.br)
insert into user_profiles (id, email, nome, role, tenant_id)
values ('<seu_auth_uid>', 'system@luanfelipe.com.br', 'Luan Oliveira', 'platform_super_admin', null);
```

Resultado: todos os registros têm `tenant_id`. Luan tem conta cross-tenant.

### 7.3 Fase 3 — Lock + RLS swap

**Pré-requisitos antes da migration:**

1. LP `apps/medicina` deployada com `NEXT_PUBLIC_TENANT_ID=<florence_uuid>` no Vercel.
2. Smoke test: submeter form da LP, ver lead novo no dashboard com `tenant_id` correto.
3. Dashboard v2 deployado com `getTenantContext()` + painel admin + seletor.
4. Smoke test: logar com user existente, ver leads do tenant.

**Migration:** `006_multi_tenant_phase3_lock.sql`

```sql
-- 1. NOT NULL
alter table leads          alter column tenant_id set not null;
alter table lead_status    alter column tenant_id set not null;
alter table user_profiles  add constraint user_profiles_tenant_required
  check (role = 'platform_super_admin' or tenant_id is not null);

-- 2. Drop policies antigas
drop policy <todas as policies atuais>;

-- 3. Create policies novas (Seção 4) — uma policy por (tabela × operação)
--    leads_select, leads_insert, leads_update, leads_delete
--    lead_status_select, lead_status_modify
--    user_profiles_select, user_profiles_modify
--    comments_select, comments_modify (via subquery leads)
--    lead_history_select (via subquery leads, append-only)
--    tenants_select (platform_super_admin only)
--    tenant_admin_actions (platform_super_admin only)
--    Regras de role dentro do tenant: mantidas idênticas à migration 002.

-- 4. Anon insert policy: conforme Seção 4.4
--    leads_anon_insert — exige tenant_id válido + tenants.status='active'
```

**Migration de rollback pré-pronta:** `006_rollback.sql` reverte para policies antigas e `tenant_id` nullable. Mantida no repo, fora da pasta `supabase/migrations/` para não rodar automaticamente.

### 7.4 Cronograma

| Quando | Ação |
|---|---|
| Domingo 2026-05-17 noite | Fase 1 aplicada via Supabase CLI (`supabase db push`) |
| Segunda 2026-05-18 manhã | Fase 2 (backfill manual no SQL Editor) |
| Segunda 2026-05-18 manhã | Deploy LP medicina com `NEXT_PUBLIC_TENANT_ID` |
| Segunda 2026-05-18 — qualquer momento | LP entra em produção. Continua salvando leads. |
| Dia X+2 ou +3 (após estabilidade) | Deploy dashboard v2. Smoke test. |
| Dia X+2 ou +3, baixo tráfego | Fase 3 (lock + RLS swap). Smoke test imediato. |

### 7.5 Rollback de emergência

- **LP quebrada:** Vercel rollback para deploy anterior. `tenant_id` já presente nas linhas inseridas — não há perda.
- **Dashboard quebrado:** Vercel rollback. RLS antigo ainda funciona para users existentes (Fase 3 só roda depois do dashboard estabilizar).
- **Migration 006 quebra:** aplicar `006_rollback.sql`. Sistema volta ao estado da Fase 2.

---

## 8. LP medicina — Mudanças

### 8.1 Env var

`apps/medicina/.env.local` e Vercel env (project `florence-medicina`):

```
NEXT_PUBLIC_TENANT_ID=<florence_uuid>
```

### 8.2 Build-time guard

```ts
// apps/medicina/lib/env.ts
if (!process.env.NEXT_PUBLIC_TENANT_ID) {
  throw new Error('NEXT_PUBLIC_TENANT_ID is required at build time');
}
export const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID;
```

### 8.3 Insert do lead

```ts
// apps/medicina/lib/supabase.ts (ou onde o submit do form acontece)
await supabase.from('leads').insert({
  ...formData,
  tenant_id: TENANT_ID,
  // utm, source, etc
});
```

---

## 9. Onboarding de Tenants Futuros

Fluxo padrão quando vender o dashboard para um cliente novo:

1. Luan acessa `/admin/tenants/new`, cria o tenant (ex: `clinica-x`).
2. Sistema dispara Supabase invite para o email do primeiro `tenant_admin`.
3. Cliente define senha via link do email.
4. Quando criar a LP do cliente: novo deploy Vercel (template baseado em `apps/medicina`), com `NEXT_PUBLIC_TENANT_ID=<uuid-clinica-x>`.
5. Cliente acessa `dashboard.minhaempresa.com.br`, loga, vê apenas os leads dele.

---

## 10. Considerações de Segurança

- **Isolamento:** garantido pela RLS no banco. App layer adiciona defesa em profundidade via `getTenantContext()`.
- **Bug no app vaza dados de outro tenant?** Não — RLS bloqueia mesmo se a query do app esquecer o filtro, para users que **não** são `platform_super_admin`. Para `platform_super_admin`, o risco existe e é mitigado pelos wrappers e por testes.
- **LP enviando `tenant_id` falso?** Bloqueado pela policy anon: só aceita inserts para tenants `active` e exige `tenant_id` não-nulo. Como a env var é fixa por deploy, não há como o usuário do form manipular.
- **Audit log:** todas as ações cross-tenant do `platform_super_admin` registradas. LGPD-compliant.

---

## 11. Testes

### 11.1 Testes manuais (smoke tests críticos)

Após cada fase da migração:

- LP envia form → lead aparece no dashboard com `tenant_id` correto.
- User Florence loga → vê apenas leads da Florence.
- Luan loga → vê seletor de tenant no header; alterna para "Florence" → vê leads da Florence; alterna para "Todos" → vê tudo.
- User Florence tenta query manual (via DevTools) sem filtro → RLS bloqueia.

### 11.2 Testes automatizados (E2E desejável em S1)

- Isolamento: criar dois tenants, dois users (um em cada), assert que cada user vê apenas o próprio tenant.
- Anon insert: tentar inserir lead sem `tenant_id` → rejeitado. Inserir com tenant suspenso → rejeitado.
- Super-admin: alternar entre tenants e validar dados retornados.

---

## 12. Critérios de Sucesso

✅ LP medicina entra em produção segunda-feira e continua salvando leads ininterruptamente.
✅ Zero lead perdido durante todas as fases da migração.
✅ Florence users continuam acessando o dashboard sem perceber a refatoração (UX inalterada para eles).
✅ Luan consegue criar um novo tenant via `/admin/tenants/new`, convidar admin, alternar entre tenants no seletor, suspender tenant.
✅ Audit log registra ações cross-tenant.
✅ RLS comprovadamente bloqueia acesso cross-tenant para users não-super-admin.
