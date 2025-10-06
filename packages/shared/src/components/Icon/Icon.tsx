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

// Generate a union type of all available icon names for better type safety
export type IconType =
  | 'alertFolder'
  | 'analyticsBusinessChart'
  | 'bell'
  | 'box'
  | 'calendar'
  | 'callBack'
  | 'callCenterWorker'
  | 'callDots'
  | 'cellPhone'
  | 'check'
  | 'checkRibbon'
  | 'chevronDown'
  | 'chevronRight'
  | 'closeBlack'
  | 'close'
  | 'complains'
  | 'config'
  | 'contact'
  | 'contacts'
  | 'crossRibbon'
  | 'danger'
  | 'dialPad'
  | 'docFile'
  | 'documentation'
  | 'documentLayout'
  | 'email'
  | 'exclamation'
  | 'eye'
  | 'files'
  | 'graph2'
  | 'graph'
  | 'history'
  | 'home'
  | 'imgFile'
  | 'info'
  | 'location'
  | 'logo'
  | 'makePhoneCall'
  | 'messageCircleDots'
  | 'message'
  | 'packageWarning'
  | 'pause'
  | 'personal'
  | 'personalQuestion'
  | 'person'
  | 'personMale'
  | 'personMalePolygon'
  | 'phone2'
  | 'phoneCall'
  | 'phoneDots'
  | 'pieChart'
  | 'pin'
  | 'play'
  | 'register'
  | 'resend'
  | 'ringCall'
  | 'risk'
  | 'search'
  | 'send'
  | 'share'
  | 'shoppingBag'
  | 'upload'
  | 'user'
  | 'block'
  | 'trashBin'
  | 'minify'
  | 'maximize';

export interface IconProps {
  type: IconType;
  rounded?: boolean;
  size?: 'sm' | 'lg' | 'md';
  className?: string;
  onClick?: () => void;
}

const Icon: React.FC<IconProps> = ({ type, rounded, size, className = '', onClick }) => {
  const IconComponent = iconsMap[type];
  if (!IconComponent) return null;
  let sizeClasses: string;
  switch (size) {
    case 'sm':
      sizeClasses = 'w-7 h-7';
      break;
    case 'md':
      sizeClasses = 'w-10 h-10';
      break;
    case 'lg':
      sizeClasses = 'w-12 h-12';
      break;
    default:
      sizeClasses = 'w-10 h-10';
  }
  const radiusClasses = rounded ? 'rounded-full' : 'rounded-md';

  return (
    <span
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center p-[6px] aspect-square [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain',
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
