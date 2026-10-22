"use client";

import { useEffect, useRef } from "react";

/** Hero photo that slides up as the hero scrolls away, revealing its lower part. */
export function ParallaxHeroImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = ref.current;
    const hero = img?.closest("header, section") as HTMLElement | null;
    if (!img || !hero) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      img.style.height = `${hero.offsetHeight}px`;
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const heroHeight = hero.offsetHeight;
      img.style.height = `${heroHeight * 1.2}px`;
      const scrolled = -hero.getBoundingClientRect().top / heroHeight;
      const progress = Math.min(Math.max(scrolled, 0), 1);
      // The image is 120% of the hero, so a sixth of its height is exactly the overflow.
      img.style.transform = `translate3d(0, ${(-progress * 100) / 6}%, 0)`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const targets: EventTarget[] = [window];
    let node = hero.parentElement;
    while (node) {
      targets.push(node);
      node = node.parentElement;
    }

    update();
    targets.forEach((target) => target.addEventListener("scroll", schedule, { passive: true }));
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      targets.forEach((target) => target.removeEventListener("scroll", schedule));
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      loading="eager"
      decoding="async"
      className={`kp-parallax absolute inset-x-0 top-0 w-full object-cover ${className ?? ""}`}
    />
  );
}
