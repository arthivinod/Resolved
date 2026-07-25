// ─────────────────────────────────────────────────────────────────
// Capture — ported from design-exports/Hackathon/capture-screen.jsx.
// ─────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react';
import StepIndicator from '../components/StepIndicator.jsx';
import BottomNav from '../components/BottomNav.jsx';

function Header({ canReset, onReset, onBack }) {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 16px 12px',
        position: 'relative',
        zIndex: 2,
      }}
    >
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
          height: 36, padding: '0 14px', minWidth: 44, minHeight: 44,
          background: 'transparent', border: 'none',
          cursor: canReset ? 'pointer' : 'default',
          color: canReset ? 'var(--text-primary)' : 'var(--text-tertiary)',
          fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
          letterSpacing: '-0.01em',
          opacity: canReset ? 1 : 0.55,
          transition: 'opacity 200ms ease, color 200ms ease',
        }}
      >
        Reset
      </button>
    </header>
  );
}

function InputCard({ id, icon, title, sub, options, isOpen, onToggle, onPick, loadingPick }) {
  const [pressed, setPressed] = useState(false);
  const swipeStart = useRef(null);

  const onTouchStart = (e) => { swipeStart.current = e.touches[0].clientY; };
  const onTouchMove = (e) => {
    if (swipeStart.current == null) return;
    const dy = e.touches[0].clientY - swipeStart.current;
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
      transition: 'background 180ms ease, border-color 180ms ease',
    }}>
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
        <span style={{
          width: 40, height: 40, borderRadius: 12, flexShrink: 0,
          fontSize: 22,
          display: 'grid', placeItems: 'center',
          background: 'var(--accent-saffron-soft)',
          border: '1px solid var(--accent-saffron-border)',
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

      {isOpen && (
        <div
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{
            borderTop: '1px solid var(--border)',
            padding: '6px 8px 8px',
            display: 'flex', flexDirection: 'column',
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
        minHeight: 56,
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

function NoteField({ value, onChange, onFocus, onBlur }) {
  // Demoted: no card border, muted background, smaller type, no focus glow —
  // so it reads as supplementary context, not a primary commit path. The
  // three input cards above remain the only forward path.
  return (
    <div>
      <textarea
        className="note-field-demoted"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => onFocus && onFocus()}
        onBlur={() => onBlur && onBlur()}
        placeholder="Add a note to help AI understand (optional)"
        rows={2}
        style={{
          width: '100%', minHeight: 60, boxSizing: 'border-box',
          padding: '10px 12px',
          borderRadius: 10,
          background: 'var(--bg-elevated)',
          border: 'none',
          color: 'var(--text-secondary)',
          fontFamily: 'inherit',
          fontSize: 12, lineHeight: 1.5,
          letterSpacing: '-0.005em',
          resize: 'none', outline: 'none',
        }}
      />
      <p style={{
        margin: '8px 0 0', textAlign: 'center',
        fontSize: 11.5, lineHeight: 1.4,
        color: 'var(--text-tertiary)',
        letterSpacing: '-0.005em',
      }}>
        Pick a photo, document, or email above to continue →
      </p>
    </div>
  );
}

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
      Try a sample — MacBook charger stopped working
    </button>
  );
}

const CARDS = [
  {
    id: 'photo',
    icon: '📸',
    title: 'Add a photo',
    sub: 'Damaged item · receipt · screenshot',
    options: [
      { id: 'camera', title: 'Take a photo', sub: 'Open camera now',
        icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>) },
      { id: 'gallery', title: 'Choose from gallery', sub: 'Photos & screenshots',
        icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-5-5L5 21" /></svg>) },
      { id: 'paste', title: 'Paste from clipboard', sub: 'If you just copied a screenshot',
        icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" /></svg>) },
    ],
  },
  {
    id: 'document',
    icon: '📄',
    title: 'Upload a document',
    sub: 'Bill · ticket · policy · statement',
    options: [
      { id: 'pdf', title: 'PDF file', sub: 'Most bills and statements',
        icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>) },
      { id: 'word', title: 'Word or image file', sub: '.docx, .png, .jpg',
        icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>) },
      { id: 'files', title: 'Browse Files app', sub: 'iCloud, Drive, on-device',
        icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>) },
    ],
  },
  {
    id: 'email',
    icon: '📧',
    title: 'Forward an email',
    sub: 'From the vendor, airline, or anyone',
    options: [
      { id: 'forward', title: 'Get my forward address', sub: 'A unique address just for you',
        icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><polyline points="3 7 12 13 21 7" /></svg>) },
      { id: 'connect', title: 'Connect inbox', sub: 'Auto-detect issues from email',
        comingSoon: true,
        icon: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11V7a3 3 0 0 1 6 0v4M5 11h14v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z" /></svg>) },
    ],
  },
];

export default function CaptureScreen({ mode = 'light', onNavigate = () => {} }) {
  const [openId, setOpenId] = useState(null);
  const [note, setNote] = useState('');
  const [loadingPick, setLoadingPick] = useState(null);
  const [navHidden, setNavHidden] = useState(false);
  const scrollRef = useRef(null);
  const cardRefs = useRef({});

  const canReset = !!openId || note.length > 0;

  const handleReset = () => {
    setOpenId(null);
    setNote('');
    setLoadingPick(null);
  };

  const handleToggle = (id) => {
    setOpenId((cur) => (cur === id ? null : id));
    requestAnimationFrame(() => {
      const el = cardRefs.current[id];
      const scroller = scrollRef.current;
      if (!el || !scroller) return;
      const willOpen = openId !== id;
      if (!willOpen) return;
      const topInScroller = el.offsetTop - scroller.offsetTop;
      scroller.scrollTo({ top: topInScroller - 72, behavior: 'smooth' });
    });
  };

  const handlePick = (_cardId, _optId) => {
    setLoadingPick(_optId);
    setTimeout(() => {
      setLoadingPick(null);
      onNavigate('extracting');
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
          overscrollBehavior: 'contain',
        }}
      >
        <Header
          canReset={canReset}
          onReset={handleReset}
          onBack={() => onNavigate('home')}
        />

        <section style={{ padding: '8px 20px 0' }}>
          <StepIndicator>Step 1 of 4 · Capture</StepIndicator>
          <h1 style={{
            margin: '14px 0 0',
            fontSize: 28, lineHeight: 1.15, fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
          }}>What went wrong?</h1>
          <p style={{
            margin: '8px 0 0',
            fontSize: 13, lineHeight: 1.5,
            color: 'var(--text-secondary)',
            maxWidth: 320,
          }}>
            Photo, document, or forwarded email. We figure out the rest.
          </p>
        </section>

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
            </div>
          ))}
        </section>

        <section style={{ padding: '32px 20px 0' }}>
          {/* Thin divider above the demoted note field marks the
              break from the primary-input zone to the supplementary one. */}
          <div style={{
            height: 1,
            background: 'var(--border)',
            marginBottom: 20,
          }} />
          <NoteField
            value={note}
            onChange={setNote}
            onFocus={() => setNavHidden(true)}
            onBlur={() => setNavHidden(false)}
          />
        </section>

        <section style={{ padding: '20px 20px 8px' }}>
          <TrySampleLink onPick={() => onNavigate('extracting')} />
        </section>
      </div>

      <BottomNav active="home" hidden={navHidden} onNavigate={onNavigate} />
    </div>
  );
}
