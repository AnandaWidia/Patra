import { AppShell } from '@/components/shell/app-shell';
import { CulturalCalendarScreen } from '@/features/discovery/cultural-calendar-screen';

export default function CalendarPage() {
  return (
    <AppShell variant="root" title="Calendar" back={false}>
      <CulturalCalendarScreen />
    </AppShell>
  );
}
