"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Compass,
  Grid,
  Info,
  Lock,
  Mail,
  MapPin,
  Play,
  Quote,
  RotateCcw,
  Search,
  Settings,
  Shield,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import {
  GOOGLE_SHEETS_QUIZ_URL,
  QUIZ_BRANCHES,
  QUIZ_LANGUAGES,
  QUIZ_PRIVACY_CONTENT,
  QUIZ_SLIDESHOW_IMAGES,
  QUIZ_TRANSLATIONS,
  UPCOMING_LANGUAGES,
  type PrivacySection,
  type PrivacySubsection,
  type QuizOption,
  type SupportedLanguage,
} from "@/data/quiz";
import { getSiteTheme, subscribeSiteTheme, type SiteTheme } from "@/lib/theme";
import { useDialog } from "@/lib/use-dialog";
import "./quiz.css";

export function QuizExperience() {
  const [lang, setLang] = useState<SupportedLanguage>("en");
  const [screen, setScreen] = useState<"start" | "quiz" | "result">("start");
  const [activeSlide, setActiveSlide] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  // Site theme subscription (light vs dark mode)
  const theme = useSyncExternalStore(subscribeSiteTheme, getSiteTheme, () => "light" as SiteTheme);
  const isDark = theme === "dark";

  // User details state
  const [branch, setBranch] = useState("");
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

  // Privacy modal state + accessible focus management
  const [showPrivacy, setShowPrivacy] = useState(false);
  const closePrivacy = useCallback(() => setShowPrivacy(false), []);
  const privacyDialogRef = useDialog(showPrivacy, closePrivacy);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const t = useMemo(() => QUIZ_TRANSLATIONS[lang] ?? QUIZ_TRANSLATIONS.en, [lang]);
  const privacyData = useMemo(() => QUIZ_PRIVACY_CONTENT[lang] ?? QUIZ_PRIVACY_CONTENT.en, [lang]);

  // Background slideshow rotation (8s per slide, cycles through all 9 mixed slides before repeating)
  useEffect(() => {
    if (prefersReducedMotion || QUIZ_SLIDESHOW_IMAGES.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % QUIZ_SLIDESHOW_IMAGES.length);
    }, 8000);
    return () => window.clearInterval(timer);
  }, [prefersReducedMotion]);

  // Validation
  const validateStart = useCallback(() => {
    if (!branch) {
      setBranchError(true);
      return false;
    }
    setBranchError(false);
    return true;
  }, [branch]);

  // Start quiz
  const handleStart = () => {
    if (!validateStart()) return;
    setAnswers(new Array(t.questions.length).fill(null));
    setScores({});
    setCurrentQuestion(0);
    setActiveVideo(null);
    setScreen("quiz");
    if (containerRef.current) {
      containerRef.current.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    }
  };

  // Option selection
  const handleSelectOption = (option: QuizOption) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentQuestion] = option;
      return next;
    });
  };

  // Google Sheets submission
  const submitToGoogleSheets = useCallback(
    (topMatches: string[]) => {
      // Local preview completions should not add test records to the live results sheet.
      if (process.env.NODE_ENV !== "production") return;
      try {
        const payload = new FormData();
        payload.append("name", "Anonymous");
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
    [branch, lang],
  );

  // Finish quiz & calculate scores
  const handleFinishQuiz = useCallback(
    (completedAnswers: (QuizOption | null)[]) => {
      const newScores: Record<string, number> = {};
      completedAnswers.forEach((ans) => {
        if (!ans) return;
        ans.departments.forEach((dept: string) => {
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
      if (containerRef.current) {
        containerRef.current.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        });
      }
    },
    [submitToGoogleSheets, prefersReducedMotion],
  );

  // Navigation handlers
  const handleNext = () => {
    if (answers[currentQuestion] === null) return;
    if (currentQuestion < t.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      if (containerRef.current) {
        containerRef.current.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        });
      }
    } else {
      handleFinishQuiz(answers);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    } else {
      setScreen("start");
    }
    if (containerRef.current) {
      containerRef.current.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    }
  };

  const handleRestart = () => {
    setAnswers(new Array(t.questions.length).fill(null));
    setScores({});
    setCurrentQuestion(0);
    setActiveVideo(null);
    setBranch("");
    setBranchError(false);
    setScreen("start");
    if (containerRef.current) {
      containerRef.current.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    }
  };

  // Top 3 sorted
  const topThree = useMemo(() => {
    return Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([dept]) => dept);
  }, [scores]);

  // Explore search (matches canonical name, localized title, or description)
  const exploreDepts = useMemo(() => {
    const list = Object.keys(t.departments).sort((a, b) => {
      const labelA = t.departments[a]?.title ?? a;
      const labelB = t.departments[b]?.title ?? b;
      return labelA.localeCompare(labelB);
    });
    const q = exploreFilter.trim().toLowerCase();
    if (!q) return list;
    return list.filter((deptName) => {
      const d = t.departments[deptName];
      const displayTitle = d?.title ?? deptName;
      return (
        deptName.toLowerCase().includes(q) ||
        displayTitle.toLowerCase().includes(q) ||
        (d?.desc && d.desc.toLowerCase().includes(q))
      );
    });
  }, [t.departments, exploreFilter]);

  return (
    <div
      className={`quiz-page relative min-h-screen transition-colors duration-300 selection:bg-[#630ed4]/25 ${
        isDark
          ? "bg-[#090512] text-white selection:text-white"
          : "bg-[#f8f6fa] text-[#1c1c1f] selection:text-[#1c1c1f]"
      }`}
    >
      {/* Hero: KP2-style full-bleed photo slideshow header */}
      <header className="quiz-hero">
        <div className="quiz-hero__media">
          {QUIZ_SLIDESHOW_IMAGES.map((slide, idx) => (
            <Image
              key={slide.src}
              src={slide.src}
              alt={idx === activeSlide ? slide.alt : ""}
              aria-hidden={idx !== activeSlide}
              fill
              priority={idx === 0}
              quality={95}
              sizes="100vw"
              unoptimized={slide.src.startsWith("/")}
              className={`quiz-hero__img ${idx === activeSlide ? "is-active" : ""}`}
              style={{ objectPosition: slide.position }}
            />
          ))}
          <div className="quiz-hero__veil" aria-hidden="true" />
        </div>

        <div className="quiz-hero__inner">
          <Reveal variant="blur">
            <div className="quiz-hero__top">
              <span className="quiz-hero__badge">
                <Compass className="h-3.5 w-3.5" aria-hidden="true" />
                {t.badge}
              </span>

              {/* Language Selector */}
              <div className="quiz-hero__lang">
                <select
                  id="main-quiz-language"
                  aria-label="Select quiz language"
                  value={lang}
                  onChange={(e) => setLang(e.target.value as SupportedLanguage)}
                >
                  {QUIZ_LANGUAGES.map(
                    (item: { code: SupportedLanguage; label: string; flag: string }) => (
                      <option key={item.code} value={item.code}>
                        {item.flag} {item.label}
                      </option>
                    ),
                  )}
                  <option disabled>────────────</option>
                  {UPCOMING_LANGUAGES.map((item: { code: string; label: string }) => (
                    <option key={item.code} value={item.code} disabled>
                      {item.label}
                    </option>
                  ))}
                </select>
                <ChevronDown aria-hidden="true" />
              </div>
            </div>

            <h1 className="quiz-hero__title">{t.title}</h1>
            <p className="quiz-hero__subtitle">{t.subtitle}</p>
          </Reveal>
        </div>
      </header>

      <div className="relative z-10 py-12 sm:py-16">
        {/* Quiz Flow Card Section */}
        <section id="quiz-card" ref={containerRef} className="quiz-card-section px-5 md:px-8">
          <div className="mx-auto max-w-3xl">
            {/* 1. START SCREEN */}
            {screen === "start" && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className={`relative border p-7 sm:p-11 overflow-hidden transition-colors ${
                  isDark
                    ? "border-white/15 bg-[#120b1f] shadow-[0_24px_60px_rgba(0,0,0,0.55)] text-white"
                    : "border-purple-900/15 bg-white shadow-[0_18px_50px_rgba(40,10,80,0.1)] text-[#1c1c1f]"
                }`}
              >
                {/* Subtle purple corner glow */}
                <div
                  className={`pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl ${
                    isDark ? "bg-[#630ed4]/25" : "bg-[#630ed4]/10"
                  }`}
                />

                <div className="relative z-10">
                  <div
                    className={`mb-7 pb-6 border-b ${
                      isDark ? "border-white/12" : "border-purple-900/12"
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5 bg-[#630ed4] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-white mb-3">
                      {t.stepBadge}
                    </span>
                    <h2
                      className={`text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight ${
                        isDark ? "!text-white" : "!text-[#1c1c1f]"
                      }`}
                    >
                      {t.startHeading}
                    </h2>
                    <p
                      className={`mt-2 text-sm sm:text-base leading-relaxed ${
                        isDark ? "text-white/70" : "text-[#4a4a52]"
                      }`}
                    >
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
                    {/* Branch Select */}
                    <div className="space-y-2">
                      <label
                        htmlFor="user-branch-select"
                        className={`block text-xs font-extrabold uppercase tracking-[0.12em] ${
                          isDark ? "text-white/85" : "text-[#1c1c1f]"
                        }`}
                      >
                        {t.branchLabel}{" "}
                        <span className={isDark ? "text-[#c4b0ff]" : "text-[#630ed4]"}>*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="user-branch-select"
                          value={branch}
                          onChange={(e) => {
                            setBranch(e.target.value);
                            if (branchError) setBranchError(false);
                          }}
                          aria-required="true"
                          aria-invalid={branchError}
                          className={`w-full appearance-none rounded-none border px-4 py-3.5 pr-10 text-sm sm:text-base font-bold transition-all focus:outline-none focus:ring-2 focus:ring-[#630ed4]/40 cursor-pointer ${
                            isDark ? "bg-white/[0.04] text-white" : "bg-[#f8f6fa] text-[#1c1c1f]"
                          } ${
                            branchError
                              ? "border-rose-500 ring-2 ring-rose-500/30"
                              : isDark
                                ? "border-white/20 hover:border-white/35 focus:border-[#630ed4]"
                                : "border-purple-900/20 hover:border-[#630ed4] focus:border-[#630ed4]"
                          }`}
                        >
                          <option
                            value=""
                            disabled
                            className={
                              isDark ? "bg-[#151022] text-white/40" : "bg-white text-gray-400"
                            }
                          >
                            {t.branchPlaceholder}
                          </option>
                          {QUIZ_BRANCHES.map((b: string) => (
                            <option
                              key={b}
                              value={b}
                              className={
                                isDark ? "bg-[#151022] text-white" : "bg-white text-[#1c1c1f]"
                              }
                            >
                              {b}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 ${
                            isDark ? "text-white/70" : "text-[#3a3a40]"
                          }`}
                        />
                      </div>
                      {branchError && (
                        <p className="flex items-center gap-1.5 text-xs font-bold text-rose-500 pt-1">
                          <AlertCircle className="h-3.5 w-3.5" />
                          {t.branchError}
                        </p>
                      )}
                    </div>

                    {/* Submit CTA Button */}
                    <button type="submit" className="quiz-btn-primary group w-full mt-4">
                      <span>{t.startButton}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>

                    {/* Privacy Note */}
                    <div className="pt-2 text-center">
                      <p
                        className={`text-xs font-semibold ${
                          isDark ? "text-white/55" : "text-[#4a4a52]"
                        }`}
                      >
                        {t.privacyAgreement.includes("{policy}") ? (
                          <>
                            {t.privacyAgreement.split("{policy}")[0]}
                            <button
                              type="button"
                              onClick={() => setShowPrivacy(true)}
                              className={`font-extrabold underline underline-offset-2 transition-colors cursor-pointer ${
                                isDark
                                  ? "text-[#c4b0ff] hover:text-white"
                                  : "text-[#630ed4] hover:text-[#4c08a8]"
                              }`}
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
                              className={`font-extrabold underline underline-offset-2 transition-colors cursor-pointer ${
                                isDark
                                  ? "text-[#c4b0ff] hover:text-white"
                                  : "text-[#630ed4] hover:text-[#4c08a8]"
                              }`}
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
              </motion.div>
            )}

            {/* 2. QUIZ QUESTIONS SCREEN */}
            {screen === "quiz" && (
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className={`relative border p-7 sm:p-11 overflow-hidden transition-colors ${
                  isDark
                    ? "border-white/15 bg-[#120b1f] shadow-[0_24px_60px_rgba(0,0,0,0.55)] text-white"
                    : "border-purple-900/15 bg-white shadow-[0_18px_50px_rgba(40,10,80,0.1)] text-[#1c1c1f]"
                }`}
              >
                {/* Progress Header */}
                <div className="mb-7">
                  <div
                    className={`mb-3 flex items-center justify-between text-xs font-extrabold uppercase tracking-[0.12em] ${
                      isDark ? "text-white/75" : "text-[#3a3a40]"
                    }`}
                  >
                    <span
                      className={`inline-flex items-center gap-1.5 ${
                        isDark ? "text-[#c4b0ff]" : "text-[#630ed4]"
                      }`}
                    >
                      <Compass className="h-4 w-4" />
                      {t.questionBadge
                        .replace("{current}", String(currentQuestion + 1))
                        .replace("{total}", String(t.questions.length))}
                    </span>
                    <span
                      className={`border px-2.5 py-0.5 text-xs font-extrabold ${
                        isDark
                          ? "border-purple-400/30 bg-purple-500/15 text-[#c4b0ff]"
                          : "border-purple-900/15 bg-[#f2eef7] text-[#630ed4]"
                      }`}
                    >
                      {Math.round(((currentQuestion + 1) / t.questions.length) * 100)}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div
                    className={`h-2.5 w-full overflow-hidden border ${
                      isDark ? "border-white/15 bg-white/10" : "border-purple-900/15 bg-[#f2eef7]"
                    }`}
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(((currentQuestion + 1) / t.questions.length) * 100)}
                  >
                    <div
                      className="h-full bg-[#630ed4] transition-all duration-300 ease-out"
                      style={{
                        width: `${((currentQuestion + 1) / t.questions.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Question & Scripture */}
                <div className="mb-8">
                  <h2
                    className={`text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight ${
                      isDark ? "!text-white" : "!text-[#1c1c1f]"
                    }`}
                  >
                    {t.questions[currentQuestion].q}
                  </h2>

                  <div
                    className={`mt-4 flex items-start gap-3 border-l-4 border-[#630ed4] p-4 ${
                      isDark ? "bg-purple-500/[0.08]" : "bg-[#f2eef7]"
                    }`}
                  >
                    <BookOpen
                      className={`h-5 w-5 shrink-0 mt-0.5 ${
                        isDark ? "text-[#c4b0ff]" : "text-[#630ed4]"
                      }`}
                    />
                    <p
                      className={`text-xs sm:text-sm leading-relaxed font-semibold ${
                        isDark ? "text-purple-100/90" : "text-[#3a3a40]"
                      }`}
                    >
                      {t.questions[currentQuestion].s}
                    </p>
                  </div>
                </div>

                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8" role="group">
                  {t.questions[currentQuestion].options.map((option: QuizOption, idx: number) => {
                    const isSelected = answers[currentQuestion]?.label === option.label;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectOption(option)}
                        className={`group relative flex items-start gap-3.5 border p-4 sm:p-5 text-left transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#630ed4] bg-[#630ed4] text-white shadow-[0_12px_28px_rgba(99,14,212,0.28)] scale-[1.01]"
                            : isDark
                              ? "border-white/15 bg-white/[0.03] text-white/90 hover:border-[#c4b0ff]/50 hover:bg-white/[0.07] hover:-translate-y-0.5"
                              : "border-purple-900/15 bg-[#f8f6fa] text-[#1c1c1f] hover:border-[#630ed4] hover:bg-[#f2eef7] hover:-translate-y-0.5"
                        }`}
                      >
                        <span
                          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border text-xs font-extrabold transition-all ${
                            isSelected
                              ? "border-white bg-white text-[#630ed4]"
                              : isDark
                                ? "border-white/25 bg-white/10 text-white group-hover:border-[#c4b0ff] group-hover:bg-[#630ed4]"
                                : "border-purple-900/20 bg-white text-[#630ed4] group-hover:border-[#630ed4] group-hover:bg-[#630ed4] group-hover:text-white"
                          }`}
                        >
                          {isSelected ? (
                            <Check className="h-3.5 w-3.5 stroke-[3]" />
                          ) : (
                            String.fromCharCode(65 + idx)
                          )}
                        </span>
                        <span className="text-sm sm:text-base font-bold leading-snug">
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Nav Controls */}
                <div
                  className={`flex items-center justify-between gap-4 border-t pt-6 ${
                    isDark ? "border-white/12" : "border-purple-900/12"
                  }`}
                >
                  <button type="button" onClick={handleBack} className="quiz-btn-secondary">
                    <ArrowLeft className="h-4 w-4" />
                    <span>{t.backButton}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={answers[currentQuestion] === null}
                    className="quiz-btn-primary"
                  >
                    <span>
                      {currentQuestion === t.questions.length - 1 ? t.finishButton : t.nextButton}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* 3. RESULTS SCREEN */}
            {screen === "result" && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="space-y-8"
              >
                {/* Result Heading Banner */}
                <div
                  className={`relative border p-7 sm:p-9 overflow-hidden ${
                    isDark
                      ? "border-white/15 bg-[#120b1f] shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-white"
                      : "border-purple-900/15 bg-white shadow-[0_18px_50px_rgba(40,10,80,0.1)] text-[#1c1c1f]"
                  }`}
                >
                  <div
                    className={`pointer-events-none absolute top-0 right-0 h-40 w-40 rounded-full blur-3xl ${
                      isDark ? "bg-[#630ed4]/25" : "bg-[#630ed4]/10"
                    }`}
                  />

                  <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="inline-flex items-center gap-1.5 bg-[#630ed4] px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] text-white mb-2.5">
                        <Sparkles className="h-3.5 w-3.5" />
                        {t.discoveryCompleted}
                      </span>
                      <h2
                        className={`text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight ${
                          isDark ? "!text-white" : "!text-[#1c1c1f]"
                        }`}
                      >
                        {t.resultsTitle}
                      </h2>
                      <p
                        className={`mt-2 text-sm sm:text-base ${
                          isDark ? "text-white/70" : "text-[#4a4a52]"
                        }`}
                      >
                        {t.resultsSubtitle}
                      </p>
                    </div>

                    <div
                      className={`inline-flex items-center gap-1.5 border px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider ${
                        isDark
                          ? "border-white/20 bg-white/5 text-white"
                          : "border-purple-900/15 bg-[#f2eef7] text-[#630ed4]"
                      }`}
                    >
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{branch || "Kharis Church"}</span>
                    </div>
                  </div>
                </div>

                {/* Top Match (#1 Hero Spotlight Card) */}
                {topThree[0] && t.departments[topThree[0]] && (
                  <div
                    className={`relative border-2 p-7 sm:p-9 overflow-hidden ${
                      isDark
                        ? "border-[#630ed4] bg-[#150c28] shadow-[0_24px_60px_rgba(99,14,212,0.22)] text-white"
                        : "border-[#630ed4] bg-white shadow-[0_20px_50px_rgba(99,14,212,0.12)] text-[#1c1c1f]"
                    }`}
                  >
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 bg-[#630ed4] px-3.5 py-1 text-xs font-extrabold uppercase tracking-[0.14em] text-white shadow-sm">
                        <Trophy className="h-3.5 w-3.5" />
                        {t.topMatchBadge}
                      </span>
                      <span
                        className={`text-xs font-extrabold uppercase tracking-wider ${
                          isDark ? "text-[#c4b0ff]" : "text-[#630ed4]"
                        }`}
                      >
                        {t.highestCompatibility}
                      </span>
                    </div>

                    <h3
                      className={`text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 ${
                        isDark ? "!text-white" : "!text-[#1c1c1f]"
                      }`}
                    >
                      {t.departments[topThree[0]].title ?? topThree[0]}
                    </h3>

                    <p
                      className={`text-sm sm:text-base leading-relaxed mb-5 ${
                        isDark ? "text-white/80" : "text-[#4a4a52]"
                      }`}
                    >
                      {t.departments[topThree[0]].desc}
                    </p>

                    <div
                      className={`mb-6 flex items-start gap-3 border-l-4 border-[#630ed4] p-4 ${
                        isDark ? "bg-white/[0.04]" : "bg-[#f2eef7]"
                      }`}
                    >
                      <Quote
                        className={`h-5 w-5 shrink-0 mt-0.5 ${
                          isDark ? "text-[#c4b0ff]" : "text-[#630ed4]"
                        }`}
                      />
                      <p
                        className={`text-xs sm:text-sm leading-relaxed font-semibold ${
                          isDark ? "text-purple-100/90" : "text-[#3a3a40]"
                        }`}
                      >
                        {t.departments[topThree[0]].scripture}
                      </p>
                    </div>

                    {/* Video Player / Facade */}
                    <div className="relative aspect-video w-full overflow-hidden border border-black/20 bg-black shadow-xl">
                      {activeVideo === topThree[0] ? (
                        <iframe
                          src={`${t.departments[topThree[0]].video}?autoplay=1`}
                          title={`${t.departments[topThree[0]].title ?? topThree[0]} Department Overview`}
                          allow="autoplay; fullscreen"
                          allowFullScreen
                          className="h-full w-full border-0"
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => setActiveVideo(topThree[0])}
                          className="group relative flex h-full w-full items-center justify-center bg-gradient-to-br from-[#2a0c5e] via-[#170930] to-[#090412] p-6 text-center cursor-pointer"
                          aria-label={`Play ${t.departments[topThree[0]].title ?? topThree[0]} video`}
                        >
                          <div className="relative z-10 flex flex-col items-center gap-3">
                            <span className="flex h-16 w-16 items-center justify-center bg-[#630ed4] text-white border-2 border-white/30 shadow-[0_12px_30px_rgba(99,14,212,0.5)] transition-transform duration-200 group-hover:scale-110">
                              <Play className="h-7 w-7 translate-x-0.5 fill-white" />
                            </span>
                            <span className="border border-white/25 bg-black/75 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-white">
                              {t.watchSpotlight.replace(
                                "{dept}",
                                t.departments[topThree[0]].title ?? topThree[0],
                              )}
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
                    const displayTitle = dept.title ?? deptName;
                    const rankNum = idx + 2;
                    return (
                      <div
                        key={deptName}
                        className={`border p-6 flex flex-col justify-between transition-all ${
                          isDark
                            ? "border-white/15 bg-[#120b1f] text-white shadow-lg hover:border-[#c4b0ff]/40"
                            : "border-purple-900/15 bg-white text-[#1c1c1f] shadow-md hover:border-[#630ed4]/40"
                        }`}
                      >
                        <div>
                          <div className="mb-3 flex items-center justify-between">
                            <span
                              className={`border px-3 py-0.5 text-xs font-extrabold uppercase tracking-wider ${
                                isDark
                                  ? "border-white/20 bg-white/5 text-[#c4b0ff]"
                                  : "border-purple-900/15 bg-[#f2eef7] text-[#630ed4]"
                              }`}
                            >
                              {t.matchRank.replace("{rank}", String(rankNum))}
                            </span>
                          </div>

                          <h4
                            className={`text-xl sm:text-2xl font-extrabold mb-2 ${
                              isDark ? "!text-white" : "!text-[#1c1c1f]"
                            }`}
                          >
                            {displayTitle}
                          </h4>

                          <p
                            className={`text-xs sm:text-sm leading-relaxed mb-3 ${
                              isDark ? "text-white/70" : "text-[#4a4a52]"
                            }`}
                          >
                            {dept.desc}
                          </p>

                          <p
                            className={`text-xs font-semibold border-l-2 border-[#630ed4] pl-3 mb-4 ${
                              isDark ? "text-purple-200/85" : "text-[#3a3a40]"
                            }`}
                          >
                            {dept.scripture}
                          </p>
                        </div>

                        {/* Video facade */}
                        <div className="relative aspect-video w-full overflow-hidden border border-black/20 bg-black mt-2">
                          {activeVideo === deptName ? (
                            <iframe
                              src={`${dept.video}?autoplay=1`}
                              title={`${displayTitle} Video`}
                              allow="autoplay; fullscreen"
                              allowFullScreen
                              className="h-full w-full border-0"
                            />
                          ) : (
                            <button
                              type="button"
                              onClick={() => setActiveVideo(deptName)}
                              className="group relative flex h-full w-full items-center justify-center bg-gradient-to-br from-[#210d47] to-[#0a0612] p-4 text-center cursor-pointer"
                              aria-label={`Play ${displayTitle} video`}
                            >
                              <div className="flex items-center gap-2 border border-white/25 bg-[#630ed4] px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-white shadow-md group-hover:bg-[#4c08a8] transition-colors">
                                <Play className="h-3.5 w-3.5 fill-white" />
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
                <div
                  className={`border overflow-hidden shadow-lg transition-colors ${
                    isDark
                      ? "border-white/15 bg-[#120b1f] text-white"
                      : "border-purple-900/15 bg-white text-[#1c1c1f]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setIsExploreOpen((prev) => !prev)}
                    className={`flex w-full items-center justify-between p-6 text-left font-extrabold text-lg sm:text-xl transition-colors cursor-pointer ${
                      isDark
                        ? "text-white hover:bg-white/[0.04]"
                        : "text-[#1c1c1f] hover:bg-[#f2eef7]"
                    }`}
                  >
                    <span className="inline-flex items-center gap-2.5">
                      <Grid className={`h-5 w-5 ${isDark ? "text-[#c4b0ff]" : "text-[#630ed4]"}`} />
                      {t.exploreButton} ({Object.keys(t.departments).length})
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform duration-300 ${
                        isDark ? "text-white/70" : "text-[#4a4a52]"
                      } ${isExploreOpen ? "rotate-180 !text-[#630ed4]" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {isExploreOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`border-t p-6 ${
                          isDark
                            ? "border-white/12 bg-black/25"
                            : "border-purple-900/12 bg-[#f8f6fa]"
                        }`}
                      >
                        {/* Search input in explore */}
                        <div className="mb-5">
                          <label htmlFor="explore-search-input" className="sr-only">
                            Search departments
                          </label>
                          <div className="relative">
                            <input
                              id="explore-search-input"
                              type="search"
                              value={exploreFilter}
                              onChange={(e) => setExploreFilter(e.target.value)}
                              placeholder={t.filterDepartmentsPlaceholder}
                              className={`w-full rounded-none border px-4 py-3 pl-11 text-base sm:text-sm font-semibold transition-all focus:outline-none focus:border-[#630ed4] focus:ring-2 focus:ring-[#630ed4]/30 ${
                                isDark
                                  ? "border-white/20 bg-white/[0.05] text-white placeholder:text-white/40"
                                  : "border-purple-900/20 bg-white text-[#1c1c1f] placeholder:text-[#77737a]"
                              }`}
                            />
                            <Search
                              className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 ${
                                isDark ? "text-white/50" : "text-[#630ed4]"
                              }`}
                            />
                          </div>
                        </div>

                        {/* List */}
                        <div
                          className={`divide-y border overflow-hidden ${
                            isDark
                              ? "divide-white/10 border-white/15 bg-white/[0.02]"
                              : "divide-purple-900/10 border-purple-900/15 bg-white"
                          }`}
                        >
                          {exploreDepts.map((deptName) => {
                            const dept = t.departments[deptName];
                            const displayTitle = dept.title ?? deptName;
                            const isExpanded = expandedExploreDept === deptName;
                            return (
                              <div key={deptName}>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedExploreDept((prev) =>
                                      prev === deptName ? null : deptName,
                                    )
                                  }
                                  className={`flex w-full items-center justify-between p-4 text-left font-bold text-sm transition-colors cursor-pointer ${
                                    isDark
                                      ? "text-white hover:bg-white/[0.05]"
                                      : "text-[#1c1c1f] hover:bg-[#f2eef7]"
                                  }`}
                                >
                                  <span>{displayTitle}</span>
                                  <ChevronDown
                                    className={`h-4 w-4 transition-transform ${
                                      isDark ? "text-white/60" : "text-[#4a4a52]"
                                    } ${isExpanded ? "rotate-180 !text-[#630ed4]" : ""}`}
                                  />
                                </button>

                                {isExpanded && (
                                  <div
                                    className={`border-t p-5 text-xs sm:text-sm space-y-3 ${
                                      isDark
                                        ? "border-white/10 bg-black/30 text-white/80"
                                        : "border-purple-900/10 bg-[#f8f6fa] text-[#4a4a52]"
                                    }`}
                                  >
                                    <p className="leading-relaxed">{dept.desc}</p>
                                    <p
                                      className={`font-semibold border-l-2 border-[#630ed4] pl-3 ${
                                        isDark ? "text-purple-200/85" : "text-[#3a3a40]"
                                      }`}
                                    >
                                      {dept.scripture}
                                    </p>

                                    <div className="relative aspect-video w-full max-w-md overflow-hidden border border-black/20 bg-black mt-3">
                                      {activeVideo === `explore-${deptName}` ? (
                                        <iframe
                                          src={`${dept.video}?autoplay=1`}
                                          title={`${displayTitle} Video`}
                                          allow="autoplay; fullscreen"
                                          allowFullScreen
                                          className="h-full w-full border-0"
                                        />
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() => setActiveVideo(`explore-${deptName}`)}
                                          className="group relative flex h-full w-full items-center justify-center bg-gradient-to-br from-[#210d47] to-[#0a0612] p-4 text-center cursor-pointer"
                                        >
                                          <div className="flex items-center gap-2 border border-white/25 bg-[#630ed4] px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-white shadow-md group-hover:bg-[#4c08a8] transition-colors">
                                            <Play className="h-3.5 w-3.5 fill-white" />
                                            <span>
                                              {t.playDeptVideo.replace("{dept}", displayTitle)}
                                            </span>
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
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Next Step / Call to Action */}
                <div
                  className={`border p-7 sm:p-9 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg ${
                    isDark
                      ? "border-white/15 bg-[#120b1f] text-white"
                      : "border-purple-900/15 bg-white text-[#1c1c1f]"
                  }`}
                >
                  <div>
                    <h3
                      className={`text-xl sm:text-2xl font-extrabold ${
                        isDark ? "!text-white" : "!text-[#1c1c1f]"
                      }`}
                    >
                      {t.nextStepTitle}
                    </h3>
                    <p
                      className={`mt-1 text-sm max-w-md ${
                        isDark ? "text-white/70" : "text-[#4a4a52]"
                      }`}
                    >
                      {t.nextStepSubtitle}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleRestart}
                      className="quiz-btn-secondary flex-1 sm:flex-none"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>{t.restartButton}</span>
                    </button>

                    <Link href="/locations" className="quiz-btn-primary flex-1 sm:flex-none">
                      <span>{t.findBranchButton}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>
      </div>

      {/* Privacy Policy Modal */}
      {showPrivacy && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="privacy-modal-heading"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-200"
          onClick={closePrivacy}
        >
          <div
            ref={privacyDialogRef}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            className={`flex max-h-[85vh] w-full max-w-2xl flex-col border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 focus:outline-none ${
              isDark
                ? "border-white/20 bg-[#120b1f] text-white"
                : "border-purple-900/20 bg-white text-[#1c1c1f]"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/15 bg-[#630ed4] px-7 py-5 text-white">
              <div>
                <h3
                  id="privacy-modal-heading"
                  className="text-xl sm:text-2xl font-extrabold !text-white"
                >
                  {privacyData.title}
                </h3>
                <p className="mt-1 text-xs font-semibold text-white/85">{privacyData.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowPrivacy(false)}
                className="border border-white/30 bg-white/10 p-2 text-white hover:bg-white hover:text-[#630ed4] transition-colors cursor-pointer"
                aria-label={privacyData.backButton || "Close"}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div
              className={`overflow-y-auto p-7 space-y-6 text-sm font-medium leading-relaxed ${
                isDark ? "text-white/80" : "text-[#4a4a52]"
              }`}
            >
              {privacyData.sections.map((section: PrivacySection, idx: number) => (
                <div key={idx} className="space-y-3">
                  <h4
                    className={`flex items-center gap-2.5 text-base font-extrabold border-b pb-2 ${
                      isDark
                        ? "!text-white border-white/10"
                        : "!text-[#1c1c1f] border-purple-900/10"
                    }`}
                  >
                    {section.icon === "info" && (
                      <Info className={`h-4 w-4 ${isDark ? "text-[#c4b0ff]" : "text-[#630ed4]"}`} />
                    )}
                    {section.icon === "database" && (
                      <Compass
                        className={`h-4 w-4 ${isDark ? "text-[#c4b0ff]" : "text-[#630ed4]"}`}
                      />
                    )}
                    {section.icon === "settings" && (
                      <Settings
                        className={`h-4 w-4 ${isDark ? "text-[#c4b0ff]" : "text-[#630ed4]"}`}
                      />
                    )}
                    {section.icon === "lock" && (
                      <Lock className={`h-4 w-4 ${isDark ? "text-[#c4b0ff]" : "text-[#630ed4]"}`} />
                    )}
                    {section.icon === "shield" && (
                      <Shield
                        className={`h-4 w-4 ${isDark ? "text-[#c4b0ff]" : "text-[#630ed4]"}`}
                      />
                    )}
                    {section.icon === "mail" && (
                      <Mail className={`h-4 w-4 ${isDark ? "text-[#c4b0ff]" : "text-[#630ed4]"}`} />
                    )}
                    <span>{section.heading}</span>
                  </h4>

                  {section.paragraphs?.map((p: string, pIdx: number) => (
                    <p key={pIdx}>{p}</p>
                  ))}

                  {section.subsections?.map((sub: PrivacySubsection, sIdx: number) => (
                    <div key={sIdx} className="pl-3 space-y-1">
                      <p className={`font-bold ${isDark ? "text-white" : "text-[#1c1c1f]"}`}>
                        {sub.title}
                      </p>
                      <ul
                        className={`list-disc pl-5 space-y-1 ${
                          isDark ? "text-white/75" : "text-[#4a4a52]"
                        }`}
                      >
                        {sub.items.map((item: string, iIdx: number) => (
                          <li key={iIdx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  {section.items && (
                    <ul
                      className={`list-disc pl-5 space-y-1 ${
                        isDark ? "text-white/75" : "text-[#4a4a52]"
                      }`}
                    >
                      {section.items.map((item: string, iIdx: number) => (
                        <li key={iIdx}>{item}</li>
                      ))}
                    </ul>
                  )}

                  {section.contact && (
                    <div
                      className={`border-l-4 border-[#630ed4] p-4 space-y-1 ${
                        isDark ? "bg-white/[0.04] text-white" : "bg-[#f2eef7] text-[#1c1c1f]"
                      }`}
                    >
                      <p className="font-bold">{section.contact.officer}</p>
                      <p className={isDark ? "text-white/75" : "text-[#4a4a52]"}>
                        Email:{" "}
                        <a
                          href={`mailto:${section.contact.email}`}
                          className={`font-bold underline ${
                            isDark
                              ? "text-[#c4b0ff] hover:text-white"
                              : "text-[#630ed4] hover:text-[#4c08a8]"
                          }`}
                        >
                          {section.contact.email}
                        </a>
                      </p>
                    </div>
                  )}
                </div>
              ))}

              <p
                className={`text-center text-xs pt-4 border-t ${
                  isDark ? "text-white/45 border-white/10" : "text-[#77737a] border-purple-900/10"
                }`}
              >
                {privacyData.lastUpdated}
              </p>
            </div>

            {/* Footer */}
            <div
              className={`border-t p-5 flex justify-end ${
                isDark ? "border-white/10 bg-black/40" : "border-purple-900/10 bg-[#f8f6fa]"
              }`}
            >
              <button
                type="button"
                onClick={() => setShowPrivacy(false)}
                className="quiz-btn-primary"
              >
                {privacyData.backButton}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
