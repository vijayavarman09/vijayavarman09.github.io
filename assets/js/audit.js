/* Audit log */
(function () {
  var VAH = (window.VAH = window.VAH || {});
  var box = document.querySelector('.audit');
  if (!box) return;

  var panel = box.querySelector('.audit__panel');
  var list = box.querySelector('.audit__list');
  var toggle = box.querySelector('.audit__toggle');
  var count = box.querySelector('.audit__count');
  box.hidden = false;

  var prev = '0'.repeat(64);
  var total = 0;
  var chain = Promise.resolve();

  function hex(buf) {
    return Array.prototype.map.call(new Uint8Array(buf), function (b) {
      return ('0' + b.toString(16)).slice(-2);
    }).join('');
  }

  function sha256(text) {
    if (window.crypto && crypto.subtle && window.TextEncoder) {
      return crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)).then(hex);
    }
    var h = 2166136261;
    for (var i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
    return Promise.resolve(('00000000' + (h >>> 0).toString(16)).slice(-8).repeat(8));
  }

  function stamp() {
    var d = new Date();
    return [d.getHours(), d.getMinutes(), d.getSeconds()]
      .map(function (n) { return ('0' + n).slice(-2); }).join(':');
  }

  function typeInto(el, text) {
    if (VAH.reducedMotion || panel.hidden) { el.textContent = text; return; }
    var i = 0;
    (function step() {
      i += 2;
      el.textContent = text.slice(0, i);
      if (i < text.length) requestAnimationFrame(step);
    })();
  }

  function render(entry) {
    var li = document.createElement('li');
    li.className = 'audit__item';
    var num = document.createElement('span');
    num.className = 'audit__num';
    num.textContent = '#' + entry.n + '  ';
    var time = document.createElement('span');
    time.className = 'audit__time';
    time.textContent = entry.time + '  ';
    var msg = document.createElement('span');
    msg.className = 'audit__msg' + (entry.denied ? ' is-denied' : '');
    var hash = document.createElement('span');
    hash.className = 'audit__hash';
    hash.innerHTML = 'hash <b>' + entry.hash.slice(0, 12) + '</b> ← ' + entry.prev.slice(0, 8);
    li.append(num, time, msg, hash);
    list.appendChild(li);
    typeInto(msg, entry.msg);
    count.textContent = String(total);
    list.scrollTop = list.scrollHeight;
  }

  VAH.audit = function (message, opts) {
    opts = opts || {};
    chain = chain.then(function () {
      var time = stamp();
      return sha256(prev + '|' + time + '|' + message).then(function (h) {
        total += 1;
        var entry = { n: total, time: time, msg: message, hash: h, prev: prev, denied: !!opts.denied };
        prev = h;
        render(entry);
      });
    });
  };

  function setOpen(open) {
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    if (open) list.scrollTop = list.scrollHeight;
  }
  toggle.addEventListener('click', function () { setOpen(panel.hidden); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !panel.hidden) { setOpen(false); toggle.focus(); }
  });

  VAH.audit('session opened as guest, role: viewer');

  if ('IntersectionObserver' in window) {
    var seen = {};
    var io = new IntersectionObserver(function (items) {
      items.forEach(function (it) {
        var id = it.target.id;
        if (it.isIntersecting && !seen[id]) {
          seen[id] = true;
          VAH.audit('viewer accessed /' + id);
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    document.querySelectorAll('main .section[id]').forEach(function (s) { io.observe(s); });
  }
})();
