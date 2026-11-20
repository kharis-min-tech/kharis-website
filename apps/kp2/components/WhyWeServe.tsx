const WHY_SERVE = [
  {
    icon: "favorite",
    title: "Serve like Jesus",
    text: "Jesus said He came not to be served but to serve, and to give His life for many. We serve because He served us first, and our love for others is our response to His love for us.",
    ref: "Matthew 20:28",
  },
  {
    icon: "diversity_3",
    title: "Every part matters",
    text: "The church is one body with many parts, and no part can say it doesn’t need another. Whatever you’re gifted at, you’re needed here, and when one of us hurts or rejoices, we all do.",
    ref: "1 Corinthians 12:12-27",
  },
  {
    icon: "volunteer_activism",
    title: "Serve as for the Lord",
    text: "Whatever you do, do it wholeheartedly, as if working for the Lord and not for people. No act of service is small, because it is ultimately offered to Christ, who promises a reward that lasts.",
    ref: "Colossians 3:23-24",
  },
];

export function WhyWeServe() {
  return (
    <section className="relative overflow-hidden border-t-4 border-black bg-gradient-to-b from-[#3a2158] via-[#221532] to-[#141018] px-margin-mobile py-stack-lg text-white md:px-margin-desktop">
      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block rounded-none border border-on-background/10 bg-secondary-container px-3 py-1 text-xs font-black uppercase tracking-widest text-[#151218]">
            The heart behind it
          </span>
          <h2 className="font-display-lg text-headline-lg leading-none uppercase text-primary-fixed-dim">
            Why We Serve
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/80">
            Serving is one of the ways we worship. Everything we do for others, we do for Him.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {WHY_SERVE.map((item, index) => (
            <article
              key={item.title}
              className={`relative flex flex-col rounded-none border border-on-background/10 p-6 shadow-[6px_6px_0_0_#000] ${
                index % 2 === 0
                  ? "bg-secondary-container text-on-secondary-container"
                  : "bg-primary text-on-primary"
              }`}
            >
              <span className="absolute right-4 top-3 font-display-lg text-6xl leading-none opacity-20">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span
                className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-none border border-on-background/10 ${
                  index % 2 === 0 ? "bg-on-background text-surface" : "bg-surface text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-2xl" aria-hidden="true">
                  {item.icon}
                </span>
              </span>
              <h3 className="font-headline-md mb-2 text-headline-md leading-tight">{item.title}</h3>
              <p className="mb-4 flex-1 text-sm leading-relaxed">{item.text}</p>
              <p className="font-[Space_Mono,monospace] text-xs uppercase tracking-widest opacity-80">
                {item.ref}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
