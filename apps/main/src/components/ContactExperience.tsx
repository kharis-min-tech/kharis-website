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
    </div>
  );
}
