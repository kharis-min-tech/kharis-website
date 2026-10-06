export const INSTAGRAM_HANDLE = "kharisphasetwo";
export const INSTAGRAM_PROFILE_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;

export type InstagramPost = {
  id: string;
  permalink: string;
  image: string;
  caption: string;
  timestamp?: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM" | string;
};

export function formatInstagramDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Europe/London",
  });
}

export function instagramCaption(text: string, max = 110) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return "View on Instagram";
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).replace(/\s+\S*$/, "").trim()}…`;
}
