import { AppShell } from '@/components/shell/app-shell';
import { ConfirmationScreen } from '@/features/booking/confirmation-screen';

export default function ConfirmationPage() {
  return (
    <AppShell variant="pushed" title="Confirmation" bleed>
      <ConfirmationScreen />
    </AppShell>
  );
}
