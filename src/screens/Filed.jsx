// ─────────────────────────────────────────────────────────────────
// Filed — Screen 6. Small orb celebration + Case ID + 5-step
// escalation ladder + "You do nothing" saffron callout.
// Ported from design-exports/Hackathon/filed-screen.jsx.
// ─────────────────────────────────────────────────────────────────

import { useState } from 'react';
import Orb from '../components/Orb.jsx';
import BottomNav from '../components/BottomNav.jsx';

function Header({ onDone }) {
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
      <button onClick={onDone} style={{
        height: 36, padding: '0 14px', minWidth: 44, minHeight: 44,
        background: 'transparent', border: 'none', cursor: 'pointer',
        color: 'var(--text-primary)', fontFamily: 'inherit',
        fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em',
      }}>Done</button>
    </header>
  );
}

function FiledChip() {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '5px 11px 5px 9px', borderRadius: 999,
      background: 'var(--success-soft)',
      border: '1px solid color-mix(in srgb, var(--success) 40%, transparent)',
      color: 'var(--success)',
      fontSize: 11, fontWeight: 700,
      letterSpacing: '0.1em', textTransform: 'uppercase',
    }}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="3.2"
           strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      Filed
    </span>
  );
}

function CaseHeader({ caseId = 'RV-00214', vendor = 'Amazon', timeNatural = 'just now' }) {
  return (
    <section style={{
      padding: '12px 20px 0',
      display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
      gap: 14,
    }}>
      <Orb size={60} />
      <FiledChip />
      <h1 style={{
        margin: 0,
        fontSize: 30, lineHeight: 1.1, fontWeight: 700,
        letterSpacing: '-0.03em',
        color: 'var(--text-primary)',
      }}>
        Case{' '}
        <span style={{
          background: 'var(--gradient-hero-text)',
          WebkitBackgroundClip: 'text', backgroundClip: 'text',
          color: 'transparent',
          fontVariantNumeric: 'tabular-nums',
        }}>#{caseId}</span>
      </h1>
      <p style={{
        margin: '-6px 0 0',
        fontSize: 13.5, lineHeight: 1.5,
        color: 'var(--text-secondary)',
      }}>
        Opened at <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{vendor}</span> {timeNatural}
      </p>
    </section>
  );
}

function LadderStep({ state, timestamp, label, detail, isFirst, isLast, isOpen, onToggle }) {
  const isCompleted = state === 'completed';
  const isNext = state === 'next';

  const nodeRing = isCompleted ? 'var(--accent-saffron)'
                 : isNext      ? 'var(--accent-saffron)'
                               : 'var(--border-strong)';
  const nodeFill = isCompleted ? 'var(--accent-saffron)' : 'transparent';
  const nodeBorderW = isNext ? 2.5 : isCompleted ? 0 : 1.5;

  const connectorBelowStyle = isCompleted
    ? { borderLeft: '2px solid var(--accent-saffron)' }
    : { borderLeft: '2px dashed var(--border-strong)' };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '32px 1fr',
      gap: 14,
      position: 'relative',
    }}>
      <div style={{
        position: 'relative',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        {!isFirst && (
          <div style={{
            position: 'absolute', top: 0, bottom: 'calc(100% - 8px)',
            ...(isCompleted || isNext
              ? { borderLeft: '2px solid var(--accent-saffron)' }
              : { borderLeft: '2px dashed var(--border-strong)' }),
            width: 0,
          }} />
        )}

        <div style={{
          position: 'relative', zIndex: 2,
          width: 18, height: 18, borderRadius: '50%',
          background: nodeFill,
          border: `${nodeBorderW}px solid ${nodeRing}`,
          boxSizing: 'border-box',
          marginTop: isFirst ? 0 : 8,
          display: 'grid', placeItems: 'center',
          boxShadow: isNext ? '0 0 0 4px var(--accent-saffron-soft)' : 'none',
          transition: 'box-shadow 200ms ease',
        }}>
          {isCompleted && (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                 stroke="var(--on-accent)" strokeWidth="3.6"
                 strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>

        {!isLast && (
          <div style={{ flex: 1, ...connectorBelowStyle, width: 0, marginTop: 4 }} />
        )}
      </div>

      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          textAlign: 'left',
          background: 'transparent', border: 'none', cursor: 'pointer',
          padding: '0 0 18px',
          fontFamily: 'inherit',
          color: 'var(--text-primary)',
          minHeight: 44,
        }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 10.5, fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: isCompleted ? 'var(--accent-saffron)'
               : isNext      ? 'var(--accent-saffron)'
                             : 'var(--text-tertiary)',
        }}>
          {timestamp}
          {isNext && (
            <span style={{
              padding: '1px 6px', borderRadius: 999,
              background: 'var(--accent-saffron-soft)',
              border: '1px solid var(--accent-saffron-border)',
              fontSize: 9, letterSpacing: '0.1em',
            }}>NEXT</span>
          )}
          <span style={{ flex: 1 }} />
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
               stroke="var(--text-tertiary)" strokeWidth="2.4"
               strokeLinecap="round" strokeLinejoin="round"
               style={{
                 transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                 transition: 'transform 200ms cubic-bezier(0.22,1,0.36,1)',
               }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        <div style={{
          marginTop: 4,
          fontSize: 14.5, lineHeight: 1.35, fontWeight: 600,
          letterSpacing: '-0.015em',
          color: isCompleted || isNext ? 'var(--text-primary)' : 'var(--text-secondary)',
        }}>{label}</div>

        {isOpen && (
          <div style={{
            marginTop: 10,
            padding: '10px 12px',
            borderRadius: 10,
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            fontSize: 12.5, lineHeight: 1.55,
            color: 'var(--text-secondary)',
            letterSpacing: '-0.005em',
          }}>{detail}</div>
        )}
      </button>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 10.5, fontWeight: 700,
      letterSpacing: '0.16em', textTransform: 'uppercase',
      color: 'var(--text-tertiary)',
    }}>{children}</div>
  );
}

