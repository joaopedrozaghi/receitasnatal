/** Detalhes natalinos autorais e discretos (sempre decorativos: aria-hidden). */

export function Sprig({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 60" className={className} aria-hidden="true" fill="none">
      <path d="M6 48C30 40 62 30 112 10" stroke="#1F4D3A" strokeWidth="1.6" strokeLinecap="round" />
      {[
        [22, 43, -30],
        [36, 38, 20],
        [50, 33, -28],
        [64, 28, 22],
        [78, 22, -26],
        [92, 17, 24],
      ].map(([x, y, r], i) => (
        <ellipse
          key={i}
          cx={x}
          cy={y}
          rx="9"
          ry="3.6"
          transform={`rotate(${r} ${x} ${y})`}
          fill={i % 2 ? "#1F4D3A" : "#2E6A51"}
          opacity="0.9"
        />
      ))}
      <circle cx="104" cy="14" r="3.4" fill="#7A1F2B" />
      <circle cx="98" cy="9" r="2.6" fill="#7A1F2B" />
    </svg>
  );
}

export function OrangeSlice({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className} aria-hidden="true">
      <circle cx="30" cy="30" r="27" fill="#F2A65A" />
      <circle cx="30" cy="30" r="23" fill="#FCD9A8" />
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i * 36 * Math.PI) / 180;
        return (
          <path
            key={i}
            d={`M30 30 L${30 + 21 * Math.cos(a - 0.26)} ${30 + 21 * Math.sin(a - 0.26)} A21 21 0 0 1 ${30 + 21 * Math.cos(a + 0.26)} ${30 + 21 * Math.sin(a + 0.26)} Z`}
            fill="#F6B66E"
            stroke="#FCD9A8"
            strokeWidth="1.4"
          />
        );
      })}
      <circle cx="30" cy="30" r="2.5" fill="#FCD9A8" />
    </svg>
  );
}

export function Cinnamon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 30" className={className} aria-hidden="true">
      <g transform="rotate(-12 40 15)">
        <rect x="6" y="8" width="66" height="13" rx="6.5" fill="#9C5A33" />
        <path d="M10 11.5h58M10 17.5h58" stroke="#7A4122" strokeWidth="1.2" strokeLinecap="round" />
        <ellipse cx="70" cy="14.5" rx="3.2" ry="6.5" fill="#B9764B" />
        <path d="M70 10.5c-1.6 1.6-1.6 6.4 0 8" stroke="#7A4122" strokeWidth="1" fill="none" />
      </g>
    </svg>
  );
}

export function Star({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 1.5l2.2 7.3 7.3 2.2-7.3 2.2L12 22.5l-2.2-9.3L2.5 11l7.3-2.2z" fill="#C9A24B" />
    </svg>
  );
}

export function GoldThread({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 40" className={className} aria-hidden="true" preserveAspectRatio="none">
      <path
        d="M0 20 C 50 2, 100 38, 150 20 S 250 2, 300 20 S 380 34, 400 18"
        stroke="#C9A24B"
        strokeWidth="1.2"
        fill="none"
        strokeDasharray="1 5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Panetone ilustrado (usado em mockups e placeholders). */
export function PanettoneArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <ellipse cx="100" cy="176" rx="74" ry="9" fill="#12303B" opacity="0.10" />
      <path d="M36 92c0-38 28-64 64-64s64 26 64 64" fill="#C9772E" />
      <path d="M40 90c2-30 26-54 60-54s58 24 60 54" fill="#D98A3D" />
      <path
        d="M58 60c10-14 26-22 42-22"
        stroke="#F2B36B"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        opacity=".7"
      />
      {[
        [70, 70],
        [96, 56],
        [124, 66],
        [84, 84],
        [140, 84],
        [110, 80],
      ].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="4.5" ry="3.2" fill={i % 2 ? "#7A1F2B" : "#5B2A1A"} />
      ))}
      <circle cx="78" cy="58" r="2" fill="#FFF7EA" />
      <circle cx="116" cy="50" r="2" fill="#FFF7EA" />
      <circle cx="132" cy="74" r="2" fill="#FFF7EA" />
      <path d="M32 92h136l-8 76a6 6 0 0 1-6 5H46a6 6 0 0 1-6-5z" fill="#FFFFFF" />
      <path
        d="M32 92h136l-8 76a6 6 0 0 1-6 5H46a6 6 0 0 1-6-5z"
        fill="none"
        stroke="#12303B"
        strokeOpacity=".08"
      />
      {[52, 72, 92, 112, 132, 150].map((x, i) => (
        <path key={i} d={`M${x} 92l${i < 3 ? -2 : 2} 80`} stroke="#F2705A" strokeWidth="5" opacity=".85" />
      ))}
      <path d="M32 112h136" stroke="#C9A24B" strokeWidth="4" />
      <path d="M92 104c-10-8-22-4-16 4s16 4 16 4 10 4 16-4-6-12-16-4z" fill="#7A1F2B" />
    </svg>
  );
}
