import { AppPhonePreview } from "../../../shared/AppPhonePreview";

const LISTEN_STEPS = [
  {
    step: "Step 1",
    title: "Home",
    screen: "current-home",
    alt: "Kharis app home with latest audio, video and playlists",
  },
  {
    step: "Step 2",
    title: "Media Player",
    screen: "current-player",
    alt: "Kharis app Media Player with audio and video tabs and playback controls",
  },
  {
    step: "Step 3",
    title: "Bible",
    screen: "current-chapter",
    alt: "John 3 open in the Kharis Church app Bible reader",
  },
] as const;

export function AppListenSteps({ images }: { images?: string[] }) {
  return (
    <div className="kp-app-steps">
      {LISTEN_STEPS.map((step, index) => (
        <article key={step.title} className="kp-app-step">
          <div className="kp-app-phone">
            <AppPhonePreview
              screen={step.screen}
              alt={step.alt}
              src={images?.[index]}
              sizes="(max-width: 767px) 76vw, 256px"
            />
          </div>
          <div className="kp-app-step-copy">
            <h3 className="font-headline-lg">{step.title}</h3>
          </div>
        </article>
      ))}
    </div>
  );
}
