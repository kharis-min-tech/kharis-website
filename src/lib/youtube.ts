export type HeroVideo = {
  id: string;
  title: string;
  startSeconds: number;
};

export type MessageVideo = {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt?: string;
};

const CHANNEL_ID = "UC4l8WmdF9ivMDQHHVOdYKqQ";
const UPLOADS_PLAYLIST = "UU4l8WmdF9ivMDQHHVOdYKqQ";

function thumbFor(id: string, high?: string) {
  // mqdefault is true 16:9 — hqdefault letterboxes with black bars
  if (high && (high.includes("maxresdefault") || high.includes("mqdefault") || high.includes("hq720"))) {
    return high;
  }
  return `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
}

const MESSAGE_FALLBACK: MessageVideo[] = [
  {
    id: "NOiT8EPTMrg",
    title: "The Saving Power Of Baptism | David Antwi",
    thumbnail: thumbFor("NOiT8EPTMrg"),
    publishedAt: "2021-04-27T00:00:00Z",
  },
  {
    id: "9uYPZYrTHIA",
    title: "Mercy, Repentance and Baptism | David Antwi | Acts 2:36-42",
    thumbnail: thumbFor("9uYPZYrTHIA"),
    publishedAt: "2020-06-14T00:00:00Z",
  },
  {
    id: "AE2AXoQetmc",
    title: "The Mystery Of Fasting | David Antwi",
    thumbnail: thumbFor("AE2AXoQetmc"),
    publishedAt: "2019-01-13T00:00:00Z",
  },
  {
    id: "iXo1fg_PRLM",
    title: "From Acts To Us | Acts 28:27-31 | David Antwi",
    thumbnail: thumbFor("iXo1fg_PRLM"),
    publishedAt: "2026-08-23T00:00:00Z",
  },
  {
    id: "iRCcSWEdbPo",
    title: "The Most Important 3 Days | John 1:19-29 | David Antwi | Kharis Phase Two",
    thumbnail: thumbFor("iRCcSWEdbPo"),
    publishedAt: "2026-08-24T00:00:00Z",
  },
  {
    id: "El1RpnRYA30",
    title: "John The Witness | John 1:6-18 | David Antwi | Kharis Phase Two",
    thumbnail: thumbFor("El1RpnRYA30"),
    publishedAt: "2026-08-19T00:00:00Z",
  },
  {
    id: "bHv6lharURs",
    title: "Let The Bible Speak | Acts 28:23-27 | David Antwi",
    thumbnail: thumbFor("bHv6lharURs"),
    publishedAt: "2026-08-16T00:00:00Z",
  },
  {
    id: "KBFfpU0mX2U",
    title: "A Living Witness For Jesus | Acts 28:1-10 | David Antwi",
    thumbnail: thumbFor("KBFfpU0mX2U"),
    publishedAt: "2026-07-20T00:00:00Z",
  },
  {
    id: "6Y15Ja9E2hw",
    title: "Riding On Divine Assignment | Acts 27:27-44 | David Antwi",
    thumbnail: thumbFor("6Y15Ja9E2hw"),
    publishedAt: "2026-07-13T00:00:00Z",
  },
  {
    id: "NgJZ2RmkuXs",
    title: "He Is God Even In The Storm | Acts 27:13-25 | David Antwi",
    thumbnail: thumbFor("NgJZ2RmkuXs"),
    publishedAt: "2026-07-06T00:00:00Z",
  },
  {
    id: "u4vxbcZhmUo",
    title: "The LIGHT That Changes Everything | Acts 26 | David Antwi",
    thumbnail: thumbFor("u4vxbcZhmUo"),
    publishedAt: "2026-06-29T00:00:00Z",
  },
  {
    id: "pbP3soO9lzg",
    title: "Inside The Church: Good Men & Actors | David Antwi | Acts 4:34 - 5:11",
    thumbnail: thumbFor("pbP3soO9lzg"),
    publishedAt: "2026-06-22T00:00:00Z",
  },
  {
    id: "RiyHtJJFFY8",
    title: "Just Men - How to Overcome Lust |S1 - Ep9| Kharis Church",
    thumbnail: thumbFor("RiyHtJJFFY8"),
    publishedAt: "2026-08-25T00:00:00Z",
  },
  {
    id: "xkzy3jlKzOw",
    title: "Just Men - Apologetics |S1 - Ep8| Kharis Church",
    thumbnail: thumbFor("xkzy3jlKzOw"),
    publishedAt: "2026-08-18T00:00:00Z",
  },
  {
    id: "XN2tQvxziAU",
    title: "Just Men - Church Planting |S1 - Ep7| Kharis Church",
    thumbnail: thumbFor("XN2tQvxziAU"),
    publishedAt: "2026-08-11T00:00:00Z",
  },
  {
    id: "qFvmiRYWWh4",
    title: "Just Men - Ministry & Missions | S1 - E1| Kharis Church",
    thumbnail: thumbFor("qFvmiRYWWh4"),
    publishedAt: "2026-06-30T00:00:00Z",
  },
  {
    id: "71yzF9EfC3g",
    title: "A Special Christmas Service | The Implication Of The Virgin Birth | David Antwi",
    thumbnail: thumbFor("71yzF9EfC3g"),
    publishedAt: "2025-12-21T00:00:00Z",
  },
  {
    id: "ys4CMmykRh8",
    title: "End Of Fast Impartation Service - Part 1 | David Antwi",
    thumbnail: thumbFor("ys4CMmykRh8"),
  },
  {
    id: "CD54YeRlToo",
    title: "Celebrating Pastor David | Kharis Church",
    thumbnail: thumbFor("CD54YeRlToo"),
    publishedAt: "2026-06-19T00:00:00Z",
  },
  {
    id: "Q5UKIwmy16k",
    title: "The LOGOS Became Flesh | John 1:14 | David Antwi | Kharis Phase Two",
    thumbnail: thumbFor("Q5UKIwmy16k"),
    publishedAt: "2026-06-08T00:00:00Z",
  },
  {
    id: "JFRZoVbHaMg",
    title: "THE LOGOS | John 1:1-14 | David Antwi | Kharis Phase Two",
    thumbnail: thumbFor("JFRZoVbHaMg"),
    publishedAt: "2026-06-01T00:00:00Z",
  },
  {
    id: "8mANIl_heyI",
    title: "Should We Continue In Sin? Of Course Not | David Antwi | Kharis Phase Two",
    thumbnail: thumbFor("8mANIl_heyI"),
    publishedAt: "2026-05-25T00:00:00Z",
  },
  {
    id: "CkFM6auEc_g",
    title: "The Glorious Cross - Good Friday Broadcast | David Antwi",
    thumbnail: thumbFor("CkFM6auEc_g"),
    publishedAt: "2026-04-18T00:00:00Z",
  },
  {
    id: "SOntjwOh2vE",
    title: "Just Men - Evangelism |S1 - Ep6| Kharis Church",
    thumbnail: thumbFor("SOntjwOh2vE"),
    publishedAt: "2026-08-04T00:00:00Z",
  },
  {
    id: "XdCNUHBdzh4",
    title: "Just Men - Starting A Godly Relationship |S1 - Ep5| Kharis Church",
    thumbnail: thumbFor("XdCNUHBdzh4"),
    publishedAt: "2026-07-28T00:00:00Z",
  },
  {
    id: "9pDh0Uqrg_U",
    title: "Just Men - Discovering Purpose | S1 - Ep4 | Kharis Church",
    thumbnail: thumbFor("9pDh0Uqrg_U"),
    publishedAt: "2026-07-21T00:00:00Z",
  },
  {
    id: "HPuAVkjn5jk",
    title: "Just Men - Mentorship |S1 - Ep3| Kharis Church",
    thumbnail: thumbFor("HPuAVkjn5jk"),
    publishedAt: "2026-07-14T00:00:00Z",
  },
  {
    id: "QQduTK-gtig",
    title: "Just Men - Ministry & Mission 2 | S1 - E2 | Kharis Church",
    thumbnail: thumbFor("QQduTK-gtig"),
    publishedAt: "2026-07-07T00:00:00Z",
  },
  {
    id: "5MkfCRyuyl8",
    title: "The Fragrance - The Sweet One | S1 E11 | Kharis Church",
    thumbnail: thumbFor("5MkfCRyuyl8"),
    publishedAt: "2026-05-18T00:00:00Z",
  },
  {
    id: "3gKNZ104LY4",
    title: "The Fragrance - SATISFIED | S1 E10 | Kharis Church",
    thumbnail: thumbFor("3gKNZ104LY4"),
    publishedAt: "2026-05-11T00:00:00Z",
  },
  {
    id: "iEwswxxOv7Y",
    title: "The Fragrance - Offence | S1 E9 | Kharis Church",
    thumbnail: thumbFor("iEwswxxOv7Y"),
    publishedAt: "2026-05-04T00:00:00Z",
  },
  {
    id: "icPwC5kB2xU",
    title: "The Fragrance - Body Image | S1 E8 | Kharis Church",
    thumbnail: thumbFor("icPwC5kB2xU"),
    publishedAt: "2026-04-27T00:00:00Z",
  },
  {
    id: "ffWLcu3HE1Q",
    title: "The Fragrance - FOMO | Fear Of Missing Out | S1 E7 | Kharis Church",
    thumbnail: thumbFor("ffWLcu3HE1Q"),
    publishedAt: "2026-04-20T00:00:00Z",
  },
  {
    id: "StAVimPEVr4",
    title: "The Fragrance - Value Adding Woman | S1 E6 | Kharis Church",
    thumbnail: thumbFor("StAVimPEVr4"),
    publishedAt: "2026-04-13T00:00:00Z",
  },
  {
    id: "0Aburds8DqQ",
    title: "The Fragrance - Church Culture | E5 | Kharis Church",
    thumbnail: thumbFor("0Aburds8DqQ"),
    publishedAt: "2026-04-06T00:00:00Z",
  },
  {
    id: "3phRVUe1KxQ",
    title: "The Fragrance - Loving God, Loving You | S1 E4 | Kharis Church",
    thumbnail: thumbFor("3phRVUe1KxQ"),
    publishedAt: "2026-03-30T00:00:00Z",
  },
  {
    id: "I1ckydU2hyQ",
    title: "The Fragrance - Feeling Forsaken | S1 E3 | Kharis Church",
    thumbnail: thumbFor("I1ckydU2hyQ"),
    publishedAt: "2026-03-23T00:00:00Z",
  },
  {
    id: "8I7YsOeS0jc",
    title: "The Fragrance - Behind The Scenes with Pastors Wives | S1 E2 | Kharis Church",
    thumbnail: thumbFor("8I7YsOeS0jc"),
    publishedAt: "2026-03-16T00:00:00Z",
  },
  {
    id: "Vj4cqgFcW8I",
    title: "The Fragrance - She Said Yes | S1 E1 - Part 2 | Kharis Church",
    thumbnail: thumbFor("Vj4cqgFcW8I"),
    publishedAt: "2026-03-09T00:00:00Z",
  },
  {
    id: "lGMXHVhsSwM",
    title: "The Fragrance - She Said Yes | S1 E1 - Part 1 | Kharis Church",
    thumbnail: thumbFor("lGMXHVhsSwM"),
    publishedAt: "2026-03-02T00:00:00Z",
  },
];

function isShortTitle(title: string) {
  const lower = title.toLowerCase();
  return (
    lower.includes("#shorts") ||
    lower.endsWith(" shorts") ||
    lower.includes("days to go") ||
    lower.includes("please don’t say") ||
    lower.includes("please don't say")
  );
}

function isSkippedMessage(title: string) {
  const lower = title.toLowerCase();
  return (
    isShortTitle(title) ||
    lower.includes("joe mettle") ||
    lower.includes("minister joe") ||
    /\bmettle\b/.test(lower) ||
    lower.includes("music video") ||
    lower.includes("valentine") ||
    lower.includes("ltbsc.com") ||
    lower.includes("days to go until")
  );
}

function decodeXml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');
}

function mergeMessages(...lists: MessageVideo[][]) {
  const seen = new Set<string>();
  const out: MessageVideo[] = [];
  for (const list of lists) {
    for (const m of list) {
      if (seen.has(m.id) || isSkippedMessage(m.title)) continue;
      seen.add(m.id);
      out.push({ ...m, thumbnail: thumbFor(m.id, m.thumbnail) });
    }
  }
  out.sort((a, b) => {
    const da = a.publishedAt ? Date.parse(a.publishedAt) : 0;
    const db = b.publishedAt ? Date.parse(b.publishedAt) : 0;
    return db - da;
  });
  return out;
}

async function fetchFromRss(): Promise<MessageVideo[]> {
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`,
      { next: { revalidate: 1800 } },
    );
    if (!res.ok) return [];
    const xml = await res.text();
    const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)];
    const messages: MessageVideo[] = [];
    for (const match of entries) {
      const block = match[1] || "";
      const id = block.match(/<yt:videoId>([^<]+)/)?.[1];
      const titleRaw = block.match(/<title>([^<]+)/)?.[1];
      const published = block.match(/<published>([^<]+)/)?.[1];
      if (!id || !titleRaw) continue;
      const title = decodeXml(titleRaw);
      const isShort = /\/shorts\//.test(block) || isSkippedMessage(title);
      if (isShort) continue;
      messages.push({
        id,
        title,
        publishedAt: published,
        thumbnail: thumbFor(id),
      });
    }
    return messages;
  } catch {
    return [];
  }
}

