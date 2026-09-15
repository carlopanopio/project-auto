import { useEffect } from 'react';

/**
 * Scroll-driven parallax for the public site.
 *
 * - `[data-speed]`     translates by (distance of its anchor from the viewport
 *                      centre × speed). Positive lags the scroll (background),
 *                      negative leads it (foreground). The anchor is the nearest
 *                      `[data-anchor]` ancestor, else the parent element.
 * - `[data-progress]`  receives `--p` (0 → 1) as it crosses the viewport.
 *
 * The DOM is rescanned when sections re-render (API data arriving, tab and
 * filter changes), and everything is disabled under prefers-reduced-motion.
 */
export function useParallax() {
  useEffect(() => {
    const root = document.documentElement;

    // Enable the theme transition only after first paint (no flash on load)
    const readyFrame = requestAnimationFrame(() =>
      requestAnimationFrame(() => root.classList.add('theme-ready'))
    );

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.classList.add('no-motion');
      return () => {
        cancelAnimationFrame(readyFrame);
        root.classList.remove('no-motion');
      };
    }

    let groups = []; // [{ anchor, items: [{ el, speed }], active }]
    let tracks = []; // [{ el, active }]
    const records = new Map();
    let queued = false;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const rec = records.get(entry.target);
        if (rec) rec.active = entry.isIntersecting;
      });
      request();
    }, { rootMargin: '25% 0px 25% 0px' });

    function request() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    }

    function update() {
      queued = false;
      const vh = window.innerHeight;
      const half = vh / 2;

      groups.forEach((g) => {
        if (!g.active) return;
        const r = g.anchor.getBoundingClientRect();
        const offset = r.top + r.height / 2 - half;
        g.items.forEach((it) => {
          it.el.style.transform = 'translate3d(0,' + (offset * it.speed).toFixed(1) + 'px,0)';
        });
      });

      tracks.forEach((t) => {
        if (!t.active) return;
        const r = t.el.getBoundingClientRect();
        const p = (vh - r.top) / (r.height + vh);
        t.el.style.setProperty('--p', Math.min(1, Math.max(0, p)).toFixed(4));
      });
    }

    function scan() {
      io.disconnect();
      records.clear();

      const byAnchor = new Map();
      document.querySelectorAll('[data-speed]').forEach((el) => {
        const anchor = el.closest('[data-anchor]') || el.parentElement;
        if (!anchor) return;
        if (!byAnchor.has(anchor)) byAnchor.set(anchor, []);
        byAnchor.get(anchor).push({ el, speed: parseFloat(el.dataset.speed) || 0 });
      });
      groups = Array.from(byAnchor, ([anchor, items]) => {
        const rec = { anchor, items, active: false };
        records.set(anchor, rec);
        io.observe(anchor);
        return rec;
      });

      tracks = Array.from(document.querySelectorAll('[data-progress]'), (el) => {
        const rec = { el, active: false };
        records.set(el, rec);
        io.observe(el);
        return rec;
      });

      request();
    }

    let scanTimer = 0;
    const mo = new MutationObserver(() => {
      clearTimeout(scanTimer);
      scanTimer = setTimeout(scan, 60);
    });
    mo.observe(document.querySelector('main') || document.body, { childList: true, subtree: true });

    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    scan();

    return () => {
      cancelAnimationFrame(readyFrame);
      clearTimeout(scanTimer);
      mo.disconnect();
      io.disconnect();
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
    };
  }, []);
}
