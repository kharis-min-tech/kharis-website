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
  if (high && (high.includes("maxresdefault") || high.includes("mqdefault") || high.includes("hq720"))) {
    return high;
  }
  return `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
}

const MESSAGE_FALLBACK: MessageVideo[] = [
  { id: "iXo1fg_PRLM", title: "From Acts To Us | Acts 28:27-31 | David Antwi", thumbnail: thumbFor("iXo1fg_PRLM"), publishedAt: "2026-08-23T00:00:00Z" },
  { id: "iRCcSWEdbPo", title: "The Most Important 3 Days | John 1:19-29 | David Antwi | Kharis Phase Two", thumbnail: thumbFor("iRCcSWEdbPo"), publishedAt: "2026-08-24T00:00:00Z" },
  { id: "El1RpnRYA30", title: "John The Witness | John 1:6-18 | David Antwi | Kharis Phase Two", thumbnail: thumbFor("El1RpnRYA30"), publishedAt: "2026-08-19T00:00:00Z" },
  { id: "bHv6lharURs", title: "Let The Bible Speak | Acts 28:23-27 | David Antwi", thumbnail: thumbFor("bHv6lharURs"), publishedAt: "2026-08-16T00:00:00Z" },
  { id: "KBFfpU0mX2U", title: "A Living Witness For Jesus | Acts 28:1-10 | David Antwi", thumbnail: thumbFor("KBFfpU0mX2U"), publishedAt: "2026-07-20T00:00:00Z" },
];

function isSkippedMessage(title: string) {
  const lower = title.toLowerCase().trim();
  const hashCount = (lower.match(/#/g) || []).length;
  return (
    lower.includes("#shorts") ||
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
        agent: new https.Agent({ rejectUnauthorized: false }),
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

      for (const item of playlist.items || []) {
        const id = item.contentDetails?.videoId;
        const title = item.snippet?.title || "";
        if (!id || !title || isSkippedMessage(title)) continue;
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

export async function fetchPastorMessages(limit = 24): Promise<MessageVideo[]> {
  const [api, rss] = await Promise.all([fetchFromApi(limit), fetchFromRss()]);
  const merged = mergeMessages(api, rss, MESSAGE_FALLBACK);
  return merged.slice(0, Math.min(limit, merged.length));
}

export async function fetchLatestMessages(limit = 5): Promise<MessageVideo[]> {
  const all = await fetchPastorMessages(Math.max(limit * 2, 12));
  return all.slice(0, limit);
}

export function youtubeWatchUrl(id: string) {
  return `https://www.youtube.com/watch?v=${id}`;
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
  return title
    .replace(/\s*\|\s*David Antwi.*$/i, "")
    .replace(/\s*\|\s*Kharis Phase Two.*$/i, "")
    .trim() || title;
}
