// ─────────────────────────────────────────────────────────────────
// Home — ported from design-exports/Hackathon/home-screen.jsx.
// Refinements baked in upstream: subhead "Drop the evidence. We do
// the rest.", no eyebrow chip, demoted stat strip (hairlines, no
// chevron / divider / surface), FeatureCard icon 28px.
// ─────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react';
import Aurora from '../components/Aurora.jsx';
import Orb from '../components/Orb.jsx';
import ModeToggle from '../components/ModeToggle.jsx';
import GradientButton from '../components/GradientButton.jsx';
import FeatureCard from '../components/FeatureCard.jsx';
import BottomNav from '../components/BottomNav.jsx';

// ─── Home-only subcomponents ─────────────────────────────────────

function Header({ mode, onToggleMode }) {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 20px 12px',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <span
        style={{
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: '-0.025em',
          color: 'var(--text-primary)',
        }}
      >
        Resolved
      </span>
      <ModeToggle mode={mode} onToggle={onToggleMode} />
    </header>
  );
}

function Hero() {
  return (
    <section
      style={{
        padding: '8px 20px 0',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <h1
        style={{
          margin: '14px 0 0',
          fontSize: 40,
          lineHeight: 1.05,
          fontWeight: 700,
          letterSpacing: '-0.035em',
          color: 'var(--text-primary)',
        }}
      >
        They have AI.
        <br />
        <span
          style={{
            background: 'var(--gradient-hero-text)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Now you do too.
        </span>
      </h1>
      <p
        style={{
          margin: '16px 0 0',
          fontSize: 15,
          lineHeight: 1.55,
          letterSpacing: '-0.01em',
          color: 'var(--text-secondary)',
          maxWidth: 360,
        }}
      >
        Drop the evidence. We do the rest.
      </p>
    </section>
  );
}

function Metric({ label, value, gradient, loading }) {
  return (
    <div>
      <div
        style={{
          fontSize: 10.5,
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--text-secondary)',
        }}
      >
        {label}
      </div>
      {loading ? (
        <div
          style={{
            marginTop: 8,
            height: 30,
            width: '80%',
            borderRadius: 6,
            background:
              'linear-gradient(90deg, var(--bg-elevated), var(--border), var(--bg-elevated))',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.4s linear infinite',
          }}
        />
      ) : (
        <div
          style={{
            marginTop: 6,
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: '-0.025em',
            lineHeight: 1.05,
            fontVariantNumeric: 'tabular-nums',
            color: gradient ? 'transparent' : 'var(--text-primary)',
            ...(gradient
              ? {
                  background: 'var(--gradient-hero-text)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                }
              : {}),
          }}
        >
          {value}
        </div>
      )}
    </div>
  );
}

function StatCard({ loading }) {
  // Demoted from interactive card to a quiet inline proof strip.
  return (
    <div
      style={{
        width: '100%',
        padding: '16px 0',
        borderTop: '1px solid color-mix(in srgb, var(--border) 60%, transparent)',
        borderBottom: '1px solid color-mix(in srgb, var(--border) 60%, transparent)',
        color: 'var(--text-primary)',
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 18,
          alignItems: 'start',
        }}
      >
        <Metric label="Recovered" value="₹91,208" gradient loading={loading} />
        <Metric label="Win rate" value="78%" loading={loading} />
      </div>
    </div>
  );
}

function PullCue({ progress }) {
  if (progress <= 0) return null;
  const opacity = Math.min(progress / 64, 1);
  const orbSize = 32 + Math.min(progress / 4, 16);
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        top: 56,
        left: 0,
        right: 0,
        display: 'grid',
        placeItems: 'center',
        pointerEvents: 'none',
        height: Math.min(progress, 80),
        zIndex: 1,
        opacity,
      }}
    >
      <Orb size={orbSize} />
    </div>
  );
}

// ─── Feature icons ───────────────────────────────────────────────

const IconPlaybook = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2Z" />
    <path d="M8 7h7M8 11h7" />
  </svg>
);

const IconLaw = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3v18M5 8h14M5 8l-2 6a4 4 0 0 0 8 0L9 8M19 8l-2 6a4 4 0 0 0 8 0L23 8" />
    <path d="M7 21h10" />
  </svg>
);

const IconFollowUp = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <polyline points="3 4 3 10 9 10" />
  </svg>
);

// ─── HomeScreen ──────────────────────────────────────────────────

export default function HomeScreen({
  userState = 'first-time',
  mode = 'light',
  onToggleMode = () => {},
  onNavigate = () => {},
}) {
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

  const notify = userState === 'returning-active';
  const caseCount = notify ? 1 : 0;
  const urgent = notify;

  return (
    <div
      ref={scrollRef}
      onScroll={onScroll}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className={mode === 'dark' ? 'mode-dark' : 'mode-light'}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        overflow: 'auto',
        overflowX: 'hidden',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        WebkitFontSmoothing: 'antialiased',
        transition: 'color 250ms ease',
      }}
    >
      <Aurora scrollY={scrollY} />
      <PullCue progress={pull} />

      <div
        style={{
          paddingTop: 50,
          paddingBottom: 132,
          transform: pull ? `translateY(${pull}px)` : 'none',
          transition: pull
            ? 'none'
            : 'transform 220ms cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <Header mode={mode} onToggleMode={onToggleMode} />

        <Hero />

        <section
          style={{
            padding: '24px 20px 0',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <GradientButton onClick={() => onNavigate('capture')} icon="plus">
            New complaint
          </GradientButton>
        </section>

        <section
          style={{
            padding: '20px 20px 0',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <StatCard loading={loading} />
        </section>

        <section
          style={{
            padding: '44px 20px 12px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)',
            }}
          >
            How we tip the scales
          </div>
        </section>

        <section
          style={{
            padding: '0 20px',
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <FeatureCard
            icon={IconPlaybook}
            title="50+ vendor playbooks"
            sub="Swiggy, Amazon, IndiGo, Jio, HDFC"
            variant="saffron"
          />
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
        onNavigate={onNavigate}
      />
    </div>
  );
}
