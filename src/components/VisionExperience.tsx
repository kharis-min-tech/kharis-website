"use client";

import { AboutChapter, ChapterPanel } from "@/components/AboutChapter";
import { RevealItem, RevealStagger } from "@/components/Reveal";
import { ABOUT } from "@/lib/about-content";

export function VisionExperience() {
  const { vision } = ABOUT;

  return (
    <AboutChapter
      eyebrow="Where we are going"
      title="Our Vision"
      subtitle={vision.lead}
      image="/images/vision-campaign.jpg"
      imagePosition="object-center"
      next={{ href: "/about/leadership", label: "Our Leadership →" }}
    >
      <ChapterPanel>
        <p className="about-chapter__lead">{vision.intro}</p>
      </ChapterPanel>

      <RevealStagger className="about-chapter__grid3" stagger={0.06}>
        {vision.points.map((point, i) => (
          <RevealItem key={point} className="about-chapter__card">
            <span className="about-chapter__num">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p>{point}</p>
          </RevealItem>
        ))}
      </RevealStagger>
    </AboutChapter>
  );
}
