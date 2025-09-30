import type * as React from 'react';
import { Helmet } from 'react-helmet';
import { StateBadge } from '../components/accesses/StateBadge';

const Accesses: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Acessos</title>
      </Helmet>
      <div className="flex flex-col gap-4 p-4">
        <h2>Acessos Mobile Banking</h2>
        <div className="flex flex-col gap-2">
          <StateBadge state="Activo" />
          <StateBadge state="Inativo" />
          <StateBadge state="Activo para consultas" />
        </div>
      </div>
    </>
  );
};

export default Accesses;
