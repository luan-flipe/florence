<?php
/** Home institucional. Layout aprovado na Fase 2. Textos em textos.php. */
if ( ! defined( 'ABSPATH' ) ) exit;
get_header();
$img = get_template_directory_uri() . '/img';
$t   = florence2026_txt();
$seta = '<svg width="17" height="12" viewBox="0 0 17 12" fill="none" aria-hidden="true"><path d="M1 6h14M10 1l5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
?>
<div class="hero">
	<div class="shell">
		<div>
			<div class="eyebrow"><?php echo esc_html( $t['hero_eyebrow'] ); ?></div>
			<h1><?php echo esc_html( $t['hero_h1_a'] ); ?><em><?php echo esc_html( $t['hero_h1_em'] ); ?></em><?php echo esc_html( $t['hero_h1_b'] ); ?></h1>
			<p class="lead"><?php echo esc_html( $t['hero_lead'] ); ?></p>
			<div class="hero-cta">
				<a href="<?php echo esc_url( florence2026_url_inscricao() ); ?>" class="btn btn-gold" target="_blank" rel="noopener"><?php echo esc_html( $t['cta_vaga'] ); ?></a>
				<a href="#cursos" class="btn btn-ghost"><?php echo esc_html( $t['cta_cursos'] ); ?></a>
			</div>
		</div>
		<div style="position:relative">
			<div class="hero-art"><img src="<?php echo esc_url( $img . '/hero-pratica.jpg' ); ?>" alt="Estudantes de enfermagem em prática supervisionada"></div>
			<div class="badge-mec">
				<div class="n">5</div>
				<div><small><strong style="color:var(--navy-dark)"><?php echo esc_html( $t['mec_strong'] ); ?></strong><br><?php echo esc_html( $t['mec_small'] ); ?></small></div>
			</div>
		</div>
	</div>
	<div class="credit">
		<div class="shell">
			<?php foreach ( $t['credit'] as $c ) : ?>
				<div><b><?php echo esc_html( $c[0] ); ?></b> <?php echo esc_html( $c[1] ); ?></div>
			<?php endforeach; ?>
		</div>
	</div>
</div>

<section id="cursos">
	<div class="shell">
		<div class="sec-head">
			<div><div class="kicker"><?php echo esc_html( $t['paths_kicker'] ); ?></div><h2><?php echo esc_html( $t['paths_h2'] ); ?></h2></div>
			<p><?php echo esc_html( $t['paths_lead'] ); ?></p>
		</div>
		<div class="paths">
			<?php foreach ( $t['paths'] as $p ) : ?>
				<a href="<?php echo esc_url( home_url( $p['url'] ) ); ?>" class="path<?php echo $p['lead'] ? ' lead-path' : ''; ?>">
					<?php if ( $p['lead'] ) : ?>
						<div class="bg"><img src="<?php echo esc_url( $img . '/' . $p['img'] ); ?>" alt=""></div>
					<?php else : ?>
						<div class="thumb"><img src="<?php echo esc_url( $img . '/' . $p['img'] ); ?>" alt=""></div>
					<?php endif; ?>
					<div>
						<div class="num"><?php echo esc_html( $p['num'] ); ?></div>
						<h3><?php echo esc_html( $p['h3'] ); ?></h3>
						<p><?php echo esc_html( $p['p'] ); ?></p>
					</div>
					<span class="go"><?php echo esc_html( $p['go'] ); ?> <?php echo $seta; // phpcs:ignore ?></span>
				</a>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<section class="proof">
	<div class="shell">
		<div class="sec-head">
			<div><div class="kicker"><?php echo esc_html( $t['proof_kicker'] ); ?></div><h2><?php echo esc_html( $t['proof_h2'] ); ?></h2></div>
			<p><?php echo esc_html( $t['proof_lead'] ); ?></p>
		</div>
		<div class="proof-grid">
			<?php foreach ( $t['proof'] as $i => $pr ) : ?>
				<div class="pitem">
					<div class="idx"><?php echo esc_html( sprintf( '%02d', $i + 1 ) ); ?></div>
					<h3><?php echo esc_html( $pr[0] ); ?></h3>
					<p><?php echo esc_html( $pr[1] ); ?></p>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<section class="clinica">
	<div class="shell">
		<div class="sec-head">
			<div>
				<div class="kicker"><?php echo esc_html( $t['clinica_kicker'] ); ?></div>
				<h2><?php echo esc_html( $t['clinica_h2'] ); ?></h2>
			</div>
			<p><?php echo esc_html( $t['clinica_lead'] ); ?></p>
		</div>
		<div class="fotos-estrutura">
			<?php foreach ( $t['clinica_fotos'] as $f ) : ?>
				<figure>
					<img src="<?php echo esc_url( $img . '/' . $f[0] ); ?>" alt="<?php echo esc_attr( $f[1] ); ?>" loading="lazy">
					<figcaption><?php echo esc_html( $f[1] ); ?></figcaption>
				</figure>
			<?php endforeach; ?>
		</div>
		<a href="<?php echo esc_url( home_url( '/clinica-escola/' ) ); ?>" class="btn btn-line"><?php echo esc_html( $t['clinica_cta'] ); ?></a>
	</div>
