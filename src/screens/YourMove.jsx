// ─────────────────────────────────────────────────────────────────
// YourMove — Screen 5. 4 formats (Letter / Tweet / Call / Filing)
// with FormatPicker tabs. Letter is the hero with typewriter +
// edit / reword sheets. Format state persists across tab swaps.
// Ported from design-exports/Hackathon/your-move-screen.jsx.
// ─────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react';
import StepIndicator from '../components/StepIndicator.jsx';
import BottomNav from '../components/BottomNav.jsx';

// ─── Chrome ─────────────────────────────────────────────────────

function Header({ onBack, onReset }) {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '8px 16px 12px', position: 'relative', zIndex: 2,
    }}>
      <button onClick={onBack} aria-label="Back to strategy" style={{
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

function PrimaryCTA({ label, onClick }) {
  const [pressed, setPressed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); onClick && onClick(); }, 800);
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
        position: 'relative',
      }}>
      <span style={{
        opacity: loading ? 0 : 1,
        transition: 'opacity 200ms ease',
      }}>{label}</span>
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

function SecondaryAction({ icon, label, onClick }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        flex: 1, minHeight: 44, padding: '10px 16px',
        background: pressed ? 'var(--accent-saffron-soft)' : 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        color: 'var(--text-primary)',
        fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600,
        letterSpacing: '-0.005em',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        cursor: 'pointer',
        transition: 'background 160ms ease',
      }}>
      {icon}
      {label}
    </button>
  );
}

function FormatHeading({ heading, sub }) {
  return (
    <div>
      <h1 style={{
        margin: '14px 0 0',
        fontSize: 28, lineHeight: 1.15, fontWeight: 700,
        letterSpacing: '-0.03em',
        color: 'var(--text-primary)',
      }}>{heading}</h1>
      <p style={{
        margin: '8px 0 0',
        fontSize: 13, lineHeight: 1.5,
        color: 'var(--text-secondary)',
        maxWidth: 320,
      }}>{sub}</p>
    </div>
  );
}

function SubCTAHelper({ children }) {
  return (
    <p style={{
      margin: '12px 16px 0', textAlign: 'center',
      fontSize: 11.5, lineHeight: 1.5,
      letterSpacing: '-0.005em',
      color: 'var(--text-tertiary)',
    }}>{children}</p>
  );
}

// ─── Letter format ──────────────────────────────────────────────

function CornerBracket() {
  const arm = 18, thick = 2;
  return (
    <span aria-hidden style={{
      position: 'absolute', top: -1, left: -1,
      width: arm, height: arm, pointerEvents: 'none',
      borderTop: `${thick}px solid var(--accent-saffron)`,
      borderLeft: `${thick}px solid var(--accent-saffron)`,
      borderTopLeftRadius: 18,
    }} />
  );
}

function useTypewriter(text, { charsPerTick = 3, msPerTick = 12, paused = false, replayKey = 0 } = {}) {
  const [chars, setChars] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    setChars(0);
    if (paused) return;
    if (!text) return;
    intervalRef.current = setInterval(() => {
      setChars((prev) => {
        const next = prev + charsPerTick;
        if (next >= text.length) {
          clearInterval(intervalRef.current);
          return text.length;
        }
        return next;
      });
    }, msPerTick);
    return () => clearInterval(intervalRef.current);
  }, [text, charsPerTick, msPerTick, paused, replayKey]);

  const done = chars >= (text?.length ?? 0);
  const skip = () => {
    clearInterval(intervalRef.current);
    setChars(text?.length ?? 0);
  };
  return { rendered: (text ?? '').slice(0, chars), done, skip };
}

