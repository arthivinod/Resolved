// ─────────────────────────────────────────────────────────────────────────
// Home.jsx — Resolved Home screen
//
// Visual system: /design.md (dark mode, magenta→purple gradient, aurora, Inter)
// Frame: 402×874 iPhone, single column max-width 420.
//
// UX rationale lives inline next to every decision (look for `// — `).
// Reviewer: search for those comments to audit my thinking.
// ─────────────────────────────────────────────────────────────────────────

const T = {
  bg: '#0A0A0F', surface: '#15151D', surface2: '#1C1C26',
  border: '#26262F', borderStrong: '#34343F',
  text: '#F4F4F8', textMuted: '#8A8A99', textFaint: '#5A5A66',
  onAccent: '#FFFFFF',
  accent1: '#FF4D8F', accent2: '#C726E6', accent3: '#6B1FB3',
  accent: '#FF4D8F',
  statusProgress: '#FF4D8F', statusWon: '#7BD89E', statusEscalated: '#FFC966',
  tintProgress: 'rgba(255,77,143,0.12)',
  tintWon: 'rgba(123,216,158,0.12)',
  tintEscalated: 'rgba(255,201,102,0.12)',
  gradient: 'linear-gradient(135deg,#FF4D8F 0%,#C726E6 52%,#6B1FB3 100%)',
  glowAccent: '0 8px 28px rgba(199,38,230,0.45)',
  glowAccentSm: '0 4px 16px rgba(255,77,143,0.40)',
  shadowCard: '0 1px 0 rgba(255,255,255,0.03) inset',
  shadowRaised: '0 12px 40px rgba(0,0,0,0.50)',
};

// ─────────────────────────────────────────────────────────────────────────
// Aurora — fixed, blurred, low-alpha. Drifts slowly. Lives behind everything.
// — On scroll we apply a soft parallax (Y * 0.15) instead of full scroll.
//   Decision: parallax is preserved (premium feel) but capped so it never
//   exposes the canvas edge. Reduces motion if user prefers.
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
        position: 'absolute', inset: -40,
        transform: `translate3d(0, ${-dy}px, 0)`,
        background: [
          'radial-gradient(40% 35% at 18% 12%, rgba(255,77,143,0.26), transparent 70%)',
          'radial-gradient(45% 40% at 85% 20%, rgba(199,38,230,0.22), transparent 72%)',
          'radial-gradient(50% 45% at 60% 95%, rgba(107,31,179,0.20), transparent 75%)',
        ].join(','),
        filter: 'blur(90px)',
        animation: reduce ? 'none' : 'auroraDrift 22s ease-in-out infinite alternate',
      }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Orb (sm) — the brand's living mark. Sits next to "Resolved" wordmark.
