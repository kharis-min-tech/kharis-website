import Image from "next/image";
import { Icon } from "@/components/Icon";

/**
 * iPhone mock for Vision panel — Kharis purple/orange + soft glass,
 * linked into the homepage sections (same spirit as the app screenshot).
 */
export function VisionPhoneMock() {
  return (
    <div className="vision-phone">
      <div className="vision-phone__glow" aria-hidden />

      <div className="vision-phone__device">
        <div className="vision-phone__notch" aria-hidden />
        <div className="vision-phone__screen">
          <div className="vision-phone__status" aria-hidden>
            <span>9:41</span>
            <span className="vision-phone__status-icons">●●● ▮</span>
          </div>

          <div className="vision-phone__brand">
            <Image
              src="/images/kharis-logo.png"
              alt=""
              width={22}
              height={22}
              className="h-[22px] w-[22px] object-contain brightness-0"
            />
          </div>

          {/* Daily reading — soft purple glass */}
          <a
            href="https://kharis.org/"
            className="vision-phone__reading"
            aria-label="Daily reading"
          >
            <div>
              <p className="vision-phone__label">Daily reading</p>
              <p className="vision-phone__reading-title">Psalms 14</p>
            </div>
            <span className="vision-phone__reading-icon" aria-hidden>
              <Icon name="book" className="h-4 w-4" />
            </span>
          </a>

          {/* All messages */}
          <div className="vision-phone__block">
            <div className="vision-phone__row">
              <p className="vision-phone__heading">All messages</p>
              <a href="#messages" className="vision-phone__link">
                See more
              </a>
            </div>
            <a href="#messages" className="vision-phone__message">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/pastor-stage.jpg"
                alt=""
                className="vision-phone__message-img"
              />
              <span className="vision-phone__play" aria-hidden>
                <Icon name="play" className="h-3.5 w-3.5" />
              </span>
              <span className="vision-phone__message-copy">
                Watch latest teaching
              </span>
            </a>
          </div>

          {/* Service */}
          <div className="vision-phone__block">
            <div className="vision-phone__row">
              <p className="vision-phone__heading">Service</p>
              <a href="#near-you" className="vision-phone__link">
                Find branch
              </a>
            </div>
            <a href="#near-you" className="vision-phone__event">
              <span className="vision-phone__date">
                <strong>Sun</strong>
                <em>11am</em>
              </span>
              <span className="vision-phone__event-copy">
                <strong>Sunday Service</strong>
                <span>Find a Kharis branch near you</span>
              </span>
            </a>
            <a href="#give" className="vision-phone__event">
              <span className="vision-phone__date vision-phone__date--orange">
                <strong>Give</strong>
                <em>Now</em>
              </span>
              <span className="vision-phone__event-copy">
                <strong>Building &amp; giving</strong>
                <span>Take part in building God a house</span>
              </span>
            </a>
          </div>

          {/* Info details + Download app */}
          <div className="vision-phone__block vision-phone__block--foot">
            <a
              href="https://kharis.org/about-us/"
              className="vision-phone__info"
            >
              <span className="vision-phone__info-icon" aria-hidden>
                <Icon name="spark" className="h-3.5 w-3.5" />
              </span>
              <span>
                <strong>Info &amp; details</strong>
                <span>Vision, leadership &amp; contact</span>
              </span>
              <Icon name="arrow" className="h-3.5 w-3.5 opacity-60" />
            </a>

            <a
              href="https://kharis.org/"
              className="vision-phone__download"
            >
              Download app
              <Icon name="arrow" className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Bottom nav — linked into site */}
          <nav className="vision-phone__nav" aria-label="App shortcuts">
            <a href="#top" className="is-active">
              <Icon name="home" className="h-4 w-4" />
              <span>Home</span>
            </a>
            <a href="#messages">
              <Icon name="play" className="h-4 w-4" />
              <span>Messages</span>
            </a>
            <a href="#give">
              <Icon name="heart" className="h-4 w-4" />
              <span>Giving</span>
            </a>
            <a href="#near-you">
              <Icon name="location" className="h-4 w-4" />
              <span>Visit</span>
            </a>
            <a href="https://kharis.org/about-us/">
              <Icon name="groups" className="h-4 w-4" />
              <span>More</span>
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
}
