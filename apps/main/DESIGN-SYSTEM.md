# Kharis Homepage — Design System Reference

Read-only audit of the homepage (`src/app/page.tsx` and its components).  
Use this to build new pages that match the site exactly.  
Stack: **Next.js 15 + React 19 + Tailwind CSS v4 + Framer Motion**.

---

## 1. COLORS

### CSS variables (`src/app/globals.css` `:root`)

| Variable | Hex / value | Tailwind token | Used for |
|---|---|---|---|
| `--bg` | `#ffffff` | `bg-bg` | Page background |
| `--bg-soft` | `#f8f6fc` | `bg-bg-soft` | Soft section / Know Us |
| `--bg-purple` | `#f1ecff` | `bg-bg-purple` | Visit / soft purple bands |
| `--fg` | `#1c1c1f` | `text-fg` | Main text, headings |
| `--fg-soft` | `#3a3a40` | `text-fg-soft` | Nav links (light header) |
| `--muted` | `#6e6e76` | `text-muted` | Body copy, captions |
| `--line` | `rgba(107, 52, 250, 0.1)` | `border-line` | Borders / dividers |
| `--purple` | `#6b34fa` | `bg-purple` / `text-purple` | Brand purple, CTAs |
| `--purple-deep` | `#5420d6` | `bg-purple-deep` / `hover:bg-purple-deep` | Purple hover |
| `--orange` | `#fd7f20` | `bg-orange` / `text-orange` | Accent / primary CTA |
| `--shadow` | `0 18px 50px rgba(40, 20, 80, 0.1)` | `shadow-[var(--shadow)]` | Soft panel shadow |
| `--shadow-lift` | `0 28px 60px rgba(107, 52, 250, 0.18)` | `shadow-[var(--shadow-lift)]` | Lifted cards / media |

Theme bridge (`@theme inline`) maps these to Tailwind as `--color-*` so utilities like `bg-purple`, `text-muted` work.

### Primary

| Color | Hex | Where |
|---|---|---|
| Brand purple | `#6B34FA` / `#6b34fa` | Logo accents, eyebrow, Vision CTA, globe, stats |
| Purple deep (hover) | `#5420D6` / `#5420d6` | Purple button hover, `.kharis-word` |

### Secondary / accent

| Color | Hex | Where |
|---|---|---|
| Orange | `#FD7F20` / `#fd7f20` | `.btn-primary`, Give accents, Explore links, branch accents |
| Orange hover | `#ff933f` | `.btn-primary:hover` |
| Soft yellow (vision dots) | `#ffe566` | Globe campus dots |
| Light purple (hero “Kharis”) | `#9b7bff` | Hero brand word fill |
| Stroke purple | `#a78bfa`, `#7c4dff` | Hero welcome stroke animation |
| Globe ocean | `#4b1fd4` → `#6b34fa` → `#3a14a8` | Vision globe gradient |
| Globe land | `#c4b0ff` → `#8b6bff` | Vision globe land |

### Neutral / background

| Color | Hex | Where |
|---|---|---|
| White | `#ffffff` / `#fff` | Page, cards, panels |
| Soft off-white | `#f8f6fc` | Know Us section |
| Soft purple | `#f1ecff` | Visit band, Vision band base |
| Vision wash | `#f7f4ff` → `#f1ecff` → `#ebe4ff` | Vision wallpaper gradient |
| Hero dark | `#0a0614` | Hero shell fallback |
| Build House overlay | `#1a0a30` at ~62% | Dark photo scrim |
| Carousel slide base | `#1a1230` | Branch slide background |
| Light grey (CTA hover) | `#f4f4f5` | Apple slide white CTA hover |
| Mission speech mark | `#e4e0ea` | Quote mark fill |

### Text colors

| Color | Hex | Where |
|---|---|---|
| Main | `#1c1c1f` | Body, headings, dark CTAs |
| Soft | `#3a3a40` | Nav on light header |
| Muted | `#6e6e76` | Supporting copy |
| White | `#fff` | Hero / dark sections / buttons on brand |

### Border colors

| Value | Where |
|---|---|
| `var(--line)` = `rgba(107, 52, 250, 0.1)` | Cards, panels, footer, stats divider |
| `rgba(107, 52, 250, 0.14)` | Vision panel border |
| `rgba(255, 255, 255, 0.45)` | Ghost button border on hero |
| `rgba(28, 28, 31, 0.18)` | Carousel pause button |

### Selection

```css
::selection {
  background: color-mix(in srgb, var(--purple) 28%, white);
}
```

---

## 2. TYPOGRAPHY

### Font family

**Plus Jakarta Sans** only (Google Font via `next/font/google`).

Exact load (`src/app/layout.tsx`):

```ts
import { Plus_Jakarta_Sans } from "next/font/google";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});
```

