import { AppShell } from '@/components/shell/app-shell';
import { ChooseDayScreen } from '@/features/booking/choose-day-screen';

export default async function ChooseDayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AppShell variant="pushed" title="Choose a Day">
      <ChooseDayScreen experienceId={id} />
    </AppShell>
  );
}
