/* Tinkerbits polish layer: scroll response, reveal-on-scroll, theme-color sync. No scroll hijacking. */
(function () {
  var doc = document.documentElement;
  var header = document.querySelector('.site-header');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Keep the browser theme-color in step with the graphite dark palette.
  var meta = document.querySelector('meta[name="theme-color"]');
  function syncMeta() { if (meta) meta.setAttribute('content', doc.dataset.theme === 'dark' ? '#0e1013' : '#fafbff'); }
  new MutationObserver(syncMeta).observe(doc, { attributes: true, attributeFilter: ['data-theme'] });
  syncMeta();

  // Navbar: condenses slightly after a short scroll and shows a reading-progress hairline.
  if (header) {
    var bar = document.createElement('i');
    bar.className = 'tb-progress';
    bar.setAttribute('aria-hidden', 'true');
    header.appendChild(bar);
    var ticking = false;
    var update = function () {
      ticking = false;
      var y = window.scrollY || doc.scrollTop;
      var max = Math.max(1, doc.scrollHeight - innerHeight);
      header.classList.toggle('is-scrolled', y > 24);
      header.style.setProperty('--tb-p', Math.min(1, y / max).toFixed(4));
    };
    addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener('resize', update);
    update();
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
