<?php
/** Fallback: listagem de notícias, arquivos e busca. */
if ( ! defined( 'ABSPATH' ) ) exit;
get_header();
?>
<div class="course-hero">
	<div class="shell" style="padding-bottom:3rem">
		<h1>
			<?php
			if ( is_search() ) {
				echo esc_html( 'Busca: ' . get_search_query() );
			} elseif ( is_archive() ) {
				echo esc_html( get_the_archive_title() );
			} else {
				echo 'Notícias';
			}
			?>
		</h1>
	</div>
</div>
<section>
	<div class="shell">
		<?php if ( have_posts() ) : ?>
			<div class="noticias-grid">
				<?php
				while ( have_posts() ) :
					the_post();
					get_template_part( 'content', 'noticia' );
				endwhile;
				?>
			</div>
			<div style="margin-top:2.5rem"><?php the_posts_pagination(); ?></div>
		<?php else : ?>
			<p>Nada encontrado.</p>
		<?php endif; ?>
	</div>
</section>
<?php get_footer();
