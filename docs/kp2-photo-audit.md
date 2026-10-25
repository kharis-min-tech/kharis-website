# KP2 photograph placement audit

Based on main commit `4d363bf`. Source library: KOffice, Shared Folder / Kp2 Photography, accessed 23-24 October 2026.

## Coverage

| Page or shared placement | Photographs to match | Source code |
| --- | --- | --- |
| Home | Hero still and video posters; full-hall introduction; head pastor portrait | `components/pages/home.tsx` |
| Home navigation panels | Sermon notes; friends arriving; celebration; evangelism; choir | `components/KnowKharisComic.tsx` |
| Testimonies, Home and Giving | Three separate KP2 testimony photographs and testimony story modal | `components/TestimoniesBand.tsx` |
| About / Mission | Hero; Vision banner; leadership banner; Pastor David and Pastor Awo portraits | `components/pages/mission.tsx` |
| Departments and Life | All 13 department images, including department hero, cards and video poster | `data/departments.ts` |
| Serving quiz | Six rotating hero images | `data/quiz.ts` |
| Life | Congregation celebration hero; gallery; social content | `components/pages/life.tsx`, `components/LotGallery.tsx`, `components/SocialStack.tsx` |
| Events | Hero; upcoming event fallback images | `components/pages/events.tsx`, `components/EventsTop.tsx` |
| Sunday Service | Main poster and every photo in its lightbox | `components/SundayServiceBanner.tsx` |
| Event panels | Midweek, Family Fun Day, Praise Night and Jesus Campaign posters and all lightbox photographs | `components/ComicPanels.tsx` |
| Event feature | Let the Bible Speak and Singles Ball photographs | `components/ComicFlip.tsx` |
| Messages | Preaching hero; recording thumbnails | `components/pages/messages.tsx`, shared YouTube components |
| Media | Hero; recording thumbnails | `components/pages/media.tsx`, shared YouTube components |
| Giving | Outreach hero; building illustration; shared testimony strip | `components/pages/giving.tsx`, `lib/spurgeons.ts` |
| Contact | Congregation hero; conversation image next to form | `components/pages/contact.tsx`, `components/ContactLetter.tsx` |
| Branch directory and details | Published branch hero, pastor, gallery and related-branch cards; generic fallback galleries | `lib/branches.ts`, `components/pages/branch.tsx`, `components/pages/branches.tsx` |
| Search and social previews | Organization and page metadata images | `lib/seo.ts`, route metadata |
| Legacy Content Studio paths | Image mapping used by saved asset references | `lib/site-image-urls.json`, `lib/public-asset.ts` |

Recording thumbnails should continue to represent the linked recording. App screenshots, logos, maps and the Spurgeons architectural illustration are factual assets and should remain tied to their subjects. Branch photographs and pastor portraits must match the named branch or person.

## Library folders found

- 2026 / September / 21.9.26: 62 originals.
- 2025 / BASS / 21.4.25: 114 originals.
- 2025 / BASS / 16.2.25.
- 2025 / Midweek / 23.7.25: 30 originals.
- 2025 / Jesus Campaign.
- 2025 / Sunday Services.
- 2025 / Baptism.

## Photo decisions

- Added 32 optimized WebP originals from the KP2 Sunday, BASS, midweek and Jesus Campaign shoots. `kp2-photo-sources.json` records every source filename, destination and description.
- Replaced generic page imagery on Home, About, Life, Departments, Events, Media, Giving and Contact. Department photos now show the corresponding activity, including drama, vocal ministry, choir, instruments, welcome, media, sound, prayer, projected teaching and outreach.
- Sunday, midweek and Jesus Campaign lightboxes use their corresponding KP2 shoots. Removed unrelated filler pictures from the Family Fun Day and Praise Night galleries, retaining the actual named-event photographs.
- Life gallery labels describe the selected photographs. A congregation photograph is no longer labelled Sports day, and a preaching photograph is no longer labelled Spoken word.
- Upcoming events preserve their supplied event image for every occurrence. Events without a photo receive a category-specific KP2 fallback.
- The current main branch already includes the Our Story button removal and three KP2 testimony photographs and a story modal. Preserved that newer implementation. Matched the red-dress testimony scene to `2026/September/21.9.26/61-0I1A6311.jpg` and the orange-dress scene to `2025/BASS/21.4.25/0I1A8168.jpg` in KOffice. The third existing KP2 testimony photograph remains in place.
- Preserved named pastor portraits, branch photographs, recording thumbnails, video frame posters, logos, maps and the building illustration so that these factual assets stay tied to their subjects.
- Retained the existing KP2 spoken word performer photograph. Replaced the mixed creative ministry collage on the K-Dancers card with the original BASS worship dance photograph (`0I1A9546.jpg`). Its description refers to members dancing in worship, without identifying them as a particular team.
- No Family Fun Day, Praise Night, Let the Bible Speak or Singles Ball shoot was found in the reviewed KP2 Photography folders. Kept the corresponding event photographs; did not substitute service photographs under those event names. `ComicFlip` is currently imported but not rendered by Events.

## Validation

- TypeScript: passed.
- Focused KP2 tests: 3 files, 10 tests passed.
- ESLint: no errors; 53 existing warnings, primarily plain image elements and unused existing declarations.
- Checked 390px phone layouts in light and dark themes on About, Life, Contact, Giving, Media and Departments, without horizontal overflow. Checked desktop ministry cards and event imagery.
- Verified Sunday/midweek/outreach gallery controls, Escape dismissal and focus restoration, plus mobile navigation dismissal. Local preview remains on port 3019.
- Local branch only. No push, publication or deployment.


## Caption and leadership follow-up

- Home Locations now uses the KP2 hall photograph to show the venue. About Us uses the KP2 community group photograph. Life, Become a Believer and Get Involved retain photographs showing community, gospel outreach and service respectively.
- Updated Pastor Awo's leadership photograph to the same preaching image used by the main site (`main/ef23a725426d6b26/leadership/pastor-awo-preaching.jpg`). Verified the image loads and the desktop crop preserves the subject.

## Baptism, Messages and Giving follow-up

- Added four originals from `2025/Baptism/29.11.25`, including the ceremony, celebration, poolside team and wider KP2 family. The source manifest now records 37 optimized KOffice photographs.
- Added a labelled Baptism section and four-photo gallery to Life. The Home About Us card now uses the KP2 family photograph from the same shoot.
- Added the BASS worship dance original to the K-Dancers card and legacy image map. Corrected the legacy Spoken-word asset mapping to the existing KP2 performer photograph.
- Added a decorative speaker icon to the Messages Watch Now CTA and included `volume_up` in the site's Material Symbols font subset. The CTA still links to the message browser.
- Aligned Give Online and Bank Transfer in two equal desktop columns with matching padding, icon and heading positions, top edges and bottom edges. Text Giving and Mobile App form the second aligned row. All methods stack at phone width and long bank details can wrap. Bank values and giving destinations are unchanged.
- Added a Children's Department illustration to all three serving quiz video preview contexts. The existing videos remain available. See `children-ministry-illustration.md` for the saved asset and generation prompt.

### Follow-up checks

TypeScript and the 10 focused KP2 tests pass. ESLint reports no errors and 54 warnings (existing warnings plus the intentional plain image elements). Checked Giving cards at 1280px and 390px, matching desktop card tops, heights and heading positions, with no phone overflow in either theme. Checked the baptism gallery's next control, Escape dismissal and focus restoration. Verified the speaker glyph renders and Watch Now still reaches the messages section. Rendered the children's illustration in an isolated local preview without submitting the live quiz; removed the temporary preview route afterwards. No push or deployment.
