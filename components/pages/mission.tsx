"use client";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import Link from "next/link";



const MAIN_TABS = [
  {
    id: "mission",
    label: "Our Mission",
    sub: "Why we exist",
    icon: "favorite",
    headline: "Influence society with the reality of God's love",
    body: "We are a friendly, caring and exciting family church that seeks to influence our society with the reality of God's love and the reliability of His promises to a hurting generation.",
    eyebrow: "How We Fulfil Our Mission Statement",
    items: [
      {
        num: "01",
        title: "Discipleship",
        icon: "menu_book",
        desc: "The heart of Christianity is the making of disciples",
        ref: "MATT 28:19 (KJV)",
        scripture: "Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost",
      },
      {
        num: "02",
        title: "Care",
        icon: "volunteer_activism",
        desc: "Everyone is important and everyone deserves to be loved, cared for and supported as they pursue the right course in life",
        ref: "ROMANS 12:9 (KJV)",
        scripture: "Let love be without dissimulation. Abhor that which is evil; cleave to that which is good.",
      },
      {
        num: "03",
        title: "Outreach",
        icon: "public",
        desc: "Jesus reached out to us and gave us the responsibility for reaching out to others with His love",
        ref: "MARK 16:15 (KJV)",
        scripture: "And he said unto them, Go ye into all the world, and preach the gospel to every creature.",
      },
      {
        num: "04",
        title: "Leadership Development",
        icon: "groups",
        desc: "Everybody has the potential to lead. We have the responsibility to raise Godly leaders who will rise up to influence their society with the principles of The Kingdom of God.",
        ref: "PROV 29:2 (KJV)",
        scripture: "When the righteous are in authority, the people rejoice: but when the wicked beareth rule, the people mourn.",
      },
    ],
  },
  {
    id: "vision",
    label: "Our Vision",
    sub: "Where we are going",
    icon: "auto_awesome",
    eyebrow: "Our Vision Statement",
    headline: "Changing the world with a touch of His Grace",
    body: "The Kharis we see:",
    items: [],
  },
];


