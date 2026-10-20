<?php
/**
 * Como entrar: as formas de ingresso com o passo a passo.
 * Documentos e calendario entram quando a Florence confirmar (FAQ do Flavio);
 * ate la, o texto do editor da pagina aparece no bloco "Informações".
 */
if ( ! defined( 'ABSPATH' ) ) exit;
get_header();
$vias  = florence2026_formas_ingresso();
$passos = array(
	array( 'Escolha o curso', 'Veja os cursos, compare as opções e tire dúvidas com o time de admissões.' ),
	array( 'Faça a inscrição online', 'Escolha a forma de ingresso abaixo e preencha seus dados. A inscrição não tem taxa.' ),
	array( 'Prova, nota ou documentos', 'Conforme a forma escolhida: prova online, nota do ENEM, histórico ou diploma.' ),
	array( 'Resultado e matrícula', 'Com a aprovação, o time de admissões orienta a matrícula e as bolsas disponíveis.' ),
);
?>
<div class="course-hero">
	<div class="shell" style="padding-bottom:3rem">
		<div class="crumb"><a href="<?php echo esc_url( home_url( '/' ) ); ?>">Início</a> &middot; Como entrar</div>
		<h1>Como entrar na Florence</h1>
		<p class="lead">Seis formas de ingresso, inscrição online e sem taxa. Escolha a que combina com o seu momento.</p>
	</div>
</div>

<section>
	<div class="shell">
		<div class="sec-head" data-reveal>
			<div><div class="kicker">Passo a passo</div><h2>Da inscrição à matrícula em quatro passos</h2></div>
		</div>
		<ol class="passos" data-reveal>
			<?php foreach ( $passos as $i => $p ) : ?>
				<li><span class="passo-n"><?php echo esc_html( $i + 1 ); ?></span><h3><?php echo esc_html( $p[0] ); ?></h3><p><?php echo esc_html( $p[1] ); ?></p></li>
			<?php endforeach; ?>
		</ol>
	</div>
</section>

<section>
	<div class="shell">
		<div class="sec-head" data-reveal>
			<div><div class="kicker">Formas de ingresso</div><h2>Escolha a sua forma de entrar</h2></div>
		</div>
		<div class="ways" data-reveal>
			<?php foreach ( $vias as $i => $v ) : ?>
				<a class="way" href="<?php echo esc_url( $v['url'] ); ?>" target="_blank" rel="noopener">
					<i><?php echo esc_html( sprintf( '%02d', $i + 1 ) ); ?></i>
					<b><?php echo esc_html( $v['rotulo'] ); ?></b>
					<span><?php echo esc_html( $v['descricao'] ); ?></span>
				</a>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<?php
while ( have_posts() ) :
	the_post();
	$extra = trim( wp_strip_all_tags( get_the_content() ) );
	if ( $extra ) : ?>
		<section>
			<div class="shell"><div class="conteudo"><?php the_content(); ?></div></div>
		</section>
	<?php endif;
endwhile;
?>

<section class="money" id="inscricao">
	<div class="shell">
		<div>
			<div class="kicker" style="color:var(--gold)">Dúvidas sobre documentos ou datas?</div>
			<h2>O time de admissões confirma tudo para você.</h2>
			<p>Deixe seu contato e a gente envia a lista de documentos da sua forma de ingresso, o calendário do processo seletivo e as bolsas que você pode usar.</p>
			<p class="note"><a href="<?php echo esc_url( home_url( '/bolsas-e-financiamento/' ) ); ?>" style="color:var(--gold)">Conheça as bolsas e o financiamento</a></p>
		</div>
		<div class="lead-form"><?php echo do_shortcode( '[ninja_form id=10]' ); ?></div>
	</div>
</section>
<?php get_footer();
