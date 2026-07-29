<?php
/**
 * Plugin Name: Florence — Modelo de Dados
 * Description: CPT unificado "Curso" + taxonomias + campos ACF. Substitui os 11 CPTs do Toolset.
 * Version: 0.1.0
 *
 * Fica em mu-plugins de proposito: o modelo de dados nao pode depender de tema ativo.
 * Etapa 1 da migracao: criado EM PARALELO ao Toolset, sem tocar nele.
 */
if ( ! defined( 'ABSPATH' ) ) exit;

/** Niveis: substituem os 11 CPTs separados por um campo. */
function florence_niveis() {
	return array(
		'graduacao'    => 'Graduação',
		'tecnico'      => 'Técnico',
		'pos'          => 'Pós-graduação',
		'minicurso'    => 'Minicurso',
		'livre'        => 'Curso livre',
		'qualificacao' => 'Qualificação',
		'capacitacao'  => 'Capacitação',
	);
}

function florence_marcas() {
	return array(
		'centro-universitario' => 'Centro Universitário Florence',
		'instituto'            => 'Instituto Florence (Técnico)',
	);
}

function florence_modalidades() {
	return array(
		'presencial' => 'Presencial',
		'ead'        => 'EAD',
		'hibrido'    => 'Híbrido',
	);
}

add_action( 'init', 'florence_registrar_modelo' );
function florence_registrar_modelo() {

	register_post_type( 'curso', array(
		'labels' => array(
			'name'               => 'Cursos',
			'singular_name'      => 'Curso',
			'add_new_item'       => 'Adicionar novo curso',
			'edit_item'          => 'Editar curso',
			'search_items'       => 'Buscar cursos',
			'not_found'          => 'Nenhum curso encontrado',
			'all_items'          => 'Todos os cursos',
		),
		'public'        => true,
		'has_archive'   => 'cursos',
		'menu_icon'     => 'dashicons-welcome-learn-more',
		'menu_position' => 5,
		'supports'      => array( 'title', 'editor', 'thumbnail', 'excerpt', 'revisions', 'page-attributes' ),
		'rewrite'       => array( 'slug' => 'curso', 'with_front' => false ),
		'show_in_rest'  => true,
	) );

	register_taxonomy( 'area-curso', array( 'curso' ), array(
		'labels' => array(
			'name'          => 'Áreas',
			'singular_name' => 'Área',
			'add_new_item'  => 'Adicionar área',
		),
		'public'            => true,
		'hierarchical'      => true,
		'show_admin_column' => true,
		'rewrite'           => array( 'slug' => 'area', 'with_front' => false ),
		'show_in_rest'      => true,
	) );
}

/** Colunas uteis no admin: a equipe precisa achar o curso rapido. */
add_filter( 'manage_curso_posts_columns', function ( $cols ) {
	$novo = array();
	foreach ( $cols as $k => $v ) {
		$novo[ $k ] = $v;
		if ( 'title' === $k ) {
			$novo['nivel']      = 'Nível';
			$novo['modalidade'] = 'Modalidade';
		}
	}
	return $novo;
} );

add_action( 'manage_curso_posts_custom_column', function ( $col, $id ) {
	if ( 'nivel' === $col ) {
		$n = get_post_meta( $id, 'nivel', true );
		$l = florence_niveis();
		echo esc_html( isset( $l[ $n ] ) ? $l[ $n ] : '—' );
	}
	if ( 'modalidade' === $col ) {
		$m = get_post_meta( $id, 'modalidade', true );
		$l = florence_modalidades();
		echo esc_html( isset( $l[ $m ] ) ? $l[ $m ] : '—' );
	}
}, 10, 2 );

/** Filtro por nivel na listagem do admin. */
add_action( 'restrict_manage_posts', function () {
	global $typenow;
	if ( 'curso' !== $typenow ) return;
	$atual = isset( $_GET['filtro_nivel'] ) ? sanitize_text_field( wp_unslash( $_GET['filtro_nivel'] ) ) : '';
	echo '<select name="filtro_nivel"><option value="">Todos os níveis</option>';
	foreach ( florence_niveis() as $k => $v ) {
		printf( '<option value="%s"%s>%s</option>', esc_attr( $k ), selected( $atual, $k, false ), esc_html( $v ) );
	}
	echo '</select>';
} );

