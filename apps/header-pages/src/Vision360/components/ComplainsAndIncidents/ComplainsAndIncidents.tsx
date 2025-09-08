import type React from 'react';
import { type CardTabItem, CardTabs, Icon } from 'shared/components';
import { ClaimItem } from 'src/Vision360/components/ComplainsAndIncidents/components/ClaimItem';
import IncidentItem from 'src/Vision360/components/ComplainsAndIncidents/components/IncidentItem';

import data from './mock-data/mock-data.json';

const { claims, incidents } = data;

const tabs: CardTabItem[] = [
  {
    value: 'claims',
    label: 'Reclamações',
    content: (
      <>
        {claims.map((props, index) => (
          <div key={props.number}>
            <ClaimItem {...props} />
            {index < claims.length - 1 && <hr className="my-2 text-gray-100" />}
          </div>
        ))}
      </>
    )
  },
  {
    value: 'incidents',
    label: 'Incidentes',
    content: (
      <>
        {incidents.map((props, index) => (
          <div key={props.id}>
            <IncidentItem {...props} />
            {index < incidents.length - 1 && <hr className="my-2 text-gray-100" />}
          </div>
        ))}
      </>
    )
  }
];

const ComplainsAndIncidents: React.FC = () => {
  return (
    <CardTabs
      icon={<Icon type="personalQuestion" className="bg-orange" />}
      title="Reclamações / Incidentes"
      className="h-full"
      tabs={tabs}
      defaultValue="claims"
    />
  );
};

export default ComplainsAndIncidents;
