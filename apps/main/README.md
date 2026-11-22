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
- Photos are served from Cloudflare (`https://images.kharis.org/`). Originals live in `media-originals/`, not `public/`, so they are not deployed as static assets. See the repo root `AGENTS.md`.
- Branch links currently point at existing `kharis.org` location pages.
