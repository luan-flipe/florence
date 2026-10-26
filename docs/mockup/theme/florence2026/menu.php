<?php
/**
 * Mega menu do topo e icones por area. O menu continua vindo do painel
 * (local "principal"); os paineis sao escolhidos pelo endereco de cada item.
 */
if ( ! defined( 'ABSPATH' ) ) exit;

/** Icone de linha por area, escolhido pelo slug do curso. */
function florence2026_icone_area( $slug ) {
	$p = array(
		'dente'   => '<path d="M7 3c-2 0-3.5 1.6-3.5 4 0 2 .8 3.4 1.3 5.2.6 2.3.8 8.8 2.7 8.8 1.6 0 1.5-5 3.5-5s1.9 5 3.5 5c1.9 0 2.1-6.5 2.7-8.8.5-1.8 1.3-3.2 1.3-5.2 0-2.4-1.5-4-3.5-4-1.8 0-2.9 1-4 1S8.8 3 7 3Z"/>',
		'coracao' => '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/><path d="M7.5 11h2l1.2-2 2 4 1.3-2h2.5"/>',
		'cruz'    => '<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6Z"/>',
		'balanca' => '<path d="M12 3v18M7 21h10M5 7h14M5 7l-3 6a3 3 0 0 0 6 0L5 7Zm14 0-3 6a3 3 0 0 0 6 0l-3-6Z"/>',
		'pata'    => '<path d="M8 13.5c-2 2-2.8 3.8-1.4 5.2S10 19.2 12 19.2s3.9 1 5.4-.5-.6-3.2-2.4-5.2-1.6-3-3-3-2 1-4 3Z"/><circle cx="5.5" cy="9.5" r="1.6"/><circle cx="9.3" cy="5.8" r="1.6"/><circle cx="14.7" cy="5.8" r="1.6"/><circle cx="18.5" cy="9.5" r="1.6"/>',
		'maca'    => '<path d="M12 7c-1-2-3-3-5-2.5C4 5.2 3.5 9 4.5 12.5 5.6 16.5 8 20 10 20c1 0 1.3-.5 2-.5s1 .5 2 .5c2 0 4.4-3.5 5.5-7.5 1-3.5.5-7.3-2.5-8C15 4 13 5 12 7Zm0 0c0-2 1-3.5 3-4"/>',
		'pilula'  => '<path d="M10.5 3.5a5 5 0 0 1 7 7l-7 7a5 5 0 0 1-7-7Z"/><path d="m7 7 7 7"/>',
		'micro'   => '<path d="M9 3h4l-1 8h-2Zm2 8v2M5 21h14M8 21a6 6 0 0 1 9.5-9M14 7.5A6 6 0 0 1 18 13"/>',
		'pessoa'  => '<circle cx="13" cy="4.5" r="1.8"/><path d="M8 21l2.5-6.5L9 11l1.5-4h3.5l2 4h3M10.5 14.5 14 17v4M10.5 7.5 7 10.5"/>',
		'brilho'  => '<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8ZM18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8Z"/>',
		'capelo'  => '<path d="m2 9 10-5 10 5-10 5Zm4 2v5c3 2.5 9 2.5 12 0v-5M22 9v6"/>',
	);
	$regras = array(
		'odonto|bucal'                       => 'dente',
		'veterin'                            => 'pata',
		'medicina|radio|nuclear|mamograf'    => 'coracao',
		'enfermagem|hemoterapia|instrument'  => 'cruz',
		'direito'                            => 'balanca',
		'nutri|diet'                         => 'maca',
		'farm'                               => 'pilula',
		'biomed|analises|clinic|laborat'     => 'micro',
		'fisio'                              => 'pessoa',
		'estetic|cosmet'                     => 'brilho',
	);
	$tipo = 'capelo';
	foreach ( $regras as $re => $nome ) {
		if ( preg_match( '/' . $re . '/', (string) $slug ) ) { $tipo = $nome; break; }
	}
	return '<svg class="icone-area" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' . $p[ $tipo ] . '</svg>';
}

