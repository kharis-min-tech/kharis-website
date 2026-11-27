"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { advanceDoveGame, createDoveGame, DOVE_GAME } from "@/lib/dove-game";

type GamePhase = "ready" | "playing" | "over";

export function NotFoundExperience() {
  const [phase, setPhase] = useState<GamePhase>("ready");
  const [frame, setFrame] = useState(createDoveGame);
  const phaseRef = useRef<GamePhase>("ready");
  const game = useRef(frame);

  const handleGameAction = useCallback(() => {
    if (phaseRef.current !== "playing") {
      game.current = createDoveGame();
      setFrame(game.current);
      phaseRef.current = "playing";
      setPhase("playing");
      return;
    }
    game.current = { ...game.current, velocity: DOVE_GAME.flapVelocity };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Space" && event.code !== "ArrowUp") return;
      const target = event.target;
      if (target instanceof HTMLElement && /INPUT|TEXTAREA|BUTTON|A/.test(target.tagName)) return;
      event.preventDefault();
      if (!event.repeat) handleGameAction();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleGameAction]);

  useEffect(() => {
    if (phase !== "playing") return;
    let raf = 0;
    let previousTime = 0;
    const tick = (time: number) => {
      if (!previousTime) previousTime = time;
      const elapsed = (time - previousTime) / 1000;
      previousTime = time;
      game.current = advanceDoveGame(game.current, elapsed);
      setFrame(game.current);
      if (game.current.over) {
        phaseRef.current = "over";
        setPhase("over");
      } else {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  const actionLabel = phase === "ready" ? "Play" : phase === "over" ? "Play again" : "Flap";
  const statusText =
    phase === "ready"
      ? "Tap the game or press Space to start."
      : phase === "over"
        ? `You scored ${frame.score} ${frame.score === 1 ? "point" : "points"}. Give it another go!`
        : `${frame.score} ${frame.score === 1 ? "point" : "points"} collected. Keep flying!`;

  return (
    <section className="not-found" aria-labelledby="not-found-title">
      <div className="not-found__game" role="group" aria-label="404 dove flight game">
        <div className="not-found__game-head">
          <div>
            <p className="not-found__game-kicker">ERROR 404</p>
            <p className="not-found__game-hint">Guide the dove through the church towers.</p>
          </div>
          <p className="not-found__game-404" aria-label="Error 404">
            404
          </p>
          <p className="not-found__score" aria-label={`Points ${frame.score}`}>
            <span>POINTS</span>
            <strong>{String(frame.score).padStart(2, "0")}</strong>
          </p>
        </div>

        <svg
          className="not-found__game-art"
          onClick={handleGameAction}
          viewBox="0 0 640 300"
          role="img"
          aria-label="A dove flies between church towers. In the background: But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles, they shall run, and not be weary; and they shall walk, and not faint. Isaiah 40:31, King James Version."
        >
          <defs>
            <linearGradient id="dove-sky" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#fff8ed" />
              <stop offset="1" stopColor="#eee5f8" />
            </linearGradient>
            <linearGradient id="dove-path" x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#ded2ee" />
              <stop offset="1" stopColor="#c8b4e3" />
            </linearGradient>
          </defs>
          <rect width="640" height="300" fill="url(#dove-sky)" />
          <text
            x="515"
            y="204"
            textAnchor="middle"
            fill="#6f2fd2"
            opacity=".16"
            fontSize="112"
            fontWeight="900"
          >
            404
          </text>
          <g aria-hidden="true">
            <rect x="24" y="14" width="592" height="116" rx="10" fill="#fff" opacity=".88" />
            <text x="44" y="40" fill="#33233f" fontSize="14" fontWeight="700">
              But they that wait upon the LORD shall renew their strength;
            </text>
            <text x="44" y="61" fill="#33233f" fontSize="14" fontWeight="700">
              they shall mount up with wings as eagles, they shall run,
            </text>
            <text x="44" y="82" fill="#33233f" fontSize="14" fontWeight="700">
              and not be weary; and they shall walk, and not faint.
            </text>
            <text x="44" y="111" fill="#684393" fontSize="12" fontWeight="800" letterSpacing="1.4">
              ISAIAH 40:31 · KJV
            </text>
          </g>
          <path d="M0 206 Q95 162 190 199 T380 189 T640 190 V300 H0Z" fill="#fff" opacity=".55" />
          <path d="M0 252 Q150 220 304 245 T640 232 V300 H0Z" fill="url(#dove-path)" />
          <path
            d="M0 272 H640"
            stroke="#6c4c92"
            strokeWidth="4"
            strokeDasharray="12 12"
            opacity=".42"
          />

          <g opacity=".18" fill="#4d3470">
            <path d="M280 209 V155 L302 133 L324 155 V209Z" />
            <path d="M294 151 V123 L302 109 L310 123 V151Z" />
            <path d="M355 209 V168 L374 148 L393 168 V209Z" />
          </g>

          <g
            className={phase === "ready" ? "not-found__dove-bob" : undefined}
            data-dove-y={frame.y}
            data-dove-velocity={frame.velocity}
          >
            <g
              transform={`translate(${DOVE_GAME.doveX} ${frame.y}) rotate(${phase === "playing" ? Math.max(DOVE_GAME.minTilt, Math.min(DOVE_GAME.maxTilt, frame.velocity / DOVE_GAME.tiltVelocityDivisor)) : 0}) scale(${DOVE_GAME.spriteScale}) translate(-112 -133)`}
            >
              <path
                d="M95 145 L75 128 L80 148 L69 161 L99 159Z"
                fill="#fff"
                stroke="#6f2fd2"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <ellipse
                cx="112"
                cy="142"
                rx="27"
                ry="16"
                fill="#fff"
                stroke="#6f2fd2"
                strokeWidth="2"
              />
              <path
                className="not-found__dove-wing"
                d="M99 140 Q83 115 99 105 Q122 102 132 130 Q119 127 106 141Z"
                fill="#f4effb"
                stroke="#6f2fd2"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M97 121 Q108 113 119 123 M94 129 Q106 121 122 131"
                fill="none"
                stroke="#c9b4e4"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="133" cy="132" r="11" fill="#fff" stroke="#6f2fd2" strokeWidth="2" />
              <path
                d="M142 132 L154 136 L142 140Z"
                fill="#fff"
                stroke="#6f2fd2"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <circle cx="136" cy="130" r="1.7" fill="#211a27" />
            </g>
          </g>

          {frame.towers.map((tower) => (
            <g
              key={tower.id}
              transform={`translate(${tower.x} 0)`}
              fill="#6034a0"
              data-tower-x={tower.x}
              data-gap-top={tower.gapTop}
            >
              <path
                d={`M0 0 H${DOVE_GAME.towerWidth} V${tower.gapTop - 22} L${DOVE_GAME.towerWidth / 2} ${tower.gapTop} L0 ${tower.gapTop - 22}Z`}
              />
              <path
                d={`M0 300 H${DOVE_GAME.towerWidth} V${tower.gapTop + DOVE_GAME.gapSize + 22} L${DOVE_GAME.towerWidth / 2} ${tower.gapTop + DOVE_GAME.gapSize} L0 ${tower.gapTop + DOVE_GAME.gapSize + 22}Z`}
              />
              <path
                d={`M12 ${tower.gapTop - 44} h8 v16 h-8z M27 ${tower.gapTop - 44} h8 v16 h-8z M12 ${tower.gapTop + DOVE_GAME.gapSize + 32} h8 v16 h-8z M27 ${tower.gapTop + DOVE_GAME.gapSize + 32} h8 v16 h-8z`}
                fill="#f6c94a"
                opacity=".86"
              />
            </g>
          ))}
        </svg>

        <div className="not-found__game-footer">
          <p className="not-found__game-status" aria-live="polite">
            {statusText}
          </p>
          <button className="not-found__jump" type="button" onClick={handleGameAction}>
            <span aria-hidden="true">{phase === "playing" ? "↑" : "▶"}</span>
            {actionLabel}
          </button>
        </div>
        <p className="not-found__controls">
          Space, ↑ or tap the game to flap ·{" "}
          <a
            className="not-found__verse-link"
            href="https://www.biblegateway.com/passage/?search=Isaiah%2040%3A31&version=KJV"
            target="_blank"
            rel="noreferrer"
          >
            Read Isaiah 40:31 (KJV)
          </a>
        </p>
      </div>

      <div className="not-found__copy">
        <p className="not-found__eyebrow">Lost the path</p>
        <h1 id="not-found-title">This page wandered off</h1>
        <p className="not-found__lede">
          The link you followed does not exist here. Let&apos;s get you back to church.
        </p>
        <Link href="/" className="not-found__cta">
          Take me home
        </Link>
      </div>
    </section>
  );
}
