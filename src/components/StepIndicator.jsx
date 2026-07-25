// Saffron-soft pill used at the top of flow screens. The `children` slot
// holds the full label, e.g. "Step 2 of 4 · Extracted" — caller composes.

export default function StepIndicator({ children }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 12px',
        borderRadius: 999,
        background: 'var(--accent-saffron-soft)',
        border: '1px solid var(--accent-saffron-border)',
        color: 'var(--accent-saffron)',
        fontSize: 10.5,
        fontWeight: 600,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: 'var(--gradient-hero)',
        }}
      />
      {children}
    </span>
  );
}
