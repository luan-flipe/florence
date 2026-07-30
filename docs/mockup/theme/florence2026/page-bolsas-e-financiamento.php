<?php
/**
 * Bolsas e Financiamento (pagina 52611, slug bolsas-e-financiamento).
 * Reune num lugar so o que o site antigo espalhava em quatro cartoes soltos:
 * bolsas por desempenho, FIES, ProUni e o programa Corporativo. Conteudo
 * factual, consistente com o material da instituicao.
 */
if ( ! defined( 'ABSPATH' ) ) exit;
get_header();

$zap    = 'https://api.whatsapp.com/send?phone=5598988630502';       // atendimento geral
$zapcorp = 'https://api.whatsapp.com/send?phone=5598992422120';      // corporativo
$insc   = florence2026_url_inscricao();

$vias = array(
	array(
		'nome' => 'Bolsas Florence',
		'desc' => 'Descontos no ingresso pelo Vestibular, ENEM ou histórico escolar, e bolsas de até 77% para servidores públicos e funcionários de empresas parceiras, incluindo dependentes.',
		'cta'  => 'Quero minha vaga', 'url' => $insc, 'ext' => true,
	),
	array(
		'nome' => 'FIES',
		'desc' => 'O Fundo de Financiamento Estudantil do MEC financia a sua graduação. Você estuda agora e começa a pagar depois de formado, com condições facilitadas.',
		'cta'  => 'Tirar dúvidas no WhatsApp', 'url' => $zap, 'ext' => true,
	),
	array(
		'nome' => 'ProUni',
		'desc' => 'O Programa Universidade para Todos, do MEC, oferece bolsas de 50% e 100% com base na sua nota do ENEM e na renda familiar.',
		'cta'  => 'Tirar dúvidas no WhatsApp', 'url' => $zap, 'ext' => true,
	),
	array(
		'nome' => 'Corporativo Florence',
		'desc' => 'Sua empresa investe na formação da equipe e todos ganham. Condições especiais de mensalidade para funcionários e seus dependentes.',
		'cta'  => 'Falar com o time corporativo', 'url' => $zapcorp, 'ext' => true,
	),
);
?>
<div class="course-hero">
	<div class="shell">
		<div class="crumb">
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>">Início</a> &middot; Bolsas e financiamento
		</div>
		<h1>Bolsas e financiamento</h1>
		<p class="lead">Estudar na Florence cabe no seu planejamento. Reunimos num lugar só as formas de reduzir a mensalidade: bolsas por desempenho, os programas do MEC e condições para empresas.</p>
		<div class="facts">
			<div class="fact"><span>Bolsas</span><b>Até 77%</b></div>
			<div class="fact"><span>Programas do MEC</span><b>FIES e ProUni</b></div>
			<div class="fact"><span>Empresas</span><b>Corporativo Florence</b></div>
		</div>
	</div>
</div>

<section>
	<div class="shell">
		<div class="sec-head">
			<div>
				<div class="kicker">Como reduzir a mensalidade</div>
				<h2>Quatro caminhos para o valor caber no seu bolso.</h2>
			</div>
			<p>Cada perfil tem uma porta de entrada. Você pode combinar mais de uma, e o time de admissões ajuda a encontrar a melhor para o seu caso.</p>
		</div>
		<div class="fin-grid">
			<?php foreach ( $vias as $v ) : ?>
				<div class="fin-card">
					<h2><?php echo esc_html( $v['nome'] ); ?></h2>
					<p><?php echo esc_html( $v['desc'] ); ?></p>
					<a href="<?php echo esc_url( $v['url'] ); ?>" class="btn btn-line"<?php echo $v['ext'] ? ' target="_blank" rel="noopener"' : ''; ?>><?php echo esc_html( $v['cta'] ); ?></a>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<section class="final">
	<div class="shell">
		<h2>Descubra quanto a sua mensalidade pode custar.</h2>
		<p>Fale com o time de admissões e simule a sua bolsa de acordo com o seu perfil de ingresso.</p>
		<a href="<?php echo esc_url( $insc ); ?>" class="btn btn-navy" target="_blank" rel="noopener">Quero minha vaga</a>
	</div>
</section>
<?php get_footer();
