<?php
/**
 * Listagem. Atende os 11 CPTs de curso com um layout so, e cai no
 * formato de noticias para os demais arquivos.
 */
if ( ! defined( 'ABSPATH' ) ) exit;
get_header();

$tipo    = get_post_type() ? get_post_type() : get_query_var( 'post_type' );
$e_curso = florence2026_e_curso( $tipo );

// Consulta explicita: os arquivos destes CPTs vinham vazios na query principal.
$q = null;
if ( $e_curso ) {
	$filtros = array();
	if ( 'curso' === $tipo && ! empty( $_GET['nivel'] ) ) {
		$filtros = array( array( 'key' => 'nivel', 'value' => sanitize_text_field( wp_unslash( $_GET['nivel'] ) ) ) );
	}
	$q = new WP_Query( array(
		'meta_query'     => $filtros,
		'post_type'      => $tipo,
		'post_status'    => 'publish',
		'posts_per_page' => 200,
		'orderby'        => 'title',
		'order'          => 'ASC',
	) );
}
$obj   = get_post_type_object( $tipo );
$rotulo = $obj ? $obj->labels->name : '';

// Listagem filtrada por nivel mostra o nome do nivel (Graduacao, Tecnico...) no lugar de "Cursos".
if ( 'curso' === $tipo && ! empty( $_GET['nivel'] ) && function_exists( 'florence_niveis' ) ) {
	$niveis = array_merge( florence_niveis(), array( 'livre' => 'Cursos livres' ) );
	$chave  = sanitize_text_field( wp_unslash( $_GET['nivel'] ) );
	if ( isset( $niveis[ $chave ] ) ) {
		$rotulo = $niveis[ $chave ];
	}
}
?>
<div class="course-hero">
	<div class="shell" style="padding-bottom:3rem">
		<div class="crumb"><a href="<?php echo esc_url( home_url( '/' ) ); ?>">Início</a> &middot; <?php echo esc_html( $rotulo ); ?></div>
		<h1><?php echo esc_html( $e_curso ? $rotulo : wp_strip_all_tags( get_the_archive_title() ) ); ?></h1>
		<?php if ( $e_curso && $q ) : ?>
			<p class="lead"><?php echo esc_html( sprintf( '%d cursos disponíveis. Escolha o seu e fale com o time de admissões.', $q->found_posts ) ); ?></p>
		<?php endif; ?>
	</div>
</div>

<section>
	<div class="shell">
		<?php if ( $e_curso && $q && $q->have_posts() ) :
			// Modalidades presentes nesta listagem viram os botoes de filtro.
			$cursos = array();
			$modos  = array();
			while ( $q->have_posts() ) {
				$q->the_post();
				$campos = florence2026_campos_curso( get_the_ID() );
				$modo   = $campos['modalidade'] ? wp_trim_words( $campos['modalidade'], 2, '' ) : '';
				if ( $modo ) $modos[ sanitize_title( $modo ) ] = $modo;
				// Tamanho medio no card: a imagem original chegava a varios MB.
				$thumb = has_post_thumbnail() ? get_the_post_thumbnail_url( get_the_ID(), 'medium_large' ) : $campos['imagem'];
				$cursos[] = array( get_the_ID(), $campos, $modo, $thumb );
			}
			wp_reset_postdata();
			?>
			<?php if ( count( $cursos ) > 6 ) : ?>
				<div class="filtro-cursos">
					<label class="filtro-campo">
						<span class="screen-reader-text">Buscar curso</span>
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
						<input type="search" class="filtro-busca" placeholder="Buscar pelo nome do curso" autocomplete="off">
					</label>
					<?php if ( count( $modos ) > 1 ) : ?>
						<div class="filtro-chips" role="group" aria-label="Modalidade">
							<button type="button" class="filtro-chip" data-modalidade="" aria-pressed="true">Todas</button>
							<?php foreach ( $modos as $slug => $nome ) : ?>
								<button type="button" class="filtro-chip" data-modalidade="<?php echo esc_attr( $slug ); ?>" aria-pressed="false"><?php echo esc_html( $nome ); ?></button>
							<?php endforeach; ?>
						</div>
					<?php endif; ?>
					<span class="filtro-contagem" aria-live="polite"></span>
				</div>
				<p class="filtro-vazio" hidden>Nenhum curso encontrado com esse filtro. Tente outro nome ou <a href="<?php echo esc_url( florence2026_whatsapp() ); ?>" target="_blank" rel="noopener">fale com a gente no WhatsApp</a>.</p>
			<?php endif; ?>
			<div class="curso-grid" data-filtro-cursos>
				<?php
				foreach ( $cursos as $item ) :
					list( $cid, $campos, $modo, $thumb ) = $item;
					?>
					<a class="curso-card" href="<?php echo esc_url( get_permalink( $cid ) ); ?>" data-nome="<?php echo esc_attr( get_the_title( $cid ) ); ?>" data-modalidade="<?php echo esc_attr( sanitize_title( $modo ) ); ?>">
						<?php if ( $thumb ) : ?>
							<div class="curso-thumb"><img src="<?php echo esc_url( $thumb ); ?>" alt="" loading="lazy"></div>
						<?php endif; ?>
						<div class="curso-body">
							<?php if ( $campos['titulacao'] ) : ?>
								<span class="curso-tag"><?php echo esc_html( $campos['titulacao'] ); ?></span>
							<?php endif; ?>
							<h2><?php echo esc_html( get_the_title( $cid ) ); ?></h2>
							<?php if ( $campos['resumo'] ) : ?>
								<p><?php echo esc_html( wp_trim_words( $campos['resumo'], 18 ) ); ?></p>
							<?php endif; ?>
							<div class="curso-meta">
								<?php if ( $campos['duracao'] ) : ?><span><?php echo esc_html( $campos['duracao'] ); ?></span><?php endif; ?>
								<?php if ( $campos['modalidade'] ) : ?><span><?php echo esc_html( wp_trim_words( $campos['modalidade'], 4 ) ); ?></span><?php endif; ?>
							</div>
						</div>
					</a>
				<?php endforeach; ?>
			</div>
		<?php elseif ( have_posts() ) : ?>
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
			<p>Nenhum item encontrado nesta listagem.</p>
		<?php endif; ?>
	</div>
</section>

<section class="final">
	<div class="shell">
		<h2>Ainda em dúvida sobre qual curso escolher?</h2>
		<p>Fale com o time de admissões. A gente ajuda você a comparar as opções e entender as formas de ingresso.</p>
		<a href="<?php echo esc_url( home_url( '/#inscricao' ) ); ?>" class="btn btn-navy">Falar com admissões</a>
	</div>
</section>
<?php get_footer();
