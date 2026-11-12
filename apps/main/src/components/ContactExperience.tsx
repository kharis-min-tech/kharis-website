"use client";

import { useMemo, useState } from "react";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactLetter } from "@/components/contact/ContactLetter";
import { kharisFirst, type ContactLocation } from "@/lib/contact-branches";
import "./contact/contact-page.css";

type Props = {
  locations: ContactLocation[];
};

export function ContactExperience({ locations }: Props) {
  const branches = useMemo(() => kharisFirst(locations), [locations]);
  const [letterBranch, setLetterBranch] = useState("");
  const [focusSignal] = useState(0);

  return (
    <div className="hello-page">
      <ContactHero />
      <ContactLetter
        branches={branches}
        branch={letterBranch}
        onBranchChange={(name) => {
          setLetterBranch(name);
        }}
        focusSignal={focusSignal}
      />
      <section className="hello-close" aria-labelledby="hello-close-title">
        <div className="hello-close__panel">
          <div className="hello-close__content">
            <p className="hello-eyebrow">Between Sundays</p>
            <h2 id="hello-close-title" className="hello-h2">
              Join the revival online
            </h2>
            <p className="hello-close__copy">
              Pastor David&apos;s messages, live services and the latest from the Kharis family,
              wherever you are in the world.
            </p>
            <p className="hello-close__press">
              Press and media: <a href="mailto:media@kharis.org">media@kharis.org</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
