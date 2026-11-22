# Media quality

## Pictures

`SiteImage` requests **quality 80** by default (it was 95), and
`next.config.ts` offers **AVIF then WebP**. Call sites that genuinely need
more still pass `quality` themselves; those overrides were left alone.

The old default cost twice over. Quality 95 is roughly double the bytes of 80
for a difference that is not visible without magnifying a crop, and it was the
stated reason AVIF was disabled — a note in `next.config.ts` said AVIF at 95
could take over a minute to encode, leaving tiles empty.

That encode claim was re-measured on 2026-11-22 against
`hero/impartation-celebration.jpg` at `w=1920`: **2.0s at q80, 1.8s at q90,
1.6s at q95**. Whatever produced the original figure is not present on this
version, so AVIF is back on. For that photograph the end-to-end change is
**220KB (WebP q95) to 52KB (AVIF q80)**.

If a tile ever renders empty again, `formats` is the first setting to suspect.

## Cloudflare transforms, for the paths `next/image` cannot reach

Transforms are enabled on the `images.kharis.org` zone, so any picture there
can be resized by URL: `/cdn-cgi/image/width=…,quality=…,format=auto/<key>`.
`apps/main/src/lib/image-cdn.ts` wraps this, and passes through untouched
anything that is not on that host — transforms exist nowhere else, and a
`/cdn-cgi/image/` prefix on another host is a 404.

This exists for the few places that cannot use `next/image`: the Life tunnel
hands plain URLs to a vendored carousel, and the activity sheet swaps `src` on
a plain `<img>` carousel.

Those places were serving full-resolution uploads whatever size they drew
them at. The cost was memory rather than bytes — a browser decodes to
uncompressed RGBA regardless of the box, so a 2000x1333 photograph is 10.2MB
of bitmap even inside a 76px thumbnail. Measured on the Singles' Ball sheet,
whose rail is seventeen pictures:

|                        |   before | after |
| ---------------------- | -------: | ----: |
| Thumbnails transferred | 2,355 KB | 82 KB |
| Thumbnails decoded     |    83 MB |  1 MB |

With eighteen tunnel walls held behind it, the page was reaching roughly
230MB of decoded images, which is where phone browsers kill the tab. Tunnel
walls are now capped at 900px wide.

## Video

The hero's three clips are 7–9MB each. They no longer mount with the rest of
the row: `PanoramaCarousel` keeps a video item rendering through the ordinary
image path (its poster, sliced and curved like any other tile) until the row
is on screen **and** `requestIdleCallback` fires, so 25MB no longer competes
with the photograph the page is judged on. A row never scrolled to never
loads them.

The clips themselves were then re-encoded, by
`scripts/transcode-hero-videos.mjs` (dry run / `--upload` / `--apply`, the same
shape as the picture migration). They were **1920x1080 at 18-20 Mbps** — not
the 720p at ~2 Mbps claimed below, which was wrong on both counts — for 3 to 4
second loops painted into tiles a few hundred pixels wide, with an audio track
nothing can play because the tiles are muted.

Now 960x540, no audio, CRF 28:

|                            |       before |       after |
| -------------------------- | -----------: | ----------: |
| Glory to the lamb - Trim   |      9.07 MB |     0.36 MB |
| Glory to the lamb - Trim 2 |      7.19 MB |     0.27 MB |
| Glory to the lamb - Trim 3 |      9.91 MB |     0.77 MB |
| **total**                  | **26.17 MB** | **1.40 MB** |

Quality was checked before the URLs were switched, not after: SSIM against the
source downscaled to the same 960 is 0.959-0.974 mean, worst frame 0.944, and
a side-by-side frame from the worst clip at a cross-dissolve is
indistinguishable. The new objects went to fresh content-hashed keys, so the
URLs they replaced still work.

Re-run the script if the hero gains a clip. `HERO_VIDEO_WIDTH` and
`HERO_VIDEO_CRF` override the defaults.

The Sunday banner source video is H.264, 1280x720 at 60fps, about 2 Mbps. A
denoise, sharpen and upscale trial did not provide a meaningful improvement
and was not deployed. No recovered HD detail is claimed. Both main-site clips
are 720p; three KP2 clips are 1024x576, and the remaining KP2 clip is portrait
606x1080. Better originals are needed for true resolution upgrades.

On large screens the Sunday banner starts with an existing 2048-pixel service
photograph, with the original video available through the play control.
Smaller screens may autoplay the existing clip, subject to reduced-motion
preference. Video data is requested only when the banner is in view and
playing.

## Other

Globe controls, hover cards and the country picker remain lightweight DOM
overlays over the canvas. Country picker options support keyboard arrows,
Escape and outside-click dismissal. Page transitions use opacity and
transforms with a stationary shared header, and reduced motion disables the
movement.
