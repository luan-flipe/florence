<?php
/** Card de noticia usado nas listagens (blog, arquivos de categoria, busca). */
if ( ! defined( 'ABSPATH' ) ) exit;
$cats = get_the_category();
$cat  = ! empty( $cats ) ? $cats[0] : null;
?>
<a class="noticia-card" href="<?php the_permalink(); ?>">
	<?php if ( has_post_thumbnail() ) : ?>
		<div class="noticia-thumb"><?php the_post_thumbnail( 'medium_large', array( 'loading' => 'lazy', 'alt' => '' ) ); ?></div>
	<?php endif; ?>
	<div class="noticia-body">
		<?php if ( $cat ) : ?>
			<span class="noticia-tag"><?php echo esc_html( $cat->name ); ?></span>
		<?php endif; ?>
		<h2><?php the_title(); ?></h2>
		<p><?php echo esc_html( wp_trim_words( get_the_excerpt(), 22 ) ); ?></p>
		<time class="noticia-data" datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time>
	</div>
</a>
