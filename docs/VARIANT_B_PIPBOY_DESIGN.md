# ShieldVault Variant B: Pip-Boy Onboarding Design

## Purpose

Variant B is a hidden onboarding path unlocked from the landing screen. It must keep the original ShieldVault onboarding architecture and usability intact, but reframe the experience as a retro-futuristic pocket-terminal mission.

The user should feel they discovered a secret mode, not a second product. The normal flow remains the source of truth for data, validation, account activation, and home behavior. Variant B changes presentation, pacing, narrative, visual assets, and the post-completion skin state.

## Product Intent

- Preserve the same onboarding requirements as the primary flow.
- Make each onboarding step feel like a Pip-Boy terminal chapter.
- Add a recurring mascot/assistant who appears in a different pose per step.
- Reward completion with an unlocked card skin.
- If the user reaches Home through Variant B, Home should boot into the Pip-Boy skin.
- Provide a clear control on Home to return to the standard ShieldVault aesthetic.
- Do not sacrifice readability, accessibility, form clarity, or completion rate.

## Non-Goals

- Do not replace the primary onboarding flow.
- Do not create a separate account state machine.
- Do not add obscure game mechanics that block account creation.
- Do not hide financial/KYC requirements behind jokes.
- Do not directly copy protected franchise characters, logos, or UI text. The direction is retro-futuristic wrist-terminal, monochrome CRT, vault bureaucracy, and mascot-led onboarding.

## Experience Model

Variant B should sit on top of the existing onboarding steps as a presentation adapter:

```text
Landing hidden trigger
  -> Variant B onboarding shell
  -> Existing onboarding data requirements
  -> Completed account
  -> Persist pipboy_skin_unlocked = true
  -> Persist active_theme = pipboy
  -> Home in Pip-Boy skin
  -> User can switch back to standard theme
```

Recommended localStorage keys:

```text
shieldvault_variant_entry = "pipboy"
shieldvault_pipboy_skin_unlocked = "1"
shieldvault_active_theme = "pipboy" | "standard"
shieldvault_card_skin = "pipboy" | "standard"
```

The standard onboarding completion key remains unchanged.

## Visual Direction

### Mood

Portable survival computer, public-service bureaucracy, green phosphor, tactical-but-friendly mascot, mission debriefs, analog controls, and readable mobile finance UI.

The UI should feel like a high-polish in-universe system, not a novelty terminal overlay.

### Reference Refinement

The stronger direction is not glossy neon or premium sci-fi. It is a worn green CRT interface:

- Mostly black and deep green screen fields, with the brightest green reserved for active UI, text, and character silhouettes.
- Heavy horizontal scanlines, subtle scratches, vignetting, and display grime.
- Simple mascot drawings that read like app icons or terminal diagrams, not detailed rendered illustrations.
- Thick bright outline with minimal interior detail.
- UI frames made from square brackets, tab rails, thin divider lines, and bottom command bars.
- Sparse mascot panels with lots of empty terminal space around them.
- Dense app/status screens can use repeated icon cells, but form steps must stay calmer and readable.

Avoid:

- glossy 3D product-render lighting
- soft premium card reflections as the main style
- over-modeled character shading
- full-color props
- decorative glow that reduces text clarity

### Palette

```css
--pip-canvas: #020603;
--pip-screen: #041407;
--pip-panel: rgba(22, 255, 72, 0.055);
--pip-panel-strong: rgba(22, 255, 72, 0.095);
--pip-green: #16ff48;
--pip-green-soft: #7cff8f;
--pip-green-dim: #178a35;
--pip-green-muted: #5ca96a;
--pip-amber: #f0c85a;
--pip-danger: #ff5c43;
--pip-ink: #d6ffd8;
--pip-muted: rgba(214, 255, 216, 0.62);
--pip-hairline: rgba(22, 255, 72, 0.24);
--pip-hairline-strong: rgba(22, 255, 72, 0.48);
```

Green is dominant, amber is reserved for warnings, rewards, or selected tier highlights. Avoid the current gold-first look in `game-mode.css`; that reads more like ShieldVault terminal mode than Pip-Boy.

### Type

- Primary terminal UI: `JetBrains Mono`, `Courier New`, or local monospace fallback.
- Body copy must remain readable at 13-15px.
- Avoid dense all-caps paragraphs. Use all-caps for labels, tabs, system lines, and short commands only.
- Use tabular numbers for balances, OTP, timers, and progress.

