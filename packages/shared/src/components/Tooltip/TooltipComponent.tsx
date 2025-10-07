import { TooltipArrow } from '@radix-ui/react-tooltip';
import type React from 'react';
import { forwardRef } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type TooltipVariant = 'white' | 'purple' | 'dark';
type TooltipSide = 'top' | 'right' | 'bottom' | 'left';
type TooltipAlign = 'start' | 'center' | 'end';

interface TooltipProps {
  title?: string;
  content: React.ReactNode;
  children: React.ReactNode;
  variant?: TooltipVariant;
  side?: TooltipSide;
  align?: TooltipAlign;
  button?: string;
  simple?: boolean;
}

const variantStyles: Record<TooltipVariant, string> = {
  white: 'bg-white text-gray-800',
  purple: 'bg-[#8B39A0] text-white',
  dark: 'bg-gray-700 text-gray-100'
};

const TriggerWrapper = forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ children, className, ...triggerProps }, ref) => (
    <span ref={ref} {...triggerProps} className={cn('inline-flex', className)}>
      {children}
    </span>
  )
);

TriggerWrapper.displayName = 'TooltipTriggerWrapper';

const TooltipComponent: React.FC<TooltipProps> = ({
  title,
  content,
  children,
  variant = 'white',
  side = 'top',
  align = 'center',
  button,
  simple
}) => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <TriggerWrapper>{children}</TriggerWrapper>
        </TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          className={cn(variantStyles[variant], simple ? 'p-0 px-2 rounded-lg' : '')}
        >
          <p
            className={cn(
              'font-semibold text-base',
              simple === true ? '' : 'border-b-2 mb-3',
              variant === 'white' ? 'text-gray-800 border-primary-500' : 'text-white border-white'
            )}
          >
            {title}
          </p>
          {content}

          {button && (
            <div className="flex justify-end mt-4">
              <button
                type="button"
                className="bg-white text-[#8B39A0] font-semibold text-sm rounded-full px-3 py-1 small"
              >
                {button}
              </button>
            </div>
          )}

          {!simple && (
            <TooltipArrow
              className={cn(
                '-translate-y-[2px] w-[1.5625rem] h-[0.875rem]',
                variant === 'white' ? 'fill-white' : 'fill-[#8B39A0]'
              )}
            />
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipComponent;
