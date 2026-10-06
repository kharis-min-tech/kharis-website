"use client";

import { useState } from "react";
import { youtubeEmbedSrc } from "@/lib/youtube";

export function YoutubeEmbed({
  id,
  title,
  thumbnail,
}: {
  id: string;
  title: string;
  thumbnail: string;
}) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        className="absolute inset-0 h-full w-full"
        src={youtubeEmbedSrc(id, true)}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="absolute inset-0 group cursor-pointer"
      aria-label={`Play ${title}`}
    >
      <img
        src={thumbnail}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-secondary-container p-6 rounded-full border-4 border-black neo-shadow group-hover:scale-110 transition-transform">
          <span
            className="material-symbols-outlined text-4xl leading-none text-on-background"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            play_arrow
          </span>
        </div>
      </div>
    </button>
  );
}
