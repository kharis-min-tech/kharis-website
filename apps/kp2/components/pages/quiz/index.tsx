"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  GOOGLE_SHEETS_QUIZ_URL,
  QUIZ_BRANCHES,
  QUIZ_LANGUAGES,
  QUIZ_PRIVACY_CONTENT,
  QUIZ_TRANSLATIONS,
  UPCOMING_LANGUAGES,
  type QuizOption,
  type SupportedLanguage,
} from "@/data/quiz";

export default function DepartmentQuizPage() {
  const [lang, setLang] = useState<SupportedLanguage>("en");
  const [screen, setScreen] = useState<"start" | "quiz" | "result">("start");

  // User input state
  const [name, setName] = useState("");
  const [branch, setBranch] = useState("");
  const [nameError, setNameError] = useState(false);
  const [branchError, setBranchError] = useState(false);

  // Quiz progression state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(QuizOption | null)[]>(new Array(8).fill(null));

  // Results state
  const [scores, setScores] = useState<Record<string, number>>({});
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  // Explore all accordion state
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [expandedExploreDept, setExpandedExploreDept] = useState<string | null>(null);
  const [exploreFilter, setExploreFilter] = useState("");

  // Privacy modal state
  const [showPrivacy, setShowPrivacy] = useState(false);

  const quizCardRef = useRef<HTMLDivElement | null>(null);

  const t = useMemo(() => QUIZ_TRANSLATIONS[lang] ?? QUIZ_TRANSLATIONS.en, [lang]);
  const privacyData = useMemo(() => QUIZ_PRIVACY_CONTENT[lang] ?? QUIZ_PRIVACY_CONTENT.en, [lang]);

  // Validation
  const validateStart = useCallback(() => {
    let valid = true;
    if (!name.trim()) {
      setNameError(true);
      valid = false;
    } else {
      setNameError(false);
    }

    if (!branch) {
      setBranchError(true);
      valid = false;
    } else {
      setBranchError(false);
    }
    return valid;
  }, [name, branch]);

  // Start quiz
  const handleStart = () => {
    if (!validateStart()) return;
    setAnswers(new Array(t.questions.length).fill(null));
    setScores({});
    setCurrentQuestion(0);
    setActiveVideo(null);
    setScreen("quiz");
    if (quizCardRef.current) {
      quizCardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Select option
  const handleSelectOption = (option: QuizOption) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentQuestion] = option;
      return next;
    });
  };

  // Submit to Google Sheets
  const submitToGoogleSheets = useCallback(
    (topMatches: string[]) => {
      try {
        const payload = new FormData();
        payload.append("name", name.trim());
        payload.append("branch", branch);
        payload.append("lang", lang);
        payload.append("dept1", topMatches[0] || "");
        payload.append("dept2", topMatches[1] || "");
        payload.append("dept3", topMatches[2] || "");
        payload.append("timestamp", new Date().toISOString());

        fetch(GOOGLE_SHEETS_QUIZ_URL, {
          method: "POST",
          body: payload,
          mode: "no-cors",
        }).catch(() => {
          // Fire and forget
        });
      } catch {
        // Suppress network errors
      }
    },
    [name, branch, lang]
  );

  // Compute final scores and show results
  const handleFinishQuiz = useCallback(
    (completedAnswers: (QuizOption | null)[]) => {
      const newScores: Record<string, number> = {};
      completedAnswers.forEach((ans) => {
        if (!ans) return;
        ans.departments.forEach((dept) => {
          newScores[dept] = (newScores[dept] || 0) + 1;
        });
      });
      setScores(newScores);

      const top3 = Object.entries(newScores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([dept]) => dept);

      submitToGoogleSheets(top3);
      setScreen("result");
      if (quizCardRef.current) {
        quizCardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [submitToGoogleSheets]
  );

  // Navigation: Next / Finish
  const handleNext = () => {
    if (answers[currentQuestion] === null) return;
    if (currentQuestion < t.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      if (quizCardRef.current) {
        quizCardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      handleFinishQuiz(answers);
    }
  };

  // Navigation: Back
  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    } else {
      setScreen("start");
    }
    if (quizCardRef.current) {
      quizCardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Restart quiz
  const handleRestart = () => {
    setAnswers(new Array(t.questions.length).fill(null));
    setScores({});
    setCurrentQuestion(0);
    setActiveVideo(null);
    setName("");
    setBranch("");
    setNameError(false);
    setBranchError(false);
    setScreen("start");
    if (quizCardRef.current) {
      quizCardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Top 3 departments
  const topThree = useMemo(() => {
    return Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([dept]) => dept);
  }, [scores]);

  // Filtered explore list
  const exploreDepts = useMemo(() => {
    const list = Object.keys(t.departments).sort();
    const q = exploreFilter.trim().toLowerCase();
    if (!q) return list;
    return list.filter((deptName) => {
      const d = t.departments[deptName];
      return (
        deptName.toLowerCase().includes(q) ||
        (d?.desc && d.desc.toLowerCase().includes(q))
      );
    });
  }, [t.departments, exploreFilter]);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showPrivacy) {
        setShowPrivacy(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showPrivacy]);

  return (
    <div className="min-h-screen bg-background font-body-md text-on-background selection:bg-secondary-container">
      <SiteHeader />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b-4 border-primary bg-on-background px-margin-mobile py-12 text-background md:px-margin-desktop md:py-20">
          <div className="halftone-bg pointer-events-none absolute inset-0 opacity-25" />
          <div className="absolute top-0 right-0 h-full w-2/3 bg-gradient-to-l from-primary/25 to-transparent pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-5xl">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <span className="inline-flex items-center gap-2 border-heavy bg-secondary-container px-4 py-1.5 font-label-md uppercase tracking-widest text-on-secondary-container">
                <span className="material-symbols-outlined text-base" aria-hidden="true">
                  psychology_alt
                </span>
                {t.badge}
              </span>

              {/* Language Selector */}
              <div className="flex items-center gap-2">
                <label htmlFor="language-select" className="sr-only">
                  Language
                </label>
                <div className="relative inline-block">
                  <select
                    id="language-select"
                    value={lang}
                    onChange={(e) => setLang(e.target.value as SupportedLanguage)}
                    className="appearance-none rounded-none border-2 border-black bg-surface px-3 py-1.5 pr-8 font-label-md text-xs font-bold uppercase tracking-wide text-on-surface shadow-[3px_3px_0_0_#000] transition-all hover:bg-surface-variant focus:outline-none cursor-pointer"
                  >
                    {QUIZ_LANGUAGES.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.flag} {item.label}
                      </option>
                    ))}
                    <option disabled>────────────</option>
                    {UPCOMING_LANGUAGES.map((item) => (
                      <option key={item.code} value={item.code} disabled>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-sm text-on-surface">
                    arrow_drop_down
                  </span>
                </div>
              </div>
            </div>

            <h1
              className="font-display-lg leading-none uppercase text-primary-fixed-dim"
              style={{ fontSize: "clamp(2.2rem, 1.4rem + 4.5vw, 4rem)" }}
            >
              {t.title}
            </h1>

            <p
              className="mt-4 max-w-2xl font-headline-md text-surface-container-low"
              style={{ fontSize: "clamp(1rem, 0.9rem + 0.5vw, 1.35rem)" }}
            >
              {t.subtitle}
            </p>

            <div className="mt-8 flex gap-3">
              <div className="h-2 w-12 bg-secondary-container" />
              <div className="h-2 w-12 bg-primary" />
              <div className="h-2 w-12 bg-surface" />
            </div>
          </div>
        </section>

        {/* Quiz Flow Card Section */}
        <section
          ref={quizCardRef}
          className="relative z-10 bg-surface px-margin-mobile py-stack-lg md:px-margin-desktop"
        >
          <div className="mx-auto max-w-3xl">
            {/* 1. START SCREEN */}
            {screen === "start" && (
              <div className="relative overflow-hidden border-4 border-black bg-surface-container-lowest p-6 sm:p-10 brutalist-shadow-lg">
                <div className="halftone-bg pointer-events-none absolute top-0 right-0 -mr-12 -mt-12 h-36 w-36 opacity-30" />

                <div className="relative z-10">
                  <div className="mb-6 border-b-2 border-black pb-4">
                    <span className="mb-2 inline-block rounded-none border border-black bg-primary px-3 py-0.5 text-[11px] font-black uppercase tracking-widest text-on-primary">
                      {t.stepBadge}
                    </span>
                    <h2 className="font-display-lg text-2xl sm:text-3xl uppercase leading-tight text-on-surface">
                      {t.startHeading}
                    </h2>
                    <p className="mt-2 text-sm text-on-surface-variant">
                      {t.startDescription}
                    </p>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleStart();
                    }}
                    className="space-y-6"
                  >
                    {/* Full Name Field */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="user-name" className="font-label-md uppercase tracking-wider text-on-surface">
                        {t.nameLabel} <span className="text-error font-bold">*</span>
                      </label>
                      <input
                        id="user-name"
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (nameError) setNameError(false);
                        }}
                        placeholder={t.namePlaceholder}
                        autoComplete="name"
                        aria-required="true"
                        aria-invalid={nameError}
                        className={`w-full rounded-none border-2 border-black bg-surface p-4 font-body-md font-bold text-on-surface input-focus shadow-[3px_3px_0_0_#000] placeholder:font-medium placeholder:text-on-surface-variant/70 ${
                          nameError ? "border-error ring-2 ring-error" : ""
                        }`}
                      />
                      {nameError && (
                        <p className="inline-flex items-center gap-1.5 text-xs font-bold text-error">
                          <span className="material-symbols-outlined text-sm">error</span>
                          {t.nameError}
                        </p>
                      )}
                    </div>

                    {/* Branch Select Field */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="user-branch" className="font-label-md uppercase tracking-wider text-on-surface">
                        {t.branchLabel} <span className="text-error font-bold">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="user-branch"
                          value={branch}
                          onChange={(e) => {
                            setBranch(e.target.value);
                            if (branchError) setBranchError(false);
                          }}
                          aria-required="true"
                          aria-invalid={branchError}
                          className={`w-full appearance-none rounded-none border-2 border-black bg-surface p-4 pr-10 font-body-md font-bold text-on-surface input-focus shadow-[3px_3px_0_0_#000] ${
                            branchError ? "border-error ring-2 ring-error" : ""
                          }`}
                        >
                          <option value="" disabled>
                            {t.branchPlaceholder}
                          </option>
                          {QUIZ_BRANCHES.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                        <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xl text-on-surface">
                          expand_more
                        </span>
                      </div>
                      {branchError && (
                        <p className="inline-flex items-center gap-1.5 text-xs font-bold text-error">
                          <span className="material-symbols-outlined text-sm">error</span>
                          {t.branchError}
                        </p>
                      )}
                    </div>

                    {/* Submit CTA */}
                    <button
                      type="submit"
                      className="group flex w-full items-center justify-center gap-3 rounded-none border-2 border-black bg-primary py-4 px-8 text-center font-display-lg text-xl uppercase tracking-wider text-on-primary shadow-[4px_4px_0_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[2px_2px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                    >
                      <span>{t.startButton}</span>
                      <span className="material-symbols-outlined transition-transform duration-200 group-hover:translate-x-1">
                        arrow_forward
                      </span>
                    </button>

                    {/* Privacy Note */}
                    <div className="text-center pt-2">
                      <p className="text-xs text-on-surface-variant font-medium">
                        {t.privacyAgreement.includes("{policy}") ? (
                          <>
                            {t.privacyAgreement.split("{policy}")[0]}
                            <button
                              type="button"
                              onClick={() => setShowPrivacy(true)}
                              className="font-bold text-primary underline underline-offset-2 hover:text-on-background transition-colors cursor-pointer"
                            >
                              {t.privacyPolicyLink}
                            </button>
                            {t.privacyAgreement.split("{policy}")[1]}
                          </>
                        ) : (
                          <>
                            {t.privacyAgreement}{" "}
                            <button
                              type="button"
                              onClick={() => setShowPrivacy(true)}
                              className="font-bold text-primary underline underline-offset-2 hover:text-on-background transition-colors cursor-pointer"
                            >
                              {t.privacyPolicyLink}
                            </button>
                            .
                          </>
                        )}
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* 2. QUIZ SCREEN */}
            {screen === "quiz" && (
              <div className="relative overflow-hidden border-4 border-black bg-surface-container-lowest p-6 sm:p-10 brutalist-shadow-lg">
                {/* Progress Header */}
                <div className="mb-6">
                  <div className="mb-3 flex items-center justify-between text-xs font-black uppercase tracking-wider text-on-surface">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-primary">
                        quiz
                      </span>
                      {t.questionBadge
                        .replace("{current}", String(currentQuestion + 1))
                        .replace("{total}", String(t.questions.length))}
                    </span>
                    <span className="border border-black bg-secondary-container px-2 py-0.5 text-on-secondary-container font-mono">
                      {Math.round(((currentQuestion + 1) / t.questions.length) * 100)}%
                    </span>
                  </div>

                  <div
                    className="h-3 w-full overflow-hidden rounded-none border-2 border-black bg-surface-container-high"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(((currentQuestion + 1) / t.questions.length) * 100)}
                  >
                    <div
                      className="h-full bg-primary transition-all duration-300 ease-out"
                      style={{
                        width: `${((currentQuestion + 1) / t.questions.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Question & Scripture */}
                <div className="mb-8">
                  <h2 className="font-display-lg text-2xl sm:text-3xl uppercase leading-tight text-on-surface">
                    {t.questions[currentQuestion].q}
                  </h2>
                  <div className="mt-3 flex items-start gap-2.5 border-l-4 border-primary bg-surface-container-low p-3.5">
                    <span className="material-symbols-outlined text-lg text-primary shrink-0" aria-hidden="true">
                      auto_stories
                    </span>
                    <p className="font-body-md text-xs sm:text-sm italic text-on-surface-variant leading-relaxed">
                      {t.questions[currentQuestion].s}
                    </p>
                  </div>
                </div>

                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8" role="group">
                  {t.questions[currentQuestion].options.map((option, idx) => {
                    const isSelected = answers[currentQuestion]?.label === option.label;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectOption(option)}
                        className={`group relative flex items-start gap-3.5 rounded-none border-2 border-black p-4 sm:p-5 text-left transition-all ${
                          isSelected
                            ? "bg-primary text-on-primary shadow-[4px_4px_0_0_#000] scale-[1.01] ring-2 ring-black"
                            : "bg-surface text-on-surface shadow-[4px_4px_0_0_#000] hover:bg-surface-variant hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5"
                        }`}
                      >
                        <span
                          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-none border-2 border-black text-xs font-black transition-colors ${
                            isSelected
                              ? "bg-secondary-container text-on-secondary-container"
                              : "bg-surface text-on-surface group-hover:bg-surface-container-high"
                          }`}
                        >
                          {isSelected ? (
                            <span className="material-symbols-outlined text-sm font-black">check</span>
                          ) : (
                            String.fromCharCode(65 + idx)
                          )}
                        </span>
                        <span className="font-body-md text-sm sm:text-base font-bold leading-snug">
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center justify-between gap-4 border-t-2 border-black pt-6">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-1.5 rounded-none border-2 border-black bg-surface-container-high px-5 py-3 font-bold uppercase tracking-wider text-on-surface shadow-[3px_3px_0_0_#000] transition-all hover:bg-surface-variant active:translate-x-0.5 active:translate-y-0.5"
                  >
                    <span className="material-symbols-outlined text-base">arrow_back</span>
                    <span>{t.backButton}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={answers[currentQuestion] === null}
                    className={`inline-flex items-center gap-2 rounded-none border-2 border-black bg-primary px-7 py-3 font-display-lg text-lg uppercase tracking-wider text-on-primary shadow-[4px_4px_0_0_#000] transition-all ${
                      answers[currentQuestion] === null
                        ? "opacity-40 cursor-not-allowed shadow-none"
                        : "hover:shadow-[2px_2px_0_0_#000] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                    }`}
                  >
                    <span>
                      {currentQuestion === t.questions.length - 1
                        ? t.finishButton
                        : t.nextButton}
                    </span>
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}

            {/* 3. RESULTS SCREEN */}
            {screen === "result" && (
              <div className="space-y-8">
                {/* Result Heading Banner */}
                <div className="relative overflow-hidden border-4 border-black bg-surface-container-lowest p-6 sm:p-8 brutalist-shadow-lg">
                  <div className="halftone-bg pointer-events-none absolute top-0 right-0 -mr-10 -mt-10 h-32 w-32 opacity-25" />
                  <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="mb-2 inline-flex items-center gap-1.5 border border-black bg-secondary-container px-3 py-1 text-xs font-black uppercase tracking-wider text-on-secondary-container">
                        <span className="material-symbols-outlined text-sm">stars</span>
                        {t.discoveryCompleted}
                      </span>
                      <h2 className="font-display-lg text-2xl sm:text-3xl uppercase leading-tight text-on-surface">
                        {t.resultsTitle.replace(
                          "{name}",
                          name.trim() || (lang === "de" ? "Freund" : lang === "fr" ? "Ami(e)" : lang === "es" ? "Amigo(a)" : "Friend")
                        )}
                      </h2>
                      <p className="mt-1 text-sm text-on-surface-variant">
                        {t.resultsSubtitle}
                      </p>
                    </div>

                    <div className="border-2 border-black bg-surface px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-on-surface">
                      📍 {branch || "Kharis Church"}
                    </div>
                  </div>
                </div>

                {/* Top Match (#1 Hero Card) */}
                {topThree[0] && t.departments[topThree[0]] && (
                  <div className="relative overflow-hidden border-4 border-black bg-surface-container-lowest p-6 sm:p-8 brutalist-shadow-lg">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-none border-2 border-black bg-secondary-container px-3.5 py-1 text-xs font-black uppercase tracking-widest text-on-secondary-container shadow-[2px_2px_0_0_#000]">
                        <span className="material-symbols-outlined text-sm">emoji_events</span>
                        {t.topMatchBadge}
                      </span>
                      <span className="text-xs font-mono font-bold uppercase text-on-surface-variant">
                        {t.highestCompatibility}
                      </span>
                    </div>

                    <h3 className="font-display-lg text-3xl sm:text-4xl uppercase leading-none text-on-surface mb-3">
                      {topThree[0]}
                    </h3>

                    <p className="font-body-md text-sm sm:text-base text-on-surface-variant leading-relaxed mb-4">
                      {t.departments[topThree[0]].desc}
                    </p>

                    <div className="mb-6 flex items-start gap-2.5 border-l-4 border-primary bg-surface-container-low p-3.5">
                      <span className="material-symbols-outlined text-base text-primary shrink-0">
                        format_quote
                      </span>
                      <p className="font-body-md text-xs sm:text-sm italic text-on-surface-variant">
                        {t.departments[topThree[0]].scripture}
                      </p>
                    </div>

                    {/* Top Dept Video Facade / Player */}
                    <div className="relative aspect-video w-full overflow-hidden rounded-none border-2 border-black bg-black shadow-[4px_4px_0_0_#000]">
                      {activeVideo === topThree[0] ? (
                        <iframe
                          src={`${t.departments[topThree[0]].video}?autoplay=1`}
                          title={`${topThree[0]} Department Overview`}
                          allow="autoplay; fullscreen"
                          allowFullScreen
                          className="h-full w-full border-0"
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => setActiveVideo(topThree[0])}
                          className="group relative flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-on-background p-6 text-center cursor-pointer"
                          aria-label={`Play ${topThree[0]} department video`}
                        >
                          <div className="halftone-bg pointer-events-none absolute inset-0 opacity-20" />
                          <div className="relative z-10 flex flex-col items-center gap-3">
                            <span className="flex h-16 w-16 items-center justify-center rounded-none border-2 border-black bg-secondary-container text-on-secondary-container shadow-[4px_4px_0_0_#000] transition-transform duration-200 group-hover:scale-110">
                              <span className="material-symbols-outlined text-3xl">play_arrow</span>
                            </span>
                            <span className="border border-black bg-black/80 px-3 py-1 font-label-md text-xs uppercase tracking-wider text-white">
                              {t.watchSpotlight.replace("{dept}", topThree[0])}
                            </span>
                          </div>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Secondary Matches (#2 and #3) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {topThree.slice(1, 3).map((deptName, idx) => {
                    const dept = t.departments[deptName];
                    if (!dept) return null;
                    const rankNum = idx + 2;
                    return (
                      <div
                        key={deptName}
                        className="flex flex-col justify-between overflow-hidden rounded-none border-2 border-black bg-surface-container-lowest p-5 sm:p-6 brutalist-shadow"
                      >
                        <div>
                          <div className="mb-3 flex items-center justify-between">
                            <span className="rounded-none border border-black bg-surface-container-high px-2.5 py-0.5 text-xs font-black uppercase tracking-wider text-on-surface">
                              {t.matchRank.replace("{rank}", String(rankNum))}
                            </span>
                          </div>

                          <h4 className="font-display-lg text-xl sm:text-2xl uppercase leading-tight text-on-surface mb-2">
                            {deptName}
                          </h4>

                          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-3">
                            {dept.desc}
                          </p>

                          <p className="text-xs italic text-on-surface-variant/80 border-l-2 border-secondary pl-2 mb-4">
                            {dept.scripture}
                          </p>
                        </div>

                        {/* Video facade */}
                        <div className="relative aspect-video w-full overflow-hidden rounded-none border-2 border-black bg-black mt-2">
                          {activeVideo === deptName ? (
                            <iframe
                              src={`${dept.video}?autoplay=1`}
                              title={`${deptName} Video`}
                              allow="autoplay; fullscreen"
                              allowFullScreen
                              className="h-full w-full border-0"
                            />
                          ) : (
                            <button
                              type="button"
                              onClick={() => setActiveVideo(deptName)}
                              className="group relative flex h-full w-full items-center justify-center bg-gradient-to-br from-surface-container-high to-surface-container-lowest p-4 text-center cursor-pointer"
                              aria-label={`Play ${deptName} department video`}
                            >
                              <div className="flex items-center gap-2 rounded-none border border-black bg-on-background px-3 py-1.5 text-xs font-bold uppercase text-surface shadow-[2px_2px_0_0_#000] group-hover:bg-primary transition-colors">
                                <span className="material-symbols-outlined text-sm">play_arrow</span>
                                <span>{t.previewVideo}</span>
                              </div>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explore All Departments Accordion */}
                <div className="overflow-hidden border-4 border-black bg-surface-container-lowest brutalist-shadow-lg">
                  <button
                    type="button"
                    onClick={() => setIsExploreOpen((prev) => !prev)}
                    className="flex w-full items-center justify-between bg-surface p-5 text-left font-display-lg text-xl uppercase tracking-wider text-on-surface hover:bg-surface-variant transition-colors"
                  >
                    <span className="inline-flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">apps</span>
                      {t.exploreButton} ({Object.keys(t.departments).length})
                    </span>
                    <span
                      className={`material-symbols-outlined transition-transform duration-300 text-2xl ${
                        isExploreOpen ? "rotate-180 text-primary" : ""
                      }`}
                    >
                      expand_more
                    </span>
                  </button>

                  {isExploreOpen && (
                    <div className="border-t-2 border-black p-5 sm:p-6 bg-surface-container-low">
                      {/* Search in explore */}
                      <div className="mb-4">
                        <label htmlFor="explore-search" className="sr-only">
                          Search departments
                        </label>
                        <div className="relative">
                          <input
                            id="explore-search"
                            type="search"
                            value={exploreFilter}
                            onChange={(e) => setExploreFilter(e.target.value)}
                            placeholder={t.filterDepartmentsPlaceholder}
                            className="w-full rounded-none border-2 border-black bg-surface px-4 py-2.5 pl-10 text-xs sm:text-sm font-bold text-on-surface input-focus shadow-[2px_2px_0_0_#000]"
                          />
                          <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant">
                            search
                          </span>
                        </div>
                      </div>

                      {/* Department Accordion List */}
                      <div className="divide-y-2 divide-black border-2 border-black bg-surface">
                        {exploreDepts.map((deptName) => {
                          const dept = t.departments[deptName];
                          const isExpanded = expandedExploreDept === deptName;
                          return (
                            <div key={deptName}>
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedExploreDept((prev) =>
                                    prev === deptName ? null : deptName
                                  )
                                }
                                className="flex w-full items-center justify-between p-3.5 text-left font-headline-md text-sm font-black uppercase text-on-surface hover:bg-surface-variant transition-colors"
                              >
                                <span className="inline-flex items-center gap-2">
                                  <span className="material-symbols-outlined text-sm text-primary">
                                    arrow_right
                                  </span>
                                  {deptName}
                                </span>
                                <span
                                  className={`material-symbols-outlined text-lg transition-transform ${
                                    isExpanded ? "rotate-180 text-primary" : ""
                                  }`}
                                >
                                  expand_more
                                </span>
                              </button>

                              {isExpanded && (
                                <div className="border-t border-black/20 bg-surface-container-lowest p-4 text-xs sm:text-sm text-on-surface-variant space-y-3">
                                  <p className="leading-relaxed">{dept.desc}</p>
                                  <p className="italic text-on-surface-variant/80 border-l-2 border-primary pl-2">
                                    {dept.scripture}
                                  </p>

                                  <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-none border-2 border-black bg-black mt-2">
                                    {activeVideo === `explore-${deptName}` ? (
                                      <iframe
                                        src={`${dept.video}?autoplay=1`}
                                        title={`${deptName} Video`}
                                        allow="autoplay; fullscreen"
                                        allowFullScreen
                                        className="h-full w-full border-0"
                                      />
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => setActiveVideo(`explore-${deptName}`)}
                                        className="group relative flex h-full w-full items-center justify-center bg-gradient-to-br from-surface-container-high to-surface-container-lowest p-4 text-center cursor-pointer"
                                      >
                                        <div className="flex items-center gap-2 rounded-none border border-black bg-on-background px-3 py-1.5 text-xs font-bold uppercase text-surface shadow-[2px_2px_0_0_#000] group-hover:bg-primary transition-colors">
                                          <span className="material-symbols-outlined text-sm">play_arrow</span>
                                          <span>{t.playDeptVideo.replace("{dept}", deptName)}</span>
                                        </div>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Final Actions / Call to Action */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-4 border-black bg-surface p-6 sm:p-8 brutalist-shadow-lg">
                  <div>
                    <h3 className="font-display-lg text-xl uppercase leading-tight text-on-surface">
                      {t.nextStepTitle}
                    </h3>
                    <p className="mt-1 text-sm text-on-surface-variant">
                      {t.nextStepSubtitle}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleRestart}
                      className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-none border-2 border-black bg-surface-container-high px-5 py-3 font-headline-md text-sm uppercase tracking-wider text-on-surface shadow-[3px_3px_0_0_#000] hover:bg-surface-variant active:translate-x-0.5 active:translate-y-0.5 transition-all"
                    >
                      <span className="material-symbols-outlined text-base">restart_alt</span>
                      <span>{t.restartButton}</span>
                    </button>

                    <Link
                      href="/branches"
                      className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-none border-2 border-black bg-primary px-6 py-3 font-display-lg text-sm uppercase tracking-wider text-on-primary shadow-[4px_4px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all"
                    >
                      <span>{t.findBranchButton}</span>
                      <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Privacy Policy Modal */}
      {showPrivacy && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="privacy-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setShowPrivacy(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-none border-4 border-black bg-surface text-on-surface brutalist-shadow-lg overflow-hidden animate-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b-2 border-black bg-primary px-6 py-4 text-on-primary">
              <div>
                <h3 id="privacy-modal-title" className="font-display-lg text-2xl uppercase leading-none">
                  {privacyData.title}
                </h3>
                <p className="mt-1 text-xs text-on-primary/80 font-mono">
                  {privacyData.subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPrivacy(false)}
                className="flex h-9 w-9 items-center justify-center rounded-none border-2 border-black bg-surface text-on-surface shadow-[2px_2px_0_0_#000] hover:bg-surface-variant active:translate-x-0.5 active:translate-y-0.5"
                aria-label={privacyData.backButton || "Close"}
              >
                <span className="material-symbols-outlined font-black">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-6 space-y-6 text-sm text-on-surface-variant font-body-md">
              {privacyData.sections.map((section, idx) => (
                <div key={idx} className="space-y-3">
                  <h4 className="flex items-center gap-2 font-headline-md text-base uppercase text-on-surface border-b border-black/20 pb-1">
                    <span className="material-symbols-outlined text-primary text-lg">
                      {section.icon}
                    </span>
                    {section.heading}
                  </h4>

                  {section.paragraphs?.map((p, pIdx) => (
                    <p key={pIdx} className="leading-relaxed">
                      {p}
                    </p>
                  ))}

                  {section.subsections?.map((sub, sIdx) => (
                    <div key={sIdx} className="pl-2 space-y-1">
                      <p className="font-bold text-on-surface">{sub.title}</p>
                      <ul className="list-disc pl-5 space-y-1">
                        {sub.items.map((item, iIdx) => (
                          <li key={iIdx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  {section.items && (
                    <ul className="list-disc pl-5 space-y-1">
                      {section.items.map((item, iIdx) => (
                        <li key={iIdx}>{item}</li>
                      ))}
                    </ul>
                  )}

                  {section.contact && (
                    <div className="border-l-4 border-primary bg-surface-container-low p-3 font-medium space-y-1">
                      <p className="font-bold text-on-surface">{section.contact.officer}</p>
                      <p>
                        Email:{" "}
                        <a
                          href={`mailto:${section.contact.email}`}
                          className="text-primary underline hover:text-primary-deep"
                        >
                          {section.contact.email}
                        </a>
                      </p>
                    </div>
                  )}
                </div>
              ))}

              <p className="text-center text-xs italic text-on-surface-variant/70 pt-4 border-t border-black/20">
                {privacyData.lastUpdated}
              </p>
            </div>

            {/* Modal Footer */}
            <div className="border-t-2 border-black bg-surface-container-high p-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPrivacy(false)}
                className="rounded-none border-2 border-black bg-primary px-6 py-2.5 font-headline-md text-xs uppercase tracking-wider text-on-primary shadow-[2px_2px_0_0_#000] hover:shadow-[1px_1px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5"
              >
                {privacyData.backButton}
              </button>
            </div>
          </div>
        </div>
      )}

      <SiteFooter />
      <ThemeToggle />
    </div>
  );
}

