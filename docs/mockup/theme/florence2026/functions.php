<?php
/**
 * Florence 2026 — casca enxuta.
 * Toda a construcao visual de paginas fica no Elementor; este tema entrega
 * o design system (style.css), os locais de menu e o suporte ao Theme Builder.
 */
if ( ! defined( 'ABSPATH' ) ) exit;

require_once get_template_directory() . "/textos.php";

function florence2026_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption', 'style', 'script' ) );
	add_theme_support( 'custom-logo', array( 'height' => 60, 'flex-width' => true ) );
	// Menus enxutos: substituem os 29 locais do tema antigo.
	register_nav_menus( array(
		'principal'  => 'Menu principal',
		'utilitario' => 'Barra utilitaria (topo)',
		'rodape_inst'=> 'Rodape institucional',
		'rodape_serv'=> 'Rodape servicos',
	) );
}
add_action( 'after_setup_theme', 'florence2026_setup' );

function florence2026_assets() {
	wp_enqueue_style(
		'florence2026',
		get_stylesheet_uri(),
		array(),
		wp_get_theme()->get( 'Version' )
	);
	wp_enqueue_style(
		'florence2026-fonts',
		'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&display=swap',
		array(),
		null
	);
}
add_action( 'wp_enqueue_scripts', 'florence2026_assets' );

/** Permite que o Elementor Theme Builder assuma header/footer/single/archive. */
function florence2026_elementor_locations( $manager ) {
	$manager->register_all_core_location();
}
add_action( 'elementor/theme/register_locations', 'florence2026_elementor_locations' );

/** Menu simples com fallback, para o tema nao quebrar antes dos menus serem criados. */
function florence2026_menu( $location, $class = '' ) {
	if ( has_nav_menu( $location ) ) {
		wp_nav_menu( array(
			'theme_location' => $location,
			'container'      => false,
			'menu_class'     => $class,
			'depth'          => 2,
		) );
	}
}

/**
 * Formas de ingresso e seus funis reais no CRM Educacional.
 * A copia (rotulo + descricao) mora em textos.php, junto do resto do site;
 * aqui so garantimos que exista o link, com um fallback caso a copy venha
 * sem a URL. Filtravel para o dia em que a instituicao trocar de funil.
 */
function florence2026_formas_ingresso() {
	$t    = florence2026_txt();
	$vias = isset( $t['ways'] ) ? $t['ways'] : array();
	$saida = array();
	foreach ( $vias as $via ) {
		$saida[] = array(
			'rotulo'    => isset( $via[0] ) ? $via[0] : '',
			'descricao' => isset( $via[1] ) ? $via[1] : '',
			'url'       => isset( $via[2] ) ? $via[2] : florence2026_url_inscricao(),
		);
	}
	return apply_filters( 'florence2026_formas_ingresso', $saida );
}

/** Funil principal de inscricao (vestibular digital). Usado nos CTAs gerais. */
function florence2026_url_inscricao() {
	$t   = florence2026_txt();
	$url = isset( $t['ways'][0][2] ) ? $t['ways'][0][2] : 'https://florence.inscricao.crmeducacional.com/login/247';
	return apply_filters( 'florence2026_url_inscricao', $url );
}

/**
 * Links institucionais de acesso rapido (barra do topo e rodape).
 * Reune em um lugar so o que hoje esta espalhado e apontando para "#".
 */
function florence2026_links_uteis() {
	return array(
		// Sistemas externos: abrem em outra aba.
		'acesso' => array(
			array( 'AVA e.Florence',     'https://e.florence.edu.br/login/index.php',                      true ),
			array( 'Portal do Aluno',    'https://estudeflex.inforgeneses.com.br/login/instituicao/flore', true ),
			array( 'Canal do Professor', 'https://ensineflex.inforgeneses.com.br/login/instituicao/flore', true ),
			array( 'Biblioteca',         'https://biblioteca.florence.edu.br/',                            true ),
		),
		'ouvidoria' => home_url( '/ouvidoria/' ),
		'whatsapp'  => 'https://api.whatsapp.com/send?phone=5598988630502',
		'telefone'  => array( '(98) 3878-2120', 'tel:+559838782120' ),
	);
}

/** CPTs de curso do site legado (Toolset). Serao unificados na migracao ACF. */
function florence2026_cpts_curso() {
	return array(
		'curso',
		'graduacao', 'graduacao-ead', 'tecnico', 'pos-graduacao', 'pos-graduacao-ead',
		'minicurso', 'qualificacao', 'capacitacao',
		'curso-livre-20-hora', 'curso-livre-30-hora', 'curso-livre-40-hora',
	);
}

