import type React from 'react';
import { useNavigate } from 'react-router';
import { type CardTabItem, CardTabs, Icon } from 'shared/components';
import { ClaimItem } from 'src/Vision360/components/ComplainsAndIncidents/components/ClaimItem';
import IncidentItem from 'src/Vision360/components/ComplainsAndIncidents/components/IncidentItem';
import data from './mock-data/mock-data.json';

const { claims, incidents } = data;

const sortClaims = (items: typeof claims) => {
  return [...items].sort((a, b) => {
    const toDate = (dateStr: string) => new Date(dateStr.split('/').reverse().join('-'));
    return toDate(b.registerDate).getTime() - toDate(a.registerDate).getTime();
  });
};

const sortIncidents = (items: typeof incidents) => {
  return [...items].sort((a, b) => {
    const toDate = (dateStr: string) => new Date(dateStr.split('-').reverse().join('-'));
    return toDate(b.date).getTime() - toDate(a.date).getTime();
  });
};

const tabs: CardTabItem[] = [
  {
    value: 'claims',
    label: 'Reclamações',
    dataTestId: 'complains-and-incidents-tab-claims',
    content: (
      <>
        {sortClaims(claims)
          .slice(0, 3)
          .map((props, index, arr) => (
            <div key={props.number}>
              <ClaimItem {...props} />
              {index < arr.length - 1 && <hr className="text-gray-100" />}
            </div>
          ))}
      </>
    )
  },
  {
    value: 'incidents',
    label: 'Incidentes',
    dataTestId: 'complains-and-incidents-tab-incidents',
    content: (
      <>
        {sortIncidents(incidents)
          .slice(0, 3)
          .map((props, index, arr) => (
            <div key={props.id}>
              <IncidentItem {...props} />
              {index < arr.length - 1 && <hr className="text-gray-100" />}
            </div>
          ))}
      </>
    )
  }
];

const ComplainsAndIncidents: React.FC = () => {
  const navigate = useNavigate();

  return (
    <CardTabs
      icon={<Icon type="personalQuestion" className="bg-orange-500" />}
      title="Reclamações / Incidentes"
      onTitleClick={() => navigate('/complains-and-incidents?details=true')}
      className="h-full"
      tabs={tabs}
      defaultValue="claims"
      data-testid="complains-and-incidents-card"
      headerTestId="complains-and-incidents-header"
      titleTestId="complains-and-incidents-title"
      contentTestId="complains-and-incidents-content"
    />
  );
};

export default ComplainsAndIncidents;
