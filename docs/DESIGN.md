---
version: "1.0"
name: shieldvault-design-system
description: >
  ShieldVault design constitution. Dark canvas with warm golden yellow as the singular brand
  signal. Architectural glass metaphor throughout: cards feel like illuminated surfaces,
  not painted rectangles. Inter at precise weights and negative tracking. No shadows.
  No crypto aesthetics. Premium banking through restraint.

colors:
  primary: "#E8C93A"
  primary-active: "#D4B530"
  primary-disabled: "#3A3220"
  primary-glow: "rgba(232, 201, 58, 0.10)"
  on-primary: "#0A0A09"

  canvas: "#0A0A09"
  surface-soft: "#111110"
  surface-card: "#1A1A18"
  surface-elevated: "#242422"
  surface-overlay: "#2E2E2A"

  ink: "#FFFFFF"
  body-strong: "#E6E6E6"
  body: "#CCCCCC"
  muted: "#888888"
  muted-soft: "#5A5A5A"

  hairline: "#2A2A28"
  hairline-strong: "#3A3A36"

  glass-bg: "rgba(255, 255, 255, 0.04)"
  glass-border: "rgba(255, 255, 255, 0.08)"
  glass-border-strong: "rgba(255, 255, 255, 0.14)"
  glass-tint: "rgba(232, 201, 58, 0.06)"
  glass-tint-strong: "rgba(232, 201, 58, 0.12)"

  success: "#22C55E"
  warning: "#F59E0B"
  error: "#EF4444"
  yield: "#22C55E"
  yield-bg: "rgba(34, 197, 94, 0.10)"

typography:
  display-xl:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: -2px
  display-lg:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -1.5px
  display-md:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: 26px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -1px
  display-sm:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: 22px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.5px
  balance-display:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.0
    letterSpacing: -2px
    fontVariantNumeric: tabular-nums
  title-lg:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.2px
  title-md:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: -0.1px
  title-sm:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  body-lg:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
  body-md:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
  body-sm:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
  caption:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  caption-uppercase:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 1.5px
  label:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  button:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: -0.01em
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0

radius:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  2xl: 28px
  card: 20px
  full: 9999px

spacing:
  1: 4px
  2: 8px
  3: 12px
  4: 16px
  5: 20px
  6: 24px
  8: 32px
  10: 40px
  12: 48px
  16: 64px
  screen-x: 24px
  screen-y: 32px

motion:
  duration-fast: 150ms
  duration-normal: 300ms
  duration-slow: 500ms
  duration-reveal: 700ms
  ease-out: "cubic-bezier(0.16, 1, 0.3, 1)"
  ease-in-out: "cubic-bezier(0.4, 0, 0.2, 1)"

components:
  button-primary:
    background: "{colors.primary}"
    color: "{colors.on-primary}"
    typography: "{typography.button}"
    radius: "{radius.md}"
    height: 52px
    padding: "0 24px"
  button-primary-active:
    background: "{colors.primary-active}"
    color: "{colors.on-primary}"
    radius: "{radius.md}"
    transform: scale(0.98)
  button-primary-disabled:
    background: "{colors.primary-disabled}"
    color: "{colors.muted}"
    radius: "{radius.md}"
  button-secondary:
    background: "{colors.surface-card}"
    color: "{colors.ink}"
    border: "1px solid {colors.hairline-strong}"
    typography: "{typography.button}"
    radius: "{radius.md}"
    height: 52px
    padding: "0 24px"
  button-ghost:
    background: "transparent"
    color: "{colors.muted}"
    typography: "{typography.button}"
  button-link:
    background: "transparent"
    color: "{colors.primary}"
    typography: "{typography.label}"
    textDecoration: none
  button-icon:
    background: "{colors.surface-card}"
    color: "{colors.body}"
    border: "1px solid {colors.hairline}"
    radius: "{radius.full}"
    size: 44px
  card-default:
    background: "{colors.surface-card}"
    border: "1px solid {colors.hairline}"
    radius: "{radius.card}"
    padding: "{spacing.6}"
  card-glass:
    background: "{colors.glass-bg}"
    border: "1px solid {colors.glass-border}"
    backdropFilter: "blur(16px)"
    radius: "{radius.card}"
    padding: "{spacing.6}"
  card-yellow:
    background: "{colors.primary}"
    color: "{colors.on-primary}"
    radius: "{radius.card}"
    padding: "{spacing.6}"
  input-default:
    background: "{colors.surface-card}"
    color: "{colors.ink}"
    border: "1.5px solid {colors.hairline-strong}"
    radius: "{radius.md}"
    height: 52px
    padding: "0 16px"
    typography: "{typography.body-md}"
  input-focused:
    border: "1.5px solid {colors.primary}"
  input-error:
    border: "1.5px solid {colors.error}"
  bottom-nav:
    background: "{colors.surface-soft}"
    border: "1px solid {colors.hairline}"
    height: 80px
  bottom-nav-active:
    color: "{colors.primary}"
  bottom-nav-inactive:
    color: "{colors.muted}"
  fab:
    background: "{colors.primary}"
    color: "{colors.on-primary}"
    size: 64px
    radius: "{radius.full}"
  visa-card-premier:
    background: "linear-gradient(135deg, #1A1A14 0%, #242418 60%, #1A1A14 100%)"
    accentBorder: "1px solid {colors.glass-border-strong}"
    chipColor: "#E8C93A"
  visa-card-premium:
    background: "linear-gradient(135deg, #0D0D0B 0%, #1E1E18 50%, #0D0D0B 100%)"
    accentBorder: "1px solid rgba(232,201,58,0.2)"
    chipColor: "#E8C93A"
  status-bar:
    background: "{colors.canvas}"
    color: "{colors.ink}"
    height: 44px
  device-frame:
    background: "{colors.canvas}"
    outerBackground: "#050504"
    borderRadius: 44px
    width: 390px
    height: 844px
---

## Overview

ShieldVault is a premium retail banking app backed by blockchain infrastructure. The blockchain never surfaces to the user. The experience must feel like premium banking — calm, precise, trustworthy — not like a crypto product.

The visual identity is built around three ingredients: **near-black surfaces**, **warm golden yellow**, and **architectural glass**. These three elements, used with extreme restraint, produce every screen in the product. The system succeeds when a user cannot determine whether the product is crypto-powered or not. Technology must be invisible.

