"use client";

import { youtubeWatchUrl } from "@/lib/youtube";

export function ShareVideoButton({
  id,
  title,
  className,
}: {
  id: string;
  title: string;
  className?: string;
}) {
  async function share() {
    const url = youtubeWatchUrl(id);
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
    } catch {
      // user cancelled, or share failed — fall through to copy
    }
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.open(url, "_blank", "noreferrer");
    }
  }

  return (
    <button type="button" onClick={share} className={className}>
      <span className="material-symbols-outlined text-lg">share</span>
      SHARE VIDEO
    </button>
  );
}
