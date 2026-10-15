# Globe and navigation performance

Implemented on `feature/performance-and-location-globe`, based on main `5369a9d`.

## Local build comparison

Both builds used the same installed dependencies (Next.js 15.5.27), without Supabase credentials. The manifest currently specifies Next.js 16.3.8, so repeat the build with the lockfile dependencies and configured content before release. These are bundle measurements, not production Core Web Vitals.

| Measurement                     |               Main |                        This branch |
| ------------------------------- | -----------------: | ---------------------------------: |
| Locations route JavaScript      |            81.9 KB |                            17.0 KB |
| Locations first-load JavaScript |             244 KB |                             179 KB |
| Land geometry DOM elements      | 16,995 SVG circles |                           1 canvas |
| Separate land asset             |               None | 33,992 bytes, loaded near viewport |

The canvas draws at most 30 times per second, stops when offscreen or the tab is hidden, and stops after country camera movement settles. Reduced motion disables rotation and camera animation. A pause control is available. Starting orientation uses approximate browser time zone; precise location remains opt-in via Near me.

Country selection synchronizes the globe and directory filters. Each country has an animated welcome and a highlighted outline. Branch dots remain clickable, with separate keyboard-accessible branch buttons. The server sends compact map coordinates instead of complete duplicate branch records, and React cache shares the directory read within each render.

Shared navigation now transitions internal links, caps transition waiting at 500ms instead of 1200ms, avoids duplicate prefetch requests and honors Save Data. All routes have a lightweight loading fallback. Directory groups defer offscreen layout and painting.

## Verification

- 87 tests pass, including five time-zone orientation tests.
- Main-app ESLint passes.
- Production build passes using installed dependencies.
- Type checking reports the same seven errors as unchanged main, in LocationBranchView, BranchMonthCalendar, BranchTemplate and events-content.
- Mobile and desktop browser checks covered whole-world rendering, Ghana selection and welcome, and navigation to About. No globe console errors in production preview.
- Follow-up verification restored the real public Supabase settings from the Kharis GitHub deployment variables into the ignored local environment. The live directory returns 21 active branches; Ghana selection shows one Accra branch and opens its correct address and Sunday service details. Missing connection states now show an unavailable message rather than a false zero count.
- Country welcomes now use staggered masked text reveals, a 950ms lead before camera travel, and a 2.6s settling animation. Reduced motion skips the sequence.

Regenerate the binary land asset after changing source coordinates with `node scripts/build-globe-land.mjs`. No push or deployment performed.