/** Cursos publicados de um nivel (titulo, link, slug). Guardado por 1h; limpa ao salvar curso. */
function florence2026_cursos_do_nivel( $nivel ) {
	$chave = 'fl_mega_' . $nivel;
	$lista = get_transient( $chave );
	if ( false === $lista ) {
		$lista = array();
		foreach ( get_posts( array( 'post_type' => 'curso', 'post_status' => 'publish', 'numberposts' => -1, 'meta_key' => 'nivel', 'meta_value' => $nivel, 'orderby' => 'title', 'order' => 'ASC' ) ) as $p ) {
			$lista[] = array( $p->post_title, get_permalink( $p ), $p->post_name );
		}
		set_transient( $chave, $lista, HOUR_IN_SECONDS );
	}
	return $lista;
}
add_action( 'save_post_curso', function () {
	foreach ( array( 'graduacao', 'tecnico', 'pos' ) as $n ) delete_transient( 'fl_mega_' . $n );
} );

/** Painel de cursos: lista com icones + coluna de atalhos. */
function florence2026_mega_cursos( $nivel, $titulo, $limite, $atalhos ) {
	$cursos = florence2026_cursos_do_nivel( $nivel );
	$total  = count( $cursos );
	$url    = add_query_arg( 'nivel', $nivel, get_post_type_archive_link( 'curso' ) );
	ob_start();
	?>
	<div class="mega-grid">
		<div class="mega-cursos">
			<p class="mega-titulo"><?php echo esc_html( sprintf( '%s · %d cursos', $titulo, $total ) ); ?></p>
			<ul class="<?php echo $total > 12 ? 'mega-lista mega-3col' : 'mega-lista'; ?>">
				<?php foreach ( array_slice( $cursos, 0, $limite ) as $c ) : ?>
					<li><a href="<?php echo esc_url( $c[1] ); ?>"><?php echo florence2026_icone_area( $c[2] ); // phpcs:ignore ?><span><?php echo esc_html( $c[0] ); ?></span></a></li>
				<?php endforeach; ?>
			</ul>
			<a class="mega-todos" href="<?php echo esc_url( $url ); ?>">Ver todos os cursos de <?php echo esc_html( strtolower( $titulo ) ); ?> <span aria-hidden="true">&rarr;</span></a>
		</div>
		<div class="mega-lado">
			<?php foreach ( $atalhos as $a ) : ?>
				<a class="mega-atalho" href="<?php echo esc_url( $a[2] ); ?>"><b><?php echo esc_html( $a[0] ); ?></b><span><?php echo esc_html( $a[1] ); ?></span></a>
			<?php endforeach; ?>
		</div>
	</div>
	<?php
	return ob_get_clean();
}

