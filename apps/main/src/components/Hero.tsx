/** Homepage hero: two rows of media cards drifting right (swiperjs.com style); each row's centre card is in colour. */
"use client";

import Image from "@/components/SiteImage";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { HeroHeadline } from "./HeroHeadline";
import "./hero-slider.css";

type HeroSlide = {
  type: "video" | "image";
  src: string;
  /** Required for videos (shown only until the clip starts playing). */
  poster?: string;
  alt?: string;
};

/**
 * Add, remove or reorder hero media here.
 * Videos live in /public/videos, photos in /public/images/hero.
 * Videos always go on the top row. Photos alternate top, bottom, top… in list order,
 * so each photo appears on one row only.
 */
const HERO_SLIDES: HeroSlide[] = [
  {
    type: "video",
    src: "/videos/hero-a.mp4?v=2",
    poster: "https://images.kharis.org/site-images/main/59beb230d62d3613/hero-a-poster.jpg",
  },
  {
    type: "image",
    src: "https://images.kharis.org/site-images/main/e9df39abff1c7e6d/hero/sunday-service-stage.jpg",
    alt: "Pastor raising his Bible on stage at Kharis Sunday Service",
  },
  {
    type: "image",
    src: "https://images.kharis.org/site-images/main/1cd1968f552f6970/hero/worship-altar.jpg",
    alt: "The congregation worshipping at the altar during a Kharis service",
  },
  {
    type: "image",
    src: "https://images.kharis.org/site-images/main/00a8e9b517ac4517/hero/easter-bibles-raised.jpg",
    alt: "The congregation raising their Bibles at the Easter service",
  },
  {
    type: "image",
    src: "https://images.kharis.org/site-images/main/b8180db67daeb332/hero/preaching-open-bible.jpg",
    alt: "Preaching with arms outstretched and an open Bible in hand",
  },
  {
    type: "video",
    src: "/videos/hero-b.mp4?v=2",
    poster: "https://images.kharis.org/site-images/main/81043753566f149e/hero-b-poster.jpg",
  },
  {
    type: "image",
    src: "https://images.kharis.org/site-images/main/4ac6c245a7e4d9c2/hero/impartation-celebration.jpg",
    alt: "Pastor David celebrating with the congregation at the Impartation Service",
  },
  {
    type: "image",
    src: "https://images.kharis.org/site-images/main/5bbfb2fff5c0fc8c/hero/outreach-street.jpg",
    alt: "Kharis outreach team sharing the gospel on the street",
  },
  {
    type: "image",
    src: "https://images.kharis.org/site-images/main/aee6ab0aae266c72/hero/easter-pastor-david.jpg",
    alt: "Pastor David preaching at the Easter Saturday service",
  },
  {
    type: "image",
    src: "https://images.kharis.org/site-images/main/0698b74918b21fe0/hero/sunday-bible-raised.jpg",
    alt: "A worshipper raising her Bible at a Sunday service",
  },
  {
    type: "image",
    src: "https://images.kharis.org/site-images/main/ca959585decb8ff4/hero/outreach-community.jpg",
    alt: "Kharis community outreach day in a local playground",
  },
];

/** Seconds for one card to drift past the centre, per row (lower = faster). */
const ROW_SECONDS_PER_CARD = [6, 7.5] as const;
const FALLBACK_REVEAL_MS = 700;

/** Videos only run on the top row; the lower row is photos only so a clip never shows as a still. */
const TOP_ROW: HeroSlide[] = [];
const LOWER_ROW: HeroSlide[] = [];
let photoCount = 0;
HERO_SLIDES.forEach((slide) => {
  const lower = slide.type === "image" && photoCount++ % 2 === 1;
  (lower ? LOWER_ROW : TOP_ROW).push(slide);
});
const ROWS = [TOP_ROW, LOWER_ROW];
const TOP_TRACK = TOP_ROW.concat(TOP_ROW);

const mod = (n: number, m: number) => ((n % m) + m) % m;
function prepVideo(el: HTMLVideoElement) {
  el.muted = true;
  el.defaultMuted = true;
  el.setAttribute("muted", "");
  el.playsInline = true;
  el.setAttribute("playsinline", "");
  el.setAttribute("webkit-playsinline", "");
}

