"use client";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import { AnimatedHeight } from "@/components/AnimatedHeight";
import { FaithAccordion } from "@/components/FaithAccordion";
import "@/components/leadership.css";
import "@/components/mission-pillars.css";

const ABOUT_HERO =
  "https://images.kharis.org/site-images/main/e01fad6602636193/about-outreach-hero.jpg";

const CHAPTERS = ["mission", "vision", "leadership"] as const;

const MAIN_TABS = [
  {
    id: "mission",
    label: "Our Mission",
    sub: "Why we exist",
    icon: "favorite",
    headline: "Influence society with the reality of God's love",
    body: "We are a friendly, caring and exciting family church that seeks to influence our society with the reality of God's love and the reliability of His principles by ministering to the spiritual, physical, social and emotional needs of people who care to experience God in a dynamic and a living way.",
    eyebrow: "Our Mission",
    items: [
      {
        num: "01",
        title: "Discipleship",
        icon: "menu_book",
        desc: "The heart of Christianity is the making of disciples.",
        ref: "Matthew 28:19 (KJV)",
        scripture:
          "Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost.",
      },
      {
        num: "02",
        title: "Care",
        icon: "volunteer_activism",
        desc: "Everyone is important and everyone deserves to be loved, cared for and supported as they pursue the right course in life.",
        ref: "Romans 12:9 (KJV)",
        scripture:
          "Let love be without dissimulation. Abhor that which is evil; cleave to that which is good.",
      },
      {
        num: "03",
        title: "Outreach",
        icon: "public",
        desc: "Jesus reached out to us and gave us the responsibility for reaching out to others with His love.",
        ref: "Mark 16:15 (KJV)",
        scripture:
          "And he said unto them, Go ye into all the world, and preach the gospel to every creature.",
      },
      {
        num: "04",
        title: "Leadership Development",
        icon: "groups",
        desc: "Everybody has the potential to lead. We have the responsibility to raise Godly leaders who will rise up to influence their society with the principles of The Kingdom of God.",
        ref: "Proverbs 29:2 (KJV)",
        scripture:
          "When the righteous are in authority, the people rejoice: but when the wicked beareth rule, the people mourn.",
      },
    ],
  },
  {
    id: "vision",
    label: "Our Vision",
    sub: "Where we are going",
    icon: "auto_awesome",
    eyebrow: "Our Vision",
    headline: "Changing the world with a touch of His Grace",
    body: "The Kharis we see:",
    items: [],
  },
  {
    id: "leadership",
    label: "Our Leadership",
    sub: "Who leads us",
    icon: "groups",
    eyebrow: "Lead Pastors",
    headline: "Pastors David & Awo Antwi",
    body: "Founders of Kharis, and of Kharis Phase 2.",
    items: [],
  },
];

