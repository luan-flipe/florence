# Dúvidas e pendências para a Florence

Lista de tudo que precisa de resposta ou material do cliente para concluir o redesign do site (tema `florence2026`, ambiente de teste `florence.luanfelipe.com.br`). Enviar de uma vez ao final.

> Atualizado conforme o trabalho avança. Cada item diz por que precisamos e o que trava enquanto não vier.

---

## 1. E-mail e entrega de formulários (SMTP) — bloqueia captação

O site tem 10 formulários (Fale Conosco, Ouvidoria, Trabalhe Conosco, Vestibular etc.), mas o envio de e-mail não está configurado com autenticação. Sem isso, as mensagens dos formulários caem em spam ou nem chegam. Instalamos o plugin de SMTP; falta a configuração, que depende de vocês:

- **Qual serviço de e-mail a Florence usa?** (ex.: Google Workspace / Gmail, Microsoft 365 / Outlook, servidor próprio da Hostinger, outro)
- **Qual endereço deve constar como remetente dos formulários?** (ex.: `contato@florence.edu.br`, `ascom@florence.edu.br`)
- **Para qual(is) endereço(s) cada tipo de formulário deve ser enviado?** (ex.: Fale Conosco vai para X, Trabalhe Conosco para RH, Ouvidoria para Y)
- **Credenciais de envio** (host SMTP, porta, usuário e senha, ou uma "senha de app"): não manuseamos senha. Vocês aplicam direto no painel, ou nos passam por um canal seguro se preferirem que a gente configure.

## 2. Página de Contato — dados que só a Florence tem

Estamos montando a página de Contato nova (a atual é quase vazia). Precisamos de:

- **Endereço completo do campus** (rua, número, bairro, CEP) para exibir e montar o mapa.
- **Telefones por setor** (ex.: Secretaria, Financeiro, Coordenações, Ouvidoria). Hoje só temos os gerais: (98) 3878-2120 e (98) 98863-0502.
- **Horário de atendimento** ao público (presencial e telefônico).
- **Confirmar o WhatsApp oficial** de atendimento: (98) 98863-0502. E o WhatsApp corporativo (98) 99242-2120 é o correto para o programa Corporativo?

## 3. Formulários (revisão de conteúdo)

Reaproveitamos os formulários que já existem no site (Ninja Forms). Dois pontos a confirmar:

- **Fale Conosco** (usado na página de Contato) tem um campo **Matrícula**, que faz sentido para aluno atual mas não para candidato. Podemos remover ou deixar opcional. Como preferem?
- **Newsletter do rodapé:** hoje aparece quebrada no site atual (o código do formulário aparece como texto). Vocês querem manter uma newsletter no rodapé novo, ou podemos remover?
- **Formulário de captação da home:** usamos o formulário "Vestibular" (Nome, E-mail, Celular, Curso de interesse). Confirmam que é para onde deve ir esse contato, ou querem um destino/campos diferentes?

## 4. Perguntas Frequentes (FAQ) — depende de conteúdo de vocês

Queremos criar uma seção de Perguntas Frequentes (com marcação para o Google, o que ajuda a aparecer melhor na busca). Só que uma FAQ boa precisa de respostas oficiais, e não vamos inventar. Precisamos de vocês:

- **Documentos necessários para matrícula**, por nível (graduação, técnico, pós). Qual a lista?
- **Valores / mensalidades**: o site novo não exibe preços hoje. Vocês querem exibir faixa de valores, "consulte", ou nada? Se sim, quais?
- **Bolsas**: já temos "até 77% para servidores públicos e funcionários de empresas parceiras, incluindo dependentes". Confirmam os percentuais e quem tem direito? Como o candidato comprova?
- **Vestibular digital**: como é a prova (duração, número de questões, conteúdo)? Há taxa?
- **Calendário do processo seletivo 2026.2**: prazos de inscrição, prova e matrícula.
- **Reconhecimento MEC por curso**: quais cursos têm qual conceito/portaria (para exibir na página de cada curso)?
- **A FAQ deve ser geral (institucional) ou por curso?** Uma FAQ por curso exige um bloco de perguntas e respostas para cada um; se preferirem, começamos com uma FAQ geral (ingresso, bolsas, documentos) e evoluímos depois.

---

_(mais itens serão adicionados abaixo conforme o trabalho continua)_