### Surfaces

- Full-screen mobile shell remains.
- Use screen bands, brackets, tab rails, and terminal cards with 1px green lines.
- Avoid nested cards.
- Avoid giant decorative blobs, gradients, or generic cyberpunk neon.
- Scanlines and bloom must be subtle enough to keep form fields legible.

### Motion

- Use short boot, scan, type-on, and progress animations.
- Disable excessive flicker when `prefers-reduced-motion` is active.
- Keep all form interactions immediate. Narrative animation must not delay typing, selection, or submission.

## Mascot Direction

Create an original ShieldVault terminal mascot, not a franchise copy.

Working name: **Vault Buddy**.

Visual traits:

- Friendly retro instruction-manual character.
- Simple face, rounded hair/helmet silhouette, gloves, boots, utility belt.
- Rendered as monochrome green phosphor with CRT horizontal lines.
- Always sits inside or near a small terminal viewport, never blocking inputs.
- Each pose must communicate what the user is doing now.

Implementation options:

1. Generated PNG sprites for each step.
2. One generated sprite sheet split into CSS background positions.
3. Later replacement with hand-authored SVG if sharper scaling is needed.

For this prototype, generated PNG sprites are acceptable as long as they are compressed and visually consistent.

## Step Narrative

| Current function | Variant B chapter | Mascot pose | UX requirement |
| --- | --- | --- | --- |
| Landing hidden trigger | Signal found | Mascot tuning a wrist terminal antenna | Secret entry feels intentional but does not distract standard users |
| Email | Comms channel | Mascot plugging in a cable or holding an envelope | Email field and social login remain obvious |
| OTP | Signal lock | Mascot listening to headphones with a code tape | OTP auto-advance remains unchanged |
| Name + DOB | Citizen file | Mascot stamping an ID folder | Legal identity language stays clear |
| Address | Settlement coordinates | Mascot reading a map with location pins | Address fields remain standard and autofill-friendly |
| Passport/KYC | Clearance scan | Mascot holding an ID under a scanner | KYC seriousness stays intact |
| Terms | Overseer agreement | Mascot reading a clipboard | Terms acceptance is explicit |
| Funding | Vault credit allocation | Mascot carrying a coin crate to a vault | $50 minimum is highly visible |
| Crypto/fiat method | Deposit route | Mascot switching rail tracks or toggling a panel | Method choice is plain language first, terminal flavor second |
| Processing | Account activation | Mascot watching progress gauges | User understands wait time and can leave |
| Card selection | Card fabrication | Mascot polishing/engraving a card | Tier pricing and benefits remain clear |
| Completion | Skin unlocked | Mascot presenting a glowing card skin | Reward moment is explicit and memorable |
| Home | Pip-Boy account screen | Mascot appears as small assistant/status widget | User can switch to standard theme |

## Onboarding Shell

The current `GameOnboardingFlow` should be refactored into reusable sections rather than rebuilding the onboarding:

```text
GameOnboardingFlow
  PipboyShell
    PipboyHeader
    PipboyMascotPanel
    StepBody
    PipboyFooterActions
```

Each step should define:

```ts
type PipboyStepView = {
  chapter: string
  command: string
  mascotAsset: string
  mascotAlt: string
  body: ReactNode
  primaryAction: ReactNode
}
```

This keeps the narrative layer declarative and prevents every step from becoming custom one-off UI.

## Copy System

Copy should use two layers:

1. Human-readable financial/KYC copy.
2. Short terminal flavor labels.

Example:

```text
Label: COMM CHANNEL
Title: Create your account
Helper: Enter your email so we can verify your account.
Command button: TRANSMIT EMAIL
```

Avoid replacing important copy with only lore terms. The user should never need to decode what a field means.

Forbidden in Variant B too:

- gas
- wallet
- private key
- FHE
- smart contract
- mempool

## Home Screen Variant

When `shieldvault_active_theme = "pipboy"`, Home should retain the same information hierarchy:

- Balance
- Send / Receive
- Yield status
- Card
- Activity
- Bottom nav

But the presentation changes:

