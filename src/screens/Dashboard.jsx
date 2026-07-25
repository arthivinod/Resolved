// ─────────────────────────────────────────────────────────────────
// Dashboard — Screen 7 ("Your cases"). Stats row + filter pills +
// 5 staged cases (Active + Resolved sections).
// Ported from design-exports/Hackathon/cases-screen.jsx.
// ─────────────────────────────────────────────────────────────────

import { useState, useMemo } from 'react';
import BottomNav from '../components/BottomNav.jsx';

function Header() {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '8px 16px 12px', position: 'relative', zIndex: 2,
    }}>
      <span style={{ width: 44, height: 44 }} aria-hidden />
      <span style={{
        fontSize: 16, fontWeight: 700, letterSpacing: '-0.025em',
        color: 'var(--text-primary)',
      }}>Resolved</span>
      <span style={{ width: 44, height: 44 }} aria-hidden />
    </header>
  );
}

function Stat({ label, value, sub, gradient }) {
  return (
    <div>
      <div style={{
        fontSize: 10, fontWeight: 700,
        letterSpacing: '0.14em', textTransform: 'uppercase',
        color: 'var(--text-secondary)',
      }}>{label}</div>
      <div style={{
        marginTop: 6,
        fontSize: 24, fontWeight: 700,
        letterSpacing: '-0.025em', lineHeight: 1.05,
        fontVariantNumeric: 'tabular-nums',
        color: gradient ? 'transparent' : 'var(--text-primary)',
        ...(gradient ? {
          background: 'var(--gradient-hero-text)',
          WebkitBackgroundClip: 'text', backgroundClip: 'text',
        } : {}),
      }}>{value}</div>
      <div style={{
        marginTop: 6,
        fontSize: 11.5, lineHeight: 1.4,
        color: 'var(--text-tertiary)',
      }}>{sub}</div>
    </div>
  );
}

function StatsRow({ recovered = '₹91,208', wins = 8, winRate = '78%', lifetime = 240 }) {
  return (
    <section style={{ padding: '0 20px' }}>
      <div style={{
        padding: '18px 18px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 18,
        display: 'grid',
        gridTemplateColumns: '1fr 1px 1fr',
        gap: 18, alignItems: 'center',
      }}>
        <Stat
          label="Recovered"
          value={recovered}
          sub={`across ${wins} wins this year`}
          gradient
        />
        <div style={{ width: 1, alignSelf: 'stretch', background: 'var(--border)' }} />
        <Stat
          label="Win rate"
          value={winRate}
          sub={`of ${lifetime} lifetime cases`}
        />
      </div>
    </section>
  );
}

