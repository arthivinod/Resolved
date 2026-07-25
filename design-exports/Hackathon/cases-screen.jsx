// ─────────────────────────────────────────────────────────────────────────
// cases-screen.jsx — Resolved · Screen 7 (Dashboard / "Your cases")
// Visual system: /design.md (mirrored in tokens.css). Zero hex in this file.
//
// READ FIRST — UX rationale comments are tagged // — UX:
// Two states delivered: populated (5 staged cases) + empty.
// ─────────────────────────────────────────────────────────────────────────

const { useState, useEffect, useRef, useMemo } = React;

// ─────────────────────────────────────────────────────────────────────────
// Header — wordmark only.
// — UX (Q10 — filter icon in header):
//   PICK: (c) NO filter icon. Rationale:
//     • The pill row IS the filter. A header icon that opens another
//       filter sheet = two sources of truth.
//     • Power-user "sort/filter" sheets belong in enterprise inboxes
//       (Mail, Tasks). This screen has 5–50 cases; the pill row covers
//       the entire decision space.
//   Result: a clean, near-empty header — the heading immediately below
//   carries the screen identity instead.
// ─────────────────────────────────────────────────────────────────────────
function CasesHeader() {
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
      <span style={{ width: 44, height: 44 }} aria-hidden />
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// StatsRow — compact two-column stats.
// — UX (Q1 — stats placement):
//   PICK: (a) compact two-column row.
//   Reasoning:
//     • (b) full-bleed card belongs on Home (where stats ARE the
//       social-proof anchor). On Dashboard, stats are context — the
//       case list is the operational core.
//     • (c) inline-next-to-heading compresses both into one cramped row;
//       neither gets to breathe.
//     • (a) two columns with a hairline divider lets the ₹ recovered
//       still be the visual hero (large + gradient) without dominating.
// — UX (rule 1 — ₹ as emotional center):
//   Stat 1 (₹ recovered) gets the saffron→gold gradient text-clip — same
//   brand vocabulary as Filed's Case ID, Home's hero numbers, Strategy
//   forecast. Anchors the screen.
// — UX (microcopy):
//   Label "RECOVERED" — rejected "TOTAL RECOVERED" (redundant: total
//   is implied by absence of qualifier) and "WON" (ambiguous with
//   "cases won").
//   Sub "across 8 wins this year" — concrete count + time scope.
//   Stat 2 sub: "of 240 lifetime cases" — added "lifetime" to anchor
//   the time frame against stat 1's "this year".
// ─────────────────────────────────────────────────────────────────────────
function StatsRow({ recovered = '₹91,208', wins = 8, winRate = '78%', lifetime = 240 }) {
  return (
    <section style={{ padding: '0 20px' }}>
      <div style={{
        padding: '18px 18px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 18,
        display: 'grid',
        gridTemplateColumns: '1fr 1px 1fr',
        gap: 18, alignItems: 'center',
      }}>
        <Stat
          label="Recovered"
          value={recovered}
          sub={`across ${wins} wins this year`}
          gradient
        />
        <div style={{ width: 1, alignSelf: 'stretch', background: 'var(--border)' }} />
        <Stat
          label="Win rate"
          value={winRate}
          sub={`of ${lifetime} lifetime cases`}
        />
      </div>
    </section>
  );
}

function Stat({ label, value, sub, gradient }) {
  return (
    <div>
      <div style={{
        fontSize: 10, fontWeight: 700,
        letterSpacing: '0.14em', textTransform: 'uppercase',
        color: 'var(--text-secondary)',
      }}>{label}</div>
      <div style={{
        marginTop: 6,
        fontSize: 24, fontWeight: 700,
        letterSpacing: '-0.025em', lineHeight: 1.05,
        fontVariantNumeric: 'tabular-nums',
        color: gradient ? 'transparent' : 'var(--text-primary)',
        ...(gradient ? {
          background: 'var(--gradient-hero-text)',
          WebkitBackgroundClip: 'text', backgroundClip: 'text',
        } : {}),
      }}>{value}</div>
      <div style={{
        marginTop: 6,
        fontSize: 11.5, lineHeight: 1.4,
        color: 'var(--text-tertiary)',
      }}>{sub}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// FilterPills — horizontal scroll row.
// — UX (Q2 — selected behavior):
//   PICK: (a) non-matching cases disappear (standard filter).
//   Rejected (b) fade-to-40% (a "compare" pattern that belongs to
//   sort tools, not status filters) and (c) hidden-by-filter group
//   (engineering overhead for marginal value).
//
// — UX (Q9 — what filters to include):
//   Status only. Vendor-type / amount-range / time filters are
//   "enterprise inbox" features that don't earn their pixels at the
//   <50-cases scale a real user sits at. Lean stays lean.
//
// — UX (Behavior Q4 — persistence):
//   FILTER RESETS to "All" on revisit. Sticky filters quietly hide
//   cases from the user; "where did my Croma win go?" is a hostile
//   ghost-state. Reset = predictable.
// ─────────────────────────────────────────────────────────────────────────
function FilterPills({ active, counts, onChange }) {
  const pills = [
    { id: 'all',          label: 'All',         count: counts.all },
    { id: 'in-progress',  label: 'In progress', count: counts['in-progress'] },
    { id: 'won',          label: 'Won',         count: counts.won },
    { id: 'escalated',    label: 'Escalated',   count: counts.escalated },
  ];
  return (
    <div style={{
      display: 'flex', gap: 8,
      overflowX: 'auto', overflowY: 'hidden',
      padding: '4px 20px 2px',
      // Hide scrollbar but keep the gesture
      scrollbarWidth: 'none',
      WebkitOverflowScrolling: 'touch',
    }}>
      {pills.map((p) => {
        const isActive = p.id === active;
        return (
          <button
            key={p.id}
            onClick={() => onChange(p.id)}
            aria-pressed={isActive}
            style={{
              flexShrink: 0,
              padding: '8px 14px', minHeight: 36,
              borderRadius: 999,
              background: isActive ? 'var(--accent-saffron-soft)' : 'var(--bg-surface)',
              border: isActive
                ? '1px solid var(--accent-saffron-border)'
                : '1px solid var(--border)',
              color: isActive ? 'var(--accent-saffron)' : 'var(--text-secondary)',
              fontFamily: 'inherit',
              fontSize: 13, fontWeight: isActive ? 700 : 600,
              letterSpacing: '-0.005em',
              cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              transition: 'background 200ms ease, color 200ms ease, border-color 200ms ease',
            }}
          >
            {p.label}
            {p.count != null && (
              <span style={{
                fontSize: 11, fontWeight: 700,
                opacity: 0.75,
                fontVariantNumeric: 'tabular-nums',
              }}>{p.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// StatusChip — small status pill.
// — UX (microcopy):
//   Locked: "In progress" / "Won" / "Escalated".
//   Rejected: "Active" (overlaps section label) · "Live" (gambling
//   vibe) · "Resolved" (collides with "wons" mental model).
//   Skipped emoji per anti-goals.
// ─────────────────────────────────────────────────────────────────────────
function StatusChip({ status }) {
  const config = {
    'in-progress': {
      label: 'In progress',
      bg: 'var(--accent-saffron-soft)',
      border: 'var(--accent-saffron-border)',
      color: 'var(--accent-saffron)',
    },
    'escalated': {
      label: 'Escalated',
      bg: 'var(--warning-soft)',
      border: 'color-mix(in srgb, var(--warning) 40%, transparent)',
      color: 'var(--warning)',
    },
    'won': {
      label: 'Won',
      bg: 'var(--success-soft)',
      border: 'color-mix(in srgb, var(--success) 40%, transparent)',
      color: 'var(--success)',
    },
  }[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 10px', borderRadius: 999,
      background: config.bg,
      border: `1px solid ${config.border}`,
      color: config.color,
      fontSize: 10.5, fontWeight: 700,
      letterSpacing: '0.1em', textTransform: 'uppercase',
    }}>
      {status === 'won' && (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="3.2"
             strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
      {config.label}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// CaseCard — one row in the list.
//
// — UX (Q4 — tap behavior):
//   PICK: (a) navigate to case detail. For prototype, only the
//   "in-progress Swiggy" case opens (routes to the Filed screen, which
//   has the live escalation ladder). Other cards press-feedback only.
//   Rationale:
//     • (b) inline-expand turns dashboard into a folio of accordions —
//       loses scannability.
//     • (c) bottom-sheet feels good for previews but for the canonical
//       case object, a dedicated screen is the right home.
//
// — UX (Q5 — swipe gestures):
//   PICK: (b) no swipe quick-actions for the prototype. Adds engineering
//   judges won't see in a 90-second demo. Noted in code as Phase 2.
//
// — UX (Q6 — chip placement):
//   PICK: (b) bottom-left under subtitle.
//   Rationale:
//     • (a) top-right corner fights the amount (which also wants right).
//     • (c) "beside amount" packs too much into one line.
//     • (b) anchors status to the case body and frees the right side
//       entirely for the amount, which gets to be large/colored.
//
// — UX (Q7 — amount placement + color):
//   PICK: (a) right side, large, status-colored.
//     • Won  → --success (green)
//     • In-progress → --text-primary (neutral — money is still up for grabs)
//     • Escalated → --warning (amber — money is contested/aged)
//   Rejected (b) below-vendor-smaller — the ₹ is the user's emotional
//   payload; it deserves the prime visual slot.
//   Rejected (c) inside-chip — fuses two pieces of info into one,
//   degrading both.
//
// — UX (Behavior Q6 — urgency indicator):
//   Subtle saffron-tinted clock glyph + tiny line on cards where
//   `urgent` is true. NEVER red. Brand stays calm-authoritative — red
//   would say "we panic"; we don't.
// ─────────────────────────────────────────────────────────────────────────
function CaseCard({ kase, onOpen }) {
  const [pressed, setPressed] = useState(false);
  const isInteractive = !!kase.openable;

  const amountColor =
    kase.status === 'won'         ? 'var(--success)' :
    kase.status === 'escalated'   ? 'var(--warning)' :
                                    'var(--text-primary)';

  return (
    <button
      onClick={isInteractive ? () => onOpen(kase) : undefined}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        width: '100%',
        minHeight: 84,
        padding: '14px 16px',
        textAlign: 'left',
        background: pressed ? 'var(--bg-elevated)' : 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        cursor: isInteractive ? 'pointer' : 'default',
        fontFamily: 'inherit',
        color: 'var(--text-primary)',
        transition: 'background 160ms ease, transform 100ms ease-out',
        transform: pressed && isInteractive ? 'scale(0.995)' : 'scale(1)',
        display: 'grid',
        gridTemplateColumns: '40px 1fr auto',
        columnGap: 14,
        rowGap: 6,
        alignItems: 'center',
      }}
    >
      {/* Icon — column 1, spans rows */}
      <div style={{
        gridRow: '1 / span 2',
        width: 40, height: 40, borderRadius: 12,
        background: kase.status === 'won' ? 'var(--success-soft)'
                  : kase.status === 'escalated' ? 'var(--warning-soft)'
                  : 'var(--accent-saffron-soft)',
        border: `1px solid ${
          kase.status === 'won' ? 'color-mix(in srgb, var(--success) 30%, transparent)'
          : kase.status === 'escalated' ? 'color-mix(in srgb, var(--warning) 30%, transparent)'
          : 'var(--accent-saffron-border)'
        }`,
        display: 'grid', placeItems: 'center',
        fontSize: 20,
      }}>{kase.icon}</div>

      {/* Vendor + amount row */}
      <div style={{
        fontSize: 15.5, fontWeight: 700,
        letterSpacing: '-0.015em', lineHeight: 1.2,
        color: 'var(--text-primary)',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>{kase.vendor}</div>
      <div style={{
        fontSize: 18, fontWeight: 700,
        letterSpacing: '-0.02em', lineHeight: 1,
        fontVariantNumeric: 'tabular-nums',
        color: amountColor,
        justifySelf: 'end',
      }}>{kase.amountDisplay}</div>

      {/* Subtitle + chip row */}
      <div style={{
        gridColumn: '2 / span 2',
        display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8,
        rowGap: 6,
      }}>
        <span style={{
          fontSize: 12.5, lineHeight: 1.4,
          color: 'var(--text-secondary)',
          letterSpacing: '-0.005em',
          flex: '1 1 auto', minWidth: 0,
        }}>{kase.subtitle}</span>

        {/* Urgency clock — only on in-progress with urgent flag */}
        {kase.urgent && (
          <span aria-label="Auto-escalation soon" style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '2px 8px', borderRadius: 999,
            background: 'var(--accent-saffron-soft)',
            color: 'var(--accent-saffron)',
            fontSize: 10, fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2"
                 strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <polyline points="12 7 12 12 16 14" />
            </svg>
            18h
          </span>
        )}

        <StatusChip status={kase.status} />
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// SectionLabel — "ACTIVE · 2" header.
// — UX (Q3 — sectioning):
//   PICK: (b) only when "All" filter is active.
//   Rationale: when the user filters to "Won", a "RESOLVED · 3"
//   section header is the filter shouting itself back at them. When
//   "All" is the lens, grouping into Active vs Resolved is the right
//   division (different user intents: act-on-it vs admire-it).
// — UX (microcopy):
//   "ACTIVE · 2" (dropped "cases" — count + status is unambiguous,
//   saves vertical pixel + reads tighter).
// ─────────────────────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <div style={{
      padding: '20px 20px 10px',
      fontSize: 10.5, fontWeight: 700,
      letterSpacing: '0.14em', textTransform: 'uppercase',
      color: 'var(--text-tertiary)',
    }}>{children}</div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// BottomNav — Cases tab active.
// ─────────────────────────────────────────────────────────────────────────
function CasesBottomNav({ onNav = () => {} }) {
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
        const isActive = it.id === 'cases';
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
// CASES — staged dataset.
// — UX (rule 4 — range proof): 5 cases · 5 industries (food / insurance
//   / aviation / telecom / electronics). Visible without scrolling far
//   so the diversity hits immediately.
//
// — UX (Behavior Q2 — sort within sections):
//   Active: newest filed first  (most actionable at top — Swiggy was
//                                just filed, HDFC ERGO has been live 4d).
//   Resolved: most recent win first  (the "what did I just win" frame
//                                wins over "biggest win ever" — the
//                                latter invites stat-comparison every
//                                visit and buries new wins).
//
// — UX (Behavior Q5 — case ID surfacing): not on dashboard cards. Lives
//   on detail screen. Keeps cards clean; vendor + amount carry identity.
//
// — UX (subtitle microcopy): one line each, factual, structure
//   "{what} · {next-event}". Reads as a status report, not marketing.
// ─────────────────────────────────────────────────────────────────────────
const CASES = [
  // ─── Active (sorted newest-first) ────────────────────────────────
  {
    id: 'RV-00214', vendor: 'Swiggy', icon: '🍱',
    amount: 420, amountDisplay: '₹420',
    status: 'in-progress',
    subtitle: 'Spillage refund · vendor has 18h',
    urgent: true,
    openable: true, // wired to Filed.html in the prototype
  },
  {
    id: 'RV-00193', vendor: 'HDFC ERGO', icon: '🏥',
    amount: 45000, amountDisplay: '₹45,000',
    status: 'escalated',
    subtitle: 'Claim denial · IRDAI Bima Bharosa filed',
    openable: false,
  },
  // ─── Resolved (sorted most-recent-win-first) ─────────────────────
  {
    id: 'RV-00172', vendor: 'IndiGo · 6E-203', icon: '✈️',
    amount: 7500, amountDisplay: '₹7,500',
    status: 'won',
    subtitle: 'Flight delay · settled in 11 days',
  },
  {
    id: 'RV-00154', vendor: 'Jio', icon: '📱',
    amount: 288, amountDisplay: '₹288',
    status: 'won',
    subtitle: 'VAS overcharge · refunded in 4 days',
  },
  {
    id: 'RV-00138', vendor: 'Croma', icon: '📺',
    amount: 38000, amountDisplay: '₹38,000',
    status: 'won',
    subtitle: 'Wrong delivery · CC chargeback in 6 days',
  },
];

// Helper — group + filter cases for display.
function partition(cases, filter) {
  const filtered = filter === 'all'
    ? cases
    : cases.filter((c) => c.status === filter);

  const active = filtered.filter((c) => c.status === 'in-progress' || c.status === 'escalated');
  const resolved = filtered.filter((c) => c.status === 'won');

  return { filtered, active, resolved };
}

// ─────────────────────────────────────────────────────────────────────────
// EmptyState — zero cases.
// — UX (Q8 — empty state):
//   Stats row + filter row HIDDEN. Showing "₹0 recovered" stats on
//   first run would be devastating — frames the brand as "you haven't
//   won yet" instead of "let's get started".
//   Replaced with: small orb + heading + sub + single CTA.
//
// — UX (microcopy):
//   Heading: "No cases yet" — 3 words. Honest, calm.
//   Sub: "Resolved learns your vendors and tactics as you file. Start
//        with one." — 12 words. Names the value-prop ("learns your
//        vendors") + the smallest first step ("Start with one").
//   CTA: "File your first complaint" — keeps "first" deliberate;
//        "+ New complaint" would feel like the same nav-bar CTA;
//        "first" signals this is the entry into a new chapter.
// ─────────────────────────────────────────────────────────────────────────
function EmptyState({ onStart }) {
  return (
    <div style={{
      padding: '24px 20px 0',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', textAlign: 'center',
      // Center vertically in the available area without a fixed height;
      // a generous top offset gives the small orb breathing room.
      marginTop: 60,
    }}>
      <div style={{ position: 'relative', width: 56, height: 56 }} aria-hidden>
        <div style={{
          position: 'absolute', inset: -20, borderRadius: '50%',
          background: 'var(--gradient-hero)',
          filter: 'blur(14px)', opacity: 0.45,
          animation: 'orbPulse 2.8s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: 'var(--gradient-hero)',
          boxShadow: '0 6px 20px var(--accent-saffron-border)',
        }}>
          <div style={{
            position: 'absolute', inset: '8% 40% 50% 8%', borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5), transparent 65%)',
          }} />
        </div>
      </div>

      <h2 style={{
        margin: '20px 0 0',
        fontSize: 22, fontWeight: 700,
        letterSpacing: '-0.025em', lineHeight: 1.2,
        color: 'var(--text-primary)',
      }}>No cases yet</h2>

      <p style={{
        margin: '8px 0 0', maxWidth: 280,
        fontSize: 13.5, lineHeight: 1.55,
        color: 'var(--text-secondary)',
        letterSpacing: '-0.005em',
      }}>
        Resolved learns your vendors and tactics as you file. Start with one.
      </p>

      <button
        onClick={onStart}
        style={{
          marginTop: 22,
          height: 52, padding: '0 24px',
          borderRadius: 999, border: 'none', cursor: 'pointer',
          background: 'var(--gradient-hero)',
          color: 'var(--on-accent)',
          fontFamily: 'inherit',
          fontSize: 15, fontWeight: 700,
          letterSpacing: '-0.01em',
          boxShadow: 'var(--glow-cta)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2.4"
             strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
        File your first complaint
      </button>

      {/* — UX: also offer the smallest-first-step alternative for the
            curious / cautious user. Dashed underline, --text-tertiary
            so it doesn't compete with the gradient CTA. */}
      <button
        onClick={onStart}
        style={{
          marginTop: 14, padding: '6px 8px', minHeight: 44,
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: 'var(--text-tertiary)', fontFamily: 'inherit',
          fontSize: 12, fontWeight: 500,
          textDecoration: 'underline', textDecorationStyle: 'dashed',
          textUnderlineOffset: 3,
        }}>
        Or try a sample case
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// CasesScreen — orchestrator.
//
// — UX (Behavior Q3 — sticky header):
//   PICK: FILTER PILLS STICKY (not the big heading + stats).
//   Brief instinct said collapse big-heading into compact-bar on scroll.
//   I'm pushing back: a transforming header is a moving part with
//   layout-shift risk, and it competes with the case list (the screen's
//   real point of attention). Sticky pill row keeps the filter
//   one-tap reachable as the user scrolls 5–20 cases; the heading +
//   stats scroll out naturally and the user can scroll back up if
//   they want to see them.
//
// — UX (Behavior Q1 — pull to refresh):
//   Designed but not built in the prototype iframe (touch events on
//   desktop demo aren't reliable). Comment-flagged as Phase 2.
// ─────────────────────────────────────────────────────────────────────────
function CasesScreen({
  mode = 'light',
  empty = false,
  cases = CASES,
  onOpenCase = () => {},
  onFileNew = () => {},
  onNav = () => {},
}) {
  const [filter, setFilter] = useState('all');

  const counts = useMemo(() => ({
    all:           cases.length,
    'in-progress': cases.filter((c) => c.status === 'in-progress').length,
    won:           cases.filter((c) => c.status === 'won').length,
    escalated:     cases.filter((c) => c.status === 'escalated').length,
  }), [cases]);

  const { active, resolved } = useMemo(() => partition(cases, filter), [cases, filter]);
  const showSections = filter === 'all';

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
        <CasesHeader />

        {empty ? (
          <EmptyState onStart={onFileNew} />
        ) : (
          <>
            {/* ─── Heading ─── */}
            <section style={{ padding: '8px 20px 18px' }}>
              <h1 style={{
                margin: 0,
                fontSize: 28, lineHeight: 1.1, fontWeight: 700,
                letterSpacing: '-0.03em',
                color: 'var(--text-primary)',
              }}>Your cases</h1>
            </section>

            {/* ─── Stats ─── */}
            <StatsRow />

            {/* ─── Filter pills (sticky) ─── */}
            <div style={{
              position: 'sticky', top: 0, zIndex: 10,
              marginTop: 18, paddingTop: 8, paddingBottom: 8,
              background: 'color-mix(in srgb, var(--bg-primary) 88%, transparent)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: '0 1px 0 var(--border)',
            }}>
              <FilterPills active={filter} counts={counts} onChange={setFilter} />
            </div>

            {/* ─── Case lists ─── */}
            {showSections ? (
              <>
                {active.length > 0 && (
                  <>
                    <SectionLabel>Active · {active.length}</SectionLabel>
                    <section style={{
                      padding: '0 20px',
                      display: 'flex', flexDirection: 'column', gap: 10,
                    }}>
                      {active.map((k) => (
                        <CaseCard key={k.id} kase={k} onOpen={onOpenCase} />
                      ))}
                    </section>
                  </>
                )}

                {resolved.length > 0 && (
                  <>
                    <SectionLabel>Resolved · {resolved.length}</SectionLabel>
                    <section style={{
                      padding: '0 20px',
                      display: 'flex', flexDirection: 'column', gap: 10,
                    }}>
                      {resolved.map((k) => (
                        <CaseCard key={k.id} kase={k} onOpen={onOpenCase} />
                      ))}
                    </section>
                  </>
                )}
              </>
            ) : (
              // Filtered view — no section labels (per Q3 pick).
              <section style={{
                padding: '16px 20px 0',
                display: 'flex', flexDirection: 'column', gap: 10,
              }}>
                {[...active, ...resolved].map((k) => (
                  <CaseCard key={k.id} kase={k} onOpen={onOpenCase} />
                ))}
                {active.length + resolved.length === 0 && (
                  <div style={{
                    padding: '32px 8px', textAlign: 'center',
                    color: 'var(--text-tertiary)',
                    fontSize: 13, lineHeight: 1.5,
                  }}>
                    No <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                      {filter.replace('-', ' ')}
                    </span> cases yet.
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </div>

      <CasesBottomNav onNav={onNav} />
    </div>
  );
}

window.CasesScreen = CasesScreen;
