# CLAUDE.md — ShieldVault

## Project context

ShieldVault is a retail payment app backed by blockchain infrastructure. It pivots ShieldPay's
confidential DeFi product into a mainstream consumer experience inspired by Revolut and N26.
The blockchain layer (USDC, yield vaults, confidential amounts) runs under the hood — users
never interact with wallets, gas, or signing flows.

**Stack:** React + TypeScript + Vite. Framer Motion for animation. CSS custom properties
(no Tailwind). Frontend-only prototype — all operations are simulated with localStorage + setTimeout.

**Platform:** Mobile-first. The UI renders inside a mobile device frame.

---

## Brief

ShieldPay has pivoted to retail. What changed:

- **Mobile-first** — the web app still exists but this is the mobile product
- **No wallet confirmations** — blockchain operations (shielding, yield routing) happen
  automatically under the hood. Users connect by email or Google account.
- **VISA card** — connected to VISA and Apple Pay. Users pay in USD/EUR from their USDC account.
- **USDC only**
- **Auto-yield** — liquidity automatically earns yield (default: AAVE USD Coin). Users can
  choose from 5 vault options (AAVE and Morpho variants).

What did not change:
- It is still backed by blockchain and ensures amount confidentiality
- The name: ShieldVault (retail rebrand of ShieldPay)

---

## Deliverables

### 1. Onboarding flow (primary)

Users must complete registration and fund their account with a minimum of $50 USD to activate it.

**Registration form collects:**
- Full identity (name, date of birth)
- Phone number
- Postal address
- Verified email address
- Valid passport picture (KYC)
- Agreement to Terms of Service

**Funding — two streams:**
- **Crypto stream:** user transfers USDC or other crypto
- **Fiat stream:** bank transfer or credit card onramp

After funding, users choose their VISA card tier:
- **VISA PREMIER** — free
- **VISA PREMIUM** — $2/month (includes travel insurance, higher spending limits)

The $50 becomes available in their account immediately after confirmation.

### 2. Auto-yield system (bonus)

Every month users receive yield based on their account balance. No separate savings account —
the payment account itself generates yield automatically.

Users can see their yield rate and choose from 5 vault options:
- AAVE USD Coin (default)
- AAVE USD Coin v3
- Morpho USDC
- Morpho USDC Prime
- Morpho USDC Boost

---

## State system

### Onboarding phases

```
start
  │
  ▼
identity         ← full name, DOB, phone, postal address, email
  │
  ▼
verification     ← passport picture upload + KYC submission
  │
  ▼
tos              ← agree to Terms of Service
  │
  ▼
funding          ← choose stream: crypto or fiat
  ├── funding_crypto   ← transfer USDC/crypto instructions
  └── funding_fiat     ← bank transfer OR credit card onramp
         │
         ▼
      processing       ← waiting for deposit confirmation (~30s simulation)
         ├── failed    ← deposit failed — retry
         ▼
      card_selection   ← choose VISA PREMIER (free) or VISA PREMIUM ($2/mo)
         │
         ▼
      completed        ← account active, balance available
```

### Payment phases (post-onboarding)

```
idle → submitting → processing → completed
                 → failed
```

No wallet confirmation steps. `submitting` replaces the entire wallet signature flow —
it is invisible to the user (spinner only, sub-1s).

---

## Architecture

```
App
├── MobileShell          ← device frame + status bar
│   └── app-layer
│       ├── [screen]     ← active screen (home, settings, etc.)
│       └── BottomDrawer ← all transaction/onboarding flows live here
```

**Key decision:** flows (onboarding, payments, yield settings) live in `BottomDrawer`,
not in separate routes. The app has no router — screen state is managed in `App.tsx`.

---

## Component rules

1. **Every visual change happens at the component level** — never inline styles in screen files.
2. **If a request does not fit the existing component API**, stop and present options before writing code.
3. **Screens assemble — they do not style.** All spacing, color, and typography decisions live in components.

## Component map

| Concept | Component |
|---------|-----------|
| Device frame | `MobileShell` (`components/MobileShell.tsx`) |
| Flow container | `BottomDrawer` (`components/BottomDrawer.tsx`) |
| Actions | `Button` (`components/Button.tsx`) |
| Token/currency icon | `TokenAvatar` (`components/TokenAvatar.tsx`) |
| Payment state machine | `useOperation` (`hooks/useOperation.ts`) |

---

## Copy rules

Every UI state must answer three questions:
1. What is happening right now?
2. What should the user do (or: nothing is needed)?
3. What happens if they leave or do nothing?

If a copy suggestion does not answer all three, it is incomplete.

**Forbidden terms:** gas, blockchain, wallet, USDC address, mempool, confirmation hash,
FHE, coprocessor, smart contract, private key.

**Preferred terms:** account, balance, transfer, deposit, payment, earnings, yield.

**Processing states:** never say "pending" alone. Always include: what is happening +
how long it takes + that the user can leave.

---

## JSX syntax rules (Oxc parser)

- No em dashes (`—`) inside JSX props — use plain hyphens or move to a variable
- No escaped apostrophes (`\'`) — use JSX expression `{"it's"}` instead
- No dash separators in prose copy — rewrite as plain prose

---

## Design direction

**Reference:** Revolut, N26 — accessible, clean, retail-grade financial UX.
**Anti-reference:** crypto-native aesthetics — no neon, no dark-and-glowing UI, no DeFi jargon.

**Light mode.** The token system (`styles/tokens.css`) defines a light palette.
Dark mode tokens can be added later but are not a shipping requirement.

**Brand color:** `#1A56DB` — deep blue. Trustworthy, modern, financial.

**Motion:** Framer Motion, spring easing. Animations communicate state transitions —
they do not decorate. No looping or ambient motion.
