<?php
/**
 * Clinica-Escola (pagina 136, slug clinica-escola). Prova social concreta:
 * estrutura de saude propria com atendimento aberto a comunidade. Todo o
 * conteudo (missao, servicos, horarios, telefones) e factual, vindo do
 * site institucional. As fotos sao espacos reais da Florence, legendados
 * como ambiente/estrutura, nunca como consultorio clinico.
 */
if ( ! defined( 'ABSPATH' ) ) exit;
get_header();
$img = get_template_directory_uri() . '/img';

$odonto = array( 'Estomatologia', 'Radiologia', 'Periodontia', 'Dentística', 'Endodontia', 'Prótese Fixa', 'Cirurgia' );
$estetica = array(
	'Limpeza de pele', 'Revitalização facial', 'Peeling químico', 'Microagulhamento facial e corporal',
	'Massagem relaxante', 'Massagem modeladora', 'Drenagem linfática', 'Hidratação facial',
	'Redução de medidas', 'Detox para flacidez', 'Desincruste', 'Eletroterapia',
	'Desintoxicação capilar', 'Tratamento para queda', 'Microagulhamento capilar',
	'Design de sobrancelhas', 'Design de sobrancelhas com henna',
);
$pilares = array(
	array( 'Clínica de Odontologia', 'Atendimento odontológico supervisionado, da avaliação aos procedimentos, feito pelos estudantes com acompanhamento docente.' ),
	array( 'Ambulatório de Cuidados', 'Cuidados básicos de saúde à população atendida pelos projetos de extensão do Instituto Florence.' ),
	array( 'Laboratório de Análises Clínicas', 'Exames que apoiam o diagnóstico e aproximam o estudante da rotina real de um serviço de saúde.' ),
);
$fotos = array(
	array( 'estrutura-estudo.jpg', 'Espaço de estudo e convivência' ),
	array( 'estrutura-lab.jpg', 'Ambiente de aulas práticas' ),
	array( 'estrutura-recepcao.jpg', 'Recepção da unidade' ),
);
?>
<div class="course-hero">
	<div class="shell">
		<div class="crumb">
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>">Início</a> &middot;
			Estrutura &middot; Clínica-Escola
		</div>
		<h1>Clínica-Escola Profa. Dra. Filomena Barbosa Gomes Galas</h1>
		<p class="lead">A estrutura de saúde onde o estudante da Florence atende a comunidade de São Luís sob supervisão. Odontologia, ambulatório de cuidados e análises clínicas, abertos aos bairros vizinhos.</p>
		<div class="facts">
			<div class="fact"><span>Atendimento</span><b>Aberto à comunidade</b></div>
			<div class="fact"><span>Funcionamento</span><b>Seg a sex, 8h às 17h30</b></div>
			<div class="fact"><span>Agendamento</span><b>(98) 3878-2130</b></div>
		</div>
	</div>
</div>

<section>
	<div class="shell">
		<div class="sec-head">
			<div>
				<div class="kicker">Prática de verdade</div>
				<h2>Aqui o aprendizado acontece cuidando de gente.</h2>
			</div>
			<p>O Instituto Florence tem como missão promover saúde e cidadania. A Clínica-Escola reúne três frentes de atendimento básico à comunidade dos projetos de extensão e aos bairros vizinhos, e é onde a formação sai do papel.</p>
		</div>
		<div class="proof-grid">
			<?php foreach ( $pilares as $i => $p ) : ?>
				<div class="pitem">
					<div class="idx"><?php echo esc_html( sprintf( '%02d', $i + 1 ) ); ?></div>
					<h3><?php echo esc_html( $p[0] ); ?></h3>
					<p><?php echo esc_html( $p[1] ); ?></p>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<section class="fotos-sec">
	<div class="shell">
		<div class="fotos-estrutura">
			<?php foreach ( $fotos as $f ) : ?>
				<figure>
					<img src="<?php echo esc_url( $img . '/' . $f[0] ); ?>" alt="<?php echo esc_attr( $f[1] ); ?>" loading="lazy">
					<figcaption><?php echo esc_html( $f[1] ); ?></figcaption>
				</figure>
			<?php endforeach; ?>
		</div>
		<p class="foto-nota">Espaços reais da Florence em São Luís.</p>
	</div>
</section>

<section class="servicos-sec">
	<div class="shell">
		<div class="servicos-grid">
			<div>
				<div class="kicker">Odontologia</div>
				<h2>Serviços odontológicos</h2>
				<div class="chips">
					<?php foreach ( $odonto as $s ) : ?><span class="chip"><?php echo esc_html( $s ); ?></span><?php endforeach; ?>
				</div>
			</div>
			<div>
				<div class="kicker">Estética e Cosmética</div>
				<h2>Serviços de estética</h2>
				<div class="chips">
					<?php foreach ( $estetica as $s ) : ?><span class="chip"><?php echo esc_html( $s ); ?></span><?php endforeach; ?>
				</div>
			</div>
		</div>
		<div class="horarios">
			<div>
				<h3>Horários de atendimento</h3>
				<p>Segunda a sexta, das 8h às 12h e das 14h às 17h30. O atendimento é feito por agendamento prévio.</p>
			</div>
			<div class="tels">
				<span>Agende pelo telefone</span>
				<a href="tel:+559838782130">(98) 3878-2130</a>
				<a href="tel:+559838782112">(98) 3878-2112</a>
			</div>
		</div>
	</div>
</section>

<section class="final">
	<div class="shell">
		<h2>Estude onde a prática começa cedo.</h2>
		<p>A mesma estrutura que atende a comunidade é onde você aprende, desde os primeiros períodos.</p>
		<a href="<?php echo esc_url( florence2026_url_inscricao() ); ?>" class="btn btn-navy" target="_blank" rel="noopener">Quero minha vaga</a>
	</div>
</section>
<?php get_footer();
