# Update: new About page, Grace chat on every page, smoother navigation, Messages filters (in progress)

**Branch:** `feature/about-messages-testimonies` · **Date:** 14 October 2026 · **App:** `apps/main` (kharis.org)

The About page has been rebuilt. The old Mission / Vision / Leadership tabs are gone; everything now sits on one scrolling page with a sharper hero photo, Greek word cards that paint themselves in, a dark-purple Mission card next to "How we do it", a full-width Vision card, a two-column Leadership section and a new card-based Statement of Faith. "Grace", the AI chat assistant that used to live only on the Life page, now opens from a round button on every page, and the button gently bounces with a "Need help?" bubble if someone keeps scrolling. Buttons across the site now share one smooth 200ms transition, and header and footer links crossfade between pages instead of snapping. On the homepage, the testimony quote carousel has been removed. The Messages page has a new topic and year filter, and YouTube Shorts no longer appear in the shelves. **Messages is still a work in progress** and will change again before it is final.

"Before" screenshots are from the current live site (<https://kharis-main.itadmin-a94.workers.dev/>). "After" screenshots are from this branch running locally. Desktop shots are 1440px wide; mobile shots are 390px wide.

**Contents**

1. [The new About page](#1-the-new-about-page)
2. [Grace AI chat on every page](#2-grace-ai-chat-on-every-page)
3. [About page, section by section](#3-about-page-section-by-section)
4. [Buttons and navigation](#4-buttons-and-navigation)
5. [Homepage testimonies](#5-homepage-testimonies)
6. [🚧 Messages (in progress)](#6--messages-in-progress-not-final)
7. [Commits](#commits) · [How to test](#how-to-test) · [Deploying](#deploying)

---

## 1. The new About page

The whole page from the top down to the footer. The footer itself hasn't changed.

**At a glance**

| Before (live) | After (this branch) |
| --- | --- |
| ![About page before](./about-full-before-overview.jpg) | ![About page after](./about-full-after-overview.jpg) |

**After, full size (desktop)**

![New About page, part 1](./about-full-after-1.jpg)
![New About page, part 2](./about-full-after-2.jpg)
![New About page, part 3](./about-full-after-3.jpg)

**After on a phone (390px), read left to right**

| Top | Middle | Bottom |
| --- | --- | --- |
| <img src="./about-full-after-mobile-1.jpg" alt="About on mobile, top" width="260"> | <img src="./about-full-after-mobile-2.jpg" alt="About on mobile, middle" width="260"> | <img src="./about-full-after-mobile-3.jpg" alt="About on mobile, bottom" width="260"> |

<details>
<summary>Before, full size (desktop)</summary>

![Old About page, part 1](./about-full-before-1.jpg)
![Old About page, part 2](./about-full-before-2.jpg)

</details>

---

## 2. Grace AI chat on every page

Before, the chat assistant was **only on the Life page**. Now a round purple button pops in at the bottom-right corner of every page. On desktop it opens a small chat window, and on phones it opens full screen. Grace greets visitors with quick options (find a branch, baptism/fasting/serving, faith and prayer, Pastor David's messages) or lets them type their own question. The conversation carries over as you move between pages, and the Life page keeps its "Need any help?" prompt.

**Gentle nudge.** If someone scrolls a long way (about two and a half screens) or browses for a while without opening the chat, the button bounces and shows a short "Need help?" bubble. This happens at most three times per visit, with a pause between nudges, and stops as soon as the chat has been opened.

> **Note:** chat replies need the `GEMINI_API_KEY` secret set on the Cloudflare worker for the live site. Without it the chat window still opens, but Grace can't answer.

| Before | Round launcher | Bounce nudge while scrolling |
| --- | --- | --- |
| Only on the Life page | <img src="./ai-chat-launcher.jpg" alt="Round chat launcher" width="160"> | ![Launcher bouncing with a Need help? bubble](./ai-chat-bounce.jpg) |

| Chat open (desktop) | Chat open (phone) |
| --- | --- |
| ![Grace chat open on the About page](./ai-chat-every-page.jpg) | <img src="./ai-chat-every-page-mobile.jpg" alt="Grace chat on a phone" width="260"> |

---

## 3. About page, section by section

### Hero

New photo of three church members in Kharis shirts, now loaded at full resolution with soft faded edges, in place of the street-march photo. The wording is the same.

| Before | After |
| --- | --- |
| ![About hero before](./about-hero-before.jpg) | ![About hero after](./about-hero-after.jpg) |
| <img src="./about-hero-before-mobile.jpg" alt="About hero before, mobile" width="300"> | <img src="./about-hero-after-mobile.jpg" alt="About hero after, mobile" width="300"> |

### Greek word cards

The cards are now white with a purple bar on the left. When they scroll into view, the Greek words (χάρις and λειτουργία) paint themselves in and get a yellow underline. The screenshot shows how they look once the animation has finished.

| Before | After (finished state) |
| --- | --- |
| ![Greek words before](./about-greek-before.jpg) | ![Greek words after](./about-greek-after.jpg) |

### "Who we are becoming" banner

The banner is brighter, with warm gold glows in the corners and a gold line underneath.

| Before | After |
| --- | --- |
| ![Banner before](./about-banner-before.jpg) | ![Banner after](./about-banner-after.jpg) |

### Mission and "How we do it"

Before, Mission, Vision and Leadership sat behind tabs, so only one showed at a time, and the four ways we fulfil the mission each needed a click. Now there are no tabs. A dark-purple photo card shows the mission statement, and next to it a "How we do it" card lists all four ways with their Bible references. Both cards have rounded corners. On phones they form a swipeable row.

| Before | After |
| --- | --- |
| ![Mission before](./about-mission-before.jpg) | ![Mission after](./about-mission-after.jpg) |
| <img src="./about-mission-before-mobile.jpg" alt="Mission before, mobile" width="300"> | <img src="./about-mission-after-mobile.jpg" alt="Mission after, mobile" width="300"> |

### Vision

Before, the vision points showed one at a time with Previous / Next buttons. Now one full-width dark-purple card shows all eight points with icons, and a church family photo fades in underneath with a soft curved edge.

| Before | After |
| --- | --- |
| ![Vision before](./about-vision-before.jpg) | ![Vision after](./about-vision-after.jpg) |
| <img src="./about-vision-before-mobile.jpg" alt="Vision before, mobile" width="300"> | <img src="./about-vision-after-mobile.jpg" alt="Vision after, mobile" width="300"> |

### Leadership

Pastors David and Awo are now in two cards side by side (Pastor David has a new photo). Their shared story sits in a dark-purple panel below, with an "Explore Kharis Life" button. The old layout had a lot of empty space at the bottom, and that's gone.

| Before | After |
| --- | --- |
| ![Leadership before](./about-leadership-before.jpg) | ![Leadership after](./about-leadership-after.jpg) |
| <img src="./about-leadership-before-mobile.jpg" alt="Leadership before, mobile" width="300"> | <img src="./about-leadership-after-mobile.jpg" alt="Leadership after, mobile" width="300"> |

### Statement of Faith

Before, the eight statements were a plain list that opened one at a time. Now they sit under a photo header as a grid of square bordered cards, each with an icon, its number, the title and a short preview. On desktop, hovering a card turns it dark and shows the full statement with Bible references. On phones the cards are a list, and tapping one opens it.

> **Placeholders:** the Bible references on each card are suggestions and are **pending pastoral review**. The header photo (an open Bible) is a **placeholder** to be swapped for the final image.

| Before | After |
| --- | --- |
| ![Statement of Faith before](./about-faith-before.jpg) | ![Statement of Faith after](./about-faith-after.jpg) |
| <img src="./about-faith-before-mobile.jpg" alt="Statement of Faith before, mobile" width="300"> | <img src="./about-faith-after-mobile.jpg" alt="Statement of Faith after, mobile" width="300"> |

| After: hovering a card (desktop) | After: tapping a card (phone) |
| --- | --- |
| ![Statement of Faith, card hovered](./about-faith-hover-after.jpg) | <img src="./about-faith-tap-after-mobile.jpg" alt="Statement of Faith, card tapped on mobile" width="300"> |

Links like `/about#mission`, `/about#vision`, `/about#leadership` and `/about#faith` still jump to the right section.

---

## 4. Buttons and navigation

- **One smooth timing for every button.** Buttons and calls to action across the site (header, footer, modals and branch pages) now use the same 200ms transition, so hovers and presses feel consistent instead of some snapping and some easing.
- **Pages crossfade.** Links in the header and footer now crossfade into the next page instead of jumping. Clicking the Kharis logo fades smoothly back to the homepage, and clicking it while already on the homepage glides back to the top. Browsers without support, and visitors who have "reduce motion" turned on, navigate normally.

| Mid-crossfade: About page fading into the homepage after clicking the logo |
| --- |
| ![Logo crossfade from About to the homepage](./nav-logo-crossfade.jpg) |

---

## 5. Homepage testimonies

The "From the family" quote cards and their arrow buttons are gone, so the section is now the three photos and the "Share Your Testimony" button. The homepage also stops loading testimony data it no longer shows.

| Before | After |
| --- | --- |
| ![Testimonies before](./home-testimonies-before.jpg) | ![Testimonies after](./home-testimonies-after.jpg) |
| <img src="./home-testimonies-before-mobile.jpg" alt="Testimonies before, mobile" width="300"> | <img src="./home-testimonies-after-mobile.jpg" alt="Testimonies after, mobile" width="300"> |

---

## 6. 🚧 Messages: in progress, not final

> **In progress:** Messages is still being worked on. These screenshots show where it stands today, and the design will change.

**Filter row.** A new row of topic buttons with icons (All, Jesus, Bible, Prayer, Love, Purpose, Acts, Just Men, Fragrance) and a Year drop-down. Picking a filter swaps the shelves for a grid of matching messages, with a count and a Clear button. On phones the topic row scrolls sideways.

| Before (no filter) | After (work in progress) |
| --- | --- |
| ![Messages filter area before](./messages-filter-before.jpg) | ![Messages filter area after](./messages-filter-after.jpg) |
| <img src="./messages-filter-before-mobile.jpg" alt="Messages before, mobile" width="300"> | <img src="./messages-filter-after-mobile.jpg" alt="Messages filter after, mobile" width="300"> |

**Shorts removed from the shelves.** YouTube Shorts (videos of 3 minutes or less), such as "What does the bible sound like? #LetTheBibleSpeak" and "You call yourself a Christian BUT...", no longer show up as messages. They're visible in the "before" shelf below.

> The local preview pulls a smaller YouTube feed than the live site, so the "after" shelf has fewer tiles overall for data reasons as well as the Shorts change. Compare the kinds of videos, not the tile count.

| Before | After (work in progress) |
| --- | --- |
| ![Messages shelf before](./messages-shelf-before.jpg) | ![Messages shelf after](./messages-shelf-after.jpg) |

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

These update notes are added in separate docs commits on the same branch.

## How to test

1. `npm install`, then `npm run dev:main` and open <http://localhost:3000>.
2. **About** (`/about`): scroll the whole page. Check that the Greek words paint in, the Mission cards swipe on a phone-sized window, and `/about#vision`, `/about#leadership` and `/about#faith` jump to the right place.
3. **Statement of Faith:** on desktop, hover each card to read the full statement. On a phone-sized window, tap a card to open it and tap again to close it.
4. **Chat:** on any page, click the round purple button in the bottom-right corner, pick an option and send a message. Press Esc to close it, then move to another page and reopen it; the conversation should still be there. In a fresh tab, scroll down a long page without opening the chat and the button should bounce with "Need help?". Replies need `GEMINI_API_KEY` in `apps/main/.env.local`.
5. **Navigation:** from any page, click the Kharis logo or a header link; the page should crossfade rather than snap. Hover a few buttons and check they all ease the same way.
6. **Homepage:** the Testimonies section should show only the photos and the "Share Your Testimony" button.
7. **Messages** (`/messages`, in progress): try a topic and a year, then press Clear.

## Deploying

Merging to `main` triggers the `deploy-main` workflow, which ships to Cloudflare. To deploy by hand, run `npm run deploy:main`. Before the chat can answer on the live site, make sure the `GEMINI_API_KEY` secret is set on the Cloudflare worker. Before launch, the Statement of Faith references need pastoral sign-off and its header photo needs replacing.
