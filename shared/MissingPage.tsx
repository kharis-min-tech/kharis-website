import Link from "next/link";
import { DoveFlight } from "./DoveFlight";
import styles from "./MissingPage.module.css";

const VERSE =
  "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.";

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
            {phaseTwo ? "One sheep went off-panel." : "This page wandered off."}
          </h1>
          <p className={styles.lede}>
            Jesus told of a shepherd who left the ninety-nine to find the one. This link might be
            lost, but there’s a way home.
          </p>
          <nav className={styles.links} aria-label="Find your way">
            <Link href="/" className={styles.primary}>
              Back home
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
          <figcaption>Isaiah 40:31 · KJV</figcaption>
        </figure>
      </div>
    </section>
  );
}
