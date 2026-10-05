/* Copy email */
(function () {
  var btn = document.querySelector('.copy-btn');
  if (!btn || !navigator.clipboard) return;
  btn.hidden = false;
  var original = btn.textContent;
  btn.addEventListener('click', function () {
    navigator.clipboard.writeText(btn.getAttribute('data-copy')).then(function () {
      btn.textContent = 'copied';
      btn.classList.add('is-done');
      if (window.VAH && VAH.audit) VAH.audit('email address copied');
      setTimeout(function () { btn.textContent = original; btn.classList.remove('is-done'); }, 1800);
    });
  });
})();