- Green monochrome account screen.
- Pip-Boy card skin visible in Cards section or as a card preview on Home.
- Top-right or settings-row control: `Standard mode`.
- Small unlocked badge: `PIP-BOY CARD SKIN UNLOCKED`.
- Mascot widget can appear in a compact status panel, not as a full-screen illustration.

Switching to standard mode should only change theme:

```text
shieldvault_active_theme = "standard"
```

It must not reset onboarding, card skin ownership, balance, or yield provider.

## Card Skin Reward

The reward should feel earned at completion and useful after completion.

Card visual:

- Near-black green phosphor card.
- Fine CRT grid texture.
- Bracket corners.
- `SHIELDVAULT` and `VISA` remain legible.
- Small `VAULT BUDDY ISSUE` or `SPECIAL ISSUE` label.
- Optional mascot silhouette watermark.

Unlock moment:

```text
ACCESS GRANTED
PIP-BOY CARD SKIN UNLOCKED
Your ShieldVault card has been issued with the terminal skin. You can switch back anytime from Home.
```

## Asset Plan

Create a first pass of generated assets:

```text
public/assets/pipboy/vault-buddy-spritesheet.png
public/assets/pipboy/vault-buddy-unlock.png
public/assets/pipboy/pipboy-card-skin.png
```

Recommended prompt for the sprite sheet:

```text
Create an original retro-futuristic monochrome green CRT sprite sheet for a friendly pocket-terminal banking mascot named Vault Buddy. 12 panels on a flat black background, consistent character design, glowing green phosphor line art, horizontal CRT scanlines, 1950s instruction-manual proportions, no text, no logos, no copyrighted characters. Poses: tuning antenna, holding envelope, listening to code headphones, stamping ID file, reading map, scanning passport, reading clipboard, carrying coin crate, switching deposit route lever, watching progress gauges, polishing payment card, presenting glowing unlocked card. Each panel should have generous padding and clear silhouette.
```

Recommended prompt for card skin:

```text
Design a premium mobile banking card skin inspired by a retro-futuristic green phosphor terminal. Near-black card, glowing green bracket corners, subtle CRT grid texture, readable chip area, minimal ShieldVault branding, small friendly mascot silhouette watermark, no copyrighted logos except a generic payment network placeholder, no text-heavy UI, polished product mockup.
```

## Implementation Plan

1. Add `docs/VARIANT_B_PIPBOY_DESIGN.md` as the design source for Variant B.
2. Generate the first mascot/card image direction and place selected assets in `public/assets/pipboy/`.
3. Introduce theme state:
   - `variantEntry`
   - `pipboySkinUnlocked`
   - `activeTheme`
   - `cardSkin`
4. Update `handleGameComplete` so completing Variant B persists:
   - completed onboarding
   - unlocked Pip-Boy skin
   - active Pip-Boy home theme
5. Refactor `GameOnboardingFlow` visuals:
   - Replace amber/gold tokens with green phosphor tokens.
   - Add mascot panel to every step.
   - Keep existing validations and field behavior.
   - Replace full lore-only labels with dual-layer labels.
6. Add Pip-Boy Home mode:
   - Add `theme` prop or context to `HomeScreen`.
   - Add `onThemeChange` callback.
   - Add visible switch to standard mode.
   - Add card skin reward presentation.
7. Keep the standard flow untouched:
   - Normal landing button still calls `onboarding.start`.
   - Normal onboarding still renders `OnboardingFlow`.
   - Standard home remains default unless active theme is Pip-Boy.
8. Verify:
   - Standard onboarding completion still works.
   - Hidden trigger path still works.
   - Refresh after completion keeps Pip-Boy Home.
   - Switch to standard mode persists.
   - Reset demo clears variant state.
   - Mobile viewport has no overlapping text.
   - Reduced motion is respected.

## Acceptance Criteria

- The primary flow is visually and behaviorally unchanged.
- Hidden Variant B has a clear Pip-Boy-inspired identity, not just different colors.
- Every onboarding step has a matching mascot pose or panel.
- The user can complete Variant B without losing clarity about KYC, funding, pricing, or card tier.
- Completing Variant B unlocks a card skin.
- Home opens in Pip-Boy mode after Variant B completion.
- Home includes a clear way to switch back to the normal ShieldVault aesthetic.
- The card skin remains unlocked even after switching back to standard mode.
