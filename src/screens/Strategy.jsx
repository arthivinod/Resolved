// ─────────────────────────────────────────────────────────────────
// Strategy — Screen 4. 4 strategic levers (accordion) + forecast row.
// Ported from design-exports/Hackathon/strategy-screen.jsx.
// ─────────────────────────────────────────────────────────────────

import { useState, useRef } from 'react';
import StepIndicator from '../components/StepIndicator.jsx';
import BottomNav from '../components/BottomNav.jsx';

function Header({ canReset, onReset, onBack }) {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '8px 16px 12px', position: 'relative', zIndex: 2,
    }}>
      <button onClick={onBack} aria-label="Back to extracting" style={{
        width: 44, height: 44, padding: 0,
        background: 'transparent', border: 'none', cursor: 'pointer',
        borderRadius: 999, display: 'grid', placeItems: 'center',
        color: 'var(--text-secondary)',
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="1.8"
             strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <span style={{
        fontSize: 16, fontWeight: 700, letterSpacing: '-0.025em',
        color: 'var(--text-primary)',
      }}>Resolved</span>
      <button
        onClick={onReset}
        disabled={!canReset}
        style={{
          height: 36, padding: '0 14px', minWidth: 44, minHeight: 44,
          background: 'transparent', border: 'none',
          cursor: canReset ? 'pointer' : 'default',
          color: canReset ? 'var(--text-primary)' : 'var(--text-tertiary)',
          fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
          letterSpacing: '-0.01em',
          opacity: canReset ? 1 : 0.55,
          transition: 'opacity 200ms ease, color 200ms ease',
        }}>
        Reset
      </button>
    </header>
  );
}

function EditedTag({ onRevert }) {
  return (
    <button
      onClick={onRevert}
      aria-label="Revert to AI's pick"
      style={{
        marginLeft: 8,
        height: 18, padding: '0 6px 0 5px',
        display: 'inline-flex', alignItems: 'center', gap: 3,
        borderRadius: 999,
        background: 'var(--accent-saffron-soft)',
        border: '1px solid var(--accent-saffron-border)',
        color: 'var(--accent-saffron)',
        fontFamily: 'inherit',
        fontSize: 9.5, fontWeight: 700,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        cursor: 'pointer',
      }}
    >
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="3"
           strokeLinecap="round" strokeLinejoin="round">
        <polyline points="1 4 1 10 7 10" />
        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
      </svg>
      edited
    </button>
  );
}

function AlternativeChip({ label, selected, isAIPick, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 12px', minHeight: 36,
        borderRadius: 999,
        background: selected ? 'var(--accent-saffron-soft)' : 'var(--bg-elevated)',
        border: selected
          ? '1px solid var(--accent-saffron)'
          : '1px solid var(--border)',
        color: selected ? 'var(--accent-saffron)' : 'var(--text-primary)',
        fontFamily: 'inherit',
        fontSize: 12.5, fontWeight: 600,
        letterSpacing: '-0.005em',
        cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 5,
        transition: 'background 180ms ease, border-color 180ms ease, color 180ms ease',
      }}
    >
      {isAIPick && (
        <span aria-label="AI's pick" style={{
          width: 12, height: 12, display: 'grid', placeItems: 'center',
          color: selected ? 'var(--accent-saffron)' : 'var(--text-tertiary)',
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1.5 14 9l7.5 2-7.5 2-2 7.5-2-7.5L2.5 11l7.5-2z" />
          </svg>
        </span>
      )}
      {label}
    </button>
  );
}

