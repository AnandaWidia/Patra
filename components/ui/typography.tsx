import { cn } from '@/lib/cn';

/**
 * The seven type roles from §05. There are no others, and no ad-hoc font
 * sizes anywhere else in the codebase.
 *
 * §05 authorship rule, binding: Spectral carries words a human wrote — host,
 * traveller, community. IBM Plex Sans carries everything functional,
 * transactional or system-generated.
 */

type El = React.ElementType;

interface TypeProps extends React.HTMLAttributes<HTMLElement> {
  as?: El;
  children: React.ReactNode;
}

function make(role: string, defaultEl: El, defaultTone: string) {
  return function Type({ as, className, children, ...rest }: TypeProps) {
    const Component = as ?? defaultEl;
    return (
      <Component className={cn(role, defaultTone, className)} {...rest}>
        {children}
      </Component>
    );
  };
}

/** Splash wordmark, Your Booking time. */
export const Display = make('type-host-display', 'p', 'text-text-primary');

/** Screen titles that speak. */
export const Title = make('type-host-title', 'h2', 'text-text-primary');

/** Opening sentences, addresses, ceremony names. */
export const Lede = make('type-host-lede', 'p', 'text-text-primary');

/** §14 — the Bahasa quotation on Host Profile. */
export const LedeItalic = make(
  'type-host-lede-italic',
  'p',
  'text-text-primary'
);

/** Narrative prose and any words a person authored. */
export const HostBody = make('type-host-body', 'p', 'text-text-primary');

/** Functional copy, controls, values. */
export const Body = make('type-platform-body', 'p', 'text-text-primary');

/** Secondary notes. */
export const Meta = make('type-platform-meta', 'p', 'text-text-secondary');

/**
 * Uppercase section labels and attribution.
 * §11 — these are headings, not decoration, and attribution labels must be
 * announced before the content they attribute.
 */
export const Label = make('type-platform-label', 'p', 'text-text-secondary');
