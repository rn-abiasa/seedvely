const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export const Shovel = (p) => (
  <svg {...base} {...p}>
    <path d="M20 4l-6.5 6.5" />
    <path d="M17.5 3.5l3 3" />
    <path d="M11 9l4 4-5.5 5.5a2.8 2.8 0 01-4 0 2.8 2.8 0 010-4z" />
  </svg>
);

export const Scissors = (p) => (
  <svg {...base} {...p}>
    <circle cx="6" cy="6" r="2.5" />
    <circle cx="6" cy="18" r="2.5" />
    <path d="M8 7.5L20 17M8 16.5L20 7" />
  </svg>
);

export const Sliders = (p) => (
  <svg {...base} {...p}>
    <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
    <circle cx="15" cy="7" r="2" />
    <circle cx="9" cy="17" r="2" />
  </svg>
);

export const Tray = (p) => (
  <svg {...base} {...p}>
    <path d="M12 4v10M8 10.5l4 4 4-4M5 19h14" />
  </svg>
);

export const Chevron = ({ dir = "right", ...p }) => (
  <svg {...base} {...p}>
    <path d={dir === "right" ? "M9 6l6 6-6 6" : "M15 6l-6 6 6 6"} />
  </svg>
);

export const Archive = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="4" width="18" height="5" rx="1.5" />
    <path d="M5 9v9a2 2 0 002 2h10a2 2 0 002-2V9M10 13h4" />
  </svg>
);

export const Sun = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

export const Moon = (p) => (
  <svg {...base} {...p}>
    <path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z" />
  </svg>
);

export const ArrowLeft = (p) => (
  <svg {...base} {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);
