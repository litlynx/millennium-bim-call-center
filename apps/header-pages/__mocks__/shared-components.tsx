/** biome-ignore-all lint/correctness/useUniqueElementIds: is is being used statically */

import type React from 'react';

export const Card: React.FC<{
  title?: React.ReactNode;
  onTitleClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}> = ({ title, onTitleClick, icon, className, children }) => (
  <div data-testid="card" className={className}>
    <div className="flex flex-col space-y-1.5 pb-5">
      <div className="tracking-tight flex items-center gap-2 text-xl font-bold">
        {icon}
        {/* Render title as a button so tests can click */}
        {title && (
          <button type="button" onClick={onTitleClick}>
            <h4>{title}</h4>
          </button>
        )}
      </div>
    </div>
    <div
      id="card-content"
      className="has-[#scroll-bar]:pr-[0.5625rem] flex-1 min-h-0 overflow-auto flex flex-col gap-4"
    >
      {children}
    </div>
  </div>
);

export const Icon: React.FC<React.HTMLAttributes<HTMLSpanElement> & { type?: string }> = ({
  type,
  ...props
}) => <span data-testid="icon" {...props} />;

export const CardItemLabel: React.FC<{ title: string; text: string }> = ({ title, text }) => (
  <div data-testid="card-item" className="text-gray-800">
    <span className="text-xs opacity-55 font-semibold">{title}</span>
    <p className="uppercase font-semibold">{text}</p>
  </div>
);

export default { Card, Icon, CardItemLabel };
