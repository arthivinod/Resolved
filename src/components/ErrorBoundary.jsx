import { Component } from 'react';

// Demo-grade error boundary. If any screen throws during render or in a
// lifecycle, we show a calm reset screen instead of a white-on-white crash.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('Resolved app error:', error, info);
  }

  reset = () => {
    this.setState({ hasError: false });
    if (this.props.onReset) this.props.onReset();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
          padding: 20,
          background: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: 320 }}>
          <div
            aria-hidden
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              margin: '0 auto 18px',
              background: 'var(--gradient-hero)',
              boxShadow: 'var(--glow-cta)',
            }}
          />
          <h2
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: 'var(--text-primary)',
            }}
          >
            Something went sideways.
          </h2>
          <p
            style={{
              margin: '8px 0 20px',
              fontSize: 13,
              lineHeight: 1.5,
              color: 'var(--text-secondary)',
              letterSpacing: '-0.005em',
            }}
          >
            The demo hit an unexpected state. Tap below to reset to the start.
          </p>
          <button
            onClick={this.reset}
            style={{
              height: 48,
              padding: '0 24px',
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
              background: 'var(--gradient-hero)',
              color: 'var(--on-accent)',
              fontFamily: 'inherit',
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: '-0.01em',
              boxShadow: 'var(--glow-cta)',
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }
}