Applied on `<html className={sans.variable}>` and `<body className={sans.className}>`.

CSS fallback stack for headings:

```css
font-family: var(--font-display), "Plus Jakarta Sans", system-ui, sans-serif;
```

No Inter / Roboto / Arial as primary. No Quicksand.

### Weights in use

| Weight | Typical use |
|---|---|
| 500 | Occasional medium (branch chips) |
| 600 | Body default (`body { font-weight: 600 }`) |
| 700 | Secondary buttons, nav, some labels |
| 800 | Headings, eyebrows, primary CTAs, logo wordmark |
| 900 | Branch carousel city titles (`.apple-slide__title`) |

### Sizes by role

| Role | Size | Notes |
|---|---|---|
| **H1 (hero)** | `clamp(2rem, 7vw, 4.2rem)` | `.headline`, line-height `1.08`, tracking `-0.02em` |
| **Section titles (H2)** | `clamp(1.85rem, 4.2vw, 3.15rem)` | `.section-title`, weight 800, line-height `1.1` |
| **Mission quote H2** | `clamp(1.15rem, 3.2vw, 2.85rem)` | One-line quote override |
| **Card titles (H3)** | `1.75rem` → `2rem` (md) | Know Us cards |
| **Message title** | `clamp(1.25rem, 2.4vw, 1.75rem)` | Latest Messages |
| **Testimony quote** | `clamp(1.25rem, 2.6vw, 1.85rem)` | Blockquote |
| **Branch slide title** | `clamp(2.6rem, 7vw, 4.6rem)` | Uppercase, tracking `-0.03em`, LH `0.95` |
| **Vision stats** | `2.35rem` → `3rem` (md) | `font-black` |
| **Logo wordmark** | `text-lg` → `md:text-xl` | weight 800 |
| **Nav links** | `13px` | semibold, `tracking-wide` |
| **Eyebrow / labels** | `0.72rem` | uppercase, tracking `0.18em`–`0.2em`, weight 800 |
| **Body** | `base` (16px) / `md:text-lg` | often `font-semibold` |
| **Vision body** | `0.98rem` | semibold, `leading-relaxed` |
| **Small / meta** | `text-xs` / `text-sm` | footer, captions, chips |
| **Buttons** | `0.875rem` (14px) | primary/secondary/ghost; header CTA `0.8rem` |

### Line height & letter spacing

| Token | Value |
|---|---|
| Headings letter-spacing | `-0.02em` (sitewide h1–h6 + `.section-title`) |
| Hero headline line-height | `1.08` |
| Section title line-height | `1.1` |
| Body supporting | `leading-relaxed` / `leading-snug` |
| Eyebrow tracking | `0.14em`–`0.2em` uppercase |

---

## 3. SPACING & LAYOUT

### Common spacing scale (Tailwind units seen)

| Token | Approx px | Common use |
|---|---|---|
| `gap-2` / `2` | 8px | Chip gaps |
| `gap-3` / `3` | 12px | CTA groups |
| `gap-4` / `4` | 16px | Header gaps |
| `gap-5` / `5` | 20px | Card grids |
| `gap-6` / `6` | 24px | Section grids |
| `gap-8` / `8` | 32px | Nav link gap, larger grids |
| `px-5` | 20px | Page horizontal padding (mobile) |
| `md:px-8` | 32px | Page horizontal padding (desktop) |
| `py-6`–`py-10` | 24–40px | Section vertical padding |
| `.section-pad` | `1.5rem` / `md:2rem` | Shared compact section rhythm |

### Container

- **Max width:** `max-w-7xl` (80rem / 1280px) for main content rows  
- **Centering:** `mx-auto`  
- **Page gutters:** `px-5 md:px-8` (hero copy also uses `md:px-10`)  
- **Full-bleed exceptions:** `.hero-shell`, `.apple-carousel` (100vw edge-to-edge)

### Layout patterns

| Pattern | Where |
|---|---|
| Fixed header + full-bleed hero | `SiteHeader` + `Hero` |
| Centered single-column quote | `MissionSection` |
| Responsive card grid `1 → 2 → 3` cols | `KnowUsStack` (`lg:auto-rows-[300px]`, one tall `row-span-2`) |
| Featured + side grid | `LatestMessages` (`lg:grid-cols-[1.25fr_0.75fr]`) |
| 3-up portrait grid | `TestimoniesSection` (`md:grid-cols-3`, aspect `3/4`) |
| Split copy + visual | `VisionSection` (`lg:grid-cols-[1.15fr_0.85fr]`) |
| Infinite horizontal flex track | `BranchCarousel` |
| Footer multi-column | `SiteFooter` (`sm:2` / `lg:5`) |

### Breakpoints used

Tailwind defaults (as used in components):

