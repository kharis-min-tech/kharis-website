# Kharis Website

npm-workspaces monorepo holding the two Kharis sites. They share a Supabase
project and nothing else — **no shared components, tokens, fonts or CSS.** Each
app owns its own design system and deploys independently.

| App | Workspace | Served at | Worker | Design system |
| --- | --- | --- | --- | --- |
| `apps/main` | `@kharis/main` | `kharis.org` | `kharis-main` | Hand-rolled tokens (`--bg`/`--fg`/`--purple`) |
| `apps/kp2` | `@kharis/kp2` | `kharis.org/kp2` | `kharis-kp2` | Material Design 3 tokens + `tw-animate-css` |

## Why they are separate

The two sites follow different brand identities and are built by different
sub-teams. Keeping them as separate workspaces with separate Workers means
either team can change design, dependencies or deploy cadence without
coordinating with the other.

Do not add a shared UI or token package. If something genuinely needs sharing,
it belongs in `packages/` and must be data or types, never presentation.

## Run

```bash
npm install          # once, from the repo root — installs both workspaces

npm run dev:main     # kharis.org            → localhost:3000
npm run dev:kp2      # kharis.org/kp2        → localhost:3000/kp2
```

Each app has its own `.env.example`. Copy it to `.env.local` for builds, and
fill `.dev.vars` for the Workers runtime (`npm run preview -w @kharis/<app>`).

## Deploy

Both apps deploy to Cloudflare Workers via OpenNext:

```bash
npm run deploy:main
npm run deploy:kp2
```

Routes are **commented out** in each `wrangler.jsonc` until cutover. Until you
uncomment them, deploys publish to `*.workers.dev` and leave production alone.

`apps/kp2` sets `basePath: "/kp2"`. On the Cloudflare side the more specific
route (`kharis.org/kp2*`) takes precedence over `kharis.org/*`, so the two
Workers can share the zone.

## Shared

- `supabase/` — migrations for the Supabase project both apps write to.
  Testimonies are scoped by a `workspace` discriminator (`kharis` | `kp2`).
