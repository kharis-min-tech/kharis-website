"use client";

export function YoutubeEmbed({
  id,
  title,
  thumbnail,
}: {
  id: string;
  title: string;
  thumbnail: string;
}) {
  return (
    <div data-yt-box className="absolute inset-0">
      <button
        type="button"
        data-ui="yt-play"
        data-yt-play={id}
        data-yt-title={title}
        className="absolute inset-0 cursor-pointer group"
        aria-label={`Play ${title}`}
      >
        <img
          src={thumbnail}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-full bg-amber p-6 vibe-glow transition-transform group-hover:scale-110">
            <span
              className="material-symbols-outlined text-4xl leading-none text-[#1a0b00]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              play_arrow
            </span>
          </div>
        </div>
      </button>
    </div>
  );
}
