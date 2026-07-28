import { AppShell } from '@/components/shell/app-shell';
import { MyBookingsScreen } from '@/features/booking/my-bookings-screen';

export default function BookingsPage() {
  return (
    <AppShell variant="root" title="Bookings" back={false}>
      <MyBookingsScreen />
    </AppShell>
  );
}
