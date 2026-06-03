# LP "Graduação geral" — Design

**Data:** 2026-06-03
**Status:** Conceito + copy aprovados; aguardando review da spec
**App:** `apps/graduacao` (monorepo florence, consome `@florence/config|lib|ui`)
**LP slug:** `graduacao`

---

## 1. Contexto

Segunda LP da Florence dentro do monorepo. Diferente da de Medicina (curso único, premium), esta é uma **página guarda-chuva** das 11 graduações: Administração (EAD), Biomedicina, Direito, Estética e Cosmética, Enfermagem, Farmácia, Fisioterapia, Medicina, Medicina Veterinária, Nutrição, Odontologia.

**Objetivo:** captação de leads (campanha + perpétua). Visitante descobre o curso e preenche o formulário. **Nenhum curso aponta para fora** (decisão do cliente: não perder o lead) — o detalhe de cada curso abre **dentro da página**.

**Decisões do cliente:**
- Form: nome, e-mail, telefone + **curso de interesse** (dropdown).
- Diferenciais: vivência prática + corpo docente.
- Identidade visual: **mesma da LP de medicina** (escura/premium, marca Florence).
- Conteúdo sem definição (textos/imagens/depoimentos): usar **mock**; imagens de **Unsplash/Pexels** ou do próprio site da Florence.
- Campanha até primeira quinzena de agosto; depois a página é **perpétua** → urgência **config-driven** (liga/desliga sem mexer no layout).

---

## 2. Arquitetura

`apps/graduacao` é um app fino seguindo o recipe do README:
- `tailwind.config.ts` → `presets: [florencePreset]` + content incl. `../../packages/ui/**`
- `tsconfig.json` → `extends ../../packages/config/tsconfig.base.json`
- `next.config.mjs` → `transpilePackages: ["@florence/lib","@florence/ui"]`
- `content/graduacao.ts` → todo o conteúdo da página (config tipado)
- `app/api/leads/route.ts` → usa `submitLead` (`@florence/lib/lead`) com `NEXT_PUBLIC_LP_SLUG=graduacao`
- Próprio projeto Vercel (Root Directory `apps/graduacao`, env própria, domínio próprio)

**Reaproveita de `@florence/ui`:** `Formulario` (estendido, ver §6), `florence-icon`, `useScrollReveal`, `scarcity-seal` (opcional p/ urgência).
**Reaproveita de `@florence/config`:** tokens da marca (cores/fontes/animações).
**Novo, bespoke no app:** `CursoCard`, `CursoModal`, e as seções da página (as LPs podem divergir; não forçamos contrato de seções compartilhado).

---

## 3. Estrutura de seções

Ordem (o grid de cursos sobe logo após o hero, pois "qual curso?" é a intenção principal):

1. **Hero** — eyebrow, headline, subheadline, stat line discreta, badge de prazo (config), e **form sidebar** (com dropdown de curso). Tratamento escuro igual à medicina.
2. **Cursos** — os 11 agrupados por área (**Saúde** e **Sociais & Gestão**), cada card abre **CursoModal** in-page com os dados do curso. Não é um grid de 11 cards idênticos enfileirados: agrupamento + ritmo.
3. **Diferenciais** — vivência prática, corpo docente, estrutura. **Layout editorial/assimétrico** (bloco-líder + pontos de apoio), **não** 3 cards-ícone iguais.
4. **Formas de ingresso** — as 6 vias, tratamento compacto (lista/inline, sem virar 6 cards idênticos).
5. **Bolsas & Financiamento** — até 60%, FIES, ProUni, Corporativo Florence. Quebra de objeção (custo).
6. **Depoimentos** — estrutura pronta, **mock/oculta** até o cliente enviar conteúdo real (sem depoimento falso em produção).
7. **CTA final** + form (variant inline).

> Decisões anti-slop (impeccable + design-taste-frontend): sem fileira de 3 cards idênticos, sem "hero-metric template" de número gigante, sem travessão na copy, modal justificado (não reflexo).

---

## 4. Modelo de conteúdo (`content/graduacao.ts`)

