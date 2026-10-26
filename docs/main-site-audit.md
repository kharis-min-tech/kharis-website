# Main Kharis site audit, 26 October 2026

## Version and scope

Fetched `origin/main` at `e4dbe77` and merged it into `fix/kp2-photo-matching` in merge commit `021bc4e`. Preserved the local KP2 photography, Giving and department refinements while incorporating the newer main-site layout, content and form changes. Nothing was pushed or deployed.

The route pass covered 41 main-site URLs, including legacy redirects, all linked branch detail pages, Life destinations and department detail pages. Main preview: `http://localhost:3020`. KP2 preview: `http://localhost:3019/kp2`.

## Corrections

- Kept main's new four-card home layout and its new About and actual water-baptism photographs. The old Locations photo card has been removed upstream; the dedicated Locations page retains the globe and branch search.
- Replaced the Young Adults watermark image with the actual KP2 midweek community photograph already sourced from KOffice.
- Put the approved realistic children's illustration in the Life story and shared children's content. The whole illustration fits within its stage so the children remain visible on a phone. The asset is `apps/main/public/images/home/childrens-ministry.webp`, reused from the built-in image generation output documented in `children-ministry-illustration.md`.
- Used the actual water-baptism photo consistently in the Life story and baptism detail content.
- Fixed the Life story's image stacking: on phones, its images could render above the readability gradient when the desktop mask was removed. Explicit media and shade layers keep text legible.
- Fixed the desktop About menu closing immediately on pointer click after hover. Added arrow-key entry, Escape focus return and closing when focus leaves. The submenu retains only About Us and Governance.
- Added Find a Branch to mobile navigation because the equivalent header button is hidden at phone widths. Existing destinations remain available. Verified scrolling on a 320 by 568 viewport.
- Improved the Contact form's placeholder contrast in both themes.
- Stabilised the chatbot's closing callback so its Escape handler uses the current callback without a hook dependency warning.
- Added Next 16's documented smooth-scroll attribute so route transitions can reset scrolling correctly.
- Prevented local quiz completions from adding development test records to the live Google Sheet. Production quiz submission behavior is retained.
- Used the existing image component for the children's message cover, retaining the same asset and crop.
- Restored local main-site configuration from the existing project setup and pointed development KP2 links at port 3019. Configuration is ignored by Git and no credentials are recorded here.

## Checks

- All 41 discovered route URLs returned HTTP 200, including redirects to their canonical destination.
- Checked 1280px desktop and 390px phone layouts in light and dark themes, with no horizontal page overflow. Also checked 11 primary destinations at 320px, plus mobile menu scrolling at 320 by 568.
- Checked navigation, submenu destinations, keyboard entry, Escape dismissal, focus return and the mobile branch link.
- Checked branch search with matches and no matches, branch calendar month changes, visit-dialog sizing and dismissal, and branch photo dismissal.
- Checked Giving branch selection and destination, keyboard tab navigation, bank copy feedback, text amount and SMS URL, and Ghana details.
- Completed the local quiz through all eight questions to results, checked reset, privacy-dialog Escape dismissal and a department video preview.
- Checked Contact's invalid submission state and first-error focus. No valid messages or visit requests were submitted.
- Checked Messages search and empty state, clearing filters, player loading, Escape dismissal and focus restoration.
- Checked Events search, photo gallery navigation, Escape dismissal and focus return after the exit animation.
- Confirmed the Microsoft incident form loads inside its embed. No incident report was entered or submitted.
- Browser error log for the audit tab was empty.
- Main and KP2 TypeScript checks passed. All 140 tests across 24 test files passed. Main ESLint passed without warnings or errors. KP2 ESLint has no errors and 52 existing plain-image and unused-declaration warnings.

## Practical limits

Viewport checks use the desktop browser's responsive sizing, rather than physical iOS and Android devices. Live mail delivery, payment completion and geolocation permission flows were not exercised. Header checks for external images were not conclusive: some origin servers rejected command-line requests with HTTP 403 while the browser rendered their images. All 19 discovered local image URLs passed their header checks; external integrations should also be checked in the deployment environment.

Evidence is saved in the workspace's `ui-review/main-site-audit` folder, including viewport metrics and settled screenshots of the corrected Life and Contact sections. The route and image-check JSON outputs are copied alongside this report's evidence.
