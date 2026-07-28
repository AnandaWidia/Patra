'use client';

import Image from 'next/image';

import { PHOTOGRAPHY, type PhotoKey } from '@/constants/assets';
import { usePresentation } from '@/contexts/presentation-context';
import { cn } from '@/lib/cn';

/**
 * Photograph Placeholder — 342×332.
 *
 * Figma component doc (2:1974): "Six-field commissioning brief standing in
 * for an unshot photograph. Per DD-06 a screen carrying this is not
 * shippable."
 *
 * §10 called this "a build-time asset slot, not a shipped component". That is
 * exactly how it behaves: give it a `photo` key and, in Presentation Mode, the
 * delivered photograph fills the slot. The brief stays in the tree — invisible
 * but still laying out — so the box measures identically in both modes. No
 * spacing, border or radius value changes between them.
 * §11 — alt text is derived from the commissioning brief subject field.
 */
interface PhotographPlaceholderProps {
  /** The commissioning brief SUBJECT field. Doubles as alt text. */
  subject?: string;
  /** Compact form used inside Experience Card. */
  compact?: boolean;
  /**
   * The single line the compact form carries. Defaults to the standard
   * notice; Host Profile's card names the brief instead (frame 2:2550).
   */
  caption?: string;
  /** Delivered photography for this slot. See constants/assets.ts. */
  photo?: PhotoKey;
}

export function PhotographPlaceholder({
  subject,
  compact = false,
  caption = 'PHOTOGRAPH NOT YET TAKEN',
  photo,
}: PhotographPlaceholderProps) {
  const presenting = usePresentation();
  const asset = photo ? PHOTOGRAPHY[photo] : undefined;
  const showPhoto = presenting && Boolean(asset);

  const label = subject ?? (compact ? caption : undefined);
  const alt = label ?? asset?.alt ?? 'Photograph not yet taken';

  return (
    <div
      role={showPhoto ? undefined : 'img'}
      aria-label={
        showPhoto
          ? undefined
          : subject
            ? `Photograph not yet taken. ${subject}`
            : 'Photograph not yet taken'
      }
      className={cn(
        'relative flex w-full flex-col items-center overflow-hidden border border-dashed px-6',
        compact ? 'py-12' : 'gap-2 py-36',
        // The dashed frame and sunken fill belong to the brief, not to the
        // photograph — but the border box is kept in both modes so the slot
        // measures identically whichever one is showing.
        showPhoto
          ? 'border-transparent'
          : 'border-boundary-interactive bg-surface-sunken'
      )}
    >
      {showPhoto ? (
        <Image
          src={asset!.src}
          alt={alt}
          fill
          sizes="390px"
          className="object-cover"
          priority={!compact}
        />
      ) : null}

      {/* Kept in flow in both modes so the box height never shifts. */}
      <p
        aria-hidden={showPhoto || undefined}
        className={cn(
          'type-platform-label text-text-secondary w-full text-center',
          showPhoto && 'invisible'
        )}
      >
        {compact ? caption : 'PHOTOGRAPH NOT YET TAKEN'}
      </p>
      {subject && !compact ? (
        <p
          aria-hidden={showPhoto || undefined}
          className={cn(
            'type-platform-meta text-text-secondary w-full text-center',
            showPhoto && 'invisible'
          )}
        >
          {subject}
        </p>
      ) : null}
    </div>
  );
}
