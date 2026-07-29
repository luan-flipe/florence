<?php
/**
 * Migracao Toolset -> ACF. Etapa 2.
 * Uso (no servidor, dentro do WP):
 *   wp eval-file migrar-cursos.php            # dry-run, so relatorio
 *   wp eval-file migrar-cursos.php gravar     # grava de verdade
 *
 * Nao apaga nem altera nada no Toolset. Cria posts novos no CPT "curso"
 * e registra origem_cpt/origem_id para auditoria e reversao.
 */
if ( ! defined( 'ABSPATH' ) ) exit;

$gravar = in_array( 'gravar', (array) $args, true );

/** CPT legado => nivel do modelo novo. */
$mapa_nivel = array(
	'graduacao'           => array( 'nivel' => 'graduacao',    'marca' => 'centro-universitario', 'modalidade' => 'presencial' ),
	'graduacao-ead'       => array( 'nivel' => 'graduacao',    'marca' => 'centro-universitario', 'modalidade' => 'ead' ),
	'tecnico'             => array( 'nivel' => 'tecnico',      'marca' => 'instituto',            'modalidade' => 'presencial' ),
	'pos-graduacao'       => array( 'nivel' => 'pos',          'marca' => 'centro-universitario', 'modalidade' => 'presencial' ),
	'pos-graduacao-ead'   => array( 'nivel' => 'pos',          'marca' => 'centro-universitario', 'modalidade' => 'ead' ),
	'minicurso'           => array( 'nivel' => 'minicurso',    'marca' => 'centro-universitario', 'modalidade' => 'presencial' ),
	'qualificacao'        => array( 'nivel' => 'qualificacao', 'marca' => 'centro-universitario', 'modalidade' => 'presencial' ),
	'capacitacao'         => array( 'nivel' => 'capacitacao',  'marca' => 'centro-universitario', 'modalidade' => 'presencial' ),
	'curso-livre-20-hora' => array( 'nivel' => 'livre', 'marca' => 'centro-universitario', 'modalidade' => 'presencial', 'carga' => '20 horas' ),
	'curso-livre-30-hora' => array( 'nivel' => 'livre', 'marca' => 'centro-universitario', 'modalidade' => 'presencial', 'carga' => '30 horas' ),
	'curso-livre-40-hora' => array( 'nivel' => 'livre', 'marca' => 'centro-universitario', 'modalidade' => 'presencial', 'carga' => '40 horas' ),
);

/** campo ACF => campo Toolset (wpcf-). */
$mapa_campo = array(
	'resumo'                 => 'breve-descricao',
	'sobre'                  => 'sobre-o-curso',
	'estrutura'              => 'estrutura-do-curso',
	'informacoes_adicionais' => 'informacoes-adicionais',
	'duracao'                => 'duracao',
	'titulacao'              => 'titulacao',
	'investimento'           => 'investimento',
	'matriz_curricular'      => 'matriz-curricular',
	'link_inscricao'         => 'link-de-inscricao',
	'coordenador'            => 'coordenador',
	'lattes'                 => 'curriculo-lattes',
	'reconhecimento_mec'     => 'conceito-mec',
);

$total = 0; $criados = 0; $pulados = 0; $divergencias = array(); $por_tipo = array();

