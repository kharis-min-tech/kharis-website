import Image from "next/image";
import type { CSSProperties } from "react";
import styles from "./AppPhonePreview.module.css";

const CAPTURES = {
  home: {
    src: "https://images.kharis.org/site-images/main/c9ae7d1c19dd35f4/app-steps/step-2-browse.png",
    top: 64,
    alt: "Kharis app home with latest audio, video and playlists",
  },
  messages: {
    src: "https://images.kharis.org/site-images/main/0cae2b998ffa6335/app-steps/step-1-messages.png",
    top: 72,
    alt: "Kharis app messages list with search",
  },
  player: {
    src: "https://images.kharis.org/site-images/main/0c5df54aeea92af4/app-steps/step-3-player.png",
    top: 72,
    alt: "Kharis app audio player",
  },
  "current-home": {
    src: "https://images.kharis.org/site-images/main/4275eecdf5e5a12c/app-steps/kharis-app-current-home.png",
    alt: "Kharis Church app home screen with branch updates, the daily Bible reading and Moments",
    current: true,
  },
  "current-messages": {
    src: "https://images.kharis.org/site-images/main/9c878f218f77a199/app-steps/kharis-app-current-messages.png",
    alt: "Kharis Church app Messages screen with a featured sermon, browsing tabs and saved collections",
    current: true,
  },
  "current-player": {
    src: "https://images.kharis.org/site-images/main/f7dfca4f99bbe8a3/app-steps/kharis-app-current-player.png",
    alt: "Kharis Church app Media Player with audio and video playback controls",
    current: true,
  },
  "current-bible": {
    src: "https://images.kharis.org/site-images/main/60f1b5d6513363dd/app-steps/kharis-app-current-bible.png",
    alt: "Kharis Church app Bible screen with Scripture search, highlights and notes",
    current: true,
  },
  "current-chapter": {
    src: "https://images.kharis.org/site-images/main/0706ed3bc435673c/app-steps/kharis-app-current-chapter.png",
    alt: "Kharis Church app Bible reader open on a chapter",
    current: true,
  },
} as const;

type Props = {
  screen: keyof typeof CAPTURES;
  alt?: string;
  sizes?: string;
};

/** Fits the app capture below the camera, excluding the old image's bezel and notch. */
export function AppPhonePreview({ screen, alt, sizes = "235px" }: Props) {
  const capture = CAPTURES[screen];
  if ("current" in capture) {
    return (
      <div className={styles.currentFrame} data-app-phone={screen}>
        <div className={styles.currentScreen}>
          <span className={styles.currentNotch} aria-hidden />
          <Image
            src={capture.src}
            alt={alt ?? capture.alt}
            width={780}
            height={1688}
            className={styles.currentImage}
            sizes={sizes}
            unoptimized
          />
        </div>
      </div>
    );
  }
  return (
    <div className={styles.frame} data-app-phone={screen}>
      <div className={styles.screen} data-app-phone-screen>
        <div
          className={styles.capture}
          data-app-phone-capture
          style={
            {
              "--capture-top": capture.top,
              "--capture-height": 950 - capture.top,
            } as CSSProperties
          }
        >
          <Image
            src={capture.src}
            alt={alt ?? capture.alt}
            width={486}
            height={986}
            className={styles.image}
            sizes={sizes}
            unoptimized
          />
        </div>
        <span className={styles.camera} data-app-phone-camera aria-hidden />
      </div>
    </div>
  );
}