function SaffronCallout() {
  return (
    <div style={{
      position: 'relative',
      padding: '16px 16px 16px 48px',
      borderRadius: 16,
      background: 'var(--accent-saffron-soft)',
      border: '1px solid var(--accent-saffron-border)',
      color: 'var(--text-primary)',
    }}>
      <div style={{
        position: 'absolute', top: 16, left: 14,
        width: 26, height: 26, borderRadius: 8,
        background: 'var(--bg-primary)',
        border: '1px solid var(--accent-saffron-border)',
        display: 'grid', placeItems: 'center',
        color: 'var(--accent-saffron)',
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
        </svg>
      </div>

      <div style={{
        fontSize: 15.5, fontWeight: 700,
        letterSpacing: '-0.015em', lineHeight: 1.25,
        color: 'var(--text-primary)',
      }}>You do nothing.</div>
      <div style={{
        marginTop: 4,
        fontSize: 13, lineHeight: 1.5,
        letterSpacing: '-0.005em',
        color: 'var(--text-secondary)',
      }}>We watch for replies and fire the next step the moment it's due.</div>
    </div>
  );
}

function PrimaryCTA({ onClick }) {
  const [pressed, setPressed] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleClick = () => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); onClick && onClick(); }, 600);
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
        boxShadow: pressed ? '0 2px 8px var(--accent-saffron-border)' : 'var(--glow-cta)',
        transform: pressed ? 'scale(0.98)' : 'scale(1)',
        transition: 'transform 100ms ease-out, box-shadow 200ms ease',
        position: 'relative',
      }}>
      <span style={{ opacity: loading ? 0 : 1, transition: 'opacity 200ms ease' }}>
        See all my cases
      </span>
      {!loading && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2.4"
             strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      )}
      {loading && (
        <span style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
          <span style={{
            width: 22, height: 22, borderRadius: '50%',
            border: '2.5px solid currentColor', borderRightColor: 'transparent',
            animation: 'orbSpin 700ms linear infinite',
          }} />
        </span>
      )}
    </button>
  );
}

function SecondaryLink({ onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'block', margin: '14px auto 0',
        padding: '8px 6px', minHeight: 44,
        background: 'transparent', border: 'none', cursor: 'pointer',
        color: 'var(--text-secondary)', fontFamily: 'inherit',
        fontSize: 13, fontWeight: 500, letterSpacing: '-0.005em',
        textDecoration: 'underline',
        textDecorationStyle: 'dashed',
        textDecorationColor: hover ? 'var(--accent-saffron)' : 'var(--text-tertiary)',
        textUnderlineOffset: 4,
        transition: 'text-decoration-color 200ms ease',
      }}>
      Or file another complaint
    </button>
  );
}

const STEPS = [
  { state: 'completed', timestamp: 'Today, 2:14 PM',    label: 'Complaint filed via Amazon support',
    detail: 'Submitted through Amazon\'s support flow with photos, A-to-Z Guarantee citation, and your replacement/refund ask. Amazon has 24h to respond.' },
  { state: 'next',      timestamp: 'Tomorrow, 2:14 PM', label: 'Auto-escalate to Amazon Grievance Officer',
    detail: 'If no resolution, we escalate to Amazon India\'s registered Grievance Officer with the full case file and a 7-day response window.' },
  { state: 'pending',   timestamp: 'May 30',            label: 'Email Amazon India CEO office + tag @AmazonHelp publicly',
    detail: 'Direct email to Amazon India\'s leadership inbox paired with a public @AmazonHelp post — private + public pressure in one move.' },
  { state: 'pending',   timestamp: 'June 2',            label: 'File at National Consumer Helpline (NCH) via INGRAM portal',
    detail: 'Formal INGRAM complaint under Consumer Protection Act, 2019 §47 (defective goods) — timestamped and cross-referenced to the prior steps.' },
  { state: 'pending',   timestamp: 'June 7',            label: 'Draft e-Daakhil consumer court filing under CPA 2019 §47',
    detail: 'Commission-level filing prepared for one-tap submission — admissible evidence and the full prior-step audit trail attached.' },
];

export default function FiledScreen({
  mode = 'light',
  caseId = 'RV-00214',
  vendor = 'Amazon',
  onNavigate = () => {},
}) {
  const [openIdx, setOpenIdx] = useState(null);

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
        <Header onDone={() => onNavigate('home')} />

        <CaseHeader caseId={caseId} vendor={vendor} timeNatural="just now" />

        <section style={{ padding: '32px 20px 0' }}>
          <SectionLabel>The escalation ladder</SectionLabel>

          <div style={{ marginTop: 18 }}>
            {STEPS.map((step, i) => (
              <LadderStep
                key={i}
                state={step.state}
                timestamp={step.timestamp}
                label={step.label}
                detail={step.detail}
                isFirst={i === 0}
                isLast={i === STEPS.length - 1}
                isOpen={openIdx === i}
                onToggle={() => setOpenIdx((cur) => cur === i ? null : i)}
              />
            ))}
          </div>
        </section>

        <section style={{ padding: '4px 20px 0' }}>
          <SaffronCallout />
        </section>

        <section style={{ padding: '24px 20px 0' }}>
          <PrimaryCTA onClick={() => onNavigate('dashboard')} />
          <SecondaryLink onClick={() => onNavigate('capture')} />
        </section>
      </div>

      <BottomNav active="cases" onNavigate={onNavigate} />
    </div>
  );
}
