<?php
/** Home institucional. Layout aprovado na Fase 2. Textos em textos.php. */
if ( ! defined( 'ABSPATH' ) ) exit;
get_header();
$img = get_template_directory_uri() . '/img';
$t   = florence2026_txt();
$seta = '<svg width="17" height="12" viewBox="0 0 17 12" fill="none" aria-hidden="true"><path d="M1 6h14M10 1l5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
?>
<div class="hero">
	<div class="hero-icones" aria-hidden="true"><?php foreach ( array( 'medicina', 'odontologia', 'direito', 'veterinaria', 'nutricao', 'farmacia', 'biomedicina', 'fisioterapia', 'estetica' ) as $ic ) echo '<span>' . florence2026_icone_area( $ic ) . '</span>'; // phpcs:ignore ?></div>
	<div class="hero-fundo" aria-hidden="true"><img src="<?php echo esc_url( $img . '/turma.jpg' ); ?>" alt=""></div>
	<div class="shell">
		<div>
			<div class="eyebrow"><span class="ao-vivo" aria-hidden="true"></span><?php echo esc_html( $t['hero_eyebrow'] ); ?></div>
			<h1><?php echo esc_html( $t['hero_h1_a'] ); ?><em><?php echo esc_html( $t['hero_h1_em'] ); ?></em><?php echo esc_html( $t['hero_h1_b'] ); ?></h1>
			<p class="lead"><?php echo esc_html( $t['hero_lead'] ); ?></p>
			<div class="hero-cta">
				<a href="<?php echo esc_url( florence2026_url_inscricao() ); ?>" class="btn btn-gold" target="_blank" rel="noopener"><?php echo esc_html( $t['cta_vaga'] ); ?></a>
				<a href="#cursos" class="btn btn-ghost"><?php echo esc_html( $t['cta_cursos'] ); ?></a>
			</div>
		</div>
		<div style="position:relative">
			<div class="hero-art"><img src="<?php echo esc_url( $img . '/hero-pratica.jpg' ); ?>" fetchpriority="high" alt="Estudantes de enfermagem em prática supervisionada"></div>
			<div class="badge-mec">
				<div class="selo-mec" role="img" aria-label="Selo MEC nota 5"><svg viewBox="0 0 64 64" aria-hidden="true"><polygon points="32.0,2.0 37.1,6.5 43.5,4.3 46.4,10.4 53.2,10.8 53.6,17.6 59.7,20.5 57.5,26.9 62.0,32.0 57.5,37.1 59.7,43.5 53.6,46.4 53.2,53.2 46.4,53.6 43.5,59.7 37.1,57.5 32.0,62.0 26.9,57.5 20.5,59.7 17.6,53.6 10.8,53.2 10.4,46.4 4.3,43.5 6.5,37.1 2.0,32.0 6.5,26.9 4.3,20.5 10.4,17.6 10.8,10.8 17.6,10.4 20.5,4.3 26.9,6.5" fill="#F5C842"/><circle cx="32" cy="32" r="22" fill="#00508c"/><circle cx="32" cy="32" r="19" fill="none" stroke="#F5C842" stroke-width="1" stroke-dasharray="2 2"/><text x="32" y="22.5" text-anchor="middle" font-family="Plus Jakarta Sans,sans-serif" font-size="6" font-weight="800" letter-spacing=".6" fill="#F5C842">MEC</text></svg><span class="n">5</span></div>
				<div><small><strong style="color:var(--navy-dark)"><?php echo esc_html( $t['mec_strong'] ); ?></strong><br><?php echo esc_html( $t['mec_small'] ); ?></small></div>
			</div>
		</div>
	</div>
	<div class="credit">
		<div class="shell">
			<?php
			// O total de graduacoes vem do banco: o texto fixo dizia 11 quando havia 10 publicadas.
			$credit = $t['credit'];
			$n_grad = florence2026_total_cursos( 'graduacao' );
			if ( $n_grad && isset( $credit[0] ) ) $credit[0][0] = (string) $n_grad;
			foreach ( $credit as $c ) :
				$num = ctype_digit( $c[0] ) ? ' data-count="' . esc_attr( $c[0] ) . '"' : '';
				?>
				<div><b<?php echo $num; // phpcs:ignore ?>><?php echo esc_html( $c[0] ); ?></b> <?php echo esc_html( $c[1] ); ?></div>
			<?php endforeach; ?>
		</div>
	</div>
</div>

