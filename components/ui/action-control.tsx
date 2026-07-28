'use client';

import Link from 'next/link';

import { cn } from '@/lib/cn';

/**
 * Action Control — 342×48.
 *
 * Figma component doc (2:1989): "The single primary action on a surface.
 * Bordered rather than filled — DD-03 specimen 05 rejected the gradient CTA.
 * Height 48px, clearing the 44px WCAG 2.5.5 target. Focus uses boundary/focus
 * at 2px outside, giving the element radius plus offset."
 *
 * §04 — one per surface. Secondary paths are underlined text links, never a
 * second control.
 */

const BASE =
  // §11 — 342×48 is a verified touch target. The height is set explicitly
  // because a Figma stroke does not expand its frame, but a CSS border does.
  'flex h-12 w-full items-center justify-center rounded-control border border-boundary-interactive ' +
  'px-4 type-platform-body text-center text-text-primary ' +
  // §11 — 2px boundary/focus, keyboard focus only. Never hover, never selection.
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-boundary-focus';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: never;
};

type LinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export function ActionControl(props: ButtonProps | LinkProps) {
  if ('href' in props && props.href) {
    const { href, children, className } = props;
    return (
      <Link href={href} className={cn(BASE, className)}>
        {children}
      </Link>
    );
  }

  const {
    className,
    children,
    type = 'button',
    ...rest
  } = props as ButtonProps;
  return (
    <button type={type} className={cn(BASE, className)} {...rest}>
      {children}
    </button>
  );
}

/**
 * The secondary path. §04 — underlined text, never a second control.
 */
export function TextLink({
  href,
  children,
  className,
  onClick,
}: {
  href?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const style = cn(
    'type-platform-body w-full text-center text-text-primary underline decoration-solid',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-boundary-focus',
    className
  );

  if (href) {
    return (
      <Link href={href} className={style}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={style}>
      {children}
    </button>
  );
}
