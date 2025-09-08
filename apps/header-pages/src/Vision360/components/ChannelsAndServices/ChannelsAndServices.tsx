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

const ServiceItem: React.FC<ServiceItemProps> = ({ item, isLast }) => {
  return (
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
};

const ServiceSection: React.FC<ServiceSectionProps> = ({ section, className }) => {
  const cn = className ?? '';
  return (
    <div className={`space-y-2 ${cn}`}>
      <div className="flex justify-between items-center">
        <h4 className="font-bold">{section.title}</h4>
      </div>

      <br />

      {section.items?.map((item, index) => (
        <ServiceItem key={item.label} item={item} isLast={index === section.items.length - 1} />
      ))}
    </div>
  );
};

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> aad75a4 ([sc-62] add sample tests (#15))
export default function ChannelsAndServices(props: {
  data?: Partial<ChannelsAndServicesData> | null;
}) {
  // Allow injecting data for tests while keeping default behavior.
  // Undefined => use mockData; null => explicit no data
  const resolvedData: Partial<ChannelsAndServicesData> | null =
    props?.data === undefined ? (mockData as ChannelsAndServicesData) : props.data;
<<<<<<< HEAD
  const navigate = useNavigate();

  if (!resolvedData) {
=======
export default function ChannelsAndServices() {
  const data = mockData as ChannelsAndServicesData;
  const navigate = useNavigate();

  if (!data) {
>>>>>>> 3dd8987 ([sc-32] vision 360 channels and services (#21))
=======
  const navigate = useNavigate();

  if (!resolvedData) {
>>>>>>> aad75a4 ([sc-62] add sample tests (#15))
    return (
      <Card
        icon={<Icon type="box" className="bg-green-500" />}
        title="Canais e serviços"
        className="h-full"
<<<<<<< HEAD
        data-testid="channels-and-services-card"
        headerTestId="channels-and-services-header"
        titleTestId="channels-and-services-title"
        contentTestId="channels-and-services-content"
=======
>>>>>>> 3dd8987 ([sc-32] vision 360 channels and services (#21))
      ></Card>
    );
  }

  return (
    <Card
      icon={<Icon type="box" className="bg-green-500" />}
      title="Canais e serviços"
      className="h-full"
      onTitleClick={() => navigate('/channels-and-services?details=true')}
<<<<<<< HEAD
      data-testid="channels-and-services-card"
      headerTestId="channels-and-services-header"
      titleTestId="channels-and-services-title"
      contentTestId="channels-and-services-content"
    >
      <div className="grid grid-cols-2 divide-x divide-gray-200 pt-[2.25rem]">
        {resolvedData.digitalChannels && (
          <ServiceSection
            section={resolvedData.digitalChannels}
            className={resolvedData.services ? 'pr-4' : undefined}
            sectionPrefix="digitalChannels"
          />
        )}
        {resolvedData.services && (
          <ServiceSection
            section={resolvedData.services}
            className={resolvedData.digitalChannels ? 'pl-4' : undefined}
            sectionPrefix="services"
=======
    >
      <div className="grid grid-cols-2 divide-x divide-gray-200">
        {resolvedData.digitalChannels && (
          <ServiceSection
            section={resolvedData.digitalChannels}
            className={resolvedData.services ? 'pr-4' : undefined}
          />
        )}
        {resolvedData.services && (
          <ServiceSection
<<<<<<< HEAD
            section={data.services}
            className={data.digitalChannels ? 'pl-4' : undefined}
>>>>>>> 3dd8987 ([sc-32] vision 360 channels and services (#21))
=======
            section={resolvedData.services}
            className={resolvedData.digitalChannels ? 'pl-4' : undefined}
>>>>>>> aad75a4 ([sc-62] add sample tests (#15))
          />
        )}
      </div>
    </Card>
  );
}
