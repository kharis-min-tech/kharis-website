"use client";

import Image, { getImageProps } from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  X,
} from "lucide-react";
import type { EventCategory, EventMedia, EventPhoto, EventSplit } from "@/data/event-categories";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import "./event-categories.css";

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

function ExploreButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" className="events-explore k-cta" onClick={onClick}>
      Explore
      <span className="sr-only"> photos from {label}</span>
      <ArrowUpRight aria-hidden className="h-4 w-4" />
    </button>
  );
}

function eyebrowFor(category: EventCategory) {
  if (category.status === "past") return "Past event · Coming back soon";
  return "Upcoming special event";
}

/** One picture (or video) with the event's words and its Explore button on top. */
function EventCard({
  category,
  media,
  titleId,
  wide,
  onExplore,
}: {
  category: EventCategory;
  media: EventMedia;
  titleId: string;
  wide: boolean;
  onExplore: () => void;
}) {
  const reduce = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [userPlay, setUserPlay] = useState<boolean | null>(null);
  const [inView, setInView] = useState(false);
  const playing = userPlay ?? !reduce;
  const full = category.layout === "full";

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !media.video) return;
    const io = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), {
      threshold: 0.2,
    });
    io.observe(root);
    return () => io.disconnect();
  }, [media.video]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing && inView) video.play().catch(() => {});
    else video.pause();
  }, [playing, inView]);

  return (
    <div ref={rootRef} className={`events-card events-card--${full ? "full" : "tile"}`}>
      {media.video ? (
        <video
          ref={videoRef}
          className="events-card__media"
          src={media.video}
          poster={media.poster}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
        />
      ) : (
        <div className={`events-card__media${full && !reduce ? " events-card__media--zoom" : ""}`}>
          <Image
            src={media.poster}
            alt={media.alt}
            fill
            loading="eager"
            quality={95}
            sizes={full || wide ? "100vw" : "(max-width: 759px) 100vw, 50vw"}
            className="object-cover"
            style={media.position ? { objectPosition: media.position } : undefined}
          />
        </div>
      )}
      <span className="events-card__veil" aria-hidden />

      <div className="events-card__copy">
        <p className="events-card__eyebrow">{eyebrowFor(category)}</p>
        <h2 id={titleId} className="events-card__headline">
          {category.headline}
        </h2>
        <p className="events-card__sub">{category.subtext}</p>
        <ExploreButton label={category.label} onClick={onExplore} />
      </div>

      {media.video ? (
        <button
          type="button"
          className="events-round events-card__toggle"
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
    </div>
  );
}

function EventSplitPanel({
  category,
  split,
  titleId,
  onExplore,
}: {
  category: EventCategory;
  split: EventSplit;
  titleId: string;
  onExplore: () => void;
}) {
  return (
    <div className="events-split">
      {[split.left, split.right].map((photo) => (
        <div key={photo.src} className="events-split__half">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            loading="eager"
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
        <p className="events-card__eyebrow">{split.eyebrow}</p>
        <h2 id={titleId} className="events-split__headline">
          {category.headline}
        </h2>
        <p className="events-card__sub">{category.subtext}</p>
        <ExploreButton label={category.label} onClick={onExplore} />
      </div>
    </div>
  );
}

function EventBlock({
  category,
  hidden,
  wide = false,
}: {
  category: EventCategory;
  hidden: boolean;
  wide?: boolean;
}) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const titleId = `${category.id}-title`;
  const openGallery = () => setGalleryOpen(true);

  return (
    <article
      id={category.id}
      className={`events-block events-block--${category.layout}`}
      aria-labelledby={titleId}
      hidden={hidden}
    >
      {category.layout === "split" ? (
        <EventSplitPanel category={category} split={category.split} titleId={titleId} onExplore={openGallery} />
      ) : (
        <EventCard
          category={category}
          media={category.media}
          titleId={titleId}
          wide={wide}
          onExplore={openGallery}
        />
      )}

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
    </article>
  );
}

/** Consecutive "half" events pair up into two-up rows; everything else gets its own row. */
function toRows(categories: EventCategory[]) {
  const rows: EventCategory[][] = [];
  for (const category of categories) {
    const last = rows.at(-1);
    if (category.layout === "half" && last?.length === 1 && last[0]!.layout === "half") last.push(category);
    else rows.push([category]);
  }
  return rows;
}

type Props = {
  categories: EventCategory[];
  visibleIds: ReadonlySet<string>;
  onClear: () => void;
};

/** Every event in order; ones outside the current filter stay mounted but hidden. */
export function EventCategories({ categories, visibleIds, onClear }: Props) {
  return (
    <section className="events-stack" aria-label="Kharis events">
      {toRows(categories).map((row) => {
        const first = row[0]!;
        if (first.layout !== "half") {
          return (
            <EventBlock
              key={first.id}
              category={first}
              hidden={!visibleIds.has(first.id)}
            />
          );
        }
        const shown = row.filter((c) => visibleIds.has(c.id)).length;
        return (
          <div
            key={row.map((c) => c.id).join("+")}
            className={`events-row${shown === 1 ? " is-single" : ""}`}
            hidden={shown === 0}
          >
            {row.map((c) => (
              <EventBlock
                key={c.id}
                category={c}
                hidden={!visibleIds.has(c.id)}
                wide={shown === 1}
              />
            ))}
          </div>
        );
      })}

      {visibleIds.size === 0 ? (
        <div className="events-stack__empty" role="status">
          <p>No events match</p>
          <button type="button" className="events-stack__clear" onClick={onClear}>
            Clear
          </button>
        </div>
      ) : null}
    </section>
  );
}
