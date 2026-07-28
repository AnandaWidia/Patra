import { AppShell } from '@/components/shell/app-shell';
import { ResetPasswordScreen } from '@/features/account/reset-password-screen';

export default function ResetPasswordPage() {
  return (
    <AppShell variant="pushed" title="Reset Password">
      <ResetPasswordScreen />
    </AppShell>
  );
}