const LETTER_DEFAULT = `Hi Amazon Customer Service team,

Order #408-3927461-5824103 (₹7,499) — Apple 67W USB-C Power Adapter — delivered on March 12, 2026, has stopped functioning after 2 months of use. The adapter no longer delivers charge despite multiple tested cables and outlets, indicating a manufacturing defect.

Under Amazon's A-to-Z Guarantee, products with manufacturing defects within the eligible window qualify for replacement or full refund. Additionally, the Consumer Protection Act 2019 (§47) covers defective goods for the duration of their reasonable expected lifespan, which is exceeded by far in this case.

I am requesting a replacement unit dispatched within 5 business days, OR a full refund of ₹7,499 to my original payment method (UPI) if a replacement is unavailable. I would prefer replacement over refund.

Please confirm processing within 48 hours, failing which I will escalate to the Office of the Grievance Officer and, if needed, the National Consumer Helpline.

Thank you.`;

const REWORDED_LETTERS = {
  shorter:
    "Hi Amazon Customer Service team,\n\nOrder #408-3927461-5824103 — Apple 67W USB-C Power Adapter, ₹7,499, delivered March 12, 2026 — stopped functioning after 2 months. Multiple cables and outlets tested. Manufacturing defect.\n\nUnder Amazon's A-to-Z Guarantee and Consumer Protection Act 2019 §47, please dispatch a replacement within 5 business days, or refund ₹7,499 to source (UPI). Replacement preferred.\n\n48 hours, please. Otherwise I'll escalate to the Grievance Officer and the NCH.\n\nThank you.",
  firmer:
    "Hi Amazon Customer Service team,\n\nOrder #408-3927461-5824103 — Apple 67W USB-C Power Adapter, ₹7,499, delivered March 12, 2026 — stopped functioning after 2 months. I have already tested the adapter against multiple cables and outlets; the issue is the adapter itself, a clear manufacturing defect.\n\nThis falls squarely within Amazon's A-to-Z Guarantee for defective products and the Consumer Protection Act 2019 §47. I am requesting a replacement unit dispatched within 5 business days, or a full refund of ₹7,499 to my original payment method (UPI) if a replacement is unavailable. Replacement is preferred.\n\nI expect confirmation within 48 hours. If not, I will escalate this to the Office of the Grievance Officer and file a complaint with the National Consumer Helpline.\n\nThank you.",
  warmer:
    "Hi Amazon Customer Service team,\n\nHoping you can help me with order #408-3927461-5824103 — the Apple 67W USB-C Power Adapter (₹7,499) delivered on March 12, 2026. Unfortunately the adapter stopped charging after about 2 months of use. I've tested it against several different cables and outlets, and the adapter itself seems to be the issue — a manufacturing defect.\n\nThis sits within Amazon's A-to-Z Guarantee window for defective products, and the Consumer Protection Act 2019 (§47) also covers this. Could a replacement unit please be dispatched within 5 business days? If a replacement isn't available, a full refund of ₹7,499 to my original payment method (UPI) would also work — though replacement would be much preferred.\n\nIf we can sort this within 48 hours, that'd be wonderful. Otherwise I'll need to escalate.\n\nThank you so much.",
  legal:
    "Hi Amazon Customer Service team,\n\nRe: Order #408-3927461-5824103 (Apple 67W USB-C Power Adapter, ₹7,499) delivered 12 March 2026. The product has ceased functioning within 2 months of delivery, despite testing against multiple compatible cables and outlets — indicating a manufacturing defect.\n\nThis claim falls within (i) Amazon's published A-to-Z Guarantee for defective merchandise within the eligible window, and (ii) Section 47 of the Consumer Protection Act, 2019, which covers defective goods for the duration of their reasonably expected lifespan — substantially exceeded in this case.\n\nThe remedy sought is settled: a replacement unit dispatched within 5 business days, or, in the alternative, a full refund of ₹7,499 to the original payment instrument (UPI).\n\nI am giving 48 hours on this channel before escalating to the Grievance Officer and, if needed, filing under §35 of the Act via e-Daakhil.\n\nThank you.",
};

