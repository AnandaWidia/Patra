/**
 * Display formatters.
 *
 * The frozen frames carry specific label formats. These reproduce them from
 * normalized columns rather than storing the rendered string, so no display
 * copy is duplicated in the database.
 */

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** "14 May 2026" */
export function longDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** "14 June, 9:12" — Conversation Row timestamp. */
export function dayAndTime(iso: string): string {
  const d = new Date(iso);
  const minutes = String(d.getUTCMinutes()).padStart(2, '0');
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}, ${d.getUTCHours()}:${minutes}`;
}

/**
 * "I MADE" from "I Made Suarta".
 *
 * The frozen Message attribution uses the familiar form: the given name with
 * its honorific, without the family name. Two-word names are already in that
 * form and are left whole.
 */
export function speakerName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  const familiar = parts.length >= 3 ? parts.slice(0, 2) : parts;
  return familiar.join(' ').toUpperCase();
}

/** "I MADE · 14 JUNE, 9:12" — Message attribution (frame 2:2387). */
export function messageAttribution(
  author: 'host' | 'traveller',
  hostName: string,
  sentAt: string
): string {
  const speaker = author === 'host' ? speakerName(hostName) : 'YOU';
  return `${speaker} · ${dayAndTime(sentAt).toUpperCase()}`;
}

/** "EMMA W. · MELBOURNE" — Review attribution (frame 2:2212). */
export function reviewAttribution(name: string, city: string): string {
  return `${name.toUpperCase()} · ${city.toUpperCase()}`;
}

/** "Booked through PATRA · attended 14 May 2026". */
export function reviewAttendance(attendedDate: string): string {
  return `Booked through PATRA · attended ${longDate(attendedDate)}`;
}
