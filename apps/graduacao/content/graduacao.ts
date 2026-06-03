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
          {
            slug: "biomedicina", nome: "Biomedicina", area: "Saúde", // MOCK
            titulacao: "Bacharelado", duracao: "5 anos · 10 semestres", // MOCK
            turnos: ["Matutino", "Noturno"], modalidade: "Presencial", // MOCK
            resumo: "Diagnóstico laboratorial e pesquisa aplicada à saúde humana.", // MOCK
            descricao:
              "Forma profissionais para atuar em análises clínicas, hemoterapia, imunologia, biologia molecular e pesquisa biomédica, com base sólida em ciências básicas e tecnologia laboratorial.", // MOCK
            diferenciais: [
              "Laboratórios de análises clínicas e biomolecular", // MOCK
              "Formação voltada ao diagnóstico e pesquisa", // MOCK
              "Professores pesquisadores atuantes na área", // MOCK
            ],
            mercado: ["Laboratórios clínicos", "Bancos de sangue", "Pesquisa científica", "Indústria farmacêutica"], // MOCK
            foto: "/images/cursos/biomedicina.jpg",
          },
          {
            slug: "farmacia", nome: "Farmácia", area: "Saúde", // MOCK
            titulacao: "Bacharelado", duracao: "5 anos · 10 semestres", // MOCK
            turnos: ["Matutino", "Noturno"], modalidade: "Presencial", // MOCK
            resumo: "Da manipulação à atenção farmacêutica, com foco no paciente.", // MOCK
            descricao:
              "Formação generalista que habilita o farmacêutico para atuar em farmácias comunitárias, hospitalares, indústria, análises clínicas e vigilância sanitária, sempre centrado no uso racional do medicamento.", // MOCK
            diferenciais: [
              "Farmácia-escola com atendimento real", // MOCK
              "Laboratório de manipulação e controle de qualidade", // MOCK
              "Estágio em ambientes hospitalares e industriais", // MOCK
            ],
            mercado: ["Farmácias e drogarias", "Indústria farmacêutica", "Hospitais", "Vigilância sanitária"], // MOCK
            foto: "/images/cursos/farmacia.jpg",
          },
          {
            slug: "fisioterapia", nome: "Fisioterapia", area: "Saúde", // MOCK
            titulacao: "Bacharelado", duracao: "5 anos · 10 semestres", // MOCK
            turnos: ["Matutino", "Noturno"], modalidade: "Presencial", // MOCK
            resumo: "Reabilitação e promoção de saúde com prática clínica intensa.", // MOCK
            descricao:
              "O curso habilita para a prevenção, tratamento e reabilitação de disfunções musculoesqueléticas, neurológicas, respiratórias e cardíacas, com ênfase na prática clínica supervisionada desde os primeiros períodos.", // MOCK
            diferenciais: [
              "Clínica-escola com atendimentos reais", // MOCK
              "Equipamentos de última geração", // MOCK
              "Estágio em hospitais e unidades de saúde", // MOCK
            ],
            mercado: ["Clínicas de reabilitação", "Hospitais", "Esportes", "Saúde do idoso"], // MOCK
            foto: "/images/cursos/fisioterapia.jpg",
          },
          {
            slug: "medicina", nome: "Medicina", area: "Saúde",
            titulacao: "Bacharelado", duracao: "6 anos · 12 semestres",
            turnos: ["Integral"], modalidade: "Presencial",
            resumo: "Formação médica humanista com prática clínica desde o início.",
            descricao:
              "Curso de Medicina com metodologias ativas, internato em unidades de saúde parceiras e formação humanista que prepara o médico para atuar com ética e competência nos mais variados contextos.", // MOCK: refinar com a pagina
            diferenciais: [
              "Metodologias ativas de aprendizagem", // MOCK
              "Internato em hospitais e UBS parceiras", // MOCK
              "Formação humanista e centrada no paciente", // MOCK
            ],
            mercado: ["Clínica geral", "Residência médica", "Saúde pública", "Especialidades"], // MOCK
            foto: "/images/cursos/medicina.jpg",
          },
          {
            slug: "medicina-veterinaria", nome: "Medicina Veterinária", area: "Saúde", // MOCK
            titulacao: "Bacharelado", duracao: "5 anos · 10 semestres", // MOCK
            turnos: ["Matutino", "Noturno"], modalidade: "Presencial", // MOCK
            resumo: "Saúde animal, saúde pública e bem-estar com prática supervisionada.", // MOCK
            descricao:
              "Formação que habilita o médico veterinário para atuar na clínica de pequenos e grandes animais, saúde pública, inspeção de alimentos e produção agropecuária, com laboratórios e hospital veterinário.", // MOCK
            diferenciais: [
              "Hospital Veterinário Escola", // MOCK
              "Laboratórios de microbiologia e patologia", // MOCK
              "Estágio em clínicas e propriedades rurais", // MOCK
            ],
            mercado: ["Clínica de pequenos animais", "Agropecuária", "Saúde pública veterinária", "Inspeção de alimentos"], // MOCK
            foto: "/images/cursos/medicina-veterinaria.jpg",
          },
          {
            slug: "nutricao", nome: "Nutrição", area: "Saúde", // MOCK
            titulacao: "Bacharelado", duracao: "5 anos · 10 semestres", // MOCK
            turnos: ["Matutino", "Noturno"], modalidade: "Presencial", // MOCK
            resumo: "Alimentação e saúde: clínica, coletiva e esportiva na prática.", // MOCK
            descricao:
              "O curso forma nutricionistas com competências para atuar na atenção clínica individual, nutrição coletiva, esportiva e funcional, com laboratório de técnica dietética e estágios supervisionados.", // MOCK
            diferenciais: [
              "Laboratório de técnica dietética e análise de alimentos", // MOCK
              "Estágios em UAN, hospitais e clínicas", // MOCK
              "Formação em nutrição clínica e esportiva", // MOCK
            ],
            mercado: ["Clínicas e consultórios", "Hospitais e UAN", "Esporte de alto rendimento", "Saúde coletiva"], // MOCK
            foto: "/images/cursos/nutricao.jpg",
          },
          {
            slug: "odontologia", nome: "Odontologia", area: "Saúde", // MOCK
            titulacao: "Bacharelado", duracao: "5 anos · 10 semestres", // MOCK
            turnos: ["Matutino", "Noturno"], modalidade: "Presencial", // MOCK
            resumo: "Saúde bucal e técnica cirúrgica com clínica-escola integrada.", // MOCK
            descricao:
              "Formação clínica e humanista que prepara o cirurgião-dentista para atuar em clínica geral, especialidades, saúde pública e gestão de consultório, com clínica-escola de alta complexidade.", // MOCK
            diferenciais: [
              "Clínica-escola com atendimentos à comunidade", // MOCK
              "Equipamentos digitais de imagem e diagnóstico", // MOCK
              "Estágio supervisionado em unidades do SUS", // MOCK
            ],
            mercado: ["Clínica privada", "Saúde pública", "Especialidades odontológicas", "Docência"], // MOCK
            foto: "/images/cursos/odontologia.jpg",
          },
          {
            slug: "estetica-cosmetica", nome: "Estética e Cosmética", area: "Saúde", // MOCK
            titulacao: "Tecnólogo", duracao: "Conforme matriz", // MOCK
            turnos: ["Matutino", "Noturno"], modalidade: "Presencial", // MOCK
            resumo: "Técnicas estéticas modernas com foco em saúde e bem-estar.", // MOCK
            descricao:
              "Curso tecnológico que forma profissionais para atuar em estética facial, corporal e capilar, com base em anatomia, fisiologia e cosmetologia, aliando técnica e visão de negócio.", // MOCK
            diferenciais: [
              "Laboratório de práticas estéticas equipado", // MOCK
              "Formação em cosmetologia e dermofarmácia", // MOCK
              "Visão empreendedora para abertura de negócio", // MOCK
            ],
            mercado: ["Clínicas de estética", "Spas e centros de bem-estar", "Consultórios dermatológicos", "Empreendedorismo"], // MOCK
            foto: "/images/cursos/estetica-cosmetica.jpg",
          },
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