function WhoWeAreBecoming() {
  const [mainTab, setMainTab] = useState(0);
  const [subTab, setSubTab] = useState(0);
  const tab = MAIN_TABS[mainTab]!;
  const item = tab.items[subTab];
  const bannerPhoto =
    tab.id === "leadership" ? PASTORS_PORTRAIT : tab.id === "vision" ? VISION_HERO : null;

  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash.replace("#", "");
      const index = CHAPTERS.indexOf(hash as (typeof CHAPTERS)[number]);
      if (index >= 0) {
        setMainTab(index);
        setSubTab(0);
      }
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const selectChapter = (index: number) => {
    setMainTab(index);
    setSubTab(0);
    const id = MAIN_TABS[index]?.id;
    if (id) window.history.replaceState({}, "", `#${id}`);
  };

  return (
    <section
      id="who-we-are"
      className="py-12 md:py-16 px-margin-mobile md:px-margin-desktop relative overflow-hidden bg-background"
    >
      <span id="mission" className="kp-about-hash" />
      <span id="vision" className="kp-about-hash" />
      <span id="leadership" className="kp-about-hash" />
      {/* backdrop */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96  bg-primary/10 blur-3xl"></div>
        <div className="absolute -bottom-32 -left-24 w-96 h-96  bg-secondary-fixed-dim/10 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="font-display-lg text-headline-lg md:text-display-lg text-on-background uppercase leading-none">
            Who we are
          </h2>
        </div>

        {/* Main tabs */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-7"
          role="tablist"
          aria-label="Who we are"
        >
          {MAIN_TABS.map((t, i) => (
            <button
              key={t.id}
              id={`about-tab-${t.id}`}
              role="tab"
              aria-selected={mainTab === i}
              aria-controls={`about-panel-${t.id}`}
              tabIndex={mainTab === i ? 0 : -1}
              onClick={() => selectChapter(i)}
              onKeyDown={(event) => {
                const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
                if (!keys.includes(event.key)) return;
                event.preventDefault();
                const next =
                  event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? MAIN_TABS.length - 1
                      : (i + (event.key === "ArrowRight" ? 1 : -1) + MAIN_TABS.length) %
                        MAIN_TABS.length;
                selectChapter(next);
                document.getElementById(`about-tab-${MAIN_TABS[next]!.id}`)?.focus();
              }}
              className={`kp-mission-tab no-accent-fill text-left p-6 rounded-none border-2 border-black brutalist-shadow transition-all duration-200 flex items-start gap-4 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none ${
                mainTab === i
                  ? "bg-primary text-white"
                  : "bg-surface text-on-background hover:bg-primary-fixed hover:text-on-primary-fixed"
              }`}
            >
              <span className="font-display-lg text-2xl leading-none opacity-70">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={`w-12 h-12 shrink-0 border-2 border-current flex items-center justify-center ${mainTab === i ? "bg-white/15" : "bg-primary/10"}`}
              >
                <span className="material-symbols-outlined text-2xl" data-weight="fill">
                  {t.icon}
                </span>
              </span>
              <span>
                <span
                  className={`block font-headline-md text-headline-md uppercase ${mainTab === i ? "text-white" : "text-on-background dark:text-[#e8e0e9]"}`}
                >
                  {t.label}
                </span>
                <span
                  className={`block font-label-sm uppercase mt-1 ${mainTab === i ? "text-white/75" : "text-on-surface-variant dark:text-[#ccc3d8]"}`}
                >
                  {t.sub}
                </span>
              </span>
            </button>
          ))}
        </div>

        {/* Content area */}
        <div
          id={`about-panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`about-tab-${tab.id}`}
          className="bg-surface rounded-none border-2 border-black brutalist-shadow-lg overflow-hidden"
        >
          <AnimatedHeight>
            {/* Content header */}
            <div
              key={tab.id}
              className={`kp-content-enter kp-mission-banner bg-primary px-6 md:px-10 py-8 md:py-10 relative overflow-hidden${
                bannerPhoto ? " kp-lead-hero" : ""
              }${tab.id === "vision" ? " kp-vision-hero" : ""}`}
            >
              {bannerPhoto ? (
                <img
                  src={bannerPhoto}
                  alt=""
                  aria-hidden="true"
                  decoding="async"
                  className="kp-lead-hero__photo"
                />
              ) : null}
              <div className="absolute top-0 right-0 w-40 h-40  bg-white/10 -mr-10 -mt-10"></div>
              <span className="relative z-10 font-label-md text-white/80 uppercase tracking-[0.2em] block mb-3">
                {tab.eyebrow || "How we fulfil it"}
              </span>
              <h3 className="relative z-10 font-display-xl text-3xl md:text-5xl text-white uppercase leading-tight max-w-3xl">
                {tab.headline}
              </h3>
              {tab.id === "leadership" ? (
                <p className="relative z-10 font-body-lg text-body-lg text-white/90 mt-4 max-w-3xl">
                  {tab.body}
                </p>
              ) : null}
            </div>

            {tab.id === "vision" ? (
              <VisionContent />
            ) : tab.id === "leadership" ? (
              <LeadershipContent />
            ) : item ? (
              <div className="kp-content-enter kp-pillars">
                <p className="kp-pillars__lead">{tab.body}</p>
                <div className="kp-pillars__split">
                  <div
                    className="kp-pillars__list"
                    role="group"
                    aria-label="How we fulfil our mission"
                  >
                    {tab.items.map((it, i) => (
                      <button
                        key={it.title}
                        type="button"
                        aria-pressed={subTab === i}
                        onClick={() => setSubTab(i)}
                        className={`kp-pillars__item no-accent-fill${subTab === i ? " is-active" : ""}`}
                      >
                        <span className="kp-pillars__label">
                          <span className="kp-pillars__num">{it.num}</span>
                          <span className="kp-pillars__title">{it.title}</span>
                        </span>
                        <span
                          className="material-symbols-outlined kp-pillars__arrow"
                          aria-hidden="true"
                        >
                          arrow_forward
                        </span>
                      </button>
                    ))}
                  </div>

                  <article key={item.title} className="kp-pillars__focus">
                    <p className="kp-pillars__kicker">How we fulfil it</p>
                    <h4 className="kp-pillars__heading">{item.title}</h4>
                    <p className="kp-pillars__desc">{item.desc}</p>
                    <figure className="kp-pillars__bubble">
                      <figcaption className="kp-pillars__ref">{item.ref}</figcaption>
                      <blockquote>{item.scripture}</blockquote>
                    </figure>
                  </article>
                </div>
              </div>
            ) : null}
          </AnimatedHeight>
        </div>
      </div>
    </section>
  );
}

const VISION_HERO =
  "https://images.kharis.org/site-images/main/a080e8123b487573/vision-church-family.jpg";

const VISION_THEMES = [
  {
    icon: "church",
    theme: "Christ-centred, purpose-driven and disciple-making",
    point: "Is Christ Centred, Purpose Driven, People Developing and Disciple Making.",
  },
  {
    icon: "auto_awesome",
    theme: "Full of life, large and spiritually deep",
    point:
      "Is exciting and full of life. It is a church that is both numerically large and spiritually deep.",
  },
  {
    icon: "local_fire_department",
    theme: "Naturally supernatural, glorifying God",
    point:
      "Is non-religious, naturally supernatural, and incredibly fun to be in. It’s a church of renowned character and integrity. A church whose number one priority is to glorify God and share the Good News of Jesus Christ with a lost world.",
  },
  {
    icon: "podcasts",
    theme: "Proclamation and worship to the nations",
    point:
      "Is attractive, confident, victorious and overcoming. We see a church whose powerful proclamation and awesome worship are broadcast to the nations by every modern means possible.",
  },
  {
    icon: "redeem",
    theme: "Ordinary people, extraordinary lives",
    point:
      "Equips, enables, empowers and releases ordinary people to live extraordinary lives. Helping them discover the gifts and talents God gave them.",
  },
  {
    icon: "home",
    theme: "A caring family, refuge and belonging",
    point:
      "Is a deeply committed, loving, caring family amongst whom the lonely and the broken find refuge, new hope and belonging.",
  },
  {
    icon: "groups",
    theme: "Strong, effective small groups",
    point: "Is a church of strong and effective small groups.",
  },
  {
    icon: "flight",
    theme: "Missionaries sent, every member equipped",
    point:
      "Sends out missionaries and church workers around the world, strengthening every member for a personal life mission in the world.",
  },
];

function VisionContent() {
  return (
    <div className="kp-content-enter kp-vision">
      <p className="kp-vision__intro">The Kharis we see:</p>
      <div className="kp-vision__grid">
        {VISION_THEMES.map((item, i) => (
          <details
            key={item.theme}
            className="kp-vision__theme"
            style={{ "--i": i } as CSSProperties}
          >
            <summary>
              <span className="material-symbols-outlined kp-vision__icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="kp-vision__label">
                <span>{item.theme}</span>
              </span>
              <span className="kp-vision__toggle" aria-hidden="true" />
            </summary>
            <p className="kp-vision__point">{item.point}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

const FAITH_STATEMENTS = [
  {
    title: "God the Father",
    body: "God is the Father, Creator and Ruler of the universe.",
  },
  {
    title: "Jesus Christ",
    body: "Jesus Christ is the Son of God. Jesus lived a sinless human life, conceived of the Holy Spirit, born by the virgin Mary and offered Himself as the perfect sacrifice for the sins of all people by dying on a cross. He arose from the dead after three days to demonstrate His power over sin and death. He ascended to Heaven's glory and will return again someday to earth to reign as King of Kings, and Lord of Lords.",
  },
  {
    title: "The Holy Spirit",
    body: "The Holy Spirit is present in the world to make men aware of their need for Jesus Christ. He also lives in every Christian from the moment of salvation. He provides the Christian with power for living.",
  },
  {
    title: "The Bible",
    body: "The Bible is God's Word to us.",
  },
  {
    title: "Humanity",
    body: "Man is made in the spiritual image of God, to be like Him in character. People are the supreme object of God's creation. Man sinned and only the blood of Jesus can redeem man from the hold of sin.",
  },
  {
    title: "Salvation",
    body: "Salvation is God's free gift to us but we must accept it. Eternal life begins the moment one receives Jesus Christ into his life by faith.",
  },
  {
    title: "Eternal Security",
    body: "Because God gives us eternal life through Jesus Christ, the true believer is secure in that salvation for eternity. Salvation is maintained by the grace and power of God, not by the self-effort of the Christian. It is the grace and keeping power of God that gives us this security.",
  },
  {
    title: "Eternity",
    body: "There is life after death, people were created to exist forever. We believe in the resurrection of the body, the final judgement.",
  },
];

function StatementOfFaith() {
  return <FaithAccordion statements={FAITH_STATEMENTS} />;
}

const PASTORS_PORTRAIT =
  "https://images.kharis.org/site-images/main/61b5f617ef58872c/about-pastors-portrait.jpg";

const PASTORS = [
  {
    id: "david",
    name: "Pastor David Antwi",
    role: "Founder & Lead Pastor",
    image:
      "https://images.kharis.org/site-images/main/e666a073b590b3ff/leadership/pastor-david-sunday.jpg",
    focus: "Teaching the Word and establishing believers in their faith",
    blurb:
      "Pastor David co-founded Kharis in 2003. He leads with a deep love for Scripture, teaching and serving so people encounter God in a living way and grow as disciples of Christ.",
  },
  {
    id: "awo",
    name: "Pastor Awo Antwi",
    role: "Co-founder & Pastor",
    image:
      "https://images.kharis.org/site-images/main/7acafe42a978e2ea/leadership/pastor-awo-portrait.jpg",
    focus: "People, family, and raising the next generation",
    blurb:
      "Pastor Awo co-founded Kharis with Pastor David and helped establish Kharis Phase 2 for students and young people. She serves with care, strength and a heart for the church family.",
  },
];

const PASTORS_STORY = [
  {
    title: "Founded in 2003",
    body: "Pastor David and Awo founded Kharis in 2003, a multifaceted ministry headquartered in London, United Kingdom, with several branches worldwide. Together, they also founded Kharis Phase 2, our students’ and young people’s services. Kharis also has a presence on university campuses across the UK.",
  },
  {
    title: "The Word at the centre",
    body: "Their love for the Word of God is evident in how they lead, teach, and serve. Their greatest desire is to see believers established in their faith, local churches strengthened, and ultimately, for revival to sweep through the nations.",
  },
  {
    title: "A life together",
    body: "They have been married for over 20 years and are blessed with two wonderful children.",
  },
];

function LeadershipContent() {
  return (
    <div className="kp-content-enter kp-lead">
      <div className="kp-lead__profiles">
        {PASTORS.map((pastor) => (
          <article key={pastor.id} className="kp-lead__profile">
            <div className="kp-lead__photo">
              <img src={pastor.image} alt={pastor.name} loading="lazy" decoding="async" />
            </div>
            <div className="kp-lead__card">
              <p className="kp-lead__role">{pastor.role}</p>
              <h4 className="kp-lead__name">{pastor.name}</h4>
              <p className="kp-lead__focus">{pastor.focus}</p>
              <p className="kp-lead__blurb">{pastor.blurb}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="kp-lead__story">
        <p className="kp-lead__kicker">Their story</p>
        <div className="kp-lead__beats">
          {PASTORS_STORY.map((beat, i) => (
            <div key={beat.title} className="kp-lead__beat">
              <span className="kp-lead__beat-num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h4>{beat.title}</h4>
              <p>{beat.body}</p>
            </div>
          ))}
        </div>
        <Link href="/life" className="kp-lead__cta">
          Explore KP2 Life
          <span className="material-symbols-outlined" aria-hidden="true">
            arrow_forward
          </span>
        </Link>
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="kp-mission-page bg-background text-on-surface font-body-md overflow-x-hidden">
      <SiteHeader />

      <section className="kp-mission-hero relative box-border flex w-full items-end overflow-hidden border-b-4 border-primary bg-on-background text-background">
        <img
          src={ABOUT_HERO}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_40%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#151218]/80 via-[#151218]/45 to-[#151218]/25"></div>
        <div className="relative z-20 w-full px-margin-mobile md:px-margin-desktop text-left">
          <p className="font-label-md uppercase tracking-[0.28em] text-[#f7be1d] mb-4">
            Kharis Phase 2
          </p>
          <h1 className="font-display-lg uppercase leading-none text-white mb-4">Kharis</h1>
          <p className="font-body-lg text-body-lg text-white max-w-md">
            Changing the world with a touch of His grace.
          </p>
        </div>
      </section>

      <main>
        <section
          id="kharis-name"
          className="py-12 md:py-16 px-margin-mobile md:px-margin-desktop bg-background transition-colors duration-300"
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
              <div className="kp-name-card bg-[#f2eef7] dark:bg-[#1f1c24] p-6 md:p-8 transition-colors duration-300">
                <span className="font-label-md text-label-md uppercase tracking-[0.2em] text-primary mb-4 block">
                  Kharis
                </span>
                <h2 className="kp-greek-word font-body-md text-4xl md:text-5xl text-on-surface dark:text-[#e8e0e9] mb-3 transition-colors duration-300">
                  χάρις, ιτος, ή
                </h2>
                <p className="font-body-lg text-on-surface dark:text-[#e8e0e9] font-medium transition-colors duration-300">
                  Greek word for Grace
                </p>
              </div>
              <div className="kp-name-card bg-[#f2eef7] dark:bg-[#1f1c24] p-6 md:p-8 transition-colors duration-300">
                <span className="font-label-md text-label-md uppercase tracking-[0.2em] text-primary mb-4 block">
                  Ministries
                </span>
                <h2 className="kp-greek-word font-body-md text-4xl md:text-5xl text-on-surface dark:text-[#e8e0e9] mb-3 transition-colors duration-300">
                  λειτουργία, ας, ή
                </h2>
                <p className="font-body-lg text-on-surface dark:text-[#e8e0e9] font-medium transition-colors duration-300">
                  Serving through many ministries
                </p>
              </div>
            </div>
            <p className="font-body-lg text-on-surface-variant max-w-3xl mt-8 md:mt-10 leading-relaxed">
              While ministering to the total person, we seek to deepen people&apos;s commitment to
              God and to spiritual values such as holiness, prayer, evangelism, Christ-centred
              living, Bible study and fellowship.
            </p>
          </div>
        </section>

        <WhoWeAreBecoming />

        <StatementOfFaith />
      </main>

      <SiteFooter />

      <ThemeToggle />
    </div>
  );
}

export default AboutPage;
