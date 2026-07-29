<?php
/** Pagina institucional padrao. */
if ( ! defined( 'ABSPATH' ) ) exit;
get_header();

while ( have_posts() ) :
	the_post();

	/*
	 * O Elementor guarda o conteudo em _elementor_data, nao em post_content.
	 * Por isso a checagem de "vazia" precisa ser feita sobre o conteudo JA
	 * renderizado (com os filtros aplicados), senao paginas do Elementor e
	 * paginas com shortcode sao lidas como vazias por engano.
	 */
	$html  = apply_filters( 'the_content', get_the_content() );

	/*
	 * Paginas antigas guardam residuos invisiveis do editor (marcacoes de
	 * cursor do TinyMCE, espaco fixo, BOM). Sem limpar isso, uma pagina sem
	 * conteudo nenhum e lida como preenchida.
	 */
	$texto = preg_replace( '/[\x{200B}-\x{200D}\x{FEFF}\x{00A0}]/u', '', wp_strip_all_tags( $html ) );
	$texto = trim( (string) $texto );

	// Conteudo que nao gera texto (PDF embutido, imagem, video) tambem conta.
	$midia = (bool) preg_match( '/<(img|iframe|video|audio|table|form|embed|object)\b/i', $html );
	$vazia = ( '' === $texto && ! $midia );

	/*
	 * Layout proprio do Elementor: largura total, sem coluna de leitura nem
	 * barra lateral. Vale so quando existe conteudo montado no construtor.
	 * Muitas paginas foram abertas no Elementor sem nada ser montado, e o
	 * texto delas mora no editor normal: essas seguem o fluxo de leitura.
	 */
	$dados     = get_post_meta( get_the_ID(), '_elementor_data', true );
	$elementor = is_string( $dados ) && strlen( $dados ) > 2;
	$longa     = mb_strlen( $texto ) > 12000 ? ' longa' : '';
	?>
<div class="course-hero">
	<div class="shell" style="padding-bottom:3rem">
		<div class="crumb"><a href="<?php echo esc_url( home_url( '/' ) ); ?>">Início</a> &middot; <?php the_title(); ?></div>
		<h1><?php the_title(); ?></h1>
		<?php if ( has_excerpt() ) : ?>
			<p class="lead"><?php echo esc_html( get_the_excerpt() ); ?></p>
		<?php endif; ?>
	</div>
</div>

<?php if ( $elementor && ! $vazia ) : ?>

	<div class="pagina-elementor"><?php echo $html; ?></div>

<?php else : ?>

	<div class="shell">
		<div class="course-body">
			<div class="course-main">
				<section>
					<?php if ( $vazia ) : ?>
						<div class="pagina-vazia">
							<p style="margin:0 0 .8rem;font-family:var(--display);font-weight:700;color:var(--navy-dark)">Conteúdo em atualização</p>
							<p style="margin:0">Esta página ainda não tem conteúdo publicado. Enquanto isso, fale com nosso time ou conheça os cursos.</p>
							<p style="margin:1.4rem 0 0">
								<a href="<?php echo esc_url( get_post_type_archive_link( 'curso' ) ); ?>" class="btn btn-line">Ver todos os cursos</a>
							</p>
						</div>
					<?php else : ?>
						<div class="conteudo<?php echo esc_attr( $longa ); ?>"><?php echo $html; ?></div>
					<?php endif; ?>
				</section>
			</div>
			<aside>
				<div class="enroll">
					<p style="font-family:var(--display);font-weight:800;font-size:1.2rem;margin-bottom:.6rem">Ficou com dúvida?</p>
					<p style="color:var(--muted);font-size:.93rem">Fale com o time de admissões e tire suas dúvidas sobre cursos, bolsas e inscrição.</p>
					<hr>
					<a href="<?php echo esc_url( home_url( '/#inscricao' ) ); ?>" class="btn btn-gold">Quero minha vaga</a>
					<a href="<?php echo esc_url( get_post_type_archive_link( 'curso' ) ); ?>" class="btn btn-line" style="width:100%;justify-content:center">Ver cursos</a>
				</div>
			</aside>
		</div>
	</div>

<?php endif; ?>

<?php endwhile; ?>
<?php get_footer();
