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

<div class="util">
	<div class="shell">
		<div class="links">
			<?php if ( has_nav_menu( 'utilitario' ) ) { florence2026_menu( 'utilitario' ); } else { ?>
				<a href="#">AVA e.Florence</a><a href="#">Portal do Aluno</a><a href="#">Canal do Professor</a><a href="#">Biblioteca</a>
			<?php } ?>
		</div>
		<div class="links"><a href="#">Ouvidoria</a><a href="tel:+559838782120">(98) 3878-2120</a></div>
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
		<a href="#inscricao" class="btn btn-gold">Quero minha vaga</a>
	</div>
</header>
