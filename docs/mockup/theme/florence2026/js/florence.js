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
				(c.closest('.curso-item') || c).hidden = !ok;
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
	/* ---------- Medicao (GTM/GA4): eventos no dataLayer ---------- */
	window.dataLayer = window.dataLayer || [];
	function medir(evento, dados) {
		var d = dados || {};
		d.event = evento;
		window.dataLayer.push(d);
	}
	function localDe(el) {
		var bloco = el.closest('.barra-vaga,.zap-flutuante,header.site,.util,footer.site,.hero,.course-hero,.enroll,.enroll-mobile,.final,.ways,.comparar-tabela,.quiz,section');
		return bloco ? (bloco.className.split(' ')[0] || bloco.tagName.toLowerCase()) : 'pagina';
	}
	document.addEventListener('click', function (e) {
		var a = e.target.closest('a,button');
		if (!a) return;
		var href = a.getAttribute('href') || '';
		var local = localDe(a);
		if (/whatsapp\.com|wa\.me/.test(href)) medir('fl_whatsapp', { local: local });
		else if (/crmeducacional/.test(href)) medir('fl_inscricao', { local: local, rotulo: a.textContent.trim().slice(0, 60) });
		else if (/^tel:/.test(href)) medir('fl_telefone', { local: local });
		else if (/#valores$/.test(href)) medir('fl_ver_valores', { local: local });
		else if (a.classList.contains('filtro-chip')) medir('fl_filtro_cursos', { modalidade: a.getAttribute('data-modalidade') || 'todas' });
		else if (a.classList.contains('comparar-ir')) medir('fl_comparar', { qtd: memoria.length });
	});
	document.querySelectorAll('.mapa-capa').forEach(function (c) { c.addEventListener('click', function () { medir('fl_mapa'); }); });

	/* Ninja Forms: envio, formulario em etapas e curso ja preenchido. */
	if (window.jQuery) {
		window.jQuery(document).on('nfFormSubmitResponse', function (e, r) {
			medir('fl_formulario_enviado', { form_id: r && r.id ? String(r.id) : '', pagina: location.pathname });
		});
		// O Ninja Forms monta o form antes ou depois deste script: espera o campo aparecer.
		var tentativas = 0;
		var espera = setInterval(function () {
			var raiz = document.getElementById('nf-form-10-cont');
			if ((raiz && raiz.querySelector('#nf-field-74-container')) || ++tentativas > 40) { clearInterval(espera); if (raiz) etapas(raiz); }
		}, 250);
		function etapas(raiz) {
			if (raiz.getAttribute('data-etapas')) return;
			raiz.setAttribute('data-etapas', '1');
			var campo = function (n) { return raiz.querySelector('#nf-field-' + n + '-container'); };
			var passo1 = [campo(70), campo(73)].filter(Boolean);
			var passo2 = [campo(71), campo(72), campo(74)].filter(Boolean);
			var cursoInput = raiz.querySelector('#nf-field-73');
			var caixa = raiz.closest('[data-curso]');
			var curso = (caixa && caixa.getAttribute('data-curso')) || new URLSearchParams(location.search).get('curso');
			if (cursoInput && curso && !cursoInput.value) {
				cursoInput.value = curso;
				window.jQuery(cursoInput).trigger('change');
			}
			if (passo1.length < 2 || passo2.length < 2) return;
			var prog = document.createElement('p');
			prog.className = 'etapas-progresso';
			prog.setAttribute('aria-live', 'polite');
			passo1[0].parentNode.insertBefore(prog, passo1[0]);
			var seguir = document.createElement('button');
			seguir.type = 'button';
			seguir.className = 'btn btn-gold etapas-seguir';
			seguir.textContent = 'Continuar';
			passo1[passo1.length - 1].after(seguir);
			var voltar = document.createElement('button');
			voltar.type = 'button';
			voltar.className = 'etapas-voltar';
			voltar.textContent = 'Voltar';
			passo2[passo2.length - 1].after(voltar);
			function mostra(n) {
				passo1.forEach(function (c) { c.hidden = n !== 1; });
				seguir.hidden = n !== 1;
				passo2.forEach(function (c) { c.hidden = n !== 2; });
				voltar.hidden = n !== 2;
				prog.innerHTML = 'Passo ' + n + ' de 2 <span class="etapas-barra"><i style="width:' + (n * 50) + '%"></i></span>';
			}
			seguir.addEventListener('click', function () {
				var nome = raiz.querySelector('#nf-field-70');
				if (nome && !nome.value.trim()) { nome.focus(); nome.setAttribute('aria-invalid', 'true'); return; }
				if (nome) nome.removeAttribute('aria-invalid');
				mostra(2);
				medir('fl_formulario_passo2', { pagina: location.pathname });
				var email = raiz.querySelector('#nf-field-71');
				if (email) email.focus();
			});
			voltar.addEventListener('click', function () { mostra(1); });
			mostra(1);
		}
	}

	/* ---------- Comparador: selecao nas listagens (ate 3) ---------- */
	function lerSelecao() {
		try { return JSON.parse(sessionStorage.getItem('fl-comparar') || '[]'); } catch (err) { return []; }
	}
	var memoria = lerSelecao();
	function guarda(lista) {
		memoria = lista;
		try { sessionStorage.setItem('fl-comparar', JSON.stringify(lista)); } catch (err) { /* sem storage: vale so nesta pagina */ }
	}
	var barraComp = document.querySelector('.comparar-barra');
	if (barraComp) {
		var toggles = document.querySelectorAll('.comparar-toggle');
		var pinta = function () {
			toggles.forEach(function (t) {
				var on = memoria.indexOf(t.getAttribute('data-id')) > -1;
				t.setAttribute('aria-pressed', String(on));
				t.textContent = on ? 'Na comparação' : 'Comparar';
				t.disabled = !on && memoria.length >= 3;
			});
			barraComp.hidden = memoria.length === 0;
			barraComp.querySelector('.comparar-qtd').textContent = memoria.length === 1 ? '1 curso. Escolha mais um.' : memoria.length + ' cursos selecionados';
			var ir = barraComp.querySelector('.comparar-ir');
			ir.href = barraComp.getAttribute('data-base') + '?c=' + memoria.join(',');
			ir.classList.toggle('is-off', memoria.length < 2);
		};
		toggles.forEach(function (t) {
			t.addEventListener('click', function () {
				var id = t.getAttribute('data-id');
				var lista = memoria.slice();
				var i = lista.indexOf(id);
				if (i > -1) lista.splice(i, 1); else if (lista.length < 3) { lista.push(id); medir('fl_comparar_add'); }
				guarda(lista);
				pinta();
			});
		});
		barraComp.querySelector('.comparar-limpar').addEventListener('click', function () { guarda([]); pinta(); });
		barraComp.querySelector('.comparar-ir').addEventListener('click', function (e) { if (memoria.length < 2) e.preventDefault(); });
		pinta();
	}
	var formComp = document.querySelector('[data-comparar-form]');
	if (formComp) {
		formComp.addEventListener('submit', function () {
			var ids = [];
			formComp.querySelectorAll('[data-slot]').forEach(function (s) { if (s.value && ids.indexOf(s.value) < 0) ids.push(s.value); });
			formComp.querySelector('input[name="c"]').value = ids.join(',');
			guarda(ids);
		});
	}

	/* ---------- Quiz vocacional ---------- */
	var quiz = document.querySelector('[data-quiz]');
	var quizDados = document.getElementById('quiz-dados');
	if (quiz && quizDados) {
		var Q = JSON.parse(quizDados.textContent);
		var resp = [];
		var esc = function (s) { var d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; };
		var desenha = function (i) {
			if (i >= Q.perguntas.length) { resultado(); return; }
			var p = Q.perguntas[i];
			var html = '<div class="quiz-topo"><span>Pergunta ' + (i + 1) + ' de ' + Q.perguntas.length + '</span><span class="etapas-barra"><i style="width:' + Math.round((i / Q.perguntas.length) * 100) + '%"></i></span></div>';
			html += '<h2 class="quiz-pergunta" tabindex="-1">' + esc(p[0]) + '</h2><div class="quiz-opcoes">';
			p[1].forEach(function (o, k) { html += '<button type="button" class="quiz-opcao" data-k="' + k + '">' + esc(o[0]) + '</button>'; });
			html += '</div>';
			if (i > 0) html += '<button type="button" class="etapas-voltar quiz-voltar">Voltar</button>';
			quiz.innerHTML = html;
			if (i > 0) quiz.querySelector('.quiz-pergunta').focus({ preventScroll: true });
			quiz.querySelectorAll('.quiz-opcao').forEach(function (b) {
				b.addEventListener('click', function () {
					if (i === 0) medir('fl_quiz_inicio');
					resp[i] = +b.getAttribute('data-k');
					desenha(i + 1);
				});
			});
			var v = quiz.querySelector('.quiz-voltar');
			if (v) v.addEventListener('click', function () { desenha(i - 1); });
		};
		var resultado = function () {
			var pts = {};
			resp.forEach(function (k, i) {
				var pesos = Q.perguntas[i][1][k][1];
				Object.keys(pesos).forEach(function (s) { pts[s] = (pts[s] || 0) + pesos[s]; });
			});
			var top = Object.keys(pts).filter(function (s) { return Q.cursos[s]; }).sort(function (a, b) { return pts[b] - pts[a]; }).slice(0, 3);
			medir('fl_quiz_resultado', { curso: top[0] || '' });
			var html = '<div class="quiz-resultado"><div class="kicker">Seu resultado</div><h2 tabindex="-1">Estes cursos combinam com você</h2><div class="quiz-cards">';
			top.forEach(function (s, n) {
				var c = Q.cursos[s];
				html += '<article class="quiz-card' + (n === 0 ? ' is-top' : '') + '">' + (c.imagem ? '<img src="' + esc(c.imagem) + '" alt="" loading="lazy">' : '') +
					'<div class="quiz-card-corpo">' + (n === 0 ? '<span class="curso-tag">Mais combina</span>' : '') + '<h3>' + esc(c.nome) + '</h3>' + (c.duracao ? '<p class="quiz-dur">' + esc(c.duracao) + '</p>' : '') +
					'<p>' + esc(c.resumo) + '</p><div class="quiz-acoes"><a class="btn btn-gold" href="' + esc(c.url) + '#valores">Receber informações</a><a class="btn btn-line" href="' + esc(c.url) + '">Ver o curso</a></div></div></article>';
			});
			html += '</div><p class="quiz-rodape">';
			if (top.length > 1) html += '<a href="' + quiz.getAttribute('data-comparar') + '?c=' + top.map(function (s) { return Q.cursos[s].id; }).join(',') + '">Comparar estes cursos lado a lado</a>';
			html += '<button type="button" class="etapas-voltar quiz-refazer">Refazer o teste</button></p></div>';
			quiz.innerHTML = html;
			quiz.querySelector('h2').focus({ preventScroll: true });
			quiz.scrollIntoView({ behavior: calmo ? 'auto' : 'smooth', block: 'start' });
			quiz.querySelector('.quiz-refazer').addEventListener('click', function () { resp = []; desenha(0); });
		};
		desenha(0);
	}
})();