/**
 * Fetch many pastor upload videos in upload order (newest → older).
 * No random reshuffle — hub / search need the real stack of teachings.
 */
export async function fetchPastorMessages(
  limit = 120,
): Promise<MessageVideo[]> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    const rss = await fetchFromRss();
    const merged = mergeMessages(rss, MESSAGE_FALLBACK);
    return merged.slice(0, Math.min(limit, merged.length));
  }

  try {
    const messages: MessageVideo[] = [];
    let pageToken: string | undefined;

    while (messages.length < limit) {
      const params = new URLSearchParams({
        part: "snippet,contentDetails",
        playlistId: UPLOADS_PLAYLIST,
        maxResults: "50",
        key,
      });
      if (pageToken) params.set("pageToken", pageToken);

      const playlistRes = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?${params}`,
        { next: { revalidate: 3600 } },
      );
      if (!playlistRes.ok) throw new Error("playlist failed");
      const playlist = (await playlistRes.json()) as {
        nextPageToken?: string;
        items?: Array<{
          contentDetails?: { videoId?: string };
          snippet?: {
            title?: string;
            publishedAt?: string;
            thumbnails?: {
              maxres?: { url?: string };
              high?: { url?: string };
              medium?: { url?: string };
            };
          };
        }>;
      };

      for (const item of playlist.items || []) {
        const id = item.contentDetails?.videoId;
        const title = item.snippet?.title || "";
        if (!id || !title || isSkippedMessage(title)) continue;
        messages.push({
          id,
          title,
          publishedAt: item.snippet?.publishedAt,
          thumbnail: thumbFor(
            id,
            item.snippet?.thumbnails?.maxres?.url,
          ),
        });
        if (messages.length >= limit) break;
      }

      pageToken = playlist.nextPageToken;
      if (!pageToken) break;
    }

    if (messages.length) return messages.slice(0, limit);
    const rss = await fetchFromRss();
    const merged = mergeMessages(rss, MESSAGE_FALLBACK);
    return merged.slice(0, Math.min(limit, merged.length));
  } catch {
    const rss = await fetchFromRss();
    const merged = mergeMessages(rss, MESSAGE_FALLBACK);
    return merged.slice(0, Math.min(limit, merged.length));
  }
}

/** Find a pastor upload whose title matches all required phrases (case-insensitive). */
export async function findPastorMessage(
  required: string[],
  prefer: string[] = [],
): Promise<MessageVideo | null> {
  const messages = await fetchPastorMessages(120);
  const requiredLower = required.map((s) => s.toLowerCase());
  const preferLower = prefer.map((s) => s.toLowerCase());

  const matches = messages.filter((m) => {
    const title = m.title.toLowerCase();
    return requiredLower.every((phrase) => title.includes(phrase));
  });

  if (!matches.length) return null;

  const score = (m: MessageVideo) => {
    const title = m.title.toLowerCase();
    let points = 0;
    for (const phrase of preferLower) {
      if (title.includes(phrase)) points += 10;
    }
    return points;
  };

  matches.sort((a, b) => score(b) - score(a));
  return matches[0] ?? null;
}

export async function fetchLatestMessages(
  limit = 5,
): Promise<MessageVideo[]> {
  // Homepage still prefers Acts for featured warmth
  const all = await fetchPastorMessages(Math.max(limit * 3, 25));
  const acts = all.filter((m) => m.title.toLowerCase().includes("acts"));
  const rest = all.filter((m) => !m.title.toLowerCase().includes("acts"));
  const ordered = [...acts, ...rest];
  const picked = ordered.slice(0, limit);
  return picked.length ? picked : MESSAGE_FALLBACK.slice(0, limit);
}

function parseDuration(iso: string): number {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  return (
    Number(m[1] || 0) * 3600 + Number(m[2] || 0) * 60 + Number(m[3] || 0)
  );
}

function scoreVideo(input: {
  title: string;
  duration: number;
  definition: string;
  views: number;
}): number {
  const t = input.title.toLowerCase();
  let score = 0;
  if (input.definition === "hd") score += 40;
  if (input.duration >= 90 && input.duration <= 2400) score += 35;
  else if (input.duration >= 45 && input.duration < 90) score += 25;
  for (const kw of [
    "worship",
    "praise",
    "mettle",
    "yahweh",
    "service",
    "impartation",
    "live",
  ]) {
    if (t.includes(kw)) score += 18;
  }
  // Prefer Just Men / message atmosphere for hero
  if (t.includes("just men")) score += 50;
  if (t.includes("#shorts") || t.includes("short")) score -= 25;
  score += Math.min(input.views / 800, 25);
  return score;
}

export async function resolveHeroVideo(): Promise<HeroVideo> {
  const key = process.env.YOUTUBE_API_KEY;
  const fallbackId =
    process.env.YOUTUBE_HERO_FALLBACK_ID || "qFvmiRYWWh4";

  if (!key) {
    return {
      id: fallbackId,
      title: "Just Men",
      startSeconds: 95,
    };
  }

  try {
    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${UPLOADS_PLAYLIST}&maxResults=30&key=${key}`,
      { next: { revalidate: 3600 } },
    );
    if (!playlistRes.ok) throw new Error("playlist fetch failed");
    const playlist = await playlistRes.json();
    const ids: string[] = (playlist.items || [])
      .map(
        (item: { contentDetails?: { videoId?: string } }) =>
          item.contentDetails?.videoId,
      )
      .filter(Boolean);

    // Always include known cinematic candidates
    const preferred = [
      "qFvmiRYWWh4", // Just Men
      "Mqagb6d91YA",
      "Qd830CvyJb0",
      "ys4CMmykRh8",
      "CD54YeRlToo",
      "DVmHLO1-23s",
      fallbackId,
    ];
    const unique = Array.from(new Set([...preferred, ...ids])).slice(0, 20);

    const detailsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${unique.join(",")}&key=${key}`,
      { next: { revalidate: 3600 } },
    );
    if (!detailsRes.ok) throw new Error("details fetch failed");
    const details = await detailsRes.json();

    type Ranked = HeroVideo & { score: number };
    const ranked: Ranked[] = (details.items || []).map(
      (v: {
        id: string;
        snippet: { title: string };
        contentDetails: { duration: string; definition: string };
        statistics: { viewCount?: string };
      }) => {
        const duration = parseDuration(v.contentDetails.duration);
        const score = scoreVideo({
          title: v.snippet.title,
          duration,
          definition: v.contentDetails.definition,
          views: Number(v.statistics.viewCount || 0),
        });
        return {
          id: v.id,
          title: v.snippet.title,
          startSeconds: duration > 120 ? 40 : 0,
          score,
        };
      },
    );

    ranked.sort((a, b) => b.score - a.score);
    const best = ranked[0];
    if (best) {
      return {
        id: best.id,
        title: best.title,
        startSeconds: best.startSeconds,
      };
    }
  } catch {
    // fall through
  }

  void CHANNEL_ID;
  return {
    id: fallbackId,
    title: "Just Men",
    startSeconds: 95,
  };
}
