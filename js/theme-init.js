// Theme init (runs immediately, before first paint)
(function () {
  var t = localStorage.getItem('sx-theme');
  if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
  else if (matchMedia('(prefers-color-scheme: light)').matches) document.documentElement.setAttribute('data-theme', 'light');
})();
