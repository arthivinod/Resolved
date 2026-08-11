// ─────────────────────────────────────────────────────────────────
// Extracting — Screen 3. Loading (orb) → one of two outcomes:
//   - facts card (State A/B unified — some fields may be pre-filled,
//     some may need the user to fill them in before continuing)
//   - could-not-read (State C — offers "try another file" or
//     "add details manually", which routes into the same facts card
//     fully blank).
// Which outcome shows is decided by App based on which Capture input
// was picked (see outcomeForEvidence in App.jsx) — there's no live
// vision model wired up, so this keeps the failure/partial paths
// honestly demoable instead of faking real detection.
// Ported from design-exports/Hackathon/extracting-screen.jsx.
// ─────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react';
import Orb from '../components/Orb.jsx';
import StepIndicator from '../components/StepIndicator.jsx';
import BottomNav from '../components/BottomNav.jsx';

function Header({ onBack, onReset }) {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '8px 16px 12px', position: 'relative', zIndex: 2,
    }}>
      <button onClick={onBack} aria-label="Back to capture" style={{
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
      <button onClick={onReset} style={{
        height: 36, padding: '0 14px', minWidth: 44, minHeight: 44,
        background: 'transparent', border: 'none', cursor: 'pointer',
        color: 'var(--text-primary)', fontFamily: 'inherit',
        fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em',
      }}>Reset</button>
    </header>
  );
}

function LoadingPhase({ onCancel }) {
  const [pressed, setPressed] = useState(false);
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '32px 20px 0',
    }}>
      <button
        onClick={onCancel}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        aria-label="Cancel and pick a different input"
        style={{
          width: 220, height: 220,
          padding: 20, marginTop: 8,
          background: 'transparent', border: 'none', cursor: 'pointer',
          borderRadius: '50%',
          display: 'grid', placeItems: 'center',
          boxShadow: pressed
            ? 'inset 0 0 0 1px var(--accent-saffron-border)'
            : 'none',
          transition: 'box-shadow 160ms ease',
        }}
      >
        <Orb size={180} demeanor="celebrate" spinning />
      </button>

      <div style={{ marginTop: 28, textAlign: 'center' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '5px 10px', borderRadius: 999,
          background: 'var(--accent-saffron-soft)',
          border: '1px solid var(--accent-saffron-border)',
          color: 'var(--accent-saffron)',
          fontSize: 10.5, fontWeight: 600,
          letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>Reading the evidence</span>

        <h1 style={{
          margin: '16px 0 0', maxWidth: 300,
          fontSize: 22, lineHeight: 1.25, fontWeight: 700,
          letterSpacing: '-0.025em',
          color: 'var(--text-primary)',
        }}>
          Pulling the details out of your evidence.
        </h1>

        <div style={{
          margin: '20px auto 0', width: 140, height: 4, borderRadius: 999,
          overflow: 'hidden',
          background: 'var(--accent-saffron-soft)',
        }}>
          <div style={{
            width: '40%', height: '100%',
            background: 'var(--gradient-hero)',
            animation: 'shimmer 1.2s ease-in-out infinite',
          }} />
        </div>
      </div>
    </div>
  );
}

function CompletionHeader({ heading = "Here's what I see.", demeanor = 'celebrate' }) {
  return (
    <div style={{
      padding: '8px 20px 0',
      display: 'flex', alignItems: 'flex-start', gap: 14,
    }}>
      <Orb size={56} demeanor={demeanor} />
      <div style={{ flex: 1, minWidth: 0, paddingTop: 4 }}>
        <h1 style={{
          margin: 0,
          fontSize: 24, lineHeight: 1.2, fontWeight: 700,
          letterSpacing: '-0.03em',
          color: 'var(--text-primary)',
        }}>{heading}</h1>
      </div>
    </div>
  );
}

