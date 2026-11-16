/**
 * "Kharis: Who we are", told as a book you open and turn.
 *
 * WHAT THIS TAKES FROM THE FRAMER COMPONENT
 * -----------------------------------------
 * The mechanics are ABook_Advanced's, which is the only one of the candidates
 * built out of real React and real text rather than textures. Its three ideas,
 * all of which the first attempt here was missing:
 *
 *   1. the book is CLOSED at rest and you open it, so it reads as an object
 *      sitting on a surface rather than a slide;
 *   2. it has a SPINE with thickness, which is what gives it volume;
 *   3. a leaf has a FRONT and a BACK, so turning the cover reveals the left
 *      hand page of the first spread. That is the actual trick of a page
 *      turn, and a single sheet rotating in place cannot imitate it.
 *
 * Everything else is ours, because the component stops where a real page
 * starts: it holds exactly one spread, inline styles only, hard coded
 * #1a1a1a ink, a paper texture fetched from transparenttextures.com, no
 * keyboard, and it snaps shut the moment your mouse leaves, which is fine for
 * a portfolio trinket and impossible for something anyone has to read.
 *
 * The other two candidates are not usable here. ThreeD_magazine pulls a 1MB
 * three.js and react-three-fiber bundle and paints each page as a WebGL
 * texture, which loses selectable text, screen readers, search and dark mode,
 * and would hit the same CORS wall on images.kharis.org that the Life tunnel
 * hit. Book-AFRs / Preview-Section was a pair of URLs pasted into each other
 * and does not resolve.
 *
 * AN ILLUSTRATED BOOK, NOT A TRANSCRIPT
 * -------------------------------------
 * The first draft of this was type on paper and nothing else, which made the
 * whole thing a reading task. Every spread now carries something to look at:
 * a full bleed plate, a photograph set into the page, portraits of the two
 * people being written about, or, where a spread is genuinely a list, a
 * numbered rhythm and the mission icons doing the work a picture would.
 *
 * HOW THE LEAVES WORK
 * -------------------
 * Faces are laid out in reading order and dealt into leaves two at a time:
 *
 *   leaf 0  front = the cover          back = page 1
 *   leaf 1  front = page 2             back = page 3
 *   ...
 *   leaf 6  front = page 12            back = the inside back cover
 *
 * `turned` is how many leaves have been flipped onto the left, so turned = 2
 * shows leaf 1's back on the left and leaf 2's front on the right: one spread,
 * two facing pages, exactly as the numbering above promises.
 *
 * The faces all stay in the DOM in reading order, so a screen reader hears
 * the cover and then pages 1 to 12 straight through, in the right order,
 * without having to operate anything. Nothing is aria-hidden, because nothing
 * here is decorative or duplicated, and no face contains a link, so there is
 * nothing for a keyboard to get caught on behind a turned page.
 *
 * AboutPageSwitch decides whether this renders at all: under
 * prefers-reduced-motion, on a narrow screen and on the server, the scrolling
 * AboutExperience shows instead. The book is a way of presenting the content,
 * never the only way to reach it.
 */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "@/components/SiteImage";
import { ContentIcon } from "@/components/ContentIcon";
import { ABOUT, LEADERSHIP_BEATS } from "@/lib/about-content";
import "./about-book.css";

/**
 * Photographs, by the job they do on the page rather than by what is in them.
 * URLs are the published ones from lib/site-image-urls.json.
 */
const PHOTO = {
  /* The cover is the church, not its pastors. A centred composition, because
   * a cover is a portrait crop of a landscape frame and a group spread across
   * the width would lose its ends. */
  cover:
    "https://images.kharis.org/site-images/main/4ac6c245a7e4d9c2/hero/impartation-celebration.jpg",
  grace: "https://images.kharis.org/site-images/main/16b531253b8a325e/grace-filled-prayer.jpg",
  bible: "https://images.kharis.org/site-images/main/b65991e38ead9ab1/biblical-open-bible.jpg",
  mission: "https://images.kharis.org/site-images/main/11577f5e512c33cd/about-mission-outreach.jpg",
  vision: "https://images.kharis.org/site-images/main/c7e0b460a01f93eb/about-vision-team-2048.jpg",
  /* pastors-david-awo-3 was here and could not work. In that frame Pastor Awo
   * is against the left edge and Pastor David against the right, and a page
   * is a portrait crop of a landscape photograph: it keeps the middle half
   * and loses whatever is at the sides, so the plate showed the people
   * between them and neither of its subjects. This frame has the two of them
   * centre, turned towards each other, which is also the better picture for
   * a page about a life together. */
  together:
    "https://images.kharis.org/site-images/main/939d8adec4ef06d9/leadership/pastors-david-awo-1.jpg",
} as const;

