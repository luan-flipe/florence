<?php
/**
 * Contato (pagina 141, slug contatos). A versao antiga era quase vazia (so
 * dois telefones). Aqui reunimos os canais reais e o formulario Fale Conosco
 * (Ninja Forms id 4). Endereco/mapa e telefones por setor ficam pendentes
 * com a Florence (ver docs/duvidas-florence.md) e entram quando chegarem.
 */
if ( ! defined( 'ABSPATH' ) ) exit;
get_header();
$uteis = florence2026_links_uteis();
?>
<div class="course-hero">
	<div class="shell">
		<div class="crumb">
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>">Início</a> &middot; Contato
		</div>
		<h1>Fale com a Florence</h1>
		<p class="lead">Tire suas dúvidas sobre cursos, inscrição, bolsas e o dia a dia do campus. Escolha o canal que preferir, ou mande uma mensagem pelo formulário.</p>
	</div>
</div>

<section>
	<div class="shell">
		<div class="contato-grid">
			<div class="contato-canais">
				<div class="canal">
					<span>WhatsApp</span>
					<a class="dest" href="<?php echo esc_url( $uteis['whatsapp'] ); ?>" target="_blank" rel="noopener">(98) 98863-0502</a>
					<p>Atendimento rápido para candidatos e alunos.</p>
				</div>
				<div class="canal">
					<span>Telefone</span>
					<a class="dest" href="tel:+559838782120">(98) 3878-2120</a>
					<p>Central de atendimento da instituição.</p>
				</div>
				<div class="canal">
					<span>Ouvidoria</span>
					<a class="dest" href="<?php echo esc_url( $uteis['ouvidoria'] ); ?>">Canal da Ouvidoria</a>
					<p>Registre elogios, sugestões ou reclamações.</p>
				</div>
			</div>
			<div class="contato-form">
				<h2>Envie uma mensagem</h2>
				<?php echo do_shortcode( '[ninja_form id=4]' ); ?>
			</div>
		</div>
	</div>
</section>
<?php get_footer();