function ExtractedField({ label, value, confident = true, revealed = true, onEdit = () => {} }) {
  const missing = !value;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => { setDraft(value); }, [value]);
  useEffect(() => {
    if (editing) requestAnimationFrame(() => inputRef.current?.focus());
  }, [editing]);

  const commit = () => {
    setEditing(false);
    if (draft !== value) onEdit(draft);
  };

  return (
    <div
      onClick={() => !editing && setEditing(true)}
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? 'translateY(0)' : 'translateY(6px)',
        transition: 'opacity 320ms cubic-bezier(0.22,1,0.36,1), transform 320ms cubic-bezier(0.22,1,0.36,1), background 180ms ease, border-color 180ms ease',
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 14px',
        minHeight: 56,
        borderRadius: 12,
        background: editing ? 'var(--accent-saffron-soft)' : 'transparent',
        border: editing
          ? '1px solid var(--accent-saffron-border)'
          : '1px solid transparent',
        cursor: 'pointer',
      }}
    >
      <span style={{
        flexShrink: 0, width: 88,
        fontSize: 10, fontWeight: 700,
        letterSpacing: '0.12em', textTransform: 'uppercase',
        color: 'var(--text-tertiary)',
      }}>{label}</span>

      {editing ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => { if (e.key === 'Enter') commit(); }}
          style={{
            flex: 1, minWidth: 0,
            background: 'transparent', border: 'none', outline: 'none',
            fontFamily: 'inherit', fontSize: 14, fontWeight: 500,
            color: 'var(--text-primary)',
            padding: 0,
          }}
        />
      ) : (
        <span style={{
          flex: 1, minWidth: 0,
          fontSize: 14, fontWeight: missing ? 500 : 600,
          fontStyle: missing ? 'italic' : 'normal',
          letterSpacing: '-0.005em',
          color: missing ? 'var(--text-tertiary)' : 'var(--text-primary)',
          textDecoration: !confident ? 'underline dotted' : 'none',
          textDecorationColor: 'var(--text-tertiary)',
          textUnderlineOffset: 3,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{missing ? 'Tap to add' : value}</span>
      )}

      <span style={{ flexShrink: 0, width: 20, height: 20, display: 'grid', placeItems: 'center' }}>
        {missing ? (
          <span style={{
            width: 18, height: 18, borderRadius: '50%',
            background: 'var(--bg-elevated)',
            border: '1.5px dashed var(--border-strong)',
            color: 'var(--text-tertiary)',
            fontSize: 12, fontWeight: 700,
            display: 'grid', placeItems: 'center',
            lineHeight: 1,
          }}>+</span>
        ) : confident ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
               stroke="var(--accent-saffron)" strokeWidth="2.6"
               strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <span style={{
            width: 18, height: 18, borderRadius: '50%',
            background: 'var(--accent-saffron-soft)',
            border: '1px solid var(--accent-saffron-border)',
            color: 'var(--accent-saffron)',
            fontSize: 11, fontWeight: 700,
            display: 'grid', placeItems: 'center',
            lineHeight: 1,
          }}>?</span>
        )}
      </span>
    </div>
  );
}

