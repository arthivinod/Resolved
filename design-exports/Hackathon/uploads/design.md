# Resolved — Design System

> **What this file is.** The single source of truth for Resolved's *visual language* —
> tokens, components, motion, and accessibility rules. Claude (or any developer) consults
> this when designing or building any mockup so that everything looks like one product.
>
> **What this file is _not_.** It does not define screens, user flows, AI/prompt specs,
> mocked data, vendor playbooks, or demo content. Those are separate documents. If a
> decision is about *what a screen shows or does*, it does not belong here. If it is about
> *how anything looks or moves*, it does.
>
> **Aesthetic in one line:** premium AI dark mode — deep black canvas, aurora glow, a living
> gradient orb, and one hot magenta→purple accent used sparingly and confidently.

---

## 1. Brand foundation

| | |
|---|---|
| **Name** | Resolved |
| **Tagline** | *They have AI. Now you do too.* |
| **Personality** | Calm, precise, quietly powerful. An expert ally, not a hype machine. |
| **Feeling to evoke** | "Someone capable is now on my side." Confidence, relief, momentum. |

### Aesthetic principles
1. **Black-first.** The canvas is near-black. Color is earned, not sprayed — the gradient is a spotlight, used on one or two elements per view.
2. **One accent, three stops.** Magenta → purple → deep-purple. Never introduce a second accent hue.
3. **Glow over borders.** Depth comes from soft aurora glows and shadows, not heavy strokes. Borders are whisper-thin.
4. **The orb is the soul.** The animated gradient orb represents the AI working. Reuse it as the brand's living mark.
5. **Tight, editorial type.** Large display headlines with negative letter-spacing and a single italic gradient phrase for emphasis.
6. **Generous negative space.** Let elements breathe; crowding kills the premium feel.

### Voice & tone (for any UI copy)
Firm, citation-backed, courteous-but-immovable. Confident, never aggressive or whiny.

| Do | Don't |
|---|---|
| Cite the specific rule: *"Under §2(11) of the Consumer Protection Act, 2019…"* | Threaten or insult: *"This is daylight robbery, I'll trash your ratings."* |
| State a precise ask + deadline: *"Refund ₹480 within 48 hours."* | Be vague: *"Please do the needful at the earliest."* |
| Stay factual and dated: *"Order #SW-8842, placed 14:32, 27 May."* | Pad with emotion: *"I'm extremely disappointed and frustrated…"* |
| Name the next authority: *"…or I escalate to the grievance officer."* | Bluff about actions you won't take. |
| Sign off courteously: *"I trust this will be resolved promptly."* | Shout — ALL CAPS, exclamation spam, emoji. |

Microcopy is short, lowercase-friendly for labels/badges, and never exclaims. Numbers are concrete (₹, days, clause numbers).

---

## 2. Design tokens

All values are literal. Implement as CSS custom properties or a JS token object; do not hardcode raw hex/px in components — reference these names.

### 2.1 Color

```css
:root {
  /* Canvas & surfaces */
  --bg:            #0A0A0F;  /* page background */
  --surface:       #15151D;  /* cards, sheets */
  --surface-2:     #1C1C26;  /* elevated / pressed / nested */
  --border:        #26262F;  /* default hairline border */
  --border-strong: #34343F;  /* dividers on dark, dotted rails */

  /* Text */
  --text:          #F4F4F8;  /* primary (near-white, low glare) */
  --text-muted:    #8A8A99;  /* secondary copy, labels */
  --text-faint:    #5A5A66;  /* captions, disabled, timestamps */
  --on-accent:     #FFFFFF;  /* text/icons on the gradient */

  /* Accent — the only accent. Three stops. */
  --accent-1:      #FF4D8F;  /* magenta */
  --accent-2:      #C726E6;  /* purple */
  --accent-3:      #6B1FB3;  /* deep purple */
  --accent:        #FF4D8F;  /* single-color accent uses (focus rings, icons) */

  /* Status */
  --status-progress: #FF4D8F;  /* in-progress (accent) */
  --status-won:      #7BD89E;  /* won (green) */
  --status-escalated:#FFC966;  /* escalated (amber) */

  /* Status badge fills (hue @ 12% on dark) */
  --tint-progress:   rgba(255, 77,143,0.12);
  --tint-won:        rgba(123,216,158,0.12);
  --tint-escalated:  rgba(255,201,102,0.12);
}
```

