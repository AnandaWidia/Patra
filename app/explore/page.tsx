import { AppShell } from '@/components/shell/app-shell';
import { ExploreScreen } from '@/features/discovery/explore-screen';

export default function ExplorePage() {
  return (
    <AppShell variant="root" title="Explore" back={false}>
      <ExploreScreen />
    </AppShell>
  );
}
