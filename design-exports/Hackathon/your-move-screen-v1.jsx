// ─────────────────────────────────────────────────────────────────────────
// your-move-screen.jsx — Resolved · Screen 5 ("Your move")
// Visual system: /design.md (mirrored in tokens.css). Zero hex in this file.
//
// READ FIRST — UX rationale comments are tagged // — UX:
// Four formats: Letter (hero, interactive) · Tweet · Call · Filing.
// Letter is the only one with typewriter streaming + edit/regenerate sheets.
// ─────────────────────────────────────────────────────────────────────────

const { useState, useEffect, useRef, useCallback } = React;

// ─────────────────────────────────────────────────────────────────────────
// Shared chrome — Header, StepIndicator, BottomNav, PrimaryCTA.
// ─────────────────────────────────────────────────────────────────────────

// — UX (Behavior Q1 — Reset):
//   Reset = back to Strategy (Screen 4). Reasoning:
//     • The user just confirmed a strategy and got a draft on its back.
//       "Reset" here naturally means "I don't like this draft, let me
//       adjust the plan."
//     • Going to Home would discard 4 screens of work — hostile.
//     • Same pattern as Capture → Home, Extracting → Capture, Strategy →
//       Extracting. Every Reset takes you one step back, not all the way.
function YMHeader({ onBack, onReset }) {
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

function YMStepIndicator() {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '6px 12px', borderRadius: 999,
      background: 'var(--accent-saffron-soft)',
      border: '1px solid var(--accent-saffron-border)',
      color: 'var(--accent-saffron)',
      fontSize: 10.5, fontWeight: 600,
      letterSpacing: '0.1em', textTransform: 'uppercase',
    }}>
      <span style={{
        width: 5, height: 5, borderRadius: '50%',
        background: 'var(--gradient-hero)',
      }} />
      Step 4 of 4 · Your move
    </span>
  );
}

