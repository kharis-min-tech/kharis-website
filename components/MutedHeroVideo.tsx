"use client";

import { AMBIENT_START_SECONDS } from "@/lib/youtube";

export function MutedHeroVideo({
  id,
  thumbnail,
  title,
}: {
  id: string;
  thumbnail: string;
  title: string;
}) {
  const src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&controls=0&playsinline=1&rel=0&modestbranding=1&loop=1&playlist=${id}&start=${AMBIENT_START_SECONDS}&disablekb=1&fs=0&iv_load_policy=3`;

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#06070a]">
      <img
        src={thumbnail}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="muted-hero-frame pointer-events-none absolute left-1/2 top-1/2 aspect-video h-[56.25vw] w-[177.78%] min-h-full min-w-full -translate-x-1/2 -translate-y-1/2">
        <iframe
          className="h-full w-full"
          src={src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
