import { AppShell } from '@/components/shell/app-shell';
import { ExploreLoadingState } from '@/features/system-states/explore-loading-state';

/** §08 — replaces the content region of Explore; the shell does not change. */
export default function ExploreLoadingPage() {
  return (
    <AppShell variant="root" title="Explore" back={false}>
      <ExploreLoadingState />
    </AppShell>
  );
}
