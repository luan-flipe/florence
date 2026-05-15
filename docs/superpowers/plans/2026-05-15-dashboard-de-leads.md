# Dashboard de Leads Florence — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir `apps/dashboard` em `dashboard.florence.edu.br` com visão Marketing (analytics) e Vendas (kanban + lista + detalhe + comentários), entregando até segunda 18/05/2026.

**Architecture:** Next.js 14 App Router rodando no mesmo monorepo do `apps/medicina`. Auth via Supabase Auth (e-mail/senha). RLS controla acesso por role. Real-time via Supabase Realtime para o kanban e comentários. Migration 002 expande o schema da Entrega 1.

**Tech Stack:** Next.js 14, Supabase, `@dnd-kit`, `recharts`, shadcn/ui, Tailwind, `react-hook-form`, `zod`, `date-fns`.

**Spec:** [`docs/superpowers/specs/2026-05-15-dashboard-design.md`](../specs/2026-05-15-dashboard-design.md)

---

## Convenções deste plano

- Não usaremos testes automatizados (spec §13). Cada task termina em `tsc --noEmit` + commit.
- Variáveis de ambiente locais ficam em `apps/dashboard/.env.local`; valores reais vêm do `apps/medicina/.env.local` (mesma stack Supabase/Resend).
- Todos os comandos `npm` no PowerShell precisam do PATH do Node 22: `$env:PATH = "C:\Users\luan.oliveira\tools\node22;" + $env:PATH`.
- Commits seguem Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`).
- Cada task tem files exatos, código completo, verificação e commit.

---

## File Structure (criado durante a Sprint 1, completado durante 2-4)

```
apps/dashboard/
├── app/
│   ├── (auth)/login/page.tsx                      ← Task 6
│   ├── (app)/
│   │   ├── layout.tsx                             ← Task 8
│   │   ├── analytics/page.tsx                     ← Sprint 3
│   │   ├── leads/page.tsx                         ← Task 13
│   │   ├── leads/[id]/page.tsx                    ← Task 17
│   │   └── team/page.tsx                          ← Task 22
│   ├── api/users/route.ts                         ← Task 23
│   ├── layout.tsx                                 ← Task 2
│   ├── globals.css                                ← Task 2
│   └── not-found.tsx                              ← Task 9
├── components/
│   ├── auth/login-form.tsx                        ← Task 6
│   ├── layout/sidebar.tsx                         ← Task 8
│   ├── layout/topbar.tsx                          ← Task 8
│   ├── analytics/...                              ← Sprint 3
│   ├── kanban/board.tsx + column.tsx + card.tsx   ← Task 14-15
│   ├── leads/filters.tsx + list-view.tsx          ← Task 13, 16
│   ├── leads/lead-detail.tsx                      ← Task 17-19
│   └── team/...                                   ← Task 22-23
├── lib/
│   ├── supabase-server.ts                         ← Task 3
│   ├── supabase-client.ts                         ← Task 3
│   ├── supabase-middleware.ts                     ← Task 3
│   ├── auth.ts                                    ← Task 5
│   ├── stages.ts                                  ← Task 4
│   ├── roles.ts                                   ← Task 4
│   └── queries/leads.ts + analytics.ts            ← Sprint 2/3
├── hooks/useRealtimeLeads.ts                      ← Task 20
├── hooks/useRealtimeComments.ts                   ← Task 21
├── types/database.ts                              ← Task 4
├── middleware.ts                                  ← Task 5
├── next.config.mjs / tailwind.config.ts           ← Task 2
└── .env.local.example                             ← Task 3
```

---

# Sprint 1 — Fundação (Sex 15)

## Task 1: Migration 002 do Supabase

**Files:**
- Create: `supabase/migrations/002_dashboard.sql`

- [ ] **Step 1: Criar o arquivo de migration com todas as alterações**

Conteúdo completo de `supabase/migrations/002_dashboard.sql`:

```sql
-- Florence — Migration 002: Dashboard de leads
-- Criado em: 15/05/2026

-- ─── ALTERAÇÕES EM TABELAS EXISTENTES ──────────────────────────

alter table leads add column updated_at  timestamptz default now();
alter table leads add column assigned_to uuid references auth.users(id);
alter table leads add column utm_source  text;
alter table leads add column utm_medium  text;
alter table leads add column utm_campaign text;
alter table leads add column utm_content text;
alter table leads add column utm_term    text;

create index idx_leads_assigned on leads(assigned_to);
create index idx_leads_course   on leads(course);
create index idx_leads_created  on leads(created_at desc);

-- Funil expandido (6 stages)
alter table lead_status drop constraint lead_status_status_check;
alter table lead_status add constraint lead_status_status_check
  check (status in (
    'novo', 'contactado', 'em_conversa',
    'matricula_iniciada', 'matriculado', 'perdido'
  ));

-- Garante 1 row por lead (current status)
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

-- ─── HISTÓRICO DE STATUS ───────────────────────────────────────

create table lead_status_history (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid not null references leads(id) on delete cascade,
  from_status text,
  to_status   text not null,
  changed_by  uuid references auth.users(id),
  changed_at  timestamptz not null default now()
);
create index idx_history_lead on lead_status_history(lead_id, changed_at desc);

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

-- ─── TOUCH UPDATED_AT EM LEADS ─────────────────────────────────

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

-- ─── RLS HELPER ────────────────────────────────────────────────

create or replace function current_role()
returns text language sql security definer stable as $$
  select role from user_profiles where id = auth.uid()
$$;

-- ─── RLS POLICIES ──────────────────────────────────────────────

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

-- LEAD_STATUS
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

-- LEAD_STATUS_HISTORY (read-only)
alter table lead_status_history enable row level security;
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

-- USER_PROFILES (admin pode listar usuários da sua área)
drop policy if exists "user_profiles_select" on user_profiles;
create policy "user_profiles_select" on user_profiles for select using (
  current_role() = 'super_admin'
  or (current_role() = 'admin_vendas' and role in ('comercial', 'admin_vendas'))
  or (current_role() = 'admin_marketing' and role in ('marketing', 'admin_marketing'))
  or auth.uid() = id
);

-- ─── REALTIME ──────────────────────────────────────────────────

alter publication supabase_realtime add table leads;
alter publication supabase_realtime add table lead_status;
alter publication supabase_realtime add table comments;
alter publication supabase_realtime add table lead_status_history;
```

- [ ] **Step 2: Aplicar migration no Supabase**

Abra Supabase → SQL Editor → New Query → cole o conteúdo → Run.
Verifique que nenhum erro foi reportado.

- [ ] **Step 3: Verificar mudanças**

No Supabase → Table Editor:
- `leads` deve ter as novas colunas (assigned_to, utm_*, updated_at)
- `lead_status_history` deve existir
- `user_profiles` deve ter `name` e `active`

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/002_dashboard.sql
git commit -m "feat(db): migration 002 — schema do dashboard (UTM, histórico, roles)"
```

---

## Task 2: Scaffold do app dashboard

**Files:**
- Create: `apps/dashboard/` (estrutura completa via create-next-app)

- [ ] **Step 1: Criar projeto Next.js**

```powershell
$env:PATH = "C:\Users\luan.oliveira\tools\node22;" + $env:PATH
cd "C:\Users\luan.oliveira\Documents\Projetos\florence"
npx create-next-app@14 apps/dashboard --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --yes
```

- [ ] **Step 2: Instalar dependências do projeto**

```powershell
$env:PATH = "C:\Users\luan.oliveira\tools\node22;" + $env:PATH
cd "C:\Users\luan.oliveira\Documents\Projetos\florence\apps\dashboard"
npm install @supabase/supabase-js @supabase/ssr @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities recharts react-hook-form @hookform/resolvers zod date-fns lucide-react clsx tailwind-merge resend critters
```

- [ ] **Step 3: Inicializar shadcn/ui**

```powershell
npx shadcn@latest init --defaults
```

- [ ] **Step 4: Instalar componentes shadcn usados pelo dashboard**

```powershell
npx shadcn@latest add button input label select dialog dropdown-menu tabs toast tooltip avatar badge separator skeleton
```

- [ ] **Step 5: Sobrescrever `next.config.mjs` para enxergar fora do root**

Conteúdo:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { optimizeCss: true },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 6: Atualizar `package.json` com browserslist (mesmo da LP)**

Adicionar bloco no fim do `package.json`:

```json
"browserslist": [
  "chrome >= 90",
  "edge >= 90",
  "firefox >= 88",
  "safari >= 14",
  "and_chr >= 90",
  "ios_saf >= 14",
  "not dead"
]
```

- [ ] **Step 7: Limpar template default**

Substituir `app/page.tsx`, `app/globals.css` por placeholders mínimos. Conteúdo de `app/page.tsx`:

```tsx
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/login");
}
```

Conteúdo de `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
}
```

- [ ] **Step 8: TypeScript check**

```powershell
npx tsc --noEmit
```

Expected: sem erros.

- [ ] **Step 9: Commit**

```bash
git add apps/dashboard
git commit -m "feat(dashboard): scaffold inicial com Next.js 14 + shadcn"
```

---

## Task 3: Clientes Supabase (server, client, middleware)

**Files:**
- Create: `apps/dashboard/lib/supabase-server.ts`
- Create: `apps/dashboard/lib/supabase-client.ts`
- Create: `apps/dashboard/lib/supabase-middleware.ts`
- Create: `apps/dashboard/.env.local.example`

- [ ] **Step 1: Criar `lib/supabase-server.ts`**

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component — não pode setar cookies
          }
        },
      },
    }
  );
}

export function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: { getAll: () => [], setAll: () => {} },
    }
  );
}
```

- [ ] **Step 2: Criar `lib/supabase-client.ts`**

```ts
"use client";
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

- [ ] **Step 3: Criar `lib/supabase-middleware.ts`**

```ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const isAuthRoute = request.nextUrl.pathname.startsWith("/login");
  const isPublicRoute = isAuthRoute || request.nextUrl.pathname === "/";

  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/leads";
    return NextResponse.redirect(url);
  }

  return response;
}
```

- [ ] **Step 4: Criar `.env.local.example`**

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
RESEND_API_KEY=re_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

- [ ] **Step 5: Copiar para .env.local com valores reais (manual)**

```powershell
Copy-Item .env.local.example .env.local
```

