'use client';

import Link from 'next/link';

import { cn } from '@/lib/cn';

import { Gap } from './gap';

/**
 * Conversation Row — 342×156.
 *
 * Figma component doc (2:2399): "Unread is signalled three ways and never by
 * colour alone: a 2px border instead of 1px, a voice/brand dot, and the word
 * UNREAD in the attribution label. Host name in the serif per AM-02."
 *
 * The dot comes back from Figma as an exported ellipse asset. It is rendered
 * here as a token-driven 6px circle instead: §10 states the product requires
 * zero icon or image assets, and a rasterised fill could not follow
 * voice/brand across the Light and Inverse modes.
 */
interface ConversationRowProps {
  href: string;
  hostName: string;
  preview: string;
  timestamp: string;
  unread: boolean;
}

export function ConversationRow({
  href,
  hostName,
  preview,
  timestamp,
  unread,
}: ConversationRowProps) {
  return (
    <Link
      href={href}
      className={cn(
        'rounded-control border-boundary-interactive flex w-full flex-col items-start p-4',
        unread ? 'border-2' : 'border',
        'focus-visible:outline-boundary-focus focus-visible:outline-2 focus-visible:outline-offset-2'
      )}
    >
      <div className="flex w-full items-center gap-2">
        {unread ? (
          <span
            aria-hidden="true"
            className="bg-voice-brand size-1.5 shrink-0 rounded-full"
          />
        ) : null}
        {/* §11 — attribution is announced before the content it attributes. */}
        <p className="type-platform-label text-text-secondary min-w-0 flex-1">
          {hostName.toUpperCase()}
          {unread ? ' · UNREAD' : ''}
        </p>
      </div>
      <Gap size={8} />
      <p className="type-host-body text-text-primary w-full">{hostName}</p>
      <Gap size={4} />
      <p className="type-platform-meta text-text-secondary w-full">{preview}</p>
      <Gap size={8} />
      <p className="type-platform-meta text-text-secondary w-full">
        {timestamp}
      </p>
    </Link>
  );
}
