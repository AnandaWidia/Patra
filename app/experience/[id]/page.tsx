import { AppShell } from '@/components/shell/app-shell';
import { ExperienceDetailScreen } from '@/features/discovery/experience-detail-screen';

export default async function ExperienceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AppShell variant="pushed" title="Experience" bleed>
      <ExperienceDetailScreen experienceId={id} />
    </AppShell>
  );
}