function Cursor() {
  return (
    <span aria-hidden style={{
      display: 'inline-block',
      width: 2, height: '1.05em',
      verticalAlign: 'text-bottom', marginLeft: 1,
      background: 'var(--accent-saffron)',
      animation: 'cursorBlink 900ms steps(2, end) infinite',
    }} />
  );
}

function LetterCard({ body, streaming, onSkip, edited }) {
  return (
    <div
      onClick={streaming ? onSkip : undefined}
      style={{
        position: 'relative',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 18,
        padding: '24px 22px 22px',
        cursor: streaming ? 'pointer' : 'text',
        userSelect: 'text', WebkitUserSelect: 'text',
      }}>
      <CornerBracket />
      <pre style={{
        margin: 0,
        fontFamily: '"Iowan Old Style", "Charter", Georgia, ui-serif, serif',
        fontSize: 15, lineHeight: 1.6,
        letterSpacing: '-0.003em',
        color: 'var(--text-primary)',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}>
        {body}
        {streaming && <Cursor />}
      </pre>

      {edited && (
        <span style={{
          position: 'absolute', top: 12, right: 14,
          padding: '3px 8px', borderRadius: 999,
          background: 'var(--accent-saffron-soft)',
          border: '1px solid var(--accent-saffron-border)',
          color: 'var(--accent-saffron)',
          fontSize: 9.5, fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase',
        }}>edited</span>
      )}
    </div>
  );
}

function EditSheet({ open, value, onSave, onCancel }) {
  const [draft, setDraft] = useState(value);
  useEffect(() => { if (open) setDraft(value); }, [open, value]);
  if (!open) return null;
  return (
    <>
      <div onClick={onCancel} style={{
        position: 'absolute', inset: 0, zIndex: 40,
        background: 'rgba(0, 0, 0, 0.45)',
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 41,
        background: 'var(--bg-elevated)',
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '12px 16px 28px',
        boxShadow: '0 -12px 40px rgba(0, 0, 0, 0.30)',
        animation: 'sheetUp 240ms cubic-bezier(0.22,1,0.36,1) both',
        maxHeight: '78%', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          width: 36, height: 4, borderRadius: 999,
          background: 'var(--border-strong)',
          margin: '0 auto 8px',
        }} />
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 10,
        }}>
          <button onClick={onCancel} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'var(--text-secondary)', fontFamily: 'inherit',
            fontSize: 14, fontWeight: 600, padding: '8px 4px',
            minHeight: 44,
          }}>Cancel</button>
          <span style={{
            fontSize: 13, fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em',
          }}>Edit draft</span>
          <button onClick={() => onSave(draft)} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'var(--accent-saffron)', fontFamily: 'inherit',
            fontSize: 14, fontWeight: 700, padding: '8px 4px',
            minHeight: 44,
          }}>Save</button>
        </div>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          autoFocus
          style={{
            flex: 1, minHeight: 280, boxSizing: 'border-box',
            padding: '14px 16px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            color: 'var(--text-primary)',
            fontFamily: '"Iowan Old Style", Georgia, ui-serif, serif',
            fontSize: 14, lineHeight: 1.55,
            outline: 'none', resize: 'none',
          }}
        />
      </div>
    </>
  );
}

const REWORD_OPTIONS = [
  { id: 'firmer',   label: 'Make it firmer',     sub: 'Less polite, more direct' },
  { id: 'warmer',   label: 'Make it warmer',     sub: 'Friendly but still clear' },
  { id: 'shorter',  label: 'Make it shorter',    sub: 'Half the length' },
  { id: 'legal',    label: 'Lean on the law',    sub: 'Foreground the citation' },
];

