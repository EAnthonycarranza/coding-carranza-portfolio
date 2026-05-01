# Design System

This portfolio runs on a token-driven design system. CSS variables defined in [globals.css](src/app/globals.css) are mapped into Tailwind v4's `@theme inline` so every value is reachable as a utility class.

## Tokens

### Surfaces
- `bg-background`, `bg-surface-deep`, `bg-surface-dark`, `bg-hero-bg`, `bg-card-bg`
- `border-card-border`

### Brand & accent
- **Primary (emerald):** `bg-accent`, `bg-accent-dark`, `bg-accent-soft` — used for identity, primary CTAs, status, focus rings.
- **Secondary (indigo):** `bg-accent-secondary`, `bg-accent-secondary-dark`, `bg-accent-secondary-soft` — used for fintech/demo surfaces (Stripe, payment, auth, PDF, email automation).

### Semantic
- `text-danger` / `bg-danger` / `bg-danger-soft`
- `text-warn`, `text-positive`
- `text-muted` (Slate 500), `text-foreground`

### Typography
- Sizes: Tailwind defaults plus `text-xxs` (10px / 0.625rem).
- Weights used: `font-medium`, `font-semibold`, `font-bold`, `font-black`.
- Family: Geist Sans (`var(--font-sans)`), Geist Mono (`var(--font-mono)`).

### Radii (semantic)
- `rounded-control` — 0.75rem — inputs, small buttons, chips
- `rounded-card` — 1.5rem — content cards
- `rounded-card-lg` — 2rem — large cards & panels
- `rounded-pill` — 2.5rem — full-pill containers, status dots
- (Tailwind defaults `rounded-full`, `rounded-lg` etc. still allowed for one-offs.)

### Motion
- Durations: `--duration-fast` (150ms), `--duration-base` (300ms), `--duration-slow` (500ms)
- Easing: `--ease-emphasized` cubic-bezier(0.4, 0, 0.2, 1)
- Apply scoped transitions: `transition-colors`, `transition-transform`, or `transition-[prop1,prop2]`. Avoid `transition-all` (animates layout properties).

## Primitives

All primitives live in [src/components/ui/](src/components/ui).

| Primitive | Variants | States | a11y |
|-----------|----------|--------|------|
| `Button` | `primary` / `secondary` / `ghost` / `destructive` / `fintech`, sizes `sm/md/lg` | default, hover, active, disabled, **loading** | `aria-busy`, `type="button"` default |
| `Input` / `Textarea` | — | default, focus, **error** (with `aria-invalid`, `role="alert"` message) | `<label htmlFor>`, `aria-describedby`, `aria-invalid` |
| `Switch` | — | on / off | `role="switch"`, `aria-checked`, labeled |
| `StatusBanner` | `success` / `error` / `warn` / `info` | — | `role="alert"` for error, `aria-live` polite/assertive |
| `Card` | `solid` / `glass` / `outline` / `deep`, sizes `sm/md/lg` | — | semantic element via `as` prop |
| `Badge` | `accent` / `neutral` / `success` / `warn` / `danger` / `fintech`, sizes `xs/sm` | — | inline-block, no interactive role |

## Principles

1. **Token first, arbitrary last.** Reach for a Tailwind class with a token before writing `[#hex]` or `[Xrem]`. The only intentional one-off is the iPhone-bezel `rounded-[3.5rem]` in `MessagingDemo`.
2. **Two accents, two roles.** Emerald is the brand voice. Indigo (`accent-secondary`) is reserved for the fintech/demo aesthetic. Don't mix them on the same surface.
3. **State on every interactive control.** Disabled = visible. Loading = `aria-busy`. Focus = `focus-visible` outline (provided globally).
4. **Labels are non-negotiable.** Every input has a `<label htmlFor>` (or `sr-only` if visually hidden). Icon-only buttons carry `aria-label`.
5. **Brand colors live on the element, not the token system.** WhatsApp green (`#25D366`, `#056162`) is applied via `style={{ backgroundColor: ... }}` — it's third-party brand identity, not a system color.

## Adding a new component

1. If you find yourself re-implementing a button/input/card pattern more than twice, promote it to `src/components/ui/`.
2. Re-use existing tokens — don't invent new colors or radii without updating this doc.
3. Verify a11y: tab through it with the keyboard, trigger the screen-reader if you can, run the audit (`/design-system audit`) on the resulting branch.

## What was removed

- The duplicate `bg-[#0F172A]` / `bg-[#0A0C10]` / `bg-[#6366f1]` literals across demo files — collapsed to `bg-slate-900` / `bg-surface-deep` / `bg-accent-secondary`.
- `text-[10px]`/`text-[9px]`/`text-[11px]` arbitraries — replaced by `text-xxs`.
- `rounded-[2rem]` / `rounded-[2.5rem]` / `rounded-[1.5rem]` / `rounded-[3rem]` — replaced by semantic radius tokens.
- The hand-rolled "fake" toggle in `AccessibilityMenu` — replaced with the `Switch` primitive (real `role="switch"`).
- The duplicated indigo button styles in `StripePaymentForm` — replaced with `<Button variant="fintech">`.
