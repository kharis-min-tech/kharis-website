"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
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

  // Background slideshow rotation (respects prefers-reduced-motion)
  useEffect(() => {
    if (prefersReducedMotion || QUIZ_SLIDESHOW_IMAGES.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % QUIZ_SLIDESHOW_IMAGES.length);
    }, 5000);
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
      className={`relative min-h-screen transition-colors duration-300 selection:bg-[#fd7f20]/30 ${
        isDark
          ? "bg-[#07040c] text-white selection:text-white"
          : "bg-[#faf7fc] text-[#1c1c1f] selection:text-[#1c1c1f]"
      }`}
    >
      {/* Background Photo Slideshow + Ambient Lighting & Glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden="true">
        {QUIZ_SLIDESHOW_IMAGES.map((src, idx) => (
          <div
            key={src}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              idx === activeSlide ? (isDark ? "opacity-[0.14]" : "opacity-[0.10]") : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
        <div
          className={`absolute inset-0 transition-colors duration-500 ${
            isDark
              ? "bg-gradient-to-b from-[#07040c]/80 via-[#07040c]/88 to-[#07040c]"
              : "bg-gradient-to-b from-[#faf7fc]/82 via-[#faf7fc]/90 to-[#faf7fc]"
          }`}
        />
        <div
          className={`absolute -top-40 left-1/2 -translate-x-1/2 h-[550px] w-[900px] rounded-full blur-[140px] transition-opacity duration-500 ${
            isDark ? "bg-purple-700/15 opacity-100" : "bg-purple-300/25 opacity-70"
          }`}
        />
        <div
          className={`absolute top-[40%] right-[-10%] h-[450px] w-[600px] rounded-full blur-[130px] transition-opacity duration-500 ${
            isDark ? "bg-[#6b34fa]/10 opacity-100" : "bg-[#6b34fa]/8 opacity-60"
          }`}
        />
        <div
          className={`absolute bottom-[-10%] left-[-10%] h-[500px] w-[650px] rounded-full blur-[150px] transition-opacity duration-500 ${
            isDark ? "bg-[#fd7f20]/8 opacity-100" : "bg-[#fd7f20]/10 opacity-60"
          }`}
        />
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            isDark ? "opacity-20" : "opacity-10"
          }`}
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative z-10 pt-28 pb-20">
        {/* Hero Section */}
        <header className="relative mx-auto max-w-5xl px-5 text-center md:px-8">
          <Reveal variant="blur">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              {/* Eyebrow badge */}
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] backdrop-blur-md shadow-xs transition-colors ${
                  isDark
                    ? "border-purple-500/30 bg-purple-500/10 text-[#c4b0ff]"
                    : "border-purple-500/25 bg-purple-500/10 text-[#6b34fa]"
                }`}
              >
                <Compass className="h-3.5 w-3.5 text-[#fd7f20]" />
                {t.badge}
              </span>

              {/* Language Selector */}
              <div className="relative inline-block">
                <select
                  id="main-quiz-language"
                  aria-label="Select quiz language"
                  value={lang}
                  onChange={(e) => setLang(e.target.value as SupportedLanguage)}
                  className={`min-h-11 appearance-none rounded-full border backdrop-blur-md px-4 py-2 pr-9 text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-[#6b34fa]/50 cursor-pointer shadow-xs ${
                    isDark
                      ? "border-white/15 bg-white/[0.07] text-white hover:bg-white/[0.12]"
                      : "border-purple-900/15 bg-white text-[#1c1c1f] hover:bg-purple-50/50"
                  }`}
                >
                  {QUIZ_LANGUAGES.map(
                    (item: { code: SupportedLanguage; label: string; flag: string }) => (
                      <option
                        key={item.code}
                        value={item.code}
                        className={isDark ? "bg-[#151022] text-white" : "bg-white text-[#1c1c1f]"}
                      >
                        {item.flag} {item.label}
                      </option>
                    ),
                  )}
                  <option
                    disabled
                    className={isDark ? "bg-[#151022] text-white/50" : "bg-white text-gray-400"}
                  >
                    ────────────
                  </option>
                  {UPCOMING_LANGUAGES.map((item: { code: string; label: string }) => (
                    <option
                      key={item.code}
                      value={item.code}
                      disabled
                      className={isDark ? "bg-[#151022] text-white/40" : "bg-white text-gray-300"}
                    >
                      {item.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 ${
                    isDark ? "text-white/70" : "text-[#5a5a64]"
                  }`}
                />
              </div>
            </div>

            <h1
              className={`font-extrabold tracking-tight leading-[1.08] ${
                isDark ? "!text-white" : "!text-[#1c1c1f]"
              }`}
              style={{ fontSize: "clamp(2.3rem, 1.5rem + 4.2vw, 4.2rem)" }}
            >
              {t.title}
            </h1>

            <p
              className={`mt-4 max-w-2xl mx-auto text-base sm:text-lg font-medium leading-relaxed ${
                isDark ? "text-white/70" : "text-[#5a5a64]"
              }`}
              style={{ fontSize: "clamp(1rem, 0.95rem + 0.35vw, 1.25rem)" }}
            >
              {t.subtitle}
            </p>

            <div className="mt-8 flex justify-center items-center gap-2">
              <span className="h-1.5 w-12 rounded-full bg-[#fd7f20]" />
              <span className="h-1.5 w-6 rounded-full bg-[#6b34fa]" />
              <span
                className={`h-1.5 w-2 rounded-full ${isDark ? "bg-white/40" : "bg-purple-900/20"}`}
              />
            </div>
          </Reveal>
        </header>

        {/* Quiz Flow Card Section */}
        <section ref={containerRef} className="mt-12 px-5 md:px-8">
          <div className="mx-auto max-w-3xl">
            {/* 1. START SCREEN */}
            {screen === "start" && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className={`relative rounded-3xl border p-7 sm:p-11 backdrop-blur-xl overflow-hidden transition-colors ${
                  isDark
                    ? "border-white/10 bg-[#120c1f]/85 shadow-[0_24px_60px_rgba(0,0,0,0.55)] text-white"
                    : "border-purple-900/10 bg-white shadow-[0_20px_50px_rgba(40,20,80,0.08)] text-[#1c1c1f]"
                }`}
              >
                {/* Glow accent */}
                <div
                  className={`pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl ${
                    isDark ? "bg-[#6b34fa]/20" : "bg-[#6b34fa]/10"
                  }`}
                />

                <div className="relative z-10">
                  <div
                    className={`mb-7 pb-6 border-b ${isDark ? "border-white/10" : "border-purple-900/10"}`}
                  >
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider mb-3 ${
                        isDark
                          ? "border-purple-400/30 bg-purple-500/15 text-[#d4c4fd]"
                          : "border-purple-400/25 bg-purple-50 text-[#6b34fa]"
                      }`}
                    >
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
                      className={`mt-2 text-sm sm:text-base leading-relaxed ${isDark ? "text-white/65" : "text-[#5a5a64]"}`}
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
                        className={`block text-xs font-extrabold uppercase tracking-wider ${
                          isDark ? "text-white/80" : "text-[#3a3a40]"
                        }`}
                      >
                        {t.branchLabel} <span className="text-[#fd7f20]">*</span>
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
                          className={`w-full appearance-none rounded-2xl border px-4 py-3.5 pr-10 text-sm sm:text-base font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-[#6b34fa]/50 cursor-pointer ${
                            isDark ? "bg-white/[0.04] text-white" : "bg-[#f8f5fb] text-[#1c1c1f]"
                          } ${
                            branchError
                              ? "border-rose-500 ring-2 ring-rose-500/30"
                              : isDark
                                ? "border-white/15 hover:border-white/25 focus:border-[#6b34fa]"
                                : "border-purple-900/15 hover:border-purple-900/30 focus:border-[#6b34fa]"
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
                            isDark ? "text-white/60" : "text-[#5a5a64]"
                          }`}
                        />
                      </div>
                      {branchError && (
                        <p className="flex items-center gap-1.5 text-xs font-semibold text-rose-500 pt-1">
                          <AlertCircle className="h-3.5 w-3.5" />
                          {t.branchError}
                        </p>
                      )}
                    </div>

                    {/* Submit CTA Button */}
                    <button
                      type="submit"
                      className="group w-full rounded-full bg-[#fd7f20] hover:bg-[#ff933f] text-white py-4 px-8 font-extrabold text-base tracking-wide shadow-[0_12px_32px_rgba(253,127,32,0.32)] transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer mt-4"
                    >
                      <span>{t.startButton}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>

                    {/* Privacy Note */}
                    <div className="pt-2 text-center">
                      <p
                        className={`text-xs font-medium ${isDark ? "text-white/50" : "text-[#6e6e76]"}`}
                      >
                        {t.privacyAgreement.includes("{policy}") ? (
                          <>
                            {t.privacyAgreement.split("{policy}")[0]}
                            <button
                              type="button"
                              onClick={() => setShowPrivacy(true)}
                              className={`font-bold underline underline-offset-2 transition-colors cursor-pointer ${
                                isDark
                                  ? "text-[#c4b0ff] hover:text-white"
                                  : "text-[#6b34fa] hover:text-[#5420d6]"
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
                              className={`font-bold underline underline-offset-2 transition-colors cursor-pointer ${
                                isDark
                                  ? "text-[#c4b0ff] hover:text-white"
                                  : "text-[#6b34fa] hover:text-[#5420d6]"
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
                className={`relative rounded-3xl border p-7 sm:p-11 backdrop-blur-xl overflow-hidden transition-colors ${
                  isDark
                    ? "border-white/10 bg-[#120c1f]/85 shadow-[0_24px_60px_rgba(0,0,0,0.55)] text-white"
                    : "border-purple-900/10 bg-white shadow-[0_20px_50px_rgba(40,20,80,0.08)] text-[#1c1c1f]"
                }`}
              >
                {/* Progress Header */}
                <div className="mb-7">
                  <div
                    className={`mb-3 flex items-center justify-between text-xs font-extrabold uppercase tracking-wider ${
                      isDark ? "text-white/70" : "text-[#5a5a64]"
                    }`}
                  >
                    <span
                      className={`inline-flex items-center gap-1.5 ${isDark ? "text-[#c4b0ff]" : "text-[#6b34fa]"}`}
                    >
                      <Compass className="h-4 w-4 text-[#fd7f20]" />
                      {t.questionBadge
                        .replace("{current}", String(currentQuestion + 1))
                        .replace("{total}", String(t.questions.length))}
                    </span>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 font-mono text-xs ${
                        isDark
                          ? "border-white/10 bg-white/5 text-white/80"
                          : "border-purple-900/10 bg-purple-50 text-[#6b34fa]"
                      }`}
                    >
                      {Math.round(((currentQuestion + 1) / t.questions.length) * 100)}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div
                    className={`h-2 w-full rounded-full overflow-hidden ${
                      isDark ? "bg-white/10" : "bg-purple-900/10"
                    }`}
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(((currentQuestion + 1) / t.questions.length) * 100)}
                  >
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#6b34fa] via-[#9b7bff] to-[#fd7f20] transition-all duration-300 ease-out"
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
                    className={`mt-4 flex items-start gap-3 rounded-2xl border p-4 ${
                      isDark
                        ? "border-purple-500/20 bg-purple-500/[0.08]"
                        : "border-purple-500/20 bg-purple-50/70"
                    }`}
                  >
                    <BookOpen
                      className={`h-5 w-5 shrink-0 mt-0.5 ${
                        isDark ? "text-[#c4b0ff]" : "text-[#6b34fa]"
                      }`}
                    />
                    <p
                      className={`text-xs sm:text-sm italic leading-relaxed ${
                        isDark ? "text-purple-200/90" : "text-[#5420d6]"
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
                        className={`group relative flex items-start gap-3.5 rounded-2xl border p-5 text-left transition-all cursor-pointer ${
                          isSelected
                            ? isDark
                              ? "border-[#6b34fa] bg-gradient-to-br from-[#6b34fa]/30 via-[#6b34fa]/15 to-transparent text-white ring-2 ring-[#6b34fa] shadow-[0_0_24px_rgba(107,52,250,0.3)] scale-[1.01]"
                              : "border-[#6b34fa] bg-gradient-to-br from-purple-100/90 via-purple-50 to-white text-[#1c1c1f] ring-2 ring-[#6b34fa] shadow-[0_8px_25px_rgba(107,52,250,0.18)] scale-[1.01]"
                            : isDark
                              ? "border-white/10 bg-white/[0.03] text-white/90 hover:border-purple-400/40 hover:bg-white/[0.06] hover:-translate-y-0.5"
                              : "border-purple-900/10 bg-[#faf7fc] text-[#1c1c1f] hover:border-purple-500/40 hover:bg-purple-50/60 hover:-translate-y-0.5 shadow-xs"
                        }`}
                      >
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold transition-all ${
                            isSelected
                              ? "bg-[#fd7f20] text-white shadow-md"
                              : isDark
                                ? "bg-white/10 text-white/80 group-hover:bg-[#6b34fa] group-hover:text-white"
                                : "bg-purple-100/80 text-[#6b34fa] group-hover:bg-[#6b34fa] group-hover:text-white"
                          }`}
                        >
                          {isSelected ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            String.fromCharCode(65 + idx)
                          )}
                        </span>
                        <span className="text-sm sm:text-base font-bold leading-snug pt-0.5">
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Nav Controls */}
                <div
                  className={`flex items-center justify-between gap-4 border-t pt-6 ${isDark ? "border-white/10" : "border-purple-900/10"}`}
                >
                  <button
                    type="button"
                    onClick={handleBack}
                    className={`inline-flex items-center gap-2 rounded-full border font-bold text-xs sm:text-sm px-5 py-3 transition-all cursor-pointer active:scale-95 ${
                      isDark
                        ? "border-white/15 bg-white/5 hover:bg-white/10 text-white hover:border-white/25"
                        : "border-purple-900/15 bg-white hover:bg-purple-50 text-[#1c1c1f] hover:border-purple-900/30 shadow-xs"
                    }`}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>{t.backButton}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={answers[currentQuestion] === null}
                    className={`inline-flex items-center gap-2 rounded-full bg-[#fd7f20] hover:bg-[#ff933f] text-white font-extrabold text-sm sm:text-base px-7 py-3 shadow-[0_8px_25px_rgba(253,127,32,0.3)] transition-all cursor-pointer ${
                      answers[currentQuestion] === null
                        ? "opacity-40 cursor-not-allowed shadow-none"
                        : "hover:scale-[1.02] active:scale-[0.98]"
                    }`}
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
                  className={`relative rounded-3xl border p-7 sm:p-9 backdrop-blur-xl overflow-hidden ${
                    isDark
                      ? "border-white/10 bg-gradient-to-r from-purple-900/40 via-[#120c1f]/85 to-[#120c1f]/85 shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-white"
                      : "border-purple-900/10 bg-gradient-to-r from-purple-100/70 via-white to-white shadow-[0_20px_50px_rgba(40,20,80,0.08)] text-[#1c1c1f]"
                  }`}
                >
                  <div
                    className={`pointer-events-none absolute top-0 right-0 h-40 w-40 rounded-full blur-3xl ${
                      isDark ? "bg-[#fd7f20]/15" : "bg-[#fd7f20]/10"
                    }`}
                  />

                  <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-400/40 bg-orange-400/15 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#ffaa55] mb-2.5">
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
                        className={`mt-2 text-sm sm:text-base ${isDark ? "text-white/70" : "text-[#5a5a64]"}`}
                      >
                        {t.resultsSubtitle}
                      </p>
                    </div>

                    <div
                      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-bold ${
                        isDark
                          ? "border-white/15 bg-white/5 text-white/90"
                          : "border-purple-900/15 bg-purple-50 text-[#1c1c1f]"
                      }`}
                    >
                      <MapPin className="h-3.5 w-3.5 text-[#fd7f20]" />
                      <span>{branch || "Kharis Church"}</span>
                    </div>
                  </div>
                </div>

                {/* Top Match (#1 Hero Spotlight Card) */}
                {topThree[0] && t.departments[topThree[0]] && (
                  <div
                    className={`relative rounded-3xl border p-7 sm:p-9 backdrop-blur-xl overflow-hidden ${
                      isDark
                        ? "border-purple-500/40 bg-[#160f26]/90 shadow-[0_24px_60px_rgba(107,52,250,0.18)] text-white"
                        : "border-purple-500/25 bg-gradient-to-b from-purple-50/70 via-white to-white shadow-[0_20px_50px_rgba(40,20,80,0.08)] text-[#1c1c1f]"
                    }`}
                  >
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#6b34fa] to-[#5420d6] px-4 py-1 text-xs font-extrabold uppercase tracking-widest text-white shadow-md">
                        <Trophy className="h-3.5 w-3.5 text-[#ffaa55]" />
                        {t.topMatchBadge}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#fd7f20]">
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
                      className={`text-sm sm:text-base leading-relaxed mb-5 ${isDark ? "text-white/80" : "text-[#4a4a52]"}`}
                    >
                      {t.departments[topThree[0]].desc}
                    </p>

                    <div
                      className={`mb-6 flex items-start gap-3 rounded-2xl border-l-4 border-[#6b34fa] p-4 ${
                        isDark ? "bg-white/[0.03]" : "bg-purple-50/70"
                      }`}
                    >
                      <Quote
                        className={`h-5 w-5 shrink-0 mt-0.5 ${isDark ? "text-[#c4b0ff]" : "text-[#6b34fa]"}`}
                      />
                      <p
                        className={`text-xs sm:text-sm italic leading-relaxed ${isDark ? "text-purple-200/90" : "text-[#5420d6]"}`}
                      >
                        {t.departments[topThree[0]].scripture}
                      </p>
                    </div>

                    {/* Video Player / Facade */}
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-black/20 bg-black shadow-2xl">
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
                          className="group relative flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1d1233] to-[#07040c] p-6 text-center cursor-pointer"
                          aria-label={`Play ${t.departments[topThree[0]].title ?? topThree[0]} video`}
                        >
                          <div className="absolute inset-0 bg-radial from-purple-500/20 via-transparent to-transparent opacity-60" />
                          <div className="relative z-10 flex flex-col items-center gap-3">
                            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#fd7f20] text-white shadow-[0_10px_30px_rgba(253,127,32,0.45)] transition-transform duration-200 group-hover:scale-110">
                              <Play className="h-7 w-7 translate-x-0.5 fill-white" />
                            </span>
                            <span className="rounded-full border border-white/20 bg-black/60 backdrop-blur-md px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
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
                        className={`rounded-3xl border p-6 flex flex-col justify-between backdrop-blur-xl transition-all ${
                          isDark
                            ? "border-white/10 bg-[#120c1f]/85 text-white shadow-lg hover:border-white/20"
                            : "border-purple-900/10 bg-white text-[#1c1c1f] shadow-md hover:border-purple-900/20"
                        }`}
                      >
                        <div>
                          <div className="mb-3 flex items-center justify-between">
                            <span
                              className={`rounded-full border px-3 py-0.5 text-xs font-bold ${
                                isDark
                                  ? "border-white/15 bg-white/5 text-white/90"
                                  : "border-purple-900/15 bg-purple-50 text-[#6b34fa]"
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
                            className={`text-xs sm:text-sm leading-relaxed mb-3 ${isDark ? "text-white/70" : "text-[#5a5a64]"}`}
                          >
                            {dept.desc}
                          </p>

                          <p
                            className={`text-xs italic border-l-2 border-[#fd7f20] pl-3 mb-4 ${
                              isDark ? "text-purple-200/80" : "text-[#5420d6]"
                            }`}
                          >
                            {dept.scripture}
                          </p>
                        </div>

                        {/* Video facade */}
                        <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-black/20 bg-black mt-2">
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
                              className="group relative flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1a1226] to-[#0a0712] p-4 text-center cursor-pointer"
                              aria-label={`Play ${displayTitle} video`}
                            >
                              <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-2 text-xs font-bold text-white shadow-md group-hover:bg-[#6b34fa] group-hover:border-[#6b34fa] transition-colors">
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
                  className={`rounded-3xl border overflow-hidden backdrop-blur-xl shadow-lg transition-colors ${
                    isDark
                      ? "border-white/10 bg-[#120c1f]/85 text-white"
                      : "border-purple-900/10 bg-white text-[#1c1c1f]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setIsExploreOpen((prev) => !prev)}
                    className={`flex w-full items-center justify-between p-6 text-left font-extrabold text-lg sm:text-xl transition-colors cursor-pointer ${
                      isDark
                        ? "text-white hover:bg-white/[0.04]"
                        : "text-[#1c1c1f] hover:bg-purple-50/50"
                    }`}
                  >
                    <span className="inline-flex items-center gap-2.5">
                      <Grid className="h-5 w-5 text-[#fd7f20]" />
                      {t.exploreButton} ({Object.keys(t.departments).length})
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform duration-300 ${
                        isDark ? "text-white/70" : "text-[#5a5a64]"
                      } ${isExploreOpen ? "rotate-180 text-[#fd7f20]" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {isExploreOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`border-t p-6 ${isDark ? "border-white/10 bg-black/20" : "border-purple-900/10 bg-purple-50/30"}`}
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
                              className={`w-full rounded-2xl border px-4 py-3 pl-11 text-base sm:text-sm font-semibold transition-all focus:outline-none focus:border-[#6b34fa] focus:ring-2 focus:ring-[#6b34fa]/30 ${
                                isDark
                                  ? "border-white/15 bg-white/[0.04] text-white placeholder:text-white/40"
                                  : "border-purple-900/15 bg-white text-[#1c1c1f] placeholder:text-[#8e8e98]"
                              }`}
                            />
                            <Search
                              className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 ${
                                isDark ? "text-white/50" : "text-gray-400"
                              }`}
                            />
                          </div>
                        </div>

                        {/* List */}
                        <div
                          className={`divide-y rounded-2xl border overflow-hidden ${
                            isDark
                              ? "divide-white/10 border-white/10 bg-white/[0.02]"
                              : "divide-purple-900/10 border-purple-900/10 bg-white"
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
                                      : "text-[#1c1c1f] hover:bg-purple-50/60"
                                  }`}
                                >
                                  <span>{displayTitle}</span>
                                  <ChevronDown
                                    className={`h-4 w-4 transition-transform ${
                                      isDark ? "text-white/60" : "text-[#5a5a64]"
                                    } ${isExpanded ? "rotate-180 text-[#fd7f20]" : ""}`}
                                  />
                                </button>

                                {isExpanded && (
                                  <div
                                    className={`border-t p-5 text-xs sm:text-sm space-y-3 ${
                                      isDark
                                        ? "border-white/5 bg-black/30 text-white/75"
                                        : "border-purple-900/10 bg-purple-50/40 text-[#4a4a52]"
                                    }`}
                                  >
                                    <p className="leading-relaxed">{dept.desc}</p>
                                    <p
                                      className={`italic border-l-2 border-[#6b34fa] pl-3 ${
                                        isDark ? "text-purple-200/80" : "text-[#5420d6]"
                                      }`}
                                    >
                                      {dept.scripture}
                                    </p>

                                    <div className="relative aspect-video w-full max-w-md rounded-xl overflow-hidden border border-black/20 bg-black mt-3">
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
                                          className="group relative flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1a1226] to-[#0a0712] p-4 text-center cursor-pointer"
                                        >
                                          <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white shadow-md group-hover:bg-[#6b34fa] transition-colors">
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
                  className={`rounded-3xl border p-7 sm:p-9 flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-xl shadow-lg ${
                    isDark
                      ? "border-purple-500/30 bg-gradient-to-r from-purple-900/30 via-[#120c1f]/90 to-[#120c1f]/90 text-white"
                      : "border-purple-500/20 bg-gradient-to-r from-purple-100/70 via-white to-white text-[#1c1c1f]"
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
                      className={`mt-1 text-sm max-w-md ${isDark ? "text-white/70" : "text-[#5a5a64]"}`}
                    >
                      {t.nextStepSubtitle}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleRestart}
                      className={`inline-flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-full border font-bold text-sm px-6 py-3 transition-all cursor-pointer ${
                        isDark
                          ? "border-white/20 bg-white/5 hover:bg-white/10 text-white"
                          : "border-purple-900/20 bg-white hover:bg-purple-50 text-[#1c1c1f] shadow-xs"
                      }`}
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>{t.restartButton}</span>
                    </button>

                    <Link
                      href="/locations"
                      className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-full bg-[#fd7f20] hover:bg-[#ff933f] text-white font-extrabold text-sm px-7 py-3 shadow-[0_10px_25px_rgba(253,127,32,0.35)] transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                    >
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
            className={`flex max-h-[85vh] w-full max-w-2xl flex-col rounded-3xl border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 focus:outline-none ${
              isDark
                ? "border-white/15 bg-[#120c1e] text-white"
                : "border-purple-900/15 bg-white text-[#1c1c1f]"
            }`}
          >
            {/* Header */}
            <div
              className={`flex items-center justify-between border-b px-7 py-5 ${
                isDark
                  ? "border-white/10 bg-gradient-to-r from-purple-900/40 to-transparent"
                  : "border-purple-900/10 bg-gradient-to-r from-purple-100/60 to-transparent"
              }`}
            >
              <div>
                <h3
                  id="privacy-modal-heading"
                  className={`text-xl sm:text-2xl font-extrabold ${
                    isDark ? "!text-white" : "!text-[#1c1c1f]"
                  }`}
                >
                  {privacyData.title}
                </h3>
                <p
                  className={`mt-1 text-xs font-mono ${
                    isDark ? "text-purple-200/70" : "text-[#6b34fa]"
                  }`}
                >
                  {privacyData.subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPrivacy(false)}
                className={`rounded-full p-2 transition-colors cursor-pointer ${
                  isDark
                    ? "text-white/60 hover:text-white hover:bg-white/10"
                    : "text-[#1c1c1f]/60 hover:text-[#1c1c1f] hover:bg-purple-50"
                }`}
                aria-label={privacyData.backButton || "Close"}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div
              className={`overflow-y-auto p-7 space-y-6 text-sm font-medium leading-relaxed ${
                isDark ? "text-white/75" : "text-[#4a4a52]"
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
                    {section.icon === "info" && <Info className="h-4 w-4 text-[#fd7f20]" />}
                    {section.icon === "database" && <Compass className="h-4 w-4 text-[#fd7f20]" />}
                    {section.icon === "settings" && <Settings className="h-4 w-4 text-[#fd7f20]" />}
                    {section.icon === "lock" && <Lock className="h-4 w-4 text-[#fd7f20]" />}
                    {section.icon === "shield" && <Shield className="h-4 w-4 text-[#fd7f20]" />}
                    {section.icon === "mail" && <Mail className="h-4 w-4 text-[#fd7f20]" />}
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
                        className={`list-disc pl-5 space-y-1 ${isDark ? "text-white/70" : "text-[#5a5a64]"}`}
                      >
                        {sub.items.map((item: string, iIdx: number) => (
                          <li key={iIdx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  {section.items && (
                    <ul
                      className={`list-disc pl-5 space-y-1 ${isDark ? "text-white/70" : "text-[#5a5a64]"}`}
                    >
                      {section.items.map((item: string, iIdx: number) => (
                        <li key={iIdx}>{item}</li>
                      ))}
                    </ul>
                  )}

                  {section.contact && (
                    <div
                      className={`rounded-2xl border-l-4 border-[#6b34fa] p-4 space-y-1 ${
                        isDark ? "bg-white/[0.04] text-white" : "bg-purple-50 text-[#1c1c1f]"
                      }`}
                    >
                      <p className="font-bold">{section.contact.officer}</p>
                      <p className={isDark ? "text-white/70" : "text-[#5a5a64]"}>
                        Email:{" "}
                        <a
                          href={`mailto:${section.contact.email}`}
                          className={`underline ${
                            isDark
                              ? "text-[#c4b0ff] hover:text-white"
                              : "text-[#6b34fa] hover:text-[#5420d6]"
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
                className={`text-center text-xs italic pt-4 border-t ${
                  isDark ? "text-white/40 border-white/10" : "text-gray-400 border-purple-900/10"
                }`}
              >
                {privacyData.lastUpdated}
              </p>
            </div>

            {/* Footer */}
            <div
              className={`border-t p-5 flex justify-end ${
                isDark ? "border-white/10 bg-black/40" : "border-purple-900/10 bg-purple-50/50"
              }`}
            >
              <button
                type="button"
                onClick={() => setShowPrivacy(false)}
                className="rounded-full bg-[#fd7f20] hover:bg-[#ff933f] text-white px-6 py-2.5 font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
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
