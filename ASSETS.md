# PATRA — Presentation Asset Pack

Every asset below is stored locally under `public/`. Nothing is hotlinked, and
the application runs with no network access once installed.

This pack changes **only** asset references. No layout, spacing, typography,
colour, copy, navigation, interaction or component hierarchy was modified. The
frozen engineering implementation is untouched — see *Verification* at the
foot of this file.

---

## 1. Photography

Eight photographs, delivered against the commissioning briefs in §10 of the
Engineering Handoff ("0 of ~12 exist... BLOCKING DEPENDENCY").

All eight are from **Unsplash** under the [Unsplash
License](https://unsplash.com/license): free for commercial and non-commercial
use, no permission needed. Attribution is not required by the licence; it is
recorded here anyway because the photographers earned it.

| File | Used on | Photographer | Source page | Size |
| --- | --- | --- | --- | --- |
| `images/experiences/home-carver-at-work.jpg` | Home — hero | Nick & Djalila | https://unsplash.com/photos/a-man-sitting-on-a-bench-carving-a-piece-of-wood-Slu_XC0x4Uo | 134 KB |
| `images/experiences/experience-carving-hands-chisel.jpg` | Experience Detail — hero | Sander Hallaste | https://unsplash.com/photos/hands-carving-wood-with-chisels-and-shavings-OoOJyr6BD7I | 88 KB |
| `images/experiences/checkout-carving-workbench.jpg` | Checkout — hero | Sander Hallaste | https://unsplash.com/photos/wood-carving-tools-and-shavings-on-a-workbench-gzcOaUS9Lxc | 62 KB |
| `images/experiences/confirmation-temple-arrival.jpg` | Confirmation — hero | Galih Jelih | https://unsplash.com/photos/woman-carrying-offerings-in-front-of-ornate-temple-entrance-wahxesjKzrw | 92 KB |
| `images/hosts/host-imade-suarta-portrait.jpg` | Host Profile — hero | Matthew Stephenson | https://unsplash.com/photos/a-portrait-of-an-older-man-wearing-a-headdress-QuH1xwEhJas | 94 KB |
| `images/experiences/card-carving-hibiscus-wood.jpg` | Experience Card, exp-01 — Home, Explore, Host Profile, Explore (Offline) | Haberdoedas | https://unsplash.com/photos/cracked-wooden-sculpture-of-a-serene-face-with-intricate-details-Z-Z5Oc3Vos8 | 126 KB |
| `images/experiences/card-cooking-offerings.jpg` | Experience Card, exp-02 — Home, Explore, Explore (Offline) | Mutiara Salsabila Irawan | https://unsplash.com/photos/person-holding-a-tall-offering-with-fruits-and-flowers-TlRP5Bee338 | 158 KB |
| `images/experiences/card-gamelan-musicians.jpg` | Experience Card, exp-03 — Home, Explore | Eyestetix Studio | https://unsplash.com/photos/performer-in-traditional-costume-dances-with-musicians-fdwdgp6FPss | 154 KB |

### Why these images

Each was chosen against the six-field commissioning brief the frozen frame
carries, not for general prettiness:

- **Home** — the brief reads *"I Made Suarta at his workbench, mid-cut, not
  looking up."* A carver working with hand tools, absorbed in the work.
- **Experience Detail** — *"EXP-004 · Hero · hands, chisel, unfinished wood."*
  Hands, a chisel, and shavings on the bench. Literally the brief.
- **Checkout** — the same workshop, tools at rest. The traveller is deciding,
  not yet arriving.
- **Confirmation** — offerings carried toward a compound gate: arrival, and
  the household preparing. §03 calls this surface "post-payment relief".
- **Host Profile** — a plain portrait of an older man in traditional
  headdress, natural light, not posed for camera. §04 asks for provenance,
  not marketing.
- **Cards** — carving, offerings and gamelan, one per experience, so Explore
  reads as three distinct crafts rather than three views of one.

All are documentary in register: natural light, no HDR, no resort marketing,
no stock-photo smiles — matching DD-06 and the anti-references in DD-03.

### Honest limitations

- These are **stand-ins for a commissioned shoot, not photographs of the
  people the product names.** No image depicts a real "I Made Suarta", and no
  consent was obtained from any subject for use in PATRA. §10 requires consent
  to be *"written, renewable and revocable"* — that requirement is unmet, and
  it remains unmet by this pack.
- **Not every subject is verifiably Balinese.** The host portrait shows a man
  in a batik *udeng* and the offering and gamelan images are Balinese, but the
  two carving images are of Southeast Asian artisans whose location the source
  does not state. Freely-licensed photography of named Balinese wood carvers
  at work is scarce; where a choice existed, craft accuracy and documentary
  register were preferred over a caption that merely said "Bali".
- One earlier candidate for the Home hero was rejected on inspection: it
  showed *leather* wayang punching, not wood carving. Two Unsplash+ premium
  images were rejected because that licence is not free to use.
- **Release is therefore still blocked.** DD-06 says a screen carrying a
  placeholder is unshippable; this pack makes the product demonstrable, not
  shippable. Twelve commissioned photographs with signed consent are still
  outstanding.

---

## 2. Icons and brand assets

Generated locally from the frozen design tokens. No third-party source, no
licence obligation.

| File | Purpose | Size |
| --- | --- | --- |
| `app/icon.png` | Favicon / browser tab (512×512, Next.js serves it) | 5 KB |
| `app/apple-icon.png` | Apple touch icon (180×180) | 1 KB |
| `public/favicon.ico` | Classic favicon (32×32) | <1 KB |
| `public/images/icons/icon-192.png` | PWA icon, `purpose: any` | 1 KB |
| `public/images/icons/icon-512.png` | PWA icon, `purpose: any` | 5 KB |
| `public/images/icons/icon-maskable-512.png` | PWA icon, `purpose: maskable` | 4 KB |
| `public/images/og/og-patra.png` | Open Graph / Twitter card (1200×630) | 14 KB |

Branding was not redesigned. §10 states the wordmark *is* type: "PATRA set in
Spectral Regular 44/52 at -2% tracking. No SVG, no lockup, no app-icon artwork
has been designed." So the icons are set in genuine **Spectral Regular** — the
same family the application loads — on `surface/page` `#FBFAF6` with
`text/primary` `#1C1B18`. No other colour appears. The square icons carry the
wordmark's initial; the Open Graph image carries the full wordmark above a
line of the product's own copy, in `text/secondary` `#5B574C`.

The maskable icon insets the glyph to ~46% so it survives the platform's
circular safe-zone crop.

---

## 3. Assets deliberately **not** created

| Category | Count | Why |
| --- | --- | --- |
| Avatars | 0 | The frozen design has no avatar component. Hosts and travellers are represented by name and by attributed verification, never by a face-in-a-circle. There was nothing to replace. |
| Illustrations | 0 | §10: *"Illustrations — 0 required. None exist and none are specified. Do not commission any."* The brief instructed replacing illustration placeholders "only where the frozen design expects an illustration"; it expects none. |
| Icons (UI) | 0 | §10: *"The product has no iconography. The only glyph is U+2190 rendered as text in IBM Plex Sans. Do not add an icon library."* The back arrow remains type. |

`public/images/avatars/` and `public/images/illustrations/` exist as empty
directories to match the requested structure.

---

## 4. Optimisation

Every photograph was re-encoded by `scripts/optimise-images.mjs` (sharp,
mozjpeg, quality 72, progressive) and capped at 1000px wide — enough for a 3×
device pixel ratio over a 342px slot.

```
2,768 KB downloaded  ->  859 KB shipped   (69% smaller)
```

Total asset payload including icons: **882 KB**.

Serving is via `next/image`, so each slot is additionally resized and served
as WebP/AVIF where the browser supports it. §03 notes Mas has patchy
reception; on this product that is a design constraint, not a detail.

---

## 5. Presentation Mode

One application, one component set, one stylesheet. Presentation Mode swaps
asset references and nothing else.

- `constants/assets.ts` — the register: asset key → local path + fallback alt.
- `contexts/presentation-context.tsx` — a single boolean.
- `components/ui/photograph-placeholder.tsx` — the only consumer. §10 called
  this component *"a build-time asset slot, not a shipped component"*, and
  that is precisely how it behaves.

The commissioning brief stays in the DOM in both modes — invisible but still
laying out — and the border box is preserved with a transparent border when a
photograph shows, so the slot measures identically either way.

**Switching modes:**

| How | Effect |
| --- | --- |
| `npm run dev` | Presentation Mode (default) |
| append `?mode=engineering` to any URL | frozen placeholder state |
| `NEXT_PUBLIC_PRESENTATION=0` in `.env.local` | frozen placeholder state, build-wide |

---

## 6. Verification

Geometry was compared between the two modes on every screen that carries a
placeholder, by measuring the width, height and page offset of each
text-bearing node:

| Route | Text nodes compared | Identical | Page height |
| --- | --- | --- | --- |
| `/home` | 27 | yes | 1806 / 1806 |
| `/explore` | 25 | yes | 1405 / 1405 |
| `/explore/offline` | 20 | yes | 1007 / 1007 |
| `/experience/exp-01` | 40 | yes | 2518 / 2518 |
| `/host/host-01` | 53 | yes | 1703 / 1703 |
| `/experience/exp-01/checkout` | 35 | yes | 1724 / 1724 |
| `/experience/exp-01/confirmation` | 26 | yes | 1550 / 1550 |

**226 nodes, zero differences in size or position.** The only DOM difference
between the two modes is the presence of the `<img>` elements themselves.
