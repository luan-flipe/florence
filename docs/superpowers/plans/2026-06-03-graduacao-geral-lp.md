# LP "Graduação geral" — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir a LP de captação "Graduação geral" da Florence (`apps/graduacao`), página guarda-chuva dos 11 cursos com detalhe in-page, consumindo os pacotes compartilhados do monorepo.

**Architecture:** App Next 14 fino no monorepo npm workspaces, reusando `@florence/config` (preset Tailwind), `@florence/lib` (supabase/submitLead/types) e `@florence/ui` (Formulario, florence-icon, useScrollReveal, scarcity-seal). Conteúdo centralizado em `content/graduacao.ts`. Cursos in-page via `CursoCard` + `CursoModal` (bespoke no app). Form estendido com campo extra "curso de interesse"; leads gravam `lp_slug=graduacao` + `metadata.curso_interesse`.

**Tech Stack:** Next 14 (App Router), TypeScript, Tailwind 3 (preset compartilhado), Supabase, Resend, react-hook-form + zod v4.

**Spec:** `docs/superpowers/specs/2026-06-03-graduacao-geral-lp-design.md`

**Verificação:** o codebase de LPs **não tem framework de testes** (segue o padrão da medicina). Verificação = `npm run build -w graduacao` verde + smoke manual. **Build local apenas — sem push/deploy** (o usuário confere local antes de subir). Autor dos commits: `ascom@florence.edu.br` (config local do repo já setada).

---

## Mapa de arquivos

**Novos — app:**
```
apps/graduacao/package.json, tsconfig.json, tailwind.config.ts, next.config.mjs,
  postcss.config.mjs, .eslintrc.json, .gitignore, .env.local.example, next-env.d.ts,
  vercel.json, README.md
apps/graduacao/app/layout.tsx, page.tsx, globals.css, obrigado/page.tsx
apps/graduacao/app/api/leads/route.ts
apps/graduacao/content/graduacao.ts
apps/graduacao/components/curso-card.tsx, curso-modal.tsx
apps/graduacao/components/curso-interesse-context.tsx
apps/graduacao/components/sections/hero.tsx, cursos.tsx, diferenciais.tsx,
  ingresso.tsx, financiamento.tsx, depoimentos.tsx, cta-final.tsx
apps/graduacao/public/images/...  (hero, cursos/<slug>.jpg, etc)
```

**Modificados — pacotes compartilhados:**
```
packages/ui/formulario.tsx        (extraFields + controlled extra values)
packages/lib/lead.ts              (opts.metadata)
packages/lib/types.ts             (ExtraField, LeadInput.metadata? — ver Task 2)
```

**Novos — banco:**
```
supabase/011_add_leads_metadata.sql
```

---

## Task 1: Estender `Formulario` com campos extras (curso de interesse)

**Files:**
- Modify: `packages/ui/formulario.tsx`
- Modify: `packages/lib/types.ts`

- [ ] **Step 1: Adicionar tipos em `packages/lib/types.ts`**

Acrescentar ao final do arquivo:

```ts
/** Campo extra opcional renderizado pelo <Formulario> (ex: curso de interesse). */
export interface ExtraField {
  name: string;
  label: string;
  type: "select";
  options: string[];
  required?: boolean;
  placeholder?: string;
}
```

- [ ] **Step 2: Estender o `Formulario`**

Em `packages/ui/formulario.tsx`, importar o tipo e adicionar props + render. Substituir a interface e o início do componente:

```tsx
import type { FormularioCopy, UtmParams, ExtraField } from "@florence/lib/types";

interface FormularioProps {
  copy: FormularioCopy;
  variant?: "sidebar" | "inline";
  utm?: UtmParams;
  endpoint?: string;
  formId?: string;
  formName?: string;
  /** Campos extras (ex: curso de interesse). Renderizados antes do botao. */
  extraFields?: ExtraField[];
  /** Valores controlados dos campos extras (por name). */
  extraValues?: Record<string, string>;
  /** Callback quando um campo extra muda (name, value). */
  onExtraChange?: (name: string, value: string) => void;
}

export function Formulario({
  copy,
  variant = "sidebar",
  utm,
  endpoint = "/api/leads",
  formId,
  formName,
  extraFields = [],
  extraValues = {},
  onExtraChange,
}: FormularioProps) {
```

- [ ] **Step 3: Validar e enviar os campos extras**

Trocar o corpo do `onSubmit` para incluir os valores extras e validar os obrigatórios. Substituir a função `onSubmit`:

```tsx
  const [extraError, setExtraError] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    // valida campos extras obrigatorios (controlados)
    for (const f of extraFields) {
      if (f.required && !extraValues[f.name]) {
        setExtraError(`Selecione: ${f.label}`);
        return;
      }
    }
    setExtraError(null);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, ...extraValues, ...(utm ?? {}) }),
      });
      if (!res.ok) throw new Error("Erro ao enviar");
      router.push("/obrigado");
    } catch {
      setError("Ocorreu um erro. Tente novamente.");
      setLoading(false);
    }
  };
```

- [ ] **Step 4: Renderizar os selects extras**

Logo antes do `{error && (...)}` no JSX do form, inserir:

```tsx
        {extraFields.map((f) => (
          <div key={f.name}>
            <select
              value={extraValues[f.name] ?? ""}
              onChange={(e) => onExtraChange?.(f.name, e.target.value)}
              className="field-input"
              aria-label={f.label}
            >
              <option value="" disabled>
                {f.placeholder ?? f.label}
              </option>
              {f.options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        ))}
        {extraError && (
          <p className="text-red-600 text-xs mt-1 font-display">{extraError}</p>
        )}
```

- [ ] **Step 5: Build dos workspaces (não quebrar a medicina)**

Run: `npm run build -w medicina`
Expected: `Compiled successfully` (medicina não passa extraFields, comportamento inalterado).

- [ ] **Step 6: Commit**

```bash
git add packages/ui/formulario.tsx packages/lib/types.ts
git commit -m "feat(ui): Formulario aceita campos extras (curso de interesse)"
```

---

## Task 2: `submitLead` grava `metadata` + migração 011

**Files:**
- Modify: `packages/lib/lead.ts`
- Create: `supabase/011_add_leads_metadata.sql`

- [ ] **Step 1: Migração aditiva**

