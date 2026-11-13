/* Tinkerbits polish layer: logo-fill scroll progress, adaptive nav colour, cheaper lens, modern icons, reveal-on-scroll.
   No scroll hijacking. */
(function () {
  var doc = document.documentElement;
  var header = document.querySelector('.site-header');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cores = navigator.hardwareConcurrency || 8;
  var mem = navigator.deviceMemory || 8;
  var ua = navigator.userAgent; var lite = !(/Chrome\/|Chromium\/|Edg\//.test(ua) && !/CriOS|FxiOS|iPhone|iPad/.test(ua));

  // Browser theme-color follows the graphite dark palette.
  var meta = document.querySelector('meta[name="theme-color"]');
  function syncMeta() { if (meta) meta.setAttribute('content', doc.dataset.theme === 'dark' ? '#0e1013' : '#fafbff'); }
  new MutationObserver(function () { syncMeta(); probe(true); }).observe(doc, { attributes: true, attributeFilter: ['data-theme'] });
  syncMeta();

  // Lens: one displacement pass (the old three-pass chromatic filter was the costly, blurry part).
  // Low-power devices and reduced-motion users get a plain light blur instead.
  if (lite) {
    doc.classList.add('tb-lite');
  } else {
    var src = document.querySelector('#tb-liquid feImage');
    if (src) {
      var ns = 'http://www.w3.org/2000/svg';
      var svg = document.createElementNS(ns, 'svg');
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('width', '0');
      svg.setAttribute('height', '0');
      svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
      var f = document.createElementNS(ns, 'filter');
      f.setAttribute('id', 'tb-lens');
      ['x', 'y'].forEach(function (a) { f.setAttribute(a, '-5%'); });
      ['width', 'height'].forEach(function (a) { f.setAttribute(a, '110%'); });
      f.setAttribute('color-interpolation-filters', 'sRGB');
      var im = src.cloneNode(true);
      im.setAttribute('result', 'map');
      var dm = document.createElementNS(ns, 'feDisplacementMap');
      dm.setAttribute('in', 'SourceGraphic');
      dm.setAttribute('in2', 'map');
      dm.setAttribute('scale', '30');
      dm.setAttribute('xChannelSelector', 'R');
      dm.setAttribute('yChannelSelector', 'G');
      f.appendChild(im);
      f.appendChild(dm);
      var defs = document.createElementNS(ns, 'defs');
      defs.appendChild(f);
      svg.appendChild(defs);
      document.body.appendChild(svg);
      doc.classList.add('tb-lens-ready');
    }
  }

  // Logo wordmark: wrap the text so CSS can fill it with colour as a scroll-progress indicator.
  var brand = header && header.querySelector('.brand');
  if (brand) {
    for (var i = 0; i < brand.childNodes.length; i++) {
      var n = brand.childNodes[i];
      if (n.nodeType === 3 && n.textContent.trim() === 'tinkerbits') {
        var w = document.createElement('span');
        w.className = 'tb-word';
        w.textContent = n.textContent.trim();
        brand.replaceChild(w, n);
        break;
      }
    }
  }

  // Adaptive navbar colour in light theme: sample what is behind the bar and switch to light text over dark areas.
  function lum(c) {
    var m = c.match(/[\d.]+/g); if (!m) return null;
    var a = m.length > 3 ? +m[3] : 1; if (a < 0.85) return null;
    var v = m.slice(0, 3).map(function (x) { x = x / 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); });
    return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
  }
  var lastProbe = -999;
  function probe(force) {
    if (!header) return;
    if (doc.dataset.theme === 'dark') { header.removeAttribute('data-over'); return; }
    var y = window.scrollY || doc.scrollTop;
    if (!force && Math.abs(y - lastProbe) < 10) return;
    lastProbe = y;
    var r = header.getBoundingClientRect(), py = r.top + r.height / 2, dark = 0;
    [0.15, 0.5, 0.85].forEach(function (k) {
      var els = document.elementsFromPoint(r.left + r.width * k, py), L = null;
      for (var a = 0; a < els.length && L === null; a++) {
        if (header.contains(els[a])) continue;
        for (var e = els[a]; e && e.nodeType === 1 && L === null; e = e.parentElement) L = lum(getComputedStyle(e).backgroundColor);
      }
      if (L === null) L = 1;
      if (L < 0.3) dark++;
    });
    if (dark >= 2) header.setAttribute('data-over', 'dark'); else header.removeAttribute('data-over');
  }

  // Scroll progress drives the logo fill. Only a CSS variable changes per frame.
  if (header) {
    var ticking = false, lastP = -1;
    var update = function () {
      ticking = false;
      var y = window.scrollY || doc.scrollTop;
      var max = Math.max(1, doc.scrollHeight - innerHeight);
      var p = Math.min(1, Math.max(0, y / max));
      if (Math.abs(p - lastP) > 0.002) { lastP = p; header.style.setProperty('--tb-p', p.toFixed(3)); }
      probe(false);
    };
    addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener('resize', function () { probe(true); update(); });
    update(); probe(true);
  }

  // Mobile: the three-bar brand mark is the menu button (the separate Menu button is hidden by CSS).
  var oldMenu = document.querySelector('.menu-toggle');
  if (header && brand && oldMenu) {
    var bm = document.createElement('button');
    bm.type = 'button';
    bm.className = 'brand-menu';
    bm.setAttribute('aria-controls', 'navigation');
    bm.innerHTML = '<span class="brand-mark" aria-hidden="true"><svg class="tb-lg" viewBox="0 2.5 23 31.3" width="27" height="37" aria-hidden="true" focusable="false"><g class="tb-t"><g transform="translate(0 8.83) skewY(-21)"><path transform="translate(0.00 7.86)" d="M5.28 0.09Q3.83 0.09 2.98 -0.16Q2.12 -0.4 1.73 -0.98Q1.35 -1.55 1.35 -2.53L1.36 -7.82H4.06L4.04 -2.47Q4.04 -2.06 4.35 -1.84Q4.67 -1.62 5.26 -1.62H6.48V0.09ZM0.06 -4.72V-6.2H6.48V-4.72Z"/><path transform="translate(6.99 7.86)" d="M1.48 0V-6.2H4.39V0ZM0.35 -4.72V-6.2H4.39V-4.72ZM2.67 -6.69Q1.88 -6.69 1.5 -6.98Q1.12 -7.27 1.12 -7.72Q1.12 -8.16 1.5 -8.45Q1.88 -8.74 2.66 -8.74Q3.46 -8.74 3.83 -8.45Q4.2 -8.16 4.2 -7.72Q4.2 -7.27 3.83 -6.98Q3.46 -6.69 2.67 -6.69Z"/><path transform="translate(12.48 7.86)" d="M1.06 0V-6.2H3.37V-3.54H3.24Q3.24 -4.5 3.59 -5.14Q3.95 -5.77 4.64 -6.09Q5.34 -6.4 6.34 -6.4H6.46Q7.97 -6.4 8.8 -5.7Q9.62 -5 9.62 -3.55V0H6.7V-3.6Q6.7 -4.03 6.34 -4.31Q5.98 -4.58 5.36 -4.58Q4.73 -4.58 4.35 -4.31Q3.98 -4.03 3.98 -3.58V0Z"/><path transform="translate(0.00 16.42)" d="M6.15 0 3.96 -2.9H2.97L5.87 -6.2H8.42L5.67 -3.09V-4.08L8.88 0ZM0.89 0V-8.2H3.33V0Z"/><path transform="translate(8.88 16.42)" d="M4.36 0.22Q3.42 0.22 2.7 -0.04Q1.97 -0.31 1.48 -0.77Q0.98 -1.24 0.72 -1.81Q0.46 -2.38 0.46 -2.99V-3.21Q0.46 -3.84 0.72 -4.42Q0.98 -5 1.47 -5.45Q1.96 -5.9 2.67 -6.16Q3.38 -6.42 4.28 -6.42Q5.48 -6.42 6.31 -5.97Q7.14 -5.53 7.59 -4.79Q8.03 -4.05 8.03 -3.19V-2.54H1.48V-3.64H6.62L5.77 -3.14Q5.77 -3.67 5.61 -4.04Q5.44 -4.4 5.11 -4.59Q4.78 -4.78 4.28 -4.78Q3.8 -4.78 3.44 -4.6Q3.09 -4.41 2.9 -4.04Q2.71 -3.66 2.71 -3.09Q2.71 -2.57 2.89 -2.2Q3.06 -1.82 3.42 -1.62Q3.79 -1.42 4.36 -1.42Q4.87 -1.42 5.2 -1.56Q5.53 -1.71 5.67 -1.95H7.89Q7.73 -1.33 7.26 -0.83Q6.78 -0.34 6.05 -0.06Q5.32 0.22 4.36 0.22Z"/><path transform="translate(17.31 16.42)" d="M0.89 0V-6.2H2.82V-3.5H2.79Q2.79 -4.81 3.44 -5.55Q4.1 -6.29 5.32 -6.29H5.61V-4.54H5.05Q4.23 -4.54 3.78 -4.17Q3.33 -3.8 3.33 -3.1V0Z"/><path transform="translate(0.00 24.98)" d="M4.74 0.2Q3.98 0.2 3.41 -0.11Q2.84 -0.43 2.52 -1.03Q2.2 -1.64 2.18 -2.52H2.36V0H0.74V-8.2H2.79V-3.98L2.34 -3.53Q2.37 -4.44 2.68 -5.08Q3 -5.72 3.55 -6.05Q4.11 -6.38 4.84 -6.38Q5.47 -6.38 5.97 -6.15Q6.48 -5.92 6.83 -5.5Q7.19 -5.08 7.38 -4.5Q7.57 -3.93 7.57 -3.25V-2.98Q7.57 -2.29 7.38 -1.71Q7.19 -1.13 6.82 -0.7Q6.45 -0.27 5.92 -0.03Q5.4 0.2 4.74 0.2ZM4.16 -1.48Q4.56 -1.48 4.87 -1.69Q5.18 -1.9 5.35 -2.27Q5.53 -2.64 5.53 -3.11Q5.53 -3.59 5.35 -3.95Q5.18 -4.3 4.87 -4.5Q4.57 -4.69 4.16 -4.69Q3.78 -4.69 3.46 -4.53Q3.14 -4.36 2.94 -4.03Q2.74 -3.71 2.74 -3.25V-2.86Q2.74 -2.43 2.95 -2.12Q3.17 -1.81 3.49 -1.65Q3.82 -1.48 4.16 -1.48Z"/><path transform="translate(7.95 24.98)" d="M1.03 0V-6.2H3.08V0ZM0.25 -4.72V-6.2H3.08V-4.72ZM1.87 -6.69Q1.31 -6.69 1.05 -6.98Q0.79 -7.27 0.79 -7.72Q0.79 -8.16 1.05 -8.45Q1.32 -8.74 1.86 -8.74Q2.43 -8.74 2.68 -8.45Q2.94 -8.16 2.94 -7.72Q2.94 -7.27 2.68 -6.98Q2.43 -6.69 1.87 -6.69Z"/><path transform="translate(11.79 24.98)" d="M3.69 0.09Q2.68 0.09 2.08 -0.16Q1.48 -0.4 1.21 -0.98Q0.94 -1.55 0.94 -2.53L0.95 -7.82H2.84L2.83 -2.47Q2.83 -2.06 3.05 -1.84Q3.27 -1.62 3.68 -1.62H4.54V0.09ZM0.04 -4.72V-6.2H4.54V-4.72Z"/><path transform="translate(16.69 24.98)" d="M3.2 0.2Q1.85 0.2 1.08 -0.35Q0.3 -0.91 0.25 -1.92H2.04Q2.09 -1.64 2.39 -1.44Q2.7 -1.24 3.25 -1.24Q3.64 -1.24 3.93 -1.35Q4.21 -1.47 4.21 -1.74Q4.21 -1.98 3.99 -2.13Q3.76 -2.28 3.17 -2.34L2.74 -2.38Q1.55 -2.5 0.99 -3.03Q0.43 -3.56 0.43 -4.36Q0.43 -5.04 0.76 -5.49Q1.1 -5.93 1.7 -6.15Q2.29 -6.38 3.05 -6.38Q4.3 -6.38 5.06 -5.83Q5.83 -5.29 5.87 -4.27H4.08Q4.03 -4.55 3.77 -4.74Q3.52 -4.94 3.03 -4.94Q2.68 -4.94 2.47 -4.82Q2.25 -4.69 2.25 -4.47Q2.25 -4.23 2.45 -4.12Q2.66 -4.01 3.12 -3.95L3.55 -3.91Q4.74 -3.78 5.39 -3.25Q6.03 -2.72 6.03 -1.85Q6.03 -1.21 5.69 -0.75Q5.35 -0.29 4.71 -0.04Q4.08 0.2 3.2 0.2Z"/></g></g><g class="tb-x"><rect x="-10" y="-1.35" width="20" height="2.7" transform="translate(11.5 18.15) rotate(45)"/><rect x="-10" y="-1.35" width="20" height="2.7" transform="translate(11.5 18.15) rotate(-45)"/></g></svg></span>';
    var syncBm = function () {
      bm.setAttribute('aria-expanded', oldMenu.getAttribute('aria-expanded') || 'false');
      bm.setAttribute('aria-label', bm.getAttribute('aria-expanded') === 'true' ? 'Close navigation' : 'Open navigation');
    };
    bm.addEventListener('click', function () { oldMenu.click(); });
    new MutationObserver(syncBm).observe(oldMenu, { attributes: true, attributeFilter: ['aria-expanded', 'aria-label'] });
    syncBm();
    header.insertBefore(bm, brand);
  }

  // Modern icons: swap text glyphs for one consistent stroke icon set.
  function icon(cls) { var i = document.createElement('i'); i.className = 'tb-i ' + cls; i.setAttribute('aria-hidden', 'true'); return i; }
  function iconify(root) {
  var map = { '\u2197': 'tb-i-ne', '\u2192': 'tb-i-e' };
  var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: function (t) { return /[\u2197\u2192]/.test(t.nodeValue) && !t.parentElement.closest('script,style,svg,.tb-i') ? 1 : 2; }
  });
  var nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(function (t) {
    var parts = t.nodeValue.split(/([\u2197\u2192])/), frag = document.createDocumentFragment();
    parts.forEach(function (p) {
      if (map[p]) { frag.appendChild(icon(map[p])); }
      else if (p) { frag.appendChild(document.createTextNode(p.replace(/\s+$/, function (s) { return s ? ' ' : s; }))); }
    });
    t.parentNode.replaceChild(frag, t);
  });
  }
  iconify(document.body);
  var mt = document.querySelector('.menu-toggle');
  if (mt) {
    var sp = mt.querySelector('span');
    if (sp && sp.textContent.trim() === '+') { sp.className = 'tb-menu'; sp.textContent = ''; sp.setAttribute('aria-hidden', 'true'); }
  }
  function fixVideo() {
  var vt = document.querySelector('.video-toggle');
  if (vt) {
    var fixVid = function () {
      var t = vt.textContent;
      if (!/[\u25B6\u25AE]/.test(t)) return;
      var play = t.indexOf('Play') === 0;
      var label = play ? 'Play' : 'Pause';
      vt.textContent = '';
      vt.appendChild(icon(play ? 'tb-i-play' : 'tb-i-pause'));
      vt.appendChild(document.createTextNode(label));
    };
    new MutationObserver(fixVid).observe(vt, { childList: true, characterData: true, subtree: true });
    fixVid();
  }
  var pv = document.getElementById('printer-video'), box = document.querySelector('.hero-visual');
  if (pv && box && !box.querySelector('.tb-vc')) {
    var wrap = document.createElement('div'); wrap.className = 'tb-vc'; wrap.setAttribute('role', 'group'); wrap.setAttribute('aria-label', 'Video controls');
    var b = document.createElement('button'); b.type = 'button'; b.className = 'tb-vc-btn';
    b.innerHTML = '<svg class="i-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6v12M15 6v12"/></svg><svg class="i-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10-6.5z"/></svg>';
    wrap.appendChild(b); box.appendChild(wrap);
    var sync = function () { var p = pv.paused; b.classList.toggle('is-paused', p); b.setAttribute('aria-label', p ? 'Play printer video' : 'Pause printer video'); };
    b.addEventListener('click', function () { if (pv.paused) pv.play().catch(function () {}); else pv.pause(); });
    pv.addEventListener('play', sync); pv.addEventListener('pause', sync); sync();
    var hideT, show = function () {
      wrap.classList.remove('tb-vc-hide'); clearTimeout(hideT);
      hideT = setTimeout(function () { if (wrap.contains(document.activeElement) && b.matches(':focus-visible')) return; wrap.classList.add('tb-vc-hide'); }, 1100);
    };
    box.addEventListener('pointermove', show); box.addEventListener('pointerdown', show); wrap.addEventListener('pointerenter', show);
    wrap.addEventListener('focusin', show); wrap.addEventListener('focusout', show); show();
  }
  }
  fixVideo();
  function fixDemo() {
    // Private upload concept on the quote form: file stays in the browser, nothing is sent.
    var qf = document.getElementById('quote-form');
    if (qf && !qf.querySelector('.tb-up')) {
      var wrap = document.createElement('div'); wrap.className = 'tb-up';
      wrap.innerHTML = '<label class="tb-up-l">Private file upload <span class="optional">(concept)</span><input type="file" accept=".stl,.3mf,.obj,.step,.stp" aria-describedby="tb-up-n"></label><p class="form-note" id="tb-up-n">Preview of how this will work after sign-in. Sign-in is not built yet, so the file stays in your browser and is not uploaded or saved.</p><p class="tb-up-s" role="status"></p>';
      var fl = qf.querySelector('input[name="file"]'); var host = fl ? fl.closest('label') : null;
      if (host && host.parentNode) host.parentNode.insertBefore(wrap, host.nextSibling); else qf.insertBefore(wrap, qf.querySelector('button[type="submit"]'));
      var inp = wrap.querySelector('input'), st = wrap.querySelector('.tb-up-s');
      inp.addEventListener('change', function () {
        var f = inp.files && inp.files[0];
        if (!f) { st.textContent = ''; return; }
        if (!/\.(stl|3mf|obj|step|stp)$/i.test(f.name)) { st.textContent = 'Choose an STL, 3MF, OBJ or STEP file.'; inp.value = ''; return; }
        var mb = f.size / 1048576;
        st.textContent = f.name + ' (' + (mb >= 0.1 ? mb.toFixed(1) + ' MB' : Math.max(1, Math.round(f.size / 1024)) + ' KB') + ') selected. In the real flow this would go to a private quote request. Here it stays on your device.';
      });
    }
  }
  fixDemo();
  function fixDir() {
    // Directory of public model sites. Links only: no copied model images, text or feeds. Opens in a new tab.
    var cat = document.querySelector('.catalogue');
    if (!cat || document.querySelector('.tb-dir')) return;
    var sites = [
      ['Printables', 'https://www.printables.com/', 'Free 3D models, run by Prusa Research.'],
      ['MakerWorld', 'https://makerworld.com/en', 'Models from the Bambu Lab community.'],
      ['Thingiverse', 'https://www.thingiverse.com/', 'Browse and download community 3D models.'],
      ['Cults', 'https://cults3d.com/en', 'Free and paid designs from independent creators.'],
      ['MyMiniFactory', 'https://www.myminifactory.com/', 'Free and paid designs, with the licence shown on each model.']
    ];
    var sec = document.createElement('section'); sec.className = 'wrap tb-dir'; sec.setAttribute('aria-label', 'Where to find 3D models');
    var h = document.createElement('h2'); h.textContent = 'Find a model first'; sec.appendChild(h);
    var p = document.createElement('p'); p.className = 'tb-dir-lead';
    p.textContent = 'Browse the popular model sites, download a design you like, then come back here to see how a private upload for a print quote will work.';
    sec.appendChild(p);
    var g = document.createElement('div'); g.className = 'tb-dir-grid';
    sites.forEach(function (s) {
      var a = document.createElement('article'); a.className = 'model-card tb-dir-card';
      var b = document.createElement('div'); b.className = 'model-body';
      var h3 = document.createElement('h3'); h3.textContent = s[0]; b.appendChild(h3);
      var d = document.createElement('p'); d.textContent = s[2]; b.appendChild(d);
      var l = document.createElement('a'); l.href = s[1]; l.target = '_blank'; l.rel = 'noopener noreferrer';
      l.setAttribute('aria-label', 'Open ' + s[0] + ' in a new tab'); l.textContent = 'Open ' + s[0] + ' \u2197'; b.appendChild(l);
      a.appendChild(b); g.appendChild(a);
    });
    sec.appendChild(g);
    var n = document.createElement('p'); n.className = 'tb-dir-note';
    n.textContent = 'Before asking for a paid print, check the design\u2019s licence on the site you downloaded it from. Some designs are for personal use only. These sites are separate from Tinkerbits.';
    sec.appendChild(n);
    var demo = document.createElement('p'); demo.className = 'tb-dir-note tb-dir-demo'; demo.textContent = 'Quote uploads are a preview for now: no files are uploaded or stored, and the quote service is not live yet.'; sec.appendChild(demo);
    var back = document.createElement('a'); back.className = 'text-link'; back.href = '/#quote'; back.textContent = 'See the upload preview \u2197'; sec.appendChild(back);
    cat.parentNode.insertBefore(sec, cat);
    cat.remove(); // example cards, search and filters were removed at the owner's request
  }
  fixDir();

  function reveal() {
  // Reveal on scroll: below-the-fold blocks ease in once. Content stays visible if anything fails.
  if (!reduce && 'IntersectionObserver' in window) {
    var sel = '.section-heading,.library,.material-grid>*,.material-object,.discipline-strip,.quote-layout>*,.catalogue-controls,.model-card,.catalogue-note,.footer-main>div';
    var items = Array.prototype.filter.call(document.querySelectorAll(sel), function (el) {
      return el.getBoundingClientRect().top > innerHeight * 0.92;
    });
    items.forEach(function (el, i) { el.classList.add('tb-reveal'); el.style.setProperty('--tb-d', ((i % 4) * 0.07).toFixed(2) + 's'); });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('tb-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    items.forEach(function (el) { io.observe(el); });
    setTimeout(function () { items.forEach(function (el) { if (el.getBoundingClientRect().top < innerHeight) el.classList.add('tb-in'); }); }, 2500);
  }

  }
  reveal();

  // tbRouter: client-side navigation between the two pages. Swaps <main> and <footer>, keeps the header, theme, menu and scroll listeners alive.
  // Any failure falls back to a normal page load. No animation is used to hide it.
  var routeOf = function (u) { return (u.pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '').replace(/\/+$/, '')) || '/'; };
  var shown = routeOf(location), busy = false;
  var canon = function (u) { return routeOf(u) + u.search + u.hash; };
  if (location.pathname !== routeOf(location)) history.replaceState(history.state, '', canon(location));
  var closeMenu = function () { if (oldMenu && oldMenu.getAttribute('aria-expanded') === 'true') oldMenu.click(); };
  var toHash = function (h, smooth) {
    if (!h || h === '#') { scrollTo({ top: 0, behavior: smooth && !reduce ? 'smooth' : 'auto' }); return; }
    var t = document.getElementById(decodeURIComponent(h.slice(1)));
    if (t) t.scrollIntoView({ behavior: smooth && !reduce ? 'smooth' : 'auto', block: 'start' });
  };
  function swapTo(u, push, y) {
    if (busy) return;
    if (routeOf(u) === shown) {
      if (push && canon(u) !== location.pathname + location.search + location.hash) { history.replaceState({ tb: 1, y: scrollY }, ''); history.pushState({ tb: 1 }, '', canon(u)); }
      if (y != null) scrollTo(0, y); else toHash(u.hash, true);
      closeMenu();
      return;
    }
    busy = true;
    if (push) history.replaceState({ tb: 1, y: scrollY }, '');
    fetch(routeOf(u) + u.search, { credentials: 'same-origin' }).then(function (r) { if (!r.ok) throw new Error('http'); return r.text(); }).then(function (html) {
      var d = new DOMParser().parseFromString(html, 'text/html');
      var nm = d.querySelector('main'), om = document.querySelector('main');
      if (!nm || !om) throw new Error('shape');
      var nf = d.querySelector('footer'), oldFoot = document.querySelector('footer');
      var code = Array.prototype.filter.call(d.body.querySelectorAll('script:not([src])'), function (s) { return !/menu-toggle|theme-toggle/.test(s.textContent); }).map(function (s) { return s.textContent; }).join('\n;\n');
      if (push) history.pushState({ tb: 1 }, '', canon(u));
      document.title = d.title;
      om.replaceWith(document.adoptNode(nm));
      if (nf && oldFoot) oldFoot.replaceWith(document.adoptNode(nf));
      shown = routeOf(u);
      closeMenu();
      var sc = document.createElement('script'); sc.textContent = '{\n' + code + '\n}'; document.body.appendChild(sc); sc.remove();
      iconify(document.body); fixVideo(); fixDemo(); fixDir(); reveal();
      var qf = document.getElementById('quote-form');
      if (qf) {
        var mdl = new URLSearchParams(location.search).get('model');
        if (mdl && qf.elements.details) qf.elements.details.value = 'Example project: ' + mdl;
        qf.addEventListener('submit', function (e) { e.preventDefault(); var st = document.querySelector('.form-status'); if (st) st.textContent = 'Demo only. Nothing was sent, uploaded or saved.'; });
      }
      var yr = document.getElementById('year'); if (yr) yr.textContent = new Date().getFullYear();
      var land = function () { if (y != null) scrollTo({ top: y, behavior: 'instant' }); else if (u.hash && u.hash !== '#') { var t = document.getElementById(decodeURIComponent(u.hash.slice(1))); if (t) t.scrollIntoView({ behavior: 'instant', block: 'start' }); } else scrollTo({ top: 0, behavior: 'instant' }); };
      land(); requestAnimationFrame(land); setTimeout(land, 250);
      probe(true);
      busy = false;
    }).catch(function () { busy = false; location.href = u.href; });
  }
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  document.addEventListener('click', function (e) {
    if (oldMenu && oldMenu.getAttribute('aria-expanded') === 'true' && e.target.closest && !e.target.closest('#navigation, .brand-menu, .menu-toggle')) closeMenu();
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
    var u = new URL(a.href, location.href);
    if (u.origin !== location.origin) return;
    var r = routeOf(u);
    if (r !== '/' && r !== '/models') return;
    e.preventDefault();
    swapTo(u, true, null);
  });
  addEventListener('popstate', function (e) {
    var u = new URL(location.href);
    swapTo(u, false, e.state && e.state.y != null ? e.state.y : null);
  });
})();
