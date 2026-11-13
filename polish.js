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
    bm.innerHTML = '<span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>';
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
    // Popular models feed: renders only real entries from /trending.json. No file, empty file or bad data shows nothing.
    var grid = document.getElementById('models-grid');
    if (grid && !document.querySelector('.tb-feed')) {
      fetch('/trending.json', { cache: 'no-cache' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
        if (!d || !Array.isArray(d.items) || !d.items.length || document.querySelector('.tb-feed')) return;
        var sec = document.createElement('section'); sec.className = 'wrap tb-feed'; sec.setAttribute('aria-label', 'Popular models');
        var h = document.createElement('h2'); h.textContent = 'Popular right now'; sec.appendChild(h);
        var p = document.createElement('p'); p.className = 'tb-feed-note';
        p.textContent = 'Listings from ' + (d.source || 'a public source') + ', shown with credit and a link to the original page. Files stay on the original site. Print eligibility depends on each design\u2019s licence.';
        sec.appendChild(p);
        var g = document.createElement('div'); g.className = 'tb-feed-grid';
        d.items.slice(0, 12).forEach(function (m) {
          if (!m || !m.title || !/^https:\/\//.test(m.url || '')) return;
          var a = document.createElement('article'); a.className = 'model-card tb-feed-card';
          if (/^https:\/\//.test(m.image || '')) { var im = document.createElement('img'); im.src = m.image; im.alt = m.title; im.loading = 'lazy'; im.referrerPolicy = 'no-referrer'; a.appendChild(im); }
          var b = document.createElement('div'); b.className = 'model-body';
          var h3 = document.createElement('h3'); h3.textContent = m.title; b.appendChild(h3);
          if (m.description) { var d2 = document.createElement('p'); d2.textContent = String(m.description).slice(0, 160); b.appendChild(d2); }
          var meta = document.createElement('span'); meta.textContent = [m.creator ? 'by ' + m.creator : '', m.license ? 'Licence: ' + m.license : 'Licence: check on source'].filter(Boolean).join(' \u00B7 '); b.appendChild(meta);
          var l = document.createElement('a'); l.href = m.url; l.target = '_blank'; l.rel = 'noopener noreferrer'; l.textContent = 'View original \u2197'; b.appendChild(l);
          if (m.print_ok === true) { var q = document.createElement('a'); q.href = '/?model=' + encodeURIComponent(m.title) + '#quote'; q.textContent = 'Discuss this print \u2197'; b.appendChild(q); }
          a.appendChild(b); g.appendChild(a);
        });
        if (!g.children.length) return;
        sec.appendChild(g);
        var anchor = document.querySelector('.catalogue'); if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(sec, anchor);
      }).catch(function () {});
    }
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
      iconify(document.body); fixVideo(); fixDemo(); reveal();
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
