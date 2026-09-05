"use client";

import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type TouchEvent,
} from "react";

type Offset = { x: number; y: number };

export function NotFoundExperience() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const target = useRef<Offset>({ x: 0, y: 0 });
  const current = useRef<Offset>({ x: 0, y: 0 });
  const hovering = useRef(false);
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });
  const reduce = useReducedMotion();

  const onMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (reduce) return;
      const el = sceneRef.current;
      if (!el) return;
      hovering.current = true;
      const rect = el.getBoundingClientRect();
      const clientX =
        "touches" in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
      const clientY =
        "touches" in e ? e.touches[0]?.clientY ?? 0 : e.clientY;
      target.current = {
        x: ((clientX - rect.left) / rect.width - 0.5) * 2,
        y: ((clientY - rect.top) / rect.height - 0.5) * 2,
      };
    },
    [reduce],
  );

  const onLeave = useCallback(() => {
    hovering.current = false;
    target.current = { x: 0, y: 0 };
  }, []);

  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    let t = 0;
    const tick = () => {
      t += 0.016;
      const idleX = hovering.current ? 0 : Math.sin(t * 0.55) * 0.35;
      const idleY = hovering.current ? 0 : Math.cos(t * 0.4) * 0.25;
      const goalX = target.current.x + idleX;
      const goalY = target.current.y + idleY;
      current.current = {
        x: current.current.x + (goalX - current.current.x) * 0.08,
        y: current.current.y + (goalY - current.current.y) * 0.08,
      };
      setOffset({ ...current.current });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  const parallaxVars = {
    ["--nx" as string]: offset.x,
    ["--ny" as string]: offset.y,
  } as CSSProperties;

  return (
    <section className="not-found" aria-labelledby="not-found-title">
      <div
        ref={sceneRef}
        className="not-found__scene"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onTouchMove={onMove}
        onTouchEnd={onLeave}
        aria-hidden
        style={parallaxVars}
      >
        <div
          className="not-found__glow"
          style={{ ["--nd" as string]: 8 } as CSSProperties}
        />
        <div
          className="not-found__orb not-found__orb--a"
          style={{ ["--nd" as string]: 18 } as CSSProperties}
        />
        <div
          className="not-found__orb not-found__orb--b"
          style={{ ["--nd" as string]: -14 } as CSSProperties}
        />
        <div
          className="not-found__orb not-found__orb--c"
          style={{ ["--nd" as string]: 22 } as CSSProperties}
        />

        <svg
          className="not-found__art"
          viewBox="0 0 640 360"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g className="not-found__layer" style={{ ["--nd" as string]: 6 }}>
            <path
              d="M0 260 C80 210 140 230 220 200 C300 170 360 230 440 195 C520 160 580 210 640 190 L640 360 L0 360 Z"
              fill="url(#nfHillFar)"
              opacity="0.55"
            />
          </g>

          <g className="not-found__layer" style={{ ["--nd" as string]: 14 }}>
            <path
              d="M0 290 C120 250 200 300 320 270 C440 240 520 300 640 275 L640 360 L0 360 Z"
              fill="url(#nfHillNear)"
            />
            <ellipse
              cx="320"
              cy="300"
              rx="210"
              ry="28"
              fill="rgba(128,6,84,0.08)"
            />
          </g>

          <g
            className="not-found__layer not-found__twinkle"
            style={{ ["--nd" as string]: 28 }}
          >
            <circle cx="90" cy="70" r="3.5" fill="#d4920a" />
            <circle cx="520" cy="55" r="2.5" fill="#800654" />
            <circle cx="570" cy="120" r="3" fill="#d4920a" opacity="0.7" />
            <circle cx="70" cy="140" r="2" fill="#800654" opacity="0.6" />
            <path
              d="M160 100 l4 10 10 1 -8 7 3 10 -9-6 -9 6 3-10 -8-7 10-1 z"
              fill="#d4920a"
              opacity="0.85"
            />
            <path
              d="M480 150 l3 8 8 1 -6 5 2 8 -7-5 -7 5 2-8 -6-5 8-1 z"
              fill="#800654"
              opacity="0.7"
            />
          </g>

          <g
            className="not-found__layer not-found__sign"
            style={{ ["--nd" as string]: 36 }}
          >
            <rect
              x="198"
              y="88"
              width="244"
              height="132"
              rx="22"
              fill="#fff"
              stroke="rgba(128,6,84,0.14)"
              strokeWidth="3"
            />
            <rect
              x="210"
              y="100"
              width="220"
              height="108"
              rx="16"
              fill="url(#nfCard)"
            />
            <text
              x="320"
              y="178"
              textAnchor="middle"
              fontFamily="var(--font-display), system-ui, sans-serif"
              fontSize="78"
              fontWeight="800"
              fill="#800654"
              letterSpacing="-4"
            >
              404
            </text>
            <rect x="308" y="220" width="24" height="70" rx="6" fill="#650445" />
            <rect
              x="286"
              y="284"
              width="68"
              height="14"
              rx="7"
              fill="#800654"
              opacity="0.35"
            />
          </g>

          <g
            className="not-found__layer not-found__figure"
            style={{ ["--nd" as string]: 44 }}
          >
            <ellipse
              cx="140"
              cy="278"
              rx="28"
              ry="8"
              fill="rgba(18,4,14,0.12)"
            />
            <circle
              cx="140"
              cy="208"
              r="22"
              fill="#f7eef4"
              stroke="#800654"
              strokeWidth="3"
            />
            <path
              d="M140 230 v48"
              stroke="#800654"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M140 250 l-22 18 M140 250 l22 18"
              stroke="#800654"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M140 278 l-14 28 M140 278 l14 28"
              stroke="#800654"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <circle cx="178" cy="178" r="18" fill="#d4920a" />
            <text
              x="178"
              y="185"
              textAnchor="middle"
              fontSize="20"
              fontWeight="800"
              fill="#1c1c1f"
            >
              ?
            </text>
          </g>

          <g
            className="not-found__layer not-found__map"
            style={{ ["--nd" as string]: 50 }}
          >
            <rect
              x="470"
              y="210"
              width="86"
              height="64"
              rx="10"
              fill="#fff8ee"
              stroke="#d4920a"
              strokeWidth="2.5"
              transform="rotate(-12 513 242)"
            />
            <path
              d="M488 236 h40 M508 220 v40"
              stroke="#800654"
              strokeWidth="2"
              strokeLinecap="round"
              transform="rotate(-12 508 240)"
              opacity="0.55"
            />
            <circle
              cx="508"
              cy="240"
              r="8"
              fill="none"
              stroke="#800654"
              strokeWidth="2"
              transform="rotate(-12 508 240)"
            />
          </g>

          <defs>
            <linearGradient id="nfHillFar" x1="0" y1="180" x2="0" y2="360">
              <stop stopColor="#f7eef4" />
              <stop offset="1" stopColor="#e8d5e4" />
            </linearGradient>
            <linearGradient id="nfHillNear" x1="0" y1="250" x2="0" y2="360">
              <stop stopColor="#800654" stopOpacity="0.18" />
              <stop offset="1" stopColor="#800654" stopOpacity="0.06" />
            </linearGradient>
            <linearGradient id="nfCard" x1="210" y1="100" x2="430" y2="208">
              <stop stopColor="#fff" />
              <stop offset="1" stopColor="#faf6f9" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="not-found__copy">
        <p className="not-found__eyebrow">Lost the path</p>
        <h1 id="not-found-title">This page wandered off</h1>
        <p className="not-found__lede">
          The link you followed does not exist here. Let&apos;s get you back to
          church.
        </p>
        <Link href="/" className="not-found__cta">
          Take me home
        </Link>
      </div>
    </section>
  );
}
