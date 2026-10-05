/* Theme */
(function () {
  var root = document.documentElement;
  root.classList.remove('no-js');
  root.classList.add('js');

  var VAH = (window.VAH = window.VAH || {});
  VAH.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var KEY = 'vah-shift';
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  root.setAttribute('data-theme', saved === 'day' ? 'day' : 'night');

  setTimeout(function () {
    var hero = document.querySelector('.hero');
    if (hero) hero.classList.add('is-settled');
  }, 2500);

  function current() { return root.getAttribute('data-theme'); }

  function render() {
    var t = current();
    var btn = document.getElementById('shift-toggle');
    if (btn) {
      btn.querySelector('.shift-toggle__label').textContent = 'shift: ' + t;
      btn.setAttribute('aria-label', t === 'night'
        ? 'Switch to day shift (light theme)'
        : 'Switch to night shift (dark theme)');
    }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'night' ? '#0D0B07' : '#FFFFFF');
  }

  VAH.setShift = function (t) {
    if (t !== 'night' && t !== 'day') return false;
    if (t === current()) return true;
    root.setAttribute('data-theme', t);
    try { localStorage.setItem(KEY, t); } catch (e) {}
    render();
    if (VAH.audit) VAH.audit('shift changed to ' + t);
    return true;
  };

  document.addEventListener('DOMContentLoaded', function () {
    render();
    var btn = document.getElementById('shift-toggle');
    if (btn) btn.addEventListener('click', function () {
      VAH.setShift(current() === 'night' ? 'day' : 'night');
    });
  });
})();
