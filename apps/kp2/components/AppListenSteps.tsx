import { AppPhonePreview } from "../../../shared/AppPhonePreview";

const LISTEN_STEPS = [
  {
    title: "Open the app home",
    detail: "See latest audio, video and playlists.",
    screen: "home",
    alt: "Kharis app home with latest audio, video and playlists",
  },
  {
    title: "Search any message",
    detail: "Find the teaching you need in a tap.",
    screen: "messages",
    alt: "Kharis app messages list with search",
  },
  {
    title: "Press play and go",
    detail: "Listen anywhere you are.",
    screen: "player",
    alt: "Kharis app audio player",
  },
] as const;

export function AppListenSteps() {
  return (
    <div className="kp-app-steps">
      {LISTEN_STEPS.map((step, i) => (
        <article key={step.title} className="kp-app-step">
          <div className="kp-app-step-copy">
            <p className="kp-app-step-number font-label-comic">Step {i + 1}</p>
            <h3 className="font-headline-lg">{step.title}</h3>
            <p className="kp-app-step-detail font-body-md">{step.detail}</p>
          </div>
          <div className="kp-app-phone">
            <AppPhonePreview
              screen={step.screen}
              alt={step.alt}
              sizes="(max-width: 767px) 220px, 235px"
            />
            <div className="kp-app-phone-fade" aria-hidden="true" />
          </div>
        </article>
      ))}
    </div>
  );
}
