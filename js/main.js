// Theme — sync, no flash
(function () {
  var KEY = 'sx-theme';
  function getPreferred() {
    var saved = localStorage.getItem(KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  // Screenshots ship in two themes. <picture> with prefers-color-scheme would be wrong here:
  // the site starts at data-theme="dark" and has its own toggle, so the OS preference is not
  // the answer. Swapping src on the element the theme change already touches keeps it to one
  // download, and no-JS keeps the dark frame the markup ships with.
  function syncShots(theme) {
    var shots = document.querySelectorAll('img[data-src-dark][data-src-light]');
    for (var i = 0; i < shots.length; i++) {
      var want = shots[i].getAttribute(theme === 'light' ? 'data-src-light' : 'data-src-dark');
      if (want && shots[i].getAttribute('src') !== want) shots[i].setAttribute('src', want);
    }
  }
  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(KEY, theme);
    syncShots(theme);
  }
  apply(getPreferred());
  var btn = document.getElementById('theme-toggle');
  if (btn) btn.addEventListener('click', function () {
    var cur = document.documentElement.getAttribute('data-theme');
    apply(cur === 'dark' ? 'light' : 'dark');
  });
})();

// Main menu — grouped dropdown panel. Toggle .is-open + aria-expanded; close on outside
// click, Escape (restoring focus), a menu-link click, or crossing the desktop breakpoint.
(function () {
  var menu = document.getElementById('site-menu');
  if (!menu) return;
  var trigger = document.getElementById('menu-trigger');
  var langDd = document.getElementById('lang-dd');

  function close() {
    menu.classList.remove('is-open');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  }

  if (trigger) {
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = menu.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', String(open));
      // single-open: don't let the panel overlap the language dropdown
      if (open && langDd) {
        var lm = langDd.querySelector('.lang-dd__menu');
        var lb = langDd.querySelector('.lang-dd__btn');
        if (lm) lm.classList.remove('is-open');
        if (lb) lb.setAttribute('aria-expanded', 'false');
      }
    });
  }

  document.addEventListener('click', function (e) {
    if (menu.classList.contains('is-open') && !menu.contains(e.target)) close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      close();
      if (trigger) trigger.focus();
    }
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('.menu__link')) close();
  });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', close);
})();

// Language dropdown
(function () {
  var d = document.getElementById('lang-dd');
  if (!d) return;
  var b = d.querySelector('.lang-dd__btn');
  var m = d.querySelector('.lang-dd__menu');
  b.addEventListener('click', function () {
    var o = m.classList.toggle('is-open');
    b.setAttribute('aria-expanded', String(o));
  });
  document.addEventListener('click', function (e) {
    if (!d.contains(e.target)) {
      m.classList.remove('is-open');
      b.setAttribute('aria-expanded', 'false');
    }
  });
})();

// Favicon color cycling — rotate the 3 cube face colors
(function () {
  var symbol = document.getElementById('i-brand-spintax');
  var link = document.querySelector('link[rel="icon"]');
  if (!symbol || !link) return;
  var colors = ['#d6af3c', '#00abf3', '#a91455'];
  var template = symbol.innerHTML;
  var step = 0;
  setInterval(function () {
    step = (step + 1) % 3;
    var svg = template;
    svg = svg.replace('#d6af3c', '%%0%%').replace('#00abf3', '%%1%%').replace('#a91455', '%%2%%');
    svg = svg.replace('%%0%%', colors[(0 + step) % 3]).replace('%%1%%', colors[(1 + step) % 3]).replace('%%2%%', colors[(2 + step) % 3]);
    link.href = 'data:image/svg+xml,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 250" fill="none">' + svg + '</svg>'
    );
  }, 2000);
})();

// Copy-to-clipboard buttons (e.g. /examples/): copy a source element's text and
// flash the button green for 3s — no toast (matches the site's copy-feedback pattern).
(function () {
  document.querySelectorAll('.copy-btn[data-copy-src]').forEach(function (btn) {
    var label = btn.querySelector('.copy-btn__label');
    var original = label ? label.textContent : '';
    btn.addEventListener('click', function () {
      var src = document.getElementById(btn.getAttribute('data-copy-src'));
      if (!src || !navigator.clipboard) return;
      var text = src.value != null ? src.value : src.textContent;
      navigator.clipboard.writeText(text).then(function () {
        btn.classList.add('is-copied');
        if (label) label.textContent = btn.getAttribute('data-copied') || original;
        setTimeout(function () {
          btn.classList.remove('is-copied');
          if (label) label.textContent = original;
        }, 3000);
      });
    });
  });
})();
