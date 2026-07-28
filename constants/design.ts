/**
 * PATRA — Layout, motion and shell constants.
 * Source: Figma "09 — Engineering Handoff" §06 Layout System, §07 Navigation.
 *
 * One place where 300ms and ease-out are defined (§12 /app/navigation).
 */

/** §06 — 390 × 844 logical points. iPhone 14 class. The only size designed. */
export const VIEWPORT = { width: 390, height: 844 } as const;

/** §06 — absorbed by shell components, not by screen content. */
export const SAFE_AREA = { top: 44, bottom: 34 } as const;

/** §04 — chrome heights. */
export const CHROME = {
  statusBar: 44,
  header: 56,
  bottomNav: 90, // 56px content + 34px safe area
} as const;

/**
 * §06 — scroll region height is derived, not hardcoded:
 * 844 minus the chrome present.
 */
export const SHELL_CLASS = {
  /** Splash (no chrome) and Home (status bar only). */
  entry: { header: false, bottomNav: false, scrollHeight: 800 },
  /** 13 surfaces. Status bar + 56px header. No bottom navigation. */
  pushed: { header: true, bottomNav: false, scrollHeight: 744 },
  /** 9 root surfaces. Status bar + header + bottom navigation. */
  root: { header: true, bottomNav: true, scrollHeight: 710 },
} as const;

export type ShellClass = keyof typeof SHELL_CLASS;

/** §06 — 342px, centred by 24px horizontal padding on both sides. */
export const CONTENT = {
  columnWidth: 342,
  paddingX: 24,
  paddingTop: 24,
  /** Bottom 24px on root surfaces, 48px on pushed surfaces. */
  paddingBottomRoot: 24,
  paddingBottomPushed: 48,
} as const;

/**
 * §05 / §07 — one duration, one easing, across the entire application.
 * This is a hard constraint, not a default.
 */
export const MOTION = {
  duration: 0.3,
  ease: [0, 0, 0.58, 1] as const,
} as const;

/** §07 — a timer, not a transition. */
export const SPLASH_DWELL_MS = 800;

/** §05 — seven values, no others. All line heights are multiples of 4. */
export const SPACING = [0, 4, 8, 12, 16, 24, 48] as const;

/**
 * §04 / §10 — the only glyph in the product. U+2190 set in IBM Plex Sans,
 * rendered as text inside a 44×44 target. Not an icon.
 */
export const BACK_GLYPH = '←';

/** §11 — 44 × 44 minimum, no exceptions. */
export const MIN_TOUCH_TARGET = 44;
