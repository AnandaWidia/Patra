# PATRA — Implementation Progress

**Status: complete.** All 24 frozen screens implemented, all 24 routes verified
200, typecheck and lint clean, production build succeeds.

Source of truth: Figma `JeMO98FgnYi2B4WoZzalvS`.

## Figma page node IDs

The MCP page listing is broken — it reports only `1-Foundation`. The rest were
found by probing node IDs:

| Page | Canvas node |
| --- | --- |
| 1-Foundation | `0:1` (board frame `2:2`, sections F-01…F-12) |
| 2-Components | `2:1811` — holds all 23 production screen frames |
| 3-Interactive Prototype | not located (a node on it exists: `2:4600`) |
| 4-Enginering Handoff | `2:5762` — §01–§15, read in full |

Screen frames live on **2-Components**, not on the prototype page. Text node
*names* in metadata are style roles, not copy — screen copy only comes back
from `get_design_context`, which is why each screen was pulled individually.

## Screens — 24 of 24

| Screen | Figma node | Route |
| --- | --- | --- |
| Splash | (no frame; §03/§07/§10) | `/` |
| Home | `2:3320` | `/home` |
| Explore | `2:2682` | `/explore` |
| Cultural Calendar | `2:3343` | `/calendar` |
| My Bookings | `2:3235` | `/bookings` |
| Messages | `2:3292` | `/messages` |
| Profile | `2:3252` | `/profile` |
| Profile (Signed Out) | `2:3281` | `/profile/signed-out` |
| Experience Detail | `2:1863` | `/experience/[id]` |
| Host Profile | `2:2529` | `/host/[id]` |
| Choose a Day | `2:2913` | `/experience/[id]/choose-day` |
| Checkout | `2:2557` | `/experience/[id]/checkout` |
| Confirmation | `2:2589` | `/experience/[id]/confirmation` |
| Your Booking | `2:2949` | `/bookings/[id]` |
| Your Booking (Offline) | `2:2979` | `/bookings/[id]/offline` |
| Message Thread | `2:3304` | `/messages/[id]` |
| Sign In | `2:3190` | `/sign-in` |
| Set a Password | `2:3207` | `/set-password` |
| Reset Password | `2:3222` | `/reset-password` |
| Verify Identity | `2:3449` | `/experience/[id]/verify-identity` |
| Explore (Loading) | `2:3382` | `/explore/loading-state` |
| Explore (Offline) | `2:3426` | `/explore/offline` |
| My Bookings (Empty) | `2:3395` | `/bookings/empty` |
| Checkout (Payment Failed) | `2:3406` | `/experience/[id]/checkout/payment-failed` |

## Components

Typography (7 roles), Gap, ActionControl, TextLink, TextInput, ChoiceRow,
BookingCard, ConversationRow, Message, Review, ExperienceCard,
VerificationBlock, RevenueSplitBlock, BookingSummary, CalendarMonth,
AvailabilityWeek, PhotographPlaceholder, StatusBand.

Shell: AppShell (entry/pushed/root + footer slot), StatusBar,
NavigationHeader, BottomNavigation, PageTransition, DevicePreview.

Contexts: SessionProvider, BookingProvider.

Data: profile, bookings, conversations, messages, experiences, hosts, reviews,
calendar, payment-methods, settings.

## Verification results

- **Typecheck** — pass, zero errors.
- **Lint** — pass, zero warnings. Custom rules block shadows, gradients,
  literal hex, ad-hoc font sizes and inline styles in UI code.
- **Build** — succeeds; 25 route entries compiled.
- **Routes** — all 24 return 200.
- **Navigation** — booking chain verified live end to end: Experience Detail →
  Choose a Day → Checkout → Confirmation → Message Thread. Back returns to the
  correct surface and restores the tab bar. Tab switches resolve. Pushed
  surfaces correctly carry no tab bar.
- **State** — booking draft survives back (party size and date both retained),
  satisfying §07.
- **Composer** — sending appends a message, does not navigate, is pinned
  outside the scroll region, and clears the field.
- **Touch targets** — zero interactive elements below 44×44 (§11 pass/fail
  gate). Calendar cell measures 45.4 × 48, matching §04/§11.
- **Layout** — frame 390px, content column exactly 342px.
- **Tokens** — host/title Spectral 32/40 at −0.32px; host/lede 24/36;
  revenue split `#38604A` (voice/confirmation); verification block `#F0EDE3`
  (surface/raised); **zero** shadowed elements; the only radius in use is 4px.
- **Responsive** — 375 (frame fills, column 327), 414 (frame 390 centred,
  column 342), 768 (frame 390×844 centred, column 342). No horizontal body
  scroll at any width.
- **Console / server** — no errors.

## Defects found and fixed during verification

1. Action Control measured 49.6px; a CSS border expands a padded box where a
   Figma stroke does not. Height pinned to 48px.
2. Calendar cell had the same defect — pinned to 48px.
3. The desktop scrollbar was consuming 15px of the frozen 342px content
   column, dragging calendar cells to 43.3px (below the 45px §11 specifies).
   The scroll region now uses an overlay scrollbar, as the target phone does.
4. Calendar day buttons announced a bare numeral; they now carry a full date.
5. `platform/label` forced uppercase, which would have rewritten the sentence-
   case craft line on Experience Card. Casing now comes from the copy.

## Open items (not engineering tasks)

- **No production photography.** 0 of ~12 assets. Every screen carrying a
  `PhotographPlaceholder` is unshippable per DD-06. Oldest open item.
- **No app icon.** `manifest.webmanifest` ships an empty `icons` array rather
  than an invented one.
- **Header titles on pushed surfaces** derive from the §03 Screen Inventory
  names. The shell integration lives on page `3-Interactive Prototype`, which
  could not be enumerated. A node-specific URL would let these be confirmed.
- **i18n** — §11 wants English/Bahasa at parity; the string layer is not yet
  extracted.

See `README.md` for the full list of deliberate deviations and their reasons.
