# PATRA

A mobile booking application for cultural experiences hosted by Balinese
households. A traveller browses verified hosts, selects a date the village
calendar permits, pays, and arrives with an offline-readable booking. 80% of
the payment reaches the host household, shown as a line item rather than a
marketing claim.

This is a faithful implementation of a frozen design. It is not a redesign.

## Install and run

```bash
npm install
```

```bash
npm run dev
```

The application runs at `http://localhost:3000`. It opens on Splash, which
auto-advances to Home after 800ms.

Other scripts:

```bash
npm run typecheck && npm run lint && npm run build
```

## Source of truth

Every value in this codebase is measured from the Figma file
`JeMO98FgnYi2B4WoZzalvS`, not described from memory. Section references in the
code (`§05`, `§14`, `DD-03`, `AM-02`) point at the Engineering Handoff on page
`4-Enginering Handoff`, which governs wherever this README is silent.

| Figma page | Canvas node |
| --- | --- |
| 1-Foundation | `0:1` |
| 2-Components | `2:1811` — holds all 23 production screen frames |
| 3-Interactive Prototype | not located (see Known gaps) |
| 4-Enginering Handoff | `2:5762` — §01–§15 |

## Stack

Next.js 15.5 (App Router, Turbopack) · React 19.1 · TypeScript (strict) ·
Tailwind CSS v4 · Motion (Framer Motion) · React Context · ESLint · Prettier.

## Architecture

```
app/          routes only — each page composes a shell and one feature screen
components/
  shell/      StatusBar, NavigationHeader, BottomNavigation, AppShell,
              PageTransition, DevicePreview
  ui/         the frozen components, variants as props
contexts/     SessionProvider, BookingProvider
features/     screens grouped by domain: discovery, booking, account,
              messaging, system-states
constants/    design tokens as values, route table
data/         mock JSON — no backend, no API calls
types/        the 10 entities from §09
styles/       the token layer
lib/          cn()
```

### The token layer

`styles/globals.css` holds two collections. Primitives carry raw values in one
mode and are never imported by feature code. Semantics alias them across Light
and Inverse, and are the only thing components bind to.

Eleven semantic colour tokens, seven type roles, one radius (4px, controls
only — surfaces are square), borders at 1px and 2px only, and a spacing scale
of exactly `{0, 4, 8, 12, 16, 24, 48}`.

Deliberately absent, and load-bearing: **no shadows, no elevation, no
gradients, no opacity tokens, no icon library, no second transition.** ESLint
enforces the first four; `constants/design.ts` types the spacing scale so an
off-scale value cannot be written by accident.

### Shell

One shell, reused by every surface. A vertical stack with no absolute
positioning: status bar → optional header → scroll region (flex 1) → optional
footer → optional bottom navigation. Chrome is fixed because it sits outside
the scroll region, not because of a fixed-position flag.

Three classes, with scroll heights derived rather than hardcoded:

| Variant | Chrome | Scroll region |
| --- | --- | --- |
| `entry` | status bar only | 800px |
| `pushed` | status bar + 56px header | 744px |
| `root` | status bar + header + 90px tab bar | 710px |

### Motion

Exactly one transition exists: push, left, 300ms, ease-out, defined once in
`constants/design.ts` and applied only in
`components/shell/page-transition.tsx`. Root tab switches are instant — tabs
are siblings with no spatial relationship. `prefers-reduced-motion` renders
every transition instantly.

### Responsive

390 × 844 is the only size designed. Narrow viewports (375, 390, 393, 414) let
the frame fill the width. Wider viewports centre the phone frame rather than
reflowing, because §14 says to treat any wider layout as undesigned rather
than inferring one.

## Screens

24 surfaces. Splash, Home, Explore, Cultural Calendar, My Bookings, Messages,
Profile, Profile (Signed Out), Experience Detail, Host Profile, Choose a Day,
Checkout, Confirmation, Your Booking, Message Thread, Sign In, Set a Password,
Reset Password, Verify Identity, plus five system states: Explore (Loading),
Explore (Offline), My Bookings (Empty), Checkout (Payment Failed), Your
Booking (Offline).

## Deliberate deviations from the frames

Each of these corrects a defect the handoff names, or resolves a conflict
between the frames and the platform. Nothing else departs from Figma.

1. **The Status Bar is implemented.** §04 says to use the platform status bar
   instead. A browser has none, and every frame budgets 44px for it inside the
   844px viewport, so omitting it would break the derived scroll heights.
2. **Control heights are pinned to 48px.** A Figma stroke does not expand its
   frame; a CSS border does, which measured 49.6px. §11 lists 342×48 as a
   verified touch target.
3. **The unread dot and the Choice Row indicator are drawn from tokens,** not
   from the exported PNGs. §10 requires zero image assets, and a raster fill
   cannot follow `voice/brand` into Inverse mode.
4. **`text-transform: uppercase` is not applied to `platform/label`.** The
   Experience Card sets that role in sentence case; forcing uppercase would
   rewrite frozen copy. Casing is carried by the copy itself.
5. **The Message Thread composer is pinned** below the scroll region. §14:
   "engineering should pin it — this is the correct behaviour and the Figma
   limitation should not be reproduced."
6. **Payment Method reuses Choice Row.** §14 requires its off-scale 2px label
   gap to be rounded to 4px, which makes it geometrically identical to Choice
   Row; the Figma doc already logs the duplication as CA-04.
7. **Availability Week's 2px internal gaps are rounded to 4px,** per §14.
8. **Root surfaces use 24px vertical padding,** not the 48px some frozen
   frames carry. Those frames predate shell integration; §06 and Stage 5
   refinement R4 both set 24px once chrome exists.
9. **An optimistic sent-state was added to the composer.** §14: "engineering
   should add one; it will not conflict with anything frozen."
10. **shadcn/ui is not initialised and `lucide-react` is unused.** Both ship
    shadows, elevation and iconography that §05 and §10 zero out.

## Known gaps

- **No production photography.** Zero of roughly twelve assets exist. Every
  screen carrying a `PhotographPlaceholder` is unshippable per DD-06. This is
  a scheduling dependency, not an engineering task, and it is the oldest open
  item in the project. The component is a build-time asset slot: pass `src`
  once photography exists.
- **No app icon.** Required for store submission, not covered by any frozen
  artefact. `manifest.webmanifest` ships with an empty `icons` array rather
  than an invented one.
- **Header titles on pushed surfaces** are taken from the §03 Screen Inventory
  names. The real shell integration lives on page `3-Interactive Prototype`,
  which the Figma MCP could not enumerate — its page listing returns only
  `1-Foundation`. A node-specific URL for that page would let these be
  confirmed rather than derived.
- **No backend.** Everything runs on the mock JSON in `data/`.
- **i18n.** §11 requires English and Bahasa Indonesia at parity. The string
  layer is not yet extracted; copy currently sits in the screen components.