type Face = {
  /** Shown in the running head. The cover and the endpaper have none. */
  title?: string;
  /** Printed page number. The cover, the plates and the endpaper carry none. */
  folio?: number;
  /** Set on a page whose type should sit in the middle of the leaf. */
  centre?: boolean;
  render: () => React.ReactNode;
};

const BELIEFS_LEFT = ABOUT.faith.slice(0, 4);
const BELIEFS_RIGHT = ABOUT.faith.slice(4);
const VISION_LEFT = ABOUT.vision.points.slice(0, 4);
const VISION_RIGHT = ABOUT.vision.points.slice(4);

/** 1 becomes "01". Numbering a list is half of what stops it reading as a wall. */
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * A photograph that fills its page, edge to edge.
 *
 * `position` matters more here than anywhere else on the site. A page is a
 * portrait crop of a landscape photograph, so it keeps only the middle half
 * of the frame; anything the picture is actually about has to be inside that
 * half, or moved into it.
 */
function Plate({ src, alt, position }: { src: string; alt: string; position?: string }) {
  return (
    <figure className="about-book__plate">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="40vw"
        className="object-cover"
        style={position ? { objectPosition: position } : undefined}
      />
    </figure>
  );
}

/**
 * An invisible copy of the opening block on the facing page, so a list that
 * carries on across the gutter starts level with the one it continues: 05
 * sits on the same line as 01 rather than riding up where the heading is not.
 *
 * It is the real elements with the real text, because that is the only way to
 * reserve exactly the height the facing page spends, at any width and however
 * the words happen to wrap. They are paragraphs rather than headings so the
 * outline gains nothing to repeat, and visibility: hidden keeps the space
 * while dropping them out of the accessibility tree.
 */
function Ghost({ children }: { children: React.ReactNode }) {
  return (
    <div className="about-book__ghost" aria-hidden="true">
      {children}
    </div>
  );
}

/** A photograph set into a page of type, as a band across the measure. */
function Inset({ src, alt }: { src: string; alt: string }) {
  return (
    <figure className="about-book__inset">
      <Image src={src} alt={alt} fill sizes="34vw" className="object-cover" />
    </figure>
  );
}

function Statement({
  items,
  from,
}: {
  items: typeof BELIEFS_LEFT;
  /** Where this page's numbering carries on from. */
  from: number;
}) {
  return (
    <dl className="about-book__faith">
      {items.map((item, i) => (
        <div key={item.title}>
          <dt>
            <span className="about-book__num" aria-hidden="true">
              {pad(from + i)}
            </span>
            {item.title}
          </dt>
          <dd>{item.body}</dd>
        </div>
      ))}
    </dl>
  );
}

function Pastor({ pastor }: { pastor: (typeof ABOUT.leadership.pastors)[number] }) {
  return (
    <>
      <figure className="about-book__portrait">
        <Image src={pastor.image} alt={pastor.name} fill sizes="34vw" className="object-cover" />
      </figure>
      <p className="about-book__role">{pastor.role}</p>
      <h3 className="about-book__title about-book__title--sm">{pastor.name}</h3>
      <p className="about-book__focus">{pastor.focus}</p>
      <p className="about-book__body">{pastor.blurb}</p>
    </>
  );
}

