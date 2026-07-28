import { AppShell } from '@/components/shell/app-shell';
import { PaymentFailedState } from '@/features/system-states/payment-failed-state';

export default async function PaymentFailedPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AppShell variant="pushed" title="Checkout">
      <PaymentFailedState experienceId={id} />
    </AppShell>
  );
}
