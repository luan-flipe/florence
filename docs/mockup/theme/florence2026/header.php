<?php if ( ! defined( 'ABSPATH' ) ) exit; ?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<?php $florence_uteis = florence2026_links_uteis(); ?>
<div class="util">
	<div class="shell">
		<div class="links">
			<?php if ( has_nav_menu( 'utilitario' ) ) {
				florence2026_menu( 'utilitario' );
			} else {
				foreach ( $florence_uteis['acesso'] as $item ) {
					printf(
						'<a href="%s" target="_blank" rel="noopener">%s</a>',
						esc_url( $item[1] ),
						esc_html( $item[0] )
					);
				}
			} ?>
		</div>
		<div class="links">
			<a href="<?php echo esc_url( $florence_uteis['ouvidoria'] ); ?>">Ouvidoria</a>
			<a href="<?php echo esc_url( $florence_uteis['whatsapp'] ); ?>" target="_blank" rel="noopener">WhatsApp</a>
			<a href="<?php echo esc_url( $florence_uteis['telefone'][1] ); ?>"><?php echo esc_html( $florence_uteis['telefone'][0] ); ?></a>
		</div>
	</div>
</div>

<header class="site">
	<div class="shell">
		<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="brand">
			<?php if ( has_custom_logo() ) { the_custom_logo(); } else { ?>
				<img src="<?php echo esc_url( get_template_directory_uri() . '/img/logo.svg' ); ?>" alt="<?php bloginfo( 'name' ); ?>">
			<?php } ?>
		</a>
		<nav class="main">
			<?php if ( has_nav_menu( 'principal' ) ) { florence2026_menu( 'principal' ); } else { ?>
				<a href="#">Institucional</a><a href="#">Cursos</a><a href="#">Como entrar</a><a href="#">Bolsas</a><a href="#">Notícias</a><a href="#">Contato</a>
			<?php } ?>
		</nav>
		<a href="<?php echo esc_url( florence2026_url_inscricao() ); ?>" class="btn btn-gold" target="_blank" rel="noopener">Quero minha vaga</a>
	</div>
</header>