| Prefix | Width | Typical change |
|---|---|---|
| (base) | &lt; 640px | Mobile padding, stacked grids, carousel `78vw` slides |
| `sm:` | ≥ 640px | Header CTA visible; 2-col grids |
| `md:` | ≥ 768px | `px-8`, larger type, section padding, 3-col testimonies |
| `lg:` | ≥ 1024px | Desktop nav; Know Us 3-col; Vision split; Messages split |

Also CSS media in `globals.css`: `768px`, `1024px`, `max-width: 640px` (carousel).

---

## 4. COMPONENTS

### Buttons

#### `.btn-primary` (orange — main energy CTA)
- Padding: `0.9rem 1.45rem`
- Radius: `999px` (pill)
- Background: `var(--orange)` → hover `#ff933f`
- Text: white, weight 800, size `0.875rem`
- Shadow: `0 12px 30px rgba(253, 127, 32, 0.28)`
- Hover: slight `translateY(-1px)`
- Used for: Find a Branch (scrolled), Watch More, Donate, Share Testimony, etc.

#### `.btn-secondary` (purple)
- Same padding / pill radius
- Background: `var(--purple)` → hover `var(--purple-deep)`
- Text: white, weight 700, size `0.875rem`
- Used for: Listen to Messages / secondary actions

#### `.btn-ghost` (hero on video)
- Pill, white text
- Border: `1px solid rgba(255,255,255,0.45)`
- Background: `rgba(255,255,255,0.12)` + `backdrop-filter: blur(8px)`
- Used for: Watch Messages on hero

#### Header “Find a Branch”
- On dark hero: white pill + orange arrow circle  
- After scroll: switches to `.btn-primary`  
- Size: `px-5 py-2.5`, `0.8rem`, extrabold

#### Vision purple CTA (inline)
- `rounded-full bg-purple px-5 py-3 text-sm font-extrabold text-white`
- Shadow: `0 12px 30px rgba(107,52,250,0.28)`
- Hover: `bg-purple-deep`
- Optional white/20 circular arrow badge

#### Apple slide CTA
- White pill, text `#1c1c1f`, weight 800  
- Hover: `#f4f4f5` + slight lift  
- Class: `.apple-slide__cta`

#### Branch list chips
- `rounded-full border border-line bg-white px-3.5 py-2 text-sm`
- Hover: `border-purple text-purple`

### Cards / boxes

| Style | Specs |
|---|---|
| `.card-3d` | radius `1.75rem`, white, border `var(--line)`, multi-layer shadow; hover lifts `-6px` |
| `.panel` | radius `1.5rem`, white, `var(--shadow)`, border `var(--line)` |
| `.vision-panel` | frosted white `rgba(255,255,255,0.88)`, blur 8px, purple-tint border + soft shadow |
| Know Us / media cards | `rounded-[1.75rem]` + `shadow-[var(--shadow-lift)]` |
| Message thumbs | `rounded-2xl border border-line bg-bg-soft` |
| Testimony photos | `rounded-[1.75rem]`, aspect `3/4` |
| Vision outer panel | `rounded-[1.75rem]` → `md:rounded-[2.25rem]` |

### Navigation bar

- Fixed `top-0 inset-x-0 z-50`
- Height: `h-[4.5rem]` (72px)
- Content: `max-w-7xl mx-auto px-5 md:px-8`
- Transparent over hero; after `scrollY > 40`: `bg-white/92`, `border-line`, `backdrop-blur-xl`, light shadow
- Desktop nav: `hidden lg:flex gap-8`
- Mobile: round icon button `h-10 w-10`, drawer under header

### Form inputs

No homepage form fields / input styles yet. (Links only.)

### Icons

Custom inline SVG component: `src/components/Icon.tsx`  
ViewBox `0 0 24 24`, uses `currentColor`.

Names: `arrow`, `location`, `groups`, `book`, `play`, `heart`, `home`, `spark`  
No Font Awesome / Lucide / Heroicons package.

---

## 5. IMAGES & ASSETS

### Logo

| Item | Path | Notes |
|---|---|---|
| Logo PNG | `public/images/kharis-logo.png` | Source **344×324**; displayed **36×36** (`h-9 w-9`) → **40×40** on md |
| Wordmark | Text “kharis” next to logo | Plus Jakarta Sans, extrabold |
| On light backgrounds | `brightness-0` filter (black dove) | `BrandLogo` `tone="onLight"` |
| On dark / hero | Natural white dove | `tone="onDark"` |

### Favicon

`src/app/favicon.ico` — multi-size ICO (includes 16×16, 32×32; resource reports 256×256).

### Image conventions