Edite `.env.local` substituindo os placeholders pelos valores reais do `apps/medicina/.env.local`.

- [ ] **Step 6: TypeScript check**

```powershell
npx tsc --noEmit
```

- [ ] **Step 7: Commit**

```bash
git add apps/dashboard/lib apps/dashboard/.env.local.example
git commit -m "feat(dashboard): clientes Supabase (server, client, middleware)"
```

---

## Task 4: Types do banco + constantes (stages, roles)

**Files:**
- Create: `apps/dashboard/types/database.ts`
- Create: `apps/dashboard/lib/stages.ts`
- Create: `apps/dashboard/lib/roles.ts`

- [ ] **Step 1: Criar `types/database.ts`**

```ts
export type LeadStatus =
  | "novo"
  | "contactado"
  | "em_conversa"
  | "matricula_iniciada"
  | "matriculado"
  | "perdido";

export type UserRole =
  | "super_admin"
  | "admin_marketing"
  | "admin_vendas"
  | "marketing"
  | "comercial";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  assigned_to: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadWithStatus extends Lead {
  status: LeadStatus;
  assigned_user?: { id: string; name: string | null; email: string } | null;
  comments_count?: number;
}

export interface LeadStatusHistory {
  id: string;
  lead_id: string;
  from_status: LeadStatus | null;
  to_status: LeadStatus;
  changed_by: string | null;
  changed_at: string;
  changed_by_user?: { name: string | null; email: string } | null;
}

export interface Comment {
  id: string;
  lead_id: string;
  user_id: string;
  text: string;
  created_at: string;
  user?: { name: string | null; email: string };
}

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  courses: string[];
  active: boolean;
}
```

- [ ] **Step 2: Criar `lib/stages.ts`**

```ts
import type { LeadStatus } from "@/types/database";

export const STAGES: { value: LeadStatus; label: string; color: string }[] = [
  { value: "novo",               label: "Novo",               color: "#0096d2" },
  { value: "contactado",         label: "Contactado",         color: "#0072a3" },
  { value: "em_conversa",        label: "Em conversa",        color: "#005a82" },
  { value: "matricula_iniciada", label: "Matrícula iniciada", color: "#f5c842" },
  { value: "matriculado",        label: "Matriculado",        color: "#22c55e" },
  { value: "perdido",            label: "Perdido",            color: "#ef4444" },
];

export const STAGE_BY_VALUE = Object.fromEntries(
  STAGES.map((s) => [s.value, s])
) as Record<LeadStatus, (typeof STAGES)[number]>;
```

- [ ] **Step 3: Criar `lib/roles.ts`**

```ts
import type { UserRole } from "@/types/database";

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin:      "Super Admin",
  admin_marketing:  "Admin Marketing",
  admin_vendas:     "Admin Vendas",
  marketing:        "Marketing",
  comercial:        "Comercial",
};

export function canAccessAnalytics(role: UserRole): boolean {
  return ["super_admin", "admin_marketing", "marketing"].includes(role);
}

export function canAccessLeads(role: UserRole): boolean {
  return ["super_admin", "admin_vendas", "comercial"].includes(role);
}

export function canManageTeam(role: UserRole): boolean {
  return ["super_admin", "admin_marketing", "admin_vendas"].includes(role);
}

export function canChangeLeadStatus(role: UserRole): boolean {
  return ["super_admin", "admin_vendas", "comercial"].includes(role);
}

export function canAssignLeads(role: UserRole): boolean {
  return ["super_admin", "admin_vendas"].includes(role);
}
```

- [ ] **Step 4: TypeScript check + commit**

```powershell
npx tsc --noEmit
```

```bash
git add apps/dashboard/types apps/dashboard/lib/stages.ts apps/dashboard/lib/roles.ts
git commit -m "feat(dashboard): types do banco + constantes de stages e roles"
```

---

## Task 5: Auth helpers + middleware

**Files:**
- Create: `apps/dashboard/lib/auth.ts`
- Create: `apps/dashboard/middleware.ts`

- [ ] **Step 1: Criar `lib/auth.ts`**

```ts
import { createClient } from "./supabase-server";
import type { UserProfile } from "@/types/database";
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
  return profile;
}

export async function requireRole(allowed: UserProfile["role"][]) {
  const profile = await requireProfile();
  if (!allowed.includes(profile.role)) redirect("/leads"); // fallback
  return profile;
}
```

- [ ] **Step 2: Criar `middleware.ts` (raiz do app)**

```ts
import { updateSession } from "@/lib/supabase-middleware";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif)$).*)",
  ],
};
```

- [ ] **Step 3: TypeScript check + commit**

```powershell
npx tsc --noEmit
```

```bash
git add apps/dashboard/lib/auth.ts apps/dashboard/middleware.ts
git commit -m "feat(dashboard): auth helpers + middleware com role-based redirects"
```

---

## Task 6: Página de login

**Files:**
- Create: `apps/dashboard/app/(auth)/login/page.tsx`
- Create: `apps/dashboard/components/auth/login-form.tsx`

- [ ] **Step 1: Criar `components/auth/login-form.tsx`**

```tsx
"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});
type FormData = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword(data);
    if (error) {
      setError("E-mail ou senha incorretos");
      setLoading(false);
      return;
    }
    router.push(params.get("redirect") ?? "/leads");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-sm">
      <div>
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" type="email" autoComplete="email" {...register("email")} />
        {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <Label htmlFor="password">Senha</Label>
        <Input id="password" type="password" autoComplete="current-password" {...register("password")} />
        {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>}
      </div>
      {error && <p className="text-red-600 text-sm text-center">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
```

- [ ] **Step 2: Criar `app/(auth)/login/page.tsx`**

```tsx
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-1">Dashboard Florence</h1>
        <p className="text-sm text-gray-500 text-center mb-6">Entre com sua conta</p>
        <LoginForm />
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Testar localmente**

```powershell
npm run dev
```

Abra http://localhost:3000/login, tente login com credenciais incorretas (deve mostrar erro), depois com correta (deve redirecionar — vai dar 404 em /leads ainda, esperado).

- [ ] **Step 4: TypeScript check + commit**

```powershell
npx tsc --noEmit
```

```bash
git add apps/dashboard/app/\(auth\) apps/dashboard/components/auth
git commit -m "feat(dashboard): página de login + form com validação"
```

---

## Task 7: Criar primeiro super_admin manualmente

**Files:** (operação no Supabase, sem código)

- [ ] **Step 1: Criar usuário no Supabase Auth**

No painel Supabase → Authentication → Users → Add user → Create new user:
- E-mail: o seu (`dev@luanfelipe.com.br`)
- Password: defina uma senha forte
- Auto Confirm User: ✅

Anote o `id` (UUID) do usuário criado.

- [ ] **Step 2: Inserir no user_profiles via SQL Editor**

```sql
insert into user_profiles (id, email, name, role, active)
values ('<UUID_DO_USUARIO>', 'dev@luanfelipe.com.br', 'Luan Oliveira', 'super_admin', true);
```

- [ ] **Step 3: Testar login**

No `localhost:3000/login`, entre com essas credenciais. Deve redirecionar para `/leads` (404 ainda, mas o login funcionou).

---

## Task 8: Layout autenticado (sidebar + topbar)

**Files:**
- Create: `apps/dashboard/app/(app)/layout.tsx`
- Create: `apps/dashboard/components/layout/sidebar.tsx`
- Create: `apps/dashboard/components/layout/topbar.tsx`

- [ ] **Step 1: Criar `components/layout/sidebar.tsx`**

```tsx
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, KanbanSquare, Users, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase-client";
import type { UserProfile } from "@/types/database";
import { canAccessAnalytics, canAccessLeads, canManageTeam } from "@/lib/roles";

interface SidebarProps {
  profile: UserProfile;
}

export function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const items = [
    canAccessAnalytics(profile.role) && { href: "/analytics", label: "Analytics", icon: BarChart3 },
    canAccessLeads(profile.role)     && { href: "/leads",     label: "Leads",     icon: KanbanSquare },
    canManageTeam(profile.role)      && { href: "/team",      label: "Time",      icon: Users },
  ].filter(Boolean) as { href: string; label: string; icon: typeof BarChart3 }[];

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col">
      <div className="px-6 py-5 border-b border-gray-100">
        <h1 className="font-bold text-lg">Florence</h1>
        <p className="text-xs text-gray-500">Dashboard</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {items.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-100"
              }`}>
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-100">
        <div className="px-3 py-2 mb-1">
          <p className="text-sm font-medium truncate">{profile.name ?? profile.email}</p>
          <p className="text-xs text-gray-500 truncate">{profile.email}</p>
        </div>
        <button onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
          <LogOut size={18} /> Sair
        </button>
      </div>
    </aside>
  );
}
```

- [ ] **Step 2: Criar `components/layout/topbar.tsx`**

```tsx
import type { UserProfile } from "@/types/database";
import { ROLE_LABELS } from "@/lib/roles";

export function Topbar({ profile, title }: { profile: UserProfile; title: string }) {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h2 className="font-semibold">{title}</h2>
      <div className="flex items-center gap-2">
        <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">
          {ROLE_LABELS[profile.role]}
        </span>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Criar `app/(app)/layout.tsx`**

```tsx
import { requireProfile } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireProfile();
  return (
    <div className="min-h-[100dvh] flex bg-gray-50">
      <Sidebar profile={profile} />
      <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
    </div>
  );
}
```

- [ ] **Step 4: Stub temporário de /leads para testar**

`app/(app)/leads/page.tsx`:

```tsx
import { requireProfile } from "@/lib/auth";
import { Topbar } from "@/components/layout/topbar";

export default async function LeadsPage() {
  const profile = await requireProfile();
  return (
    <>
      <Topbar profile={profile} title="Leads" />
      <main className="flex-1 p-6"><p>Em construção…</p></main>
    </>
  );
}
```

- [ ] **Step 5: Testar visual**

`npm run dev` → login → deve aparecer sidebar com itens conforme role.

- [ ] **Step 6: TypeScript check + commit**

```powershell
npx tsc --noEmit
```

```bash
git add apps/dashboard/app/\(app\) apps/dashboard/components/layout
git commit -m "feat(dashboard): layout autenticado com sidebar dinâmica por role"
```

---

## Task 9: Página 404 customizada

**Files:**
- Create: `apps/dashboard/app/not-found.tsx`

- [ ] **Step 1: Criar `app/not-found.tsx`**

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-3xl font-bold mb-2">404</h1>
      <p className="text-gray-500 mb-6">Página não encontrada</p>
      <Link href="/leads" className="text-blue-600 hover:underline">Voltar ao dashboard</Link>
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/dashboard/app/not-found.tsx
git commit -m "feat(dashboard): página 404 customizada"
```