function RewordSheet({ open, onPick, onCancel }) {
  if (!open) return null;
  return (
    <>
      <div onClick={onCancel} style={{
        position: 'absolute', inset: 0, zIndex: 40,
        background: 'rgba(0, 0, 0, 0.45)',
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 41,
        background: 'var(--bg-elevated)',
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '12px 16px 28px',
        boxShadow: '0 -12px 40px rgba(0, 0, 0, 0.30)',
        animation: 'sheetUp 240ms cubic-bezier(0.22,1,0.36,1) both',
      }}>
        <div style={{
          width: 36, height: 4, borderRadius: 999,
          background: 'var(--border-strong)',
          margin: '0 auto 14px',
        }} />
        <div style={{
          fontSize: 16, fontWeight: 700,
          letterSpacing: '-0.02em', color: 'var(--text-primary)',
          marginBottom: 4,
        }}>Reword the draft</div>
        <div style={{
          fontSize: 12, color: 'var(--text-secondary)',
          marginBottom: 14, lineHeight: 1.5,
        }}>Same facts, same strategy. We'll adjust the voice.</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {REWORD_OPTIONS.map((opt) => (
            <button key={opt.id} onClick={() => onPick(opt)} style={{
              padding: '14px 14px', minHeight: 56,
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 14, cursor: 'pointer', fontFamily: 'inherit',
              textAlign: 'left', color: 'var(--text-primary)',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 14.5, fontWeight: 600,
                  letterSpacing: '-0.01em',
                }}>{opt.label}</div>
                <div style={{
                  fontSize: 12, marginTop: 2,
                  color: 'var(--text-secondary)',
                }}>{opt.sub}</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                   stroke="var(--text-tertiary)" strokeWidth="2.2"
                   strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function LetterFormat({ letter, edited, rendered, streaming, onSkip, onApplyVariant, onApplyEdit, onRestore, onSubmit }) {
  const [editOpen, setEditOpen] = useState(false);
  const [rewordOpen, setRewordOpen] = useState(false);

  const handleSaveEdit = (next) => { onApplyEdit(next); setEditOpen(false); };
  const handleReword = (opt) => { onApplyVariant(REWORDED_LETTERS[opt.id] || letter); setRewordOpen(false); };

  return (
    <>
      <section style={{ padding: '20px 20px 0' }}>
        <LetterCard body={rendered} streaming={streaming} onSkip={onSkip} edited={edited} />
      </section>

      <section style={{ padding: '16px 20px 0' }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <SecondaryAction
            onClick={() => setEditOpen(true)}
            icon={(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4Z" /></svg>)}
            label="Edit"
          />
          <SecondaryAction
            onClick={() => setRewordOpen(true)}
            icon={(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7" /><polyline points="3 4 3 10 9 10" /></svg>)}
            label="Reword"
          />
        </div>

        {edited && (
          <button onClick={onRestore} style={{
            display: 'block', margin: '12px auto 0',
            padding: '8px 6px', minHeight: 44,
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'var(--text-tertiary)', fontFamily: 'inherit',
            fontSize: 12, fontWeight: 500,
            letterSpacing: '-0.005em',
            textDecoration: 'underline',
            textDecorationStyle: 'dashed',
            textUnderlineOffset: 3,
          }}>Restore AI draft</button>
        )}
      </section>

      <section style={{ padding: '20px 20px 0' }}>
        <PrimaryCTA label="File now" onClick={onSubmit} />
        <SubCTAHelper>
          Files via Amazon support · escalation queued
        </SubCTAHelper>
      </section>

      <EditSheet open={editOpen} value={letter} onSave={handleSaveEdit} onCancel={() => setEditOpen(false)} />
      <RewordSheet open={rewordOpen} onPick={handleReword} onCancel={() => setRewordOpen(false)} />
    </>
  );
}

// ─── Tweet format ───────────────────────────────────────────────

const TWEET_DEFAULT =
  "Hey @AmazonHelp — order #408-3927461 (Apple 67W charger, ₹7,499) " +
  "stopped working after 2 months. A-to-Z Guarantee covers this. " +
  "Need replacement or refund. Filed ticket — please escalate. 🙏";

function TweetFormat({ onSubmit }) {
  const chars = TWEET_DEFAULT.length;
  const max = 280;
  const remaining = max - chars;

  return (
    <>
      <section style={{ padding: '20px 20px 0' }}>
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 18,
          padding: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
              background: 'var(--gradient-hero)',
              display: 'grid', placeItems: 'center',
              color: 'var(--on-accent)',
              fontSize: 15, fontWeight: 700,
            }}>R</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 4,
                fontSize: 13.5, fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.01em',
              }}>
                Riya Mehta
                <svg width="14" height="14" viewBox="0 0 24 24"
                     style={{ marginLeft: 2, flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10" fill="var(--accent-trust)" />
                  <path d="M8 12.5l2.5 2.5 5-5"
                        fill="none" stroke="var(--on-accent)" strokeWidth="2.2"
                        strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{
                fontSize: 12, color: 'var(--text-tertiary)',
              }}>@riyamehta · now</div>
            </div>
          </div>

          <p style={{
            margin: '12px 0 0',
            fontSize: 14.5, lineHeight: 1.5,
            color: 'var(--text-primary)',
            letterSpacing: '-0.005em',
          }}>
            {'Hey '}
            <span style={{ color: 'var(--accent-trust)' }}>@AmazonHelp</span>
            {' — order '}
            <span style={{ color: 'var(--accent-trust)' }}>#408-3927461</span>
            {' (Apple 67W charger, ₹7,499) stopped working after 2 months. '}
            <span style={{ color: 'var(--accent-trust)' }}>A-to-Z Guarantee</span>
            {' covers this. Need replacement or refund. Filed ticket — please escalate. 🙏'}
          </p>

          <div style={{
            marginTop: 12, height: 80,
            borderRadius: 12,
            background: 'linear-gradient(135deg, var(--accent-saffron-soft) 0%, var(--accent-trust-soft) 100%)',
            border: '1px solid var(--border)',
            display: 'grid', placeItems: 'center',
            color: 'var(--text-tertiary)',
            fontSize: 11, fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>2 photos attached</div>

          <div style={{
            marginTop: 14,
            display: 'flex', alignItems: 'center', gap: 8,
            color: 'var(--text-tertiary)', fontSize: 12,
          }}>
            <div style={{
              width: 18, height: 18, borderRadius: '50%',
              background: `conic-gradient(var(--accent-saffron) ${(chars/max)*360}deg, var(--border) 0)`,
              position: 'relative', flexShrink: 0,
            }}>
              <div style={{
                position: 'absolute', inset: 2, borderRadius: '50%',
                background: 'var(--bg-surface)',
              }} />
            </div>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>
              {remaining} characters left
            </span>
          </div>
        </div>
      </section>

      <section style={{ padding: '16px 20px 0' }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <SecondaryAction
            icon={(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4Z" /></svg>)}
            label="Edit"
          />
          <SecondaryAction
            icon={(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7" /><polyline points="3 4 3 10 9 10" /></svg>)}
            label="Reword"
          />
        </div>
      </section>

      <section style={{ padding: '20px 20px 0' }}>
        <PrimaryCTA label="Post tweet" onClick={onSubmit} />
        <SubCTAHelper>
          Posts from @yourhandle · we'll watch the thread
        </SubCTAHelper>
      </section>
    </>
  );
}

// ─── Call format ────────────────────────────────────────────────

const CALL_BULLETS = [
  { label: 'OPEN',     text: "Hi, I'm calling about order 408-3927461 — my MacBook charger stopped working within the warranty period. I need a replacement under the A-to-Z Guarantee." },
  { label: 'FACTS',    text: "It's the Apple 67W USB-C adapter, delivered March 12. I've tested multiple cables and outlets — the adapter itself is the issue." },
  { label: 'POLICY',   text: "Under Amazon's A-to-Z Guarantee for defective products, and §47 of the Consumer Protection Act 2019, I'm entitled to replacement or refund." },
  { label: 'ASK',      text: "I'd like a replacement unit dispatched within 5 business days. If unavailable, a full refund of ₹7,499 to my UPI." },
  { label: 'ESCALATE', text: "If we can't resolve this on the call, please escalate to the Grievance Officer and give me a reference number." },
];

function CallFormat({ onSubmit }) {
  return (
    <>
      <section style={{ padding: '20px 20px 0' }}>
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 18,
          overflow: 'hidden',
        }}>
          {CALL_BULLETS.map((b, i) => (
            <div key={i} style={{
              padding: '14px 16px',
              display: 'flex', alignItems: 'flex-start', gap: 12,
              borderTop: i > 0 ? '1px solid var(--border)' : 'none',
              minHeight: 56,
            }}>
              <div style={{
                flexShrink: 0,
                width: 28, height: 28, borderRadius: 8,
                background: 'var(--accent-saffron-soft)',
                border: '1px solid var(--accent-saffron-border)',
                color: 'var(--accent-saffron)',
                display: 'grid', placeItems: 'center',
                fontSize: 12, fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '-0.01em',
              }}>{i + 1}</div>
              <div style={{ flex: 1, minWidth: 0, paddingTop: 1 }}>
                <div style={{
                  fontSize: 9.5, fontWeight: 700,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: 'var(--text-tertiary)',
                }}>{b.label}</div>
                <div style={{
                  marginTop: 4,
                  fontSize: 15, lineHeight: 1.5,
                  letterSpacing: '-0.005em',
                  color: 'var(--text-primary)',
                }}>{b.text}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 12,
          padding: '12px 14px',
          borderRadius: 14,
          background: 'var(--accent-trust-soft)',
          border: '1px solid var(--accent-trust-border)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
               stroke="var(--accent-trust)" strokeWidth="1.8"
               strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 2 4.18 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.72c.12.81.32 1.6.6 2.36a2 2 0 0 1-.45 2.11L8 9.5a16 16 0 0 0 6 6l1.31-1.15a2 2 0 0 1 2.11-.45c.76.28 1.55.48 2.36.6A2 2 0 0 1 22 16.92z" />
          </svg>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 9.5, fontWeight: 700,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: 'var(--accent-trust)',
            }}>Amazon customer service</div>
            <div style={{
              fontSize: 13, fontWeight: 600,
              color: 'var(--text-primary)',
              letterSpacing: '-0.005em',
              marginTop: 2,
              fontVariantNumeric: 'tabular-nums',
            }}>1800-3000-9009</div>
          </div>
        </div>
      </section>

      <section style={{ padding: '16px 20px 0' }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <SecondaryAction
            icon={(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4Z" /></svg>)}
            label="Edit"
          />
          <SecondaryAction
            icon={(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7" /><polyline points="3 4 3 10 9 10" /></svg>)}
            label="Reword"
          />
        </div>
      </section>

      <section style={{ padding: '20px 20px 0' }}>
        <PrimaryCTA label="Start call" onClick={onSubmit} />
        <SubCTAHelper>We'll log the outcome after you hang up</SubCTAHelper>
      </section>
    </>
  );
}

// ─── Filing format ──────────────────────────────────────────────

function FilingFormat({ onSubmit }) {
  return (
    <>
      <section style={{ padding: '20px 20px 0' }}>
        <div style={{
          position: 'relative', overflow: 'hidden',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 18,
        }}>
          <div style={{
            padding: '14px 16px 10px',
            borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{
                fontSize: 9.5, fontWeight: 700,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'var(--text-tertiary)',
              }}>Case file</div>
              <div style={{
                marginTop: 2,
                fontSize: 14, fontWeight: 700,
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                color: 'var(--text-primary)',
                letterSpacing: '-0.005em',
              }}>RES-2026-08174</div>
            </div>
            <div style={{
              padding: '6px 10px', borderRadius: 6,
              border: '1.5px solid var(--accent-trust)',
              color: 'var(--accent-trust)',
              fontSize: 9.5, fontWeight: 800,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              transform: 'rotate(-4deg)',
              opacity: 0.8,
            }}>Draft · Unsigned</div>
          </div>

          {[
            { label: 'Complainant',   body: 'Riya Mehta\n+91 98XXX-XX174\nriya@email.com' },
            { label: 'Respondent',    body: 'Amazon Seller Services Pvt Ltd\n8th Floor, Brigade Gateway,\nMalleshwaram, Bengaluru — 560055' },
            { label: 'Facts',         body: 'Order #408-3927461-5824103 was placed and delivered on March 12, 2026. The product — Apple 67W USB-C Power Adapter, ₹7,499 — stopped functioning after 2 months of use, well within the expected lifespan. Multiple cables and outlets tested; the adapter is the source of failure. Indicates manufacturing defect.' },
            { label: 'Relief sought', body: 'Replacement unit dispatched within 5 business days, or in the alternative, a full refund of ₹7,499 to the original payment instrument (UPI).' },
            { label: 'References',    body: '• Consumer Protection Act, 2019 — Section 47 (defective goods)\n• Amazon A-to-Z Guarantee (published, refreshed 2024)\n• BIS quality standards for electronic adapters' },
          ].map((sec, i) => (
            <div key={sec.label} style={{
              padding: '14px 16px',
              borderTop: i > 0 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{
                fontSize: 9.5, fontWeight: 700,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'var(--accent-saffron)',
              }}>{sec.label}</div>
              <div style={{
                marginTop: 6,
                fontSize: 13, lineHeight: 1.55,
                color: 'var(--text-primary)',
                letterSpacing: '-0.005em',
                fontFamily: '"Iowan Old Style", Georgia, ui-serif, serif',
                whiteSpace: 'pre-line',
              }}>{sec.body}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '16px 20px 0' }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <SecondaryAction
            icon={(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4Z" /></svg>)}
            label="Edit"
          />
          <SecondaryAction
            icon={(<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7" /><polyline points="3 4 3 10 9 10" /></svg>)}
            label="Reword"
          />
        </div>
      </section>

      <section style={{ padding: '20px 20px 0' }}>
        <PrimaryCTA label="Submit filing" onClick={onSubmit} />
        <SubCTAHelper>Submits to NCH · 14-day SLA, we'll chase</SubCTAHelper>
      </section>
    </>
  );
}

// ─── Format picker ──────────────────────────────────────────────

function FormatPicker({ active, aiPick = 'letter', onChange }) {
  const tabs = [
    { id: 'letter', label: 'Letter' },
    { id: 'tweet',  label: 'Tweet'  },
    { id: 'call',   label: 'Call'   },
    { id: 'filing', label: 'Filing' },
  ];
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 4, padding: 4,
      borderRadius: 14,
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border)',
    }}>
      {tabs.map((t) => {
        const isActive = t.id === active;
        const isAIPick = t.id === aiPick;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            aria-pressed={isActive}
            style={{
              position: 'relative',
              minHeight: 40, padding: '8px 6px',
              borderRadius: 10,
              border: isActive
                ? '1px solid var(--accent-saffron-border)'
                : '1px solid transparent',
              background: isActive ? 'var(--accent-saffron-soft)' : 'transparent',
              color: isActive ? 'var(--accent-saffron)' : 'var(--text-secondary)',
              fontFamily: 'inherit',
              fontSize: 13,
              fontWeight: isActive ? 700 : 600,
              letterSpacing: '-0.005em',
              cursor: 'pointer',
              transition: 'background 200ms ease, color 200ms ease, border-color 200ms ease',
            }}
          >
            {t.label}
            {isAIPick && (
              <span aria-label="AI's pick" style={{
                position: 'absolute',
                top: 5, right: 6,
                width: 6, height: 6, borderRadius: '50%',
                background: 'var(--accent-saffron)',
                boxShadow: '0 0 0 1.5px var(--bg-elevated)',
              }} />
            )}
          </button>
        );
      })}
    </div>
  );
}

const HEADINGS = {
  letter: { h: 'Your complaint',   s: 'Drafted, citation-backed, ready to file.' },
  tweet:  { h: 'Your tweet',       s: 'Public ask · vendor handle, your number.' },
  call:   { h: 'Your call script', s: 'Six talking points · stay firm, stay friendly.' },
  filing: { h: 'Your filing',      s: 'Formal complaint · NCH e-Daakhil portal.' },
};

function ActiveHeading({ active }) {
  const cur = HEADINGS[active] || HEADINGS.letter;
  return (
    <div key={active} style={{ animation: 'fieldIn 220ms cubic-bezier(0.22,1,0.36,1) both' }}>
      <FormatHeading heading={cur.h} sub={cur.s} />
    </div>
  );
}

const FORMATS = ['letter', 'tweet', 'call', 'filing'];

export default function YourMoveScreen({ mode = 'light', onNavigate = () => {} }) {
  const [activeFormat, setActiveFormat] = useState('letter');
  const [letter, setLetter] = useState(LETTER_DEFAULT);
  const [edited, setEdited] = useState(false);
  const [streamKey, setStreamKey] = useState(0);

  const { rendered, done, skip } = useTypewriter(letter, { replayKey: streamKey });

  const handleApplyVariant = (text) => {
    setLetter(text); setEdited(true); setStreamKey((k) => k + 1);
  };
  const handleApplyEdit = (text) => {
    setLetter(text); setEdited(true); setStreamKey((k) => k + 1);
  };
  const handleRestore = () => {
    setLetter(LETTER_DEFAULT); setEdited(false); setStreamKey((k) => k + 1);
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
        <Header
          onBack={() => onNavigate('strategy')}
          onReset={() => onNavigate('strategy')}
        />

        <section style={{ padding: '8px 20px 0' }}>
          <StepIndicator>Step 4 of 4 · Your move</StepIndicator>
        </section>

        <section style={{ padding: '0 20px' }}>
          <ActiveHeading active={activeFormat} />
        </section>

        <div style={{
          position: 'sticky', top: 0, zIndex: 10,
          margin: '18px 0 0',
          padding: '8px 20px 12px',
          background: 'color-mix(in srgb, var(--bg-primary) 88%, transparent)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '0 1px 0 var(--border)',
        }}>
          <FormatPicker
            active={activeFormat}
            aiPick="letter"
            onChange={setActiveFormat}
          />
        </div>

        <div style={{ position: 'relative' }}>
          {FORMATS.map((f) => {
            const isActive = f === activeFormat;
            return (
              <div
                key={f}
                aria-hidden={!isActive}
                style={{
                  position: isActive ? 'static' : 'absolute',
                  top: 0, left: 0, right: 0,
                  opacity: isActive ? 1 : 0,
                  visibility: isActive ? 'visible' : 'hidden',
                  pointerEvents: isActive ? 'auto' : 'none',
                  transition: isActive
                    ? 'opacity 200ms ease 120ms, visibility 0s 120ms'
                    : 'opacity 140ms ease, visibility 0s 140ms',
                }}
              >
                {f === 'letter' && (
                  <LetterFormat
                    letter={letter}
                    edited={edited}
                    rendered={rendered}
                    streaming={!done}
                    onSkip={skip}
                    onApplyVariant={handleApplyVariant}
                    onApplyEdit={handleApplyEdit}
                    onRestore={handleRestore}
                    onSubmit={() => onNavigate('filed')}
                  />
                )}
                {f === 'tweet' && <TweetFormat onSubmit={() => onNavigate('filed')} />}
                {f === 'call'  && <CallFormat  onSubmit={() => onNavigate('filed')} />}
                {f === 'filing' && <FilingFormat onSubmit={() => onNavigate('filed')} />}
              </div>
            );
          })}
        </div>
      </div>

      <BottomNav active="home" onNavigate={onNavigate} />
    </div>
  );
}
