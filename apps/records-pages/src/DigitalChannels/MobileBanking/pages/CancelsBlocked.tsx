import type * as React from 'react';
import { Helmet } from 'react-helmet';
import RecordsPageHeaderWrapper from '../../../components/PageHeader/PageHeader';

const CancelsBlocked: React.FC = () => {
  return (
    <>
      <RecordsPageHeaderWrapper />
      <Helmet>
        <title>Acessos</title>
      </Helmet>
      <h2>Acessos Mobile Banking</h2>
    </>
  );
};

export default CancelsBlocked;