function WhoWeAreBecoming() {
  const mission = MAIN_TABS[0]!;
  const vision = MAIN_TABS[1]!;

  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-28 px-margin-mobile md:px-margin-desktop">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-magenta/15 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-cobalt/15 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <span className="mb-6 inline-block rounded-full bg-amber px-4 py-1 font-label-md uppercase tracking-widest text-[#1a0b00]">
            About Us
          </span>
          <h2 className="font-display-lg text-headline-lg uppercase leading-none text-on-background md:text-display-lg">
            Who we are becoming
          </h2>
        </div>

        <div className="who-becoming">
          <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {MAIN_TABS.map((t, i) => (
              <div key={t.id}>
                <input
                  type="radio"
                  name="who-main"
                  id={`who-main-${t.id}`}
                  defaultChecked={i === 0}
                  className="peer sr-only"
                />
                <label
                  htmlFor={`who-main-${t.id}`}
                  className="flex cursor-pointer items-start gap-4 rounded-3xl border border-on-background/10 bg-surface-container-lowest p-5 text-on-background transition-all duration-200 hover:-translate-y-0.5 peer-checked:border-transparent peer-checked:bg-amber peer-checked:text-[#1a0b00] peer-checked:hover:translate-y-0"
                >
                  <span className="who-icon flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="material-symbols-outlined text-2xl" data-weight="fill">
                      {t.icon}
                    </span>
                  </span>
                  <span>
                    <span className="block font-headline-md text-headline-md uppercase">{t.label}</span>
                    <span className="who-sub mt-1 block font-label-sm uppercase text-on-surface-variant">
                      {t.sub}
                    </span>
                  </span>
                </label>
              </div>
            ))}
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-on-background/10 bg-surface-container-lowest">
            <div className="relative overflow-hidden bg-[#06070a] px-6 py-10 text-white md:px-10 md:py-12">
              <div className="vibe-mesh pointer-events-none absolute inset-0" />
              <div className="relative z-10 mission-pane">
                <span className="mb-4 inline-block rounded-full border border-amber/40 bg-amber/15 px-4 py-1 font-label-md uppercase tracking-[0.2em] text-amber">
                  {mission.eyebrow}
                </span>
                <h3 className="max-w-3xl font-display-xl text-3xl uppercase leading-tight md:text-5xl">
                  {mission.headline}
                </h3>
                <p className="mt-4 max-w-3xl font-body-lg text-body-lg text-white/80">{mission.body}</p>
              </div>
              <div className="relative z-10 vision-pane">
                <span className="mb-4 inline-block rounded-full border border-amber/40 bg-amber/15 px-4 py-1 font-label-md uppercase tracking-[0.2em] text-amber">
                  {vision.eyebrow}
                </span>
                <h3 className="max-w-3xl font-display-xl text-3xl uppercase leading-tight md:text-5xl">
                  {vision.headline}
                </h3>
                <p className="mt-4 max-w-3xl font-body-lg text-body-lg text-white/80">{vision.body}</p>
              </div>
            </div>

            <div className="mission-pane grid grid-cols-1 gap-6 p-5 md:p-8 lg:grid-cols-12 lg:gap-8">
              <div className="flex flex-col gap-2 lg:col-span-5">
                {mission.items.map((it, i) => (
                  <div key={it.title}>
                    <input
                      type="radio"
                      name="who-sub"
                      id={`who-sub-${i}`}
                      defaultChecked={i === 0}
                      className="peer sr-only"
                    />
                    <label
                      htmlFor={`who-sub-${i}`}
                      className="flex w-full cursor-pointer items-center gap-4 rounded-2xl bg-surface-container px-4 py-4 text-on-background transition-all duration-200 hover:bg-surface-container-high peer-checked:bg-primary peer-checked:text-white md:px-5"
                    >
                      <span className="who-num font-display-lg text-2xl text-on-surface-variant">
                        {it.num}
                      </span>
                      <span className="who-item-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <span className="material-symbols-outlined" data-weight="fill">
                          {it.icon}
                        </span>
                      </span>
                      <span className="font-headline-md text-headline-md uppercase">{it.title}</span>
                    </label>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-7">
                {mission.items.map((it, i) => (
                  <div
                    key={it.title}
                    className={`detail-pane detail-${i} rounded-3xl bg-surface-container p-6 md:p-8 lg:p-10`}
                  >
                    <span className="mb-4 block font-label-md uppercase tracking-[0.2em] text-primary">
                      {mission.eyebrow}
                    </span>
                    <h4 className="mb-5 font-display-xl text-4xl uppercase text-on-background md:text-5xl">
                      {it.title}
                    </h4>
                    <p className="mb-8 font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
                      {it.desc}
                    </p>
                    <div className="rounded-3xl bg-amber p-6 text-[#1a0b00]">
                      <span className="mb-3 block font-label-md uppercase tracking-[0.2em]">
                        {it.ref}
                      </span>
                      <p className="font-body-lg text-body-lg italic leading-relaxed">
                        &ldquo;{it.scripture}&rdquo;
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="vision-pane">
              <VisionContent />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const VISION_PILLARS = [
  "Christ Centred",
  "Purpose Driven",
  "People Developing",
  "Disciple Making",
];

const VISION_STATEMENTS = [
  "Is exciting and full of life. It is a church that is both numerically large and spiritually deep",
  "Is non-religious, naturally supernatural, and incredibly fun to be in. It's a church of renowned character and integrity. A church whose number one priority is to glorify God and share the Good News of Jesus Christ with a lost world",
  "Is attractive, confident, victorious and overcoming. We see a church whose powerful proclamation and awesome worship are broadcast to the nations by every modern means possible",
  "Equips, enables, empowers and releases ordinary people to live extraordinary lives. Helping them discover the gifts and talents God gave them",
  "Is a deeply committed, loving, caring family amongst whom the lonely and the broken find refuge, new hope and belonging",
  "Is a church of strong and effective small groups",
  "Sends out missionaries and church workers around the world, strengthening every member for a personal life mission in the world",
];

function VisionContent() {
  return (
    <div className="p-5 md:p-8 lg:p-10">
      <div className="mb-8 flex flex-wrap gap-2">
        {VISION_PILLARS.map((pillar) => (
          <span
            key={pillar}
            className="inline-flex items-center gap-2 rounded-full bg-amber px-4 py-2 font-label-md uppercase tracking-wide text-[#1a0b00]"
          >
            <span className="material-symbols-outlined text-base" data-weight="fill">
              check_circle
            </span>
            {pillar}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {VISION_STATEMENTS.map((statement, i) => (
          <div key={i} className="rounded-3xl bg-surface-container p-6">
            <span className="mb-3 block font-display-lg text-2xl text-primary">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
              {statement}
            </p>
          </div>
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
  return (
    <section className="py-20 md:py-28 px-margin-mobile md:px-margin-desktop bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <span className="font-label-md text-primary uppercase tracking-[0.3em] block mb-4">
            Believe
          </span>
          <h2 className="font-display-lg text-headline-lg md:text-display-lg text-on-background uppercase leading-none">
            Our Statement of Faith
          </h2>
        </div>

        <div className="space-y-4">
          {FAITH_STATEMENTS.map((s, i) => (
            <details
              key={s.title}
              className="faith-item bg-surface rounded-2xl border border-on-background/10 brutalist-shadow"
              defaultOpen={i === 0}
            >
              <summary className="faith-item-summary w-full flex items-center gap-4 text-left px-5 md:px-8 py-5 hover:bg-secondary-container transition-colors duration-200">
                <span className="font-display-lg text-xl md:text-2xl text-primary shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 font-headline-md text-headline-md uppercase text-on-background dark:text-[#e8e0e9]">
                  {s.title}
                </span>
                <span className="w-9 h-9 shrink-0 rounded-2xl border border-on-background/10 flex items-center justify-center text-on-background dark:text-[#e8e0e9]">
                  <span className="material-symbols-outlined text-xl faith-icon-add">add</span>
                  <span className="material-symbols-outlined text-xl faith-icon-remove">remove</span>
                </span>
              </summary>
              <div className="px-5 md:px-8 pb-6 pt-0 border-t-2 border-on-background/10">
                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed pt-5">
                  {s.body}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

const PASTORS_TOGETHER = "/assets/leadership-pastors-together.jpg";
const PASTOR_DAVID = "/assets/leadership-pastor-david.jpg";
const PASTOR_AWO = "/assets/leadership-pastor-awo.jpg";

function OurLeadership() {
  return (
    <section className="relative py-20 md:py-28 px-margin-mobile md:px-margin-desktop bg-surface overflow-hidden">
      <div className="absolute -top-32 -left-24 w-[28rem] h-[28rem] rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Heading */}
        <div className="flex flex-col md:flex-row md:items-end gap-6 mb-12 md:mb-16">
          <span
            aria-hidden="true"
            className="font-display-xl text-6xl md:text-8xl leading-none text-primary/25 select-none"
          >
            02
          </span>
          <div>
            <span className="inline-block bg-secondary-container text-on-secondary-container font-label-md px-4 py-1 rounded-2xl border border-on-background/10 mb-4 uppercase tracking-widest">
              Leadership
            </span>
            <h2 className="font-display-lg text-headline-lg md:text-display-lg text-on-background uppercase leading-none">
              Our Leadership
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Image composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl border border-on-background/10 brutalist-shadow-lg overflow-hidden group">
              <img
                src={PASTORS_TOGETHER}
                alt="Pastors David and Awo Antwi"
                loading="lazy"
                decoding="async"
                className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 border-4 border-primary opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
            <div className="flex gap-4 mt-4 md:mt-0 md:absolute md:-bottom-10 md:right-0 md:translate-x-6">
              {[
                { src: PASTOR_DAVID, alt: "Pastor David Antwi" },
                { src: PASTOR_AWO, alt: "Pastor Awo Antwi" },
              ].map((p) => (
                <img
                  key={p.alt}
                  src={p.src}
                  alt={p.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-2xl border border-on-background/10 brutalist-shadow bg-surface"
                />
              ))}
            </div>
          </div>

          {/* Text */}
          <div className="lg:col-span-7 bg-background rounded-2xl border border-on-background/10 brutalist-shadow-lg p-6 md:p-10 mt-12 md:mt-16 lg:mt-0">
            <h3 className="font-display-xl text-3xl md:text-5xl text-on-background uppercase leading-tight mb-2">
              Pastors David &amp; Awo Antwi
            </h3>
            <p className="font-label-md text-primary uppercase tracking-[0.2em] mb-6">
              Lead Pastors
            </p>
            <div className="w-16 h-1.5 bg-primary mb-6"></div>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Pastor David and Awo founded Kharis in 2003, a multifaceted ministry headquartered in London, United Kingdom, with several branches worldwide. Together, they also founded Kharis Phase 2 our students' and young people's services. Kharis also has a presence on university campuses across the UK. Their love for the Word of God is evident in how they lead, teach, and serve. Their greatest desire is to see believers established in their faith, local churches strengthened, and ultimately, for revival to sweep through the nations. They have been married for over 20 years and are blessed with two wonderful children.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-primary text-on-primary font-headline-md px-6 py-3 rounded-2xl vibe-glow transition-all uppercase"
              >
                <span className="material-symbols-outlined">alternate_email</span> Contact
              </Link>
              <a
                href="https://instagram.com/kharisphasetwo"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-secondary-container text-on-secondary-container font-headline-md px-6 py-3 rounded-2xl transition-all uppercase"
              >
                <span className="material-symbols-outlined">share</span> Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


function AboutPage() {
  return (
    <div className="bg-background text-on-surface font-body-md">


<SiteHeader />

<section className="relative h-[921px] w-full flex items-center justify-center overflow-hidden bg-[#06070a] text-white">
  <div className="vibe-mesh absolute inset-0"></div>
  <div className="absolute inset-0 bg-gradient-to-t from-[#06070a] via-transparent to-transparent"></div>
  <div className="relative z-20 text-center px-margin-mobile md:px-margin-desktop max-w-5xl">
    <span className="inline-block rounded-full bg-amber text-[#1a0b00] font-label-md px-4 py-1 mb-6 uppercase tracking-widest">Established to Ignite</span>
    <h1 className="font-display-lg text-headline-lg md:text-display-lg text-primary-fixed-dim uppercase leading-none mb-4">Who We Are</h1>
    <p className="font-body-lg text-body-lg text-white/85 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl max-w-2xl mx-auto mb-8 font-medium px-6 py-4">
      Kharis Phase 2 is a spirit-filled, revival-seeking church led by our Head Pastor, Rev Dr David Antwi. We are young people serving God in a variety of ways, unashamed of Jesus and passionate about seeing the UK live with a genuine passion for Him.
    </p>
    <div className="flex flex-wrap justify-center gap-4">
      <a href="#our-story" className="rounded-2xl bg-amber text-[#1a0b00] font-headline-md px-8 py-4 vibe-glow transition-all flex items-center gap-2">
        OUR STORY <span className="material-symbols-outlined">arrow_forward</span>
      </a>
    </div>
  </div>
</section>

<section className="py-20 md:py-28 px-margin-mobile md:px-margin-desktop bg-background transition-colors duration-300" id="our-story">
<div className="max-w-6xl mx-auto">
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 mb-12">
<div className="bg-surface-container rounded-3xl vibe-card p-8 md:p-10">
<span className="font-label-md text-label-md uppercase tracking-[0.2em] text-primary mb-4 block">Kharis</span>
<h2 className="font-display-lg text-4xl md:text-5xl lg:text-6xl text-on-surface dark:text-[#e8e0e9] mb-3 transition-colors duration-300">χάρις, ιτος, ή</h2>
<p className="font-body-lg text-on-surface dark:text-[#e8e0e9] font-medium transition-colors duration-300">Greek word for Grace</p>
</div>
<div className="bg-surface-container rounded-3xl vibe-card p-8 md:p-10">
<span className="font-label-md text-label-md uppercase tracking-[0.2em] text-primary mb-4 block">Ministries</span>
<h2 className="font-display-lg text-4xl md:text-5xl lg:text-6xl text-on-surface dark:text-[#e8e0e9] mb-3 transition-colors duration-300">λειτουργία, ας, ή</h2>
<p className="font-body-lg text-on-surface dark:text-[#e8e0e9] font-medium transition-colors duration-300">With various services providing units</p>
</div>
</div>
<p className="font-body-lg text-body-lg text-on-surface dark:text-[#e8e0e9] leading-relaxed max-w-4xl transition-colors duration-300">
                    While ministering to the total person, we seek to deepen people’s commitment to God and to spiritual values such as holiness, prayer, evangelism, Christ-centred living, Bible study and fellowship.
                </p>
</div>
</section>

<WhoWeAreBecoming />

<OurLeadership />



<StatementOfFaith />



<SiteFooter />


    </div>
  );
}

export default AboutPage;
