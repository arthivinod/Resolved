# Resolved — Design Specification

> **Single source of truth** for the Resolved prototype. This document drives every build
> decision. No application code exists yet; the build is greenlit in a separate session.
>
> **Hard rule that governs the whole system:** every component references **CSS variables
> only**. No hex value appears anywhere outside this file. If a hex shows up in component
> code, it's a bug.

---

## 1. Product north star

**Vision:** *Resolved turns a photo of any bad order, delay, or overcharge into a firm,
law-cited complaint — and chases it until you're paid.*

**Primary persona — Aarav**
- 28, software engineer in Bangalore.
- ~8 Swiggy orders/week; 4–6 customer-service disputes per quarter (food, delivery, telecom, the odd flight).
- Loses **~₹2,400/year** to disputes he never bothers chasing — the effort isn't worth ₹200 of his evening.
- Tech-comfortable, time-poor, mildly cynical about support bots.

**Positioning — "They have AI. Now you do too."**
Companies deploy AI to deflect and deny refunds at scale; individuals give up because chasing
a small refund costs an hour. Resolved flips the asymmetry — the consumer finally has an agent
that knows the law, writes the letter, and never gets tired. That sentence is the emotional
core of the whole product.

---

## 2. Brand & voice

**Tone:** firm, citation-backed, never aggressive. Confident, not whiny. Polite but immovable.
Cites the exact clause. States a specific demand and deadline. Courteous in sign-off.

**5 voice do's and don'ts**

| # | Do | Don't |
|---|---|---|
| 1 | Cite the specific rule: *"Under §2(11) of the Consumer Protection Act, 2019, this is a deficiency in service."* | Threaten or insult: *"This is daylight robbery, I'll trash your ratings."* |
| 2 | State a precise ask + deadline: *"Refund ₹420 to source within 48 hours."* | Be vague: *"Please do the needful at the earliest."* |
| 3 | Stay factual and dated: *"Order #119284756, delivered 24 May, 9:42 PM."* | Pad with emotion: *"I'm extremely disappointed and frustrated…"* |
| 4 | Name the next authority: *"…failing which I will escalate to the Grievance Officer."* | Bluff about actions you won't take. |
| 5 | Sign off courteously: *"Thank you. I trust this will be resolved promptly."* | Shout — ALL CAPS, exclamation spam, emoji. |

**Brand meaning of color**
- **Saffron** = action and Indian identity. The primary accent. Buttons, the orb, progress, energy.
- **Trust blue (light) / trust lavender (dark)** = legal authority. Reserved for the regulatory/legal storytelling moment (e.g. the "India legal RAG" feature card) where the law itself is the point.
- **Success green (light) / lime (dark)** = winning a case. Used only for resolved/won states.

The deliberate saffron + trust-blue pairing is the brand's signature: *energy of the citizen,
authority of the law.*

---

## 3. Design tokens — DUAL MODE SYSTEM

The brand supports light and dark mode. Both share the same accent identity — only the base
shifts. **Light is the default**, following the OS via `prefers-color-scheme`.

### Light Mode (default)

```css
/* Base */
--bg-primary:      #FBF6EC;   /* warm cream */
--bg-surface:      #FFFFFF;
--bg-elevated:     #FBF6EC;
--border:          #E8DFCB;
--border-strong:   #D4C8AC;

/* Text */
--text-primary:    #1A1612;
--text-secondary:  #6A625A;
--text-tertiary:   #948975;

/* Brand accents */
--accent-saffron:        #C45F00;   /* primary */
--accent-saffron-bright: #FF7A1A;
--accent-saffron-soft:   rgba(255,153,51,0.08);
--accent-saffron-border: rgba(255,153,51,0.25);
--accent-trust:          #2E5BFF;   /* legal/regulatory */
--accent-trust-soft:     rgba(46,91,255,0.08);
--accent-trust-border:   rgba(46,91,255,0.25);

/* Semantic */
--success:               #1B5E20;
--success-soft:          rgba(27,94,32,0.10);
--warning:               #B07900;
--warning-soft:          rgba(176,121,0,0.10);

/* Gradients */
--gradient-hero: linear-gradient(135deg, #FF7A1A 0%, #FF9933 100%);
```

### Dark Mode (the "Maximum Contrast" indigo base)

