"use client";

import type { EventTeam } from "@/lib/signature-events";
import { InViewVideo } from "@/components/InViewVideo";

type Teams = { kicker: string; title: string; intro: string; teams: EventTeam[] };

/**
 * The team entrances side by side, each a trading card in its team colour: a jersey-style header
 * (name and an outlined number), the entrance clip framed in the colour (playing while on
 * screen), and the team's own line at the foot. The winners get a gold outline and a Champions
 * ribbon. Pointing at a card lifts it and dims the rest. On phones the row scrolls sideways.
 */
export function EventTeams({ teams }: { teams: Teams }) {
  return (
    <div className="kp-teams">
      <header className="kp-teams__head">
        <p className="kp-kicker">{teams.kicker}</p>
        <h3 className="kp-teams__title">{teams.title}</h3>
        <p className="kp-teams__intro">{teams.intro}</p>
      </header>

      <ul className="kp-teams__row">
        {teams.teams.map((team, i) => (
          <li
            key={team.id}
            className={`kp-team${team.champion ? " is-champion" : ""}`}
            style={
              {
                "--team": team.colour,
                "--on-team": team.onColour,
                "--tilt": i % 2 ? "1deg" : "-1deg",
              } as React.CSSProperties
            }
          >
            {team.champion ? (
              <span className="kp-team__ribbon">
                <span className="material-symbols-outlined" aria-hidden="true">
                  emoji_events
                </span>
                Champions
              </span>
            ) : null}
            <article className="kp-team__card" aria-label={`${team.name} team`}>
              <header className="kp-team__head">
                <p className="kp-team__name">
                  <span className="kp-team__word">Team</span>
                  {team.name}
                </p>
                <span className="kp-team__num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </header>
              <div className="kp-team__frame">
                <InViewVideo
                  src={team.src}
                  poster={team.poster}
                  className="kp-team__video"
                  label={team.alt}
                />
              </div>
              <p className="kp-team__line">
                <span className="kp-team__quote" aria-hidden="true">
                  “
                </span>
                {team.line}
              </p>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
