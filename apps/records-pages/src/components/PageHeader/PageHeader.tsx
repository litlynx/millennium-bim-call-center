import { PageHeader } from 'shared/components';
import { useUserStore } from 'shared/stores';
import type { UserStore } from 'shared/stores/user';

export default function RecordsPageHeaderWrapper() {
  const user = useUserStore((u: UserStore) => u.user);

  // se não existir user mostra placeholders
  const customerName = user?.name ?? 'Utilizador';
  const cif = user?.cif ?? '—';
  const accountNumber = user?.accountNumber ?? '—';

  return (
    <PageHeader
      type="channelAndService"
      channelCategory="Canais Digitais"
      serviceTitle="Smart IZI - Cancelamento/Bloqueio"
      customerName={customerName}
      cif={cif}
      accountNumber={accountNumber}
    />
  );
}