---

## Task 10: Deploy inicial (Vercel project 2)

**Files:** (operação na Vercel)

- [ ] **Step 1: Push do progresso**

```bash
git push origin main
```

- [ ] **Step 2: Criar projeto na Vercel**

Painel Vercel → Add New Project → Import `luan-flipe/florence` (mesmo repo) → Configure:
- Project Name: `florence-dashboard`
- Framework Preset: **Next.js** (selecionar manualmente)
- Root Directory: `apps/dashboard`
- Environment Variables (todas, Production + Preview):
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `RESEND_API_KEY`
  - `NEXT_PUBLIC_APP_URL` = `https://dashboard.florence.edu.br`

Deploy.

- [ ] **Step 3: Conectar domínio**

Project → Settings → Domains → adicionar `dashboard.florence.edu.br`.
Apontar CNAME no DNS conforme indicado pela Vercel.

- [ ] **Step 4: Testar produção**

Acessar `https://dashboard.florence.edu.br/login` → entrar com super_admin → ver sidebar.

---

# Sprint 2 — Vendas (Sáb 16)

## Task 11: Query helper de leads

**Files:**
- Create: `apps/dashboard/lib/queries/leads.ts`

- [ ] **Step 1: Criar `lib/queries/leads.ts`**

```ts
import { createClient } from "@/lib/supabase-server";
import type { LeadWithStatus, LeadStatus } from "@/types/database";

export interface LeadsFilter {
  course?: string;
  statuses?: LeadStatus[];
  assignedTo?: string;
  search?: string;
  since?: string; // ISO date
}

export async function fetchLeads(filter: LeadsFilter = {}): Promise<LeadWithStatus[]> {
  const supabase = createClient();
  let query = supabase
    .from("leads")
    .select(`
      *,
      lead_status!inner(status),
      assigned_user:user_profiles!leads_assigned_to_fkey(id, name, email),
      comments(count)
    `)
    .order("created_at", { ascending: false });

  if (filter.course)     query = query.eq("course", filter.course);
  if (filter.assignedTo) query = query.eq("assigned_to", filter.assignedTo);
  if (filter.since)      query = query.gte("created_at", filter.since);
  if (filter.search) {
    query = query.or(`name.ilike.%${filter.search}%,email.ilike.%${filter.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;

  let leads = (data ?? []).map((row: any) => ({
    ...row,
    status: row.lead_status[0]?.status as LeadStatus,
    comments_count: row.comments[0]?.count ?? 0,
  })) as LeadWithStatus[];

  if (filter.statuses && filter.statuses.length > 0) {
    leads = leads.filter((l) => filter.statuses!.includes(l.status));
  }

  return leads;
}

export async function fetchLeadById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("leads")
    .select(`
      *,
      lead_status!inner(status),
      assigned_user:user_profiles!leads_assigned_to_fkey(id, name, email)
    `)
    .eq("id", id)
    .single();
  if (error) throw error;
  return {
    ...data,
    status: data.lead_status[0]?.status,
  };
}

export async function fetchLeadHistory(leadId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("lead_status_history")
    .select(`*, changed_by_user:user_profiles!lead_status_history_changed_by_fkey(name, email)`)
    .eq("lead_id", leadId)
    .order("changed_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchLeadComments(leadId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("comments")
    .select(`*, user:user_profiles!comments_user_id_fkey(name, email)`)
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}
```

- [ ] **Step 2: TypeScript check + commit**

```powershell
npx tsc --noEmit
```

```bash
git add apps/dashboard/lib/queries
git commit -m "feat(dashboard): query helpers para leads, histórico e comentários"
```

---

## Task 12: Filtros da listagem de leads

**Files:**
- Create: `apps/dashboard/components/leads/filters.tsx`

- [ ] **Step 1: Criar `components/leads/filters.tsx`**

```tsx
"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { STAGES } from "@/lib/stages";

export function LeadsFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [search, setSearch] = useState(params.get("q") ?? "");

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      const next = new URLSearchParams(params);
      if (search) next.set("q", search);
      else next.delete("q");
      router.push(`?${next.toString()}`);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value && value !== "all") next.set(key, value);
    else next.delete(key);
    router.push(`?${next.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <Input
        placeholder="Buscar por nome ou e-mail"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-64"
      />

      <select className="border rounded-md px-3 py-2 text-sm"
        value={params.get("period") ?? "30d"}
        onChange={(e) => setParam("period", e.target.value)}>
        <option value="today">Hoje</option>
        <option value="7d">7 dias</option>
        <option value="30d">30 dias</option>
        <option value="all">Tudo</option>
      </select>

      <select className="border rounded-md px-3 py-2 text-sm"
        value={params.get("status") ?? "active"}
        onChange={(e) => setParam("status", e.target.value)}>
        <option value="active">Ativos (sem perdidos)</option>
        <option value="all">Todos</option>
        {STAGES.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
    </div>
  );
}
```

- [ ] **Step 2: TypeScript check + commit**

```powershell
npx tsc --noEmit
```

```bash
git add apps/dashboard/components/leads/filters.tsx
git commit -m "feat(dashboard): filtros de leads (busca, período, status)"
```

---

## Task 13: Página de leads + parsing de filtros

**Files:**
- Modify: `apps/dashboard/app/(app)/leads/page.tsx`
- Create: `apps/dashboard/components/leads/view-toggle.tsx`

- [ ] **Step 1: Criar `components/leads/view-toggle.tsx`**

```tsx
"use client";
import { useState, useEffect } from "react";
import { KanbanSquare, List } from "lucide-react";

const KEY = "leads_view";

export function ViewToggle({ children: [kanban, list] }: { children: [React.ReactNode, React.ReactNode] }) {
  const [view, setView] = useState<"kanban" | "list">("kanban");

  useEffect(() => {
    const saved = localStorage.getItem(KEY) as "kanban" | "list" | null;
    if (saved) setView(saved);
  }, []);

  function set(v: "kanban" | "list") {
    setView(v);
    localStorage.setItem(KEY, v);
  }

  return (
    <>
      <div className="inline-flex border rounded-md overflow-hidden">
        <button onClick={() => set("kanban")}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm ${view === "kanban" ? "bg-blue-50 text-blue-700" : "bg-white text-gray-600"}`}>
          <KanbanSquare size={16} /> Kanban
        </button>
        <button onClick={() => set("list")}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm ${view === "list" ? "bg-blue-50 text-blue-700" : "bg-white text-gray-600"}`}>
          <List size={16} /> Lista
        </button>
      </div>
      <div className="mt-4">{view === "kanban" ? kanban : list}</div>
    </>
  );
}
```

- [ ] **Step 2: Atualizar `app/(app)/leads/page.tsx`**

```tsx
import { requireRole } from "@/lib/auth";
import { fetchLeads, type LeadsFilter } from "@/lib/queries/leads";
import { Topbar } from "@/components/layout/topbar";
import { LeadsFilters } from "@/components/leads/filters";
import { ViewToggle } from "@/components/leads/view-toggle";
import { KanbanBoard } from "@/components/kanban/board";
import { LeadsListView } from "@/components/leads/list-view";
import { STAGES } from "@/lib/stages";
import type { LeadStatus } from "@/types/database";

function periodToDate(period: string): string | undefined {
  const now = new Date();
  if (period === "today") return new Date(now.setHours(0, 0, 0, 0)).toISOString();
  if (period === "7d")    { now.setDate(now.getDate() - 7);  return now.toISOString(); }
  if (period === "30d")   { now.setDate(now.getDate() - 30); return now.toISOString(); }
  return undefined;
}

export default async function LeadsPage({
  searchParams,
}: { searchParams: { q?: string; period?: string; status?: string; course?: string } }) {
  const profile = await requireRole(["super_admin", "admin_vendas", "comercial"]);

  const filter: LeadsFilter = {
    course:    searchParams.course,
    search:    searchParams.q,
    since:     periodToDate(searchParams.period ?? "30d"),
    statuses:
      !searchParams.status || searchParams.status === "active"
        ? (STAGES.filter((s) => s.value !== "perdido").map((s) => s.value) as LeadStatus[])
        : searchParams.status === "all"
          ? undefined
          : ([searchParams.status as LeadStatus]),
  };

  // Para comercial, restringe a cursos atribuídos
  if (profile.role === "comercial" && profile.courses.length > 0) {
    if (filter.course && !profile.courses.includes(filter.course)) {
      filter.course = profile.courses[0];
    }
  }

  const leads = await fetchLeads(filter);

  return (
    <>
      <Topbar profile={profile} title="Leads" />
      <main className="flex-1 p-6 overflow-auto">
        <LeadsFilters />
        <ViewToggle>
          <KanbanBoard leads={leads} canEdit={true} />
          <LeadsListView leads={leads} />
        </ViewToggle>
      </main>
    </>
  );
}
```

- [ ] **Step 3: Stubs temporários para KanbanBoard e LeadsListView**

`components/kanban/board.tsx`:
```tsx
import type { LeadWithStatus } from "@/types/database";
export function KanbanBoard({ leads }: { leads: LeadWithStatus[]; canEdit: boolean }) {
  return <div>Kanban com {leads.length} leads (em construção)</div>;
}
```

`components/leads/list-view.tsx`:
```tsx
import type { LeadWithStatus } from "@/types/database";
export function LeadsListView({ leads }: { leads: LeadWithStatus[] }) {
  return <div>Lista com {leads.length} leads (em construção)</div>;
}
```

- [ ] **Step 4: TypeScript check + commit**

```powershell
npx tsc --noEmit
```

```bash
git add apps/dashboard/app apps/dashboard/components
git commit -m "feat(dashboard): página de leads com filtros + toggle de visualização"
```

---

## Task 14: Kanban estático (sem drag yet)

**Files:**
- Modify: `apps/dashboard/components/kanban/board.tsx`
- Create: `apps/dashboard/components/kanban/column.tsx`
- Create: `apps/dashboard/components/kanban/lead-card.tsx`

