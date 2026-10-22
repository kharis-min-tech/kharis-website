"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

const strokes = [
  "M17 13 Q30 2 52 14 C83 27 117 28 148 36 Q166 40 172 62 Q181 86 191 76 L205 60 Q214 58 220 45 Q230 32 261 31 L320 22 Q344 17 334 41",
  "M332 61 Q320 69 316 82 L300 101 M301 115 Q292 118 288 135 Q280 152 262 139 L238 119",
  "M207 66 Q225 72 220 93 L211 115 Q240 132 224 163 L206 191 L202 205 M222 166 Q241 190 272 208 Q296 222 278 235 L269 240",
  "M265 255 Q252 286 240 274 Q241 298 227 302 L211 287 Q198 275 198 258 L202 300 Q207 317 190 313 L155 314 Q150 304 153 278 L154 237 M153 267 Q141 279 137 294 Q132 306 123 295 L114 287 Q105 299 98 283 L97 273",
  "M88 264 Q74 250 68 234 Q60 227 81 214 C109 198 132 194 146 179 Q158 165 144 157 L91 136 Q77 130 73 122 L57 114 Q47 105 54 90 L57 82 L34 78 Q25 77 23 63 L15 50 Q7 40 11 29",
  "M153 145 L180 134 L203 118 L226 103 L254 97 M160 128 L183 128 L173 146 M181 117 L206 116 L200 136 M209 100 L212 120 L229 114",
];

export function KpLoadingMark() {
  const maskId = useId();
  return (
    <div className="kp-loading-mark">
      <div className="kp-loading-stamp">
        <svg viewBox="0 0 350 338" aria-hidden="true" className="kp-loading-dove">
          <defs>
            <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="350" height="338">
              {strokes.map((d, i) => (
                <path
                  key={d}
                  d={d}
                  pathLength="1"
                  className="kp-dove-stroke"
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
              <rect className="kp-dove-complete" width="350" height="338" fill="white" />
            </mask>
          </defs>
          <image
            href="/kp2/assets/kharis-logo.png"
            width="350"
            height="338"
            mask={`url(#${maskId})`}
          />
        </svg>
      </div>
      <p className="kp-loading-wordmark">
        KHARIS <span>PHASE 2.</span>
      </p>
      <p className="kp-loading-caption">Preach Christ Crucified.</p>
    </div>
  );
}

export function KpIntro() {
  const [visible, setVisible] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const finish = useCallback(() => {
    document.documentElement.dataset.kpIntro = "seen";
    const content = document.getElementById("kp-site-content");
    if (content) content.inert = false;
    if (overlayRef.current?.contains(document.activeElement)) {
      const previous = previousFocusRef.current;
      const target =
        previous?.isConnected &&
        previous !== document.body &&
        !overlayRef.current?.contains(previous) &&
        !previous.closest("[inert]")
          ? previous
          : document.querySelector<HTMLAnchorElement>(".kp-header-logo");
      target?.focus({ preventScroll: true });
    }
    setVisible(false);
  }, []);

  useEffect(() => {
    if (!visible) return;
    if (document.documentElement.dataset.kpIntro === "seen") {
      setVisible(false);
      return;
    }
    if (overlayRef.current && getComputedStyle(overlayRef.current).visibility === "hidden") {
      finish();
      return;
    }
    document.documentElement.dataset.kpIntro = "playing";
    const content = document.getElementById("kp-site-content");
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (content) content.inert = true;
    skipRef.current?.focus({ preventScroll: true });
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(finish, reduced ? 200 : 2400);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish();
      if (event.key === "Tab") {
        event.preventDefault();
        skipRef.current?.focus({ preventScroll: true });
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKey);
      if (content) content.inert = false;
    };
  }, [finish, visible]);

  if (!visible) return null;
  return (
    <div
      ref={overlayRef}
      className="kp-intro"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Kharis Phase 2"
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget && event.animationName === "kp-intro-exit")
          finish();
      }}
    >
      <KpLoadingMark />
      <button ref={skipRef} type="button" className="kp-intro-skip" onClick={finish}>
        Skip intro
      </button>
    </div>
  );
}
