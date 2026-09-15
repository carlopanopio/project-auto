# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Parallax redesign prototype

A static, framework-free prototype of a parallax redesign lives in
`public/prototype/` and is served as-is at `/prototype/index.html` in both
`vite dev` and the production build.

- `index.html` — page markup with the real site content
- `parallax.css` — the site's own palette (navy / blue / gold, warm-paper light
  mode via `prefers-color-scheme` or `data-theme`) plus the responsive layer:
  mobile menu, fold-cover widths (≤360px), landscape phones, tablets, large
  displays, and viewport-segment rules for book-fold and flip devices
- `parallax.js` — scroll-driven layers (`data-speed`), progress-driven sections
  (`data-progress` → `--p`), hero pointer tilt, mobile menu, theme toggle; all
  motion is disabled under `prefers-reduced-motion`

Preview: https://claude.ai/artifact/2NKGvrKg4hnfn9gYuo4AMJ

Scripts and styles are external files on purpose: the production CSP only
allows `script-src 'self'`.
