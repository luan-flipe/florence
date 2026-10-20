<?php
/**
 * Quiz vocacional da graduacao: 6 perguntas, resultado com os 3 cursos que mais combinam.
 * A pontuacao usa o slug do curso; curso que sair do ar simplesmente nao aparece.
 */
if ( ! defined( 'ABSPATH' ) ) exit;
get_header();

$cursos = array();
foreach ( get_posts( array( 'post_type' => 'curso', 'post_status' => 'publish', 'numberposts' => -1, 'meta_key' => 'nivel', 'meta_value' => 'graduacao' ) ) as $p ) {
	$r = florence2026_resumo_comparacao( $p->ID );
	$cursos[ $p->post_name ] = array(
		'id'      => $p->ID,
		'nome'    => $r['nome'],
		'url'     => $r['url'],
		'imagem'  => $r['imagem'],
		'duracao' => $r['duracao'],
		'resumo'  => wp_trim_words( $r['resumo'], 22 ),
	);
}

$perguntas = array(
	array( 'O que mais chama sua atenção?', array(
		array( 'Cuidar das pessoas de perto', array( 'enfermagem' => 3, 'medicina' => 2, 'fisioterapia' => 2 ) ),
		array( 'Laboratório, exames e ciência', array( 'biomedicina' => 3, 'farmacia' => 3 ) ),
		array( 'Cuidar de animais', array( 'medicina-veterinaria' => 4 ) ),
		array( 'Leis, argumentos e justiça', array( 'direito' => 4 ) ),
		array( 'Beleza e autoestima', array( 'estetica-e-cosmetica' => 4 ) ),
		array( 'Alimentação e qualidade de vida', array( 'nutricao' => 4 ) ),
	) ),
	array( 'Onde você se imagina trabalhando?', array(
		array( 'Hospital ou unidade de saúde', array( 'enfermagem' => 2, 'medicina' => 3 ) ),
		array( 'Consultório próprio', array( 'odontologia' => 3, 'fisioterapia' => 2, 'nutricao' => 2, 'estetica-e-cosmetica' => 2 ) ),
		array( 'Laboratório ou farmácia', array( 'biomedicina' => 3, 'farmacia' => 3 ) ),
		array( 'Escritório, tribunal ou órgão público', array( 'direito' => 3 ) ),
		array( 'Clínica veterinária ou campo', array( 'medicina-veterinaria' => 3 ) ),
	) ),
	array( 'Qual destas é a sua maior habilidade?', array(
		array( 'Trabalhar com as mãos, com precisão', array( 'odontologia' => 3, 'estetica-e-cosmetica' => 2, 'fisioterapia' => 2 ) ),
		array( 'Investigar e resolver problemas', array( 'biomedicina' => 2, 'medicina' => 2, 'farmacia' => 2 ) ),
		array( 'Falar, escrever e convencer', array( 'direito' => 3, 'nutricao' => 1 ) ),
		array( 'Acolher e ter paciência', array( 'enfermagem' => 3, 'fisioterapia' => 1, 'medicina-veterinaria' => 1 ) ),
	) ),
	array( 'Qual matéria você mais curtia na escola?', array(
		array( 'Biologia', array( 'biomedicina' => 2, 'medicina' => 2, 'medicina-veterinaria' => 2, 'enfermagem' => 1 ) ),
		array( 'Química', array( 'farmacia' => 3, 'estetica-e-cosmetica' => 1, 'nutricao' => 1 ) ),
		array( 'História, redação ou sociologia', array( 'direito' => 3 ) ),
		array( 'Educação física', array( 'fisioterapia' => 3, 'nutricao' => 1 ) ),
		array( 'Artes', array( 'odontologia' => 2, 'estetica-e-cosmetica' => 2 ) ),
	) ),
	array( 'O que te deixaria orgulhoso no fim do dia?', array(
		array( 'Ver alguém voltar a se mexer sem dor', array( 'fisioterapia' => 3 ) ),
		array( 'Devolver um sorriso', array( 'odontologia' => 3 ) ),
		array( 'Acertar um diagnóstico difícil', array( 'medicina' => 3, 'biomedicina' => 2 ) ),
		array( 'Ganhar uma causa justa', array( 'direito' => 3 ) ),
		array( 'Um pet saudável voltando pra casa', array( 'medicina-veterinaria' => 3 ) ),
		array( 'Um paciente bem cuidado e tranquilo', array( 'enfermagem' => 3, 'farmacia' => 1 ) ),
		array( 'Alguém mudando os hábitos e se sentindo bem', array( 'nutricao' => 3, 'estetica-e-cosmetica' => 2 ) ),
	) ),
	array( 'Quanto tempo você topa estudar?', array(
		array( 'O mínimo possível, quero trabalhar logo', array( 'estetica-e-cosmetica' => 3, 'biomedicina' => 1, 'nutricao' => 1 ) ),
		array( 'Uns 4 ou 5 anos está ótimo', array( 'biomedicina' => 1, 'nutricao' => 1, 'enfermagem' => 1, 'farmacia' => 1, 'fisioterapia' => 1, 'odontologia' => 1, 'direito' => 1, 'medicina-veterinaria' => 1 ) ),
		array( 'O que for preciso, mesmo que sejam 6 anos', array( 'medicina' => 2 ) ),
	) ),
);
?>
<div class="course-hero">
	<div class="shell" style="padding-bottom:3rem">
		<div class="crumb"><a href="<?php echo esc_url( home_url( '/' ) ); ?>">Início</a> &middot; Qual curso combina comigo?</div>
		<h1>Qual curso combina com você?</h1>
		<p class="lead">Seis perguntas rápidas, menos de um minuto. No fim você vê os cursos de graduação que mais têm a ver com o seu jeito.</p>
	</div>
</div>

<section>
	<div class="shell">
		<div class="quiz" data-quiz data-comparar="<?php echo esc_url( home_url( '/comparar-cursos/' ) ); ?>">
			<noscript><p>O teste precisa de JavaScript. Você pode <a href="<?php echo esc_url( add_query_arg( 'nivel', 'graduacao', get_post_type_archive_link( 'curso' ) ) ); ?>">ver todos os cursos de graduação</a>.</p></noscript>
		</div>
		<script type="application/json" id="quiz-dados"><?php echo wp_json_encode( array( 'perguntas' => $perguntas, 'cursos' => $cursos ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG ); ?></script>
	</div>
</section>
<?php get_footer();
