"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ABOUT } from "@/lib/about-content";

export type AboutBookId = "mission" | "vision" | "leadership";

type Page = {
  title?: string;
  body?: string[];
  verse?: string;
  quote?: string;
  image?: string;
  imageShape?: "round" | "arch" | "tile" | "wide";
  imageAlt?: string;
};

type Book = {
  id: AboutBookId;
  label: string;
  color: string;
  pages: Page[];
};

const BOOKS: Book[] = [
  {
    id: "mission",
    label: "Our Mission",
    color: "#800654",
    pages: [
      {
        title: ABOUT.mission.title,
        body: [ABOUT.mission.lead, ABOUT.mission.deepen],
        image: "/images/serve-with-us.jpg",
        imageShape: "arch",
        imageAlt: "Serving together",
      },
      ...ABOUT.mission.how.map((p, i) => ({
        title: p.title,
        body: [p.body],
        verse: p.verse,
        quote: p.quote,
        image:
          i % 2 === 0
            ? "/images/community.jpg"
            : "/images/young-adults.jpg",
        imageShape: (i % 2 === 0 ? "round" : "tile") as Page["imageShape"],
      })),
      {
        title: "Our Mandate",
        body: ABOUT.mission.mandate.map((m) => `${m.ref}: ${m.text}`),
        image: "/images/mandate.png",
        imageShape: "wide",
      },
    ],
  },
  {
    id: "vision",
    label: "Our Vision",
    color: "#650445",
    pages: [
      {
        title: ABOUT.vision.title,
        body: [ABOUT.vision.lead, ABOUT.vision.intro],
        image: "/images/vision-campaign.jpg",
        imageShape: "wide",
        imageAlt: "Kharis vision",
      },
      ...chunk(ABOUT.vision.points, 2).map((pair, i) => ({
        title: `The Kharis we see`,
        body: pair,
        image:
          i % 3 === 0
            ? "/images/worship.jpg"
            : i % 3 === 1
              ? "/images/build-house.jpg"
              : "/images/young-adults.jpg",
        imageShape: (i % 2 === 0 ? "arch" : "round") as Page["imageShape"],
      })),
    ],
  },
  {
    id: "leadership",
    label: "Our Leadership",
    color: "#4a0a36",
    pages: [
      {
        title: ABOUT.leadership.title,
        body: [
          "Pastor David and Awo founded Kharis in 2003, a multifaceted ministry headquartered in London, United Kingdom, with several branches worldwide.",
        ],
        image: "/images/community.jpg",
        imageShape: "arch",
        imageAlt: "Pastors David and Awo Antwi",
      },
      {
        title: "Founders of Kharis",
        body: [
          "Together they also founded Kharis Phase 2, our students and young people’s services. Kharis also has a presence on university campuses across the UK.",
          "Their love for the Word of God is evident in how they lead, teach, and serve. Their greatest desire is to see believers established in their faith, local churches strengthened, and ultimately, for revival to sweep through the nations.",
          "They have been married for over 20 years and are blessed with two wonderful children.",
        ],
        image: "/images/young-adults.jpg",
        imageShape: "round",
      },
    ],
  },
];

function chunk<T>(arr: readonly T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push([...arr.slice(i, i + size)]);
  return out;
}

type Props = {
  bookId: AboutBookId | null;
  onClose: () => void;
  onChangeBook: (id: AboutBookId) => void;
};

