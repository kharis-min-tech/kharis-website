import https from "https";

export type MessageVideo = {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt?: string;
};

/** David Antwi — https://www.youtube.com/@davidantwi */
const CHANNEL_ID = "UC4l8WmdF9ivMDQHHVOdYKqQ";
const UPLOADS_PLAYLIST = "UU4l8WmdF9ivMDQHHVOdYKqQ";

function thumbFor(id: string, high?: string) {
  if (
    high &&
    (high.includes("maxresdefault") || high.includes("mqdefault") || high.includes("hq720"))
  ) {
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

function isSkippedMessage(title: string) {
  const lower = title.toLowerCase().trim();
  const hashCount = (lower.match(/#/g) || []).length;
  return (
    lower.includes("#shorts") ||
    lower.includes("#short") ||
    /\bshorts\b/.test(lower) ||
    lower.includes("#preach") ||
    hashCount >= 2 ||
    lower.endsWith(" shorts") ||
    lower.includes("days to go") ||
    lower.includes("please don’t say") ||
    lower.includes("please don't say") ||
    lower.includes("joe mettle") ||
    lower.includes("minister joe") ||
    /\bmettle\b/.test(lower) ||
    lower.includes("music video") ||
    lower.includes("valentine") ||
    lower.includes("ltbsc.com") ||
    /^acts series(\s*\|.*)?$/.test(lower)
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

function isCertError(error: unknown) {
  const code =
    (error as { cause?: { code?: string }; code?: string } | null)?.cause?.code ??
    (error as { code?: string } | null)?.code;
  return code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE" || code === "CERT_UNTRUSTED";
}

function restGet(url: string): Promise<{ ok: boolean; status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: { Accept: "application/xml, application/json, */*" },
        agent: new https.Agent({ rejectUnauthorized: true }),
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk) => chunks.push(chunk as Buffer));
        res.on("end", () => {
          resolve({
            ok: (res.statusCode ?? 500) >= 200 && (res.statusCode ?? 500) < 300,
            status: res.statusCode ?? 500,
            body: Buffer.concat(chunks).toString("utf8"),
          });
        });
      },
    );
    req.on("error", reject);
  });
}

async function fetchText(url: string, revalidate: number): Promise<string | null> {
  try {
    try {
      const res = await fetch(url, { next: { revalidate } });
      if (!res.ok) return null;
      return await res.text();
    } catch (error) {
      if (!isCertError(error)) throw error;
      const res = await restGet(url);
      if (!res.ok) return null;
      return res.body;
    }
  } catch (error) {
    console.error("YouTube fetch failed:", error);
    return null;
  }
}

/** YouTube Shorts can run up to 3 minutes. Full teachings are much longer. */
const SHORTS_MAX_SECONDS = 180;

function parseDuration(iso: string) {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  return Number(match[1] || 0) * 3600 + Number(match[2] || 0) * 60 + Number(match[3] || 0);
}

/** Lengths for up to 50 ids. Null when the details call fails, so we don't wipe the list. */
async function fetchDurations(ids: string[], key: string): Promise<Map<string, number> | null> {
  const unique = [...new Set(ids)].slice(0, 50);
  if (!unique.length) return new Map();
  const params = new URLSearchParams({
    part: "contentDetails",
    id: unique.join(","),
    fields: "items(id,contentDetails/duration)",
    key,
  });
  const body = await fetchText(`https://www.googleapis.com/youtube/v3/videos?${params}`, 3600);
  if (!body) return null;
  try {
    const data = JSON.parse(body) as {
      items?: Array<{ id?: string; contentDetails?: { duration?: string } }>;
    };
    const durations = new Map<string, number>();
    for (const video of data.items || []) {
      if (video.id) durations.set(video.id, parseDuration(video.contentDetails?.duration || ""));
    }
    return durations;
  } catch {
    return null;
  }
}

function isShortByLength(seconds: number | undefined, known: boolean) {
  if (!known || seconds == null) return false;
  return seconds <= SHORTS_MAX_SECONDS;
}

