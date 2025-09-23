import { TooltipArrow } from '@radix-ui/react-tooltip';
import type React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type TooltipVariant = 'white' | 'purple';
type TooltipSide = 'top' | 'right' | 'bottom' | 'left';
type TooltipAlign = 'start' | 'center' | 'end';

interface TooltipProps {
  title: string;
  content: React.ReactNode;
  children: React.ReactNode;
  variant?: TooltipVariant;
  side?: TooltipSide;
  align?: TooltipAlign;
}

const variantStyles: Record<TooltipVariant, string> = {
  white: 'bg-white text-gray-800',
  purple: 'bg-purple-400 text-white'
};

const TooltipComponent: React.FC<TooltipProps> = ({
  title,
  content,
  children,
  variant = 'white',
  side = 'top',
  align = 'center'
}) => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} align={align} className={variantStyles[variant]}>
          <p
            className={cn(
              'font-semibold border-b-2 mb-3 text-base',
              variant === 'white' ? 'text-gray-800 border-primary-500' : 'text-white border-white'
            )}
          >
            {title}
          </p>
          {content}
          <TooltipArrow
            className={cn(
              '-translate-y-[2px] w-[1.5625rem] h-[0.875rem]',
              variant === 'white' ? 'fill-white' : 'fill-purple-400'
            )}
            style={{
              filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
            }}
          />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipComponent;
