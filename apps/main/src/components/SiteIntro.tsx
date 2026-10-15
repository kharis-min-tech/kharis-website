"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import "./site-intro.css";

// These mask strokes follow the existing dove. The original artwork supplies every visible pixel.
const strokes = [
  "M17 13 Q30 2 52 14 C83 27 117 28 148 36 Q166 40 172 62 Q181 86 191 76 L205 60 Q214 58 220 45 Q230 32 261 31 L320 22 Q344 17 334 41",
  "M332 61 Q320 69 316 82 L300 101 M301 115 Q292 118 288 135 Q280 152 262 139 L238 119",
  "M207 66 Q225 72 220 93 L211 115 Q240 132 224 163 L206 191 L202 205 M222 166 Q241 190 272 208 Q296 222 278 235 L269 240",
  "M265 255 Q252 286 240 274 Q241 298 227 302 L211 287 Q198 275 198 258 L202 300 Q207 317 190 313 L155 314 Q150 304 153 278 L154 237 M153 267 Q141 279 137 294 Q132 306 123 295 L114 287 Q105 299 98 283 L97 273",
  "M88 264 Q74 250 68 234 Q60 227 81 214 C109 198 132 194 146 179 Q158 165 144 157 L91 136 Q77 130 73 122 L57 114 Q47 105 54 90 L57 82 L34 78 Q25 77 23 63 L15 50 Q7 40 11 29",
  "M153 145 L180 134 L203 118 L226 103 L254 97 M160 128 L183 128 L173 146 M181 117 L206 116 L200 136 M209 100 L212 120 L229 114",
];

export function SiteIntro() {
  const [visible, setVisible] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);

  const finish = useCallback(() => {
    document.documentElement.dataset.siteIntro = "seen";
    const content = document.getElementById("site-content");
    if (content) content.inert = false;
    setVisible(false);
  }, []);

  useEffect(() => {
    if (document.documentElement.dataset.siteIntro === "seen") {
      setVisible(false);
      return;
    }

    if (overlayRef.current && getComputedStyle(overlayRef.current).visibility === "hidden") {
      finish();
      return;
    }

    document.documentElement.dataset.siteIntro = "playing";
    const content = document.getElementById("site-content");
    if (content) content.inert = true;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // This also releases the page if animation events are interrupted.
    const timeout = window.setTimeout(finish, reducedMotion ? 350 : 2900);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timeout);
      document.removeEventListener("keydown", onKeyDown);
      if (content) content.inert = false;
    };
  }, [finish]);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className="site-intro"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Kharis"
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget && event.animationName === "site-intro-exit") {
          finish();
        }
      }}
    >
      <svg className="site-intro__dove" viewBox="0 0 350 338" aria-hidden="true">
        <defs>
          <mask
            id="site-intro-dove-mask"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="350"
            height="338"
          >
            {strokes.map((d, index) => (
              <path
                key={d}
                d={d}
                pathLength="1"
                className={`site-intro__stroke site-intro__stroke--${index}`}
              />
            ))}
            <circle className="site-intro__eye" cx="198" cy="82" r="9" fill="white" />
            <rect className="site-intro__complete" width="350" height="338" fill="white" />
          </mask>
        </defs>
        <image
          href="/images/kharis-logo.png"
          width="350"
          height="338"
          mask="url(#site-intro-dove-mask)"
        />
      </svg>
      <button className="site-intro__skip" type="button" onClick={finish}>
        Skip intro
      </button>
    </div>
  );
}
