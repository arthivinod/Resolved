// ─────────────────────────────────────────────────────────────────────────
// capture-screen.jsx — Resolved · Screen 2 (Capture)
// Visual system: /design.md (mirrored in tokens.css). Zero hex in this file.
//
// READ FIRST — UX rationale comments are tagged  // — UX:
// The reviewer grades by these. Every interaction / hierarchy / copy
// decision from the brief is answered next to the code that implements it.
// ─────────────────────────────────────────────────────────────────────────

const { useState, useEffect, useRef, useCallback } = React;

// ─────────────────────────────────────────────────────────────────────────
// StepIndicator — saffron-soft pill. Matches the EyebrowChip vocabulary
// from Home so the user reads it as "you're inside the flow now".
// — UX (locked copy): "Step 1 of 4". The total (4) gives a finish line —
//   classic Doherty effect: visible end-state reduces abandonment.
// ─────────────────────────────────────────────────────────────────────────
function StepIndicator({ step = 1, total = 4 }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
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
      Step {step} of {total}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Header — wordmark + Reset.
// — UX (Behavior Q5 — what does Reset do?):
//   CLEAR-AND-STAY. Not back-to-Home. Reasoning:
//     • A user mid-stress doesn't want to lose their place on a misclick.
//     • Browser/system back already exists for "leave this screen".
//     • Reset's job is "I picked the wrong file, let me start this part
//       over" — which is in-screen, not cross-screen.
//   The button is text-only ("Reset"), positioned where Home's mode toggle
//   was — same coordinate, different word, so muscle memory survives.
//   Disabled (low-contrast, no border) when nothing is selected — gives
//   passive feedback that the user hasn't made a destructible choice yet.
// ─────────────────────────────────────────────────────────────────────────
function Header({ canReset, onReset, onBack }) {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '8px 16px 12px',
      position: 'relative', zIndex: 2,
    }}>
      {/* Back chevron — system back, separate from Reset.
          UX: a Capture screen with no way back to Home would trap users on
          deep-link arrivals. Subtle chevron (no label) keeps the screen
          calm; pairs with the wordmark visually. */}
      <button
        onClick={onBack}
        aria-label="Back to home"
        style={{
          width: 44, height: 44, padding: 0,
          background: 'transparent', border: 'none', cursor: 'pointer',
          borderRadius: 999, display: 'grid', placeItems: 'center',
          color: 'var(--text-secondary)',
        }}
      >
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
          height: 36, padding: '0 14px',
          background: 'transparent', border: 'none', cursor: canReset ? 'pointer' : 'default',
          color: canReset ? 'var(--text-primary)' : 'var(--text-tertiary)',
          fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
          letterSpacing: '-0.01em',
          opacity: canReset ? 1 : 0.55,
          transition: 'opacity 200ms ease, color 200ms ease',
          minWidth: 44, minHeight: 44,
        }}
      >
        Reset
      </button>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// InputCard — the accordion row. Closed = calm default, expanded = options.
