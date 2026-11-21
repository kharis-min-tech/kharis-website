"use client";

import type { EventBout } from "@/lib/signature-events";
import { InViewVideo } from "@/components/InViewVideo";

type Bouts = { kicker: string; title: string; intro: string; bouts: EventBout[] };

/**
 * Head-to-head bouts as fight-poster cards: a split header in the two teams' colours with a VS
 * diamond, and the clip below. All the cards hang on one rope that runs behind the row.
 */
export function EventBouts({ bouts }: { bouts: Bouts }) {
  return (
    <div className="kp-bouts">
      <header className="kp-bouts__head">
        <p className="kp-kicker">{bouts.kicker}</p>
        <h3 className="kp-bouts__title">{bouts.title}</h3>
        <p className="kp-bouts__intro">{bouts.intro}</p>
      </header>

      <div className="kp-bouts__arena">
        <span className="kp-bouts__rope" aria-hidden="true" />
        <ol className="kp-bouts__list">
          {bouts.bouts.map((bout, i) => (
            <li
              key={bout.id}
              className="kp-bout"
              style={
                {
                  "--home": bout.home.colour,
                  "--on-home": bout.home.onColour,
                  "--away": bout.away.colour,
                  "--on-away": bout.away.onColour,
                  "--tilt": i % 2 ? "1.2deg" : "-1.2deg",
                } as React.CSSProperties
              }
            >
              <p className="kp-bout__label">Bout {i + 1}</p>
              <h4 className="kp-bout__title">
                <span className="kp-bout__side kp-bout__side--home">{bout.home.name}</span>
                <span className="kp-bout__vs">
                  <span>vs</span>
                </span>
                <span className="kp-bout__side kp-bout__side--away">{bout.away.name}</span>
              </h4>
              <div className="kp-bout__frame">
                <InViewVideo
                  src={bout.src}
                  poster={bout.poster}
                  className="kp-bout__video"
                  label={bout.alt}
                />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