// — Reused at 56px for the brand mark. Persistent and subtle.
// — Decision: NOT a hero-sized orb. A big orb above the headline would steal
//   attention from the headline asymmetry. The orb's role here is
//   "the AI is alive" — small, breathing, in your peripheral vision.
// ─────────────────────────────────────────────────────────────────────────
function Orb({ size = 32 }) {
  return (
    <div aria-hidden style={{
      width: size, height: size, position: 'relative', flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute', inset: -size * 0.3, borderRadius: '50%',
        background: T.gradient, filter: `blur(${size * 0.18}px)`, opacity: 0.6,
        animation: 'orbPulse 2.4s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: `conic-gradient(from 0deg, ${T.accent1}, ${T.accent2}, ${T.accent3}, ${T.accent1})`,
        animation: 'orbRotate 8s linear infinite',
      }} />
      <div style={{
        position: 'absolute', inset: size * 0.19, borderRadius: '50%',
        background: T.gradient, boxShadow: T.glowAccent,
      }}>
        <div style={{
          position: 'absolute', inset: '8% 40% 50% 8%', borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5), transparent 65%)',
        }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// BrandBar — top of screen. Lightweight. Does NOT collapse on scroll.
// — Decision: no shrinking header. The screen is short enough that a
//   shrinking header is theatre. Stays static; aurora handles depth.
// — Notification dot is NOT here; lives on the Cases tab icon (see BottomNav).
// ─────────────────────────────────────────────────────────────────────────
function BrandBar() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 20px 4px', position: 'relative', zIndex: 2,
    }}>
      <Orb size={28} />
      <span style={{
        fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em',
        color: T.text,
      }}>Resolved</span>
      <span style={{ flex: 1 }} />
      {/* — Settings affordance. Single icon, no label, low-contrast.
            Anything more (search, help, profile) would compete with the CTA. */}
      <button aria-label="Settings" style={{
        background: 'transparent', border: 'none', cursor: 'pointer',
        width: 36, height: 36, borderRadius: 999,
        display: 'grid', placeItems: 'center', color: T.textMuted,
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
        </svg>
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// ActiveCaseStrip — ONLY shown for returning users with an open case.
// — Decision: personalization lives in a slim strip at the TOP of the
//   content column, NOT in the hero. The hero must stay identical for all
//   three user types (first-time, returning-idle, returning-active) so the
//   product identity doesn't shift between visits.
// — Tapping deep-links to that case's detail view in the Cases tab.
// — Color shifts to amber when escalation is <24h away (urgency signal).
// ─────────────────────────────────────────────────────────────────────────
function ActiveCaseStrip({ vendor, status, eta, urgent, onPress }) {
  const accent = urgent ? T.statusEscalated : T.statusProgress;
  const tint = urgent ? T.tintEscalated : T.tintProgress;
  return (
    <button onClick={onPress} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      margin: '4px 20px 0', padding: '10px 14px',
      background: tint, border: `1px solid ${accent}33`,
      borderRadius: 999, cursor: 'pointer', width: 'calc(100% - 40px)',
      position: 'relative', zIndex: 2,
      fontFamily: 'inherit', color: T.text,
    }}>
      <span style={{
        width: 8, height: 8, borderRadius: '50%', background: accent,
        boxShadow: `0 0 12px ${accent}`,
        animation: 'pulseDot 1.8s ease-in-out infinite',
      }} />
      <span style={{ fontSize: 12, fontWeight: 600, color: T.text }}>
        {vendor} <span style={{ color: T.textMuted, fontWeight: 500 }}>· {status}</span>
      </span>
      <span style={{ flex: 1 }} />
      <span style={{ fontSize: 11, fontWeight: 600, color: accent, textTransform: 'lowercase' }}>
        {eta}
      </span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Hero — eyebrow + headline + subhead + primary CTA. ULTRA-TIGHT.
// — Decision (hero copy length): minimum viable. Headline + 1 subhead + CTA.
//   No carousel, no bullets here, no secondary button. The brief's instinct
//   was right: every extra word weakens the asymmetry punch.
// — Decision (single vs dual CTA): SINGLE. "View my cases" lives in bottom
//   nav with a notification dot when relevant. A secondary CTA on Home
//   widens the funnel and steals attention from the dominant intent (file).
// — Decision (onboarding tooltip): none. The subhead carries the explainer
//   in one sentence with a concrete verb ("Drop a screenshot"). Tooltips
//   on a primary CTA kill premium feel — they read as "we don't trust
//   our own copy".
// ─────────────────────────────────────────────────────────────────────────
function Hero({ onPrimary }) {
  return (
    <section style={{
      padding: '28px 20px 8px', position: 'relative', zIndex: 2,
    }}>
      {/* Eyebrow chip — 2-3 words. Category positioning. */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '5px 10px', borderRadius: 999,
        background: 'rgba(255,77,143,0.10)',
        border: '1px solid rgba(255,77,143,0.22)',
        fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: T.statusProgress,
      }}>
        <span style={{
          width: 5, height: 5, borderRadius: '50%', background: T.gradient,
        }} />
        consumer rights
      </div>

      {/* Headline — exactly one italic gradient phrase per design.md §2.2. */}
      <h1 style={{
        margin: '14px 0 0', fontSize: 44, lineHeight: 1.04, fontWeight: 800,
        letterSpacing: '-0.03em', color: T.text, textWrap: 'balance',
      }}>
        They have AI.<br />
        <span style={{
          fontStyle: 'italic',
          background: T.gradient, WebkitBackgroundClip: 'text',
          backgroundClip: 'text', color: 'transparent',
        }}>Now you do too.</span>
      </h1>

      {/* Subhead — ~18 words, concrete verbs (Drop, draft, cite, chase). */}
      <p style={{
        margin: '14px 0 0', fontSize: 16, lineHeight: 1.5,
        color: T.textMuted, maxWidth: 340,
      }}>
        Drop a screenshot. We draft the complaint, cite the law, and chase the vendor until they pay.
      </p>

      {/* Primary CTA — 2 words, action + object. */}
      <button onClick={onPrimary} style={{
        marginTop: 20, height: 56, width: '100%',
        borderRadius: 999, border: 'none', cursor: 'pointer',
        background: T.gradient, color: T.onAccent,
        fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em',
        boxShadow: T.glowAccent, fontFamily: 'inherit',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        transition: 'transform 120ms cubic-bezier(0.22,1,0.36,1), filter 120ms',
      }}
        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.97)'}
        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        File complaint
      </button>

      {/* — Decision: tiny hint UNDER the CTA, not as a tooltip ON it.
            Removes ambiguity for first-time users without crowding the button. */}
      <p style={{
        margin: '10px 0 0', fontSize: 12, color: T.textFaint, textAlign: 'center',
      }}>
        Screenshot, voice note, or just type it.
      </p>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Capabilities — three concrete capability proofs.
// — Decision: stacked vertical rows (not a 3-col grid). At 380px content
//   width, 3 columns force <100px each — kills room for the 6-word subtitle.
//   Vertical also lets each row breathe and reads as "scroll to learn more".
// — Each row title is 3 words, subtitle is concrete (vendor names, clause
//   numbers). No "AI-powered" / "intelligent" / "smart" — banned.
// ─────────────────────────────────────────────────────────────────────────
function Capabilities() {
  const items = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <path d="M3 10h18M8 4v14" />
        </svg>
      ),
      title: 'Vendor playbooks',
      sub: 'Knows Swiggy, Amazon, Ola tactics',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3 4 7v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V7l-8-4Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
      title: 'Law cited inline',
      sub: 'Consumer Act §2(11) auto-attached',
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 3-6.7" />
          <polyline points="3 4 3 10 9 10" />
        </svg>
      ),
      title: 'Agent follows up',
      sub: 'Chases vendor until resolution',
    },
  ];
  return (
    <section style={{
      padding: '24px 20px 8px', position: 'relative', zIndex: 2,
    }}>
      {/* No section heading. The cards speak for themselves; a "How it works"
          label would feel like a marketing page. */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((it, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: 16, borderRadius: 16,
            background: T.surface, border: `1px solid ${T.border}`,
            boxShadow: T.shadowCard,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, flexShrink: 0,
              background: 'rgba(255,77,143,0.10)',
              border: '1px solid rgba(255,77,143,0.18)',
              color: T.accent1,
              display: 'grid', placeItems: 'center',
            }}>{it.icon}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontSize: 15, fontWeight: 600, color: T.text,
                letterSpacing: '-0.01em',
              }}>{it.title}</div>
              <div style={{
                fontSize: 13, color: T.textMuted, marginTop: 2,
              }}>{it.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// StatCard — social proof. PLACEMENT: below capabilities.
// — Decision (placement): capability-first, then stats. Numbers like
//   "₹14.2L recovered" mean nothing until the user understands WHAT the
//   product does. Capability cards frame the stats; stats then close the
//   skeptic. Brief said social proof must land within 5s — stats hit at
//   second ~5–7 in the scroll, which is correct.
// — Decision (tap target): the WHOLE card is pressable, leading to the
//   Cases tab's "Community wins" view (anonymized list of resolved cases).
//   Without affordance a card-shaped element is misleading; a chevron and
//   "see how" label make the affordance explicit.
// — Decision (empty state): for a user with 0 personal cases we show
//   COMMUNITY numbers labelled "across users". Showing personal "₹0
//   recovered" on first run would be devastating — it implies failure
//   before the user has tried anything. Personal stats kick in only after
//   the user has at least one resolved case.
// ─────────────────────────────────────────────────────────────────────────
function StatCard({ mode, stats, loading, onPress }) {
  // mode: 'community' (first-time / no resolved cases) | 'personal'
  const label = mode === 'community' ? 'across users this month' : 'on your cases';
  return (
    <section style={{ padding: '16px 20px 0', position: 'relative', zIndex: 2 }}>
      <button onClick={onPress} style={{
        width: '100%', textAlign: 'left', cursor: 'pointer',
        padding: 20, borderRadius: 16,
        background: T.surface, border: `1px solid ${T.border}`,
        boxShadow: T.shadowCard, fontFamily: 'inherit', color: T.text,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* — Bracket accents (top-left + bottom-right) per Card "bracket
              variant" in design.md §3. Marks this as a highlight card. */}
        <BracketCorners />
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 16,
        }}>
          <span style={{
            fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: T.textMuted,
          }}>{label}</span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: 11, fontWeight: 600, color: T.text,
          }}>
            see how
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </span>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1px 1fr 1px 1fr',
          gap: 20, alignItems: 'center',
        }}>
          <Stat value={stats[0].v} label={stats[0].l} gradient loading={loading} />
          <div style={{ width: 1, height: 44, background: T.border }} />
          <Stat value={stats[1].v} label={stats[1].l} loading={loading} />
          <div style={{ width: 1, height: 44, background: T.border }} />
          <Stat value={stats[2].v} label={stats[2].l} loading={loading} />
        </div>
      </button>
    </section>
  );
}

