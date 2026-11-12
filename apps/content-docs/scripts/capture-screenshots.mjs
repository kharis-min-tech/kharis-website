/**
 * Captures every docs screenshot from a running Content Studio, in light and dark.
 *
 *   npm run screenshots                 all shots
 *   npm run screenshots -- events users only the named shots
 *
 * Needs the studio dev server (STUDIO_URL, default http://localhost:3002) and the Kharis
 * API it points at. The first run opens Microsoft Edge so you can sign in once; the
 * session is kept in .auth/studio.json, which is git-ignored. Visitors, messages,
 * subscribers, accounts and other personal data are replaced with demo rows from
 * fixtures.mjs before anything is drawn, and the signed-in email becomes DEMO_EMAIL.
 */
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import { DEMO_EMAIL, buildFixtures, matches } from "./fixtures.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const STUDIO = (process.env.STUDIO_URL ?? "http://localhost:3002").replace(/\/+$/, "");
const AUTH_FILE = resolve(root, ".auth/studio.json");
const OUT = resolve(root, "public/screenshots");
const VIEWPORT = { width: 1440, height: 900 };
const SCALE = 1.5;

async function apiBase() {
  if (process.env.KHARIS_API_URL) return process.env.KHARIS_API_URL.replace(/\/+$/, "");
  const env = await readFile(resolve(root, "../content/.env.local"), "utf8").catch(() => "");
  const match = env.match(/^NEXT_PUBLIC_KHARIS_API_URL=(.+)$/m);
  return (match?.[1]?.trim().replace(/^["']|["']$/g, "") || "http://localhost:4000").replace(
    /\/+$/,
    "",
  );
}

/** Each shot is captured twice: name.png (light) and name-dark.png. */
const SHOTS = [
  { name: "sign-in", path: "/", signedIn: false, ready: "form button[type=submit]" },
  { name: "set-password", path: "/set-password", ready: "text=Save password" },
  { name: "waiting-for-access", path: "/", me: { role: "none" }, ready: "text=Check again" },
  { name: "overview", path: "/", ready: "h1:has-text('Good')" },
  {
    name: "overview-branch-admin",
    path: "/",
    me: { role: "branch_admin", branches: 1 },
    ready: "h1:has-text('Good')",
  },
  { name: "workspace", path: "/workspace/general", ready: "text=Department Videos" },
  { name: "pick-workspace", path: "/events", ready: "text=Choose a workspace" },
  { name: "branches", path: "/branches?workspace=general", ready: "main ul li button" },
  {
    name: "branch-editor",
    path: "/branches?workspace=general",
    ready: "main ul li button",
    act: async (page) => {
      await page.locator("main ul li button").first().click();
      await page.getByRole("button", { name: "Save branch" }).waitFor();
    },
  },
  { name: "events", path: "/events?workspace=kharis", ready: "text=Night of Worship" },
  {
    name: "event-editor",
    path: "/events?workspace=kharis",
    ready: "text=Night of Worship",
    act: async (page) => {
      await page.getByText("Night of Worship").click();
      await page.getByRole("button", { name: "Save event" }).waitFor();
    },
  },
  {
    name: "announcements",
    path: "/announcements?workspace=kharis",
    ready: "text=Christmas service times",
  },
  { name: "testimonies", path: "/testimonies?workspace=kharis", ready: "text=Abena Ofori" },
  {
    name: "messages",
    path: "/messages?workspace=kharis",
    ready: "text=Ama Mensah",
    act: async (page) => {
      await page.getByText("Ama Mensah").click();
      await page.getByRole("link", { name: "Reply" }).waitFor();
    },
  },
  { name: "visitors", path: "/visitors?workspace=general", ready: "text=Ruth Appiah" },
  { name: "newsletter", path: "/newsletter?workspace=general", ready: "text=esther.k@example.com" },
  { name: "sermons", path: "/sermons?workspace=general", ready: "text=Walking in Grace" },
  {
    name: "department-videos",
    path: "/department-videos?workspace=general",
    ready: "input[placeholder^='Search 24 departments']",
  },
  {
    name: "featured-video",
    path: "/featured-video?workspace=kharis",
    ready: "text=Welcome to Kharis Church",
  },
  {
    name: "grace",
    path: "/workspace/general",
    ready: "text=Department Videos",
    act: async (page) => {
      await page.getByRole("button", { name: "Ask Grace" }).click();
      await page.getByRole("button", { name: "Edit a branch" }).click();
      await page.getByText("Open the branch").waitFor();
    },
  },
  { name: "daily-reading", path: "/daily?workspace=app", ready: "text=The Good Shepherd" },
  {
    name: "daily-message",
    path: "/daily-message?workspace=app",
    ready: "text=Upcoming",
    act: async (page) => {
      await page.getByPlaceholder("Search title, speaker or scripture").fill("grace");
      await page.getByText("Grace for Every Season").waitFor();
    },
  },
  { name: "daily-prayers", path: "/daily-prayers?workspace=app", ready: "text=For our city" },
  { name: "bible", path: "/bible?workspace=app", ready: "text=Daily readings" },
  {
    name: "sermon-library",
    path: "/sermon-library?workspace=app",
    ready: "text=Search",
    act: async (page) => {
      await page.getByPlaceholder("Title, speaker or scripture").fill("grace");
      await page.getByText("Amazing Grace").waitFor();
    },
  },
  { name: "live", path: "/live?workspace=app", ready: "text=Live now" },
  { name: "users", path: "/users?workspace=general", ready: "text=london.admin@kharis.org" },
  {
    name: "user-invite",
    path: "/users?workspace=general",
    ready: "text=london.admin@kharis.org",
    act: async (page) => {
      await page.getByRole("button", { name: "Invite user" }).click();
      await page.locator("#user-email").fill("youth.admin@kharis.org");
      await page.locator("fieldset input[type=checkbox]").first().check();
      await page.getByRole("button", { name: "Send invite" }).waitFor();
    },
  },
];

const HIDE_DEV_UI = `
  nextjs-portal, [data-nextjs-toast], [data-next-badge-root] { display: none !important; }
  * { caret-color: transparent !important; }
`;

async function signInOnce(browser) {
  console.log(`No saved session. Sign in to ${STUDIO} in the Edge window that just opened.`);
  const context = await browser.newContext({ viewport: VIEWPORT });
  const page = await context.newPage();
  await page.goto(STUDIO);
  await page.locator("nav[aria-label=Studio]").waitFor({ timeout: 5 * 60 * 1000 });
  await mkdir(dirname(AUTH_FILE), { recursive: true });
  await context.storageState({ path: AUTH_FILE });
  await context.close();
}

function sessionOf(state) {
  const origin = state.origins?.find((item) => item.origin === STUDIO);
  const entry = origin?.localStorage?.find((item) => /^sb-.+-auth-token$/.test(item.name));
  if (!entry) throw new Error(`The saved session has no Supabase sign-in for ${STUDIO}.`);
  return JSON.parse(entry.value);
}

function swapEmail(text, realEmail) {
  return realEmail ? text.split(realEmail).join(DEMO_EMAIL) : text;
}

/** The saved session with the real email swapped out, so the UI never shows it. */
function demoState(state, realEmail) {
  return JSON.parse(swapEmail(JSON.stringify(state), realEmail));
}

async function settle(page) {
  await page.waitForLoadState("networkidle").catch(() => undefined);
  await page
    .waitForFunction(
      () =>
        !document.querySelector(".animate-pulse") &&
        !document.body.innerText.includes("Loading studio") &&
        [...document.images].every((image) => image.complete),
      undefined,
      { timeout: 15000 },
    )
    .catch(() => undefined);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);
}

async function main() {
  const only = new Set(process.argv.slice(2));
  const shots = only.size ? SHOTS.filter((shot) => only.has(shot.name)) : SHOTS;
  if (!shots.length) throw new Error(`No shots named ${[...only].join(", ")}.`);
  const api = await apiBase();
  const browser = await chromium.launch({ channel: "msedge", headless: existsSync(AUTH_FILE) });
  if (!existsSync(AUTH_FILE)) {
    await signInOnce(browser);
  }
  const saved = JSON.parse(await readFile(AUTH_FILE, "utf8"));
  const realEmail = sessionOf(saved).user?.email ?? "";
  await mkdir(OUT, { recursive: true });

  let fixtures = null;
  async function data(authorization) {
    if (fixtures) return fixtures;
    const response = await fetch(`${api}/v1/studio/data/branches/query`, {
      method: "POST",
      headers: { Authorization: authorization, "Content-Type": "application/json" },
      body: JSON.stringify({ view: "options", order: "name" }),
    });
    const payload = await response.json().catch(() => null);
    const branches = (Array.isArray(payload?.data) ? payload.data : []).filter(
      (branch) => branch.is_active !== false,
    );
    fixtures = buildFixtures({ branches });
    return fixtures;
  }

  let me = {};

  for (const theme of ["light", "dark"]) {
    const signedIn = await browser.newContext({
      viewport: VIEWPORT,
      deviceScaleFactor: SCALE,
      colorScheme: theme,
      storageState: demoState(saved, realEmail),
    });
    const signedOut = await browser.newContext({
      viewport: VIEWPORT,
      deviceScaleFactor: SCALE,
      colorScheme: theme,
    });

    for (const context of [signedIn, signedOut]) {
      await context.addInitScript(
        ({ theme: mode, css }) => {
          try {
            localStorage.setItem("kharis-content-theme", mode);
          } catch {}
          document.addEventListener("DOMContentLoaded", () => {
            const style = document.createElement("style");
            style.textContent = css;
            document.head.appendChild(style);
          });
        },
        { theme, css: HIDE_DEV_UI },
      );

      await context.route(/\/auth\/v1\//, async (route) => {
        const response = await route.fetch();
        const body = swapEmail(await response.text(), realEmail);
        await route.fulfill({ response, body });
      });

      await context.route(`${api}/v1/studio/**`, async (route) => {
        const request = route.request();
        const url = new URL(request.url());
        const origin = request.headers().origin ?? STUDIO;
        const cors = {
          "access-control-allow-origin": origin,
          "access-control-allow-credentials": "true",
        };
        const reply = (value) =>
          route.fulfill({ status: 200, headers: cors, json: { status: true, data: value } });
        if (request.method() === "OPTIONS") return route.continue();

        if (url.pathname === "/v1/studio/me") {
          const response = await route.fetch();
          const payload = JSON.parse(swapEmail(await response.text(), realEmail));
          if (me.role) {
            const { users } = await data(request.headers().authorization);
            const branchIds = users
              .filter((user) => user.role === "branch_admin")
              .flatMap((user) => user.branchIds)
              .slice(0, me.branches ?? 0);
            payload.data = { ...payload.data, role: me.role, branchIds };
          }
          return route.fulfill({ response, json: payload });
        }

        if (url.pathname === "/v1/studio/users" && request.method() === "GET") {
          return reply((await data(request.headers().authorization)).users);
        }

        const match = url.pathname.match(/^\/v1\/studio\/data\/([a-z_]+)\/(query|count)$/);
        if (match) {
          const { tables } = await data(request.headers().authorization);
          const rows = tables[match[1]];
          if (rows) {
            const body = request.postDataJSON() ?? {};
            const found = rows.filter((row) => matches(row, body.where));
            if (match[2] === "count") return reply({ count: found.length });
            return reply(body.limit ? found.slice(0, body.limit) : found);
          }
        }
        return route.continue();
      });

      await context.route(`${STUDIO}/api/sermons/search**`, async (route) => {
        const url = new URL(route.request().url());
        const { catalogue } = await data(route.request().headers().authorization ?? "");
        const ids = (url.searchParams.get("ids") ?? "").split(",").filter(Boolean);
        const needle = (url.searchParams.get("q") ?? "").toLowerCase();
        const sermons = ids.length
          ? catalogue.filter((sermon) => ids.includes(sermon.id))
          : catalogue.filter((sermon) =>
              `${sermon.title} ${sermon.speaker} ${sermon.scripture}`
                .toLowerCase()
                .includes(needle),
            );
        return route.fulfill({ json: { sermons } });
      });

      await context.route(`${STUDIO}/api/chat`, (route) =>
        route.fulfill({
          json: {
            ok: true,
            reply:
              "Branches live under [Branches](/branches?workspace=general). Open the branch, change its details, photos, venues or service times, then press Save branch.",
          },
        }),
      );
    }

    for (const shot of shots) {
      me = shot.me ?? {};
      const page = await (shot.signedIn === false ? signedOut : signedIn).newPage();
      await page.goto(`${STUDIO}${shot.path}`);
      await page.locator(shot.ready).first().waitFor({ timeout: 30000 });
      await settle(page);
      if (shot.act) {
        await shot.act(page);
        await settle(page);
      }
      await page.mouse.move(0, VIEWPORT.height - 1);
      const file = resolve(OUT, `${shot.name}${theme === "dark" ? "-dark" : ""}.png`);
      await page.screenshot({ path: file, animations: "disabled" });
      console.log(`${theme.padEnd(5)} ${shot.name}`);
      await page.close();
    }

    // Keep a refreshed token for the next run, with the real email back in place.
    const refreshed = JSON.stringify(await signedIn.storageState());
    await writeFile(AUTH_FILE, realEmail ? refreshed.split(DEMO_EMAIL).join(realEmail) : refreshed);
    await signedIn.close();
    await signedOut.close();
  }
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
