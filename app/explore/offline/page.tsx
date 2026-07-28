import { AppShell } from '@/components/shell/app-shell';
import { ExploreOfflineState } from '@/features/system-states/explore-offline-state';

export default function ExploreOfflinePage() {
  return (
    <AppShell variant="root" title="Explore" back={false}>
      <ExploreOfflineState />
    </AppShell>
  );
}
