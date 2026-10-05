"use client";

import Image from "next/image";
import Link from "next/link";
import { AboutChapter, ChapterPanel } from "@/components/AboutChapter";
import { Reveal } from "@/components/Reveal";
import { ABOUT } from "@/lib/about-content";

export function LeadershipExperience() {
  const { leadership } = ABOUT;

  return (
    <AboutChapter
      eyebrow="Who leads us"
      title="Our Leadership"
      subtitle="Pastors who founded and set the vision of Kharis Ministries."
      image="/images/young-adults.jpg"
      imagePosition="object-[center_35%]"
      next={{ href: "/messages", label: "Watch messages →" }}
    >
      <div className="about-chapter__leaders">
        <Reveal className="about-chapter__leader-media">
          <Image
            src="/images/community.jpg"
            alt="Kharis leadership and church family"
            fill
            className="object-cover object-[center_18%]"
            sizes="(max-width: 900px) 100vw, 46vw"
          />
        </Reveal>
        <ChapterPanel className="about-chapter__leader-copy">
          <h2 className="about-chapter__h2 about-chapter__h2--flush">
            {leadership.title}
          </h2>
          <p className="about-chapter__copy">{leadership.body}</p>
          <Link href="/messages" className="btn-primary about-chapter__cta">
            Watch messages
          </Link>
        </ChapterPanel>
      </div>

      <Reveal className="about-chapter__panel about-chapter__panel--strip">
        <p>
          Together they founded Kharis Phase 2 for students and young people, with a
          presence on university campuses across the UK.
        </p>
      </Reveal>
    </AboutChapter>
  );
}
