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
- `public/assets/` — photos, logos and videos served at `/assets/...`
- `app/globals.css` — Tailwind v4 theme, design tokens and custom utilities

# Kharis Web (homepage revamp)

Cinematic homepage inspired by [vivechurch.org](https://vivechurch.org), built with **Next.js + TypeScript + Tailwind**.

## Run locally

```bash
export PATH="$HOME/.local/node/bin:$PATH"
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Notes

- YouTube hero video is selected via the Data API (key in `.env.local`, not committed).
- Photos live in `public/images/`.
- Branch links currently point at existing `kharis.org` location pages.