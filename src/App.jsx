import { useState } from 'react';
import Home from './screens/Home.jsx';
import Capture from './screens/Capture.jsx';
import Extracting from './screens/Extracting.jsx';
import Strategy from './screens/Strategy.jsx';
import YourMove from './screens/YourMove.jsx';
import Filed from './screens/Filed.jsx';
import Dashboard from './screens/Dashboard.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

const SCREENS = {
  home: Home,
  capture: Capture,
  extracting: Extracting,
  strategy: Strategy,
  yourmove: YourMove,
  filed: Filed,
  dashboard: Dashboard,
};

// Pick the user's OS preference on first mount. No persistence per design.md
// §11 — toggling the sun/moon stays in-memory only, and a refresh re-reads
// the system preference.
function getInitialMode() {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export default function App() {
  const [screen, setScreen] = useState('home');
  const [mode, setMode] = useState(getInitialMode);
  const Current = SCREENS[screen];
  const toggleMode = () => setMode((m) => (m === 'dark' ? 'light' : 'dark'));
  const resetToHome = () => setScreen('home');

  return (
    <div
      className={mode === 'dark' ? 'mode-dark' : 'mode-light'}
      style={{
        height: '100dvh',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
      }}
    >
      {/* Mobile-first 420px column, centered on desktop per design.md §12 */}
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          height: '100%',
          position: 'relative',
        }}
      >
        <ErrorBoundary onReset={resetToHome}>
          <Current
            mode={mode}
            onToggleMode={toggleMode}
            onNavigate={setScreen}
          />
        </ErrorBoundary>
      </div>
    </div>
  );
}
