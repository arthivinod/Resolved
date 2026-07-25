export default function FeatureCard({ icon, title, sub, variant = 'saffron' }) {
  const tokens =
    variant === 'trust'
      ? {
          iconBg: 'var(--accent-trust-soft)',
          iconBorder: 'var(--accent-trust-border)',
          iconColor: 'var(--accent-trust)',
        }
      : {
          iconBg: 'var(--accent-saffron-soft)',
          iconBorder: 'var(--accent-saffron-border)',
          iconColor: 'var(--accent-saffron)',
        };
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: 16,
        borderRadius: 16,
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 9,
          flexShrink: 0,
          background: tokens.iconBg,
          border: `1px solid ${tokens.iconBorder}`,
          color: tokens.iconColor,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            color: 'var(--text-primary)',
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: 4,
            fontSize: 12.5,
            lineHeight: 1.5,
            color: 'var(--text-secondary)',
          }}
        >
          {sub}
        </div>
      </div>
    </div>
  );
}
