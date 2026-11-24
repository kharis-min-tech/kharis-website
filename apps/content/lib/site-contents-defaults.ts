import type { MediaItem, SiteContentsWorkspace } from "@/lib/site-contents-schema";

export type DefaultMedia = Pick<MediaItem, "kind" | "url" | "posterUrl" | "alt">;

type SectionMeta = {
  /** Public path on that site (no origin). */
  path: string;
  /** Optional in-page hash without #. */
  hash?: string;
  /** Hardcoded CDN media the live site uses when Studio slots are empty. */
  defaults: DefaultMedia[];
  /** Curated still of how the section looks on the live site. */
  guideImage?: string;
};

type PageMeta = Record<string, SectionMeta>;
type WorkspaceMeta = Record<string, PageMeta>;

const img = (url: string, alt = ""): DefaultMedia => ({
  kind: "image",
  url,
  posterUrl: "",
  alt,
});

const vid = (url: string, posterUrl: string, alt = ""): DefaultMedia => ({
  kind: "video",
  url,
  posterUrl,
  alt,
});

const KHARIS: WorkspaceMeta = {
  home: {
    hero: {
      path: "/",
      hash: "top",
      guideImage:
        "https://images.kharis.org/site-media/site-contents/guides/kharis/home-hero-b34b99f3139fef16.jpg",
      defaults: [
        img(
          "https://images.kharis.org/site-images/main/60262eef48c53cc5/locations/london-sunday-smiles.jpg",
          "Members of Kharis London smiling during a service",
        ),
        img(
          "https://images.kharis.org/site-images/main/72df91d4341c5b55/events/sunday-pastor-open-bible.jpg",
          "Pastor David preaching with an open Bible at a Kharis service",
        ),
        img(
          "https://images.kharis.org/site-images/main/1cd1968f552f6970/hero/worship-altar.jpg",
          "The congregation worshipping at the altar during a Kharis service",
        ),
        img(
          "https://images.kharis.org/site-images/main/00a8e9b517ac4517/hero/easter-bibles-raised.jpg",
          "The congregation raising their Bibles at the Easter service",
        ),
        vid(
          "https://images.kharis.org/site-images/main/bccc7c3a84bff0b1/Glory%20to%20the%20lamb%20-%20Trim-960w.mp4",
          "https://images.kharis.org/site-images/main/1cd1968f552f6970/hero/worship-altar.jpg",
          "Worship to Glory to the Lamb at a Kharis service",
        ),
        img(
          "https://images.kharis.org/site-images/main/b8180db67daeb332/hero/preaching-open-bible.jpg",
          "Preaching with arms outstretched and an open Bible in hand",
        ),
        img(
          "https://images.kharis.org/site-images/main/56fc2395a9b23afb/contact/easter-welcome-wave.jpg",
          "People waving as they arrive for a Kharis Easter service",
        ),
        img(
          "https://images.kharis.org/site-images/main/4ac6c245a7e4d9c2/hero/impartation-celebration.jpg",
          "Pastor David celebrating with the congregation at the Impartation Service",
        ),
      ],
    },
    knowUs: {
      path: "/",
      hash: "know",
      guideImage:
        "https://images.kharis.org/site-media/site-contents/guides/kharis/home-knowUs-38e74159c8cfb805.jpg",
      defaults: [
        img(
          "https://images.kharis.org/site-images/main/529646bbc41f3bc3/community.jpg",
          "About Us",
        ),
        img(
          "https://images.kharis.org/site-images/main/012b86affad979dd/home/kp2-community.webp",
          "A New Generation",
        ),
        img(
          "https://images.kharis.org/site-images/main/de005ef42ce5304e/get-involved-sax.jpg",
          "How We Serve God",
        ),
        img(
          "https://images.kharis.org/site-images/main/e06e47b90f538fed/events/singles-ball/ballroom-overview.jpg",
          "Our Way of Life",
        ),
      ],
    },
    buildHouse: {
      path: "/",
      hash: "give",
      guideImage:
        "https://images.kharis.org/site-media/site-contents/guides/kharis/home-buildHouse-e116a7d36c2be2cc.jpg",
      defaults: [
        img(
          "https://images.kharis.org/site-images/main/8f521cd8c5d3a713/spurgeons-impression.jpg",
          "Spurgeon’s Centre",
        ),
      ],
    },
    testimonyPhotos: {
      path: "/",
      hash: "testimonies",
      guideImage:
        "https://images.kharis.org/site-media/site-contents/guides/kharis/home-testimonyPhotos-d0b34095a6b9ea05.jpg",
      defaults: [
        img(
          "https://images.kharis.org/site-images/main/283f42aec09d96a1/testimony-sharing.jpg",
          "A brother sharing his testimony on stage",
        ),
        img(
          "https://images.kharis.org/site-images/main/cc4f9c67e2c899e3/testimony-stage-1.jpg",
          "A sister sharing her testimony on stage",
        ),
        img(
          "https://images.kharis.org/site-images/main/f841b0d98ce0840e/testimony-stage-2.jpg",
          "Celebrating together after a testimony is shared on stage",
        ),
      ],
    },
    appScreens: {
      path: "/",
      hash: "vision",
      guideImage:
        "https://images.kharis.org/site-media/site-contents/guides/kharis/home-appScreens-316119822b078e5a.jpg",
      defaults: [
        img(
          "https://images.kharis.org/site-images/main/4275eecdf5e5a12c/app-steps/kharis-app-current-home.png",
          "App home",
        ),
        img(
          "https://images.kharis.org/site-images/main/f7dfca4f99bbe8a3/app-steps/kharis-app-current-player.png",
          "Media Player",
        ),
        img(
          "https://images.kharis.org/site-images/main/0706ed3bc435673c/app-steps/kharis-app-current-chapter.png",
          "Bible",
        ),
      ],
    },
  },
  about: {
    scrollHero: {
      path: "/about",
      guideImage:
        "https://images.kharis.org/site-media/site-contents/guides/kharis/about-scrollHero-1b0b79806076963c.jpg",
      defaults: [
        img(
          "https://images.kharis.org/site-images/main/e01fad6602636193/about-outreach-hero.jpg",
          "About scroll hero",
        ),
      ],
    },
    missionHero: {
      path: "/about",
      hash: "mission",
      guideImage:
        "https://images.kharis.org/site-media/site-contents/guides/kharis/about-missionHero-8501e63ac3c83dc2.jpg",
      defaults: [
        img(
          "https://images.kharis.org/site-images/main/11577f5e512c33cd/about-mission-outreach.jpg",
          "Mission hero",
        ),
      ],
    },
    visionHero: {
      path: "/about",
      hash: "vision",
      guideImage:
        "https://images.kharis.org/site-media/site-contents/guides/kharis/about-visionHero-b7c7fa1e9f34e95c.jpg",
      defaults: [
        img(
          "https://images.kharis.org/site-images/main/a080e8123b487573/vision-church-family.jpg",
          "Vision hero",
        ),
      ],
    },
    leadershipHero: {
      path: "/about",
      hash: "leadership",
      guideImage:
        "https://images.kharis.org/site-media/site-contents/guides/kharis/about-leadershipHero-3a0ab0f93fa16342.jpg",
      defaults: [
        img(
          "https://images.kharis.org/site-images/main/61b5f617ef58872c/about-pastors-portrait.jpg",
          "Leadership hero",
        ),
      ],
    },
  },
  life: {
    departmentsBand: {
      path: "/life/departments",
      guideImage:
        "https://images.kharis.org/site-media/site-contents/guides/kharis/life-departmentsBand-5cfcd5a0d8e4c5c6.jpg",
      defaults: [
        img(
          "https://images.kharis.org/site-images/main/c7e0b460a01f93eb/about-vision-team-2048.jpg",
          "Departments band",
        ),
      ],
    },
    categoryCards: {
      path: "/life",
      guideImage:
        "https://images.kharis.org/site-media/site-contents/guides/kharis/life-categoryCards-024af32563c9f860.jpg",
      defaults: [
        img(
          "https://images.kharis.org/site-images/main/571e499ea60fdffc/branch-slide-1.jpg",
          "K-Group",
        ),
        img(
          "https://images.kharis.org/site-images/main/ffbe5aca25d25b8c/pastor-stage.jpg",
          "Fasting",
        ),
        img(
          "https://images.kharis.org/site-images/main/eaaa3446e38fc4e3/life-departments.jpg",
          "Departments",
        ),
      ],
    },
  },
  messages: {
    listenPosters: {
      path: "/messages",
      guideImage:
        "https://images.kharis.org/site-media/site-contents/guides/kharis/messages-listenPosters-9c90213aa707fdba.jpg",
      defaults: [
        img("https://i.ytimg.com/vi/KBFfpU0mX2U/maxresdefault.jpg", "Listen poster"),
        img("https://i.ytimg.com/vi/9uYPZYrTHIA/maxresdefault.jpg", "Listen poster"),
        img("https://i.ytimg.com/vi/NOiT8EPTMrg/maxresdefault.jpg", "Listen poster"),
        img("https://i.ytimg.com/vi/ys4CMmykRh8/maxresdefault.jpg", "Listen poster"),
      ],
    },
  },
  give: {
    heroStack: {
      path: "/give",
      guideImage:
        "https://images.kharis.org/site-media/site-contents/guides/kharis/give-heroStack-3bed8c3c2b7ffebd.jpg",
      defaults: [
        img(
          "https://images.kharis.org/site-images/main/8527db06a4968c60/give/thanksgiving-hands-raised.jpg",
        ),
        img(
          "https://images.kharis.org/site-images/main/e686a4818115ee4e/give/thanksgiving-hall.jpg",
        ),
        img(
          "https://images.kharis.org/site-images/main/72e8b112e585bed6/give/thanksgiving-heart-hands.jpg",
        ),
      ],
    },
    buildingPhoto: {
      path: "/give",
      hash: "building",
      guideImage:
        "https://images.kharis.org/site-media/site-contents/guides/kharis/give-buildingPhoto-e423f9e7a0dae02e.jpg",
      defaults: [
        img(
          "https://images.kharis.org/site-images/main/8f521cd8c5d3a713/spurgeons-impression.jpg",
          "Building photo",
        ),
      ],
    },
  },
  contact: {
    heroSpotlight: {
      path: "/contact",
      guideImage:
        "https://images.kharis.org/site-media/site-contents/guides/kharis/contact-heroSpotlight-968f2064557dd38e.jpg",
      defaults: [
        img(
          "https://images.kharis.org/site-images/main/56fc2395a9b23afb/contact/easter-welcome-wave.jpg",
        ),
        img(
          "https://images.kharis.org/site-images/main/421991ee4530d49b/contact/easter-door-greeter.jpg",
        ),
        img(
          "https://images.kharis.org/site-images/main/548f1d84de49653b/contact/after-service-handshake.jpg",
        ),
        img(
          "https://images.kharis.org/site-images/main/fb9b5e9814886abb/contact/service-prayer.jpg",
        ),
      ],
    },
    letterPhoto: {
      path: "/contact",
      hash: "write",
      guideImage:
        "https://images.kharis.org/site-media/site-contents/guides/kharis/contact-letterPhoto-3c7de02e2824eb5f.jpg",
      defaults: [
        img(
          "https://images.kharis.org/site-images/main/67210f0fba54b6a1/contact/after-service-conversation.jpg",
          "Letter photo",
        ),
      ],
    },
  },
  events: {
    hero: {
      path: "/events",
      guideImage:
        "https://images.kharis.org/site-media/site-contents/guides/kharis/events-hero-b46a1d22fcbb6f66.jpg",
      defaults: [
        img(
          "https://images.kharis.org/site-images/main/4ad6b94f8e2d8cf0/events-hero-banquet.jpg",
          "Events hero",
        ),
      ],
    },
  },
};

