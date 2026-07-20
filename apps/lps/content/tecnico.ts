import type { UmbrellaConfig } from "@florence/umbrella";

export const config = {
  meta: {
    title: "Técnico em Enfermagem e Especializações | Centro Universitário Florence",
    description:
      "Forme-se Técnico em Enfermagem em São Luís e avance com as especializações em Instrumentação Cirúrgica e Enfermagem do Trabalho. Prática em hospitais e clínicas desde o início.",
  },

  hero: {
    eyebrow: "Técnico em Enfermagem · São Luís, MA",
    headline: "Sua carreira na saúde\ncomeça aqui.",
    subheadline:
      "Forme-se Técnico em Enfermagem com prática supervisionada em hospitais, clínicas e unidades de saúde. E vá além com as especializações em Instrumentação Cirúrgica e Enfermagem do Trabalho.",
    imageAlt: "Profissional de enfermagem em atendimento hospitalar",
    heroImage: "/images/tecnico/hero.jpg",
    logo: { src: "/images/tecnico/logo-instituto-branco.png", width: 135, height: 60, alt: "Instituto Florence" },
    stats: [
      { value: "Enfermagem", label: "curso técnico" },
      { value: "2", label: "especializações" },
      { value: "Presencial", label: "modalidade" },
    ],
  },

  // Urgencia config-driven: ativo=false some sem mexer no layout.
  prazo: { ativo: false, texto: "Matrículas abertas" },

  formulario: {
    titulo: "Dê o primeiro passo.",
    subtitulo: "Escolha o curso e nosso time entra em contato.",
    cta: "Quero me matricular",
    lgpd: "Ao enviar, você autoriza o contato da Florence. Não compartilhamos seus dados.",
    cursoLabel: "Curso de interesse",
    cursoPlaceholder: "Escolha um curso",
  },

  cursos: {
    eyebrow: "Cursos",
    titulo: "Técnico e\nespecializações.",
    subtitulo: "Comece pelo curso técnico e avance com as especializações.",
    grupos: [
      {
        area: "Curso Técnico",
        itens: [
          {
            slug: "tecnico-enfermagem", nome: "Técnico em Enfermagem", area: "Curso Técnico",
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
        ],
      },
      {
        area: "Especializações Técnicas",
        itens: [
          {
            slug: "instrumentacao-cirurgica", nome: "Instrumentação Cirúrgica", area: "Especializações Técnicas",
            titulacao: "Especialização Técnica", duracao: "9 meses",
            turnos: [], modalidade: "Presencial",
            resumo: "Especialização que prepara o técnico para instrumentar cirurgias em centro cirúrgico, ao lado de cirurgiões e enfermeiros.",
            descricao:
              "Você se especializa para instrumentar cirurgias de diferentes níveis de complexidade, atuando ao lado de cirurgiões e enfermeiros no centro cirúrgico. O curso reúne 220 horas teóricas e 105 horas de estágio supervisionado, com foco em limpeza, esterilização e manejo dos instrumentais. Ao concluir, você está apto a atuar em salas de cirurgia, salas de anestesia e centrais de material e esterilização.",
            diferenciais: [
              "Estágio supervisionado de 105 horas em ambiente cirúrgico real",
              "Formação específica em esterilização e manejo de instrumentais",
              "Atuação integrada com a equipe médica e de enfermagem",
            ],
            mercado: ["Salas de cirurgia", "Salas de anestesia", "Centrais de material e esterilização", "Hospitais e clínicas"],
            foto: "/images/tecnico/cursos/instrumentacao-cirurgica.jpg",
          },
          {
            slug: "enfermagem-do-trabalho", nome: "Enfermagem do Trabalho", area: "Especializações Técnicas",
            titulacao: "Especialização Técnica", duracao: "9 meses",
            turnos: [], modalidade: "Presencial",
            resumo: "Especialização em saúde e segurança ocupacional para atuar no cuidado à saúde do trabalhador.",
            descricao:
              "Você se especializa em saúde e segurança ocupacional, uma das áreas que mais crescem na enfermagem. A formação atende à Norma Regulamentadora NR-4, que exige o enfermeiro do trabalho nas equipes de SESMT, e soma 305 horas teóricas com 40 horas de estágio supervisionado. Ao concluir, você pode atuar em empresas, hospitais e clínicas cuidando da saúde do trabalhador.",
            diferenciais: [
              "Formação alinhada à Norma Regulamentadora NR-4",
              "Estágio supervisionado em saúde ocupacional",
              "Atuação nas equipes de SESMT das empresas",
            ],
            mercado: ["Empresas e indústrias", "Equipes de SESMT", "Hospitais e clínicas", "Instituições de saúde"],
            foto: "/images/tecnico/cursos/enfermagem-do-trabalho.jpg",
          },
        ],
      },
    ],
  },

  diferenciais: {
    eyebrow: "Por que a Florence.",
    lead: {
      titulo: "Formação prática\npara a saúde.",
      corpo:
        "Você aprende fazendo, com laboratórios e prática desde o início, para sair pronto para cuidar de pessoas.",
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
    headline: "Comece a sua carreira na enfermagem.",
    microcopy: "Preencha e fale com o nosso time hoje.",
  },

  obrigado: {
    headline: "Recebemos o seu cadastro!",
    corpo: "Nosso time vai entrar em contato com você em breve.",
    ctaSecundario: { label: "Conhecer a Florence", href: "https://www.florence.edu.br" },
  },

  whatsapp: {
    numero: "5598988630502",
    mensagem: "Olá! Tenho interesse no Técnico em Enfermagem da Florence.",
  },
} satisfies UmbrellaConfig;

// Lista achatada de nomes de curso para o dropdown do formulario.
export const cursoOptions: string[] = config.cursos.grupos
  .flatMap((g) => g.itens.map((c) => c.nome));