function LedgerCard({ children, thumbnailLabel, thumbnailRevealed = true }) {
  return (
    <div style={{
      borderRadius: 18,
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      overflow: 'hidden',
    }}>
      <div style={{ padding: '6px 6px 0' }}>{children}</div>

      {thumbnailLabel && (
        <div style={{
          borderTop: '1px solid var(--border)',
          margin: '8px 0 0',
          padding: '12px 14px',
          display: 'flex', alignItems: 'center', gap: 12,
          opacity: thumbnailRevealed ? 1 : 0,
          transform: thumbnailRevealed ? 'translateY(0)' : 'translateY(6px)',
          transition: 'opacity 320ms cubic-bezier(0.22,1,0.36,1), transform 320ms cubic-bezier(0.22,1,0.36,1)',
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 10, flexShrink: 0,
            background: 'linear-gradient(135deg, var(--accent-saffron-soft), var(--accent-trust-soft))',
            border: '1px solid var(--border)',
            display: 'grid', placeItems: 'center',
            color: 'var(--text-tertiary)',
            position: 'relative', overflow: 'hidden',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="1.6"
                 strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{
              display: 'block',
              fontSize: 10.5, fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'var(--text-tertiary)',
            }}>{thumbnailLabel}</span>
            <span style={{
              display: 'block', marginTop: 3,
              fontSize: 12, color: 'var(--text-secondary)',
            }}>amazon-order-receipt.png</span>
          </span>
        </div>
      )}
    </div>
  );
}

function PrimaryCTA({ label = 'Pick the play', onClick, disabled = false }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      onMouseDown={() => !disabled && setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => !disabled && setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        height: 56, width: '100%', padding: '0 24px',
        borderRadius: 999, border: 'none',
        fontFamily: 'inherit', fontSize: 16, fontWeight: 700,
        letterSpacing: '-0.01em',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        background: 'var(--gradient-hero)',
        color: 'var(--on-accent)',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        boxShadow: pressed
          ? '0 2px 8px var(--accent-saffron-border)'
          : 'var(--glow-cta)',
        transform: pressed ? 'scale(0.98)' : 'scale(1)',
        transition: 'transform 100ms ease-out, filter 200ms ease, opacity 200ms ease',
      }}
    >
      {label}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2.4"
           strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  );
}

function CompletionTagline({ children, revealed = true }) {
  return (
    <p style={{
      margin: 0, textAlign: 'center',
      fontSize: 12.5, lineHeight: 1.5,
      letterSpacing: '-0.005em',
      color: 'var(--text-secondary)',
      opacity: revealed ? 1 : 0,
      transform: revealed ? 'translateY(0)' : 'translateY(6px)',
      transition: 'opacity 320ms cubic-bezier(0.22,1,0.36,1), transform 320ms cubic-bezier(0.22,1,0.36,1)',
    }}>{children}</p>
  );
}

function useStaggerReveal(total, { firstDelay = 200, step = 150, deps = [] } = {}) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(0);
    const timers = [];
    for (let i = 0; i < total; i++) {
      timers.push(setTimeout(() => setCount(i + 1), firstDelay + i * step));
    }
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return count;
}

function HelperTip({ children, revealed = true }) {
  return (
    <p style={{
      margin: 0, textAlign: 'center',
      fontSize: 12, lineHeight: 1.5,
      letterSpacing: '-0.005em',
      color: 'var(--text-tertiary)',
      opacity: revealed ? 1 : 0,
      transform: revealed ? 'translateY(0)' : 'translateY(6px)',
      transition: 'opacity 320ms cubic-bezier(0.22,1,0.36,1), transform 320ms cubic-bezier(0.22,1,0.36,1)',
    }}>{children}</p>
  );
}