Criar `supabase/011_add_leads_metadata.sql`:

```sql
-- supabase/011_add_leads_metadata.sql
-- Coluna generica para dados extras por LP (ex: curso de interesse na graduacao).
-- Aditiva e nullable: nao afeta a medicina (que nao grava metadata).

alter table leads add column if not exists metadata jsonb default '{}'::jsonb;

notify pgrst, 'reload schema';
```

- [ ] **Step 2: `submitLead` aceita `metadata`**

Em `packages/lib/lead.ts`, na interface `SubmitLeadOptions` adicionar:

```ts
  /** Dados extras especificos da LP (ex: { curso_interesse: "Direito" }). */
  metadata?: Record<string, unknown>;
```

E no `.insert({...})`, adicionar a linha `metadata`:

```ts
    .insert({
      name: input.name,
      email: input.email,
      phone: input.phone,
      lp_slug: opts.lpSlug,
      metadata: opts.metadata ?? {},
      utm_source: input.utm_source ?? null,
      utm_medium: input.utm_medium ?? null,
      utm_campaign: input.utm_campaign ?? null,
      utm_content: input.utm_content ?? null,
      utm_term: input.utm_term ?? null,
    });
```

- [ ] **Step 3: Build medicina (regressão)**

Run: `npm run build -w medicina`
Expected: `Compiled successfully` (medicina chama submitLead sem metadata → `{}`).

- [ ] **Step 4: Commit**

```bash
git add packages/lib/lead.ts supabase/011_add_leads_metadata.sql
git commit -m "feat(leads): submitLead grava metadata jsonb + migration 011"
```

---

## Task 3: Scaffold do app `apps/graduacao`

**Files:**
- Create: todos os arquivos de config do app (lista abaixo)

- [ ] **Step 1: Criar `apps/graduacao/package.json`**

```json
{
  "name": "graduacao",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@florence/config": "*",
    "@florence/lib": "*",
    "@florence/ui": "*",
    "@supabase/supabase-js": "^2.105.4",
    "clsx": "^2.1.1",
    "next": "14.2.35",
    "react": "^18",
    "react-dom": "^18",
    "react-hook-form": "^7.75.0",
    "resend": "^6.12.3",
    "tailwind-merge": "^3.6.0",
    "zod": "^4.4.3"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "critters": "^0.0.23",
    "eslint": "^8",
    "eslint-config-next": "14.2.35",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
```

- [ ] **Step 2: `apps/graduacao/tsconfig.json`**

```json
{
  "extends": "../../packages/config/tsconfig.base.json",
  "compilerOptions": {
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: `apps/graduacao/tailwind.config.ts`**

```ts
import type { Config } from "tailwindcss";
import florencePreset from "../../packages/config/tailwind-preset.js";

const config: Config = {
  presets: [florencePreset as Partial<Config>],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/**/*.{js,ts,jsx,tsx}",
  ],
};
export default config;
```

- [ ] **Step 4: `apps/graduacao/next.config.mjs`**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@florence/lib", "@florence/ui"],
  experimental: { optimizeCss: true },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "**.supabase.co" }],
  },
};
export default nextConfig;
```

- [ ] **Step 5: `apps/graduacao/postcss.config.mjs`**

```js
export default {
  plugins: { tailwindcss: {}, autoprefixer: {} },
};
```

- [ ] **Step 6: `.eslintrc.json`, `.gitignore`, `next-env.d.ts`, `vercel.json`**

`.eslintrc.json`:
```json
{ "extends": "next/core-web-vitals" }
```

`.gitignore`:
```
/.next/
/node_modules
.env.local
*.tsbuildinfo
next-env.d.ts
```

`next-env.d.ts`:
```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
```

`vercel.json` (sem cron por enquanto — keep-alive é só na medicina):
```json
{}
```

