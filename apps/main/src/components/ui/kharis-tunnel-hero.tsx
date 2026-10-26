"use client";

import {
  motion,
  useAnimationFrame,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
  MotionValue,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "@/components/SiteImage";
import { glidePageTo } from "@/lib/page-snap";

/** Kharis photos from images.kharis.org, one per Life theme. */
const KHARIS_ITEMS = [
  {
    src: "https://images.kharis.org/site-images/main/074fce9dca42072a/branch-slide-4.jpg",
    title: "Kharis Family",
    alt: "The Kharis congregation gathered in a full hall during Sunday service",
  },
  {
    src: "https://images.kharis.org/site-images/main/1cd1968f552f6970/hero/worship-altar.jpg",
    title: "Baptism & New Life",
    alt: "The congregation worshipping at the altar during a Kharis service",
  },
  {
    src: "https://images.kharis.org/site-images/main/8440a4a63e4ae020/serve-with-us.jpg",
    title: "Serve in Departments",
    alt: "Kharis teams serving in worship, ushering and on stage",
  },
  {
    src: "https://images.kharis.org/site-images/main/16b531253b8a325e/grace-filled-prayer.jpg",
    title: "Fasting & Prayer",
    alt: "Worshippers praying together with hands raised",
  },
  {
    src: "https://images.kharis.org/site-images/main/ca959585decb8ff4/hero/outreach-community.jpg",
    title: "Children's Ministry",
    alt: "Children and families at a Kharis community outreach day",
  },
  {
    src: "https://images.kharis.org/site-images/main/5bbfb2fff5c0fc8c/hero/outreach-street.jpg",
    title: "Fellowship Life",
    alt: "Kharis outreach team sharing the gospel on the street",
  },
  {
    src: "https://images.kharis.org/site-images/main/b65991e38ead9ab1/biblical-open-bible.jpg",
    title: "Grow in the Word",
    alt: "An open Bible held up during a Kharis service",
  },
  {
    src: "https://images.kharis.org/site-images/main/6cecd6b024bd301a/love-greeting.jpg",
    title: "Find Your People",
    alt: "Two members embracing in greeting at a Kharis service",
  },
  {
    src: "https://images.kharis.org/site-images/main/850b7f32a7f6712c/joyful-worship.jpg",
    title: "Belong Here",
    alt: "A worshipper singing with her hand raised in a full hall",
  },
];

interface TunnelCardData {
  item: { src: string; title: string; alt: string };
  angleCos: number;
  angleSin: number;
  radiusFactorX: number;
  radiusFactorY: number;
  rotationZ: number;
  index: number;
}

const TUNNEL_CARDS: TunnelCardData[] = KHARIS_ITEMS.map((item, i) => {
  const goldenAngle = i * 137.5 * (Math.PI / 180);
  const radiusFactorX = 0.28 + (i % 3) * 0.08;
  const radiusFactorY = 0.26 + (i % 2) * 0.09;

  return {
    item,
    angleCos: Math.cos(goldenAngle),
    angleSin: Math.sin(goldenAngle),
    radiusFactorX,
    radiusFactorY,
    rotationZ: (i % 2 === 0 ? 1 : -1) * (3 + (i % 5) * 2),
    index: i,
  };
});

/** Worship crowd clip (from the KP2 assets), played muted behind the tunnel. */
const BACKGROUND_VIDEO = "/videos/life-crowd.mp4";
const BACKGROUND_POSTER = "/videos/life-crowd-poster.jpg";

/**
 * Tunnel-vision layers. Blur strength stays fixed (animating backdrop-filter is costly);
 * scroll only fades each layer's opacity. Masks keep the centre sharp and blur the rim.
 */
const SOFT_BLUR_MASK =
  "radial-gradient(ellipse 72% 68% at var(--tunnel-x) 50%, transparent 48%, #000 100%)";
const TIGHT_BLUR_MASK =
  "radial-gradient(ellipse 58% 54% at var(--tunnel-x) 50%, transparent 32%, #000 88%)";
const SOFT_BLUR_STYLE = {
  backdropFilter: "blur(3px)",
  WebkitBackdropFilter: "blur(3px)",
  maskImage: SOFT_BLUR_MASK,
  WebkitMaskImage: SOFT_BLUR_MASK,
};
const TIGHT_BLUR_STYLE = {
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  maskImage: TIGHT_BLUR_MASK,
  WebkitMaskImage: TIGHT_BLUR_MASK,
};
/**
 * Layer opacities at the end of the tunnel. Capped so the climax stays gentle:
 * ~8px total rim blur (56% of the 15px max), strong layer 49%, darkening 43%.
 */
const TUNNEL_PEAK = { soft: 0.85, tight: 0.49, darken: 0.43 };
const TUNNEL_DARKEN =
  "radial-gradient(ellipse 60% 56% at var(--tunnel-x) 50%, rgba(6,3,10,0.12) 0%, rgba(6,3,10,0.12) 30%, rgba(6,3,10,0.78) 100%)";

/** Pointer parallax: critically damped so the camera drifts without wobble. */
const PARALLAX_SPRING = { stiffness: 90, damping: 19, mass: 1 };
/**
 * Scroll progress springs, both critically damped (damping = 2 * sqrt(stiffness * mass)) so
 * nothing overshoots. Forward keeps some weight (~0.4s settle); rewinding is stiffer (~0.25s) so
 * the cards have folded back to the opening state by the time the page reaches the top.
 */
const FORWARD_SPRING = { stiffness: 160, damping: 28, mass: 1.2 };
const REWIND_SPRING = { stiffness: 480, damping: 48, mass: 1.2 };
/**
 * Progress per pixel of wheel delta / finger travel. Forward is slower (~16 mouse-wheel notches end
 * to end) so the cards have time to open up; going back stays quicker so rewinding feels light.
 */
const WHEEL_SPEED_FORWARD = 0.0008;
const WHEEL_SPEED_BACK = 0.00125;
/** Firefox and some mice report lines or pages instead of pixels. */
const WHEEL_LINE_PX = 16;
/**
 * Trackpads send many small deltas; mouse wheels send ~100px notches and flung trackpads spike.
 * Deltas above the knee are compressed and capped so every device glides instead of jumping.
 */
const WHEEL_KNEE_PX = 60;
const WHEEL_MAX_PX = 140;
const WHEEL_COMPRESSION = 0.4;
const TOUCH_SPEED_FORWARD = 0.0017;
const TOUCH_SPEED_BACK = 0.0026;
/** Start partway in so the first cards are already in flight and the title is fully visible. */
const INITIAL_PROGRESS = 0.12;
/**
 * The tunnel captures the wheel only on a visitor's first pass. Once they have scrolled past the
 * hero (by any means) this session, later passes scroll natively and the cards simply follow the
 * page: replaying a scroll-jacked intro on every return was friction, not delight.
 */
const SEEN_KEY = "kharis:life-tunnel-seen";
/** Ignore wheel input this long after the page lands at the top, so trackpad momentum ends cleanly. */
const MOMENTUM_GUARD_MS = 300;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

function normalizeWheelDelta(e: WheelEvent) {
  let px = e.deltaY;
  if (e.deltaMode === WheelEvent.DOM_DELTA_LINE) px *= WHEEL_LINE_PX;
  else if (e.deltaMode === WheelEvent.DOM_DELTA_PAGE) px *= window.innerHeight;
  const size = Math.abs(px);
  const eased =
    size <= WHEEL_KNEE_PX ? size : WHEEL_KNEE_PX + (size - WHEEL_KNEE_PX) * WHEEL_COMPRESSION;
  return Math.sign(px) * Math.min(eased, WHEEL_MAX_PX);
}

/** Depth easing: cards drift in the distance and accelerate as they rush past the camera. */
const DEPTH_EASE = 1.35;

/**
 * From Tailwind's lg breakpoint the tunnel sits on the right: its stage spans the right
 * 60% of the hero (centre at 70%). Keep in sync with the lg: classes below.
 */
const WIDE_MIN_WIDTH = 1024;
const WIDE_STAGE_FRACTION = 0.6;

interface StageDimensions {
  width: number;
  height: number;
  isMobile: boolean;
  /** Horizontal room the cards spread across: the full width, or the right-hand stage on wide screens. */
  spreadWidth: number;
}

function useCameraParallax(enabled: boolean) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, PARALLAX_SPRING);
  const y = useSpring(rawY, PARALLAX_SPRING);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientX / window.innerWidth - 0.5) * 2);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled, rawX, rawY]);

  return { x, y };
}

