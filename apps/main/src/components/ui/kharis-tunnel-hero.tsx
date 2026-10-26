"use client";

import {
  motion,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
  MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "@/components/SiteImage";

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
 * Scroll progress: critically damped (24 / (2 * sqrt(120 * 1.2)) = 1), so cards carry
 * weight on the way out and tuck back on reversal without overshoot or trailing.
 */
const SCROLL_SPRING = { stiffness: 120, damping: 24, mass: 1.2, restDelta: 0.0001 };
/** Progress per pixel of wheel delta / finger travel. */
const WHEEL_SPEED = 0.0009;
/** Firefox and some mice report lines or pages instead of pixels. */
const WHEEL_LINE_PX = 16;
/**
 * Trackpads send many small deltas; mouse wheels send ~100px notches and flung trackpads spike.
 * Deltas above the knee are compressed and capped so every device glides instead of jumping.
 */
const WHEEL_KNEE_PX = 60;
const WHEEL_MAX_PX = 140;
const WHEEL_COMPRESSION = 0.4;
const TOUCH_SPEED = 0.002;
/** Start partway in so the first cards are already in flight and the title is fully visible. */
const INITIAL_PROGRESS = 0.12;
/**
 * Where the tunnel sits when the hero lands back at the top after a full escape. While the user
 * scrolls up and the hero re-enters, cards collapse from 1 (escaped) toward this value in step
 * with how much of the hero is back in view, so the hero never returns empty.
 */
const REENTRY_PROGRESS = 0.5;

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
  const smoothProgress = useSpring(rawProgress, SCROLL_SPRING);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    /**
     * Moves the tunnel and returns true, or returns false so the page scrolls instead: at either
     * end of the tunnel, or while the page is scrolled down (scrolling back up first returns the
     * page to the top, then the cards tuck back in).
     */
    const advance = (delta: number) => {
      if (window.scrollY > 1) return false;
      const current = rawProgress.get();
      const next = clamp01(current + delta);
      if (next === current) return false;
      rawProgress.set(next);
      return true;
    };

    const handleWheel = (e: WheelEvent) => {
      if (advance(normalizeWheelDelta(e) * WHEEL_SPEED)) e.preventDefault();
    };

    let lastTouchY: number | null = null;
    const handleTouchStart = (e: TouchEvent) => {
      lastTouchY = e.touches[0]?.clientY ?? null;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY;
      if (lastTouchY === null || y === undefined) return;
      const delta = (lastTouchY - y) * TOUCH_SPEED;
      lastTouchY = y;
      if (advance(delta)) e.preventDefault();
    };
    const handleTouchEnd = () => {
      lastTouchY = null;
    };

    /* Scrolling up into the hero rewinds the tunnel with it. Only ever pulls progress back, so
       scrolling down past the hero leaves it alone. */
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const goingUp = scrollY < lastScrollY;
      lastScrollY = scrollY;
      if (!goingUp) return;
      const { top, height } = el.getBoundingClientRect();
      if (top <= -height) return;
      const hidden = clamp01(-top / height);
      const target = REENTRY_PROGRESS + (1 - REENTRY_PROGRESS) * hidden;
      if (target < rawProgress.get()) rawProgress.set(target);
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
  }, [rawProgress]);

  const pointer = useCameraParallax(!reduce);

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
        style={{ opacity: promptOpacity }}
        className="pointer-events-none absolute inset-x-0 bottom-8 lg:left-[40%] flex flex-col items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-white/75"
      >
        <span>Scroll to Explore</span>
        <div className="h-6 w-px bg-gradient-to-b from-white to-transparent" />
      </motion.div>
    </div>
  );
}
