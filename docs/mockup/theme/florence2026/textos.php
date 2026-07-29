<?php
/**
 * Textos da home em um lugar só, com acentuação correta.
 * Separado dos templates para facilitar revisão de copy pela equipe.
 */
if ( ! defined( 'ABSPATH' ) ) exit;

function florence2026_txt() {
	return array(
		'hero_eyebrow' => 'Inscrições abertas · 2026.2',
		'hero_h1_a'    => 'Sua carreira em saúde começa com a ',
		'hero_h1_em'   => 'prática',
		'hero_h1_b'    => ', não com a teoria.',
		'hero_lead'    => 'Graduação, técnico e pós-graduação no Centro Universitário Florence. Estrutura reconhecida com nota máxima pelo MEC e professores que atuam no mercado.',
		'cta_vaga'     => 'Quero minha vaga',
		'cta_cursos'   => 'Ver cursos e valores',
		'mec_strong'   => 'Nota máxima do MEC',
		'mec_small'    => 'no recredenciamento institucional',
		'credit'       => array(
			array( '11', 'cursos de graduação' ),
			array( '6', 'formas de ingresso' ),
			array( 'FIES', 'e ProUni' ),
			array( 'Prática', 'desde os primeiros períodos' ),
		),
		'paths_kicker' => 'Escolha seu caminho',
		'paths_h2'     => 'Qual é o seu próximo passo?',
		'paths_lead'   => 'Três formas de estudar na Florence, cada uma pensada para um momento diferente de carreira.',
		'paths'        => array(
			array(
				'num'  => '01 · GRADUAÇÃO',
				'h3'   => 'Onze cursos com prática desde o primeiro período',
				'p'    => 'Você começa a atuar antes mesmo de se formar, em laboratórios e clínicas-escola.',
				'go'   => 'Ver cursos de graduação',
				'img'  => 'lab.jpg',
				'url'  => '/cursos/?nivel=graduacao',
				'lead' => true,
			),
			array(
				'num'  => '02 · TÉCNICO',
				'h3'   => 'Entre no mercado em menos tempo',
				'p'    => 'Formação rápida e direta, com estágio supervisionado em serviços reais de saúde.',
				'go'   => 'Ver cursos técnicos',
				'img'  => 'cirurgico.jpg',
				'url'  => '/cursos/?nivel=tecnico',
				'lead' => false,
			),
			array(
				'num'  => '03 · PÓS-GRADUAÇÃO',
				'h3'   => 'Especialize-se sem pausar a carreira',
				'p'    => 'Conclusão a partir de 12 meses, com quem atua na área todos os dias.',
				'go'   => 'Ver especializações',
				'img'  => 'equipe.jpg',
				'url'  => '/cursos/?nivel=pos',
				'lead' => false,
			),
		),
		'proof_kicker' => 'Por que Florence',
		'proof_h2'     => 'A estrutura tem nota máxima. A sua formação também deveria.',
		'proof_lead'   => 'O MEC avaliou a instituição com a nota máxima no recredenciamento. Na prática, isso significa laboratórios e equipamentos que você usa desde o começo do curso.',
		'proof'        => array(
			array( 'Nota máxima do MEC', 'Reconhecimento oficial no recredenciamento institucional. Você aprende nos mesmos equipamentos que vai encontrar no mercado.' ),
			array( 'Professores que atuam na área', 'Mestres e doutores que trabalham no que ensinam e trazem casos reais para dentro da sala de aula.' ),
			array( 'Prática desde o início', 'Você não espera o último ano para atender. A vivência clínica começa nos primeiros períodos.' ),
			array( 'Estágio em serviços reais', 'Convênios com hospitais, clínicas e unidades de saúde que aproximam você da primeira oportunidade.' ),
		),
		'money_kicker' => 'Bolsas e financiamento',
		'money_h2'     => 'Estudar custa menos do que você imagina.',
		'money_p'      => 'FIES, ProUni, o programa Corporativo Florence e bolsas de até 77% para servidores públicos e funcionários de empresas parceiras, incluindo dependentes.',
		'sim_curso'    => 'Curso de interesse',
		'sim_perfil'   => 'Seu perfil',
		'sim_zap'      => 'WhatsApp',
		'sim_cta'      => 'Simular minha bolsa',
		'sim_perfis'   => array( 'Selecione', 'Vou prestar vestibular', 'Servidor público', 'Empresa parceira', 'Já tenho graduação' ),
		'ways_kicker'  => 'Como entrar',
		'ways_h2'      => 'Seis formas de entrar. Escolha a que combina com o seu momento.',
		'ways_cta'     => 'Fazer minha inscrição',
		'ways'         => array(
			array( 'Vestibular digital', 'Prova online, com data e horário flexíveis.', 'https://florence.inscricao.crmeducacional.com/login/247' ),
			array( 'Nota do ENEM', 'Use a nota que você já tem.', 'https://florence.inscricao.crmeducacional.com/login/248' ),
			array( 'Histórico escolar', 'Aproveite seu desempenho no ensino médio.', 'https://florence.inscricao.crmeducacional.com/login/220' ),
			array( 'Transferência', 'Venha de outra instituição.', 'https://florence.inscricao.crmeducacional.com/login/260' ),
			array( 'Segunda graduação', 'Para quem já tem diploma.', 'https://florence.inscricao.crmeducacional.com/login/258' ),
			array( 'Volte a estudar', 'Retome de onde você parou.', 'https://florence.inscricao.crmeducacional.com/login/259' ),
		),
		'news_kicker'  => 'Acontece na Florence',
		'news_h2'      => 'Últimas notícias',
		'news_cta'     => 'Ver todas',
		'final_h2'     => 'As inscrições estão abertas. A sua vaga, ainda não.',
		'final_p'      => 'Preencha seus dados e nosso time de admissões entra em contato para orientar sua inscrição e simular sua bolsa.',
		'final_cta'    => 'Garantir minha vaga',
	);
}
