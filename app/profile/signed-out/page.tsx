import { AppShell } from '@/components/shell/app-shell';
import { ProfileSignedOutScreen } from '@/features/account/profile-signed-out-screen';

export default function ProfileSignedOutPage() {
  return (
    <AppShell variant="root" title="Account" back={false}>
      <ProfileSignedOutScreen />
    </AppShell>
  );
}
