import { cn } from '@/lib/cn';

/** §05 — the spacing scale. Seven values, no others. */
export type SpacingValue = 0 | 4 | 8 | 12 | 16 | 24 | 48;

const HEIGHT: Record<SpacingValue, string> = {
  0: 'h-0',
  4: 'h-1',
  8: 'h-2',
  12: 'h-3',
  16: 'h-4',
  24: 'h-6',
  48: 'h-12',
};

/**
 * A vertical spacer.
 *
 * The frozen frames express rhythm as explicit `gap-N` nodes between siblings
 * rather than as container gap, so the same structure is kept here. It also
 * makes an off-scale value impossible to write by accident — the type only
 * admits the seven frozen values.
 */
export function Gap({ size }: { size: SpacingValue }) {
  return (
    <div aria-hidden="true" className={cn('w-full shrink-0', HEIGHT[size])} />
  );
}