<section id="cursos">
	<div class="shell">
		<div class="sec-head" data-reveal>
			<div><div class="kicker"><?php echo esc_html( $t['paths_kicker'] ); ?></div><h2><?php echo esc_html( $t['paths_h2'] ); ?></h2></div>
			<p><?php echo esc_html( $t['paths_lead'] ); ?></p>
		</div>
		<div class="paths" data-reveal>
			<?php foreach ( $t['paths'] as $p ) : ?>
				<a href="<?php echo esc_url( home_url( $p['url'] ) ); ?>" class="path<?php echo $p['lead'] ? ' lead-path' : ''; ?>">
					<?php if ( $p['lead'] ) : ?>
						<div class="bg"><img src="<?php echo esc_url( $img . '/' . $p['img'] ); ?>" alt=""></div>
					<?php else : ?>
						<div class="thumb"><img src="<?php echo esc_url( $img . '/' . $p['img'] ); ?>" alt=""></div>
					<?php endif; ?>
					<div>
						<div class="num"><?php echo esc_html( $p['num'] ); ?></div>
						<h3><?php echo esc_html( false !== strpos( $p['h3'], '%d' ) ? sprintf( $p['h3'], florence2026_total_cursos( 'graduacao' ) ) : $p['h3'] ); ?></h3>
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
		<div class="sec-head" data-reveal>
			<div><div class="kicker"><?php echo esc_html( $t['proof_kicker'] ); ?></div><h2><?php echo esc_html( $t['proof_h2'] ); ?></h2></div>
			<p><?php echo esc_html( $t['proof_lead'] ); ?></p>
		</div>
		<div class="proof-grid" data-reveal>
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
		<div class="sec-head" data-reveal>
			<div>
				<div class="kicker"><?php echo esc_html( $t['clinica_kicker'] ); ?></div>
				<h2><?php echo esc_html( $t['clinica_h2'] ); ?></h2>
			</div>
			<p><?php echo esc_html( $t['clinica_lead'] ); ?></p>
		</div>
		<?php
		// Carrossel continuo: fotos da estrutura + do site, duplicadas para o loop nao ter emenda.
		$fotos = array_merge( $t['clinica_fotos'], array( array( 'lab.jpg', 'Laboratório de aulas práticas' ), array( 'cirurgico.jpg', 'Prática em centro cirúrgico simulado' ), array( 'estudo.jpg', 'Estudo em grupo' ), array( 'equipe.jpg', 'Equipe de saúde em formação' ), array( 'turma.jpg', 'Turma em atividade' ) ) );
		?>
		<div class="fotos-carrossel" data-reveal>
			<div class="fotos-trilho">
				<?php foreach ( array( 0, 1 ) as $volta ) : foreach ( $fotos as $f ) : ?>
					<figure<?php echo $volta ? ' aria-hidden="true"' : ''; ?>>
						<img src="<?php echo esc_url( $img . '/' . $f[0] ); ?>" alt="<?php echo $volta ? '' : esc_attr( $f[1] ); ?>" loading="lazy">
						<figcaption><?php echo esc_html( $f[1] ); ?></figcaption>
					</figure>
				<?php endforeach; endforeach; ?>
			</div>
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
				<a href="<?php echo esc_url( home_url( '/bolsas-e-financiamento/' ) ); ?>" class="btn btn-ghost" style="margin-top:1.6rem">Ver bolsas e financiamento</a>
		</div>
		<div class="lead-form" data-reveal>
			<h3><?php echo esc_html( $t['sim_titulo'] ); ?></h3>
			<p class="lead-form-sub"><?php echo esc_html( $t['sim_sub'] ); ?></p>
			<?php echo do_shortcode( '[ninja_form id=10]' ); ?>
		</div>
	</div>
</section>

<section>
	<div class="shell">
		<div class="sec-head" data-reveal>
			<div><div class="kicker"><?php echo esc_html( $t['ways_kicker'] ); ?></div><h2><?php echo esc_html( $t['ways_h2'] ); ?></h2></div>
			<a href="<?php echo esc_url( florence2026_url_inscricao() ); ?>" class="btn btn-line" target="_blank" rel="noopener"><?php echo esc_html( $t['ways_cta'] ); ?></a>
		</div>
		<div class="ways" data-reveal>
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
		<div class="sec-head" data-reveal>
			<div><div class="kicker"><?php echo esc_html( $t['news_kicker'] ); ?></div><h2><?php echo esc_html( $t['news_h2'] ); ?></h2></div>
			<a href="<?php echo esc_url( $blog ); ?>" class="btn btn-line"><?php echo esc_html( $t['news_cta'] ); ?></a>
		</div>
		<div class="noticias-grid" data-reveal>
			<?php while ( $noticias->have_posts() ) : $noticias->the_post(); ?>
				<?php get_template_part( 'content', 'noticia' ); ?>
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
