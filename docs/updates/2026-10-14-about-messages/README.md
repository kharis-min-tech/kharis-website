# Update: new About page, Grace chat on every page, Messages filters (in progress)

**Branch:** `feature/about-messages-testimonies` · **Date:** 14 October 2026 · **App:** `apps/main` (kharis.org)

The About page has been rebuilt. The old Mission / Vision / Leadership tabs are gone; everything now sits on one scrolling page with a new hero photo, painted Greek word cards, a photo-led Mission card next to "How we do it", a full-width Vision card and a two-column Leadership section. "Grace", the AI chat assistant that used to live only on the Life page, now opens from a button on every page. On the homepage, the testimony quote carousel has been removed so the section is just the photos and the "Share Your Testimony" button. The Messages page has a new topic and year filter, and YouTube Shorts no longer appear in the message shelves. **Messages is still a work in progress** and will change again before it is final.

"Before" screenshots are from the current live site (<https://kharis-main.itadmin-a94.workers.dev/>). "After" screenshots are from this branch running locally. Desktop shots are 1440px wide; mobile shots are 390px wide.

**Contents**

1. [The new About page](#1-the-new-about-page)
2. [Grace AI chat on every page](#2-grace-ai-chat-on-every-page)
3. [About page, section by section](#3-about-page-section-by-section)
4. [Homepage testimonies](#4-homepage-testimonies)
5. [🚧 Messages (in progress)](#5--messages-in-progress-not-final)
6. [Commits](#commits) · [How to test](#how-to-test) · [Deploying](#deploying)

---

## 1. The new About page

The whole page from the top down to Leadership. The Statement of Faith and the footer haven't changed, so they're left out.

**At a glance**

| Before (live) | After (this branch) |
| --- | --- |
| ![About page before](./about-full-before-overview.jpg) | ![About page after](./about-full-after-overview.jpg) |

**After, full size (desktop)**

![New About page, part 1](./about-full-after-1.jpg)
![New About page, part 2](./about-full-after-2.jpg)

**After on a phone (390px), read left to right**

| Top | Middle | Bottom |
| --- | --- | --- |
| <img src="./about-full-after-mobile-1.jpg" alt="About on mobile, top" width="260"> | <img src="./about-full-after-mobile-2.jpg" alt="About on mobile, middle" width="260"> | <img src="./about-full-after-mobile-3.jpg" alt="About on mobile, bottom" width="260"> |

---

## 2. Grace AI chat on every page

Before, the chat assistant was **only on the Life page**. Now a square purple button sits in the bottom-right corner of every page. On desktop it opens a small chat window, and on phones it opens full screen. Grace greets visitors with quick options (find a branch, baptism/fasting/serving, faith and prayer, Pastor David's messages) or lets them type their own question. The conversation carries over as you move between pages, and the Life page keeps its "Need any help?" prompt.

> **Note:** chat replies need the `GEMINI_API_KEY` secret set on the Cloudflare worker for the live site. Without it the chat window still opens, but Grace can't answer.

| Before | After (desktop) | After (phone) |
| --- | --- | --- |
| Only on the Life page | ![Grace chat open on the About page](./ai-chat-every-page.jpg) | <img src="./ai-chat-every-page-mobile.jpg" alt="Grace chat on a phone" width="260"> |

---

## 3. About page, section by section

### Hero

New photo of three church members in Kharis shirts, with a purple tint and soft faded edges, in place of the street-march photo. The wording is the same.

| Before | After |
| --- | --- |
| ![About hero before](./about-hero-before.jpg) | ![About hero after](./about-hero-after.jpg) |
| <img src="./about-hero-before-mobile.jpg" alt="About hero before, mobile" width="300"> | <img src="./about-hero-after-mobile.jpg" alt="About hero after, mobile" width="300"> |

### Greek word cards

When the cards scroll into view, the Greek words (χάρις and λειτουργία) now paint themselves in with a pen-stroke underline. The screenshot shows how they look once the animation has finished.

| Before | After (finished state) |
| --- | --- |
| ![Greek words before](./about-greek-before.jpg) | ![Greek words after](./about-greek-after.jpg) |

### "Who we are becoming" banner

The banner is brighter, with warm gold glows in the corners and a gold line underneath.

| Before | After |
| --- | --- |
| ![Banner before](./about-banner-before.jpg) | ![Banner after](./about-banner-after.jpg) |

### Mission and "How we do it"

Before, Mission, Vision and Leadership sat behind tabs, so only one showed at a time, and the four ways we fulfil the mission each needed a click. Now there are no tabs. A photo card shows the mission statement, and next to it a "How we do it" card lists all four ways with their Bible references. Both cards have rounded corners. On phones they form a swipeable row.

| Before | After |
| --- | --- |
| ![Mission before](./about-mission-before.jpg) | ![Mission after](./about-mission-after.jpg) |
| <img src="./about-mission-before-mobile.jpg" alt="Mission before, mobile" width="300"> | <img src="./about-mission-after-mobile.jpg" alt="Mission after, mobile" width="300"> |

### Vision

Before, the vision points showed one at a time with Previous / Next buttons. Now one full-width purple card shows all eight points with icons, and a church family photo fades in underneath.

| Before | After |
| --- | --- |
| ![Vision before](./about-vision-before.jpg) | ![Vision after](./about-vision-after.jpg) |
| <img src="./about-vision-before-mobile.jpg" alt="Vision before, mobile" width="300"> | <img src="./about-vision-after-mobile.jpg" alt="Vision after, mobile" width="300"> |

### Leadership

Pastors David and Awo are now in two cards side by side (Pastor David has a new photo). Their shared story sits in a purple panel below, with an "Explore Kharis Life" button. The old layout had a lot of empty space at the bottom, and that's gone.

| Before | After |
| --- | --- |
| ![Leadership before](./about-leadership-before.jpg) | ![Leadership after](./about-leadership-after.jpg) |
| <img src="./about-leadership-before-mobile.jpg" alt="Leadership before, mobile" width="300"> | <img src="./about-leadership-after-mobile.jpg" alt="Leadership after, mobile" width="300"> |

Links like `/about#mission`, `/about#vision` and `/about#leadership` still jump to the right section.

---

## 4. Homepage testimonies

The "From the family" quote cards and their arrow buttons are gone, so the section is now the three photos and the "Share Your Testimony" button. The homepage also stops loading testimony data it no longer shows.

| Before | After |
| --- | --- |
| ![Testimonies before](./home-testimonies-before.jpg) | ![Testimonies after](./home-testimonies-after.jpg) |
| <img src="./home-testimonies-before-mobile.jpg" alt="Testimonies before, mobile" width="300"> | <img src="./home-testimonies-after-mobile.jpg" alt="Testimonies after, mobile" width="300"> |

---

## 5. 🚧 Messages: in progress, not final

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
| `04f06f5` | About hero: original photo quality, soft faded edges |
| `1901683` | About: tidy soft fade on Vision photo |

These update notes are added in a separate docs commit on the same branch.

## How to test

1. `npm install`, then `npm run dev:main` and open <http://localhost:3000>.
2. **About** (`/about`): scroll the whole page. Check that the Greek words paint in, the Mission cards swipe on a phone-sized window, and `/about#vision` and `/about#leadership` jump to the right place.
3. **Chat:** on any page, click the purple button in the bottom-right corner, pick an option and send a message. Press Esc to close it, then move to another page and reopen it; the conversation should still be there. Replies need `GEMINI_API_KEY` in `apps/main/.env.local`.
4. **Homepage:** the Testimonies section should show only the photos and the "Share Your Testimony" button.
5. **Messages** (`/messages`, in progress): try a topic and a year, then press Clear.

## Deploying

Merging to `main` triggers the `deploy-main` workflow, which ships to Cloudflare. To deploy by hand, run `npm run deploy:main`. Before the chat can answer on the live site, make sure the `GEMINI_API_KEY` secret is set on the Cloudflare worker.
