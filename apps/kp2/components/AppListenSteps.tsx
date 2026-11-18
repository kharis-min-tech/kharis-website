import { AppPhonePreview } from "../../../shared/AppPhonePreview";

const LISTEN_STEPS = [
  {
    step: "Step 1",
    title: "Open the app",
    screen: "home",
    alt: "Kharis app home with latest audio, video and playlists",
  },
  {
    step: "Step 2",
    title: "Search for a message",
    screen: "messages",
    alt: "Kharis app messages list with search",
  },
  {
    step: "Step 3",
    title: "Press play and go",
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
            <p className="kp-app-step-number">{step.step}</p>
            <h3 className="font-headline-lg">{step.title}</h3>
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
