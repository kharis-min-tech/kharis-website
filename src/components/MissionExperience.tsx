"use client";

import { AboutChapter, ChapterPanel } from "@/components/AboutChapter";
import { ContentIcon } from "@/components/ContentIcon";
import { RevealItem, RevealStagger } from "@/components/Reveal";
import { ABOUT } from "@/lib/about-content";

export function MissionExperience() {
  const { mission } = ABOUT;

  return (
    <AboutChapter
      eyebrow="Who we are"
      title="Our Mission"
      subtitle="A friendly, caring family church influencing society with God’s love."
      image="/images/serve-with-us.jpg"
      imagePosition="object-[center_22%]"
      next={{ href: "/about/vision", label: "Our Vision →" }}
    >
      <ChapterPanel>
        <p className="about-chapter__lead">{mission.lead}</p>
        <p className="about-chapter__copy">{mission.deepen}</p>
      </ChapterPanel>

      <h2 className="about-chapter__h2">How we fulfil our mission</h2>
      <RevealStagger className="about-chapter__grid3" stagger={0.08}>
        {mission.how.map((pillar) => (
          <RevealItem key={pillar.title} className="about-chapter__card">
            <span className="about-chapter__icon">
              <ContentIcon name={pillar.icon} className="h-7 w-7" />
            </span>
            <h3>{pillar.title}</h3>
            <p>{pillar.body}</p>
            <p className="about-chapter__verse">{pillar.verse}</p>
            <blockquote>{pillar.quote}</blockquote>
          </RevealItem>
        ))}
      </RevealStagger>

      <h2 className="about-chapter__h2">Our Mandate</h2>
      <RevealStagger className="about-chapter__grid3" stagger={0.08}>
        {mission.mandate.map((m) => (
          <RevealItem key={m.ref} className="about-chapter__card about-chapter__card--soft">
            <p className="about-chapter__verse">{m.ref}</p>
            <p>{m.text}</p>
          </RevealItem>
        ))}
      </RevealStagger>
    </AboutChapter>
  );
}
