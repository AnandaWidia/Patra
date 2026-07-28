import { AppShell } from '@/components/shell/app-shell';
import { MessagesScreen } from '@/features/messaging/messages-screen';

export default function MessagesPage() {
  return (
    <AppShell variant="root" title="Messages" back={false}>
      <MessagesScreen />
    </AppShell>
  );
}
