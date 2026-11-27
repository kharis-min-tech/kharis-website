import Link from "next/link";
import { DoveFlight } from "./DoveFlight";
import styles from "./MissingPage.module.css";

const VERSE = "the crooked shall be made straight, and the rough places plain";

export function MissingPage({ phaseTwo = false }: { phaseTwo?: boolean }) {
  const primary = phaseTwo
    ? `kp-depth-button kp-button-purple ${styles.comicAction}`
    : "btn-primary";
  const secondary = phaseTwo
    ? `kp-depth-button kp-button-light ${styles.comicAction}`
    : "btn-secondary";

  return (
    <section
      className={`${styles.page}${phaseTwo ? ` ${styles.comic}` : ""}`}
      aria-labelledby="missing-title"
    >
      <div className={styles.spread}>
        <div className={styles.copy}>
          <p className={styles.code}>404 · Page not found</p>
          <h1 id="missing-title">
            {phaseTwo ? "Plot twist. Wrong page." : "Wrong turn? Let’s straighten that out."}
          </h1>
          <p className={styles.lede}>
            {phaseTwo ? "This link went off-panel." : "This link took the scenic route."} While
            you’re here, see if you can spot the one sheep that wandered off (Luke 15:4–7).
          </p>
          <nav className={styles.links} aria-label="Find your way">
            <Link href="/" className={primary}>
              Head straight home
            </Link>
            {phaseTwo && (
              <Link href="/life" className={secondary}>
                Life at KP2
              </Link>
            )}
            <Link href={phaseTwo ? "/branches" : "/locations"} className={secondary}>
              Find a branch
            </Link>
          </nav>
        </div>
        <DoveFlight buttonClassName={primary} phaseTwo={phaseTwo} />
        <figure className={styles.verse}>
          <blockquote>{VERSE}</blockquote>
          <figcaption>
            <a
              className={styles.scriptureLink}
              href="https://www.biblegateway.com/passage/?search=Isaiah%2040%3A4&version=KJV"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Read Isaiah 40:4 in the King James Version (opens in a new tab)"
            >
              <span>
                Isaiah 40<span className={styles.scriptureColon}>:</span>4 · KJV
              </span>
              <span aria-hidden="true">↗</span>
            </a>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
