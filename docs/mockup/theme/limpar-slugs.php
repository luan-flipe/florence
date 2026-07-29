<?php
/**
 * Etapa 5 (QA): limpa os slugs sujos herdados da migracao.
 *
 * Ao juntar 11 tipos de conteudo em um so, cursos de mesmo nome passaram a
 * disputar o mesmo endereco e o WordPress resolveu com sufixo numerico
 * ("enfermagem-2"). Isso deixou a graduacao, que e o produto principal,
 * com URL de rascunho.
 *
 * Uso:
 *   wp eval-file limpar-slugs.php           # so mostra o plano
 *   wp eval-file limpar-slugs.php gravar    # aplica
 *
 * O WordPress cria sozinho o redirecionamento do slug antigo (_wp_old_slug),
 * entao nenhum endereco ja divulgado quebra.
 */
if ( ! defined( 'ABSPATH' ) ) exit;

$gravar = in_array( 'gravar', (array) $args, true );

/**
 * Renomeacoes explicitas para os casos de conflito real, onde dois cursos
 * disputam o mesmo nome. Quem cede e quem tem o nivel no proprio titulo.
 */
$explicitos = array(
	// id do curso => slug desejado
	52500 => 'tecnico-em-enfermagem', // titulo: "Tecnico em Enfermagem"
);

/** Um slug so pode ser tomado se nenhum outro curso ja o estiver usando. */
function florence_slug_livre( $slug, $exceto_id ) {
	global $wpdb;
	$dono = (int) $wpdb->get_var( $wpdb->prepare(
		"SELECT ID FROM {$wpdb->posts} WHERE post_name = %s AND post_type = 'curso' AND ID != %d AND post_status != 'trash' LIMIT 1",
		$slug,
		$exceto_id
	) );
	return 0 === $dono;
}

$plano = array();

// 1) Conflitos resolvidos a mao primeiro, para liberar o slug limpo.
foreach ( $explicitos as $id => $novo ) {
	$p = get_post( $id );
	if ( ! $p || 'curso' !== $p->post_type ) { continue; }
	if ( $p->post_name === $novo ) { continue; }
	if ( ! florence_slug_livre( $novo, $id ) ) {
		echo "AVISO: #{$id} nao pode virar '{$novo}', slug ja ocupado\n";
		continue;
	}
	$plano[] = array( $id, $p->post_title, $p->post_name, $novo, 'conflito resolvido' );
	if ( $gravar ) {
		wp_update_post( array( 'ID' => $id, 'post_name' => $novo ) );
	}
}

// 2) Todo curso com sufixo numerico que possa voltar ao nome limpo.
$cursos = get_posts( array( 'post_type' => 'curso', 'post_status' => 'any', 'numberposts' => -1 ) );
foreach ( $cursos as $p ) {
	if ( isset( $explicitos[ $p->ID ] ) ) { continue; }
	if ( ! preg_match( '/^(.+)-\d+$/', $p->post_name, $m ) ) { continue; }

	$limpo = $m[1];

	// Se o titulo em si termina em numero, o sufixo e legitimo. Nao mexer.
	if ( preg_match( '/\d\s*$/', trim( $p->post_title ) ) ) { continue; }

	if ( ! florence_slug_livre( $limpo, $p->ID ) ) { continue; }

	$nivel   = get_post_meta( $p->ID, 'nivel', true );
	$plano[] = array( $p->ID, $p->post_title, $p->post_name, $limpo, $nivel );
	if ( $gravar ) {
		wp_update_post( array( 'ID' => $p->ID, 'post_name' => $limpo ) );
	}
}

echo "\n=== LIMPEZA DE SLUGS " . ( $gravar ? 'APLICADA' : 'SIMULADA' ) . " ===\n";
printf( "%-7s %-34s %-32s -> %-28s %s\n", 'ID', 'TITULO', 'ANTES', 'DEPOIS', 'NIVEL' );
foreach ( $plano as $l ) {
	printf( "%-7d %-34s %-32s -> %-28s %s\n", $l[0], mb_substr( $l[1], 0, 32 ), mb_substr( $l[2], 0, 30 ), mb_substr( $l[3], 0, 26 ), $l[4] );
}
printf( "\ntotal: %d\n", count( $plano ) );

if ( $gravar ) {
	echo "\nslugs antigos continuam redirecionando sozinhos (_wp_old_slug).\n";
}