foreach ( $mapa_nivel as $cpt => $defs ) {
	$posts = get_posts( array(
		'post_type'   => $cpt,
		'post_status' => array( 'publish', 'draft', 'pending' ),
		'numberposts' => -1,
	) );
	$por_tipo[ $cpt ] = array( 'origem' => count( $posts ), 'migrados' => 0 );

	foreach ( $posts as $p ) {
		$total++;

		// Ja migrado? (idempotente: rodar duas vezes nao duplica)
		$existe = get_posts( array(
			'post_type'   => 'curso',
			'post_status' => 'any',
			'numberposts' => 1,
			'fields'      => 'ids',
			'meta_query'  => array(
				'relation' => 'AND',
				array( 'key' => 'origem_cpt', 'value' => $cpt ),
				array( 'key' => 'origem_id',  'value' => $p->ID ),
			),
		) );
		if ( $existe ) { $pulados++; continue; }

		$valores = array();
		foreach ( $mapa_campo as $acf => $wpcf ) {
			$v = get_post_meta( $p->ID, 'wpcf-' . $wpcf, true );
			$valores[ $acf ] = is_string( $v ) ? trim( $v ) : '';
		}

		// imagem: tenta as tres variantes do legado
		$img = '';
		foreach ( array( 'imagem-principal', 'imagem-ilustracao', 'imagem' ) as $k ) {
			$c = get_post_meta( $p->ID, 'wpcf-' . $k, true );
			if ( is_string( $c ) && trim( $c ) ) { $img = trim( $c ); break; }
		}

		// divergencias: campos-chave vazios na origem
		$faltando = array();
		foreach ( array( 'resumo', 'sobre', 'duracao' ) as $chave ) {
			if ( '' === $valores[ $chave ] ) { $faltando[] = $chave; }
		}
		if ( ! $img ) { $faltando[] = 'imagem'; }
		if ( $faltando ) {
			$divergencias[] = sprintf( '%s #%d "%s" sem: %s', $cpt, $p->ID, $p->post_title, implode( ', ', $faltando ) );
		}

		if ( ! $gravar ) { $criados++; $por_tipo[ $cpt ]['migrados']++; continue; }

		$novo = wp_insert_post( array(
			'post_type'    => 'curso',
			'post_status'  => $p->post_status,
			'post_title'   => $p->post_title,
			'post_name'    => $p->post_name,
			'post_content' => $p->post_content,
			'post_excerpt' => $p->post_excerpt,
			'post_date'    => $p->post_date,
		), true );

		if ( is_wp_error( $novo ) ) {
			$divergencias[] = sprintf( 'ERRO ao criar %s #%d: %s', $cpt, $p->ID, $novo->get_error_message() );
			continue;
		}

		foreach ( $valores as $k => $v ) { update_post_meta( $novo, $k, $v ); }
		update_post_meta( $novo, 'nivel', $defs['nivel'] );
		update_post_meta( $novo, 'marca', $defs['marca'] );
		update_post_meta( $novo, 'modalidade', $defs['modalidade'] );
		if ( isset( $defs['carga'] ) ) { update_post_meta( $novo, 'carga_horaria', $defs['carga'] ); }
		if ( $img ) { update_post_meta( $novo, 'imagem_destaque', $img ); }
		update_post_meta( $novo, 'origem_cpt', $cpt );
		update_post_meta( $novo, 'origem_id', $p->ID );

		// imagem destacada, se a origem tiver
		$thumb = get_post_thumbnail_id( $p->ID );
		if ( $thumb ) { set_post_thumbnail( $novo, $thumb ); }

		$criados++;
		$por_tipo[ $cpt ]['migrados']++;
	}
}

echo "\n=== MIGRACAO " . ( $gravar ? 'EXECUTADA' : 'SIMULADA (dry-run)' ) . " ===\n";
printf( "origem: %d | %s: %d | ja existiam: %d\n\n", $total, $gravar ? 'criados' : 'seriam criados', $criados, $pulados );
echo "por tipo de origem:\n";
foreach ( $por_tipo as $cpt => $n ) {
	printf( "  %-22s %3d na origem -> %3d\n", $cpt, $n['origem'], $n['migrados'] );
}
echo "\ndivergencias (campos vazios na origem): " . count( $divergencias ) . "\n";
foreach ( array_slice( $divergencias, 0, 25 ) as $d ) { echo "  - $d\n"; }
if ( count( $divergencias ) > 25 ) { echo '  ... e mais ' . ( count( $divergencias ) - 25 ) . "\n"; }
