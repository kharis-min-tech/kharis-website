# Main Kharis interaction audit

Date: 15 October 2026

Scope: main Kharis site only. KP2 was excluded from this final pass at the user's request. Earlier Cloudflare image migration work remains intact.

## Motion decisions

- Controls give feedback in 160-220 ms, filtered branch results enter over 360 ms with small staggered delays, and pages transition over 440 ms.
- Mobile navigation expands and closes over 300 ms. Dialog backdrops fade over 180 ms and panels settle over 320 ms.
- The header stays steady during page changes; the footer enters as a separate layer with a short delay.
- Globe marker buttons and ordinary links use the same navigation path. Section links preserve their target, and browser navigation has a lightweight entrance fallback.
- Reduced-motion preferences disable movement and smooth scrolling. Navigation remains usable without the View Transitions API.

## Fixed during this pass

- Visit dialog: Escape close, keyboard focus containment and restoration, scroll locking, labelled fields, named close button, exit animation, mobile overflow, and cancellation of requests/timers when closed.
- Branch photo dialog: dialog semantics and keyboard focus containment/restoration.
- Google Calendar links: replaced a nonexistent start_time field with the event's date, time and timezone, plus a one-hour end time. Unknown times use an all-day date.
- Branch calendar: switched from the old branch type to the live data model, respected all stored weekdays, and excluded inactive services. Unknown weekdays no longer silently become Sunday.
- Branch watch card: links to Messages instead of opening an empty featured-video dialog.
- Service times stay on one line.
- Restored TypeScript validation in the main production build after resolving its remaining errors.
- Set the canonical metadata origin to kharis.org.
- Removed stale generated local route cache that referenced an older build. This was local build output, not a production data change.

## Validation

- 98 automated tests pass, including calendar link and branch weekday regression coverage.
- Main TypeScript check and lint pass.
- Main production build passes with TypeScript validation enabled.
- All 40 audited main route URLs and 36 main internal link destinations returned HTTP 200. These include all generated individual branch routes and Life detail routes.
- Browser checks: visit dialog open, focus and scroll lock, Escape close and focus restoration; mobile menu to About; Ghana filter and globe marker to Accra.
- Forms were inspected without sending live enquiries. Payments and external service integrations were not transacted. HTTP route checks do not constitute exhaustive testing of every possible state.

## Remaining content and release work

- Accra: midweek details are unconfirmed; parking and public transport copy is missing.
- Manchester, KP2 London and KP2 Romford records surfaced by the main directory also contain unconfirmed midweek details. Those KP2 records were not redesigned in this pass.
- London, Manchester and KP2 Peterborough records have missing service descriptions.
- Branch-specific hero photography and featured videos still need content-team input where generic artwork or no video is stored.
- The Sunday Service source video is still 720p. A sharper original is required for real additional detail.
- No missing main route was found. Some pages have incomplete content as listed above.
- Before release, verify real contact delivery and giving hand-offs in the deployment environment, and obtain the required peer review and automated PR checks. No production deployment or merge was performed.

Local build tooling uses installed Next.js 15.5.27 while the manifests pin 16.3.8. A clean dependency install and CI build against the pinned version remain a release validation step.
