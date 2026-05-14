export const config = {
  meta: {
    title: "Medicina na Florence — Estude com médicos atuantes | Florence",
    description:
      "Curso de Medicina com corpo docente formado por médicos, mestres e doutores. Estrutura completa, prática desde o primeiro período. Inscreva-se.",
  },

  hero: {
    headline: "Estude Medicina com quem já é médico.",
    subheadline:
      "Corpo docente formado por médicos atuantes, mestres e doutores que ensinam o que praticam todos os dias nos maiores hospitais do Maranhão.",
    cta: "Quero minha vaga em Medicina",
  },

  diferenciais: [
    {
      title: "Professores que são médicos",
      body: "Aulas com profissionais que trabalham em UTIs, centros cirúrgicos e consultórios — não só na teoria.",
      icon: "stethoscope",
    },
    {
      title: "Prática desde o primeiro período",
      body: "Você entra na rotina hospitalar muito antes do internato. Simulação realística, anatomia e atendimento desde o começo.",
      icon: "flask",
    },
    {
      title: "Estrutura que prepara para o real",
      body: "Centros de simulação, salas de cirurgia, UTIs e laboratórios de anatomia — o mesmo ambiente que você vai encontrar na profissão.",
      icon: "building",
    },
    {
      title: "Curso com nota máxima no MEC",
      // TODO: confirmar nota (4 ou 5)
      body: "Reconhecimento de qualidade auditado, não só prometido.",
      icon: "award",
    },
  ],

  professores: {
    titulo: "Conheça quem vai te formar.",
    subtitulo:
      "Doutores pela USP, UNIFESP e UFMA. Especialistas em cirurgia robótica, hematologia, oftalmologia, dermatologia, geriatria e mais.",
    cards: [
      {
        nome: "Laianny de Carvalho",
        cargo: "Coordenadora do curso",
        bio: "Mestra em Gestão de Programas e Serviços de Saúde. Especialista em Cuidados Paliativos pelo Instituto Pallium e Neurointensivismo pelo Hospital Sírio-Libanês.",
        foto: "/images/professores/laianny.jpg",
      },
      {
        nome: "Marcos Pacheco",
        cargo: "Doutor em Políticas Públicas",
        bio: "Médico especialista em Saúde Coletiva e graduado em Direito. Ex-Secretário de Estado da Saúde do Maranhão.",
        foto: "/images/professores/marcos.jpg",
      },
      {
        nome: "Roclides Lima",
        cargo: "Pioneiro da cirurgia robótica no Maranhão",
        bio: "Doutor e Mestre pela UNIFESP. Já formou mais de 600 cirurgiões em videocirurgia e robótica. Cirurgião assistente no HU-UFMA.",
        foto: "/images/professores/roclides.jpg",
      },
      {
        nome: "Savya Milhomem",
        cargo: "Doutora pela USP",
        bio: "Otorrinolaringologista, especialista em Zumbido e Medicina do Sono. Coordenadora de Semestre do curso de Medicina da UFMA.",
        foto: "/images/professores/savya.jpg",
      },
      {
        nome: "Yuri Nassar",
        cargo: "Chefe da Unidade de Hematologia do HU-UFMA",
        bio: "Mestre em Saúde Coletiva. Especialista em Hematologia e Hemoterapia com Residência em Clínica Médica.",
        foto: "/images/professores/yuri.jpg",
      },
      {
        nome: "Maria Eduarda Andrade",
        cargo: "Doutoranda em Medicina pela USP-RP",
        bio: "Residência em Oftalmologia com Título de Especialista. Fellowship em Plástica Ocular, Vias Lacrimais e Órbita.",
        foto: "/images/professores/maria-eduarda.jpg",
      },
    ],
  },

  estrutura: {
    titulo: "A estrutura é tão real quanto a prática.",
    itens: [
      { label: "Sala de cirurgia", foto: "/images/estrutura/cirurgia.jpg" },
      { label: "UTIs", foto: "/images/estrutura/uti.jpg" },
      { label: "Simulação realística", foto: "/images/estrutura/simulacao.jpg" },
      { label: "Laboratório de anatomia", foto: "/images/modelos/anatomia.jpg" },
      { label: "Leito hospitalar", foto: "/images/estrutura/leito.jpg" },
      // TODO: adicionar foto de OSCEs e campos de estágio quando disponíveis
    ],
  },

  ctaFinal: {
    headline: "Sua vaga em Medicina começa com um nome.",
    subheadline:
      "Deixe seus dados e nosso time de admissões entra em contato com você. Sem compromisso.",
    cta: "Quero minha vaga em Medicina",
    microcopy: "Resposta em até 1 dia útil. Seus dados ficam só com a Florence.",
  },

  formulario: {
    titulo: "Garante sua vaga.",
    subtitulo: "Preencha e nosso time entra em contato.",
    cta: "Quero minha vaga",
    lgpd: "Ao enviar, você autoriza o contato da Florence. Não compartilhamos seus dados.",
  },

  obrigado: {
    headline: "Recebemos seu cadastro.",
    corpo:
      "Em até 1 dia útil, nosso time entra em contato com você pelo WhatsApp ou telefone. Enquanto isso, fique de olho no seu e-mail — enviamos uma confirmação agora mesmo.",
    ctaSecundario: {
      label: "Conheça a Florence no Instagram",
      href: "https://instagram.com/florence.edu.br", // TODO: confirmar @ oficial
    },
  },
} as const;