// Fields with an empty value need the user's input before the strategy step
// can use them — a wrong or missing fact flowing into a law-cited letter is
// a real trust problem, not just an incomplete demo. Handles both the
// all-filled case (identical to the old State A) and the some-missing case
// (State B) with one code path instead of two near-duplicate components.
function StateA({ facts, onEditFact, onSubmit }) {
  const fields = facts;
  const missingCount = fields.filter((f) => !f.value).length;
  const allFilled = missingCount === 0;
  const TOTAL = fields.length + 3;
  const count = useStaggerReveal(TOTAL, { firstDelay: 200, step: 150, deps: [] });
  return (
    <>
      <CompletionHeader />
      <section style={{ padding: '20px 20px 0' }}>
        <LedgerCard
          thumbnailLabel="Your evidence"
          thumbnailRevealed={count >= fields.length + 1}
        >
          {fields.map((f, i) => (
            <ExtractedField
              key={f.id}
              label={f.label}
              value={f.value}
              confident={f.confident}
              revealed={count >= i + 1}
              onEdit={(v) => onEditFact(f.id, v)}
            />
          ))}
        </LedgerCard>
      </section>
      <section style={{ padding: '20px 20px 0' }}>
        {allFilled ? (
          <CompletionTagline revealed={count >= fields.length + 2}>
            Six details, ready to file.
          </CompletionTagline>
        ) : (
          <HelperTip revealed={count >= fields.length + 2}>
            💡 A bill or receipt works better than a photo of the item itself — fill in what's missing above.
          </HelperTip>
        )}
      </section>
      <section style={{
        padding: '16px 20px 0',
        opacity: count >= TOTAL ? 1 : 0,
        transform: count >= TOTAL ? 'translateY(0)' : 'translateY(6px)',
        transition: 'opacity 320ms cubic-bezier(0.22,1,0.36,1), transform 320ms cubic-bezier(0.22,1,0.36,1)',
      }}>
        <PrimaryCTA
          label={allFilled ? 'Pick the play' : 'Add details to continue'}
          onClick={onSubmit}
          disabled={!allFilled}
        />
      </section>
    </>
  );
}

function StateFailed({ onRetry, onManual }) {
  return (
    <>
      <CompletionHeader heading="Hmm, that didn't come through clearly." demeanor="neutral" />

      <section style={{ padding: '20px 20px 0' }}>
        <div style={{
          padding: 14, borderRadius: 14,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 10, flexShrink: 0,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            display: 'grid', placeItems: 'center',
            color: 'var(--text-tertiary)',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="1.6"
                 strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="m3 16 5-5 4 4 4-4 5 5" />
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 13, fontWeight: 600,
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>pasted-image.png</div>
            <div style={{
              fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 2,
            }}>Too blurry or low-resolution to read</div>
          </div>
        </div>
      </section>

      <section style={{ padding: '16px 20px 0' }}>
        <p style={{
          margin: 0, fontSize: 13, lineHeight: 1.55,
          color: 'var(--text-secondary)',
        }}>
          We couldn't read this clearly enough to pull out the details. Try a sharper photo or a
          screenshot with the text in focus — or skip straight to typing in what happened.
        </p>
      </section>

      <section style={{
        padding: '20px 20px 0',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        <PrimaryCTA label="Try another file" onClick={onRetry} />
        <button
          onClick={onManual}
          style={{
            height: 48, width: '100%',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 999, cursor: 'pointer', fontFamily: 'inherit',
            fontSize: 14.5, fontWeight: 700, letterSpacing: '-0.01em',
            color: 'var(--text-primary)',
          }}
        >
          Add details manually
        </button>
      </section>
    </>
  );
}

export default function ExtractingScreen({
  mode = 'light',
  onNavigate = () => {},
  facts,
  onEditFact = () => {},
  extractionOutcome = 'success',
  onGoManual = () => {},
}) {
  const [phase, setPhase] = useState('loading');
  const failed = extractionOutcome === 'failed';

  useEffect(() => {
    setPhase('loading');
    const t = setTimeout(() => setPhase('done'), 1500);
    return () => clearTimeout(t);
  }, []);

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
          onBack={() => onNavigate('capture')}
          onReset={() => onNavigate('capture')}
        />

        <section style={{ padding: '8px 20px 0' }}>
          <StepIndicator>
            Step 2 of 4 · {phase === 'loading' ? 'Extracting' : failed ? "Couldn't read it" : 'Extracted'}
          </StepIndicator>
        </section>

        {phase === 'loading' ? (
          <LoadingPhase onCancel={() => onNavigate('capture')} />
        ) : failed ? (
          <StateFailed
            onRetry={() => onNavigate('capture')}
            onManual={onGoManual}
          />
        ) : (
          <StateA facts={facts} onEditFact={onEditFact} onSubmit={() => onNavigate('strategy')} />
        )}
      </div>

      <BottomNav active="home" onNavigate={onNavigate} />
    </div>
  );
}
