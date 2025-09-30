import type * as React from 'react';
import { Helmet } from 'react-helmet';
import { PageHeader } from 'shared/components';

const Accesses: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Acessos</title>
      </Helmet>
      <PageHeader
        type="channelAndService"
        channelCategory="Canais Digitais"
        serviceTitle="Smart IZI - Cancelamento/Bloqueio"
        user={{
          customerName: 'Jacinto Fazenda',
          cif: '123456789',
          accountNumber: '12345-6'
        }}
      />
      <h2>Acessos Mobile Banking</h2>
    </>
  );
};

export default Accesses;
