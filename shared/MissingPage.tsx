import Link from "next/link";
import { DoveFlight } from "./DoveFlight";
import styles from "./MissingPage.module.css";

const VERSE = "I will go before thee, and make the crooked places straight";

export function MissingPage({ phaseTwo = false }: { phaseTwo?: boolean }) {
  return (
    <section
      className={`${styles.page}${phaseTwo ? ` ${styles.comic}` : ""}`}
      aria-labelledby="missing-title"
    >
      <div className={styles.spread}>
        <div className={styles.copy}>
          <p className={styles.code}>404 · Page not found</p>
          <h1 id="missing-title">Have you seen our page?</h1>
          <p className={styles.lede}>
            {phaseTwo ? "It slipped off-panel." : "It wandered off."} Jesus told of a shepherd who
            left the ninety-nine to find the one. We’re following his lead.
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
          <figcaption>Isaiah 45:2 · KJV</figcaption>
        </figure>
      </div>
    </section>
  );
}
