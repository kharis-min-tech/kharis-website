"use client";

import { useState } from "react";
import type { EventClip } from "@/lib/signature-events";
import { useClipPlayer } from "@/components/useClipPlayer";

type Lineup = { kicker: string; title: string; intro: string; acts: EventClip[] };

/**
 * "Now showing": one act plays on a big screen (the portrait clip centred over a blurred copy of
 * its poster), with the other acts as thumbnails beside it. Picking a thumbnail swaps it onto the
 * screen and the act that was playing takes its place in the grid. When a clip ends, the next act
 * in the running order comes on by itself.
 */
export function EventLineup({ lineup }: { lineup: Lineup }) {
  const { acts } = lineup;
  // order[0] is on screen; order[1..] are the thumbnails, in their current slots.
  const [order, setOrder] = useState(() => acts.map((_, i) => i));
  const active = order[0];
  const act = acts[active];
  const { rootRef, videoRef, fillRef, inView, playing, setPlaying } = useClipPlayer(act.id);

  const show = (i: number) =>
    setOrder((o) => {
      const slot = o.indexOf(i);
      if (slot <= 0) return o;
      const next = [...o];
      [next[0], next[slot]] = [next[slot], next[0]];
      return next;
    });

  return (
    <div ref={rootRef} className="kp-lineup">
      <header className="kp-lineup__head">
        <p className="kp-kicker">{lineup.kicker}</p>
        <h3 className="kp-lineup__title">{lineup.title}</h3>
        <p className="kp-lineup__intro">{lineup.intro}</p>
      </header>

      <div className="kp-lineup__layout">
        <figure className="kp-lineup__screen">
          <div
            key={`fill-${act.id}`}
            className="kp-lineup__blur"
            style={{ backgroundImage: `url("${act.poster}")` }}
            aria-hidden="true"
          />
          <video
            key={act.id}
            ref={videoRef}
            className="kp-lineup__video"
            src={act.src}
            poster={act.poster}
            muted
            playsInline
            preload={inView ? "auto" : "none"}
            aria-label={act.alt}
            onEnded={() => show((active + 1) % acts.length)}
          />
          <p className="kp-lineup__now">
            Now showing
            <b>
              {String(active + 1).padStart(2, "0")} / {String(acts.length).padStart(2, "0")}
            </b>
          </p>
          <figcaption key={`cap-${act.id}`} className="kp-lineup__screen-copy">
            <span className="kp-lineup__screen-label">{act.label}</span>
            <span className="kp-lineup__screen-caption">{act.caption}</span>
          </figcaption>
          <button
            type="button"
            className="kp-lineup__toggle"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? `Pause ${act.label}` : `Play ${act.label}`}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              {playing ? "pause" : "play_arrow"}
            </span>
          </button>
          <span className="kp-lineup__progress" aria-hidden="true">
            <span ref={fillRef} />
          </span>
        </figure>

        <ul className="kp-lineup__picker" aria-label={`More from ${lineup.title}`}>
          {order.slice(1).map((i, slot) => {
            const a = acts[i];
            return (
              <li key={`${slot}-${a.id}`}>
                <button
                  type="button"
                  className="kp-lineup__thumb"
                  onClick={() => show(i)}
                  aria-label={`Show ${a.label}: ${a.caption}`}
                >
                  <img src={a.poster} alt="" loading="lazy" decoding="async" />
                  <span className="kp-lineup__thumb-label">{a.label}</span>
                  <span
                    className="kp-lineup__thumb-play material-symbols-outlined"
                    aria-hidden="true"
                  >
                    play_arrow
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