async function withoutShorts(messages: MessageVideo[]) {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key || messages.length === 0) return messages;
  const durations = await fetchDurations(
    messages.map((message) => message.id),
    key,
  );
  if (!durations) return messages;
  return messages.filter(
    (message) => !isShortByLength(durations.get(message.id), durations.has(message.id)),
  );
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
  const xml = await fetchText(
    `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`,
    1800,
  );
  if (!xml) return [];

  const messages: MessageVideo[] = [];
  for (const match of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
    const block = match[1] || "";
    const id = block.match(/<yt:videoId>([^<]+)/)?.[1];
    const titleRaw = block.match(/<title>([^<]+)/)?.[1];
    const published = block.match(/<published>([^<]+)/)?.[1];
    if (!id || !titleRaw) continue;
    const title = decodeXml(titleRaw);
    if (/\/shorts\//.test(block) || isSkippedMessage(title)) continue;
    messages.push({ id, title, publishedAt: published, thumbnail: thumbFor(id) });
  }
  return messages;
}

async function fetchFromApi(limit: number): Promise<MessageVideo[]> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return [];

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

      const body = await fetchText(
        `https://www.googleapis.com/youtube/v3/playlistItems?${params}`,
        3600,
      );
      if (!body) break;

      const playlist = JSON.parse(body) as {
        nextPageToken?: string;
        items?: Array<{
          contentDetails?: { videoId?: string };
          snippet?: {
            title?: string;
            publishedAt?: string;
            thumbnails?: { maxres?: { url?: string } };
          };
        }>;
      };

      const items = playlist.items || [];
      const durations = await fetchDurations(
        items.map((item) => item.contentDetails?.videoId || "").filter(Boolean),
        key,
      );

      for (const item of items) {
        const id = item.contentDetails?.videoId;
        const title = item.snippet?.title || "";
        if (!id || !title || isSkippedMessage(title)) continue;
        if (isShortByLength(durations?.get(id), Boolean(durations?.has(id)))) continue;
        messages.push({
          id,
          title,
          publishedAt: item.snippet?.publishedAt,
          thumbnail: thumbFor(id, item.snippet?.thumbnails?.maxres?.url),
        });
        if (messages.length >= limit) break;
      }

      pageToken = playlist.nextPageToken;
      if (!pageToken) break;
    }

    return messages;
  } catch (error) {
    console.error("YouTube API fetch failed:", error);
    return [];
  }
}

export async function fetchPastorMessages(limit = 120): Promise<MessageVideo[]> {
  const [api, rss] = await Promise.all([fetchFromApi(Math.max(limit, 24)), fetchFromRss()]);
  const merged = await withoutShorts(mergeMessages(api, rss, MESSAGE_FALLBACK));
  return merged.slice(0, Math.min(limit, merged.length));
}

export async function fetchLatestMessages(limit = 5): Promise<MessageVideo[]> {
  const all = await fetchPastorMessages(Math.max(limit * 3, 25));
  return all.slice(0, limit);
}

export function youtubeWatchUrl(id: string) {
  return `https://www.youtube.com/watch?v=${id}`;
}

export function youtubeVideoId(input: string | null | undefined): string | null {
  const value = input?.trim() ?? "";
  if (!value) return null;
  if (/^[A-Za-z0-9_-]{11}$/.test(value)) return value;
  const match = value.match(
    /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/i,
  );
  return match?.[1] ?? null;
}

export function youtubeThumbnail(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

/** Jump this far into a sermon for ambient hero playback, when the video is long enough. */
export const AMBIENT_START_SECONDS = 10 * 60;

export function ambientStartSeconds(durationSec: number) {
  if (!Number.isFinite(durationSec) || durationSec <= 0) return 0;
  // Need a couple of minutes left so we don't land on credits / the end card.
  if (durationSec >= AMBIENT_START_SECONDS + 120) return AMBIENT_START_SECONDS;
  return 0;
}

export function youtubeEmbedSrc(id: string, autoplay = false) {
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });
  if (autoplay) params.set("autoplay", "1");
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}

export function formatMessageDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Europe/London",
  });
}

export function displayMessageTitle(title: string) {
  return (
    title
      .replace(/\s*\|\s*David Antwi.*$/i, "")
      .replace(/\s*\|\s*Kharis Phase Two.*$/i, "")
      .trim() || title
  );
}
