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

function ConfirmButton({ label, sensitive, onClick }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        flex: 1, minHeight: 44, padding: '10px 14px',
        borderRadius: 12, border: 'none', cursor: 'pointer',
        fontFamily: 'inherit', fontSize: 13.5, fontWeight: 700,
        letterSpacing: '-0.005em',
        background: sensitive ? 'var(--gradient-hero)' : 'var(--accent-saffron)',
        color: 'var(--on-accent)',
        transform: pressed ? 'scale(0.98)' : 'scale(1)',
        transition: 'transform 100ms ease-out',
      }}
    >
      {label}
    </button>
  );
}

function ReviewButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        minHeight: 44, padding: '10px 14px',
        borderRadius: 12,
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        cursor: 'pointer', fontFamily: 'inherit',
        fontSize: 13.5, fontWeight: 600,
        letterSpacing: '-0.005em',
        color: 'var(--text-primary)',
      }}
    >
      Review
    </button>
  );
}

function LadderStep({
  state, timestamp, label, detail, isFirst, isLast, isOpen, onToggle,
  awaitingConfirm, confirmLabel, sensitive, warning, onConfirm, onReview,
}) {
  const isCompleted = state === 'completed';
  const isActive = isCompleted || awaitingConfirm || state === 'next-auto';

  const nodeRing = isCompleted ? 'var(--accent-saffron)'
                 : isActive    ? 'var(--accent-saffron)'
                               : 'var(--border-strong)';
  const nodeFill = isCompleted ? 'var(--accent-saffron)' : 'transparent';
  const nodeBorderW = isActive && !isCompleted ? 2.5 : isCompleted ? 0 : 1.5;

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
            ...(isCompleted || isActive
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
          boxShadow: awaitingConfirm ? '0 0 0 4px var(--accent-saffron-soft)' : 'none',
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

      <div style={{ padding: '0 0 18px' }}>
        <button
          onClick={onToggle}
          aria-expanded={isOpen}
          style={{
            width: '100%',
            textAlign: 'left',
            background: 'transparent', border: 'none', cursor: 'pointer',
            padding: 0,
            fontFamily: 'inherit',
            color: 'var(--text-primary)',
            minHeight: 44,
          }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 10.5, fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: isCompleted ? 'var(--accent-saffron)'
                 : isActive    ? 'var(--accent-saffron)'
                               : 'var(--text-tertiary)',
          }}>
            {timestamp}
            {awaitingConfirm && (
              <span style={{
                padding: '1px 6px', borderRadius: 999,
                background: 'var(--accent-saffron-soft)',
                border: '1px solid var(--accent-saffron-border)',
                fontSize: 9, letterSpacing: '0.1em',
              }}>YOUR TURN</span>
            )}
            {state === 'next-auto' && (
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
            color: isCompleted || isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
          }}>{label}</div>
        </button>

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

        {awaitingConfirm && (
          <div style={{ marginTop: 12 }}>
            {sensitive && warning && (
              <p style={{
                margin: '0 0 10px', fontSize: 12, lineHeight: 1.5,
                color: 'var(--accent-saffron)', fontWeight: 600,
              }}>⚠ {warning}</p>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              <ReviewButton onClick={onReview} />
              <ConfirmButton label={confirmLabel} sensitive={sensitive} onClick={onConfirm} />
            </div>
          </div>
        )}
      </div>
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

function AutoPilotToggle({ on, onChange }) {
  return (
    <button
      onClick={() => onChange(!on)}
      aria-pressed={on}
      style={{
        width: '100%', marginTop: 12,
        padding: '10px 12px',
        background: 'var(--bg-primary)',
        border: '1px solid var(--accent-saffron-border)',
        borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit',
        display: 'flex', alignItems: 'center', gap: 10,
        textAlign: 'left',
      }}
    >
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{
          display: 'block', fontSize: 12.5, fontWeight: 700,
          letterSpacing: '-0.005em', color: 'var(--text-primary)',
        }}>Auto-pilot</span>
        <span style={{
          display: 'block', marginTop: 1, fontSize: 11, lineHeight: 1.4,
          color: 'var(--text-tertiary)',
        }}>Escalate on schedule without asking each time</span>
      </span>
      <span aria-hidden style={{
        flexShrink: 0, width: 38, height: 22, borderRadius: 999,
        background: on ? 'var(--accent-saffron)' : 'var(--border-strong)',
        position: 'relative',
        transition: 'background 160ms ease',
      }}>
        <span style={{
          position: 'absolute', top: 2,
          left: on ? 18 : 2,
          width: 18, height: 18, borderRadius: '50%',
          background: 'var(--on-accent)',
          transition: 'left 160ms cubic-bezier(0.22,1,0.36,1)',
        }} />
      </span>
    </button>
  );
}

function SaffronCallout({ autoPilot, onToggleAutoPilot }) {
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
      }}>{autoPilot ? "You do nothing." : "Your call, every step."}</div>
      <div style={{
        marginTop: 4,
        fontSize: 13, lineHeight: 1.5,
        letterSpacing: '-0.005em',
        color: 'var(--text-secondary)',
      }}>
        {autoPilot
          ? "We watch for replies and fire the next step the moment it's due."
          : "We'll tell you when the next move is ready. Nothing goes out — especially not a public post — until you confirm it."}
      </div>

      <AutoPilotToggle on={autoPilot} onChange={onToggleAutoPilot} />
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

// The initial filing is what got the user to this screen — it's already
// "completed" by definition (they tapped File/Post/Call/Submit in YourMove).
// Everything after it used to auto-fire on a schedule; now each rung
// requires an explicit confirm unless auto-pilot is on (see AutoPilotToggle).
const FILED_STEP = {
  timestamp: 'Today, 2:14 PM',
  label: 'Complaint filed via Amazon support',
  detail: "Submitted through Amazon's support flow with photos, A-to-Z Guarantee citation, and your replacement/refund ask. Amazon has 24h to respond.",
};

const ESCALATION_STEPS = [
  {
    id: 'grievance',
    label: 'Escalate to Amazon Grievance Officer',
    detail: "If no resolution, we escalate to Amazon India's registered Grievance Officer with the full case file and a 7-day response window.",
    confirmLabel: 'Confirm escalation',
    autoTimestamp: 'Tomorrow, 2:14 PM',
  },
  {
    id: 'public',
    label: 'Email Amazon India CEO office + tag @AmazonHelp publicly',
    detail: "Direct email to Amazon India's leadership inbox paired with a public @AmazonHelp post — private + public pressure in one move.",
    confirmLabel: 'Yes, post publicly',
    sensitive: true,
    warning: "This posts publicly and can't be undone.",
    autoTimestamp: 'May 30',
  },
  {
    id: 'nch',
    label: 'File at National Consumer Helpline (NCH) via INGRAM portal',
    detail: 'Formal INGRAM complaint under Consumer Protection Act, 2019 §47 (defective goods) — timestamped and cross-referenced to the prior steps.',
    confirmLabel: 'Confirm filing',
    autoTimestamp: 'June 2',
  },
  {
    id: 'edaakhil',
    label: 'Draft e-Daakhil consumer court filing under CPA 2019 §47',
    detail: 'Commission-level filing prepared for one-tap submission — admissible evidence and the full prior-step audit trail attached.',
    confirmLabel: 'Confirm filing',
    autoTimestamp: 'June 7',
  },
];

function buildRows({ confirmedCount, autoPilot }) {
  const rows = [{ ...FILED_STEP, state: 'completed', key: 'filed' }];
  ESCALATION_STEPS.forEach((step, i) => {
    if (i < confirmedCount) {
      rows.push({ ...step, key: step.id, state: 'completed', timestamp: 'Just now' });
    } else if (i === confirmedCount) {
      rows.push({
        ...step,
        key: step.id,
        state: autoPilot ? 'next-auto' : 'awaiting-confirm',
        awaitingConfirm: !autoPilot,
        timestamp: autoPilot ? step.autoTimestamp : 'Awaiting your go-ahead',
      });
    } else {
      rows.push({ ...step, key: step.id, state: 'locked', timestamp: 'Unlocks after the step above' });
    }
  });
  return rows;
}

const DEFAULT_ESCALATION = { confirmedCount: 0, autoPilot: false };

export default function FiledScreen({
  mode = 'light',
  caseId = 'RV-00214',
  vendor = 'Amazon',
  onNavigate = () => {},
  onStartNew = () => {},
  escalationState = DEFAULT_ESCALATION,
  onEscalationChange = () => {},
}) {
  const [openIdx, setOpenIdx] = useState(null);
  const { confirmedCount, autoPilot } = escalationState;
  const rows = buildRows({ confirmedCount, autoPilot });

  const handleConfirmStep = () => {
    onEscalationChange({
      confirmedCount: Math.min(confirmedCount + 1, ESCALATION_STEPS.length),
      autoPilot,
    });
  };
  const handleToggleAutoPilot = (next) => {
    onEscalationChange({ confirmedCount, autoPilot: next });
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
        paddingBottom: 130,
        overscrollBehavior: 'contain',
      }}>
        <Header onDone={() => onNavigate('home')} />

        <CaseHeader caseId={caseId} vendor={vendor} timeNatural="just now" />

        <section style={{ padding: '32px 20px 0' }}>
          <SectionLabel>The escalation ladder</SectionLabel>

          <div style={{ marginTop: 18 }}>
            {rows.map((row, i) => (
              <LadderStep
                key={row.key}
                state={row.state}
                timestamp={row.timestamp}
                label={row.label}
                detail={row.detail}
                isFirst={i === 0}
                isLast={i === rows.length - 1}
                isOpen={openIdx === i}
                onToggle={() => setOpenIdx((cur) => cur === i ? null : i)}
                awaitingConfirm={row.awaitingConfirm}
                confirmLabel={row.confirmLabel}
                sensitive={row.sensitive}
                warning={row.warning}
                onConfirm={handleConfirmStep}
                onReview={() => setOpenIdx(i)}
              />
            ))}
          </div>
        </section>

        <section style={{ padding: '4px 20px 0' }}>
          <SaffronCallout autoPilot={autoPilot} onToggleAutoPilot={handleToggleAutoPilot} />
        </section>

        <section style={{ padding: '24px 20px 0' }}>
          <PrimaryCTA onClick={() => onNavigate('dashboard')} />
          <SecondaryLink onClick={onStartNew} />
        </section>
      </div>

      <BottomNav active="cases" onNavigate={onNavigate} />
    </div>
  );
}
