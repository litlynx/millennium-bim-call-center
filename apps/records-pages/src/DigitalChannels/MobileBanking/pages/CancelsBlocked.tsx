import type * as React from 'react';
import { Helmet } from 'react-helmet';
import { PageHeader } from 'shared/components';
import { useUserStore } from 'shared/stores';

const CancelsBlocked: React.FC = () => {
  const user = {
    customerName: useUserStore((u) => u.getCustomerName()),
    cif: useUserStore((u) => u.getCif()),
    accountNumber: useUserStore((u) => u.getAccountNumber())
  };

  return (
    <>
      <PageHeader
        type="channelAndService"
        channelCategory="Canais Digitais"
        serviceTitle="Smart IZI - Cancelamento/Bloqueio"
        user={user}
      />
      <Helmet>
        <title>Acessos</title>
      </Helmet>
      <h2>Acessos Mobile Banking</h2>
    </>
  );
};

export default CancelsBlocked;
