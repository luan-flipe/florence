# LP "Pós-graduação" — Design (adaptação do molde guarda-chuva)

**Data:** 2026-06-03
**Status:** Aprovado (defaults confirmados), executando
**App:** `apps/pos-graduacao` (monorepo, consome `@florence/config|lib|ui`)
**LP slug:** `pos-graduacao`
**Base:** mesmo molde da LP de Graduação (`apps/graduacao`) — clone + adaptação de conteúdo.

---

## Contexto

Terceira LP da Florence, curso #3 do briefing. Página guarda-chuva da **pós-graduação** (lato sensu / especialização / aperfeiçoamento). Mesmo template visual e estrutural da graduação, com conteúdo e duas seções adaptados ao público de pós (profissionais já graduados).

## Diferenças vs. Graduação (os deltas)

| Graduação | Pós-graduação |
|---|---|
| Público: começar a carreira | Profissional **graduado** se especializando |
| Seção "Formas de ingresso" (6 vias, vestibular) | **"Como ingressar"** — sem vestibular, por análise de documentos |
| Seção "Bolsas & Financiamento" (FIES/ProUni) | **"Investimento & Corporativo"** — parcelamento + Programa Corporativo Florence |
| Cursos de 5 anos | Especializações de 12–24 meses (conclusão a partir de 13) |
| Badge de prazo de campanha | **Sem badge** (`prazo.ativo=false`) — fluxo contínuo |

**Importante:** as seções `Ingresso` e `Financiamento` são **config-driven** — reusam o mesmo componente, só muda o conteúdo do config (titulo, subtitulo, `formas[]`/`itens[]`). Os eyebrows e títulos hardcoded de 2 linhas no JSX são ajustados para pós.

## Cursos (do site, ~18, por área)

- **Saúde** (10): Análises Clínicas e Diagnóstico Laboratorial, Bioquímica Clínica, Emagrecimento e Obesidade, Enfermagem Oncológica, Farmácia Clínica e Hospitalar, Fisioterapia em Geriatria e Gerontologia, Fitoterapia e Suplementação Nutricional, Nutrição Clínica e Esportiva, Saúde Coletiva e Família, Urgência e Emergência.
- **Odontologia** (6): Cirurgia Oral Menor, Endodontia, Clareamento Dental, Odontopediatria, Ortodontia, Resinas Dentárias.
- **Direito** (1): Ciências Criminais.
- **Estética** (1): Estética Avançada com Ênfase em Injetáveis.

Nome/área/modalidade (Presencial)/duração = reais do site. `descricao`/`diferenciais`/`mercado` por curso = **mock** marcado (`// MOCK`). `titulacao` = "Especialização" (ou "Aperfeiçoamento" nos de odonto sem 360h). `turnos` = `[]` (pós não usa matutino/noturno).

## Copy

- **Eyebrow:** Pós-graduação · São Luís, MA
- **Headline:** Especialize-se com quem atua na área.
- **Subheadline:** Pós-graduação em Saúde, Odontologia, Direito e Estética, com professores de excelência e conclusão a partir de 13 meses.
- **Stats:** 18+ especializações · a partir de 13 meses · 4 áreas
- **CTA:** Quero me especializar
- **Cursos header:** "Encontre sua especialização." / "Escolha a área e dê o próximo passo na carreira."
- **Como ingressar:** "Sem vestibular." / "A inscrição é por análise de documentos." — itens: Diploma de graduação, Histórico escolar, Documentos pessoais (RG e CPF), Foto 3x4 e comprovante de residência.
- **Investimento & Corporativo:** "Investimento facilitado." — itens: Parcelamento, Programa Corporativo Florence (descontos p/ empresas parceiras), Florence Fidelidade, Conclusão a partir de 13 meses.
- **Diferenciais:** lead "Especialização aplicada à prática." + pontos "Professores de excelência" e "Conclusão a partir de 13 meses".
- **CTA final:** "Dê o próximo passo na sua carreira."

## Arquitetura / form / lead

- App fino clonado de `apps/graduacao`. Reusa `@florence/config|lib|ui`.
- Form com dropdown "curso de interesse" (os ~18). `extraFields` + `metadata.curso_interesse` (coluna `metadata` já existe após `011`).
- `lp_slug=pos-graduacao`, `LP_DISPLAY_NAME=Pós Florence`.
- Mesma identidade escura/premium + logo nas seções (igual graduação).
- Imagens temáticas (Unsplash) por curso/área; hero de pós.

## Fora de escopo

- Depoimentos reais (mock/oculto).
- Extração de template compartilhado (`@florence/umbrella`) — adiada; duplicação aceita por ora.

## Verificação

- Build local `npm run build -w pos-graduacao` + workspaces verdes.
- Lead de teste → `lp_slug=pos-graduacao` + `metadata.curso_interesse`.
- Sem push/deploy até aprovação local (mesmo fluxo das anteriores).
