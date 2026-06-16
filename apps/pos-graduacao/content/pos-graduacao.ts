import type { UmbrellaConfig } from "@florence/umbrella";

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
    imageAlt: "Profissionais em especialização na Florence",
    stats: [
      { value: "18+", label: "especializações" },
      { value: "13 meses", label: "para concluir" },
      { value: "4", label: "áreas" },
    ],
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
    eyebrow: "Especializações",
    titulo: "Encontre sua\nespecialização.",
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
            duracao: "6 ou 18 meses",
            turnos: [],
            modalidade: "Presencial",
            resumo: "Formação crítica e atualizada para quem quer liderar o diagnóstico laboratorial.",
            descricao:
              "A especialização capacita biomédicos, farmacêuticos-bioquímicos e biólogos a executar e liberar laudos, assumir a responsabilidade técnica de laboratórios e atuar em consultoria e pesquisa. O currículo cobre hematologia, microbiologia, bioquímica, parasitologia e imunologia com metodologias atualizadas de interpretação de exames. Indicado tanto para quem está iniciando na área quanto para profissionais em busca de qualificação continuada.",
            diferenciais: [
              "Currículo atualizado com metodologias e técnicas contemporâneas de análises clínicas",
              "Encontros quinzenais presenciais com flexibilidade para profissionais em exercício",
              "Formação que habilita o profissional à responsabilidade técnica de laboratórios",
            ],
            mercado: ["Laboratórios clínicos e de alta complexidade", "Hemocentros", "Indústria diagnóstica", "Vigilância sanitária", "Consultoria e pesquisa laboratorial"],
            foto: "/images/cursos/analises-clinicas-diagnostico-laboratorial.jpg",
          },
          {
            slug: "bioquimica-clinica",
            nome: "Bioquímica Clínica",
            area: "Saúde",
            titulacao: "Especialização",
            duracao: "12 a 24 meses",
            turnos: [],
            modalidade: "Presencial",
            resumo: "Conhecimento aprofundado em bioquímica para uma atuação laboratorial ética e competente.",
            descricao:
              "O curso oferece formação especializada e aprofundada em bioquímica clínica, equipando profissionais de biomedicina, farmácia, biologia, enfermagem e áreas afins com conhecimentos atualizados para a prática laboratorial. O programa prepara o especialista para interpretar exames bioquímicos, adotar condutas éticas e contribuir para a qualidade diagnóstica em diferentes contextos de saúde.",
            diferenciais: [
              "Abrangência interdisciplinar: aberto a graduados em biomedicina, farmácia, biologia, enfermagem, medicina e odontologia",
              "Encontros quinzenais presenciais compatíveis com a rotina de quem já está no mercado",
              "Coordenação acadêmica com currículo Lattes disponível para consulta",
            ],
            mercado: ["Laboratórios de análises clínicas", "Indústria farmacêutica e diagnóstica", "Pesquisa científica", "Hospitais e clínicas"],
            foto: "/images/cursos/bioquimica-clinica.jpg",
          },
          {
            slug: "emagrecimento-obesidade",
            nome: "Emagrecimento e Obesidade",
            area: "Saúde",
            titulacao: "Especialização",
            duracao: "12 a 24 meses",
            turnos: [],
            modalidade: "Presencial",
            resumo: "Capacitação especializada para o manejo clínico do sobrepeso e da obesidade.",
            descricao:
              "A especialização capacita profissionais da saúde a adquirir conhecimentos teóricos e práticos no campo do emagrecimento e da obesidade, com foco em avaliação, prescrição e acompanhamento de estratégias de intervenção saudável. O curso é voltado para médicos, nutricionistas, educadores físicos, enfermeiros, psicólogos e outros graduados na área da saúde que buscam atuar com segurança no tratamento de pacientes com sobrepeso.",
            diferenciais: [
              "Currículo voltado à prática clínica com protocolos de avaliação e acompanhamento do paciente",
              "Abordagem multiprofissional integrando diferentes áreas da saúde no tratamento da obesidade",
              "Encontros quinzenais presenciais com matriz curricular disponível para consulta",
            ],
            mercado: ["Clínicas de emagrecimento e endocrinologia", "Consultórios de nutrição", "Hospitais e programas bariátricos", "Equipes de saúde multiprofissional"],
            foto: "/images/cursos/emagrecimento-obesidade.jpg",
          },
          {
            slug: "enfermagem-oncologica",
            nome: "Enfermagem Oncológica",
            area: "Saúde",
            titulacao: "Especialização",
            duracao: "12 a 24 meses",
            turnos: [],
            modalidade: "Presencial",
            resumo: "Formação para a assistência integral ao paciente oncológico em equipes multiprofissionais.",
            descricao:
              "A especialização contribui para a formação de equipes multiprofissionais com foco no trabalho interdisciplinar em assistência, gestão, pesquisa e educação nas redes de atenção oncológica. O programa é aberto a graduados em enfermagem, medicina, odontologia, psicologia, fisioterapia, serviço social e áreas afins. O profissional formado está preparado para atuar em todas as etapas do cuidado oncológico, da prevenção aos cuidados paliativos.",
            diferenciais: [
              "Abordagem interdisciplinar que integra assistência, gestão e pesquisa em oncologia",
              "Programa voltado a múltiplas categorias profissionais da saúde",
              "Coordenação com expertise em oncologia e formação continuada",
            ],
            mercado: ["Hospitais oncológicos e UNACONs", "Serviços de quimioterapia e radioterapia", "Cuidados paliativos", "Gestão de redes de atenção oncológica"],
            foto: "/images/cursos/enfermagem-oncologica.jpg",
          },
          {
            slug: "farmacia-clinica-hospitalar",
            nome: "Farmácia Clínica e Hospitalar",
            area: "Saúde",
            titulacao: "Especialização",
            duracao: "12 a 24 meses",
            turnos: [],
            modalidade: "Presencial",
            resumo: "Qualificação técnico-científica para o farmacêutico que atua em ambiente hospitalar.",
            descricao:
              "O programa qualifica farmacêuticos que atuam em farmácia hospitalar para o desenvolvimento de atividades técnico-científicas e os habilita a atuar como gestores e técnicos nos diferentes níveis da administração em saúde. O currículo contempla o monitoramento farmacoterapêutico de pacientes internados, preparando o profissional para contribuir diretamente com a segurança do paciente. Aberto a graduados em biomedicina, farmácia, enfermagem, medicina e áreas afins.",
            diferenciais: [
              "Foco em monitoramento farmacoterapêutico e segurança do paciente hospitalizado",
              "Preparo para funções de gestão e responsabilidade técnica em farmácia hospitalar",
              "Encontros quinzenais presenciais com matriz curricular disponível para download",
            ],
            mercado: ["Hospitais e prontos-socorros", "UTIs e centros cirúrgicos", "Farmácias hospitalares", "Gestão de assistência farmacêutica no SUS"],
            foto: "/images/cursos/farmacia-clinica-hospitalar.jpg",
          },
          {
            slug: "fisioterapia-geriatria-gerontologia",
            nome: "Fisioterapia em Geriatria e Gerontologia",
            area: "Saúde",
            titulacao: "Especialização",
            duracao: "12 a 24 meses",
            turnos: [],
            modalidade: "Presencial",
            resumo: "Prática fisioterapêutica especializada para promover funcionalidade e qualidade de vida no envelhecimento.",
            descricao:
              "O curso capacita fisioterapeutas a adquirir conhecimentos teóricos e práticos em geriatria e gerontologia, com ênfase no desenvolvimento de competências para avaliação, intervenção e reabilitação física voltada ao envelhecimento saudável e à independência funcional do idoso. O programa é voltado exclusivamente para graduados em fisioterapia que desejam se aprofundar no cuidado à população idosa.",
            diferenciais: [
              "Curso exclusivo para fisioterapeutas, com conteúdo aprofundado nas especificidades do paciente geriátrico",
              "Foco em reabilitação funcional para promoção da autonomia e qualidade de vida do idoso",
              "Encontros quinzenais presenciais com matriz curricular detalhada disponível para consulta",
            ],
            mercado: ["ILPIs e residências para idosos", "Hospitais com serviço de geriatria", "Clínicas de reabilitação", "Atenção domiciliar e saúde pública"],
            foto: "/images/cursos/fisioterapia-geriatria-gerontologia.jpg",
          },
          {
            slug: "fitoterapia-suplementacao-nutricional",
            nome: "Fitoterapia e Suplementação Nutricional",
            area: "Saúde",
            titulacao: "Especialização",
            duracao: "12 a 24 meses",
            turnos: [],
            modalidade: "Presencial",
            resumo: "Prescrição segura e baseada em evidências de fitoterápicos e suplementos na prática clínica.",
            descricao:
              "A especialização capacita profissionais da saúde a adquirir conhecimentos teóricos e práticos em fitoterapia e suplementação nutricional, com foco na prescrição segura e embasada em evidências científicas. O programa é indicado para nutricionistas, farmacêuticos, médicos, enfermeiros e outros graduados que desejam integrar recursos fitoterápicos e suplementares ao cuidado clínico de forma responsável.",
            diferenciais: [
              "Ênfase na segurança ao paciente e na prescrição com base em evidências científicas atuais",
              "Abrangência multiprofissional: aberto a nutricionistas, farmacêuticos, médicos, enfermeiros e afins",
              "Encontros quinzenais presenciais com acesso à matriz curricular completa",
            ],
            mercado: ["Consultórios de nutrição e farmácia clínica", "Farmácias de manipulação", "Clínicas de medicina integrativa", "Indústria de suplementos e cosméticos naturais"],
            foto: "/images/cursos/fitoterapia-suplementacao-nutricional.jpg",
          },
          {
            slug: "nutricao-clinica-esportiva",
            nome: "Nutrição Clínica e Esportiva",
            area: "Saúde",
            titulacao: "Especialização",
            duracao: "12 a 24 meses",
            turnos: [],
            modalidade: "Presencial",
            resumo: "Dupla certificação em nutrição clínica e esportiva para quem quer ampliar o campo de atuação.",
            descricao:
              "O programa proporciona conhecimentos abrangentes em nutrição clínica e esportiva, abordando temas contemporâneos relevantes para a prática em contextos ambulatorial, hospitalar e esportivo. Com dupla certificação, a especialização atende nutricionistas, profissionais de educação física, médicos e gastrólogos que buscam aprofundar a atuação em saúde. O currículo integra teoria e prática com foco nos cenários reais da profissão.",
            diferenciais: [
              "Dupla certificação que amplifica as possibilidades de atuação do profissional",
              "Conteúdo abrange tanto a prática clínica quanto o suporte nutricional ao esporte",
              "Programa aberto a nutricionistas, médicos, educadores físicos e gastrônomos",
            ],
            mercado: ["Consultórios e clínicas de nutrição", "Equipes esportivas e centros de performance", "Hospitais e serviços de nutrição enteral", "Programas de saúde corporativa"],
            foto: "/images/cursos/nutricao-clinica-esportiva.jpg",
          },
          {
            slug: "saude-coletiva-familia",
            nome: "Saúde Coletiva e Família",
            area: "Saúde",
            titulacao: "Especialização",
            duracao: "12 meses",
            turnos: [],
            modalidade: "Presencial",
            resumo: "Formação para gestão, planejamento e atuação na saúde da família e nas redes do SUS.",
            descricao:
              "A especialização desenvolve especialistas em saúde coletiva com ênfase na saúde da família, ampliando as possibilidades de atuação em gestão, planejamento, análise e avaliação dentro do SUS, especialmente nas estratégias de saúde da família. O programa é indicado para médicos, psicólogos, gestores de serviços de saúde e profissionais que preparam concursos públicos na área. O egresso está habilitado para assumir cargos de liderança em equipes de saúde da família e vigilância epidemiológica.",
            diferenciais: [
              "Currículo orientado para a realidade do SUS e das Estratégias de Saúde da Família",
              "Formação que habilita para funções de gestão, planejamento e avaliação em saúde coletiva",
              "Programa com duração de 12 meses, ideal para quem busca agilidade na certificação",
            ],
            mercado: ["Estratégia Saúde da Família e UBS", "Gestão municipal e estadual em saúde", "Vigilância epidemiológica e sanitária", "Organizações de saúde coletiva"],
            foto: "/images/cursos/saude-coletiva-familia.jpg",
          },
          {
            slug: "urgencia-emergencia",
            nome: "Urgência e Emergência",
            area: "Saúde",
            titulacao: "Especialização",
            duracao: "12 a 24 meses",
            turnos: [],
            modalidade: "Presencial",
            resumo: "Preparo para lidar com os desafios reais da assistência em urgência e emergência.",
            descricao:
              "A especialização promove a discussão dos problemas nacionais e regionais da assistência em urgência e emergência, desenvolvendo nos profissionais a capacidade de investigar e aprimorar a qualidade do atendimento prestado. O programa é aberto a graduados em enfermagem, medicina, odontologia, psicologia, fisioterapia, serviço social e terapia ocupacional. O egresso está habilitado a atuar com competência técnica e visão crítica nos mais exigentes serviços de emergência.",
            diferenciais: [
              "Abordagem dos problemas concretos da urgência e emergência no contexto brasileiro",
              "Formação multiprofissional aberta a diversas categorias da saúde",
              "Encontros quinzenais presenciais com matriz curricular disponível para consulta",
            ],
            mercado: ["Pronto-socorros e UPAs", "UTIs adulto e pediátrica", "SAMU e serviços de resgate", "Hospitais de alta complexidade"],
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
            duracao: "11 módulos · 180h",
            turnos: [],
            modalidade: "Presencial",
            resumo: "Qualificação prática em cirurgia oral menor com atendimento real a pacientes supervisionados.",
            descricao:
              "O aperfeiçoamento combina aulas teóricas, práticas laboratoriais e atendimento clínico em pacientes, com foco em diagnóstico, planejamento e execução de procedimentos cirúrgicos e manejo de complicações. O currículo cobre anestesiologia, anatomia cirúrgica, exodontias simples e complexas, dentes inclusos, cirurgia pré-protética, farmacoterapia, bichectomia, infecções odontogênicas e cirurgia periodontal. Indicado para cirurgiões-dentistas e estudantes de odontologia que buscam qualificação técnica avançada em cirurgia.",
            diferenciais: [
              "Atendimento clínico real a pacientes desde o início do curso, com supervisão docente",
              "Carga horária de 180 horas distribuídas em 11 módulos temáticos",
              "Currículo abrangente que vai de anestesiologia a bichectomia e infecções odontogênicas",
            ],
            mercado: ["Consultórios odontológicos particulares", "Clínicas de especialidades odontológicas", "Saúde pública e serviços de odontologia", "Habilitação para procedimentos cirúrgicos eletivos"],
            foto: "/images/cursos/cirurgia-oral-menor.jpg",
          },
          {
            slug: "endodontia",
            nome: "Endodontia",
            area: "Odontologia",
            titulacao: "Especialização",
            duracao: "12 a 24 meses",
            turnos: [],
            modalidade: "Presencial",
            resumo: "Especialização completa em diagnóstico e tratamento endodôntico, do caso simples ao complexo.",
            descricao:
              "A especialização capacita cirurgiões-dentistas a adquirir conhecimentos teóricos e práticos especializados em endodontia, com ênfase em casos complexos, retratamentos e manejo de complicações. O programa forma profissionais aptos a diagnosticar e tratar doenças pulpares e periapicais com segurança e fundamento científico, em consultórios particulares e clínicas de especialidades.",
            diferenciais: [
              "Foco em casos complexos, retratamentos endodônticos e manejo de complicações",
              "Formação exclusiva para cirurgiões-dentistas graduados",
              "Encontros quinzenais presenciais com acesso à matriz curricular completa",
            ],
            mercado: ["Consultórios de endodontia", "Clínicas de especialidades odontológicas", "Clínicas-escola e serviços de referência", "Docência em odontologia"],
            foto: "/images/cursos/endodontia.jpg",
          },
          {
            slug: "clareamento-dental",
            nome: "Clareamento Dental",
            area: "Odontologia",
            titulacao: "Aperfeiçoamento",
            duracao: "3 dias (intensivo)",
            turnos: [],
            modalidade: "Presencial",
            resumo: "Imersão prática em clareamento dental: técnicas atuais, controle de hipersensibilidade e atendimento real a pacientes.",
            descricao:
              "O aperfeiçoamento intensivo de três dias combina teoria, prática laboratorial e atendimento clínico supervisionado a pacientes, com foco nas técnicas mais utilizadas de clareamento de consultório e caseiro e no controle da hipersensibilidade dentinária. O programa é indicado para estudantes de odontologia que querem ampliar a base acadêmica e para profissionais que buscam atualização com as abordagens e materiais mais recentes do mercado.",
            diferenciais: [
              "Atendimento clínico real a pacientes no próprio curso, com supervisão de especialistas",
              "Foco no controle da hipersensibilidade dentinária durante os procedimentos de clareamento",
              "Condições especiais de investimento para alunos e ex-alunos da Florence",
            ],
            mercado: ["Consultórios odontológicos particulares", "Clínicas de estética dental", "Clínicas odontológicas integradas", "Ampliação de portfólio de serviços clínicos"],
            foto: "/images/cursos/clareamento-dental.jpg",
          },
          {
            slug: "odontopediatria",
            nome: "Odontopediatria",
            area: "Odontologia",
            titulacao: "Especialização",
            duracao: "12 a 24 meses",
            turnos: [],
            modalidade: "Presencial",
            resumo: "Formação especializada no diagnóstico, prevenção e tratamento odontológico de crianças e adolescentes.",
            descricao:
              "A especialização capacita cirurgiões-dentistas a adquirir conhecimentos teóricos e práticos em odontopediatria, desenvolvendo competências para diagnosticar, prevenir e tratar doenças bucais em crianças e promover hábitos saudáveis desde a infância. O programa forma profissionais atentos às particularidades do paciente pediátrico, preparados para atuar em consultórios, clínicas especializadas e serviços de saúde pública.",
            diferenciais: [
              "Foco no desenvolvimento de competências preventivas, diagnósticas e terapêuticas para o paciente pediátrico",
              "Formação exclusiva para graduados em odontologia",
              "Encontros quinzenais presenciais com acesso à matriz curricular completa",
            ],
            mercado: ["Consultórios de odontopediatria", "Hospitais infantis e serviços de saúde pública", "Clínicas odontológicas especializadas", "Saúde escolar e programas preventivos"],
            foto: "/images/cursos/odontopediatria.jpg",
          },
          {
            slug: "ortodontia",
            nome: "Ortodontia",
            area: "Odontologia",
            titulacao: "Especialização",
            duracao: "12 a 24 meses",
            turnos: [],
            modalidade: "Presencial",
            resumo: "Especialização completa para diagnosticar e executar tratamentos ortodônticos com aparelhos fixos, removíveis e alinhadores.",
            descricao:
              "O programa capacita cirurgiões-dentistas a adquirir conhecimentos teóricos e práticos especializados em ortodontia, com foco em diagnóstico, planejamento e execução de tratamentos com aparelhos fixos, removíveis, alinhadores estéticos e abordagens multidisciplinares. O egresso está preparado para conduzir casos desde a triagem até a contenção com segurança e embasamento científico.",
            diferenciais: [
              "Formação em aparelhos fixos, removíveis e alinhadores estéticos em um único programa",
              "Abordagem multidisciplinar integrando ortodontia a outras especialidades odontológicas",
              "Encontros quinzenais presenciais com acesso à matriz curricular completa",
            ],
            mercado: ["Consultórios de ortodontia", "Clínicas odontológicas integradas", "Serviços de saúde pública", "Docência em odontologia"],
            foto: "/images/cursos/ortodontia.jpg",
          },
          {
            slug: "resinas-dentarias",
            nome: "Resinas Dentárias",
            area: "Odontologia",
            titulacao: "Especialização",
            duracao: "12 a 24 meses",
            turnos: [],
            modalidade: "Presencial",
            resumo: "Domínio das técnicas e materiais de resina composta para restaurações estéticas e funcionais de alto padrão.",
            descricao:
              "A especialização capacita cirurgiões-dentistas a adquirir conhecimentos teóricos e práticos avançados em resinas dentárias, desenvolvendo competências em técnicas de restauração estética, seleção e manipulação de materiais, preparo do substrato dentário e obtenção de resultados com alto nível estético e funcional. O programa é voltado exclusivamente para graduados em odontologia que desejam excelência na dentística restauradora.",
            diferenciais: [
              "Foco em resultados estéticos e funcionais de alto padrão com resinas compostas",
              "Domínio de técnicas de seleção de materiais, preparo de substrato e manipulação de resinas",
              "Encontros quinzenais presenciais com acesso à matriz curricular completa",
            ],
            mercado: ["Consultórios de dentística restauradora", "Clínicas de estética dental", "Clínicas odontológicas integradas", "Docência em odontologia"],
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
            duracao: "12 a 24 meses",
            turnos: [],
            modalidade: "Presencial",
            resumo: "Estudo sistematizado e interdisciplinar das ciências criminais para integração imediata ao mercado jurídico.",
            descricao:
              "A especialização oferece compreensão aprofundada das bases epistemológicas e dos elementos estruturais das ciências criminais, preparando o bacharel em direito para atuar com segurança no setor da justiça criminal. O programa integra direito penal, processo penal e criminologia com abordagem interdisciplinar, formando profissionais aptos a assumir posições nas carreiras jurídicas públicas e privadas desde a conclusão do curso.",
            diferenciais: [
              "Abordagem interdisciplinar das ciências criminais com foco na aplicação prática imediata",
              "Programa exclusivo para bacharéis em direito, com conteúdo aprofundado e atualizado",
              "Encontros quinzenais presenciais com acesso à matriz curricular completa",
            ],
            mercado: ["Advocacia criminal", "Ministério Público", "Magistratura", "Defensoria Pública"],
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
            duracao: "12 meses",
            turnos: [],
            modalidade: "Presencial",
            resumo: "Aprofundamento em procedimentos estéticos com injetáveis: anatomia, farmacologia e técnicas seguras.",
            descricao:
              "A especialização aprofunda o conhecimento e as habilidades de profissionais da estética e cosmetologia em procedimentos não cirúrgicos com injetáveis, incluindo toxina botulínica e preenchedores dérmicos. O currículo abrange anatomia facial, farmacologia dos produtos injetáveis, técnicas de aplicação segura e ética profissional. O programa é indicado para dermatologistas, cirurgiões plásticos, fisioterapeutas dermatofuncionais, esteticistas farmacêuticos e esteticistas de enfermagem com formação e experiência na área.",
            diferenciais: [
              "Conteúdo integrado: anatomia facial, farmacologia dos injetáveis e técnicas práticas em um único programa",
              "Formação com 12 meses de duração, permitindo agilidade na especialização",
              "Voltado a profissionais com formação prévia em saúde ou estética e experiência prática na área",
            ],
            mercado: ["Clínicas de estética avançada e dermatologia", "Clínicas de cirurgia plástica", "Harmonização orofacial em consultórios odontológicos", "Empreendedorismo em estética e cosmetologia"],
            foto: "/images/cursos/estetica-avancada-injetaveis.jpg",
          },
        ],
      },
    ],
  },

  diferenciais: {
    eyebrow: "Por que a Florence.",
    lead: {
      titulo: "Especialização\naplicada à prática.",
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
    eyebrow: "Inscrição",
    titulo: "Sem vestibular,\nsem complicação.",
    subtitulo: "A inscrição é por análise de documentos, simples e rápida.",
    formas: [
      { nome: "Diploma de graduação", descricao: "Cópia do seu diploma de nível superior." },
      { nome: "Histórico escolar", descricao: "Histórico da sua graduação." },
      { nome: "Documentos pessoais", descricao: "RG e CPF." },
      { nome: "Foto e comprovante", descricao: "Uma foto 3x4 e comprovante de residência." },
    ],
  },

  financiamento: {
    eyebrow: "Investimento",
    titulo: "Investimento\nfacilitado.",
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
    titulo: "Quem se especializa\nna Florence.",
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

  whatsapp: {
    numero: "5598988630502",
    mensagem: "Olá! Tenho interesse nas especializações da Florence.",
  },
} satisfies UmbrellaConfig;

// Lista achatada de nomes de curso para o dropdown do formulario.
export const cursoOptions: string[] = config.cursos.grupos
  .flatMap((g) => g.itens.map((c) => c.nome));
