<?php
/**
 * Recursos das ondas 1 a 3: dados estruturados, performance, acessibilidade
 * e apoio ao comparador/quiz. Separado do functions.php para ficar facil de achar.
 */
if ( ! defined( 'ABSPATH' ) ) exit;

/* ---------- Onda 1: dados estruturados (o Yoast ja entrega WebPage e Breadcrumb) ---------- */

function florence2026_schema_instituicao() {
	$c = florence2026_links_uteis();
	return array(
		'@type'     => 'CollegeOrUniversity',
		'@id'       => home_url( '/#instituicao' ),
		'name'      => 'Centro Universitário Florence',
		'url'       => home_url( '/' ),
		'logo'      => get_template_directory_uri() . '/img/logo.svg',
		'telephone' => '+55-98-98863-0502',
		'address'   => array(
			'@type'           => 'PostalAddress',
			'streetAddress'   => 'Rua Rio Branco, 216, Centro',
			'addressLocality' => 'São Luís',
			'addressRegion'   => 'MA',
			'postalCode'      => '65020-470',
			'addressCountry'  => 'BR',
		),
		'openingHoursSpecification' => array(
			array( '@type' => 'OpeningHoursSpecification', 'dayOfWeek' => array( 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday' ), 'opens' => '08:00', 'closes' => '21:00' ),
			array( '@type' => 'OpeningHoursSpecification', 'dayOfWeek' => 'Saturday', 'opens' => '08:00', 'closes' => '12:00' ),
		),
		'sameAs'    => array( 'https://www.florence.edu.br/' ),
	);
}

add_action( 'wp_head', function () {
	$dados = null;
	if ( is_front_page() ) {
		$dados = florence2026_schema_instituicao();
	} elseif ( is_singular( 'curso' ) ) {
		$id = get_queried_object_id();
		$c  = florence2026_campos_curso( $id );
		$dados = array(
			'@type'       => 'Course',
			'name'        => get_the_title( $id ),
			'url'         => get_permalink( $id ),
			'description' => $c['resumo'] ? wp_strip_all_tags( $c['resumo'] ) : wp_trim_words( wp_strip_all_tags( $c['sobre'] ), 40, '...' ),
			'provider'    => array( '@type' => 'CollegeOrUniversity', 'name' => 'Centro Universitário Florence', 'sameAs' => home_url( '/' ) ),
			'inLanguage'  => 'pt-BR',
		);
		if ( $c['titulacao'] ) $dados['educationalCredentialAwarded'] = $c['titulacao'];
		if ( $c['imagem'] ) $dados['image'] = $c['imagem'];
		$modo = strtolower( (string) $c['modalidade'] );
		$dados['hasCourseInstance'] = array( array_filter( array(
			'@type'      => 'CourseInstance',
			'courseMode' => false !== strpos( $modo, 'ead' ) ? 'online' : ( false !== strpos( $modo, 'brido' ) ? 'blended' : 'onsite' ),
			'location'   => 'São Luís, MA',
			'courseWorkload' => $c['duracao'] ? $c['duracao'] : null,
		) ) );
		$dados['offers'] = array( '@type' => 'Offer', 'category' => 'Paid', 'url' => get_permalink( $id ) . '#valores' );
	}
	if ( ! $dados ) return;
	$dados = array( '@context' => 'https://schema.org' ) + $dados;
	echo '<script type="application/ld+json">' . wp_json_encode( $dados, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) . "</script>\n";
}, 20 );

/* ---------- Onda 1: performance ---------- */

/** Tira CSS/JS que a pagina nao usa. Noticias e paginas de conteudo mantem tudo. */
add_action( 'wp_enqueue_scripts', function () {
	// Paginas com template proprio (page-*.php) nao usam blocos nem galeria.
	$conteudo_livre = is_singular( 'post' ) || ( is_page() && ! is_front_page() && 'page.php' === basename( (string) get_page_template() ) );
	if ( $conteudo_livre ) return;
	// Blocos do Gutenberg e lightbox so servem para conteudo editado no painel.
	wp_dequeue_style( 'wp-block-library' );
	wp_dequeue_style( 'global-styles' );
	foreach ( array( wp_styles(), wp_scripts() ) as $fila ) {
		foreach ( (array) $fila->queue as $h ) {
			if ( 0 === strpos( $h, 'responsive-lightbox' ) ) {
				$fila instanceof WP_Styles ? wp_dequeue_style( $h ) : wp_dequeue_script( $h );
			}
		}
	}
}, 999 );

/** Icones do Ninja Forms nao aparecem nos nossos formularios (sem datas nem estrelas). */
add_action( 'nf_display_enqueue_scripts', function () {
	wp_dequeue_style( 'nf-font-awesome' );
}, 999 );

/** Imagem do topo da home chega primeiro (maior elemento da primeira tela). */
add_action( 'wp_head', function () {
	if ( is_front_page() ) {
		printf( '<link rel="preload" as="image" href="%s" fetchpriority="high">' . "\n", esc_url( get_template_directory_uri() . '/img/hero-pratica.jpg' ) );
	}
}, 2 );

/* ---------- Onda 3: acessibilidade (VLibras, widget oficial do governo) ---------- */

add_action( 'wp_footer', function () {
	?>
<div vw class="enabled"><div vw-access-button class="active"></div><div vw-plugin-wrapper><div class="vw-plugin-top-wrapper"></div></div></div>
<script src="https://vlibras.gov.br/app/vlibras-plugin.js" defer></script>
<script>window.addEventListener('load',function(){if(window.VLibras)new window.VLibras.Widget('https://vlibras.gov.br/app');});</script>
	<?php
}, 50 );

/* ---------- Onda 3: atendimento (WhatsApp com contexto da pagina) ---------- */

/** Mensagem pronta conforme a pagina: curso, como entrar, bolsas ou a pagina atual. */
function florence2026_whatsapp_contexto() {
	if ( is_singular() && florence2026_e_curso( get_post_type() ) ) {
		return florence2026_whatsapp( get_the_title() );
	}
	$msg = 'Olá! Quero saber mais sobre os cursos da Florence.';
	if ( is_page( 'como-entrar' ) )                 $msg = 'Olá! Quero entender as formas de ingresso na Florence.';
	elseif ( is_page( 'bolsas-e-financiamento' ) )  $msg = 'Olá! Quero saber sobre bolsas e financiamento.';
	elseif ( is_page( 'clinica-escola' ) )          $msg = 'Olá! Quero agendar um atendimento na Clínica-Escola.';
	elseif ( is_page( 'comparar-cursos' ) || is_page( 'qual-curso-combina-comigo' ) ) $msg = 'Olá! Estou em dúvida entre alguns cursos e queria ajuda para escolher.';
	elseif ( is_post_type_archive( 'curso' ) )      $msg = 'Olá! Quero ajuda para escolher um curso.';
	return 'https://api.whatsapp.com/send?phone=5598988630502&text=' . rawurlencode( $msg );
}

/* ---------- Onda 2: apoio ao comparador e ao quiz ---------- */

/** Resumo de um curso para comparacao (mesmos campos do card + corpo docente). */
function florence2026_resumo_comparacao( $id ) {
	$c   = florence2026_campos_curso( $id );
	$tit = array( 'Doutor' => 0, 'Mestre' => 0 );
	foreach ( $c['docentes'] as $d ) {
		if ( isset( $tit[ $d['titulacao'] ] ) ) $tit[ $d['titulacao'] ]++;
	}
	$niveis = function_exists( 'florence_niveis' ) ? florence_niveis() : array();
	$nivel  = get_post_meta( $id, 'nivel', true );
	return array(
		'id'         => $id,
		'nome'       => get_the_title( $id ),
		'url'        => get_permalink( $id ),
		'imagem'     => has_post_thumbnail( $id ) ? get_the_post_thumbnail_url( $id, 'medium_large' ) : $c['imagem'],
		'nivel'      => isset( $niveis[ $nivel ] ) ? $niveis[ $nivel ] : '',
		'modalidade' => $c['modalidade'],
		'duracao'    => $c['duracao'],
		'titulacao'  => $c['titulacao'],
		'resumo'     => $c['resumo'],
		'docentes'   => count( $c['docentes'] ),
		'doutores'   => $tit['Doutor'],
		'mestres'    => $tit['Mestre'],
		'mec'        => $c['mec'],
		'inscricao'  => $c['inscricao'] ? $c['inscricao'] : florence2026_url_inscricao(),
	);
}

/** Cursos publicados agrupados por nivel (seletores do comparador). */
function florence2026_cursos_por_nivel() {
	$niveis = function_exists( 'florence_niveis' ) ? florence_niveis() : array();
	$grupos = array();
	$q = get_posts( array( 'post_type' => 'curso', 'post_status' => 'publish', 'numberposts' => -1, 'orderby' => 'title', 'order' => 'ASC' ) );
	foreach ( $q as $p ) {
		$n = get_post_meta( $p->ID, 'nivel', true );
		$grupos[ isset( $niveis[ $n ] ) ? $niveis[ $n ] : 'Outros' ][] = $p;
	}
	return $grupos;
}
