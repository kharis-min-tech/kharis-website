# Mobile consistency review

Reviewed on 16 and 17 October 2026 against `origin/main` at `30e6c7650094478eadec2fcd8a907c813bc37373`.

## Changes

- Match the site's square styling in mobile navigation, retain every destination, and indicate the current About or Governance page.
- Give phone filters, form fields, footer links and detail navigation a minimum 44px tap height.
- Use dark app walkthrough panels and one shared phone preview for main Home, Messages and KP2. Crop the old baked-in frames, preserve image proportions, and keep app content below the reconstructed camera area.
- Animate all four giving methods on desktop and mobile, including panel height changes. Keep the first server-rendered panel visible, preserve focus when switching to Ghana details, and allow room for focus rings.
- Point shared KP2 links to the current worker preview, matching the deployment workflow default.
- Apply the supplied scroll-stack animation to all eight statements of faith. Preserve the original text, native scrolling and a static fallback for reduced motion or short viewports.
- Trigger both affected applications' CI and deployments for shared component changes.

## Coverage and limitations

Compared main routes at 1440px desktop, 390px phone and 320px narrow phone widths: Home, About, Locations, Events, Messages, Life, Give, Contact, Governance and incident reporting. Checked Mission, Vision and Leadership redirects, Life detail/modal entry routes and the not-found page. Repeated canonical phone layouts in light and dark themes.

Checked all 16 live directory branches at 1440px, 390px and 320px, plus 320px dark mode: London, Birmingham, Brighton, Bristol, Chatham, Chelmsford (stored slug `chelmesford`), Coventry, Croydon, Luton, Northampton, Nottingham, Orpington, Reading, Accra, Freetown and Manchester. Asserted nonempty consistent headings, no page errors and no horizontal document overflow. Intentional horizontal image walls and filter scrollers stay within the document.

Verified the 320 x 568 mobile menu scrolls to its last destination, traps focus, dismisses with Escape and restores focus. Checked square menu styling and active submenu entries. Phone previews were inspected on Home, Messages and KP2, including source natural dimensions (486 x 986), clipping, aspect ratio and camera clearance.

Giving checks cover four methods at 1440px, 390px and 320px in both themes, keyboard Home/End navigation, settled heights, reduced motion, server HTML visibility without JavaScript and Ghana focus restoration. Faith checks cover desktop, tablet, phone, short phone, landscape, resize across the fit threshold, live reduced-motion changes and pinned reload. A simulated browser-toolbar height change no longer switches the stack mode.

These checks use Chromium phone viewports. Physical-device keyboards and external embedded forms were not exercised. No forms were submitted and no database writes were made. Existing public church read configuration was used with user approval.

## Standards review

The independent standards reviewer found no actionable violations in the complete source diff. It checked workspace instructions, the brand guide and design-system conventions.

## Spec review

The independent specification reviewer found no actionable mismatch with the accepted requests. Static review was supplemented with the browser checks above.

## Claude review

Claude Sonnet 5.5 reviewed the full diff and a follow-up containing the fixes. Its final disposition was no remaining actionable bugs, with physical iOS Safari verification identified as a coverage gap. Confirmed findings were fixed: server-rendered giving visibility, viewport-fit stability, submenu opening after paint and focus-ring clipping. Additional checks found and fixed Ghana focus loss and missing shared-directory workflow filters. The final clip padding is offset at the viewport so it preserves the original content alignment.

Two suggested defects did not reproduce: sticky scroll timing (including off-to-on resize and live reduced motion) agreed with measured card positions, and footer wrapping did not apply because the links use a column layout. No speculative scroll remount was added. Claude's module-bundling and source-image verification questions were checked with pinned Next.js builds and browser asset checks. AI reviews do not replace the required peer approval.

## Validation

- Pinned dependencies installed with `npm ci`: Next.js 16.3.8 and Vitest 5.0.4.
- All 98 unit tests passed across 16 files.
- Main ESLint and shared phone component ESLint passed. KP2 ESLint passed with 44 existing warnings and no errors.
- Repository Prettier check passed.
- Both full OpenNext Cloudflare builds passed with pinned Next.js 16.3.8, including Turbopack, TypeScript, static generation (main 48 pages, KP2 19 pages) and worker bundling. No deployment was run.
- Production dependency audit passed the repository's critical-severity gate; four existing high-severity transitive build-tool advisories remain.
- Browser checks described above passed. Screenshots and recordings accompany the PR.

No production deployment or merge was performed.
