/**
 * PATRA — Presentation asset register.
 *
 * §10 lists photography as the one blocking dependency: "0 of ~12 exist...
 * Each Photograph Placeholder in Figma carries a six-field commissioning
 * brief." This file is the delivery of that commission. It maps each frozen
 * placeholder slot to a local file — nothing more. No layout, spacing,
 * typography or colour is expressed here, and no screen imports it directly.
 *
 * Every file is stored locally under /public/images. Nothing is hotlinked.
 * Provenance for each is recorded in ASSETS.md.
 */

export interface PhotoAsset {
  src: string;
  /**
   * Fallback alt. §11 prefers alt derived from the commissioning brief
   * subject, so the caller's `subject` wins when one is present.
   */
  alt: string;
}

export const PHOTOGRAPHY = {
  /** Home hero — the carver at his workbench. */
  'home-hero': {
    src: '/images/experiences/home-carver-at-work.jpg',
    alt: 'A carver shaping wood by hand with traditional tools.',
  },
  /** Experience Detail hero — hands, chisel, unfinished wood. */
  'experience-detail-hero': {
    src: '/images/experiences/experience-carving-hands-chisel.jpg',
    alt: 'Hands carving wood with chisels, shavings gathering on the bench.',
  },
  /** Checkout hero — the same workbench, before payment. */
  'checkout-hero': {
    src: '/images/experiences/checkout-carving-workbench.jpg',
    alt: 'Wood carving tools and shavings resting on a workbench.',
  },
  /** Confirmation hero — arrival, offerings carried to the compound. */
  'confirmation-hero': {
    src: '/images/experiences/confirmation-temple-arrival.jpg',
    alt: 'A woman carrying offerings before an ornate temple entrance.',
  },
  /** Host Profile hero — the host, photographed plainly. */
  'host-profile-hero': {
    src: '/images/hosts/host-imade-suarta-portrait.jpg',
    alt: 'Portrait of an older man wearing a traditional headdress.',
  },

  /** Experience Card — exp-01, carving in hibiscus wood. */
  'card-carving': {
    src: '/images/experiences/card-carving-hibiscus-wood.jpg',
    alt: 'A carved wooden face, weathered and cracked with age.',
  },
  /** Experience Card — exp-02, cooking and offerings. */
  'card-cooking': {
    src: '/images/experiences/card-cooking-offerings.jpg',
    alt: 'A tall offering of fruit and flowers held in both hands.',
  },
  /** Experience Card — exp-03, gamelan. */
  'card-gamelan': {
    src: '/images/experiences/card-gamelan-musicians.jpg',
    alt: 'A performer in traditional costume dancing beside gamelan musicians.',
  },
} as const satisfies Record<string, PhotoAsset>;

export type PhotoKey = keyof typeof PHOTOGRAPHY;
