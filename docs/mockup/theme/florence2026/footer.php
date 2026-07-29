<?php if ( ! defined( 'ABSPATH' ) ) exit; ?>
<footer class="site">
	<div class="shell">
		<div class="foot-grid">
			<div>
				<div class="brand on-dark" style="margin-bottom:1.4rem">
					<img src="<?php echo esc_url( get_template_directory_uri() . '/img/logo.svg' ); ?>" alt="<?php bloginfo( 'name' ); ?>">
				</div>
				<p style="color:#9fc0d4;font-size:.9rem;max-width:34ch">Instituição reconhecida com nota máxima no recredenciamento do MEC.</p>
			</div>
			<div><h4>Cursos</h4><a href="#">Graduação</a><a href="#">Técnico</a><a href="#">Pós-graduação</a><a href="#">Cursos livres</a></div>
			<div><h4>Institucional</h4><?php if ( has_nav_menu( 'rodape_inst' ) ) { florence2026_menu( 'rodape_inst' ); } else { ?><a href="#">Nossa história</a><a href="#">Estrutura</a><a href="#">CPA</a><a href="#">Trabalhe conosco</a><?php } ?></div>
			<div><h4>Serviços</h4><?php if ( has_nav_menu( 'rodape_serv' ) ) { florence2026_menu( 'rodape_serv' ); } else { ?><a href="#">Portal do aluno</a><a href="#">AVA e.Florence</a><a href="#">Biblioteca</a><a href="#">Ouvidoria</a><?php } ?></div>
		</div>
		<div class="foot-bot">
			<span>&copy; <?php echo esc_html( date_i18n( 'Y' ) ); ?> <?php bloginfo( 'name' ); ?></span>
			<span>Ambiente de testes do novo layout</span>
		</div>
	</div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
