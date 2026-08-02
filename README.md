# Resolved

**They have AI to deny your complaint. Now you have AI to fight back.**

---

## What this is

Companies run AI at the front line of customer support — chatbots trained to stall, deflect, and quietly close tickets before a human ever reads them. Resolved flips that asymmetry.

Drop in a photo of a broken order, a screenshot of an overcharge, a forwarded email about a delayed delivery — any format, no cleanup required. Resolved reads it, builds a legally-grounded case, and pushes it through every escalation channel until someone with authority to pay you actually looks at it.

It's not a chatbot that helps you phrase a nicer email. It's an agent that runs the whole complaint lifecycle — extraction, strategy, drafting, escalation — so the fight is over before you've opened a second tab.

<p align="center">
  <img src="design-exports/Hackathon/screenshots/home-after-light.png" width="45%" alt="Resolved — Home screen, light mode" />
  <img src="design-exports/Hackathon/screenshots/home-after-dark.png" width="45%" alt="Resolved — Home screen, dark mode" />
</p>

---

## Why now

India has 250–350M+ online shoppers, and quick-commerce's 10–15 minute delivery promise is generating complaints faster than anyone can review them. Almost none of those complaints go anywhere — the formal path (National Consumer Helpline → e-Daakhil → consumer court) is slow enough that courts are sitting on a backlog of hundreds of thousands of cases, some taking years to close.

Meanwhile companies are quietly automating the other side: AI chatbots built to stall and deflect at scale. That's the asymmetry Resolved exists to close — for now, only one side of this fight has AI.

The model isn't unproven, just unbuilt here. Voxya already runs a paid, human-powered version of this in India. DoNotPay proved "AI fights bureaucracy for you" as a business in the US. Nobody's built the AI-native version for Indian consumer law yet.

---

## How it works

1. **Extract.** Drop in a photo, screenshot, or forwarded email. Claude's vision model pulls the vendor, order ID, amount, issue, severity, and timestamp straight off the evidence — no forms, no formatting rules.
2. **Strategize.** Resolved picks a vendor-specific play: the right channel, the right tone, and the exact clause of Indian consumer law to cite — e.g. Consumer Protection Act 2019 §2(11).
3. **Draft.** A firm, law-cited complaint letter streams in live via the Claude API, ready to send or edit.
4. **Escalate.** Ignored? Resolved climbs a five-step ladder on its own: vendor channel → public post → grievance officer → National Consumer Helpline → e-Daakhil consumer court. Zero further effort from you.

<!-- ADD SCREENSHOT: Capture screen (the evidence-upload step) here -->
<!-- ADD SCREENSHOT: Extracting screen (the pulsing-orb AI-reading state) here -->
<!-- ADD SCREENSHOT: Filed screen (the escalation ladder) here -->
<!-- Drop the three PNGs into design-exports/Hackathon/screenshots/ and swap these comments for
     ![Capture](...) / ![Extracting](...) / ![Filed](...) image tags, same pattern as above. -->

---

## Tech

React 18 + Vite. Claude API for vision-based fact extraction and streaming text generation. A full light/dark design system built on CSS custom properties — no UI framework, no component library.

---

## Current state

This is a front-end prototype, and the scope is deliberate, not accidental:

- **Two real AI integrations are live** — photo-to-facts extraction and complaint drafting both run against the Claude API.
- **Everything else is staged.** Strategy selection, escalation, and the dashboard run on fallback data so the demo never breaks mid-pitch.
- **No backend, no auth, no persistence.** State lives in React; refresh resets the app.
- **No real vendor or regulator integrations yet.** Filing, posting, and calling are simulated end states, not live actions.

That's the next build — not a gap nobody noticed.

---

## Run it locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. You'll need a `.env.local` with `VITE_ANTHROPIC_API_KEY=...` for the two live Claude calls to work.

---

Built by Arthi Vinod, product manager exploring AI product-building hands-on. [github.com/arthivinod](https://github.com/arthivinod)