function YMBottomNav({ active = 'new', onNav = () => {} }) {
  const items = [
    { id: 'home',    label: 'Home',    icon: <path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" /> },
    { id: 'new',     label: 'New',     icon: <path d="M12 5v14M5 12h14" /> },
    { id: 'cases',   label: 'Cases',   icon: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M9 3h6v4H9zM8 11h8M8 15h5" /></> },
    { id: 'letters', label: 'Letters', icon: <><rect x="3" y="5" width="18" height="14" rx="2" /><polyline points="3 7 12 13 21 7" /></> },
  ];
  return (
    <nav style={{
      position: 'absolute', left: 16, right: 16,
      bottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)',
      height: 64, borderRadius: 20, zIndex: 30,
      background: 'color-mix(in srgb, var(--bg-elevated) 85%, transparent)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid var(--border)',
      boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      padding: '0 8px',
    }}>
      {items.map((it) => {
        const isActive = it.id === active;
        return (
          <button key={it.id} onClick={() => onNav(it.id)} style={{
            background: isActive ? 'var(--accent-saffron-soft)' : 'transparent',
            border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 3, padding: '6px 14px', borderRadius: 14,
            color: isActive ? 'var(--accent-saffron)' : 'var(--text-tertiary)',
            minHeight: 44, minWidth: 56,
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="1.8"
                 strokeLinecap="round" strokeLinejoin="round">{it.icon}</svg>
            <span style={{ fontSize: 10, fontWeight: 600 }}>{it.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// PrimaryCTA — gradient saffron button with format-specific label.
// — UX (Behavior Q4 — loading state):
//   On tap: button morphs to a small spinner inside the same pill,
//   label dims to 0, ~800ms hold, then route.
//   Reasoning:
//     • Full-screen fade is too heavy for an in-flow CTA.
//     • Button-morph keeps the spatial anchor (the pill) constant — the
//       user knows exactly what fired.
//     • 800ms is enough to feel like "the system did real work" without
//       feeling padded.
// ─────────────────────────────────────────────────────────────────────────
function YMPrimaryCTA({ label, onClick }) {
  const [pressed, setPressed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onClick && onClick();
    }, 800);
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
      }}>
        {label}
      </span>
      {!loading && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2.4"
             strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      )}
      {loading && (
        <span style={{
          position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
        }}>
          <span style={{
            width: 22, height: 22, borderRadius: '50%',
            border: '2.5px solid currentColor',
            borderRightColor: 'transparent',
            animation: 'orbSpin 700ms linear infinite',
          }} />
        </span>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SecondaryAction — small pill button. Used for Edit + Reword.
// — UX (Q2 — placement):
//   PICK: INLINE buttons below the letter (not ⋯ menu, not long-press).
//   Reasoning:
//     • A ⋯ menu hides primary editorial controls behind discovery friction.
//     • Long-press is undiscoverable for first-time users; brief said
//       judges see this for ~10 seconds.
//     • Inline pills under the card are scannable and obvious.
//     • They're subtle (smaller than the CTA, neutral fill) so they don't
//       compete with "File now". Their relative weight reads correctly:
//       primary = filled gradient, secondary = neutral border, tertiary =
//       text link.
// ─────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────
// FormatHeading — heading + format-specific subhead.
// ─────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────
// SubCTAHelper — single line under the primary CTA.
// — UX (Q8 — sub-CTA helper, per format):
//   Sharpened drafts:
//     Letter:  "Files via Swiggy's in-app form · escalation queued"
//     Tweet:   "Posts from @yourhandle · we'll watch the thread"
//     Call:    "We'll log the outcome after you hang up"
//     Filing:  "Submits to NCH · 14-day SLA, we'll chase"
//   All start with a verb naming what fires (Files/Posts/Logs/Submits),
//   then a dot-separator, then what we do after. "Escalation queued"
//   reads as machinery-already-running, which is the brand promise.
// ─────────────────────────────────────────────────────────────────────────
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

// ═════════════════════════════════════════════════════════════════════════
// LETTER FORMAT (hero — interactive)
// ═════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────
// CornerBracket — saffron L-shape, top-left of the letter card.
// — UX (Q5 — corner accent):
//   TOP-LEFT ONLY (not all 4 corners).
//   Reasoning:
//     • All-4-corners reads as "framed quote" — too decorative, makes the
//       letter feel like an artifact, not a working draft.
//     • Top-left only reads as "pull-quote signature" — anchors the start
//       of the content, signals "this is the AI's voice" without boxing it.
//     • The card's own border carries enclosure; the bracket carries
//       authorship.
//   Saffron color = same brand mark as the orb. Implicit "this is by
//   Resolved" without writing it.
// ─────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────
// useTypewriter — streams a string at `charsPerTick / msPerTick` rate.
// — UX (typewriter pace):
//   Brief specifies 3 chars / 12ms = 250 cps. That's quick — landing the
//   ~130-word letter in ~3s. Demo-appropriate.
// — UX (Q1 — cursor):
//   PICK: (a) blink during streaming, disappear when done.
//   Reasoning:
//     • (b) "stays blinking after done" implies editable — but tap-to-edit
//       opens a sheet (decision Q3 below); a blinking cursor on a non-
//       focused surface is a lie.
//     • (c) disappear immediately on complete is too abrupt — the eye
//       wants one last blink to confirm "done".
//     • (a) settles into the done state visually quiet. Post-stream the
//       letter reads as a finished document.
// — UX (Behavior Q6 — interrupt):
//   Tap anywhere on the card during streaming = instantly complete.
//   Respects user time; common pattern (cinematic dialogue boxes).
// ─────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────
// Letter body — Swiggy-spillage case. 130 words. The brief's range
// (120-180 words) gives room; landing closer to the floor keeps the demo
// readable on a single phone screen with minimal scroll.
// ─────────────────────────────────────────────────────────────────────────
const LETTER_DEFAULT = `Hi Swiggy team,

Order #119284756 was delivered on May 24 at 8:42 PM. The items arrived spilled — biryani containers had leaked through the bag, and the gravy had soaked through three of the other dishes. Photos are attached.

This is a clear case under Swiggy's own Damaged Item Policy, which commits to a refund to original payment method for orders that arrive in unusable condition. I'd like the full ₹420 refunded to source, not as Swiggy credit.

If this isn't resolved within 48 hours via this channel, I'll be filing a complaint with the National Consumer Helpline under the Consumer Protection Act, 2019. I'd much rather settle this here.

Thank you.`;

// ─────────────────────────────────────────────────────────────────────────
// LetterCard — the hero card.
// ─────────────────────────────────────────────────────────────────────────
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
        // — UX (Behavior Q3): native text selection ENABLED. Users may
        //   want to copy a phrase ("Damaged Item Policy"). Disabling
        //   selection on a draft is hostile.
        userSelect: 'text', WebkitUserSelect: 'text',
      }}>
      <CornerBracket />

      {/* — UX (typography): body uses a serif-feel via the design system's
            secondary stack. We approximate with a serif fallback. Slightly
            larger leading than UI default — letters want air around the lines. */}
      <pre style={{
        margin: 0,
        // The "serif-feel" body: ui-serif first, falls back to system serifs
        // so we don't have to ship a webfont for the demo.
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

// ─────────────────────────────────────────────────────────────────────────
// EditSheet — bottom sheet with the letter in a textarea.
// — UX (Q3 — Edit target):
//   PICK: (c) bottom sheet with textarea.
//   Reasoning:
//     • (a) inline-editable in place: the card grows as the keyboard pops,
//       jumping the layout — unpleasant on mobile.
//     • (b) separate edit screen: loses screen context (the CTA, the
//       helper line) — the user forgets what they're working toward.
//     • (c) sheet: keeps the screen visible behind a scrim, gives the
//       keyboard real estate, and "Save" / "Cancel" form the obvious
//       commit gesture. Standard iOS pattern.
// ─────────────────────────────────────────────────────────────────────────
function EditSheet({ open, value, onChange, onSave, onCancel }) {
  const [draft, setDraft] = useState(value);
  useEffect(() => { if (open) setDraft(value); }, [open, value]);
  if (!open) return null;
  return (
    <>
      <div onClick={onCancel} style={{
        position: 'absolute', inset: 0, zIndex: 40,
        background: 'rgba(0,0,0,0.45)',
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 41,
        background: 'var(--bg-elevated)',
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '12px 16px 28px',
        boxShadow: '0 -12px 40px rgba(0,0,0,0.30)',
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

// ─────────────────────────────────────────────────────────────────────────
// RewordSheet — pick a direction.
// — UX (Q4 — Regenerate behavior):
//   PICK: (b) opens a sheet of named directions.
//   Reasoning:
//     • (a) blind re-run = same prompt, same answer (or a coin-flip
//       variation). Hostile: the user pressed "regenerate" expecting a
//       different result; we don't deliver.
//     • (c) "slight variation" is the same problem as (a) — random.
//     • (b) gives the user a steering wheel without making them write a
//       prompt. Five named directions cover ~90% of real edits.
//
// — UX (Regenerate button copy):
//   PICK: "Reword".
//   Reasoning:
//     • "Regenerate" is engineering jargon (ML team language).
//     • "Try again" implies the previous draft failed.
//     • "New version" sounds bureaucratic.
//     • "Reword" names exactly what changes: the words, not the strategy.
//       Tonal, accurate, short.
// ─────────────────────────────────────────────────────────────────────────
const REWORD_OPTIONS = [
  // — UX: 4 options, each names a clear axis.
  //   Rejected "More legal-heavy" as a separate option — covered by
  //   "Lean on the law" which reads more action-y.
  { id: 'firmer',   label: 'Make it firmer',     sub: 'Less polite, more direct'      },
  { id: 'warmer',   label: 'Make it warmer',     sub: 'Friendly but still clear'      },
  { id: 'shorter',  label: 'Make it shorter',    sub: 'Half the length'               },
  { id: 'legal',    label: 'Lean on the law',    sub: 'Foreground the citation'       },
];

function RewordSheet({ open, onPick, onCancel }) {
  if (!open) return null;
  return (
    <>
      <div onClick={onCancel} style={{
        position: 'absolute', inset: 0, zIndex: 40,
        background: 'rgba(0,0,0,0.45)',
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 41,
        background: 'var(--bg-elevated)',
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '12px 16px 28px',
        boxShadow: '0 -12px 40px rgba(0,0,0,0.30)',
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
        }}>
          Same facts, same strategy. We'll adjust the voice.
        </div>
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

// ─────────────────────────────────────────────────────────────────────────
// LetterFormat — the orchestrator for the hero format.
// — UX (Q6 — format switcher):
//   NO ON-SCREEN FORMAT SWITCHER. The user picked the channel on Screen 4;
//   reopening that decision here would re-litigate strategy after we
//   already drafted on its back. Back chevron → Strategy is one tap;
//   that's the right path.
// ─────────────────────────────────────────────────────────────────────────
function LetterFormat({ onSubmit, replayKey = 0, initialEdited = false }) {
  const [letter, setLetter] = useState(LETTER_DEFAULT);
  const [edited, setEdited] = useState(initialEdited);
  const [editOpen, setEditOpen] = useState(false);
  const [rewordOpen, setRewordOpen] = useState(false);

  // Streaming. Re-runs whenever `letter` changes (so a Reword re-streams).
  const { rendered, done, skip } = useTypewriter(letter, { replayKey });

  const handleSaveEdit = (next) => {
    setLetter(next);
    setEdited(true);
    setEditOpen(false);
  };
  const handleReword = (opt) => {
    setRewordOpen(false);
    // Mock variants — the real prototype would call the API.
    if (opt.id === 'shorter') {
      setLetter(
        "Hi Swiggy team,\n\nOrder #119284756 (May 24, 8:42 PM) arrived spilled — biryani leaked, ruined 3 other items. Photos attached.\n\nUnder Swiggy's own Damaged Item Policy, please refund ₹420 to source (not credit) within 48h. Otherwise I'll file with the NCH under CPA 2019.\n\nThank you."
      );
    } else if (opt.id === 'firmer') {
      setLetter(
        "Hi Swiggy team,\n\nOrder #119284756 (May 24, 8:42 PM) arrived spilled — biryani containers leaked through the bag and ruined three other items. Photos are attached.\n\nThis is a clear, documented failure under your published Damaged Item Policy. I'm asking for the full ₹420 refunded to original payment method within 48 hours — not Swiggy credit. If that doesn't happen, I'll file with the National Consumer Helpline under the Consumer Protection Act, 2019, citing this exchange.\n\nI'd prefer to settle this here.\n\nThank you."
      );
    } else if (opt.id === 'warmer') {
      setLetter(
        "Hi Swiggy team,\n\nHoping you can help me with order #119284756 from May 24, 8:42 PM. The items arrived spilled — biryani containers leaked through the bag and unfortunately soaked through three other dishes. Photos are attached.\n\nYour Damaged Item Policy covers refund-to-source for orders that arrive in unusable condition. Could the ₹420 please go back to my original payment method (not Swiggy credit)?\n\nIf this can be resolved on this channel within 48 hours, I'd really appreciate it. Otherwise I'll need to file with the NCH.\n\nThank you so much for looking at this."
      );
    } else if (opt.id === 'legal') {
      setLetter(
        "Hi Swiggy team,\n\nRe: Order #119284756 delivered May 24, 8:42 PM — items arrived in unusable condition. Photos attached.\n\nThis falls squarely under Swiggy's published Damaged Item Policy (refund-to-source for unusable orders) and Section 2(11) of the Consumer Protection Act, 2019 (\"deficiency in service\"). The remedy is settled: ₹420 refunded to original payment method within a reasonable period, not Swiggy credit.\n\nI'm giving 48 hours on this channel before filing with the National Consumer Helpline and, if needed, an e-Daakhil complaint under §35 of the Act.\n\nThank you."
      );
    }
    setEdited(true);
  };

  // — UX (Q5 — Restore AI draft):
  //   "Restore AI draft" link is hidden until `edited` is true. It lives
  //   under the action row, dashed underline, --text-tertiary. Subtle so
  //   it doesn't tempt users away from their own edits, but discoverable
  //   when needed.
  const handleRestore = () => {
    setLetter(LETTER_DEFAULT);
    setEdited(false);
  };

  return (
    <>
      <FormatHeading
        heading="Your complaint"
        sub="Drafted, citation-backed, ready to file."
      />

      {/* ─── Letter card ─── */}
      <section style={{ padding: '20px 20px 0' }}>
        <LetterCard
          body={rendered}
          streaming={!done}
          onSkip={skip}
          edited={edited}
        />
      </section>

      {/* ─── Action row ─── */}
      <section style={{ padding: '16px 20px 0' }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <SecondaryAction
            onClick={() => setEditOpen(true)}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="1.8"
                   strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
            }
            label="Edit"
          />
          <SecondaryAction
            onClick={() => setRewordOpen(true)}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="1.8"
                   strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 3-6.7" />
                <polyline points="3 4 3 10 9 10" />
              </svg>
            }
            label="Reword"
          />
        </div>

        {edited && (
          <button onClick={handleRestore} style={{
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

      {/* ─── Primary CTA + helper ─── */}
      <section style={{ padding: '20px 20px 0' }}>
        <YMPrimaryCTA label="File now" onClick={onSubmit} />
        <SubCTAHelper>
          Files via Swiggy's in-app form · escalation queued
        </SubCTAHelper>
      </section>

      <EditSheet
        open={editOpen}
        value={letter}
        onSave={handleSaveEdit}
        onCancel={() => setEditOpen(false)}
      />
      <RewordSheet
        open={rewordOpen}
        onPick={handleReword}
        onCancel={() => setRewordOpen(false)}
      />
    </>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// TWEET FORMAT (designed, not interactive in demo)
// ═════════════════════════════════════════════════════════════════════════

// — UX (microcopy: 275 chars):
//   Mentions @SwiggyCares (vendor handle), packs order ref + facts +
//   policy + ask + escalation, ends with thanks. Real character-count
//   shown only here per anti-goals.
const TWEET_DEFAULT =
  "@SwiggyCares — Order #119284756 (May 24, 8:42 PM) arrived spilled. " +
  "Biryani leaked, ruined 3 other items. Photos attached. " +
  "Your Damaged Item Policy commits to refund-to-source. " +
  "₹420 to original payment, please — 48h before I file with @jagograhakjago.";

function TweetFormat({ onSubmit }) {
  const chars = TWEET_DEFAULT.length;
  const max = 280;
  const remaining = max - chars;

  return (
    <>
      <FormatHeading
        heading="Your tweet"
        // — UX: 6 words. Names the medium ("public") + the social mechanic
        //   (handle + your number). Sets expectation that this is louder
        //   than the letter.
        sub="Public ask · vendor handle, your number."
      />

      <section style={{ padding: '20px 20px 0' }}>
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 18,
          padding: 16,
        }}>
          {/* User row */}
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
                        fill="none" stroke="#fff" strokeWidth="2.2"
                        strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{
                fontSize: 12, color: 'var(--text-tertiary)',
              }}>@riyamehta · now</div>
            </div>
          </div>

          {/* Body */}
          <p style={{
            margin: '12px 0 0',
            fontSize: 14.5, lineHeight: 1.5,
            color: 'var(--text-primary)',
            letterSpacing: '-0.005em',
          }}>
            <span style={{ color: 'var(--accent-trust)' }}>@SwiggyCares</span>
            {' — Order '}
            <span style={{ color: 'var(--accent-trust)' }}>#119284756</span>
            {' (May 24, 8:42 PM) arrived spilled. Biryani leaked, ruined 3 other items. Photos attached. Your '}
            <span style={{ color: 'var(--accent-trust)' }}>Damaged Item Policy</span>
            {' commits to refund-to-source. ₹420 to original payment, please — 48h before I file with '}
            <span style={{ color: 'var(--accent-trust)' }}>@jagograhakjago</span>
            .
          </p>

          {/* Photo placeholder strip — implies "Photos attached" */}
          <div style={{
            marginTop: 12, height: 80,
            borderRadius: 12,
            background:
              'linear-gradient(135deg, var(--accent-saffron-soft) 0%, var(--accent-trust-soft) 100%)',
            border: '1px solid var(--border)',
            display: 'grid', placeItems: 'center',
            color: 'var(--text-tertiary)',
            fontSize: 11, fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>2 photos attached</div>

          {/* Char counter — only on Tweet per anti-goals.
              — UX: tiny ring at the right, saffron when close to limit. */}
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

          {/* Mock engagement bar — out of focus, just a hint */}
          <div style={{
            marginTop: 14, paddingTop: 12,
            borderTop: '1px solid var(--border)',
            display: 'flex', gap: 24,
            color: 'var(--text-tertiary)', fontSize: 12,
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="1.8"
                   strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z" />
              </svg>
              0
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="1.8"
                   strokeLinecap="round" strokeLinejoin="round">
                <polyline points="17 1 21 5 17 9" />
                <path d="M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3" />
              </svg>
              0
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="1.8"
                   strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              0
            </span>
          </div>
        </div>
      </section>

      <section style={{ padding: '16px 20px 0' }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <SecondaryAction
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="1.8"
                   strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
            }
            label="Edit"
          />
          <SecondaryAction
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="1.8"
                   strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 3-6.7" />
                <polyline points="3 4 3 10 9 10" />
              </svg>
            }
            label="Reword"
          />
        </div>
      </section>

      <section style={{ padding: '20px 20px 0' }}>
        {/* — UX (Q7 — CTA for Tweet):
              PICK: "Post tweet". Reasoning:
              • "Tweet it" reads juvenile.
              • "Send tweet" mismatches platform vocabulary (Twitter/X uses
                "post" as the verb).
              • "Post tweet" matches the platform's own button. Familiar
                muscle memory. */}
        <YMPrimaryCTA label="Post tweet" onClick={onSubmit} />
        {/* — UX (Q8 — Tweet helper):
              Sharpened from brief draft: brief said "Posts to your @handle
              · we'll watch for replies". I kept the same arc but tightened
              the verbs: "Posts from @yourhandle · we'll watch the thread."
              "Posts from" is slightly more accurate (the user IS posting);
              "thread" reads as the conversation, not just replies. */}
        <SubCTAHelper>
          Posts from @yourhandle · we'll watch the thread
        </SubCTAHelper>
      </section>
    </>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// CALL SCRIPT FORMAT (designed, not interactive in demo)
// ═════════════════════════════════════════════════════════════════════════

const CALL_BULLETS = [
  // — UX (microcopy): 6 bullets. Brief said 5-7. Each bullet is a
  //   one-sentence beat the user reads aloud. Structured:
  //     1 = opening / identify
  //     2 = facts
  //     3 = policy lever
  //     4 = the ask
  //     5 = escalation hint
  //     6 = capture proof
  {
    label: 'OPEN',
    text: "Hi — my name is Riya Mehta. I'm calling about order #119284756 from May 24.",
  },
  {
    label: 'FACTS',
    text: "The order arrived spilled — biryani leaked through the bag and damaged three other items.",
  },
  {
    label: 'POLICY',
    text: "I'm referencing Swiggy's Damaged Item Policy, which commits to a refund to original payment method.",
  },
  {
    label: 'ASK',
    text: "I'd like the full ₹420 refunded to source — not as Swiggy credit.",
  },
  {
    label: 'ESCALATE',
    text: "If we can't settle this on this call, please escalate to a Grievance Officer.",
  },
  {
    label: 'PROOF',
    text: "Could you please give me a complaint reference number before we end the call?",
  },
];

function CallFormat({ onSubmit }) {
  return (
    <>
      <FormatHeading
        heading="Your call script"
        // — UX: 6 words. Names what's on the screen + tone signal.
        sub="Six talking points · stay firm, stay friendly."
      />

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
              {/* — UX: number-stamp lozenge. Tappable in real product
                    ("mark as said") — here it's the visual hint only. */}
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
                  // Brief said "large readable text" — 15px is generous
                  // for a phone, comfortable to read aloud.
                  fontSize: 15, lineHeight: 1.5,
                  letterSpacing: '-0.005em',
                  color: 'var(--text-primary)',
                }}>{b.text}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Vendor support number — pre-filled because we have the vendor.
            Tapping calls it in real prototype; here it's a styled chip. */}
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
            }}>Swiggy support</div>
            <div style={{
              fontSize: 13, fontWeight: 600,
              color: 'var(--text-primary)',
              letterSpacing: '-0.005em',
              marginTop: 2,
              fontVariantNumeric: 'tabular-nums',
            }}>080-6798-3984</div>
          </div>
        </div>
      </section>

      <section style={{ padding: '16px 20px 0' }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <SecondaryAction
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="1.8"
                   strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
            }
            label="Edit"
          />
          <SecondaryAction
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="1.8"
                   strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 3-6.7" />
                <polyline points="3 4 3 10 9 10" />
              </svg>
            }
            label="Reword"
          />
        </div>
      </section>

      <section style={{ padding: '20px 20px 0' }}>
        {/* — UX (Q7 — CTA for Call):
              PICK: "Start call". Reasoning:
              • "Make the call" sounds like a dare ("are you going to make
                the call?"). The screen should not project doubt onto the
                user — they already decided.
              • "Begin" is too clinical.
              • "Start call" matches iOS's own Phone-app vocabulary and
                pairs with the icon. Neutral, action-ready. */}
        <YMPrimaryCTA label="Start call" onClick={onSubmit} />
        {/* — UX: brief draft kept verbatim. Sets expectation that we
              don't disappear during the call. */}
        <SubCTAHelper>
          We'll log the outcome after you hang up
        </SubCTAHelper>
      </section>
    </>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// FILING FORMAT (designed, not interactive in demo)
// ═════════════════════════════════════════════════════════════════════════

function FilingFormat({ onSubmit }) {
  return (
    <>
      <FormatHeading
        heading="Your filing"
        // — UX: 5 words. Names the regulator + scale.
        sub="Formal complaint · NCH e-Daakhil portal."
      />

      <section style={{ padding: '20px 20px 0' }}>
        <div style={{
          position: 'relative', overflow: 'hidden',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 18,
        }}>
          {/* Top stamp area — official-looking */}
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
            {/* Stamp aesthetic */}
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

          {/* Sections */}
          {[
            { label: 'Complainant', body: 'Riya Mehta\n+91 98XXX-XX174\nriya@email.com' },
            { label: 'Respondent',  body: 'Swiggy (Bundl Technologies Pvt Ltd)\n#55, Sy.No.8-14, Embassy Tech Village,\nBengaluru — 560103' },
            { label: 'Facts',       body: 'Order #119284756 was placed on May 24, 2026. Delivered 8:42 PM. Items arrived spilled — biryani containers leaked through the bag, damaging three additional items in the order. Photographs annexed.' },
            { label: 'Relief sought', body: 'Refund of ₹420 to the original payment method, plus an undertaking from the respondent regarding handling of similar future complaints.' },
            { label: 'References',  body: '• Consumer Protection Act, 2019 — Section 2(11) (deficiency in service)\n• Swiggy Damaged Item Policy (published, dated 14 Mar 2024)\n• FSSAI quality standards on food integrity in transit' },
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
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="1.8"
                   strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
            }
            label="Edit"
          />
          <SecondaryAction
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="1.8"
                   strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 3-6.7" />
                <polyline points="3 4 3 10 9 10" />
              </svg>
            }
            label="Reword"
          />
        </div>
      </section>

      <section style={{ padding: '20px 20px 0' }}>
        {/* — UX (Q7 — CTA for Filing):
              PICK: "Submit filing". Reasoning:
              • "File now" duplicates the Letter CTA — should differ.
              • "Submit" alone is too generic.
              • "Submit filing" names both the verb (formal submission) and
                the noun (the regulator-bound document). It also signals
                gravity: you're filing with the government, not emailing. */}
        <YMPrimaryCTA label="Submit filing" onClick={onSubmit} />
        {/* — UX: sharpened from brief draft. Brief said "Submitted to [Regulator]
              · 14-day SLA". I added "we'll chase" — same brand promise as
              Letter ("escalation queued"). Without it the Filing CTA reads
              colder than Letter's, which mismatches voice. */}
        <SubCTAHelper>
          Submits to NCH · 14-day SLA, we'll chase
        </SubCTAHelper>
      </section>
    </>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// YourMoveScreen — top-level orchestrator. Picks a format and renders it.
// ═════════════════════════════════════════════════════════════════════════

function YourMoveScreen({
  mode = 'light',
  format = 'letter',           // letter | tweet | call | filing
  onBack = () => {},
  onReset = () => {},
  onSubmit = () => {},
  replayKey = 0,
  initialEdited = false,
}) {
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
      {/* — UX (Behavior Q2 — scroll):
            WHOLE SCREEN SCROLLS. Internal card scroll on mobile creates
            two scroll surfaces; users get confused which one moves.
            Single scroll = predictable. */}
      <div style={{
        position: 'absolute', inset: 0,
        overflow: 'auto', overflowX: 'hidden',
        paddingTop: 50,
        paddingBottom: 130,
        overscrollBehavior: 'contain',
      }}>
        <YMHeader onBack={onBack} onReset={onReset} />

        <section style={{ padding: '8px 20px 0' }}>
          <YMStepIndicator />
        </section>

        <section style={{ padding: '0 20px' }}>
          {format === 'letter' && <LetterFormat onSubmit={onSubmit} replayKey={replayKey} initialEdited={initialEdited} />}
          {format === 'tweet'  && <TweetFormat  onSubmit={onSubmit} />}
          {format === 'call'   && <CallFormat   onSubmit={onSubmit} />}
          {format === 'filing' && <FilingFormat onSubmit={onSubmit} />}
        </section>
      </div>

      <YMBottomNav active="new" onNav={(id) => { if (id === 'home') onBack(); }} />
    </div>
  );
}

window.YourMoveScreen = YourMoveScreen;