| Use | Aspect / sizing |
|---|---|
| Hero video / poster | Full viewport cover (`object-fit: cover`); YT iframe scaled ~1.45 |
| Know Us cards | Portrait / mixed heights; tall About card `lg:row-span-2` |
| Featured message | `aspect-video` |
| Testimonies | `aspect-[3/4]` |
| Branch slides | Desktop `21/9`, mobile `16/10`; width `min(70vw, 920px)` / `78vw` mobile |
| Vision globe | Square `aspect-ratio: 1`, max ~480–520px |
| Build House | Full-bleed photo + dark overlay, min height ~`58vh` |

### Local image folder

`public/images/` — includes logo, branch slides 1–5, know-us photos, testimonies, build-house, vision-campaign (file present; Vision UI currently uses globe, not campaign image), etc.

---

## 6. EFFECTS

### Shadows

| Name / value | Where |
|---|---|
| `--shadow` | Panels |
| `--shadow-lift` | Media / Know Us / testimonies |
| Orange CTA glow | `0 12px 30px rgba(253,127,32,0.28)` |
| Purple CTA glow | `0 12px 30px rgba(107,52,250,0.28)` |
| Active slide | `0 20px 50px rgba(40,20,80,0.2)` |
| Globe multi-layer inset + outer | See `.vision-globe__sphere` |

### Border radius

| Value | Where |
|---|---|
| `999px` / `rounded-full` | All main buttons, chips, dots |
| `1.5rem` | `.panel` |
| `1.75rem` | Cards, vision panel (mobile), know cards |
| `2.25rem` | Vision panel (md+) |
| `16px` / `12px` | Branch slides (desktop / mobile) |
| `50%` | Globe |

### Transitions / animations

| Effect | Detail |
|---|---|
| Header | `transition-all duration-400` |
| Buttons / cards | `0.2s`–`0.35s` ease; hover lift |
| Carousel track | `0.75s cubic-bezier(0.22, 1, 0.36, 1)` |
| Hero poster fade | opacity `0.6s` |
| Welcome purple stroke | `welcome-purple-run` 2.4s linear infinite |
| Globe spin | `earth-spin` 36s linear infinite |
| Globe aura | `globe-pulse` 5s ease-in-out infinite |
| Framer Motion `Reveal` | variants: up/down/left/right/scale/blur/fade; ease `[0.16, 1, 0.3, 1]`; respects `prefers-reduced-motion` |
| Vision stats | `CountUp` animate ~1.6s |

### Backdrop blur

Used on: scrolled header, ghost buttons, vision panel, know-card icon chips, carousel pause.

---

## 7. FILE STRUCTURE (where styles live)

```
src/app/
  layout.tsx          → font load + body class
  globals.css         → CSS variables, @theme, component classes
                        (.btn-*, .section-title, .hero-*, .vision-*, .apple-*)
  page.tsx            → homepage section order only
  favicon.ico

src/components/       → section UI; mostly Tailwind utility classes
  SiteHeader.tsx
  Hero.tsx
  MissionSection.tsx
  KnowUsStack.tsx
  LatestMessages.tsx
  BuildHouseSection.tsx
  TestimoniesSection.tsx
  VisionSection.tsx
  VisitSection.tsx
  BranchCarousel.tsx
  SiteFooter.tsx
  BrandLogo.tsx
  Icon.tsx
  Reveal.tsx / Parallax.tsx   → motion helpers

src/lib/              → data (locations, youtube, branch-slides accents)

public/images/        → static brand + section images

postcss.config.mjs    → Tailwind v4 PostCSS plugin
package.json          → tailwindcss ^4, @tailwindcss/postcss, framer-motion
```

**There is no separate `tailwind.config.js`.**  
Theme colors are defined in `globals.css` via `:root` + `@theme inline`.

### How to add a new page and stay consistent

1. Reuse CSS variables / Tailwind tokens (`bg-bg`, `text-fg`, `bg-purple`, `btn-primary`, etc.).
2. Put shared one-off component styles in `globals.css` next to existing `.btn-*` / `.section-title`.
3. Prefer section components under `src/components/` with the same `max-w-7xl px-5 md:px-8` shell.
4. Keep Plus Jakarta Sans only; keep purple/orange CTA rules from `BRAND.md`.
5. Use `Reveal` for entrance motion instead of inventing new animation libraries.

### Homepage section order

1. SiteHeader  
2. Hero  
3. Mission  
4. Know Us  
5. Latest Messages  
6. Build House  
7. Testimonies  
8. Vision  
9. Visit (branch carousel)  
10. Footer  

---

## Quick match checklist for other builders

- Purple `#6B34FA` + orange `#FD7F20` only as brand accents  
- Soft purple bg `#F1ECFF` for calm bands  
- Plus Jakarta Sans 500–800  
- Pill buttons (`rounded-full`)  
- Content width `max-w-7xl`, gutters `px-5 md:px-8`  
- Card radius ~`1.75rem`  
- Add shared styles in `src/app/globals.css`; page layout in components  

See also: short handoff note in `BRAND.md`.
