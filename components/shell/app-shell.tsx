import type { ShellClass } from '@/constants/design';
import { cn } from '@/lib/cn';

import { BottomNavigation } from './bottom-navigation';
import { NavigationHeader } from './navigation-header';
import { PageTransition } from './page-transition';
import { StatusBar } from './status-bar';

interface AppShellProps {
  /** §06 — entry (no chrome beyond the status bar), pushed, or root. */
  variant: ShellClass;
  title?: string;
  back?: boolean;
  /** Screens that manage their own padding (e.g. a full-bleed placeholder). */
  bleed?: boolean;
  /**
   * Pinned below the scroll region. §14 — the Message Thread composer sits
   * inside the scroll region in Figma; engineering should pin it, and "the
   * Figma limitation should not be reproduced".
   */
  footer?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * The application shell. One shell, reused across all surfaces (§01).
 *
 * §06 — a vertical stack with no absolute positioning. Chrome is fixed
 * because it sits outside the scroll region, not because of a fixed-position
 * flag. The scroll region clips; the shell does not.
 */
export function AppShell({
  variant,
  title,
  back = true,
  bleed = false,
  footer,
  children,
}: AppShellProps) {
  const showHeader = variant === 'pushed' || variant === 'root';
  const showTabs = variant === 'root';

  return (
    // §07 — root switching is instant; every other arrival is a push.
    <PageTransition instant={variant === 'root'}>
      <StatusBar />

      {showHeader && title ? (
        <NavigationHeader title={title} back={variant === 'pushed' && back} />
      ) : null}

      {/* §06 — scroll region, flex 1, vertical only. Height is derived from
          the chrome present, never hardcoded. */}
      <main
        className={cn(
          'scroll-region min-h-0 flex-1 overflow-y-auto overscroll-contain',
          !bleed && 'px-6 pt-6',
          // §06 — bottom 24px on root surfaces, 48px on pushed surfaces.
          // Entry surfaces (Home) take 24px, matching frame 2:3320.
          !bleed && (variant === 'pushed' ? 'pb-12' : 'pb-6')
        )}
      >
        {children}
      </main>

      {footer ? (
        <div className="border-boundary-interactive bg-surface-page shrink-0 border-t px-6 py-4">
          {footer}
        </div>
      ) : null}

      {showTabs ? <BottomNavigation /> : null}
    </PageTransition>
  );
}
