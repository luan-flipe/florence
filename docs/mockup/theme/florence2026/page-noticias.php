<?php
/**
 * Pagina de Noticias (slug: noticias, ID 172).
 * Lista os posts com o card de noticia e paginacao propria, para nao depender
 * de flipar show_on_front no site. A URL /noticias/ espelha a da producao.
 */
if ( ! defined( 'ABSPATH' ) ) exit;
get_header();

$paged = max( 1, (int) get_query_var( 'paged' ), (int) get_query_var( 'page' ) );
$q = new WP_Query( array(
	'post_type'      => 'post',
	'post_status'    => 'publish',
	'posts_per_page' => 12,
	'paged'          => $paged,
) );
?>
<div class="course-hero">
	<div class="shell" style="padding-bottom:3rem">
		<div class="crumb"><a href="<?php echo esc_url( home_url( '/' ) ); ?>">Início</a> &middot; Notícias</div>
		<h1><?php the_title(); ?></h1>
		<p class="lead">Acompanhe os comunicados, editais e novidades do Centro Universitário Florence.</p>
	</div>
</div>

<section>
	<div class="shell">
		<?php if ( $q->have_posts() ) : ?>
			<div class="noticias-grid">
				<?php
				while ( $q->have_posts() ) :
					$q->the_post();
					get_template_part( 'content', 'noticia' );
				endwhile;
				?>
			</div>
			<?php if ( $q->max_num_pages > 1 ) : ?>
				<div class="nav-links-wrap" style="margin-top:2.5rem;display:flex;justify-content:center">
					<div class="nav-links">
						<?php
						echo paginate_links( array( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
							'base'      => trailingslashit( get_permalink() ) . 'page/%#%/',
							'format'    => '',
							'current'   => $paged,
							'total'     => $q->max_num_pages,
							'mid_size'  => 1,
							'prev_text' => '‹',
							'next_text' => '›',
						) );
						?>
					</div>
				</div>
			<?php endif; ?>
			<?php wp_reset_postdata(); ?>
		<?php else : ?>
			<p>Nenhuma notícia publicada por enquanto.</p>
		<?php endif; ?>
	</div>
</section>
<?php get_footer();
