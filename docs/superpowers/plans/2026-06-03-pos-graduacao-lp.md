# LP "Pós-graduação" — Implementation Plan (clone + adapt)

> Executar com subagent-driven-development. Build local apenas, sem push/deploy. Autor: ascom@florence.edu.br.

**Goal:** LP guarda-chuva de pós-graduação (`apps/pos-graduacao`) clonando o molde de `apps/graduacao` e adaptando conteúdo + 2 seções + copy + imagens + slug.

**Spec:** `docs/superpowers/specs/2026-06-03-pos-graduacao-lp-design.md`

**Verificação:** sem testes (padrão das LPs). `npm run build -w pos-graduacao` + tsc + smoke manual.

---

## Task 1: Clonar o app + ajustar configs

**Files:** criar `apps/pos-graduacao/` a partir de `apps/graduacao/`.

- [ ] Copiar a árvore de `apps/graduacao` para `apps/pos-graduacao` EXCETO: `.next/`, `node_modules/`, `.env.local`, `content/graduacao.ts`, `public/images/`. Incluir: todos os configs (package.json, tsconfig, tailwind.config, next.config, postcss, .eslintrc, .gitignore, next-env.d.ts, vercel.json, .env.local.example), `app/` (layout, page, obrigado, api), `components/` (curso-card, curso-modal, curso-interesse-context, sections/*), `app/globals.css`.
- [ ] `package.json`: trocar `"name": "graduacao"` → `"name": "pos-graduacao"`.
- [ ] `.env.local.example`: `NEXT_PUBLIC_LP_SLUG=pos-graduacao`, `LP_DISPLAY_NAME=Pós Florence`.
- [ ] Criar `apps/pos-graduacao/.env.local` copiando as credenciais de `apps/graduacao/.env.local` mas com `NEXT_PUBLIC_LP_SLUG=pos-graduacao` e `LP_DISPLAY_NAME=Pós Florence`. (gitignored — não commitar.)
- [ ] `app/layout.tsx`, `app/page.tsx`, `app/obrigado/page.tsx`: trocar import `@/content/graduacao` → `@/content/pos-graduacao` (o arquivo é criado na Task 2). O resto idêntico.
- [ ] `app/api/leads/route.ts`: trocar os defaults `LP_SLUG`/`LP_DISPLAY_NAME` para `pos-graduacao`/`Pós Florence`.
- [ ] `public/logo.svg` + `app/icon.svg`: copiar de `apps/graduacao/public/logo.svg` e `apps/graduacao/app/icon.svg`.
- [ ] `npm install` na raiz (registra o workspace `pos-graduacao`).
- [ ] Commit: `chore(pos): scaffold do app clonando o molde da graduacao`.

## Task 2: `content/pos-graduacao.ts`

**Files:** criar `apps/pos-graduacao/content/pos-graduacao.ts`.

- [ ] Mesma shape do `content/graduacao.ts` (incluindo `export const cursoOptions`). Trocar:
  - `meta`, `hero` (headline/sub/stats/cta da spec), `prazo.ativo=false`.
  - `formulario`: cta "Quero me especializar", cursoLabel "Curso de interesse", placeholder "Escolha a especialização".
  - `cursos.grupos`: 4 grupos (Saúde, Odontologia, Direito, Estética) com os ~18 cursos da spec. Cada `Curso`: `titulacao:"Especialização"` (ou "Aperfeiçoamento" nos de odonto), `duracao` real (ex: "12 a 24 meses · 360h"), `turnos: []`, `modalidade:"Presencial"`, `resumo`/`descricao`/`diferenciais`/`mercado` = **mock** marcado `// MOCK`, `foto:"/images/cursos/<slug>.jpg"`.
  - `cursos.titulo`/`subtitulo`: header da spec.
  - `diferenciais`: lead "Especialização aplicada à prática." + 2 pontos (professores de excelência; conclusão a partir de 13 meses).
  - `ingresso`: titulo "Sem vestibular.", subtitulo "A inscrição é por análise de documentos.", `formas` = os 4 documentos (Diploma de graduação, Histórico escolar, Documentos pessoais (RG e CPF), Foto 3x4 e comprovante de residência).
  - `financiamento`: titulo "Investimento facilitado.", descricao (corporativo + parcelamento), `itens` = Parcelamento, Corporativo Florence, Florence Fidelidade, Conclusão a partir de 13 meses.
  - `depoimentos.ativo=false` (mock).
  - `ctaFinal`: headline "Dê o próximo passo na sua carreira." + microcopy.
  - `obrigado`: igual graduação (texto genérico).
- [ ] `npx tsc --noEmit` no app (content válido).
- [ ] Commit: `feat(pos): content config com ~18 especializacoes (mock onde falta)`.

## Task 3: Adaptar os textos hardcoded das seções

**Files:** `apps/pos-graduacao/components/sections/{hero,cursos,ingresso,financiamento,depoimentos}.tsx`

As seções são config-driven, mas eyebrows e os títulos de 2 linhas (`<br/>`) são hardcoded no JSX. Ajustar:

- [ ] `hero.tsx`: `alt` da imagem "Estudantes de Pós da Florence"; resto vem do config.
- [ ] `cursos.tsx`: eyebrow "Cursos" → "Especializações"; título 2 linhas `Encontre o<br/>seu curso.` → `Encontre sua<br/>especialização.`
- [ ] `ingresso.tsx`: eyebrow "Ingresso" → "Inscrição"; título `Seis formas<br/>de entrar.` → `Sem vestibular.<br/>Inscrição por análise.` (ou conforme o titulo do config — manter coerente: usar `Sem vestibular,<br/>sem complicação.`)
- [ ] `financiamento.tsx`: eyebrow "Bolsas & Financiamento" → "Investimento"; título `Estudar pode custar menos<br/>do que você imagina.` → `Investimento<br/>facilitado.`
- [ ] `depoimentos.tsx`: título `Quem estuda<br/>na Florence.` → `Quem se especializa<br/>na Florence.`
- [ ] `diferenciais.tsx`: título `Prática desde<br/>o início.` → `Especialização<br/>aplicada à prática.`
- [ ] `npm run build -w pos-graduacao` verde (ou tsc se dev server travar o .next).
- [ ] Commit: `feat(pos): adapta eyebrows e titulos das secoes para pos`.

## Task 4: Imagens temáticas

**Files:** `apps/pos-graduacao/public/images/`

- [ ] Hero de pós (profissionais/aula/laboratório avançado) + ~18 imagens de curso por área (pode reutilizar foto por área quando fizer sentido — ex: várias de odonto compartilham tema dentista, várias de saúde compartilham lab/hospital, variando). Unsplash (livre comercial), `>20KB`, JPEG. Fallback picsum só se necessário.
- [ ] `npm run build -w pos-graduacao` verde.
- [ ] Commit: `feat(pos): imagens tematicas (hero + especializacoes)`.

## Task 5: Scripts root + build final

- [ ] Root `package.json`: adicionar `"dev:pos": "npm run dev -w pos-graduacao"` e `"build:pos": "npm run build -w pos-graduacao"`.
- [ ] `npm run build` (todos workspaces) verde.
- [ ] Commit: `chore: scripts dev/build para pos no root`.
- [ ] **NÃO pushar.** Entregar para o usuário rodar `npm run dev:pos` e revisar.

---

## Self-Review
- Spec coberta: clone (T1), content 18 cursos (T2), 2 seções adaptadas via config + títulos (T2/T3), copy (T2/T3), imagens (T4), slug/metadata (T1/T2). ✓
- Sem placeholders: `// MOCK` intencional; "copiar de graduacao" é fonte explícita.
- Tipos: reusa a shape de `content/graduacao.ts` + `Curso` (de `@/components/curso-modal`), consistente.
