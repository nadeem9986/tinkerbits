/* Tinkerbits polish layer: logo-fill scroll progress, adaptive nav colour, cheaper lens, modern icons, reveal-on-scroll.
   No scroll hijacking. */
(function () {
  var doc = document.documentElement;
  var header = document.querySelector('.site-header');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cores = navigator.hardwareConcurrency || 8;
  var mem = navigator.deviceMemory || 8;
  var lite = reduce || cores <= 4 || mem <= 2;

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
      dm.setAttribute('scale', '16');
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

  // Modern icons: swap text glyphs for one consistent stroke icon set.
  function icon(cls) { var i = document.createElement('i'); i.className = 'tb-i ' + cls; i.setAttribute('aria-hidden', 'true'); return i; }
  var map = { '\u2197': 'tb-i-ne', '\u2192': 'tb-i-e' };
  var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
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
  var mt = document.querySelector('.menu-toggle');
  if (mt) {
    var sp = mt.querySelector('span');
    if (sp && sp.textContent.trim() === '+') { sp.className = 'tb-menu'; sp.textContent = ''; sp.setAttribute('aria-hidden', 'true'); }
  }
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
})();
