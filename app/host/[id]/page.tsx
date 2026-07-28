import { AppShell } from '@/components/shell/app-shell';
import { HostProfileScreen } from '@/features/discovery/host-profile-screen';

export default function HostProfilePage() {
  return (
    <AppShell variant="pushed" title="Host Profile" bleed>
      <HostProfileScreen />
    </AppShell>
  );
}
