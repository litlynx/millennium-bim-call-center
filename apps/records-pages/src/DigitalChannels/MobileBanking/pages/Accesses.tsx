import type * as React from 'react';
import { Helmet } from 'react-helmet';
import { PageHeader } from 'shared/components';
import { useUserStore } from 'shared/stores';

const Accesses: React.FC = () => {
  const user = {
    customerName: useUserStore((u) => u.getCustomerName()),
    cif: useUserStore((u) => u.getCif()),
    accountNumber: useUserStore((u) => u.getAccountNumber())
  };

  return (
    <>
      <Helmet>
        <title>Acessos</title>
      </Helmet>
      <PageHeader
        type="channelAndService"
        channelCategory="Canais Digitais"
        serviceTitle="Smart IZI - Cancelamento/Bloqueio"
        user={user}
      />
      <h2>Acessos Mobile Banking</h2>
    </>
  );
};

export default Accesses;