- [ ] **Step 7: `apps/graduacao/.env.local.example`**

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
RESEND_API_KEY=re_...
NEXT_PUBLIC_LP_SLUG=graduacao
LP_DISPLAY_NAME=Graduação Florence
NEXT_PUBLIC_GTM_ID=
```

- [ ] **Step 8: `apps/graduacao/app/globals.css`**

Copiar o globals.css da medicina (mesmas classes utilitárias da marca):

```bash
cp apps/medicina/app/globals.css apps/graduacao/app/globals.css
```

- [ ] **Step 9: Registrar workspace e env local**

```bash
cd "C:/Users/luan.oliveira/Documents/Projetos/florence"
cp apps/graduacao/.env.local.example apps/graduacao/.env.local
# editar apps/graduacao/.env.local com as MESMAS credenciais Supabase/Resend da medicina
npm install
```

Expected: symlink `node_modules/graduacao` criado; `@florence/*` resolvidos.

- [ ] **Step 10: Commit (sem .env.local — gitignored)**

```bash
git add apps/graduacao/package.json apps/graduacao/tsconfig.json apps/graduacao/tailwind.config.ts apps/graduacao/next.config.mjs apps/graduacao/postcss.config.mjs apps/graduacao/.eslintrc.json apps/graduacao/.gitignore apps/graduacao/next-env.d.ts apps/graduacao/vercel.json apps/graduacao/.env.local.example apps/graduacao/app/globals.css package-lock.json
git commit -m "chore(graduacao): scaffold do app fino no monorepo"
```

---

## Task 4: `content/graduacao.ts` (config + 11 cursos)

**Files:**
- Create: `apps/graduacao/content/graduacao.ts`

> Conteúdo por curso: usar os dados reais já mapeados (Direito: Bacharelado, 5 anos/10 sem, Matutino/Noturno, Presencial; Enfermagem: 5 anos/10 sem, Presencial, Matutino/Noturno) e preencher os demais a partir das páginas do site florence.edu.br/graduacao/<curso>. **Marcar campos sem fonte com `// MOCK`.** Administração é EAD.

- [ ] **Step 1: Criar o arquivo com a estrutura completa**

```ts
export const config = {
  meta: {
    title: "Graduação no Centro Universitário Florence | 11 cursos em São Luís",
    description:
      "Estude com prática desde o início e corpo docente atuante. 11 cursos de graduação, 6 formas de ingresso, bolsas de até 60%, FIES e ProUni. Inscreva-se.",
  },

  hero: {
    eyebrow: "Graduação · São Luís, MA",
    headline: "Sua carreira começa na prática.",
    subheadline:
      "Graduação no Centro Universitário Florence, com corpo docente atuante e vivência prática desde os primeiros períodos. Onze cursos para você escolher o seu.",
    stats: [
      { value: "11", label: "cursos" },
      { value: "6", label: "formas de ingresso" },
      { value: "60%", label: "em bolsas" },
    ],
  },

  // Urgencia config-driven: ativo=false some sem mexer no layout.
  prazo: { ativo: true, texto: "Inscrições abertas · 2026.2" },

  formulario: {
    titulo: "Dê o primeiro passo.",
    subtitulo: "Escolha seu curso e nosso time de admissões entra em contato.",
    cta: "Quero minha vaga",
    lgpd: "Ao enviar, você autoriza o contato da Florence. Não compartilhamos seus dados.",
    cursoLabel: "Curso de interesse",
    cursoPlaceholder: "Escolha um curso",
  },

  cursos: {
    titulo: "Encontre o seu curso.",
    subtitulo:
      "Onze graduações para construir a carreira que você quer. Clique para conhecer cada uma.",
    grupos: [
      {
        area: "Saúde",
        itens: [
          {
            slug: "enfermagem", nome: "Enfermagem", area: "Saúde",
            titulacao: "Bacharelado", duracao: "5 anos · 10 semestres",
            turnos: ["Matutino", "Noturno"], modalidade: "Presencial",
            resumo: "Formação generalista com prática clínica e foco no SUS.",
            descricao:
              "O curso forma enfermeiros com visão generalista, comprometidos com a realidade social, atuando na promoção, prevenção e reabilitação da saúde nos três níveis de atenção.",
            diferenciais: [
              "Prática clínica desde os primeiros períodos",
              "Formação alinhada ao SUS",
              "Laboratórios e cenários de simulação",
            ],
            mercado: ["Hospitais", "Atenção básica", "Saúde coletiva", "Docência e pesquisa"],
            foto: "/images/cursos/enfermagem.jpg",
          },
          // Biomedicina, Farmacia, Fisioterapia, Medicina, Medicina Veterinaria,
          // Nutricao, Odontologia, Estetica e Cosmetica — mesma shape.
          // Preencher de florence.edu.br/graduacao/<slug>; // MOCK onde faltar.
        ],
      },
      {
        area: "Sociais & Gestão",
        itens: [
          {
            slug: "direito", nome: "Direito", area: "Sociais & Gestão",
            titulacao: "Bacharelado", duracao: "5 anos · 10 semestres",
            turnos: ["Matutino", "Noturno"], modalidade: "Presencial",
            resumo: "Formação humanista e técnica, com prática jurídica real.",
            descricao:
              "Sólida formação humanista e técnico-científica, com Núcleo Integrado de Prática Jurídica e Clínica-Escola, preparando para a advocacia e as carreiras públicas.",
            diferenciais: [
              "Núcleo Integrado de Prática Jurídica",
              "Clínica-Escola",
              "Corpo docente atuante na área",
            ],
            mercado: ["Advocacia", "Magistratura", "Ministério Público", "Defensoria", "Procuradorias"],
            foto: "/images/cursos/direito.jpg",
          },
          {
            slug: "administracao", nome: "Administração (EAD)", area: "Sociais & Gestão",
            titulacao: "Bacharelado", duracao: "Conforme matriz EAD", // MOCK: confirmar
            turnos: ["EAD"], modalidade: "EAD",
            resumo: "Gestão na prática, com flexibilidade do ensino a distância.",
            descricao:
              "Curso de Administração na modalidade EAD da Florence, com foco em gestão, empreendedorismo e visão de mercado.", // MOCK: refinar com a pagina
            diferenciais: ["Flexibilidade EAD", "Visão de mercado", "Corpo docente atuante"], // MOCK
            mercado: ["Gestão", "Empreendedorismo", "Consultoria", "Setor público"],
            foto: "/images/cursos/administracao.jpg",
          },
        ],
      },
    ],
  },

  diferenciais: {
    titulo: "Por que a Florence.",
    lead: {
      titulo: "Prática desde o início.",
      corpo:
        "Laboratórios, clínicas-escola e projetos reais desde os primeiros períodos. Você aprende fazendo, não só assistindo.",
    },
    pontos: [
      {
        titulo: "Corpo docente atuante",
        corpo:
          "Mestres e doutores que trabalham na área que ensinam e trazem o mercado para a sala de aula.",
      },
      {
        titulo: "Estrutura que prepara para o mercado",
        corpo:
          "Ambientes que reproduzem o dia a dia da profissão, para você chegar pronto ao estágio e ao trabalho.",
      },
    ],
  },

  ingresso: {
    titulo: "Seis formas de entrar.",
    subtitulo: "Escolha a que combina com o seu momento.",
    formas: [
      { nome: "Vestibular Digital", descricao: "Prova online, com data e horário flexíveis." },
      { nome: "Vestibular ENEM", descricao: "Use a sua nota do ENEM." },
      { nome: "Histórico Vale Nota", descricao: "Aproveite o seu desempenho escolar." },
      { nome: "Transferência", descricao: "Venha de outra instituição." },
      { nome: "Segunda Graduação", descricao: "Para quem já tem diploma." },
      { nome: "Volte a Estudar", descricao: "Retome os estudos de onde parou." },
    ],
  },

  financiamento: {
    titulo: "Estudar pode custar menos do que você imagina.",
    descricao:
      "Bolsas de até 60%, FIES, ProUni e o programa Corporativo Florence para quem trabalha em empresas parceiras.",
    itens: [
      { nome: "Bolsas até 60%", descricao: "Bolsas especiais limitadas, válidas até o fim do curso." },
      { nome: "FIES", descricao: "Financiamento estudantil do Governo Federal." },
      { nome: "ProUni", descricao: "Bolsas de 50% e 100% para quem se enquadra." },
      { nome: "Corporativo Florence", descricao: "Desconto para funcionários de empresas parceiras." },
    ],
  },

  // Mock/oculto ate o cliente enviar depoimentos reais.
  depoimentos: {
    ativo: false,
    titulo: "Quem estuda na Florence.",
    cards: [
      { nome: "Aluno Florence", turma: "Turma 2024", texto: "Depoimento de exemplo (mock).", foto: "" }, // MOCK
      { nome: "Aluna Florence", turma: "Turma 2023", texto: "Depoimento de exemplo (mock).", foto: "" }, // MOCK
    ],
  },

  ctaFinal: {
    headline: "Sua vaga na Florence está a um passo.",
    microcopy: "Preencha e fale com o nosso time de admissões hoje.",
  },

  obrigado: {
    headline: "Recebemos o seu cadastro!",
    corpo: "Nosso time de admissões vai entrar em contato com você em breve.",
    ctaSecundario: { label: "Conhecer a Florence", href: "https://www.florence.edu.br" },
  },
} as const;

// Lista achatada de nomes de curso para o dropdown do formulario.
export const cursoOptions: string[] = config.cursos.grupos
  .flatMap((g) => g.itens.map((c) => c.nome));
```

- [ ] **Step 2: Validar tipos**

Run: `cd apps/graduacao && npx tsc --noEmit`
Expected: zero erros (arquivo isolado, ainda sem consumidores).

- [ ] **Step 3: Commit**

```bash
git add apps/graduacao/content/graduacao.ts
git commit -m "feat(graduacao): content config com 11 cursos (mock onde falta)"
```

---

## Task 5: `CursoCard` + `CursoModal`

**Files:**
- Create: `apps/graduacao/components/curso-card.tsx`
- Create: `apps/graduacao/components/curso-modal.tsx`

- [ ] **Step 1: `curso-card.tsx`** (baseado no professor-card, campos de curso)

```tsx
"use client";
import Image from "next/image";
import { useState } from "react";

interface CursoCardProps {
  nome: string;
  modalidade: string;
  duracao: string;
  resumo: string;
  foto: string;
  onClick?: () => void;
}

export function CursoCard({ nome, modalidade, duracao, resumo, foto, onClick }: CursoCardProps) {
  const [imgError, setImgError] = useState(false);
  const initials = nome.split(" ").slice(0, 2).map((n) => n[0]).join("");

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Ver detalhes de ${nome}`}
      className="group text-left rounded-2xl overflow-hidden bg-gradient-to-b from-white to-[#f6fafd]
        border border-[#e5eef5] shadow-[0_4px_18px_rgba(0,80,140,0.05)]
        transition-all duration-600 ease-spring hover:-translate-y-1
        hover:shadow-[0_20px_48px_rgba(0,80,140,0.13)] hover:border-[#0096d2]/25
        h-full flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0096d2] focus-visible:ring-offset-2"
    >
      <div className="relative aspect-[4/3] bg-gradient-to-br from-sky-pale to-[#e0f0fa] overflow-hidden">
        {!imgError ? (
          <Image src={foto} alt={nome} fill sizes="(min-width:768px) 33vw, 100vw"
            className="object-cover transition-transform duration-600 ease-spring group-hover:scale-105"
            onError={() => setImgError(true)} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0096d2]/10 to-[#00508c]/20">
            <span className="font-display font-800 text-4xl text-[#0096d2]/40">{initials}</span>
          </div>
        )}
        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/95 border border-gray-200 text-[10px] font-display font-700 text-[#005a82] uppercase tracking-wide">
          {modalidade}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display font-700 text-[#001a2e] text-base leading-snug">{nome}</h3>
        <p className="text-[11px] font-display font-600 text-[#0096d2] mt-0.5">{duracao}</p>
        <p className="text-gray-600 text-sm mt-2 line-clamp-2">{resumo}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-display font-700 text-[#005a82]">
          Ver detalhes
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </span>
      </div>
      <div className="h-0.5 bg-gradient-to-r from-[#0096d2] via-[#00508c] to-[#F5C842] opacity-30 group-hover:opacity-100 transition-opacity duration-400" />
    </button>
  );
}
```

- [ ] **Step 2: `curso-modal.tsx`** (baseado no professor-modal, com CTA que pré-seleciona)

```tsx
"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export interface Curso {
  slug: string; nome: string; area: string; titulacao: string;
  duracao: string; turnos: readonly string[]; modalidade: string;
  resumo: string; descricao: string;
  diferenciais: readonly string[]; mercado: readonly string[]; foto: string;
}

interface CursoModalProps {
  curso: Curso | null;
  onClose: () => void;
  onQuero: (nome: string) => void; // pre-seleciona no form + scroll
}

export function CursoModal({ curso, onClose, onQuero }: CursoModalProps) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!curso) return;
    setImgError(false);
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onEsc); document.body.style.overflow = ""; };
  }, [curso, onClose]);

  if (!curso) return null;
  const initials = curso.nome.split(" ").slice(0, 2).map((n) => n[0]).join("");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#001a2e]/70 backdrop-blur-md animate-[fadeIn_0.3s_cubic-bezier(0.32,0.72,0,1)_forwards]"
      onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="curso-modal-title">
      <div className="relative bg-white rounded-[2rem] w-full max-w-4xl max-h-[92dvh] overflow-hidden shadow-[0_32px_96px_rgba(0,26,46,0.4)] animate-[fadeUp_0.4s_cubic-bezier(0.32,0.72,0,1)_forwards] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Fechar"
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white border border-gray-200 flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-md">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#001a2e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>

        <div className="relative flex-shrink-0 h-56 sm:h-72 md:h-auto md:w-2/5 bg-gradient-to-br from-[#0096d2]/10 to-[#00508c]/20 overflow-hidden">
          {!imgError ? (
            <Image src={curso.foto} alt={curso.nome} fill sizes="(min-width:768px) 40vw, 100vw"
              className="object-cover" onError={() => setImgError(true)} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display font-800 text-7xl text-[#0096d2]/40">{initials}</span>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-7 md:p-8">
          <p className="text-[11px] font-display font-700 text-[#005a82] uppercase tracking-[0.18em] mb-2">{curso.area}</p>
          <h2 id="curso-modal-title" className="font-display font-800 text-[#001a2e] text-2xl md:text-3xl leading-tight mb-3 tracking-tight">{curso.nome}</h2>

          <div className="flex flex-wrap gap-2 mb-5">
            {[curso.titulacao, curso.duracao, curso.modalidade, ...curso.turnos].map((t) => (
              <span key={t} className="px-2.5 py-1 rounded-full bg-[#0096d2]/10 text-[#005a82] text-xs font-display font-600">{t}</span>
            ))}
          </div>

          <p className="text-gray-700 leading-relaxed mb-6 text-sm md:text-base">{curso.descricao}</p>

          {curso.diferenciais.length > 0 && (
            <div className="mb-5">
              <h3 className="text-xs font-display font-700 text-[#001a2e] uppercase tracking-widest mb-3 flex items-center gap-2"><span className="w-1 h-4 bg-[#0096d2] rounded-full" />Diferenciais</h3>
              <ul className="space-y-2">
                {curso.diferenciais.map((d) => (
                  <li key={d} className="flex gap-3 text-sm text-gray-700 leading-relaxed"><span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#0096d2]/50 mt-2" /><span>{d}</span></li>
                ))}
              </ul>
            </div>
          )}

          {curso.mercado.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-display font-700 text-[#001a2e] uppercase tracking-widest mb-3 flex items-center gap-2"><span className="w-1 h-4 bg-[#F5C842] rounded-full" />Mercado de trabalho</h3>
              <div className="flex flex-wrap gap-2">
                {curso.mercado.map((m) => (
                  <span key={m} className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-display font-600">{m}</span>
                ))}
              </div>
            </div>
          )}

          <button type="button" onClick={() => onQuero(curso.nome)}
            className="btn-primary w-full justify-center">
            <span>Quero esse curso</span>
            <span className="btn-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg></span>
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/graduacao/components/curso-card.tsx apps/graduacao/components/curso-modal.tsx
git commit -m "feat(graduacao): CursoCard + CursoModal in-page"
```

---

## Task 6: Contexto de curso de interesse (pré-seleção)

**Files:**
- Create: `apps/graduacao/components/curso-interesse-context.tsx`

- [ ] **Step 1: Provider + hook + scroll helper**

```tsx
"use client";
import { createContext, useContext, useState, useCallback } from "react";

interface Ctx {
  curso: string;
  setCurso: (c: string) => void;
  pickAndScroll: (c: string) => void;
}

const CursoInteresseContext = createContext<Ctx | null>(null);

export function CursoInteresseProvider({ children }: { children: React.ReactNode }) {
  const [curso, setCurso] = useState("");

  const pickAndScroll = useCallback((c: string) => {
    setCurso(c);
    const el = document.getElementById("lead-form");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <CursoInteresseContext.Provider value={{ curso, setCurso, pickAndScroll }}>
      {children}
    </CursoInteresseContext.Provider>
  );
}

export function useCursoInteresse() {
  const ctx = useContext(CursoInteresseContext);
  if (!ctx) throw new Error("useCursoInteresse fora do provider");
  return ctx;
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/graduacao/components/curso-interesse-context.tsx
git commit -m "feat(graduacao): contexto de curso de interesse (pre-selecao + scroll)"
```

---

## Task 7: Seção Hero (form + dropdown + badge de prazo)

**Files:**
- Create: `apps/graduacao/components/sections/hero.tsx`
- Reference: `apps/medicina/components/sections/hero.tsx` (estrutura visual escura)

- [ ] **Step 1: Criar o Hero**

Clonar a estrutura do hero da medicina (orbs, foto de fundo, logo, grid 7/5, stats), trocando o conteúdo por `config.hero`, e injetando o form com `extraFields` + contexto. Pontos-chave do arquivo:

```tsx
"use client";
import Image from "next/image";
import { Formulario } from "@florence/ui/formulario";
import { config, cursoOptions } from "@/content/graduacao";
import { useCursoInteresse } from "@/components/curso-interesse-context";
import type { UtmParams } from "@/app/page";

export function Hero({ utm }: { utm?: UtmParams }) {
  const h = config.hero;
  const { curso, setCurso } = useCursoInteresse();

  return (
    <section className="relative min-h-[100dvh] bg-[#001a2e] text-white overflow-hidden">
      {/* orbs + foto de fundo + gradientes: copiar de apps/medicina/components/sections/hero.tsx
          (trocar /images/hero.jpg pela imagem de graduacao) */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="mb-10 lg:mb-12">
          <Image src="/logo.svg" alt="Centro Universitário Florence" width={240} height={52} className="brightness-0 invert opacity-90" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start lg:items-center">
          <div className="lg:col-span-7 flex flex-col">
            <div className="eyebrow eyebrow-dark mb-5 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5C842] animate-pulse" />
              {h.eyebrow}
            </div>
            <h1 className="headline-xl text-4xl md:text-5xl lg:text-[3.5rem] text-white mb-5 [text-shadow:_0_2px_32px_rgba(0,26,46,0.5)]">{h.headline}</h1>
            <p className="text-white/75 text-base lg:text-lg leading-relaxed max-w-md mb-8 [text-shadow:_0_1px_16px_rgba(0,26,46,0.4)]">{h.subheadline}</p>

            {/* Stat line discreta (NAO hero-metric template) */}
            <div className="flex items-center gap-4 text-sm text-white/70 font-display">
              {h.stats.map((s, i) => (
                <span key={s.label} className="flex items-center gap-2">
                  {i > 0 && <span className="w-1 h-1 rounded-full bg-white/30" />}
                  <span className="font-700 text-[#F5C842]">{s.value}</span> {s.label}
                </span>
              ))}
            </div>

            {config.prazo.ativo && (
              <div className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-[#F5C842]/12 border border-[#F5C842]/25 px-3 py-1.5 text-[#F5C842] text-xs font-display font-700">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F5C842] animate-pulse" />
                {config.prazo.texto}
              </div>
            )}
          </div>

          <div id="lead-form" className="lg:col-span-5 lg:sticky lg:top-8 scroll-mt-8">
            <Formulario
              copy={config.formulario}
              variant="sidebar"
              utm={utm}
              formId="form-hero"
              formName="form-hero"
              extraFields={[{ name: "curso_interesse", label: config.formulario.cursoLabel, type: "select", options: cursoOptions, required: true, placeholder: config.formulario.cursoPlaceholder }]}
              extraValues={{ curso_interesse: curso }}
              onExtraChange={(_, v) => setCurso(v)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
```

> Nota: copiar os blocos de orbs/foto/gradientes do hero da medicina para manter o visual. Usar a imagem de hero de graduação (Task 13/imagens).

- [ ] **Step 2: Commit**

```bash
git add apps/graduacao/components/sections/hero.tsx
git commit -m "feat(graduacao): secao Hero com form + dropdown + badge de prazo"
```

---

## Task 8: Seção Cursos (grid agrupado + modal)

**Files:**
- Create: `apps/graduacao/components/sections/cursos.tsx`

- [ ] **Step 1: Criar a seção**

```tsx
"use client";
import { useState } from "react";
import { config } from "@/content/graduacao";
import { useScrollReveal } from "@florence/ui/use-scroll-reveal";
import { CursoCard } from "@/components/curso-card";
import { CursoModal, type Curso } from "@/components/curso-modal";
import { useCursoInteresse } from "@/components/curso-interesse-context";

export function Cursos() {
  const ref = useScrollReveal<HTMLElement>();
  const { titulo, subtitulo, grupos } = config.cursos;
  const [selected, setSelected] = useState<Curso | null>(null);
  const { pickAndScroll } = useCursoInteresse();

  return (
    <>
      <section ref={ref} className="py-24 lg:py-32 bg-white overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-14 max-w-2xl">
            <div className="eyebrow mb-5 w-fit reveal"><span className="w-1.5 h-1.5 rounded-full bg-[#0096d2]" />Cursos</div>
            <h2 className="headline-lg text-3xl lg:text-5xl text-[#001a2e] reveal reveal-delay-1">{titulo}</h2>
            <p className="text-gray-500 mt-4 reveal reveal-delay-2">{subtitulo}</p>
          </div>

          {grupos.map((grupo) => (
            <div key={grupo.area} className="mb-14 last:mb-0">
              <h3 className="font-display font-700 text-[#0096d2] text-sm uppercase tracking-[0.18em] mb-6 reveal">{grupo.area}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {grupo.itens.map((curso, i) => (
                  <div key={curso.slug} className={`reveal reveal-delay-${(i % 3) + 1}`}>
                    <CursoCard nome={curso.nome} modalidade={curso.modalidade} duracao={curso.duracao} resumo={curso.resumo} foto={curso.foto} onClick={() => setSelected(curso as unknown as Curso)} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <CursoModal curso={selected} onClose={() => setSelected(null)} onQuero={(nome) => { setSelected(null); pickAndScroll(nome); }} />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/graduacao/components/sections/cursos.tsx
git commit -m "feat(graduacao): secao Cursos (grid por area + modal in-page)"
```

---

## Task 9: Seção Diferenciais (editorial, não 3 cards iguais)

**Files:**
- Create: `apps/graduacao/components/sections/diferenciais.tsx`

- [ ] **Step 1: Criar a seção (bloco-líder + pontos de apoio)**

```tsx
"use client";
import { useScrollReveal } from "@florence/ui/use-scroll-reveal";
import { config } from "@/content/graduacao";

export function Diferenciais() {
  const ref = useScrollReveal<HTMLElement>();
  const d = config.diferenciais;

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-[#001a2e] text-white overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Bloco-lider */}
          <div className="reveal">
            <div className="eyebrow eyebrow-dark mb-5 w-fit"><span className="w-1.5 h-1.5 rounded-full bg-[#F5C842]" />{d.titulo}</div>
            <h2 className="headline-lg text-3xl lg:text-5xl text-white mb-5">{d.lead.titulo}</h2>
            <p className="text-white/70 text-lg leading-relaxed max-w-md">{d.lead.corpo}</p>
          </div>
          {/* Pontos de apoio — divididos por linha, sem cards */}
          <div className="divide-y divide-white/10">
            {d.pontos.map((p, i) => (
              <div key={p.titulo} className={`py-6 first:pt-0 reveal reveal-delay-${i + 1}`}>
                <h3 className="font-display font-700 text-xl text-[#F5C842] mb-2">{p.titulo}</h3>
                <p className="text-white/70 leading-relaxed">{p.corpo}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/graduacao/components/sections/diferenciais.tsx
git commit -m "feat(graduacao): secao Diferenciais editorial (sem 3 cards iguais)"
```

---

## Task 10: Seções Ingresso + Financiamento

**Files:**
- Create: `apps/graduacao/components/sections/ingresso.tsx`
- Create: `apps/graduacao/components/sections/financiamento.tsx`

- [ ] **Step 1: `ingresso.tsx` (lista inline, não 6 cards iguais)**

```tsx
"use client";
import { useScrollReveal } from "@florence/ui/use-scroll-reveal";
import { config } from "@/content/graduacao";

export function Ingresso() {
  const ref = useScrollReveal<HTMLElement>();
  const { titulo, subtitulo, formas } = config.ingresso;
  return (
    <section ref={ref} className="py-24 lg:py-32 bg-cream overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <div className="eyebrow mb-5 w-fit reveal"><span className="w-1.5 h-1.5 rounded-full bg-[#0096d2]" />Ingresso</div>
          <h2 className="headline-lg text-3xl lg:text-5xl text-[#001a2e] reveal reveal-delay-1">{titulo}</h2>
          <p className="text-gray-500 mt-4 reveal reveal-delay-2">{subtitulo}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8">
          {formas.map((f, i) => (
            <div key={f.nome} className={`flex gap-4 reveal reveal-delay-${(i % 3) + 1}`}>
              <span className="flex-shrink-0 font-display font-800 text-2xl text-[#0096d2]/30">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-display font-700 text-[#001a2e]">{f.nome}</h3>
                <p className="text-gray-600 text-sm mt-1">{f.descricao}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: `financiamento.tsx`**

```tsx
"use client";
import { useScrollReveal } from "@florence/ui/use-scroll-reveal";
import { config } from "@/content/graduacao";

export function Financiamento() {
  const ref = useScrollReveal<HTMLElement>();
  const { titulo, descricao, itens } = config.financiamento;
  return (
    <section ref={ref} className="py-24 lg:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-2xl mb-12">
          <div className="eyebrow mb-5 w-fit reveal"><span className="w-1.5 h-1.5 rounded-full bg-[#0096d2]" />Bolsas & Financiamento</div>
          <h2 className="headline-lg text-3xl lg:text-4xl text-[#001a2e] reveal reveal-delay-1">{titulo}</h2>
          <p className="text-gray-500 mt-4 reveal reveal-delay-2">{descricao}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {itens.map((it, i) => (
            <div key={it.nome} className={`reveal reveal-delay-${(i % 4) + 1}`}>
              <h3 className="font-display font-800 text-[#0096d2] text-lg">{it.nome}</h3>
              <p className="text-gray-600 text-sm mt-2 leading-relaxed">{it.descricao}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/graduacao/components/sections/ingresso.tsx apps/graduacao/components/sections/financiamento.tsx
git commit -m "feat(graduacao): secoes Ingresso + Financiamento"
```

---

## Task 11: Seção Depoimentos (mock/oculto) + CTA final

**Files:**
- Create: `apps/graduacao/components/sections/depoimentos.tsx`
- Create: `apps/graduacao/components/sections/cta-final.tsx`

- [ ] **Step 1: `depoimentos.tsx` (retorna null se `ativo=false`)**

```tsx
"use client";
import { useScrollReveal } from "@florence/ui/use-scroll-reveal";
import { config } from "@/content/graduacao";

export function Depoimentos() {
  const ref = useScrollReveal<HTMLElement>();
  const d = config.depoimentos;
  if (!d.ativo) return null; // oculto ate conteudo real

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-cream overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="headline-lg text-3xl lg:text-5xl text-[#001a2e] mb-12 reveal">{d.titulo}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {d.cards.map((c, i) => (
            <figure key={i} className={`bg-white rounded-2xl p-7 border border-[#e5eef5] reveal reveal-delay-${i + 1}`}>
              <blockquote className="text-gray-700 leading-relaxed">{c.texto}</blockquote>
              <figcaption className="mt-4 font-display font-700 text-[#001a2e]">{c.nome}<span className="block text-xs font-600 text-gray-500">{c.turma}</span></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: `cta-final.tsx` (clonar da medicina, form inline com extraFields)**

```tsx
"use client";
import { useScrollReveal } from "@florence/ui/use-scroll-reveal";
import { config, cursoOptions } from "@/content/graduacao";
import { Formulario } from "@florence/ui/formulario";
import { useCursoInteresse } from "@/components/curso-interesse-context";
import type { UtmParams } from "@/app/page";

export function CtaFinal({ utm }: { utm?: UtmParams }) {
  const ref = useScrollReveal<HTMLElement>();
  const cta = config.ctaFinal;
  const { curso, setCurso } = useCursoInteresse();

  return (
    <section ref={ref} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#001a2e] via-[#00508c] to-[#0096d2]" />
      <div className="relative z-10 container mx-auto px-4 lg:px-8">
        <div className="max-w-xl mx-auto text-center mb-12">
          <h2 className="headline-lg text-3xl lg:text-5xl text-white mb-4 reveal text-balance">{cta.headline}</h2>
          <p className="text-white/70 text-lg reveal reveal-delay-1">{cta.microcopy}</p>
        </div>
        <div className="max-w-md mx-auto reveal reveal-delay-2">
          <Formulario
            copy={config.formulario}
            variant="inline"
            utm={utm}
            formId="form-cta-final"
            formName="form-cta-final"
            extraFields={[{ name: "curso_interesse", label: config.formulario.cursoLabel, type: "select", options: cursoOptions, required: true, placeholder: config.formulario.cursoPlaceholder }]}
            extraValues={{ curso_interesse: curso }}
            onExtraChange={(_, v) => setCurso(v)}
          />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/graduacao/components/sections/depoimentos.tsx apps/graduacao/components/sections/cta-final.tsx
git commit -m "feat(graduacao): secoes Depoimentos (mock/oculto) + CtaFinal"
```

---

## Task 12: Layout, page, obrigado, API route

**Files:**
- Create: `apps/graduacao/app/layout.tsx`
- Create: `apps/graduacao/app/page.tsx`
- Create: `apps/graduacao/app/obrigado/page.tsx`
- Create: `apps/graduacao/app/api/leads/route.ts`

- [ ] **Step 1: `layout.tsx`** (clonar da medicina: fontes, GTM por env, metadata de config)

Copiar `apps/medicina/app/layout.tsx` trocando o import para `@/content/graduacao`. Mantém: Plus Jakarta + DM Sans, GTM via `process.env.NEXT_PUBLIC_GTM_ID` (guarded), `<head>` preconnect, `<body>` noscript.

- [ ] **Step 2: `page.tsx`** (envolve em provider + compõe seções)

```tsx
import { CursoInteresseProvider } from "@/components/curso-interesse-context";
import { Hero } from "@/components/sections/hero";
import { Cursos } from "@/components/sections/cursos";
import { Diferenciais } from "@/components/sections/diferenciais";
import { Ingresso } from "@/components/sections/ingresso";
import { Financiamento } from "@/components/sections/financiamento";
import { Depoimentos } from "@/components/sections/depoimentos";
import { CtaFinal } from "@/components/sections/cta-final";

export interface UtmParams {
  utm_source: string | null; utm_medium: string | null; utm_campaign: string | null;
  utm_content: string | null; utm_term: string | null;
}

export default function Home({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const utm: UtmParams = {
    utm_source: searchParams.utm_source ?? null, utm_medium: searchParams.utm_medium ?? null,
    utm_campaign: searchParams.utm_campaign ?? null, utm_content: searchParams.utm_content ?? null,
    utm_term: searchParams.utm_term ?? null,
  };
  return (
    <CursoInteresseProvider>
      <main>
        <Hero utm={utm} />
        <Cursos />
        <Diferenciais />
        <Ingresso />
        <Financiamento />
        <Depoimentos />
        <CtaFinal utm={utm} />
      </main>
    </CursoInteresseProvider>
  );
}
```

- [ ] **Step 3: `obrigado/page.tsx`** (clonar da medicina, conteúdo de `config.obrigado`)

Copiar `apps/medicina/app/obrigado/page.tsx`, trocar import para `@/content/graduacao` e usar `config.obrigado`.

- [ ] **Step 4: `app/api/leads/route.ts`**

```ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { submitLead } from "@florence/lib/lead";

const LP_SLUG = process.env.NEXT_PUBLIC_LP_SLUG ?? "graduacao";
const LP_DISPLAY_NAME = process.env.LP_DISPLAY_NAME ?? "Graduação Florence";

const leadSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(8, "Telefone obrigatório"),
  curso_interesse: z.string().optional(),
  utm_source: z.string().nullable().optional(),
  utm_medium: z.string().nullable().optional(),
  utm_campaign: z.string().nullable().optional(),
  utm_content: z.string().nullable().optional(),
  utm_term: z.string().nullable().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }
    const { curso_interesse, ...lead } = parsed.data;
    await submitLead(lead, {
      lpSlug: LP_SLUG,
      displayName: LP_DISPLAY_NAME,
      metadata: curso_interesse ? { curso_interesse } : {},
    });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Lead submission error:", err);
    return NextResponse.json({ error: "Erro ao salvar lead." }, { status: 500 });
  }
}
```

- [ ] **Step 5: Build**

Run: `npm run build -w graduacao`
Expected: `Compiled successfully`. Corrigir qualquer import/typing que aparecer.

- [ ] **Step 6: Commit**

```bash
git add apps/graduacao/app/layout.tsx apps/graduacao/app/page.tsx apps/graduacao/app/obrigado/page.tsx apps/graduacao/app/api/leads/route.ts
git commit -m "feat(graduacao): layout, page, obrigado e API de leads"
```

---

## Task 13: Imagens (Unsplash/Pexels + logo + cursos)

**Files:**
- Create: `apps/graduacao/public/logo.svg` (copiar da medicina)
- Create: `apps/graduacao/public/images/hero.jpg`
- Create: `apps/graduacao/public/images/cursos/<slug>.jpg` (11)

- [ ] **Step 1: Copiar o logo e o favicon/icon da medicina**

```bash
cp apps/medicina/public/logo.svg apps/graduacao/public/logo.svg
# se houver icon.svg/favicon em apps/medicina/app, copiar equivalente
```

- [ ] **Step 2: Baixar imagens livres (Unsplash/Pexels)**

Baixar 1 hero (campus/estudantes, horizontal, >1600px) e 11 imagens de curso (uma por área/curso), salvando em `apps/graduacao/public/images/` e `.../images/cursos/<slug>.jpg`. Usar URLs de download direto do Unsplash (`https://images.unsplash.com/...`) ou Pexels. Otimizar para <500KB cada quando possível.

> Onde a imagem oficial do curso existir no site da Florence, preferir baixá-la. Marcar como provisória as de stock.

- [ ] **Step 3: Build + verificar que as imagens resolvem**

Run: `npm run build -w graduacao`
Expected: sem erro de imagem. (next/image local não quebra build se faltar, mas o card cai no fallback de iniciais — preencher todas para evitar fallback.)

- [ ] **Step 4: Commit**

```bash
git add apps/graduacao/public
git commit -m "feat(graduacao): imagens (hero + cursos) e logo"
```

---

## Task 14: Build final + checklist de smoke local (handoff)

**Files:** nenhum (verificação)

- [ ] **Step 1: Build de todos os workspaces**

Run: `npm run build`
Expected: `graduacao` e `medicina` ambos `Compiled successfully`.

- [ ] **Step 2: Rodar a migração 011 (uma vez, no Supabase)**

No SQL Editor, rodar `supabase/011_add_leads_metadata.sql` (necessário antes de testar o envio de lead, senão o insert com metadata falha — coluna inexistente). Aditiva e segura para a medicina.

- [ ] **Step 3: Checklist de smoke local (para o usuário)**

```bash
npm run dev:graduacao   # adicionar esse script no package.json raiz (ver passo 4)
# abrir http://localhost:3000
```

Conferir:
- Hero escuro com headline, stats, badge de prazo, form com dropdown de curso.
- Grid de cursos por área; clicar num card abre o modal com os dados.
- No modal, "Quero esse curso" fecha o modal, rola pro form e pré-seleciona o curso no dropdown.
- Diferenciais editorial, ingresso (6), financiamento (4), depoimentos oculto (ativo=false).
- Enviar um lead de teste → vai pro /obrigado → conferir no Supabase `lp_slug=graduacao` + `metadata.curso_interesse`.
- Mobile responsivo; paridade de marca com a medicina.

- [ ] **Step 4: Adicionar scripts no `package.json` raiz**

```json
"dev:graduacao": "npm run dev -w graduacao",
"build:graduacao": "npm run build -w graduacao",
```

- [ ] **Step 5: Commit**

```bash
git add package.json
git commit -m "chore: scripts dev/build para graduacao no root"
```

> **NÃO pushar nem deployar.** Entregar para o usuário rodar `npm run dev:graduacao` e revisar local.

---

## Self-Review (contra a spec)

**1. Cobertura da spec:**
- §2 Arquitetura (app fino consumindo pacotes) → Task 3
- §3 Estrutura de seções (7) → Tasks 7-12
- §4 content/graduacao.ts → Task 4
- §5 CursoCard + CursoModal in-page → Task 5
- §6 Form com curso de interesse (extraFields + metadata jsonb) → Tasks 1, 2, 12
- §7 Imagens Unsplash/Pexels → Task 13
- §8 Lead/tracking (lp_slug=graduacao, metadata, GTM, form id/name) → Tasks 12, 7, 11
- §9 Copy sem travessão → Task 4 (config)
- §10 Fora de escopo (depoimentos mock, sem Dynamics) → Task 11 (oculto)
- §11 Verificação (build + smoke + migração 011) → Task 14
- Badge de prazo config-driven → Task 7 (`config.prazo.ativo`)
- Pré-seleção de curso (contexto + scroll) → Tasks 6, 7, 8, 11

**2. Placeholder scan:** os `// MOCK` no content e o "copiar de medicina" nos blocos visuais do hero/layout/obrigado são intencionais (clonagem de estrutura existente, fonte explícita). Sem TBDs vazios.

**3. Type consistency:** `ExtraField` (Task 1) usado em Tasks 7/11; `Curso` (Task 5) usado em Task 8; `extraValues`/`onExtraChange` consistentes entre Formulario (Task 1) e call sites; `metadata` consistente entre submitLead (Task 2) e route (Task 12); `cursoOptions` exportado em Task 4 e usado em 7/11.

---

## Execution Handoff

Plan complete. Como o codebase de LP não tem testes (padrão medicina), a verificação é build + smoke manual. Build **local apenas**, sem push/deploy.
