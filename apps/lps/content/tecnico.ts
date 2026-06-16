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
    heroImage: "/images/tecnico/hero.jpg",
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
            slug: "tecnico-enfermagem", nome: "Técnico em Enfermagem", area: "Saúde",
            titulacao: "Curso Técnico", duracao: "22 meses",
            turnos: [], modalidade: "Presencial",
            resumo: "Elo entre paciente e equipe médica, com prática supervisionada em hospitais, clínicas e unidades básicas de saúde.",
            descricao:
              "Você aprende a realizar curativos, administrar medicamentos e assistir a equipe de saúde em ambientes hospitalares e ambulatoriais. O curso combina 1.200 horas de aulas teórico-práticas com 600 horas de estágio supervisionado em cenários reais. Ao concluir, você está habilitado a atuar em hospitais privados, UTIs, centros cirúrgicos, UBS e clínicas.",
            diferenciais: [
              "Infraestrutura de simulação realística para treino antes do estágio",
              "Estágio supervisionado de 600 horas em serviços de saúde reais",
              "Formação disponível na modalidade concomitante ou subsequente ao ensino médio",
            ],
            mercado: ["Hospitais e UTIs", "Centros cirúrgicos", "Unidades Básicas de Saúde", "Clínicas e consultórios", "Home care e casas de repouso"],
            foto: "/images/tecnico/cursos/tecnico-enfermagem.jpg",
          },
          {
            slug: "tecnico-estetica", nome: "Técnico em Estética", area: "Saúde",
            titulacao: "Curso Técnico", duracao: "20 meses",
            turnos: [], modalidade: "Presencial",
            resumo: "Procedimentos estéticos faciais e corporais com base em saúde da pele, cosmetologia e operação de equipamentos profissionais.",
            descricao:
              "O curso forma o profissional responsável pela segurança do paciente durante procedimentos estéticos: você aprende sobre saúde da pele, cosméticos, massagens corporais e operação de equipamentos estéticos. São 1.275 horas de aulas teórico-práticas e 200 horas de estágio supervisionado. A saída profissional é ampla, de clínicas e spas ao atendimento autônomo em parceria com dermatologistas e fisioterapeutas.",
            diferenciais: [
              "Laboratório de práticas estéticas equipado para treino real",
              "Currículo que cobre saúde da pele, cosmetologia e equipamentos estéticos",
              "Estágio supervisionado de 200 horas garantido pela instituição",
            ],
            mercado: ["Clínicas de estética e dermatologia", "Spas e salões", "Centros de bem-estar", "Atendimento autônomo", "Suporte a fisioterapeutas e nutricionistas"],
            foto: "/images/tecnico/cursos/tecnico-estetica.jpg",
          },
          {
            slug: "tecnico-analises-clinicas", nome: "Técnico em Análises Clínicas", area: "Saúde",
            titulacao: "Curso Técnico", duracao: "20 meses",
            turnos: [], modalidade: "Presencial",
            resumo: "Análises laboratoriais com coleta, processamento e operação de equipamentos em laboratórios clínicos e bancos de sangue.",
            descricao:
              "Você aprende a executar rotinas laboratoriais, coletar e distribuir material biológico, operar equipamentos de análise e auxiliar em urgências clínicas. O curso soma 1.275 horas de aulas práticas e teóricas com 200 horas de estágio obrigatório garantido. Formados atuam em laboratórios privados, bancos de sangue, hospitais e clínicas universitárias.",
            diferenciais: [
              "Laboratório de análises clínicas com equipamentos de uso profissional",
              "Estágio obrigatório garantido pela instituição",
              "Metodologia focada em atividades práticas que simulam o ambiente real de trabalho",
            ],
            mercado: ["Laboratórios clínicos privados", "Bancos de sangue", "Hospitais e unidades de saúde", "Laboratórios universitários", "Clínicas diagnósticas"],
            foto: "/images/tecnico/cursos/tecnico-analises-clinicas.jpg",
          },
          {
            slug: "tecnico-saude-bucal", nome: "Técnico em Saúde Bucal", area: "Saúde",
            titulacao: "Curso Técnico", duracao: "20 meses",
            turnos: [], modalidade: "Presencial",
            resumo: "Suporte especializado ao cirurgião-dentista em procedimentos clínicos, esterilização de equipamentos e promoção de saúde bucal.",
            descricao:
              "Você aprende a auxiliar em procedimentos odontológicos, esterilizar instrumentais, orientar pacientes sobre prevenção e atuar em programas de saúde bucal coletiva. O curso reúne 1.200 horas de formação teórico-prática e 200 horas de estágio supervisionado em clínicas e unidades de saúde. Ao se formar, você pode atuar no SUS, em hospitais públicos e privados e em consultórios odontológicos.",
            diferenciais: [
              "Laboratórios modernos com metodologia centrada na prática clínica",
              "Estágio supervisionado de 200 horas em ambientes odontológicos reais",
              "Formação válida para atuação no SUS e em consultórios privados",
            ],
            mercado: ["Consultórios odontológicos", "Unidades Básicas de Saúde", "Hospitais públicos e privados", "Programas de saúde bucal escolar", "Clínicas especializadas"],
            foto: "/images/tecnico/cursos/tecnico-saude-bucal.jpg",
          },
          {
            slug: "tecnico-nutricao", nome: "Técnico em Nutrição", area: "Saúde",
            titulacao: "Curso Técnico", duracao: "20 meses",
            turnos: [], modalidade: "Presencial",
            resumo: "Apoio técnico ao nutricionista no preparo de dietas, monitoramento alimentar e orientação em serviços de saúde e alimentação coletiva.",
            descricao:
              "O curso prepara você para monitorar o preparo de alimentos, compreender as necessidades nutricionais dos pacientes e apoiar o nutricionista em clínicas, hospitais e serviços de alimentação coletiva. São 1.200 horas de aulas teórico-práticas e 200 horas de estágio supervisionado. A formação abre portas em hospitais, escolas, empresas e serviços de nutrição clínica.",
            diferenciais: [
              "Infraestrutura prática projetada para simular ambientes reais de trabalho",
              "Currículo que integra técnica dietética, nutrição clínica e alimentação coletiva",
              "Estágio supervisionado de 200 horas garantido pela instituição",
            ],
            mercado: ["Hospitais e clínicas", "Serviços de alimentação coletiva (UAN)", "Escolas e creches", "Empresas com restaurante corporativo", "Consultórios de nutrição"],
            foto: "/images/tecnico/cursos/tecnico-nutricao.jpg",
          },
        ],
      },
      {
        area: "Indústria & Tecnologia",
        itens: [
          {
            slug: "tecnico-eletromecanica", nome: "Técnico em Eletromecânica", area: "Indústria & Tecnologia",
            titulacao: "Curso Técnico", duracao: "20 meses",
            turnos: [], modalidade: "Presencial",
            resumo: "Manutenção, instalação e operação de sistemas elétricos e mecânicos em indústrias de qualquer porte.",
            descricao:
              "Você aprende a analisar a qualidade e o funcionamento de máquinas, operar e manter sistemas eletromecânicos e atuar em projetos industriais que exigem conhecimento integrado de elétrica e mecânica. O curso soma 1.200 horas de aulas teórico-práticas e 180 horas de estágio supervisionado. As oportunidades de trabalho vão de empresas de energia e usinas a indústrias de manufatura em geral.",
            diferenciais: [
              "Infraestrutura que replica condições reais de chão de fábrica",
              "Currículo integrado de eletricidade e mecânica industrial",
              "Estágio supervisionado de 180 horas em ambiente industrial",
            ],
            mercado: ["Indústrias de manufatura", "Empresas de energia e geração", "Usinas e refinarias", "Manutenção industrial", "Automação e controle de processos"],
            foto: "/images/tecnico/cursos/tecnico-eletromecanica.jpg",
          },
          {
            slug: "tecnico-eletrotecnica", nome: "Técnico em Eletrotécnica", area: "Indústria & Tecnologia",
            titulacao: "Curso Técnico", duracao: "22 meses",
            turnos: [], modalidade: "Presencial",
            resumo: "Instalação, operação e manutenção de sistemas elétricos residenciais, comerciais e industriais, com foco em energia e telecomunicações.",
            descricao:
              "Você aprende a instalar e manter sistemas de geração, transmissão e distribuição de energia elétrica, além de desenvolver projetos elétricos e de infraestrutura de telecomunicações para edificações. O curso combina 1.200 horas de formação teórico-prática com 200 horas de estágio supervisionado. O mercado é amplo: das construtoras às empresas de energia alternativa, passando por indústrias e telecomunicações.",
            diferenciais: [
              "Formação 360 graus: instalações residenciais, comerciais e industriais",
              "Laboratórios equipados para prática em sistemas elétricos reais",
              "Estágio supervisionado de 200 horas garantido pela instituição",
            ],
            mercado: ["Empresas de geração e distribuição de energia", "Construtoras e incorporadoras", "Indústrias", "Energia alternativa e renovável", "Projetos de telecomunicações e infraestrutura"],
            foto: "/images/tecnico/cursos/tecnico-eletrotecnica.jpg",
          },
        ],
      },
      {
        area: "Meio Ambiente",
        itens: [
          {
            slug: "tecnico-meio-ambiente", nome: "Técnico em Meio Ambiente", area: "Meio Ambiente",
            titulacao: "Curso Técnico", duracao: "14 meses",
            turnos: [], modalidade: "Presencial",
            resumo: "Monitoramento ambiental, conformidade legal e gestão de programas de sustentabilidade em empresas e órgãos públicos.",
            descricao:
              "Você aprende a apoiar engenheiros ambientais no monitoramento de conformidade legal, organizar programas de educação ambiental e desenvolver projetos de preservação para empresas que utilizam recursos naturais. O curso reúne 800 horas de aulas teórico-práticas e 200 horas de estágio supervisionado, formando o profissional em pouco mais de um ano. A demanda cresce à medida que empresas adotam práticas ecologicamente responsáveis.",
            diferenciais: [
              "Formação concluída em 14 meses, com entrada rápida no mercado",
              "Currículo focado em legislação ambiental, gestão de riscos e educação ambiental",
              "Estágio supervisionado de 200 horas garantido pela instituição",
            ],
            mercado: ["Empresas mineradoras e madeireiras", "Indústrias com licenciamento ambiental", "Órgãos públicos de meio ambiente", "Consultorias ambientais", "Saneamento básico"],
            foto: "/images/tecnico/cursos/tecnico-meio-ambiente.jpg",
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
        titulo: "Infraestrutura para a prática",
        corpo:
          "Laboratórios e ambientes que reproduzem o cenário profissional desde o início.",
      },
      {
        titulo: "Parcerias com empresas",
        corpo:
          "Convênios que aproximam você do estágio e da primeira oportunidade no mercado.",
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

  whatsapp: {
    numero: "5598988630502",
    mensagem: "Olá! Tenho interesse nos cursos técnicos da Florence.",
  },
} satisfies UmbrellaConfig;

// Lista achatada de nomes de curso para o dropdown do formulario.
export const cursoOptions: string[] = config.cursos.grupos
  .flatMap((g) => g.itens.map((c) => c.nome));
