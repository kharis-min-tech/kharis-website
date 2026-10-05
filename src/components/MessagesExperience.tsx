"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
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
    a: "The Bible says faith comes by hearing, and hearing by the Word of God. This shows that faith is not a one-time event but a continuous process. Good preaching does not just build faith. It also helps spiritual maturity, guarding believers against being led astray by false teaching.",
  },
  {
    q: "What makes Kharis messages different?",
    a: "They are Christ-centric, text-driven, and gospel-saturated, with a focus on what the Bible is actually saying and revealing Christ through it, helping you to become a firm, sound believer.",
  },
  {
    q: "Where can I watch?",
    a: "Watch on this Messages page or on YouTube. Prefer audio? Listen on SoundCloud, Apple Podcasts, Spotify, or Amazon Music.",
  },
  {
    q: "How often are new messages added?",
    a: "New teachings are added weekly from Sunday services and series. Browse the rows below for the newest and older archive messages.",
  },
  {
    q: "Can I go deeper in the Word at home?",
    a: "Yes. Keep the Word on your lips and in your heart (Joshua 1:8). Replay teachings until truth settles, then share what God is saying.",
  },
  {
    q: "Is Scripture really for my situation?",
    a: "All Scripture is God-breathed and useful for teaching, correcting, and training in righteousness (2 Timothy 3:16). The Word is living and active (Hebrews 4:12).",
  },
];

/** Curated Pastor David posters for Listen Anywhere (maxres quality, no “God” titles). */
const LISTEN_DEVICE_POSTERS: MessageVideo[] = [
  {
    id: "AE2AXoQetmc",
    title: "The Mystery Of Fasting | David Antwi",
    thumbnail: "https://i.ytimg.com/vi/AE2AXoQetmc/maxresdefault.jpg",
    publishedAt: "2019-01-13T00:00:00Z",
  },
  {
    id: "9uYPZYrTHIA",
    title: "Mercy, Repentance and Baptism | David Antwi",
    thumbnail: "https://i.ytimg.com/vi/9uYPZYrTHIA/maxresdefault.jpg",
    publishedAt: "2020-06-14T00:00:00Z",
  },
  {
    id: "NOiT8EPTMrg",
    title: "The Saving Power Of Baptism | David Antwi",
    thumbnail: "https://i.ytimg.com/vi/NOiT8EPTMrg/maxresdefault.jpg",
    publishedAt: "2021-04-27T00:00:00Z",
  },
  {
    id: "ys4CMmykRh8",
    title: "End Of Fast Impartation Service | David Antwi",
    thumbnail: "https://i.ytimg.com/vi/ys4CMmykRh8/maxresdefault.jpg",
  },
  {
    id: "CkFM6auEc_g",
    title: "The Glorious Cross - Good Friday | David Antwi",
    thumbnail: "https://i.ytimg.com/vi/CkFM6auEc_g/maxresdefault.jpg",
    publishedAt: "2026-04-18T00:00:00Z",
  },
  {
    id: "71yzF9EfC3g",
    title: "The Implication Of The Virgin Birth | David Antwi",
    thumbnail: "https://i.ytimg.com/vi/71yzF9EfC3g/maxresdefault.jpg",
    publishedAt: "2025-12-21T00:00:00Z",
  },
  {
    id: "JFRZoVbHaMg",
    title: "THE LOGOS | David Antwi",
    thumbnail: "https://i.ytimg.com/vi/JFRZoVbHaMg/maxresdefault.jpg",
    publishedAt: "2026-06-01T00:00:00Z",
  },
  {
    id: "8mANIl_heyI",
    title: "Should We Continue In Sin? | David Antwi",
    thumbnail: "https://i.ytimg.com/vi/8mANIl_heyI/maxresdefault.jpg",
    publishedAt: "2026-05-25T00:00:00Z",
  },
];

function pickListenDevicePosters(archive: MessageVideo[]): MessageVideo[] {
  const skip = (t: string) =>
    t.includes("just men") ||
    t.includes("fragrance") ||
    /\bgod\b/.test(t);

  const fromArchive = [...archive]
    .filter((m) => {
      const t = m.title.toLowerCase();
      return t.includes("david antwi") && !skip(t);
    })
    .sort((a, b) => {
      const da = a.publishedAt ? Date.parse(a.publishedAt) : Number.POSITIVE_INFINITY;
      const db = b.publishedAt ? Date.parse(b.publishedAt) : Number.POSITIVE_INFINITY;
      return da - db;
    });

  const picked: MessageVideo[] = [];
  const seen = new Set<string>();
  for (const m of [...LISTEN_DEVICE_POSTERS, ...fromArchive]) {
    if (seen.has(m.id)) continue;
    if (skip(m.title.toLowerCase())) continue;
    seen.add(m.id);
    picked.push({
      ...m,
      thumbnail: `https://i.ytimg.com/vi/${m.id}/maxresdefault.jpg`,
    });
    if (picked.length >= 8) break;
  }
  return picked.length ? picked : LISTEN_DEVICE_POSTERS;
}

type Props = {
  messages: MessageVideo[];
  /** Same 5 as homepage Latest Messages */
  latest?: MessageVideo[];
};

export function MessagesExperience({ messages, latest = [] }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  const wall = useMemo(() => {
    const base = [...ORIGINAL_WALL_POSTERS];
    while (base.length < 9) {
      base.push(ORIGINAL_WALL_POSTERS[base.length % ORIGINAL_WALL_POSTERS.length]!);
    }
    return base.slice(0, 9);
  }, []);

  const topRow = useMemo(() => latest.slice(0, 4), [latest]);

  const listenMessages = useMemo(
    () => pickListenDevicePosters(messages),
    [messages],
  );

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

      <section className="msg-hub__hero" aria-label="Kharis messages">
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

        <MessagesDeviceCluster messages={listenMessages} />

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