```css
/* Base */
--bg-primary:      #07051A;   /* deep indigo-black */
--bg-surface:      #110D2E;
--bg-elevated:     #1A1538;
--border:          #1E1A45;
--border-strong:   #2D2858;

/* Text */
--text-primary:    #F4F4FA;
--text-secondary:  #8884AA;
--text-tertiary:   #5A5680;

/* Brand accents */
--accent-saffron:        #FF9933;
--accent-saffron-bright: #FFB85C;
--accent-saffron-soft:   rgba(255,153,51,0.13);
--accent-saffron-border: rgba(255,153,51,0.35);
--accent-trust:          #9B8AFF;   /* lavender-shifted for indigo background */
--accent-trust-soft:     rgba(155,138,255,0.18);
--accent-trust-border:   rgba(155,138,255,0.35);

/* Semantic */
--success:               #84CC16;   /* lime — pops on indigo */
--success-soft:          rgba(132,204,22,0.15);
--warning:               #FFB85C;
--warning-soft:          rgba(255,184,92,0.15);

/* Gradients */
--gradient-hero: linear-gradient(135deg, #FF9933 0%, #FFD93D 100%);

/* Ambient (dark mode only — the "cinematic" feel) */
--aurora-1: radial-gradient(circle, rgba(255,153,51,0.33) 0%, transparent 70%);
--aurora-2: radial-gradient(circle, rgba(155,138,255,0.25) 0%, transparent 70%);
```

**Hard rule (repeat):** components reference these variables only. No hex anywhere outside
this design.md. A hex in component code is a bug.

---

## 4. Typography scale

**Inter**, weights 400 / 500 / 600 / 700 / 800. Enable `tabular-nums` for amounts and stats.

| Token | Size | Line height | Letter spacing | Weight | Use |
|---|---|---|---|---|---|
| `caption`    | 10–11px | 1.3  | 0.1em UPPERCASE | 600 | section labels, eyebrows |
| `body-sm`    | 12–13px | 1.5  | 0               | 400 | subtitles, descriptions |
| `body`       | 14–15px | 1.55 | −0.01em         | 400/500 | primary body |
| `heading-sm` | 18–20px | 1.2  | −0.02em         | 600 | screen sub-headers |
| `heading`    | 24–28px | 1.15 | −0.025em        | 700 | screen titles |
| `display`    | 36–44px | 1.05 | −0.035em        | 700 | hero headlines |

**Display rule:** the hero `display` headline may contain **one** accent phrase rendered with
`--gradient-hero` via `background-clip: text` (e.g. *"Now you do too."*). Everything else is
`--text-primary`.

---

## 5. Spacing & radius

```
Spacing scale:  4   8   12   16   20   24   32   48
Radius scale:   6 (small chip)   12 (card)   16 (large card)
                18 (hero card)   20 (panel)  999 (pill)
```
Defaults: screen horizontal padding `20`, card padding `16–20`, section gaps `24–32`,
related-item gaps `12`, icon↔text gap `8`.

---

## 6. Components — exact specs

For each: structure, tokens used (both modes via variables), and states
(default / hover / active / disabled). All radii/spacing from §5; all colors via §3 variables.

### GradientButton (primary CTA)
- **Structure:** height `52–56`, `radius-full` (999), horizontal padding `24`, full-width by default; centered label, optional 20px leading icon (gap `8`).
- **Fill:** `--gradient-hero`. **Text:** white in light mode, `#07051A` (`--bg-primary` dark) in dark mode — i.e. always the high-contrast color against saffron-gold.
- **Shadow:** saffron glow — `0 8px 24px` of `--accent-saffron` at 35–45% opacity.
- **States:** hover → brightness +5%, glow grows; active → `scale(0.98)`, glow shrinks, `100ms ease-out`; disabled → `opacity 0.4`, no glow, no press.

### SecondaryButton
- **Structure:** same height/radius as GradientButton.
- **Fill:** transparent; `1.5px solid --border-strong`; text `--text-primary`.
- **States:** hover → border `--accent-saffron-border`, bg `--accent-saffron-soft`; active → `scale(0.98)`; disabled → `opacity 0.4`.

### Card
- `--bg-surface` background, `1px solid --border`, radius `16–20`, padding `16–20`.
- Elevated context: `--bg-elevated` + subtle shadow (dark) / hairline (light).

### EyebrowChip
- Pill (`radius-full`), `--accent-saffron-soft` bg, `1px solid --accent-saffron-border`, text `--accent-saffron`, `caption` type, padding `6 12`.
- Success variant (used on Filed): `--success-soft` bg + `--success` text/border.

### StatBadge
- Small label/value pair for status: **in progress** → `--accent-saffron`; **won** → `--success`; **escalated** → `--warning`. Each on its matching `*-soft` background, `radius-sm` (6), `caption`/600, lowercase text.