function FilterPills({ active, counts, onChange }) {
  const pills = [
    { id: 'all',         label: 'All',         count: counts.all },
    { id: 'in-progress', label: 'In progress', count: counts['in-progress'] },
    { id: 'won',         label: 'Won',         count: counts.won },
    { id: 'escalated',   label: 'Escalated',   count: counts.escalated },
  ];
  return (
    <div style={{
      display: 'flex', gap: 8,
      overflowX: 'auto', overflowY: 'hidden',
      padding: '4px 20px 2px',
      scrollbarWidth: 'none',
      WebkitOverflowScrolling: 'touch',
    }}>
      {pills.map((p) => {
        const isActive = p.id === active;
        return (
          <button
            key={p.id}
            onClick={() => onChange(p.id)}
            aria-pressed={isActive}
            style={{
              flexShrink: 0,
              padding: '8px 14px', minHeight: 36,
              borderRadius: 999,
              background: isActive ? 'var(--accent-saffron-soft)' : 'var(--bg-surface)',
              border: isActive
                ? '1px solid var(--accent-saffron-border)'
                : '1px solid var(--border)',
              color: isActive ? 'var(--accent-saffron)' : 'var(--text-secondary)',
              fontFamily: 'inherit',
              fontSize: 13, fontWeight: isActive ? 700 : 600,
              letterSpacing: '-0.005em',
              cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              transition: 'background 200ms ease, color 200ms ease, border-color 200ms ease',
            }}
          >
            {p.label}
            {p.count != null && (
              <span style={{
                fontSize: 11, fontWeight: 700,
                opacity: 0.75,
                fontVariantNumeric: 'tabular-nums',
              }}>{p.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function StatusChip({ status }) {
  const config = {
    'in-progress': {
      label: 'In progress',
      bg: 'var(--accent-saffron-soft)',
      border: 'var(--accent-saffron-border)',
      color: 'var(--accent-saffron)',
    },
    'escalated': {
      label: 'Escalated',
      bg: 'var(--warning-soft)',
      border: 'color-mix(in srgb, var(--warning) 40%, transparent)',
      color: 'var(--warning)',
    },
    'won': {
      label: 'Won',
      bg: 'var(--success-soft)',
      border: 'color-mix(in srgb, var(--success) 40%, transparent)',
      color: 'var(--success)',
    },
  }[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 10px', borderRadius: 999,
      background: config.bg,
      border: `1px solid ${config.border}`,
      color: config.color,
      fontSize: 10.5, fontWeight: 700,
      letterSpacing: '0.1em', textTransform: 'uppercase',
    }}>
      {status === 'won' && (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="3.2"
             strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
      {config.label}
    </span>
  );
}

function CaseCard({ kase, onOpen }) {
  const [pressed, setPressed] = useState(false);
  const isInteractive = !!kase.openable;

  const amountColor =
    kase.status === 'won'       ? 'var(--success)' :
    kase.status === 'escalated' ? 'var(--warning)' :
                                  'var(--text-primary)';

  return (
    <button
      onClick={isInteractive ? () => onOpen(kase) : undefined}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        width: '100%',
        minHeight: 84,
        padding: '14px 16px',
        textAlign: 'left',
        background: pressed ? 'var(--bg-elevated)' : 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        cursor: isInteractive ? 'pointer' : 'default',
        fontFamily: 'inherit',
        color: 'var(--text-primary)',
        transition: 'background 160ms ease, transform 100ms ease-out',
        transform: pressed && isInteractive ? 'scale(0.995)' : 'scale(1)',
        display: 'grid',
        gridTemplateColumns: '40px 1fr auto',
        columnGap: 14,
        rowGap: 6,
        alignItems: 'center',
      }}
    >
      <div style={{
        gridRow: '1 / span 2',
        width: 40, height: 40, borderRadius: 12,
        background: kase.status === 'won' ? 'var(--success-soft)'
                  : kase.status === 'escalated' ? 'var(--warning-soft)'
                  : 'var(--accent-saffron-soft)',
        border: `1px solid ${
          kase.status === 'won' ? 'color-mix(in srgb, var(--success) 30%, transparent)'
          : kase.status === 'escalated' ? 'color-mix(in srgb, var(--warning) 30%, transparent)'
          : 'var(--accent-saffron-border)'
        }`,
        display: 'grid', placeItems: 'center',
        fontSize: 20,
      }}>{kase.icon}</div>

      <div style={{
        fontSize: 15.5, fontWeight: 700,
        letterSpacing: '-0.015em', lineHeight: 1.2,
        color: 'var(--text-primary)',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>{kase.vendor}</div>
      <div style={{
        fontSize: 18, fontWeight: 700,
        letterSpacing: '-0.02em', lineHeight: 1,
        fontVariantNumeric: 'tabular-nums',
        color: amountColor,
        justifySelf: 'end',
      }}>{kase.amountDisplay}</div>

      <div style={{
        gridColumn: '2 / span 2',
        display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8,
        rowGap: 6,
      }}>
        <span style={{
          fontSize: 12.5, lineHeight: 1.4,
          color: 'var(--text-secondary)',
          letterSpacing: '-0.005em',
          flex: '1 1 auto', minWidth: 0,
        }}>{kase.subtitle}</span>

        {kase.urgent && (
          <span aria-label="Auto-escalation soon" style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '2px 8px', borderRadius: 999,
            background: 'var(--accent-saffron-soft)',
            color: 'var(--accent-saffron)',
            fontSize: 10, fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2"
                 strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <polyline points="12 7 12 12 16 14" />
            </svg>
            18h
          </span>
        )}

        <StatusChip status={kase.status} />
      </div>
    </button>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      padding: '20px 20px 10px',
      fontSize: 10.5, fontWeight: 700,
      letterSpacing: '0.14em', textTransform: 'uppercase',
      color: 'var(--text-tertiary)',
    }}>{children}</div>
  );
}

const CASES = [
  {
    id: 'RV-00214', vendor: 'Amazon · MacBook charger', icon: '📦',
    amount: 7499, amountDisplay: '₹7,499',
    status: 'in-progress',
    subtitle: 'Filed 2 min ago · Auto-escalation tomorrow',
    urgent: true,
    openable: true,
  },
  {
    id: 'RV-00193', vendor: 'HDFC ERGO Health', icon: '🏥',
    amount: 45000, amountDisplay: '₹45,000',
    status: 'escalated',
    subtitle: 'IRDAI Bima Bharosa · awaiting response',
    openable: false,
  },
  {
    id: 'RV-00172', vendor: 'IndiGo · 6E-203', icon: '✈️',
    amount: 7500, amountDisplay: '₹7,500',
    status: 'won',
    subtitle: 'DGCA compensation · settled in 11 days',
  },
  {
    id: 'RV-00154', vendor: 'Jio', icon: '📱',
    amount: 288, amountDisplay: '₹288',
    status: 'won',
    subtitle: 'TRAI VAS regulation · refunded in 4 days',
  },
  {
    id: 'RV-00138', vendor: 'Croma', icon: '📺',
    amount: 38000, amountDisplay: '₹38,000',
    status: 'won',
    subtitle: 'CC chargeback · resolved in 6 days',
  },
];

function partition(cases, filter) {
  const filtered = filter === 'all'
    ? cases
    : cases.filter((c) => c.status === filter);
  const active = filtered.filter((c) => c.status === 'in-progress' || c.status === 'escalated');
  const resolved = filtered.filter((c) => c.status === 'won');
  return { filtered, active, resolved };
}

export default function CasesScreen({ mode = 'light', onNavigate = () => {} }) {
  const [filter, setFilter] = useState('all');

  const counts = useMemo(() => ({
    all:           CASES.length,
    'in-progress': CASES.filter((c) => c.status === 'in-progress').length,
    won:           CASES.filter((c) => c.status === 'won').length,
    escalated:     CASES.filter((c) => c.status === 'escalated').length,
  }), []);

  const { active, resolved } = useMemo(() => partition(CASES, filter), [filter]);
  const showSections = filter === 'all';

  return (
    <div
      className={mode === 'dark' ? 'mode-dark' : 'mode-light'}
      style={{
        position: 'relative', width: '100%', height: '100%',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        WebkitFontSmoothing: 'antialiased',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        overflow: 'auto', overflowX: 'hidden',
        paddingTop: 50,
        paddingBottom: 130,
        overscrollBehavior: 'contain',
      }}>
        <Header />

        <section style={{ padding: '8px 20px 18px' }}>
          <h1 style={{
            margin: 0,
            fontSize: 28, lineHeight: 1.1, fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
          }}>Your cases</h1>
        </section>

        <StatsRow />

        <div style={{
          position: 'sticky', top: 0, zIndex: 10,
          marginTop: 18, paddingTop: 8, paddingBottom: 8,
          background: 'color-mix(in srgb, var(--bg-primary) 88%, transparent)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '0 1px 0 var(--border)',
        }}>
          <FilterPills active={filter} counts={counts} onChange={setFilter} />
        </div>

        {showSections ? (
          <>
            {active.length > 0 && (
              <>
                <SectionLabel>Active · {active.length}</SectionLabel>
                <section style={{
                  padding: '0 20px',
                  display: 'flex', flexDirection: 'column', gap: 10,
                }}>
                  {active.map((k) => (
                    <CaseCard
                      key={k.id}
                      kase={k}
                      onOpen={(kase) => kase.openable && onNavigate('filed')}
                    />
                  ))}
                </section>
              </>
            )}

            {resolved.length > 0 && (
              <>
                <SectionLabel>Resolved · {resolved.length}</SectionLabel>
                <section style={{
                  padding: '0 20px',
                  display: 'flex', flexDirection: 'column', gap: 10,
                }}>
                  {resolved.map((k) => (
                    <CaseCard
                      key={k.id}
                      kase={k}
                      onOpen={(kase) => kase.openable && onNavigate('filed')}
                    />
                  ))}
                </section>
              </>
            )}
          </>
        ) : (
          <section style={{
            padding: '16px 20px 0',
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            {[...active, ...resolved].map((k) => (
              <CaseCard
                key={k.id}
                kase={k}
                onOpen={(kase) => kase.openable && onNavigate('filed')}
              />
            ))}
            {active.length + resolved.length === 0 && (
              <div style={{
                padding: '32px 8px', textAlign: 'center',
                color: 'var(--text-tertiary)',
                fontSize: 13, lineHeight: 1.5,
              }}>
                No <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                  {filter.replace('-', ' ')}
                </span> cases yet.
              </div>
            )}
          </section>
        )}
      </div>

      <BottomNav active="cases" onNavigate={onNavigate} />
    </div>
  );
}
