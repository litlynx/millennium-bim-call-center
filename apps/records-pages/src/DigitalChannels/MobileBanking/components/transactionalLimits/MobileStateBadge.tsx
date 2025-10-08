import { Badge } from 'shared/components';

export type MobileState =
  | 'Inativo'
  | 'Activo'
  | 'Activo para consultas'
  | 'Inactivo SmartIZI'
  | 'Inactivo'
  | string;

interface StateBadgeProps {
  state: string;
  className?: string;
}

export function MobileStateBadge({ state, className }: StateBadgeProps) {
  const stateVariant: Record<MobileState, string> = {
    Inativo: 'inactive',
    Activo: 'active',
    'Activo para consultas': 'blocked',
    'Inactivo SmartIZI': 'inactive',
    'Inactivo KYC': 'inactive'
  };

  return (
    <Badge variant={stateVariant[state] || 'default'} className={className}>
      {state}
    </Badge>
  );
}