```ts
export const config = {
  meta: { title, description },
  hero: {
    eyebrow: "Graduação · São Luís, MA",
    headline: "Sua carreira começa na prática.",
    subheadline: "...",
    stats: [{ value: "11", label: "cursos" }, { value: "6", label: "formas de ingresso" }, { value: "60%", label: "em bolsas" }],
    cta: "Quero minha vaga",
  },
  prazo: {                       // urgência config-driven
    ativo: true,                 // false = some sem mexer no layout
    texto: "Inscrições abertas · 2026.2",
  },
  cursos: {
    titulo: "Encontre o seu curso.",
    subtitulo: "...",
    grupos: [
      { area: "Saúde", itens: [ /* Curso */ ] },
      { area: "Sociais & Gestão", itens: [ /* Curso */ ] },
    ],
  },
  diferenciais: { /* lead + pontos */ },
  ingresso: { titulo, formas: [{ nome, descricao }] },   // 6 formas
  financiamento: { titulo, descricao, itens: [...] },
  depoimentos: { ativo: false, titulo, cards: [/* mock */] },
  ctaFinal: { headline, microcopy, cta },
  formulario: { titulo, subtitulo, cta, lgpd, cursoLabel, cursoPlaceholder },
};

// Curso:
type Curso = {
  slug: string;          // "direito"
  nome: string;          // "Direito"
  area: string;          // "Saúde" | "Sociais & Gestão"
  titulacao: string;     // "Bacharelado"
  duracao: string;       // "5 anos · 10 semestres"
  turnos: string[];      // ["Matutino", "Noturno"]
  modalidade: string;    // "Presencial" | "EAD"
  resumo: string;        // 1-2 frases p/ o card
  descricao: string;     // parágrafo p/ o modal
  diferenciais: string[];// bullets do modal
  mercado: string[];     // áreas de atuação
  foto: string;          // /images/cursos/<slug>.jpg
};
```

Conteúdo por curso vem das páginas do site (duração, turnos, modalidade, mercado já mapeados para Direito e Enfermagem; restante coletado na implementação). **Mock onde faltar**, marcado com `// MOCK` para troca fácil.

---

## 5. Cursos in-page (CursoCard + CursoModal)

- **CursoCard** (grid): foto, nome, área/badge, resumo curto, indicador de "ver detalhes". Clique → abre modal.
- **CursoModal**: foto + nome + titulação/duração/turnos/modalidade + descrição + diferenciais + mercado de trabalho + **CTA "Quero esse curso"** que rola pro form e **pré-seleciona o curso no dropdown**.
- Padrão herdado do `professor-modal` (ESC/backdrop/scroll-lock), mas com campos de curso. Fica no app (bespoke), não em `@florence/ui`.

Acessibilidade: modal com `role="dialog"`, foco gerenciado, fecha no ESC. Imagens com fallback (iniciais sobre gradiente) como no professor-card.

---

## 6. Formulário com "curso de interesse"

O `Formulario` de `@florence/ui` ganha um prop **opcional e genérico** para campos extras (reutilizável por futuras LPs, sem acoplar a graduação):

```ts
interface ExtraField {
  name: string;
  label: string;
  type: "select";
  options: string[];
  required?: boolean;
}
// Formulario aceita: extraFields?: ExtraField[]; defaultValues?: Record<string,string>
```

- A graduação passa `extraFields={[{ name:"curso_interesse", label:"Curso de interesse", type:"select", options:[...11...], required:true }]}`.
- O valor entra no payload do POST junto com nome/email/telefone/utm.
- O CTA do CursoModal pré-seleciona o curso via `defaultValues`.

**Persistência:** os campos extras vão para uma coluna **`metadata jsonb`** em `leads` (genérica, reutilizável). Migração aditiva:

```sql
-- supabase/011_add_leads_metadata.sql
alter table leads add column if not exists metadata jsonb default '{}'::jsonb;
notify pgrst, 'reload schema';
```

`submitLead` ganha `opts.metadata?: Record<string, unknown>` e grava em `metadata`. A LP de medicina não passa metadata (fica `{}`). Sem dual-write, sem risco (coluna nullable com default).

---

## 7. Imagens

- **Hero + diferenciais + estrutura:** Unsplash/Pexels (uso livre), tema educação/campus/saúde, baixadas para `public/images/`. Sem hotlink (baixar e servir local, como a medicina).
- **Cursos:** preferir as imagens das próprias páginas de curso do site da Florence; onde não houver, Unsplash/Pexels por área.
- Todas otimizadas via `next/image` (já configurado no preset/next.config padrão do app).
- Marcar imagens mock/placeholder para troca quando o cliente enviar oficiais.