</section>

<section class="money" id="inscricao">
	<div class="shell">
		<div>
			<div class="kicker" style="color:var(--gold)"><?php echo esc_html( $t['money_kicker'] ); ?></div>
			<h2><?php echo esc_html( $t['money_h2'] ); ?></h2>
			<p><?php echo esc_html( $t['money_p'] ); ?></p>
				<a href="<?php echo esc_url( home_url( '/bolsas-e-financiamento/' ) ); ?>" class="btn btn-line" style="margin-top:1.6rem">Ver bolsas e financiamento</a>
		</div>
		<div class="lead-form">
			<h3><?php echo esc_html( $t['sim_titulo'] ); ?></h3>
			<p class="lead-form-sub"><?php echo esc_html( $t['sim_sub'] ); ?></p>
			<?php echo do_shortcode( '[ninja_form id=10]' ); ?>
		</div>
	</div>
</section>

<section>
	<div class="shell">
		<div class="sec-head">
			<div><div class="kicker"><?php echo esc_html( $t['ways_kicker'] ); ?></div><h2><?php echo esc_html( $t['ways_h2'] ); ?></h2></div>
			<a href="<?php echo esc_url( florence2026_url_inscricao() ); ?>" class="btn btn-line" target="_blank" rel="noopener"><?php echo esc_html( $t['ways_cta'] ); ?></a>
		</div>
		<div class="ways">
			<?php foreach ( $t['ways'] as $i => $w ) : ?>
				<a class="way" href="<?php echo esc_url( isset( $w[2] ) ? $w[2] : florence2026_url_inscricao() ); ?>" target="_blank" rel="noopener">
					<i><?php echo esc_html( sprintf( '%02d', $i + 1 ) ); ?></i>
					<b><?php echo esc_html( $w[0] ); ?></b>
					<span><?php echo esc_html( $w[1] ); ?></span>
				</a>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<?php
// Puxa notícias reais do conteúdo migrado, provando que o tema consome o banco.
$noticias = new WP_Query( array( 'posts_per_page' => 3, 'ignore_sticky_posts' => true ) );
if ( $noticias->have_posts() ) :
	$blog = get_option( 'page_for_posts' ) ? get_permalink( get_option( 'page_for_posts' ) ) : home_url( '/noticias/' );
	?>
<section class="proof">
	<div class="shell">
		<div class="sec-head">
			<div><div class="kicker"><?php echo esc_html( $t['news_kicker'] ); ?></div><h2><?php echo esc_html( $t['news_h2'] ); ?></h2></div>
			<a href="<?php echo esc_url( $blog ); ?>" class="btn btn-line"><?php echo esc_html( $t['news_cta'] ); ?></a>
		</div>
		<div class="quotes">
			<?php while ( $noticias->have_posts() ) : $noticias->the_post(); ?>
				<a class="quote" href="<?php the_permalink(); ?>" style="display:block">
					<p style="font-family:var(--display);font-weight:700;font-size:1.1rem;line-height:1.25"><?php echo esc_html( wp_trim_words( get_the_title(), 14 ) ); ?></p>
					<footer><small><?php echo esc_html( get_the_date() ); ?></small></footer>
				</a>
			<?php endwhile; ?>
		</div>
	</div>
</section>
<?php endif; wp_reset_postdata(); ?>

<section class="final">
	<div class="shell">
		<h2><?php echo esc_html( $t['final_h2'] ); ?></h2>
		<p><?php echo esc_html( $t['final_p'] ); ?></p>
		<a href="<?php echo esc_url( florence2026_url_inscricao() ); ?>" class="btn btn-navy" target="_blank" rel="noopener"><?php echo esc_html( $t['final_cta'] ); ?></a>
	</div>
</section>
<?php get_footer();
