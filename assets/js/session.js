/* Session badge */
(function () {
  var badge = document.querySelector('.session__badge');
  var panel = document.getElementById('session-panel');
  if (!badge || !panel) return;

  var idEl = panel.querySelector('[data-session="id"]');
  var startEl = panel.querySelector('[data-session="start"]');
  if (idEl && window.crypto && crypto.getRandomValues) {
    var b = crypto.getRandomValues(new Uint8Array(4));
    idEl.textContent = 'guest-' + Array.prototype.map.call(b, function (x) {
      return ('0' + x.toString(16)).slice(-2);
    }).join('');
  }
  if (startEl) {
    startEl.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', local time';
  }

  var inner = panel.firstElementChild;
  inner.inert = true;
  badge.addEventListener('click', function () {
    var open = badge.getAttribute('aria-expanded') !== 'true';
    badge.setAttribute('aria-expanded', String(open));
    panel.classList.toggle('is-open', open);
    inner.inert = !open;
    if (open && window.VAH && VAH.audit) VAH.audit('viewer inspected session details');
  });
})();
