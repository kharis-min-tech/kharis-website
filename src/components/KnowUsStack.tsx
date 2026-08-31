"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Icon } from "@/components/Icon";
import { Reveal, RevealItem, RevealStagger } from "@/components/Reveal";

type Card = {
  title: string;
  label: string;
  href: string;
  image: string;
  info: string;
  icon: "book" | "location" | "groups" | "heart" | "home";
  size: "portrait" | "normal" | "tall";
  position?: string;
};

const cards: Card[] = [
  {
    title: "About Us",
    label: "Who we are",
    href: "/about",
    image: "/images/community.jpg",
    info: "Our mandate is to bring Christ to people everywhere.",
    icon: "book",
    size: "portrait",
    position: "object-left object-top",
  },
  {
    title: "Locations",
    label: "Visit Sunday",
    href: "#near-you",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=900&q=80",
    info: "Find a Kharis branch near you this Sunday.",
    icon: "location",
    size: "normal",
    position: "object-center",
  },
  {
    title: "Young Adults",
    label: "KP2",
    href: "https://kharis.org/kp2/",
    image: "/images/young-adults.jpg",
    info: "Next generation faith, community and purpose.",
    icon: "groups",
    size: "normal",
    position: "object-[center_28%]",
  },
  {
    title: "Become a Believer",
    label: "Next step",
    href: "/life/baptism",
    image:
      "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=900&q=80",
    info: "Take your next step with Jesus. Start with baptism at Kharis Life.",
    icon: "heart",
    size: "normal",
    position: "object-center",
  },
  {
    title: "Get Involved",
    label: "Serve with us",
    href: "/life/departments",
    image: "/images/serve-with-us.jpg",
    info: "Join a team and grow with the Kharis family.",
    icon: "home",
    size: "tall",
    position: "object-top",
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
    <section
      id="know"
      className="bg-bg-soft px-5 pb-5 pt-8 md:px-8 md:pb-5 md:pt-10"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal variant="blur" className="mb-5 max-w-2xl md:mb-6">
          <p className="eyebrow">Family</p>
          <h2 className="section-title mt-2">
            Get to Know <span className="kharis-word">Kharis</span>
          </h2>
          <p className="mt-4 text-lg text-muted">
            Everything you need, one tap away.
          </p>
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
                  className={`know-card group relative block overflow-hidden rounded-[1.75rem] shadow-[var(--shadow-lift)] ${layout.height}`}
                >
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    unoptimized={card.image.startsWith("/images/")}
                    className={`object-cover transition duration-700 group-hover:scale-[1.03] ${card.position ?? "object-center"}`}
                    sizes={layout.sizes}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm">
                      <Icon name={card.icon} className="h-4 w-4" />
                    </div>
                    <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-white/90 drop-shadow">
                      {card.label}
                    </p>
                    <h3 className="mt-2 font-[family-name:var(--font-display)] text-[1.75rem] font-extrabold leading-tight text-white drop-shadow-md md:text-[2rem]">
                      {card.title}
                    </h3>
                    <p className="mt-3 max-h-20 text-sm leading-relaxed text-white opacity-95 drop-shadow transition-all duration-500 group-hover:max-h-28 group-hover:opacity-100 md:max-h-0 md:opacity-0 md:group-hover:max-h-28 md:group-hover:opacity-100">
                      {card.info}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-orange drop-shadow">
                      Explore <Icon name="arrow" className="h-3.5 w-3.5" />
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
