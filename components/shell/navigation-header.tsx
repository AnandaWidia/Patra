'use client';

import { useRouter } from 'next/navigation';

import { BACK_GLYPH } from '@/constants/design';

interface NavigationHeaderProps {
  title: string;
  /** §04 — variant Back=True / Back=False. */
  back?: boolean;
}

/**
 * Navigation Header — 390×56.
 * §04 — title left-aligned, not centred. Back is the glyph U+2190 in
 * IBM Plex Sans at 16px inside a 44×44 target. 1px bottom hairline.
 * §06 — static. Does not collapse, shrink, hide or transform on scroll.
 */
export function NavigationHeader({
  title,
  back = true,
}: NavigationHeaderProps) {
  const router = useRouter();

  return (
    <header className="border-boundary-interactive bg-surface-page flex h-14 shrink-0 items-center border-b">
      {back ? (
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Back"
          className="text-text-primary flex size-11 shrink-0 items-center justify-center"
        >
          {/* §10 — the only glyph in the product. Type, not an icon. */}
          <span aria-hidden="true" className="type-platform-body">
            {BACK_GLYPH}
          </span>
        </button>
      ) : (
        <span className="w-6 shrink-0" />
      )}
      {/* §11 — focus moves to the new screen title on push. */}
      <h1
        tabIndex={-1}
        className="type-platform-body text-text-primary truncate outline-none"
      >
        {title}
      </h1>
    </header>
  );
}
