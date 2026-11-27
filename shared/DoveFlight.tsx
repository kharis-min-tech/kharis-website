"use client";

import { useEffect, useRef, useState } from "react";
import { advanceDoveGame, createDoveGame, DOVE_GAME } from "./dove-game";
import styles from "./MissingPage.module.css";

const COURSE_LENGTH = 3;
const initialFlight = createDoveGame();

type Phase = "ready" | "playing" | "paused" | "over" | "found";

function Sheep({ x, y }: { x: number; y: number }) {
  return (
    <g className={styles.sheep} transform={`translate(${x} ${y})`}>
      <path d="M-10 8v8m11-8v8" />
      <path d="M-18 4a7 7 0 0 1 1-12 8 8 0 0 1 13-2 7 7 0 0 1 12 4v8c-4 6-21 8-26 2Z" />
      <path d="M7-5c5-5 13-2 13 4 0 5-7 8-12 5" />
      <circle cx="15" cy="-1" r="1" fill="currentColor" />
    </g>
  );
}

export function DoveFlight() {
  const [phase, setPhase] = useState<Phase>("ready");
  const [frame, setFrame] = useState(initialFlight);
  const flight = useRef(initialFlight);
  const action = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (phase !== "playing") return;
    let request: number;
    let last = 0;

    function tick(now: number) {
      const seconds = last ? (now - last) / 1000 : 0;
      last = now;
      const next = advanceDoveGame(flight.current, seconds);
      flight.current = next;
      setFrame(next);
      if (next.over || next.score >= COURSE_LENGTH) {
        setPhase(next.over ? "over" : "found");
        return;
      }
      request = requestAnimationFrame(tick);
    }

    function pauseWhenHidden() {
      if (document.hidden) setPhase("paused");
    }

    request = requestAnimationFrame(tick);
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => {
      cancelAnimationFrame(request);
      document.removeEventListener("visibilitychange", pauseWhenHidden);
    };
  }, [phase]);

  function activate() {
    if (phase === "playing") {
      flight.current = { ...flight.current, velocity: DOVE_GAME.flapVelocity };
    } else if (phase !== "paused") {
      flight.current = createDoveGame();
      setFrame(flight.current);
    }
    setPhase("playing");
  }

  const label = {
    ready: "Play",
    playing: "Flap",
    paused: "Resume",
    over: "Try again",
    found: "Play again",
  }[phase];
  const status = {
    ready: "Fly through the gates to find the missing sheep.",
    playing: "",
    paused: "Flight paused.",
    over: "The sheep is still out there. Try again?",
    found: "You found the one!",
  }[phase];
  const goalTower = frame.towers.find((tower) => tower.id === COURSE_LENGTH - 1);
  const tilt = Math.max(
    DOVE_GAME.minTilt,
    Math.min(DOVE_GAME.maxTilt, frame.velocity / DOVE_GAME.tiltVelocityDivisor),
  );

  return (
    <section className={styles.game} aria-label="Dove Flight game">
      <div className={styles.gameHeader}>
        <h2>Dove Flight</h2>
        <span className={styles.score}>
          Gates{" "}
          <strong>
            {frame.score}/{COURSE_LENGTH}
          </strong>
        </span>
      </div>
      <div
        className={styles.playArea}
        onKeyDown={(event) => {
          if (event.key === "ArrowUp" && event.target === action.current) {
            event.preventDefault();
            if (!event.repeat) activate();
          }
        }}
      >
        <svg
          className={styles.scene}
          viewBox={`0 0 ${DOVE_GAME.width} ${DOVE_GAME.ground}`}
          aria-hidden="true"
          onClick={activate}
        >
          <rect className={styles.sky} width={DOVE_GAME.width} height={DOVE_GAME.ground} />
          <circle className={styles.sun} cx="504" cy="75" r="43" />
          <path
            className={styles.cloud}
            d="M27 81h118c0-13-16-21-29-17-4-16-36-17-44 0-19-8-38 2-45 17Zm247-35h100c-3-14-16-20-31-16-5-15-31-16-39 1-11-3-23 5-30 15Z"
          />
          <path className={styles.hill} d="M0 206Q89 144 194 197T391 181T640 183V272H0Z" />
          <path className={styles.field} d="M0 239Q95 213 178 234T367 226T640 222V272H0Z" />
          <path className={styles.trail} d="M0 251Q108 227 184 249T385 239T640 236" />
          {frame.towers
            .filter((tower) => tower.id < COURSE_LENGTH)
            .map((tower) => {
              const gapTop = tower.gapTop;
              const gapBottom = gapTop + DOVE_GAME.gapSize;
              const middle = DOVE_GAME.towerWidth / 2;
              return (
                <g key={tower.id} className={styles.gate} transform={`translate(${tower.x} 0)`}>
                  <path
                    d={`M0 0H${DOVE_GAME.towerWidth}V${gapTop - 15}L${middle} ${gapTop}L0 ${gapTop - 15}Z`}
                  />
                  <path
                    d={`M0 ${DOVE_GAME.ground}H${DOVE_GAME.towerWidth}V${gapBottom + 15}L${middle} ${gapBottom}L0 ${gapBottom + 15}Z`}
                  />
                  <path
                    className={styles.windows}
                    d={`M12 ${gapTop - 38}h7v12h-7zm17 0h7v12h-7zM12 ${gapBottom + 23}h7v12h-7zm17 0h7v12h-7z`}
                  />
                </g>
              );
            })}
          {goalTower && phase !== "found" && (
            <Sheep x={goalTower.x + 88} y={goalTower.gapTop + DOVE_GAME.gapSize / 2} />
          )}
          {phase === "found" && <Sheep x={282} y={210} />}
          <g
            transform={`translate(${DOVE_GAME.doveX} ${frame.y}) rotate(${phase === "ready" ? 0 : tilt}) scale(${DOVE_GAME.spriteScale})`}
          >
            <g className={phase === "ready" ? `${styles.dove} ${styles.doveIdle}` : styles.dove}>
              <path d="M-15 2-38-13l8 15-9 10 28-3C4 20 29 10 27-4l11-1-11-6C18-23 4-13-2-9-14-26-27-21-20-10Z" />
              <path className={styles.wing} d="M12 2C3 9-9 5-16-3" />
              <circle cx="21" cy="-8" r="1.6" fill="currentColor" />
            </g>
          </g>
        </svg>
        <div className={styles.gameFooter}>
          <button type="button" className={styles.primary} ref={action} onClick={activate}>
            {label}
          </button>
          {phase === "playing" && (
            <button
              type="button"
              className={styles.secondary}
              onClick={() => {
                setPhase("paused");
                action.current?.focus();
              }}
            >
              Pause
            </button>
          )}
          <p className={styles.status} role="status">
            {status}
          </p>
        </div>
      </div>
      <p className={styles.instructions}>
        Tap the scene or use Space or ↑ when the game button is focused.
      </p>
    </section>
  );
}
