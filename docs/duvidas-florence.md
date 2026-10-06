# Dúvidas e pendências para a Florence

Lista de tudo que precisa de resposta ou material do cliente para concluir o redesign do site (tema `florence2026`, ambiente de teste `florence.luanfelipe.com.br`).

> Legenda: **[x]** feito · **[~]** em andamento ou parcial · **[ ]** pendente. Atualizado em 06/10/2026 (tema v0.17.3). Respostas do Lucas Antônio recebidas em 11/09/2026. A segunda rodada está em `duvidas-florence-rodada-2.md`.

## Resumo

| Tema | Situação |
|---|---|
| 1. E-mail dos formulários (SMTP) | [ ] pendente, depende do Giovani Murilo |
| 2. Página de Contato | [x] feito (falta confirmar dias de atendimento) |
| 3. Formulários | [~] Matrícula removida; newsletter aguardando resposta |
| 4. FAQ | [~] estrutura pronta no site; conteúdo com o Flavio |
| 5. Corpo docente | [~] 7 cursos no ar; faltam Direito, Fisioterapia e Nutrição |

---

## 1. E-mail e entrega de formulários (SMTP), bloqueia captação

O site tem 10 formulários (Fale Conosco, Ouvidoria, Trabalhe Conosco, Vestibular etc.), mas o envio de e-mail não está configurado com autenticação. Plugin de SMTP instalado; falta a configuração.

**Resposta do Lucas:** tratar direto com o Giovani Murilo (TI/e-mail).

- [ ] **Qual serviço de e-mail a Florence usa?** Perguntar ao Giovani.
- [ ] **Qual endereço deve constar como remetente dos formulários?** Perguntar ao Giovani.
- [ ] **Para qual(is) endereço(s) cada tipo de formulário deve ser enviado?** Decisão da Florence, não do TI. Reperguntado na rodada 2 (item 1).
- [ ] **Credenciais de envio.** Não manuseamos senha: o Giovani aplica direto no painel.

## 2. Página de Contato

- [x] **Endereço completo do campus.** Rua Rio Branco, 216, Centro, São Luís, MA, 65020-470. No ar na Contato e no rodapé, com mapa que carrega ao clicar e link "Como chegar".
- [x] **Telefones por setor.** Não existem: a Florence usa um número único, que distribui por setor. O (98) 3878-2120 foi removido do site.
- [~] **Horário de atendimento.** Das 8h às 21h, no ar na Contato e no rodapé. Falta confirmar os dias (todos os dias ou só dias úteis), reperguntado na rodada 2 (item 2).
- [x] **WhatsApp oficial.** Apenas (98) 98863-0502. O corporativo (98) 99242-2120 saiu; a página do Corporativo usa o número oficial. Botão de WhatsApp flutuante e barra fixa no celular adicionados, com mensagem pronta citando o curso.

## 3. Formulários (revisão de conteúdo)

- [x] **Campo Matrícula do Fale Conosco.** Resposta: pode remover. Removido em 05/10 (backup em `~/bkp-nf-campo35.sql` no servidor).
- [~] **Newsletter do rodapé.** Fora do site novo. O Lucas perguntou como seria alimentada; explicação enviada na rodada 2 (item 4), aguardando decisão.
- [x] **Formulário de captação da home.** Resposta: pode usar o mesmo. Segue no form Vestibular, com o botão "Quero minha vaga" (antes aparecia "Submit").

## 4. Perguntas Frequentes (FAQ)

**Resposta do Lucas:** repassado ao Flavio, prometido para 12/09. Ainda não chegou.

Já pronto no site: campo "Dúvidas frequentes" no painel de cada curso, exibido como acordeão na página do curso e marcado para aparecer no Google. Basta preencher.

- [ ] **Documentos necessários para matrícula**, por nível.
- [ ] **Valores / mensalidades.** Observação: as páginas de curso já mostram o investimento quando o campo está preenchido (ex.: Enfermagem R$ 1.593,96). Confirmar se esses valores estão atualizados.
- [ ] **Bolsas.** Confirmar percentuais (até 77%) e quem tem direito.
- [ ] **Vestibular digital.** Formato da prova e taxa.
- [ ] **Calendário do processo seletivo 2026.2.**
- [ ] **Reconhecimento MEC por curso.**
- [ ] **FAQ geral ou por curso?**

## 5. Corpo docente por curso

**Resposta do Lucas:** atualizaram todos os cursos no site oficial; faltam Direito e Fisioterapia (vão cobrar a coordenação).

- [~] **Por curso, quais professores exibir?** Importado do oficial em 05/10 para o campo "Corpo docente" de cada curso: 7 cursos e 134 professores (Medicina 34, Odontologia 24, Farmácia 21, Biomedicina 17, Veterinária 16, Estética 12, Enfermagem 10). Seção "Quem dá aula" no ar, com nome e Lattes.
  - [ ] Faltam **Direito**, **Fisioterapia** e também **Nutrição** (vazia no oficial, avisado na rodada 2).
  - [ ] **Titulação (mestre/doutor):** campo pronto no painel, aparece ao lado do nome e no resumo quando preenchido. A lista do oficial não traz essa informação.
  - [ ] Ao portar o site para o endereço oficial, reimportar a lista de lá (pode ter mudado).
- [x] **Não publicar nome errado:** cursos sem lista simplesmente não mostram a seção.

---

_Novos pontos (edições no site atual, páginas para cortar, aprovação e acessos) estão na rodada 2._
