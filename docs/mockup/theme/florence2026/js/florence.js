/* Florence 2026: interacoes leves do tema, sem dependencias. */
(function () {
	'use strict';
	var calmo = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var temIO = 'IntersectionObserver' in window;

	/* Entrada ao rolar: elementos com [data-reveal] sobem e aparecem uma vez. */
	var revelar = document.querySelectorAll('[data-reveal]');
	if (calmo || !temIO) {
		revelar.forEach(function (el) { el.classList.add('is-in'); });
	} else {
		var io = new IntersectionObserver(function (itens) {
			itens.forEach(function (it) {
				if (it.isIntersecting) { it.target.classList.add('is-in'); io.unobserve(it.target); }
			});
		}, { rootMargin: '0px 0px -8% 0px' });
		revelar.forEach(function (el) { io.observe(el); });
	}

	/* Contadores: [data-count="10"] conta de 0 ate o valor quando aparece. */
	function contar(el) {
		var alvo = parseInt(el.getAttribute('data-count'), 10) || 0;
		if (calmo) { el.textContent = alvo; return; }
		var ini = null, dur = 1400;
		function passo(t) {
			if (!ini) ini = t;
			var p = Math.min((t - ini) / dur, 1);
			el.textContent = Math.round(alvo * (1 - Math.pow(1 - p, 3)));
			if (p < 1) requestAnimationFrame(passo);
		}
		requestAnimationFrame(passo);
	}
	var contadores = document.querySelectorAll('[data-count]');
	if (temIO) {
		var ioC = new IntersectionObserver(function (itens) {
			itens.forEach(function (it) {
				if (it.isIntersecting) { contar(it.target); ioC.unobserve(it.target); }
			});
		}, { threshold: .6 });
		contadores.forEach(function (el) { ioC.observe(el); });
	} else {
		contadores.forEach(contar);
	}

	/* Barra fixa de inscricao no celular: aparece depois do primeiro scroll, some no rodape. */
	var barra = document.querySelector('.barra-vaga');
	var rodape = document.querySelector('footer.site');
	if (barra) {
		var noRodape = false;
		if (temIO && rodape) {
			new IntersectionObserver(function (itens) { noRodape = itens[0].isIntersecting; atualiza(); }).observe(rodape);
		}
		function atualiza() {
			barra.classList.toggle('is-on', window.scrollY > 480 && !noRodape && !document.body.classList.contains('menu-aberto'));
		}
		window.addEventListener('scroll', atualiza, { passive: true });
		atualiza();
	}

	/* Filtro das listagens de curso: busca por nome + modalidade. */
	var grade = document.querySelector('[data-filtro-cursos]');
	if (grade) {
		var cards = Array.prototype.slice.call(grade.querySelectorAll('.curso-card'));
		var busca = document.querySelector('.filtro-busca');
		var chips = document.querySelectorAll('.filtro-chip');
		var vazio = document.querySelector('.filtro-vazio');
		var contagem = document.querySelector('.filtro-contagem');
		var modo = '';
		var semAcento = function (s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); };
		function filtra() {
			var q = semAcento(busca ? busca.value.trim() : '');
			var n = 0;
			cards.forEach(function (c) {
				var ok = (!q || semAcento(c.getAttribute('data-nome')).indexOf(q) > -1) &&
					(!modo || c.getAttribute('data-modalidade') === modo);
				c.hidden = !ok;
				if (ok) n++;
			});
			if (vazio) vazio.hidden = n > 0;
			if (contagem) contagem.textContent = n === 1 ? '1 curso' : n + ' cursos';
		}
		if (busca) busca.addEventListener('input', filtra);
		chips.forEach(function (ch) {
			ch.addEventListener('click', function () {
				modo = ch.getAttribute('data-modalidade');
				chips.forEach(function (o) { o.setAttribute('aria-pressed', String(o === ch)); });
				filtra();
			});
		});
	}

	/* Mapa da Contato so carrega ao clicar (o iframe do Google pesa e aparecia cinza). */
	document.querySelectorAll('.mapa-capa').forEach(function (capa) {
		capa.addEventListener('click', function () {
			var f = document.createElement('iframe');
			f.className = 'contato-mapa';
			f.title = 'Mapa do campus';
			f.src = capa.getAttribute('data-src');
			f.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
			capa.replaceWith(f);
		});
	});

	/* Conteudo legado usa "paragrafo todo em negrito" como subtitulo: marca so esses. */
	document.querySelectorAll('.conteudo p').forEach(function (p) {
		var forte = p.querySelector('strong, b');
		var texto = p.textContent.trim();
		if (forte && texto && texto.length < 120 && forte.textContent.trim() === texto) p.classList.add('subtitulo');
	});

	/* Rodape em acordeao no celular. */
	var mq = window.matchMedia('(max-width: 640px)');
	document.querySelectorAll('.foot-col h4').forEach(function (h) {
		h.setAttribute('role', 'button');
		h.setAttribute('tabindex', '0');
		function alterna() {
			if (!mq.matches) return;
			var col = h.parentElement;
			var aberto = col.classList.toggle('is-open');
			h.setAttribute('aria-expanded', String(aberto));
		}
		h.addEventListener('click', alterna);
		h.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); alterna(); } });
	});
})();
