"use client";

import { useEffect, useState } from "react";
import type { EventClip } from "@/lib/signature-events";
import { useClipPlayer } from "@/components/useClipPlayer";

type Story = { kicker: string; title: string; intro: string; clips: EventClip[] };

/**
 * A wide cinema screen that plays the clips back to back as chapters. Under it, a timeline where
 * each chapter's width matches its clip's length and fills as it plays; clicking a chapter jumps
 * to it. A caption card under the timeline says what's happening in the current chapter.
 */
export function EventStory({ story }: { story: Story }) {
  const { clips } = story;
  const [index, setIndex] = useState(0);
  const clip = clips[index];
  const { rootRef, videoRef, fillRef, inView, playing, setPlaying } = useClipPlayer(clip.id);
  const go = (i: number) => setIndex((i + clips.length) % clips.length);

  // Finished chapters are full (CSS) and later ones empty: clear any width a fill kept from an
  // earlier pass, e.g. after jumping back.
  useEffect(() => {
    rootRef.current
      ?.querySelectorAll<HTMLElement>(".kp-cinema__track > span")
      .forEach((fill, i) => {
        if (i !== index) fill.style.removeProperty("width");
      });
  }, [index, rootRef]);
  const num = (i: number) => String(i + 1).padStart(2, "0");

  return (
    <div ref={rootRef} className="kp-cinema">
      <header className="kp-cinema__head">
        <p className="kp-kicker">{story.kicker}</p>
        <h3 className="kp-cinema__title">{story.title}</h3>
        <p className="kp-cinema__intro">{story.intro}</p>
      </header>

      <figure className="kp-cinema__screen">
        <div
          key={`fill-${clip.id}`}
          className="kp-cinema__blur"
          style={{ backgroundImage: `url("${clip.poster}")` }}
          aria-hidden="true"
        />
        <video
          key={clip.id}
          ref={videoRef}
          className="kp-cinema__video"
          src={clip.src}
          poster={clip.poster}
          muted
          playsInline
          preload={inView ? "auto" : "none"}
          aria-label={clip.alt}
          onEnded={() => go(index + 1)}
        />
        <figcaption key={`card-${clip.id}`} className="kp-cinema__card">
          <span className="kp-cinema__card-num">Chapter {num(index)}</span>
          <span className="kp-cinema__card-label">{clip.label}</span>
        </figcaption>
        <button
          type="button"
          className="kp-cinema__nav kp-cinema__nav--prev"
          onClick={() => go(index - 1)}
          aria-label={`Previous chapter: ${clips[(index - 1 + clips.length) % clips.length].label}`}
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            west
          </span>
        </button>
        <button
          type="button"
          className="kp-cinema__nav kp-cinema__nav--next"
          onClick={() => go(index + 1)}
          aria-label={`Next chapter: ${clips[(index + 1) % clips.length].label}`}
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            east
          </span>
        </button>
      </figure>

      <div className="kp-cinema__timeline">
        <button
          type="button"
          className="kp-cinema__toggle"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause" : "Play"}
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            {playing ? "pause" : "play_arrow"}
          </span>
        </button>
        <ol className="kp-cinema__chapters">
          {clips.map((c, i) => (
            <li key={c.id} style={{ flexGrow: c.seconds ?? 1 }}>
              <button
                type="button"
                className={`kp-cinema__chapter${i === index ? " is-active" : ""}${i < index ? " is-done" : ""}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => go(i)}
              >
                <span className="kp-cinema__track" aria-hidden="true">
                  <span ref={i === index ? fillRef : undefined} />
                </span>
                <span className="kp-cinema__chapter-num">{num(i)}</span>
                <span className="kp-cinema__chapter-label">{c.label}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <p key={`desc-${clip.id}`} className="kp-cinema__desc" aria-live="polite">
        <b>{clip.label}.</b> {clip.description ?? clip.caption}
      </p>
    </div>
  );
}
