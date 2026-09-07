"use client";

import Image from "next/image";
import { Reveal, RevealItem, RevealStagger } from "@/components/Reveal";
import type { MessageVideo } from "@/lib/youtube";

type Props = {
  featured: MessageVideo;
  others: MessageVideo[];
};

export function LatestMessages({ featured, others }: Props) {
  if (!featured) return null;

  return (
    <section id="messages" className="bg-bg px-5 pb-6 pt-5 md:px-8 md:pb-8 md:pt-5">
      <div className="mx-auto max-w-7xl">
        <Reveal variant="up" className="mb-5 max-w-2xl md:mb-6">
          <p className="eyebrow">Teachings</p>
          <h2 className="section-title mt-2">Latest Messages</h2>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:gap-8">
          <Reveal variant="left" distance={48}>
            <a
              href={`https://www.youtube.com/watch?v=${featured.id}`}
              target="_blank"
              rel="noreferrer"
              className="group relative block aspect-video overflow-hidden rounded-[1.75rem] shadow-[var(--shadow-lift)]"
            >
              <Image
                src={featured.thumbnail}
                alt={featured.title}
                fill
                className="object-cover transition duration-700 group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            </a>

            <div className="mt-5">
              <h3 className="font-[family-name:var(--font-display)] text-[clamp(1.25rem,2.4vw,1.75rem)] font-bold leading-snug text-fg">
                {featured.title}
              </h3>
              <blockquote className="mt-3 max-w-xl text-base leading-relaxed text-muted md:text-lg">
                “Good teaching is Christ centred, does not go silent on the
                power of God and points us to the second coming.”
              </blockquote>
              <p className="mt-2 text-sm font-bold uppercase tracking-[0.14em] text-purple">
                David Antwi
              </p>
              <div className="latest-messages__actions">
                <a href="/messages" className="btn-primary">
                  Browse All Messages
                </a>
                <a
                  href="https://kharis.org/messages/"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                >
                  Listen on Podcasts
                </a>
              </div>
            </div>
          </Reveal>

          <RevealStagger
            className="grid grid-cols-2 gap-3 content-start"
            stagger={0.08}
            delayChildren={0.12}
          >
            {others.slice(0, 4).map((msg) => (
              <RevealItem key={msg.id} variant="right" distance={32}>
                <a
                  href={`https://www.youtube.com/watch?v=${msg.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group block overflow-hidden rounded-2xl border border-line bg-bg-soft shadow-sm transition hover:-translate-y-1 hover:shadow-[var(--shadow)]"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={msg.thumbnail}
                      alt={msg.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="200px"
                    />
                  </div>
                  <p className="line-clamp-2 p-3 text-xs font-bold leading-snug text-fg md:text-sm">
                    {msg.title}
                  </p>
                </a>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </div>
    </section>
  );
}
