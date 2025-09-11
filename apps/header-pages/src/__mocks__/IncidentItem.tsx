import type React from 'react';
import type { IncidentsProps } from 'src/Vision360/components/ComplainsAndIncidents/types';

const IncidentItem: React.FC<IncidentsProps> = ({ id }) => (
  <div data-testid="incident-item">{id}</div>
);

export default IncidentItem;
