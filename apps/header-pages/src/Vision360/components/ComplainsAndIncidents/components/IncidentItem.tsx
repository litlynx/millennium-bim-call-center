import type React from 'react';
import { Icon } from 'shared/components';
import type { IncidentsProps } from 'src/Vision360/components/ComplainsAndIncidents/types';

const IncidentHeader: React.FC<{ date: string; type: string }> = ({ date, type }) => (
  <span className="font-bold text-gray-800 leading-tight">
    <time dateTime={date}>{date}</time> | {type}
  </span>
);

const IncidentItem: React.FC<IncidentsProps> = ({ date, type, title }) => {
  return (
    <div className="flex gap-2 p-2 items-start">
      <Icon type="exclamation" className="bg-primary-500" rounded size="sm" />
      <div className="flex flex-col gap-1">
        <IncidentHeader date={date} type={type} />
        <h3 className="text-base text-gray-800 font-medium leading-[100%]">{title}</h3>
      </div>
    </div>
  );
};

export default IncidentItem;
