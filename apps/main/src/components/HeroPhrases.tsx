"use client";

import dynamic from "next/dynamic";

/**
 * The rotating "We are …" line in the hero.
 *
 * Replaces a hand-rolled typewriter that drove each letter from its own
 * setTimeout — roughly a hundred timers per cycle, all of which had to be
 * torn down and rebuilt whenever the phrase changed. The vendored rotator
 * does the same job with one animation.
 *
 * Client-only: it animates from the first frame, so there is nothing worth
 * server-rendering, and this keeps it out of every other page's bundle.
 */
const TextRotator = dynamic(() => import("@/vendor/text-rotator/AnimatedTextRotator.js"), {
  ssr: false,
  loading: () => <span className="hero-phrases__placeholder" aria-hidden />,
});

/** Campaign yellow, matching "Kharis" in the welcome line. */
const ACCENT = "#ffde59";

export const HERO_PHRASES = ["Gospel Centred", "Bible Believing", "Revival Seeking"] as const;

export function HeroPhrases() {
  return (
    <span className="hero-phrases">
      {/* The phrases are decorative motion; screen readers get the plain list
          once rather than a value that changes under them. */}
      <span className="sr-only">
        We are {HERO_PHRASES.slice(0, -1).join(", ")} and {HERO_PHRASES[HERO_PHRASES.length - 1]}.
      </span>
      <span aria-hidden className="hero-phrases__motion">
        <TextRotator
          style={{ width: "100%", height: "100%" }}
          words={[...HERO_PHRASES]}
          effect="typewriter"
          caret
          fitToFrame={false}
          size={undefined}
          color={ACCENT}
          align="center"
          font={{
            fontFamily: "var(--font-display), 'Plus Jakarta Sans', system-ui, sans-serif",
            fontWeight: 800,
            letterSpacing: "-0.025em",
            lineHeight: "1.1em",
          }}
          /* Without this the line types "Revival Seeking" and stops there
             for good. The rotator destructures `loop` straight from its
             props with no default — inside Framer the editor supplies one
             from its property controls, but we are not inside Framer, so it
             arrives undefined and its typewriter path hits
             `if (!loop && isLast) return`. Every prop this component relies
             on has to be passed explicitly for that reason. */
          loop
          // Time per letter when the effect is typewriter.
          stagger={0.07}
          hold={1.8}
          exitDuration={0.3}
        />
      </span>
    </span>
  );
}
