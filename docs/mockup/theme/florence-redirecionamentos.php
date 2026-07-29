<?php
/**
 * Plugin Name: Florence — Redirecionamentos da migração
 * Description: 301 das URLs antigas de curso para o modelo novo. Etapa 4.
 * Version: 0.2.0
 *
 * Preserva SEO: cada curso legado aponta para o seu equivalente migrado,
 * usando origem_cpt/origem_id. Arquivos antigos vao para a listagem filtrada.
 */
if ( ! defined( 'ABSPATH' ) ) exit;

/** Liga/desliga sem editar codigo: define FLORENCE_REDIRECT_OFF para pausar. */
function florence_redirecionar_ativo() {
	return ! defined( 'FLORENCE_REDIRECT_OFF' ) || ! FLORENCE_REDIRECT_OFF;
}

/** CPT legado => nivel do modelo novo, para o redirect de arquivo. */
function florence_mapa_arquivo() {
	return array(
		'graduacao'           => 'graduacao',
		'graduacao-ead'       => 'graduacao',
		'tecnico'             => 'tecnico',
		'pos-graduacao'       => 'pos',
		'pos-graduacao-ead'   => 'pos',
		'minicurso'           => 'minicurso',
		'qualificacao'        => 'qualificacao',
		'capacitacao'         => 'capacitacao',
		'curso-livre-20-hora' => 'livre',
		'curso-livre-30-hora' => 'livre',
		'curso-livre-40-hora' => 'livre',
	);
}

/** Acha o curso novo a partir do post legado. */
function florence_curso_equivalente( $cpt, $id ) {
	$cache = wp_cache_get( "florence_eq_{$cpt}_{$id}" );
	if ( false !== $cache ) { return $cache; }

	$r = get_posts( array(
		'post_type'   => 'curso',
		'post_status' => 'publish',
		'numberposts' => 1,
		'fields'      => 'ids',
		'meta_query'  => array(
			'relation' => 'AND',
			array( 'key' => 'origem_cpt', 'value' => $cpt ),
			array( 'key' => 'origem_id',  'value' => $id ),
		),
	) );
	$novo = $r ? (int) $r[0] : 0;
	wp_cache_set( "florence_eq_{$cpt}_{$id}", $novo, '', 3600 );
	return $novo;
}

add_action( 'template_redirect', 'florence_301_migracao' );
function florence_301_migracao() {
	if ( is_admin() || ! florence_redirecionar_ativo() ) { return; }

	$mapa = florence_mapa_arquivo();

	// 1) Curso individual antigo -> curso novo
	if ( is_singular( array_keys( $mapa ) ) ) {
		$id  = get_queried_object_id();
		$cpt = get_post_type( $id );
		$novo = florence_curso_equivalente( $cpt, $id );
		if ( $novo ) {
			wp_safe_redirect( get_permalink( $novo ), 301 );
			exit;
		}
		return; // sem equivalente: deixa a pagina antiga responder, nao quebra
	}

	// 2) Arquivo antigo -> listagem nova filtrada por nivel
	if ( is_post_type_archive( array_keys( $mapa ) ) ) {
		$cpt   = get_query_var( 'post_type' );
		$cpt   = is_array( $cpt ) ? reset( $cpt ) : $cpt;
		$nivel = isset( $mapa[ $cpt ] ) ? $mapa[ $cpt ] : '';
		$destino = get_post_type_archive_link( 'curso' );
		if ( $destino ) {
			if ( $nivel ) { $destino = add_query_arg( 'nivel', $nivel, $destino ); }
			wp_safe_redirect( $destino, 301 );
			exit;
		}
	}
}

/**
 * Mantem os antigos fora do indice enquanto existirem, evitando
 * conteudo duplicado aos olhos do buscador.
 */
add_action( 'wp_head', function () {
	if ( is_singular( array_keys( florence_mapa_arquivo() ) ) ) {
		echo '<meta name="robots" content="noindex,follow">' . "\n";
	}
}, 1 );

/**
 * Rede de seguranca: depois que o Toolset for desativado, os CPTs legados
 * deixam de existir e o WordPress devolve 404 sem passar pelos redirects
 * acima. Aqui interceptamos o 404 e resolvemos pelo slug da URL.
 */
