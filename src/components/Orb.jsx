export default function Orb({ size = 56, demeanor = 'celebrate', spinning = false }) {
  const isNeutral = demeanor === 'neutral';
  return (
    <div
      aria-hidden
      style={{
        width: size,
        height: size,
        position: 'relative',
        flexShrink: 0,
        transition:
          'width 600ms cubic-bezier(0.22,1,0.36,1), height 600ms cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      {!isNeutral && (
        <div
          style={{
            position: 'absolute',
            inset: -size * 0.35,
            borderRadius: '50%',
            background: 'var(--gradient-hero)',
            filter: `blur(${size * 0.22}px)`,
            opacity: spinning ? 0.7 : 0.55,
            animation: spinning
              ? 'orbPulse 1.6s ease-in-out infinite'
              : 'orbPulse 2s ease-in-out infinite',
            transition: 'opacity 600ms ease',
          }}
        />
      )}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: isNeutral ? 'var(--bg-elevated)' : 'var(--gradient-hero)',
          border: isNeutral ? '1px solid var(--border-strong)' : 'none',
          boxShadow: isNeutral ? 'none' : '0 4px 16px var(--accent-saffron-border)',
          animation: spinning ? 'orbSpin 2.4s linear infinite' : 'none',
        }}
      >
        {!isNeutral && (
          <div
            style={{
              position: 'absolute',
              inset: '8% 40% 50% 8%',
              borderRadius: '50%',
              background:
                'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.45), transparent 65%)',
            }}
          />
        )}
      </div>
    </div>
  );
}
