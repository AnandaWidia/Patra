import { AppShell } from '@/components/shell/app-shell';
import { BookingDetailScreen } from '@/features/booking/booking-detail-screen';

/** §08 — Your Booking (Offline). Identical to its parent but for the band. */
export default function BookingDetailOfflinePage() {
  return (
    <AppShell variant="pushed" title="Your Booking">
      <BookingDetailScreen offline />
    </AppShell>
  );
}
