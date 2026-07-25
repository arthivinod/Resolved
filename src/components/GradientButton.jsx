import { useState } from 'react';

export default function GradientButton({ children, onClick, icon = 'plus' }) {
  const [pressed, setPressed] = useState(false);
  const [hover, setHover] = useState(false);

  const renderIcon = () => {
    if (icon === 'plus') {
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
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
      onMouseLeave={() => {
        setHover(false);
        setPressed(false);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        height: 56,
        width: '100%',
        padding: '0 24px',
        borderRadius: 999,
        border: 'none',
        cursor: 'pointer',
        background: 'var(--gradient-hero)',
        color: 'var(--on-accent)',
        fontFamily: 'inherit',
        fontSize: 16,
        fontWeight: 700,
        letterSpacing: '-0.01em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        boxShadow: pressed
          ? '0 2px 8px var(--accent-saffron-border)'
          : hover
            ? 'var(--glow-cta-hover)'
            : 'var(--glow-cta)',
        transform: pressed ? 'scale(0.98)' : 'scale(1)',
        filter: hover && !pressed ? 'brightness(1.05)' : 'none',
        transition:
          'transform 100ms ease-out, box-shadow 200ms ease, filter 200ms ease',
      }}
    >
      {renderIcon()}
      {children}
    </button>
  );
}
