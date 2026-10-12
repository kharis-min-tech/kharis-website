# Kharis Content Studio

Password-protected admin for the shared Supabase project. It is its own workspace and its own Cloudflare Worker, served on the subdomain **content.kharis.org**.

| App | Host | How it is mounted |
| --- | --- | --- |
| `apps/main` | `kharis.org` | Apex domain, no `basePath` |
| `apps/kp2` | `kharis.org/kp2` | Path prefix via `basePath: "/kp2"` |
| `apps/content` | `content.kharis.org` | Subdomain. No `basePath` — the hostname is the whole app |

## Run

From the repo root:

```bash
npm install
npm run dev:content
```

Opens at http://localhost:3002. Copy `.env.example` to `.env.local` and fill in the Supabase publishable key (same project as the other apps) and, for venue search, `GOOGLE_MAPS_API_KEY`.

Sign-in is email and password against Supabase Auth. Unsigned visitors only see the sign-in card.

## Deploy

```bash
npm run deploy:content
```

The production route in `wrangler.jsonc` stays commented until cutover, same as the other apps. Uncomment it to attach the worker to `content.kharis.org/*` on the `kharis.org` zone. Until then, deploys publish to `*.workers.dev` only.
