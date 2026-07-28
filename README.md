# Resolved

AI consumer-complaint agent for India. Drop in a photo, document, or forwarded
email and Resolved extracts the facts, picks a vendor-specific strategy, drafts
a firm law-cited complaint in four formats, and auto-escalates the case across
channels until you're paid. *They have AI. Now you do too.*

---

## Screenshots

| Light | Dark |
|---|---|
| ![Home — light](design-exports/Hackathon/screenshots/home-after-light.png) | ![Home — dark](design-exports/Hackathon/screenshots/home-after-dark.png) |

---

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:5173/` in Chrome.

> The repo expects a `.env.local` with `VITE_ANTHROPIC_API_KEY=...`. Phase 2 will
> wire the two real Claude calls; this build runs entirely on staged data, so a
> placeholder value is fine.

---

## 90-second demo script

1. **Home** — "Companies are running AI to deny refunds at scale. Resolved is the AI on your side."
2. **Capture** — Tap *Try a sample — MacBook charger stopped working*. "Photo, document, or forwarded email — drop in any evidence; we don't care about format."
3. **Extracting** — Orb pulses. "AI reads the order, the vendor, the amount, the issue — straight from the evidence."
4. **Extracted** — Six fields stagger in. "Pulled out everything we need in 1.5 seconds. Tap any field to fix it."
5. **Strategy** — Expand any row. "It picks the tone, the legal hook, and the demand — and tells you *why* for each. ~82% forecast on similar Amazon electronics cases."
6. **Your move** — Letter streams in via typewriter. Switch tabs across Letter / Tweet / Call / Filing. "Same case, four channels. Edit, reword, or just file."
7. **Filed** — Escalation ladder. "Filed at Amazon. If they go quiet, the system escalates to a Grievance Officer, then a public post, then the NCH, then consumer court. You do nothing."
8. **Dashboard** — "Across the community: ₹91,208 recovered, 78% win rate. Food, flights, telecom, banking, electronics — all in one place."

---

## Known limitations

- **AI calls are simulated.** The two real Claude API integrations (vision
  extraction on screen 3, streamed drafting on screen 5) are spec'd in
  `design.md` §9 but not wired in this hackathon build. Every screen uses
  staged Amazon MacBook-charger data.
- **No backend.** "File now", "Post tweet", "Submit filing", and "Start call"
  all navigate to the Filed screen without contacting any vendor or regulator.
- **No file upload.** The Capture sub-options all route to Extracting with the
  staged demo case. The OS file pickers are not wired.
- **No persistence.** Mode toggle, in-flight cases, letter edits, and reword
  variants live in React state only. Refresh resets the app to Home in the
  user's OS dark/light preference.
- **One-vendor demo path.** Strategy, Your move, and Filed are tuned to the
  Amazon case. The other Dashboard cases (IndiGo, HDFC ERGO Health, Jio,
  Croma) are static cards.

---

## Tech stack

- **Vite 5** + **React 18** (plain JavaScript, no TypeScript)
- **CSS custom properties** for the dual-mode (light / dark) design system —
  `src/tokens.css` mirrors `design.md` §3 verbatim and is the only file
  outside `design.md` where hex literals are allowed
- **Inter** webfont via Google Fonts, with `tabular-nums` enabled for amounts
- **lucide-react** installed for icon access (current screens use inline SVGs
  matching the canonical Figma exports)
- Single-page app, state-based screen routing — no React Router

---

## Project layout

```
.
├── design.md                       # Product + design system spec — source of truth
├── design-exports/Hackathon/       # Canonical Figma exports (referenced when porting)
├── index.html                      # Vite root, loads Inter
├── package.json
├── src/
│   ├── App.jsx                     # 7-screen state router + mode state + ErrorBoundary
│   ├── main.jsx                    # React 18 bootstrap
│   ├── tokens.css                  # Light + dark CSS variable system + keyframes
│   ├── index.css                   # Global reset + body styles
│   ├── components/                 # Shared design-system components
│   │   ├── Aurora.jsx              # Dark-mode aurora backdrop
│   │   ├── BottomNav.jsx           # Floating glass nav, fixed-positioned
│   │   ├── ErrorBoundary.jsx       # Demo-safety fallback screen
│   │   ├── FeatureCard.jsx         # Home feature row
│   │   ├── GradientButton.jsx      # Primary CTA primitive
│   │   ├── ModeToggle.jsx          # Sun / moon 44×44 toggle
│   │   ├── Orb.jsx                 # 3-size animated brand orb
│   │   └── StepIndicator.jsx       # Saffron-soft step pill
│   └── screens/                    # One file per screen
│       ├── Home.jsx
│       ├── Capture.jsx
│       ├── Extracting.jsx
│       ├── Strategy.jsx
│       ├── YourMove.jsx
│       ├── Filed.jsx
│       └── Dashboard.jsx
└── vite.config.js
```
