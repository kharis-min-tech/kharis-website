"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MessageHoverTile } from "@/components/MessageHoverTile";
import { MessagesDeviceCluster } from "@/components/MessagesDeviceCluster";
import { MessagesFaq } from "@/components/MessagesFaq";
import { PlatformIcon } from "@/components/PlatformIcon";
import { LISTEN_PLATFORMS } from "@/lib/listen-platforms";
import { buildMessageShelves } from "@/lib/message-shelves";
import type { MessageVideo } from "@/lib/youtube";

gsap.registerPlugin(ScrollTrigger);

/** Original Teachings wall posters (same five sermons). mqdefault is 16:9 so no YouTube letterbox bars. */
const ORIGINAL_WALL_POSTERS: MessageVideo[] = [
  {
    id: "KBFfpU0mX2U",
    title: "A Living Witness For Jesus",
    thumbnail: "https://i.ytimg.com/vi/KBFfpU0mX2U/mqdefault.jpg",
  },
  {
    id: "6Y15Ja9E2hw",
    title: "Riding On Divine Assignment",
    thumbnail: "https://i.ytimg.com/vi/6Y15Ja9E2hw/mqdefault.jpg",
  },
  {
    id: "NgJZ2RmkuXs",
    title: "He Is God Even In The Storm",
    thumbnail: "https://i.ytimg.com/vi/NgJZ2RmkuXs/mqdefault.jpg",
  },
  {
    id: "u4vxbcZhmUo",
    title: "The LIGHT That Changes Everything",
    thumbnail: "https://i.ytimg.com/vi/u4vxbcZhmUo/mqdefault.jpg",
  },
  {
    id: "pbP3soO9lzg",
    title: "Inside The Church: Good Men & Actors",
    thumbnail: "https://i.ytimg.com/vi/pbP3soO9lzg/mqdefault.jpg",
  },
];

const WHY_FAQ = [
  {
    q: "Why should I listen to messages?",
    a: "Faith comes by hearing, and hearing by the word of God (Romans 10:17). These teachings strengthen what you believe and point you to Christ.",
  },
  {
    q: "What makes Kharis messages different?",
    a: "They are Christ-centred, Bible-rooted teachings from Pastor David Antwi: clear, living Word for everyday life, discipleship and revival.",
  },
  {
    q: "Where can I watch?",
    a: "Watch on this Messages page or YouTube. Prefer audio? Listen on SoundCloud, Apple Podcasts, Spotify or Amazon Music.",
  },
  {
    q: "How often are new messages added?",
    a: "New teachings are added regularly from Sunday services and series. Use search above or the rows below to find the newest and older archive messages.",
  },
  {
    q: "Can I go deeper in the Word at home?",
    a: "Yes. Keep the Word on your lips and in your heart (Joshua 1:8). Replay teachings until truth settles, then share what God is saying.",
  },
  {
    q: "Is Scripture really for my situation?",
    a: "All Scripture is God-breathed and useful for teaching, correcting and training in righteousness (2 Timothy 3:16). The Word is living and active (Hebrews 4:12).",
  },
];

function scoreMatch(query: string, title: string) {
  const q = query.trim().toLowerCase();
  if (!q) return 0;
  const t = title.toLowerCase();
  if (t === q) return 100;
  if (t.startsWith(q)) return 90;
  if (t.includes(q)) return 70;
  const tokens = q.split(/\s+/).filter(Boolean);
  let hit = 0;
  for (const tok of tokens) {
    if (t.includes(tok)) hit += 1;
  }
  return hit ? 40 + (hit / tokens.length) * 25 : 0;
}

type Props = {
  messages: MessageVideo[];
  /** Same 5 as homepage Latest Messages */
  latest?: MessageVideo[];
};

