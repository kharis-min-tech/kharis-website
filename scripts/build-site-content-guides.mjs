/**
 * RETIRED for Studio guideImages — do not use for Site Contents Preview.
 * Guides must be real desktop section screenshots (see upload-site-content-guides.mjs),
 * not media collages. Kept only as a historical helper for collage experiments.
 *
 *   node scripts/build-site-content-guides.mjs
 */
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import https from "node:https";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

process.env.NODE_TLS_REJECT_UNAUTHORIZED ??= "0";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "tmp", "site-content-guides");

// Keep in sync with apps/content/lib/site-contents-defaults.ts defaults.
const GUIDES = [
  {
    key: "kharis__home__hero",
    label: "Home · Hero",
    urls: [
      "https://images.kharis.org/site-images/main/60262eef48c53cc5/locations/london-sunday-smiles.jpg",
      "https://images.kharis.org/site-images/main/1cd1968f552f6970/hero/worship-altar.jpg",
      "https://images.kharis.org/site-images/main/00a8e9b517ac4517/hero/easter-bibles-raised.jpg",
    ],
  },
  {
    key: "kharis__home__knowUs",
    label: "Home · Know Us",
    urls: [
      "https://images.kharis.org/site-images/main/529646bbc41f3bc3/community.jpg",
      "https://images.kharis.org/site-images/main/012b86affad979dd/home/kp2-community.webp",
      "https://images.kharis.org/site-images/main/de005ef42ce5304e/get-involved-sax.jpg",
      "https://images.kharis.org/site-images/main/e06e47b90f538fed/events/singles-ball/ballroom-overview.jpg",
    ],
  },
  {
    key: "kharis__home__buildHouse",
    label: "Home · Build the House",
    urls: ["https://images.kharis.org/site-images/main/8f521cd8c5d3a713/spurgeons-impression.jpg"],
  },
  {
    key: "kharis__home__testimonyPhotos",
    label: "Home · Testimonies",
    urls: [
      "https://images.kharis.org/site-images/main/283f42aec09d96a1/testimony-sharing.jpg",
      "https://images.kharis.org/site-images/main/cc4f9c67e2c899e3/testimony-stage-1.jpg",
      "https://images.kharis.org/site-images/main/f841b0d98ce0840e/testimony-stage-2.jpg",
    ],
  },
  {
    key: "kharis__home__appScreens",
    label: "Home · App screens",
    urls: [
      "https://images.kharis.org/site-images/main/4275eecdf5e5a12c/app-steps/kharis-app-current-home.png",
      "https://images.kharis.org/site-images/main/f7dfca4f99bbe8a3/app-steps/kharis-app-current-player.png",
      "https://images.kharis.org/site-images/main/0706ed3bc435673c/app-steps/kharis-app-current-chapter.png",
    ],
  },
  {
    key: "kharis__about__scrollHero",
    label: "About · Scroll hero",
    urls: ["https://images.kharis.org/site-images/main/e01fad6602636193/about-outreach-hero.jpg"],
  },
  {
    key: "kharis__about__missionHero",
    label: "About · Mission",
    urls: [
      "https://images.kharis.org/site-images/main/11577f5e512c33cd/about-mission-outreach.jpg",
    ],
  },
  {
    key: "kharis__about__visionHero",
    label: "About · Vision",
    urls: ["https://images.kharis.org/site-images/main/a080e8123b487573/vision-church-family.jpg"],
  },
  {
    key: "kharis__about__leadershipHero",
    label: "About · Leadership",
    urls: [
      "https://images.kharis.org/site-images/main/61b5f617ef58872c/about-pastors-portrait.jpg",
    ],
  },
  {
    key: "kharis__give__heroStack",
    label: "Give · Hero stack",
    urls: [
      "https://images.kharis.org/site-images/main/8527db06a4968c60/give/thanksgiving-hands-raised.jpg",
      "https://images.kharis.org/site-images/main/e686a4818115ee4e/give/thanksgiving-hall.jpg",
      "https://images.kharis.org/site-images/main/72e8b112e585bed6/give/thanksgiving-heart-hands.jpg",
    ],
  },
  {
    key: "kharis__give__buildingPhoto",
    label: "Give · Building",
    urls: ["https://images.kharis.org/site-images/main/8f521cd8c5d3a713/spurgeons-impression.jpg"],
  },
  {
    key: "kharis__contact__heroSpotlight",
    label: "Contact · Hero",
    urls: [
      "https://images.kharis.org/site-images/main/56fc2395a9b23afb/contact/easter-welcome-wave.jpg",
      "https://images.kharis.org/site-images/main/421991ee4530d49b/contact/easter-door-greeter.jpg",
      "https://images.kharis.org/site-images/main/548f1d84de49653b/contact/after-service-handshake.jpg",
      "https://images.kharis.org/site-images/main/fb9b5e9814886abb/contact/service-prayer.jpg",
    ],
  },
  {
    key: "kharis__contact__letterPhoto",
    label: "Contact · Letter",
    urls: [
      "https://images.kharis.org/site-images/main/67210f0fba54b6a1/contact/after-service-conversation.jpg",
    ],
  },
  {
    key: "kharis__events__hero",
    label: "Events · Hero",
    urls: ["https://images.kharis.org/site-images/main/4ad6b94f8e2d8cf0/events-hero-banquet.jpg"],
  },
  {
    key: "kharis__life__departmentsBand",
    label: "Life · Departments",
    urls: [
      "https://images.kharis.org/site-images/main/c7e0b460a01f93eb/about-vision-team-2048.jpg",
    ],
  },
  {
    key: "kharis__life__categoryCards",
    label: "Life · Categories",
    urls: [
      "https://images.kharis.org/site-images/main/571e499ea60fdffc/branch-slide-1.jpg",
      "https://images.kharis.org/site-images/main/ffbe5aca25d25b8c/pastor-stage.jpg",
      "https://images.kharis.org/site-images/main/eaaa3446e38fc4e3/life-departments.jpg",
    ],
  },
  {
    key: "kharis__messages__listenPosters",
    label: "Messages · Listen",
    urls: [
      "https://i.ytimg.com/vi/KBFfpU0mX2U/maxresdefault.jpg",
      "https://i.ytimg.com/vi/9uYPZYrTHIA/maxresdefault.jpg",
      "https://i.ytimg.com/vi/NOiT8EPTMrg/maxresdefault.jpg",
      "https://i.ytimg.com/vi/ys4CMmykRh8/maxresdefault.jpg",
    ],
  },
  {
    key: "kp2__home__heroMosaic",
    label: "KP2 · Hero mosaic",
    urls: [
      "https://images.kharis.org/site-images/kp2/88a52cf2f36e4dba/choir-video-poster.jpg",
      "https://images.kharis.org/site-images/kp2/6a42a25165e3e08a/crowd-poster.jpg",
      "https://images.kharis.org/site-images/kp2/a20adefe3b0f9d7a/choir2-poster.jpg",
      "https://images.kharis.org/site-images/kp2/2777b7351167f611/dancing-poster.jpg",
    ],
  },
  {
    key: "kp2__home__introPhoto",
    label: "KP2 · Intro",
    urls: [
      "https://images.kharis.org/site-images/kp2/012b86affad979dd/photography/midweek-joy.webp",
    ],
  },
  {
    key: "kp2__home__pastorPhoto",
    label: "KP2 · Pastor",
    urls: ["https://images.kharis.org/site-images/kp2/51390c9807aba7b8/pastor-david-smiling.jpg"],
  },
  {
    key: "kp2__home__testimonyPhotos",
    label: "KP2 · Testimonies",
    urls: [
      "https://images.kharis.org/site-images/kp2/fb9675c9cc674137/testimony-1.jpg",
      "https://images.kharis.org/site-images/kp2/2c9fe8d53a5b1d11/testimony-3.jpg",
      "https://images.kharis.org/site-images/kp2/f1508812f09a9ccd/testimony-2.jpg",
    ],
  },
  {
    key: "kp2__home__appScreens",
    label: "KP2 · App screens",
    urls: [
      "https://images.kharis.org/site-images/main/4275eecdf5e5a12c/app-steps/kharis-app-current-home.png",
      "https://images.kharis.org/site-images/main/f7dfca4f99bbe8a3/app-steps/kharis-app-current-player.png",
      "https://images.kharis.org/site-images/main/0706ed3bc435673c/app-steps/kharis-app-current-chapter.png",
    ],
  },
  {
    key: "kp2__mission__aboutHero",
    label: "KP2 · Mission",
    urls: [
      "https://images.kharis.org/site-images/kp2/31bf103fb4fe477c/photography/service-congregation.webp",
    ],
  },
  {
    key: "kp2__mission__visionHero",
    label: "KP2 · Vision",
    urls: [
      "https://images.kharis.org/site-images/kp2/bc80ccf05c3ca167/photography/service-hall.webp",
    ],
  },
  {
    key: "kp2__mission__leadershipPortraits",
    label: "KP2 · Leadership",
    urls: [
      "https://images.kharis.org/site-images/main/e666a073b590b3ff/leadership/pastor-david-sunday.jpg",
      "https://images.kharis.org/site-images/main/ef23a725426d6b26/leadership/pastor-awo-preaching.jpg",
    ],
  },
  {
    key: "kp2__giving__heroStack",
    label: "KP2 · Giving",
    urls: [
      "https://images.kharis.org/site-images/kp2/599428aa6430daa3/photography/service-worship.webp",
      "https://images.kharis.org/site-images/kp2/601ebdab17bb58b2/photography/service-prayer.webp",
      "https://images.kharis.org/site-images/kp2/c79c7900c6a54f8a/photography/midweek-worship.webp",
    ],
  },
  {
    key: "kp2__contact__letterPhoto",
    label: "KP2 · Contact",
    urls: [
      "https://images.kharis.org/site-images/kp2/bfe5460ad188e880/photography/service-together.webp",
    ],
  },
  {
    key: "kp2__messages__heroBackground",
    label: "KP2 · Messages",
    urls: ["https://images.kharis.org/site-images/kp2/a991d1457f200aa6/pastor-david-at-pulpit.jpg"],
  },
  {
    key: "kp2__media__hero",
    label: "KP2 · Media",
    urls: [
      "https://images.kharis.org/site-images/kp2/be2ab3342be7242c/photography/service-camera.webp",
    ],
  },
  {
    key: "kp2__life__lifeHero",
    label: "KP2 · Life",
    urls: [
      "https://images.kharis.org/site-images/kp2/108d77dbcfbaf371/photography/welcome-smile.webp",
      "https://images.kharis.org/site-images/kp2/9b5c1216e71b6ead/photography/outreach-team.webp",
      "https://images.kharis.org/site-images/kp2/5c7ba60eaa952fd3/photography/service-saxophone.webp",
    ],
  },
  {
    key: "kp2__events__hero",
    label: "KP2 · Events",
    urls: [
      "https://images.kharis.org/site-images/kp2/bc80ccf05c3ca167/photography/service-hall.webp",
    ],
  },
];

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (
          res.statusCode &&
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          fetchBuffer(res.headers.location).then(resolve, reject);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          res.resume();
          return;
        }
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      })
      .on("error", reject);
  });
}