add_action( 'template_redirect', 'florence_301_por_slug', 5 );
function florence_301_por_slug() {
	if ( is_admin() || ! is_404() || ! florence_redirecionar_ativo() ) { return; }

	$caminho = wp_parse_url( isset( $_SERVER['REQUEST_URI'] ) ? esc_url_raw( wp_unslash( $_SERVER['REQUEST_URI'] ) ) : '', PHP_URL_PATH );
	$partes  = array_values( array_filter( explode( '/', (string) $caminho ) ) );
	if ( count( $partes ) < 1 ) { return; }

	$mapa  = florence_mapa_arquivo();
	$base  = $partes[0];
	if ( ! isset( $mapa[ $base ] ) ) { return; }

	// /{cpt-antigo}/  -> listagem filtrada
	if ( 1 === count( $partes ) ) {
		$destino = add_query_arg( 'nivel', $mapa[ $base ], get_post_type_archive_link( 'curso' ) );
		wp_safe_redirect( $destino, 301 );
		exit;
	}

	$slug = sanitize_title( $partes[1] );

	/*
	 * Caminho preferido: acha o post legado pelo slug (ele continua no banco
	 * mesmo com o Toolset desativado, so nao esta registrado) e usa o rastro
	 * origem_cpt/origem_id para chegar no curso novo. E exato e nao quebra
	 * quando o slug do curso novo muda.
	 */
	global $wpdb;
	$legado = (int) $wpdb->get_var( $wpdb->prepare(
		"SELECT ID FROM {$wpdb->posts} WHERE post_name = %s AND post_type = %s LIMIT 1",
		$slug,
		$base
	) );
	if ( $legado ) {
		$novo = florence_curso_equivalente( $base, $legado );
		if ( $novo ) {
			wp_safe_redirect( get_permalink( $novo ), 301 );
			exit;
		}
	}

	// Rede secundaria: curso novo de mesmo slug e mesmo nivel.
	$iguais = get_posts( array(
		'post_type'   => 'curso',
		'post_status' => 'publish',
		'numberposts' => 1,
		'fields'      => 'ids',
		'name'        => $slug,
		'meta_query'  => array( array( 'key' => 'nivel', 'value' => $mapa[ $base ] ) ),
	) );
	if ( $iguais ) {
		wp_safe_redirect( get_permalink( $iguais[0] ), 301 );
		exit;
	}

	// Ultima tentativa: qualquer curso com aquele slug.
	$curso = get_page_by_path( $slug, OBJECT, 'curso' );
	if ( $curso ) {
		wp_safe_redirect( get_permalink( $curso->ID ), 301 );
		exit;
	}

	// sem equivalente: manda para a listagem do nivel, melhor que 404
	wp_safe_redirect( add_query_arg( 'nivel', $mapa[ $base ], get_post_type_archive_link( 'curso' ) ), 301 );
	exit;
}

/**
 * Colisao de slug: categorias de noticia usam os mesmos slugs dos CPTs antigos
 * (/graduacao/, /tecnico/...). Com o Toolset desativado a categoria assume a URL,
 * mas o significado canonico daquele endereco sempre foi "lista de cursos".
 * Roda cedo e decide pelo caminho da URL, nao pelo que o WP resolveu.
 */
add_action( 'template_redirect', 'florence_301_colisao_slug', 1 );
function florence_301_colisao_slug() {
	if ( is_admin() || ! florence_redirecionar_ativo() ) { return; }
	if ( is_singular() || is_feed() ) { return; }

	$caminho = wp_parse_url( isset( $_SERVER['REQUEST_URI'] ) ? esc_url_raw( wp_unslash( $_SERVER['REQUEST_URI'] ) ) : '', PHP_URL_PATH );
	$partes  = array_values( array_filter( explode( '/', (string) $caminho ) ) );
	if ( 1 !== count( $partes ) ) { return; }

	$mapa = florence_mapa_arquivo();
	if ( ! isset( $mapa[ $partes[0] ] ) ) { return; }

	$destino = get_post_type_archive_link( 'curso' );
	if ( ! $destino ) { return; }
	wp_safe_redirect( add_query_arg( 'nivel', $mapa[ $partes[0] ], $destino ), 301 );
	exit;
}
