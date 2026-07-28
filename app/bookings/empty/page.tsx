import { AppShell } from '@/components/shell/app-shell';
import { BookingsEmptyState } from '@/features/system-states/bookings-empty-state';

export default function BookingsEmptyPage() {
  return (
    <AppShell variant="root" title="Bookings" back={false}>
      <BookingsEmptyState />
    </AppShell>
  );
}
