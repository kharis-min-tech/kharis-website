"use client";

/** Soft moving SVG shapes for Statement of Faith — brand plum + accent. */
export function FaithSvgBackdrop() {
  return (
    <div className="faith-svg" aria-hidden>
      <svg
        className="faith-svg__canvas"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="faithGradA" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#800654" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#d4920a" stopOpacity="0.12" />
          </linearGradient>
          <linearGradient id="faithGradB" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c4a0ff" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#800654" stopOpacity="0.08" />
          </linearGradient>
          <radialGradient id="faithOrb" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#d4920a" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#d4920a" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Soft wash blobs */}
        <ellipse
          className="faith-svg__float faith-svg__float--a"
          cx="180"
          cy="160"
          rx="220"
          ry="160"
          fill="url(#faithGradA)"
        />
        <ellipse
          className="faith-svg__float faith-svg__float--b"
          cx="1020"
          cy="220"
          rx="260"
          ry="200"
          fill="url(#faithGradB)"
        />
        <circle
          className="faith-svg__float faith-svg__float--c"
          cx="980"
          cy="620"
          r="180"
          fill="url(#faithOrb)"
        />

        {/* Arc strokes */}
        <path
          className="faith-svg__draw faith-svg__draw--slow"
          d="M80 520 C280 380, 420 640, 640 480"
          fill="none"
          stroke="#800654"
          strokeOpacity="0.22"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          className="faith-svg__draw faith-svg__draw--mid"
          d="M720 140 C860 260, 980 120, 1140 240"
          fill="none"
          stroke="#d4920a"
          strokeOpacity="0.28"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Small open Bible */}
        <g className="faith-svg__bible">
          <g transform="translate(960 500)">
            <path
              d="M0 18 C18 6, 40 6, 58 18 L58 78 C40 68, 18 68, 0 78 Z"
              fill="#fff"
              fillOpacity="0.75"
              stroke="#800654"
              strokeOpacity="0.35"
              strokeWidth="2"
            />
            <path
              d="M58 18 C76 6, 98 6, 116 18 L116 78 C98 68, 76 68, 58 78 Z"
              fill="#f7eef4"
              fillOpacity="0.9"
              stroke="#800654"
              strokeOpacity="0.35"
              strokeWidth="2"
            />
            <line
              x1="58"
              y1="18"
              x2="58"
              y2="78"
              stroke="#d4920a"
              strokeOpacity="0.55"
              strokeWidth="2"
            />
            <path
              d="M14 36 H44 M14 46 H40 M14 56 H42"
              fill="none"
              stroke="#800654"
              strokeOpacity="0.25"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M72 36 H102 M76 46 H102 M74 56 H100"
              fill="none"
              stroke="#800654"
              strokeOpacity="0.25"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>
        </g>

        {/* Soft cross mark */}
        <g className="faith-svg__cross">
          <g transform="translate(120 560)">
            <rect
              x="22"
              y="0"
              width="12"
              height="70"
              rx="3"
              fill="#800654"
              fillOpacity="0.14"
            />
            <rect
              x="0"
              y="18"
              width="56"
              height="12"
              rx="3"
              fill="#800654"
              fillOpacity="0.14"
            />
          </g>
        </g>

        {/* Floating dots */}
        <circle className="faith-svg__dot faith-svg__dot--1" cx="340" cy="120" r="5" fill="#d4920a" fillOpacity="0.45" />
        <circle className="faith-svg__dot faith-svg__dot--2" cx="760" cy="700" r="4" fill="#800654" fillOpacity="0.3" />
        <circle className="faith-svg__dot faith-svg__dot--3" cx="520" cy="80" r="3.5" fill="#c4a0ff" fillOpacity="0.5" />
      </svg>
    </div>
  );
}
