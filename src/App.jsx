import { useState, useEffect } from 'react';
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

// Session-level case persistence. A prototype-scale localStorage blob is
// enough to make a refresh survivable — no backend needed. Cleared only
// when the user explicitly starts a new complaint (see startNewCase below).
const STORAGE_KEY = 'resolved:case:v1';

const DEFAULT_ESCALATION = { confirmedCount: 0, autoPilot: false };

const DEFAULT_FACTS = [
  { id: 'vendor', label: 'Vendor', value: '📦 Amazon', confident: true },
  { id: 'orderId', label: 'Order ID', value: '#408-3927461-5824103', confident: true },
  { id: 'amount', label: 'Amount', value: '₹7,499', confident: true },
  { id: 'issue', label: 'Issue', value: 'Charger stopped working — within warranty', confident: true },
  { id: 'severity', label: 'Severity', value: 'High', confident: false },
  { id: 'delivered', label: 'Delivered', value: 'March 12, 2026 (76 days ago)', confident: true },
];

// No live vision extraction is wired up (see README — it's staged/fallback
// data throughout), so "extraction quality" can't come from a real model
// response. Instead we tie it to which Capture input the user picks, so the
// partial/failed states are honestly demoable rather than randomly flaky.
const PARTIAL_FIELD_IDS = ['amount', 'severity'];
const PARTIAL_FACTS = DEFAULT_FACTS.map((f) =>
  PARTIAL_FIELD_IDS.includes(f.id) ? { ...f, value: '', confident: false } : f
);
const EMPTY_FACTS = DEFAULT_FACTS.map((f) => ({ ...f, value: '', confident: false }));

function outcomeForEvidence(optionId) {
  if (optionId === 'paste') return 'failed';
  if (optionId === 'word') return 'partial';
  return 'success';
}
function factsForOutcome(outcome) {
  if (outcome === 'partial') return PARTIAL_FACTS;
  if (outcome === 'failed') return DEFAULT_FACTS; // irrelevant while failed, kept sane for the fallback case
  return DEFAULT_FACTS;
}

function loadCase() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveCase(data) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage unavailable (private mode, quota) — in-memory state still works
  }
}

export default function App() {
  const [screen, setScreen] = useState(() => loadCase()?.screen || 'home');
  const [mode, setMode] = useState(getInitialMode);
  const [facts, setFacts] = useState(() => loadCase()?.facts || DEFAULT_FACTS);
  const [strategyValues, setStrategyValues] = useState(() => loadCase()?.strategy ?? null);
  const [letterState, setLetterState] = useState(() => loadCase()?.letter ?? null);
  const [escalationState, setEscalationState] = useState(
    () => loadCase()?.escalation ?? DEFAULT_ESCALATION
  );
  const [extractionOutcome, setExtractionOutcome] = useState(
    () => loadCase()?.extractionOutcome ?? 'success'
  );

  useEffect(() => {
    saveCase({
      screen, facts, strategy: strategyValues, letter: letterState,
      escalation: escalationState, extractionOutcome,
    });
  }, [screen, facts, strategyValues, letterState, escalationState, extractionOutcome]);

  const Current = SCREENS[screen];
  const toggleMode = () => setMode((m) => (m === 'dark' ? 'light' : 'dark'));
  const resetToHome = () => setScreen('home');

  const updateFact = (id, value) => {
    setFacts((prev) =>
      prev.map((f) => (f.id === id ? { ...f, value, confident: true } : f))
    );
  };

  // Swapping the evidence source in Capture means re-extraction, so the old
  // (possibly edited) facts shouldn't silently carry over as if they came
  // from the new photo. Strategy and letter progress are untouched — going
  // back to fix a wrong upload shouldn't cost the user the rest of the flow.
  const swapEvidence = (optionId) => {
    const outcome = outcomeForEvidence(optionId);
    setExtractionOutcome(outcome);
    setFacts(factsForOutcome(outcome));
  };

  // "Add details manually" from the could-not-read state — same shape as a
  // partial extraction with nothing pre-filled, so it reuses the same
  // confirm/edit screen instead of a bespoke manual-entry form.
  const goManual = () => {
    setExtractionOutcome('partial');
    setFacts(EMPTY_FACTS);
  };

  // The only two entry points that mean "start over," not "go back a step."
  // Everything else (back arrows, the mislabeled per-screen "Reset" buttons)
  // navigates without touching case data, so in-progress work survives.
  const startNewCase = () => {
    setFacts(DEFAULT_FACTS);
    setStrategyValues(null);
    setLetterState(null);
    setEscalationState(DEFAULT_ESCALATION);
    setExtractionOutcome('success');
    setScreen('capture');
  };

  const vendorName = (facts.find((f) => f.id === 'vendor')?.value || 'Amazon')
    .replace(/[^\w\s]/g, '')
    .trim();

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
            onStartNew={startNewCase}
            facts={facts}
            onEditFact={updateFact}
            onSwapEvidence={swapEvidence}
            extractionOutcome={extractionOutcome}
            onGoManual={goManual}
            vendor={vendorName}
            strategyValues={strategyValues}
            onStrategyChange={setStrategyValues}
            letterState={letterState}
            onLetterChange={setLetterState}
            escalationState={escalationState}
            onEscalationChange={setEscalationState}
          />
        </ErrorBoundary>
      </div>
    </div>
  );
}
