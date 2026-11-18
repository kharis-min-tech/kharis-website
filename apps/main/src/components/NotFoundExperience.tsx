"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type GamePhase = "ready" | "playing" | "over";
type GameFrame = { doveY: number; obstacleX: number; points: number };

const initialFrame: GameFrame = { doveY: 170, obstacleX: 660, points: 0 };

export function NotFoundExperience() {
  const [phase, setPhase] = useState<GamePhase>("ready");
  const [frame, setFrame] = useState(initialFrame);
  const phaseRef = useRef<GamePhase>("ready");
  const doveY = useRef(initialFrame.doveY);
  const velocityY = useRef(0);
  const obstacleX = useRef(initialFrame.obstacleX);
  const points = useRef(0);

  const startGame = useCallback(() => {
    doveY.current = initialFrame.doveY;
    velocityY.current = 0;
    obstacleX.current = initialFrame.obstacleX;
    points.current = 0;
    setFrame(initialFrame);
    phaseRef.current = "playing";
    setPhase("playing");
  }, []);

  const flap = useCallback(() => {
    if (phaseRef.current === "playing") velocityY.current = -6.8;
  }, []);

  const handleGameAction = useCallback(() => {
    if (phaseRef.current !== "playing") {
      startGame();
      return;
    }
    flap();
  }, [flap, startGame]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Space" && event.code !== "ArrowUp") return;
      const target = event.target;
      if (target instanceof HTMLElement && /INPUT|TEXTAREA|BUTTON|A/.test(target.tagName)) return;
      event.preventDefault();
      handleGameAction();
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
      const step = Math.min((time - previousTime) / 16.67, 2);
      previousTime = time;

      velocityY.current = Math.min(8, velocityY.current + 0.38 * step);
      doveY.current = Math.max(20, Math.min(280, doveY.current + velocityY.current * step));
      obstacleX.current -= Math.min(7.4, 5.1 + points.current * 0.18) * step;
      if (obstacleX.current < -46) {
        obstacleX.current = 660;
        points.current += 1;
      }

      const obstacleOverlapsDove = obstacleX.current < 153 && obstacleX.current > 76;
      const hitTower = obstacleOverlapsDove && (doveY.current < 96 || doveY.current > 204);
      const nextFrame = {
        doveY: doveY.current,
        obstacleX: obstacleX.current,
        points: points.current,
      };

      if (hitTower) {
        phaseRef.current = "over";
        setPhase("over");
        setFrame(nextFrame);
        return;
      }

      setFrame(nextFrame);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  const actionLabel = phase === "ready" ? "Play" : phase === "over" ? "Play again" : "Flap";
  const statusText =
    phase === "ready"
      ? "Tap Play or press Space to guide the dove."
      : phase === "over"
        ? `You scored ${frame.points} ${frame.points === 1 ? "point" : "points"}. Give it another go!`
        : `${frame.points} ${frame.points === 1 ? "point" : "points"} collected. Keep flying!`;

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
          <p className="not-found__score" aria-label={`Points ${frame.points}`}>
            <span>POINTS</span>
            <strong>{String(frame.points).padStart(2, "0")}</strong>
          </p>
        </div>

        <svg
          className="not-found__game-art"
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

          <g transform={`translate(0 ${frame.doveY - initialFrame.doveY})`}>
            <ellipse cx="115" cy="155" rx="27" ry="6" fill="#27183c" opacity=".14" />
            <g className={phase === "playing" ? "not-found__dove-flutter" : ""}>
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

          <g transform={`translate(${frame.obstacleX} 0)`} fill="#6034a0">
            <path d="M0 0 H46 V67 L23 89 L0 67Z" />
            <path d="M0 300 H46 V229 L23 207 L0 229Z" />
            <path
              d="M12 45 h8 v16 h-8z M27 45 h8 v16 h-8z M12 239 h8 v16 h-8z M27 239 h8 v16 h-8z"
              fill="#f6c94a"
              opacity=".86"
            />
            <path d="M23 0 V-17 M19 -12 h8 M23 283 V300" stroke="#d4920a" strokeWidth="4" />
          </g>
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
          Space or ↑ to flap · tap the button on mobile ·{" "}
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
