import type { ReactNode } from "react";

type IconProps = {
  name:
    | "arrow"
    | "location"
    | "groups"
    | "book"
    | "play"
    | "heart"
    | "home"
    | "spark"
    | "cloud"
    | "music"
    | "phone"
    | "bell"
    | "apple"
    | "android"
    | "watch"
    | "church";
  className?: string;
};

const paths: Record<IconProps["name"], ReactNode> = {
  arrow: (
    <path
      d="M5 12h14M13 6l6 6-6 6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  location: (
    <>
      <path
        d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="10" r="2.2" fill="currentColor" />
    </>
  ),
  groups: (
    <>
      <circle cx="9" cy="8" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="16" cy="9" r="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3.5 18.5c.8-3 2.8-4.5 5.5-4.5s4.7 1.5 5.5 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M14 14.2c1.5-.4 3-.2 4.5 1.3.7.7 1.2 1.7 1.5 3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </>
  ),
  book: (
    <path
      d="M5 4.5h5.2c1.3 0 2.3.9 2.3 2.2V19l-2.1-1.2L8.3 19V6.7c0-.6-.5-1.1-1.1-1.1H5V4.5Zm14 0h-5.2c-1.3 0-2.3.9-2.3 2.2V19l2.1-1.2 2.1 1.2V6.7c0-.6.5-1.1 1.1-1.1H19V4.5Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  ),
  play: (
    <path
      d="M8 6.5v11l9-5.5-9-5.5Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  ),
  heart: (
    <path
      d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  ),
  home: (
    <path
      d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  ),
  spark: (
    <>
      <path
        d="M12 3.5 13.2 8.2 18 9.5l-4.8 1.3L12 15.5l-1.2-4.7L6 9.5l4.8-1.3L12 3.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 14.5 19.1 16.8 21.5 17.5l-2.4.7-.6 2.3-.6-2.3-2.4-.7 2.4-.7.6-2.3Z"
        fill="currentColor"
      />
      <path
        d="M5.5 15.2 6 16.8 7.7 17.3 6 17.8 5.5 19.4 5 17.8 3.3 17.3 5 16.8 5.5 15.2Z"
        fill="currentColor"
      />
    </>
  ),
  cloud: (
    <path
      d="M7.5 18h9.2a3.8 3.8 0 0 0 .4-7.58A5 5 0 0 0 8.2 8.4 3.6 3.6 0 0 0 7.5 18Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  ),
  music: (
    <>
      <path
        d="M9 18V7.5l10-2V16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="7" cy="18" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17" cy="16" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </>
  ),
  phone: (
    <path
      d="M8.5 3.5h7A1.5 1.5 0 0 1 17 5v14a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 19V5A1.5 1.5 0 0 1 8.5 3.5Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  ),
  bell: (
    <path
      d="M12 3.5a4.5 4.5 0 0 1 4.5 4.5v2.2c0 1.4.5 2.7 1.4 3.7l.6.7H5.5l.6-.7A5.7 5.7 0 0 0 7.5 10.2V8A4.5 4.5 0 0 1 12 3.5ZM10 19a2 2 0 0 0 4 0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  apple: (
    <path
      d="M16.2 12.6c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.7-1.3-.1-2.5.8-3.1.8-.7 0-1.7-.7-2.8-.7-1.4 0-2.8.9-3.5 2.2-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.6 2.2 2.7 2.1 1.1 0 1.5-.7 2.8-.7s1.6.7 2.8.7c1.2 0 1.9-1 2.6-2 .8-1.2 1.1-2.3 1.1-2.4-.1 0-2.2-.8-2.5-3.7Zm-2.3-6.8c.6-.7 1-1.7.9-2.7-0.9.1-2 .6-2.6 1.3-.6.6-1.1 1.7-1 2.6 1 .1 2-.5 2.7-1.2Z"
      fill="currentColor"
    />
  ),
  android: (
    <>
      <path
        d="M7.2 9.2v6.4c0 .7.6 1.3 1.3 1.3h.4V19a1.2 1.2 0 0 0 2.4 0v-2.1h1.4V19a1.2 1.2 0 0 0 2.4 0v-2.1h.4c.7 0 1.3-.6 1.3-1.3V9.2H7.2Z"
        fill="currentColor"
      />
      <path
        d="M15.8 8.1H8.2c-.3-1.6 1-3.1 2.8-3.5l.6-1.3a.4.4 0 0 1 .7 0l.6 1.3c1.8.4 3.1 1.9 2.9 3.5Z"
        fill="currentColor"
      />
      <path
        d="M9.4 6.3 8.4 4.6M14.6 6.3l1-1.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="10.2" cy="6.7" r="0.55" fill="#fff" />
      <circle cx="13.8" cy="6.7" r="0.55" fill="#fff" />
      <path
        d="M5.8 9.4v4.6a1 1 0 0 0 2 0V9.8M18.2 9.4v4.6a1 1 0 0 1-2 0V9.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </>
  ),
  watch: (
    <>
      <rect
        x="8"
        y="6.5"
        width="8"
        height="11"
        rx="2.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M10 6.5V4.8c0-.4.3-.8.8-.8h2.4c.5 0 .8.4.8.8v1.7M10 17.5v1.7c0 .4.3.8.8.8h2.4c.5 0 .8-.4.8-.8v-1.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="2.1" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M12 12V10.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </>
  ),
  church: (
    <>
      <path
        d="M12 3.2v2.2M12 3.2 10.6 4.4M12 3.2l1.4 1.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 7.2h5.6L17 10.2v9.3H7V10.2L9.2 7.2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M10.6 19.5V14h2.8v5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M11.1 11.2h1.8M12 10.3v1.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </>
  ),
};

export function Icon({ name, className = "" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={`inline-block shrink-0 ${className}`}
    >
      {paths[name]}
    </svg>
  );
}
