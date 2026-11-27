"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./MissingPage.module.css";

const HEIGHT = 270;
const DOVE_X = 112;
const DOVE_RADIUS = 12;
const GATE_WIDTH = 48;
const GAP = 124;
const GATE_CENTERS = [135, 153, 117];
const COURSE_LENGTH = GATE_CENTERS.length;
const START_X = 600;

type Phase = "ready" | "playing" | "paused" | "over" | "found";
type Flight = { y: number; velocity: number; gateX: number; cleared: number };

const initialFlight: Flight = { y: HEIGHT / 2, velocity: 0, gateX: START_X, cleared: 0 };

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
      const dt = last ? Math.min((now - last) / 1000, 0.032) : 0;
      last = now;
      const previous = flight.current;
      const velocity = Math.min(previous.velocity + 310 * dt, 235);
      const y = previous.y + velocity * dt;
      const gateX = previous.gateX - 185 * dt;
      const gapY = GATE_CENTERS[previous.cleared];
      const overlapsGate =
        DOVE_X + DOVE_RADIUS > gateX && DOVE_X - DOVE_RADIUS < gateX + GATE_WIDTH;
      if (
        y < DOVE_RADIUS ||
        y > HEIGHT - DOVE_RADIUS ||
        (overlapsGate && Math.abs(y - gapY) > GAP / 2 - DOVE_RADIUS)
      ) {
        setPhase("over");
        return;
      }

      const passed = gateX + GATE_WIDTH < DOVE_X - DOVE_RADIUS;
      const cleared = previous.cleared + Number(passed);
      const next = { y, velocity, gateX: passed ? START_X : gateX, cleared };
      flight.current = next;
      setFrame(next);
      if (cleared === COURSE_LENGTH) {
        setPhase("found");
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
    if (phase === "playing" || phase === "paused") {
      flight.current = { ...flight.current, velocity: -125 };
    } else {
      flight.current = initialFlight;
      setFrame(initialFlight);
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
  const gateCenter = GATE_CENTERS[Math.min(frame.cleared, COURSE_LENGTH - 1)];
  const gapTop = gateCenter - GAP / 2;
  const gapBottom = gateCenter + GAP / 2;

  return (
    <section className={styles.game} aria-label="Dove Flight game">
      <div className={styles.gameHeader}>
        <h2>Dove Flight</h2>
        <span className={styles.score}>
          Gates{" "}
          <strong>
            {frame.cleared}/{COURSE_LENGTH}
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
        <svg className={styles.scene} viewBox="0 0 640 270" aria-hidden="true">
          <rect className={styles.sky} width="640" height="270" />
          <circle className={styles.sun} cx="504" cy="75" r="43" />
          <path
            className={styles.cloud}
            d="M27 81h118c0-13-16-21-29-17-4-16-36-17-44 0-19-8-38 2-45 17Zm247-35h100c-3-14-16-20-31-16-5-15-31-16-39 1-11-3-23 5-30 15Z"
          />
          <path className={styles.hill} d="M0 206Q89 144 194 197T391 181T640 183V270H0Z" />
          <path className={styles.field} d="M0 239Q95 213 178 234T367 226T640 222V270H0Z" />
          <path className={styles.trail} d="M0 251Q108 227 184 249T385 239T640 236" />
          <g className={styles.gate} transform={`translate(${frame.gateX} 0)`}>
            <path d={`M0 0H${GATE_WIDTH}V${gapTop - 15}L24 ${gapTop}L0 ${gapTop - 15}Z`} />
            <path
              d={`M0 ${HEIGHT}H${GATE_WIDTH}V${gapBottom + 15}L24 ${gapBottom}L0 ${gapBottom + 15}Z`}
            />
            <path
              className={styles.windows}
              d={`M12 ${gapTop - 38}h7v12h-7zm17 0h7v12h-7zM12 ${gapBottom + 23}h7v12h-7zm17 0h7v12h-7z`}
            />
          </g>
          {frame.cleared === COURSE_LENGTH - 1 && <Sheep x={frame.gateX + 88} y={gateCenter} />}
          {phase === "found" && <Sheep x={282} y={210} />}
          <g className={styles.dove} transform={`translate(${DOVE_X} ${frame.y})`}>
            <path d="M-15 2-38-13l8 15-9 10 28-3C4 20 29 10 27-4l11-1-11-6C18-23 4-13-2-9-14-26-27-21-20-10Z" />
            <path className={styles.wing} d="M12 2C3 9-9 5-16-3" />
            <circle cx="21" cy="-8" r="1.6" fill="currentColor" />
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
        Tap Flap or use Space or ↑ when the game button is focused.
      </p>
    </section>
  );
}