function florence2026_e_curso( $tipo ) {
	return in_array( $tipo, florence2026_cpts_curso(), true );
}

/**
 * Le os campos do curso. Hoje vem do Toolset (wpcf-*); apos a migracao
 * bastara trocar a origem aqui, sem tocar nos templates.
 */
function florence2026_campos_curso( $id ) {
	// Modelo novo (ACF) para o CPT curso; Toolset para os CPTs legados.
	if ( 'curso' === get_post_type( $id ) ) {
		return florence2026_campos_curso_acf( $id );
	}
	$g = function ( $chave ) use ( $id ) {
		$v = get_post_meta( $id, 'wpcf-' . $chave, true );
		return is_string( $v ) ? trim( $v ) : '';
	};
	$imagem = $g( 'imagem-principal' );
	if ( ! $imagem ) { $imagem = $g( 'imagem-ilustracao' ); }
	if ( ! $imagem ) { $imagem = $g( 'imagem' ); }
	if ( ! $imagem && has_post_thumbnail( $id ) ) { $imagem = get_the_post_thumbnail_url( $id, 'large' ); }

	return array(
		'resumo'       => $g( 'breve-descricao' ),
		'sobre'        => $g( 'sobre-o-curso' ),
		'estrutura'    => $g( 'estrutura-do-curso' ),
		'adicionais'   => $g( 'informacoes-adicionais' ),
		'duracao'      => $g( 'duracao' ),
		'modalidade'   => $g( 'modalidade' ),
		'titulacao'    => $g( 'titulacao' ),
		'investimento' => $g( 'investimento' ),
		'matriz'       => $g( 'matriz-curricular' ),
		'inscricao'    => $g( 'link-de-inscricao' ),
		'coordenador'  => $g( 'coordenador' ),
		'lattes'       => $g( 'curriculo-lattes' ),
		'mec'          => $g( 'conceito-mec' ),
		'autorizacao'  => $g( 'autorizacao' ),
		'imagem'       => $imagem,
	);
}

/** Leitura do modelo novo (ACF). Mesma forma de retorno da versao legada. */
function florence2026_campos_curso_acf( $id ) {
	$m = function ( $c ) use ( $id ) {
		$v = get_post_meta( $id, $c, true );
		return is_string( $v ) ? trim( $v ) : '';
	};
	$imagem = has_post_thumbnail( $id ) ? get_the_post_thumbnail_url( $id, 'large' ) : $m( 'imagem_destaque' );
	$niveis = function_exists( 'florence_niveis' ) ? florence_niveis() : array();
	$mods   = function_exists( 'florence_modalidades' ) ? florence_modalidades() : array();
	$nivel  = $m( 'nivel' );
	$mod    = $m( 'modalidade' );

	return array(
		'resumo'       => $m( 'resumo' ),
		'sobre'        => $m( 'sobre' ),
		'estrutura'    => $m( 'estrutura' ),
		'adicionais'   => $m( 'informacoes_adicionais' ),
		'duracao'      => $m( 'duracao' ) ? $m( 'duracao' ) : $m( 'carga_horaria' ),
		'modalidade'   => isset( $mods[ $mod ] ) ? $mods[ $mod ] : $mod,
		'titulacao'    => $m( 'titulacao' ) ? $m( 'titulacao' ) : ( isset( $niveis[ $nivel ] ) ? $niveis[ $nivel ] : '' ),
		'investimento' => $m( 'investimento' ),
		'matriz'       => $m( 'matriz_curricular' ),
		'inscricao'    => $m( 'link_inscricao' ),
		'coordenador'  => $m( 'coordenador' ),
		'lattes'       => $m( 'lattes' ),
		'mec'          => $m( 'reconhecimento_mec' ),
		'autorizacao'  => '',
		'imagem'       => $imagem,
	);
}

/** Arquivo /cursos/ aceita ?nivel=graduacao|tecnico|pos|... */
add_action( 'pre_get_posts', function ( $q ) {
	if ( is_admin() || ! $q->is_main_query() ) return;
	if ( $q->is_post_type_archive( 'curso' ) && ! empty( $_GET['nivel'] ) ) {
		$q->set( 'meta_key', 'nivel' );
		$q->set( 'meta_value', sanitize_text_field( wp_unslash( $_GET['nivel'] ) ) );
	}
} );
