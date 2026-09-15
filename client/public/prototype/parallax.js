/* AutomationHub parallax prototype — scroll-driven layers, progress-driven
   sections, pointer tilt on the hero stack, and a theme toggle. */
(function () {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Theme toggle (explicit choice stamps data-theme; system otherwise) ── */
  try {
    const stored = localStorage.getItem('ah_theme');
    if (stored === 'light' || stored === 'dark') root.setAttribute('data-theme', stored);
  } catch { /* storage unavailable */ }

  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const systemLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      const current = root.getAttribute('data-theme') || (systemLight ? 'light' : 'dark');
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('ah_theme', next); } catch { /* ignore */ }
    });
  }

  /* ── Nav border once the page has moved ── */
  const nav = document.querySelector('.nav');
  const setNav = () => nav && nav.classList.toggle('is-scrolled', window.scrollY > 12);
  setNav();

  /* ── Smooth in-page links ── */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });

  if (reduceMotion) {
    root.classList.add('no-motion');
    window.addEventListener('scroll', setNav, { passive: true });
    return;
  }

  /* ── Parallax layers: translate by (distance from viewport centre × speed).
        Positive speed lags behind the scroll (background); negative leads it. ── */
  const layers = Array.from(document.querySelectorAll('[data-speed]')).map((el) => ({
    el,
    speed: parseFloat(el.dataset.speed) || 0,
    anchor: el.closest('[data-anchor]') || el.parentElement,
    active: false,
  }));

  /* ── Progress sections: expose --p (0 → 1) as the section crosses the viewport ── */
  const tracks = Array.from(document.querySelectorAll('[data-progress]')).map((el) => ({
    el, active: false,
  }));

  const byAnchor = new Map();
  layers.forEach((l) => {
    if (!byAnchor.has(l.anchor)) byAnchor.set(l.anchor, []);
    byAnchor.get(l.anchor).push(l);
  });
  const byTrack = new Map(tracks.map((t) => [t.el, t]));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const ls = byAnchor.get(entry.target);
      if (ls) ls.forEach((l) => { l.active = entry.isIntersecting; });
      const t = byTrack.get(entry.target);
      if (t) t.active = entry.isIntersecting;
    });
    requestFrame();
  }, { rootMargin: '25% 0px 25% 0px' });

  byAnchor.forEach((_, anchor) => io.observe(anchor));
  tracks.forEach((t) => io.observe(t.el));

  let queued = false;
  function requestFrame() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  }

  function update() {
    queued = false;
    const vh = window.innerHeight;
    const half = vh / 2;

    byAnchor.forEach((ls, anchor) => {
      if (!ls.some((l) => l.active)) return;
      const r = anchor.getBoundingClientRect();
      const offset = r.top + r.height / 2 - half; // 0 when the anchor is centred
      ls.forEach((l) => {
        l.el.style.transform = 'translate3d(0,' + (offset * l.speed).toFixed(1) + 'px,0)';
      });
    });

    tracks.forEach((t) => {
      if (!t.active) return;
      const r = t.el.getBoundingClientRect();
      const p = (vh - r.top) / (r.height + vh);
      t.el.style.setProperty('--p', Math.min(1, Math.max(0, p)).toFixed(4));
    });

    setNav();
  }

  window.addEventListener('scroll', requestFrame, { passive: true });
  window.addEventListener('resize', requestFrame);
  update();

  /* ── Pointer tilt on the hero card stack (fine pointers only) ── */
  const hero = document.querySelector('.hero');
  const tilt = document.querySelector('.hero__tilt');
  if (hero && tilt && window.matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      const mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const my = ((e.clientY - r.top) / r.height - 0.5) * 2;
      tilt.style.setProperty('--mx', (-mx).toFixed(3));
      tilt.style.setProperty('--my', (-my).toFixed(3));
    });
    hero.addEventListener('pointerleave', () => {
      tilt.style.setProperty('--mx', '0');
      tilt.style.setProperty('--my', '0');
    });
  }
})();
