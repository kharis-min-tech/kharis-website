"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Icon } from "@/components/Icon";
import { Reveal, RevealItem, RevealStagger } from "@/components/Reveal";
import { KP2_URL } from "@/lib/kp2";

type Card = {
  title: string;
  label: string;
  href: string;
  image: string;
  info: string;
  cta: string;
  size: "portrait" | "normal" | "tall";
  position?: string;
  /** "contain" shows the whole photo over a blurred copy of itself, so wide group shots aren't cropped. */
  fit?: "contain";
};

const cards: Card[] = [
  {
    title: "About Us",
    label: "Who we are",
    href: "/about",
    image: "https://images.kharis.org/site-images/main/ca1bcf57dbf80629/community.jpg",
    info: "Our mandate is to bring Christ to people everywhere.",
    cta: "Read our story",
    size: "portrait",
    position: "object-left object-top",
  },
  {
    title: "Locations",
    label: "Visit Sunday",
    href: "/locations",
    image: "https://images.kharis.org/site-images/main/2fd55a6761cfb656/locations-worship-team.jpg",
    info: "Find a Kharis branch near you this Sunday.",
    cta: "Find your branch",
    size: "normal",
    position: "object-[center_30%]",
  },
  {
    title: "Young Adults",
    label: "KP2",
    href: KP2_URL,
    image: "https://images.kharis.org/site-images/main/234c625e119f9e2a/young-adults.jpg",
    info: "Next generation faith, community and purpose.",
    cta: "Visit KP2",
    size: "normal",
    position: "object-[center_28%]",
  },
  {
    title: "Become a Believer",
    label: "Next step",
    href: "/life/baptism",
    image: "https://images.kharis.org/site-images/main/395410464d9beb6d/become-a-believer.jpg",
    info: "Take your next step with Jesus. Start with baptism at Kharis Life.",
    cta: "Take the step",
    size: "normal",
    fit: "contain",
  },
  {
    title: "Get Involved",
    label: "Serve with us",
    href: "/life/departments",
    image: "https://images.kharis.org/site-images/main/de005ef42ce5304e/get-involved-sax.jpg",
    info: "Join a team and grow with the Kharis family.",
    cta: "Join a team",
    size: "tall",
    position: "object-[center_14%] sm:object-[center_24%] lg:object-[center_14%]",
  },
];

function cardLayout(size: Card["size"]) {
  switch (size) {
    case "portrait":
      return {
        wrap: "know-about lg:row-span-2 lg:h-full",
        height: "min-h-[500px] h-full",
        sizes: "(max-width: 1024px) 100vw, 40vw",
      };
    case "tall":
      return {
        wrap: "h-full sm:col-span-2 lg:col-span-1",
        height: "h-full min-h-[280px]",
        sizes: "(max-width: 1024px) 100vw, 30vw",
      };
    default:
      return {
        wrap: "h-full",
        height: "h-full min-h-[280px]",
        sizes: "(max-width: 1024px) 100vw, 30vw",
      };
  }
}

export function KnowUsStack() {
  return (
    <section id="know" className="bg-bg-soft px-5 pb-5 pt-8 md:px-8 md:pb-5 md:pt-10">
      <div className="mx-auto max-w-7xl">
        <Reveal variant="blur" className="mx-auto mb-5 max-w-2xl text-center md:mb-6">
          <p className="eyebrow">Family</p>
          <h2 className="section-title mt-2">
            Get to Know <span className="kharis-word">Kharis</span>
          </h2>
        </Reveal>

        <RevealStagger
          className="know-grid grid grid-cols-1 gap-5 sm:grid-cols-2 lg:auto-rows-[300px]"
          stagger={0.09}
        >
          {cards.map((card) => {
            const layout = cardLayout(card.size);

            return (
              <RevealItem
                key={card.title}
                variant="scale"
                distance={36}
                className={`${layout.wrap} h-full`.trim()}
              >
                <motion.a
                  href={card.href}
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className={`know-card group relative block overflow-hidden ${layout.height}`}
                >
                  {card.fit === "contain" ? (
                    <Image
                      src={card.image}
                      alt=""
                      aria-hidden
                      fill
                      unoptimized={card.image.startsWith("/images/")}
                      className="scale-110 object-cover blur-2xl brightness-75"
                      sizes={layout.sizes}
                    />
                  ) : null}
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    unoptimized={card.image.startsWith("/images/")}
                    className={`${card.fit === "contain" ? "object-contain" : "object-cover"} transition duration-700 group-hover:scale-[1.03] ${card.position ?? "object-center"}`}
                    sizes={layout.sizes}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-6 text-center md:p-7">
                    <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-white/90 drop-shadow">
                      {card.label}
                    </p>
                    <h3 className="mt-2 font-[family-name:var(--font-display)] text-[1.75rem] font-extrabold leading-tight text-white drop-shadow-md md:text-[2rem]">
                      {card.title}
                    </h3>
                    <p className="mt-3 max-h-20 text-sm leading-relaxed text-white opacity-95 drop-shadow transition-all duration-500 group-hover:max-h-28 group-hover:opacity-100 md:max-h-0 md:opacity-0 md:group-hover:max-h-28 md:group-hover:opacity-100">
                      {card.info}
                    </p>
                    <span className="know-card__cta">
                      {card.cta} <Icon name="arrow" className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </motion.a>
              </RevealItem>
            );
          })}
        </RevealStagger>
      </div>
    </section>
  );
}
