import * as PopoverPrimitive from '@radix-ui/react-popover';
import type React from 'react';
import { forwardRef, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type PopoverVariant = 'white' | 'purple';
type PopoverSide = 'top' | 'right' | 'bottom' | 'left';
type PopoverAlign = 'start' | 'center' | 'end';

interface PopoverProps {
  title: string;
  content: React.ReactNode;
  children: React.ReactNode;
  variant?: PopoverVariant;
  side?: PopoverSide;
  align?: PopoverAlign;
  button?: string;
}

const variantStyles: Record<PopoverVariant, string> = {
  white: 'bg-white text-gray-800',
  purple: 'bg-[#8B39A0] text-white'
};

const TriggerWrapper = forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ children, className, ...triggerProps }, ref) => (
    <span ref={ref} {...triggerProps} className={cn('inline-flex', className)}>
      {children}
    </span>
  )
);

TriggerWrapper.displayName = 'PopoverTriggerWrapper';

const PopoverComponent: React.FC<PopoverProps> = ({
  title,
  content,
  children,
  variant = 'white',
  side = 'top',
  align = 'center',
  button
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <TriggerWrapper onClick={() => setOpen(true)}>{children}</TriggerWrapper>
      </PopoverTrigger>
      <PopoverContent align={align} side={side} className={variantStyles[variant]}>
        <p
          className={cn(
            'font-semibold border-b-2 mb-3 text-base',
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
              onClick={() => setOpen(false)}
            >
              {button}
            </button>
          </div>
        )}

        <PopoverPrimitive.Arrow
          className={cn(
            '-translate-y-[2px] w-[1.5625rem] h-[0.875rem]',
            variant === 'white' ? 'fill-white' : 'fill-[#8B39A0]'
          )}
        />
      </PopoverContent>
    </Popover>
  );
};

export default PopoverComponent;
