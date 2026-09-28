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
        stroke="#f86b2b"
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(3 1) scale(0.3)"
      >
        <path d="M7 46 73 7 139 46 73 84 7 46v76l66 38 66-38V66M73 84v55" />
      </g>
      <text className="brand-word" x="58" y="36">
        BoxLyne<tspan className="brand-dot">.</tspan>
      </text>
    </svg>
  );
}
