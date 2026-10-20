# Ondas de desenvolvimento (site WordPress Florence)

Plano para fechar o redesign: ideias aprovadas em 20/10/2026 (1, 3, 4, 5, 8, 9, 10, 13, 14, 15, 16, 17) mais o backlog já existente. Ondas 1 a 3 entregues em 20/10/2026 (tema v0.19.3); [~] = estrutura no ar, falta dado oficial da Florence. Cada onda termina com deploy no ambiente de teste, conferência visual e commit.

> Legenda: **[x]** feito · **[~]** em andamento · **[ ]** pendente · 🔒 depende da Florence.

---

## Onda 1: Base técnica e medição (sem depender de ninguém)

Objetivo: o site medir tudo e carregar rápido antes de ganhar features novas. Assim cada feature seguinte já nasce medida.

- [x] **16. Eventos GTM/GA4:** clique em WhatsApp, "Quero minha vaga", envio de cada formulário (Ninja Forms), "Ver valores", filtro de cursos, mapa. Camada `dataLayer` no `florence.js`.
- [x] **10. Dados estruturados:** `CollegeOrUniversity` na home, `Course` em cada curso (nível, modalidade, duração), `BreadcrumbList`, `LocalBusiness` com endereço e horário. O FAQPage já existe.
- [x] **13. Performance:** imagens em WebP com `srcset` correto, `loading="lazy"` abaixo da dobra, preload da fonte e da imagem do hero, remover CSS/JS do Elementor e Toolset das páginas que não usam. Meta: Lighthouse 90+ no celular.
- [x] **Backlog: 28 cursos sem `nivel`.** Classificar para aparecerem nos filtros e no dado estruturado.

## Onda 2: Conversão (o que gera matrícula)

Objetivo: transformar visita em lead. Depende da Onda 1 para medir o antes e o depois.

- [x] **5. Formulário em etapas:** o form de captação (form 10) vira 3 passos curtos (curso, contato, confirmação), com barra de progresso. Mesmo destino de dados.
- [~] **4. Página "Como entrar":** vestibular, transferência, segunda graduação, ENEM, com passo a passo e documentos. 🔒 Documentos, formato da prova e calendário 2026.2 vêm da FAQ do Flavio; a estrutura pode subir antes com o que já é público.
- [x] **3. Comparador de cursos:** escolher até 3 cursos e ver lado a lado (duração, modalidade, turno, titulação, corpo docente). Lê os campos ACF que já existem.
- [x] **1. Quiz vocacional:** 6 a 8 perguntas que sugerem cursos e terminam no formulário com o curso já preenchido. Sem banco novo: lógica no JS, resultado vai pro form.

## Onda 3: Confiança e atendimento

Objetivo: responder "posso confiar nessa faculdade?" sem o candidato sair do site.

- [~] **9. Transparência MEC:** página com credenciamento, nota e reconhecimento por curso, link para o e-MEC. 🔒 Dados oficiais da Florence (campo `reconhecimento_mec` já existe no painel).
- [~] **8. Números da Clínica-Escola:** atendimentos por ano, especialidades, comunidade atendida. 🔒 Números reais da Florence.
- [x] **14. Acessibilidade e VLibras:** widget VLibras oficial, contraste AA revisado, navegação por teclado, foco visível, `alt` nas imagens migradas.
- [x] **15. Chat:** botão de atendimento que abre o WhatsApp oficial com mensagem por página (base já existe em `florence2026_whatsapp()`). Chat com IA só se a Florence quiser e tiver quem responda; recomendo começar pelo WhatsApp.

## Onda 4: Conteúdo pendente da Florence 🔒

Entra assim que chegar; a estrutura no site já está pronta.

- [ ] **FAQ** de cada curso (Flavio): documentos, bolsas, vestibular, calendário, MEC.
- [ ] **Corpo docente** de Direito, Fisioterapia e Nutrição (pró-reitoria acadêmica) e titulação dos professores.
- [ ] **E-mail dos formulários (SMTP)** com o Giovani Murilo: serviço, remetente e destino por formulário.
- [ ] **Itens da rodada 2** (páginas para cortar/fundir, aprovação final).

## Onda 5: Migração e publicação (ideia 17)

Objetivo: levar tudo para `florence.edu.br` sem derrubar o site.

- [ ] **Decisões antes:** data-alvo de publicação, licença do Elementor Pro, quando aposentar o Toolset.
- [ ] **Ensaio:** backup completo do oficial, porta tema `florence2026` + mu-plugin `florence-modelo.php` + dados (CPT curso e ACF) num staging do oficial.
- [ ] **Reimportar corpo docente** a partir do oficial (pode ter mudado).
- [ ] **Redirecionamentos 301** das URLs antigas dos CPTs do Toolset para `/curso/...`.
- [ ] **Virada:** congelamento de conteúdo, publicação, purga do Cloudflare, conferência dos formulários e do GTM.
- [ ] **Depois:** limpar os 25 cursos livres duplicados nos CPTs legados e desativar o Toolset.

---

## Ordem e dependências

| Onda | Depende de | Pode rodar em paralelo com |
|---|---|---|
| 1. Base técnica | nada | 4 (esperando a Florence) |
| 2. Conversão | 1 (medição) | 4 |
| 3. Confiança | dados da Florence para 8 e 9 | 2 |
| 4. Conteúdo 🔒 | Florence | todas |
| 5. Migração | 1 a 3 prontas, decisões fechadas | nada |

**O que pedir agora ao Lucas para não travar as Ondas 3 e 5:** dados do MEC por curso, números da Clínica-Escola e a data-alvo de publicação.
