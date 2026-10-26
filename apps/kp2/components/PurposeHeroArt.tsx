export function PurposeHeroArt() {
  return (
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    >
      <defs>
        <linearGradient id="kp-contact-wash" x1="0" y1="1" x2="1" y2="0">
          <stop stopColor="#151218" />
          <stop offset="1" stopColor="#3b1765" />
        </linearGradient>
      </defs>
      <rect width="1440" height="900" fill="url(#kp-contact-wash)" />
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <g transform="translate(1000 420) rotate(-8)" strokeWidth="9">
          <g stroke="#f7be1d" opacity="0.5">
            <rect x="-175" y="-90" width="350" height="225" rx="18" />
            <path d="M-172-77L0 48L172-77M-172 126L-50 15M172 126L50 15" />
          </g>
          <g stroke="#c5a5f1" opacity="0.35" transform="translate(-240 -180)">
            <path d="M0 0H190Q208 0 208 18V116Q208 134 190 134H77L26 176V134H0Q-18 134-18 116V18Q-18 0 0 0Z" />
            <path d="M28 48H160M28 83H117" />
          </g>
        </g>
      </g>
    </svg>
  );
}
