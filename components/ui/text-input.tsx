'use client';

import { useId } from 'react';

import { cn } from '@/lib/cn';

/**
 * Text Input — 342×72.
 *
 * Figma component doc (2:2353): "Label in platform/label above a bordered
 * field carrying platform/body. Default uses boundary/interactive at 1px.
 * Focused uses boundary/focus at 2px. §41 reserves boundary/focus for
 * keyboard focus and forbids it for hover or selection. Field height 48px,
 * clearing the 44px target. Radius 4."
 */
interface TextInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'className'
> {
  label: string;
  className?: string;
}

export function TextInput({ label, className, ...rest }: TextInputProps) {
  const id = useId();

  return (
    <div className={cn('flex w-full flex-col items-start', className)}>
      <label
        htmlFor={id}
        className="type-platform-label text-text-secondary w-full"
      >
        {label}
      </label>
      <div aria-hidden="true" className="h-2 w-full shrink-0" />
      <input
        id={id}
        className={
          'type-platform-body rounded-control border-boundary-interactive h-12 w-full border ' +
          'text-text-primary placeholder:text-text-secondary bg-transparent px-4 py-3 ' +
          // 2px boundary/focus replaces the 1px boundary/interactive on focus.
          'focus-visible:border-transparent focus-visible:outline-2 focus-visible:outline-offset-0 ' +
          'focus-visible:outline-boundary-focus'
        }
        {...rest}
      />
    </div>
  );
}
