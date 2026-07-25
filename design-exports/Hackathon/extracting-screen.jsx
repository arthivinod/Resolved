// ─────────────────────────────────────────────────────────────────────────
// extracting-screen.jsx — Resolved · Screen 3 (Extracting / Extracted)
// Visual system: /design.md (mirrored in tokens.css). Zero hex in this file.
//
// READ FIRST — UX rationale lives at  // — UX:  comments.
// Three states delivered: A (hero — fully extracted), B (partial),
// C (could not read). Only A is wired through the loading phase; B and C
// can be jumped to via Tweaks for design review.
// ─────────────────────────────────────────────────────────────────────────

const { useState, useEffect, useRef } = React;

// ─────────────────────────────────────────────────────────────────────────
// Orb — the brand mark, used here at three sizes / two demeanors:
//   180pt + spinning   → loading
//    60pt + steady     → "extracted, confidence" (State A header)
//    60pt + neutral    → "couldn't read" (State C; no celebration glow)
// — UX (Q1 — orb after loading):
//   (b) SHRINKS to a small confirmation indicator next to the heading.
//   Reasoning:
//     • (a) disappearing erases the product moment too quickly — judges
//       barely registered "this is AI thinking" before it's gone.
//     • (c) stays-at-top wastes the upper third of the viewport on a
//       static decoration once content arrives. The fields are the
//       payload — they should occupy the visual focus.
//     • (b) keeps the brand mark in the frame as proof-of-author. The
//       orb becomes a checkmark by virtue of being there.
//   The shrink animates with a single FLIP-style transition so the orb
//   reads as the SAME object that moved, not as fade-out + new icon.
// ─────────────────────────────────────────────────────────────────────────
function Orb({ size = 60, demeanor = 'celebrate', spinning = false }) {
  // demeanor: 'celebrate' (saffron glow) | 'neutral' (no glow, dimmer)
  const isNeutral = demeanor === 'neutral';
  return (
    <div aria-hidden style={{
      width: size, height: size, position: 'relative', flexShrink: 0,
      // Smooth shrink between sizes (FLIP-like single-object motion).
      transition: 'width 600ms cubic-bezier(0.22,1,0.36,1), height 600ms cubic-bezier(0.22,1,0.36,1)',
    }}>
      {/* Outer glow — disabled in neutral mode (State C) */}
      {!isNeutral && (
        <div style={{
          position: 'absolute', inset: -size * 0.35, borderRadius: '50%',
          background: 'var(--gradient-hero)',
          filter: `blur(${size * 0.22}px)`,
          opacity: spinning ? 0.7 : 0.45,
          animation: spinning
            ? 'orbPulse 1.6s ease-in-out infinite'
            : 'orbPulse 3.2s ease-in-out infinite',
          transition: 'opacity 600ms ease',
        }} />
      )}
      {/* Body — gradient circle. Neutral mode flattens to surface + border. */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: isNeutral
          ? 'var(--bg-elevated)'
          : 'var(--gradient-hero)',
        border: isNeutral ? '1px solid var(--border-strong)' : 'none',
        boxShadow: isNeutral ? 'none' : '0 8px 32px var(--accent-saffron-border)',
        // — UX: subtle spin during loading. Only one moving part.
        //   Rotating the body (not the glow) keeps the glow stable so
        //   the orb feels grounded, not woozy.
        animation: spinning ? 'orbSpin 2.4s linear infinite' : 'none',
      }}>
        {!isNeutral && (
          <div style={{
            position: 'absolute', inset: '8% 40% 50% 8%', borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.55), transparent 65%)',
          }} />
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// StepIndicator — same family as Capture's.
// — UX (locked copy): "Step 2 of 4 · Extracting" (loading) and
//   "Step 2 of 4 · Extracted" (after). The label switches mid-screen
//   to confirm forward motion without changing the chrome.
// ─────────────────────────────────────────────────────────────────────────
function StepIndicator({ label = 'Extracting' }) {
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
      Step 2 of 4 · {label}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Header — wordmark + Reset.
// — UX (Behavior Q1 — Reset target):
//   BACK TO SCREEN 2 (Capture). Reasoning:
//     • Resetting from mid-extraction to Home erases the work the user
//       did selecting an input. Discarding that is hostile.
//     • Capture is the natural "I want to try a different file" surface.
//     • Reset here therefore means "discard this extraction, let me pick
//       again" — consistent with Capture's "discard this selection".
// ─────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────
// LoadingPhase — orb centered in the upper third, copy below.
// — UX (Q7 — duration realism):
//   MIN-HOLD 1.5s. Real API latency floats 2-4s; if it returns in 800ms
//   we hold to 1.5s. Reasoning:
//     • Sub-second extraction looks BUGGY ("did anything happen?").
//     • 1.5s is short enough to not feel padded, long enough for the
//       orb pulse to register as "thinking".
//     • If the API takes >1.5s, we don't artificially slow it — we just
//       hold to the floor, then proceed.
//   Parent owns the timer; this component is dumb-renderer.
//
// — UX (Behavior Q2 — mid-stream cancel):
//   TAP THE ORB to cancel back to Capture. Also: back-chevron and
//   system back. Reasoning:
//     • A "Cancel" button is anti-goal (brief).
//     • The orb is the only large affordance on screen during loading —
//       it should be tap-aware. Pressing the orb says "stop this".
//     • We give a soft visual hint (orb tap-target ring on tap-down) so
//       discoverability isn't zero, without labeling it.
// ─────────────────────────────────────────────────────────────────────────
function LoadingPhase({ onCancel }) {
  const [pressed, setPressed] = useState(false);
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '32px 20px 0',
    }}>
      {/* — UX (rule #2): orb fills the upper third. 180pt body + halo
            occupies ~260pt of vertical, anchored top of the screen. */}
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
          // Tap-down ring — subtle, communicates "yes, this is tappable"
          // without ever spelling it out.
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
        }}>
          {/* — UX (copy): "Reading the evidence". Locked-feel.
                Verb is concrete; "evidence" tees up the case framing
                without saying "complaint" yet (premature). */}
          Reading the evidence
        </span>

        {/* — UX (loading heading):
              Brief draft: "Looking at your photo, extracting facts…"
              SHARPENED: drops "Looking at your photo" (redundant — the
              orb IS looking) and "extracting facts" (jargon). New copy:
                "Pulling the details out of your evidence."
              Reads like a human assistant narrating, not a status string.
              Keeps "details" (warm) over "facts" (clinical). The trailing
              period (not ellipsis) is intentional — ellipsis on a loading
              screen reads "stalled". A period reads "confident". */}
        <h1 style={{
          margin: '16px 0 0', maxWidth: 300,
          fontSize: 22, lineHeight: 1.25, fontWeight: 700,
          letterSpacing: '-0.025em',
          color: 'var(--text-primary)',
        }}>
          Pulling the details out of your evidence.
        </h1>

        {/* — UX: a single shimmer line below the heading hints "more text
              about to arrive" — implicit promise that fields are coming.
              Subtle; not a progress bar (anti-goal). */}
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