type SpringParams = { stiffness: number; damping: number; mass: number };

/**
 * Follows `source` with a spring whose settings depend on direction: `rewind` while moving back
 * (target below the current value), `forward` otherwise. Position and velocity carry over when the
 * direction flips, so switching springs never snaps.
 */
function useDirectionalSpring(
  source: MotionValue<number>,
  forward: SpringParams,
  rewind: SpringParams,
) {
  const value = useMotionValue(source.get());
  const velocity = useRef(0);

  useAnimationFrame((_, deltaMs) => {
    const target = source.get();
    let x = value.get();
    let v = velocity.current;
    if (Math.abs(target - x) < 0.0001 && Math.abs(v) < 0.0001) {
      if (x !== target) value.set(target);
      velocity.current = 0;
      return;
    }
    const { stiffness, damping, mass } = target < x ? rewind : forward;
    /* Small fixed sub-steps keep the stiff rewind spring stable on slow frames. */
    const dt = Math.min(deltaMs, 64) / 1000;
    const steps = Math.max(1, Math.ceil(dt / 0.004));
    const h = dt / steps;
    for (let i = 0; i < steps; i++) {
      v += ((stiffness * (target - x) - damping * v) / mass) * h;
      x += v * h;
    }
    velocity.current = v;
    value.set(x);
  });

  return value;
}

