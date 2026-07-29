<?php
/** Pagina institucional padrao. */
if ( ! defined( 'ABSPATH' ) ) exit;
get_header();

while ( have_posts() ) :
	the_post();
	$corpo  = trim( wp_strip_all_tags( get_the_content() ) );
	$vazia  = ( '' === $corpo );
	$longa  = mb_strlen( $corpo ) > 12000 ? ' longa' : '';
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
					<div class="conteudo<?php echo esc_attr( $longa ); ?>"><?php the_content(); ?></div>
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
<?php endwhile; ?>
<?php get_footer();