/** Mid-screen Mission / Vision / Leadership bible overlay. */
export function AboutBible({ bookId, onClose, onChangeBook }: Props) {
  const reduce = useReducedMotion();
  const book = useMemo(
    () => BOOKS.find((b) => b.id === bookId) ?? null,
    [bookId],
  );
  const [page, setPage] = useState(0);
  const landingPage = useRef<number | null>(null);

  useEffect(() => {
    if (landingPage.current != null) {
      setPage(landingPage.current);
      landingPage.current = null;
      return;
    }
    setPage(0);
  }, [bookId]);

  useEffect(() => {
    if (!bookId) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight")
        setPage((p) => Math.min(p + 1, (book?.pages.length ?? 1) - 1));
      if (e.key === "ArrowLeft") setPage((p) => Math.max(p - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [bookId, book?.pages.length, onClose]);

  const goNext = useCallback(() => {
    if (!book) return;
    if (page < book.pages.length - 1) {
      setPage((p) => p + 1);
      return;
    }
    const idx = BOOKS.findIndex((b) => b.id === book.id);
    const nextBook = BOOKS[(idx + 1) % BOOKS.length];
    if (nextBook) {
      landingPage.current = 0;
      onChangeBook(nextBook.id);
    }
  }, [book, page, onChangeBook]);

  const goPrev = useCallback(() => {
    if (!book) return;
    if (page > 0) {
      setPage((p) => p - 1);
      return;
    }
    const idx = BOOKS.findIndex((b) => b.id === book.id);
    const prevBook = BOOKS[(idx - 1 + BOOKS.length) % BOOKS.length];
    if (prevBook) {
      landingPage.current = prevBook.pages.length - 1;
      onChangeBook(prevBook.id);
    }
  }, [book, page, onChangeBook]);

  const leaf = book?.pages[page];

  return (
    <AnimatePresence>
      {bookId && book && leaf ? (
        <motion.div
          className="about-bible"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
        >
          <button
            type="button"
            className="about-bible__scrim"
            aria-label="Close bible"
            onClick={onClose}
          />

          <motion.div
            className="about-bible__stage"
            role="dialog"
            aria-modal="true"
            aria-label={book.label}
            initial={reduce ? false : { scale: 0.84, rotateX: 18, y: 48 }}
            animate={{ scale: 1, rotateX: 8, y: 0 }}
            exit={reduce ? undefined : { scale: 0.9, opacity: 0, y: 28 }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
            style={{ ["--bible-ink" as string]: book.color }}
          >
            <div className="about-bible__shell">
              <div className="about-bible__cover about-bible__cover--board" aria-hidden />
              <div className="about-bible__cover about-bible__cover--left" aria-hidden />
              <div className="about-bible__cover about-bible__cover--right" aria-hidden />
              <div className="about-bible__edge about-bible__edge--top" aria-hidden />
              <div className="about-bible__edge about-bible__edge--bottom" aria-hidden />
              <div className="about-bible__stack about-bible__stack--left" aria-hidden>
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className="about-bible__stack about-bible__stack--right" aria-hidden>
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>

              <div className="about-bible__paper">
                <div className="about-bible__spine" aria-hidden />
                <div className="about-bible__gutter" aria-hidden />

                <div className="about-bible__top">
                  <div
                    className="about-bible__tabs"
                    role="tablist"
                    aria-label="About books"
                  >
                    {BOOKS.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        role="tab"
                        aria-selected={b.id === book.id}
                        className={`about-bible__tab${b.id === book.id ? " is-active" : ""}`}
                        onClick={() => onChangeBook(b.id)}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="about-bible__close"
                    onClick={onClose}
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${book.id}-${page}`}
                    className="about-bible__spread"
                    initial={reduce ? false : { opacity: 0, rotateY: -6 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    exit={reduce ? undefined : { opacity: 0, rotateY: 6 }}
                    transition={{ duration: 0.32 }}
                  >
                    <article className="about-bible__page about-bible__page--left">
                      <p className="about-bible__eyebrow">{book.label}</p>
                      {leaf.title ? <h2>{leaf.title}</h2> : null}
                      {leaf.body?.slice(0, 1).map((t) => (
                        <p key={t.slice(0, 24)}>{t}</p>
                      ))}
                      {leaf.verse ? (
                        <p className="about-bible__verse">{leaf.verse}</p>
                      ) : null}
                      {leaf.quote ? (
                        <blockquote>{leaf.quote}</blockquote>
                      ) : null}
                    </article>

                    <article className="about-bible__page about-bible__page--right">
                      {leaf.image ? (
                        <div
                          className={`about-bible__frame about-bible__frame--${leaf.imageShape ?? "tile"}`}
                        >
                          <Image
                            src={leaf.image}
                            alt={leaf.imageAlt || ""}
                            fill
                            className="object-cover"
                            sizes="(max-width: 900px) 80vw, 28vw"
                          />
                        </div>
                      ) : null}
                      {leaf.body?.slice(1).map((t) => (
                        <p key={t.slice(0, 28)} className="about-bible__more">
                          {t}
                        </p>
                      ))}
                      {!leaf.body?.slice(1).length && leaf.image ? (
                        <p className="about-bible__hint">
                          Turn the page to keep reading.
                        </p>
                      ) : null}
                    </article>
                  </motion.div>
                </AnimatePresence>

                <div className="about-bible__footer">
                  <button
                    type="button"
                    className="about-bible__nav"
                    onClick={goPrev}
                  >
                    ← Prev
                  </button>
                  <p className="about-bible__count">
                    {page + 1} / {book.pages.length}
                  </p>
                  <button
                    type="button"
                    className="about-bible__nav"
                    onClick={goNext}
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