**Primary gradient** (buttons, orb, gradient text, key accents):
```css
--gradient: linear-gradient(135deg, #FF4D8F 0%, #C726E6 52%, #6B1FB3 100%);
```

**Gradient text** (the one italic accent phrase per display headline):
```css
background: var(--gradient);
-webkit-background-clip: text; background-clip: text;
color: transparent;
```

**Aurora background** — 2–3 fixed radial blobs behind everything, heavily blurred, low alpha. Recipe:
```css
/* layered radial-gradients on a full-viewport fixed element, filter: blur(90px) */
radial-gradient(40% 35% at 18% 12%, rgba(255, 77,143,0.26), transparent 70%),
radial-gradient(45% 40% at 85% 20%, rgba(199,38,230,0.22), transparent 72%),
radial-gradient(50% 45% at 60% 95%, rgba(107,31,179,0.20), transparent 75%)
```
Aurora alpha range `0.18–0.28`, blur `80–120px`. Never let it reduce text contrast — keep blobs off primary reading areas or dim them under content.

### 2.2 Typography

**Family:** `Inter` (fallback: `system-ui, -apple-system, "Segoe UI", sans-serif`). Weights 400/500/600/700/800. Enable `font-feature-settings: "cv11", "ss01";` if available for cleaner glyphs. Tabular numerals (`font-variant-numeric: tabular-nums`) for amounts/stats.

| Token | Size | Line-height | Letter-spacing | Weight | Use |
|---|---|---|---|---|---|
| `caption`    | 10px | 1.3  | +0.08em | 600 | overline labels, step pills (often UPPERCASE) |
| `micro`      | 12px | 1.4  | +0.01em | 500 | badges, helper text, timestamps |
| `body-sm`    | 14px | 1.5  | 0       | 400 | secondary copy, data values |
| `body`       | 16px | 1.55 | 0       | 400 | primary body, letter text |
| `title`      | 20px | 1.3  | −0.01em | 600 | card titles, subheads |
| `heading`    | 24px | 1.25 | −0.02em | 700 | section headings |
| `display-sm` | 32px | 1.1  | −0.03em | 700 | secondary hero |
| `display`    | 44px | 1.04 | −0.03em | 800 | primary hero |

**Display rule:** each display/display-sm headline may contain **exactly one** italic gradient-text phrase for emphasis (e.g. *"Now you do too."*). Everything else stays `--text`. Don't gradient whole headlines.

### 2.3 Spacing

4-point scale. Reference by step, not raw px.

```
space-1: 4    space-2: 8    space-3: 12   space-4: 16
space-5: 20   space-6: 24   space-7: 32   space-8: 48
```
Defaults: screen horizontal padding `20`, card padding `20`, gap between sections `24–32`, gap between related items `12`, inline icon↔text gap `8`.

### 2.4 Radius

```
radius-sm: 8     /* badges, small pills, tints */
radius-md: 12    /* inputs, small cards, thumbnails */
radius-lg: 16    /* default cards */
radius-xl: 18    /* large buttons, prominent cards */
radius-2xl: 20   /* sheets, hero cards, bottom nav (rounded form) */
radius-full: 999 /* pill buttons, circular badges, status chips */
```

### 2.5 Elevation & shadow

```css
--shadow-card:    0 1px 0 rgba(255,255,255,0.03) inset;        /* + 1px border */
--shadow-raised:  0 12px 40px rgba(0,0,0,0.50);                /* sheets, nav, popovers */
--glow-accent:    0 8px 28px rgba(199,38,230,0.45);            /* primary CTA / orb */
--glow-accent-sm: 0 4px 16px rgba(255, 77,143,0.40);           /* small accented elements */
```
Depth hierarchy: flat surface → `--shadow-card` → `--shadow-raised` → glow (reserved for accented/interactive moments).

---

## 3. Component library

Specs are self-contained and reusable. Sizes in px, colors as token names. States listed where they apply. No screen-specific behavior here.

### GradientButton — primary CTA
- **Shape:** height `56`, `radius-full`, horizontal padding `24`, full-width by default.
- **Fill:** `--gradient`; text `--on-accent`, `body`/600, `letter-spacing −0.01em`, centered; optional leading icon (20px, gap `8`).
- **Shadow:** `--glow-accent`.
- **States:** hover → brightness +6% & glow grows slightly; **press** → `scale(0.97)` + glow shrinks, `120ms ease-out`; disabled → `opacity 0.4`, no glow, no press.
- **Ghost variant:** transparent fill, `1px solid --border`, text `--text`; hover → border `--border-strong` + `surface-2` fill. Used for secondary actions.

