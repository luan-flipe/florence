import type { UmbrellaConfig } from "@florence/umbrella";

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
    imageAlt: "Estudantes de Graduação da Florence",
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
    eyebrow: "Cursos",
    titulo: "Encontre o\nseu curso.",
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
            resumo: "Formação generalista com prática clínica e compromisso com o SUS.",
            descricao:
              "O curso prepara enfermeiros com visão generalista e humanista, comprometidos com a realidade social e aptos a atuar nos três níveis de atenção à saúde. A formação integra conteúdos técnico-científicos, pesquisa e participação em equipes multidisciplinares, com foco em promoção, prevenção e reabilitação.",
            diferenciais: [
              "Prática clínica supervisionada desde os primeiros períodos",
              "Formação alinhada ao SUS e à saúde coletiva",
              "Atuação em equipes multidisciplinares de saúde",
            ],
            mercado: ["Hospitais e clínicas", "Atenção básica e saúde da família", "Home care e reabilitação", "Saúde corporativa"],
            foto: "/images/cursos/enfermagem.jpg",
          },
          {
            slug: "biomedicina", nome: "Biomedicina", area: "Saúde",
            titulacao: "Bacharelado", duracao: "4 anos · 8 semestres",
            turnos: ["Matutino", "Noturno"], modalidade: "Presencial",
            resumo: "Diagnóstico, pesquisa e medicina laboratorial em uma das profissões com mais habilitações do Brasil.",
            descricao:
              "O curso forma profissionais para pesquisar doenças, analisar alterações patológicas e aprimorar diagnósticos, com base em ciências exatas, biológicas e da saúde. A grade inclui formação em biologia molecular, genética, toxicologia, reprodução humana e diagnóstico por imagem, integrando teoria e prática em laboratórios e clínicas especializadas.",
            diferenciais: [
              "Formação em 32 habilitações reconhecidas pelo CFBio",
              "Laboratórios de análises clínicas, biomolecular e toxicologia",
              "Experiência em equipes multidisciplinares de saúde",
            ],
            mercado: ["Laboratórios clínicos e hospitais", "Biologia molecular e genética", "Reprodução humana assistida", "Perícia criminal e pesquisa científica"],
            foto: "/images/cursos/biomedicina.jpg",
          },
          {
            slug: "farmacia", nome: "Farmácia", area: "Saúde",
            titulacao: "Bacharelado", duracao: "5 anos · 10 semestres",
            turnos: ["Matutino", "Noturno"], modalidade: "Presencial",
            resumo: "Do medicamento ao paciente: formação generalista com rigor científico e ética profissional.",
            descricao:
              "O curso forma farmacêuticos com base generalista, humanista, crítica e reflexiva, habilitados para atuar em produção de medicamentos, análises clínicas e toxicológicas, vigilância sanitária e atenção farmacêutica. A formação integra ciências biológicas, exatas e farmacêuticas, preparando o profissional para identificar necessidades da população e propor soluções com comprometimento social.",
            diferenciais: [
              "Formação que abrange produção, análise e atenção farmacêutica",
              "Projetos integradores com retorno do conhecimento à comunidade",
              "Base sólida em ética e rigor científico",
            ],
            mercado: ["Farmácias comunitárias e hospitalares", "Indústria farmacêutica e cosmética", "Vigilância sanitária e epidemiológica", "Laboratórios de análises clínicas"],
            foto: "/images/cursos/farmacia.jpg",
          },
          {
            slug: "fisioterapia", nome: "Fisioterapia", area: "Saúde",
            titulacao: "Bacharelado", duracao: "5 anos · 10 semestres",
            turnos: ["Matutino", "Noturno"], modalidade: "Presencial",
            resumo: "Reabilitação, promoção de saúde e autonomia profissional com formação generalista e humanista.",
            descricao:
              "O curso forma fisioterapeutas com perfil generalista, humanista, crítico e reflexivo para atuar em todos os níveis de atenção à saúde, da promoção à reabilitação. A formação prepara para atuação hospitalar, ambulatorial, esportiva e educacional, desenvolvendo também o espírito empreendedor e a capacidade de trabalho em equipes multidisciplinares.",
            diferenciais: [
              "Atuação em todos os níveis de atenção à saúde",
              "Formação para UTI, ambulatório, esporte e saúde ocupacional",
              "Desenvolvimento de visão empreendedora e autônoma",
            ],
            mercado: ["Hospitais e UTIs", "Clínicas de reabilitação", "Esporte e performance", "Saúde ocupacional e estética"],
            foto: "/images/cursos/fisioterapia.jpg",
          },
          {
            slug: "medicina", nome: "Medicina", area: "Saúde",
            titulacao: "Bacharelado", duracao: "6 anos · 12 semestres",
            turnos: ["Integral"], modalidade: "Presencial",
            resumo: "Formação médica completa, do ciclo básico ao internato hospitalar.",
            descricao:
              "O curso estrutura a formação em três fases progressivas: ciclo básico com anatomia, fisiologia e bioquímica, ciclo clínico com as grandes especialidades e internato de dois anos em hospitais e ambulatórios parceiros. A proposta forma médicos com competência técnica, empatia e capacidade de decisão nos mais variados contextos de saúde.",
            diferenciais: [
              "Internato de dois anos em unidades hospitalares e ambulatoriais",
              "Formação em ciclos progressivos com profundidade crescente",
              "Ênfase em empatia, ética e comunicação com o paciente",
            ],
            mercado: ["Clínica geral e medicina de família", "Residência médica e especialidades", "Saúde pública e gestão hospitalar", "Pesquisa e educação médica"],
            foto: "/images/cursos/medicina.jpg",
          },
          {
            slug: "medicina-veterinaria", nome: "Medicina Veterinária", area: "Saúde",
            titulacao: "Bacharelado", duracao: "5 anos · 10 semestres",
            turnos: ["Integral"], modalidade: "Presencial",
            resumo: "Saúde animal, bem-estar e saúde pública em uma formação de amplo espectro.",
            descricao:
              "O curso prepara médicos veterinários para garantir a saúde e o bem-estar de animais e humanos, com formação que abrange clínica, cirurgia, medicina preventiva, produção animal e inspeção de alimentos. A estrutura atende à crescente demanda do mercado de pets, animais exóticos e agropecuária, com metodologia moderna e corpo docente especializado.",
            diferenciais: [
              "Formação que abrange pets, exóticos e produção animal",
              "Clínica, cirurgia, medicina preventiva e saúde pública",
              "Preparação para docência, pesquisa e extensão",
            ],
            mercado: ["Clínica e cirurgia veterinária", "Produção animal e agropecuária", "Inspeção e tecnologia de alimentos", "Saúde pública e vigilância sanitária animal"],
            foto: "/images/cursos/medicina-veterinaria.jpg",
          },
          {
            slug: "nutricao", nome: "Nutrição", area: "Saúde",
            titulacao: "Bacharelado", duracao: "4 anos · 8 semestres",
            turnos: ["Noturno"], modalidade: "Presencial",
            resumo: "Alimentação como ferramenta de saúde: clínica, coletiva, esportiva e industrial.",
            descricao:
              "O curso forma nutricionistas com visão crítica da realidade social, capacitados para assistência nutricional individual e coletiva, promoção de segurança alimentar e atenção à saúde em diferentes contextos. A formação multidisciplinar integra inovações científicas, alinhamento ao SUS e competências para resolver problemas de saúde prevalentes na população.",
            diferenciais: [
              "Formação multidisciplinar com alinhamento ao SUS",
              "Atuação em clínica, coletividade, indústria e academia",
              "Capacitação em nutrição esportiva, estética e fitoterapia",
            ],
            mercado: ["Clínicas, consultórios e hospitais", "Alimentação coletiva e catering", "Indústria alimentícia", "Saúde pública e vigilância sanitária"],
            foto: "/images/cursos/nutricao.jpg",
          },
          {
            slug: "odontologia", nome: "Odontologia", area: "Saúde",
            titulacao: "Bacharelado", duracao: "5 anos · 10 semestres",
            turnos: ["Integral"], modalidade: "Presencial",
            resumo: "Cirurgião-dentista com formação técnica, ética e visão humanista integradas.",
            descricao:
              "O curso prepara cirurgiões-dentistas generalistas para diagnosticar e tratar doenças bucais prevalentes, integrar equipes multidisciplinares de saúde e atuar com responsabilidade ética e social. A formação combina rigor técnico-científico com construção humanística, preparando para a clínica privada, o SUS, a pesquisa e o ensino.",
            diferenciais: [
              "Sólida formação técnico-científica aliada à humanização",
              "Atuação em saúde pública e promoção comunitária",
              "Preparação para clínica geral e especialidades odontológicas",
            ],
            mercado: ["Clínica privada e consultórios", "Serviços públicos de saúde bucal", "Especialidades odontológicas", "Pesquisa e docência"],
            foto: "/images/cursos/odontologia.jpg",
          },
          {
            slug: "estetica-cosmetica", nome: "Estética e Cosmética", area: "Saúde",
            titulacao: "Tecnólogo", duracao: "2,5 anos · 5 semestres",
            turnos: ["Matutino", "Noturno"], modalidade: "Presencial",
            resumo: "Estética facial, corporal e capilar com formação prática e base científica em 2,5 anos.",
            descricao:
              "O curso tecnológico capacita para identificar e executar procedimentos estéticos faciais, corporais e capilares, além de técnicas de visagismo, maquiagem e cosmetologia. A formação combina laboratórios especializados com base conceitual sólida, preparando tanto para a atuação imediata no mercado quanto para a gestão de negócios na área.",
            diferenciais: [
              "Formação completa em 2,5 anos, em um segmento em expansão",
              "Laboratórios especializados com prática desde o início",
              "Capacitação para atuar e gerir negócios na área estética",
            ],
            mercado: ["Clínicas de estética e medicina estética", "Spas, academias e salões", "Consultoria em cosméticos e equipamentos", "Hotéis, resorts e instituições de ensino"],
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
            resumo: "Formação humanista e técnico-científica com prática jurídica real.",
            descricao:
              "O curso oferece sólida formação humanista e técnico-científica, preparando bacharéis para compreender os fenômenos jurídicos dentro de contextos sociais mais amplos e com postura crítica e reflexiva. A grade contempla as dimensões múltiplas das Ciências Jurídicas, desenvolve autonomia de aprendizado e capacita para o trabalho em equipe nas mais diversas carreiras do Direito.",
            diferenciais: [
              "Núcleo Integrado de Prática Jurídica",
              "Visão crítica e interdisciplinar das Ciências Jurídicas",
              "Corpo docente atuante na advocacia e nas carreiras públicas",
            ],
            mercado: ["Advocacia pública e privada", "Magistratura estadual e federal", "Ministério Público e Defensoria", "Procuradorias e cargos exclusivos de bacharel"],
            foto: "/images/cursos/direito.jpg",
          },
          {
            slug: "administracao", nome: "Administração (EAD)", area: "Sociais & Gestão",
            titulacao: "Bacharelado", duracao: "Conforme matriz EAD",
            turnos: ["EAD"], modalidade: "EAD",
            resumo: "Formação em gestão com a flexibilidade do EAD e suporte de coordenação especializada.",
            descricao:
              "O curso de Administração EAD da Florence permite estudar no próprio ritmo, com acesso a aulas e materiais conforme a conveniência do aluno. A proposta combina flexibilidade com seriedade acadêmica: coordenação especializada, suporte contínuo das equipes NEAD e SECAD, avaliações presenciais nos laboratórios da instituição e orientação para estágios ao longo da formação.",
            diferenciais: [
              "Estudo flexível com suporte de equipe especializada",
              "Avaliações presenciais para garantir qualidade da formação",
              "Orientação para estágios desde o início do curso",
            ],
            mercado: ["Gestão empresarial e corporativa", "Empreendedorismo e startups", "Consultoria organizacional", "Setor público e terceiro setor"],
            foto: "/images/cursos/administracao.jpg",
          },
        ],
      },
    ],
  },

  diferenciais: {
    eyebrow: "Por que a Florence.",
    lead: {
      titulo: "Prática desde\no início.",
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
    eyebrow: "Ingresso",
    titulo: "Seis formas\nde entrar.",
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
    eyebrow: "Bolsas & Financiamento",
    titulo: "Estudar pode custar menos\ndo que você imagina.",
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
    titulo: "Quem estuda\nna Florence.",
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
} satisfies UmbrellaConfig;

// Lista achatada de nomes de curso para o dropdown do formulario.
export const cursoOptions: string[] = config.cursos.grupos
  .flatMap((g) => g.itens.map((c) => c.nome));