### DataRow
- Label (`caption`, `--text-secondary`) on the left + value (`body`, `--text-primary`) on the right; divided by a `1px --border` bottom rule (omit on last row); vertical padding `14`.

### FeatureCard (home "how we tip the scales")
- Icon-in-rounded-square (40–44, `radius-md`) + title (`heading-sm`) + subtitle (`body-sm`, `--text-secondary`).
- **Default:** icon container `--accent-saffron-soft`, icon `--accent-saffron`.
- **CRITICAL — the "India legal RAG" card** uses `--accent-trust-soft` container + `--accent-trust` icon. This is the brand storytelling moment where **saffron and trust-blue appear together** (citizen energy + legal authority). Do not make this card saffron.

### CaseCard (dashboard row)
- Vendor (with monogram/emoji avatar) + StatBadge + detail line (`body-sm`, `--text-secondary`) + ₹ amount (`body`/600, `tabular-nums`).
- Status colors: won = `--success`, in-progress = `--accent-saffron`, escalated = `--warning`.
- Press: `scale(0.99)` + `--bg-elevated` fill.

### StepIndicator
- Pill at top of flow screens, pattern `"Step 2 of 4 · Extracted"`. `--accent-saffron-soft` bg, `--accent-saffron` text, `caption`/600, height ~28, padding `0 12`.

### Orb (animated)
- Gradient circle, **3 sizes: 80 / 120 / 180px**.
- Radial gradient stops: **dark mode** saffron→gold (`#FF9933 → #FFD93D`); **light mode** saffron→bright-orange (`#FF9933 → #FF7A1A`) — expressed via the hero gradient / accent vars.
- Soft outer glow using `--accent-saffron`. **Pulse animation 2s ease-in-out infinite** (see §8). The 180px size is the full-screen processing orb.

### EscalationTimeline
- Vertical, `2px` connector line, `16px` circle nodes.
- **Completed node** = `--gradient-hero` fill (with check). **Pending node** = transparent fill with `--border-strong` ring. Current node pulses subtly.
- Each step: day/stage label (`caption`, `--accent-saffron`), action title (`body`/600), authority (`body-sm`, `--text-secondary`).

### BottomNav
- Fixed at bottom; surface at **85% opacity** with `backdrop-filter: blur(20px)`, `1px solid --border`, radius `20`, floats above safe-area inset.
- **Active tab:** `--accent-saffron-soft` bg pill + `--accent-saffron` icon & label. Inactive: `--text-tertiary`.
- Reduced-transparency / fallback: solid `--bg-elevated`.

### ModeToggle
- Small **icon-only** button in the header (sun / moon). Swaps mode and persists in React component state only (no storage). Tap target ≥44×44; uses `--text-secondary`, hover `--accent-saffron`.

---

## 7. Screen-by-screen layout

Shared shell: single column, `max-width 420px`, centered; header row (wordmark + ModeToggle);
BottomNav floating (hidden on full-screen processing screens). Dark mode shows auroras behind;
light mode shows the cream base.

### 1. Home
- **Top:** wordmark + ModeToggle.
- **Hero:** EyebrowChip → `display` headline with `--gradient-hero` text-clip on the accent phrase *"Now you do too."* → subhead (`body`, `--text-secondary`).
- **CTA:** primary GradientButton **"New complaint"**.
- **Content:** section label `caption` *"How we tip the scales"* → **3 FeatureCards** (one is the trust-color "India legal RAG" card) → **StatCard**: *"₹91,208 recovered · 78% win rate"*.
- **Reuses:** EyebrowChip, FeatureCard, GradientButton, Card/StatBadge, BottomNav.

### 2. Capture
- **Top:** StepIndicator (`Step 1 of 4 · Capture`).
- **Hero:** heading *"What went wrong?"* + short subline.
- **Content:** 3 large tap-target input options — **camera**, **screenshot**, **"Try a sample"** — each a Card with a saffron-gradient icon container; optional textarea ("Add details").
- **CTA:** "Continue" (sample auto-advances; the demo-safe path).
- **Reuses:** StepIndicator, Card, text input/textarea, GradientButton.

### 3. Extracting (full-screen)
- **Content:** large **Orb (180px)** animating, centered; EyebrowChip *"Reading the evidence"*; heading *"Looking at your photo, extracting facts…"*. No nav chrome.
- This is where **real Claude vision Call 1** runs; on completion auto-advances. On failure → staged Swiggy data, still advances.

### 4. Extracted
- **Top:** StepIndicator (`Step 2 of 4 · Extracted`).
- **Hero:** heading *"Here's what I see"*.
- **Content:** photo thumbnail + a Card of **DataRows**: vendor, order ID, amount, issue, severity, delivered (time).
- **CTA:** GradientButton **"Confirm — pick the play"**.
- **Reuses:** StepIndicator, Card, DataRow, GradientButton.

