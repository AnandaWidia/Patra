'use client';

import Link from 'next/link';

import type { PhotoKey } from '@/constants/assets';

import { Gap } from './gap';
import { PhotographPlaceholder } from './photograph-placeholder';

/**
 * Experience Card — 342×240.
 *
 * Figma component doc (2:1996): "Browsing unit for Explore, Host Profile and
 * Village Profile. Leads with the person, states the format, carries the
 * verification. No price and no rating — §26 ranks price seventh and DD-03
 * specimen 01 rejected both on the card."
 */
interface ExperienceCardProps {
  href: string;
  /** The platform/label line above the lede. */
  craft: string;
  /**
   * The host/lede line. Host Profile puts the craft here instead of the
   * name, because the person is already established on that surface.
   */
  hostName: string;
  availability: string;
  verification: string;
  /** Overrides the placeholder caption (Host Profile names the brief). */
  photoCaption?: string;
  /** Delivered photography for this card's slot. */
  photo?: PhotoKey;
}

export function ExperienceCard({
  href,
  craft,
  hostName,
  availability,
  verification,
  photoCaption,
  photo,
}: ExperienceCardProps) {
  return (
    <Link
      href={href}
      className="focus-visible:outline-boundary-focus flex w-full flex-col items-start focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <PhotographPlaceholder compact caption={photoCaption} photo={photo} />
      <Gap size={16} />
      <p className="type-platform-label text-text-secondary w-full">{craft}</p>
      <Gap size={4} />
      {/* §05 authorship rule — the person's name is serif. */}
      <p className="type-host-lede text-text-primary w-full">{hostName}</p>
      <Gap size={8} />
      <p className="type-platform-meta text-text-secondary w-full">
        {availability}
      </p>
      <Gap size={8} />
      <p className="type-platform-meta text-text-secondary w-full">
        {verification}
      </p>
    </Link>
  );
}
