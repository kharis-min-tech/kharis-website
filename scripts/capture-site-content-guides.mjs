/**
 * Capture section guide stills from local Main / KP2 for Site Contents Studio.
 *
 * Requires: npx playwright (chromium). Sites on :3000 and :3001.
 *
 *   node scripts/capture-site-content-guides.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "tmp", "site-content-guides");

const SHOTS = [
  {
    workspace: "kharis",
    page: "home",
    section: "hero",
    url: "http://localhost:3000/",
    selector: "#top",
  },
  {
    workspace: "kharis",
    page: "home",
    section: "knowUs",
    url: "http://localhost:3000/#know",
    selector: "#know",
  },
  {
    workspace: "kharis",
    page: "home",
    section: "buildHouse",
    url: "http://localhost:3000/#give",
    selector: "#give",
  },
  {
    workspace: "kharis",
    page: "home",
    section: "testimonyPhotos",
    url: "http://localhost:3000/#testimonies",
    selector: "#testimonies",
  },
  {
    workspace: "kharis",
    page: "home",
    section: "appScreens",
    url: "http://localhost:3000/#vision",
    selector: "#vision",
  },
  {
    workspace: "kharis",
    page: "about",
    section: "scrollHero",
    url: "http://localhost:3000/about?view=scroll",
    selector: "main",
  },
  {
    workspace: "kharis",
    page: "give",
    section: "heroStack",
    url: "http://localhost:3000/give",
    selector: "main",
  },
  {
    workspace: "kharis",
    page: "give",
    section: "buildingPhoto",
    url: "http://localhost:3000/give#building",
    selector: "#building",
  },
  {
    workspace: "kharis",
    page: "contact",
    section: "heroSpotlight",
    url: "http://localhost:3000/contact",
    selector: ".hello-hero, main",
  },
  {
    workspace: "kharis",
    page: "contact",
    section: "letterPhoto",
    url: "http://localhost:3000/contact#write",
    selector: "#write",
  },
  {
    workspace: "kharis",
    page: "events",
    section: "hero",
    url: "http://localhost:3000/events",
    selector: "main header, .events-top, main",
  },
  {
    workspace: "kharis",
    page: "life",
    section: "departmentsBand",
    url: "http://localhost:3000/life/departments",
    selector: ".life-dept-hero, main",
  },
  {
    workspace: "kp2",
    page: "home",
    section: "heroMosaic",
    url: "http://localhost:3001/",
    selector: ".kp-home-hero, header",
  },
  {
    workspace: "kp2",
    page: "home",
    section: "introPhoto",
    url: "http://localhost:3001/",
    selector: ".kp-home-intro, main",
  },
  {
    workspace: "kp2",
    page: "home",
    section: "pastorPhoto",
    url: "http://localhost:3001/#pastor",
    selector: "#pastor",
  },
  {
    workspace: "kp2",
    page: "home",
    section: "testimonyPhotos",
    url: "http://localhost:3001/#testimonies",
    selector: "#testimonies",
  },
  {
    workspace: "kp2",
    page: "home",
    section: "appScreens",
    url: "http://localhost:3001/#app",
    selector: "#app",
  },
  {
    workspace: "kp2",
    page: "mission",
    section: "aboutHero",
    url: "http://localhost:3001/mission#mission",
    selector: "main",
  },
  {
    workspace: "kp2",
    page: "giving",
    section: "heroStack",
    url: "http://localhost:3001/giving",
    selector: "main",
  },
  {
    workspace: "kp2",
    page: "contact",
    section: "letterPhoto",
    url: "http://localhost:3001/contact",
    selector: "main",
  },
  {
    workspace: "kp2",
    page: "messages",
    section: "heroBackground",
    url: "http://localhost:3001/messages",
    selector: "main header, .kp-messages-hero, main",
  },
  {
    workspace: "kp2",
    page: "media",
    section: "hero",
    url: "http://localhost:3001/media",
    selector: "main",
  },
  {
    workspace: "kp2",
    page: "life",
    section: "lifeHero",
    url: "http://localhost:3001/life",
    selector: "main",
  },
];

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 1,
});
const page = await context.newPage();

for (const shot of SHOTS) {
  const name = `${shot.workspace}__${shot.page}__${shot.section}.jpg`;
  const dest = path.join(outDir, name);
  try {
    await page.goto(shot.url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(1200);
    const skip = page.getByRole("button", { name: /skip intro/i });
    if (await skip.count()) {
      await skip
        .first()
        .click({ timeout: 2000 })
        .catch(() => {});
      await page.waitForTimeout(600);
    }
    const loc = page.locator(shot.selector).first();
    if ((await loc.count()) === 0) {
      console.warn(`Missing selector for ${name}: ${shot.selector}`);
      await page.screenshot({ path: dest, type: "jpeg", quality: 72, fullPage: false });
    } else {
      await loc.scrollIntoViewIfNeeded().catch(() => {});
      await page.waitForTimeout(400);
      await loc.screenshot({ path: dest, type: "jpeg", quality: 72 });
    }
    console.log(`Captured ${name}`);
  } catch (error) {
    console.warn(`Failed ${name}:`, error instanceof Error ? error.message : error);
  }
}

await browser.close();
console.log(`Guides in ${outDir}`);
