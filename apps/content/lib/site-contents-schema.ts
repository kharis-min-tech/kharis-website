import type { WorkspaceId } from "@/lib/workspaces";

/** Website workspaces that own site-contents config. */
export type SiteContentsWorkspace = Extract<WorkspaceId, "kharis" | "kp2">;

export function isSiteContentsWorkspace(
  value: string | null | undefined,
): value is SiteContentsWorkspace {
  return value === "kharis" || value === "kp2";
}

export type MediaKind = "image" | "video";

export type MediaItem = {
  kind: MediaKind;
  url: string;
  posterUrl: string;
  alt: string;
};

export type SingleSlot = {
  url: string;
  alt: string;
};

export type ListSlot = {
  items: MediaItem[];
};

export type SectionKind = "single" | "fixedList" | "orderedList" | "deferred";

export type SectionDef = {
  id: string;
  label: string;
  hint: string;
  kind: SectionKind;
  /** fixedList / orderedList */
  itemCount?: number;
  /** orderedList: editors can add/remove */
  minItems?: number;
  maxItems?: number;
  /** Allow video (+ poster) in list/single slots */
  allowVideo?: boolean;
};

export type PageDef = {
  id: string;
  label: string;
  hint: string;
  sections: SectionDef[];
};

export const KHARIS_PAGES: PageDef[] = [
  {
    id: "home",
    label: "Home",
    hint: "Hero band, Know Us cards, building, testimonies and app screens.",
    sections: [
      {
        id: "hero",
        label: "Hero",
        hint: "Ordered panorama slides. Images or videos with posters.",
        kind: "orderedList",
        minItems: 0,
        maxItems: 16,
        allowVideo: true,
      },
      {
        id: "knowUs",
        label: "Know Us",
        hint: "Four cards under Get to Know Kharis.",
        kind: "fixedList",
        itemCount: 4,
      },
      {
        id: "buildHouse",
        label: "Build the House",
        hint: "Spurgeon / building fund photograph.",
        kind: "single",
      },
      {
        id: "testimonyPhotos",
        label: "Testimony photos",
        hint: "Decorative photos beside testimonies.",
        kind: "orderedList",
        minItems: 0,
        maxItems: 8,
      },
      {
        id: "appScreens",
        label: "App screens",
        hint: "Phone mock screenshots in the Messages on the go band.",
        kind: "orderedList",
        minItems: 0,
        maxItems: 6,
      },
    ],
  },
  {
    id: "about",
    label: "About",
    hint: "Scroll hero and chapter heroes.",
    sections: [
      {
        id: "scrollHero",
        label: "Scroll hero",
        hint: "Large photo behind Who we are.",
        kind: "single",
      },
      {
        id: "missionHero",
        label: "Mission hero",
        hint: "Mission chapter photograph.",
        kind: "single",
      },
      {
        id: "visionHero",
        label: "Vision hero",
        hint: "Vision chapter photograph.",
        kind: "single",
      },
      {
        id: "leadershipHero",
        label: "Leadership hero",
        hint: "Leadership chapter photograph.",
        kind: "single",
      },
      {
        id: "aboutBook",
        label: "About book plates",
        hint: "Coming soon. Crop-sensitive book pages stay in code for now.",
        kind: "deferred",
      },
    ],
  },
  {
    id: "life",
    label: "Life",
    hint: "Departments band and category cards.",
    sections: [
      {
        id: "departmentsBand",
        label: "Departments band",
        hint: "Team photograph on the departments strip.",
        kind: "single",
      },
      {
        id: "categoryCards",
        label: "Category cards",
        hint: "Images for life category tiles.",
        kind: "orderedList",
        minItems: 0,
        maxItems: 12,
      },
      {
        id: "tunnel",
        label: "Life tunnel",
        hint: "Coming soon. WebGL tunnel media stays in code for now.",
        kind: "deferred",
      },
      {
        id: "activityGalleries",
        label: "Activity galleries",
        hint: "Coming soon. Large curated galleries stay in code for now.",
        kind: "deferred",
      },
    ],
  },
  {
    id: "messages",
    label: "Messages",
    hint: "Device posters for the listen band. YouTube stays live from the API.",
    sections: [
      {
        id: "listenPosters",
        label: "Listen posters",
        hint: "Curated device / listen posters.",
        kind: "orderedList",
        minItems: 0,
        maxItems: 8,
      },
    ],
  },
  {
    id: "give",
    label: "Give",
    hint: "Hero photo stack and building photograph.",
    sections: [
      {
        id: "heroStack",
        label: "Hero stack",
        hint: "Three stacked thanksgiving photographs.",
        kind: "fixedList",
        itemCount: 3,
      },
      {
        id: "buildingPhoto",
        label: "Building photo",
        hint: "Spurgeon / building fund image.",
        kind: "single",
      },
    ],
  },
  {
    id: "contact",
    label: "Contact",
    hint: "Hero spotlight photos and letter side photo.",
    sections: [
      {
        id: "heroSpotlight",
        label: "Hero spotlight",
        hint: "Four contact hero photographs.",
        kind: "fixedList",
        itemCount: 4,
      },
      {
        id: "letterPhoto",
        label: "Letter photo",
        hint: "Side photograph on the contact letter.",
        kind: "single",
      },
    ],
  },
  {
    id: "events",
    label: "Events",
    hint: "Events page hero.",
    sections: [
      {
        id: "hero",
        label: "Hero",
        hint: "Events page hero photograph.",
        kind: "single",
      },
    ],
  },
];

