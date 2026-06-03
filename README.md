# Florence — Landing Pages (monorepo)

Monorepo npm workspaces das landing pages do Centro Universitário Florence.
Cada LP é um app Next.js fino que consome pacotes compartilhados.

## Estrutura

```
apps/
  medicina/          LP de Medicina (carro-chefe, template "curso único")
packages/
  config/  @florence/config   preset Tailwind (tokens da marca) + tsconfig base
  lib/     @florence/lib       supabase clients, submitLead, tipos compartilhados
  ui/      @florence/ui        Formulario (prop-driven), professor-card/modal,
                               florence-icon, scarcity-seal, useScrollReveal
supabase/            migrations + scripts SQL (rodados manual no SQL Editor)
```

Pacotes são consumidos como **source** (sem build step) via `transpilePackages`
no `next.config.mjs` de cada app.

## Desenvolvimento

```bash
npm install                 # na raiz — instala todos os workspaces
npm run dev:medicina        # dev server da LP de medicina
npm run build:medicina      # build de produção
npm run build               # build de todos os apps
```

## Como adicionar uma nova LP

1. Criar `apps/<slug>/` (pode partir de `apps/medicina` como referência).
2. `package.json` com `name: "<slug>"` e deps do app.
3. `tailwind.config.ts` → `presets: [florencePreset]` + `content` incluindo
   `../../packages/ui/**`.
4. `tsconfig.json` → `extends: "@florence/config/tsconfig.base.json"`.
5. `next.config.mjs` → `transpilePackages: ["@florence/lib", "@florence/ui"]`.
6. `content/<slug>.ts` com o config da página.
7. `app/api/leads/route.ts` chamando `submitLead` (copiar de medicina).
8. Env vars: `NEXT_PUBLIC_LP_SLUG`, `LP_DISPLAY_NAME`, `NEXT_PUBLIC_GTM_ID`,
   Supabase + Resend (compartilhados).
9. Seções podem ser compostas livremente — reusar de `@florence/ui` o que
   servir e criar seções bespoke no próprio app (as LPs podem divergir).
10. Novo projeto Vercel com Root Directory = `apps/<slug>` e domínio próprio.

## Env vars (por app)

Ver `apps/<slug>/.env.local.example`. Chaves:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`, `CRON_SECRET`
- `NEXT_PUBLIC_LP_SLUG` (identifica a origem do lead), `LP_DISPLAY_NAME`
- `NEXT_PUBLIC_GTM_ID` (container GTM; vazio = não carrega)

## Banco de leads — rename `course` → `lp_slug`

Os leads gravam o slug da LP de origem. Migração em andamento (zero downtime):

1. **Antes do deploy** do código dual-write: rodar `supabase/007_add_lp_slug.sql`
   (adiciona coluna nullable + backfill). Seguro com a produção rodando.
2. Deploy do código (dual-write: grava `course` + `lp_slug`).
3. **Depois de estável**: `supabase/008_finalize_lp_slug.sql` etapa 1
   (lp_slug NOT NULL, course nullable) + follow-up de código que para de
   escrever `course` + etapa 2 (drop da coluna `course`, irreversível).

> Importante: o `lp_slug` precisa existir no banco **antes** de qualquer deploy
> (inclusive preview) que escreva nele, senão o insert falha.

## Deploy

Cada app é um projeto Vercel separado apontando para `apps/<slug>` como Root
Directory. A Vercel instala workspace-aware a partir da raiz; manter
"Include files outside the root directory in the Build Step" ligado.