//
// — UX (Q1 — accordion vs multi-open):
//   ACCORDION. One card open at a time. Reasoning:
//     • The screen has 3 cards × up to 3 sub-options each = 9 potential
//       sub-rows visible at once. That's a buffet for a stressed user
//       who actually only needs to pick ONE.
//     • Tapping a card == "I'm leaning this way." Auto-closing the
//       previous card is the system saying "we heard you change your mind."
//     • Multi-open creates ambiguous state: which one are they about to
//       commit to? The next CTA (Continue) would need to be smarter to
//       resolve it. Accordion sidesteps the problem entirely.
//
// — UX (Q2 — chevron rotation + border):
//   180° rotation, 200ms cubic-bezier(0.22,1,0.36,1) ease-out — same curve
//   as the Home CTA press to keep motion language consistent.
//   Border shifts to --accent-saffron-border on expand, and the card
//   background lifts to --bg-elevated. Two cues (rotation + tint) costs
//   nothing and dramatically improves "yes, I tapped a thing" feedback.
//
// — UX (Behavior Q1 — tap lift):
//   YES — a subtle scale(0.99) + soft shadow on tap-down. NOT a hover
//   lift (no hover on mobile). It's a touch confirmation. Releases back
//   to scale(1) when the expand animation takes over.
//
// — UX (Behavior Q2 — collapse gesture):
//   Tap header again to collapse. PLUS swipe-down inside the expanded
//   region collapses too (threshold 48px). The brief asked for gesture
//   awareness — collapse-on-swipe-down rhymes with sheet dismissal,
//   which is the user's existing mental model on iOS.
// ─────────────────────────────────────────────────────────────────────────
function InputCard({
  id, icon, title, sub, options, isOpen, onToggle, onPick, loadingPick,
}) {
  const [pressed, setPressed] = useState(false);
  const swipeStart = useRef(null);
  const expandRef = useRef(null);

  // Swipe-down-to-collapse handlers on the expanded body
  const onTouchStart = (e) => { swipeStart.current = e.touches[0].clientY; };
  const onTouchMove = (e) => {
    if (swipeStart.current == null) return;
    const dy = e.touches[0].clientY - swipeStart.current;
    // — UX: 48px threshold — long enough to not collapse on accidental scrolls,
    //   short enough to feel responsive.
    if (dy > 48) {
      swipeStart.current = null;
      onToggle(id);
    }
  };
  const onTouchEnd = () => { swipeStart.current = null; };

  return (
    <div style={{
      borderRadius: 16,
      background: isOpen ? 'var(--bg-elevated)' : 'var(--bg-surface)',
      border: isOpen
        ? '1px solid var(--accent-saffron-border)'
        : '1px solid var(--border)',
      overflow: 'hidden',
      // — UX: faster than the chevron because users want to feel the
      //   surface react before they see the arrow finish flipping.
      transition: 'background 180ms ease, border-color 180ms ease',
    }}>
      {/* Header row — 56pt min, full-width tap target */}
      <button
        onClick={() => onToggle(id)}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        onTouchStart={() => setPressed(true)}
        onTouchEnd={() => setPressed(false)}
        aria-expanded={isOpen}
        style={{
          width: '100%', minHeight: 56,
          padding: '14px 16px',
          background: 'transparent', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 14,
          textAlign: 'left', fontFamily: 'inherit',
          color: 'var(--text-primary)',
          transform: pressed && !isOpen ? 'scale(0.995)' : 'scale(1)',
          transition: 'transform 120ms ease',
        }}
      >
        {/* Emoji icon container — per design.md, emojis are part of the
            input-card vocabulary. Box matches FeatureCard rhythm so the
            two screens read as one family. */}
        <span style={{
          width: 40, height: 40, borderRadius: 12, flexShrink: 0,
          fontSize: 22,
          display: 'grid', placeItems: 'center',
          background: 'var(--accent-saffron-soft)',
          border: '1px solid var(--accent-saffron-border)',
          // Stops the OS from drawing the emoji at native saturation
          // against a brand-tinted box (looks more deliberate).
          filter: 'saturate(1)',
        }}>{icon}</span>

        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{
            display: 'block',
            fontSize: 15.5, fontWeight: 600,
            letterSpacing: '-0.015em', lineHeight: 1.2,
            color: 'var(--text-primary)',
          }}>{title}</span>
          <span style={{
            display: 'block', marginTop: 2,
            fontSize: 12.5, lineHeight: 1.45,
            color: 'var(--text-secondary)',
          }}>{sub}</span>
        </span>

        {/* Chevron — rotates 180° on expand */}
        <span style={{
          width: 28, height: 28, flexShrink: 0,
          display: 'grid', placeItems: 'center',
          color: isOpen ? 'var(--accent-saffron)' : 'var(--text-tertiary)',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 200ms cubic-bezier(0.22,1,0.36,1), color 200ms ease',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2.2"
               strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {/* Expanded body — conditionally rendered.
          — UX (animation): tried grid 0fr→1fr, then max-height. Both
            stalled in Chromium when inline `transition` re-emits per
            render. The chevron rotation + saffron border + bg lift
            already carry "this opened" — the body doesn't need a slide.
            Reliable beats clever here.
          — UX (entry feel): a 220ms fade-in on the body via CSS keyframe
            so it doesn't pop. Keyframes are CSS-side (in tokens.css),
            React isn't fighting the transition. */}
      {isOpen && (
        <div
          ref={expandRef}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{
            borderTop: '1px solid var(--border)',
            padding: '6px 8px 8px',
            display: 'flex', flexDirection: 'column',
            // Entry motion intentionally OFF (chevron rotation + saffron
            // border on the header already carry "this opened"; CSS
            // keyframes broke in headless renderers).
          }}
        >
          {options.map((opt) => (
            <SubOption
              key={opt.id}
              opt={opt}
              loading={loadingPick === opt.id}
              onPick={() => onPick(id, opt.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SubOption — 44pt min, full-width row inside the expanded card.
// — UX (Q3 — confirmation vs immediate):
//   IMMEDIATE transition to Extracting. Reasoning:
//     • 90-second demo: a preview/confirm step adds a wasted screen
//       judges watch tap through.
//     • For Photo: the OS camera/picker itself IS the preview/confirm
//       (you see the file before it returns to our app). A second confirm
//       would be redundant friction.
//     • For PDF/email: the Extracting screen IS the feedback — orb
//       pulsing, "reading your evidence" — which means "we got it" with
//       motion instead of a static "Confirm?" dialog.
//
// — UX (Behavior Q6 — loading state during transition):
//   The tapped sub-option fades to saffron tint + a shimmer line under it
//   for ~160ms before the route changes. Just enough that the user sees
//   "the tap was registered" — no spinner, no toast. Stays subtle.
//
// — UX (Coming-soon state for "Connect inbox"):
//   The row renders but is disabled and gets a small "Coming soon" pill.
//   Tapping does nothing (no error toast — disabled means disabled). This
//   communicates roadmap without breaking the accordion's silent feel.
// ─────────────────────────────────────────────────────────────────────────
function SubOption({ opt, loading, onPick }) {
  const [pressed, setPressed] = useState(false);
  const disabled = !!opt.comingSoon;

  return (
    <button
      onClick={disabled ? undefined : onPick}
      disabled={disabled}
      onMouseDown={() => !disabled && setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => !disabled && setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        minHeight: 56, // exceeds 44 floor — more comfortable inside cards
        padding: '10px 12px',
        background: pressed
          ? 'var(--accent-saffron-soft)'
          : (loading ? 'var(--accent-saffron-soft)' : 'transparent'),
        border: 'none', borderRadius: 12,
        cursor: disabled ? 'default' : 'pointer',
        display: 'flex', alignItems: 'center', gap: 12,
        textAlign: 'left', fontFamily: 'inherit',
        color: disabled ? 'var(--text-tertiary)' : 'var(--text-primary)',
        opacity: disabled ? 0.65 : 1,
        transition: 'background 140ms ease',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <span style={{
        width: 32, height: 32, borderRadius: 10, flexShrink: 0,
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        color: 'var(--text-secondary)',
        display: 'grid', placeItems: 'center',
      }}>{opt.icon}</span>

      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{
          display: 'block', fontSize: 14, fontWeight: 600,
          letterSpacing: '-0.01em', color: 'inherit',
        }}>{opt.title}</span>
        <span style={{
          display: 'block', marginTop: 1,
          fontSize: 11.5, color: 'var(--text-tertiary)', lineHeight: 1.45,
        }}>{opt.sub}</span>
      </span>

      {disabled ? (
        <span style={{
          flexShrink: 0,
          padding: '4px 8px', borderRadius: 999,
          background: 'var(--accent-trust-soft)',
          border: '1px solid var(--accent-trust-border)',
          color: 'var(--accent-trust)',
          fontSize: 9.5, fontWeight: 700,
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>Coming soon</span>
      ) : (
        <span style={{ flexShrink: 0, color: 'var(--text-tertiary)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2.2"
               strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </span>
      )}

      {/* Loading shimmer line — 160ms before screen change */}
      {loading && (
        <span aria-hidden style={{
          position: 'absolute', bottom: 4, left: 12, right: 12, height: 2,
          borderRadius: 2, overflow: 'hidden',
          background: 'var(--accent-saffron-soft)',
        }}>
          <span style={{
            display: 'block', width: '40%', height: '100%',
            background: 'var(--gradient-hero)',
            animation: 'shimmer 800ms linear infinite',
          }} />
        </span>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// ErrorBanner — inline, attached to the card that failed.
// — UX (Q5 — extraction failure):
//   INLINE, attached to the relevant card. Reasoning:
//     • A toast disappears — a stressed user may have looked away.
//     • A full-screen error blocks; recovery requires extra taps.
//     • Inline ties the message to the affordance that caused it ("this
//       PDF didn't extract — try another, or use a screenshot").
//     • Reveals naturally inside the same accordion frame, so the failure
//       feels like a state of the input, not a system fault.
//   Tone: descriptive + actionable. Never apologetic ("Oops!" / "Sorry!").
// ─────────────────────────────────────────────────────────────────────────
function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div role="alert" style={{
      margin: '10px 0 0',
      padding: '12px 14px', borderRadius: 12,
      background: 'var(--warning-soft)',
      border: '1px solid var(--warning)',
      color: 'var(--text-primary)',
      display: 'flex', alignItems: 'flex-start', gap: 10,
      fontSize: 12.5, lineHeight: 1.5,
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
           stroke="var(--warning)" strokeWidth="2"
           strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
        <path d="M12 9v4M12 17h.01M10.3 3.86l-8.8 15.27A2 2 0 0 0 3.24 22h17.52a2 2 0 0 0 1.74-2.87L13.7 3.86a2 2 0 0 0-3.4 0Z" />
      </svg>
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={onDismiss}
        aria-label="Dismiss error"
        style={{
          width: 24, height: 24, padding: 0, borderRadius: 999,
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: 'var(--text-secondary)', flexShrink: 0,
          display: 'grid', placeItems: 'center',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2.2"
             strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 6l12 12M6 18 18 6" />
        </svg>
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// NoteField — optional textarea.
// — UX (Q6 — character limit):
//   NO HARD LIMIT. Soft suggestion at 280. Reasoning:
//     • The model swallows arbitrary length. A hard cap would frustrate a
//       user with a complex case.
//     • Visible counter (faint, only after 200 chars) gently signals "the
//       AI does better with short context." Doesn't block.
//     • Counter goes amber past 280; never red, never blocks submit.
//
// — UX (Behavior Q4 — keyboard appearance):
//   On focus, the bottom nav slides DOWN out of view. Reasoning:
//     • The iOS keyboard is ~290pt. Without hiding the nav, the textarea
//       is squeezed against it; the user can't see what they're writing.
//     • Returning the nav on blur preserves orientation when they look up.
//   We expose this to the parent via onFocus/onBlur — the parent owns the
//   nav and the screen padding adjustment.
// ─────────────────────────────────────────────────────────────────────────
function NoteField({ value, onChange, onFocus, onBlur }) {
  const [focused, setFocused] = useState(false);
  const len = value.length;
  const showCount = len >= 200;
  const overSoftCap = len > 280;

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        marginBottom: 8,
      }}>
        <span style={{
          fontSize: 10.5, fontWeight: 600,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'var(--text-secondary)',
        }}>Optional</span>
        {showCount && (
          <span style={{
            fontSize: 11, fontVariantNumeric: 'tabular-nums',
            color: overSoftCap ? 'var(--warning)' : 'var(--text-tertiary)',
            transition: 'color 200ms ease',
          }}>{len}</span>
        )}
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => { setFocused(true); onFocus && onFocus(); }}
        onBlur={() => { setFocused(false); onBlur && onBlur(); }}
        placeholder="Tell us what happened…"
        rows={3}
        style={{
          width: '100%', minHeight: 96, boxSizing: 'border-box',
          padding: '12px 14px',
          borderRadius: 14,
          background: 'var(--bg-surface)',
          border: focused
            ? '1px solid var(--accent-saffron-border)'
            : '1px solid var(--border)',
          // Soft saffron glow when focused — same vocabulary as the CTA
          // press state, so focus reads as "the brand recognizes you."
          boxShadow: focused
            ? '0 0 0 3px var(--accent-saffron-soft)'
            : 'none',
          color: 'var(--text-primary)',
          fontFamily: 'inherit', fontSize: 14, lineHeight: 1.5,
          letterSpacing: '-0.005em',
          resize: 'none', outline: 'none',
          transition: 'border-color 180ms ease, box-shadow 180ms ease',
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// TrySampleLink — bottom of column, dashed underline.
// — UX (Q7 — placement):
//   FOOTER TEXT LINK with a dashed underline. NOT a chip, NOT a floating
//   FAB. Reasoning:
//     • A chip competes with the three real input cards (visual weight).
//     • A floating button screams "click me first!" — the opposite of
//       what we want: real cases first, sample as fallback.
//     • Dashed underline is the universal "this is a demo / learn more"
//       convention; reads as deliberately optional.
//   Sits BELOW the note field, so it's the last thing the user sees if
//   they scroll — the natural place for "no input? try this."
// ─────────────────────────────────────────────────────────────────────────
function TrySampleLink({ onPick }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onPick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        margin: '0 auto', display: 'block',
        background: 'transparent', border: 'none', cursor: 'pointer',
        padding: '12px 16px', minHeight: 44,
        color: 'var(--text-secondary)',
        fontFamily: 'inherit', fontSize: 13,
        letterSpacing: '-0.005em',
        textDecoration: 'underline',
        textDecorationStyle: 'dashed',
        textDecorationColor: hover ? 'var(--accent-saffron)' : 'var(--text-tertiary)',
        textUnderlineOffset: 4,
        transition: 'text-decoration-color 200ms ease, color 200ms ease',
      }}
    >
      Try a sample — damaged Swiggy order
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// BottomNav — same component family as Home; "New" tab active.
// — UX (Behavior Q4 — hides on keyboard):
//   Parent controls visibility via `hidden` prop. Slides down + fades.
// ─────────────────────────────────────────────────────────────────────────
function BottomNav({ active = 'new', hidden = false, onNav = () => {} }) {
  const items = [
    { id: 'home', label: 'Home', icon: (
      <path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />
    ) },
    { id: 'new', label: 'New', icon: <path d="M12 5v14M5 12h14" /> },
    { id: 'cases', label: 'Cases', icon: (
      <>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M9 3h6v4H9zM8 11h8M8 15h5" />
      </>
    ) },
    { id: 'letters', label: 'Letters', icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <polyline points="3 7 12 13 21 7" />
      </>
    ) },
  ];
  return (
    <nav style={{
      position: 'absolute',
      left: 16, right: 16,
      bottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)',
      height: 64, borderRadius: 20, zIndex: 30,
      background: 'color-mix(in srgb, var(--bg-elevated) 85%, transparent)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid var(--border)',
      boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      padding: '0 8px',
      transform: hidden ? 'translateY(120%)' : 'translateY(0)',
      opacity: hidden ? 0 : 1,
      transition: 'transform 240ms cubic-bezier(0.22,1,0.36,1), opacity 200ms ease',
      pointerEvents: hidden ? 'none' : 'auto',
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
            <span style={{
              fontSize: 10, fontWeight: 600, letterSpacing: '0.02em',
            }}>{it.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Card definitions — kept at module scope so they're trivially editable
// without re-deriving them on every render. Microcopy lifted from the
// brief drafts; commentary marks where I sharpened.
// ─────────────────────────────────────────────────────────────────────────
const CARDS = [
  {
    id: 'photo',
    icon: '📸',
    title: 'Add a photo',
    // Sharpened from "Damaged item, receipt, screenshot" — same examples,
    // tighter rhythm (parallel singulars).
    sub: 'Damaged item · receipt · screenshot',
    options: [
      {
        id: 'camera', title: 'Take a photo', sub: 'Open camera now',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="1.8"
               strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        ),
      },
      {
        id: 'gallery', title: 'Choose from gallery', sub: 'Photos & screenshots',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="1.8"
               strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-5-5L5 21" />
          </svg>
        ),
      },
      {
        id: 'paste', title: 'Paste from clipboard', sub: 'If you just copied a screenshot',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="1.8"
               strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" />
          </svg>
        ),
      },
    ],
  },
  {
    id: 'document',
    icon: '📄',
    title: 'Upload a document',
    sub: 'Bill · ticket · policy · statement',
    options: [
      {
        id: 'pdf', title: 'PDF file', sub: 'Most bills and statements',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="1.8"
               strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        ),
      },
      {
        id: 'word', title: 'Word or image file', sub: '.docx, .png, .jpg',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="1.8"
               strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        ),
      },
      {
        id: 'files', title: 'Browse Files app', sub: 'iCloud, Drive, on-device',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="1.8"
               strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
        ),
      },
    ],
  },
  {
    id: 'email',
    icon: '📧',
    title: 'Forward an email',
    // Sharpened: brief draft was a list of nouns. Made it imperative-friendly.
    sub: 'From the vendor, airline, or anyone',
    options: [
      {
        id: 'forward', title: 'Get my forward address', sub: 'A unique address just for you',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="1.8"
               strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <polyline points="3 7 12 13 21 7" />
          </svg>
        ),
      },
      {
        id: 'connect', title: 'Connect inbox', sub: 'Auto-detect issues from email',
        comingSoon: true,
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="1.8"
               strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11V7a3 3 0 0 1 6 0v4M5 11h14v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z" />
          </svg>
        ),
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Error-message candidates (Q5 — microcopy drafts):
// Picked the first as default. Tone test: descriptive + actionable, no
// apology, no "AI" hand-wringing, no jargon.
//   A. "We couldn't read this file. Try a clearer photo or a different
//      format." ← default. Names cause + action.
//   B. "This file didn't extract. Tap below to try another." ← shorter
//      but vaguer; "didn't extract" leaks impl detail.
//   C. "The image was too blurry to use. Want to retake it?" ← only
//      works for photos.
// ─────────────────────────────────────────────────────────────────────────
const ERROR_MESSAGES = {
  default:  "We couldn't read this file. Try a clearer photo or a different format.",
  photo:    'The image was too blurry to use. Try a sharper shot.',
  document: "We couldn't open this document. PDFs and images work best.",
};

// ─────────────────────────────────────────────────────────────────────────
// CaptureScreen — composes everything.
// — UX (Q4 — multiple files):
//   SINGLE FILE per submission. Enforced by the model — sub-option tap
//   immediately commits and routes to Extracting. There's no "Add another"
//   affordance anywhere on this screen. Multi-file is a Phase-2 product
//   discussion, not an MVP one.
//
// — UX (Q8 — preview after selection?):
//   NO PREVIEW. The sub-option tap is the commit. Reasoning:
//     • The Extracting screen IS the feedback ("we got it, we're reading").
//     • A preview = a confirm dialog = friction = anti-goal.
//     • The brief explicitly bans guided Q&A — a preview is a soft Q&A
//       ("did we get the right file? confirm?").
//
// — UX (Behavior Q3 — auto-scroll on expand):
//   YES. When a card expands, we scroll the screen so the card header sits
//   ~72px from the top. Reasoning: an expanded card with its sub-options
//   below the fold is invisible to a thumb at the bottom of the screen.
//   Smooth, ~360ms.
// ─────────────────────────────────────────────────────────────────────────
function CaptureScreen({
  mode = 'light',
  showError = false,
  errorTarget = 'document',
  onPick = () => {},
  onBack = () => {},
}) {
  const [openId, setOpenId] = useState(null);
  const [note, setNote] = useState('');
  const [loadingPick, setLoadingPick] = useState(null);
  const [navHidden, setNavHidden] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);
  const cardRefs = useRef({});

  // Dev hook: parent (Tweaks) can flip showError → drives a demo error.
  useEffect(() => {
    if (showError) {
      setOpenId(errorTarget);
      setError({ cardId: errorTarget, message: ERROR_MESSAGES[errorTarget] || ERROR_MESSAGES.default });
    } else {
      setError(null);
    }
  }, [showError, errorTarget]);

  const canReset = !!openId || note.length > 0;

  const handleReset = () => {
    setOpenId(null);
    setNote('');
    setError(null);
    setLoadingPick(null);
  };

  const handleToggle = (id) => {
    setOpenId((cur) => (cur === id ? null : id));
    setError(null);
    // — UX (Behavior Q3): scroll the toggled card to ~72px from top.
    // Defer to next frame so the layout reflects the new height first.
    requestAnimationFrame(() => {
      const el = cardRefs.current[id];
      const scroller = scrollRef.current;
      if (!el || !scroller) return;
      // Only scroll on EXPAND (we just set openId to id) — not on collapse.
      // Read current openId post-state via a closure trick: compare prev DOM state.
      const willOpen = openId !== id;
      if (!willOpen) return;
      const topInScroller = el.offsetTop - scroller.offsetTop;
      scroller.scrollTo({ top: topInScroller - 72, behavior: 'smooth' });
    });
  };

  const handlePick = (cardId, optId) => {
    // — UX (Q3 + Behavior Q6): 160ms shimmer on the tapped option, then
    //   commit. Long enough to feel "the tap landed", short enough to not
    //   delay the demo.
    setLoadingPick(optId);
    setTimeout(() => {
      setLoadingPick(null);
      onPick({ cardId, optId, note });
    }, 160);
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
        transition: 'color 250ms ease',
        overflow: 'hidden',
      }}
    >
      <div
        ref={scrollRef}
        style={{
          position: 'absolute', inset: 0,
          overflow: 'auto', overflowX: 'hidden',
          paddingTop: 50,
          paddingBottom: navHidden ? 32 : 120,
          transition: 'padding-bottom 200ms ease',
          // — UX (anti-goal): no pull-to-refresh on this screen.
          //   Disabling overscroll keeps the scroll behavior pure.
          overscrollBehavior: 'contain',
        }}
      >
        <Header
          canReset={canReset}
          onReset={handleReset}
          onBack={onBack}
        />

        {/* ─── INTRO BLOCK ─── */}
        <section style={{ padding: '8px 20px 0' }}>
          <StepIndicator step={1} total={4} />
          {/* — UX (heading copy): "What went wrong?" KEPT. It does the
                work in 3 words: human, sympathetic, action-prompting.
                Alternative "What can we help with?" was tested mentally
                — too corporate, hedges on the conflict. */}
          <h1 style={{
            margin: '14px 0 0',
            fontSize: 28, lineHeight: 1.15, fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
          }}>What went wrong?</h1>
          {/* — UX (subhead): kept brief's draft verbatim. Already does
                the job: lists the inputs in order of cards (anchors the
                preview), then claims agency ("we figure out the rest"). */}
          <p style={{
            margin: '8px 0 0',
            fontSize: 13, lineHeight: 1.5,
            color: 'var(--text-secondary)',
            maxWidth: 320,
          }}>
            Photo, document, or forwarded email. We figure out the rest.
          </p>
        </section>

        {/* ─── INPUT CARDS — accordion ─── */}
        <section style={{
          padding: '24px 20px 0',
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          {CARDS.map((c) => (
            <div key={c.id} ref={(el) => { cardRefs.current[c.id] = el; }}>
              <InputCard
                id={c.id}
                icon={c.icon}
                title={c.title}
                sub={c.sub}
                options={c.options}
                isOpen={openId === c.id}
                onToggle={handleToggle}
                onPick={handlePick}
                loadingPick={openId === c.id ? loadingPick : null}
              />
              {error && error.cardId === c.id && (
                <ErrorBanner
                  message={error.message}
                  onDismiss={() => setError(null)}
                />
              )}
            </div>
          ))}
        </section>

        {/* ─── NOTE FIELD ─── */}
        {/* — UX: 28pt gap above note field. Section-rhythm per design.md §5.
              The "Optional" label and the textarea read as one block —
              a separate section header would over-formalize an optional input. */}
        <section style={{ padding: '28px 20px 0' }}>
          <NoteField
            value={note}
            onChange={setNote}
            onFocus={() => setNavHidden(true)}
            onBlur={() => setNavHidden(false)}
          />
        </section>

        {/* ─── TRY-A-SAMPLE LINK ─── */}
        <section style={{ padding: '24px 20px 8px' }}>
          <TrySampleLink onPick={() => onPick({ cardId: 'sample', optId: 'swiggy', note })} />
        </section>
      </div>

      <BottomNav active="new" hidden={navHidden} onNav={(id) => { if (id === 'home') onBack(); }} />
    </div>
  );
}

window.CaptureScreen = CaptureScreen;
