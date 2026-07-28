import { AppShell } from '@/components/shell/app-shell';
import { HomeScreen } from '@/features/discovery/home-screen';

/** §02 — an entry surface. Status bar only; Home is not a tab. */
export default function HomePage() {
  return (
    <AppShell variant="entry">
      <HomeScreen />
    </AppShell>
  );
}