interface TunnelCardProps {
  card: TunnelCardData;
  progress: MotionValue<number>;
  pointer: { x: MotionValue<number>; y: MotionValue<number> };
  total: number;
  stage: StageDimensions;
}

function TunnelCard({ card, progress, pointer, total, stage }: TunnelCardProps) {
  const staggerSpan = 0.55;
  const start = (card.index / Math.max(1, total - 1)) * (1 - staggerSpan);
  const end = start + staggerSpan;

  const localProgress = useTransform(progress, [start, end], [0, 1]);

  const farZ = stage.isMobile ? -1200 : -1700;
  const nearZ = stage.isMobile ? 350 : 500;
  const z = useTransform(localProgress, (t) => farZ + (nearZ - farZ) * t ** DEPTH_EASE);

  const opacity = useTransform(localProgress, [0, 0.16, 0.8, 1], [0, 1, 1, 0]);

  const cardWidth = stage.isMobile
    ? Math.max(130, Math.min(180, stage.width * 0.38))
    : Math.max(180, Math.min(270, stage.width * 0.18));

  const baseX = card.angleCos * (stage.spreadWidth * card.radiusFactorX);
  const baseY = card.angleSin * (stage.height * card.radiusFactorY);
  const panStrength = stage.isMobile ? 20 : 45;

  const transform = useTransform([z, pointer.x, pointer.y], ([currZ, px, py]: number[]) => {
    const offsetX = baseX - px * panStrength;
    const offsetY = baseY - py * panStrength;
    return `translate3d(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px), ${currZ}px) rotateZ(${card.rotationZ}deg)`;
  });

  return (
    <motion.div
      style={{
        width: cardWidth,
        transform,
        opacity,
        zIndex: card.index + 1,
      }}
      className="pointer-events-auto absolute left-1/2 top-1/2 aspect-[4/5] will-change-transform [backface-visibility:hidden] select-none cursor-pointer"
    >
      <div className="group relative h-full w-full overflow-hidden rounded-2xl bg-neutral-200 [html[data-theme=dark]_&]:bg-neutral-900 shadow-2xl shadow-neutral-950/20 [html[data-theme=dark]_&]:shadow-black/90 ring-1 ring-black/10 [html[data-theme=dark]_&]:ring-white/15 transition-all duration-500 hover:ring-purple/70 hover:shadow-purple/25">
        {/* Resized via next/image: cards peak at ~460px wide near the camera, so full photos only cost decode time. */}
        <Image
          src={card.item.src}
          alt={card.item.alt}
          fill
          sizes="(max-width: 767px) 50vw, 32vw"
          quality={90}
          loading="eager"
          draggable={false}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex items-end p-4 sm:p-5">
          <span className="text-xs sm:text-sm font-mono tracking-widest uppercase text-white/95 drop-shadow-md">
            {card.item.title}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function KharisTunnelHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();

  const [stage, setStage] = useState<StageDimensions>({
    width: 1440,
    height: 900,
    isMobile: false,
    spreadWidth: 1440 * WIDE_STAGE_FRACTION,
  });

  useEffect(() => {
    const updateDimensions = () => {
      setStage({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth < 768,
        spreadWidth:
          window.innerWidth >= WIDE_MIN_WIDTH
            ? window.innerWidth * WIDE_STAGE_FRACTION
            : window.innerWidth,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const rawProgress = useMotionValue(INITIAL_PROGRESS);
  const springProgress = useDirectionalSpring(rawProgress, FORWARD_SPRING, REWIND_SPRING);
  const smoothProgress = reduce ? rawProgress : springProgress;

  /* "Settled": the intro has been seen (or motion is reduced), so the wheel is never captured. */
  const [settled, setSettled] = useState(false);
  const settledRef = useRef(false);
  const markSeen = useCallback(() => {
    if (settledRef.current) return;
    settledRef.current = true;
    setSettled(true);
    try {
      window.sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* Private mode or blocked storage: settles for this page view only. */
    }
  }, []);

  useEffect(() => {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      /* Storage unavailable: treat as a first visit. */
    }
    if (seen || reduce) {
      settledRef.current = true;
      setSettled(true);
    }
  }, [reduce]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let arrivedAt = 0;

    /**
     * First visit only: moves the tunnel and returns true, or returns false so the page scrolls
     * instead (tunnel finished, page already scrolled, momentum still arriving at the top, or the
     * intro already seen). Never rewinds below the opening composition.
     */
    const advance = (delta: number) => {
      if (settledRef.current || window.scrollY > 1) return false;
      if (performance.now() - arrivedAt < MOMENTUM_GUARD_MS) return false;
      const current = rawProgress.get();
      const next = Math.min(1, Math.max(INITIAL_PROGRESS, current + delta));
      if (next === current) return false;
      rawProgress.set(next);
      return true;
    };

    const handleWheel = (e: WheelEvent) => {
      const delta = normalizeWheelDelta(e);
      const speed = delta > 0 ? WHEEL_SPEED_FORWARD : WHEEL_SPEED_BACK;
      if (advance(delta * speed)) e.preventDefault();
    };

    let lastTouchY: number | null = null;
    const handleTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0]?.clientY ?? null;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY;
      if (lastTouchY === null || y === undefined) return;
      const travel = lastTouchY - y;
      const delta = travel * (travel > 0 ? TOUCH_SPEED_FORWARD : TOUCH_SPEED_BACK);
      lastTouchY = y;
      if (advance(delta)) e.preventDefault();
    };
    const handleTouchEnd = () => {
      lastTouchY = null;
    };

    /*
     * The cards follow page scroll through the hero: fully escaped when it is off screen, back at
     * the opening state when the page is at the top. Going up only ever folds cards back; going
     * down only ever pushes them on (and only once the intro has been seen), so neither direction
     * undoes the other.
     */
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const goingUp = scrollY < lastScrollY;
      if (lastScrollY > 1 && scrollY <= 1) arrivedAt = performance.now();
      lastScrollY = scrollY;
      const { top, height } = el.getBoundingClientRect();
      if (-top > height * 0.5) markSeen();
      /* No early exit when the hero is fully off screen: a jump (scrollbar, End key, anchor) must
         still leave the cards escaped. */
      const target = INITIAL_PROGRESS + (1 - INITIAL_PROGRESS) * clamp01(-top / height);
      const current = rawProgress.get();
      if (goingUp ? target < current : settledRef.current && target > current) {
        rawProgress.set(target);
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("scroll", handleScroll, { passive: true });
    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    el.addEventListener("touchend", handleTouchEnd);
    el.addEventListener("touchcancel", handleTouchEnd);
    return () => {
      el.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
      el.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [markSeen, rawProgress]);

  const pointer = useCameraParallax(!reduce);

  /* Escape hatch: glide straight to the next section; the cards fly on as the hero scrolls away. */
  const skipIntro = () => {
    const el = containerRef.current;
    if (!el) return;
    markSeen();
    const target = el.getBoundingClientRect().bottom + window.scrollY;
    if (reduce) window.scrollTo({ top: target, behavior: "instant" });
    else glidePageTo(target);
  };

  /* React does not reliably set the muted attribute, which iOS requires for autoplay. */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");
    if (reduce) {
      video.pause();
    } else {
      void video.play().catch(() => {});
    }
  }, [reduce]);

  const titleScale = useTransform(smoothProgress, [0, 0.5, 1], [0.7, 1, 1.35]);
  const titleOpacity = useTransform(smoothProgress, [0, 0.12, 0.85, 1], [0.25, 1, 1, 0]);
  const promptOpacity = useTransform(
    smoothProgress,
    [INITIAL_PROGRESS, INITIAL_PROGRESS + 0.1],
    [1, 0],
  );
  /* Hidden (not just transparent) once faded, so the skip button can't be clicked or tabbed to. */
  const promptVisibility = useTransform(promptOpacity, (value) =>
    value < 0.02 ? "hidden" : "visible",
  );
  /* Tunnel vision deepens with scroll: blur creeps inward and the edges darken. */
  const softBlurOpacity = useTransform(smoothProgress, [0, 1], [0.7, TUNNEL_PEAK.soft]);
  const tightBlurOpacity = useTransform(
    smoothProgress,
    [INITIAL_PROGRESS, 1],
    [0, TUNNEL_PEAK.tight],
  );
  const darkenOpacity = useTransform(
    smoothProgress,
    [INITIAL_PROGRESS, 1],
    [0, TUNNEL_PEAK.darken],
  );

  return (
    <div
      ref={containerRef}
      className="relative h-[100svh] w-full overflow-hidden bg-[#120a1c] text-white select-none [--tunnel-x:50%] lg:[--tunnel-x:70%]"
    >
      {/* Background video sits on its own flat layer so it never occludes cards deep in the 3D scene. */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <video
          ref={videoRef}
          src={BACKGROUND_VIDEO}
          poster={BACKGROUND_POSTER}
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          tabIndex={-1}
          className="h-full w-full object-cover"
        />
        {/* Overlay: purple-tinted darkening plus a vignette so cards and copy stay legible. */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(28,10,48,0.62)_0%,rgba(18,10,28,0.5)_45%,rgba(12,6,20,0.82)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_70%_at_var(--tunnel-x)_50%,transparent_35%,rgba(8,4,14,0.7)_100%)]" />
      </div>

      <div
        className="absolute inset-0 flex items-center justify-center lg:left-[40%]"
        style={{
          perspective: stage.isMobile ? "900px" : "1200px",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Depth Rings */}
        <div className="pointer-events-none absolute h-[48vmin] w-[48vmin] rounded-full border border-white/15" />
        <div className="pointer-events-none absolute h-[76vmin] w-[76vmin] rounded-full border border-dashed border-white/10" />

        {/* Central Typography tailored for Kharis Life */}
        <motion.div
          style={{ scale: titleScale, opacity: titleOpacity }}
          className="pointer-events-none z-0 flex w-full max-w-2xl flex-col items-center px-6 text-center"
        >
          <p className="text-xs font-mono uppercase tracking-[0.4em] text-[#d6c4ff] mb-4 font-semibold">
            Fellowship Life
          </p>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter! leading-[0.95] text-white! drop-shadow-[0_2px_18px_rgba(0,0,0,0.45)]">
            A ONE-ANOTHER
            <br />
            LIFE.
          </h2>
          <p className="mt-4 max-w-[40ch] text-sm sm:text-base font-light text-white/80">
            A family shaped by grace. Scroll to journey through your Kharis experience.
          </p>
        </motion.div>

        {/* 3D Z-Space Carousel */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ transformStyle: "preserve-3d" }}
        >
          {TUNNEL_CARDS.map((card, i) => (
            <TunnelCard
              key={i}
              card={card}
              progress={smoothProgress}
              pointer={pointer}
              total={TUNNEL_CARDS.length}
              stage={stage}
            />
          ))}
        </div>
      </div>

      {/* Tunnel vision: sits above the 3D scene so cards drifting to the edges blur and darken too. */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <motion.div
          className="absolute inset-0"
          style={{ ...SOFT_BLUR_STYLE, opacity: softBlurOpacity }}
        />
        <motion.div
          className="absolute inset-0"
          style={{ ...TIGHT_BLUR_STYLE, opacity: tightBlurOpacity }}
        />
        <motion.div
          className="absolute inset-0"
          style={{ background: TUNNEL_DARKEN, opacity: darkenOpacity }}
        />
      </div>

      {/* Scroll Prompt */}
      <motion.div
        style={{ opacity: promptOpacity, visibility: promptVisibility }}
        className="pointer-events-none absolute inset-x-0 bottom-8 lg:left-[40%] flex flex-col items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-white/75"
      >
        <span>Scroll to Explore</span>
        <div className="h-6 w-px bg-gradient-to-b from-white to-transparent" />
        {settled ? null : (
          <button
            type="button"
            onClick={skipIntro}
            className="pointer-events-auto mt-1 border border-white/35 px-3 py-1.5 uppercase! text-[0.62rem] tracking-[0.25em] text-white/85 transition-colors duration-200 hover:border-[#e2bb62] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e2bb62]"
          >
            Skip intro ↓
          </button>
        )}
      </motion.div>
    </div>
  );
}
