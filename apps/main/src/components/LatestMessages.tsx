"use client";

import Image from "next/image";
import { useState } from "react";
import { Reveal, RevealItem, RevealStagger } from "@/components/Reveal";
import type { MessageVideo } from "@/lib/youtube";

type Props = {
  featured: MessageVideo;
  others: MessageVideo[];
};

/** Uses YouTube's 1280px thumbnail, falling back to the small one for videos that don't have it. */
function MessageThumb({
  message,
  sizes,
  quality,
  className,
}: {
  message: MessageVideo;
  sizes: string;
  quality?: number;
  className: string;
}) {
  const [sharp, setSharp] = useState(true);
  return (
    <Image
      src={sharp ? `https://i.ytimg.com/vi/${message.id}/maxresdefault.jpg` : message.thumbnail}
      alt={message.title}
      fill
      quality={quality}
      className={className}
      sizes={sizes}
      onError={() => setSharp(false)}
    />
  );
}

export function LatestMessages({ featured, others }: Props) {
  if (!featured) return null;

  return (
    <section id="messages" className="bg-bg px-5 pb-6 pt-5 md:px-8 md:pb-8 md:pt-5">
      <div className="mx-auto max-w-7xl">
        <Reveal variant="up" className="mx-auto mb-5 max-w-2xl text-center md:mb-6">
          <p className="eyebrow">Teachings</p>
          <h2 className="section-title mt-2">Latest Messages</h2>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:gap-8">
          <Reveal variant="left" distance={48}>
            <a
              href={`https://www.youtube.com/watch?v=${featured.id}`}
              target="_blank"
              rel="noreferrer"
              className="message-feature group relative block aspect-video overflow-hidden"
            >
              <MessageThumb
                message={featured}
                quality={95}
                className="object-cover transition duration-700 group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
            </a>

            <div className="mt-5 text-center">
              <h3 className="font-[family-name:var(--font-display)] text-[clamp(1.25rem,2.4vw,1.75rem)] font-bold leading-snug text-fg">
                {featured.title}
              </h3>
              <blockquote className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-muted md:text-lg">
                “Good teaching is Christ centred, does not go silent on the power of God and points
                us to the second coming.”
              </blockquote>
              <p className="mt-2 text-sm font-bold uppercase tracking-[0.14em] text-purple">
                David Antwi
              </p>
              <div className="latest-messages__actions btn-pair">
                <a href="/messages" className="btn-primary">
                  Browse All Messages
                </a>
                <a href="/messages#listen" className="btn-secondary">
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
                  className="message-thumb group block overflow-hidden border border-line bg-bg-soft"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <MessageThumb
                      message={msg}
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 1024px) 50vw, 220px"
                    />
                  </div>
                  <p className="line-clamp-2 p-3 text-center text-xs font-bold leading-snug text-fg md:text-sm">
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
