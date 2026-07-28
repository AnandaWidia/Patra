'use client';

import Link from 'next/link';

import { cn } from '@/lib/cn';

import { Gap } from './gap';

/**
 * Booking Card — 342×132.
 *
 * Figma component doc (2:2367): "A booking as a record rather than an offer.
 * Leads with the date because a booking list is scanned for when, not for
 * what. The host name stays in the serif per AM-02. Upcoming carries
 * voice/confirmation on the status line; past drops to text/secondary
 * throughout, because a completed booking is history rather than a live
 * commitment. R1 — the card carries a boundary/interactive border and no
 * fill: in this product that border means the element can be acted on."
 */
interface BookingCardProps {
  href: string;
  date: string;
  hostName: string;
  detail: string;
  status: string;
  variant: 'upcoming' | 'past';
}

export function BookingCard({
  href,
  date,
  hostName,
  detail,
  status,
  variant,
}: BookingCardProps) {
  const past = variant === 'past';

  return (
    <Link
      href={href}
      className={
        'rounded-control border-boundary-interactive flex w-full flex-col items-start border p-4 ' +
        'focus-visible:outline-boundary-focus focus-visible:outline-2 focus-visible:outline-offset-2'
      }
    >
      <p className="type-platform-label text-text-secondary w-full">{date}</p>
      <Gap size={4} />
      <p
        className={cn(
          'type-host-body w-full',
          past ? 'text-text-secondary' : 'text-text-primary'
        )}
      >
        {hostName}
      </p>
      <Gap size={4} />
      <p className="type-platform-meta text-text-secondary w-full">{detail}</p>
      <Gap size={8} />
      {/* §05 — voice/confirmation is for confirmed status lines only. */}
      <p
        className={cn(
          'type-platform-meta w-full',
          past ? 'text-text-secondary' : 'text-voice-confirmation'
        )}
      >
        {status}
      </p>
    </Link>
  );
}
