import { Badge } from 'shared/components';

export type Pin2State = 'Activo' | 'Bloqueado' | 'Temporário' | 'Sem contrato' | string;

interface StateBadgeProps {
  state: string;
  className?: string;
}

export function Pin2StateBadge({ state, className }: StateBadgeProps) {
  const stateVariant: Record<Pin2State, string> = {
    Activo: 'active',
    Bloqueado: 'inactive',
    Temporário: 'inactive',
    'Sem contrato': 'empty'
  };

  return (
    <Badge variant={stateVariant[state] || 'default'} className={className}>
      {state}
    </Badge>
  );
}
