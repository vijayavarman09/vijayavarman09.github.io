/* Scroll transitions */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var body = document.body;
  body.classList.add('motion');

  var START = 0.97;
  var SPAN = 0.22;
  var items = [];

  function qa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function clamp(v) { return Math.min(1, Math.max(0, v)); }

  function collect() {
    items.forEach(function (it) { it.el.style.transform = ''; it.el.style.opacity = ''; });
    items = [];
    var narrow = window.innerWidth < 720;

    function add(el, dx, dy, ref, keepX) {
      if (!el) return;
      var side = narrow && !keepX ? 0 : dx;
      items.push({ el: el, ref: ref || el, dx: side, dy: dx && !side ? 16 : dy });
    }

    qa('.path-heading, .section-intro, .timeline-group__label, .contact__lead, .contact__row, .contact__links')
      .forEach(function (el) { add(el, 0, 12); });

    add(document.querySelector('.about__text'), -36, 0);
    add(document.querySelector('.record'), 36, 0);

    qa('.cred').forEach(function (row) { add(row.querySelector('.cred__status'), 14, 0, row, true); });
    qa('.domain').forEach(function (row) { add(row.querySelector('dt'), -20, 0, row, true); });

    add(document.querySelector('.pub'), -36, 0);
    qa('.result').forEach(function (r, i) { add(r, i % 2 ? 36 : -36, 0); });
  }

  var hero = document.querySelector('.hero');
  var heroGrid = document.querySelector('.hero__grid');

  function update() {
    var vh = window.innerHeight;
    var atBottom = window.scrollY >= document.documentElement.scrollHeight - vh - 2;

    items.forEach(function (it) {
      var top = it.ref.getBoundingClientRect().top;
      if (it.ref === it.el) top -= it.dy * (1 - (it.p === undefined ? 1 : it.p));
      var p = atBottom ? 1 : clamp((vh * START - top) / (vh * SPAN));
      var k = 1 - p;
      it.p = p;
      it.el.style.transform = k ? 'translate3d(' + (it.dx * k).toFixed(1) + 'px,' + (it.dy * k).toFixed(1) + 'px,0)' : '';
      it.el.style.opacity = k ? p.toFixed(3) : '';
    });

    if (heroGrid && window.innerWidth >= 900) {
      var h = clamp(window.scrollY / (hero.offsetHeight * 0.7));
      heroGrid.style.transform = h ? 'translateY(' + (-h * 70).toFixed(1) + 'px)' : '';
      heroGrid.style.opacity = h ? (1 - h).toFixed(3) : '';
    } else if (heroGrid) {
      heroGrid.style.transform = '';
      heroGrid.style.opacity = '';
    }

    var line = vh * 0.6;
    qa('.timeline').forEach(function (tl) {
      var r = tl.getBoundingClientRect();
      var lineTop = r.top + 9.6;
      tl.style.setProperty('--fill', clamp((line - lineTop) / Math.max(1, r.height - 9.6)).toFixed(4));
      qa('.entry', tl).forEach(function (e) {
        e.classList.toggle('is-reached', e.getBoundingClientRect().top + 13 <= line);
      });
    });
  }

  var ticking = false;
  function request() {
    if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; update(); }); }
  }
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', function () { collect(); request(); });

  collect();
  update();
})();
