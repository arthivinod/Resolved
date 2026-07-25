export default function Aurora({ scrollY = 0 }) {
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const dy = reduce ? 0 : Math.min(scrollY * 0.15, 60);
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: -60,
          transform: `translate3d(0, ${-dy}px, 0)`,
          animation: reduce ? 'none' : 'auroraDrift 22s ease-in-out infinite alternate',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            left: '-10%',
            width: '70%',
            height: '60%',
            background: 'var(--aurora-1)',
            filter: 'blur(60px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '-15%',
            width: '70%',
            height: '55%',
            background: 'var(--aurora-2)',
            filter: 'blur(60px)',
          }}
        />
      </div>
    </div>
  );
}
