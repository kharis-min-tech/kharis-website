import type { LifeSlug } from "@/lib/life-content";

export type LifeModalSlug = Extract<
  LifeSlug,
  "baptism" | "fasting" | "departments" | "k-group" | "marriage"
>;

export type LifeModalVideo = {
  /** YouTube video ID, or local file path when kind is "file" */
  videoId: string;
  title: string;
  kind?: "youtube" | "file";
  blurb: string;
  startSeconds?: number;
};

/**
 * Learn More modal videos — pinned Pastor David / Kharis YouTube messages.
 */
export const LIFE_MODAL_VIDEOS: Record<LifeModalSlug, LifeModalVideo> = {
  "k-group": {
    videoId: "0Aburds8DqQ",
    title: "K-Group at Kharis",
    blurb: "Small home fellowships where we discuss the Word, pray, and care for one another.",
  },
  baptism: {
    videoId: "NOiT8EPTMrg",
    title: "The Saving Power of Baptism",
    blurb:
      "A public declaration that you identify with Jesus Christ’s death, burial and resurrection.",
    startSeconds: 95,
  },
  fasting: {
    videoId: "AE2AXoQetmc",
    title: "The Mystery of Fasting | David Antwi",
    blurb: "We abstain from food to signal dependence on God, fasting joined with prayer.",
  },
  marriage: {
    videoId: "XdCNUHBdzh4",
    title: "Marriage at Kharis | David Antwi",
    blurb:
      "We celebrate marriage because God created it: preparation, counselling, and a victorious Christian home.",
  },
  departments: {
    videoId: "jFjHOlV9uq0",
    title: "Serving at Kharis",
    blurb: "Serving is part of our worship. Every believer has a role in God’s house.",
  },
};

export function lifeModalVideoId(slug: LifeModalSlug): string {
  return LIFE_MODAL_VIDEOS[slug].videoId;
}

export function lifeModalVideoTitle(slug: LifeModalSlug): string {
  return LIFE_MODAL_VIDEOS[slug].title;
}

export function lifeModalVideoStart(slug: LifeModalSlug): number {
  return LIFE_MODAL_VIDEOS[slug].startSeconds ?? 0;
}

export function lifeModalVideoKind(slug: LifeModalSlug): "youtube" | "file" {
  return LIFE_MODAL_VIDEOS[slug].kind ?? "youtube";
}

export function lifeModalBlurb(slug: LifeModalSlug): string {
  return LIFE_MODAL_VIDEOS[slug].blurb;
}

export function youtubeEmbedSrc(id: string, opts?: { autoplay?: boolean }) {
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

/**
 * Muted, chrome-free embed for background video previews.
 * `enablejsapi` lets the slide toggle sound and detect playback via postMessage.
 */
export function youtubeBackgroundSrc(id: string, origin?: string, startSeconds = 0) {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    controls: "0",
    autohide: "1",
    modestbranding: "1",
    rel: "0",
    playsinline: "1",
    iv_load_policy: "3",
    cc_load_policy: "0",
    disablekb: "1",
    fs: "0",
    enablejsapi: "1",
  });
  if (origin) params.set("origin", origin);
  if (startSeconds > 0) params.set("start", String(startSeconds));
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}

export function youtubePosterSrc(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export function youtubeWatchUrl(id: string, startSeconds = 0) {
  const start = startSeconds > 0 ? `&t=${Math.floor(startSeconds)}s` : "";
  return `https://www.youtube.com/watch?v=${id}${start}`;
}