### Card
- **Base:** `--surface`, `1px solid --border`, `radius-lg`, padding `20`, `--shadow-card`.
- **Elevated variant:** `--surface-2` + `--shadow-raised` (for floating/overlay contexts).
- **Bracket variant (highlight):** adds **accent corner brackets** — L-shaped strokes (2px, ~16px legs, `--gradient`) at top-left and bottom-right corners only. Decorative; reserve for hero/highlight cards. Brackets sit *inside* padding, don't replace the border.

### StatBadge — a labeled metric
- **Layout:** value above, label below; left-aligned.
- **Value:** `display-sm` (32/700), either `--text` or gradient-text for the marquee metric; `tabular-nums`.
- **Label:** `caption` (10/600, +0.08em), `--text-muted`, UPPERCASE.
- **Grouping:** when shown in a row, separate items with a `1px` `--border` vertical divider and `space-5` gap.

### Orb — animated AI mark (3 sizes)
- **Sizes:** `sm 56` · `md 120` · `lg 220` (diameter in px).
- **Structure (3 stacked layers, centered):**
  1. **Halo** — circle at `1.6×` diameter, `--gradient` (or radial of `--accent-1`/`--accent-2`), `filter: blur(diameter×0.18)`, opacity `0.55`.
  2. **Ring** — circular element with a conic/linear `--gradient` stroke (~`diameter×0.06` thick), slowly rotating.
  3. **Core** — solid circle (`diameter×0.62`) of `--gradient` with a soft top-left radial highlight (`rgba(255,255,255,0.35)`); `--glow-accent`.
- **Motion:** see §4 (pulse + rotate). The orb is round at all sizes and never clipped by a card edge — give it ≥`space-3` clearance.

### StepIndicator — progress pill
- **Shape:** height `28`, `radius-full`, padding `0 12`, `--tint-progress` fill, `1px solid rgba(255,77,143,0.25)`.
- **Text:** `micro`/600. Pattern: a muted segment + an accent segment, e.g. `Step 2 of 4` (`--text-muted`) ` · ` `Extracted` (`--status-progress`).

### DataRow — label / value row
- **Layout:** flex space-between, vertical padding `14`, `1px solid --border` bottom divider (omit on last row).
- **Label:** `body-sm`, `--text-muted`, left; optional 16px leading icon.
- **Value:** `body-sm`/600, `--text`, right, may wrap. Value may itself be a StatusBadge or a colored dot + text (e.g. severity).

### EscalationTimeline — vertical, dotted connector
- **Rail:** left column ~`24` wide. A `2px` **dashed** vertical line (`--border-strong`) connects nodes.
- **Node:** `10px` circle. **Done/current** → `--gradient` fill (done shows a check; current pulses, see §4). **Future** → hollow, `1.5px --border-strong` border, transparent fill.
- **Step content** (right of rail, gap `12`, vertical gap between steps `space-5`): day label (`caption`/600, `--status-progress`), action title (`body-sm`/600, `--text`), authority/sub (`micro`, `--text-muted`).

### CaseCard — list row
- **Container:** Card base, horizontal flex, padding `16`, gap `12`, align-center.
- **Leading avatar:** `44×44`, `radius-md`, vendor monogram or logo on a tinted/`--surface-2` square.
- **Middle (flex-1):** vendor name (`title`/600, `--text`) · issue one-liner (`body-sm`, `--text-muted`, truncate 1 line) · amount (`body`/600, `--text` or gradient, `tabular-nums`).
- **Trailing:** StatusBadge stacked above a `chevron` (16px, `--text-faint`); optional last-updated `micro` `--text-faint`.
- **Press:** whole card `scale(0.99)` + `--surface-2` fill, `120ms`.

### StatusBadge
- **Shape:** `radius-sm` squircle, padding `4 10`, `micro`/600, **lowercase** text.
- **Variants (text color / background):**
  - in-progress → `--status-progress` on `--tint-progress`
  - won → `--status-won` on `--tint-won`
  - escalated → `--status-escalated` on `--tint-escalated`
- Always pair color with a word (never color alone). Verify text hits ≥4.5:1 on its tint; brighten the text hue if needed.

