"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BookOpen,
  Compass,
  Cross,
  Flame,
  Flower,
  HandHeart,
  Heart,
  LayoutGrid,
  Search,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Icon } from "@/components/Icon";
import { MessageHoverTile } from "@/components/MessageHoverTile";
import { VisionSection } from "@/components/VisionSection";
import { MessagesHero } from "@/components/MessagesHero";
import { PlatformIcon } from "@/components/PlatformIcon";
import { KHARIS_APP } from "@/lib/kharis-app";
import { LISTEN_PLATFORMS } from "@/lib/listen-platforms";
import { MESSAGE_TOPICS, matchesQuery, matchesTopic } from "@/lib/message-filters";
import { buildMessageShelves } from "@/lib/message-shelves";
import type { MessageVideo } from "@/lib/youtube";
import { newestMessage } from "@/lib/newest-message";
import "./messages-hub.css";

gsap.registerPlugin(ScrollTrigger);

const TOPIC_ICONS: Record<string, LucideIcon> = {
  all: LayoutGrid,
  jesus: Cross,
  bible: BookOpen,
  prayer: HandHeart,
  love: Heart,
  purpose: Compass,
  acts: Flame,
  "just-men": Users,
  fragrance: Flower,
};

function AppStoreButtons() {
  return (
    <div className="msg-app-buttons" role="group" aria-label={`Get the ${KHARIS_APP.name}`}>
      <a
        href={KHARIS_APP.iosUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="msg-app-btn k-cta"
      >
        <Icon name="apple" className="msg-app-btn__icon" />
        <span className="msg-app-btn__copy">
          <strong>App Store</strong>
        </span>
      </a>
      <a
        href={KHARIS_APP.androidUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="msg-app-btn k-cta"
      >
        <Icon name="android" className="msg-app-btn__icon" />
        <span className="msg-app-btn__copy">
          <strong>Google Play</strong>
        </span>
      </a>
    </div>
  );
}

type Props = {
  messages: MessageVideo[];
  /** Same 5 as homepage Latest Messages */
  latest?: MessageVideo[];
};

export function MessagesExperience({ messages, latest = [] }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroMessage = useMemo(() => newestMessage([...latest, ...messages]), [latest, messages]);

  const topRow = useMemo(() => latest.slice(0, 4), [latest]);

  const shelves = useMemo(() => {
    const taken = new Set(topRow.map((m) => m.id));
    const rest = messages.filter((m) => !taken.has(m.id));
    return buildMessageShelves(rest);
  }, [messages, topRow]);

  const [topic, setTopic] = useState("all");
  const [query, setQuery] = useState("");
  const search = useDeferredValue(query.trim());
  const topics = useMemo(
    () => MESSAGE_TOPICS.filter((t) => messages.some((m) => matchesTopic(m, t.id))),
    [messages],
  );
  const filtering = topic !== "all" || search !== "";

  const filtered = useMemo(() => {
    if (!filtering) return [];
    return messages.filter(
      (m) => (topic === "all" || matchesTopic(m, topic)) && matchesQuery(m, search),
    );
  }, [messages, topic, search, filtering]);

  const filteredRows = useMemo(() => {
    const rows: MessageVideo[][] = [];
    for (let i = 0; i < filtered.length; i += 4) rows.push(filtered.slice(i, i + 4));
    return rows;
  }, [filtered]);

  const topicLabel = MESSAGE_TOPICS.find((t) => t.id === topic)?.label;
  const filterHeading = [
    search ? `“${search}”` : null,
    topicLabel ?? (search ? null : "All messages"),
  ]
    .filter(Boolean)
    .join(" · ");

  const clearFilters = () => {
    setTopic("all");
    setQuery("");
  };

  useEffect(() => {
    // Results change the page height; keep the scroll-in animations below lined up.
    ScrollTrigger.refresh();
  }, [topic, search]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".msg-hub__hero-copy > *",
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
          clearProps: "transform",
        },
      );

      gsap.utils.toArray<HTMLElement>(".msg-row").forEach((row) => {
        const gridRow =
          row.classList.contains("msg-row--series") || row.classList.contains("msg-row--wide");
        gsap.fromTo(
          row.querySelectorAll(".msg-tile"),
          gridRow ? { y: 18, opacity: 0 } : { x: 40, opacity: 0 },
          {
            scrollTrigger: {
              trigger: row,
              start: "top 88%",
              toggleActions: "play none none none",
            },
            x: 0,
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.06,
            ease: "power3.out",
            clearProps: "transform",
          },
        );
      });

      gsap.fromTo(
        ".msg-faq__item",
        { y: 24, opacity: 0 },
        {
          scrollTrigger: {
            trigger: ".msg-faq",
            start: "top 88%",
            toggleActions: "play none none none",
          },
          y: 0,
          opacity: 1,
          duration: 0.55,
          stagger: 0.06,
          ease: "power3.out",
          clearProps: "transform",
        },
      );

      gsap.fromTo(
        ".msg-listen__step",
        { y: 30, opacity: 0 },
        {
          scrollTrigger: {
            trigger: ".msg-listen__steps",
            start: "top 88%",
            toggleActions: "play none none none",
          },
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.07,
          ease: "power3.out",
          clearProps: "transform",
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="msg-page msg-hub">
      <div className="msg-mist" aria-hidden>
        <svg className="msg-mist__svg" viewBox="0 0 1200 800" preserveAspectRatio="none">
          <defs>
            <radialGradient id="msgMistA" cx="30%" cy="20%" r="55%">
              <stop offset="0%" stopColor="#630ed4" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#630ed4" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="msgMistB" cx="80%" cy="60%" r="50%">
              <stop offset="0%" stopColor="#6b34fa" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#6b34fa" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="1200" height="800" fill="url(#msgMistA)" />
          <rect width="1200" height="800" fill="url(#msgMistB)" />
        </svg>
      </div>

      {heroMessage && <MessagesHero message={heroMessage} />}

      <section className="msg-row-band">
        <div className="msg-row-band__head">
          <h2>Latest messages</h2>
        </div>
        <div className="msg-row msg-row--series">
          {topRow.map((msg) => (
            <MessageHoverTile key={msg.id} message={msg} className="msg-tile--series" />
          ))}
        </div>
      </section>

      <section className="msg-filter" aria-label="Filter messages">
        <div className="msg-filter__inner">
          <div className="msg-filter__topics" role="group" aria-label="Filter by topic">
            {[{ id: "all", label: "All" }, ...topics].map((t) => {
              const Icon = TOPIC_ICONS[t.id] ?? LayoutGrid;
              return (
                <button
                  key={t.id}
                  type="button"
                  className="msg-filter__chip"
                  aria-pressed={topic === t.id}
                  onClick={() => setTopic(t.id)}
                >
                  <Icon className="msg-filter__icon" strokeWidth={1.9} aria-hidden />
                  {t.label}
                </button>
              );
            })}
          </div>
          <label className="msg-filter__search" data-active={query.trim() !== "" || undefined}>
            <Search className="msg-filter__icon" strokeWidth={1.9} aria-hidden />
            <input
              type="search"
              aria-label="Search messages"
              placeholder="Search messages"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              enterKeyHint="search"
              autoComplete="off"
            />
          </label>
        </div>
      </section>

      {filtering ? (
        <section className="msg-shelf msg-filter-results" aria-label="Filtered messages">
          <div className="msg-shelf__head msg-filter-results__head">
            <h2>{filterHeading}</h2>
            <p className="msg-filter-results__count" aria-live="polite">
              {filtered.length === 1 ? "1 message" : `${filtered.length} messages`}
            </p>
            <button type="button" className="msg-filter-results__clear" onClick={clearFilters}>
              Clear
            </button>
          </div>
          {filtered.length ? (
            <div className="msg-shelf__rows">
              {filteredRows.map((row, ri) => (
                <div key={`filtered-r${ri}`} className="msg-row msg-row--wide">
                  {row.map((msg) => (
                    <MessageHoverTile key={msg.id} message={msg} className="msg-tile--wide" />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="msg-empty">
              <h3 className="msg-empty__title">Can’t find the message you’re looking for?</h3>
              <p className="msg-empty__lede">Every Kharis message is in the Kharis app.</p>
              <AppStoreButtons />
              <button type="button" className="msg-empty__clear" onClick={clearFilters}>
                Clear search and filters
              </button>
            </div>
          )}
        </section>
      ) : (
        shelves.map((shelf) => (
          <section key={shelf.id} className="msg-shelf" aria-label={shelf.title}>
            <div className="msg-shelf__head">
              <h2>{shelf.title}</h2>
            </div>
            <div className="msg-shelf__rows">
              {shelf.rows.map((row, ri) => (
                <div key={`${shelf.id}-r${ri}`} className="msg-row msg-row--wide">
                  {row.map((msg) => (
                    <MessageHoverTile key={msg.id} message={msg} className="msg-tile--wide" />
                  ))}
                </div>
              ))}
            </div>
          </section>
        ))
      )}

      {(!filtering || filtered.length > 0) && (
        <aside className="msg-app-strip" aria-label={KHARIS_APP.name}>
          <div className="msg-app-strip__inner">
            <div className="msg-app-strip__copy">
              <p className="msg-app-strip__title">Find all messages in the Kharis app</p>
              <p className="msg-app-strip__sub">Free on iPhone and Android.</p>
            </div>
            <AppStoreButtons />
          </div>
        </aside>
      )}

      <VisionSection id="listen" />

      <section className="msg-listen" aria-label="More ways to listen">
        <h2 className="msg-listen__title">More ways to listen</h2>
        <div className="msg-listen__steps">
          {LISTEN_PLATFORMS.slice(0, 5).map((p) => (
            <a
              key={p.id}
              href={p.href}
              target="_blank"
              rel="noreferrer"
              className={`msg-listen__step msg-listen__step--${p.id}`}
            >
              <span className="msg-listen__step-icon">
                <PlatformIcon id={p.id} className="h-8 w-8 md:h-9 md:w-9" />
              </span>
              <strong>{p.name}</strong>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
