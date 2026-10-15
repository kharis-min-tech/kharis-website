"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/** Real Kharis photographs. The spotlight moves between them, the way the homepage wall does. */
const PHOTOS = [
  {
    src: "https://images.kharis.org/site-images/main/56fc2395a9b23afb/contact/easter-welcome-wave.jpg",
    alt: "Two women waving as they arrive for the Easter Saturday service",
    caption: "Easter Saturday",
    spot: "hello-hero__photo--a",
  },
  {
    src: "https://images.kharis.org/site-images/main/421991ee4530d49b/contact/easter-door-greeter.jpg",
    alt: "A greeter welcoming people at the door on a London street before the Easter Saturday service",
    caption: "Welcome at the door",
    spot: "hello-hero__photo--b",
  },
  {
    src: "https://images.kharis.org/site-images/main/548f1d84de49653b/contact/after-service-handshake.jpg",
    alt: "Two men shaking hands after a Sunday service",
    caption: "After service",
    spot: "hello-hero__photo--c",
  },
  {
    src: "https://images.kharis.org/site-images/main/fb9b5e9814886abb/contact/service-prayer.jpg",
    alt: "People praying together at a Kharis service",
    caption: "Prayer",
    spot: "hello-hero__photo--d",
  },
] as const;

const SPOT_MS = 3400;

export function ContactHero() {
  const ref = useRef<HTMLElement>(null);
  const [spot, setSpot] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer = 0;
    let inView = true;

    const stop = () => window.clearInterval(timer);
    const start = () => {
      stop();
      if (reduced.matches || !inView || document.hidden) return;
      timer = window.setInterval(() => setSpot((s) => (s + 1) % PHOTOS.length), SPOT_MS);
    };

    const io = new IntersectionObserver(([entry]) => {
      inView = Boolean(entry?.isIntersecting);
      start();
    });
    io.observe(el);
    reduced.addEventListener("change", start);
    document.addEventListener("visibilitychange", start);
    start();

    return () => {
      stop();
      io.disconnect();
      reduced.removeEventListener("change", start);
      document.removeEventListener("visibilitychange", start);
    };
  }, []);

  return (
    <section ref={ref} className="hello-hero" aria-labelledby="hello-title">
      <div className="hello-hero__photos">
        {PHOTOS.map((photo, i) => (
          <figure
            key={photo.src}
            className={`hello-hero__photo ${photo.spot}${i === spot ? " is-spot" : ""}`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 1023px) 58vw, 30vw"
              priority={i < 2}
            />
            <figcaption aria-hidden>{photo.caption}</figcaption>
          </figure>
        ))}
      </div>
      <div className="hello-hero__shade" aria-hidden />

      <div className="hello-hero__copy">
        <p className="hello-hero__eyebrow">Contact Kharis</p>
        <h1 id="hello-title" className="hello-hero__title">
          <span className="hello-hero__lead">Say hello to the</span>{" "}
          <span className="hello-hero__brand">Home of Grace</span>
        </h1>
        <p className="hello-hero__intro">
          Planning your first Sunday, carrying something that needs prayer, or wondering where you
          fit? Write to us. Someone from the Kharis family will write back.
        </p>
        <div className="hello-hero__ctas btn-pair">
          <a href="#write" className="btn-primary">
            Write to us
          </a>
          <a href="#branches" className="btn-secondary">
            Find your branch
          </a>
        </div>
      </div>
    </section>
  );
}