### BottomNav — floating glass
- **Shape:** fixed near bottom, centered, width = container − `space-4` each side, height `64`, `radius-2xl`, floats `16` above the safe-area bottom.
- **Glass:** `background: rgba(21,21,29,0.7)`, `backdrop-filter: blur(20px)`, `1px solid rgba(255,255,255,0.06)`, `--shadow-raised`.
- **Items:** evenly spaced; each = icon (24px) + `caption` label. **Active** → gradient-filled icon + `--text` label + a small gradient under-dot/glow. **Inactive** → `--text-muted`.
- **Reduced-transparency fallback:** solid `--surface-2` instead of glass (see §5).

### Text input / Textarea
- **Shape:** `--surface-2` fill, `1px solid --border`, `radius-md`, padding `14 16`, `body`, `--text`. Placeholder `--text-faint`.
- **Focus:** border → `--accent`, plus `--glow-accent-sm`. Label/helper in `micro` `--text-muted` above/below.
- Textarea: min-height `96`, `resize: vertical`.

---

## 4. Motion language

Motion is smooth, slow, and purposeful — it should feel like a calm intelligence, never busy. Standard easing `cubic-bezier(0.22, 1, 0.36, 1)` (gentle ease-out); standard durations: micro `120ms`, UI `250ms`, ambient `2–24s`. **Every animation below must be disabled or reduced under `prefers-reduced-motion`** (see §5).

- **Orb pulse:** `scale 1 ↔ 1.06` over `2.4s ease-in-out infinite`; halo opacity `0.55 ↔ 1.0` in sync; ring layer `rotate 0→360°` over `8s linear infinite`. Optional "thinking" intensifier: a `1.2s` highlight shimmer sweep across the core.
- **Typewriter (streamed text):** append text as it arrives (token-by-token reads naturally as typing). For non-streamed/staged text, simulate at ~`22ms/char`. Show a blinking caret `▌` (`--accent`) at `1s` `step-end`; remove the caret on completion. Keep the latest line in view (auto-scroll).
- **Aurora drift:** blobs translate within `±6%` and scale `1 ↔ 1.05` over `18–24s ease-in-out alternate`, offset so they never sync. Barely perceptible.
- **Success celebration:** orb scales in `0.8 → 1` (`400ms` spring-ish ease-out) → checkmark stroke draws via `stroke-dashoffset` (`300ms`) → one ring pulses outward `scale 1 → 1.8`, `opacity 0.4 → 0` (`700ms`). Total under `1s`. (Confetti/particles are optional and only if they read premium — default to no confetti.)
- **Button press:** `scale(0.97)` + glow shrink, `120ms ease-out`, spring back on release.
- **Screen/section transitions:** forward = `translateY(8px) + opacity 0→1`, `250ms`. Full-bleed/processing moments cross-fade (`opacity`, `300ms`). No horizontal slamming or bouncy overshoot.

---

## 5. Accessibility & responsive foundations

### Responsive
- **Mobile-first, single column, `max-width: 420px`,** centered. Horizontal padding `20`.
- **Desktop:** keep the 420px content column centered; let the **aurora bleed full-viewport** behind it with a subtle vignette toward the edges. The app should read as an intentional centered experience, not a stretched mobile page.
- Respect safe-area insets (`env(safe-area-inset-*)`), especially for the floating BottomNav.

### Contrast (targets, on `--bg` / surfaces)
- `--text` on `--bg` ≈ 18:1 (AAA). `--text-muted` ≈ 6.3:1 (AA body, AAA large) — don't use it below `12px`.
- `--text-faint` is for ≥14px non-essential text only; never for primary content.
- StatusBadge / gradient text must each clear **4.5:1** against their actual background; verify and brighten if short.

### Focus & interaction
- Visible focus on all interactive elements: `2px solid --accent` outline with `2px` offset. Never remove an outline without an equivalent replacement.
- Minimum tap target `44×44` (pad small icons/badges to reach it).
- Use real semantic elements (`<button>`, `<a>`, headings in order). Decorative orb/aurora are `aria-hidden`. Live-updating text regions use `aria-live="polite"`. Images carry alt text. Color is never the only signal (status always has a word).

### Reduced preferences
- `prefers-reduced-motion: reduce` → freeze the orb (static, optional slow opacity breathe only), stop aurora drift, render text instantly (no typewriter sim — real streams may still append), and skip the success ring/confetti.
- `prefers-reduced-transparency` (and as a safe default fallback) → replace glass surfaces (BottomNav, elevated cards) with solid `--surface-2`.
```