---

## 8. Lead / tracking

- `NEXT_PUBLIC_LP_SLUG=graduacao`, `LP_DISPLAY_NAME=Graduação Florence`.
- `lp_slug=graduacao` separa os leads no banco; `metadata.curso_interesse` diz qual curso.
- `NEXT_PUBLIC_GTM_ID` próprio (ou o mesmo container; definir no deploy).
- Forms com `id`/`name` distintos (`form-hero`, `form-cta-final`) como na medicina, para o tracking.
- E-mail de confirmação do `submitLead` reutilizado (best-effort), com `displayName`.

---

## 9. Copy aprovada (sem travessão)

- **Eyebrow:** Graduação · São Luís, MA
- **Headline:** Sua carreira começa na prática.
- **Subheadline:** Graduação no Centro Universitário Florence, com corpo docente atuante e vivência prática desde os primeiros períodos. Onze cursos para você escolher o seu.
- **Stat line:** 11 cursos · 6 formas de ingresso · bolsas de até 60%
- **Badge prazo:** Inscrições abertas · 2026.2
- **Form:** título "Dê o primeiro passo." / subtítulo "Escolha seu curso e nosso time de admissões entra em contato." / CTA "Quero minha vaga" / campo "Curso de interesse"
- **Cursos header:** "Encontre o seu curso." + "Onze graduações para construir a carreira que você quer. Clique para conhecer cada uma."
- **Diferenciais:**
  - Prática desde o início. Laboratórios, clínicas-escola e projetos reais desde os primeiros períodos. Você aprende fazendo, não só assistindo.
  - Corpo docente atuante. Mestres e doutores que trabalham na área que ensinam e trazem o mercado para a sala de aula.
  - Estrutura que prepara para o mercado. Ambientes que reproduzem o dia a dia da profissão, para você chegar pronto ao estágio e ao trabalho.
- **Ingresso header:** "Seis formas de entrar." + "Escolha a que combina com o seu momento." (Vestibular Digital, ENEM, Histórico Vale Nota, Transferência, Segunda Graduação, Volte a Estudar)
- **Financiamento header:** "Estudar pode custar menos do que você imagina." + "Bolsas de até 60%, FIES, ProUni e o programa Corporativo Florence para quem trabalha em empresas parceiras."
- **CTA final:** "Sua vaga na Florence está a um passo." + "Preencha e fale com o nosso time de admissões hoje."
- **Meta title:** Graduação no Centro Universitário Florence | 11 cursos em São Luís
- **Meta description:** Estude com prática desde o início e corpo docente atuante. 11 cursos de graduação, 6 formas de ingresso, bolsas de até 60%, FIES e ProUni. Inscreva-se.

---

## 10. Fora de escopo (agora)

- Depoimentos reais (mock até o cliente enviar).
- Conteúdo oficial de imagens (placeholders livres até lá).
- Páginas internas por curso (decisão: tudo in-page via modal).
- Integração com Dynamics (continua no Supabase; Dynamics fica para depois).

---

## 11. Verificação

- Build local `npm run build -w graduacao` verde + workspaces.
- Preview Vercel (branch) antes de produção (mesmo fluxo da medicina; commits autorados `ascom@florence.edu.br`).
- Lead de teste pelo form: confirmar no Supabase `lp_slug=graduacao` + `metadata.curso_interesse` preenchido.
- Migração `011_add_leads_metadata.sql` rodada antes do deploy que grava metadata.
- GTM carregando; forms com id/name corretos.
- Acessibilidade do modal (ESC/foco), responsivo mobile, paridade de marca com a medicina.

---

## 12. Critérios de sucesso

- Página no ar, visualmente coerente com a marca/medicina, mas com identidade de "guarda-chuva".
- Visitante descobre cursos sem sair da página e converte no form com curso de interesse.
- Leads chegam ao Supabase com slug e curso corretos.
- Urgência liga/desliga por config sem refactor (página perpétua).
- Base preparada para as próximas LPs (form com extraFields + metadata reutilizáveis).
