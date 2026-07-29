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
		<div class="quotes">
			<?php
			if ( have_posts() ) :
				while ( have_posts() ) :
					the_post();
					?>
					<a class="quote" href="<?php the_permalink(); ?>" style="display:block">
						<p style="font-family:var(--display);font-weight:700;font-size:1.1rem;line-height:1.25"><?php the_title(); ?></p>
						<footer><small><?php echo esc_html( get_the_date() ); ?></small></footer>
					</a>
					<?php
				endwhile;
			else :
				echo '<p>Nada encontrado.</p>';
			endif;
			?>
		</div>
		<div style="margin-top:2.5rem"><?php the_posts_pagination(); ?></div>
	</div>
</section>
<?php get_footer();