### 5. Strategy
- **Top:** StepIndicator (`Step 3 of 4 · Strategy`).
- **Hero:** heading *"Here's the play"*.
- **Content:** Card with **4 DataRows** — channel, tone, legal hook, demand — each followed by an *italic, muted "why this approach?"* line (`body-sm`, `--text-secondary`).
- **CTA:** GradientButton **"Draft the complaint"**.

### 6. Drafted
- **Top:** StepIndicator (`Step 4 of 4 · Draft`).
- **Hero:** heading (e.g. *"Your complaint"*).
- **Content:** large Card containing the **streaming complaint letter** (typewriter cursor during streaming), with a saffron **corner accent bracket**.
- **CTA:** GradientButton **"File now"** (fades in once streaming completes).
- **Real Claude text Call 2** runs here (streamed). On failure → staged template via the same typewriter.

### 7. Filed
- **Content:** small **Orb** celebration; **success** EyebrowChip; heading *"Case #RV-00214"*; section label *"The escalation ladder"*; **EscalationTimeline (5 steps)**: filed → Twitter escalation → Grievance Officer → NCH → e-Daakhil consumer court; a `--accent-saffron-soft` callout *"You do nothing. We watch for the reply."*.
- **CTA:** GradientButton **"See all my cases"**.

### 8. Dashboard
- **Top:** heading *"Your cases"* + stat line *"₹91,208 recovered · 8 cases resolved this year"*.
- **Content:** 5 **CaseCards**:
  - Swiggy — in-progress — **₹420**
  - IndiGo — won — **₹7,500**
  - HDFC ERGO — escalated — **₹45,000**
  - Jio — won — **₹288**
  - Croma — won — **₹38,000**
- **Reuses:** CaseCard, StatBadge, BottomNav (Cases active).

---

## 8. Animation & motion

- **Orb pulse:** `2s ease-in-out infinite`, `scale 1 → 1.05`, opacity `0.55 → 0.8`.
- **Typewriter draft:** reveal **3 chars per 12ms** tick; cursor blink `0.9s steps(2) infinite`; remove cursor on completion.
- **Button press:** `scale(0.98)`, `100ms ease-out`.
- **Mode transition:** `250ms ease` on all color / background properties.
- **Screen transitions:** simple **opacity fade, 200ms** (no slide — keeps the demo snappy).
- All motion respects `prefers-reduced-motion`: freeze orb, instant text, no fades.

---

## 9. AI integration spec

**Two real Claude API calls.** Both use model `claude-sonnet-4-20250514`, endpoint
`https://api.anthropic.com/v1/messages`. Everything else is mocked.

> Note: a newer model (`claude-sonnet-4-6`) exists; swap the model string if you want the
> latest. The doc keeps the specified ID.

### Call 1 — Photo extraction (Extracting screen)
- **Input:** base64 image + text instruction.
- **System prompt (intent):** extract `vendor`, `vendorLogo` (emoji), `orderId`, `amount`, `issue`, `severity`, `deliveredAt` from the photo. Respond with **only** a JSON object with those 7 keys — no prose, no markdown fences. Unknown fields → null. Infer severity from consumer harm.
- **Output:** JSON, 7 keys.
- **Fallback (API fails / invalid JSON / timeout):** use staged Swiggy data —
  `{ vendor: "Swiggy", vendorLogo: "🛵", orderId: "#119284756", amount: "₹420", issue: "spillage", severity: "High", deliveredAt: "May 24, 9:42 PM" }`. **The demo never breaks.**

### Call 2 — Complaint drafting (Drafted screen)
- **Input:** extracted facts as structured text + the user's optional note.
- **Prompt rules:** firm, polite, citation-backed; cite the **vendor's own policy** + the relevant **Indian regulation**; demand refund **to source, not credit**; time-bound; **120–180 words**; start *"Hi [Vendor] team,"*; end *"Thank you."*.
- **Output:** plain-text letter body.
- **Display:** streamed in with the typewriter effect (3 chars / 12ms).
- **Fallback:** a pre-written Swiggy complaint template with the same structure, rendered via the same typewriter.

---

## 10. Mocked data

