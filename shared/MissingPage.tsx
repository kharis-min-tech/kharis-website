import Link from "next/link";
import { DoveFlight } from "./DoveFlight";
import styles from "./MissingPage.module.css";

const VERSE = "the crooked shall be made straight, and the rough places plain";

export function MissingPage({ phaseTwo = false }: { phaseTwo?: boolean }) {
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
            <Link href="/" className={styles.primary}>
              Head straight home
            </Link>
            {phaseTwo && (
              <Link href="/life" className={styles.secondary}>
                Life at KP2
              </Link>
            )}
            <Link href={phaseTwo ? "/branches" : "/locations"} className={styles.secondary}>
              Find a branch
            </Link>
          </nav>
        </div>
        <DoveFlight />
        <figure className={styles.verse}>
          <blockquote>{VERSE}</blockquote>
          <figcaption>Isaiah 40:4 · KJV</figcaption>
        </figure>
      </div>
    </section>
  );
}
