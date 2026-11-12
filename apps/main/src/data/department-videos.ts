const DEPARTMENT_ID_TO_KEY: Record<string, string> = {
  "00000000-0000-4000-8000-000000000001": "Administration",
  "00000000-0000-4000-8000-000000000002": "Children's Department",
  "00000000-0000-4000-8000-000000000003": "Design",
  "00000000-0000-4000-8000-000000000004": "Drama",
  "00000000-0000-4000-8000-000000000005": "Evangelism",
  "00000000-0000-4000-8000-000000000006": "Follow Up",
  "00000000-0000-4000-8000-000000000007": "Guest Relations Team",
  "00000000-0000-4000-8000-000000000008": "Hospitality",
  "00000000-0000-4000-8000-000000000009": "Host Team",
  "00000000-0000-4000-8000-000000000010": "K-Music",
  "00000000-0000-4000-8000-000000000011": "Music",
  "00000000-0000-4000-8000-000000000012": "New Believers",
  "00000000-0000-4000-8000-000000000013": "Photography",
  "00000000-0000-4000-8000-000000000014": "Production",
  "00000000-0000-4000-8000-000000000015": "Sanctuary Keepers",
  "00000000-0000-4000-8000-000000000016": "Security",
  "00000000-0000-4000-8000-000000000017": "Set-up",
  "00000000-0000-4000-8000-000000000018": "Social Media",
  "00000000-0000-4000-8000-000000000019": "Sound",
  "00000000-0000-4000-8000-000000000020": "Spoken Word",
  "00000000-0000-4000-8000-000000000021": "Tech Team",
  "00000000-0000-4000-8000-000000000022": "Uniform",
  "00000000-0000-4000-8000-000000000023": "Ushers",
  "00000000-0000-4000-8000-000000000024": "Welfare",
};

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
]);

export function extractYoutubeId(input: string | null | undefined): string | null {
  const raw = input?.trim();
  if (!raw) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;
  try {
    const url = new URL(raw);
    const host = url.hostname.toLowerCase();
    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }
    if (YOUTUBE_HOSTS.has(host)) {
      const v = url.searchParams.get("v");
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
      const parts = url.pathname.split("/").filter(Boolean);
      const markerIndex = parts.findIndex(
        (part) => part === "embed" || part === "shorts" || part === "live",
      );
      const candidate = markerIndex >= 0 ? parts[markerIndex + 1] : undefined;
      return candidate && /^[a-zA-Z0-9_-]{11}$/.test(candidate) ? candidate : null;
    }
  } catch {
    return null;
  }
  return null;
}

export function extractGoogleDriveId(input: string | null | undefined): string | null {
  const raw = input?.trim();
  if (!raw) return null;
  const apiMatch = raw.match(/^\/api\/department-videos\/([a-zA-Z0-9_-]+)/);
  if (apiMatch?.[1]) return apiMatch[1];
  try {
    const url = new URL(raw);
    if (url.hostname.toLowerCase() !== "drive.google.com") return null;
    const fileMatch = url.pathname.match(/^\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileMatch?.[1]) return fileMatch[1];
    const queryId = url.searchParams.get("id");
    return queryId && /^[a-zA-Z0-9_-]+$/.test(queryId) ? queryId : null;
  } catch {
    return null;
  }
}

export type ResolvedDepartmentVideo =
  { kind: "youtube"; embedUrl: string } | { kind: "video"; src: string; poster?: string };

export function resolveDepartmentVideoSource(rawUrl: string): ResolvedDepartmentVideo {
  const trimmed = rawUrl.trim();
  const ytId = extractYoutubeId(trimmed);
  if (ytId) {
    return {
      kind: "youtube",
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0`,
    };
  }

  const driveId = extractGoogleDriveId(trimmed);
  if (driveId) {
    return {
      kind: "video",
      src: `/api/department-videos/${driveId}`,
      poster: `/api/department-videos/${driveId}/poster`,
    };
  }

  return {
    kind: "video",
    src: trimmed,
  };
}

export async function fetchCustomDepartmentVideos(): Promise<Record<string, string>> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !supabaseKey) return {};

  try {
    const res = await fetch(
      `${supabaseUrl.replace(/\/+$/, "")}/rest/v1/media?select=owner_id,folder,url&owner_type=eq.department-video&order=sort_order.asc`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        cache: "no-store",
      },
    );
    if (!res.ok) return {};
    const rows = (await res.json()) as {
      owner_id?: string | null;
      folder?: string | null;
      url?: string | null;
    }[];
    const map: Record<string, string> = {};
    for (const row of rows) {
      const key =
        (row.folder && row.folder.trim()) ||
        (row.owner_id ? DEPARTMENT_ID_TO_KEY[row.owner_id] : "") ||
        "";
      const url = row.url?.trim() ?? "";
      if (key && url && !map[key]) {
        map[key] = url;
      }
    }
    return map;
  } catch {
    return {};
  }
}
