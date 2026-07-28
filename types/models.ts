/**
 * PATRA — Data Model
 * Source: Figma "09 — Engineering Handoff" §09 Data Model.
 *
 * Frontend shape only. Fields listed are those the prototype actually
 * renders — nothing speculative, no backend concerns.
 */

export type VerificationMethod = 'banjar-in-person' | 'document-photo';
export type VerificationStatus = 'verified' | 'unverified' | 'pending';

/** §09 — Verification. */
export interface Verification {
  subjectType: 'host' | 'traveller';
  method: VerificationMethod;
  verifiedBy: string;
  verifiedDate: string;
  /**
   * §09 modelling note: this is what makes two-way trust legible. It is not
   * a privacy flag — it is the mechanism of symmetric verification.
   */
  visibleToCounterparty: boolean;
}

export interface PaymentMethod {
  id: string;
  rail: 'qris' | 'card' | 'bank-transfer';
  label: string;
  detail: string;
}

export interface NotificationPrefs {
  bookingUpdates: boolean;
  hostMessages: boolean;
}

/** §09 — User. */
export interface User {
  id: string;
  fullName: string;
  email: string;
  verification: {
    status: VerificationStatus;
    method: VerificationMethod;
    verifiedDate: string;
    shownToHosts: boolean;
  };
  paymentMethods: PaymentMethod[];
  notificationPrefs: NotificationPrefs;
  language: string;
  /** §02 — guest checkout means no password, not no identity. */
  hasPassword: boolean;
}

/** §09 — Host. */
export interface Host {
  id: string;
  name: string;
  village: string;
  regency: string;
  craft: string;
  storyLine: string;
  longStory: string;
  verification: {
    verifiedBy: string;
    verifiedDate: string;
    method: VerificationMethod;
    inPerson: boolean;
  };
  phone: string;
  /** §14 — renders as host/lede italic on Host Profile. */
  quoteOriginal: string;
  quoteTranslated: string;
  photo: string;
}

/** §09 — Experience. */
export interface Experience {
  id: string;
  hostId: string;
  title: string;
  format: string;
  durationHours: number;
  pricePerPerson: number;
  currency: string;
  groupCap: number;
  placesRemaining: number;
  village: string;
  nextOpenDate: string;
  photo: string;
}

export type BookingStatus = 'upcoming' | 'past' | 'cancelled';

/** §09 — Booking. */
export interface Booking {
  id: string;
  experienceId: string;
  hostId: string;
  date: string;
  timeLabel: string;
  partySize: number;
  total: number;
  /**
   * §09 modelling note: a stored figure shown to the traveller at checkout,
   * not a computed display value — it must survive a price change.
   */
  hostShare: number;
  hostSharePercent: number;
  status: BookingStatus;
  paymentMethod: string;
  address: string;
  directionsNote: string;
  hostPhone: string;
  whatToBring: string[];
  payoutDate: string;
  /** §08 — Your Booking is the highest-priority offline surface. */
  offlineCached: boolean;
}

/** §09 — Conversation. */
export interface Conversation {
  id: string;
  hostId: string;
  hostName: string;
  lastMessagePreview: string;
  lastMessageAt: string;
  unread: boolean;
  bookingId: string;
}

/** §09 — Message. */
export interface Message {
  id: string;
  conversationId: string;
  author: 'host' | 'traveller';
  body: string;
  sentAt: string;
  /** The host replies via WhatsApp; the traveller sends in-app. */
  deliveredVia: 'app' | 'whatsapp';
}

export type CalendarEventStatus = 'closed' | 'open' | 'partial';

/** §09 — CalendarEvent. */
export interface CalendarEvent {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: CalendarEventStatus;
  /** §04 — a closed date always carries a written, attributed reason. */
  explanation: string;
  attributedTo: string;
  village: string;
  bookableFrom: string;
}

/** §09 — Review. */
export interface Review {
  id: string;
  bookingId: string;
  authorName: string;
  authorCity: string;
  body: string;
  attendedDate: string;
  /** §04 — no rating, no score, no stars. Attendance is the only signal. */
  verifiedAttendance: boolean;
}

/**
 * §09 — Notification: PREFERENCES ONLY.
 * No inbox exists in this product and no notification list entity is
 * required. See NotificationPrefs above. Do not build one (§14).
 */