/** Plays every video card that is on screen; off-screen clips pause. */
function syncVideos(track: HTMLElement, visible: Set<number>, allowPlay: boolean) {
  Array.from(track.children).forEach((card, i) => {
    const video = card.querySelector("video");
    if (!video) return;
    if (allowPlay && visible.has(i)) {
      prepVideo(video);
      void video.play().catch(() => {});
    } else if (!video.paused) {
      video.pause();
    }
  });
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);
  const revealed = useRef(false);
  const [spots, setSpots] = useState<[number, number]>([0, 0]);

  const revealSite = useCallback(() => {
    if (revealed.current) return;
    revealed.current = true;
    document.documentElement.classList.add("hero-ready");
  }, []);

  useEffect(() => {
    const fallback = window.setTimeout(revealSite, FALLBACK_REVEAL_MS);
    return () => {
      window.clearTimeout(fallback);
      document.documentElement.classList.remove("hero-ready");
    };
  }, [revealSite]);

  useEffect(() => {
    const wall = wallRef.current;
    const section = sectionRef.current;
    // Keep a snapshot because React clears the refs before the animation effect stops.
    const tracks = [...trackRefs.current];
    if (!wall || !section || tracks.length < ROWS.length || tracks.some((t) => !t)) return;

    const rows = ROWS.map(() => ({
      init: 0,
      auto: 0,
      setWidth: 1,
      step: 1,
      lefts: [] as number[],
      widths: [] as number[],
      t: 0,
      spot: -1,
    }));
    let shared = 0;
    let drag: { startX: number; base: number; id: number } | null = null;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = motionQuery.matches;
    let inView = true;
    let raf = 0;
    let last = 0;
    let visibleKey = "";
    let visibleVideos = new Set<number>();

    const measure = () => {
      const prevStep = rows[0]!.step;
      rows.forEach((row, r) => {
        const cards = Array.from(tracks[r]!.children) as HTMLElement[];
        const half = cards.length / 2;
        row.setWidth = Math.max(1, cards[half]!.offsetLeft - cards[0]!.offsetLeft);
        row.step = Math.max(1, cards[1]!.offsetLeft - cards[0]!.offsetLeft);
        row.lefts = cards.map((c) => c.offsetLeft);
        row.widths = cards.map((c) => c.offsetWidth);
      });
      const vc = wall.clientWidth / 2;
      const top = rows[0]!;
      top.init = vc - (top.lefts[0]! + top.widths[0]! / 2) + top.setWidth;
      rows[1]!.init = top.init + top.step / 2;
      if (prevStep > 1) {
        const ratio = top.step / prevStep;
        shared *= ratio;
        rows.forEach((row) => (row.auto *= ratio));
      }
    };

    const playVideos = () => syncVideos(tracks[0]!, visibleVideos, inView && !reduced);

    const apply = () => {
      const width = wall.clientWidth;
      const vc = width / 2;
      let spotsChanged = false;

      rows.forEach((row, r) => {
        row.t = mod(row.init + row.auto + shared, row.setWidth) - row.setWidth;
        tracks[r]!.style.transform = `translate3d(${row.t.toFixed(2)}px,0,0)`;
        let best = 0;
        let bestDist = Infinity;
        row.lefts.forEach((left, i) => {
          const d = Math.abs(left + row.widths[i]! / 2 + row.t - vc);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
        if (best !== row.spot) {
          row.spot = best;
          spotsChanged = true;
        }
      });
      if (spotsChanged) setSpots([rows[0]!.spot, rows[1]!.spot]);

      const top = rows[0]!;
      const visible: number[] = [];
      TOP_TRACK.forEach((slide, i) => {
        if (slide.type !== "video") return;
        const left = top.lefts[i]! + top.t;
        if (left < width && left + top.widths[i]! > 0) visible.push(i);
      });
      const key = visible.join(",");
      if (key !== visibleKey) {
        visibleKey = key;
        visibleVideos = new Set(visible);
        playVideos();
      }
    };

    const needsFrames = () => inView && (!reduced || drag !== null);

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!reduced && !drag) {
        rows.forEach((row, r) => {
          row.auto += (row.step / ROW_SECONDS_PER_CARD[r]!) * dt;
        });
      }
      apply();
      raf = needsFrames() ? requestAnimationFrame(frame) : 0;
    };

    const ensureRunning = () => {
      if (raf || !needsFrames()) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      drag = { startX: e.clientX, base: shared, id: e.pointerId };
      wall.setPointerCapture(e.pointerId);
      wall.classList.add("is-dragging");
      ensureRunning();
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      shared = drag.base + (e.clientX - drag.startX);
    };
    const onPointerUp = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      drag = null;
      wall.classList.remove("is-dragging");
      if (wall.hasPointerCapture(e.pointerId)) wall.releasePointerCapture(e.pointerId);
    };

    wall.addEventListener("pointerdown", onPointerDown);
    wall.addEventListener("pointermove", onPointerMove);
    wall.addEventListener("pointerup", onPointerUp);
    wall.addEventListener("pointercancel", onPointerUp);

    const resizeObserver = new ResizeObserver(() => {
      measure();
      apply();
    });
    resizeObserver.observe(wall);

    const onMotion = () => {
      reduced = motionQuery.matches;
      playVideos();
      ensureRunning();
    };
    motionQuery.addEventListener("change", onMotion);

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = Boolean(entry?.isIntersecting);
        playVideos();
        ensureRunning();
      },
      { threshold: 0.1 },
    );
    io.observe(section);

    measure();
    apply();
    revealSite();
    ensureRunning();

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      io.disconnect();
      motionQuery.removeEventListener("change", onMotion);
      wall.removeEventListener("pointerdown", onPointerDown);
      wall.removeEventListener("pointermove", onPointerMove);
      wall.removeEventListener("pointerup", onPointerUp);
      wall.removeEventListener("pointercancel", onPointerUp);
    };
  }, [revealSite]);

  return (
    <section id="top" ref={sectionRef} className="hero-shell">
      <div ref={wallRef} className="hero-wall">
        {ROWS.map((row, r) => (
          <div key={r} className="hero-wall__row">
            <div
              ref={(el) => {
                trackRefs.current[r] = el;
              }}
              className="hero-wall__track"
            >
              {row.concat(row).map((slide, i) => {
                const duplicate = i >= row.length;
                const isSpot = i === spots[r];
                return (
                  <div
                    key={`${r}-${i}`}
                    className={`hero-wall__card${isSpot ? " is-spot" : ""}`}
                    aria-hidden={duplicate || undefined}
                  >
                    {slide.type === "video" ? (
                      <video
                        ref={(el) => {
                          if (el) prepVideo(el);
                        }}
                        src={slide.src}
                        poster={slide.poster}
                        muted
                        loop
                        playsInline
                        preload="none"
                        controls={false}
                        disablePictureInPicture
                        tabIndex={-1}
                        aria-hidden
                      />
                    ) : (
                      <Image
                        src={slide.src}
                        alt={duplicate ? "" : (slide.alt ?? "")}
                        fill
                        sizes="(max-width: 640px) 80vw, 46vw"
                        quality={95}
                        loading="eager"
                        draggable={false}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="hero-wall__shade" aria-hidden />

      <div
        className="hero-copy"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "4.5rem 1.25rem 2rem",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <p className="hero-copy__eyebrow">Kharis Church</p>
        <h1 className="sr-only">Welcome to Kharis</h1>
        <HeroHeadline />
        <p className="hero-copy__tagline">Changing the world with a touch of His grace.</p>
        <div
          className="hero-copy__ctas"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0.75rem",
            marginTop: "1.75rem",
            pointerEvents: "auto",
          }}
        >
          <Link href="/locations" className="btn-primary">
            Find a Branch
          </Link>
          <a href="#messages" className="btn-ghost">
            Watch Messages
          </a>
        </div>
      </div>
    </section>
  );
}
