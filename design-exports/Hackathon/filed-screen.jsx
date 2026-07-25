// ─────────────────────────────────────────────────────────────────────────
// filed-screen.jsx — Resolved · Screen 6 (Filed + Escalation Ladder)
// Visual system: /design.md (mirrored in tokens.css). Zero hex in this file.
//
// READ FIRST — UX rationale comments are tagged // — UX:
// The escalation ladder is the hero; everything around it must be quieter.
// ─────────────────────────────────────────────────────────────────────────

const { useState, useEffect, useRef } = React;

// ─────────────────────────────────────────────────────────────────────────
// Header — wordmark + "Done" link.
// — UX (Behavior Q1): "Done" → Home. We're past the input phase; there
//   is no "Reset" here (nothing to discard). The header link's job is
//   pure exit-with-confidence: the user has filed; we let them leave.
// — Microcopy locked: "Done". Considered "Back to home" — too long, and
//   "Done" carries finality ("I'm done; the system isn't").
// ─────────────────────────────────────────────────────────────────────────
function FiledHeader({ onDone }) {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '8px 16px 12px', position: 'relative', zIndex: 2,
    }}>
      {/* Left side empty — no back chevron per anti-goals. The only escape
          is "Done" (right). Bottom nav is the other path. */}
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

// ─────────────────────────────────────────────────────────────────────────
// SmallOrb — 60pt static-with-pulse celebration mark.
// — UX (Q1 — celebration intensity):
//   PICK: (a) subtle orb pulse + small green "Filed" chip.
//   Reasoning:
//     • (b) confetti is a category mismatch — this is a legal-adjacent
//       product. Confetti reads as "you won a coupon!", which trivializes
//       the gravity of filing a real complaint.
//     • (c) zero animation reads as "did the file go through?". The user
//       needs some visual confirmation beyond text.
//     • (a) "confident exhale" — slow 2.4s pulse, green chip, that's it.
//       Reads as "the machinery is running" instead of "look at me!"
// ─────────────────────────────────────────────────────────────────────────
function SmallOrb({ size = 60 }) {
  return (
    <div aria-hidden style={{
      width: size, height: size, position: 'relative', flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute', inset: -size * 0.35, borderRadius: '50%',
        background: 'var(--gradient-hero)',
        filter: `blur(${size * 0.22}px)`,
        opacity: 0.55,
        // — UX: 2.4s breathing cadence — slow enough to feel calm, not
        //   needy. Per brief: confident exhale, not fireworks.
        animation: 'orbPulse 2.4s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: 'var(--gradient-hero)',
        boxShadow: '0 8px 28px var(--accent-saffron-border)',
      }}>
        <div style={{
          position: 'absolute', inset: '8% 40% 50% 8%', borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.55), transparent 65%)',
        }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// FiledChip — small green "✓ Filed" pill.
// — UX (microcopy): "✓ Filed". Two beats — the checkmark IS half the
//   message; "Done filing" / "Filed successfully" pad the air. The check
//   is rendered inside the chip (not as an emoji prefix to a label) so it
//   tints with --success in both modes.
// ─────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────
// CaseHeader — orb + chip + heading + subhead.
// — UX (Q2 — Case ID styling):
//   PICK: (a) saffron-to-gold gradient text-clip on the case number.
//   Reasoning:
//     • (b) solid --text-primary is cleaner but too quiet — the case ID
//       is the only literal hook the user has to refer back to this case
//       in conversation with a vendor. It deserves visual weight.
//     • (c) "case chip" container would duplicate the Filed chip 24px
//       above it — two chips in a row reads as redundant.
//     • (a) the gradient lives in our brand vocabulary already (Home
//       hero, Strategy forecast). Using it here makes "Case #RV-00214"
//       read as a brand artifact — like a serial number, not a string.
//   Only the # number portion gets the gradient. The word "Case " stays
//   solid so the gradient highlights the unique ID, not the noun.
// — UX (subhead template):
//   `Opened at {vendor} {time-natural}`. Time-natural switches to
//   absolute date after 24h. For first-load demo, "just now".
// ─────────────────────────────────────────────────────────────────────────
function CaseHeader({ caseId = 'RV-00214', vendor = 'Swiggy', timeNatural = 'just now' }) {
  return (
    <section style={{
      padding: '12px 20px 0',
      display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
      gap: 14,
    }}>
      <SmallOrb size={60} />

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

// ─────────────────────────────────────────────────────────────────────────
// LadderStep — one rung of the escalation ladder.
// — UX (Q3 — node states):
//   PICK: (b) visually different states. Three states:
//     • completed = filled saffron disc with check, solid saffron ring.
//     • next      = outlined saffron, slightly thicker ring (2.5px).
//     • pending   = outlined --border-strong, thin ring (1.5px).
//   Rejected (a) all-identical: the user needs to know what's
//   "imminent" vs "far". Otherwise the ladder feels like a list of facts.
//   Rejected (c) severity color-coding: implies court = "dangerous" /
//   tweet = "safe". This anti-frames the product — the AI works
//   regardless of escalation level; the user shouldn't be scared of step 5.
//
// — UX (Q5 — connector visualization):
//   PICK: (c) solid above completed, dotted below.
//   Reasoning: past is solid (it happened), future is provisional (it
//   may not be needed if the vendor responds early). Visually narrates
//   the "we'll do this IF" semantics without writing a paragraph.
//
// — UX (Q4 — step tap behavior):
//   PICK: (a) all rows tappable, accordion expand below the row.
//     • Completed row: shows "Submitted at HH:MM with N photos. Vendor
//       has 24h to respond." — real data.
//     • Pending row: shows "Here's what we'd do if the vendor doesn't
//       respond by HH:MM" + the specific play.
//   The brief gave option (b) "only completed tappable" but that's a
//   missed teaching moment — judges who tap a pending step learn the
//   product's mechanic in one tap.
// ─────────────────────────────────────────────────────────────────────────
function LadderStep({
  state,           // 'completed' | 'next' | 'pending'
  timestamp,
  label,
  detail,
  isFirst, isLast,
  isOpen, onToggle,
}) {
  const isCompleted = state === 'completed';
  const isNext = state === 'next';

  // Node visual config — drives the dot + connector tints
  const nodeRing = isCompleted ? 'var(--accent-saffron)'
                 : isNext      ? 'var(--accent-saffron)'
                               : 'var(--border-strong)';
  const nodeFill = isCompleted ? 'var(--accent-saffron)' : 'transparent';
  const nodeBorderW = isNext ? 2.5 : isCompleted ? 0 : 1.5;

  // Connector segments. The connector ABOVE this node runs from previous.
  // Connector BELOW this node runs down. The brief's "(c)" rule says:
  //   • solid above completed = past
  //   • dotted below completed = future
  // Implementation: the connector segment LEAVING a node is solid if that
  // node is completed; dotted otherwise.
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
      {/* Left rail — node + connector */}
      <div style={{
        position: 'relative',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        {/* Connector above — only if not first */}
        {!isFirst && (
          <div style={{
            position: 'absolute', top: 0, bottom: 'calc(100% - 8px)',
            // Connector ABOVE this node = solid if THIS node is completed
            // (the past leg that arrived here) OR if THIS is next (the
            // segment from the completed node above is solid because
            // that one is completed).
            // Simpler model: connector ABOVE node = solid if the previous
            // node was completed. We approximate by using `isNext` —
            // because in our 5-step model, "next" is always preceded by
            // "completed". This pattern stays robust as long as we keep
            // one completed-and-next pair.
            ...(isCompleted || isNext
              ? { borderLeft: '2px solid var(--accent-saffron)' }
              : { borderLeft: '2px dashed var(--border-strong)' }),
            width: 0,
          }} />
        )}

        {/* Node dot */}
        <div style={{
          position: 'relative', zIndex: 2,
          width: 18, height: 18, borderRadius: '50%',
          background: nodeFill,
          border: `${nodeBorderW}px solid ${nodeRing}`,
          boxSizing: 'border-box',
          marginTop: isFirst ? 0 : 8,
          display: 'grid', placeItems: 'center',
          // Subtle glow on "next" so the eye lands there after sweeping
          // the completed step. Tiny — not a notification beacon.
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

        {/* Connector below — only if not last */}
        {!isLast && (
          <div style={{
            flex: 1,
            ...connectorBelowStyle,
            width: 0,
            marginTop: 4,
          }} />
        )}
      </div>

      {/* Right content */}
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
        {/* Timestamp + tiny chevron */}
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

        {/* Label */}
        <div style={{
          marginTop: 4,
          fontSize: 14.5, lineHeight: 1.35, fontWeight: 600,
          letterSpacing: '-0.015em',
          color: isCompleted || isNext ? 'var(--text-primary)' : 'var(--text-secondary)',
        }}>{label}</div>

        {/* Expanded detail — accordion */}
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

// ─────────────────────────────────────────────────────────────────────────
// LadderSectionLabel — small caption above the ladder.
// — UX (microcopy):
//   PICK: "THE ESCALATION LADDER".
//   Reasoning:
//     • "OUR NEXT MOVES" is warmer but generic; doesn't name proprietary
//       IP.
//     • "WHAT HAPPENS NEXT" is the most boring option — it reads like
//       a FAQ header.
//     • "ESCALATION PLAN" is fine but flatter than "LADDER" — ladder
//       carries the metaphor that each step climbs in seriousness, which
//       is exactly the product's thesis ("we don't stop at one channel").
//   "THE" (vs no article): names the product feature, not just any
//   ladder. Reads as a proprietary noun.
// ─────────────────────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 10.5, fontWeight: 700,
      letterSpacing: '0.16em', textTransform: 'uppercase',
      color: 'var(--text-tertiary)',
    }}>{children}</div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SaffronCallout — "You do nothing." promise box.
// — UX (Q6 — placement):
//   PICK: (a) between ladder and CTA.
//   Reasoning:
//     • (b) above-the-ladder leads with the promise before showing the
//       work — like a salesman opening with "trust me!". The ladder IS
//       the evidence; the callout is the conclusion drawn FROM it.
//     • (c) integrated-as-label loses prominence and reads like a
//       footnote on step 5.
//     • (a) sequence: see the work → read the promise → tap the CTA.
//       That's an honest narrative.
//
// — UX (microcopy — the most important emotional line on this screen):
//   ALTERNATIVES CONSIDERED:
//     0. (brief draft) "You do nothing. We watch for the reply and trigger
//        the next step automatically." — 16 words.
//     1. "You're off the clock. We watch the reply window — and execute
//        the next step the second it lapses." — 19 words. "Off the clock"
//        is jargon; "execute" / "lapses" leak legal-tech vocabulary.
//     2. "Sit back. We watch the inbox and fire the next step the
//        moment it's due." — 15 words. "Sit back" is too casual; this is
//        a legal product, not a binge-watch app.
//
//   PICK: a tightened version of brief's draft —
//     "You do nothing. We watch for replies and fire the next step the
//     moment it's due." (17 words)
//
//   Sharpening notes:
//     • "for the reply" → "for replies" (plural · covers escalations).
//     • "trigger the next step automatically" → "fire the next step the
//        moment it's due" — "fire" is action-verb gravity; "the moment
//        it's due" is concrete (a clock event) where "automatically" is
//        a tech word that can read as "machine without supervision".
//     • Kept "You do nothing." as the lead sentence — three syllables,
//       absolute, brand-defining. The whole product is in that sentence.
// ─────────────────────────────────────────────────────────────────────────
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
      {/* Bolt glyph — left-anchored, saffron tint */}
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

// ─────────────────────────────────────────────────────────────────────────
// PrimaryCTA + SecondaryLink — bottom action zone.
// — UX (Q7 — primary CTA):
//   PICK: (a) "See all my cases".
//   Reasoning:
//     • (b) "Done" / (c) "Back to home" sends the user out of the
//       product story prematurely. The natural next thing post-filing
//       is to see this case in context with their others — that's the
//       dashboard.
//     • For the demo, "See all my cases" is the bridge to Screen 7 if
//       it exists; for the prototype, it routes to Home (which has the
//       case strip for returning users).
//   Trailing arrow ✓ — forward-nav signal.
//
// — UX (Q8 — secondary):
//   PICK: (a) "Or file another complaint" text link.
//   Reasoning:
//     • (b) "Share my case" is a mock-feature anti-goal.
//     • (c) "no secondary" leaves the user with one path — fine in
//       theory, but power users (who just filed and have another beef)
//       have a real second intent. Naming it costs nothing.
//   "Or" prefix is the iOS convention for "alternate path" sub-links.
// ─────────────────────────────────────────────────────────────────────────
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
      <span style={{
        opacity: loading ? 0 : 1,
        transition: 'opacity 200ms ease',
      }}>See all my cases</span>
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

// ─────────────────────────────────────────────────────────────────────────
// BottomNav — minimal. Same family as the other screens. Cases tab is the
// destination of the primary CTA, so we keep it as the visually-leading
// nav target by giving it the same saffron-soft active treatment when
// the user has "just filed" (subtle attention).
// ─────────────────────────────────────────────────────────────────────────
function FiledBottomNav({ active = 'cases', onNav = () => {} }) {
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
// STEPS — the Swiggy escalation ladder.
// — UX (Behavior Q5 — vendor-aware): hardcoded Swiggy ladder for the
//   prototype. In production this is vendor-driven: IndiGo's ladder
//   ends at DGCA, HDFC's at RBI Banking Ombudsman. The 5-step shape
//   stays constant; the rungs change.
//
// — UX (step labels — locked, lifted from brief, lightly sharpened):
//   1: "Complaint filed in-app"          — past tense
//   2: "Auto-escalate to @SwiggyCares"    — vendor-handle visible
//   3: "Email Grievance Officer"          — formal step
//   4: "File at NCH"                      — regulator
//   5: "Draft e-Daakhil filing"           — Commission-level
//   Each label is 3-5 words; the "@" prefix on step 2 makes the
//   social-channel medium visible at a glance.
//
// — UX (timestamps): "Today, 9:51 PM" / "Tomorrow, 9:51 PM" for near-
//   term, absolute dates for far-term. Brief said natural for near,
//   date for far — followed.
//
// — UX (step detail copy — 12-15 words each):
//   Each detail starts with a verb describing what fires and ends with
//   a concrete next-trigger condition. Together they teach the user
//   the autonomous machinery in 5 sentences.
// ─────────────────────────────────────────────────────────────────────────
const STEPS = [
  {
    state: 'completed',
    timestamp: 'Today, 9:51 PM',
    label: 'Complaint filed in-app',
    detail: 'Submitted via Swiggy\'s in-app form with photos, policy citation, and your refund ask. Vendor has 24h to respond.',
  },
  {
    state: 'next',
    timestamp: 'Tomorrow, 9:51 PM',
    label: 'Auto-escalate to @SwiggyCares',
    detail: 'If silence, we post a public tweet tagging the vendor handle and citing their own Damaged Item Policy.',
  },
  {
    state: 'pending',
    timestamp: 'May 30',
    label: 'Email Grievance Officer',
    detail: 'Direct email to Swiggy\'s registered Grievance Officer with full case file and a 7-day response deadline.',
  },
  {
    state: 'pending',
    timestamp: 'June 6',
    label: 'File at NCH',
    detail: 'Formal complaint to the National Consumer Helpline under Consumer Protection Act, 2019 §47 — referenced and timestamped.',
  },
  {
    state: 'pending',
    timestamp: 'June 13',
    label: 'Draft e-Daakhil filing',
    detail: 'Commission-level filing prepared for one-tap submission — admissible evidence and prior-step audit trail attached.',
  },
];

// ─────────────────────────────────────────────────────────────────────────
// FiledScreen — top-level orchestrator.
// — UX (Behavior Q2 — scroll on land):
//   TOP-OF-PAGE. No scroll-snap. The ladder is the hero but the
//   celebration moment (orb + Filed chip + Case ID) is the entry beat;
//   stealing that with a scroll would invert the narrative.
//   The ladder's first step (completed) IS visible above the fold on
//   typical phone heights — brief's "make sure ladder is partly visible
//   above the fold to encourage scroll" is met by the layout, not by
//   scroll engineering.
// ─────────────────────────────────────────────────────────────────────────
function FiledScreen({
  mode = 'light',
  caseId = 'RV-00214',
  vendor = 'Swiggy',
  onDone = () => {},
  onSeeCases = () => {},
  onFileAnother = () => {},
}) {
  // Accordion state — at most one row open at a time. Default closed so
  // the ladder reads as a clean list on first glance.
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
        <FiledHeader onDone={onDone} />

        <CaseHeader caseId={caseId} vendor={vendor} timeNatural="just now" />

        {/* ─── Escalation ladder ─── */}
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

        {/* ─── Saffron callout — placed AFTER the ladder per Q6 pick ─── */}
        <section style={{ padding: '4px 20px 0' }}>
          <SaffronCallout />
        </section>

        {/* ─── Action zone ─── */}
        <section style={{ padding: '24px 20px 0' }}>
          <PrimaryCTA onClick={onSeeCases} />
          <SecondaryLink onClick={onFileAnother} />
        </section>
      </div>

      <FiledBottomNav active="cases" onNav={(id) => {
        if (id === 'home') onDone();
      }} />
    </div>
  );
}

window.FiledScreen = FiledScreen;