export function MessagesExperience({ messages, latest = [] }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");

  const wall = useMemo(() => {
    const base = [...ORIGINAL_WALL_POSTERS];
    while (base.length < 9) {
      base.push(ORIGINAL_WALL_POSTERS[base.length % ORIGINAL_WALL_POSTERS.length]!);
    }
    return base.slice(0, 9);
  }, []);

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    return [...messages]
      .map((m) => ({ m, score: scoreMatch(q, m.title) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map((x) => x.m);
  }, [messages, query]);

  const topRow = useMemo(() => {
    if (latest.length) return latest.slice(0, 4);
    return messages.slice(0, 4);
  }, [latest, messages]);

  const shelves = useMemo(() => {
    const taken = new Set(topRow.map((m) => m.id));
    const rest = messages.filter((m) => !taken.has(m.id));
    return buildMessageShelves(rest);
  }, [messages, topRow]);

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
          row.classList.contains("msg-row--series") ||
          row.classList.contains("msg-row--wide");
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
              <stop offset="0%" stopColor="#800654" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#800654" stopOpacity="0" />
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

      <section className="msg-hub__hero" aria-label="Search messages">
        <div className="msg-hub__wall" aria-hidden>
          {wall.map((msg, i) => (
            <div key={`${msg.id}-${i}`} className="msg-hub__wall-cell">
              <div className="msg-wall-poster">
                <Image
                  src={msg.thumbnail}
                  alt=""
                  fill
                  className="msg-wall-poster__img"
                  sizes="20vw"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="msg-hub__veil" aria-hidden />

        <div className="msg-hub__hero-copy">
          <p className="msg-hub__eyebrow">Kharis Messages</p>
          <h1 className="msg-hub__title">
            Teachings that
            <br />
            <span>feed your faith.</span>
          </h1>

          <label className="msg-hub__search">
            <span className="sr-only">Search messages</span>
            <svg viewBox="0 0 24 24" className="msg-hub__search-icon" aria-hidden>
              <path
                fill="currentColor"
                d="M10.5 3a7.5 7.5 0 0 1 5.9 12.1l4 4a1 1 0 0 1-1.4 1.4l-4-4A7.5 7.5 0 1 1 10.5 3Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z"
              />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search any message…"
              autoComplete="off"
            />
            {query && (
              <button
                type="button"
                className="msg-hub__search-clear"
                onClick={() => setQuery("")}
              >
                Clear
              </button>
            )}
          </label>

          {query.trim() && (
            <div className="msg-hub__results" role="listbox" aria-label="Search results">
              {results.length === 0 ? (
                <p className="msg-hub__empty">No matches found.</p>
              ) : (
                results.map((msg) => (
                  <MessageHoverTile
                    key={msg.id}
                    message={msg}
                    className="msg-tile--result"
                  />
                ))
              )}
            </div>
          )}
        </div>
      </section>

      <section className="msg-row-band">
        <div className="msg-row-band__head">
          <h2>Latest messages</h2>
        </div>
        <div className="msg-row msg-row--series">
          {topRow.map((msg) => (
            <MessageHoverTile
              key={msg.id}
              message={msg}
              className="msg-tile--series"
            />
          ))}
        </div>
      </section>

      {shelves.map((shelf) => (
        <section key={shelf.id} className="msg-shelf" aria-label={shelf.title}>
          <div className="msg-shelf__head">
            <h2>{shelf.title}</h2>
          </div>
          <div className="msg-shelf__rows">
            {shelf.rows.map((row, ri) => (
              <div key={`${shelf.id}-r${ri}`} className="msg-row msg-row--wide">
                {row.map((msg) => (
                  <MessageHoverTile
                    key={msg.id}
                    message={msg}
                    className="msg-tile--wide"
                  />
                ))}
              </div>
            ))}
          </div>
        </section>
      ))}

      <section id="listen" className="msg-listen" aria-label="Listen platforms">
        <p className="msg-listen__eyebrow">Catch every message</p>
        <h2 className="msg-listen__title">
          Listen <span>anywhere.</span>
        </h2>
        <p className="msg-listen__lede">
          Same Word. Pick the app you already open every day.
        </p>

        <MessagesDeviceCluster messages={topRow.length ? topRow : messages} />

        <div className="msg-listen__steps">
          {LISTEN_PLATFORMS.slice(0, 4).map((p) => (
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
              <span>{p.hint}</span>
            </a>
          ))}
        </div>

        <div className="msg-listen__foot">
          <Link href="/" className="msg-btn msg-btn--ghost">
            Back home
          </Link>
          <a
            href="https://www.youtube.com/@davidantwi"
            target="_blank"
            rel="noreferrer"
            className="msg-btn msg-btn--primary"
          >
            Full YouTube channel
          </a>
        </div>
      </section>

      <MessagesFaq items={WHY_FAQ} />
    </div>
  );
}
