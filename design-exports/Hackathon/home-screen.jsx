// ─────────────────────────────────────────────────────────────────────────
// home-screen.jsx — Resolved · Home (per /design.md)
//
// READ FIRST — UX rationale comments are tagged `// — UX:`
// Search for "UX:" to audit every interaction / hierarchy / copy decision.
//
// Token discipline: zero hex in this file. Everything is var(--…) from
// tokens.css (which mirrors design.md §3 exactly).
// ─────────────────────────────────────────────────────────────────────────

const { useState, useEffect, useRef } = React;

// ─────────────────────────────────────────────────────────────────────────
// Aurora — dark-mode only. Per design.md §3, light mode is intentionally
// the cream paper base with no aurora.
// — UX (scroll behavior, brief Q7): aurora parallaxes at 0.15× scroll.
//   Subtle is the whole point — overdrive turns "premium" into "noisy".
// ─────────────────────────────────────────────────────────────────────────
function Aurora({ scrollY = 0 }) {
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const dy = reduce ? 0 : Math.min(scrollY * 0.15, 60);
  return (
    <div aria-hidden style={{
      position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden',
      pointerEvents: 'none',
    }}>
      <div style={{
        position: 'absolute', inset: -60,
        transform: `translate3d(0, ${-dy}px, 0)`,
        animation: reduce ? 'none' : 'auroraDrift 22s ease-in-out infinite alternate',
      }}>
        <div style={{
          position: 'absolute', top: '-10%', left: '-10%',
          width: '70%', height: '60%',
          background: 'var(--aurora-1)',
          filter: 'blur(60px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '-15%',
          width: '70%', height: '55%',
          background: 'var(--aurora-2)',
          filter: 'blur(60px)',
        }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Orb — radial gradient circle with soft outer glow + pulse.
// Used as pull-to-refresh cue here (sm size). Per design.md §3 component
// spec, real sizes are 80 / 120 / 180. We use ~32–60 only for the loading
// hint; the 180 hero orb belongs to the Extracting screen, not Home.
// ─────────────────────────────────────────────────────────────────────────
function Orb({ size = 56 }) {
  return (
    <div aria-hidden style={{
      width: size, height: size, position: 'relative', flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute', inset: -size * 0.35, borderRadius: '50%',
        background: 'var(--gradient-hero)',
        filter: `blur(${size * 0.22}px)`,
        opacity: 0.55,
        animation: 'orbPulse 2s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: 'var(--gradient-hero)',
        boxShadow: '0 4px 16px var(--accent-saffron-border)',
      }}>
        <div style={{
          position: 'absolute', inset: '8% 40% 50% 8%', borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.45), transparent 65%)',
        }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Header — wordmark + ModeToggle. Per design.md §7 shared shell.
// — UX (scroll behavior, brief Q7): header DOES NOT collapse on scroll.
//   The screen is short; a shrinking header is theatre that costs real
//   tap-target area for ~80px of scroll travel. Static is correct.
// ─────────────────────────────────────────────────────────────────────────
function Header({ mode, onToggleMode }) {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '8px 20px 12px',
      position: 'relative', zIndex: 2,
    }}>
      <span style={{
        fontSize: 18, fontWeight: 700, letterSpacing: '-0.025em',
        color: 'var(--text-primary)',
      }}>Resolved</span>

      {/* — UX (brief Q5 — ModeToggle placement): confirmed top-right,
            icon-only, 44×44 tap target (per a11y spec §12: min 44×44).
            Icon-only is correct because mode preference is binary and
            visually obvious; a label would consume header width that
            the wordmark deserves. */}
      <ModeToggle mode={mode} onToggle={onToggleMode} />
    </header>
  );
}

function ModeToggle({ mode, onToggle }) {
  const isDark = mode === 'dark';
  return (
    <button
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        // 44×44 tap target with a visible 32-ish-px icon frame inside.
        width: 44, height: 44, padding: 0,
        background: 'transparent', border: 'none', cursor: 'pointer',
        borderRadius: 999, display: 'grid', placeItems: 'center',
        color: 'var(--text-secondary)',
        transition: 'color 200ms ease, background 200ms ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-saffron)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
    >
      {isDark ? (
        // sun
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="1.8"
             strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        // moon
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="1.8"
             strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        </svg>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// EyebrowChip — pill, saffron-soft bg + saffron border + caption type.
// Per design.md §6 component spec.
// — UX (brief microcopy): "AI Consumer Agent" sharpened to "Consumer advocate".
//   Rationale: the headline already says "AI" twice in 6 words — eyebrow
//   shouldn't echo it. "Advocate" names a role the user can grasp in 200ms
//   (someone on YOUR side), where "Agent" reads ambiguously (bot? broker?).
// ─────────────────────────────────────────────────────────────────────────
function EyebrowChip({ children, variant = 'saffron' }) {
  const palette = variant === 'success'
    ? { bg: 'var(--success-soft)', border: 'var(--success)', color: 'var(--success)' }
    : { bg: 'var(--accent-saffron-soft)', border: 'var(--accent-saffron-border)', color: 'var(--accent-saffron)' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '6px 12px', borderRadius: 999,
      background: palette.bg,
      border: `1px solid ${palette.border}`,
      color: palette.color,
      fontSize: 10.5, fontWeight: 600,
      letterSpacing: '0.1em', textTransform: 'uppercase',
    }}>
      <span style={{
        width: 5, height: 5, borderRadius: '50%',
        background: 'var(--gradient-hero)',
      }} />
      {children}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Hero — eyebrow → display headline → subhead. Tight, no decoration.
// — UX (above-the-fold flow, brief rule #1): brand → headline → CTA → stat.
//   Hero is exactly two semantic blocks (headline + subhead). Anything else
//   would push the CTA below the visual center.
// ─────────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{
      padding: '8px 20px 0', position: 'relative', zIndex: 2,
    }}>
      {/* — REFINE edit 2: removed the "Consumer advocate" eyebrow chip.
            The headline already carries positioning; the chip added a
            third stacked element above the fold for no new information. */}

      {/* — UX (microcopy — headline): kept verbatim per brief. The brief
            said "keep or improve" — this line IS the brand thesis from
            design.md §1 ("emotional core of the whole product"). Don't
            ship the founder's positioning line in someone else's words. */}
      <h1 style={{
        margin: '14px 0 0',
        fontSize: 40, lineHeight: 1.05, fontWeight: 700,
        letterSpacing: '-0.035em',
        color: 'var(--text-primary)',
      }}>
        They have AI.<br />
        {/* Per design.md §4 display rule: one accent phrase per hero,
            rendered via background-clip:text. */}
        <span style={{
          background: 'var(--gradient-hero-text)',
          WebkitBackgroundClip: 'text', backgroundClip: 'text',
          color: 'transparent',
          // Italic was a flourish in v1; spec only requires the gradient.
          // Removed italic — the gradient alone carries the emphasis and
          // italic on a 40px display feels like marketing-page swagger.
        }}>Now you do too.</span>
      </h1>

      {/* — REFINE edit 1: subhead is now format-agnostic. "Drop the
            evidence" covers photo / document / email (the screen accepts
            all three) and reframes the brand toward case-building, where
            "Drop a screenshot" named only one input type. 6 words. */}
      <p style={{
        margin: '16px 0 0',
        fontSize: 15, lineHeight: 1.55, letterSpacing: '-0.01em',
        color: 'var(--text-secondary)',
        maxWidth: 360,
      }}>
        Drop the evidence. We do the rest.
      </p>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// GradientButton — primary CTA. design.md §6 component spec.
// — UX (brief Q1 — CTA specs):
//     • Height 56pt — top of the 52–56 range per spec. Mobile thumb-zone
//       wants the bigger target; ~7mm physical is the sweet spot.
//     • Edge padding 20pt — matches screen horizontal padding (§5) so the
//       button feels "edge-to-content" not "inset within content".
//     • Shadow: --glow-cta (saffron 35–45% opacity, 8/24 offset/blur per
//       spec). On hover grows; on press shrinks with scale(0.98).
//     • Icon placement: INSIDE the label, leading (20px, gap 8). Outside
//       icons turn a CTA into a "feature row with a trailing arrow" —
//       breaks the visual-anchor identity. Icon is `plus`, not arrow:
//       arrow implies "forward in a flow", plus implies "create a thing"
//       — which is what "New complaint" actually is.
// ─────────────────────────────────────────────────────────────────────────
function GradientButton({ children, onClick, icon = 'plus' }) {
  const [pressed, setPressed] = useState(false);
  const [hover, setHover] = useState(false);

  const renderIcon = () => {
    if (icon === 'plus') {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2.4"
             strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    }
    return null;
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        height: 56, width: '100%',
        padding: '0 24px',
        borderRadius: 999, border: 'none', cursor: 'pointer',
        background: 'var(--gradient-hero)',
        color: 'var(--on-accent)',
        fontFamily: 'inherit',
        fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        boxShadow: pressed
          ? '0 2px 8px var(--accent-saffron-border)'
          : (hover ? 'var(--glow-cta-hover)' : 'var(--glow-cta)'),
        transform: pressed ? 'scale(0.98)' : 'scale(1)',
        filter: hover && !pressed ? 'brightness(1.05)' : 'none',
        transition: 'transform 100ms ease-out, box-shadow 200ms ease, filter 200ms ease',
      }}>
      {renderIcon()}
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// StatCard — community stats (₹91,208 recovered · 78% win rate).
// — UX (brief Q2 — affordance):
//     TAPPABLE → opens Cases tab. Affordance signals on mobile:
//       (a) a tiny chevron in the corner (visual hint, no label clutter);
//       (b) the card scales to 0.99 + bg shifts to --bg-elevated on press
//           (Card press spec, design.md §6 CaseCard); this confirms the tap.
//     Whole-card tappability is the iOS Health/Apple Fitness pattern for
//     stat tiles. We DO NOT make this a second filled button — that would
//     break rule #1 ("CTA must be the visual centerpiece").
//
// — UX (brief Q3 — empty state):
//     The stat card is community-level by design (per design.md §7.1),
//     so it works identically for new users without ever showing ₹0.
//     Subtext clarifies framing: "across the Resolved community" for
//     first-timers, "across 240 cases" for returning users. Both feel
//     confident; neither is deceptive. The brand never says "₹0".
// ─────────────────────────────────────────────────────────────────────────
function StatCard({ userState, loading, onPress }) {
  // — REFINE edit 3: the stat card is demoted from an interactive card to
  //   a quiet inline proof strip. Removed: chevron (no card-level tap),
  //   vertical divider, both subtexts, the surface background. Added a
  //   hairline above + below at ~60% border opacity so it reads as
  //   "context", not "a thing you tap". The two metrics now float on the
  //   page background.
  // — Kept the gradient ₹ value (brand anchor) + the "Recovered" label.
  return (
    <div
      style={{
        width: '100%',
        padding: '16px 0',
        // ~60% of the standard border opacity → feels inline, not framed.
        borderTop: '1px solid color-mix(in srgb, var(--border) 60%, transparent)',
        borderBottom: '1px solid color-mix(in srgb, var(--border) 60%, transparent)',
        color: 'var(--text-primary)',
        position: 'relative',
      }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 18, alignItems: 'start',
      }}>
        <Metric
          label="Recovered"
          value="₹91,208"
          gradient
          loading={loading}
        />
        <Metric
          label="Win rate"
          value="78%"
          loading={loading}
        />
      </div>
    </div>
  );
}

function Metric({ label, value, sub, gradient, loading }) {
  return (
    <div>
      <div style={{
        fontSize: 10.5, fontWeight: 600,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: 'var(--text-secondary)',
      }}>{label}</div>
      {loading ? (
        <div style={{
          marginTop: 8, height: 30, width: '80%', borderRadius: 6,
          background: 'linear-gradient(90deg, var(--bg-elevated), var(--border), var(--bg-elevated))',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.4s linear infinite',
        }} />
      ) : (
        <div style={{
          marginTop: 6,
          fontSize: 28, fontWeight: 700,
          letterSpacing: '-0.025em', lineHeight: 1.05,
          fontVariantNumeric: 'tabular-nums',
          color: gradient ? 'transparent' : 'var(--text-primary)',
          ...(gradient ? {
            background: 'var(--gradient-hero-text)',
            WebkitBackgroundClip: 'text', backgroundClip: 'text',
          } : {}),
        }}>{value}</div>
      )}
      {/* sub intentionally omitted post-refine; kept the prop so callers
          that still pass it don't break, but Home no longer renders it. */}
      {sub && (
        <div style={{
          marginTop: 6,
          fontSize: 12, lineHeight: 1.4,
          color: 'var(--text-tertiary)',
        }}>{sub}</div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// FeatureCard — design.md §6.
// — UX (brief microcopy): titles + subtitles taken verbatim from the brief
//   ("50+ vendor playbooks", etc.). They already meet the rules.
// — CRITICAL: the "India legal RAG" card MUST use --accent-trust (lavender
//   in dark, blue in light), not saffron. This is the brand storytelling
//   moment — citizen energy meets legal authority (design.md §2, §6).
// ─────────────────────────────────────────────────────────────────────────
function FeatureCard({ icon, title, sub, variant = 'saffron' }) {
  const tokens = variant === 'trust' ? {
    iconBg: 'var(--accent-trust-soft)',
    iconBorder: 'var(--accent-trust-border)',
    iconColor: 'var(--accent-trust)',
  } : {
    iconBg: 'var(--accent-saffron-soft)',
    iconBorder: 'var(--accent-saffron-border)',
    iconColor: 'var(--accent-saffron)',
  };
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: 16, borderRadius: 16,
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
    }}>
      {/* — REFINE edit 5: icon container shrunk 44 → 28 (and inner SVG
            22 → 16). Feature icons are support elements, not heroes. */}
      <div style={{
        width: 28, height: 28, borderRadius: 9, flexShrink: 0,
        background: tokens.iconBg,
        border: `1px solid ${tokens.iconBorder}`,
        color: tokens.iconColor,
        display: 'grid', placeItems: 'center',
      }}>{icon}</div>
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontSize: 16, fontWeight: 600,
          letterSpacing: '-0.02em', lineHeight: 1.2,
          color: 'var(--text-primary)',
        }}>{title}</div>
        <div style={{
          marginTop: 4,
          fontSize: 12.5, lineHeight: 1.5,
          color: 'var(--text-secondary)',
        }}>{sub}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// BottomNav — fixed glass, safe-area inset respected.
// — UX (brief Q4 — active-case nudge): DOT BADGE on the Cases tab. Chosen
//   over an inline banner above the CTA because a banner literally
//   contradicts rule #1 (CTA must be the visual centerpiece, vertically
//   near the middle) — pushing the CTA down to make room for a banner
//   demotes it to "another feature row". The Cases-tab dot is:
//     • one tap away (thumb-zone)
//     • impossible to miss (saffron on a dim icon)
//     • doesn't compete for vertical space against the CTA
//     • already the place a returning user's muscle memory goes
//   For urgency (<24h to auto-escalate) the dot pulses; copy lives on the
//   Cases screen itself, not on Home.
// — UX: also includes a small filed-cases COUNT next to the badge for
//   returning users — quantifies "stuff is happening" without text noise.
// ─────────────────────────────────────────────────────────────────────────
function BottomNav({ active = 'home', notifyCases = false, urgent = false, caseCount = 0 }) {
  const items = [
    { id: 'home',    label: 'Home',    icon: (
      <path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />
    ) },
    { id: 'cases',   label: 'Cases',   icon: (
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
      // safe-area inset respected (iOS home indicator is at ~34px)
      left: 16, right: 16, bottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)',
      height: 64, borderRadius: 20, zIndex: 30,
      // 85% surface + 20px blur per design.md §6 BottomNav spec
      background: 'color-mix(in srgb, var(--bg-elevated) 85%, transparent)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid var(--border)',
      boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      padding: '0 8px',
    }}>
      {items.map((it) => {
        const isActive = it.id === active;
        const showBadge = it.id === 'cases' && notifyCases;
        return (
          <button key={it.id} style={{
            background: isActive ? 'var(--accent-saffron-soft)' : 'transparent',
            border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 3, padding: '8px 18px', position: 'relative',
            borderRadius: 14,
            color: isActive ? 'var(--accent-saffron)' : 'var(--text-tertiary)',
            // Tap target 44 high minimum
            minHeight: 44, minWidth: 64,
          }}>
            <div style={{ position: 'relative', width: 24, height: 24 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="1.8"
                   strokeLinecap="round" strokeLinejoin="round">
                {it.icon}
              </svg>
              {showBadge && (
                <span aria-label={`${caseCount} active`} style={{
                  position: 'absolute', top: -3, right: -6,
                  minWidth: 16, height: 16, padding: '0 4px',
                  borderRadius: 999,
                  background: 'var(--accent-saffron)',
                  color: 'var(--on-accent)',
                  fontSize: 9.5, fontWeight: 700,
                  display: 'grid', placeItems: 'center',
                  border: '2px solid var(--bg-elevated)',
                  boxShadow: '0 2px 8px var(--accent-saffron-border)',
                  animation: urgent ? 'pulseDot 1.4s ease-in-out infinite' : 'none',
                  lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums',
                }}>{caseCount > 0 ? caseCount : ''}</span>
              )}
            </div>
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
// PullCue — orb appears as the user pulls down. Per design.md §3, the orb
// IS the brand mark; reusing it as the refresh affordance ties the gesture
// to the product identity (not a generic spinner).
// — UX (brief Q6): yes, pull-to-refresh exists. It refreshes the stat card
//   (community numbers update as cases close) AND any active-case status.
//   Static stats on a "live legal advocate" product would feel dead.
// ─────────────────────────────────────────────────────────────────────────
function PullCue({ progress }) {
  if (progress <= 0) return null;
  const opacity = Math.min(progress / 64, 1);
  const orbSize = 32 + Math.min(progress / 4, 16);
  return (
    <div aria-hidden style={{
      position: 'absolute', top: 56, left: 0, right: 0,
      display: 'grid', placeItems: 'center', pointerEvents: 'none',
      height: Math.min(progress, 80), zIndex: 1, opacity,
    }}>
      <Orb size={orbSize} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Feature icons — kept inline (line-style, currentColor) so they re-tint
// per variant from the parent FeatureCard.
// ─────────────────────────────────────────────────────────────────────────
const IconPlaybook = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="1.8"
       strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2Z" />
    <path d="M8 7h7M8 11h7" />
  </svg>
);
const IconLaw = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="1.8"
       strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v18M5 8h14M5 8l-2 6a4 4 0 0 0 8 0L9 8M19 8l-2 6a4 4 0 0 0 8 0L23 8" />
    <path d="M7 21h10" />
  </svg>
);
const IconFollowUp = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="1.8"
       strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <polyline points="3 4 3 10 9 10" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────
// HomeScreen — composes the whole screen.
// — UX (brief rule #1, above-the-fold order):
//     brand → headline → CTA → stat proof.   (feature cards below the fold)
// — UX (returning-user logic, brief 3 user types):
//     'first-time'        → no Cases-tab badge; stat subtext = "across the
//                            Resolved community" (no personal ₹0 ever)
//     'returning-idle'    → no Cases-tab badge; stat subtext = "users like
//                            you" (warmer, reflects membership)
//     'returning-active'  → Cases-tab badge appears with count; if any case
//                            is <24h from auto-escalation, badge pulses
// — UX (loading): only the stat values skeleton (1.0s). Static chrome
//   renders instantly so the screen never blanks.
// ─────────────────────────────────────────────────────────────────────────
function HomeScreen({ userState = 'first-time', mode = 'light', onToggleMode = () => {} }) {
  const [loading, setLoading] = useState(true);
  const [pull, setPull] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const scrollRef = useRef(null);
  const touchStart = useRef(null);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, [userState]);

  // Pull-to-refresh handlers
  const onScroll = (e) => setScrollY(e.target.scrollTop);
  const onTouchStart = (e) => {
    if (scrollRef.current && scrollRef.current.scrollTop <= 0) {
      touchStart.current = e.touches[0].clientY;
    }
  };
  const onTouchMove = (e) => {
    if (touchStart.current == null) return;
    const dy = e.touches[0].clientY - touchStart.current;
    if (dy > 0 && scrollRef.current.scrollTop <= 0) {
      setPull(Math.min(dy * 0.6, 100));
    }
  };
  const onTouchEnd = () => {
    if (pull > 64) {
      setLoading(true);
      setTimeout(() => setLoading(false), 800);
    }
    setPull(0);
    touchStart.current = null;
  };

  // Returning-user badge logic
  const notify = userState === 'returning-active';
  const caseCount = notify ? 1 : 0;
  const urgent = notify; // mock: the brief's "auto-escalates in 18h" scenario

  return (
    <div
      ref={scrollRef}
      onScroll={onScroll}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className={mode === 'dark' ? 'mode-dark' : 'mode-light'}
      style={{
        position: 'relative', width: '100%', height: '100%',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        overflow: 'auto', overflowX: 'hidden',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        WebkitFontSmoothing: 'antialiased',
        // Only animate `color` — `background` in the transition list
        // prevents var() from re-resolving on class swap (Chromium).
        transition: 'color 250ms ease',
      }}
    >
      <Aurora scrollY={scrollY} />
      <PullCue progress={pull} />

      {/* Top padding clears the iOS status bar (~54) + safe-area inset.
          Bottom padding clears the floating BottomNav. */}
      <div style={{
        paddingTop: 50,
        paddingBottom: 132,
        transform: pull ? `translateY(${pull}px)` : 'none',
        transition: pull ? 'none' : 'transform 220ms cubic-bezier(0.22,1,0.36,1)',
      }}>
        <Header mode={mode} onToggleMode={onToggleMode} />

        {/* ─── HERO BLOCK (above the fold) ─── */}
        <Hero />

        {/* ─── PRIMARY CTA (the visual anchor) ───
              UX: 24px gap above (per spec §5 section-gap rhythm), full-width
              minus 20px screen padding. The CTA SHOULD sit near the
              vertical middle of the viewport at this layout density. */}
        <section style={{ padding: '24px 20px 0', position: 'relative', zIndex: 2 }}>
          {/* — UX: tapping the CTA routes to Screen 2 (Capture). */}
          <GradientButton onClick={() => { window.location.href = 'Capture.html'; }} icon="plus">
            New complaint
          </GradientButton>
        </section>

        {/* ─── STAT PROOF (directly under CTA per brief rule #1) ─── */}
        <section style={{ padding: '20px 20px 0', position: 'relative', zIndex: 2 }}>
          <StatCard userState={userState} loading={loading} onPress={() => {}} />
        </section>

        {/* ─── SECTION LABEL ───
              REFINE edit 4: bumped top padding 32 → 44 so the demoted
              stat strip has room to breathe before the feature zone. */}
        <section style={{ padding: '44px 20px 12px', position: 'relative', zIndex: 2 }}>
          <div style={{
            fontSize: 10.5, fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--text-secondary)',
          }}>
            How we tip the scales
          </div>
        </section>

        {/* ─── FEATURE CARDS (below the fold by design) ───
              UX: scrolled into view, not above. Brief explicitly puts them
              below the fold so the CTA stays the anchor. */}
        <section style={{
          padding: '0 20px',
          position: 'relative', zIndex: 2,
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          <FeatureCard
            icon={IconPlaybook}
            title="50+ vendor playbooks"
            sub="Swiggy, Amazon, IndiGo, Jio, HDFC"
            variant="saffron"
          />
          {/* — UX: trust-variant card per design.md §6 critical note.
                Saffron + trust-blue side-by-side IS the brand signature. */}
          <FeatureCard
            icon={IconLaw}
            title="India legal RAG"
            sub="CPA 2019 · DGCA · TRAI · IRDAI"
            variant="trust"
          />
          <FeatureCard
            icon={IconFollowUp}
            title="Agentic follow-up"
            sub="Escalates without you lifting a finger"
            variant="saffron"
          />
        </section>
      </div>

      <BottomNav
        active="home"
        notifyCases={notify}
        urgent={urgent}
        caseCount={caseCount}
      />
    </div>
  );
}

window.HomeScreen = HomeScreen;
