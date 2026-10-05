<?php
/**
 * Corporativo Florence (pagina 28609, slug empresas). A versao antiga era
 * vazia. Aqui apresentamos o programa para empresas e ligamos ao formulario
 * Empresas (Ninja Forms id 6), que capta o lead com CNPJ e responsavel.
 * O WhatsApp e o numero unico oficial (a Florence nao usa mais o corporativo).
 */
if ( ! defined( 'ABSPATH' ) ) exit;
get_header();
$zapcorp = florence2026_links_uteis()['whatsapp'];
?>
<div class="course-hero">
	<div class="shell" style="padding-bottom:3rem">
		<div class="crumb">
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>">Início</a> &middot; Corporativo
		</div>
		<h1>Corporativo Florence</h1>
		<p class="lead">Sua empresa investe na formação da equipe e todos ganham. Condições especiais de mensalidade para funcionários e seus dependentes, em graduação, técnico e pós-graduação.</p>
	</div>
</div>

<section>
	<div class="shell">
		<div class="contato-grid">
			<div class="contato-canais">
				<div class="canal">
					<span>Como funciona</span>
					<p>A Florence firma uma parceria com a sua empresa. A partir dela, colaboradores e dependentes têm desconto na mensalidade em qualquer curso.</p>
				</div>
				<div class="canal">
					<span>Para quem</span>
					<p>Empresas privadas, órgãos públicos e entidades que queiram oferecer educação superior como benefício ao time.</p>
				</div>
				<div class="canal">
					<span>WhatsApp</span>
					<a class="dest" href="<?php echo esc_url( $zapcorp ); ?>" target="_blank" rel="noopener">(98) 98863-0502</a>
					<p>Prefere falar direto? Chame no WhatsApp e peça pelo Corporativo.</p>
				</div>
			</div>
			<div class="contato-form">
				<h2>Quero uma parceria</h2>
				<p class="lead-form-sub">Deixe os dados da empresa e o time de parcerias entra em contato.</p>
				<?php echo do_shortcode( '[ninja_form id=6]' ); ?>
			</div>
		</div>
	</div>
</section>
<?php get_footer();