const KP2: WorkspaceMeta = {
  home: {
    heroMosaic: {
      path: "/",
      guideImage:
        "https://images.kharis.org/site-media/site-contents/guides/kp2/home-heroMosaic-b6ff5188e9ff7e19.jpg",
      defaults: [
        vid(
          "https://images.kharis.org/site-images/kp2/d7e2929cd285968f/Choir-video.mp4",
          "https://images.kharis.org/site-images/kp2/88a52cf2f36e4dba/choir-video-poster.jpg",
        ),
        vid(
          "https://images.kharis.org/site-images/kp2/06c4e252e26bc25f/crowd.mp4",
          "https://images.kharis.org/site-images/kp2/6a42a25165e3e08a/crowd-poster.jpg",
        ),
        vid(
          "https://images.kharis.org/site-images/kp2/ba4f09f054519d29/choir2.mp4",
          "https://images.kharis.org/site-images/kp2/a20adefe3b0f9d7a/choir2-poster.jpg",
        ),
        vid(
          "https://images.kharis.org/site-images/kp2/785c2b4d533ea835/dancing.mp4",
          "https://images.kharis.org/site-images/kp2/2777b7351167f611/dancing-poster.jpg",
        ),
      ],
    },
    introPhoto: {
      path: "/",
      guideImage:
        "https://images.kharis.org/site-media/site-contents/guides/kp2/home-introPhoto-f3cd49cb982d3de4.jpg",
      defaults: [
        img(
          "https://images.kharis.org/site-images/kp2/012b86affad979dd/photography/midweek-joy.webp",
          "Intro photo",
        ),
      ],
    },
    pastorPhoto: {
      path: "/",
      hash: "pastor",
      guideImage:
        "https://images.kharis.org/site-media/site-contents/guides/kp2/home-pastorPhoto-fbc8a53e1425b344.jpg",
      defaults: [
        img(
          "https://images.kharis.org/site-images/kp2/51390c9807aba7b8/pastor-david-smiling.jpg",
          "Pastor photo",
        ),
      ],
    },
    testimonyPhotos: {
      path: "/",
      hash: "testimonies",
      guideImage:
        "https://images.kharis.org/site-media/site-contents/guides/kp2/home-testimonyPhotos-bb2adb8154802e22.jpg",
      defaults: [
        img("https://images.kharis.org/site-images/kp2/fb9675c9cc674137/testimony-1.jpg"),
        img("https://images.kharis.org/site-images/kp2/2c9fe8d53a5b1d11/testimony-3.jpg"),
        img("https://images.kharis.org/site-images/kp2/f1508812f09a9ccd/testimony-2.jpg"),
      ],
    },
    appScreens: {
      path: "/",
      hash: "app",
      guideImage:
        "https://images.kharis.org/site-media/site-contents/guides/kp2/home-appScreens-a3a985b875c0fb74.jpg",
      defaults: [
        img(
          "https://images.kharis.org/site-images/main/4275eecdf5e5a12c/app-steps/kharis-app-current-home.png",
        ),
        img(
          "https://images.kharis.org/site-images/main/f7dfca4f99bbe8a3/app-steps/kharis-app-current-player.png",
        ),
        img(
          "https://images.kharis.org/site-images/main/0706ed3bc435673c/app-steps/kharis-app-current-chapter.png",
        ),
      ],
    },
  },
  mission: {
    aboutHero: {
      path: "/mission",
      hash: "mission",
      guideImage:
        "https://images.kharis.org/site-media/site-contents/guides/kp2/mission-aboutHero-affd5885ae7a47f8.jpg",
      defaults: [
        img(
          "https://images.kharis.org/site-images/kp2/31bf103fb4fe477c/photography/service-congregation.webp",
          "About hero",
        ),
      ],
    },
    visionHero: {
      path: "/mission",
      hash: "vision",
      guideImage:
        "https://images.kharis.org/site-media/site-contents/guides/kp2/mission-visionHero-a9a23275e241ffe0.jpg",
      defaults: [
        img(
          "https://images.kharis.org/site-images/kp2/bc80ccf05c3ca167/photography/service-hall.webp",
          "Vision hero",
        ),
      ],
    },
    leadershipPortraits: {
      path: "/mission",
      hash: "leadership",
      guideImage:
        "https://images.kharis.org/site-media/site-contents/guides/kp2/mission-leadershipPortraits-c12b6ebd4dcdbb01.jpg",
      defaults: [
        img(
          "https://images.kharis.org/site-images/main/e666a073b590b3ff/leadership/pastor-david-sunday.jpg",
          "Pastor David",
        ),
        img(
          "https://images.kharis.org/site-images/main/ef23a725426d6b26/leadership/pastor-awo-preaching.jpg",
          "Pastor Awo",
        ),
      ],
    },
  },
  life: {
    lifeHero: {
      path: "/life",
      guideImage:
        "https://images.kharis.org/site-media/site-contents/guides/kp2/life-lifeHero-043938dc64681337.jpg",
      defaults: [
        img(
          "https://images.kharis.org/site-images/kp2/108d77dbcfbaf371/photography/welcome-smile.webp",
        ),
        img(
          "https://images.kharis.org/site-images/kp2/9b5c1216e71b6ead/photography/outreach-team.webp",
        ),
        img(
          "https://images.kharis.org/site-images/kp2/5c7ba60eaa952fd3/photography/service-saxophone.webp",
        ),
        img(
          "https://images.kharis.org/site-images/kp2/0378309e00d0fd7d/photography/baptism-joy.webp",
        ),
        img(
          "https://images.kharis.org/site-images/main/c92b67201f985207/events/praise-night-stage.jpg",
        ),
      ],
    },
  },
  messages: {
    heroBackground: {
      path: "/messages",
      guideImage:
        "https://images.kharis.org/site-media/site-contents/guides/kp2/messages-heroBackground-2435e81352660fc2.jpg",
      defaults: [
        img(
          "https://images.kharis.org/site-images/kp2/a991d1457f200aa6/pastor-david-at-pulpit.jpg",
          "Messages hero",
        ),
      ],
    },
  },
  giving: {
    heroStack: {
      path: "/giving",
      guideImage:
        "https://images.kharis.org/site-media/site-contents/guides/kp2/giving-heroStack-a6c180c05c9f000a.jpg",
      defaults: [
        img(
          "https://images.kharis.org/site-images/kp2/599428aa6430daa3/photography/service-worship.webp",
        ),
        img(
          "https://images.kharis.org/site-images/kp2/601ebdab17bb58b2/photography/service-prayer.webp",
        ),
        img(
          "https://images.kharis.org/site-images/kp2/c79c7900c6a54f8a/photography/midweek-worship.webp",
        ),
      ],
    },
  },
  contact: {
    letterPhoto: {
      path: "/contact",
      guideImage:
        "https://images.kharis.org/site-media/site-contents/guides/kp2/contact-letterPhoto-4a38353e2882eaad.jpg",
      defaults: [
        img(
          "https://images.kharis.org/site-images/kp2/bfe5460ad188e880/photography/service-together.webp",
          "Letter photo",
        ),
      ],
    },
  },
  events: {
    hero: {
      path: "/events",
      guideImage:
        "https://images.kharis.org/site-media/site-contents/guides/kp2/events-hero-99b6c3cea45dd78b.jpg",
      defaults: [
        img(
          "https://images.kharis.org/site-images/kp2/bc80ccf05c3ca167/photography/service-hall.webp",
          "Events hero",
        ),
      ],
    },
  },
  media: {
    hero: {
      path: "/media",
      guideImage:
        "https://images.kharis.org/site-media/site-contents/guides/kp2/media-hero-538ecfb5819d178e.jpg",
      defaults: [
        img(
          "https://images.kharis.org/site-images/kp2/be2ab3342be7242c/photography/service-camera.webp",
          "Media hero",
        ),
      ],
    },
  },
};

