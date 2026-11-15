import { AppPhonePreview } from "../../../shared/AppPhonePreview";

const LISTEN_STEPS = [
  {
    title: "See The Latest",
    detail: "Listen to the latest messages and see church updates.",
    screen: "home",
    alt: "Kharis app home with latest audio, video and playlists",
  },
  {
    title: "Search for any message",
    detail: "Find the teaching you need in a few taps.",
    screen: "messages",
    alt: "Kharis app messages list with search",
  },
  {
    title: "Hear The Word",
    detail: "Be blessed, wherever you are.",
    screen: "player",
    alt: "Kharis app audio player",
  },
] as const;

export function AppListenSteps() {
  return (
    <div className="kp-app-steps">
      {LISTEN_STEPS.map((step) => (
        <article key={step.title} className="kp-app-step">
          <div className="kp-app-step-copy">
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
