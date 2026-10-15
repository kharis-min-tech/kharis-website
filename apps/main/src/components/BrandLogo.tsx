import Image from "next/image";

type Props = {
  /** `onDark` = white dove on dark/hero; `onLight` = dark dove on white */
  tone?: "onDark" | "onLight";
  className?: string;
  showWordmark?: boolean;
};

export function BrandLogo({ tone = "onLight", className = "", showWordmark = true }: Props) {
  const onDark = tone === "onDark";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Image
        src="https://images.kharis.org/site-images/main/113a6a24b1d3741b/kharis-logo.png"
        alt="Kharis"
        width={40}
        height={40}
        className={`h-9 w-9 object-contain md:h-10 md:w-10 ${onDark ? "" : "brightness-0"}`}
        priority
      />
      {showWordmark && (
        <span
          className={`font-[family-name:var(--font-display)] text-lg font-extrabold tracking-tight md:text-xl ${
            onDark ? "text-white" : "text-fg"
          }`}
        >
          Kharis
        </span>
      )}
    </span>
  );
}
