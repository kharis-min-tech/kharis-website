import https from "https";
import type { InstagramPost } from "@/lib/instagram";

type GraphMedia = {
  id?: string;
  caption?: string;
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
  children?: {
    data?: Array<{
      media_type?: string;
      media_url?: string;
      thumbnail_url?: string;
    }>;
  };
};

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
        headers: { Accept: "application/json" },
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

async function fetchJson<T>(url: string, revalidate: number): Promise<T | null> {
  try {
    let body: string;
    let ok: boolean;
    let status: number;
    try {
      const res = await fetch(url, { next: { revalidate } });
      ok = res.ok;
      status = res.status;
      body = await res.text();
    } catch (error) {
      if (!isCertError(error)) throw error;
      const res = await restGet(url);
      ok = res.ok;
      status = res.status;
      body = res.body;
    }
    if (!ok) {
      console.error("Instagram fetch failed:", status, body.slice(0, 300));
      return null;
    }
    return JSON.parse(body) as T;
  } catch (error) {
    console.error("Instagram request failed:", error);
    return null;
  }
}

function imageFor(item: GraphMedia) {
  if (item.media_type === "VIDEO") return item.thumbnail_url || item.media_url || "";
  if (item.media_type === "CAROUSEL_ALBUM") {
    const child = item.children?.data?.[0];
    if (child?.media_type === "VIDEO") return child.thumbnail_url || child.media_url || "";
    return child?.media_url || item.media_url || item.thumbnail_url || "";
  }
  return item.media_url || item.thumbnail_url || "";
}

function toPost(item: GraphMedia): InstagramPost | null {
  if (!item.id || !item.permalink) return null;
  const image = imageFor(item);
  if (!image) return null;
  return {
    id: item.id,
    permalink: item.permalink,
    image,
    caption: (item.caption || "").trim(),
    timestamp: item.timestamp,
    mediaType: item.media_type || "IMAGE",
  };
}

function mediaUrl(token: string, userId?: string) {
  const fields =
    "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,children{media_type,media_url,thumbnail_url}";
  const params = new URLSearchParams({
    fields,
    limit: "12",
    access_token: token,
  });
  if (userId) {
    return `https://graph.facebook.com/v21.0/${encodeURIComponent(userId)}/media?${params}`;
  }
  return `https://graph.instagram.com/me/media?${params}`;
}

export async function fetchInstagramPosts(limit = 6): Promise<InstagramPost[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return [];

  const payload = await fetchJson<{ data?: GraphMedia[] }>(
    mediaUrl(token, process.env.INSTAGRAM_USER_ID),
    1800,
  );
  return (payload?.data ?? [])
    .map(toPost)
    .filter((post): post is InstagramPost => Boolean(post))
    .slice(0, limit);
}
