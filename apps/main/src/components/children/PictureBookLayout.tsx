import type { ChildrenGroup, ChildrenLayout } from "@/data/children-groups";
import { ConfirmBadge } from "./ConfirmBadge";
import { PlaceholderImage } from "./PlaceholderImage";

type PictureBook = Extract<ChildrenLayout, { kind: "picture-book" }>;

/** Kinder: taped polaroids and a sticker beside the copy, with the morning's routine underneath. */
export function PictureBookLayout({ group, layout }: { group: ChildrenGroup; layout: PictureBook }) {
  return (
    <>
      <div className="kids-group__body kids-book">
        <div className="kids-book__photos">
          {group.photos.map((slot) => (
            <figure key={slot.id} className="kids-polaroid">
              <PlaceholderImage slot={slot} />
              {slot.caption ? <figcaption>{slot.caption}</figcaption> : null}
            </figure>
          ))}
          <p className="kids-sticker">{layout.sticker}</p>
        </div>

        <div className="kids-group__copy">
          <h3>{group.headline}</h3>
          <p>{group.body}</p>
        </div>
      </div>

      <div className="kids-routine">
        <h3>{layout.routine.title}</h3>
        <ol className="kids-routine__steps">
          {layout.routine.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <ConfirmBadge what={layout.routine.confirm} />
      </div>
    </>
  );
}