/** Escolhe o painel pelo endereco do item do menu. */
function florence2026_mega_painel( $url ) {
	$path = trim( (string) wp_parse_url( $url, PHP_URL_PATH ), '/' );
	$quiz = array( 'Qual curso combina comigo?', 'Teste rápido de 6 perguntas.', home_url( '/qual-curso-combina-comigo/' ) );
	$comp = array( 'Comparar cursos', 'Até 3 cursos lado a lado.', home_url( '/comparar-cursos/' ) );
	$ingr = array( 'Como entrar', 'Seis formas de ingresso, sem taxa.', home_url( '/como-entrar/' ) );
	$bols = array( 'Bolsas e financiamento', 'FIES, ProUni e bolsas de até 77%.', home_url( '/bolsas-e-financiamento/' ) );

	if ( 'graduacao' === $path ) return florence2026_mega_cursos( 'graduacao', 'Graduação', 20, array( $quiz, $comp, $ingr, $bols ) );
	if ( 'tecnico' === $path )   return florence2026_mega_cursos( 'tecnico', 'Técnico', 18, array( $comp, $ingr, $bols ) );
	if ( 'pos-graduacao' === $path ) return florence2026_mega_cursos( 'pos', 'Pós-graduação', 15, array( $comp, $bols ) );

	if ( 'nossa-historia' === $path ) {
		$itens = array();
		$locs  = get_nav_menu_locations();
		if ( ! empty( $locs['rodape_inst'] ) ) {
			foreach ( (array) wp_get_nav_menu_items( $locs['rodape_inst'] ) as $i ) {
				if ( ! $i->menu_item_parent ) $itens[] = array( $i->title, $i->url );
			}
		}
		ob_start();
		?>
		<div class="mega-grid">
			<div>
				<p class="mega-titulo">A Florence</p>
				<ul class="mega-lista mega-links"><?php foreach ( $itens as $i ) : ?><li><a href="<?php echo esc_url( $i[1] ); ?>"><span><?php echo esc_html( $i[0] ); ?></span></a></li><?php endforeach; ?></ul>
			</div>
			<div class="mega-lado">
				<a class="mega-destaque" href="<?php echo esc_url( home_url( '/transparencia-mec/' ) ); ?>"><b class="mega-nota">5</b><span><strong>Nota máxima do MEC</strong>no recredenciamento institucional. Veja a situação de cada curso.</span></a>
				<a class="mega-atalho" href="<?php echo esc_url( home_url( '/clinica-escola/' ) ); ?>"><b>Clínica-Escola</b><span>Atendimento à comunidade de São Luís.</span></a>
			</div>
		</div>
		<?php
		return ob_get_clean();
	}

	if ( 'como-entrar' === $path ) {
		ob_start();
		?>
		<div class="mega-grid">
			<div>
				<p class="mega-titulo">Formas de ingresso</p>
				<ul class="mega-lista mega-vias">
					<?php foreach ( florence2026_formas_ingresso() as $n => $v ) : ?>
						<li><a href="<?php echo esc_url( $v['url'] ); ?>" target="_blank" rel="noopener"><i><?php echo esc_html( sprintf( '%02d', $n + 1 ) ); ?></i><span><b><?php echo esc_html( $v['rotulo'] ); ?></b><?php echo esc_html( $v['descricao'] ); ?></span></a></li>
					<?php endforeach; ?>
				</ul>
				<a class="mega-todos" href="<?php echo esc_url( home_url( '/como-entrar/' ) ); ?>">Ver o passo a passo completo <span aria-hidden="true">&rarr;</span></a>
			</div>
			<div class="mega-lado"><?php foreach ( array( $bols, $quiz ) as $a ) : ?><a class="mega-atalho" href="<?php echo esc_url( $a[2] ); ?>"><b><?php echo esc_html( $a[0] ); ?></b><span><?php echo esc_html( $a[1] ); ?></span></a><?php endforeach; ?></div>
		</div>
		<?php
		return ob_get_clean();
	}
	return '';
}

/** Menu principal do desktop com os paineis. Sem menu no painel, nao imprime nada. */
function florence2026_mega_menu() {
	$locs = get_nav_menu_locations();
	if ( empty( $locs['principal'] ) ) return false;
	$itens = wp_get_nav_menu_items( $locs['principal'] );
	if ( ! $itens ) return false;
	$atual = trailingslashit( home_url( add_query_arg( array() ) ) );
	echo '<ul class="mega-menu">';
	foreach ( $itens as $i ) {
		if ( $i->menu_item_parent ) continue;
		$painel = florence2026_mega_painel( $i->url );
		$classe = $painel ? 'mega-item tem-painel' : 'mega-item';
		if ( untrailingslashit( $i->url ) && 0 === strpos( $atual, trailingslashit( $i->url ) ) && trailingslashit( $i->url ) !== trailingslashit( home_url( '/' ) ) ) $classe .= ' is-atual';
		printf( '<li class="%s"><a href="%s">%s</a>', esc_attr( $classe ), esc_url( $i->url ), esc_html( $i->title ) );
		if ( $painel ) {
			printf( '<button type="button" class="mega-abre" aria-expanded="false" aria-label="%s"><svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="m2 3.5 3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button>', esc_attr( 'Abrir ' . $i->title ) );
			echo '<div class="mega"><div class="shell">' . $painel . '</div></div>'; // phpcs:ignore
		}
		echo '</li>';
	}
	echo '</ul>';
	return true;
}
