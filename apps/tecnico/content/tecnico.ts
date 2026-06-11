import type { UmbrellaConfig } from "@florence/umbrella";

export const config = {
  meta: {
    title: "Cursos Técnicos no Centro Universitário Florence | São Luís",
    description:
      "Cursos técnicos em Saúde, Indústria e Meio Ambiente com formação prática e rápida. Entre logo no mercado de trabalho com a Florence.",
  },

  hero: {
    eyebrow: "Curso Técnico · São Luís, MA",
    headline: "Uma profissão técnica em menos tempo.",
    subheadline:
      "Cursos técnicos presenciais em Saúde, Indústria e Meio Ambiente, com prática desde o início para você entrar logo no mercado de trabalho.",
    imageAlt: "Formação técnica na Florence",
    stats: [
      { value: "8", label: "cursos" },
      { value: "Presencial", label: "modalidade" },
      { value: "3", label: "áreas" },
    ],
  },

  // Urgencia config-driven: ativo=false some sem mexer no layout.
  prazo: { ativo: false, texto: "Matrículas abertas" },

  formulario: {
    titulo: "Dê o primeiro passo.",
    subtitulo: "Escolha seu curso técnico e nosso time entra em contato.",
    cta: "Quero me matricular",
    lgpd: "Ao enviar, você autoriza o contato da Florence. Não compartilhamos seus dados.",
    cursoLabel: "Curso de interesse",
    cursoPlaceholder: "Escolha um curso",
  },

  cursos: {
    eyebrow: "Cursos técnicos",
    titulo: "Encontre seu\ncurso técnico.",
    subtitulo: "Escolha a área e comece a se qualificar.",
    grupos: [
      {
        area: "Saúde",
        itens: [
          {
            slug: "tecnico-enfermagem", nome: "Técnico em Enfermagem", area: "Saúde", // MOCK
            titulacao: "Curso Técnico", duracao: "18 a 24 meses", // MOCK
            turnos: [], modalidade: "Presencial",
            resumo: "Assistência de enfermagem com foco prático e atuação no SUS.", // MOCK
            descricao:
              "Forma profissionais para atuar como técnicos de enfermagem em hospitais, clínicas e unidades de atenção básica, com prática supervisionada desde o início do curso.", // MOCK
            diferenciais: [
              "Prática em laboratórios de enfermagem desde o início", // MOCK
              "Formação alinhada ao SUS e ao mercado de trabalho", // MOCK
              "Professores atuantes na área de saúde", // MOCK
            ],
            mercado: ["Hospitais", "Clínicas", "UBS", "Home care"], // MOCK
            foto: "/images/cursos/tecnico-enfermagem.jpg",
          },
          {
            slug: "tecnico-estetica", nome: "Técnico em Estética", area: "Saúde", // MOCK
            titulacao: "Curso Técnico", duracao: "18 a 24 meses", // MOCK
            turnos: [], modalidade: "Presencial",
            resumo: "Técnicas estéticas faciais e corporais para atuar em clínicas e spas.", // MOCK
            descricao:
              "Capacita profissionais para realizar procedimentos estéticos faciais e corporais com base em anatomia, fisiologia e cosmetologia, aliando técnica e segurança.", // MOCK
            diferenciais: [
              "Laboratório de práticas estéticas equipado", // MOCK
              "Base em anatomia e cosmetologia aplicada", // MOCK
              "Formação voltada para o mercado de beleza e saúde", // MOCK
            ],
            mercado: ["Clínicas de estética", "Spas", "Centros de bem-estar", "Empreendedorismo"], // MOCK
            foto: "/images/cursos/tecnico-estetica.jpg",
          },
          {
            slug: "tecnico-analises-clinicas", nome: "Técnico em Análises Clínicas", area: "Saúde", // MOCK
            titulacao: "Curso Técnico", duracao: "18 a 24 meses", // MOCK
            turnos: [], modalidade: "Presencial",
            resumo: "Análises laboratoriais clínicas com prática em laboratório equipado.", // MOCK
            descricao:
              "Forma técnicos para coleta, processamento e análise de amostras biológicas em laboratórios clínicos, com ênfase em bioquímica, hematologia e microbiologia.", // MOCK
            diferenciais: [
              "Prática em laboratório de análises clínicas", // MOCK
              "Formação em bioquímica, hematologia e microbiologia", // MOCK
              "Professores com experiência em laboratórios clínicos", // MOCK
            ],
            mercado: ["Laboratórios clínicos", "Hospitais", "Clínicas diagnósticas", "Postos de saúde"], // MOCK
            foto: "/images/cursos/tecnico-analises-clinicas.jpg",
          },
          {
            slug: "tecnico-saude-bucal", nome: "Técnico em Saúde Bucal", area: "Saúde", // MOCK
            titulacao: "Curso Técnico", duracao: "18 a 24 meses", // MOCK
            turnos: [], modalidade: "Presencial",
            resumo: "Auxílio odontológico e prevenção em saúde bucal na prática.", // MOCK
            descricao:
              "Capacita profissionais para auxiliar cirurgiões-dentistas em procedimentos clínicos, realizar atividades de prevenção e promover saúde bucal em unidades de saúde.", // MOCK
            diferenciais: [
              "Prática em consultórios odontológicos reais", // MOCK
              "Formação em prevenção e promoção de saúde bucal", // MOCK
              "Atuação no SUS e em clínicas privadas", // MOCK
            ],
            mercado: ["Consultórios odontológicos", "UBS", "Saúde pública", "Clínicas privadas"], // MOCK
            foto: "/images/cursos/tecnico-saude-bucal.jpg",
          },
          {
            slug: "tecnico-nutricao", nome: "Técnico em Nutrição", area: "Saúde", // MOCK
            titulacao: "Curso Técnico", duracao: "18 a 24 meses", // MOCK
            turnos: [], modalidade: "Presencial",
            resumo: "Suporte nutricional prático em unidades de alimentação e nutrição.", // MOCK
            descricao:
              "Forma profissionais para auxiliar nutricionistas em unidades de alimentação e nutrição (UAN), hospitais e clínicas, com prática em técnicas dietéticas e controle de qualidade.", // MOCK
            diferenciais: [
              "Prática em laboratório de técnica dietética", // MOCK
              "Formação voltada a UAN e serviços de saúde", // MOCK
              "Base em nutrição clínica e coletiva", // MOCK
            ],
            mercado: ["UAN", "Hospitais", "Escolas", "Clínicas de nutrição"], // MOCK
            foto: "/images/cursos/tecnico-nutricao.jpg",
          },
        ],
      },
      {
        area: "Indústria & Tecnologia",
        itens: [
          {
            slug: "tecnico-eletromecanica", nome: "Técnico em Eletromecânica", area: "Indústria & Tecnologia", // MOCK
            titulacao: "Curso Técnico", duracao: "18 a 24 meses", // MOCK
            turnos: [], modalidade: "Presencial",
            resumo: "Manutenção e instalação de sistemas elétricos e mecânicos industriais.", // MOCK
            descricao:
              "Capacita para operar, instalar e manter sistemas eletromecânicos em indústrias, integrando conhecimentos de eletricidade, mecânica e automação com prática em laboratório.", // MOCK
            diferenciais: [
              "Prática em laboratório de eletromecânica e automação", // MOCK
              "Formação integrada de elétrica e mecânica industrial", // MOCK
              "Professores com experiência no setor industrial", // MOCK
            ],
            mercado: ["Indústrias", "Manutenção industrial", "Automação", "Empresas de energia"], // MOCK
            foto: "/images/cursos/tecnico-eletromecanica.jpg",
          },
          {
            slug: "tecnico-eletrotecnica", nome: "Técnico em Eletrotécnica", area: "Indústria & Tecnologia", // MOCK
            titulacao: "Curso Técnico", duracao: "18 a 24 meses", // MOCK
            turnos: [], modalidade: "Presencial",
            resumo: "Instalações elétricas e sistemas de energia com base técnica sólida.", // MOCK
            descricao:
              "Forma técnicos para projetar, instalar e manter sistemas elétricos residenciais, comerciais e industriais, com foco em segurança e normas técnicas brasileiras.", // MOCK
            diferenciais: [
              "Prática em instalações elétricas e comandos", // MOCK
              "Formação conforme normas técnicas brasileiras (ABNT/NR)", // MOCK
              "Base em projetos elétricos residenciais e industriais", // MOCK
            ],
            mercado: ["Construtoras", "Indústrias", "Concessionárias de energia", "Manutenção predial"], // MOCK
            foto: "/images/cursos/tecnico-eletrotecnica.jpg",
          },
        ],
      },
      {
        area: "Meio Ambiente",
        itens: [
          {
            slug: "tecnico-meio-ambiente", nome: "Técnico em Meio Ambiente", area: "Meio Ambiente", // MOCK
            titulacao: "Curso Técnico", duracao: "18 a 24 meses", // MOCK
            turnos: [], modalidade: "Presencial",
            resumo: "Gestão ambiental e monitoramento com foco em sustentabilidade.", // MOCK
            descricao:
              "Forma profissionais para atuar no monitoramento, controle ambiental e gestão de resíduos em empresas, órgãos públicos e consultorias, com prática em coleta e análise ambiental.", // MOCK
            diferenciais: [
              "Formação em gestão de resíduos e controle ambiental", // MOCK
              "Base em legislação ambiental e sustentabilidade", // MOCK
              "Prática em coleta e análise de amostras ambientais", // MOCK
            ],
            mercado: ["Empresas industriais", "Órgãos ambientais", "Consultorias", "Saneamento"], // MOCK
            foto: "/images/cursos/tecnico-meio-ambiente.jpg",
          },
        ],
      },
    ],
  },

  diferenciais: {
    eyebrow: "Por que a Florence.",
    lead: {
      titulo: "Formação prática\npara o mercado.",
      corpo:
        "Você aprende fazendo, com laboratórios e prática desde o início, para sair pronto para trabalhar.",
    },
    pontos: [
      {
        titulo: "Professores que atuam na área",
        corpo:
          "Profissionais do mercado que ensinam o que realmente é feito no dia a dia.",
      },
      {
        titulo: "Formação rápida e direta ao ponto",
        corpo:
          "Qualificação técnica focada no que o mercado precisa, em menos tempo.",
      },
    ],
  },

  ingresso: {
    eyebrow: "Matrícula",
    titulo: "Matrícula\nsimples.",
    subtitulo: "Sem vestibular. Você se matricula com documentos básicos.",
    formas: [
      { nome: "Documentos pessoais", descricao: "RG e CPF." },
      { nome: "Comprovante de escolaridade", descricao: "Conforme o curso (ensino médio completo ou em andamento)." },
      { nome: "Comprovante de residência", descricao: "Atualizado." },
      { nome: "Foto 3x4", descricao: "Uma foto recente." },
    ],
  },

  financiamento: {
    eyebrow: "Investimento",
    titulo: "Mensalidade que\ncabe no bolso.",
    descricao:
      "Condições de pagamento flexíveis e o programa Corporativo Florence para quem trabalha em empresas parceiras.",
    itens: [
      { nome: "Parcelamento", descricao: "Mensalidades acessíveis." },
      { nome: "Corporativo Florence", descricao: "Descontos para funcionários de empresas parceiras." },
      { nome: "Florence Fidelidade", descricao: "Condições especiais para a comunidade Florence." },
      { nome: "Matrícula facilitada", descricao: "Comece rápido, sem burocracia." },
    ],
  },

  // Mock/oculto ate o cliente enviar depoimentos reais.
  depoimentos: {
    ativo: false,
    titulo: "Quem se forma\nna Florence.",
    cards: [
      { nome: "Aluno Florence", turma: "Turma 2024", texto: "Depoimento de exemplo (mock).", foto: "" }, // MOCK
      { nome: "Aluna Florence", turma: "Turma 2023", texto: "Depoimento de exemplo (mock).", foto: "" }, // MOCK
    ],
  },

  ctaFinal: {
    headline: "Comece a sua qualificação técnica.",
    microcopy: "Preencha e fale com o nosso time hoje.",
  },

  obrigado: {
    headline: "Recebemos o seu cadastro!",
    corpo: "Nosso time vai entrar em contato com você em breve.",
    ctaSecundario: { label: "Conhecer a Florence", href: "https://www.florence.edu.br" },
  },
} satisfies UmbrellaConfig;

// Lista achatada de nomes de curso para o dropdown do formulario.
export const cursoOptions: string[] = config.cursos.grupos
  .flatMap((g) => g.itens.map((c) => c.nome));
