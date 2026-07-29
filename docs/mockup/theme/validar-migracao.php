<?php
/**
 * Etapa 3: valida a migracao comparando cada curso novo com sua origem,
 * campo a campo. Somente leitura.
 *   wp eval-file validar-migracao.php
 */
if ( ! defined( 'ABSPATH' ) ) exit;

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

$novos = get_posts( array( 'post_type' => 'curso', 'post_status' => 'any', 'numberposts' => -1 ) );

$ok = 0; $erros = array(); $sem_origem = 0;
$campos_divergentes = array();
$conteudo_perdido = array();

foreach ( $novos as $n ) {
	$cpt = get_post_meta( $n->ID, 'origem_cpt', true );
	$oid = (int) get_post_meta( $n->ID, 'origem_id', true );
	if ( ! $cpt || ! $oid ) { $sem_origem++; continue; }

	$o = get_post( $oid );
	if ( ! $o ) { $erros[] = "curso #{$n->ID}: origem {$cpt} #{$oid} nao existe mais"; continue; }

	$falhas = array();

	// titulo e conteudo
	if ( $n->post_title !== $o->post_title ) { $falhas[] = 'titulo'; }
	if ( strlen( $o->post_content ) > 0 && strlen( $n->post_content ) !== strlen( $o->post_content ) ) {
		$falhas[] = 'conteudo';
		$conteudo_perdido[] = "#{$n->ID} {$n->post_title}";
	}
	if ( $n->post_status !== $o->post_status ) { $falhas[] = 'status'; }

	// campos
	foreach ( $mapa_campo as $acf => $wpcf ) {
		$vn = (string) get_post_meta( $n->ID, $acf, true );
		$vo = (string) get_post_meta( $oid, 'wpcf-' . $wpcf, true );
		$vo = trim( $vo );
		if ( $vn !== $vo ) {
			$falhas[] = $acf;
			$campos_divergentes[ $acf ] = ( isset( $campos_divergentes[ $acf ] ) ? $campos_divergentes[ $acf ] : 0 ) + 1;
		}
	}

	// nivel obrigatorio
	if ( ! get_post_meta( $n->ID, 'nivel', true ) ) { $falhas[] = 'nivel(vazio)'; }

	if ( $falhas ) {
		$erros[] = sprintf( '#%d "%s" (%s) -> %s', $n->ID, mb_substr( $n->post_title, 0, 40 ), $cpt, implode( ', ', $falhas ) );
	} else {
		$ok++;
	}
}

echo "\n=== VALIDACAO DA MIGRACAO ===\n";
printf( "cursos no modelo novo: %d\n", count( $novos ) );
printf( "identicos a origem   : %d\n", $ok );
printf( "com divergencia      : %d\n", count( $erros ) );
printf( "sem rastro de origem : %d\n\n", $sem_origem );

if ( $campos_divergentes ) {
	echo "divergencias por campo:\n";
	arsort( $campos_divergentes );
	foreach ( $campos_divergentes as $c => $q ) { printf( "  %-24s %d\n", $c, $q ); }
	echo "\n";
}
if ( $conteudo_perdido ) {
	echo 'conteudo do editor com tamanho diferente: ' . count( $conteudo_perdido ) . "\n";
	foreach ( array_slice( $conteudo_perdido, 0, 5 ) as $c ) { echo "  - $c\n"; }
	echo "\n";
}
echo 'primeiras divergencias:' . "\n";
foreach ( array_slice( $erros, 0, 12 ) as $e ) { echo "  - $e\n"; }
if ( count( $erros ) > 12 ) { echo '  ... e mais ' . ( count( $erros ) - 12 ) . "\n"; }

// amostra detalhada: 3 cursos de niveis diferentes
echo "\n=== AMOSTRA DETALHADA ===\n";
$amostra = array();
foreach ( array( 'graduacao', 'pos', 'tecnico' ) as $niv ) {
	$a = get_posts( array(
		'post_type' => 'curso', 'numberposts' => 1, 'post_status' => 'publish',
		'meta_query' => array( array( 'key' => 'nivel', 'value' => $niv ) ),
	) );
	if ( $a ) { $amostra[] = $a[0]; }
}
foreach ( $amostra as $a ) {
	$oid = (int) get_post_meta( $a->ID, 'origem_id', true );
	printf( "\n%s (nivel=%s, origem #%d)\n", $a->post_title, get_post_meta( $a->ID, 'nivel', true ), $oid );
	foreach ( array( 'duracao', 'investimento', 'titulacao', 'link_inscricao' ) as $c ) {
		$vn = (string) get_post_meta( $a->ID, $c, true );
		$vo = (string) trim( (string) get_post_meta( $oid, 'wpcf-' . $mapa_campo[ $c ], true ) );
		printf( "  %-16s novo=%-28s origem=%-28s %s\n", $c,
			mb_substr( $vn, 0, 26 ), mb_substr( $vo, 0, 26 ), ( $vn === $vo ? 'OK' : 'DIFERE' ) );
	}
	printf( "  %-16s %d caracteres\n", 'sobre', mb_strlen( (string) get_post_meta( $a->ID, 'sobre', true ) ) );
}
