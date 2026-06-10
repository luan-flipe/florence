export const config = {
  meta: {
    title: "Pós-graduação no Centro Universitário Florence | Especializações em São Luís",
    description:
      "Especializações em Saúde, Odontologia, Direito e Estética, com professores de excelência e conclusão a partir de 13 meses. Sem vestibular, por análise de documentos.",
  },

  hero: {
    eyebrow: "Pós-graduação · São Luís, MA",
    headline: "Especialize-se com quem atua na área.",
    subheadline:
      "Pós-graduação em Saúde, Odontologia, Direito e Estética, com professores de excelência e conclusão a partir de 13 meses.",
    stats: [
      { value: "18+", label: "especializações" },
      { value: "13 meses", label: "para concluir" },
      { value: "4", label: "áreas" },
    ],
    cta: "Quero me especializar",
  },

  // Urgencia config-driven: ativo=false some sem mexer no layout.
  prazo: { ativo: false, texto: "Inscrições abertas" },

  formulario: {
    titulo: "Dê o próximo passo.",
    subtitulo: "Escolha sua especialização e nosso time entra em contato.",
    cta: "Quero me especializar",
    lgpd: "Ao enviar, você autoriza o contato da Florence. Não compartilhamos seus dados.",
    cursoLabel: "Curso de interesse",
    cursoPlaceholder: "Escolha a especialização",
  },

  cursos: {
    titulo: "Encontre sua especialização.",
    subtitulo:
      "Escolha a área e dê o próximo passo na carreira.",
    grupos: [
      {
        area: "Saúde",
        itens: [
          {
            slug: "analises-clinicas-diagnostico-laboratorial",
            nome: "Análises Clínicas e Diagnóstico Laboratorial",
            area: "Saúde",
            titulacao: "Especialização",
            duracao: "12 a 24 meses", // MOCK
            turnos: [],
            modalidade: "Presencial",
            resumo: "Diagnóstico laboratorial avançado aplicado à prática clínica.", // MOCK
            descricao:
              "Aprofunda a formação em análises clínicas, hematologia, microbiologia e bioquímica, preparando o profissional para atuar em laboratórios de alta complexidade.", // MOCK
            diferenciais: [
              "Conteúdo atualizado com as diretrizes do CFB e CFBio", // MOCK
              "Professores atuantes em laboratórios clínicos de referência", // MOCK
              "Foco em diagnóstico molecular e automação laboratorial", // MOCK
            ],
            mercado: ["Laboratórios clínicos", "Hemocentros", "Indústria diagnóstica", "Vigilância sanitária"], // MOCK
            foto: "/images/cursos/analises-clinicas-diagnostico-laboratorial.jpg",
          },
          {
            slug: "bioquimica-clinica",
            nome: "Bioquímica Clínica",
            area: "Saúde",
            titulacao: "Especialização",
            duracao: "12 a 24 meses", // MOCK
            turnos: [],
            modalidade: "Presencial",
            resumo: "Especialização em bioquímica aplicada ao diagnóstico e pesquisa clínica.", // MOCK
            descricao:
              "Capacita o profissional para interpretar e desenvolver análises bioquímicas em contextos laboratoriais e de pesquisa, com ênfase em marcadores metabólicos e doenças crônicas.", // MOCK
            diferenciais: [
              "Integração entre bioquímica clínica e farmacologia", // MOCK
              "Laboratórios equipados para análises metabólicas", // MOCK
              "Corpo docente com atuação em pesquisa aplicada", // MOCK
            ],
            mercado: ["Laboratórios de análises clínicas", "Indústria farmacêutica", "Pesquisa científica", "Hospitais"], // MOCK
            foto: "/images/cursos/bioquimica-clinica.jpg",
          },
          {
            slug: "emagrecimento-obesidade",
            nome: "Emagrecimento e Obesidade",
            area: "Saúde",
            titulacao: "Especialização",
            duracao: "12 a 24 meses", // MOCK
            turnos: [],
            modalidade: "Presencial",
            resumo: "Abordagem multiprofissional no tratamento do sobrepeso e obesidade.", // MOCK
            descricao:
              "Forma profissionais de saúde para o manejo clínico e nutricional da obesidade, integrando evidências científicas atuais sobre comportamento alimentar, cirurgia bariátrica e farmacoterapia.", // MOCK
            diferenciais: [
              "Visão multiprofissional e interdisciplinar", // MOCK
              "Atualização em farmacoterapia e cirurgia bariátrica", // MOCK
              "Abordagem comportamental e psicológica do paciente", // MOCK
            ],
            mercado: ["Clínicas de emagrecimento", "Hospitais", "Consultórios de nutrição e endocrinologia", "Planos de saúde"], // MOCK
            foto: "/images/cursos/emagrecimento-obesidade.jpg",
          },
          {
            slug: "enfermagem-oncologica",
            nome: "Enfermagem Oncológica",
            area: "Saúde",
            titulacao: "Especialização",
            duracao: "12 a 24 meses", // MOCK
            turnos: [],
            modalidade: "Presencial",
            resumo: "Cuidado especializado ao paciente oncológico em todas as fases do tratamento.", // MOCK
            descricao:
              "Prepara o enfermeiro para atuar na assistência integral ao paciente com câncer, desde a prevenção e diagnóstico até o tratamento, reabilitação e cuidados paliativos.", // MOCK
            diferenciais: [
              "Foco em oncologia clínica e cuidados paliativos", // MOCK
              "Professores com atuação em unidades oncológicas de referência", // MOCK
              "Atualização em protocolos de quimio e imunoterapia", // MOCK
            ],
            mercado: ["Hospitais oncológicos", "UNACON e CACON", "Clínicas de oncologia", "Cuidados paliativos"], // MOCK
            foto: "/images/cursos/enfermagem-oncologica.jpg",
          },
          {
            slug: "farmacia-clinica-hospitalar",
            nome: "Farmácia Clínica e Hospitalar",
            area: "Saúde",
            titulacao: "Especialização",
            duracao: "12 a 24 meses", // MOCK
            turnos: [],
            modalidade: "Presencial",
            resumo: "Farmacêutico clínico no cuidado direto ao paciente e na gestão do medicamento.", // MOCK
            descricao:
              "Desenvolve competências para a atuação do farmacêutico em ambientes hospitalares, com foco em farmacovigilância, interações medicamentosas, conciliação e farmácia clínica.", // MOCK
            diferenciais: [
              "Foco em conciliação medicamentosa e farmacovigilância", // MOCK
              "Professores com atuação em hospitais de ensino", // MOCK
              "Atualização em prescrição farmacêutica e farmácia clínica", // MOCK
            ],
            mercado: ["Hospitais", "UTIs", "Clínicas especializadas", "Planos de saúde"], // MOCK
            foto: "/images/cursos/farmacia-clinica-hospitalar.jpg",
          },
          {
            slug: "fisioterapia-geriatria-gerontologia",
            nome: "Fisioterapia em Geriatria e Gerontologia",
            area: "Saúde",
            titulacao: "Especialização",
            duracao: "12 a 24 meses", // MOCK
            turnos: [],
            modalidade: "Presencial",
            resumo: "Reabilitação e promoção de saúde voltadas ao paciente idoso.", // MOCK
            descricao:
              "Capacita o fisioterapeuta para atuar na prevenção, avaliação e reabilitação funcional do idoso, considerando as particularidades do envelhecimento saudável e das síndromes geriátricas.", // MOCK
            diferenciais: [
              "Abordagem biopsicossocial do envelhecimento", // MOCK
              "Atualização em tecnologias assistivas e reabilitação funcional", // MOCK
              "Professores atuantes em serviços geriátricos e ILPI", // MOCK
            ],
            mercado: ["ILPI e residenciais para idosos", "Hospitais geriatria", "Clínicas de reabilitação", "Saúde pública"], // MOCK
            foto: "/images/cursos/fisioterapia-geriatria-gerontologia.jpg",
          },
          {
            slug: "fitoterapia-suplementacao-nutricional",
            nome: "Fitoterapia e Suplementação Nutricional",
            area: "Saúde",
            titulacao: "Especialização",
            duracao: "12 a 24 meses", // MOCK
            turnos: [],
            modalidade: "Presencial",
            resumo: "Uso racional de fitoterápicos e suplementos na prática clínica.", // MOCK
            descricao:
              "Forma profissionais para a prescrição baseada em evidências de fitoterápicos e suplementos, integrando a medicina integrativa com a prática clínica convencional.", // MOCK
            diferenciais: [
              "Base em farmacognosia e fitoquímica aplicada", // MOCK
              "Enfoque em evidências científicas e segurança ao paciente", // MOCK
              "Aplicação em nutrição clínica, farmácia e medicina integrativa", // MOCK
            ],
            mercado: ["Consultórios de nutrição e farmácia", "Clínicas de medicina integrativa", "Indústria de suplementos", "Drogarias e farmácias de manipulação"], // MOCK
            foto: "/images/cursos/fitoterapia-suplementacao-nutricional.jpg",
          },
          {
            slug: "nutricao-clinica-esportiva",
            nome: "Nutrição Clínica e Esportiva",
            area: "Saúde",
            titulacao: "Especialização",
            duracao: "12 a 24 meses", // MOCK
            turnos: [],
            modalidade: "Presencial",
            resumo: "Nutrição avançada voltada à clínica e ao desempenho esportivo.", // MOCK
            descricao:
              "Aprofunda a formação do nutricionista para atuar na atenção clínica individualizada e no suporte nutricional a atletas e praticantes de atividade física, baseado em evidências científicas.", // MOCK
            diferenciais: [
              "Integração entre nutrição clínica e performance esportiva", // MOCK
              "Atualização em suplementação e composição corporal", // MOCK
              "Professores atuantes em clínicas e centros esportivos de referência", // MOCK
            ],
            mercado: ["Consultórios e clínicas de nutrição", "Centros esportivos e academias", "Equipes esportivas profissionais", "Hospitais e UAN"], // MOCK
            foto: "/images/cursos/nutricao-clinica-esportiva.jpg",
          },
          {
            slug: "saude-coletiva-familia",
            nome: "Saúde Coletiva e Família",
            area: "Saúde",
            titulacao: "Especialização",
            duracao: "12 a 24 meses", // MOCK
            turnos: [],
            modalidade: "Presencial",
            resumo: "Atenção primária, promoção da saúde e cuidado à família.", // MOCK
            descricao:
              "Prepara profissionais de saúde para atuar na atenção básica e em equipes de saúde da família, com foco em vigilância epidemiológica, promoção da saúde e cuidado integral.", // MOCK
            diferenciais: [
              "Formação orientada para o SUS e atenção básica", // MOCK
              "Metodologias de educação em saúde e trabalho em equipe", // MOCK
              "Professores com experiência na Estratégia Saúde da Família", // MOCK
            ],
            mercado: ["UBS e ESF", "Gestão municipal em saúde", "ONG e organizações de saúde coletiva", "Vigilância em saúde"], // MOCK
            foto: "/images/cursos/saude-coletiva-familia.jpg",
          },
          {
            slug: "urgencia-emergencia",
            nome: "Urgência e Emergência",
            area: "Saúde",
            titulacao: "Especialização",
            duracao: "12 a 24 meses", // MOCK
            turnos: [],
            modalidade: "Presencial",
            resumo: "Atendimento de alta complexidade em situações críticas e emergenciais.", // MOCK
            descricao:
              "Desenvolve competências para o atendimento ao paciente em situações de urgência e emergência, com foco em protocolos ACLS, ATLS e gestão de serviços de emergência.", // MOCK
            diferenciais: [
              "Treinamento em suporte avançado de vida (ACLS/ATLS)", // MOCK
              "Simulações clínicas com manequins de alta fidelidade", // MOCK
              "Professores atuantes em UTI e pronto-socorro", // MOCK
            ],
            mercado: ["Pronto-socorros e UPA", "UTI adulto e pediátrica", "SAMU e resgate", "Hospitais de alta complexidade"], // MOCK
            foto: "/images/cursos/urgencia-emergencia.jpg",
          },
        ],
      },
      {
        area: "Odontologia",
        itens: [
          {
            slug: "cirurgia-oral-menor",
            nome: "Cirurgia Oral Menor",
            area: "Odontologia",
            titulacao: "Aperfeiçoamento",
            duracao: "12 meses", // MOCK
            turnos: [],
            modalidade: "Presencial",
            resumo: "Técnicas cirúrgicas orais menores com segurança e precisão.", // MOCK
            descricao:
              "Capacita o cirurgião-dentista para a realização de procedimentos de cirurgia oral menor, como exodontias complexas, biopsias, frenectomias e implantes básicos, com embasamento científico.", // MOCK
            diferenciais: [
              "Treinamento em biossegurança e controle de complicações", // MOCK
              "Prática supervisionada com pacientes reais", // MOCK
              "Atualização em anestesiologia e farmacologia odontológica", // MOCK
            ],
            mercado: ["Clínicas odontológicas", "Consultórios particulares", "Saúde pública odontológica", "Cirurgia bucomaxilofacial"], // MOCK
            foto: "/images/cursos/cirurgia-oral-menor.jpg",
          },
          {
            slug: "endodontia",
            nome: "Endodontia",
            area: "Odontologia",
            titulacao: "Especialização",
            duracao: "12 a 24 meses", // MOCK
            turnos: [],
            modalidade: "Presencial",
            resumo: "Tratamento endodôntico avançado com tecnologia de ponta.", // MOCK
            descricao:
              "Especialização em diagnóstico e tratamento de doenças da polpa dentária e dos tecidos periapicais, com uso de tecnologias de rotação contínua, CBCT e obturação avançada.", // MOCK
            diferenciais: [
              "Uso de equipamentos de última geração (localizadores apicais, motor endodôntico)", // MOCK
              "Treinamento em retratamentos e cirurgia parendodôntica", // MOCK
              "Professores especialistas reconhecidos pelo CFO", // MOCK
            ],
            mercado: ["Clínicas de especialidades odontológicas", "Consultórios particulares", "Clínicas-escola", "Docência odontológica"], // MOCK
            foto: "/images/cursos/endodontia.jpg",
          },
          {
            slug: "clareamento-dental",
            nome: "Clareamento Dental",
            area: "Odontologia",
            titulacao: "Aperfeiçoamento",
            duracao: "12 meses", // MOCK
            turnos: [],
            modalidade: "Presencial",
            resumo: "Técnicas modernas de clareamento dental com segurança e eficácia.", // MOCK
            descricao:
              "Capacita o cirurgião-dentista para realizar procedimentos de clareamento dental de consultório, caseiro e combinado, com base nas evidências científicas e nos protocolos atuais.", // MOCK
            diferenciais: [
              "Domínio das principais técnicas de clareamento do mercado", // MOCK
              "Abordagem em fotossensibilidade e biocompatibilidade", // MOCK
              "Treinamento prático em manequins e pacientes supervisionados", // MOCK
            ],
            mercado: ["Consultórios particulares", "Clínicas de estética dental", "Clínicas odontológicas integradas", "Docência e cursos livres"], // MOCK
            foto: "/images/cursos/clareamento-dental.jpg",
          },
          {
            slug: "odontopediatria",
            nome: "Odontopediatria",
            area: "Odontologia",
            titulacao: "Especialização",
            duracao: "12 a 24 meses", // MOCK
            turnos: [],
            modalidade: "Presencial",
            resumo: "Saúde bucal da infância e adolescência com abordagem humanizada.", // MOCK
            descricao:
              "Forma especialistas para o atendimento odontológico de crianças e adolescentes, com foco em prevenção, manejo comportamental, anestesia em crianças e tratamento de lesões cariosas.", // MOCK
            diferenciais: [
              "Treinamento em manejo comportamental e sedação consciente", // MOCK
              "Abordagem preventiva e minimamente invasiva", // MOCK
              "Professores com atuação em clínicas pediátricas e hospitais infantis", // MOCK
            ],
            mercado: ["Consultórios de odontopediatria", "Hospitais infantis", "Saúde pública", "Clínicas odontológicas especializadas"], // MOCK
            foto: "/images/cursos/odontopediatria.jpg",
          },
          {
            slug: "ortodontia",
            nome: "Ortodontia",
            area: "Odontologia",
            titulacao: "Especialização",
            duracao: "12 a 24 meses", // MOCK
            turnos: [],
            modalidade: "Presencial",
            resumo: "Diagnóstico e tratamento ortodôntico com técnicas contemporâneas.", // MOCK
            descricao:
              "Capacita o cirurgião-dentista para planejar e executar tratamentos ortodônticos com aparelhos fixos e removíveis, alinhadores e contenção, com base em diagnóstico cefalométrico e digital.", // MOCK
            diferenciais: [
              "Treinamento em aparelhos metálicos, estéticos e alinhadores", // MOCK
              "Uso de software de planejamento digital (CAD/CAM)", // MOCK
              "Professores especialistas reconhecidos pelo CFO", // MOCK
            ],
            mercado: ["Consultórios de ortodontia", "Clínicas odontológicas", "Saúde pública", "Docência odontológica"], // MOCK
            foto: "/images/cursos/ortodontia.jpg",
          },
          {
            slug: "resinas-dentarias",
            nome: "Resinas Dentárias",
            area: "Odontologia",
            titulacao: "Especialização",
            duracao: "12 a 24 meses", // MOCK
            turnos: [],
            modalidade: "Presencial",
            resumo: "Restaurações estéticas em resina composta com alta precisão e naturalidade.", // MOCK
            descricao:
              "Aprofunda o conhecimento e a técnica em restaurações diretas com resina composta, com foco em estratificação, biomimética, polimento e longevidade clínica.", // MOCK
            diferenciais: [
              "Treinamento em estratificação e técnica biomimética", // MOCK
              "Uso de materiais e sistemas de resina de última geração", // MOCK
              "Professores com produção científica e experiência clínica comprovadas", // MOCK
            ],
            mercado: ["Consultórios de dentística", "Clínicas de estética dental", "Laboratórios de prótese", "Docência odontológica"], // MOCK
            foto: "/images/cursos/resinas-dentarias.jpg",
          },
        ],
      },
      {
        area: "Direito",
        itens: [
          {
            slug: "ciencias-criminais",
            nome: "Ciências Criminais",
            area: "Direito",
            titulacao: "Especialização",
            duracao: "12 a 24 meses", // MOCK
            turnos: [],
            modalidade: "Presencial",
            resumo: "Formação especializada em direito penal, processo penal e criminologia.", // MOCK
            descricao:
              "Aprofunda o conhecimento jurídico nas áreas do direito penal, processo penal e criminologia, preparando o profissional para atuar na advocacia criminal, Ministério Público, Magistratura e Defensoria.", // MOCK
            diferenciais: [
              "Corpo docente atuante na advocacia e carreiras jurídicas", // MOCK
              "Abordagem crítica de política criminal e garantias constitucionais", // MOCK
              "Atualização em legislação penal especial e jurisprudência dos tribunais superiores", // MOCK
            ],
            mercado: ["Advocacia criminal", "Ministério Público", "Magistratura", "Defensoria Pública"], // MOCK
            foto: "/images/cursos/ciencias-criminais.jpg",
          },
        ],
      },
      {
        area: "Estética",
        itens: [
          {
            slug: "estetica-avancada-injetaveis",
            nome: "Estética Avançada com Ênfase em Injetáveis",
            area: "Estética",
            titulacao: "Especialização",
            duracao: "12 a 24 meses", // MOCK
            turnos: [],
            modalidade: "Presencial",
            resumo: "Procedimentos estéticos avançados com técnicas injetáveis seguras e eficazes.", // MOCK
            descricao:
              "Capacita profissionais habilitados para a realização de procedimentos estéticos com injetáveis, como toxina botulínica e preenchedores, com base anatômica sólida e protocolos de segurança.", // MOCK
            diferenciais: [
              "Treinamento prático em técnicas de toxina botulínica e ácido hialurônico", // MOCK
              "Fundamentos de anatomia facial aplicada à estética", // MOCK
              "Atualização em biossegurança e manejo de complicações", // MOCK
            ],
            mercado: ["Clínicas de estética avançada", "Clínicas dermatológicas e de cirurgia plástica", "Consultórios odontológicos (harmonização)", "Empreendedorismo em estética"], // MOCK
            foto: "/images/cursos/estetica-avancada-injetaveis.jpg",
          },
        ],
      },
    ],
  },

  diferenciais: {
    titulo: "Por que a Florence.",
    lead: {
      titulo: "Especialização aplicada à prática.",
      corpo:
        "Conteúdo conectado ao dia a dia da profissão, com professores que atuam na área e metodologia voltada para resultado.",
    },
    pontos: [
      {
        titulo: "Professores de excelência",
        corpo:
          "Especialistas e mestres que trazem a experiência real do mercado para a sala de aula.",
      },
      {
        titulo: "Conclusão a partir de 13 meses",
        corpo:
          "Carga horária organizada para você se especializar sem pausar a carreira.",
      },
    ],
  },

  ingresso: {
    titulo: "Sem vestibular.",
    subtitulo: "A inscrição é por análise de documentos, simples e rápida.",
    formas: [
      { nome: "Diploma de graduação", descricao: "Cópia do seu diploma de nível superior." },
      { nome: "Histórico escolar", descricao: "Histórico da sua graduação." },
      { nome: "Documentos pessoais", descricao: "RG e CPF." },
      { nome: "Foto e comprovante", descricao: "Uma foto 3x4 e comprovante de residência." },
    ],
  },

  financiamento: {
    titulo: "Investimento facilitado.",
    descricao:
      "Condições de pagamento flexíveis e o programa Corporativo Florence para quem trabalha em empresas parceiras.",
    itens: [
      { nome: "Parcelamento", descricao: "Mensalidades que cabem no seu planejamento." },
      { nome: "Corporativo Florence", descricao: "Descontos para funcionários de empresas parceiras." },
      { nome: "Florence Fidelidade", descricao: "Condições especiais para ex-alunos e colaboradores." },
      { nome: "Conclusão a partir de 13 meses", descricao: "Especialização concluída em menos tempo." },
    ],
  },

  // Mock/oculto ate o cliente enviar depoimentos reais.
  depoimentos: {
    ativo: false,
    titulo: "Quem se especializa na Florence.",
    cards: [
      { nome: "Aluno Florence", turma: "Turma 2024", texto: "Depoimento de exemplo (mock).", foto: "" }, // MOCK
      { nome: "Aluna Florence", turma: "Turma 2023", texto: "Depoimento de exemplo (mock).", foto: "" }, // MOCK
    ],
  },

  ctaFinal: {
    headline: "Dê o próximo passo na sua carreira.",
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
