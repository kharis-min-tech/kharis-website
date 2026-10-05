/** Full-page hold while the homepage hero mid-preach clip settles. */
export function HomeSiteSkeleton() {
  return (
    <div className="hero-site-skeleton" aria-hidden>
      <div className="hero-site-skeleton__nav">
        <span className="hero-site-skeleton__bone hero-site-skeleton__logo" />
        <span className="hero-site-skeleton__nav-links">
          <span className="hero-site-skeleton__bone" />
          <span className="hero-site-skeleton__bone" />
          <span className="hero-site-skeleton__bone" />
          <span className="hero-site-skeleton__bone" />
        </span>
      </div>
      <div className="hero-site-skeleton__hero">
        <span className="hero-site-skeleton__bone hero-site-skeleton__eyebrow" />
        <span className="hero-site-skeleton__bone hero-site-skeleton__title" />
        <span className="hero-site-skeleton__bone hero-site-skeleton__title hero-site-skeleton__title--short" />
        <span className="hero-site-skeleton__bone hero-site-skeleton__line" />
        <span className="hero-site-skeleton__ctas">
          <span className="hero-site-skeleton__bone hero-site-skeleton__btn" />
          <span className="hero-site-skeleton__bone hero-site-skeleton__btn" />
        </span>
      </div>
      <div className="hero-site-skeleton__body">
        <span className="hero-site-skeleton__bone hero-site-skeleton__section" />
        <div className="hero-site-skeleton__cards">
          <span className="hero-site-skeleton__bone hero-site-skeleton__card" />
          <span className="hero-site-skeleton__bone hero-site-skeleton__card" />
          <span className="hero-site-skeleton__bone hero-site-skeleton__card" />
        </div>
      </div>
    </div>
  );
}
