/* Name decrypt */
(function () {
  var hero = document.querySelector('.hero');
  var h1 = document.getElementById('hero-name');
  if (!hero || !h1) return;

  var lines = Array.prototype.slice.call(h1.querySelectorAll('.hero__name-line'));
  var finals = lines.map(function (l) { return l.textContent; });

  if (window.VAH && VAH.reducedMotion) { hero.classList.add('is-settled'); return; }

  h1.setAttribute('aria-label', finals.join(' '));
  lines.forEach(function (l) { l.setAttribute('aria-hidden', 'true'); });

  var glyphs = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*+=<>/';
  var totalChars = finals.join('').length;
  var START = 120, SPAN = 900;
  var t0 = null, lastSwap = 0, settled = false;

  function rnd() { return glyphs[(Math.random() * glyphs.length) | 0]; }

  function frame(now) {
    if (t0 === null) t0 = now;
    var t = now - t0;
    var swap = now - lastSwap > 45;
    if (swap) lastSwap = now;
    var k = 0, done = true;
    lines.forEach(function (l, li) {
      var out = '';
      var text = finals[li];
      for (var i = 0; i < text.length; i++, k++) {
        var at = START + (k / totalChars) * SPAN;
        if (t >= at) out += text[i];
        else { done = false; out += swap ? rnd() : (l.textContent[i] || rnd()); }
      }
      l.textContent = out;
    });
    if (!settled && t > START + SPAN * 0.7) { settled = true; hero.classList.add('is-settled'); }
    if (!done) requestAnimationFrame(frame);
    else {
      lines.forEach(function (l, i) { l.textContent = finals[i]; l.removeAttribute('aria-hidden'); });
      h1.removeAttribute('aria-label');
    }
  }
  requestAnimationFrame(frame);
})();
