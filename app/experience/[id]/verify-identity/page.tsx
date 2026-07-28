import { AppShell } from '@/components/shell/app-shell';
import { VerifyIdentityScreen } from '@/features/account/verify-identity-screen';

export default async function VerifyIdentityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AppShell variant="pushed" title="Verify Identity">
      <VerifyIdentityScreen experienceId={id} />
    </AppShell>
  );
}
