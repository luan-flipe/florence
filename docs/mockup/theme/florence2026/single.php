<?php
/**
 * Individual. Cursos usam o template de Pagina de Curso aprovado na Fase 2;
 * os demais tipos caem no layout de noticia.
 */
if ( ! defined( 'ABSPATH' ) ) exit;
get_header();

while ( have_posts() ) :
	the_post();
	$tipo = get_post_type();

	if ( florence2026_e_curso( $tipo ) ) :
		$c    = florence2026_campos_curso( get_the_ID() );
		$obj  = get_post_type_object( $tipo );
		$nome = $obj ? $obj->labels->singular_name : 'Curso';
		?>
		<div class="course-hero">
			<div class="shell">
				<div class="crumb">
					<a href="<?php echo esc_url( home_url( '/' ) ); ?>">Início</a> &middot;
					<a href="<?php echo esc_url( get_post_type_archive_link( $tipo ) ); ?>"><?php echo esc_html( $obj ? $obj->labels->name : '' ); ?></a> &middot;
					<?php the_title(); ?>
				</div>
				<h1><?php the_title(); ?></h1>
				<?php if ( $c['resumo'] ) : ?>
					<p class="lead"><?php echo esc_html( wp_trim_words( $c['resumo'], 34 ) ); ?></p>
				<?php endif; ?>
				<div class="facts">
					<?php if ( $c['duracao'] ) : ?><div class="fact"><span>Duração</span><b><?php echo esc_html( $c['duracao'] ); ?></b></div><?php endif; ?>
					<?php if ( $c['modalidade'] ) : ?><div class="fact"><span>Modalidade</span><b><?php echo esc_html( wp_trim_words( $c['modalidade'], 5 ) ); ?></b></div><?php endif; ?>
					<?php if ( $c['titulacao'] ) : ?><div class="fact"><span>Titulação</span><b><?php echo esc_html( $c['titulacao'] ); ?></b></div><?php endif; ?>
					<div class="fact"><span>Tipo</span><b><?php echo esc_html( $nome ); ?></b></div>
				</div>
			</div>
		</div>

		<div class="shell">
			<div class="course-body">
				<div class="course-main">
					<?php if ( $c['imagem'] ) : ?>
						<img src="<?php echo esc_url( $c['imagem'] ); ?>" alt="<?php the_title_attribute(); ?>" style="width:100%;border-radius:18px;margin-bottom:2.5rem;aspect-ratio:16/8;object-fit:cover">
					<?php endif; ?>

					<?php if ( $c['sobre'] ) : ?>
						<section>
							<h2>O que você vai fazer nesse curso</h2>
							<?php echo wp_kses_post( wpautop( $c['sobre'] ) ); ?>
						</section>
					<?php endif; ?>

					<?php if ( $c['estrutura'] ) : ?>
						<section>
							<h2>Como o curso funciona</h2>
							<?php echo wp_kses_post( wpautop( $c['estrutura'] ) ); ?>
						</section>
					<?php endif; ?>

					<?php if ( $c['adicionais'] ) : ?>
						<section>
							<h2>Informações importantes</h2>
							<?php echo wp_kses_post( wpautop( $c['adicionais'] ) ); ?>
						</section>
					<?php endif; ?>

					<?php if ( $c['mec'] || $c['autorizacao'] ) : ?>
						<section>
							<h2>Reconhecimento</h2>
							<?php if ( $c['mec'] ) : ?><p><?php echo wp_kses_post( $c['mec'] ); ?></p><?php endif; ?>
							<?php if ( $c['autorizacao'] ) : ?><p><?php echo wp_kses_post( $c['autorizacao'] ); ?></p><?php endif; ?>
						</section>
					<?php endif; ?>

					<?php if ( trim( wp_strip_all_tags( get_the_content() ) ) ) : ?>
						<section><?php the_content(); ?></section>
					<?php endif; ?>

				</div>

				<aside>
					<div class="lateral">
						<div class="enroll">
							<?php if ( $c['investimento'] ) : ?>
								<div class="price"><small>Investimento</small><?php echo esc_html( $c['investimento'] ); ?></div>
								<hr>
							<?php endif; ?>
							<a href="<?php echo esc_url( $c['inscricao'] ? $c['inscricao'] : home_url( '/#inscricao' ) ); ?>" class="btn btn-gold"<?php echo $c['inscricao'] ? ' target="_blank" rel="noopener"' : ''; ?>>Quero minha vaga</a>
							<a href="<?php echo esc_url( home_url( '/#inscricao' ) ); ?>" class="btn btn-line" style="width:100%;justify-content:center">Simular minha mensalidade</a>
							<ul>
								<?php if ( $c['duracao'] ) : ?><li><span class="tick"></span><?php echo esc_html( $c['duracao'] ); ?></li><?php endif; ?>
								<?php if ( $c['modalidade'] ) : ?><li><span class="tick"></span><?php echo esc_html( wp_trim_words( $c['modalidade'], 6 ) ); ?></li><?php endif; ?>
								<li><span class="tick"></span>Inscrições abertas</li>
							</ul>
						</div>

						<div class="card-lat">
							<h2>Como entrar</h2>
							<ul>
								<li><span class="tick"></span>Inscrição sem taxa, feita totalmente online</li>
								<li><span class="tick"></span>FIES, ProUni e o programa Corporativo Florence</li>
								<li><span class="tick"></span>Time de admissões para orientar sua matrícula</li>
							</ul>
						</div>

						<?php if ( $c['matriz'] ) : ?>
							<div class="card-lat">
								<h2>Matriz curricular</h2>
								<p>As disciplinas e a carga horária completa do curso.</p>
								<a href="<?php echo esc_url( $c['matriz'] ); ?>" class="btn btn-line" target="_blank" rel="noopener">Baixar matriz curricular</a>
							</div>
						<?php endif; ?>

						<?php if ( $c['coordenador'] ) : ?>
							<div class="card-lat">
								<h2>Coordenação</h2>
								<p class="nome"><?php echo esc_html( $c['coordenador'] ); ?></p>
								<?php if ( $c['lattes'] ) : ?>
									<a class="lattes" href="<?php echo esc_url( $c['lattes'] ); ?>" target="_blank" rel="noopener">Ver currículo Lattes</a>
								<?php endif; ?>
							</div>
						<?php endif; ?>
					</div>
				</aside>
			</div>
		</div>

		<section class="final">
			<div class="shell">
				<h2>Comece <?php the_title(); ?> na próxima turma.</h2>
				<p>Preencha seus dados e nosso time entra em contato para orientar sua inscrição.</p>
				<a href="<?php echo esc_url( $c['inscricao'] ? $c['inscricao'] : home_url( '/#inscricao' ) ); ?>" class="btn btn-navy"<?php echo $c['inscricao'] ? ' target="_blank" rel="noopener"' : ''; ?>>Quero minha vaga</a>
			</div>
		</section>

	<?php else : ?>

		<div class="course-hero">
			<div class="shell" style="padding-bottom:3rem">
				<div class="crumb"><a href="<?php echo esc_url( home_url( '/' ) ); ?>">Início</a> &middot; Notícias</div>
				<h1><?php the_title(); ?></h1>
				<p class="lead"><?php echo esc_html( get_the_date() ); ?></p>
			</div>
		</div>
		<div class="shell">
			<div class="course-body">
				<div class="course-main">
					<section>
						<?php
						if ( has_post_thumbnail() ) {
							the_post_thumbnail( 'large', array( 'style' => 'width:100%;border-radius:18px;margin-bottom:2rem' ) );
						}
						the_content();
						?>
					</section>
				</div>
				<aside>
					<div class="enroll">
						<p style="font-family:var(--display);font-weight:800;font-size:1.2rem;margin-bottom:.6rem">Estude na Florence</p>
						<p style="color:var(--muted);font-size:.93rem">Inscrições abertas para graduação, técnico e pós-graduação.</p>
						<hr>
						<a href="<?php echo esc_url( home_url( '/#inscricao' ) ); ?>" class="btn btn-gold">Quero minha vaga</a>
					</div>
				</aside>
			</div>
		</div>

	<?php endif; ?>
<?php endwhile; ?>
<?php get_footer();
