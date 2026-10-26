"use client";

import Image from "@/components/SiteImage";
import { motion } from "framer-motion";
import { Icon } from "@/components/Icon";
import { Reveal, RevealItem, RevealStagger, type RevealVariant } from "@/components/Reveal";
import { KP2_URL } from "@/lib/kp2";

type Card = {
  title: string;
  label: string;
  href: string;
  image: string;
  info: string;
  cta: string;
  position?: string;
  /** Entrance animation: the outer columns slide in from the sides, the middle two rise up, so the row converges left to right. */
  reveal: RevealVariant;
  /** "contain" shows the whole photo over a blurred copy of itself, so wide group shots aren't cropped. */
  fit?: "contain";
};

const cards: Card[] = [
  {
    title: "About Us",
    label: "Who we are",
    href: "/about",
    image: "https://images.kharis.org/site-images/main/529646bbc41f3bc3/community.jpg",
    info: "Our mandate is to bring Christ to people everywhere.",
    cta: "Read our story",
    position: "object-[60%_center]",
    reveal: "left",
  },
  {
    title: "Young Adults",
    label: "Kharis Phase 2",
    href: KP2_URL,
    image: "https://images.kharis.org/site-images/main/012b86affad979dd/home/kp2-community.webp",
    info: "Next generation faith, community and purpose.",
    cta: "Visit KP2",
    position: "object-[45%_center]",
    reveal: "up",
  },
  {
    title: "Become a Believer",
    label: "Next step",
    href: "/life/baptism",
    image: "https://images.kharis.org/site-images/main/13c9297f7be9a14a/baptism-water.jpg",
    info: "Take your next step with Jesus. Start with baptism at Kharis.",
    cta: "Take the step",
    position: "object-[46%_center]",
    reveal: "up",
  },
  {
    title: "Get Involved",
    label: "Serve God with us",
    href: "/life/departments",
    image: "https://images.kharis.org/site-images/main/de005ef42ce5304e/get-involved-sax.jpg",
    info: "Join a team and grow with the Kharis family.",
    cta: "Join a team",
    position: "object-[center_12%]",
    reveal: "right",
  },
];

const IMAGE_SIZES = "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw";

export function KnowUsStack() {
  return (
    <section
      id="know"
      className="overflow-x-clip bg-bg-soft px-4 pb-5 pt-8 md:px-6 md:pb-5 md:pt-10"
    >
      <div className="mx-auto max-w-[88rem]">
        <Reveal variant="blur" className="mx-auto mb-5 max-w-2xl text-center md:mb-6">
          <p className="eyebrow">Family</p>
          <h2 className="section-title mt-2">
            Get to Know <span className="kharis-word">Kharis</span>
          </h2>
        </Reveal>

        <RevealStagger className="know-grid grid grid-cols-1 gap-4 sm:grid-cols-2" stagger={0.14}>
          {cards.map((card) => (
            <RevealItem key={card.title} variant={card.reveal} distance={64} className="h-full">
              <motion.a
                href={card.href}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="know-card group relative block aspect-[4/5] overflow-hidden"
              >
                {card.fit === "contain" ? (
                  <Image
                    src={card.image}
                    alt=""
                    aria-hidden
                    fill
                    unoptimized={card.image.startsWith("/images/")}
                    className="scale-110 object-cover blur-2xl brightness-75"
                    sizes={IMAGE_SIZES}
                  />
                ) : null}
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  unoptimized={card.image.startsWith("/images/")}
                  className={`${card.fit === "contain" ? "object-contain" : "object-cover"} transition duration-700 group-hover:scale-[1.03] ${card.position ?? "object-center"}`}
                  sizes={IMAGE_SIZES}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-6 text-center md:p-7">
                  <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-white/90 drop-shadow">
                    {card.label}
                  </p>
                  <h3 className="mt-2 font-[family-name:var(--font-display)] text-[1.75rem] font-extrabold leading-tight text-white drop-shadow-md md:text-[2rem] lg:text-[1.6rem]">
                    {card.title}
                  </h3>
                  <p className="mt-3 max-h-20 text-sm leading-relaxed text-white opacity-95 drop-shadow transition-all duration-500 group-hover:max-h-28 group-hover:opacity-100 md:max-h-0 md:opacity-0 md:group-hover:max-h-28 md:group-hover:opacity-100">
                    {card.info}
                  </p>
                  <span className="know-card__cta">
                    {card.cta} <Icon name="arrow" className="h-4 w-4" />
                  </span>
                </div>
              </motion.a>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
