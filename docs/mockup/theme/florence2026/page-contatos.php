<?php
/**
 * Contato (pagina 141, slug contatos). A versao antiga era quase vazia (so
 * dois telefones). Aqui reunimos os canais reais, endereco com mapa e o
 * formulario Fale Conosco (Ninja Forms id 4). A Florence usa um numero unico,
 * que distribui o atendimento por setor (resposta de 11/09/2026).
 */
if ( ! defined( 'ABSPATH' ) ) exit;
get_header();
$uteis = florence2026_links_uteis();
?>
<div class="course-hero">
	<div class="shell" style="padding-bottom:3rem">
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
					<p>Ligação ou mensagem, no mesmo número. O atendimento direciona você ao setor certo.</p>
				</div>
				<div class="canal">
					<span>Horário de atendimento</span>
					<p class="dest"><?php echo esc_html( $uteis['horario'] ); ?></p>
				</div>
				<div class="canal">
					<span>Endereço</span>
					<p class="dest"><?php echo esc_html( $uteis['endereco'] ); ?></p>
					<a href="<?php echo esc_url( 'https://www.google.com/maps/search/?api=1&query=' . rawurlencode( 'Centro Universitário Florence, ' . $uteis['endereco'] ) ); ?>" target="_blank" rel="noopener">Como chegar</a>
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
		<?php // Capa leve no lugar do iframe: o Google Maps so carrega quando a pessoa pede. ?>
		<button type="button" class="mapa-capa" data-src="<?php echo esc_url( 'https://www.google.com/maps?output=embed&q=' . rawurlencode( 'Centro Universitário Florence, ' . $uteis['endereco'] ) ); ?>">
			<span class="mapa-pino" aria-hidden="true"></span>
			<span class="mapa-texto">
				<b>Centro Universitário Florence</b>
				<?php echo esc_html( $uteis['endereco'] ); ?>
			</span>
			<span class="btn btn-gold">Ver no mapa</span>
		</button>
	</div>
</section>
<?php get_footer();
