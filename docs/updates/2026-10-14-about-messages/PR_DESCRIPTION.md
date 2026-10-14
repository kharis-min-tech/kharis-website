<!-- PR title suggestion: About page redesign, Grace AI chat on every page, Events and Messages (in progress) -->

> Full update note with all screenshots: [docs/updates/2026-10-14-about-messages/README.md](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/README.md)

## What changed

**Branch:** `feature/about-messages-testimonies` · **Date:** 14 October 2026 · **App:** `apps/main` (kharis.org)

The About page has been rebuilt. The old Mission / Vision / Leadership tabs are gone; everything now sits on one scrolling page with a sharper hero photo, Greek word cards that paint themselves in, a dark-purple Mission card next to "How we do it", a full-width Vision card, a two-column Leadership section and a Statement of Faith made of title cards that expand to the full text. "Grace", the AI chat assistant that used to live only on the Life page, now opens from a round button on every page, and the button gently bounces with a "Need help?" bubble if someone keeps scrolling. Buttons across the site now share one smooth 200ms transition, and header and footer links crossfade between pages instead of snapping. On the homepage, the testimony quote carousel has been removed. The Messages page has a new topic and year filter, and YouTube Shorts no longer appear in the shelves. The Events page has a new banquet hero photo, a row of event icons with a photo slideshow for each event, and directions to your nearest Sunday or Midweek service. **Messages and Events are both still works in progress** and will change again before they are final.

