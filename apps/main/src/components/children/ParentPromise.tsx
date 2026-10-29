const LINES = [
  "Bible teaching that grows with your child.",
  "Worship they can join, with energy and joy.",
  "Friendships that grow with your child.",
  "We partner with you to raise the next generation in the ways of the Lord.",
] as const;

/** Four reassurances from the existing kids copy. */
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
      </div>
    </section>
  );
}
