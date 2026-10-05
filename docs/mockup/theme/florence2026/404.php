<?php
/** Pagina nao encontrada. Antes caia no index e mostrava uma listagem de noticias. */
if ( ! defined( 'ABSPATH' ) ) exit;
get_header();
?>
<div class="course-hero">
	<div class="shell" style="padding-bottom:3rem">
		<div class="crumb"><a href="<?php echo esc_url( home_url( '/' ) ); ?>">Início</a> &middot; Página não encontrada</div>
		<h1>Essa página não existe mais</h1>
		<p class="lead">O endereço pode ter mudado com o novo site. Escolha um dos caminhos abaixo ou fale com a gente.</p>
	</div>
</div>

<section>
	<div class="shell">
		<div class="pagina-vazia">
			<p class="acoes-404">
				<a href="<?php echo esc_url( get_post_type_archive_link( 'curso' ) ); ?>" class="btn btn-gold">Ver todos os cursos</a>
				<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="btn btn-line">Voltar para o início</a>
				<a href="<?php echo esc_url( home_url( '/contatos/' ) ); ?>" class="btn btn-line">Falar com a Florence</a>
			</p>
		</div>
	</div>
</section>
<?php get_footer();
