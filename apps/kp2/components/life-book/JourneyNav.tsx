"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { CHAPTERS, EVENT_CHAPTERS } from "./data";
import { glidePageTo, gotoChapter, type JourneyGoto } from "./motion";

/**
 * The page counter: a square box that rides along once the book is open. It shows the chapter
 * you're in and how far through the issue you are, and opens the contents so you can jump to
 * any chapter or event. Hidden on the cover and once the footer arrives.
 */
export function JourneyNav() {
  const [chapter, setChapter] = useState<string | null>(null);
  const [eventLabel, setEventLabel] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  // Which chapter is in the middle of the screen.
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]"));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting)
            setChapter((entry.target as HTMLElement).dataset.chapter ?? null);
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onEvent = (event: Event) => setEventLabel((event as CustomEvent<string | null>).detail);
    window.addEventListener("lifebook:event", onEvent);
    return () => window.removeEventListener("lifebook:event", onEvent);
  }, []);

  // Show once the cover has opened; hide over the footer.
  useEffect(() => {
    const onScroll = () => {
      const cover = document.getElementById("lb-cover");
      const end = document.getElementById("lb-you");
      const opened = cover ? cover.getBoundingClientRect().bottom < window.innerHeight * 0.9 : true;
      const done = end ? end.getBoundingClientRect().top < window.innerHeight * 0.45 : false;
      setShow(opened && !done);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!show) setOpen(false);
  }, [show]);

  // Chapters that aren't the Events book scroll to their section; the book handles its own.
  useEffect(() => {
    const onGoto = (event: Event) => {
      const { chapter: id } = (event as CustomEvent<JourneyGoto>).detail;
      setOpen(false);
      if (id === "lb-events") return;
      const target = document.getElementById(id);
      if (target) glidePageTo(target.getBoundingClientRect().top + window.scrollY - 74, 1100);
    };
    window.addEventListener("lifebook:goto", onGoto);
    return () => window.removeEventListener("lifebook:goto", onGoto);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onClick = (event: MouseEvent) => {
      if (
        !panelRef.current?.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      )
        setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onClick);
    };
  }, [open]);

  const label = chapter === "The Events" && eventLabel ? eventLabel : (chapter ?? "Contents");
  const number = Math.max(1, CHAPTERS.findIndex((c) => c.label === chapter) + 1);

  return (
    <div className="lb-nav" data-show={show || undefined} data-open={open || undefined}>
      <div ref={panelRef} id="lb-nav-panel" className="lb-nav__panel" hidden={!open}>
        <p className="lb-kicker">Contents</p>
        <ol>
          {CHAPTERS.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                aria-current={c.label === chapter || undefined}
                onClick={() => gotoChapter({ chapter: c.id })}
              >
                <span>{c.label}</span>
                <span className="lb-nav__page">p.{c.page}</span>
              </button>
              {c.id === "lb-events" ? (
                <ol className="lb-nav__events">
                  {EVENT_CHAPTERS.map((e) => (
                    <li key={e.id}>
                      <button
                        type="button"
                        onClick={() => gotoChapter({ chapter: "lb-events", event: e.id })}
                      >
                        {e.title}
                      </button>
                    </li>
                  ))}
                </ol>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
      <button
        ref={buttonRef}
        type="button"
        className="lb-nav__button"
        aria-expanded={open}
        aria-controls="lb-nav-panel"
        tabIndex={show ? 0 : -1}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="lb-nav__ch">Ch.{String(number).padStart(2, "0")}</span>
        <span className="lb-nav__label">{label}</span>
        <span className="material-symbols-outlined" aria-hidden="true">
          {open ? "close" : "menu_book"}
        </span>
        <motion.span className="lb-nav__bar" style={{ scaleX: bar }} aria-hidden="true" />
      </button>
    </div>
  );
}
