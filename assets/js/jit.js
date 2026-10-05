/* Request access */
(function () {
  var VAH = window.VAH || {};
  var LOCK = '<svg class="jit__icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.5" d="M4.5 7V5a3.5 3.5 0 0 1 7 0v2"/><rect x="2.75" y="7" width="10.5" height="7.5" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';

  document.querySelectorAll('.case__details').forEach(function (details) {
    var caseId = details.id.replace('-details', '');
    var inner = details.firstElementChild;
    details.setAttribute('data-jit', '');
    inner.inert = true;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'jit';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', details.id);
    btn.innerHTML = LOCK + '<span class="jit__label">request access</span>';
    details.parentNode.insertBefore(btn, details);
    var label = btn.querySelector('.jit__label');

    function open() {
      details.classList.add('is-open');
      inner.inert = false;
      btn.classList.remove('is-working');
      btn.setAttribute('aria-expanded', 'true');
      label.textContent = 'revoke access';
      if (VAH.audit) VAH.audit('viewer elevated to ' + caseId + ' (just-in-time, read-only)');
    }
    function close() {
      details.classList.remove('is-open');
      inner.inert = true;
      btn.setAttribute('aria-expanded', 'false');
      label.textContent = 'request access';
      if (VAH.audit) VAH.audit('access to ' + caseId + ' revoked');
    }

    btn.addEventListener('click', function () {
      if (btn.classList.contains('is-working')) return;
      if (btn.getAttribute('aria-expanded') === 'true') { close(); return; }
      if (VAH.reducedMotion) { open(); return; }
      btn.classList.add('is-working');
      label.textContent = 'elevating…';
      setTimeout(function () { label.textContent = 'granted'; }, 520);
      setTimeout(open, 820);
    });
  });
})();
