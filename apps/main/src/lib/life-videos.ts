import type { LifeSlug } from "@/lib/life-content";

export type LifeModalSlug = Extract<
  LifeSlug,
  "baptism" | "fasting" | "departments" | "k-group" | "marriage"
>;

export type LifeModalVideo = {
  /** YouTube video ID, or local file path when kind is "file" */
  videoId: string;
  kind?: "youtube" | "file";
  blurb: string;
};

/**
 * Learn More modal videos — Pastor David / Kharis YouTube.
 * Baptism may be overridden at runtime via messages API lookup.
 * Departments uses an on-site clip until a dedicated serve message ID is provided.
 */
export const LIFE_MODAL_VIDEOS: Record<LifeModalSlug, LifeModalVideo> = {
  "k-group": {
    videoId: "0Aburds8DqQ",
    blurb:
      "Small home fellowships where we discuss the Word, pray, and care for one another.",
  },
  baptism: {
    videoId: "NOiT8EPTMrg",
    blurb:
      "A public declaration that you identify with Jesus Christ’s death, burial and resurrection.",
  },
  fasting: {
    videoId: "AE2AXoQetmc",
    blurb:
      "We abstain from food to signal dependence on God, fasting joined with prayer.",
  },
  marriage: {
    videoId: "XdCNUHBdzh4",
    blurb:
      "We celebrate marriage because God created it — preparation, counselling, and a victorious Christian home.",
  },
  departments: {
    videoId: "/videos/hero-a.mp4",
    kind: "file",
    blurb:
      "Serving is part of our worship. Every believer has a role in God’s house.",
  },
};

export function lifeModalVideoId(
  slug: LifeModalSlug,
  baptismOverride?: string,
): string {
  if (slug === "baptism" && baptismOverride) return baptismOverride;
  return LIFE_MODAL_VIDEOS[slug].videoId;
}

export function lifeModalVideoKind(
  slug: LifeModalSlug,
): "youtube" | "file" {
  return LIFE_MODAL_VIDEOS[slug].kind ?? "youtube";
}

export function lifeModalBlurb(slug: LifeModalSlug): string {
  return LIFE_MODAL_VIDEOS[slug].blurb;
}

export function youtubeEmbedSrc(
  id: string,
  opts?: { autoplay?: boolean },
) {
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });
  if (opts?.autoplay) {
    params.set("autoplay", "1");
    params.set("mute", "1");
  }
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}
