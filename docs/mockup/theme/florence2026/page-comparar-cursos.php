<?php
/** Comparador de cursos: ate 3 lado a lado. Recebe ?c=12,34,56. */
if ( ! defined( 'ABSPATH' ) ) exit;
get_header();

$ids = isset( $_GET['c'] ) ? array_slice( array_filter( array_map( 'absint', explode( ',', sanitize_text_field( wp_unslash( $_GET['c'] ) ) ) ) ), 0, 3 ) : array();
$ids = array_values( array_filter( $ids, function ( $id ) { return 'curso' === get_post_type( $id ) && 'publish' === get_post_status( $id ); } ) );
$cursos = array_map( 'florence2026_resumo_comparacao', $ids );
$grupos = florence2026_cursos_por_nivel();

$linhas = array(
	'nivel'      => 'Nível',
	'modalidade' => 'Modalidade',
	'duracao'    => 'Duração',
	'titulacao'  => 'Titulação',
	'docentes'   => 'Professores',
	'mec'        => 'Reconhecimento MEC',
);
?>
<div class="course-hero">
	<div class="shell" style="padding-bottom:3rem">
		<div class="crumb"><a href="<?php echo esc_url( home_url( '/' ) ); ?>">Início</a> &middot; Comparar cursos</div>
		<h1>Compare os cursos lado a lado</h1>
		<p class="lead">Escolha até três cursos e veja duração, modalidade, titulação e corpo docente na mesma tela.</p>
	</div>
</div>

<section>
	<div class="shell">
		<form class="comparar-form" method="get" action="<?php echo esc_url( get_permalink() ); ?>" data-comparar-form>
			<?php for ( $i = 0; $i < 3; $i++ ) : $atual = isset( $ids[ $i ] ) ? $ids[ $i ] : 0; ?>
				<label class="comparar-select">
					<span>Curso <?php echo esc_html( $i + 1 ); ?></span>
					<select data-slot>
						<option value="">Escolha um curso</option>
						<?php foreach ( $grupos as $grupo => $posts ) : ?>
							<optgroup label="<?php echo esc_attr( $grupo ); ?>">
								<?php foreach ( $posts as $p ) : ?>
									<option value="<?php echo esc_attr( $p->ID ); ?>"<?php selected( $atual, $p->ID ); ?>><?php echo esc_html( $p->post_title ); ?></option>
								<?php endforeach; ?>
							</optgroup>
						<?php endforeach; ?>
					</select>
				</label>
			<?php endfor; ?>
			<input type="hidden" name="c" value="<?php echo esc_attr( implode( ',', $ids ) ); ?>">
			<button type="submit" class="btn btn-gold">Comparar</button>
		</form>

		<?php if ( count( $cursos ) < 2 ) : ?>
			<p class="comparar-dica">Escolha pelo menos dois cursos para ver a comparação.</p>
		<?php else : ?>
			<div class="comparar-tabela-wrap" tabindex="0" role="region" aria-label="Tabela de comparação">
				<table class="comparar-tabela">
					<thead>
						<tr>
							<th scope="col"><span class="screen-reader-text">Item</span></th>
							<?php foreach ( $cursos as $c ) : ?>
								<th scope="col">
									<?php if ( $c['imagem'] ) : ?><img src="<?php echo esc_url( $c['imagem'] ); ?>" alt="" loading="lazy"><?php endif; ?>
									<a href="<?php echo esc_url( $c['url'] ); ?>"><?php echo esc_html( $c['nome'] ); ?></a>
								</th>
							<?php endforeach; ?>
						</tr>
					</thead>
					<tbody>
						<?php foreach ( $linhas as $campo => $rotulo ) : ?>
							<tr>
								<th scope="row"><?php echo esc_html( $rotulo ); ?></th>
								<?php foreach ( $cursos as $c ) : ?>
									<td><?php
									if ( 'docentes' === $campo ) {
										if ( ! $c['docentes'] ) { echo '<span class="vazio">Lista em atualização</span>'; }
										else {
											$extra = array();
											if ( $c['doutores'] ) $extra[] = sprintf( '%d doutores', $c['doutores'] );
											if ( $c['mestres'] ) $extra[] = sprintf( '%d mestres', $c['mestres'] );
											echo esc_html( sprintf( '%d professores', $c['docentes'] ) . ( $extra ? ' (' . implode( ', ', $extra ) . ')' : '' ) );
										}
									} elseif ( 'mec' === $campo && ! $c['mec'] ) {
										echo '<a href="' . esc_url( home_url( '/transparencia-mec/' ) ) . '">Ver no e-MEC</a>';
									} else {
										echo $c[ $campo ] ? esc_html( $c[ $campo ] ) : '<span class="vazio">Consulte</span>';
									}
									?></td>
								<?php endforeach; ?>
							</tr>
						<?php endforeach; ?>
						<tr>
							<th scope="row">Valores</th>
							<?php foreach ( $cursos as $c ) : ?>
								<td><a href="<?php echo esc_url( $c['url'] . '#valores' ); ?>">Receber os valores</a></td>
							<?php endforeach; ?>
						</tr>
						<tr class="comparar-acoes">
							<th scope="row"><span class="screen-reader-text">Inscrição</span></th>
							<?php foreach ( $cursos as $c ) : ?>
								<td><a class="btn btn-gold" href="<?php echo esc_url( $c['inscricao'] ); ?>" target="_blank" rel="noopener">Quero minha vaga</a></td>
							<?php endforeach; ?>
						</tr>
					</tbody>
				</table>
			</div>
		<?php endif; ?>
	</div>
</section>

<section class="final">
	<div class="shell">
		<h2>Ainda não decidiu?</h2>
		<p>Responda algumas perguntas rápidas e veja quais cursos combinam com você.</p>
		<a href="<?php echo esc_url( home_url( '/qual-curso-combina-comigo/' ) ); ?>" class="btn btn-navy">Fazer o teste</a>
	</div>
</section>
<?php get_footer();