function meta(
  workspace: SiteContentsWorkspace,
  pageId: string,
  sectionId: string,
): SectionMeta | null {
  const pages = workspace === "kp2" ? KP2 : KHARIS;
  return pages[pageId]?.[sectionId] ?? null;
}

export function sectionDefaults(
  workspace: SiteContentsWorkspace,
  pageId: string,
  sectionId: string,
): DefaultMedia[] {
  return meta(workspace, pageId, sectionId)?.defaults ?? [];
}

export function sectionGuideImage(
  workspace: SiteContentsWorkspace,
  pageId: string,
  sectionId: string,
): string | null {
  return meta(workspace, pageId, sectionId)?.guideImage ?? null;
}

/** Origin for the public site preview (local ports when Studio is on localhost). */
export function publicSiteOrigin(workspace: SiteContentsWorkspace) {
  if (
    typeof window !== "undefined" &&
    /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname)
  ) {
    return workspace === "kp2" ? "http://localhost:3001" : "http://localhost:3000";
  }
  return workspace === "kp2" ? "https://kharis.org/kp2" : "https://kharis.org";
}

export function sectionPreviewUrl(
  workspace: SiteContentsWorkspace,
  pageId: string,
  sectionId: string,
): string | null {
  const section = meta(workspace, pageId, sectionId);
  if (!section) {
    const fallbackPath = pageId === "home" ? "/" : pageId === "giving" ? "/giving" : `/${pageId}`;
    return `${publicSiteOrigin(workspace)}${fallbackPath}`;
  }
  const hash = section.hash ? `#${section.hash}` : "";
  return `${publicSiteOrigin(workspace)}${section.path}${hash}`;
}