export const KP2_PAGES: PageDef[] = [
  {
    id: "home",
    label: "Home",
    hint: "Hero mosaic, intro, pastor, testimonies and app screens.",
    sections: [
      {
        id: "heroMosaic",
        label: "Hero mosaic",
        hint: "Four panels. Prefer video with poster, or a still image.",
        kind: "fixedList",
        itemCount: 4,
        allowVideo: true,
      },
      {
        id: "introPhoto",
        label: "Intro photo",
        hint: "Photograph beside the intro copy.",
        kind: "single",
      },
      {
        id: "pastorPhoto",
        label: "Pastor photo",
        hint: "Pastor block photograph.",
        kind: "single",
      },
      {
        id: "testimonyPhotos",
        label: "Testimony photos",
        hint: "Decorative photos in the testimonies band.",
        kind: "orderedList",
        minItems: 0,
        maxItems: 8,
      },
      {
        id: "appScreens",
        label: "App screens",
        hint: "App listen step screenshots.",
        kind: "orderedList",
        minItems: 0,
        maxItems: 6,
      },
    ],
  },
  {
    id: "mission",
    label: "Mission",
    hint: "About / vision heroes and leadership portraits.",
    sections: [
      {
        id: "aboutHero",
        label: "About hero",
        hint: "Mission about photograph.",
        kind: "single",
      },
      {
        id: "visionHero",
        label: "Vision hero",
        hint: "Vision photograph.",
        kind: "single",
      },
      {
        id: "leadershipPortraits",
        label: "Leadership portraits",
        hint: "Leadership portrait photographs.",
        kind: "orderedList",
        minItems: 0,
        maxItems: 8,
      },
    ],
  },
  {
    id: "life",
    label: "Life",
    hint: "Life hero prints. Comic panels coming later.",
    sections: [
      {
        id: "lifeHero",
        label: "Life hero prints",
        hint: "Print-style photos in the Life hero.",
        kind: "orderedList",
        minItems: 0,
        maxItems: 8,
      },
      {
        id: "comicPanels",
        label: "Comic panels",
        hint: "Coming soon. Multi-panel galleries stay in code for now.",
        kind: "deferred",
      },
    ],
  },
  {
    id: "messages",
    label: "Messages",
    hint: "Messages page background. YouTube stays live from the API.",
    sections: [
      {
        id: "heroBackground",
        label: "Hero background",
        hint: "Background photograph behind the messages hero.",
        kind: "single",
      },
    ],
  },
  {
    id: "giving",
    label: "Giving",
    hint: "Giving page hero stack.",
    sections: [
      {
        id: "heroStack",
        label: "Hero stack",
        hint: "Three stacked photographs.",
        kind: "fixedList",
        itemCount: 3,
      },
    ],
  },
  {
    id: "contact",
    label: "Contact",
    hint: "Contact letter photograph.",
    sections: [
      {
        id: "letterPhoto",
        label: "Letter photo",
        hint: "Side photograph on the contact letter.",
        kind: "single",
      },
    ],
  },
  {
    id: "events",
    label: "Events",
    hint: "Events hero. Comic variants coming later.",
    sections: [
      {
        id: "hero",
        label: "Hero",
        hint: "Events page hero photograph.",
        kind: "single",
      },
      {
        id: "comicPanels",
        label: "Comic panels",
        hint: "Coming soon.",
        kind: "deferred",
      },
    ],
  },
  {
    id: "media",
    label: "Media",
    hint: "Media page hero. Gallery coming later.",
    sections: [
      {
        id: "hero",
        label: "Hero",
        hint: "Media page parallax photograph.",
        kind: "single",
      },
      {
        id: "lotGallery",
        label: "Lot gallery",
        hint: "Coming soon. Mixed clip gallery stays in code for now.",
        kind: "deferred",
      },
    ],
  },
];

export function pagesForWorkspace(workspace: SiteContentsWorkspace): PageDef[] {
  return workspace === "kp2" ? KP2_PAGES : KHARIS_PAGES;
}

export function pageDef(workspace: SiteContentsWorkspace, pageId: string) {
  return pagesForWorkspace(workspace).find((page) => page.id === pageId) ?? null;
}

export function siteContentsConfigKey(workspace: SiteContentsWorkspace) {
  return workspace === "kp2" ? "site_contents_kp2" : "site_contents_kharis";
}

export function emptyMediaItem(kind: MediaKind = "image"): MediaItem {
  return { kind, url: "", posterUrl: "", alt: "" };
}

export function emptySingleSlot(): SingleSlot {
  return { url: "", alt: "" };
}

export function emptyListSlot(count = 0, allowVideo = false): ListSlot {
  return {
    items: Array.from({ length: count }, () => emptyMediaItem(allowVideo ? "image" : "image")),
  };
}