**Key characteristics:**
- Near-black canvas (`{colors.canvas}` — #0A0A09). Dark mode is the default and only mode.
- Warm golden yellow (`{colors.primary}` — #E8C93A). The brand signal. Used for primary CTAs, balance highlights, yield indicators, and card accents only. Never decorative.
- Glass system: cards are illuminated dark surfaces with hairline borders, not painted boxes. No drop shadows.
- Inter at precise weights with negative letter-spacing. Single typeface, hierarchy built through size and weight alone.
- Motion is slow, physical, confident. Never bouncy or elastic.

---

## Design Philosophy

**Invisible technology.** The blockchain, USDC, yield vaults — none of this appears in the interface. The user sees their balance, their earnings, their card. Everything else is handled.

**Privacy through abstraction.** Amounts are shown only where necessary. The user understands they are protected without being told how.

**Architectural glass.** Cards do not float above surfaces. They rest on them — like glass panels placed on a dark table. The glass metaphor runs through photography, overlay treatments, and card borders.

**Luxury through restraint.** The fewer elements on screen, the more premium the product feels. Every element must justify its presence. Large negative space is a feature, not emptiness.

**Light as the primary decorative element.** The warm yellow behaves like natural light. It enters the interface softly — a glow on a card edge, a highlighted number, a button that catches light. It never floods a surface unless signaling a primary action.

---

## Brand DNA

**Personality:** Minimal. Editorial. Quiet. Confident. Architectural.

**References:** Apple Wallet, Revolut Ultra, Nothing (phone), COS, Monocle, Swiss Graphic Design, Dieter Rams, Muji.

**Anti-references:** Binance, MetaMask, Coinbase, any crypto-native aesthetic. No neon. No dark gradients trending purple. No animated mesh gradients. No glitch effects.

**Color identity:** Black / White / Warm Yellow. No blue. No purple. No brand gradient.

**The yellow test:** Does it look like natural light passing through glass? If it reads as electric, acid, or neon — it is wrong. The yellow should feel like late-afternoon sunlight.

**The crypto test:** Does any element remind a user of a crypto wallet? If yes — remove it.

---

## Design Principles

1. **One accent, used once.** The golden yellow appears on the single most important element per screen. If two things are yellow, neither is important.

2. **Surfaces illuminate, they do not decorate.** Cards derive their presence from a hairline border and a barely-lighter background, not from shadows or gradients.

3. **Typography carries the hierarchy.** Inter at 700 / 600 / 400, scaled with negative tracking. No color used to create hierarchy — only size and weight.

4. **Breathe.** The interface must have more negative space than content. If a screen feels full, remove something.

5. **Motion communicates, it does not entertain.** Every animation answers a question: where did this come from, where is it going. Timing is slow and physical. No bounce, no spring, no elastic.

6. **Three questions per copy state.** What is happening right now? What should the user do? What happens if they do nothing?

---

## Color System

### CSS Custom Properties

Map these directly into `src/styles/tokens.css`, replacing all existing color tokens:

```css
:root {
  /* Brand */
  --color-primary:          #E8C93A;
  --color-primary-active:   #D4B530;
  --color-primary-disabled: #3A3220;
  --color-primary-glow:     rgba(232, 201, 58, 0.10);
  --color-on-primary:       #0A0A09;

  /* Canvas & Surfaces */
  --color-canvas:           #0A0A09;
  --color-surface-soft:     #111110;
  --color-surface-card:     #1A1A18;
  --color-surface-elevated: #242422;
  --color-surface-overlay:  #2E2E2A;

  /* Text */
  --color-ink:              #FFFFFF;
  --color-body-strong:      #E6E6E6;
  --color-body:             #CCCCCC;
  --color-muted:            #888888;
  --color-muted-soft:       #5A5A5A;

  /* Borders */
  --color-hairline:         #2A2A28;
  --color-hairline-strong:  #3A3A36;

  /* Glass System */
  --color-glass-bg:           rgba(255, 255, 255, 0.04);
  --color-glass-border:       rgba(255, 255, 255, 0.08);
  --color-glass-border-strong:rgba(255, 255, 255, 0.14);
  --color-glass-tint:         rgba(232, 201, 58, 0.06);
  --color-glass-tint-strong:  rgba(232, 201, 58, 0.12);

  /* Semantic */
  --color-success:  #22C55E;
  --color-warning:  #F59E0B;
  --color-error:    #EF4444;
  --color-yield:    #22C55E;
  --color-yield-bg: rgba(34, 197, 94, 0.10);

  /* Legacy aliases — kept for migration only, remove after rebuild */
  --color-surface:        var(--color-canvas);
  --color-surface-raised: var(--color-surface-card);
  --color-surface-subtle: var(--color-surface-soft);
  --color-border:         var(--color-hairline);
  --color-border-strong:  var(--color-hairline-strong);
  --color-text-primary:   var(--color-ink);
  --color-text-secondary: var(--color-muted);
  --color-text-body:      var(--color-body);
  --color-text-muted:     var(--color-muted-soft);
}
```

### Color Roles

**`{colors.primary}` (#E8C93A) — Warm Gold**
The single brand accent. Used on: primary CTA backgrounds, active balance highlights, yield rate callouts, progress indicators, card chip accents, FAB background, selected state indicators.
Never used on: body text, decorative borders, secondary information, more than one element per screen without strong justification.

**`{colors.canvas}` (#0A0A09) — Near-black**
The default page floor. Every screen starts here. Slightly warm — not a pure RGB black, which reads as harsh.

**`{colors.surface-card}` (#1A1A18) — Card Surface**
All cards, drawers, modals, and form fields. Barely distinguishable from canvas in the dark — contrast comes from the hairline border, not the fill itself.

**`{colors.surface-elevated}` (#242422) — Elevated Surface**
Nested cards inside a card. Pressed states. Tooltips. One level above surface-card.

**`{colors.ink}` (#FFFFFF) — Primary Text**
Headlines, primary labels, amounts, CTAs on dark. Pure white.

**`{colors.body}` (#CCCCCC) — Body Text**
Default running text color. Slightly dimmed to reduce eye strain on dark backgrounds.

**`{colors.muted}` (#888888) — Secondary / Captions**
Footer labels, secondary info, placeholder text direction.

**`{colors.hairline}` (#2A2A28) — Default Border**
1px borders on all cards and dividers. Barely visible — suggests structure without asserting it.

**`{colors.glass-border}` (rgba(255,255,255,0.08)) — Glass Edge**
Used on cards that appear in overlay contexts (bottom drawer, modals). The white opacity reads as light catching a glass edge.

### Semantic Colors

| Color | Token | Use |
|---|---|---|
| Success | `{colors.success}` #22C55E | Completed transactions, confirmed deposits, yield active |
| Warning | `{colors.warning}` #F59E0B | Caution notes, pending states |
| Error | `{colors.error}` #EF4444 | Failed transactions, validation errors |
| Yield | `{colors.yield}` #22C55E | Yield rate, APY display, earning indicators |

---

## Typography

### Font Family

**Inter** — the only typeface. No serif counterpoint. No display font. The precision and legibility of Inter at bold weights, combined with tight negative tracking, creates the product's "machined" feel.

**JetBrains Mono** — crypto addresses, account numbers, mono-spaced data only.

Fallback: `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`.

### CSS Custom Properties

```css
:root {
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
}
```

### Type Scale

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `display-xl` | 40px | 700 | 1.05 | -2px | Landing hero headline, completion hero |
| `display-lg` | 32px | 700 | 1.1 | -1.5px | Section heroes, onboarding step titles |
| `display-md` | 26px | 700 | 1.15 | -1px | Card-level headlines, flow titles |
| `display-sm` | 22px | 700 | 1.2 | -0.5px | Sub-section headings, modal titles |
| `balance-display` | 36px | 700 | 1.0 | -2px | Account balance — tabular-nums always |
| `title-lg` | 18px | 600 | 1.3 | -0.2px | Card titles, pricing tier names |
| `title-md` | 16px | 600 | 1.4 | -0.1px | List item primaries, form section titles |
| `title-sm` | 14px | 600 | 1.4 | 0 | Badge labels, small card titles |
| `body-lg` | 17px | 400 | 1.55 | 0 | Intro paragraphs, ToS body |
| `body-md` | 15px | 400 | 1.55 | 0 | Default running text |
| `body-sm` | 13px | 400 | 1.55 | 0 | Secondary descriptions, hints |
| `caption` | 12px | 500 | 1.4 | 0 | Timestamps, metadata, fine print |
| `caption-uppercase` | 11px | 600 | 1.4 | 1.5px | Section labels, "NEW" badges, status chips |
| `label` | 13px | 500 | 1.4 | 0 | Form labels, nav items |
| `button` | 15px | 600 | 1 | -0.01em | All button text |
| `mono` | 14px | 400 | 1.55 | 0 | Addresses, account numbers, codes |

### Typography Rules

- Display headlines use weight 700, always with negative letter-spacing. Inter at 700 without negative tracking is too wide — the tightening creates the "premium machined" feel.
- Body text stays at weight 400. Medium (500) only for captions, labels, and navigation items.
- Semibold (600) for titles and buttons only.
- Weight 800 is not part of this system.
- Never use color alone to distinguish text levels — always combine with weight and size change.
- `balance-display` always uses `font-variant-numeric: tabular-nums`. Amounts must not shift as digits change.

---

## Radius

| Token | Value | Use |
|---|---|---|
| `{radius.xs}` | 4px | Small accent chips, divider caps |
| `{radius.sm}` | 8px | Small inline buttons, quick-amount chips |
| `{radius.md}` | 12px | Standard buttons, text inputs, form fields |
| `{radius.lg}` | 16px | Feature cards, choice cards |
| `{radius.xl}` | 20px | VISA card containers, balance cards |
| `{radius.2xl}` | 28px | Full-screen overlays, large modals |
| `{radius.card}` | 20px | The universal card radius — use this, not xl, for consistency |
| `{radius.full}` | 9999px | Pills, avatars, icon buttons, FAB, progress dots |

### Radius Rule

Use `{radius.card}` (20px) for all card surfaces. Use `{radius.md}` (12px) for all interactive controls (buttons, inputs). Use `{radius.full}` for circular elements only. Do not mix radii within the same component.

---

## Spacing

Base unit: **4px**.

```css
:root {
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* Screen-level layout */
  --screen-padding-x: 24px;
  --screen-padding-y: 32px;
}
```

### Spacing Rhythm

- **Within a component** (field label to input, icon to label): `{spacing.2}` (8px) or `{spacing.3}` (12px)
- **Between components on a screen** (card to card, section to section): `{spacing.4}` (16px) or `{spacing.6}` (24px)
- **Screen-edge padding**: `{spacing.screen-x}` (24px) horizontal, never less
- **Drawer/card internal padding**: `{spacing.6}` (24px)
- **Screen section gaps**: `{spacing.8}` (32px) minimum between major sections

---

## Grid

ShieldVault is mobile-first. The grid is single-column at all times within the mobile frame (390px device width).

**Device frame:** 390 × 844px (iPhone 14 equivalent). All design decisions are made at this size.

**Screen padding:** 24px horizontal. Never less. Content width = 342px.

**Two-column grids:** Used only for action grids (2-up), quick-amount chips (3-up), and settings lists. Never for primary content.

**External layout (device frame on desktop):** The device frame sits centered on a `{colors.canvas}` (#0A0A09) background with `padding: 40px 24px`. No viewport decoration — the background IS the canvas.

---

## Elevation

ShieldVault uses **no drop shadows**. Depth comes from surface color contrast and hairline borders only.

| Level | Treatment | Use |
|---|---|---|
| Floor | `{colors.canvas}` — no border | Screen background |
| Soft | `{colors.surface-soft}` — no border | Subtle zone tint, status bar fill |
| Card | `{colors.surface-card}` + `1px solid {colors.hairline}` | All cards, form fields, list containers |
| Elevated | `{colors.surface-elevated}` + `1px solid {colors.hairline-strong}` | Nested elements, pressed states |
| Overlay | `{colors.surface-card}` + `1px solid {colors.glass-border}` | Bottom drawer, modals |

### Why No Shadows

Drop shadows read as "floating objects" — a light-mode convention. On dark surfaces they produce muddy, low-contrast halos. The hairline border on a slightly-lighter surface achieves the same perceptual depth without the visual noise.

The one exception: the device frame itself (the phone bezel) uses a deep black shadow to distinguish the product from the page background. This is structural, not decorative.

---

## Glass System

Glass is the primary metaphor. It appears through surface treatments, photography direction, and translucent overlays. It never appears as a literal blur filter on everyday cards — it is reserved for contexts where material translucency is semantically meaningful.

### Glass Vocabulary

**Glass Card** — Used in overlay contexts (bottom drawer, modals, notification banners). Background: `{colors.glass-bg}` (rgba 4% white). Border: `{colors.glass-border}` (rgba 8% white). `backdrop-filter: blur(16px)` where the background content is visible.

**Glass Tint** — A warm yellow wash applied to cards that contain active or earning states. Background overlay: `{colors.glass-tint}` (rgba 6% yellow). Conveys warmth without asserting the yellow color at full strength.

**Glass Tint Strong** — Applied to the selected state of choice cards, active balance cards. Background overlay: `{colors.glass-tint-strong}` (rgba 12% yellow). Border shifts to `{colors.primary}` at 40% opacity.

**Glass Border** — The hairline edge of any card that appears above another card surface. Uses white opacity rather than a fixed gray — this reads as light catching a glass edge rather than a painted line.

### When to Use Each

| Surface | Background | Border |
|---|---|---|
| Screen background | `{colors.canvas}` | none |
| Standard card (screen) | `{colors.surface-card}` | `{colors.hairline}` |
| Card in overlay/drawer | `{colors.glass-bg}` | `{colors.glass-border}` |
| Active / selected card | `{colors.glass-tint-strong}` | rgba(232, 201, 58, 0.4) |
| Processing / loading state | `{colors.glass-tint}` | `{colors.hairline}` |

### Glass Rule

`backdrop-filter: blur()` is expensive on mobile. Only apply it to fixed/absolute overlays (bottom drawer backdrop, modals) where the blur creates a clear perceptual layer separation. Never apply it to scrollable content or list items.

---

## Gradient System

Gradients represent **light**, not color transitions. They are almost invisible.

### Gradient Tokens

```css
:root {
  /* Warm glow — subtle yellow light entering from top-left */
  --gradient-glow: radial-gradient(
    ellipse 80% 40% at 20% 0%,
    rgba(232, 201, 58, 0.06) 0%,
    transparent 60%
  );

  /* Surface warmth — applied to the canvas layer of hero screens */
  --gradient-canvas: radial-gradient(
    ellipse 60% 50% at 50% -10%,
    rgba(232, 201, 58, 0.05) 0%,
    transparent 70%
  );

  /* VISA card — premier tier */
  --gradient-card-premier: linear-gradient(
    135deg,
    #1A1A14 0%,
    #242418 60%,
    #1A1A14 100%
  );

  /* VISA card — premium tier */
  --gradient-card-premium: linear-gradient(
    135deg,
    #0D0D0B 0%,
    #1E1E18 50%,
    #0D0D0B 100%
  );
}
```

### Gradient Rules

- Gradients are radial and light-sourced — they simulate sunlight entering a space, not a color wash.
- The canvas gradient appears only on hero screens (landing, onboarding start, completed state). It is nearly invisible at 5% opacity.
- No linear gradients that transition between two distinct colors. No Instagram-style gradients. No purple-to-blue.
- VISA card gradients are very dark — the card derives its character from the chip color and borderlight, not the background gradient.

---

## Photography System

Photography is the primary emotional vehicle. All other decoration is secondary.

### Photography Direction

**Style:** Editorial. Museum-quality. Cinematic.

**Subjects:** Real people. Neutral expressions. No forced smiles. No stock-photography energy. Subjects should appear composed and unperformed — the same quality you see in COS or Acne Studios campaigns.

**Lighting:** Soft. Directional. Natural. Sources of light should be readable (window light, architectural reflection) but never harsh.

**Color treatment:** Near-monochrome or desaturated. Warm skin tones preserved, environment desaturated. Black and white is acceptable and preferred for human portraits.

**Negative space:** Large. The subject occupies 40–60% of the frame. The rest is tonal background.

### The Glass Layer

Every portrait in the product should place the subject behind a pane of architectural glass. This is the single most important photography rule.

The glass must:
- Create subtle distortion across part of the face or body — not obscuring identity, but filtering it
- Introduce soft edge doubling (refraction)
- Show faint reflections of light sources
- Create the feeling of privacy — the subject is present but protected

This visual motif communicates the product's core value (privacy, protection) without using any words.

**Reference treatments:** Richard Avedon portraits through exhibition glass. Walker Evans through diner windows. The glass is structural, not a filter.

### Photography Contexts

| Context | Treatment |
|---|---|
| Landing / hero screen | Full-bleed portrait, glass layer, large negative space, dark tone |
| Onboarding identity step | Neutral environmental portrait |
| Completion state | Wide shot with generous negative space, subject at ease |
| Yield / earnings screen | Abstract architectural photograph — light through glass, no people |
| Empty state | Abstract texture — paper, fabric, glass — no illustrations |

### What Photography Replaces

Illustration, icons as art, abstract gradient blobs, UI decoration. Whenever the temptation arises to add visual weight through illustration or decoration — use photography or negative space instead.

---

## Motion System

Motion in ShieldVault feels expensive. Slow. Physical. Like watching a high-quality door close or a precision instrument return to rest.

### Motion Tokens

```css
:root {
  --duration-fast:   150ms;
  --duration-normal: 300ms;
  --duration-slow:   500ms;
  --duration-reveal: 700ms;

  --ease-out:     cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out:  cubic-bezier(0.4, 0, 0.2, 1);
}
```

Remove `--ease-spring` entirely. Spring and bounce are not part of this system.

### Motion Principles

**Slow ease-out is the default.** Elements decelerate as they arrive — like physical objects. They do not overshoot. `{motion.ease-out}` + `{motion.duration-normal}` (300ms) for most transitions.

**Screen transitions:** `opacity 0 → 1` + `translateY(12px) → 0` at `{motion.duration-slow}` (500ms) `{motion.ease-out}`. Content slides up gently and fades in.

**Drawer open/close:** Height interpolation using Framer Motion spring config: `{ stiffness: 200, damping: 32, mass: 1 }`. Avoid `bounce` or `type: "spring"` without explicit damping — the default spring is too bouncy.

**Button press:** `transform: scale(0.97)` at `{motion.duration-fast}` (150ms). Instant on press, restores at same speed. No bounce back.

**Loading spinner:** `animation: spin 1.2s linear infinite`. Slow, deliberate — not the fast 0.8s spin of cheaper interfaces.

**Balance number change:** Counter animation at `{motion.duration-slow}` (500ms). Number counts up from 0 to final value using `{motion.ease-out}`. Only on first reveal or after deposit confirmation.

### What is Forbidden

- Bounce / elastic easing
- `spring` without explicit high damping
- Looping ambient animations
- Parallax scroll effects
- Microinteraction decorations (ripples, shine sweeps, particle effects)
- Fast transitions below 150ms on visible UI elements

### Framer Motion Configuration

```typescript
// Default page transition
const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
}

// Default drawer spring
const drawerSpring = {
  type: "spring",
  stiffness: 200,
  damping: 32,
  mass: 1
}

// Button press
const pressTransition = {
  type: "tween",
  duration: 0.15,
  ease: [0.4, 0, 0.2, 1]
}
```

---

## Iconography

**Style:** Geometric. 2px stroke. Rounded caps, square joins.

**Reference quality:** Apple SF Symbols, Phosphor Icons (regular weight).

**Size system:**
- 16px — inline body text, caption level
- 20px — standard UI icons (navigation, list items, buttons)
- 24px — primary screen actions, bottom nav
- 32px — card illustrations, action grid icons

**Color:** Icon color follows text color context. On dark surfaces: `{colors.muted}` default, `{colors.ink}` for active/emphasis, `{colors.primary}` for selected/highlighted.

**Never use:**
- Blockchain metaphors (chains, nodes, mining icons)
- Crypto symbols (Ethereum diamond, Bitcoin symbol)
- Lock icons implying blockchain confirmations (lock = security, fine; lock = blockchain signing, not fine)
- Rounded cartoon-style icons (Noto Emoji quality)

**Preferred icon meanings:**

| Action | Icon |
|---|---|
| Send money | Arrow up-right |
| Receive money | Arrow down-left |
| Add funds | Plus circle |
| Settings | Gear or sliders |
| Yield / Earnings | Trend up, small leaf, or spark |
| Card | Credit card outline |
| Privacy / Shield | Shield (abstract, not crypto) |
| Account | Person circle |

---

## Component Library

### CSS Class Naming

All component classes use the `sv-` prefix (ShieldVault). Legacy `sp-` classes are kept during migration but should be replaced in the rebuild.

---

### Buttons

**Primary Button — `sv-btn--primary`**

The golden CTA. Background `{colors.primary}` (#E8C93A), text `{colors.on-primary}` (#0A0A09). Height 52px, padding `0 24px`, radius `{radius.md}` (12px), font `{typography.button}` (Inter 15px/600).

```css
.sv-btn--primary {
  background: var(--color-primary);
  color: var(--color-on-primary);
  height: 52px;
  padding: 0 24px;
  border-radius: var(--radius-md);
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.01em;
  border: none;
}
.sv-btn--primary:active {
  background: var(--color-primary-active);
  transform: scale(0.98);
}
```

**Secondary Button — `sv-btn--secondary`**

Dark card surface, hairline border. Same dimensions as primary. Background `{colors.surface-card}`, border `{colors.hairline-strong}`, text `{colors.ink}`.

**Ghost Button — `sv-btn--ghost`**

Transparent background, muted text. For tertiary actions and dismissals.

**Link Button — `sv-btn--link`**

No background. Text `{colors.primary}`. No underline by default. `{typography.label}` weight. Used for inline text actions ("Skip", "Learn more").

**Icon Button — `sv-btn--icon`**

44 × 44px, `{radius.full}`, background `{colors.surface-card}`, border `{colors.hairline}`. For navigation back buttons, close buttons, secondary actions.

**FAB — `sv-fab`**

64 × 64px circle. Background `{colors.primary}`. Color `{colors.on-primary}`. Sits above the bottom nav by 32px, centered. Box shadow: `0 0 0 4px {colors.canvas}, 0 4px 16px rgba(0,0,0,0.5)`. This is the only shadow in the system — it prevents the FAB from merging with the nav bar below.

**Sizes:**
- Small (sm): height 36px, padding `0 14px`, font 13px
- Medium (md): height 44px, padding `0 18px`, font 14px
- Large (lg): height 52px, padding `0 24px`, font 15px — default

**States:** Default → Active (scale 0.98 + darkened background) → Disabled (opacity 0.35, pointer-events none). No hover state on mobile. Hover state on desktop only.

---

### Cards

**Default Card — `sv-card`**

```css
.sv-card {
  background: var(--color-surface-card);
  border: 1px solid var(--color-hairline);
  border-radius: var(--radius-card);
  padding: var(--space-6);
}
```

**Glass Card — `sv-card--glass`**

Used inside the bottom drawer and modal overlays.

```css
.sv-card--glass {
  background: var(--color-glass-bg);
  border: 1px solid var(--color-glass-border);
  border-radius: var(--radius-card);
  padding: var(--space-6);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}
```

**Active / Selected Card — `sv-card--active`**

Applied to selected choice cards (funding method, card tier, vault selection).

```css
.sv-card--active {
  background: var(--color-glass-tint-strong);
  border: 1px solid rgba(232, 201, 58, 0.4);
}
```

**Yellow Callout Card — `sv-card--yellow`**

Reserved for high-emphasis callouts (deposit confirmed, yield milestone). Background `{colors.primary}`, text `{colors.on-primary}`. Use sparingly — one per flow maximum.

**Balance Card — `sv-card--balance`**

Extends default card. Contains: balance label (caption-uppercase, muted), amount (balance-display, ink), subtitle (body-sm, muted). Bottom section shows yield rate in success color.

---

### Forms

**Text Input — `sv-input`**

```css
.sv-input {
  width: 100%;
  height: 52px;
  padding: 0 16px;
  background: var(--color-surface-card);
  border: 1.5px solid var(--color-hairline-strong);
  border-radius: var(--radius-md);
  color: var(--color-ink);
  font-size: 15px;
  font-family: var(--font-body);
  outline: none;
  transition: border-color 150ms ease-out;
}
.sv-input:focus {
  border-color: var(--color-primary);
}
.sv-input::placeholder {
  color: var(--color-muted-soft);
}
.sv-input--error {
  border-color: var(--color-error);
}
```

**Form Label — `sv-label`**

`{typography.label}` (13px/500), color `{colors.muted}`. Always above the input, gap `{spacing.2}` (8px).

**Form Field Group — `sv-field`**

Container for label + input + error message. Gap between children: `{spacing.2}` (8px).

**Error Message — `sv-input-error`**

`{typography.caption}` (12px/500), color `{colors.error}`. Appears below input, gap `{spacing.1}` (4px) from input.

**Textarea — `sv-textarea`**

Same styling as `sv-input`. Min-height 96px. `resize: none`. Used for addresses and free-text in onboarding.

**Upload Zone — `sv-upload-zone`**

2px dashed border, `{colors.hairline-strong}`. Background `{colors.surface-soft}`. Radius `{radius.xl}`. Center-aligned content. On upload complete: border becomes solid `{colors.success}`, background `rgba(34, 197, 94, 0.06)`.

**Checkbox — `sv-checkbox-row`**

18 × 18px native checkbox with `accent-color: {colors.primary}`. Label at `{typography.body-md}`, color `{colors.body}`. Row gap `{spacing.3}` (12px).

**Terms Scroll — `sv-tos-scroll`**

Background `{colors.surface-soft}`, border `{colors.hairline}`, radius `{radius.md}`. Height 156px. Font `{typography.body-sm}`, color `{colors.muted}`. Scrollbar: thin, `{colors.hairline-strong}`.

---

### Navigation

**Bottom Nav — `sv-bottom-nav`**

Height 80px. Background `{colors.surface-soft}`. Top border: `1px solid {colors.hairline}`. No box shadow.

4 tabs: Home, Cards, Yield, Settings. Each tab: flex column, icon (24px) + label (caption-uppercase).

Inactive: icon and label at `{colors.muted-soft}`.
Active: icon and label at `{colors.primary}`.

Active indicator: no underline, no background pill — color change alone.

**FAB Position:** Sits above the bottom nav center slot. The center tab slot is visually empty (reserved as the FAB anchor).

**Back Button — `sv-back-btn`**

40 × 40px. Background none. Icon `{colors.body}`. On press: background `{colors.surface-elevated}` at `{motion.duration-fast}`.

**Progress Indicator (Onboarding) — `sv-progress`**

Horizontal track: 3px height, `{colors.hairline}` background, `{radius.full}`. Fill: `{colors.primary}`. Animated width transition: `{motion.duration-normal}` `{motion.ease-out}`.

**Step Count — `sv-step-count`**

`{typography.caption}` (12px/500), `{colors.muted}`. e.g. "3 of 7". Right-aligned in the nav row.

---

### Lists

**Transaction Row — `sv-tx-row`**

Height: auto, min 64px. Padding `{spacing.4}` (16px) vertical, `{spacing.screen-x}` horizontal. Bottom border `{colors.hairline}`. Last child: no border.

Anatomy: left avatar (36px circle) + body (label + subtitle) + right amount.

- Avatar background: `{colors.surface-elevated}`, icon `{colors.muted}`.
- Label: `{typography.title-sm}`, `{colors.ink}`.
- Subtitle: `{typography.caption}`, `{colors.muted}`.
- Amount (positive): `{typography.title-sm}`, `{colors.success}`.
- Amount (negative): `{typography.title-sm}`, `{colors.ink}`.

**Section Header — `sv-section-header`**

`{typography.caption-uppercase}`, `{colors.muted}`. Padding: `{spacing.6}` top, `{spacing.3}` bottom, `{spacing.screen-x}` horizontal.

**Settings Row — `sv-settings-row`**

Identical to transaction row structure. Right element is a chevron (`{colors.muted-soft}`) or toggle. Pressed state: background `{colors.surface-elevated}`.

**Choice Card Row — `sv-choice-card`**

Full-width card. Background `{colors.surface-card}`, border `{colors.hairline}`, radius `{radius.lg}`. Padding `{spacing.5}` (20px). Anatomy: left icon (40px, background `{colors.surface-elevated}`) + body (title + subtitle) + right check or chevron.

Selected state: `sv-choice-card--active` — border `rgba(232,201,58,0.4)`, background `{colors.glass-tint-strong}`. Check circle: `{colors.primary}` fill, `{colors.on-primary}` check mark.

---

### Banking Components

**Balance Display — `sv-balance`**

Central element of the home screen. Anatomy:

1. Label row: `{typography.caption-uppercase}` + lock icon (12px) at `{colors.muted}` — e.g. "ACCOUNT BALANCE"
2. Amount: `{typography.balance-display}` (36px/700), `{colors.ink}`, tabular-nums
3. Subtitle: USD equivalent at `{typography.body-sm}`, `{colors.muted}`
4. Yield badge (optional): inline pill — `{colors.yield-bg}` background, `{colors.yield}` text, `{typography.caption}` — e.g. "+0.34% APY"

**Action Grid — `sv-action-grid`**

2 × 2 or 1 × 4 grid of action buttons. Each button: icon (28px) + label (`{typography.caption}`). Background `{colors.surface-card}`, border `{colors.hairline}`, radius `{radius.lg}`. Pressed: scale(0.95), background `{colors.surface-elevated}`.

Primary action button (Send / Transfer): background `{colors.primary}`, color `{colors.on-primary}`.

**Amount Input — `sv-amount-input`**

Large editable amount. Font size 32px, weight 700, letter-spacing -2px, tabular-nums. Background none, border none, no padding. Cursor style text. Placeholder color `{colors.hairline-strong}`. Companions: denomination label (USDC), max button (`{colors.primary}` link).

**Fee Row — `sv-fee-row`**

Borderless table row. Label (`{typography.body-sm}`, `{colors.muted}`) left, value (`{typography.body-sm}`, 500, `{colors.body}`) right. Padding 10px vertical. Divider on last row only (total).

**Confirmation Preview — `sv-confirm-preview`**

Card (`{colors.glass-tint}` background, `{colors.hairline}` border) showing before/after balance. Label + value pairs in `{typography.body-sm}`. Delta shown in `{colors.muted}`.

**Operation Banner — `sv-op-banner`**

Appears below status bar during active operation. Background `{colors.surface-soft}`, bottom border `{colors.hairline}`. Left: 8px pulse dot (yellow during processing, green on success) + title/subtitle. Right: chevron. Animation: slide down from above at `{motion.duration-normal}`.

---

### VISA Card Components

**Card Visual — `sv-visa-card`**

Aspect ratio 1.586 (standard card). Radius 14px. Padding `{spacing.4}` (16px) horizontal, `{spacing.4}` vertical.

**VISA Premier:**
- Background: `{gradient.card-premier}` — very dark warm gradient
- Border: `1px solid {colors.glass-border-strong}` — subtle light edge
- Chip: `{colors.primary}` (#E8C93A) — the golden chip is the card's personality
- Number: JetBrains Mono, rgba(255,255,255,0.7)
- VISA wordmark: `{colors.ink}` at 0.9 opacity

**VISA Premium:**
- Background: `{gradient.card-premium}` — near-black
- Border: `1px solid rgba(232,201,58,0.2)` — very subtle gold edge
- Chip: `{colors.primary}` — same golden chip
- Additional glow: `box-shadow: 0 0 24px rgba(232,201,58,0.08)` — just barely visible

**Card Selection Option — `sv-card-option`**

Full-width container. Padding `{spacing.4}`. Border `{colors.hairline}`, radius `{radius.xl}`. Contains: card visual (full width, aspect ratio preserved) + info block (name, price, perks list). Selected: border `rgba(232,201,58,0.4)`, background `{colors.glass-tint-strong}`.

---

### Onboarding Components

**Onboarding Screen — `sv-onb-screen`**

Full-screen (position absolute, inset 0). Background `{colors.canvas}`. Three zones:
1. Header (progress bar + nav row) — 12px top padding
2. Body (scrollable, padding `{spacing.6}` horizontal) — flex 1
3. Footer (CTA button) — fixed height, padding `{spacing.6}` horizontal, `{spacing.10}` bottom

**Onboarding Title — `sv-onb-title`**

`{typography.display-md}` (26px/700). Color `{colors.ink}`. Margin bottom `{spacing.3}` (12px).

**Onboarding Subtitle — `sv-onb-sub`**

`{typography.body-md}` (15px/400). Color `{colors.muted}`. Line height 1.55. Margin bottom `{spacing.8}` (32px).

**KYC Upload Zone**

See `sv-upload-zone` above. Icon: camera or document outline, 32px, `{colors.muted}`. Label: 15px/600, `{colors.ink}`. Hint: `{typography.body-sm}`, `{colors.muted-soft}`.

**Security Note**

`{typography.caption}` (12px/500), `{colors.muted-soft}`. Center-aligned. Used at bottom of KYC and identity steps: "Your information is encrypted and never shared."

---

### Yield Components

**Yield Rate Badge — `sv-yield-badge`**

Inline pill. Background `{colors.yield-bg}`, text `{colors.yield}`, `{typography.caption-uppercase}`. Radius `{radius.full}`. Padding `3px 10px`. e.g. "3.2% APY"

**Vault Selection Card — `sv-vault-card`**

Extends `sv-choice-card`. Left: vault icon (40px, background `{colors.surface-elevated}`) + vault name/provider. Right: APY rate in `{colors.yield}` + active/select check. Active vault marked with golden check.

**Yield Summary — `sv-yield-summary`**

Card showing: "This month's earnings" label + amount at `{typography.display-sm}` in `{colors.yield}`. Subtext: "Based on {vault name}" at `{typography.body-sm}`, `{colors.muted}`.

**Vault List — `sv-vault-list`**

5 vault options stacked vertically as `sv-vault-card` components. One can be active (golden check + glass-tint background). Section header: "Choose your vault" in `{typography.caption-uppercase}`.

---

### Empty States

**Empty State — `sv-empty-state`**

Centered vertically and horizontally in the content area. Components:
1. Visual: abstract photograph or simple geometric icon (48px, `{colors.muted}`) — no illustrations
2. Title: `{typography.title-md}`, `{colors.ink}`
3. Subtitle: `{typography.body-sm}`, `{colors.muted}`, max-width 240px, centered
4. CTA (optional): `sv-btn--primary`

**Example: No transactions**
- Icon: simple clock or list icon
- Title: "No transactions yet"
- Subtitle: "Your payments and transfers will appear here."
- CTA: none

**Example: Account not funded**
- Icon: wallet or plus icon
- Title: "Add funds to get started"
- Subtitle: "Transfer at least $50 to activate your account."
- CTA: "Add Funds" primary button

---

### Loading States

**Spinner — `sv-spinner`**

Circle, border-based. Border: 2px solid `{colors.hairline-strong}`. Border-top: 2px solid `{colors.primary}`. Animation: `spin 1.2s linear infinite`. Sizes: 24px (inline), 40px (section), 52px (full-screen).

**Skeleton — `sv-skeleton`**

Background `{colors.surface-elevated}`. Radius matches the element it replaces. No shimmer animation — a static slightly-lighter rectangle. Shimmer is too visually noisy for this system.

**Processing Screen — `sv-processing`**

Full-screen centered. Spinner 52px. Title `{typography.display-sm}` e.g. "Confirming your deposit". Subtitle `{typography.body-md}`, `{colors.muted}`: "This takes about 30 seconds. You can leave this screen."

**Inline Loading (Button)**

Replace button label with spinner (16px, currentColor). Button remains same size. Primary button: spinner in `{colors.on-primary}`. Secondary button: spinner in `{colors.ink}`.

---

### Dashboard Components

**Home Screen Layout**

1. Status bar (44px, `{colors.canvas}` bg)
2. Header row: logo wordmark left, avatar/notification icon right (52px)
3. Balance section: `sv-balance` card, full width
4. Action grid: 2×2 or 1×4 (`sv-action-grid`)
5. Activity section: section header + `sv-tx-row` list
6. Bottom nav (80px) + FAB

**Home Header — `sv-home-header`**

52px. Background `{colors.canvas}`. No border bottom — the balance card below provides visual separation.

Logo: "ShieldVault" wordmark in `{typography.display-sm}` (22px/700), letter-spacing -0.03em, `{colors.ink}`.

Avatar: 32px circle, background `{colors.primary}`, text `{colors.on-primary}`, initials in `{typography.caption}` 700 weight.

---

## Accessibility

**Minimum contrast ratios:**
- Body text on dark surfaces: `{colors.body}` (#CCCCCC) on `{colors.canvas}` (#0A0A09) — 12.6:1. Exceeds WCAG AA.
- Muted text: `{colors.muted}` (#888888) on `{colors.canvas}` — 5.7:1. Meets WCAG AA (4.5:1 required).
- Yellow on dark: `{colors.primary}` (#E8C93A) on `{colors.canvas}` — 8.2:1. Exceeds WCAG AA.
- On-primary (black on yellow): `{colors.on-primary}` (#0A0A09) on `{colors.primary}` (#E8C93A) — 8.2:1. Exceeds WCAG AA.

**Muted-soft text** (`{colors.muted-soft}` #5A5A5A on `{colors.canvas}`) — 3.8:1. Below AA for body text. Use only for decorative labels, never for content the user must read to complete a task.

**Touch targets:** Minimum 44 × 44px for all interactive elements. Button minimum heights are already 44px+. Icon buttons at 44px. Bottom nav tabs at full 80px height (tap target fills tab width × height).

**Focus states:** All interactive elements must have a visible `:focus-visible` outline. Use `outline: 2px solid {colors.primary}; outline-offset: 2px`. Never remove outlines without a visible replacement.

**Motion:** Respect `prefers-reduced-motion`. Wrap all Framer Motion animations with a `useReducedMotion()` check. When reduced motion is active: use `opacity` transitions only, no translate/scale.

**Semantic HTML:** All screens use `<main>`, `<nav>`, `<section>`, `<button>` correctly. No `<div onClick>` for interactive elements.

**Form labels:** Every input has an associated `<label>` or `aria-label`. Placeholder text is not a substitute for a label.

---

## Responsive Rules

This product runs in a mobile device frame. The breakpoints are:

| Breakpoint | Width | Context |
|---|---|---|
| Frame (mobile) | 390px | Default. All design decisions made here. |
| Small mobile | < 390px | Device fills screen, frame borders removed. |
| Tablet/Desktop | > 430px | Device frame centered on canvas background. |

### Mobile Fill (`< 430px`)

```css
@media (max-width: 430px) {
  .sv-device-outer {
    padding: 0;
    background: var(--color-canvas);
  }
  .sv-device {
    width: 100%;
    height: 100dvh;
    border-radius: 0;
    box-shadow: none;
  }
}
```

### Desktop Frame

The device frame (390 × 844px) sits centered on `{colors.canvas}` background. Outer container: `min-height: 100dvh, display: flex, align-items: flex-start, justify-content: center, padding: 40px 24px`. The background IS the canvas — no additional decoration.

### Content Scaling

Do not scale font sizes, spacing, or touch targets for tablet/desktop. The product is always experienced at 390px width. On larger screens, the extra space belongs to the canvas background.

---

## AI Generation Rules

This section is written for LLMs generating ShieldVault UI. Follow these rules exactly.

### Token Reference

Always use CSS custom properties, never hardcoded values.

**Correct:** `background: var(--color-surface-card)`
**Wrong:** `background: #1A1A18`

### Color Rules for Generation

1. Screen background: always `var(--color-canvas)` — never white, never gray.
2. Card background: always `var(--color-surface-card)` with `border: 1px solid var(--color-hairline)`.
3. Primary text: `var(--color-ink)` (#FFFFFF).
4. Secondary text: `var(--color-muted)` (#888888).
5. Yellow accent: used on ONE element per screen — the primary CTA or the single most important data point.
6. No shadows: `box-shadow: none` on all cards except the FAB and device frame.
7. No backgrounds on the body/html beyond canvas: `background: var(--color-canvas)`.

### Typography Rules for Generation

1. Headlines: `font-weight: 700`, always with `letter-spacing: -0.03em` or tighter.
2. Body: `font-weight: 400`.
3. Buttons: `font-weight: 600`, `font-size: 15px`.
4. Amounts/balances: `font-variant-numeric: tabular-nums` always.
5. Inter is the only font. Never introduce a second family.

### Component Generation Checklist

When generating any card component:
- [ ] Background: `var(--color-surface-card)`
- [ ] Border: `1px solid var(--color-hairline)`
- [ ] Radius: `var(--radius-card)` (20px)
- [ ] Padding: `var(--space-6)` (24px)
- [ ] No box-shadow

When generating any button:
- [ ] Primary: `background: var(--color-primary)`, `color: var(--color-on-primary)`
- [ ] Secondary: `background: var(--color-surface-card)`, `border: 1px solid var(--color-hairline-strong)`
- [ ] Height: 52px (lg), 44px (md), 36px (sm)
- [ ] Radius: `var(--radius-md)` (12px)
- [ ] Pressed: `transform: scale(0.98)`, darkened background

When generating any screen:
- [ ] Background: `var(--color-canvas)`
- [ ] Content padding: `var(--screen-padding-x)` (24px) horizontal
- [ ] No white surfaces anywhere

### Copy Generation Rules

Every copy state must answer:
1. What is happening right now?
2. What should the user do (or: nothing is needed)?
3. What happens if they leave or do nothing?

**Forbidden words:** blockchain, wallet, wallet address, USDC address, gas, gas fee, signing, signature, private key, smart contract, confirmation hash, mempool, FHE, coprocessor, node, validator, DeFi.

**Preferred words:** account, balance, transfer, deposit, payment, earnings, yield, funds, secure, protected.

**Processing states template:** "[What is happening] — [how long it takes]. You can [leave/continue]."
Example: "Confirming your deposit — this takes about 30 seconds. You can leave this screen."

### Tone for Generated Copy

Confident. Calm. Direct. Short sentences. No exclamation marks. No enthusiasm. No marketing language. Think: a very good bank writing a very short letter.

---

## Do / Don't

### Color

| Do | Don't |
|---|---|
| Use `{colors.primary}` (yellow) on one element per screen | Use yellow on two or more elements per screen |
| Use dark canvas as the screen background | Use white or light gray for any surface |
| Use `{colors.hairline}` for card borders | Use visible colored borders on standard cards |
| Let text hierarchy come from size + weight | Use color to distinguish body text levels |

### Typography

| Do | Don't |
|---|---|
| Use negative letter-spacing on all 700-weight display text | Use Inter 700 without negative tracking |
| Use tabular-nums on all monetary amounts | Allow amounts to shift width as digits change |
| Use 400 weight for body copy | Use 500 or 600 for running text |
| Use caption-uppercase (11px, +1.5px tracking) for section labels | Use uppercase tracking on body copy |

### Surface & Elevation

| Do | Don't |
|---|---|
| Use hairline borders to define card edges | Use drop shadows on cards |
| Let card surfaces be slightly lighter than canvas | Use pure #000000 for the canvas |
| Use glass-tint for selected/active card states | Use blue or colored fill for selected states |
| Apply backdrop-filter only to overlay elements | Apply blur filters to scrollable card content |

### Motion

| Do | Don't |
|---|---|
| Use slow ease-out (500ms, `cubic-bezier(0.16, 1, 0.3, 1)`) for screen transitions | Use bounce or spring easing |
| Use scale(0.98) for button press | Use scale(0.9) or larger scale changes |
| Respect `prefers-reduced-motion` | Play animations regardless of system settings |
| Keep spinners slow (1.2s) | Use fast 0.8s spinners |

### Copy

| Do | Don't |
|---|---|
| Say "Your deposit is being confirmed" | Say "Transaction pending" |
| Say "Funds available in ~30 seconds" | Say "Awaiting blockchain confirmation" |
| Say "Your account" | Say "Your wallet" |
| Say "Transfer" or "Send" | Say "Sign" or "Submit transaction" |

### Photography

| Do | Don't |
|---|---|
| Use architectural glass between camera and subject | Use clean studio portraits with no filtering |
| Use large negative space | Fill the frame with the subject |
| Use desaturated or monochrome treatment | Use full-color saturated photography |
| Use real people in neutral expressions | Use stock photography with posed smiles |

---

## Future Extension Guidelines

### Dark Mode Variants (not current)

The token system is ready for a `prefers-color-scheme: light` override. When light mode is added: map `--color-canvas` to #FFFFFF, `--color-surface-card` to #F3F3F0, `--color-ink` to #0A0A09, `--color-hairline` to #E5E5E0. The yellow primary remains unchanged — it works on both light and dark.

### New Screens

All new screens must:
1. Start from `{colors.canvas}` background
2. Use only tokens — no hardcoded values
3. Have no more than one yellow element
4. Pass the copy checklist (three questions)
5. Be reviewed against the "crypto test": does anything suggest blockchain?

### New Components

New components must:
1. Extend an existing component class (`sv-card`, `sv-btn`, `sv-input`) before creating a new one
2. Use only existing tokens
3. Document purpose, anatomy, states, and spacing

### Additional Banking Features

If adding features beyond onboarding, payments, and yield (e.g., bill splitting, international transfers, savings goals):
- Maintain the visual hierarchy — do not add new accent colors
- All amounts remain tabular-nums, displayed in USD equivalent
- All operations follow the same submitting → processing → completed state machine
- Never expose settlement layer information (gas, fees, chain)

### Illustration (if needed)

If illustration is ever used (not recommended):
- Geometric and minimal — think Dieter Rams product graphics, not App Store character art
- Monochromatic: `{colors.muted}` or `{colors.body}` fill only
- Line-based, 2px stroke weight
- Never used for emotional storytelling (that role belongs to photography)
- Never crypto-themed

### Third-party Integration Surfaces

If integrating external content (KYC partner UI, payment provider flows): display external content in a `sv-card--glass` container with a "Powered by [partner]" caption in `{typography.caption}`, `{colors.muted}`. Maintain full-screen canvas background. The partner UI may deviate from the design system — contain it visually rather than restyling it.

---

*Version 1.0 — ShieldVault Design Constitution*
*Use token refs throughout. Never inline hex. The yellow + black pairing is the brand contract.*
