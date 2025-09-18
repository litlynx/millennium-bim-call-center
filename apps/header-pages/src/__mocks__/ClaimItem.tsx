import type React from 'react';
import type { ClaimsProps } from 'src/Vision360/components/ComplainsAndIncidents/types';

export const ClaimItem: React.FC<ClaimsProps> = ({ number }) => (
  <div data-testid="claim-item">{number}</div>
);
