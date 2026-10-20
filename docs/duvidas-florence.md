# Dúvidas e pendências para a Florence

Lista de tudo que precisa de resposta ou material do cliente para concluir o redesign do site (tema `florence2026`, ambiente de teste `florence.luanfelipe.com.br`).

> Legenda: **[x]** feito · **[~]** em andamento ou parcial · **[ ]** pendente. Atualizado em 20/10/2026 (tema v0.18.0). Respostas do Lucas Antônio em 11/09 e 19/10/2026. A segunda rodada está em `duvidas-florence-rodada-2.md`.

## Resumo

| Tema | Situação |
|---|---|
| 1. E-mail dos formulários (SMTP) | [ ] pendente, depende do Giovani Murilo |
| 2. Página de Contato | [x] feito |
| 3. Formulários | [x] feito (sem newsletter) |
| 4. FAQ | [~] estrutura pronta no site; conteúdo com o Flavio |
| 5. Corpo docente | [~] 7 cursos no ar; faltam Direito, Fisioterapia e Nutrição (com a pró-reitoria acadêmica) |
| Valores dos cursos | [x] sob pedido pelo formulário; atualizados no painel a cada semestre |
| Clínica-Escola | [x] agendamento pelo número oficial |

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
- [x] **Horário de atendimento.** Segunda a sexta, das 8h às 21h; sábado, das 8h às 12h (resposta de 19/10). No ar na Contato e no rodapé.
- [x] **WhatsApp oficial.** Apenas (98) 98863-0502. O corporativo (98) 99242-2120 saiu; a página do Corporativo usa o número oficial. Botão de WhatsApp flutuante e barra fixa no celular adicionados, com mensagem pronta citando o curso.

## 3. Formulários (revisão de conteúdo)

- [x] **Campo Matrícula do Fale Conosco.** Resposta: pode remover. Removido em 05/10 (backup em `~/bkp-nf-campo35.sql` no servidor).
- [x] **Newsletter do rodapé.** Resposta de 19/10: segue sem newsletter.
- [x] **Formulário de captação da home.** Resposta: pode usar o mesmo. Segue no form Vestibular, com o botão "Quero minha vaga" (antes aparecia "Submit").

## 4. Perguntas Frequentes (FAQ)

**Resposta do Lucas:** repassado ao Flavio, prometido para 12/09. Ainda não chegou.

Já pronto no site: campo "Dúvidas frequentes" no painel de cada curso, exibido como acordeão na página do curso e marcado para aparecer no Google. Basta preencher.

- [ ] **Documentos necessários para matrícula**, por nível.
- [x] **Valores / mensalidades.** Resposta de 19/10: não exibir o preço; o candidato deixa os dados para receber o valor. Feito: cada curso tem a seção "Quanto custa?" com o formulário, e o campo Investimento no painel serve para o time atualizar a cada semestre.
- [ ] **Bolsas.** Confirmar percentuais (até 77%) e quem tem direito.
- [ ] **Vestibular digital.** Formato da prova e taxa.
- [ ] **Calendário do processo seletivo 2026.2.**
- [ ] **Reconhecimento MEC por curso.**
- [ ] **FAQ geral ou por curso?**

## 5. Corpo docente por curso

**Resposta do Lucas:** atualizaram todos os cursos no site oficial; faltam Direito e Fisioterapia (vão cobrar a coordenação).

- [~] **Por curso, quais professores exibir?** Importado do oficial em 05/10 para o campo "Corpo docente" de cada curso: 7 cursos e 134 professores (Medicina 34, Odontologia 24, Farmácia 21, Biomedicina 17, Veterinária 16, Estética 12, Enfermagem 10). Seção "Quem dá aula" no ar, com nome e Lattes.
  - [ ] Faltam **Direito**, **Fisioterapia** e **Nutrição**. O Lucas pediu à pró-reitoria acadêmica em 19/10, ainda sem retorno.
  - [ ] **Titulação (mestre/doutor):** campo pronto no painel, aparece ao lado do nome e no resumo quando preenchido. A lista do oficial não traz essa informação.
  - [ ] Ao portar o site para o endereço oficial, reimportar a lista de lá (pode ter mudado).
- [x] **Não publicar nome errado:** cursos sem lista simplesmente não mostram a seção.

---

_Novos pontos (edições no site atual, páginas para cortar, aprovação e acessos) estão na rodada 2._