/** Reading order, cover first. Dealt into leaves two at a time. */
const FACES: Face[] = [
  {
    render: () => (
      <div className="about-book__cover">
        <Image
          src={PHOTO.cover}
          alt=""
          aria-hidden="true"
          fill
          sizes="40vw"
          preload
          className="about-book__cover-photo object-cover"
        />
        <div className="about-book__cover-ink">
          <p className="about-book__cover-word">{ABOUT.brandWord}</p>
          <h2 className="about-book__cover-title">Who we are.</h2>
          <p className="about-book__cover-tag">{ABOUT.tagline}</p>
        </div>
      </div>
    ),
  },

  /* 1 and 2: a plate facing the two words it stands for. */
  {
    title: "What Kharis means",
    render: () => (
      <Plate
        src={PHOTO.grace}
        alt="A row of people standing in prayer during a service, hands open"
      />
    ),
  },
  {
    title: "What Kharis means",
    folio: 2,
    centre: true,
    render: () => (
      <>
        {/* The spread's heading lives in the running head visually, so the
            outline gets it here rather than losing a level. */}
        <h3 className="sr-only">What Kharis means</h3>
        <div className="about-book__greek">
          <p className="about-book__label">{ABOUT.brandWord}</p>
          <p className="about-book__word">{ABOUT.greek.word}</p>
          <p className="about-book__meaning">{ABOUT.greek.meaning}</p>
        </div>
        <div className="about-book__greek">
          <p className="about-book__label">{ABOUT.ministriesWord}</p>
          <p className="about-book__word">{ABOUT.ministriesGreek.word}</p>
          <p className="about-book__meaning">{ABOUT.ministriesGreek.meaning}</p>
        </div>
      </>
    ),
  },

  /* 3 and 4: the statement of faith, numbered straight through the spread. */
  {
    title: "What we believe",
    folio: 3,
    render: () => (
      <>
        <h3 className="about-book__title">What we believe</h3>
        <Statement items={BELIEFS_LEFT} from={1} />
        <Inset src={PHOTO.bible} alt="An open Bible held up in both hands during a service" />
      </>
    ),
  },
  {
    title: "What we believe",
    folio: 4,
    render: () => (
      <>
        <Ghost>
          <p className="about-book__title">What we believe</p>
        </Ghost>
        <Statement items={BELIEFS_RIGHT} from={5} />
      </>
    ),
  },

  /* 5 and 6: the mission, and the four things it is carried out by. */
  {
    title: "Our mission",
    folio: 5,
    render: () => (
      <>
        <h3 className="about-book__title">{ABOUT.mission.title}</h3>
        <p className="about-book__lead about-book__lead--drop">{ABOUT.mission.lead}</p>
        <p className="about-book__body">{ABOUT.mission.deepen}</p>
        <Inset
          src={PHOTO.mission}
          alt="A Kharis member greeting two people sitting on a bench during a community outreach"
        />
      </>
    ),
  },
  {
    title: "Our mission",
    folio: 6,
    render: () => (
      <ul className="about-book__pillars">
        {ABOUT.mission.how.map((item) => (
          <li key={item.title}>
            <span className="about-book__pillar-icon" aria-hidden="true">
              <ContentIcon name={item.icon} className="h-5 w-5" />
            </span>
            <div>
              <h4>{item.title}</h4>
              <p>{item.body}</p>
              <p className="about-book__verse">{item.verse}</p>
            </div>
          </li>
        ))}
      </ul>
    ),
  },

  /* 7 and 8: the vision, its eight marks numbered across the spread. */
  {
    title: "Our vision",
    folio: 7,
    render: () => (
      <>
        <h3 className="about-book__title">{ABOUT.vision.title}</h3>
        <p className="about-book__lead">{ABOUT.vision.lead}</p>
        <p className="about-book__intro">{ABOUT.vision.intro}</p>
        <ol className="about-book__points">
          {VISION_LEFT.map((point, i) => (
            <li key={point}>
              <span className="about-book__num" aria-hidden="true">
                {pad(i + 1)}
              </span>
              {point}
            </li>
          ))}
        </ol>
      </>
    ),
  },
  {
    title: "Our vision",
    folio: 8,
    render: () => (
      <>
        <Ghost>
          <p className="about-book__title">{ABOUT.vision.title}</p>
          <p className="about-book__lead">{ABOUT.vision.lead}</p>
          <p className="about-book__intro">{ABOUT.vision.intro}</p>
        </Ghost>
        <ol className="about-book__points">
          {VISION_RIGHT.map((point, i) => (
            <li key={point}>
              <span className="about-book__num" aria-hidden="true">
                {pad(i + 5)}
              </span>
              {point}
            </li>
          ))}
        </ol>
        <Inset
          src={PHOTO.vision}
          alt="The Kharis church family gathered outside after a service, cheering"
        />
      </>
    ),
  },

  /* 9 and 10: a spotlight each, the two of them facing one another. */
  {
    title: "Our leadership",
    folio: 9,
    render: () => <Pastor pastor={ABOUT.leadership.pastors[0]} />,
  },
  {
    title: "Our leadership",
    folio: 10,
    render: () => <Pastor pastor={ABOUT.leadership.pastors[1]} />,
  },

  /* 11 and 12: the journey they have made together. */
  {
    title: "Their story",
    render: () => (
      <Plate
        src={PHOTO.together}
        alt="Pastors David and Awo Antwi sitting together, turned towards each other, laughing"
        /* Off centre to the left, which is what brings Pastor Awo inside the
         * half of the frame a page keeps. */
        position="40% center"
      />
    ),
  },
  {
    title: "Their story",
    folio: 12,
    render: () => (
      <>
        <h3 className="about-book__title">Their story</h3>
        <div className="about-book__beats">
          {LEADERSHIP_BEATS.map((beat) => (
            <div key={beat.title}>
              <h4>{beat.title}</h4>
              <p>{beat.body}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },

  {
    render: () => (
      <div className="about-book__endpaper">
        <p className="about-book__cover-word">{ABOUT.brandWord}</p>
      </div>
    ),
  },
];

/** Leaves, each one a front and a back. */
const LEAVES = Array.from({ length: Math.ceil(FACES.length / 2) }, (_, i) => ({
  front: FACES[i * 2],
  back: FACES[i * 2 + 1],
}));

/**
 * The last turn that still shows two facing pages. Turning every leaf would
 * land on the endpaper, which is a blank nobody needs to visit.
 */
const MAX_TURN = LEAVES.length - 1;

/** What the contents jumps to. Each entry is a number of leaves turned. */
const CONTENTS = [
  { turn: 0, label: "Cover" },
  { turn: 1, label: "What Kharis means" },
  { turn: 2, label: "What we believe" },
  { turn: 3, label: "Our mission" },
  { turn: 4, label: "Our vision" },
  { turn: 5, label: "Our leadership" },
  { turn: 6, label: "Their story" },
];

export function AboutBook() {
  const [turned, setTurned] = useState(0);
  /** The leaf in flight, lifted above the stack so it does not clip through. */
  const [flipping, setFlipping] = useState<number | null>(null);
  const bookRef = useRef<HTMLElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const settle = useRef<number | undefined>(undefined);

  const go = useCallback(
    (to: number) => {
      const next = Math.max(0, Math.min(MAX_TURN, to));
      if (next === turned) return;
      /* The leaf that moves is the lowest one changing state: going forward
       * that is the one being turned, going back the one being turned back.
       * Both of these are plain calls rather than work inside a setTurned
       * updater, because an updater has to be pure: React is free to run it
       * twice, which would start two timers and lift the wrong leaf. */
      setFlipping(next > turned ? next - 1 : next);
      setTurned(next);
      window.clearTimeout(settle.current);
      settle.current = window.setTimeout(() => setFlipping(null), 950);
    },
    [turned],
  );

  useEffect(() => () => window.clearTimeout(settle.current), []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      /* Anywhere in the book, not just the sheet. Scoping this to the stage
       * meant that using the contents moved focus to a chip, which sits
       * outside it, and the arrow keys went dead while End scrolled the
       * window instead of jumping to the last page. */
      if (!bookRef.current?.contains(document.activeElement)) return;
      if (event.key === "ArrowRight") go(turned + 1);
      else if (event.key === "ArrowLeft") go(turned - 1);
      else if (event.key === "Home") go(0);
      else if (event.key === "End") go(MAX_TURN);
      else return;
      event.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, turned]);

  /* The parallax tilt, which is the part of the Framer component that makes
   * it feel like an object rather than a picture. Written straight to CSS
   * custom properties inside a frame callback so a pointer move never queues
   * a React render. Touch is excluded: there is no hover to tilt with, and on
   * a phone the scrolling page shows instead anyway. */
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    let frame = 0;
    let tiltX = 0;
    let tiltY = 0;

    const paint = () => {
      frame = 0;
      scene.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
      scene.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
    };
    const queue = () => {
      if (!frame) frame = window.requestAnimationFrame(paint);
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = scene.getBoundingClientRect();
      tiltY = ((event.clientX - rect.left) / rect.width - 0.5) * 6;
      tiltX = (0.5 - (event.clientY - rect.top) / rect.height) * 4;
      queue();
    };
    const onLeave = () => {
      tiltX = 0;
      tiltY = 0;
      queue();
    };

    scene.addEventListener("pointermove", onMove);
    scene.addEventListener("pointerleave", onLeave);
    return () => {
      scene.removeEventListener("pointermove", onMove);
      scene.removeEventListener("pointerleave", onLeave);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const spread = CONTENTS[turned];

  return (
    <section className="about-book" aria-label="Kharis: who we are" ref={bookRef}>
      <div className="about-book__scene" ref={sceneRef}>
        <div
          className={`about-book__book${turned === 0 ? " is-shut" : ""}`}
          role="group"
          aria-roledescription="book"
          aria-label={
            turned === 0 ? "Front cover" : `${spread.label}, spread ${turned} of ${MAX_TURN}`
          }
        >
          {/* The spine. Only on the shut book, where it is the edge you see;
              once the book is open the gutter does that job. */}
          {turned === 0 ? <div className="about-book__spine" aria-hidden="true" /> : null}

          {/* The block of paper under the leaves, so a half is never a hole. */}
          <div className="about-book__base about-book__base--left" aria-hidden="true" />
          <div className="about-book__base about-book__base--right" aria-hidden="true" />

          {LEAVES.map((leaf, i) => {
            const isTurned = i < turned;
            /* Unturned leaves stack with the cover on top; turned ones stack
               the other way, so the most recently turned is uppermost. The
               leaf in flight goes above both piles. */
            const z = flipping === i ? 60 : isTurned ? 10 + i : 10 + (LEAVES.length - i);
            return (
              <div
                key={i}
                className={`about-book__leaf${isTurned ? " is-turned" : ""}`}
                style={{ zIndex: z }}
              >
                <div className="about-book__face about-book__face--front">
                  {leaf.front.title ? (
                    <p className="about-book__runner">{leaf.front.title}</p>
                  ) : null}
                  <div className={`about-book__col${leaf.front.centre ? " is-centred" : ""}`}>
                    {leaf.front.render()}
                  </div>
                  {leaf.front.folio ? (
                    <p className="about-book__folio">{leaf.front.folio}</p>
                  ) : null}
                </div>
                {leaf.back ? (
                  <div className="about-book__face about-book__face--back">
                    {leaf.back.title ? (
                      <p className="about-book__runner">{leaf.back.title}</p>
                    ) : null}
                    <div className={`about-book__col${leaf.back.centre ? " is-centred" : ""}`}>
                      {leaf.back.render()}
                    </div>
                    {leaf.back.folio ? (
                      <p className="about-book__folio">{leaf.back.folio}</p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}

          {/* The shut cover is the one thing you can click on the book itself.
              Turning pages by clicking the paper would fight text selection,
              so past the cover it is the arrows, the keys or the contents. */}
          {turned === 0 ? (
            <button
              type="button"
              className="about-book__open"
              onClick={() => go(1)}
              style={{ zIndex: 40 }}
            >
              <span>Open the book</span>
            </button>
          ) : null}
        </div>

        <button
          type="button"
          className="about-book__turn about-book__turn--prev"
          onClick={() => go(turned - 1)}
          disabled={turned === 0}
          aria-label="Previous pages"
        >
          &larr;
        </button>
        <button
          type="button"
          className="about-book__turn about-book__turn--next"
          onClick={() => go(turned + 1)}
          disabled={turned === MAX_TURN}
          aria-label="Next pages"
        >
          &rarr;
        </button>
      </div>

      {/* A visible contents. A book with no sense of its length is a page turn
          with no end in sight, and it doubles as the way to reach a spread
          directly by keyboard. */}
      <div className="about-book__contents" role="tablist" aria-label="Contents">
        {CONTENTS.map((item) => (
          <button
            key={item.turn}
            type="button"
            role="tab"
            aria-selected={item.turn === turned}
            className={`about-book__chip${item.turn === turned ? " is-on" : ""}`}
            onClick={() => go(item.turn)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </section>
  );
}
