(function () {
  var doc = document.documentElement;
  doc.classList.add('js');
  var reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Cabeçalho sólido após rolar
  var topo = document.getElementById('cabecalho');
  function atualizaTopo() { topo.classList.toggle('solido', window.scrollY > 40); }
  atualizaTopo();
  window.addEventListener('scroll', atualizaTopo, { passive: true });

  // Revelar ao rolar
  var itens = document.querySelectorAll('.revelar');
  if ('IntersectionObserver' in window && !reduz) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visivel'); obs.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    itens.forEach(function (el) { obs.observe(el); });
  } else {
    itens.forEach(function (el) { el.classList.add('visivel'); });
  }

  // Carrossel infinito (rolagem contínua + setas + arrastar)
  document.querySelectorAll('.carrossel').forEach(function (car) {
    var janela = car.querySelector('.carrossel-janela');
    var trilho = car.querySelector('.carrossel-trilho');
    if (!janela || !trilho) return;
    var originais = Array.prototype.slice.call(trilho.children);
    var n = originais.length;
    for (var k = 0; k < 2; k++) {
      originais.forEach(function (el) {
        var c = el.cloneNode(true);
        c.setAttribute('aria-hidden', 'true');
        var im = c.querySelector('img'); if (im) im.alt = '';
        trilho.appendChild(c);
      });
    }
    var S = 0, pos = 0, ultimo = null, pausado = false, arrastando = false, anim = null;
    var velocidade = 34; // px por segundo
    function mede() { S = trilho.children[n].offsetLeft - trilho.children[0].offsetLeft; }
    function aplica() {
      var p = S > 0 ? ((pos % S) + S) % S : 0;
      trilho.style.transform = 'translate3d(' + (-(S + p)).toFixed(2) + 'px,0,0)';
    }
    function quadro(t) {
      if (ultimo !== null && !pausado && !arrastando && !anim && !reduz) pos += velocidade * (t - ultimo) / 1000;
      ultimo = t;
      if (anim) {
        var q = Math.min(1, (t - anim.inicio) / anim.duracao);
        pos = anim.de + (anim.para - anim.de) * (1 - Math.pow(1 - q, 3));
        if (q >= 1) anim = null;
      }
      aplica();
      requestAnimationFrame(quadro);
    }
    car.querySelectorAll('[data-direcao]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var dir = parseInt(btn.getAttribute('data-direcao'), 10);
        var passo = Math.min(janela.clientWidth * 0.6, 640);
        var base = anim ? anim.para : pos;
        anim = { de: pos, para: base + dir * passo, inicio: performance.now(), duracao: reduz ? 1 : 650 };
      });
    });
    janela.addEventListener('mouseenter', function () { pausado = true; });
    janela.addEventListener('mouseleave', function () { pausado = false; });
    janela.addEventListener('pointerdown', function (e) {
      arrastando = true; anim = null;
      var x0 = e.clientX, p0 = pos;
      janela.classList.add('arrastando');
      if (janela.setPointerCapture) janela.setPointerCapture(e.pointerId);
      function move(ev) { pos = p0 - (ev.clientX - x0); }
      function fim() {
        arrastando = false; janela.classList.remove('arrastando');
        janela.removeEventListener('pointermove', move);
        janela.removeEventListener('pointerup', fim);
        janela.removeEventListener('pointercancel', fim);
      }
      janela.addEventListener('pointermove', move);
      janela.addEventListener('pointerup', fim);
      janela.addEventListener('pointercancel', fim);
    });
    trilho.querySelectorAll('img').forEach(function (im) { if (!im.complete) im.addEventListener('load', mede); });
    window.addEventListener('resize', mede);
    mede();
    requestAnimationFrame(quadro);
  });

  // Lightbox da galeria
  var lb = document.getElementById('lightbox');
  var gatilhos = Array.prototype.slice.call(document.querySelectorAll('.galeria-abrir'));
  if (lb && gatilhos.length) {
    var lbImg = document.getElementById('lightbox-img');
    var lbCont = document.getElementById('lightbox-contador');
    var atual = 0, origem = null;
    function mostra(i) {
      atual = (i + gatilhos.length) % gatilhos.length;
      var im = gatilhos[atual].querySelector('img');
      lbImg.src = im.getAttribute('src');
      lbImg.alt = im.getAttribute('alt');
      lbCont.textContent = (atual + 1) + ' / ' + gatilhos.length;
    }
    function abre(i) {
      origem = gatilhos[i];
      mostra(i);
      lb.hidden = false;
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(function () { lb.classList.add('aberto'); });
      lb.querySelector('.lightbox-fechar').focus();
    }
    function fecha() {
      lb.classList.remove('aberto');
      lb.hidden = true;
      document.body.style.overflow = '';
      if (origem) origem.focus();
    }
    gatilhos.forEach(function (g, i) { g.addEventListener('click', function () { abre(i); }); });
    lb.querySelector('.lightbox-fechar').addEventListener('click', fecha);
    lb.querySelector('.lightbox-anterior').addEventListener('click', function () { mostra(atual - 1); });
    lb.querySelector('.lightbox-proxima').addEventListener('click', function () { mostra(atual + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) fecha(); });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') fecha();
      else if (e.key === 'ArrowLeft') mostra(atual - 1);
      else if (e.key === 'ArrowRight') mostra(atual + 1);
      else if (e.key === 'Tab') {
        var foco = lb.querySelectorAll('button');
        var primeiro = foco[0], ultimoBtn = foco[foco.length - 1];
        if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimoBtn.focus(); }
        else if (!e.shiftKey && document.activeElement === ultimoBtn) { e.preventDefault(); primeiro.focus(); }
      }
    });
    var xToque = null;
    lb.addEventListener('touchstart', function (e) { xToque = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (xToque === null) return;
      var dx = e.changedTouches[0].clientX - xToque;
      if (Math.abs(dx) > 50) mostra(atual + (dx < 0 ? 1 : -1));
      xToque = null;
    });
  }

})();
