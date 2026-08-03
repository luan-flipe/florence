<?php
/**
 * Corporativo Florence (pagina 28609, slug empresas). A versao antiga era
 * vazia. Aqui apresentamos o programa para empresas e ligamos ao formulario
 * Empresas (Ninja Forms id 6), que capta o lead com CNPJ e responsavel.
 * Mantemos tambem o WhatsApp corporativo como canal direto.
 */
if ( ! defined( 'ABSPATH' ) ) exit;
get_header();
$zapcorp = 'https://api.whatsapp.com/send?phone=5598992422120';
?>
<div class="course-hero">
	<div class="shell">
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
					<span>WhatsApp corporativo</span>
					<a class="dest" href="<?php echo esc_url( $zapcorp ); ?>" target="_blank" rel="noopener">(98) 99242-2120</a>
					<p>Prefere falar direto? Chame o time de parcerias.</p>
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
