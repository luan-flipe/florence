<?php if ( ! defined( 'ABSPATH' ) ) exit; ?>
<footer class="site">
	<div class="shell">
		<div class="foot-grid">
			<div>
				<div class="brand on-dark" style="margin-bottom:1.4rem">
					<img src="<?php echo esc_url( get_template_directory_uri() . '/img/logo.svg' ); ?>" alt="<?php bloginfo( 'name' ); ?>">
				</div>
				<p style="color:#9fc0d4;font-size:.9rem;max-width:34ch">Instituição reconhecida com nota máxima no recredenciamento do MEC.</p>
				<?php $contato = florence2026_links_uteis(); ?>
				<address class="foot-contato">
					<span><?php echo esc_html( $contato['endereco'] ); ?></span>
					<a href="<?php echo esc_url( $contato['whatsapp'] ); ?>" target="_blank" rel="noopener"><?php echo esc_html( $contato['telefone'][0] ); ?> (WhatsApp)</a>
					<span><?php echo esc_html( $contato['horario'] ); ?></span>
				</address>
			</div>
			<div class="foot-col"><h4>Cursos</h4><?php
				$base_cursos = get_post_type_archive_link( 'curso' );
				$niveis_rodape = array(
					'graduacao' => 'Graduação',
					'tecnico'   => 'Técnico',
					'pos'       => 'Pós-graduação',
					'livre'     => 'Cursos livres',
				);
				foreach ( $niveis_rodape as $chave => $rotulo ) {
					printf( '<a href="%s">%s</a>',
						esc_url( add_query_arg( 'nivel', $chave, $base_cursos ) ),
						esc_html( $rotulo ) );
				}
				?></div>
			<div class="foot-col"><h4>Institucional</h4><?php if ( has_nav_menu( 'rodape_inst' ) ) { florence2026_menu( 'rodape_inst' ); } else { ?><a href="#">Nossa história</a><a href="#">Estrutura</a><a href="#">CPA</a><a href="#">Trabalhe conosco</a><?php } ?></div>
			<div class="foot-col"><h4>Serviços</h4><?php if ( has_nav_menu( 'rodape_serv' ) ) { florence2026_menu( 'rodape_serv' ); } else { ?><a href="#">Portal do aluno</a><a href="#">AVA e.Florence</a><a href="#">Biblioteca</a><a href="#">Ouvidoria</a><?php } ?></div>
		</div>
		<div class="foot-bot">
			<span>&copy; <?php echo esc_html( date_i18n( 'Y' ) ); ?> <?php bloginfo( 'name' ); ?></span>
			<span>Ambiente de testes do novo layout</span>
		</div>
	</div>
</footer>
<?php
// Atalhos de conversao: barra fixa no celular e WhatsApp flutuante no desktop.
// Na pagina de curso, o link de inscricao e a mensagem do WhatsApp citam o curso.
$e_pagina_curso = is_singular() && florence2026_e_curso( get_post_type() );
$curso_nome     = $e_pagina_curso ? get_the_title() : '';
$url_vaga       = florence2026_url_inscricao();
if ( $e_pagina_curso ) {
	$campos_rodape = florence2026_campos_curso( get_queried_object_id() );
	if ( $campos_rodape['inscricao'] ) $url_vaga = $campos_rodape['inscricao'];
}
$zap_icone = '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7a2.8 2.8 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3Z"/></svg>';
?>
<div class="barra-vaga" aria-label="Atalhos de inscrição">
	<a class="btn btn-gold" href="<?php echo esc_url( $url_vaga ); ?>" target="_blank" rel="noopener">Quero minha vaga</a>
	<a class="barra-zap" href="<?php echo esc_url( florence2026_whatsapp( $curso_nome ) ); ?>" target="_blank" rel="noopener" aria-label="Falar no WhatsApp"><?php echo $zap_icone; // phpcs:ignore ?></a>
</div>
<a class="zap-flutuante" href="<?php echo esc_url( florence2026_whatsapp( $curso_nome ) ); ?>" target="_blank" rel="noopener" aria-label="Falar no WhatsApp"><?php echo $zap_icone; // phpcs:ignore ?><span>Fale com a gente</span></a>
<?php wp_footer(); ?>
</body>
</html>
