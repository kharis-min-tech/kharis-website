"use client";

import {
  cubicBezier,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ClothBanner } from "./ClothBanner";
import { CHAPTERS, COVER_ART, FIRST_PAGE_ART } from "./data";
import {
  SCRUB_SPRING,
  cdn,
  cdnSet,
  glidePageTo,
  gotoChapter,
  pinScrollY,
  useCompact,
  useSectionSnap,
  useStageReady,
} from "./motion";

const EASE = cubicBezier(0.65, 0, 0.35, 1);
/** Timeline, as fractions of the pinned scroll. */
const HINT_OUT = [0, 0.05];
const OPEN = [0.06, 0.4];
const READ = 0.47; // resting point: the book lies open on the contents
const ZOOM = [0.56, 0.93];
const PAPER_IN = [0.84, 0.97];

/**
 * The front cover. A closed comic book sits on a dark desk; scrolling swings the cover open on its
 * spine, the open book slides to centre with the contents on the inside cover, then the first page
 * zooms until it fills the screen and the story begins. Phones show one page, so the cover swings
 * away to reveal page one instead.
 */
export function BookCover() {
  const sectionRef = useRef<HTMLElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const compact = useCompact();
  const ready = useStageReady();

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start 74px", "end end"] });
  const smooth = useSpring(scrollYProgress, SCRUB_SPRING);
  // Reduced motion: no pin and no scrubbing. Wide screens rest on the open spread with the
  // contents showing; phones, which can't fit a spread, show the closed cover.
  const resting = useMotionValue(0);
  useEffect(() => resting.set(compact ? 0 : READ), [compact, resting]);
  const progress = reduce ? resting : smooth;

  useSectionSnap(sectionRef, [0, READ, 1], !reduce);

  // How far the open spread moves to centre, and how much the first page must grow to fill the pin.
  const pageW = useMotionValue(0);
  const fillScale = useMotionValue(3);
  useEffect(() => {
    const book = bookRef.current;
    const section = sectionRef.current;
    if (!book || !section) return;
    const measure = () => {
      const w = book.offsetWidth;
      const h = book.offsetHeight;
      const pin = section.querySelector<HTMLElement>(".lb-cover__pin");
      pageW.set(w);
      if (pin && w && h) fillScale.set(Math.max(pin.clientWidth / w, pin.clientHeight / h) * 1.04);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(book);
    return () => observer.disconnect();
  }, [pageW, fillScale]);

  const coverTurn = useTransform(progress, OPEN, [0, -180], { ease: EASE });
  const spreadShift = useTransform(progress, OPEN, [0, 1], { ease: EASE });
  const zoomT = useTransform(progress, ZOOM, [0, 1], { ease: EASE });
  const scale = useTransform(() => 1 + (fillScale.get() - 1) * zoomT.get());
  // Desktop: the spine slides to the centre (half a page right), then the zoom pulls the right
  // page back to the middle. translate(a) scale(s) maps the page centre (w/2) to a + s * w/2.
  const x = useTransform(() => {
    if (compact) return 0;
    const half = pageW.get() / 2;
    return half * spreadShift.get() - zoomT.get() * scale.get() * half;
  });
  const hintOpacity = useTransform(progress, HINT_OUT, [1, 0]);
  const paper = useTransform(progress, PAPER_IN, [0, 1]);
  const coverShade = useTransform(coverTurn, [0, -90, -180], [0, 0.45, 0]);
  const insideShade = useTransform(coverTurn, [0, -90, -180], [0.5, 0.5, 0]);
  const deskDim = useTransform(progress, ZOOM, [0, 0.6]);

  // Pointer tilt on the closed book, so it feels like an object you could pick up.
  const tiltX = useSpring(0, { stiffness: 120, damping: 18 });
  const tiltY = useSpring(0, { stiffness: 120, damping: 18 });
  const [closed, setClosed] = useState(true);
  useEffect(() => progress.on("change", (v) => setClosed(v < 0.03)), [progress]);
  useEffect(() => {
    if (closed) return;
    tiltX.set(0);
    tiltY.set(0);
  }, [closed, tiltX, tiltY]);
  const onPointerMove = (event: React.PointerEvent) => {
    if (reduce || !closed || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    tiltY.set(((event.clientX - rect.left) / rect.width - 0.5) * 14);
    tiltX.set(-((event.clientY - rect.top) / rect.height - 0.5) * 10);
  };

  const openBook = () => {
    const section = sectionRef.current;
    if (section) glidePageTo(pinScrollY(section, READ), 1100);
  };

  return (
    <section
      data-reveal="self"
      ref={sectionRef}
      id="lb-cover"
      className="lb-cover"
      data-ready={ready || undefined}
      data-still={reduce || undefined}
      aria-labelledby="lb-cover-title"
    >
      <div
        className="lb-cover__pin"
        onPointerMove={onPointerMove}
        onPointerLeave={() => {
          tiltX.set(0);
          tiltY.set(0);
        }}
      >
        <motion.div className="lb-cover__desk" aria-hidden="true" />
        <motion.div className="lb-cover__dim" style={{ opacity: deskDim }} aria-hidden="true" />

        <motion.div className="lb-cover__scene" style={{ x, scale }}>
          <motion.div className="lb-cover__drop" style={{ rotateX: tiltX, rotateY: tiltY }}>
            <div ref={bookRef} className="lb-cover__book">
              {/* Page one, under the cover. It becomes the whole screen. */}
              <div className="lb-cover__first lb-paper">
                <div className="lb-cover__first-art">
                  <img
                    src={cdn(FIRST_PAGE_ART.src, 1600)}
                    srcSet={cdnSet(FIRST_PAGE_ART.src, [640, 1000, 1600, 2200])}
                    sizes="100vw"
                    alt=""
                    style={{ objectPosition: FIRST_PAGE_ART.position }}
                  />
                </div>
                <p className="lb-caption lb-cover__first-caption">
                  Page 1. It all starts with a welcome…
                </p>
                <span className="lb-cover__folio" aria-hidden="true">
                  01
                </span>
              </div>
              <span className="lb-cover__edges" aria-hidden="true" />

              {/* The cover board: front outside, contents inside. */}
              <motion.div className="lb-cover__board" style={{ rotateY: coverTurn }}>
                <div className="lb-cover__front">
                  <div className="lb-cover__art">
                    <img
                      src={cdn(COVER_ART.src, 900)}
                      srcSet={cdnSet(COVER_ART.src, [480, 900, 1300])}
                      sizes="(max-width: 899px) 86vw, 34vw"
                      alt=""
                      style={{ objectPosition: COVER_ART.position }}
                    />
                  </div>
                  <div className="lb-cover__masthead">
                    <span className="lb-cover__issue">KP2 Comics · Vol. 2</span>
                    <span className="lb-cover__price">Free · every Sunday</span>
                  </div>
                  <ClothBanner
                    className="lb-cover__cloth"
                    lines={["Kharis", "Life"]}
                    sub="Phase 2 · Our story together"
                    label="Kharis Life"
                    aspect={1.9}
                    accent="#f7be1d"
                    wind={0.8}
                  />
                  <span className="lb-burst lb-cover__burst" aria-hidden="true">
                    <span>Beyond Sundays!</span>
                  </span>
                  <p className="lb-cover__strap">Grow · Serve · Belong</p>
                  <motion.span
                    className="lb-cover__shade"
                    style={{ opacity: coverShade }}
                    aria-hidden="true"
                  />
                </div>

                <nav className="lb-cover__inside lb-paper" aria-label="In this issue">
                  <p className="lb-kicker">In this issue</p>
                  <h2 className="lb-cover__contents-title">Contents</h2>
                  <ol className="lb-contents">
                    {CHAPTERS.map((chapter) => (
                      <li key={chapter.id}>
                        <button type="button" onClick={() => gotoChapter({ chapter: chapter.id })}>
                          <span>{chapter.label}</span>
                          <span className="lb-contents__dots" aria-hidden="true" />
                          <span className="lb-contents__page">p.{chapter.page}</span>
                        </button>
                      </li>
                    ))}
                  </ol>
                  <p className="lb-cover__note">
                    Dear reader, Sundays are only the first page. Turn on and see what life at
                    Kharis Phase 2 is really about.
                  </p>
                  <motion.span
                    className="lb-cover__shade"
                    style={{ opacity: insideShade }}
                    aria-hidden="true"
                  />
                </nav>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        <h1 id="lb-cover-title" className="sr-only">
          Life at Kharis Phase 2
        </h1>

        <motion.button
          type="button"
          className="lb-cover__hint"
          style={{ opacity: hintOpacity }}
          onClick={openBook}
        >
          Open the book
          <span className="material-symbols-outlined" aria-hidden="true">
            south
          </span>
        </motion.button>

        <motion.div className="lb-cover__paper" style={{ opacity: paper }} aria-hidden="true" />
      </div>
    </section>
  );
}
