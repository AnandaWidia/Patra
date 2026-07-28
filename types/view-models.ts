/**
 * View models.
 *
 * These are the exact shapes the frozen screens already consume. The database
 * is normalized; these are what the mappers compose out of it. Defining them
 * here is what lets the data layer be replaced without touching a single
 * component prop or line of JSX.
 */

export interface ExperienceCardCopy {
  label: string;
  detail: string;
  verification: string;
}

/** Home and Explore. */
export interface ExperienceSummary {
  id: string;
  hostName: string;
  photoKey: string;
  home: ExperienceCardCopy;
  explore: ExperienceCardCopy;
}

/** Experience Detail — frame 2:1863. */
export interface ExperienceDetail {
  id: string;
  name: string;
  villageLabel: string;
  craft: string;
  photoBrief: string;
  storyLine: string;
  longStory: string[];
  verification: { label: string; verifiedBy: string; note: string };
  fixed: string[];
  revenueSplit: { label: string; figures: string; justification: string };
  durationLine: string;
  availability: { summary: string; attributedTo: string; explanation: string };
  reviewsIntro: string;
}

/** Review — frame 2:2212. Attribution and attendance are composed, not stored. */
export interface ReviewView {
  id: string;
  attribution: string;
  body: string;
  attendance: string;
}

/** Host Profile — frame 2:2529. */
export interface HostProfileView {
  id: string;
  name: string;
  villageLabel: string;
  craft: string;
  photoBrief: string;
  quoteOriginal: string;
  quoteTranslated: string;
  longStory: string[];
  verification: { label: string; verifiedBy: string; note: string };
}

/** A single day in Choose a Day — frame 2:2913. */
export interface AvailabilityDay {
  day: number;
  isOpen: boolean;
  closedReason: string | null;
}

/** My Bookings — frame 2:3235. */
export interface BookingSummaryView {
  id: string;
  dateLabel: string;
  hostName: string;
  detail: string;
  statusLine: string;
  status: 'upcoming' | 'past' | 'cancelled';
}

/** Your Booking — frame 2:2949. */
export interface BookingDetailView {
  id: string;
  dateLabel: string;
  timeLabel: string;
  hostName: string;
  address: string;
  directionsNote: string;
  hostPhone: string;
  whatToBring: string[];
}

/** Messages — frame 2:3292. */
export interface ConversationView {
  id: string;
  hostName: string;
  lastMessagePreview: string;
  lastMessageAt: string;
  unread: boolean;
}

/** Message Thread — frame 2:3304. */
export interface MessageView {
  id: string;
  attribution: string;
  body: string;
  author: 'host' | 'traveller';
}

/** Cultural Calendar — frame 2:3343. */
export interface CalendarEventView {
  id: string;
  statusLabel: string;
  name: string;
  attributedTo: string;
  explanation: string;
  availability: string;
  status: 'closed' | 'open' | 'partial';
}

/** Checkout payment rails — frame 2:2557. */
export interface PaymentRailView {
  id: string;
  label: string;
  detail: string;
}

/** What every screen hook returns. */
export interface RemoteData<T> {
  data: T;
  loading: boolean;
  error: string | null;
  /** True when the value came from the offline cache rather than the network. */
  cached: boolean;
}