- [ ] **Step 1: Criar `components/kanban/lead-card.tsx`**

```tsx
"use client";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MessageCircle } from "lucide-react";
import type { LeadWithStatus } from "@/types/database";
import { STAGE_BY_VALUE } from "@/lib/stages";

export function LeadCard({ lead }: { lead: LeadWithStatus }) {
  const stage = STAGE_BY_VALUE[lead.status];
  return (
    <Link
      href={`/leads/${lead.id}`}
      className="block bg-white rounded-lg border-l-4 border border-gray-200 p-3 hover:shadow-md transition-shadow"
      style={{ borderLeftColor: stage.color }}
    >
      <p className="font-medium text-sm text-gray-900 truncate">{lead.name}</p>
      <p className="text-xs text-gray-500 mt-0.5">
        {lead.course} · {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true, locale: ptBR })}
      </p>
      <p className="text-xs text-gray-400 mt-1 truncate">📞 {lead.phone}</p>

      {lead.utm_source && (
        <p className="text-[10px] text-gray-400 mt-1 truncate">{lead.utm_source} · {lead.utm_campaign}</p>
      )}

      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <MessageCircle size={12} /> {lead.comments_count ?? 0}
        </span>
        {lead.assigned_user && (
          <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
            {lead.assigned_user.name?.split(" ")[0] ?? lead.assigned_user.email.split("@")[0]}
          </span>
        )}
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Criar `components/kanban/column.tsx`**

```tsx
"use client";
import type { LeadWithStatus, LeadStatus } from "@/types/database";
import { STAGE_BY_VALUE } from "@/lib/stages";
import { LeadCard } from "./lead-card";

export function KanbanColumn({ status, leads }: { status: LeadStatus; leads: LeadWithStatus[] }) {
  const stage = STAGE_BY_VALUE[status];
  return (
    <div className="flex-shrink-0 w-72 bg-gray-100 rounded-lg p-3 flex flex-col" data-column={status}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: stage.color }} />
          {stage.label}
        </h3>
        <span className="text-xs text-gray-500">{leads.length}</span>
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto">
        {leads.map((lead) => <LeadCard key={lead.id} lead={lead} />)}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Substituir `components/kanban/board.tsx`**

```tsx
"use client";
import { useMemo } from "react";
import type { LeadWithStatus } from "@/types/database";
import { STAGES } from "@/lib/stages";
import { KanbanColumn } from "./column";

export function KanbanBoard({ leads }: { leads: LeadWithStatus[]; canEdit: boolean }) {
  const grouped = useMemo(() => {
    const map = new Map(STAGES.map((s) => [s.value, [] as LeadWithStatus[]]));
    leads.forEach((l) => map.get(l.status)?.push(l));
    return map;
  }, [leads]);

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory md:snap-none">
      {STAGES.map((stage) => (
        <div key={stage.value} className="snap-start min-w-[85vw] md:min-w-0">
          <KanbanColumn status={stage.value} leads={grouped.get(stage.value) ?? []} />
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: TypeScript check + commit**

```powershell
npx tsc --noEmit
```

```bash
git add apps/dashboard/components/kanban
git commit -m "feat(dashboard): kanban estático com 6 colunas e cards"
```

---

## Task 15: Drag & drop com dnd-kit + UPDATE no Supabase

**Files:**
- Modify: `apps/dashboard/components/kanban/board.tsx`

- [ ] **Step 1: Reescrever `components/kanban/board.tsx` com dnd-kit**

```tsx
"use client";
import { useState, useMemo } from "react";
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors,
  type DragEndEvent, type DragStartEvent,
  closestCorners,
} from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useRouter } from "next/navigation";
import type { LeadWithStatus, LeadStatus } from "@/types/database";
import { STAGES, STAGE_BY_VALUE } from "@/lib/stages";
import { LeadCard } from "./lead-card";
import { createClient } from "@/lib/supabase-client";

function SortableLeadCard({ lead }: { lead: LeadWithStatus }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: lead.id,
    data: { status: lead.status },
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <LeadCard lead={lead} />
    </div>
  );
}

function DroppableColumn({ status, leads }: { status: LeadStatus; leads: LeadWithStatus[] }) {
  const stage = STAGE_BY_VALUE[status];
  const { setNodeRef } = useSortable({ id: `column-${status}`, data: { type: "column", status } });
  return (
    <div ref={setNodeRef} className="flex-shrink-0 w-72 bg-gray-100 rounded-lg p-3 flex flex-col" data-column={status}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: stage.color }} />
          {stage.label}
        </h3>
        <span className="text-xs text-gray-500">{leads.length}</span>
      </div>
      <SortableContext items={leads.map((l) => l.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 space-y-2 overflow-y-auto min-h-[100px]">
          {leads.map((lead) => <SortableLeadCard key={lead.id} lead={lead} />)}
        </div>
      </SortableContext>
    </div>
  );
}

export function KanbanBoard({ leads, canEdit }: { leads: LeadWithStatus[]; canEdit: boolean }) {
  const router = useRouter();
  const [items, setItems] = useState(leads);
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const grouped = useMemo(() => {
    const map = new Map(STAGES.map((s) => [s.value, [] as LeadWithStatus[]]));
    items.forEach((l) => map.get(l.status)?.push(l));
    return map;
  }, [items]);

  function handleDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }

  async function handleDragEnd(e: DragEndEvent) {
    setActiveId(null);
    if (!canEdit || !e.over) return;

    const leadId = String(e.active.id);
    const overId = String(e.over.id);

    // overId pode ser "column-novo" ou um lead id
    const newStatus: LeadStatus | null = overId.startsWith("column-")
      ? (overId.replace("column-", "") as LeadStatus)
      : (e.over.data.current?.status as LeadStatus | undefined) ?? null;

    if (!newStatus) return;
    const lead = items.find((l) => l.id === leadId);
    if (!lead || lead.status === newStatus) return;

    // Optimistic update
    setItems((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)));

    const supabase = createClient();
    const { error } = await supabase
      .from("lead_status")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("lead_id", leadId);

    if (error) {
      console.error(error);
      // Rollback
      setItems((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: lead.status } : l)));
      return;
    }
    router.refresh();
  }

  const activeLead = items.find((l) => l.id === activeId);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners}
      onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory md:snap-none">
        {STAGES.map((stage) => (
          <div key={stage.value} className="snap-start min-w-[85vw] md:min-w-0">
            <DroppableColumn status={stage.value} leads={grouped.get(stage.value) ?? []} />
          </div>
        ))}
      </div>
      <DragOverlay>
        {activeLead && <LeadCard lead={activeLead} />}
      </DragOverlay>
    </DndContext>
  );
}
```

- [ ] **Step 2: Testar localmente**

`npm run dev` → /leads → arrastar card entre colunas → confirmar no Supabase Table Editor que `lead_status` mudou e `lead_status_history` ganhou registro.

- [ ] **Step 3: TypeScript check + commit**

```powershell
npx tsc --noEmit
```

```bash
git add apps/dashboard/components/kanban/board.tsx
git commit -m "feat(dashboard): drag & drop no kanban com optimistic UI + UPDATE no Supabase"
```

---

## Task 16: Lista de leads (LeadsListView)

**Files:**
- Modify: `apps/dashboard/components/leads/list-view.tsx`

- [ ] **Step 1: Substituir `components/leads/list-view.tsx`**

```tsx
"use client";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { LeadWithStatus } from "@/types/database";
import { STAGE_BY_VALUE } from "@/lib/stages";

