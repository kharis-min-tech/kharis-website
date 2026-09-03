# Kharis Phase 2 — Next.js

Ported from the TanStack Start build to Next.js 15 (App Router) + Tailwind CSS v4.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Structure

- `app/` — App Router pages, `layout.tsx`, `not-found.tsx`, `error.tsx`
- `components/` — shared components; `components/pages/*` hold each page's client UI
- `lib/`, `data/`, `hooks/` — data and helpers
- `assets/` — image/video metadata JSON pointing at files in `public/assets`
- `app/globals.css` — Tailwind v4 theme, design tokens and custom utilities