function StrategyRow({ label, value, aiValue, why, alternatives, isOpen, onToggle, onSelectAlt, edited, onRevert }) {
  const [pressed, setPressed] = useState(false);
  return (
    <div>
      <button
        onClick={onToggle}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        onTouchStart={() => setPressed(true)}
        onTouchEnd={() => setPressed(false)}
        aria-expanded={isOpen}
        style={{
          width: '100%', minHeight: 56,
          padding: '14px 16px',
          background: pressed && !isOpen ? 'var(--accent-saffron-soft)' : 'transparent',
          border: 'none', cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', gap: 12,
          textAlign: 'left',
          color: 'var(--text-primary)',
          transition: 'background 160ms ease',
        }}
      >
        <span style={{
          flexShrink: 0, width: 96,
          fontSize: 10, fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'var(--text-tertiary)',
          display: 'inline-flex', alignItems: 'center',
        }}>
          {label}
          {edited && (
            <span onClick={(e) => { e.stopPropagation(); onRevert(); }}
                  style={{ pointerEvents: 'auto' }}>
              <EditedTag onRevert={onRevert} />
            </span>
          )}
        </span>
        <span style={{
          flex: 1, minWidth: 0,
          fontSize: 14.5, fontWeight: 600,
          letterSpacing: '-0.015em',
          color: 'var(--text-primary)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{value}</span>
        <span style={{
          width: 24, height: 24, flexShrink: 0,
          display: 'grid', placeItems: 'center',
          color: isOpen ? 'var(--accent-saffron)' : 'var(--text-tertiary)',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 200ms cubic-bezier(0.22,1,0.36,1), color 200ms ease',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2.4"
               strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div style={{ padding: '0 16px 16px' }}>
          <p style={{
            margin: 0,
            fontSize: 13, lineHeight: 1.55,
            color: 'var(--text-secondary)',
            fontStyle: 'italic',
          }}>
            <span style={{
              fontStyle: 'normal', fontWeight: 600,
              color: 'var(--text-primary)',
              marginRight: 6,
            }}>Why this?</span>
            {why}
          </p>

          {alternatives && alternatives.length > 0 && (
            <>
              <div style={{
                marginTop: 14,
                fontSize: 10, fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'var(--text-tertiary)',
              }}>Alternatives</div>
              <div style={{
                marginTop: 10,
                display: 'flex', flexWrap: 'wrap', gap: 8,
              }}>
                {[aiValue, ...alternatives.filter((a) => a !== aiValue)].map((alt) => (
                  <AlternativeChip
                    key={alt}
                    label={alt}
                    selected={alt === value}
                    isAIPick={alt === aiValue}
                    onClick={() => onSelectAlt(alt)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div style={{
        height: 1, margin: '0 16px',
        background: 'var(--border)',
      }} />
    </div>
  );
}

function ForecastRow({ value, basis }) {
  const [tipOpen, setTipOpen] = useState(false);
  const holdTimer = useRef(null);

  const startHold = () => { holdTimer.current = setTimeout(() => setTipOpen(true), 350); };
  const cancelHold = () => { clearTimeout(holdTimer.current); };
  const closeTip = () => setTipOpen(false);

  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        margin: '4px 16px 0', display: 'flex', flexDirection: 'column', gap: 2,
      }}>
        <div style={{ height: 1, background: 'var(--border-strong)' }} />
        <div style={{ height: 1, background: 'var(--border)' }} />
      </div>

      <div
        onMouseDown={startHold}
        onMouseUp={cancelHold}
        onMouseLeave={cancelHold}
        onTouchStart={startHold}
        onTouchEnd={cancelHold}
        onTouchCancel={cancelHold}
        style={{
          padding: '14px 16px',
          minHeight: 56,
          display: 'flex', alignItems: 'center', gap: 12,
        }}
      >
        <span style={{
          flexShrink: 0, width: 96,
          fontSize: 10, fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'var(--text-tertiary)',
        }}>Forecast</span>

        <span style={{
          flex: 1, minWidth: 0,
          display: 'inline-flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{
            fontSize: 18, fontWeight: 700,
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums',
            background: 'var(--gradient-hero-text)',
            WebkitBackgroundClip: 'text', backgroundClip: 'text',
            color: 'transparent',
          }}>{value}</span>
          <span style={{
            padding: '2px 7px', borderRadius: 999,
            background: 'var(--accent-trust-soft)',
            border: '1px solid var(--accent-trust-border)',
            color: 'var(--accent-trust)',
            fontSize: 9, fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>Forecast</span>
        </span>

        <button
          onClick={() => setTipOpen((v) => !v)}
          aria-label="What does this forecast mean?"
          style={{
            width: 24, height: 24, flexShrink: 0, padding: 0,
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'var(--text-tertiary)',
            display: 'grid', placeItems: 'center',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="1.8"
               strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
        </button>
      </div>

      <div style={{
        margin: '0 16px',
        paddingBottom: 14,
        fontSize: 11.5, lineHeight: 1.5,
        color: 'var(--text-tertiary)',
      }}>{basis}</div>

      {tipOpen && (
        <div
          onClick={closeTip}
          style={{
            position: 'absolute', right: 12, bottom: 'calc(100% - 4px)',
            zIndex: 5,
            maxWidth: 240,
            padding: '10px 12px',
            borderRadius: 12,
            background: 'var(--bg-surface)',
            border: '1px solid var(--accent-trust-border)',
            color: 'var(--text-primary)',
            fontSize: 12, lineHeight: 1.5,
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.18)',
          }}>
          Directional estimate based on similar cases. Real outcomes depend on vendor response. Not a guarantee.
        </div>
      )}
    </div>
  );
}

function PrimaryCTA({ onClick }) {
  const [pressed, setPressed] = useState(false);
  const [rippling, setRippling] = useState(false);

  const handleClick = () => {
    setRippling(true);
    setTimeout(() => { setRippling(false); onClick && onClick(); }, 240);
  };

  return (
    <button
      onClick={handleClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        height: 56, width: '100%', padding: '0 24px',
        borderRadius: 999, border: 'none', cursor: 'pointer',
        background: 'var(--gradient-hero)',
        color: 'var(--on-accent)',
        fontFamily: 'inherit', fontSize: 16, fontWeight: 700,
        letterSpacing: '-0.01em',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        boxShadow: pressed
          ? '0 2px 8px var(--accent-saffron-border)'
          : 'var(--glow-cta)',
        transform: pressed ? 'scale(0.98)' : 'scale(1)',
        transition: 'transform 100ms ease-out, box-shadow 200ms ease',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <span style={{
        width: 18, height: 18, display: 'grid', placeItems: 'center',
        position: 'relative',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1.5 14 9l7.5 2-7.5 2-2 7.5-2-7.5L2.5 11l7.5-2z" />
        </svg>
        {rippling && (
          <span aria-hidden style={{
            position: 'absolute', inset: -8,
            borderRadius: '50%',
            background: 'currentColor',
            opacity: 0,
            animation: 'sparkleRipple 240ms ease-out both',
          }} />
        )}
      </span>
      Draft the complaint
    </button>
  );
}

// Channel was relocated to Screen 5 (Your Move) as the format picker, so
// it's intentionally absent here. The three remaining levers are the ones
// the user adjusts before drafting.
const ROWS = [
  {
    id: 'tone',
    label: 'Tone',
    aiValue: 'Firm · evidence-backed',
    why: 'Amazon responds best to clear documentation, not emotional appeals.',
    alternatives: ['Polite', 'Firm · evidence-backed', 'Sharp'],
  },
  {
    id: 'legal',
    label: 'Legal hook',
    aiValue: 'Amazon A-to-Z Guarantee + Consumer Protection Act 2019 §47',
    why: "Amazon's own published commitment covers manufacturing defects within 90 days; CPA backstops it for up to 2 years.",
    alternatives: [
      'Amazon A-to-Z Guarantee + Consumer Protection Act 2019 §47',
      'Consumer Protection Act 2019 §47 only',
      'BIS quality standards for electronics',
    ],
  },
  {
    id: 'demand',
    label: 'Demand',
    aiValue: 'Replacement OR full refund to source',
    why: 'Replacement first — faster than refund; refund as fallback if replacement unavailable.',
    alternatives: ['Replacement OR full refund to source', 'Replacement only', 'Refund to source'],
  },
];

export default function StrategyScreen({
  mode = 'light',
  vendor = 'Amazon',
  onNavigate = () => {},
}) {
  const [values, setValues] = useState(() =>
    Object.fromEntries(ROWS.map((r) => [r.id, r.aiValue]))
  );
  const [openId, setOpenId] = useState(null);

  const canReset = ROWS.some((r) => values[r.id] !== r.aiValue);
  const handleReset = () => {
    setValues(Object.fromEntries(ROWS.map((r) => [r.id, r.aiValue])));
  };
  const handleSelectAlt = (rowId, alt) => {
    setValues((prev) => ({ ...prev, [rowId]: alt }));
  };
  const handleRevert = (rowId) => {
    const row = ROWS.find((r) => r.id === rowId);
    setValues((prev) => ({ ...prev, [rowId]: row.aiValue }));
  };

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
        paddingBottom: 120,
        overscrollBehavior: 'contain',
      }}>
        <Header
          canReset={canReset}
          onReset={handleReset}
          onBack={() => onNavigate('extracting')}
        />

        <section style={{ padding: '8px 20px 0' }}>
          <StepIndicator>Step 3 of 4 · Strategy</StepIndicator>
          <h1 style={{
            margin: '14px 0 0',
            fontSize: 28, lineHeight: 1.15, fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
          }}>Here's the play.</h1>
          <p style={{
            margin: '8px 0 0',
            fontSize: 13, lineHeight: 1.5,
            color: 'var(--text-secondary)',
          }}>
            Chosen from {vendor}'s playbook
          </p>
        </section>

        <section style={{ padding: '24px 20px 0' }}>
          <div style={{
            borderRadius: 18,
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            overflow: 'hidden',
          }}>
            {ROWS.map((row) => (
              <StrategyRow
                key={row.id}
                label={row.label}
                value={values[row.id]}
                aiValue={row.aiValue}
                why={row.why}
                alternatives={row.alternatives}
                isOpen={openId === row.id}
                onToggle={() => setOpenId((cur) => cur === row.id ? null : row.id)}
                onSelectAlt={(alt) => handleSelectAlt(row.id, alt)}
                edited={values[row.id] !== row.aiValue}
                onRevert={() => handleRevert(row.id)}
              />
            ))}
            <ForecastRow
              value="~82% success"
              basis={
                "Amazon's A-to-Z resolution rate for in-warranty electronics is " +
                "consistently high; clear documentation pushes it higher."
              }
            />
          </div>
        </section>

        <section style={{ padding: '20px 20px 0' }}>
          <PrimaryCTA onClick={() => onNavigate('yourmove')} />
        </section>
      </div>

      <BottomNav active="home" onNavigate={onNavigate} />
    </div>
  );
}
