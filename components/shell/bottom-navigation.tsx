'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { TABS } from '@/constants/routes';
import { cn } from '@/lib/cn';

/**
 * Bottom Navigation — 390×90.
 * §04 — 56px content plus 34px safe area. Items 78×56. Active: text/primary
 * with a 24×2 rule above the label. Inactive: text/secondary, no rule.
 * No icons — the bar is text-only by design and was validated that way (§10).
 * §07 — a tab switch is a root swap: instant, no transition, no history entry.
 */
export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="border-boundary-interactive bg-surface-page shrink-0 border-t pb-[34px]"
    >
      <ul className="flex h-14 items-stretch justify-between px-1">
        {TABS.map((tab) => {
          const active =
            pathname === tab.href || pathname.startsWith(`${tab.href}/`);

          return (
            <li key={tab.id} className="flex">
              <Link
                href={tab.href}
                aria-current={active ? 'page' : undefined}
                replace
                className="flex h-14 w-[78px] flex-col items-center justify-center gap-1"
              >
                {/* §11 — colour never carries meaning alone: the rule is the
                    second, non-chromatic signal for the active tab. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    'h-0.5 w-6',
                    active ? 'bg-text-primary' : 'bg-transparent'
                  )}
                />
                <span
                  className={cn(
                    'type-platform-label',
                    active ? 'text-text-primary' : 'text-text-secondary'
                  )}
                >
                  {tab.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
