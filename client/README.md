# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Public site design notes

The public site uses a scroll-driven parallax design:

- `src/styles/tokens.css` — palette (navy / blue / gold, warm-paper light mode),
  type scale, spacing, and device-level token overrides
- `src/styles/global.css` — shared classes: `.container`, `.section`, `.eyebrow`,
  `.h2`, `.lede`, `.btn`, `.tags`, `.layer`
- `src/styles/devices.css` — foldable and dual-screen rules (`[data-split]`,
  `[data-sticky]`), loaded last so they win on those devices
- `src/hooks/useParallax.js` — drives `[data-speed]` layers and `[data-progress]`
  sections; rescans the DOM as API data arrives; disabled under
  `prefers-reduced-motion`
