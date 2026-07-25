// Real BottomNav — replaces the dev 7-button placeholder. Floating glass,
// 3 tabs (Home / Cases / Email). `onNavigate(screenId)` routes via App's
// state-based router. Email routes to Filed for now (closest existing
// screen) until a dedicated email/letters-list screen lands.

const ITEMS = [
  {
    id: 'home',
    label: 'Home',
    icon: (
      <path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />
    ),
  },
  {
    id: 'cases',
    label: 'Cases',
    icon: (
      <>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M9 3h6v4H9zM8 11h8M8 15h5" />
      </>
    ),
  },
  {
    id: 'email',
    label: 'Email',
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <polyline points="3 7 12 13 21 7" />
      </>
    ),
  },
];

const ROUTES = {
  home: 'home',
  cases: 'dashboard',
  email: 'filed',
};

export default function BottomNav({
  active = 'home',
  notifyCases = false,
  urgent = false,
  caseCount = 0,
  hidden = false,
  onNavigate,
}) {
  return (
    <nav
      style={{
        // Fixed to the viewport so it stays visible regardless of any
        // scroll inside a screen. Centered within the 420px mobile column
        // (or full-bleed with 16px gutters on narrower viewports).
        position: 'fixed',
        left: '50%',
        transform: hidden
          ? 'translate(-50%, 120%)'
          : 'translateX(-50%)',
        width: 'min(388px, calc(100vw - 32px))',
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)',
        height: 64,
        borderRadius: 20,
        zIndex: 30,
        opacity: hidden ? 0 : 1,
        pointerEvents: hidden ? 'none' : 'auto',
        background: 'color-mix(in srgb, var(--bg-elevated) 85%, transparent)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid var(--border)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.18)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 8px',
        transition:
          'transform 240ms cubic-bezier(0.22,1,0.36,1), opacity 200ms ease',
      }}
    >
      {ITEMS.map((it) => {
        const isActive = it.id === active;
        const showBadge = it.id === 'cases' && notifyCases;
        return (
          <button
            key={it.id}
            onClick={() => onNavigate?.(ROUTES[it.id])}
            style={{
              background: isActive ? 'var(--accent-saffron-soft)' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              padding: '8px 18px',
              position: 'relative',
              borderRadius: 14,
              color: isActive ? 'var(--accent-saffron)' : 'var(--text-tertiary)',
              minHeight: 44,
              minWidth: 64,
            }}
          >
            <div style={{ position: 'relative', width: 24, height: 24 }}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {it.icon}
              </svg>
              {showBadge && (
                <span
                  aria-label={`${caseCount} active`}
                  style={{
                    position: 'absolute',
                    top: -3,
                    right: -6,
                    minWidth: 16,
                    height: 16,
                    padding: '0 4px',
                    borderRadius: 999,
                    background: 'var(--accent-saffron)',
                    color: 'var(--on-accent)',
                    fontSize: 9.5,
                    fontWeight: 700,
                    display: 'grid',
                    placeItems: 'center',
                    border: '2px solid var(--bg-elevated)',
                    boxShadow: '0 2px 8px var(--accent-saffron-border)',
                    animation: urgent ? 'pulseDot 1.4s ease-in-out infinite' : 'none',
                    lineHeight: 1,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {caseCount > 0 ? caseCount : ''}
                </span>
              )}
            </div>
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.02em',
              }}
            >
              {it.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
