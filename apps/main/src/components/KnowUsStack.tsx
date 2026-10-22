"use client";

import Image from "@/components/SiteImage";
import { Reveal, RevealItem, RevealStagger } from "@/components/Reveal";
import { KP2_URL } from "@/lib/kp2";

type Card = {
  title: string;
  href: string;
  image: string;
  alt: string;
  blurb?: string;
  featured?: boolean;
  position?: string;
  /** "contain" shows the whole photo over a blurred copy of itself, so wide group shots aren't cropped. */
  fit?: "contain";
};

const cards: Card[] = [
  {
    title: "About Us",
    href: "/about",
    image: "https://images.kharis.org/site-images/main/ca1bcf57dbf80629/community.jpg",
    alt: "Pastor David preaching at a Kharis service",
    blurb: "Our mandate is to bring Christ to people everywhere.",
    featured: true,
    position: "object-left object-top",
  },
  {
    title: "Locations",
    href: "/locations",
    image: "https://images.kharis.org/site-images/main/2fd55a6761cfb656/locations-worship-team.jpg",
    alt: "The Kharis worship team leading praise on Sunday",
    position: "object-[center_30%]",
  },
  {
    title: "Young Adults",
    href: KP2_URL,
    image: "https://images.kharis.org/site-images/main/234c625e119f9e2a/young-adults.jpg",
    alt: "Young adults gathered at Kharis Phase 2",
    position: "object-[center_28%]",
  },
  {
    title: "Become a Believer",
    href: "/life/baptism",
    image: "https://images.kharis.org/site-images/main/395410464d9beb6d/become-a-believer.jpg",
    alt: "New believers celebrating baptism at Kharis",
    fit: "contain",
  },
  {
    title: "Get Involved",
    href: "/life/departments",
    image: "https://images.kharis.org/site-images/main/de005ef42ce5304e/get-involved-sax.jpg",
    alt: "Serving on the music team at Kharis",
    position: "object-[center_14%] sm:object-[center_24%] lg:object-[center_14%]",
  },
];

export function KnowUsStack() {
  return (
    <section
      id="know"
      aria-labelledby="know-kharis-title"
      className="know-section bg-bg-soft px-5 pb-8 pt-8 md:px-8 md:pb-12 md:pt-10"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal variant="blur" className="know-intro mb-6 md:mb-7">
          <div>
            <p className="know-narration">Passionate for God and His Word…</p>
            <h2 id="know-kharis-title" className="know-title">
              Get to Know <span className="kharis-word">Kharis</span>
            </h2>
          </div>
          <p className="know-lede">Everything you need, one tap away.</p>
        </Reveal>

        <div className="know-page">
          <RevealStagger className="know-grid" stagger={0.08}>
            {cards.map((card) => {
              const sizes = card.featured
                ? "(max-width: 1024px) 100vw, 40vw"
                : "(max-width: 1024px) 100vw, 30vw";

              return (
                <RevealItem
                  key={card.title}
                  variant="scale"
                  distance={28}
                  className={`know-cell ${card.featured ? "know-cell--featured know-about" : ""}`.trim()}
                >
                  <a href={card.href} className="know-card group">
                    <span className="know-card__media">
                      {card.fit === "contain" ? (
                        <Image
                          src={card.image}
                          alt=""
                          aria-hidden
                          fill
                          unoptimized={card.image.startsWith("/images/")}
                          className="scale-110 object-cover blur-2xl brightness-75"
                          sizes={sizes}
                        />
                      ) : null}
                      <Image
                        src={card.image}
                        alt={card.alt}
                        fill
                        unoptimized={card.image.startsWith("/images/")}
                        className={`know-card__img ${card.fit === "contain" ? "object-contain" : "object-cover"} ${card.position ?? "object-center"}`}
                        sizes={sizes}
                      />
                    </span>

                    <span className="know-card__safe">
                      <span className="know-card__copy">
                        <span className="know-card__name">{card.title}</span>
                        {card.blurb ? <span className="know-card__blurb">{card.blurb}</span> : null}
                        <span className="know-card__go">
                          Explore
                          <svg
                            viewBox="0 0 20 20"
                            fill="none"
                            aria-hidden="true"
                            className="know-card__go-icon"
                          >
                            <path
                              d="M6 14L14 6M14 6H7.5M14 6V12.5"
                              stroke="currentColor"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </span>
                    </span>
                  </a>
                </RevealItem>
              );
            })}
          </RevealStagger>
        </div>
      </div>
    </section>
  );
}