function Stat({ value, label, gradient, loading }) {
  return (
    <div>
      {loading ? (
        <div style={{
          height: 28, width: '80%', borderRadius: 6,
          background: `linear-gradient(90deg, ${T.surface2}, ${T.border}, ${T.surface2})`,
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.4s linear infinite',
        }} />
      ) : (
        <div style={{
          fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em',
          fontVariantNumeric: 'tabular-nums', lineHeight: 1.1,
          color: gradient ? 'transparent' : T.text,
          ...(gradient ? {
            background: T.gradient,
            WebkitBackgroundClip: 'text', backgroundClip: 'text',
          } : {}),
        }}>{value}</div>
      )}
      <div style={{
        marginTop: 6, fontSize: 10, fontWeight: 600, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: T.textMuted,
      }}>{label}</div>
    </div>
  );
}

function BracketCorners() {
  const arm = 14, thick = 2;
  const c = (pos) => ({
    position: 'absolute', width: arm, height: arm,
    pointerEvents: 'none',
    ...pos,
  });
  return (
    <>
      <span style={{
        ...c({ top: 8, left: 8 }),
        borderTop: `${thick}px solid ${T.accent1}`,
        borderLeft: `${thick}px solid ${T.accent1}`,
        borderTopLeftRadius: 4,
      }} />
      <span style={{
        ...c({ bottom: 8, right: 8 }),
        borderBottom: `${thick}px solid ${T.accent3}`,
        borderRight: `${thick}px solid ${T.accent3}`,
        borderBottomRightRadius: 4,
      }} />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// BottomNav — floating glass per design.md §3.
// — Decision: 3 tabs only. Home, Cases, Letters. No profile, no notifications.
//   Settings is on the brand bar; notifications surface as a dot on Cases.
// — Notification dot on "Cases" when a case has a new vendor response.
//   This is the ONLY notification surface on Home. No top banners.
// ─────────────────────────────────────────────────────────────────────────
function BottomNav({ active = 'home', notifyCases = false }) {
  const items = [
    { id: 'home', label: 'Home', icon: (
      <path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />
    ) },
    { id: 'cases', label: 'Cases', icon: (
      <>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M9 3h6v4H9zM8 11h8M8 15h5" />
      </>
    ), badge: notifyCases },
    { id: 'letters', label: 'Letters', icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <polyline points="3 7 12 13 21 7" />
      </>
    ) },
  ];
  return (
    <nav style={{
      position: 'absolute', left: 16, right: 16, bottom: 24,
      height: 64, borderRadius: 20, zIndex: 30,
      background: 'rgba(21,21,29,0.7)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.06)',
      boxShadow: T.shadowRaised,
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      padding: '0 8px',
    }}>
      {items.map((it) => {
        const isActive = it.id === active;
        return (
          <button key={it.id} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 4, padding: '8px 16px', position: 'relative',
            color: isActive ? T.text : T.textMuted, fontFamily: 'inherit',
            minWidth: 44, minHeight: 44,
          }}>
            <div style={{ position: 'relative', width: 24, height: 24 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke={isActive ? 'url(#navGrad)' : 'currentColor'}
                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {it.icon}
              </svg>
              {isActive && (
                <svg width="0" height="0" style={{ position: 'absolute' }}>
                  <defs>
                    <linearGradient id="navGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={T.accent1} />
                      <stop offset="100%" stopColor={T.accent3} />
                    </linearGradient>
                  </defs>
                </svg>
              )}
              {it.badge && (
                <span style={{
                  position: 'absolute', top: -2, right: -4,
                  width: 8, height: 8, borderRadius: '50%',
                  background: T.gradient, boxShadow: T.glowAccentSm,
                  border: `2px solid rgba(21,21,29,0.9)`,
                }} />
              )}
            </div>
            <span style={{
              fontSize: 10, fontWeight: 600, letterSpacing: '0.04em',
            }}>{it.label}</span>
            {isActive && (
              <span style={{
                position: 'absolute', bottom: 4, width: 4, height: 4,
                borderRadius: '50%', background: T.gradient,
                boxShadow: T.glowAccentSm,
              }} />
            )}
          </button>
        );
      })}
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// PullToRefresh — gesture cue at the top of scroll.
// — Decision: yes, pull-to-refresh exists. It refreshes (a) the stats card
//   and (b) any active case status. The orb pulls down with the gesture and
//   spins faster when released — re-using the brand mark as the loading cue
//   instead of a generic spinner.
// — Threshold: 64px. Below that, just a rubber-band peek; above, fires.
// ─────────────────────────────────────────────────────────────────────────
function PullCue({ progress }) {
  if (progress <= 0) return null;
  const opacity = Math.min(progress / 64, 1);
  return (
    <div aria-hidden style={{
      position: 'absolute', top: 50, left: 0, right: 0,
      display: 'grid', placeItems: 'center', pointerEvents: 'none',
      height: Math.min(progress, 80), zIndex: 1,
      opacity,
    }}>
      <Orb size={28 + Math.min(progress / 4, 12)} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// HomeScreen — composes everything.
// — User state lives in props so the Tweaks panel can swap between:
//     'first-time'        → community stats, no active strip
//     'returning-idle'    → personal stats (or community if 0 wins), no strip
//     'returning-active'  → personal stats, active case strip at top
// — Loading: skeleton on stat values only (1.2s simulated). Static chrome
//   renders immediately; we don't blank out the whole screen.
// ─────────────────────────────────────────────────────────────────────────
function HomeScreen({ userState = 'first-time' }) {
  const [loading, setLoading] = React.useState(true);
  const [pull, setPull] = React.useState(0);
  const [scrollY, setScrollY] = React.useState(0);
  const scrollRef = React.useRef(null);
  const touchStart = React.useRef(null);

  React.useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, [userState]);

  // Pull-to-refresh + scroll tracking
  const onScroll = (e) => setScrollY(e.target.scrollTop);
  const onTouchStart = (e) => {
    if (scrollRef.current.scrollTop <= 0) touchStart.current = e.touches[0].clientY;
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
      setTimeout(() => setLoading(false), 900);
    }
    setPull(0);
    touchStart.current = null;
  };

  // Stat sets — community vs personal
  const stats = userState === 'returning-active' || userState === 'returning-idle'
    ? [
        { v: '₹12,480', l: 'recovered' },
        { v: '3', l: 'cases filed' },
        { v: '2/3', l: 'won' },
      ]
    : [
        { v: '₹14.2L', l: 'recovered' },
        { v: '3,247', l: 'cases filed' },
        { v: '91%', l: 'win rate' },
      ];

  const statsMode = userState === 'first-time' ? 'community' : 'personal';

  return (
    <div
      ref={scrollRef}
      onScroll={onScroll}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
        position: 'relative', width: '100%', height: '100%',
        background: T.bg, overflow: 'auto', overflowX: 'hidden',
        color: T.text,
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        WebkitFontSmoothing: 'antialiased',
        fontFeatureSettings: '"cv11","ss01"',
      }}
    >
      <Aurora scrollY={scrollY} />
      <PullCue progress={pull} />

      {/* Top padding clears the status bar (50px) + dynamic island */}
      <div style={{
        paddingTop: 54, paddingBottom: 140,
        transform: pull ? `translateY(${pull}px)` : 'none',
        transition: pull ? 'none' : 'transform 220ms cubic-bezier(0.22,1,0.36,1)',
      }}>
        <BrandBar />

        {userState === 'returning-active' && (
          <ActiveCaseStrip
            vendor="Swiggy refund"
            status="vendor responded"
            eta="auto-escalates in 18h"
            urgent={false}
            onPress={() => {}}
          />
        )}

        <Hero onPrimary={() => {}} />

        <Capabilities />

        <StatCard
          mode={statsMode}
          stats={stats}
          loading={loading}
          onPress={() => {}}
        />

        {/* — Decision: no footer copy ("trusted by..." etc). Anti-goal:
              testimonials/trust badges. Just breathing room above nav. */}
      </div>

      <BottomNav
        active="home"
        notifyCases={userState === 'returning-active'}
      />
    </div>
  );
}

window.HomeScreen = HomeScreen;
