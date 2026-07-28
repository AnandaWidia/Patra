import { AppShell } from '@/components/shell/app-shell';
import { BookingDetailScreen } from '@/features/booking/booking-detail-screen';

export default function BookingDetailPage() {
  return (
    <AppShell variant="pushed" title="Your Booking">
      <BookingDetailScreen />
    </AppShell>
  );
}
