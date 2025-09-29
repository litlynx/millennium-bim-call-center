import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import * as React from 'react';

import { cn } from '@/lib/utils';

type ScrollAreaRootProps = React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>;
type ScrollBarComponentProps = React.ComponentPropsWithoutRef<
  typeof ScrollAreaPrimitive.ScrollAreaScrollbar
>;
type ScrollBarWithoutOrientation = Omit<ScrollBarComponentProps, 'orientation'>;

interface ExtendedScrollAreaProps extends ScrollAreaRootProps {
  viewportClassName?: string;
  showScrollX?: boolean;
  showScrollY?: boolean;
  verticalScrollBarProps?: ScrollBarWithoutOrientation;
  horizontalScrollBarProps?: ScrollBarWithoutOrientation;
}

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  ExtendedScrollAreaProps
>(({
  className,
  style,
  children,
  viewportClassName,
  showScrollX = true,
  showScrollY = true,
  verticalScrollBarProps,
  horizontalScrollBarProps,
  ...props
}, ref) => {
  const mergedVerticalProps: ScrollBarWithoutOrientation = {
    forceMount: true,
    ...verticalScrollBarProps
  };

  const mergedHorizontalProps: ScrollBarWithoutOrientation = {
    forceMount: true,
    ...horizontalScrollBarProps
  };

  return (
    <ScrollAreaPrimitive.Root
      ref={ref}
      className={cn('relative overflow-hidden', className)}
      style={style}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        className={cn('h-full w-full rounded-[inherit]', viewportClassName)}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      {showScrollY && <ScrollBar orientation="vertical" {...mergedVerticalProps} />}
      {showScrollX && <ScrollBar orientation="horizontal" {...mergedHorizontalProps} />}
      {showScrollX && showScrollY && <ScrollAreaPrimitive.Corner />}
    </ScrollAreaPrimitive.Root>
  );
});

ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = 'vertical', ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      'flex touch-none select-none transition-colors bg-gray-100',
      orientation === 'vertical' &&
        'h-full w-2 hover:w-2 focus-visible:w-2 data-[state=active]:w-2 border-l border-l-transparent p-[1px]',
      orientation === 'horizontal' &&
        'h-2 hover:h-2 focus-visible:h-2 data-[state=active]:h-2 flex-col border-t border-t-transparent p-[1px]',
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-primary" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