const W = 1280;
const H = 720;

await mkdir(outDir, { recursive: true });

for (const guide of GUIDES) {
  const tiles = [];
  for (const url of guide.urls.slice(0, 4)) {
    try {
      tiles.push(await fetchBuffer(url));
    } catch (error) {
      console.warn(`Skip tile ${url}:`, error.message);
    }
  }
  if (!tiles.length) {
    console.warn(`No tiles for ${guide.key}`);
    continue;
  }

  const cols = tiles.length === 1 ? 1 : tiles.length === 2 ? 2 : tiles.length === 3 ? 3 : 2;
  const rows = Math.ceil(tiles.length / cols);
  const cellW = Math.floor(W / cols);
  const cellH = Math.floor(H / rows);
  const composites = [];
  for (let i = 0; i < tiles.length; i++) {
    const x = (i % cols) * cellW;
    const y = Math.floor(i / cols) * cellH;
    const buf = await sharp(tiles[i])
      .resize(cellW, cellH, { fit: "cover", position: "centre" })
      .jpeg({ quality: 78 })
      .toBuffer();
    composites.push({ input: buf, left: x, top: y });
  }

  const labelSvg = Buffer.from(
    `<svg width="${W}" height="64" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="rgba(15,15,20,0.72)"/>
      <text x="28" y="40" fill="white" font-family="Arial,sans-serif" font-size="26" font-weight="700">${guide.label}</text>
    </svg>`,
  );

  const out = path.join(outDir, `${guide.key}.jpg`);
  await sharp({
    create: { width: W, height: H, channels: 3, background: "#111118" },
  })
    .composite([...composites, { input: labelSvg, left: 0, top: H - 64 }])
    .jpeg({ quality: 82 })
    .toFile(out);

  const hash = createHash("sha256")
    .update(await sharp(out).toBuffer())
    .digest("hex")
    .slice(0, 8);
  console.log(`Built ${guide.key}.jpg (${hash})`);
}

console.log(`Guides ready in ${outDir}`);
