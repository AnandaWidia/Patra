import { AppShell } from '@/components/shell/app-shell';
import { CheckoutScreen } from '@/features/booking/checkout-screen';

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AppShell variant="pushed" title="Checkout">
      <CheckoutScreen experienceId={id} />
    </AppShell>
  );
}
