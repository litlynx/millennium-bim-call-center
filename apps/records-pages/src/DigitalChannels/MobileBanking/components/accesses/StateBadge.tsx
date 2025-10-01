import { Badge } from 'shared/components';

export type ContractState =
  | 'Activo'
  | 'Inativo'
  | 'Activo para consultas'
  | 'Inativo SmartIZI'
  | 'Inativo KYC'
  | string;

interface StateBadgeProps {
  state: string;
  className?: string;
}

export function StateBadge({ state, className }: StateBadgeProps) {
  const stateVariant: Record<ContractState, string> = {
    Activo: 'active',
    Inativo: 'inactive',
    'Activo para consultas': 'active',
    'Inativo SmartIZI': 'inactive',
    'Inativo KYC': 'inactive'
  };

  return (
    <Badge variant={stateVariant[state] || 'default'} className={className}>
      {state}
    </Badge>
  );
}
