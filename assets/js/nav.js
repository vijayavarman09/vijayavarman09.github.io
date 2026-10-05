/* Navigation */
(function () {
  var nav = document.getElementById('site-nav');
  var menuBtn = document.querySelector('.menu-toggle');
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));

  function closeMenu() {
    if (!nav) return;
    nav.classList.remove('is-open');
    if (menuBtn) { menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.textContent = 'menu'; }
  }
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      var open = !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.textContent = open ? 'close' : 'menu';
    });
    links.forEach(function (a) { a.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }

  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'))
    .filter(function (s) { return document.querySelector('.nav__link[href="#' + s.id + '"]'); });

  function spy() {
    var line = window.innerHeight * 0.35;
    var atBottom = window.scrollY >= document.documentElement.scrollHeight - window.innerHeight - 2;
    var current = null;
    sections.forEach(function (s) { if (s.getBoundingClientRect().top <= line) current = s.id; });
    if (atBottom && sections.length) current = sections[sections.length - 1].id;
    links.forEach(function (a) {
      if (a.getAttribute('href') === '#' + current) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; spy(); }); }
  }, { passive: true });
  window.addEventListener('resize', spy);
  spy();
})();
