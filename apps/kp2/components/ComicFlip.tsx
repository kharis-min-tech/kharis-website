import "./comic-flip.css";

const LTBS =
  "https://images.kharis.org/site-images/main/69361724ac3b9413/events/ltbs-team-caps.jpg";
const DAVID =
  "https://images.kharis.org/site-images/main/29d8fc55043c33f2/events/singles-ball/pastor-david.jpg";
const AWO =
  "https://images.kharis.org/site-images/main/8daac0c4ad9423bc/events/singles-ball/pastor-awo.jpg";

export function ComicFlip() {
  return (
    <section className="kp-flip" aria-label="Let the Bible Speak and the Singles Ball">
      <div className="kp-flip__stage">
        <span className="kp-flip__spine" aria-hidden="true" />
        <div className="kp-flip__book">
          <article className="kp-flip__face kp-flip__face--under">
            <div className="kp-flip__split">
              <img
                src={DAVID}
                alt="Pastor David Antwi in a black tuxedo in front of the KM Singles Ball backdrop"
                style={{ objectPosition: "50% 18%" }}
              />
              <img
                src={AWO}
                alt="Pastor Awo Antwi in a teal and pink gown in front of the KM Singles Ball backdrop"
                style={{ objectPosition: "50% 18%" }}
              />
            </div>
            <span className="kp-flip__veil" aria-hidden="true" />
            <span className="kp-flip__num" aria-hidden="true">
              02
            </span>
            <div className="kp-flip__copy">
              <p className="kp-flip__eyebrow">Past event · Coming back soon</p>
              <h2 className="kp-flip__headline">Kharis Singles Ball</h2>
              <p className="kp-flip__sub">
                An evening of rich fellowship, joy, and celebration in Christ&apos;s love. Hosted by
                Pastor David and Pastor Awo.
              </p>
            </div>
          </article>

          <div className="kp-flip__sheet">
            <article className="kp-flip__face">
              <div className="kp-flip__photo">
                <img
                  src={LTBS}
                  alt="Three smiling team members in Let the Bible Speak caps and T-shirts, one wearing LTBS 2026 sunglasses"
                  style={{ objectPosition: "50% 18%" }}
                />
              </div>
              <span className="kp-flip__veil" aria-hidden="true" />
              <span className="kp-flip__shade" aria-hidden="true" />
              <span className="kp-flip__num" aria-hidden="true">
                01
              </span>
              <div className="kp-flip__copy">
                <p className="kp-flip__eyebrow">Past event · Coming back soon</p>
                <h2 className="kp-flip__headline">Let the Bible Speak</h2>
                <p className="kp-flip__sub">
                  A conference where we open the Book and hear His voice.
                </p>
              </div>
            </article>

            <article className="kp-flip__face kp-flip__face--back" aria-hidden="true">
              <div className="kp-flip__paper">
                <span>Singles Ball</span>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
