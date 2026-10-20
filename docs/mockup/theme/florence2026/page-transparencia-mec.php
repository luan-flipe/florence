<?php
/**
 * Transparencia MEC: nota institucional, situacao de cada graduacao e documentos.
 * A situacao de cada curso vem do campo "Reconhecimento MEC" do painel; vazio,
 * o site manda para a consulta oficial no e-MEC em vez de inventar.
 */
if ( ! defined( 'ABSPATH' ) ) exit;
get_header();

$grad = get_posts( array( 'post_type' => 'curso', 'post_status' => 'publish', 'numberposts' => -1, 'meta_key' => 'nivel', 'meta_value' => 'graduacao', 'orderby' => 'title', 'order' => 'ASC' ) );
$docs = array_filter( array(
	'Plano de Desenvolvimento Institucional (PDI)' => get_page_by_path( 'plano-de-desenvolvimento' ),
	'Projeto Pedagógico Institucional (PPI)'       => get_page_by_path( 'projeto-politico' ),
	'Comissão Própria de Avaliação (CPA)'          => get_page_by_path( 'apresentacao-cpa' ),
	'Relatórios da CPA'                            => get_page_by_path( 'relatorios-cpa' ),
) );
$emec = 'https://emec.mec.gov.br/';
?>
<div class="course-hero">
	<div class="shell" style="padding-bottom:3rem">
		<div class="crumb"><a href="<?php echo esc_url( home_url( '/' ) ); ?>">Início</a> &middot; Transparência MEC</div>
		<h1>Transparência MEC</h1>
		<p class="lead">A situação oficial da Florence e de cada curso no Ministério da Educação, com link para conferir na fonte.</p>
	</div>
</div>

<section>
	<div class="shell">
		<div class="mec-destaque" data-reveal>
			<div class="mec-nota"><b data-count="5">5</b><span>de 5</span></div>
			<div>
				<h2>Nota máxima no recredenciamento institucional</h2>
				<p>O conceito é a avaliação do MEC sobre a instituição como um todo: corpo docente, infraestrutura e projeto pedagógico. Você pode conferir a situação da Florence e de qualquer curso no cadastro oficial do MEC.</p>
				<a class="btn btn-line" href="<?php echo esc_url( $emec ); ?>" target="_blank" rel="noopener">Consultar no e-MEC</a>
			</div>
		</div>
	</div>
</section>

<?php if ( $grad ) : ?>
<section>
	<div class="shell">
		<div class="sec-head" data-reveal><div><div class="kicker">Graduação</div><h2>Situação de cada curso</h2></div></div>
		<div class="comparar-tabela-wrap" tabindex="0" role="region" aria-label="Situação dos cursos no MEC">
			<table class="comparar-tabela mec-tabela">
				<thead><tr><th scope="col">Curso</th><th scope="col">Modalidade</th><th scope="col">Situação no MEC</th></tr></thead>
				<tbody>
					<?php foreach ( $grad as $p ) : $c = florence2026_campos_curso( $p->ID ); ?>
						<tr>
							<th scope="row"><a href="<?php echo esc_url( get_permalink( $p ) ); ?>"><?php echo esc_html( $p->post_title ); ?></a></th>
							<td><?php echo esc_html( $c['modalidade'] ); ?></td>
							<td><?php echo $c['mec'] ? esc_html( $c['mec'] ) : '<a href="' . esc_url( $emec ) . '" target="_blank" rel="noopener">Consultar no e-MEC</a>'; ?></td>
						</tr>
					<?php endforeach; ?>
				</tbody>
			</table>
		</div>
	</div>
</section>
<?php endif; ?>

<?php if ( $docs ) : ?>
<section>
	<div class="shell">
		<div class="sec-head" data-reveal><div><div class="kicker">Documentos institucionais</div><h2>Planos, projeto pedagógico e autoavaliação</h2></div></div>
		<ul class="mec-docs" data-reveal>
			<?php foreach ( $docs as $rotulo => $pagina ) : ?>
				<li><a href="<?php echo esc_url( get_permalink( $pagina ) ); ?>"><?php echo esc_html( $rotulo ); ?></a></li>
			<?php endforeach; ?>
		</ul>
	</div>
</section>
<?php endif; ?>

<?php
while ( have_posts() ) :
	the_post();
	if ( trim( wp_strip_all_tags( get_the_content() ) ) ) : ?>
		<section><div class="shell"><div class="conteudo"><?php the_content(); ?></div></div></section>
	<?php endif;
endwhile;
get_footer();
