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
} as const;

type Props = {
  screen: keyof typeof CAPTURES;
  alt?: string;
  sizes?: string;
};

/** Fits the app capture below the camera, excluding the old image's bezel and notch. */
export function AppPhonePreview({ screen, alt, sizes = "235px" }: Props) {
  const capture = CAPTURES[screen];
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