add_filter( 'parse_query', function ( $q ) {
	global $pagenow;
	if ( 'edit.php' === $pagenow && isset( $_GET['post_type'] ) && 'curso' === $_GET['post_type']
		&& ! empty( $_GET['filtro_nivel'] ) ) {
		$q->query_vars['meta_key']   = 'nivel';
		$q->query_vars['meta_value'] = sanitize_text_field( wp_unslash( $_GET['filtro_nivel'] ) );
	}
	return $q;
} );

/**
 * Campos ACF por PHP: versionavel e reproduzivel, sem depender de export do painel.
 */
add_action( 'acf/init', 'florence_campos_acf' );
function florence_campos_acf() {
	if ( ! function_exists( 'acf_add_local_field_group' ) ) return;

	$txt = function ( $nome, $rotulo, $tipo = 'text', $extra = array() ) {
		return array_merge( array(
			'key'   => 'field_curso_' . $nome,
			'name'  => $nome,
			'label' => $rotulo,
			'type'  => $tipo,
		), $extra );
	};

	acf_add_local_field_group( array(
		'key'      => 'group_curso',
		'title'    => 'Dados do curso',
		'location' => array( array( array( 'param' => 'post_type', 'operator' => '==', 'value' => 'curso' ) ) ),
		'position' => 'normal',
		'fields'   => array(
			$txt( 'nivel', 'Nível', 'select', array(
				'choices'     => florence_niveis(),
				'required'    => 1,
				'wrapper'     => array( 'width' => 34 ),
				'instructions'=> 'Define em qual listagem o curso aparece.',
			) ),
			$txt( 'marca', 'Marca', 'select', array(
				'choices' => florence_marcas(),
				'default_value' => 'centro-universitario',
				'wrapper' => array( 'width' => 33 ),
			) ),
			$txt( 'modalidade', 'Modalidade', 'select', array(
				'choices' => florence_modalidades(),
				'default_value' => 'presencial',
				'wrapper' => array( 'width' => 33 ),
			) ),
			$txt( 'titulacao', 'Titulação', 'text', array(
				'wrapper' => array( 'width' => 34 ),
				'instructions' => 'Ex.: Bacharelado, Especialização, Curso Técnico.',
			) ),
			$txt( 'duracao', 'Duração', 'text', array( 'wrapper' => array( 'width' => 33 ) ) ),
			$txt( 'carga_horaria', 'Carga horária', 'text', array(
				'wrapper' => array( 'width' => 33 ),
				'instructions' => 'Substitui os antigos tipos de 20h, 30h e 40h.',
			) ),
			$txt( 'resumo', 'Resumo curto', 'textarea', array(
				'rows' => 2,
				'instructions' => 'Uma frase. Aparece no card da listagem e no topo da página.',
			) ),
			$txt( 'sobre', 'Sobre o curso', 'wysiwyg', array( 'media_upload' => 1 ) ),
			$txt( 'estrutura', 'Como o curso funciona', 'wysiwyg', array( 'media_upload' => 0 ) ),
			$txt( 'informacoes_adicionais', 'Informações importantes', 'wysiwyg', array( 'media_upload' => 0 ) ),
			$txt( 'investimento', 'Investimento', 'text', array( 'wrapper' => array( 'width' => 50 ) ) ),
			$txt( 'link_inscricao', 'Link de inscrição', 'url', array( 'wrapper' => array( 'width' => 50 ) ) ),
			$txt( 'matriz_curricular', 'Matriz curricular (arquivo ou link)', 'url' ),
			$txt( 'coordenador', 'Coordenador', 'text', array( 'wrapper' => array( 'width' => 50 ) ) ),
			$txt( 'lattes', 'Currículo Lattes', 'url', array( 'wrapper' => array( 'width' => 50 ) ) ),
			$txt( 'reconhecimento_mec', 'Reconhecimento MEC', 'text', array(
				'instructions' => 'Só preencher com informação oficial e verificável.',
			) ),
			$txt( 'imagem_destaque', 'Imagem (URL legado)', 'url', array(
				'instructions' => 'Preenchido pela migração. Prefira a imagem destacada do WordPress.',
			) ),
			// Rastreabilidade da migracao: permite auditar e reverter.
			$txt( 'origem_cpt', 'Origem (CPT legado)', 'text', array( 'wrapper' => array( 'width' => 50 ) ) ),
			$txt( 'origem_id', 'Origem (ID legado)', 'number', array( 'wrapper' => array( 'width' => 50 ) ) ),
		),
	) );
}
