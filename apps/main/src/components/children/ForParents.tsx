import { Icon } from "@/components/Icon";

const KIDS_SERMON_URL = "https://app.kharis.org/track?trackId=23780";
const KIDS_SOUNDCLOUD_URL = "https://on.soundcloud.com/JWJDWztumwE31AAkuT";
const KIDS_SERMON_IMAGE = "/images/family-enrichment.jpg";

/** "The Church Family" message for parents. */
export function ForParents() {
  return (
    <section className="life-kids-video life-kids-video--v2 kids-wrap" aria-label="For parents">
      <div className="life-kids-video__card">
        <div className="life-kids-video__copy">
          <p className="life-hero__eyebrow">Listen with us</p>
          <h2>Worship that&apos;s alive</h2>
          <p>
            Our children learn the Word with energy and joy. The teaching of God&apos;s word is an
            aspect of what builds strong households.
          </p>
          <a
            href={KIDS_SERMON_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="life-cta life-kids-editorial-hero__cta"
          >
            Listen to &lsquo;The Church Family&rsquo; here{" "}
            <Icon name="arrow" className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="life-kids-video__frame mx-auto max-w-[26rem]" style={{ aspectRatio: "1 / 1" }}>
          <img
            src={KIDS_SERMON_IMAGE}
            alt="Family Enrichment — The Church Family message"
            className="block h-full w-full object-cover"
          />
          <div className="absolute bottom-3 right-3 z-20 flex flex-col items-end gap-2">
            <a
              href={KIDS_SOUNDCLOUD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#160b24]/85 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md transition-colors hover:bg-[var(--purple-fill)]"
            >
              &lsquo;The Church Family&rsquo; (Soundcloud){" "}
              <Icon name="arrow" className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
