import { Badge } from 'shared/components';

export type CancelsBlockedState = 'Inativo' | 'Activo' | string;

interface StateBadgeProps {
  state: string;
  className?: string;
}

export function StateBadge({ state, className }: StateBadgeProps) {
  const stateVariant: Record<CancelsBlockedState, string> = {
    Inativo: 'inactive',
    Activo: 'active'
  };

  return (
    <Badge variant={stateVariant[state] || 'default'} className={className}>
      {state}
    </Badge>
  );
}