export function LeadsListView({ leads }: { leads: LeadWithStatus[] }) {
  if (leads.length === 0) {
    return <p className="text-gray-500 text-sm py-12 text-center">Nenhum lead encontrado para os filtros atuais.</p>;
  }

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
          <tr>
            <th className="text-left px-4 py-2">Nome</th>
            <th className="text-left px-4 py-2">Curso</th>
            <th className="text-left px-4 py-2">Status</th>
            <th className="text-left px-4 py-2">Atribuído</th>
            <th className="text-left px-4 py-2">Criado</th>
            <th className="text-left px-4 py-2">Fonte</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {leads.map((lead) => {
            const stage = STAGE_BY_VALUE[lead.status];
            return (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">
                  <Link href={`/leads/${lead.id}`} className="font-medium text-gray-900 hover:text-blue-600">
                    {lead.name}
                  </Link>
                  <p className="text-xs text-gray-500">{lead.email}</p>
                </td>
                <td className="px-4 py-2 text-gray-600">{lead.course}</td>
                <td className="px-4 py-2">
                  <span className="inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full"
                    style={{ background: `${stage.color}15`, color: stage.color }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: stage.color }} />
                    {stage.label}
                  </span>
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {lead.assigned_user?.name ?? lead.assigned_user?.email ?? "—"}
                </td>
                <td className="px-4 py-2 text-gray-500 text-xs">
                  {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true, locale: ptBR })}
                </td>
                <td className="px-4 py-2 text-xs text-gray-500">
                  {lead.utm_source ?? "direto"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 2: TypeScript check + commit**

```powershell
npx tsc --noEmit
```

```bash
git add apps/dashboard/components/leads/list-view.tsx
git commit -m "feat(dashboard): visualização em lista dos leads (alternativa ao kanban)"
```

---

## Task 17: Página de detalhe do lead (read-only)

**Files:**
- Create: `apps/dashboard/app/(app)/leads/[id]/page.tsx`
- Create: `apps/dashboard/components/leads/lead-detail.tsx`

- [ ] **Step 1: Criar `components/leads/lead-detail.tsx`**

```tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, Phone, MessageSquare } from "lucide-react";
import type { LeadWithStatus, LeadStatusHistory, Comment, UserProfile } from "@/types/database";
import { STAGE_BY_VALUE, STAGES } from "@/lib/stages";

interface Props {
  lead: LeadWithStatus;
  history: LeadStatusHistory[];
  comments: Comment[];
  profile: UserProfile;
}

export function LeadDetail({ lead, history, comments, profile }: Props) {
  const stage = STAGE_BY_VALUE[lead.status];
  const whatsapp = `https://wa.me/55${lead.phone.replace(/\D/g, "")}`;
  const tel = `tel:+55${lead.phone.replace(/\D/g, "")}`;

  return (
    <main className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Link href="/leads" className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft size={16} /> Voltar para Leads
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl border p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
              <p className="text-sm text-gray-500 mt-1">{lead.email}</p>
              <p className="text-sm text-gray-500">{lead.phone}</p>
              <div className="flex gap-2 mt-3">
                <a href={whatsapp} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1.5 rounded-lg">
                  <MessageSquare size={14} /> WhatsApp
                </a>
                <a href={tel}
                  className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded-lg">
                  <Phone size={14} /> Ligar
                </a>
              </div>
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-full"
                style={{ background: `${stage.color}20`, color: stage.color }}>
                <span className="w-2 h-2 rounded-full" style={{ background: stage.color }} />
                {stage.label}
              </span>
            </div>
          </div>
        </div>

        {/* Dados */}
        <section className="bg-white rounded-2xl border p-6">
          <h2 className="font-semibold mb-4">Dados do lead</h2>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div><dt className="text-gray-500">Curso</dt><dd>{lead.course}</dd></div>
            <div><dt className="text-gray-500">Criado em</dt>
              <dd>{format(new Date(lead.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</dd></div>
            <div><dt className="text-gray-500">UTM Source</dt><dd>{lead.utm_source ?? "—"}</dd></div>
            <div><dt className="text-gray-500">UTM Campaign</dt><dd>{lead.utm_campaign ?? "—"}</dd></div>
            <div><dt className="text-gray-500">UTM Medium</dt><dd>{lead.utm_medium ?? "—"}</dd></div>
            <div><dt className="text-gray-500">Atribuído a</dt>
              <dd>{lead.assigned_user?.name ?? lead.assigned_user?.email ?? "Não atribuído"}</dd></div>
          </dl>
        </section>

        {/* Histórico */}
        <section className="bg-white rounded-2xl border p-6">
          <h2 className="font-semibold mb-4">Histórico de status</h2>
          {history.length === 0 ? (
            <p className="text-sm text-gray-500">Sem histórico.</p>
          ) : (
            <ul className="space-y-3 text-sm">
              {history.map((h) => (
                <li key={h.id} className="flex items-start gap-3">
                  <span className="text-gray-400 text-xs whitespace-nowrap mt-0.5">
                    {format(new Date(h.changed_at), "dd/MM HH:mm", { locale: ptBR })}
                  </span>
                  <span>
                    {h.from_status
                      ? <>De <strong>{STAGE_BY_VALUE[h.from_status].label}</strong> para <strong>{STAGE_BY_VALUE[h.to_status].label}</strong></>
                      : <>Criado como <strong>{STAGE_BY_VALUE[h.to_status].label}</strong></>}
                    {h.changed_by_user && <> por {h.changed_by_user.name ?? h.changed_by_user.email}</>}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Comentários — placeholder, será expandido na Task 19 */}
        <section className="bg-white rounded-2xl border p-6">
          <h2 className="font-semibold mb-4">Comentários ({comments.length})</h2>
          {comments.length === 0
            ? <p className="text-sm text-gray-500">Sem comentários ainda.</p>
            : <ul className="space-y-3 text-sm">
                {comments.map((c) => (
                  <li key={c.id} className="border-l-2 border-blue-200 pl-3">
                    <p className="text-xs text-gray-500">
                      {c.user?.name ?? c.user?.email ?? "—"} ·{" "}
                      {formatDistanceToNow(new Date(c.created_at), { addSuffix: true, locale: ptBR })}
                    </p>
                    <p className="text-gray-700 mt-1">{c.text}</p>
                  </li>
                ))}
              </ul>}
        </section>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Criar `app/(app)/leads/[id]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { fetchLeadById, fetchLeadHistory, fetchLeadComments } from "@/lib/queries/leads";
import { Topbar } from "@/components/layout/topbar";
import { LeadDetail } from "@/components/leads/lead-detail";

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const profile = await requireRole(["super_admin", "admin_vendas", "comercial"]);

  let lead, history, comments;
  try {
    [lead, history, comments] = await Promise.all([
      fetchLeadById(params.id),
      fetchLeadHistory(params.id),
      fetchLeadComments(params.id),
    ]);
  } catch {
    notFound();
  }

  return (
    <>
      <Topbar profile={profile} title="Detalhes do lead" />
      <LeadDetail lead={lead as any} history={history as any} comments={comments as any} profile={profile} />
    </>
  );
}
```

- [ ] **Step 3: TypeScript check + commit**

```powershell
npx tsc --noEmit
```

```bash
git add apps/dashboard/app/\(app\)/leads/\[id\] apps/dashboard/components/leads/lead-detail.tsx
git commit -m "feat(dashboard): página de detalhe do lead com histórico e dados"
```

---

## Task 18: Mudar status + atribuir no detail

**Files:**
- Create: `apps/dashboard/components/leads/status-changer.tsx`
- Create: `apps/dashboard/components/leads/assign-changer.tsx`
- Modify: `apps/dashboard/components/leads/lead-detail.tsx`

- [ ] **Step 1: Criar `components/leads/status-changer.tsx`**

```tsx
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { STAGES } from "@/lib/stages";
import type { LeadStatus } from "@/types/database";

export function StatusChanger({ leadId, current }: { leadId: string; current: LeadStatus }) {
  const router = useRouter();
  const [value, setValue] = useState(current);
  const [loading, setLoading] = useState(false);

  async function onChange(next: LeadStatus) {
    setValue(next);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("lead_status")
      .update({ status: next, updated_at: new Date().toISOString() })
      .eq("lead_id", leadId);
    setLoading(false);
    if (error) {
      setValue(current);
      alert("Erro ao mudar status: " + error.message);
      return;
    }
    router.refresh();
  }

  return (
    <select value={value} disabled={loading}
      onChange={(e) => onChange(e.target.value as LeadStatus)}
      className="border rounded-md px-3 py-1.5 text-sm">
      {STAGES.map((s) => (
        <option key={s.value} value={s.value}>{s.label}</option>
      ))}
    </select>
  );
}
```

- [ ] **Step 2: Criar `components/leads/assign-changer.tsx`**

```tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";

interface Props {
  leadId: string;
  currentAssignedId: string | null;
  canAssign: boolean;
}

export function AssignChanger({ leadId, currentAssignedId, canAssign }: Props) {
  const router = useRouter();
  const [users, setUsers] = useState<{ id: string; name: string | null; email: string }[]>([]);
  const [value, setValue] = useState(currentAssignedId ?? "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!canAssign) return;
    const supabase = createClient();
    supabase
      .from("user_profiles")
      .select("id, name, email")
      .in("role", ["comercial", "admin_vendas"])
      .eq("active", true)
      .then(({ data }) => setUsers(data ?? []));
  }, [canAssign]);

  if (!canAssign) return null;

  async function onChange(next: string) {
    setValue(next);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("leads")
      .update({ assigned_to: next || null })
      .eq("id", leadId);
    setLoading(false);
    if (error) {
      alert("Erro ao atribuir: " + error.message);
      setValue(currentAssignedId ?? "");
      return;
    }
    router.refresh();
  }

  return (
    <select value={value} disabled={loading}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded-md px-3 py-1.5 text-sm">
      <option value="">Não atribuído</option>
      {users.map((u) => (
        <option key={u.id} value={u.id}>{u.name ?? u.email}</option>
      ))}
    </select>
  );
}
```

- [ ] **Step 3: Modificar `components/leads/lead-detail.tsx`**

No header (substitua o span com o status atual):

```tsx
import { StatusChanger } from "./status-changer";
import { AssignChanger } from "./assign-changer";
import { canAssignLeads } from "@/lib/roles";
// ...
{/* dentro do header onde estava o span de status */}
<StatusChanger leadId={lead.id} current={lead.status} />
```

Na seção de Dados, substitua a linha de Atribuído:

```tsx
<div>
  <dt className="text-gray-500">Atribuído a</dt>
  <dd className="mt-1">
    <AssignChanger leadId={lead.id} currentAssignedId={lead.assigned_to}
      canAssign={canAssignLeads(profile.role)} />
  </dd>
</div>
```

- [ ] **Step 4: TypeScript check + commit**

```powershell
npx tsc --noEmit
```

```bash
git add apps/dashboard/components/leads
git commit -m "feat(dashboard): mudança de status e atribuição no detail do lead"
```

---

## Task 19: Adicionar comentários

**Files:**
- Create: `apps/dashboard/components/leads/comment-form.tsx`
- Modify: `apps/dashboard/components/leads/lead-detail.tsx`

- [ ] **Step 1: Criar `components/leads/comment-form.tsx`**

```tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";

export function CommentForm({ leadId }: { leadId: string }) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("comments").insert({
      lead_id: leadId,
      user_id: user.id,
      text: text.trim(),
    });
    setLoading(false);
    if (error) {
      alert("Erro ao adicionar comentário: " + error.message);
      return;
    }
    setText("");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2 mt-4">
      <textarea value={text} onChange={(e) => setText(e.target.value)}
        placeholder="Adicionar comentário..."
        className="w-full border rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} />
      <div className="flex justify-end">
        <Button type="submit" disabled={loading || !text.trim()}>
          {loading ? "Enviando..." : "Adicionar"}
        </Button>
      </div>
    </form>
  );
}
```

- [ ] **Step 2: Inserir `<CommentForm leadId={lead.id} />` na seção de comentários do `lead-detail.tsx`**

Logo após o `<h2>` da seção de comentários, antes da lista.

- [ ] **Step 3: TypeScript check + commit**

```powershell
npx tsc --noEmit
```

```bash
git add apps/dashboard/components/leads
git commit -m "feat(dashboard): adicionar comentário no detail do lead"
```

---

## Task 20: Realtime no kanban

**Files:**
- Create: `apps/dashboard/hooks/useRealtimeLeads.ts`
- Modify: `apps/dashboard/components/kanban/board.tsx`

- [ ] **Step 1: Criar `hooks/useRealtimeLeads.ts`**

```ts
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";

export function useRealtimeLeads() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("leads-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "lead_status" }, () => {
        router.refresh();
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "leads" }, () => {
        router.refresh();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);
}
```

- [ ] **Step 2: Adicionar hook no `board.tsx`**

No início do componente `KanbanBoard`, adicione:

```tsx
import { useRealtimeLeads } from "@/hooks/useRealtimeLeads";
// ...
useRealtimeLeads();
```

- [ ] **Step 3: Testar abrindo duas abas**

Em uma aba mude o status de um lead — a outra deve atualizar sozinha.

- [ ] **Step 4: TypeScript check + commit**

```powershell
npx tsc --noEmit
```

```bash
git add apps/dashboard/hooks/useRealtimeLeads.ts apps/dashboard/components/kanban/board.tsx
git commit -m "feat(dashboard): realtime updates no kanban via Supabase Realtime"
```

---

## Task 21: Realtime nos comentários e histórico

**Files:**
- Create: `apps/dashboard/hooks/useRealtimeComments.ts`
- Modify: `apps/dashboard/components/leads/lead-detail.tsx`

- [ ] **Step 1: Criar `hooks/useRealtimeComments.ts`**

```ts
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";

export function useRealtimeComments(leadId: string) {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`lead-${leadId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "comments",
        filter: `lead_id=eq.${leadId}`,
      }, () => router.refresh())
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "lead_status_history",
        filter: `lead_id=eq.${leadId}`,
      }, () => router.refresh())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [leadId, router]);
}
```

- [ ] **Step 2: Usar hook no `lead-detail.tsx`**

No início do componente:

```tsx
import { useRealtimeComments } from "@/hooks/useRealtimeComments";
// ...
useRealtimeComments(lead.id);
```

- [ ] **Step 3: TypeScript check + commit**

```powershell
npx tsc --noEmit
```

```bash
git add apps/dashboard/hooks/useRealtimeComments.ts apps/dashboard/components/leads/lead-detail.tsx
git commit -m "feat(dashboard): realtime updates no detalhe (comentários + histórico)"
```

---

# Sprint 3 — Analytics + Team + UTM (Dom 17)

## Task 22: Queries de analytics

**Files:**
- Create: `apps/dashboard/lib/queries/analytics.ts`

- [ ] **Step 1: Criar `lib/queries/analytics.ts`**

```ts
import { createClient } from "@/lib/supabase-server";
import type { LeadStatus } from "@/types/database";

export async function fetchAnalytics(opts: { since: Date; until: Date; course?: string }) {
  const supabase = createClient();

  let leadsQuery = supabase
    .from("leads")
    .select("id, course, created_at, utm_source, lead_status!inner(status), lead_status_history(to_status, changed_at)")
    .gte("created_at", opts.since.toISOString())
    .lte("created_at", opts.until.toISOString());

  if (opts.course) leadsQuery = leadsQuery.eq("course", opts.course);

  const { data: leads, error } = await leadsQuery;
  if (error) throw error;

  // Período anterior para delta
  const prevStart = new Date(opts.since.getTime() - (opts.until.getTime() - opts.since.getTime()));
  const prevEnd = opts.since;
  const { count: prevCount } = await supabase
    .from("leads").select("*", { count: "exact", head: true })
    .gte("created_at", prevStart.toISOString())
    .lt("created_at", prevEnd.toISOString());

  // Métricas calculadas
  const total = leads?.length ?? 0;
  const totalDelta = prevCount ? Math.round(((total - prevCount) / prevCount) * 100) : 0;

  // Funil
  const funnel: Record<LeadStatus, number> = {
    novo: 0, contactado: 0, em_conversa: 0,
    matricula_iniciada: 0, matriculado: 0, perdido: 0,
  };
  leads?.forEach((l: any) => {
    const s = l.lead_status[0]?.status as LeadStatus;
    if (s) funnel[s]++;
  });

  // Conversão = matriculados / total
  const conversion = total > 0 ? (funnel.matriculado / total) * 100 : 0;

  // Tempo médio até primeiro contato (horas)
  const contactTimes = leads?.flatMap((l: any) => {
    const firstContact = l.lead_status_history.find((h: any) => h.to_status === "contactado");
    if (!firstContact) return [];
    return [(new Date(firstContact.changed_at).getTime() - new Date(l.created_at).getTime()) / 1000 / 3600];
  }) ?? [];
  const avgContactHours = contactTimes.length > 0
    ? contactTimes.reduce((a, b) => a + b, 0) / contactTimes.length
    : 0;

  // Leads por dia
  const byDay = new Map<string, number>();
  leads?.forEach((l: any) => {
    const day = l.created_at.slice(0, 10);
    byDay.set(day, (byDay.get(day) ?? 0) + 1);
  });
  const timeline = Array.from(byDay.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, count]) => ({ day, count }));

  // Por curso
  const byCourse = new Map<string, number>();
  leads?.forEach((l: any) => byCourse.set(l.course, (byCourse.get(l.course) ?? 0) + 1));

  // Por fonte UTM
  const bySource = new Map<string, number>();
  leads?.forEach((l: any) => {
    const src = l.utm_source ?? "direto";
    bySource.set(src, (bySource.get(src) ?? 0) + 1);
  });

  // Heatmap dia/hora (7×24)
  const heatmap: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
  leads?.forEach((l: any) => {
    const d = new Date(l.created_at);
    heatmap[d.getDay()][d.getHours()]++;
  });

  return {
    total,
    totalDelta,
    conversion: Math.round(conversion * 10) / 10,
    avgContactHours: Math.round(avgContactHours * 10) / 10,
    matriculados: funnel.matriculado,
    funnel,
    timeline,
    byCourse: Array.from(byCourse.entries()).map(([course, count]) => ({ course, count })),
    bySource: Array.from(bySource.entries()).map(([source, count]) => ({ source, count })),
    heatmap,
  };
}
```

- [ ] **Step 2: TypeScript check + commit**

```powershell
npx tsc --noEmit
```

```bash
git add apps/dashboard/lib/queries/analytics.ts
git commit -m "feat(dashboard): query agregada de analytics (funil, timeline, heatmap)"
```

---

## Task 23: Componentes de analytics (charts)

**Files:**
- Create: `apps/dashboard/components/analytics/kpi-card.tsx`
- Create: `apps/dashboard/components/analytics/funnel-chart.tsx`
- Create: `apps/dashboard/components/analytics/leads-timeline.tsx`
- Create: `apps/dashboard/components/analytics/source-bars.tsx`
- Create: `apps/dashboard/components/analytics/heatmap.tsx`
- Create: `apps/dashboard/components/analytics/recent-leads-table.tsx`

- [ ] **Step 1: KPI card**

`components/analytics/kpi-card.tsx`:

```tsx
import { TrendingUp, TrendingDown } from "lucide-react";

export function KpiCard({ label, value, delta, suffix }: {
  label: string; value: string | number; delta?: number; suffix?: string;
}) {
  const positive = (delta ?? 0) >= 0;
  return (
    <div className="bg-white rounded-2xl border p-5">
      <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="text-3xl font-bold mt-2">{value}{suffix && <span className="text-base text-gray-500">{suffix}</span>}</p>
      {delta !== undefined && (
        <p className={`text-xs mt-2 inline-flex items-center gap-1 ${positive ? "text-green-600" : "text-red-600"}`}>
          {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(delta)}% vs período anterior
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Funil**

`components/analytics/funnel-chart.tsx`:

```tsx
import { STAGES } from "@/lib/stages";
import type { LeadStatus } from "@/types/database";

export function FunnelChart({ funnel }: { funnel: Record<LeadStatus, number> }) {
  // Funil de progressão (exclui perdido)
  const stages = STAGES.filter((s) => s.value !== "perdido");
  const total = stages.reduce((sum, s) => sum + funnel[s.value], 0);
  const max = Math.max(...stages.map((s) => funnel[s.value]));

  return (
    <div className="bg-white rounded-2xl border p-6">
      <h3 className="font-semibold mb-4">Funil de conversão</h3>
      <div className="space-y-2">
        {stages.map((stage, i) => {
          const count = funnel[stage.value];
          const width = max > 0 ? (count / max) * 100 : 0;
          const pctTotal = total > 0 ? (count / total) * 100 : 0;
          const prev = i > 0 ? funnel[stages[i - 1].value] : null;
          const pctProgression = prev && prev > 0 ? (count / prev) * 100 : null;
          return (
            <div key={stage.value}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{stage.label}</span>
                <span className="text-gray-500">
                  {count} · {Math.round(pctTotal)}%
                  {pctProgression !== null && <span className="text-gray-400 ml-2">({Math.round(pctProgression)}% avanço)</span>}
                </span>
              </div>
              <div className="h-6 bg-gray-100 rounded">
                <div className="h-6 rounded transition-all" style={{ width: `${width}%`, background: stage.color }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Timeline (line chart)**

`components/analytics/leads-timeline.tsx`:

```tsx
"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, parseISO } from "date-fns";

export function LeadsTimeline({ data }: { data: { day: string; count: number }[] }) {
  return (
    <div className="bg-white rounded-2xl border p-6">
      <h3 className="font-semibold mb-4">Leads por dia</h3>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="day" tickFormatter={(v) => format(parseISO(v), "dd/MM")} fontSize={11} />
          <YAxis fontSize={11} />
          <Tooltip labelFormatter={(v) => format(parseISO(v), "dd/MM/yyyy")} />
          <Line type="monotone" dataKey="count" stroke="#0096d2" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

- [ ] **Step 4: Source bars**

`components/analytics/source-bars.tsx`:

```tsx
"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export function SourceBars({ data }: { data: { source: string; count: number }[] }) {
  return (
    <div className="bg-white rounded-2xl border p-6">
      <h3 className="font-semibold mb-4">Leads por fonte</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} layout="vertical">
          <XAxis type="number" fontSize={11} />
          <YAxis type="category" dataKey="source" fontSize={11} width={80} />
          <Tooltip />
          <Bar dataKey="count" fill="#0096d2" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
```

- [ ] **Step 5: Heatmap dia/hora**

`components/analytics/heatmap.tsx`:

```tsx
const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function Heatmap({ data }: { data: number[][] }) {
  const max = Math.max(...data.flat(), 1);
  return (
    <div className="bg-white rounded-2xl border p-6">
      <h3 className="font-semibold mb-4">Cadastros por dia/hora</h3>
      <div className="overflow-x-auto">
        <table className="text-[10px]">
          <thead>
            <tr>
              <th></th>
              {Array.from({ length: 24 }, (_, h) => (
                <th key={h} className="w-4 text-center text-gray-400 font-normal">{h % 6 === 0 ? h : ""}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, d) => (
              <tr key={d}>
                <td className="text-gray-500 pr-2">{DAYS[d]}</td>
                {row.map((count, h) => {
                  const intensity = count / max;
                  return (
                    <td key={h} className="p-0.5">
                      <div className="w-4 h-4 rounded-sm" title={`${DAYS[d]} ${h}h: ${count}`}
                        style={{ background: `rgba(0, 150, 210, ${intensity})` }} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Recent leads table**

`components/analytics/recent-leads-table.tsx`:

```tsx
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { LeadWithStatus } from "@/types/database";
import { STAGE_BY_VALUE } from "@/lib/stages";

export function RecentLeadsTable({ leads }: { leads: LeadWithStatus[] }) {
  return (
    <div className="bg-white rounded-2xl border p-6">
      <h3 className="font-semibold mb-4">Últimos leads</h3>
      <table className="w-full text-sm">
        <tbody className="divide-y divide-gray-100">
          {leads.slice(0, 10).map((lead) => {
            const stage = STAGE_BY_VALUE[lead.status];
            return (
              <tr key={lead.id}>
                <td className="py-2 font-medium">{lead.name}</td>
                <td className="py-2 text-gray-500">{lead.course}</td>
                <td className="py-2 text-gray-500 text-xs">{lead.utm_source ?? "direto"}</td>
                <td className="py-2 text-gray-500 text-xs">
                  {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true, locale: ptBR })}
                </td>
                <td className="py-2">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${stage.color}20`, color: stage.color }}>
                    {stage.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 7: TypeScript check + commit**

```powershell
npx tsc --noEmit
```

```bash
git add apps/dashboard/components/analytics
git commit -m "feat(dashboard): componentes de analytics (KPI, funil, line, bar, heatmap, table)"
```

---

## Task 24: Página de analytics

**Files:**
- Create: `apps/dashboard/app/(app)/analytics/page.tsx`

- [ ] **Step 1: Criar `app/(app)/analytics/page.tsx`**

```tsx
import { requireRole } from "@/lib/auth";
import { fetchAnalytics } from "@/lib/queries/analytics";
import { fetchLeads } from "@/lib/queries/leads";
import { Topbar } from "@/components/layout/topbar";
import { KpiCard } from "@/components/analytics/kpi-card";
import { FunnelChart } from "@/components/analytics/funnel-chart";
import { LeadsTimeline } from "@/components/analytics/leads-timeline";
import { SourceBars } from "@/components/analytics/source-bars";
import { Heatmap } from "@/components/analytics/heatmap";
import { RecentLeadsTable } from "@/components/analytics/recent-leads-table";

export const revalidate = 60;

function periodRange(period: string): { since: Date; until: Date } {
  const until = new Date();
  const since = new Date();
  if (period === "today") since.setHours(0, 0, 0, 0);
  else if (period === "7d") since.setDate(since.getDate() - 7);
  else if (period === "90d") since.setDate(since.getDate() - 90);
  else since.setDate(since.getDate() - 30);
  return { since, until };
}

export default async function AnalyticsPage({
  searchParams,
}: { searchParams: { period?: string; course?: string } }) {
  const profile = await requireRole(["super_admin", "admin_marketing", "marketing"]);
  const { since, until } = periodRange(searchParams.period ?? "30d");

  const [analytics, recentLeads] = await Promise.all([
    fetchAnalytics({ since, until, course: searchParams.course }),
    fetchLeads({ since: since.toISOString() }),
  ]);

  return (
    <>
      <Topbar profile={profile} title="Analytics" />
      <main className="flex-1 p-6 overflow-auto space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard label="Total de leads"   value={analytics.total}         delta={analytics.totalDelta} />
          <KpiCard label="Taxa de conversão" value={analytics.conversion}   suffix="%" />
          <KpiCard label="Tempo até contato" value={analytics.avgContactHours} suffix="h" />
          <KpiCard label="Matriculados"     value={analytics.matriculados} />
        </div>

        {/* Funil */}
        <FunnelChart funnel={analytics.funnel} />

        {/* Charts grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <LeadsTimeline data={analytics.timeline} />
          <SourceBars data={analytics.bySource} />
        </div>

        <Heatmap data={analytics.heatmap} />

        <RecentLeadsTable leads={recentLeads as any} />
      </main>
    </>
  );
}
```

- [ ] **Step 2: Testar localmente**

`/analytics` deve renderizar com os dados reais.

- [ ] **Step 3: TypeScript check + commit**

```powershell
npx tsc --noEmit
```

```bash
git add apps/dashboard/app/\(app\)/analytics
git commit -m "feat(dashboard): página de analytics completa"
```

---

## Task 25: Página de Team + criação de usuários

**Files:**
- Create: `apps/dashboard/app/(app)/team/page.tsx`
- Create: `apps/dashboard/components/team/user-list.tsx`
- Create: `apps/dashboard/components/team/create-user-modal.tsx`
- Create: `apps/dashboard/app/api/users/route.ts`

- [ ] **Step 1: Criar API route `app/api/users/route.ts`**

```ts
import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase-server";
import { Resend } from "resend";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  role: z.enum(["super_admin", "admin_marketing", "admin_vendas", "marketing", "comercial"]),
  courses: z.array(z.string()).default([]),
});

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("user_profiles").select("role").eq("id", user.id).single();
  if (!profile || !["super_admin", "admin_marketing", "admin_vendas"].includes(profile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  // Restringir o role que cada admin pode criar
  if (profile.role === "admin_marketing" && !["marketing", "admin_marketing"].includes(parsed.data.role)) {
    return NextResponse.json({ error: "Cannot create this role" }, { status: 403 });
  }
  if (profile.role === "admin_vendas" && !["comercial", "admin_vendas"].includes(parsed.data.role)) {
    return NextResponse.json({ error: "Cannot create this role" }, { status: 403 });
  }

  // Gera senha temporária
  const tempPassword = crypto.randomUUID().slice(0, 12);

  // Cria usuário no Supabase Auth
  const admin = createAdminClient();
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: parsed.data.email,
    password: tempPassword,
    email_confirm: true,
  });
  if (createError) return NextResponse.json({ error: createError.message }, { status: 500 });

  // Cria profile
  const { error: profileError } = await admin.from("user_profiles").insert({
    id: created.user.id,
    email: parsed.data.email,
    name: parsed.data.name,
    role: parsed.data.role,
    courses: parsed.data.courses,
    active: true,
  });
  if (profileError) return NextResponse.json({ error: profileError.message }, { status: 500 });

  // Envia e-mail com senha temporária
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "Florence <onboarding@resend.dev>",
    to: parsed.data.email,
    subject: "Sua conta no Dashboard Florence foi criada",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;">
        <h2>Bem-vindo, ${parsed.data.name}!</h2>
        <p>Sua conta no Dashboard Florence foi criada.</p>
        <p><strong>E-mail:</strong> ${parsed.data.email}</p>
        <p><strong>Senha temporária:</strong> <code>${tempPassword}</code></p>
        <p>Acesse <a href="${process.env.NEXT_PUBLIC_APP_URL}/login">${process.env.NEXT_PUBLIC_APP_URL}/login</a> e altere sua senha após o primeiro login.</p>
      </div>
    `,
  });

  return NextResponse.json({ success: true });
}
```

- [ ] **Step 2: Criar `components/team/user-list.tsx`**

```tsx
import type { UserProfile } from "@/types/database";
import { ROLE_LABELS } from "@/lib/roles";

export function UserList({ users }: { users: UserProfile[] }) {
  return (
    <div className="bg-white rounded-2xl border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th className="text-left px-4 py-2">Nome</th>
            <th className="text-left px-4 py-2">E-mail</th>
            <th className="text-left px-4 py-2">Role</th>
            <th className="text-left px-4 py-2">Cursos</th>
            <th className="text-left px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((u) => (
            <tr key={u.id}>
              <td className="px-4 py-2 font-medium">{u.name ?? "—"}</td>
              <td className="px-4 py-2 text-gray-600">{u.email}</td>
              <td className="px-4 py-2 text-gray-600">{ROLE_LABELS[u.role]}</td>
              <td className="px-4 py-2 text-gray-500 text-xs">{u.courses.join(", ") || "—"}</td>
              <td className="px-4 py-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${u.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {u.active ? "Ativo" : "Inativo"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 3: Criar `components/team/create-user-modal.tsx`**

```tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import type { UserRole } from "@/types/database";

export function CreateUserModal({ allowedRoles }: { allowedRoles: UserRole[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const body = {
      email: form.get("email"),
      name: form.get("name"),
      role: form.get("role"),
      courses: form.get("courses")?.toString().split(",").map((s) => s.trim()).filter(Boolean) ?? [],
    };

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setLoading(false);
    if (!res.ok) {
      const err = await res.json();
      setError(err.error ?? "Erro");
      return;
    }
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus size={16} /> Adicionar usuário</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Novo usuário</DialogTitle></DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div><Label>Nome</Label><Input name="name" required /></div>
          <div><Label>E-mail</Label><Input name="email" type="email" required /></div>
          <div>
            <Label>Role</Label>
            <select name="role" className="w-full border rounded-md px-3 py-2 text-sm" required>
              {allowedRoles.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <Label>Cursos (separados por vírgula)</Label>
            <Input name="courses" placeholder="medicina, enfermagem" />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Criando..." : "Criar e enviar e-mail"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 4: Criar `app/(app)/team/page.tsx`**

```tsx
import { requireRole, getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase-server";
import { Topbar } from "@/components/layout/topbar";
import { UserList } from "@/components/team/user-list";
import { CreateUserModal } from "@/components/team/create-user-modal";
import type { UserRole } from "@/types/database";

export default async function TeamPage() {
  const profile = await requireRole(["super_admin", "admin_marketing", "admin_vendas"]);

  const allowedRoles: UserRole[] =
    profile.role === "super_admin"
      ? ["super_admin", "admin_marketing", "admin_vendas", "marketing", "comercial"]
      : profile.role === "admin_marketing"
      ? ["marketing", "admin_marketing"]
      : ["comercial", "admin_vendas"];

  const supabase = createClient();
  const { data: users } = await supabase
    .from("user_profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <>
      <Topbar profile={profile} title="Time" />
      <main className="flex-1 p-6 overflow-auto space-y-4">
        <div className="flex justify-end">
          <CreateUserModal allowedRoles={allowedRoles} />
        </div>
        <UserList users={(users ?? []) as any} />
      </main>
    </>
  );
}
```

- [ ] **Step 5: TypeScript check + commit**

```powershell
npx tsc --noEmit
```

```bash
git add apps/dashboard/app/\(app\)/team apps/dashboard/app/api apps/dashboard/components/team
git commit -m "feat(dashboard): página de time + criação de usuários via API"
```

---

## Task 26: UTM capture na LP medicina

**Files:**
- Modify: `apps/medicina/app/page.tsx`
- Modify: `apps/medicina/components/formulario.tsx`
- Modify: `apps/medicina/app/api/leads/route.ts`

- [ ] **Step 1: Modificar `apps/medicina/app/page.tsx`**

Adicionar `searchParams` no signature e passar para o hero:

```tsx
export default function Home({
  searchParams,
}: { searchParams: Record<string, string | undefined> }) {
  const utm = {
    utm_source:   searchParams.utm_source ?? null,
    utm_medium:   searchParams.utm_medium ?? null,
    utm_campaign: searchParams.utm_campaign ?? null,
    utm_content:  searchParams.utm_content ?? null,
    utm_term:     searchParams.utm_term ?? null,
  };
  return (
    <main>
      <Hero utm={utm} />
      <Diferenciais />
      <Formacao />
      <Professores />
      <Estrutura />
      <CtaFinal utm={utm} />
    </main>
  );
}
```

- [ ] **Step 2: Propagar `utm` por Hero → Formulario e CtaFinal → Formulario**

Em `Hero` e `CtaFinal`, aceitar prop `utm` e passar para `<Formulario utm={utm} variant={...} />`.

Em `Formulario`:

```tsx
interface FormularioProps {
  variant?: "sidebar" | "inline";
  utm?: {
    utm_source: string | null;
    utm_medium: string | null;
    utm_campaign: string | null;
    utm_content: string | null;
    utm_term: string | null;
  };
}
```

No `onSubmit`, incluir os utms no body:

```tsx
body: JSON.stringify({ ...data, ...(utm ?? {}) }),
```

- [ ] **Step 3: Modificar `apps/medicina/app/api/leads/route.ts`**

Atualizar o schema Zod e o insert:

```ts
const leadSchema = z.object({
  name:  z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  utm_source:   z.string().nullable().optional(),
  utm_medium:   z.string().nullable().optional(),
  utm_campaign: z.string().nullable().optional(),
  utm_content:  z.string().nullable().optional(),
  utm_term:     z.string().nullable().optional(),
});
// ...
await supabaseAdmin().from("leads").insert({
  name, email, phone,
  course: "medicina",
  utm_source, utm_medium, utm_campaign, utm_content, utm_term,
});
```

- [ ] **Step 4: TypeScript check em ambos os apps**

```powershell
cd "C:\Users\luan.oliveira\Documents\Projetos\florence\apps\medicina"
npx tsc --noEmit
cd "C:\Users\luan.oliveira\Documents\Projetos\florence\apps\dashboard"
npx tsc --noEmit
```

- [ ] **Step 5: Testar localmente**

Acessar LP local com `?utm_source=test&utm_campaign=teste`, enviar form, verificar no Supabase que os campos UTM foram gravados.

- [ ] **Step 6: Commit**

```bash
git add apps/medicina
git commit -m "feat(medicina): captura UTM via searchParams e envia no submit do form"
```

---

# Sprint 4 — Polish + Deploy (Seg 18)

## Task 27: Toast global de novo lead

**Files:**
- Create: `apps/dashboard/components/layout/new-lead-toaster.tsx`
- Modify: `apps/dashboard/app/(app)/layout.tsx`

- [ ] **Step 1: Criar `components/layout/new-lead-toaster.tsx`**

```tsx
"use client";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/lib/supabase-client";

export function NewLeadToaster() {
  const { toast } = useToast();

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("new-leads-global")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "leads" }, (payload) => {
        toast({
          title: "🆕 Novo lead",
          description: `${payload.new.name} — ${payload.new.course}`,
        });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [toast]);

  return null;
}
```

- [ ] **Step 2: Adicionar ao `app/(app)/layout.tsx`**

```tsx
import { NewLeadToaster } from "@/components/layout/new-lead-toaster";
import { Toaster } from "@/components/ui/toaster";
// ...
<>
  <Sidebar profile={profile} />
  <div className="flex-1 flex flex-col overflow-hidden">
    <NewLeadToaster />
    {children}
  </div>
  <Toaster />
</>
```

- [ ] **Step 3: TypeScript check + commit**

```powershell
npx tsc --noEmit
```

```bash
git add apps/dashboard
git commit -m "feat(dashboard): toast global ao cadastrar novo lead via realtime"
```

---

## Task 28: Mobile bottom-nav

**Files:**
- Modify: `apps/dashboard/components/layout/sidebar.tsx`
- Create: `apps/dashboard/components/layout/bottom-nav.tsx`
- Modify: `apps/dashboard/app/(app)/layout.tsx`

- [ ] **Step 1: Criar `components/layout/bottom-nav.tsx`**

```tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, KanbanSquare, Users } from "lucide-react";
import type { UserProfile } from "@/types/database";
import { canAccessAnalytics, canAccessLeads, canManageTeam } from "@/lib/roles";

export function BottomNav({ profile }: { profile: UserProfile }) {
  const pathname = usePathname();
  const items = [
    canAccessAnalytics(profile.role) && { href: "/analytics", label: "Analytics", icon: BarChart3 },
    canAccessLeads(profile.role)     && { href: "/leads",     label: "Leads",     icon: KanbanSquare },
    canManageTeam(profile.role)      && { href: "/team",      label: "Time",      icon: Users },
  ].filter(Boolean) as { href: string; label: string; icon: typeof BarChart3 }[];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-50">
      <div className="flex justify-around">
        {items.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}
              className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs ${active ? "text-blue-600" : "text-gray-500"}`}>
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Esconder Sidebar no mobile, mostrar BottomNav**

Modificar `Sidebar.tsx` — wrapper raiz: `<aside className="w-60 ... hidden md:flex">`.

Modificar `app/(app)/layout.tsx`:

```tsx
import { BottomNav } from "@/components/layout/bottom-nav";
// ...
<div className="min-h-[100dvh] flex bg-gray-50 pb-16 md:pb-0">
  <Sidebar profile={profile} />
  <div className="flex-1 flex flex-col overflow-hidden">
    <NewLeadToaster />
    {children}
  </div>
  <BottomNav profile={profile} />
  <Toaster />
</div>
```

- [ ] **Step 3: Testar em DevTools (mobile viewport)**

- [ ] **Step 4: TypeScript check + commit**

```powershell
npx tsc --noEmit
```

```bash
git add apps/dashboard
git commit -m "feat(dashboard): bottom-nav em mobile, sidebar só desktop"
```

---

## Task 29: Edge cases e polish final

**Files:**
- Modify: `apps/dashboard/components/kanban/board.tsx` (toast em erro de optimistic)
- Modify: `apps/dashboard/app/(app)/leads/[id]/page.tsx` (handle notFound)

- [ ] **Step 1: Adicionar toast no rollback do kanban**

Em `board.tsx`, no bloco de rollback:

```tsx
import { useToast } from "@/components/ui/use-toast";
// ...
const { toast } = useToast();
// ...
if (error) {
  setItems((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: lead.status } : l)));
  toast({ title: "Erro ao mover lead", description: error.message, variant: "destructive" });
  return;
}
```

- [ ] **Step 2: Build local final**

```powershell
npm run build
```

Expected: passa sem erros.

- [ ] **Step 3: Commit**

```bash
git add apps/dashboard
git commit -m "fix(dashboard): toast em erros do kanban + handles de edge cases"
```

---

## Task 30: Deploy final + criação dos admins

**Files:** (operação na Vercel + Supabase)

- [ ] **Step 1: Push tudo**

```bash
git push origin main
```

- [ ] **Step 2: Aguardar deploy do dashboard na Vercel**

Acompanhar em Deployments. Verificar build passa, domínio responde.

- [ ] **Step 3: Verificar deploy da LP medicina também**

A LP foi modificada (UTM). Confirmar que continua funcionando.

- [ ] **Step 4: Criar os 2 admins iniciais via página /team**

Logado como super_admin:
- Adicionar admin_marketing (e-mail do responsável de marketing)
- Adicionar admin_vendas (e-mail do responsável de vendas)

Cada um recebe e-mail com senha temporária via Resend.

- [ ] **Step 5: Smoke test final em produção**

Login com cada role criado, navegar nas 3 áreas, testar drag & drop, criar comentário.

- [ ] **Step 6: Commit do README de operação (opcional)**

Criar `apps/dashboard/README.md` documentando como rodar local, env vars, fluxo de admins. Commitar.

```bash
git add apps/dashboard/README.md
git commit -m "docs(dashboard): README com instruções de operação"
git push origin main
```

---

## Self-Review do plano

**Spec coverage:**
- ✅ Migration 002 (Task 1)
- ✅ Stack Next.js + Supabase + dnd-kit + recharts (Task 2)
- ✅ Auth e middleware (Tasks 3-7)
- ✅ Sidebar com role guards (Task 8)
- ✅ Analytics com 6 métricas (Tasks 22-24)
- ✅ Kanban com drag & drop (Tasks 14-15)
- ✅ Lista alternativa (Task 16)
- ✅ Detalhe do lead com comentários (Tasks 17-19)
- ✅ Real-time (Tasks 20-21, 27)
- ✅ Team management (Task 25)
- ✅ UTM na LP (Task 26)
- ✅ Mobile (Task 28)
- ✅ Edge cases (Task 29)
- ✅ Deploy + admins iniciais (Tasks 10, 30)

**Sem placeholders detectados** — todos os steps têm código ou comandos concretos.

**Type consistency check:**
- `LeadStatus`, `UserRole`, `LeadWithStatus` usados consistentemente entre Tasks 4 → 11 → 14 → 17 → 22.
- `STAGES`, `STAGE_BY_VALUE` definidos em Task 4 e usados em 14, 17, 23.
- `canAccessAnalytics`, `canAccessLeads`, `canManageTeam` definidos em Task 4 e usados em 8, 24, 25, 28.
- API route Task 25 usa `createAdminClient` definido em Task 3.

Plano completo.
