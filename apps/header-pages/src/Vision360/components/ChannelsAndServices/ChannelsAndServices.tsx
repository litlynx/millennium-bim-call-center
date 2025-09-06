import type * as React from 'react';
import { useNavigate } from 'react-router';
import { Card, Icon } from 'shared/components';
import type { ChannelServiceState } from './components/State';
import { State } from './components/State';
import mockData from './mock-data/mock-data.json';

interface ServiceSectionInterface {
  id: string;
  title: string;
  items: { label: string; state: ChannelServiceState }[];
}

interface ChannelsAndServicesData {
  digitalChannels: ServiceSectionInterface;
  services: ServiceSectionInterface;
}

interface ServiceItemProps {
  item: { label: string; state: ChannelServiceState };
  isLast?: boolean;
}

interface ServiceSectionProps {
  section: ServiceSectionInterface;
  className?: string;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ item, isLast = false }) => (
  <div
    className={`flex justify-between items-center ${
      !isLast ? 'border-b border-gray-200 pb-1' : ''
    }`}
  >
    <span className="text-sm">
      {item.label} {item.state && <State value={item.state} className="ml-[8px]" />}
    </span>
  </div>
);

const ServiceSection: React.FC<ServiceSectionProps> = ({ section, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    <div className="flex justify-between items-center">
      <h4 className="font-bold">{section.title}</h4>
    </div>

    <br />

    {section.items?.map((item, index) => (
      <ServiceItem key={item.label} item={item} isLast={index === section.items.length - 1} />
    ))}
  </div>
);

export default function ChannelsAndServices() {
  const data = mockData as ChannelsAndServicesData;
  const navigate = useNavigate();

  if (!data) {
    return (
      <Card
        icon={<Icon type="box" className="bg-green-500" />}
        title="Canais e serviços"
        className="h-full"
      ></Card>
    );
  }

  return (
    <Card
      icon={<Icon type="box" className="bg-green-500" />}
      title="Canais e serviços"
      className="h-full"
      onTitleClick={() => navigate('/channels-and-services?details=true')}
    >
      {!data ? (
        <div className="flex items-center justify-center h-32">
          <span className="text-gray-500">Dados não disponíveis</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 divide-x divide-gray-200">
          {data.digitalChannels && (
            <ServiceSection section={data.digitalChannels} className="pr-4" />
          )}
          {data.services && <ServiceSection section={data.services} className="pl-4" />}
        </div>
      )}
    </Card>
  );
}
