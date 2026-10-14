"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Fragment,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  LayoutGrid,
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
    <div className="events-cats__row" role="tablist" aria-label="Kharis events">
      {EVENT_CATEGORIES.map((cat, i) => {
        const Icon = cat.icon;
        const selected = cat.id === activeId;
        const groupStart = i > 0 && EVENT_CATEGORIES[i - 1]!.status !== cat.status;

        return (
          <Fragment key={cat.id}>
            {groupStart ? <span className="events-cats__divider" aria-hidden /> : null}
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
              <span className="events-cat__circle">
                <Icon aria-hidden strokeWidth={1.25} className="events-cat__icon" />
              </span>
              <span className="events-cat__label">{cat.label}</span>
              <span className="events-cat__status">
                {cat.status === "upcoming" ? "Upcoming" : "Past event"}
              </span>
            </button>
          </Fragment>
        );
      })}
    </div>
  );
}

const FOCUSABLE = 'button:not([disabled]), [href], video[controls], select, [tabindex]:not([tabindex="-1"])';

function StoryModal({
  label,
  onClose,
  onEscape,
  wide = false,
  children,
}: {
  label: string;
  onClose: () => void;
  onEscape?: () => void;
  wide?: boolean;
  children: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const escapeRef = useRef(onEscape ?? onClose);

  useEffect(() => {
    escapeRef.current = onEscape ?? onClose;
  }, [onEscape, onClose]);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusables = () => Array.from(panel?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    focusables()[0]?.focus();

    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        escapeRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const list = focusables();
      const first = list[0];
      const last = list[list.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && (document.activeElement === first || !panel?.contains(document.activeElement))) {
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
    <div className="events-modal">
      <button type="button" className="events-modal__scrim" aria-hidden tabIndex={-1} onClick={onClose} />
      <div
        ref={panelRef}
        className={`events-modal__panel${wide ? " events-modal__panel--wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={label}
      >
        <button type="button" className="events-modal__close" aria-label="Close" onClick={onClose}>
          <X aria-hidden className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>,
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
  const [index, setIndex] = useState<number | null>(null);
  const swipe = useRef<number | null>(null);
  const count = photos.length;
  const photo = index === null ? null : photos[index];

  const step = (delta: number) =>
    setIndex((i) => (i === null ? i : (i + delta + count) % count));

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "ArrowRight") setIndex((i) => (i === null ? i : (i + 1) % count));
      if (e.key === "ArrowLeft") setIndex((i) => (i === null ? i : (i - 1 + count) % count));
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [index, count]);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    swipe.current = e.clientX;
  };

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (swipe.current === null) return;
    const dx = e.clientX - swipe.current;
    swipe.current = null;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  };

  return (
    <StoryModal
      label={`${title} photos`}
      wide
      onClose={onClose}
      onEscape={() => (index === null ? onClose() : setIndex(null))}
    >
      <div className="events-modal__head">
        <p className="events-modal__eyebrow">Gallery</p>
        <h2 className="events-modal__title">{title}</h2>
      </div>

      {photo && index !== null ? (
        <div className="events-viewer">
          <div
            className="events-viewer__stage"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => (swipe.current = null)}
          >
            <Image
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              fill
              quality={95}
              draggable={false}
              sizes="(max-width: 900px) 100vw, 72rem"
              className="object-contain"
            />
          </div>
          <div className="events-viewer__bar">
            <button type="button" className="events-viewer__back" onClick={() => setIndex(null)}>
              <LayoutGrid aria-hidden className="h-4 w-4" />
              All photos
            </button>
            <p className="events-viewer__count" aria-live="polite">
              {index + 1} / {count}
            </p>
            <div className="events-viewer__arrows">
              <button type="button" className="events-round" aria-label="Previous photo" onClick={() => step(-1)}>
                <ChevronLeft aria-hidden className="h-5 w-5" />
              </button>
              <button type="button" className="events-round" aria-label="Next photo" onClick={() => step(1)}>
                <ChevronRight aria-hidden className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <ul className="events-gallery-grid">
          {photos.map((p, i) => (
            <li key={`${p.src}-${i}`}>
              <button
                type="button"
                className="events-gallery-grid__item"
                aria-label={`Open photo ${i + 1} of ${count}: ${p.alt}`}
                onClick={() => setIndex(i)}
              >
                <Image
                  src={p.src}
                  alt=""
                  fill
                  quality={95}
                  sizes="(max-width: 640px) 50vw, 24rem"
                  className="object-cover"
                  style={p.position ? { objectPosition: p.position } : undefined}
                />
              </button>
            </li>
          ))}
        </ul>
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

      {galleryOpen ? (
        <GalleryModal title={category.label} photos={category.gallery} onClose={() => setGalleryOpen(false)} />
      ) : null}
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