- **Sample Swiggy photo:** a bundled local asset (e.g. `/public/sample/swiggy-spill.jpg`) — a staged image of a damaged/spilled order. (Use a bundled asset, not an external URL, so the demo works offline.)
- **5 dashboard case records** (see §7.8): Swiggy in-progress ₹420, IndiGo won ₹7,500, HDFC ERGO escalated ₹45,000, Jio won ₹288, Croma won ₹38,000.
- **Escalation ladder template (5 steps):**
  1. Complaint filed (vendor channel)
  2. Public escalation on Twitter/X
  3. Grievance Officer notice
  4. National Consumer Helpline (NCH, 1915)
  5. e-Daakhil — District Consumer Disputes Commission
- **Vendor playbook — Swiggy (full JSON example):**

```json
{
  "swiggy": {
    "channel": "Swiggy in-app Help + email to grievances@swiggy.in",
    "tone": "firm, factual",
    "legalHook": "Consumer Protection Act, 2019 §2(11) (deficiency in service) + Consumer Protection (E-Commerce) Rules, 2020",
    "demand": "Full refund to source (not Swiggy Money) within 48 hours",
    "escalationSteps": [
      { "stage": "filed",            "channel": "in-app + grievances@swiggy.in", "authority": "Swiggy Support" },
      { "stage": "public",           "channel": "Twitter/X @Swiggy",             "authority": "Swiggy Social" },
      { "stage": "grievanceOfficer", "channel": "Grievance Officer email",       "authority": "Swiggy Grievance Officer" },
      { "stage": "regulator",        "channel": "National Consumer Helpline 1915","authority": "NCH / Dept. of Consumer Affairs" },
      { "stage": "court",            "channel": "e-Daakhil",                     "authority": "District Consumer Disputes Commission" }
    ]
  }
}
```

- **Stub keys for future expansion** (shape only, fill later):

```json
{
  "amazon":   { "channel": "", "tone": "", "legalHook": "", "demand": "", "escalationSteps": [] },
  "indigo":   { "channel": "", "tone": "", "legalHook": "", "demand": "", "escalationSteps": [] },
  "jio":      { "channel": "", "tone": "", "legalHook": "", "demand": "", "escalationSteps": [] },
  "hdfcErgo": { "channel": "", "tone": "", "legalHook": "", "demand": "", "escalationSteps": [] }
}
```

---

## 11. Mode switching

- **Default mode:** light, matching the OS via `prefers-color-scheme`.
- **Toggle:** ModeToggle in the header; mode held in **React component state only** (no persistence — resets on reload).
- **Implementation:** swap the active CSS-variable set (light vs dark block) on a root element; **all components reference CSS variables only**, so nothing else changes.

---

## 12. Accessibility & responsive

- **Mobile-first, `max-width: 420px`, single column.**
- **Desktop:** center the 420px column; in **dark mode** let the aurora background bleed off the edges; in **light mode** continue the cream paper base. Reads as intentional, not a stretched mobile page.
- **Contrast:** WCAG **AA** on all text/background combinations — verify **each** combination in **both** modes (light cream and dark indigo).
- **Focus rings:** `2px solid --accent-saffron` with `2px` offset on all interactive elements; never remove without an equivalent.
- **Tap targets:** minimum `44×44px`.
- Color is never the only signal (status always carries a word); decorative orb/aurora are `aria-hidden`; streamed text region is `aria-live="polite"`.

---

## 13. What we are NOT building (anti-scope)

Explicitly **do not** include:
- Authentication / login / signup
- Real backend or database
- Real vendor API integrations (no actual filing)
- Push notifications
- Settings / preferences (beyond the mode toggle)
- Onboarding flow / tooltips
- Search functionality
- Marketing pages
- Real consumer-court filing
- Persistent storage

If you find yourself wanting any of these, **stop** and add it to a **"Phase 2"** note instead
of building it.

---

## 14. Demo script reference

**The 90-second happy path:**
Home → tap **"New complaint"** → tap **"Try a sample"** → orb animation (Extracting) →
**Extracted** facts → **Strategy** → **Draft** streams in → tap **"File now"** → **Filed** +
escalation ladder → tap **"See all my cases"** → **Dashboard**.

**One-line pitch per screen:**
1. **Home** — "Companies use AI to deny you. Resolved is your AI."
2. **Capture** — "Photo, screenshot, or sample — drop in any mess."
3. **Extracting** — "Claude is reading the photo right now — a real vision call."
4. **Extracted** — "It pulled vendor, order, amount, issue, severity — automatically."
5. **Strategy** — "It picked the channel, tone, and the exact law — and tells you why."
6. **Drafted** — "Watch it write the complaint live, citing the Consumer Protection Act."
7. **Filed** — "Filed. Here's the 5-step ladder it runs if they go quiet. You do nothing."
8. **Dashboard** — "And it's not just food — flights, banking, telecom, electronics. ₹91k recovered."
```