"Before" screenshots are from the current live site (<https://kharis-main.itadmin-a94.workers.dev/>). "After" screenshots are from this branch running locally. Desktop shots are 1440px wide; mobile shots are 390px wide.

**Contents**

1. [The new About page](#1-the-new-about-page)
2. [Grace AI chat on every page](#2-grace-ai-chat-on-every-page)
3. [About page, section by section](#3-about-page-section-by-section)
4. [Buttons and navigation](#4-buttons-and-navigation)
5. [Homepage testimonies](#5-homepage-testimonies)
6. [🚧 Messages (in progress)](#6--messages-in-progress-not-final)
7. [🚧 Events page (in progress)](#7--events-page--work-in-progress-not-final)
8. [Commits](#commits) · [How to test](#how-to-test) · [Deploying](#deploying)

---

## 1. The new About page

The whole page from the top down to the footer. The footer itself hasn't changed.

**At a glance**

| Before (live) | After (this branch) |
| --- | --- |
| ![About page before](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/about-full-before-overview.jpg?raw=true) | ![About page after](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/about-full-after-overview.jpg?raw=true) |

**After, full size (desktop)**

![New About page, part 1](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/about-full-after-1.jpg?raw=true)
![New About page, part 2](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/about-full-after-2.jpg?raw=true)
![New About page, part 3](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/about-full-after-3.jpg?raw=true)

**After on a phone (390px), read left to right**

| Top | Middle | Bottom |
| --- | --- | --- |
| <img src="https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/about-full-after-mobile-1.jpg?raw=true" alt="About on mobile, top" width="260"> | <img src="https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/about-full-after-mobile-2.jpg?raw=true" alt="About on mobile, middle" width="260"> | <img src="https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/about-full-after-mobile-3.jpg?raw=true" alt="About on mobile, bottom" width="260"> |

<details>
<summary>Before, full size (desktop)</summary>

![Old About page, part 1](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/about-full-before-1.jpg?raw=true)
![Old About page, part 2](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/about-full-before-2.jpg?raw=true)

</details>

---

## 2. Grace AI chat on every page

Before, the chat assistant was **only on the Life page**. Now a round purple button pops in at the bottom-right corner of every page. On desktop it opens a small chat window, and on phones it opens full screen. Grace greets visitors with quick options (find a branch, baptism/fasting/serving, faith and prayer, Pastor David's messages) or lets them type their own question. The conversation carries over as you move between pages, and the Life page keeps its "Need any help?" prompt.

**Gentle nudge.** If someone scrolls a long way (about two and a half screens) or browses for a while without opening the chat, the button bounces and shows a short "Need help?" bubble. This happens at most three times per visit, with a pause between nudges, and stops as soon as the chat has been opened.

> **Note:** Grace's replies need a working `GEMINI_API_KEY` with available Gemini quota. Locally the key goes in `apps/main/.env.local`; on the live site it must be set as a secret on the Cloudflare worker. Without a key, or once the quota runs out, the chat window still opens, but Grace can't reply.

| Before | Round launcher | Bounce nudge while scrolling |
| --- | --- | --- |
| Only on the Life page | <img src="https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/ai-chat-launcher.jpg?raw=true" alt="Round chat launcher" width="160"> | ![Launcher bouncing with a Need help? bubble](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/ai-chat-bounce.jpg?raw=true) |

| Chat open (desktop) | Chat open (phone) |
| --- | --- |
| ![Grace chat open on the About page](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/ai-chat-every-page.jpg?raw=true) | <img src="https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/ai-chat-every-page-mobile.jpg?raw=true" alt="Grace chat on a phone" width="260"> |

---

## 3. About page, section by section

### Hero

New photo of three church members in Kharis shirts, now loaded at full resolution with soft faded edges, in place of the street-march photo. The wording is the same.

| Before | After |
| --- | --- |
| ![About hero before](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/about-hero-before.jpg?raw=true) | ![About hero after](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/about-hero-after.jpg?raw=true) |
| <img src="https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/about-hero-before-mobile.jpg?raw=true" alt="About hero before, mobile" width="300"> | <img src="https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/about-hero-after-mobile.jpg?raw=true" alt="About hero after, mobile" width="300"> |

### Greek word cards

The cards are now white with a purple bar on the left. When they scroll into view, the Greek words (χάρις and λειτουργία) paint themselves in and get a yellow underline. The screenshot shows how they look once the animation has finished.

| Before | After (finished state) |
| --- | --- |
| ![Greek words before](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/about-greek-before.jpg?raw=true) | ![Greek words after](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/about-greek-after.jpg?raw=true) |

### "Who we are becoming" banner

The banner is now light and misty, echoing the soft edges of the hero photo, with the title in purple and a short gold line underneath. It gives the page a calm pause before the darker Mission and Vision cards.

| Before | After |
| --- | --- |
| ![Banner before](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/about-banner-before.jpg?raw=true) | ![Banner after](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/about-banner-after.jpg?raw=true) |

### Mission and "How we do it"

Before, Mission, Vision and Leadership sat behind tabs, so only one showed at a time, and the four ways we fulfil the mission each needed a click. Now there are no tabs. A dark-purple photo card (full-resolution outreach photo) shows the mission statement, and next to it a "How we do it" card lists all four ways with their Bible references. Both cards have rounded corners. On phones they form a swipeable row.

| Before | After |
| --- | --- |
| ![Mission before](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/about-mission-before.jpg?raw=true) | ![Mission after](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/about-mission-after.jpg?raw=true) |
| <img src="https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/about-mission-before-mobile.jpg?raw=true" alt="Mission before, mobile" width="300"> | <img src="https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/about-mission-after-mobile.jpg?raw=true" alt="Mission after, mobile" width="300"> |

### Vision

Before, the vision points showed one at a time with Previous / Next buttons. Now one full-width dark-purple card with a richer purple glow shows all eight points with icons, and the church family photo, now at full resolution, fades in underneath with a soft curved edge.

| Before | After |
| --- | --- |
| ![Vision before](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/about-vision-before.jpg?raw=true) | ![Vision after](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/about-vision-after.jpg?raw=true) |
| <img src="https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/about-vision-before-mobile.jpg?raw=true" alt="Vision before, mobile" width="300"> | <img src="https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/about-vision-after-mobile.jpg?raw=true" alt="Vision after, mobile" width="300"> |

### Leadership

Pastors David and Awo are now in two cards side by side (Pastor David has a new, full-resolution photo). Their shared story sits in a dark-purple panel below, with an "Explore Kharis Life" button. The old layout had a lot of empty space at the bottom, and that's gone.

| Before | After |
| --- | --- |
| ![Leadership before](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/about-leadership-before.jpg?raw=true) | ![Leadership after](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/about-leadership-after.jpg?raw=true) |
| <img src="https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/about-leadership-before-mobile.jpg?raw=true" alt="Leadership before, mobile" width="300"> | <img src="https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/about-leadership-after-mobile.jpg?raw=true" alt="Leadership after, mobile" width="300"> |

### Statement of Faith

Before, the eight statements were a plain list that opened one at a time. Now they sit under a photo header as compact title cards in a four-column grid. Each closed card shows just its number, an icon, the title and a "Read statement" cue. Hovering, tabbing to or tapping a card expands its border into a dark-purple panel with the full statement. On phones the cards stack as a list and open with a tap ("Tap to read").

> The open-Bible header photo is still a placeholder to be swapped for the final image.

| Before | After (cards closed) |
| --- | --- |
| ![Statement of Faith before](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/about-faith-before.jpg?raw=true) | ![Statement of Faith after](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/about-faith-after.jpg?raw=true) |
| <img src="https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/about-faith-before-mobile.jpg?raw=true" alt="Statement of Faith before, mobile" width="300"> | <img src="https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/about-faith-after-mobile.jpg?raw=true" alt="Statement of Faith after, mobile" width="300"> |

| After: a card open on hover (desktop) | After: a card open after a tap (phone) |
| --- | --- |
| ![Statement of Faith, card hovered](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/about-faith-hover-after.jpg?raw=true) | <img src="https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/about-faith-tap-after-mobile.jpg?raw=true" alt="Statement of Faith, card tapped on mobile" width="300"> |

Links like `/about#mission`, `/about#vision`, `/about#leadership` and `/about#faith` still jump to the right section.

---

## 4. Buttons and navigation

- **One smooth timing for every button.** Buttons and calls to action across the site (header, footer, modals and branch pages) now use the same 200ms transition, so hovers and presses feel consistent instead of some snapping and some easing.
- **Pages crossfade.** Links in the header and footer now crossfade into the next page instead of jumping. Clicking the Kharis logo fades smoothly back to the homepage, and clicking it while already on the homepage glides back to the top. Browsers without support, and visitors who have "reduce motion" turned on, navigate normally.

| Mid-crossfade: About page fading into the homepage after clicking the logo |
| --- |
| ![Logo crossfade from About to the homepage](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/nav-logo-crossfade.jpg?raw=true) |

---

## 5. Homepage testimonies

The "From the family" quote cards and their arrow buttons are gone, so the section is now the three photos and the "Share Your Testimony" button. The homepage also stops loading testimony data it no longer shows.

| Before | After |
| --- | --- |
| ![Testimonies before](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/home-testimonies-before.jpg?raw=true) | ![Testimonies after](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/home-testimonies-after.jpg?raw=true) |
| <img src="https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/home-testimonies-before-mobile.jpg?raw=true" alt="Testimonies before, mobile" width="300"> | <img src="https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/home-testimonies-after-mobile.jpg?raw=true" alt="Testimonies after, mobile" width="300"> |

---

## 6. 🚧 Messages: in progress, not final

> **In progress:** Messages is still being worked on. These screenshots show where it stands today, and the design will change.

**Filter row.** A new row of topic buttons with icons (All, Jesus, Bible, Prayer, Love, Purpose, Acts, Just Men, Fragrance) and a Year drop-down. Picking a filter swaps the shelves for a grid of matching messages, with a count and a Clear button. On phones the topic row scrolls sideways.

| Before (no filter) | After (work in progress) |
| --- | --- |
| ![Messages filter area before](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/messages-filter-before.jpg?raw=true) | ![Messages filter area after](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/messages-filter-after.jpg?raw=true) |
| <img src="https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/messages-filter-before-mobile.jpg?raw=true" alt="Messages before, mobile" width="300"> | <img src="https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/messages-filter-after-mobile.jpg?raw=true" alt="Messages filter after, mobile" width="300"> |

**Shorts removed from the shelves.** YouTube Shorts (videos of 3 minutes or less), such as "What does the bible sound like? #LetTheBibleSpeak" and "You call yourself a Christian BUT...", no longer show up as messages. They're visible in the "before" shelf below.

> The local preview pulls a smaller YouTube feed than the live site, so the "after" shelf has fewer tiles overall for data reasons as well as the Shorts change. Compare the kinds of videos, not the tile count.

| Before | After (work in progress) |
| --- | --- |
| ![Messages shelf before](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/messages-shelf-before.jpg?raw=true) | ![Messages shelf after](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/messages-shelf-after.jpg?raw=true) |

---

## 7. 🚧 Events page — work in progress, not final

> **In progress:** the Events page is still being worked on. These screenshots show where it stands today, and the design will change.

- **New hero photo:** a full-resolution banquet photo replaces the hands-raised worship photo.
- **Icon row:** in place of the old search box and Filters button, there's now a row of round event icons. **Sunday Service** and **Midweek Service** are marked "Upcoming". Six past events (Singles Ball, Praise Night, Camps, Family Fun Day, Jesus Campaign, Let the Bible Speak Conference) are marked "Past event" and say "Coming back soon".
- **Apple-style slideshow:** picking an icon shows a short description and a full-width photo slideshow with captions, progress dots and a play/pause button.
- **Directions for services:** for Sunday and Midweek, a "Your branch" picker shows that branch's day, time and address, with **Get directions** and branch-page buttons. All of it comes from the branch data, so it stays in sync with the Locations pages.
- **"Happening at our church":** shows six upcoming dates with a **Show more dates** button, instead of every date at once. Times now read "9:00 AM" instead of "08:00 Europe/London", and the misleading month heading is gone.
- **Placeholders:** the slideshow photos are placeholders to be replaced with the final images.
- **Known data issue:** the "Test location" text on the event cards comes from the events database, not the website code. It needs fixing in the events data.

**At a glance**

| Before (live) | After (work in progress) |
| --- | --- |
| ![Events page before](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/events-full-before-overview.jpg?raw=true) | ![Events page after](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/events-full-after-overview.jpg?raw=true) |

**Hero**

| Before | After |
| --- | --- |
| ![Events hero before](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/events-hero-before.jpg?raw=true) | ![Events hero after](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/events-hero-after.jpg?raw=true) |

**Icon row and slideshow** (before: search box and Filters button)

| Before | After: Sunday Service selected |
| --- | --- |
| ![Events search area before](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/events-browse-before.jpg?raw=true) | ![Events icon row and Sunday slideshow](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/events-cats-after.jpg?raw=true) |

**A past event selected** (after)

![Singles Ball selected: Coming back soon, with its slideshow](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/events-past-after.jpg?raw=true)

**"Happening at our church"**

| Before | After |
| --- | --- |
| ![Happening at our church before](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/events-happen-before.jpg?raw=true) | ![Happening at our church after](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/events-happen-after.jpg?raw=true) |

**On a phone (390px)**

| Icon row, branch picker and slideshow | Full page: top | Full page: middle | Full page: bottom |
| --- | --- | --- | --- |
| <img src="https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/events-cats-after-mobile.jpg?raw=true" alt="Events on mobile: icons, branch picker, slideshow" width="220"> | <img src="https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/events-full-after-mobile-1.jpg?raw=true" alt="Events on mobile, top" width="200"> | <img src="https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/events-full-after-mobile-2.jpg?raw=true" alt="Events on mobile, middle" width="200"> | <img src="https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/events-full-after-mobile-3.jpg?raw=true" alt="Events on mobile, bottom" width="200"> |

<details>
<summary>Full size (desktop), before and after</summary>

**Before**

![Old Events page, part 1](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/events-full-before-1.jpg?raw=true)
![Old Events page, part 2](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/events-full-before-2.jpg?raw=true)

**After (work in progress)**

![New Events page, part 1](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/events-full-after-1.jpg?raw=true)
![New Events page, part 2](https://github.com/kharis-min-tech/kharis-website/blob/feature/about-messages-testimonies/docs/updates/2026-10-14-about-messages/events-full-after-2.jpg?raw=true)

</details>

---

## Commits

On top of `main` at `2941f79`:

| Commit | What it does |
| --- | --- |
| `bae4ab9` | About page redesign, Messages filters, testimonies tidy-up |
| `5e5c395` | About: Vision photo layout, two-column leadership, brighter banner |
| `282d83d` | Messages: compact one-row icon filter *(in progress)* |
| `9d68ae0` | Grace chat on every page |
| `522f059` | About: rounded corners on the Mission / How we do it slider |
| `04f06f5` | About hero: full-resolution original photo, soft faded edges |
| `1901683` | About: tidy curved fade on the Vision photo |
| `8452544` | About: colours matched to the hero yellow and banner purple |
| `db562a2` | About: dark purple for Mission, Vision and "Their story"; How we do it unchanged |
| `4c4f7b5` | Site: consistent 200ms button transitions, smooth logo and page crossfade |
| `9b76bff` | About: redesigned Statement of Faith (bordered cards, hover/tap reveal) |
| `aedfe13` | Chat: round launcher, pop-in, and bounce nudge for long scrolling |
| `34146fb` | About: "Who we are becoming" banner in the dark panel purple (superseded by `8c4d234`) |
| `1a016fb` | About: full-resolution Vision, Mission and Pastor David photos; richer Vision gradient |
| `8c4d234` | About: light, misty "Who we are becoming" banner echoing the hero |
| `0ff9330` | About: Statement of Faith title cards that expand to the full text |
| `d67a792` | Events: new hero background (banquet), full resolution *(in progress)* |
| `133e131` | Events: icon category row, Apple-style slideshow, Sunday/Midweek directions with branch picker *(in progress)* |
| `fdce6a7` | Events: fix slideshow/info overlap, thinner and larger mono icons *(in progress)* |
| `5cea1d3` | Events: shared Sunday/Midweek icon, six-card "Happening at our church" with Show more, "9:00 AM" times, month heading removed *(in progress)* |

`f4f95a7` tried a full-width photo-and-list Statement of Faith and was reverted in `128b427`, so it has no net effect.

These update notes live in `docs/updates/2026-10-14-about-messages/` and were added in docs commits on the same branch (part of one refresh rode along in `1a016fb`).

## How to test

1. `npm install`, then `npm run dev:main` and open <http://localhost:3000>.
2. **About** (`/about`): scroll the whole page. Check that the Greek words paint in, the Mission cards swipe on a phone-sized window, and `/about#vision`, `/about#leadership` and `/about#faith` jump to the right place.
3. **Statement of Faith:** on desktop, hover a card (or Tab to it) and check it expands to the full statement. On a phone-sized window, tap a card to open it and tap again to close it.
4. **Chat:** on any page, click the round purple button in the bottom-right corner, pick an option and send a message. Press Esc to close it, then move to another page and reopen it; the conversation should still be there. In a fresh tab, scroll down a long page without opening the chat and the button should bounce with "Need help?". Replies need `GEMINI_API_KEY` in `apps/main/.env.local`.
5. **Navigation:** from any page, click the Kharis logo or a header link; the page should crossfade rather than snap. Hover a few buttons and check they all ease the same way.
6. **Homepage:** the Testimonies section should show only the photos and the "Share Your Testimony" button.
7. **Messages** (`/messages`, in progress): try a topic and a year, then press Clear.
8. **Events** (`/events`, in progress): click through the icons, play and pause a slideshow, pick a different branch under Sunday Service and check Get directions opens the right address, then press "Show more dates".

## Deploying

Merging to `main` triggers the `deploy-main` workflow, which ships to Cloudflare. To deploy by hand, run `npm run deploy:main`. Before the chat can answer on the live site, make sure the `GEMINI_API_KEY` secret is set on the Cloudflare worker. Before launch, the Statement of Faith header photo and the Events slideshow photos need replacing, and "Test location" needs fixing in the events database.
