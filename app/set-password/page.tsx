import { AppShell } from '@/components/shell/app-shell';
import { SetPasswordScreen } from '@/features/account/set-password-screen';

export default function SetPasswordPage() {
  return (
    <AppShell variant="pushed" title="Set a Password">
      <SetPasswordScreen />
    </AppShell>
  );
}
