# LP "Técnico" — Spec + Plan (clone + adapt do molde guarda-chuva)

> Executar com subagent-driven. Build local apenas, sem push/deploy. Autor: ascom@florence.edu.br.

**Goal:** LP guarda-chuva dos cursos técnicos da Florence (`apps/tecnico`), clonando o molde de `apps/graduacao` e adaptando conteúdo + copy + 2 seções + imagens + slug. Mesmo padrão das LPs de Graduação e Pós.

**Base:** clonar `apps/graduacao` (as seções são config-driven; eyebrows/títulos hardcoded são reescritos).
**LP slug:** `tecnico`. **Display name:** `Técnico Florence`.

## Deltas (vs graduação/pós)
- Público: quem quer **qualificação técnica e entrada rápida no mercado**.
- Ingresso "Formas de ingresso" → **"Matrícula simples"** (RG/CPF, comprovante de escolaridade, comprovante de residência — sem vestibular).
- "Bolsas & Financiamento" → **"Mensalidade acessível"** (parcelamento, corporativo, condições — sem FIES/ProUni).
- `prazo.ativo=false` (fluxo contínuo).

## Cursos (8, do site, por área)
- **Saúde** (5): Técnico em Enfermagem, Técnico em Estética, Técnico em Análises Clínicas, Técnico em Saúde Bucal, Técnico em Nutrição.
- **Indústria & Tecnologia** (2): Técnico em Eletromecânica, Técnico em Eletrotécnica.
- **Meio Ambiente** (1): Técnico em Meio Ambiente.
- Por curso: `titulacao:"Curso Técnico"`, `duracao` mock (ex: "18 a 24 meses" // MOCK), `turnos: []`, `modalidade:"Presencial"`, resumo/descricao/diferenciais/mercado mock (`// MOCK`), `foto:"/images/cursos/<slug>.jpg"`.

## Copy
- Eyebrow: "Curso Técnico · São Luís, MA"
- Headline: "Uma profissão técnica em menos tempo."
- Subheadline: "Cursos técnicos presenciais em Saúde, Indústria e Meio Ambiente, com prática desde o início para você entrar logo no mercado de trabalho."
- Stats: 8 cursos · presencial · 3 áreas
- CTA: "Quero me matricular"
- Cursos header: "Encontre seu curso técnico." / "Escolha a área e comece a se qualificar."
- Diferenciais: lead "Formação prática para o mercado." + pontos ("Professores que atuam na área"; "Formação rápida e direta ao ponto").
- Matrícula: "Matrícula simples." / "Sem vestibular. Você se matricula com documentos básicos." — itens: Documentos pessoais (RG e CPF), Comprovante de escolaridade, Comprovante de residência, Foto 3x4.
- Investimento: "Mensalidade que cabe no bolso." / "Condições de pagamento flexíveis e o programa Corporativo Florence." — itens: Parcelamento, Corporativo Florence, Florence Fidelidade, Matrícula facilitada.
- CTA final: "Comece a sua qualificação técnica."

## Tasks
1. **Clone + ajustes**: `cp` de `apps/graduacao` → `apps/tecnico` (excluir `.next`, `node_modules`, `.env.local`, `content/graduacao.ts`, `public/images/`). `package.json` name → `tecnico`. `.env.local.example` + `.env.local` (creds da graduacao, `NEXT_PUBLIC_LP_SLUG=tecnico`, `LP_DISPLAY_NAME=Técnico Florence`). Imports `@/content/graduacao` → `@/content/tecnico` (layout/page/obrigado). `api/leads/route.ts` defaults → `tecnico`/`Técnico Florence`. `public/logo.svg` + `app/icon.svg`. `npm install`. Commit `chore(tecnico): scaffold do app clonando o molde da graduacao`.
2. **content/tecnico.ts**: shape igual graduacao + `cursoOptions`. 8 cursos (acima), copy (acima), `ingresso`/`financiamento` adaptados, `prazo.ativo=false`, depoimentos mock/off. Commit `feat(tecnico): content config com 8 cursos tecnicos (mock onde falta)`.
3. **Textos hardcoded das seções**: hero alt; cursos eyebrow "Cursos técnicos" + título `Encontre seu<br/>curso técnico.`; ingresso eyebrow "Matrícula" + título `Matrícula<br/>simples.`; financiamento eyebrow "Investimento" + título `Mensalidade que<br/>cabe no bolso.`; depoimentos `Quem se forma<br/>na Florence.`; diferenciais `Formação prática<br/>para o mercado.`; curso-modal botão "Quero esse curso". Commit `feat(tecnico): adapta eyebrows e titulos das secoes`.
4. **Imagens**: hero (formação técnica/profissional) + 8 imagens de curso temáticas (Unsplash; saúde/indústria/meio ambiente). Commit `feat(tecnico): imagens tematicas (hero + cursos)`.
5. **Scripts root + build final**: `dev:tecnico`/`build:tecnico` no root; `npm run build` (4 apps) verde. Commit `chore: scripts dev/build para tecnico no root`. Sem push.

## Verificação
- `npm run build -w tecnico` + workspaces verdes; tsc limpo; smoke local (`npm run dev:tecnico`).
- Lead de teste → `lp_slug=tecnico` + `metadata.curso_interesse` (coluna `metadata` já existe).
