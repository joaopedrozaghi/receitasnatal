/** Ícones de linha fina (autorais), 24x24, stroke = currentColor. */
const paths: Record<string, React.ReactNode> = {
  check: <path d="M5 12.5l4.2 4.2L19 7" />,
  x: <path d="M7 7l10 10M17 7L7 17" />,
  panettone: (
    <>
      <path d="M5 13.5c0-4.4 3.1-8 7-8s7 3.6 7 8" />
      <path d="M4.5 13.5h15l-1.2 6.2a1 1 0 0 1-1 .8H6.7a1 1 0 0 1-1-.8z" />
      <path d="M8.5 13.5l-.6 7M12 13.5v7M15.5 13.5l.6 7" />
      <circle cx="10" cy="9.5" r=".6" fill="currentColor" />
      <circle cx="13.6" cy="8.6" r=".6" fill="currentColor" />
    </>
  ),
  chocolate: (
    <>
      <rect x="5" y="4" width="14" height="16" rx="2" />
      <path d="M5 9.3h14M5 14.6h14M12 4v16" />
    </>
  ),
  dinner: (
    <>
      <circle cx="12" cy="13" r="6.5" />
      <circle cx="12" cy="13" r="3.5" />
      <path d="M3 4v5a1.5 1.5 0 0 0 3 0V4M4.5 9v11M21 4c-1.7 1-2.5 3-2.5 6h2.5v10" />
    </>
  ),
  dessert: (
    <>
      <path d="M4 14h16l-1.5 6h-13z" />
      <path d="M5 14c0-3 3.1-5 7-5s7 2 7 5" />
      <path d="M12 9V6.5M10.5 5c.5-1.2 2.5-1.2 3 0" />
    </>
  ),
  sos: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M6 6l3.5 3.5M18 6l-3.5 3.5M6 18l3.5-3.5M18 18l-3.5-3.5" />
    </>
  ),
  gift: (
    <>
      <rect x="4" y="9" width="16" height="11" rx="1.5" />
      <path d="M3 9h18M12 9v11M12 9c-1.5-3.5-5.5-4.2-5.5-1.5S12 9 12 9zM12 9c1.5-3.5 5.5-4.2 5.5-1.5S12 9 12 9z" />
    </>
  ),
  phone: (
    <>
      <rect x="7" y="3" width="10" height="18" rx="2.2" />
      <path d="M10.5 18h3" />
    </>
  ),
  scale: (
    <>
      <path d="M4 20h16l-1.5-9h-13z" />
      <circle cx="12" cy="15.5" r="2.2" />
      <path d="M12 15.5l1-1.2M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  stairs: <path d="M4 19h4v-4h4v-4h4V7h4" />,
  devices: (
    <>
      <rect x="3" y="5" width="13" height="10" rx="1.5" />
      <path d="M2 18h15" />
      <rect x="17.5" y="9" width="4.5" height="10" rx="1.2" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5M12 14.5v2.5" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.2-7.5 9.5-4.3-1.3-7.5-4.9-7.5-9.5V6z" />
      <path d="M8.8 12.2l2.2 2.2 4.3-4.6" />
    </>
  ),
  bolt: <path d="M13 3L5.5 13.5H12L11 21l7.5-10.5H12z" />,
  home: (
    <>
      <path d="M4 11l8-6.5 8 6.5" />
      <path d="M6 9.5V20h12V9.5M10 20v-5h4v5" />
    </>
  ),
  why: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.6 9.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.5v.4M12 16.6v.4" />
    </>
  ),
  calculator: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 7h8M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01M8.5 15h.01M12 15h.01M15.5 15h.01M8.5 18h.01M12 18h.01M15.5 18h.01" />
    </>
  ),
  tag: (
    <>
      <path d="M3.5 12.5V4.5a1 1 0 0 1 1-1h8l8 8a1 1 0 0 1 0 1.4l-7.6 7.6a1 1 0 0 1-1.4 0z" />
      <circle cx="8" cy="8" r="1.5" />
    </>
  ),
  ribbon: (
    <>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M8.5 13.2L7 21l5-2.6 5 2.6-1.5-7.8" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M4 10h16M8.5 3v4M15.5 3v4" />
    </>
  ),
  swap: <path d="M7 7h11l-3-3M17 17H6l3 3" />,
  sparkle: <path d="M12 3.5l1.8 5.2 5.2 1.8-5.2 1.8L12 17.5l-1.8-5.2L5 10.5l5.2-1.8z" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  truffle: (
    <>
      <circle cx="12" cy="9.5" r="4.5" />
      <path d="M5.5 13.5h13l-1.6 6a1 1 0 0 1-1 .8H8.1a1 1 0 0 1-1-.8z" />
      <path d="M9.5 13.5l.4 6.8M14.5 13.5l-.4 6.8M10.5 7.5l.5.5M13 6.8l.4.4M12.2 10l.4.3" />
    </>
  ),
  savory: (
    <>
      <path d="M12 3.5c-3 4-6 7.2-6 10.7a6 6 0 0 0 12 0c0-3.5-3-6.7-6-10.7z" />
      <path d="M9 14.5c.6 1.6 1.8 2.5 3 2.5" />
    </>
  ),
  roast: (
    <>
      <path d="M3 15.5h18" />
      <path d="M5 15.5c0-4 3.1-7 7-7s7 3 7 7" />
      <path d="M12 8.5V6.5M10.5 5h3M4 19h16" />
    </>
  ),
  wreath: (
    <>
      <circle cx="12" cy="12" r="7.5" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 4.5v3M12 16.5v3M4.5 12h3M16.5 12h3" />
    </>
  ),
  cookie: (
    <>
      <path d="M12 2.8l2.4 5 5.4.6-4 3.7 1.1 5.4L12 14.8l-4.9 2.7 1.1-5.4-4-3.7 5.4-.6z" />
      <circle cx="12" cy="10.5" r=".7" fill="currentColor" />
    </>
  ),
  flame: (
    <path d="M12 21c-3.9 0-6.5-2.6-6.5-6.2 0-3.4 2.4-5.3 3.6-8.3.5 2 1.6 3 2.6 3.4.1-2.6 1.3-5 3.5-6.4-.3 3 1 4.6 2.2 6.2 1 1.4 1.7 2.8 1.7 4.7 0 3.9-3.1 6.6-7.1 6.6z" />
  ),
  list: (
    <>
      <path d="M9 6h11M9 12h11M9 18h11" />
      <path d="M4 6l1 1 1.8-2M4 12l1 1 1.8-2M4 18l1 1 1.8-2" />
    </>
  ),
  heart: (
    <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z" />
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4 4" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: (
    <>
      <path d="M10.6 5.6A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.9 3.7M6.6 6.6C3.9 8.4 2.5 12 2.5 12S6 18.5 12 18.5c1.8 0 3.3-.5 4.6-1.2" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2M3 3l18 18" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
    </>
  ),
  chevron: <path d="M6 9l6 6 6-6" />,
  mail: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="M4 7l8 6 8-6" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M4.5 19.5l1.2-3.6A7.8 7.8 0 1 1 8.6 18.6z" />
      <path d="M9.2 8.8c.2-.6.8-.7 1.1-.3l.7 1.4c.1.3 0 .6-.2.8l-.4.4c.4 1 1.3 1.9 2.4 2.4l.4-.4c.2-.2.5-.3.8-.2l1.4.7c.4.2.3.9-.3 1.1-2.9 1.2-7-2.9-5.9-5.9z" />
    </>
  ),
  pix: (
    <>
      <path d="M12 3.2l3.4 3.4a2 2 0 0 0 1.4.6h1.4L12 13.4 5.8 7.2h1.4a2 2 0 0 0 1.4-.6z" />
      <path d="M12 20.8l3.4-3.4a2 2 0 0 1 1.4-.6h1.4L12 10.6l-6.2 6.2h1.4a2 2 0 0 1 1.4.6z" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="M3 10h18M7 15h3" />
    </>
  ),
  barcode: <path d="M4 5v14M7 5v14M10 5v14M13 5v14M15 5v14M18 5v14M20 5v14" />,
  copy: (
    <>
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </>
  ),
  arrowDown: <path d="M12 5v14M6 13l6 6 6-6" />,
};

export type IconName = keyof typeof paths;

export function Icon({
  name,
  className = "h-6 w-6",
  strokeWidth = 1.6,
  title,
}: {
  name: IconName | string;
  className?: string;
  strokeWidth?: number;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      {paths[name] ?? paths.sparkle}
    </svg>
  );
}
