'use client';

import { BookingCard } from '@/components/ui/booking-card';
import { Gap } from '@/components/ui/gap';
import { Label, Meta, Title } from '@/components/ui/typography';
import { ROUTES } from '@/constants/routes';
import { useBookings } from '@/lib/hooks/use-patra-data';

/**
 * My Bookings — Figma 2:3235.
 * §03 — cards tappable. Empty state at §08.
 */
export function MyBookingsScreen() {
  const { data: bookings } = useBookings();
  const upcoming = bookings.filter((b) => b.status === 'upcoming');
  const past = bookings.filter((b) => b.status === 'past');

  return (
    <>
      <Label>YOUR BOOKINGS</Label>
      <Gap size={12} />
      <Title>One coming up.</Title>
      <Gap size={24} />

      <Label>UPCOMING</Label>
      <Gap size={12} />
      {upcoming.map((booking) => (
        <BookingCard
          key={booking.id}
          href={ROUTES.booking(booking.id)}
          date={booking.dateLabel}
          hostName={booking.hostName}
          detail={booking.detail}
          status={booking.statusLine}
          variant="upcoming"
        />
      ))}

      <Gap size={48} />
      <Label>EARLIER</Label>
      <Gap size={12} />
      {past.map((booking, index) => (
        <div key={booking.id} className="w-full">
          {index > 0 ? <Gap size={16} /> : null}
          <BookingCard
            href={ROUTES.booking(booking.id)}
            date={booking.dateLabel}
            hostName={booking.hostName}
            detail={booking.detail}
            status={booking.statusLine}
            variant="past"
          />
        </div>
      ))}

      <Gap size={24} />
      <Meta>
        This page works without a connection. Everything you need on the day is
        saved to your phone.
      </Meta>
    </>
  );
}
