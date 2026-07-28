'use client';

import { cn } from '@/lib/cn';

/**
 * Choice Row — 342×72.
 *
 * Figma component doc (2:2094): "A generic selectable row. Selection is
 * carried by a filled indicator and the word 'Selected', never by colour
 * alone. Height 48px, clearing the 44px target."
 *
 * The 18px indicator comes back from Figma as an exported asset. It is drawn
 * here from tokens instead — §10 requires zero image assets, and a raster
 * could not follow the semantic colours into Inverse mode. Unselected is a
 * 1px ring; selected is filled, and the row border goes to 2px.
 */
interface ChoiceRowProps {
  label: string;
  /** Carries the word "Selected" when chosen — never colour alone. */
  meta: string;
  selected: boolean;
  onSelect: () => void;
  name: string;
}

export function ChoiceRow({
  label,
  meta,
  selected,
  onSelect,
  name,
}: ChoiceRowProps) {
  return (
    <label
      className={cn(
        'rounded-control border-boundary-interactive flex w-full cursor-pointer items-center gap-3 px-4 py-3',
        selected ? 'border-2' : 'border',
        'focus-within:outline-boundary-focus focus-within:outline-2 focus-within:outline-offset-2'
      )}
    >
      <input
        type="radio"
        name={name}
        checked={selected}
        onChange={onSelect}
        className="sr-only"
      />
      <span
        aria-hidden="true"
        className={cn(
          'border-boundary-interactive size-[18px] shrink-0 rounded-full border',
          selected && 'bg-text-primary'
        )}
      />
      <span className="flex min-w-0 flex-1 flex-col items-start gap-1">
        <span className="type-platform-body text-text-primary w-full">
          {label}
        </span>
        <span className="type-platform-meta text-text-secondary w-full">
          {meta}
        </span>
      </span>
    </label>
  );
}
