/**
 * PATRA — Route table.
 * Source: Figma "4-Enginering Handoff" §02 Application Architecture,
 * §03 Screen Inventory, §07 Navigation Specification.
 */

export const ROUTES = {
  splash: '/',
  home: '/home',

  // Root surfaces — the five tabs.
  explore: '/explore',
  calendar: '/calendar',
  bookings: '/bookings',
  messages: '/messages',
  profile: '/profile',

  // Pushed surfaces.
  experienceDetail: (id: string) => `/experience/${id}`,
  hostProfile: (id: string) => `/host/${id}`,
  chooseDay: (id: string) => `/experience/${id}/choose-day`,
  checkout: (id: string) => `/experience/${id}/checkout`,
  confirmation: (id: string) => `/experience/${id}/confirmation`,
  booking: (id: string) => `/bookings/${id}`,
  messageThread: (id: string) => `/messages/${id}`,
  profileSignedOut: '/profile/signed-out',
  signIn: '/sign-in',
  setPassword: '/set-password',
  resetPassword: '/reset-password',
  verifyIdentity: (id: string) => `/experience/${id}/verify-identity`,
} as const;

/**
 * §02 — Five-tab bottom navigation, persistent on 9 root surfaces.
 * Five tabs is the specified ceiling. §04 — no icons; labels only.
 */
export const TABS = [
  { id: 'EXPLORE', label: 'Explore', href: ROUTES.explore },
  { id: 'CALENDAR', label: 'Calendar', href: ROUTES.calendar },
  { id: 'BOOKINGS', label: 'Bookings', href: ROUTES.bookings },
  { id: 'MESSAGES', label: 'Messages', href: ROUTES.messages },
  { id: 'ACCOUNT', label: 'Account', href: ROUTES.profile },
] as const;

export type TabId = (typeof TABS)[number]['id'];

/** Root surfaces carry the tab bar; §02 — Home is not a tab. */
export const ROOT_PATHS: string[] = [
  ROUTES.explore,
  ROUTES.calendar,
  ROUTES.bookings,
  ROUTES.messages,
  ROUTES.profile,
  ROUTES.profileSignedOut,
];
