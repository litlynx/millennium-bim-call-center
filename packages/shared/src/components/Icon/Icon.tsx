import type React from 'react';
import * as Icons from '@/assets/icons';
import { cn } from '@/lib/utils';

// INFO: builds the icons map and generates keys for each icon component
const applyIconRegex = (str: string) =>
  str
    .replace(/Icon$/, '') // remove 'Icon' suffix
    .replace(/[-_\s]+(.)/g, (_, c: string) => (c ? c.toUpperCase() : '')) // handle delimiters to camelCase
    .replace(/^./, (c: string) => c.toLowerCase()); // lower first char

const buildIconsMap = (
  mod: Record<string, unknown>
): Record<string, React.ComponentType<unknown>> => {
  const map: Record<string, React.ComponentType<unknown>> = {};
  for (const [exportName, Component] of Object.entries(mod)) {
    if (typeof Component !== 'function') continue; // skip non-components
    const key = applyIconRegex(exportName);
    if (!key) continue;
    map[key] = Component as React.ComponentType<unknown>;
  }
  return map;
};

const iconsMap = buildIconsMap({ ...Icons });

export type IconType = keyof typeof iconsMap;

export interface IconProps {
  type: keyof typeof iconsMap;
  rounded?: boolean;
  size?: 'sm' | 'lg';
  className?: string;
  onClick?: () => void;
}

const Icon: React.FC<IconProps> = ({ type, rounded, size = 'sm', className = '', onClick }) => {
  const IconComponent = iconsMap[type];
  if (!IconComponent) return null;
  const sizeClasses = size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';
  const radiusClasses = rounded ? 'rounded-full' : 'rounded-md';

  return (
    <span
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center p-[6px] h-fit',
        sizeClasses,
        radiusClasses,
        className
      )}
    >
      <IconComponent />
    </span>
  );
};

export default Icon;
