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

The follow-up mobile pass was built and tested with the pinned Next.js 16.3.8 dependencies. PR #44’s preceding CI run also passed.

GitHub also reports an existing high-severity default-branch Dependabot alert for the glob CLI's -c/--cmd handling: https://github.com/kharis-min-tech/kharis-website/security/dependabot/11. GitHub lists 10.5.0 as the first patched version. Dependency remediation remains a release follow-up and was not included in the main-site interaction changes.

## Follow-up mobile UX pass

- Replaced the mobile navigation dropdown with the final user-selected full-screen layout: centred Kharis logo, eight centred primary links, active-page underline, close button and secondary navigation.
- Added light/dark styling, safe-area padding, independently scrolling short-screen layout, Escape/backdrop close, focus trapping/restoration and automatic close when switching to desktop width.
- Added 44px minimum control hit areas, 16px phone form text and stacked branch hero actions at the narrowest widths.
- Checked primary main-site layouts at 320px and 375px: no document-level horizontal overflow. Checked the menu at 320x568 and 375x812, and the desktop breakpoint at 1024px. Verified keyboard wrap and focus/scroll restoration.
- Fixed off-screen message-card reveals briefly widening the 320px homepage by changing their entrance to a vertical reveal.
- Verified contact form controls render at 16px on phones. Viewport overrides were reset after testing.
- Main production build passes on Next.js 16.3.8; 98 tests, lint and TypeScript pass.
- Mobile About navigation now visibly expands with a rotating chevron and an indented submenu for the overview, mission, vision, leadership and governance. Verified that selecting Our vision closes the menu, restores page scrolling and activates the Vision chapter.
