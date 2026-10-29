import Link from "next/link";
import { CHILDREN_GROUPS, CHILDREN_VISION_LINE } from "@/data/children-groups";
import { AgeNav } from "./AgeNav";
import { ChildrenFaq } from "./ChildrenFaq";
import { ChildrenHero } from "./ChildrenHero";
import { ForParents } from "./ForParents";
import { CHILDREN_FONT_CLASSES } from "./fonts";
import { GroupSection } from "./GroupSection";
import { ParentPromise } from "./ParentPromise";
import "./children-page.css";

export function ChildrenPage() {
  return (
    <div className={`kids-page ${CHILDREN_FONT_CLASSES}`}>
      <ChildrenHero />
      <ParentPromise />

      <p className="kids-vision kids-wrap">{CHILDREN_VISION_LINE}</p>

      {/* The age navigator only sticks while the age groups are on screen. */}
      <div id="age-groups" className="kids-groups" tabIndex={-1}>
        <AgeNav />
        {CHILDREN_GROUPS.map((group) => (
          <GroupSection key={group.id} group={group} />
        ))}
      </div>

      <ChildrenFaq />
      <ForParents />

      <div className="kids-end kids-wrap">
        <Link href="/life" className="life-cta life-cta--quiet">
          Back to Kharis Life
        </Link>
      </div>
    </div>
  );
}
