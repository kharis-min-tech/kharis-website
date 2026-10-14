"use client";

import Image, { getImageProps } from "next/image";
import Link from "next/link";
import {
  Fragment,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Pause,
  Play,
  X,
} from "lucide-react";
import {
  EVENT_CATEGORIES,
  type EventCategory,
  type EventPhoto,
  type EventSplit,
  type EventTile,
} from "@/data/event-categories";
import type { ServiceBranch, ServiceVisit } from "@/lib/service-branches";
import { BranchSelect, useStoredBranch } from "./BranchSelect";
import "./event-categories.css";

const ease = [0.22, 1, 0.36, 1] as const;

function CategoryRow({
  activeId,
  panelId,
  onSelect,
}: {
  activeId: string;
  panelId: string;
  onSelect: (id: string) => void;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const count = EVENT_CATEGORIES.length;

  const select = (index: number, focus: boolean) => {
    const button = refs.current[index];
    if (focus) button?.focus();
    button?.scrollIntoView({ block: "nearest", inline: "nearest" });
    onSelect(EVENT_CATEGORIES[index]!.id);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const next =
      e.key === "ArrowRight"
        ? (index + 1) % count
        : e.key === "ArrowLeft"
          ? (index - 1 + count) % count
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? count - 1
              : -1;
    if (next < 0) return;
    e.preventDefault();
    select(next, true);
  };

  return (
    <div className="events-cats__nav">
      <div className="events-cats__row" role="tablist" aria-label="Kharis events">
        {EVENT_CATEGORIES.map((cat, i) => {
          const selected = cat.id === activeId;
          const upcoming = cat.status === "upcoming";
          const groupStart = i > 0 && EVENT_CATEGORIES[i - 1]!.status !== cat.status;

          return (
            <Fragment key={cat.id}>
              {groupStart && <span className="events-cats__divider" aria-hidden />}
              <button
                ref={(el) => {
                  refs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`events-cat-${cat.id}`}
                aria-selected={selected}
                aria-controls={panelId}
                tabIndex={selected ? 0 : -1}
                className={`events-cat${selected ? " is-selected" : ""}`}
                onClick={() => select(i, false)}
                onKeyDown={(e) => onKeyDown(e, i)}
              >
                {cat.label}
                <span className="sr-only">{upcoming ? " (weekly service)" : " (past event)"}</span>
              </button>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

const FOCUSABLE = 'button:not([disabled]), [href], video[controls], select, [tabindex]:not([tabindex="-1"])';
const galleryEase = [0.2, 0.8, 0.2, 1] as const;
const GALLERY_IMAGE = { fill: true, quality: 95, sizes: "100vw" } as const;
/** Fill the stage edge to edge when the photo's shape is within ~10% of it. */
const COVER_TOLERANCE = 0.1;
const SWIPE_DISTANCE = 60;
const SWIPE_VELOCITY = 400;

function StoryModal({
  label,
  onClose,
  children,
}: {
  label: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusables = () => Array.from(panel?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    panel?.focus();

    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const list = focusables();
      const first = list[0];
      const last = list[list.length - 1];
      if (!first || !last) return;
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === panel || !panel?.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, []);

  return createPortal(
    <motion.div
      ref={panelRef}
      className="events-gallery"
      role="dialog"
      aria-modal="true"
      aria-label={label}
      tabIndex={-1}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0.15 : 0.28, ease: galleryEase }}
    >
      <button type="button" className="events-gallery__close" aria-label="Close gallery" onClick={onClose}>
        <X aria-hidden className="h-5 w-5" />
      </button>
      <motion.div
        className="events-gallery__body"
        initial={reduce ? false : { opacity: 0, y: 18, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduce ? undefined : { opacity: 0, y: 18, scale: 0.985 }}
        transition={{ duration: 0.28, ease: galleryEase }}
      >
        {children}
      </motion.div>
    </motion.div>,
    document.body,
  );
}

function GalleryModal({
  title,
  photos,
  onClose,
}: {
  title: string;
  photos: EventPhoto[];
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const count = photos.length;
  const [[index, direction], setSlide] = useState<[number, number]>([0, 0]);
  const [stageRatio, setStageRatio] = useState<number | null>(null);
  const [ratios, setRatios] = useState<Record<string, number>>({});
  const stageRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const stripPlaced = useRef(false);
  const photo = photos[index]!;

  const step = (delta: number) => setSlide(([i]) => [(i + delta + count) % count, delta]);

  useEffect(() => {
    if (count < 2) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      const delta = e.key === "ArrowRight" ? 1 : -1;
      setSlide(([i]) => [(i + delta + count) % count, delta]);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [count]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry!.contentRect;
      if (width && height) setStageRatio(width / height);
    });
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (count < 2) return;
    for (const i of new Set([(index + 1) % count, (index - 1 + count) % count])) {
      const { props } = getImageProps({ ...GALLERY_IMAGE, src: photos[i]!.src, alt: "" });
      const img = new window.Image();
      if (props.sizes) img.sizes = props.sizes;
      if (props.srcSet) img.srcset = props.srcSet;
      img.src = props.src;
    }
  }, [index, count, photos]);

  useEffect(() => {
    const strip = stripRef.current;
    const thumb = strip?.children[index] as HTMLElement | undefined;
    if (!strip || !thumb) return;
    strip.scrollTo({
      left: thumb.offsetLeft - (strip.clientWidth - thumb.offsetWidth) / 2,
      behavior: reduce || !stripPlaced.current ? "auto" : "smooth",
    });
    stripPlaced.current = true;
  }, [index, reduce]);

  const ratio = ratios[photo.src];
  const cover = Boolean(ratio && stageRatio && Math.abs(Math.log(ratio / stageRatio)) < COVER_TOLERANCE);
  const offset = reduce ? 0 : 28;
  const slide = {
    enter: (d: number) => ({ x: `${d * offset}%`, opacity: 0 }),
    center: { x: "0%", opacity: 1 },
    exit: (d: number) => ({ x: `${d * -offset}%`, opacity: 0 }),
  };

  return (
    <StoryModal label={`${title} photos`} onClose={onClose}>
      <div className="events-gallery__ambient" aria-hidden>
        <AnimatePresence initial={false}>
          <motion.div
            key={photo.src}
            className="events-gallery__ambient-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.6 }}
          >
            <Image {...GALLERY_IMAGE} src={photo.src} alt="" className="object-cover" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="events-gallery__top">
        <div>
          <p className="events-gallery__eyebrow">Gallery</p>
          <h2 className="events-gallery__title">{title}</h2>
        </div>
        <p className="events-gallery__count">
          <span aria-hidden>
            {index + 1} / {count}
          </span>
          <span className="sr-only" aria-live="polite">
            Photo {index + 1} of {count}: {photo.alt}
          </span>
        </p>
      </div>

      <div ref={stageRef} className="events-gallery__stage">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={index}
            className="events-gallery__slide"
            custom={direction}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { duration: 0.35, ease: galleryEase },
              opacity: { duration: reduce ? 0.15 : 0.3, ease: "easeOut" },
            }}
            drag={count > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={(_, info) => {
              if (info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_VELOCITY) step(1);
              else if (info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_VELOCITY) step(-1);
            }}
          >
            <Image
              {...GALLERY_IMAGE}
              src={photo.src}
              alt={photo.alt}
              priority
              draggable={false}
              className={cover ? "object-cover" : "object-contain"}
              style={cover && photo.position ? { objectPosition: photo.position } : undefined}
              onLoad={(e) => {
                const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
                if (w && h) setRatios((r) => (r[photo.src] ? r : { ...r, [photo.src]: w / h }));
              }}
            />
          </motion.div>
        </AnimatePresence>

        {count > 1 ? (
          <>
            <button
              type="button"
              className="events-gallery__arrow events-gallery__arrow--prev"
              aria-label="Previous photo"
              onClick={() => step(-1)}
            >
              <ChevronLeft aria-hidden className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="events-gallery__arrow events-gallery__arrow--next"
              aria-label="Next photo"
              onClick={() => step(1)}
            >
              <ChevronRight aria-hidden className="h-5 w-5" />
            </button>
          </>
        ) : null}
      </div>

      {count > 1 ? (
        <div ref={stripRef} className="events-gallery__strip" role="group" aria-label="All photos">
          {photos.map((p, i) => (
            <button
              key={`${p.src}-${i}`}
              type="button"
              className={`events-gallery__thumb${i === index ? " is-active" : ""}`}
              aria-label={`Show photo ${i + 1} of ${count}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => {
                if (i !== index) setSlide([i, Math.sign(i - index)]);
              }}
            >
              <Image
                src={p.src}
                alt=""
                fill
                quality={75}
                sizes="96px"
                className="object-cover"
                style={p.position ? { objectPosition: p.position } : undefined}
              />
            </button>
          ))}
        </div>
      ) : (
        <div className="events-gallery__strip" aria-hidden />
      )}
    </StoryModal>
  );
}

function EventHero({ category, visit }: { category: EventCategory; visit: ServiceVisit | null }) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [userPlay, setUserPlay] = useState<boolean | null>(null);
  const [inView, setInView] = useState(false);
  const { hero } = category;
  const playing = userPlay ?? !reduce;
  const upcoming = category.status === "upcoming";

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), {
      threshold: 0.2,
    });
    io.observe(root);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing && inView) video.play().catch(() => {});
    else video.pause();
  }, [playing, inView]);

  const eyebrow = upcoming
    ? visit
      ? `Every ${visit.day} · ${visit.times.join(" & ")}`
      : "Upcoming"
    : "Past event · Coming back soon";

  return (
    <section ref={rootRef} className="events-hero" aria-label={hero.headline}>
      {hero.video ? (
        <video
          ref={videoRef}
          className="events-hero__media"
          src={hero.video}
          poster={hero.poster}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
        />
      ) : (
        <div className={`events-hero__media${reduce ? "" : " events-hero__media--zoom"}`}>
          <Image
            src={hero.poster}
            alt={hero.posterAlt}
            fill
            quality={95}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}
      <span className="events-hero__veil" aria-hidden />

      <div className="events-hero__copy">
        <p className="events-hero__eyebrow">{eyebrow}</p>
        <h2 className="events-hero__headline">{hero.headline}</h2>
        <p className="events-hero__sub">{hero.subtext}</p>
      </div>

      {hero.video ? (
        <button
          type="button"
          className="events-round events-hero__toggle"
          aria-label={playing ? "Pause background video" : "Play background video"}
          onClick={() => setUserPlay(!playing)}
        >
          {playing ? (
            <Pause aria-hidden className="h-4 w-4" fill="currentColor" strokeWidth={0} />
          ) : (
            <Play aria-hidden className="h-4 w-4" fill="currentColor" strokeWidth={0} />
          )}
        </button>
      ) : null}
    </section>
  );
}

function BranchStrip({
  category,
  branch,
  branches,
  visit,
}: {
  category: EventCategory;
  branch: ServiceBranch | null;
  branches: ServiceBranch[];
  visit: ServiceVisit | null;
}) {
  if (!branch) {
    return (
      <div className="events-branch">
        <Link href="/locations" className="events-branch__link">
          Find your nearest service
          <ArrowUpRight aria-hidden className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="events-branch">
      <BranchSelect label="Your branch" branch={branch} branches={branches} />

      {visit ? (
        <>
          <p className="events-branch__fact">
            <Clock aria-hidden className="events-branch__ico" />
            <span>
              Every {visit.day} · {visit.times.join(" & ")}
            </span>
          </p>
          <p className="events-branch__fact">
            <MapPin aria-hidden className="events-branch__ico" />
            <span>
              <strong>{visit.venue}</strong>
              {visit.address ? <span className="events-branch__address">{visit.address}</span> : null}
            </span>
          </p>
        </>
      ) : (
        <p className="events-branch__fact">
          {branch.name} doesn’t list a {category.service === "midweek" ? "midweek" : "Sunday"} service
          yet.
        </p>
      )}

      <div className="events-branch__links">
        <Link href={branch.href} className="events-branch__link">
          {branch.name} branch
          <ArrowUpRight aria-hidden className="h-4 w-4" />
        </Link>
        <Link href="/locations" className="events-branch__link">
          Find your nearest service
          <ArrowUpRight aria-hidden className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function EventTiles({ tiles }: { tiles: EventTile[] }) {
  return (
    <div className="events-tiles">
      {tiles.map((tile) => (
        <figure key={tile.src} className="events-tile">
          <Image
            src={tile.src}
            alt={tile.alt}
            fill
            quality={95}
            sizes="(max-width: 760px) 100vw, 50vw"
            className="object-cover"
            style={tile.position ? { objectPosition: tile.position } : undefined}
          />
          <span className="events-tile__veil" aria-hidden />
          <figcaption className="events-tile__copy">
            <span className="events-tile__eyebrow">{tile.eyebrow}</span>
            <span className="events-tile__title">{tile.title}</span>
            <span className="events-tile__desc">{tile.description}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

function EventSplitPanel({ split, onExplore }: { split: EventSplit; onExplore: () => void }) {
  return (
    <section className="events-split" aria-label={split.headline}>
      {[split.left, split.right].map((photo) => (
        <div key={photo.src} className="events-split__half">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            quality={95}
            sizes="50vw"
            className="object-cover events-split__photo"
            style={
              {
                "--pos": photo.position ?? "50% 50%",
                "--pos-m": photo.mobilePosition ?? photo.position ?? "50% 50%",
              } as CSSProperties
            }
          />
        </div>
      ))}
      <span className="events-split__veil" aria-hidden />
      <div className="events-split__copy">
        <p className="events-split__eyebrow">{split.eyebrow}</p>
        <h3 className="events-split__headline">{split.headline}</h3>
        <button type="button" className="events-explore k-cta" onClick={onExplore}>
          Explore
          <ArrowUpRight aria-hidden className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}

function EventStory({ category, branches }: { category: EventCategory; branches: ServiceBranch[] }) {
  const branch = useStoredBranch(branches);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const upcoming = category.status === "upcoming";
  const visit = upcoming && branch
    ? category.service === "midweek"
      ? branch.midweek
      : branch.sunday
    : null;

  return (
    <>
      <EventHero category={category} visit={visit} />
      {upcoming ? (
        <BranchStrip category={category} branch={branch} branches={branches} visit={visit} />
      ) : null}
      <EventTiles tiles={category.tiles} />
      <EventSplitPanel split={category.split} onExplore={() => setGalleryOpen(true)} />

      <AnimatePresence>
        {galleryOpen ? (
          <GalleryModal
            key="gallery"
            title={category.label}
            photos={category.gallery}
            onClose={() => setGalleryOpen(false)}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}

type Props = {
  branches: ServiceBranch[];
};

export function EventCategories({ branches }: Props) {
  const reduce = useReducedMotion();
  const panelId = useId();
  const [activeId, setActiveId] = useState(EVENT_CATEGORIES[0]!.id);
  const active = EVENT_CATEGORIES.find((c) => c.id === activeId) ?? EVENT_CATEGORIES[0]!;

  return (
    <section className="events-cats" aria-label="Browse Kharis events">
      <CategoryRow activeId={active.id} panelId={panelId} onSelect={setActiveId} />

      <div
        id={panelId}
        className="events-story"
        role="tabpanel"
        aria-labelledby={`events-cat-${active.id}`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.id}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.3, ease }}
          >
            <EventStory category={active} branches={branches} />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
