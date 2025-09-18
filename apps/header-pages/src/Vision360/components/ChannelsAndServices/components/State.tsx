import type { FC } from 'react';
import { cn } from 'shared/lib/utils';

export type ChannelServiceState = 'A' | 'B' | 'C' | 'V' | 'I';

export const CHANNEL_SERVICE_STATE_LABELS: Record<ChannelServiceState, string> = {
  A: 'Activo',
  B: 'Bloqueado',
  C: 'Cancelado/Eliminado',
  V: 'Activo para consultas',
  I: 'Inactivo'
};

export function getChannelServiceStateLabel(state: ChannelServiceState): string {
  return CHANNEL_SERVICE_STATE_LABELS[state];
}

export interface StateProps {
  value: ChannelServiceState;
  /**
   * Size of the circle. Provide a preset or a pixel number; numbers map to the nearest preset.
   * Default: 'md'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  title?: string;
  className?: string;
}

const SIZE_PRESETS: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', string> = {
  xs: 'w-4 h-4 text-[10px]',
  sm: 'w-5 h-5 text-xs',
  md: 'w-6 h-6 text-sm',
  lg: 'w-8 h-8 text-base',
  xl: 'w-10 h-10 text-lg'
};

function getSizeClasses(size: StateProps['size']): string {
  const key: keyof typeof SIZE_PRESETS = typeof size === 'string' ? size : 'md';
  return SIZE_PRESETS[key];
}

/**
 * Renders a circular badge with the state letter inside.
 * Includes sensible defaults and accessibility attributes.
 */
export const State: FC<StateProps> = ({ value, size = 'md', title, className }) => {
  const label = title ?? `${CHANNEL_SERVICE_STATE_LABELS[value]} (${value})`;
  const sizeClasses = getSizeClasses(size);

  const baseClasses = `inline-flex items-center justify-center rounded-full leading-none select-none align-middle ${sizeClasses} border border-primary-500`;

  return (
    <span role="img" aria-label={label} title={label} className={cn(baseClasses, className)}>
      {value}
    </span>
  );
};

export default State;