// ─────────────────────────────────────────────────────────────────────────
// CompletionHeader — small orb + heading, post-extraction.
// — UX (State A heading):
//   Brief draft: "Here's what I see."
//   KEPT. Reasoning: 4 words, first person, confident. "What I see"
//   anchors authorship (the AI is the actor); the period is again
//   intentional ("done", not "in progress").
// ─────────────────────────────────────────────────────────────────────────
function CompletionHeader({ state }) {
  const config = {
    A: {
      orb: { demeanor: 'celebrate' },
      heading: "Here's what I see.",
      sub: null,
    },
    B: {
      orb: { demeanor: 'celebrate' },
      // — UX (State B heading):
      //   Brief draft: "Here's what I can see."
      //   SHARPENED to: "Here's what I could read." Reasoning: "can see"
      //   sounds present-tense (still doing it); "could read" is past-tense
      //   (done with the parts that worked) and acknowledges the gap
      //   without apologizing. Same number of words, sharper intent.
      heading: "Here's what I could read.",
      sub: "Help me fill the rest — it takes seconds.",
    },
    C: {
      orb: { demeanor: 'neutral' },
      // — UX (State C heading):
      //   Brief draft: "Hmm — I couldn't read this."
      //   KEPT. "Hmm" is human, not blaming. Em-dash matches our brand
      //   punctuation (Home uses it elsewhere). Honest, not apologetic.
      heading: "Hmm — I couldn't read this.",
      // — UX (State C subhead):
      //   12-word ceiling. Names cause + path forward in one breath.
      //   Brief said "explains what to try" — so we point at the two
      //   buttons coming below without re-listing them.
      sub: 'The file was unclear. Try a sharper photo, or add details by hand.',
    },
  }[state];

  return (
    <div style={{
      padding: '8px 20px 0',
      display: 'flex', alignItems: 'flex-start', gap: 14,
    }}>
      <Orb size={56} demeanor={config.orb.demeanor} />
      <div style={{ flex: 1, minWidth: 0, paddingTop: 4 }}>
        <h1 style={{
          margin: 0,
          fontSize: 24, lineHeight: 1.2, fontWeight: 700,
          letterSpacing: '-0.03em',
          color: 'var(--text-primary)',
        }}>{config.heading}</h1>
        {config.sub && (
          <p style={{
            margin: '6px 0 0',
            fontSize: 13, lineHeight: 1.5,
            color: 'var(--text-secondary)',
            maxWidth: 280,
          }}>{config.sub}</p>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// ExtractedField — one row in the ledger card.
// — UX (Q3 — low-confidence variant):
//   YES — a dotted underline + a subtle "?" badge for inferred fields.
//   Reasoning:
//     • The brief said "fields can be inferred but uncertain" — hiding
//       that erodes trust.
//     • A solid checkmark on ALL fields makes the user assume infallible
//       AI. When it's wrong, they're surprised and angry. Better to
//       signal uncertainty upfront so they tap to verify.
//     • Engineering meter (% confidence) is the anti-goal — too granular,
//       too clinical. A binary signal (sure / not-sure) hits the right
//       fidelity for a consumer.
//
// — UX (Q4 — editability):
//   FIELDS ARE TAP-TO-EDIT INLINE. Reasoning:
//     • A "something wrong?" link at the bottom forces the user into a
//       sub-screen — anti-goal.
//     • Inline edit keeps the demo on one screen (rule #2). A judge sees
//       a field, taps it, types — done. No navigation.
//     • The whole row is the affordance (per Capture's pattern). Inferred
//       fields nudge edit via the "?" badge and dotted underline; certain
//       fields are also editable but require deliberate tap.
//
// — UX (Behavior Q3 — edit affordance):
//   Tap-anywhere on the row to edit. NO pencil icon. Reasoning:
//     • The check / "?" already act as state indicators in the trailing
//       position. A pencil there would compete.
//     • Tap-anywhere is the iOS Settings pattern; familiar muscle memory.
//     • While editing, the row gets a saffron focus ring (same vocabulary
//       as Capture's note field) so it reads as "you're in edit mode".
// ─────────────────────────────────────────────────────────────────────────
function ExtractedField({
  label, value, confident = true, missing = false,
  revealed = true, onEdit = () => {},
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => { setDraft(value); }, [value]);

  useEffect(() => {
    if (editing) {
      // Defer focus so the input has rendered.
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [editing]);

  const commit = () => {
    setEditing(false);
    if (draft !== value) onEdit(draft);
  };

  return (
    <div
      onClick={() => !editing && setEditing(true)}
      style={{
        // — UX (stagger): each field fades + slides in. We drive this via
        //   parent-owned `revealed` flag + CSS transition. Originally used
        //   a CSS keyframe (animation: fieldIn … both) but keyframes can
        //   stall in headless renderers where document.timeline doesn't
        //   advance. Transition + state is bullet-proof across envs.
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
          letterSpacing: '-0.005em',
          color: missing ? 'var(--text-tertiary)' : 'var(--text-primary)',
          // Dotted underline for low-confidence inferred fields
          textDecoration: !confident && !missing ? 'underline dotted' : 'none',
          textDecorationColor: 'var(--text-tertiary)',
          textUnderlineOffset: 3,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{value}</span>
      )}

      <span style={{ flexShrink: 0, width: 20, height: 20, display: 'grid', placeItems: 'center' }}>
        {missing ? (
          // — UX (Q3 / State B missing): a "+" badge for "tap to add".
          //   Color: --text-tertiary (not saffron) — saffron would make
          //   the empty rows louder than the filled ones, inverting the
          //   visual priority.
          <span style={{
            width: 18, height: 18, borderRadius: '50%',
            border: '1.5px dashed var(--text-tertiary)',
            color: 'var(--text-tertiary)',
            fontSize: 12, fontWeight: 700,
            display: 'grid', placeItems: 'center',
            lineHeight: 1,
          }}>+</span>
        ) : confident ? (
          // Saffron check — small, leading lower-baseline for proportion.
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
               stroke="var(--accent-saffron)" strokeWidth="2.6"
               strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          // Low-confidence "?" — saffron-soft tint, not bright. Signals
          // "we have a guess; tap to confirm" without alarming.
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

// ─────────────────────────────────────────────────────────────────────────
// LedgerCard — the card that holds all fields.
// — UX (Q5 — photo thumbnail placement):
//   At the BOTTOM of the ledger card, full-width, with the label.
//   CONFIRMED against brief instinct but moved up from "bottom right".
//   Reasoning:
//     • Bottom-right at thumbnail size (~40pt) is too easy to miss —
//       a stressed user wouldn't register it. The "yes, AI looked at
//       this" reassurance has to be findable in a 2-second glance.
//     • Full-width inside the card makes it part of the proof bundle:
//       fields + source = one artifact.
//     • Below the fields, not above — fields are the payload, thumbnail
//       is supporting evidence.
//   Thumbnail height ~64pt; doesn't dominate.
// ─────────────────────────────────────────────────────────────────────────
function LedgerCard({ children, thumbnailLabel, thumbnailSrc, thumbnailRevealed = true }) {
  return (
    <div style={{
      borderRadius: 18,
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      overflow: 'hidden',
    }}>
      <div style={{ padding: '6px 6px 0' }}>
        {children}
      </div>

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
            background: thumbnailSrc
              ? `linear-gradient(135deg, var(--accent-saffron-soft), var(--accent-trust-soft))`
              : 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            display: 'grid', placeItems: 'center',
            color: 'var(--text-tertiary)',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Stand-in glyph — real prototype would load the user file */}
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
            }}>swiggy-order-receipt.png</span>
          </span>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// PrimaryCTA — same vocabulary as Home's GradientButton.
// — UX (Q6 — CTA copy):
//   PICK: (a) "Confirm — pick the play" with one sharpening.
//   Reasoning:
//     • (a) "Confirm" alone is bureaucratic, sterile. Drops the brand
//       personality (the "advocate" voice).
//     • (c) "Looks right — continue" is warm but vague about WHAT next.
//     • (b) brief's draft "Confirm — pick the play" is doing real work:
//       "confirm" = commit, "pick the play" = forward-promise (the user
//       sees they're about to choose a strategy). It also introduces
//       "play" as the brand verb for what Screen 4 is about, which is
//       useful priming.
//   SHARPENING: I drop the em-dash split for the State A button copy
//   because at 56pt height with center alignment, an em-dash visually
//   breaks the button into two CTAs. Replaced with a trailing arrow that
//   carries the "next" meaning. Final A copy: "Pick the play"
//   (with an arrow icon). Premise was "confirm" — but the act of tapping
//   the gradient CTA IS the confirm; the label should describe the next
//   place, not duplicate the gesture.
// ─────────────────────────────────────────────────────────────────────────
function PrimaryCTA({ label = 'Pick the play', onClick, disabled = false, variant = 'primary' }) {
  const [pressed, setPressed] = useState(false);

  const baseStyle = {
    height: 56, width: '100%',
    padding: '0 24px',
    borderRadius: 999, border: 'none',
    fontFamily: 'inherit', fontSize: 16, fontWeight: 700,
    letterSpacing: '-0.01em',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    transition: 'transform 100ms ease-out, filter 200ms ease, opacity 200ms ease',
  };

  if (variant === 'secondary') {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        style={{
          ...baseStyle,
          background: 'transparent',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-strong)',
          cursor: disabled ? 'default' : 'pointer',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {label}
      </button>
    );
  }

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
        ...baseStyle,
        background: 'var(--gradient-hero)',
        color: 'var(--on-accent)',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        boxShadow: pressed
          ? '0 2px 8px var(--accent-saffron-border)'
          : 'var(--glow-cta)',
        transform: pressed ? 'scale(0.98)' : 'scale(1)',
        filter: disabled ? 'saturate(0.6)' : 'none',
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

// ─────────────────────────────────────────────────────────────────────────
// CompletionTagline — single soft confirmation line under the fields.
// — UX (microcopy):
//   "Six details, ready to file." 5 words, concrete (count), action-end.
//   Avoids "All set!" / "Great!" / "Looks good!" — robotic.
//   Premise: tell the user what they have and what comes next in 5 words.
// ─────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────
// HelperTip — small inline tip (State B only).
// — UX (microcopy):
//   Brief draft: "💡 Tip: a photo of your bill works best."
//   KEPT, with one beat dropped: removed "Tip:" — the lightbulb is the
//   tip-marker; "Tip: tip" is redundant. Final: "💡 A bill or receipt
//   works better than a photo of the food."
//   Adds the specific contrast ("better than a photo of the food") so
//   it's actionable for the actual State B scenario (damaged-item photo).
// ─────────────────────────────────────────────────────────────────────────
function HelperTip({ children, revealed = true }) {
  return (
    <div style={{
      margin: 0, padding: '10px 14px',
      borderRadius: 12,
      background: 'var(--accent-trust-soft)',
      border: '1px solid var(--accent-trust-border)',
      color: 'var(--text-primary)',
      fontSize: 12.5, lineHeight: 1.5,
      opacity: revealed ? 1 : 0,
      transform: revealed ? 'translateY(0)' : 'translateY(6px)',
      transition: 'opacity 320ms cubic-bezier(0.22,1,0.36,1), transform 320ms cubic-bezier(0.22,1,0.36,1)',
    }}>{children}</div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// BottomNav — minimal, "New" tab active. Shared component family.
// ─────────────────────────────────────────────────────────────────────────
function BottomNav({ active = 'new', onNav = () => {} }) {
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
                 strokeLinecap="round" strokeLinejoin="round">
              {it.icon}
            </svg>
            <span style={{ fontSize: 10, fontWeight: 600 }}>{it.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Field datasets — kept at module scope. Mirrors brief's exact 6 labels.
// ─────────────────────────────────────────────────────────────────────────
const FIELDS_A = [
  { label: 'Vendor',    value: 'Swiggy',                                    confident: true  },
  { label: 'Order ID',  value: '#119284756',                                confident: true  },
  { label: 'Amount',    value: '₹420',                                      confident: true  },
  { label: 'Issue',     value: 'Spillage during delivery',                  confident: true  },
  { label: 'Severity',  value: 'High',                                      confident: false }, // inferred
  { label: 'Delivered', value: 'May 24 · 8:42 PM',                          confident: true  },
];
const FIELDS_B = [
  { label: 'Vendor',    value: 'Tap to add — couldn’t read this', missing: true },
  { label: 'Order ID',  value: 'Tap to add — couldn’t read this', missing: true },
  { label: 'Amount',    value: 'Tap to add — couldn’t read this', missing: true },
  { label: 'Issue',     value: 'Spillage; multiple items affected',         confident: true  },
  { label: 'Severity',  value: 'High',                                      confident: true  },
  { label: 'Delivered', value: 'Tap to add — couldn’t read this', missing: true },
];

// ─────────────────────────────────────────────────────────────────────────
// useStaggerReveal — ticks a counter every `step` ms up to `total`.
// We use this to drive the field-by-field reveal instead of CSS keyframe
// `animation-delay`. Reasons in the comments at ExtractedField.
// ─────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────
// State A — Fully Extracted (the hero path).
// — UX (Q2 — stagger): 150ms between fields per brief. The first field
//   appears 200ms after the orb-shrink starts — "punctuation", per brief.
// — UX (Q8 — transition out): SLIDE LEFT. Owned by the parent on submit
//   (we just call onSubmit). iOS-native left-slide on forward nav.
// ─────────────────────────────────────────────────────────────────────────
function StateA({ onSubmit, fields = FIELDS_A }) {
  // 6 fields + thumbnail + tagline + CTA = 9 reveal beats.
  const TOTAL = fields.length + 3;
  const count = useStaggerReveal(TOTAL, { firstDelay: 200, step: 150, deps: [fields] });
  return (
    <>
      <CompletionHeader state="A" />

      <section style={{ padding: '20px 20px 0' }}>
        <LedgerCard
          thumbnailLabel="Your evidence"
          thumbnailSrc="placeholder"
          thumbnailRevealed={count >= fields.length + 1}
        >
          {fields.map((f, i) => (
            <ExtractedField
              key={f.label}
              label={f.label}
              value={f.value}
              confident={f.confident}
              missing={!!f.missing}
              revealed={count >= i + 1}
            />
          ))}
        </LedgerCard>
      </section>

      <section style={{ padding: '20px 20px 0' }}>
        {/* — UX (microcopy: tagline under fields):
              "Six details, ready to file." 5 words, concrete count. */}
        <CompletionTagline revealed={count >= fields.length + 2}>
          Six details, ready to file.
        </CompletionTagline>
      </section>

      <section style={{
        padding: '16px 20px 0',
        opacity: count >= TOTAL ? 1 : 0,
        transform: count >= TOTAL ? 'translateY(0)' : 'translateY(6px)',
        transition: 'opacity 320ms cubic-bezier(0.22,1,0.36,1), transform 320ms cubic-bezier(0.22,1,0.36,1)',
      }}>
        <PrimaryCTA label="Pick the play" onClick={onSubmit} />
      </section>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// State B — Partially Extracted.
// — UX (Behavior Q5 — progressive enable):
//   ENABLE WHEN ALL MISSING FIELDS HAVE A NON-EMPTY VALUE.
//   NOT progressive-per-field. Reasoning:
//     • Progressive-per-field means the button moves from 30% → 50% → 80%
//       opacity — distracting. The user looks at the button while typing
//       in a field instead of focusing on the field they're editing.
//     • "All missing filled" is a single, predictable trigger: when you
//       finish the last empty row, the button lights. Clean.
// — UX (CTA copy when locked):
//   Brief draft: "Add details to continue"
//   KEPT. Imperative, names the obstacle, names the goal.
// ─────────────────────────────────────────────────────────────────────────
function StateB({ onSubmit }) {
  const [fields, setFields] = useState(FIELDS_B);
  // 6 fields + helper tip + CTA = 8 reveal beats.
  const TOTAL = fields.length + 2;
  const count = useStaggerReveal(TOTAL, { firstDelay: 200, step: 150, deps: [] });

  const allFilled = fields.every((f) => !f.missing);

  const editField = (idx, newVal) => {
    setFields((prev) => prev.map((f, i) => i === idx ? {
      ...f, value: newVal, missing: !newVal || newVal.startsWith('Tap to add'), confident: true,
    } : f));
  };

  return (
    <>
      <CompletionHeader state="B" />

      <section style={{ padding: '20px 20px 0' }}>
        <LedgerCard
          thumbnailLabel="Your evidence"
          thumbnailSrc="placeholder"
          thumbnailRevealed={count >= fields.length}
        >
          {fields.map((f, i) => (
            <ExtractedField
              key={f.label}
              label={f.label}
              value={f.value}
              confident={f.confident}
              missing={!!f.missing}
              revealed={count >= i + 1}
              onEdit={(v) => editField(i, v)}
            />
          ))}
        </LedgerCard>
      </section>

      <section style={{ padding: '16px 20px 0' }}>
        <HelperTip revealed={count >= fields.length + 1}>
          💡 A bill or receipt works better than a photo of the food.
        </HelperTip>
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

// ─────────────────────────────────────────────────────────────────────────
// State C — Could Not Read.
// — UX (Behavior Q4 — Try-another target):
//   GOES BACK TO CAPTURE (Screen 2). Reasoning:
//     • A "refreshed prompt" on Screen 3 means rebuilding the upload UI
//       inside this screen — duplicates Capture's job.
//     • Returning to Capture preserves the user's mental model: "I came
//       from there, I'm going back there."
//     • The Capture screen will already be in its empty state — the user
//       sees the three input options and can re-try.
// ─────────────────────────────────────────────────────────────────────────
function StateC({ onRetry, onManual }) {
  return (
    <>
      <CompletionHeader state="C" />

      {/* Mini thumbnail card — shows the user what FAILED so they
          can recognize it. Helpful, never blaming. */}
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
            }}>blurry-receipt.jpg</div>
            <div style={{
              fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 2,
            }}>2.1 MB · uploaded just now</div>
          </div>
        </div>
      </section>

      <section style={{
        padding: '24px 20px 0',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        <PrimaryCTA label="Try another file" onClick={onRetry} />
        <PrimaryCTA label="Add details manually" onClick={onManual} variant="secondary" />
      </section>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// ExtractingScreen — orchestrator. Phases: loading → result(state).
// ─────────────────────────────────────────────────────────────────────────
function ExtractingScreen({
  mode = 'dark',
  state = 'A',
  skipLoading = false,
  onBack = () => {},
  onReset = () => {},
  onSubmit = () => {},
  onRetry = () => {},
  onManual = () => {},
  replayKey = 0,
}) {
  // Phases: 'loading' (orb) or 'done' (state result).
  const [phase, setPhase] = useState(skipLoading ? 'done' : 'loading');

  // — UX (Q7 — min-hold): 1.5s floor, then transition.
  useEffect(() => {
    if (skipLoading) { setPhase('done'); return; }
    setPhase('loading');
    const t = setTimeout(() => setPhase('done'), 1500);
    return () => clearTimeout(t);
  }, [state, skipLoading, replayKey]);

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
        <Header onBack={onBack} onReset={onReset} />

        <section style={{ padding: '8px 20px 0' }}>
          <StepIndicator label={phase === 'loading' ? 'Extracting' : 'Extracted'} />
        </section>

        {phase === 'loading' ? (
          <LoadingPhase onCancel={onBack} />
        ) : (
          <div key={`${state}-${replayKey}`}>
            {state === 'A' && <StateA onSubmit={onSubmit} />}
            {state === 'B' && <StateB onSubmit={onSubmit} />}
            {state === 'C' && <StateC onRetry={onRetry} onManual={onManual} />}
          </div>
        )}
      </div>

      <BottomNav active="new" onNav={(id) => { if (id === 'home') onBack(); }} />
    </div>
  );
}

window.ExtractingScreen = ExtractingScreen;
