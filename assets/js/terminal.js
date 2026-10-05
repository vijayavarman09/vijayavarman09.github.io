/* Terminal */
(function () {
  var VAH = window.VAH || {};
  var dlg = document.getElementById('terminal');
  var trigger = document.getElementById('terminal-trigger');
  if (!dlg || typeof dlg.showModal !== 'function') return;

  var out = dlg.querySelector('.terminal__out');
  var form = dlg.querySelector('.terminal__form');
  var input = dlg.querySelector('.terminal__input');
  var closeBtn = dlg.querySelector('.terminal__close');
  var history = [], hIndex = 0, booted = false, lastFocus = null;

  var SECTIONS = ['about', 'experience', 'projects', 'certifications', 'skills', 'publication', 'competitions'];
  var EMAIL = 'vijayavarmanah@gmail.com';

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function print(htmlLine, cls) {
    var div = document.createElement('div');
    if (cls) div.className = cls;
    div.innerHTML = htmlLine;
    out.appendChild(div);
    out.scrollTop = out.scrollHeight;
  }
  function textOf(sel) {
    return Array.prototype.map.call(document.querySelectorAll(sel), function (el) {
      return el.firstChild ? el.firstChild.textContent.trim() : el.textContent.trim();
    });
  }

  var COMMANDS = {
    help: function () {
      print([
        '<span class="t-accent">available commands</span>',
        '  whoami, id        who you are in this session',
        '  ls                list sections',
        '  cd &lt;section&gt;      jump to a section',
        '  cat about         short bio',
        '  cases             list project case files',
        '  certs             list certifications',
        '  resume            open the resume (PDF)',
        '  contact           how to reach Vijayavarman',
        '  shift night|day   change theme',
        '  history, date, echo, clear, exit'
      ].join('\n'));
    },
    whoami: function () { print('guest'); },
    id: function () { print('uid=1001(guest) gid=1001(viewers) groups=1001(viewers)'); },
    ls: function () {
      print(SECTIONS.map(function (s) { return '<span class="t-accent">' + s + '/</span>'; }).join('  ') + '  resume.pdf');
    },
    cd: function (args) {
      var target = (args[0] || '').replace(/^[~/.]+|\/+$/g, '');
      if (!target || target === '~') { print('<span class="t-muted">already home.</span>'); return; }
      if (SECTIONS.indexOf(target) === -1) { print('cd: no such section: ' + esc(target), 't-err'); return; }
      print('<span class="t-muted">moving to /' + target + '…</span>');
      setTimeout(function () {
        dlg.close();
        document.getElementById(target).scrollIntoView({ behavior: VAH.reducedMotion ? 'auto' : 'smooth' });
      }, 250);
    },
    cat: function (args) {
      var f = (args[0] || '').replace(/^\/+/, '');
      if (f === 'about' || f === 'about/') {
        [
          ['name', 'Vijayavarman'],
          ['education', 'MS Cybersecurity, RIT'],
          ['focus', 'identity governance, privileged access, blue team operations'],
          ['next', 'INE Certified Cloud Associate (ICCA)'],
          ['status', 'open to full-time IAM, PAM, and SOC roles']
        ].forEach(function (r) {
          print('<span class="t-row"><span class="t-accent">' + r[0] + '</span><span>' + esc(r[1]) + '</span></span>');
        });
      } else if (f === 'resume.pdf' || f === 'resume') {
        COMMANDS.resume();
      } else if (!f) {
        print('cat: missing file. try: cat about', 't-err');
      } else {
        print('cat: ' + esc(f) + ': permission denied (role: viewer)', 't-err');
      }
    },
    cases: function () {
      document.querySelectorAll('.case').forEach(function (c) {
        var meta = Array.prototype.map.call(c.querySelectorAll('.case__meta dd'), function (d) {
          return d.textContent;
        }).join(' · ');
        print('<span class="t-row"><span class="t-accent">' + c.id + '</span><span>' +
          esc(c.querySelector('.case__title').textContent) +
          '<span class="t-sub">' + esc(meta) + '</span></span></span>', 't-gap');
      });
    },
    certs: function () {
      textOf('.cred__name').forEach(function (n) { print('<span class="t-accent">●</span> ' + esc(n)); });
    },
    resume: function () {
      print('<span class="t-muted">opening resume.pdf…</span>');
      window.open('Vijayavarman-Resume.pdf', '_blank', 'noopener');
    },
    contact: function () {
      print('email     <a href="mailto:' + EMAIL + '">' + EMAIL + '</a>\nlinkedin  <a href="https://www.linkedin.com/in/vijayavarmanah/" target="_blank" rel="noopener noreferrer">linkedin.com/in/vijayavarmanah</a>');
    },
    hire: function () {
      print('<span class="t-accent">excellent decision.</span> opening your email client…');
      window.location.href = 'mailto:' + EMAIL + '?subject=Let%27s%20talk';
    },
    shift: function (args) {
      var t = args[0];
      if (VAH.setShift && VAH.setShift(t)) print('shift set to ' + t);
      else print('usage: shift night|day', 't-err');
    },
    sudo: function () {
      print('guest is not in the sudoers file. This incident will be reported.', 't-err');
      if (VAH.audit) VAH.audit('sudo attempt by guest denied', { denied: true });
      return true;
    },
    su: function () {
      print('su: authentication failure', 't-err');
      if (VAH.audit) VAH.audit('su attempt by guest denied', { denied: true });
      return true;
    },
    history: function () {
      history.forEach(function (h, i) { print('  ' + (i + 1) + '  ' + esc(h)); });
    },
    date: function () { print(new Date().toString()); },
    echo: function (args) { print(esc(args.join(' '))); },
    clear: function () { out.innerHTML = ''; },
    exit: function () { dlg.close(); }
  };

  function run(line) {
    var parts = line.trim().split(/\s+/);
    var cmd = (parts.shift() || '').toLowerCase();
    print('<span class="t-accent">guest ~ $</span> <span class="t-cmd">' + esc(line) + '</span>');
    if (!cmd) return;
    history.push(line);
    hIndex = history.length;
    var fn = COMMANDS[cmd];
    var loggedSeparately = false;
    if (fn) loggedSeparately = fn(parts) === true;
    else print('command not found: ' + esc(cmd) + '. type <span class="t-accent">help</span>', 't-err');
    if (!loggedSeparately && VAH.audit) VAH.audit('terminal: ' + line.trim().slice(0, 40));
  }

  function open() {
    lastFocus = document.activeElement;
    dlg.showModal();
    if (!booted) {
      booted = true;
      print('<span class="t-muted">vijayavarman portfolio shell · read-only session</span>');
      print('<span class="t-muted">every command is written to the audit log. type </span><span class="t-accent">help</span>');
      if (VAH.audit) VAH.audit('terminal session opened');
    }
    input.focus();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = input.value;
    input.value = '';
    run(v);
  });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowUp' && hIndex > 0) { hIndex--; input.value = history[hIndex]; e.preventDefault(); }
    if (e.key === 'ArrowDown') {
      if (hIndex < history.length - 1) { hIndex++; input.value = history[hIndex]; }
      else { hIndex = history.length; input.value = ''; }
      e.preventDefault();
    }
  });
  closeBtn.addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('close', function () { if (lastFocus && lastFocus.focus) lastFocus.focus(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });

  if (trigger) { trigger.hidden = false; trigger.addEventListener('click', open); }

  document.addEventListener('keydown', function (e) {
    if (e.key !== '`' || dlg.open) return;
    var t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    e.preventDefault();
    open();
  });

  try {
    console.log('%cLooking under the hood?', 'color:#FFB000;font:600 14px monospace');
    console.log('%cPress ` (backtick) on the page to open the terminal.', 'color:#9C9079;font:12px monospace');
  } catch (e) {}
})();
