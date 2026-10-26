import { ConfirmBadge } from "./ConfirmBadge";

const LINES = [
  "Bible teaching that grows with your child.",
  "Worship they can join, with energy and joy.",
  "Friendships that grow with your child.",
  "We partner with you to raise the next generation in the ways of the Lord.",
] as const;

/** Four reassurances from the existing kids copy, then the details still to confirm. */
export function ParentPromise() {
  return (
    <section className="kids-promise" aria-labelledby="kids-promise-title">
      <div className="kids-wrap">
        <h2 id="kids-promise-title">Partnering with parents</h2>
        <ul className="kids-promise__lines">
          {LINES.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <dl className="kids-facts">
          <div>
            <dt>When</dt>
            <dd>
              <ConfirmBadge what="When Kids church meets, and how it lines up with the service." />
            </dd>
          </div>
          <div>
            <dt>Where</dt>
            <dd>
              <ConfirmBadge what="Where families take their child at their branch." />
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
