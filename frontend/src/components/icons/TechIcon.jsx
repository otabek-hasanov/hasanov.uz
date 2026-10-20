const DB_SVG = (
  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
    <ellipse cx="12" cy="5.5" rx="7.5" ry="2.8" />
    <path d="M4.5 5.5v6c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8v-6" />
    <path d="M4.5 11.5v6c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8v-6" />
  </svg>
);

export const TECH_DEFS = {
  php: { bg: '#777BB4', fg: '#fff', label: 'php' },
  javascript: { bg: '#F7DF1E', fg: '#1a1a1a', label: 'JS' },
  nodejs: {
    bg: '#339933',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
        <path d="M12 2l8 4.6v10.8L12 22l-8-4.6V6.6z" />
      </svg>
    ),
  },
  react: {
    bg: '#0b1120',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#61DAFB" strokeWidth="1.3">
        <circle cx="12" cy="12" r="1.8" fill="#61DAFB" stroke="none" />
        <ellipse cx="12" cy="12" rx="9" ry="3.6" />
        <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)" />
      </svg>
    ),
  },
  tailwind: {
    bg: '#0b1120',
    svg: (
      <svg viewBox="0 0 24 24" fill="#38BDF8">
        <path d="M12 5c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.761.19 1.305.742 1.906 1.355C13.459 9.903 14.675 11 17 11c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.761-.19-1.305-.742-1.906-1.355C15.541 6.097 14.325 5 12 5zM7 11c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.761.19 1.305.742 1.906 1.355C8.459 15.903 9.675 17 12 17c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.761-.19-1.305-.742-1.906-1.355C10.541 12.097 9.325 11 7 11z" />
      </svg>
    ),
  },
  mysql: { bg: '#4479A1', svg: DB_SVG },
  postgresql: { bg: '#336791', svg: DB_SVG },
  mongodb: {
    bg: '#47A248',
    svg: (
      <svg viewBox="0 0 24 24" fill="#fff">
        <path d="M12 2c3 3.5 6 7.2 6 11.2A6 6 0 0 1 6 13.2C6 9.2 9 5.5 12 2z" />
      </svg>
    ),
  },
  redis: {
    bg: '#DC382D',
    svg: (
      <svg viewBox="0 0 24 24" fill="#fff">
        <path d="M12 2l8 3.6-8 3.6-8-3.6L12 2zm-8 7.4 8 3.6 8-3.6v3.2l-8 3.6-8-3.6V9.4zm0 6 8 3.6 8-3.6v3.2l-8 3.6-8-3.6v-3.2z" />
      </svg>
    ),
  },
  git: {
    bg: '#F05032',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
        <circle cx="6" cy="6" r="2" />
        <circle cx="6" cy="18" r="2" />
        <circle cx="18" cy="9" r="2" />
        <path d="M6 8v8M6 8c0 5 5 1 8 1" />
      </svg>
    ),
  },
  telegram: {
    bg: '#26A5E4',
    svg: (
      <svg viewBox="0 0 24 24" fill="#fff">
        <path d="M21.5 3.5 2.3 11.1c-.9.35-.9 1.65.02 1.98l4.46 1.58 1.73 5.4c.28.87 1.4 1.1 2 .42l2.5-2.8 4.56 3.38c.76.56 1.85.14 2.04-.79l3.3-15.3c.2-.95-.76-1.7-1.6-1.47zM8.3 13.6l9.4-6.9-7.6 8.2z" />
      </svg>
    ),
  },
  payments: {
    bg: '#7C3AED',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
        <rect x="2.5" y="5.5" width="19" height="13" rx="2.2" />
        <path d="M2.5 9.5h19" strokeWidth="2.2" />
        <path d="M6 14.5h5" strokeLinecap="round" />
      </svg>
    ),
  },
};

export default function TechIcon({ icon, className = 'h-9 w-9' }) {
  const def = TECH_DEFS[icon] || { bg: '#64748b', fg: '#fff', label: '?' };
  return (
    <span className={`inline-flex ${className} shrink-0 items-center justify-center rounded-xl`} style={{ background: def.bg }}>
      {def.label ? (
        <span className="text-[10px] font-extrabold tracking-tight" style={{ color: def.fg }}>
          {def.label}
        </span>
      ) : (
        <span className="h-[55%] w-[55%]">{def.svg}</span>
      )}
    </span>
  );
}
