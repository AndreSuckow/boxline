export default function BrandLogo() {
  return (
    <svg
      className="brand-logo"
      viewBox="0 0 224 52"
      aria-hidden="true"
      focusable="false"
    >
      <g
        className="brand-symbol"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
      >
        <path d="M25 3 47 15v25L25 51 3 40V15Z" />
        <path d="m3 15 22 13 22-13M25 28v23M14 9l22 13" />
      </g>
      <text className="brand-word" x="58" y="36">
        BoxLyne<tspan className="brand-dot">.</tspan>
      </text>
    </svg>
  );
}
